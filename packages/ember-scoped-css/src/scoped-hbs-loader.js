const path = require('path');
const getPostfix = require('./getPostfix');
const getClassesTagsFromCss = require('./getClassesTagsFromCss');
const rewriteHbs = require('./rewriteHbs');
const { existsSync, readFileSync } = require('fs');

module.exports = function (source) {
  // get path of the template and replace it with the path of the css file
  const cssPath = this.resourcePath.replace('.hbs', '.css');

  // if css file does not exist, return the original template
  if (!existsSync(cssPath)) {
    return source;
  }

  this.addDependency(cssPath);

  // read the css file
  const css = readFileSync(cssPath, 'utf-8');
  const { classes, tags } = getClassesTagsFromCss(css);

  // generate unique postfix
  const fileName = path.basename(cssPath);
  const postfix = getPostfix(fileName);

  // rewrite the template
  const transformedHbs = rewriteHbs(source, classes, tags, postfix);

  return '<!-- Processed by layer-loader -->\n' + transformedHbs;
};
