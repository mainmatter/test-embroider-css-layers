const scopedHbsLoader = require('./src/scoped-hbs-loader');
const ScopedComponents = require('./src/scoped-components');
const rollupScopedComponents = require('./src/rollup-scoped-components');
const cssColocationPlugin = require('./src/css-colocation-plugin');
const rollupCssColocation = require('./src/rollup-css-colocation');
const rollupCssScoping = require('./src/rollup-css-scoping');

module.exports = {
  scopedHbsLoader,
  ScopedComponents,
  rollupScopedComponents,
  cssColocationPlugin,
  rollupCssColocation,
  rollupCssScoping,
};
