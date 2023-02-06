const path = require('path');
const { readFileSync, existsSync } = require('fs');
const getPostfix = require('./getPostfix');
const rewriteCss = require('./rewriteCss');
const replaceHbsInJs = require('./replaceHbsInJs');
const getClassesTagsFromCss = require('./getClassesTagsFromCss');
const rewriteHbs = require('./rewriteHbs');

module.exports = function rollupCssColocation(options = {}) {
  const colocatedComponents = [];
  const addonDir = options.addonDir;

  return {
    name: 'rollup-css-plugin',

    async resolveId(importee, importer) {
      if (!importee.endsWith('.css')) {
        return;
      }

      const cssRelativePath = importee.replace('./', '').replace('.css', '.js');
      if (importer.endsWith(cssRelativePath)) {
        return {
          id: importee.replace('./', ''),
          external: true,
          meta: {
            css: { originalId: importer },
          },
        };
      }
    },

    generateBundle(options, bundle) {
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
        bundle[asset].source = rewrittenCss;
      }
    },
  };
};
