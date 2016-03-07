function A4html( element, options )
{
    "use strict";

    var self            = this;
    this.start          = new Date();

    this.options = extendObject({
        orientation     : 'P',      // string : P, L
        unit            : 'pt',     // string : pt, px
        lineHeight      : 15,       // integer or float
        marge           : 36,       // integer or float
        margeTop        : null,     // null or integer or float
        margeRight      : null,     // null or integer or float
        margeBottom     : null,     // null or integer or float
        margeLeft       : null,     // null or integer or float
        ppi             : 'auto',   // string or integer or float
        onBeforeLoad    : null,     // null or function
        onLoad          : null,     // null or function
        onLoaded        : null      // null or function
    }, options || {a:null});

    const sizes         = [595.28, 841.89];
    const protoID       = 'document-prototype';

    this.ppi            = getPPI();
    this.ratio          = getRatio();
    this.sizes          = [ round2( sizes[0] * self.ratio ), round2( sizes[1] * self.ratio ) ];
    this.pages          = 0;

    this.document       = document.getElementById( element );
    this.header         = self.document.getElementsByTagName('HEADER')[0];
    this.footer         = self.document.getElementsByTagName('FOOTER')[0];
    this.content        = self.document.getElementsByTagName('MAIN')[0];
    
    this.lineHeight     = self.options.lineHeight;
    this.maxLinesPerDoc = 0;
    this.margeTop       = self.options.margeTop    === null ? self.options.marge : self.options.margeTop;
    this.margeRight     = self.options.margeRight  === null ? self.options.marge : self.options.margeRight;
    this.margeBottom    = self.options.margeBottom === null ? self.options.marge : self.options.margeBottom;
    this.margeLeft      = self.options.margeLeft   === null ? self.options.marge : self.options.margeLeft;
    
    switch( self.options.orientation )
    {
        default:    this.orientation = 'portrait'; break;
        case 'L':   this.orientation = 'landscape'; break;
    }
    
    switch( self.options.unit )
    {
        default:    this.unit = 'pt'; break;
        case 'px':  this.unit = 'px'; break;
    }
    //self.unit = self.options.unit;
    
    if (self.unit === 'pt')
    {
        self.lineHeight     = round2(self.lineHeight * self.ratio);
        self.margeTop       = round2(self.margeTop * self.ratio);
        self.margeRight     = round2(self.margeRight * self.ratio);
        self.margeBottom    = round2(self.margeBottom * self.ratio);
        self.margeLeft      = round2(self.margeLeft * self.ratio);
    }
    
    
    //console.log( self.lineHeight, self.options );
    
    self.document.removeChild( self.header );
    self.document.removeChild( self.footer );
    self.document.removeChild( self.content );

    if (typeof self.options.onBeforeLoad === 'function')
        (self.options.onBeforeLoad)(self);
    
    new function init()
    {
        if (typeof self.options.onLoad === 'function')
            (self.options.onLoad)(self);
        
        var doc = setDocument( 0, 0, true );
        var prototype   = document.getElementById( protoID );
            self.document.removeChild(prototype);
    };

    // Create pages
    for (var i=1; i<=self.pages; i++) 
        setDocument( i, self.pages, false );

    this.end    = new Date();
    this.time   = this.end - this.start;
    
    if (typeof self.options.onLoaded === 'function')
        (self.options.onLoaded)(self);

    // --

    function setDocument ( pageNum, pageTotal, isPrototype )
    {
        var sheet = setSheet( isPrototype ? protoID : null );
        
        // Get inner sizes
        var DocInnerHeight      = parseFloat(sheet.style.height)
                                - (self.margeTop + self.margeBottom);
        var DocInnerWidth       = parseFloat(sheet.style.width)
                                - (self.margeRight + self.margeLeft);
        
        // Create Header
        var header = setHeader( DocInnerWidth );
        
        // Create footer
        var footer = setFooter( DocInnerWidth );
        
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
            body.className                  = 'document-body';
            body.style.position             = 'absolute';
            body.style.width                = toPx( DocInnerWidth );
            body.style.overflow             = 'hidden';
        
        
        var bodyContent = document.createElement("div");
            bodyContent.innerHTML           = self.content.innerHTML;
            bodyContent.style.position      = 'absolute';
            bodyContent.style.width         = toPx( DocInnerWidth );
            bodyContent.style.left          = toPx( 0 );
            bodyContent.style.lineHeight    = toPx( self.lineHeight );
            body.appendChild(bodyContent);
        
        // Set elecment
        sheet.appendChild(header);
        sheet.appendChild(footer);
        sheet.appendChild(body);
        
        var HeaderHeight        = getOuterHeight(header);
        var FooterHeight        = getOuterHeight(footer);
        
        // Set header Position
        header.style.left       = toPx( self.margeLeft );
        header.style.top        = toPx( self.margeTop );
        
        // Set Footer Position
        footer.style.left       = toPx( self.margeLeft );
        footer.style.top        = toPx( ((self.orientation == 'landscape')
                                ? self.sizes[0]
                                : self.sizes[1])
                                - self.margeRight - FooterHeight );
        
        // Set Body position
        body.style.left         = toPx( self.margeLeft );
        body.style.top          = toPx( self.margeTop + HeaderHeight );
        body.style.height       = toPx( DocInnerHeight - HeaderHeight - FooterHeight );
        
        if (self.maxLinesPerDoc == 0)
        {
            self.maxLinesPerDoc = countLines( body );
            //alert( self.maxLinesPerDoc );
        }
        
        // Set body content position
        var offset              = (pageNum-1) * getOuterHeight(body);
        bodyContent.style.top   = toPx( isPrototype
                                ? '0'
                                : '-'.concat(offset) );
        
        if (isPrototype)
        {
            self.pages = Math.ceil( getOuterHeight(bodyContent) / getOuterHeight(body) );
        }
    }

    function setSheet(id) {
        var sheet = document.createElement("div");
            id != null ? sheet.setAttribute('id', id) : null;
            sheet.style.backgroundColor = '#ffffff';
            sheet.style.position        = 'relative';
            sheet.style.width           = toPx( self.sizes[0] );
            sheet.style.height          = toPx( self.sizes[1] );
            sheet.style.padding         = toPx( 0 );
        
        if ( self.orientation == 'landscape' )
        {
            sheet.style.width           = toPx( self.sizes[1] );
            sheet.style.height          = toPx( self.sizes[0] );
        }
        
        self.document.appendChild(sheet);
        
        return sheet;
    }
    
    function setHeader( width ) {
        var header = document.createElement("div");
            header.className            = 'document-header';
            header.innerHTML            = self.header.innerHTML;
            header.style.position       = 'absolute';
            header.style.width          = toPx( width );
        return header;
    }
    
    function setFooter( width ) {
        var footer = document.createElement("div");
            footer.className            = 'document-footer';
            footer.innerHTML            = self.footer.innerHTML;
            footer.style.position       = 'absolute';
            footer.style.width          = toPx( width );
        return footer;
    }

    function countLines( a )
    {
        return a.offsetHeight / self.lineHeight;
    }

    function extendObject ( a, b )
    {
        for( var p in b )
        {
            try {
                if ( b[p].constructor==Object )
                    a[p] = merge(a[p], b[p]);
                else a[p] = b[p];
            } catch(e) {
                a[p] = b[p];
            }
        }
        return a;
    }

    function getOuterHeight ( a )
    {
        return  a.offsetHeight +
                parseFloat(getStyle(a, 'margin-top')) +
                parseFloat(getStyle(a, 'margin-bottom'));
    }

    function getPPI ()
    {
        if (self.options.ppi === 'auto') {
            var div = document.createElement("div");
                div.style.width="1in";
            var body = document.getElementsByTagName("body")[0];
                body.appendChild(div);
            var ppi = document.defaultView.getComputedStyle(div, null).getPropertyValue('width');
                body.removeChild(div);
            return parseFloat(ppi);
        } else {
            return parseFloat(self.options.ppi);
        }
    }

    function getRatio ()
    {
        // less than 96 PPI, Normaly 72 PPI
        if (self.ppi < 96) return 1;
        
        // Less than 150 PPI, Normaly 96 PPI
        else if (self.ppi < 150) return 1.333322134121758;
        
        // Less than 300 PPI, Normaly 150 PPI
        else if (self.ppi < 300) return 2.083322134121758;
        
        // More or equal to 300 PPI
        else return 4.166627469426152;
    }

    function getStyle (e, styleName)
    {
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

    function round2 ( a )
    {
        return Math.round( a * 100) / 100;
    }
    
    function toPx ( a ) {
        return a.toString().concat('px');
    }
}

(function(){
    "use strict";
    $.fn.A4html = function( options ) { new A4html( $(this).attr('id'), options ); };
})();