const getClassesTagsFromCss = require('./getClassesTagsFromCss');
const replaceHbsInJs = require('./replaceHbsInJs');
const rewriteHbs = require('./rewriteHbs');
const path = require('path');
const getPostfix = require('./getPostfix');
const { readFileSync, existsSync } = require('fs');

module.exports = function (addonDir, rollupEmberTemplateImports) {
  const load = rollupEmberTemplateImports.load;

  rollupEmberTemplateImports.load = async function (id) {
    let source = await load.bind(this)(id);
    if (source) {
      // if source contains "<style>" and "</style>", it is a gjs file with embedded css
      // cut it out and emmit it as a separate css file
      const cssPathOnDisk = id.replace('.js', '.css');
      let relativeCssPath = id
        .replace(addonDir + '/src/', '')
        .replace('.js', '.css');

      let originalCss;
      if (source.includes('<style>') && source.includes('</style>')) {
        originalCss = source.match(/<style>([\s\S]*)<\/style>/)[1];
        this.emitFile({
          type: 'asset',
          fileName: relativeCssPath,
          source: originalCss,
        });

        // remove the css from the gjs file
        source = source.replace(/<style>([\s\S]*)<\/style>/, '');
      }

      const cssOnDiskExists = existsSync(cssPathOnDisk);
      if (originalCss || cssOnDiskExists) {
        const css = originalCss || readFileSync(cssPathOnDisk, 'utf-8');
        const { classes, tags } = getClassesTagsFromCss(css);
        const cssFileName = path.basename(relativeCssPath);
        const postfix = getPostfix(cssFileName);

        const rewrittenHbsJs = replaceHbsInJs(
          '__GLIMMER_TEMPLATE',
          source,
          (hbs) => {
            if (cssOnDiskExists) {
              this.addWatchFile(cssPathOnDisk);
            }
            return rewriteHbs(hbs, classes, tags, postfix);
          }
        );

        const transformed = `import './${cssFileName}';\n${rewrittenHbsJs}`;
        return transformed;
      } else {
        return source;
      }
    }
  };

  return rollupEmberTemplateImports;
};
