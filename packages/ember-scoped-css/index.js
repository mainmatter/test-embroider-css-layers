const scopedHbsLoader = require('./src/scoped-hbs-loader');
const scopedCssLoader = require('./src/scoped-css-loader');
const scopedJsLoader = require('./src/scoped-js-loader');

const rollupHbsPlugin = require('./src/rollup-hbs-plugin');
const rollupCssPlugin = require('./src/rollup-css-plugin');
const rollupJsPlugin = require('./src/rollup-js-plugin');

module.exports = {
  scopedHbsLoader,
  scopedCssLoader,
  scopedJsLoader,
  rollupHbsPlugin,
  rollupCssPlugin,
  rollupJsPlugin,
};
