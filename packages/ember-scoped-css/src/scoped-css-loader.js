const { existsSync } = require('fs');
const { basename } = require('path');
const getPostfix = require('./getPostfix');
const rewriteCss = require('./rewriteCss');

module.exports = function (source) {
  const cssPath = this.resourcePath;
  const hbsPath = cssPath.replace('.css', '.hbs');
  const gjsPath = cssPath.replace('.css', '.js');
  // check if the css file exists
  const hbsExists = existsSync(hbsPath);
  const gjsExists = existsSync(gjsPath);
  if (hbsExists || gjsExists) {
    const cssFileName = basename(cssPath);
    const postfix = getPostfix(cssFileName);
    const rewrittenCss = rewriteCss(source, postfix, cssFileName);
    return rewrittenCss;
  } else {
    return source;
  }
};
