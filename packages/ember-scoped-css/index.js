const scopedHbsLoader = require('./src/scoped-hbs-loader');
const scopedCssLoader = require('./src/scoped-css-loader');
const scopedJsLoader = require('./src/scoped-js-loader');
const rollupCssColocation = require('./src/rollup-css-colocation');
const rollupCssPlugin = require('./src/rollup-css-plugin');

module.exports = {
  scopedHbsLoader,
  scopedCssLoader,
  scopedJsLoader,
  rollupCssColocation,
  rollupCssPlugin,
};
