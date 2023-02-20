const scopedHbsLoader = require('./src/scoped-hbs-loader');
const scopedCssLoader = require('./src/scoped-css-loader');
const scopedJsLoader = require('./src/scoped-js-loader');

const rollupHbsPlugin = require('./src/rollup-hbs-plugin');
const rollupCssPlugin = require('./src/rollup-css-plugin');
const rollupJsPlugin = require('./src/rollup-js-plugin');
const rollupGjsPlugin = require('./src/rollup-gjs-plugin');
const scopedWebpackPlugin = require('./src/scoped-webpack-plugin');
const scopedRollupPlugin = require('./src/scoped-rollup-plugin');
const appJsUnplugin = require('./src/app-js-unplugin');
const appCssUnplugin = require('./src/app-css-unplugin');
const addonExtractcssUnplugin = require('./src/addon-extractcss-unplugin');

module.exports = {
  scopedHbsLoader,
  scopedCssLoader,
  scopedJsLoader,
  rollupHbsPlugin,
  rollupCssPlugin,
  rollupJsPlugin,
  rollupGjsPlugin,
  scopedWebpackPlugin,
  scopedRollupPlugin,
  appJsUnplugin,
  appCssUnplugin,
  addonExtractcssUnplugin,
};
