# A4-HTML #

## Installation ##

```html
<script src="A4-html.js"></script>
```

## Code exemple ##
##### The HTML part. #####

```html
<div id="myA4Document">
  <header>
    Header content...
  </header>
  <main>
    Document main content...<br />
    Line 2<br />
    Line 3<br />
    ...
  </main>
  <footer>
    Footer content...
  </footer>
</div>
```

##### The JavaScript part. #####

```javascript
  // Basic Call without options
  A4html("myA4Document");
  
  // Basic Call with options
  A4html("myA4Document", { /*... options ...*/ });
```

if you prefere jQuery
```javascript
  // jQuery Call without options
  $("#myA4Document").A4html();
  
  // jQuery Call with options
  $("#myA4Document").A4html({ /*... options ...*/ });
```

## Options ##
* **orientation**: *String, Default : P* - Define the orientation of the document. **P** (portrait) or **L** (landscape)
* **unit**: *String, Default : pt* - Define the unit of the document. **pt** (point), **mm** (millimeter) or **px** (pixel) 
***Note***: just **pt** work at this moment.
* **marge**: *Integer, Default : 36* - Define the document margin size in **unit**

```javascript
{
  orientation : 'P',
  unit: 'pt',
  marge: 36
}
```
