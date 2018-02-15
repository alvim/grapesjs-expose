# GrapesJS Expose

This plugin adds the possibility to expose data on a global variable.

## Sumary

* Plugin name: `gjs-plugin-expose`

## Options

* `target` Property of `window` that will receive the data. Default: `xGrapes`

## Download

* `npm i grapesjs-plugin-export`

## Usage

```
<link rel="stylesheet" href="path/to/grapes.min.css">
<script src="path/to/grapes.min.js"></script>
<script src="path/to/grapesjs-plugin-expose.min.js"></script>

<div id="gjs"></div>
<script type="text/javascript">
  var editor = grapesjs.init({
      container : '#gjs',
      plugins: ['gjs-plugin-expose'],
      pluginsOpts: {
        'gjs-plugin-expose': {
          target: 'YOUR_CUSTOM_PROPERTY' // Default: "xGrapes"
        }
      }
  });
</script>
```

## License

MIT