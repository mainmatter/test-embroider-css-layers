const path = require('path');
const getPostfix = require('./getPostfix');
const rewriteCss = require('./rewriteCss');

module.exports = function () {
  return {
    name: 'scoped-rollup-plugin',
    generateBundle(options, bundle) {
      let scopedCss = '';
      for (let asset in bundle) {
        if (!asset.endsWith('css') || !bundle[asset.replace('css', 'js')]) {
          continue;
        }

        const cssFileName = path.basename(asset);
        const postfix = getPostfix(cssFileName);
        const rewrittenCss = rewriteCss(
          bundle[asset].source,
          postfix,
          cssFileName
        );
        scopedCss += rewrittenCss + '\n\n';
        delete bundle[asset];
      }
      bundle['assets/scoped.css'] = {
        fileName: 'scoped.css',
        isAsset: true,
        source: scopedCss,
      };
    },
  };
};
