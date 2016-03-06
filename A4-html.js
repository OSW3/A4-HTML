
function A4html( element, options ) {
    "use strict";
    
    options = extendObject({
        orientation : 'P',
        unit: 'pt',
        marge: 36
    }, options);
    
    var container       = document.getElementById( element ),
        HEADER          = container.getElementsByTagName('HEADER')[0],
        FOOTER          = container.getElementsByTagName('FOOTER')[0],
        MAIN            = container.getElementsByTagName('MAIN')[0],
        DocInnerHeight,
        DocInnerWidth,
        DocPaddingTop,
        DocPaddingRight,
        DocPaddingBottom,
        DocPaddingLeft,
        HeaderHeight,
        FooterHeight;
    
    HEADER.style.display = "none";
    FOOTER.style.display = "none";
    MAIN.style.display = "none";
    
    const sizes = {
        pt  : [595.28, 841.89],
        px  : {
            72  : [595.28, 841.89],
            96  : [793.7, 1122.52],
            150 : [1240.16, 1753.94],
            300 : [2480.31, 3507.87]   
        }
    };

    //const ppi = getPPI();
    
    var orientation; switch( options.orientation )
    {
        default:    orientation = 'portrait'; break;
        case 'L':   orientation = 'landscape'; break;
    }
    
    var unit; switch( options.unit )
    {
        default:    unit = 'pt'; break;
        case 'px':  unit = 'px'; break;
    }


    // -- 


    /*function getPPI()
    {
        var div = document.createElement("div");
            div.style.width="1in";
        var body = document.getElementsByTagName("body")[0];
            body.appendChild(div);
        var ppi = document.defaultView.getComputedStyle(div, null).getPropertyValue('width');
            body.removeChild(div);
        return parseFloat(ppi);
    }*/

    function extendObject( a, b ) { for( var p in b ) try { if( b[p].constructor==Object ) a[p] = merge(a[p], b[p]); else a[p] = b[p]; } catch(e) { a[p] = b[p]; } return a; }
    function outerHeight( a ) { return  a.offsetHeight + parseFloat(getStyle(a, 'margin-top')) + parseFloat(getStyle(a, 'margin-bottom')); }
    function pxToPt( a ) { return a * 0.75; }
    function ptToPx( a ) { return a * 1.3333333333333; }
    
    
    var getStyle = function (e, styleName) {
        var styleValue = "";
        if(document.defaultView && document.defaultView.getComputedStyle) {
            styleValue = document.defaultView.getComputedStyle(e, "").getPropertyValue(styleName);
        }
        else if(e.currentStyle) {
            styleName = styleName.replace(/\-(\w)/g, function (strMatch, p1) {
                return p1.toUpperCase();
            });
            styleValue = e.currentStyle[styleName];
        }
        return styleValue;
    }

    // -- 
    
    
    function setSheet(id) {
        var sheet = document.createElement("div");
            id != null ? sheet.setAttribute('id', id) : null;
            sheet.style.backgroundColor = '#ffffff';
            sheet.style.position        = 'relative';
            sheet.style.width           = sizes[unit][0].toString().concat(unit);
            sheet.style.height          = sizes[unit][1].toString().concat(unit);
            sheet.style.padding         = options.marge.toString().concat(unit);
        
        if (orientation == 'landscape')
        {
            sheet.style.width           = sizes[unit][1].toString().concat(unit);
            sheet.style.height          = sizes[unit][0].toString().concat(unit);
        }
        
        container.appendChild(sheet);
        
        return sheet;
    }
    
    function setHeader(DocInnerWidth) {
        var header = document.createElement("div");
            header.className            = 'document-header';
            header.innerHTML            = HEADER.innerHTML;
            header.style.position       = 'absolute';
            header.style.width          = DocInnerWidth.toString().concat(unit);
        return header;
    }
    
    function setFooter(DocInnerWidth) {
        var footer = document.createElement("div");
            footer.className            = 'document-footer';
            footer.innerHTML            = FOOTER.innerHTML;
            footer.style.position       = 'absolute';
            footer.style.width          = DocInnerWidth.toString().concat(unit);
        return footer;
    }

    function setPage( pageNum, pageTotal, isPrototype ) {
        
        var sheet = setSheet( isPrototype ? 'document-prototype' : null );
        
        // get Padding
        DocPaddingTop = parseFloat(sheet.style.paddingTop);
        DocPaddingBottom = parseFloat(sheet.style.paddingBottom);
        DocPaddingLeft = parseFloat(sheet.style.paddingLeft);
        DocPaddingRight = parseFloat(sheet.style.paddingRight);
        
        // Get inner sizes
        DocInnerHeight = parseFloat(sheet.style.height) - (DocPaddingTop + DocPaddingBottom);
        DocInnerWidth = parseFloat(sheet.style.width) - (DocPaddingTop + DocPaddingBottom);
        
        // Create Header
        var header = setHeader(DocInnerWidth);
        
        // Create footer
        var footer = setFooter(DocInnerWidth);
        
        if (!isPrototype) {
            var pageNumContainer = document.createElement("div");
                pageNumContainer.innerHTML = pageNum+'/'+pageTotal;
                pageNumContainer.style.position     = 'absolute';
                pageNumContainer.style.textAlign    = 'right';
                pageNumContainer.style.fontSize     = '8.5pt';
                pageNumContainer.style.right        = '0';
                pageNumContainer.style.bottom       = '0';
                pageNumContainer.style.width        = '80px';
            footer.appendChild(pageNumContainer);
        }
        
        // Create Body
        var body = document.createElement("div");
            body.className              = 'document-body';
            body.style.position         = 'absolute';
            body.style.width            = DocInnerWidth.toString().concat(unit);
            body.style.overflow         = 'hidden';
        
        
        var bodyContent = document.createElement("div");
            bodyContent.innerHTML       = MAIN.innerHTML;
            bodyContent.style.position  = 'absolute';
            bodyContent.style.width     = DocInnerWidth.toString().concat(unit);
            bodyContent.style.left      = '0'.toString().concat(unit);
            body.appendChild(bodyContent);
        
        
        // Set elecment
        sheet.appendChild(header);
        sheet.appendChild(footer);
        sheet.appendChild(body);
        
        HeaderHeight = pxToPt(outerHeight(header));
        FooterHeight = pxToPt(outerHeight(footer));
        
        // Set header Position
        header.style.left       = DocPaddingLeft.toString().concat(unit);
        header.style.top        = DocPaddingTop.toString().concat(unit);
        
        // Set Footer Position
        footer.style.left       = DocPaddingLeft.toString().concat(unit);
        footer.style.top        = (((orientation == 'landscape')
                                ? sizes[unit][0]
                                : sizes[unit][1])
                                - DocPaddingBottom - FooterHeight)
                                .toString().concat(unit);
        
        // Set Body position
        body.style.left         = DocPaddingLeft.toString().concat(unit);
        body.style.top          = (DocPaddingTop + HeaderHeight).toString().concat(unit);
        body.style.height       = (DocInnerHeight - HeaderHeight - FooterHeight).toString().concat(unit);
        
        // Set body content position
        var offset = pxToPt((pageNum-1) * outerHeight(body));
        bodyContent.style.top               = (isPrototype
                                            ? '0'
                                            : '-'.concat(offset)).toString().concat(unit);
        
        return {
            pages: isPrototype ? Math.ceil(outerHeight(bodyContent) / outerHeight(body)) : 0
        };
        
    }
    
    function setPrototype() {
        
        var Doc = setPage(0,0,true);
        var prototype = document.getElementById('document-prototype');
        
        container.removeChild(prototype);

        return {
            pages: Doc.pages
        }
    }
    
    // create prototype
    var prototype = setPrototype();
    
    // Create pages
    for (var i=1; i<=prototype.pages; i++) setPage( i, prototype.pages, false );
    
}

(function(){
    "use strict";
    $.fn.A4html = function( options ) { A4html( $(this).attr('id'), options ); };
})();