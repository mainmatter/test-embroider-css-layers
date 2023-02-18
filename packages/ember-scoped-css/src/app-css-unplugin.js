const { createUnplugin } = require('unplugin');
const { basename } = require('path');
const { existsSync } = require('fs');
const getPostfix = require('./getPostfix');
const rewriteCss = require('./rewriteCss');

module.exports = createUnplugin((options) => {
  return {
    enforce: 'pre',
    name: 'app-css-unplugin',

    transformInclude(id) {
      return id.endsWith('.css');
    },

    transform(code, cssPath) {
      const hbsPath = cssPath.replace('.css', '.hbs');
      const gjsPath = cssPath.replace('.css', '.js');
      const hbsExists = existsSync(hbsPath);
      const gjsExists = existsSync(gjsPath);
      if (hbsExists || gjsExists) {
        const cssFileName = basename(cssPath);
        const postfix = getPostfix(cssFileName);
        const rewrittenCss = rewriteCss(code, postfix, cssFileName);
        return rewrittenCss;
      } else {
        return code;
      }
    },
  };
});
