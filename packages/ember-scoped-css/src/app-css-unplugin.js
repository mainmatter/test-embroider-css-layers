const { createUnplugin } = require('unplugin');
const { basename } = require('path');
const { existsSync } = require('fs');
const getPostfix = require('./getPostfix');
const rewriteCss = require('./rewriteCss');
const path = require('path');

module.exports = createUnplugin(({ appDir }) => {
  return {
    enforce: 'pre',
    name: 'app-css-unplugin',

    transformInclude(id) {
      return id.includes(path.basename(appDir)) && id.endsWith('.css');
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
