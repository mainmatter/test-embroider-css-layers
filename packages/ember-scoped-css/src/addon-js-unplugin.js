const { createUnplugin } = require('unplugin');
const recast = require('recast');
const { existsSync, readFileSync, writeFileSync } = require('fs');
const path = require('path');
const getClassesTagsFromCss = require('./getClassesTagsFromCss');
const getPostfix = require('./getPostfix');
const replaceHbsInJs = require('./replaceHbsInJs');
const rewriteHbs = require('./rewriteHbs');

module.exports = createUnplugin((options) => {
  return {
    name: 'addon-js-unplugin',

    transformInclude(id) {
      return id.endsWith('.js');
    },

    transform(code, jsPath) {
      const cssPath = jsPath.replace(/\.js$/, '.css');

      let css;
      if (!existsSync(cssPath)) {
        // it could check if there is emited css file (I don't know how to do it)
        const gjsPath = jsPath.replace(/\.js$/, '.gjs');
        if (!existsSync(gjsPath)) {
          return code;
        }
        const gjs = readFileSync(gjsPath, 'utf8');
        const styleRegex = /<style>([\s\S]*?)<\/style>/g;
        const styleMatch = styleRegex.exec(gjs);
        if (!styleMatch) {
          return code;
        }
        css = styleMatch[1];
      }

      // add css import
      const cssFileName = path.basename(cssPath);
      code = `import './${cssFileName}';\n\n${code}`;

      // rewrite hbs
      return replaceHbsInJs(code, (hbs) => {
        css = css || readFileSync(cssPath, 'utf8');
        const { classes, tags } = getClassesTagsFromCss(css);
        const postfix = getPostfix(cssFileName);
        const rewritten = rewriteHbs(hbs, classes, tags, postfix);
        return rewritten;
      });
    },
  };
});
