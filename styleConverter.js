(function () {
    "use strict";

    ol.style.StyleConverter = ol.style.StyleConverter || {};

     ol.style.StyleConverter.convertToOL4Style = function (ol2Style) {

         if (!ol2Style) {
             throw new Error("no Style defined");
         }

        var newStyle = ol.style.Style.defaultFunction()[0].clone();

        /* creates 4 element array with color and opacity */
        var calculateColor = function (color, opacity, originalColor) {
            var color_ = color || originalColor;
            var newColor;
            if (typeof color_ === 'string') {
                newColor = Mapbender.StyleUtil.parseCssColor(color_);
            } else {
                newColor = color_.slice();
            }
            return newColor;
        };

        var convertDashStyle = function (dashStyle) {
            switch (dashStyle) {
                case 'solid' :
                    return [];
                case 'dot'   :
                    return [1, 5];
                case 'dash'      :
                    return [10, 10];
                case 'longdash'      :
                    return [20, 20];
                case 'dashdot'      :
                    return [5, 10, 1];
                case 'longdashdot'      :
                    return [5, 20, 1];
            }
        };

        var getFontStyleString = function(style) {
           var fontFamily = style.fontFamily || "sans-serif";
           var fontSize = style.fontSize ? style.fontSize+"px" : "";
           var fontWeight = style.fontWeight || "";

           var str = [fontSize,fontWeight,fontFamily].join(" ");
           return str;
        };

        newStyle.getStroke().setColor(calculateColor(ol2Style.strokeColor, (ol2Style.stroke !== null) ?  ol2Style.strokeOpacity : 0, newStyle.getStroke().getColor()));
        newStyle.getStroke().setWidth(ol2Style.strokeWidth || newStyle.getStroke().getWidth());
        newStyle.getStroke().setLineCap(ol2Style.strokeLinecap || newStyle.getStroke().getLineCap());
        newStyle.getStroke().setLineDash(convertDashStyle(ol2Style.strokeDashstyle) || newStyle.getStroke().getLineDash());


        newStyle.getFill().setColor(calculateColor(ol2Style.fillColor, (ol2Style.fill !== null) ? ol2Style.fillOpacity : 0, newStyle.getFill().getColor()));

        if (ol2Style.label) {

            newStyle.setText(new ol.style.Text({
                text: ol2Style.label || newStyle.getText().getText(),
                font: getFontStyleString(ol2Style),
                overflow: true,
            }));

          newStyle.getText().getFill().setColor(calculateColor(ol2Style.fontColor, ol2Style.fontOpacity, newStyle.getText().getFill().getColor()));
        }

        newStyle.setZIndex(ol2Style.graphicZIndex || 0);


        var image = new ol.style.Circle({
            fill: newStyle.getFill().clone(),
            stroke: newStyle.getStroke().clone(),
            radius: ol2Style.pointRadius || newStyle.getImage().getRadius()
        });

        newStyle.setImage(image);

        Object.freeze(newStyle);
        Object.freeze(newStyle.getFill());
        Object.freeze(newStyle.getFill().getColor());
        Object.freeze(newStyle.getStroke());
        Object.freeze(newStyle.getStroke().getColor());
        Object.freeze(newStyle.getImage());
        Object.freeze(newStyle.getImage().getFill());
        Object.freeze(newStyle.getImage().getStroke());

        return newStyle;

    };

})();
