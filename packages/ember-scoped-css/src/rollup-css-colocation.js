const path = require('path');
const { readFileSync, existsSync } = require('fs');
const md5 = require('blueimp-md5');
const rewriteCss = require('./rewriteCss');
const replaceHbsInJs = require('./replaceHbsInJs');
const getClassesTagsFromCss = require('./getClassesTagsFromCss');
const rewriteHbs = require('./rewriteHbs');

module.exports = function rollupCssColocation(options = {}) {
  const colocatedComponents = [];

  return {
    name: 'add-css-import',

    transform(code, id) {
      if (id.endsWith('.hbs.js')) {
        const hbsPath = id.replace('.js', '');
        const hbsFileName = path.basename(hbsPath);

        if (colocatedComponents.some((c) => c.hbs === hbsFileName)) {
          // read the css file
          const cssFileName = hbsPath.replace('.hbs', '.css');
          const css = readFileSync(cssFileName, 'utf-8');
          const { classes, tags } = getClassesTagsFromCss(css);
          const postfix = md5(path.basename(cssFileName)).substring(0, 8);

          const rewrittenHbsJs = replaceHbsInJs(
            'precompileTemplate',
            code,
            (hbs) => {
              return rewriteHbs(hbs, classes, tags, postfix);
            }
          );

          return rewrittenHbsJs;
        }
      } else if (id.endsWith('js')) {
        const cssPath = id.replace('.js', '.css');
        // check if the css file exists
        const cssExists = existsSync(cssPath);
        if (cssExists) {
          const cssFileName = path.basename(cssPath);
          colocatedComponents.push({
            css: cssFileName,
            js: cssFileName.replace('.css', '.js'),
            hbs: cssFileName.replace('.css', '.hbs'),
          });

          // if colocated css file exists, import it
          const transformed = `import './${cssFileName}';\n${code}`;
          return transformed;
        }
      }
    },

    generateBundle(options, bundle) {
      for (let asset in bundle) {
        const fileName = path.basename(asset);

        // check if it is colocated css file
        if (colocatedComponents.some((c) => c.css === fileName)) {
          const postfix = md5(fileName).substring(0, 8);
          const rewrittenCss = rewriteCss(bundle[asset].source, postfix);
          bundle[asset].source =
            `/* ${fileName} */\n@layer components {\n\n` +
            rewrittenCss +
            '\n}\n';
        }
      }
    },
  };
};