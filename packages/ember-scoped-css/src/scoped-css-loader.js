const { existsSync } = require('fs');
const { basename } = require('path');
const md5 = require('blueimp-md5');
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
    const postfix = md5(cssFileName).substring(0, 8);
    const rewrittenCss = rewriteCss(source, postfix);
    const resultCss =
      `/* ${cssFileName} */\n@layer components {\n\n` + rewrittenCss + '\n}\n';
    return resultCss;
  } else {
    return source;
  }
};
