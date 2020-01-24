# gridsome-plugin-brotli

Gridsome plugin for preparing brotli-compressed versions of assets.

> Forked from [gatsby-plugin-brotli](https://github.com/ovhemert/gatsby-plugin-brotli)

```bash
/app.7b37c0a7.js # 246kb
```
becomes
```bash
/app.7b37c0a7.js.br # 67kb
```

## Requirements

This plugin will only generate the compressed files. To see them been served to the client, your Gridsome website should run on a production server that supports Brotli (`.br`) files. The Gridsome development server **does not** serve the compressed versions.

## Installation

With npm:

```bash
yarn add gridsome-plugin-brotli # or
npm install gridsome-plugin-brotli
```

## Usage

`gridsome.config.js`
```javascript
module.exports = {
  plugins: ['gridsome-plugin-brotli']
}
```

# Options

By default, only `.css` and `.js` files are compressed, but you can override this with the `extensions` option.

```javascript
module.exports = {
  plugins: [
    {
      use: 'gridsome-plugin-brotli',
      options: {
        extensions: ['css', 'html', 'js', 'svg', 'json']
      }
    }
  ]
}
```

You can even place all the brotli-compressed files (only the brotli ones, the uncompressed ones will
be saved in the `dist` directory as usual) in a dedicated directory (ex. `dist/brotli`):

```javascript
module.exports = {
  plugins: [
    {
      use: 'gridsome-plugin-brotli',
      options: {
        path: 'brotli'
      }
    }
  ]
}
```

## License

Licensed under [MIT](./LICENSE).

_NOTE: This plugin only generates output when run in `production` mode! To test, run: `gatsby build && gatsby serve`_
