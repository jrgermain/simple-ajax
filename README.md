# Simple Ajax
A super simple [Ajax](https://en.wikipedia.org/wiki/Ajax_%28programming%29) library written in modern JavaScript.

## Features
- Supports promise-based and callback-based workflows
- Uses JavaScript modules
- Uses JSDoc comments for documentation
- Takes advantage of ES6 features for cleaner code
- Auto-generates functions for different types of requests (e.g. `Ajax.getDocument`, `Ajax.putJSON`, `Ajax.delete`)
- Less than 1kb minified and gzipped

## How to use
### Including the library in your project
Download a copy of ajax.js and add a link in the head of your document.

```html
<head>
  <!-- The value of src will vary depending on where you decide to place your copy of ajax.js -->
  <script type="module" src="scripts/ajax.js"></script>
</head>
```

If you're using a build toolchain that bundles your JavaScript together (using something like Webpack), you might not need to link ajax.js in your document; the bundle should automatically include Simple Ajax if it's used in your project.

### Referencing the module in your JavaScript
The next step is to reference Simple Ajax in your project and start using it. You can do this with an import statement. Like above, the location you import from will vary depending on where you put the ajax.js file within your project.

```js
import Ajax from "./lib/ajax";
```

Once you've imported Ajax at the top of your file, you can reference it in your code.

```js
async function getForecast(postalCode, country) {
  const weatherInfo = await Ajax.getJSON(`/api/weather?postalcode=${postalCode}&country=${country}`);
  return weatherInfo.forecast;
}
```

### API reference
See the [wiki](https://github.com/jrgermain/simple-ajax/wiki) for information on exactly what Simple Ajax can do and how to do it.
