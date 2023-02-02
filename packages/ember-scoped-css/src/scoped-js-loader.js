const replaceHbsInJs = require('./replaceHbsInJs');
const getClassesTagsFromCss = require('./getClassesTagsFromCss');
const rewriteHbs = require('./rewriteHbs');
const md5 = require('blueimp-md5');
const path = require('path');
const { existsSync } = require('fs');

module.exports = function (source) {
  const id = this.resourcePath;
  const cssPath = id.replace('.js', '.css');
  // check if the css file exists
  const cssExists = existsSync(cssPath);
  if (cssExists) {
    const cssFileName = path.basename(cssPath);

    // if colocated css file exists, import it
    const transformed = `import './${cssFileName}';\n${source}`;
    return transformed;
  } else {
    return source;
  }
};
