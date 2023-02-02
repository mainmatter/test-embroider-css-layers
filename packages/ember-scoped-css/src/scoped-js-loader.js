const replaceHbsInJs = require('./replaceHbsInJs');
const getClassesTagsFromCss = require('./getClassesTagsFromCss');
const rewriteHbs = require('./rewriteHbs');
const md5 = require('blueimp-md5');
const path = require('path');
const { existsSync, readFileSync } = require('fs');

module.exports = function (source) {
  const id = this.resourcePath;
  const cssPath = id.replace('.js', '.css');
  // check if the css file exists
  const cssExists = existsSync(cssPath);
  if (cssExists) {
    const cssFileName = path.basename(cssPath);

    // try to rewrite template in gjs file
    const css = readFileSync(cssPath, 'utf-8');
    const { classes, tags } = getClassesTagsFromCss(css);
    const postfix = md5(path.basename(cssFileName)).substring(0, 8);

    const rewrittenHbsJs = replaceHbsInJs(
      '__GLIMMER_TEMPLATE',
      source,
      (hbs) => {
        this.addDependency(cssPath);
        return rewriteHbs(hbs, classes, tags, postfix);
      }
    );

    // if colocated css file exists, import it
    const transformed = `import './${cssFileName}';\n${rewrittenHbsJs}`;
    return transformed;
  } else {
    return source;
  }
};
