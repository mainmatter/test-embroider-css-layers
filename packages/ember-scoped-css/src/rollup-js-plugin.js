const path = require('path');
const { readFileSync, existsSync } = require('fs');
const getPostfix = require('./getPostfix');
const rewriteCss = require('./rewriteCss');
const replaceHbsInJs = require('./replaceHbsInJs');
const getClassesTagsFromCss = require('./getClassesTagsFromCss');
const rewriteHbs = require('./rewriteHbs');

module.exports = function rollupCssColocation(options = {}) {
  return {
    name: 'rollup-js-plugin',

    transform(code, id) {
      if (id.endsWith('.js')) {
        const cssPath = id.replace('.js', '.css');

        // check if the css file exists
        const cssExists = existsSync(cssPath);
        if (cssExists) {
          const cssFileName = path.basename(cssPath);

          // if colocated css file exists, import it
          const transformed = `import './${cssFileName}';\n${code}`;
          return transformed;
        }
      }
    },
  };
};
