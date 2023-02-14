const scopedHbsLoader = require('./src/scoped-hbs-loader');
const scopedCssLoader = require('./src/scoped-css-loader');
const scopedJsLoader = require('./src/scoped-js-loader');

const rollupHbsPlugin = require('./src/rollup-hbs-plugin');
const rollupCssPlugin = require('./src/rollup-css-plugin');
const rollupJsPlugin = require('./src/rollup-js-plugin');
const rollupGjsPlugin = require('./src/rollup-gjs-plugin');
const rollupEmberTemplateImportsPlugin = require('./src/rollup-ember-template-imports-plugin');
const scopedWebpackPlugin = require('./src/scoped-webpack-plugin');
const scopedRollupPlugin = require('./src/scoped-rollup-plugin');

module.exports = {
  scopedHbsLoader,
  scopedCssLoader,
  scopedJsLoader,
  rollupHbsPlugin,
  rollupCssPlugin,
  rollupJsPlugin,
  rollupGjsPlugin,
  rollupEmberTemplateImportsPlugin,
  scopedWebpackPlugin,
  scopedRollupPlugin,
};
