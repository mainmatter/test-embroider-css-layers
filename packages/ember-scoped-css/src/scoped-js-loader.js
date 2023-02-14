const replaceHbsInJs = require('./replaceHbsInJs');
const getClassesTagsFromCss = require('./getClassesTagsFromCss');
const rewriteHbs = require('./rewriteHbs');
const getPostfix = require('./getPostfix');
const path = require('path');
const { existsSync, readFileSync, writeFileSync } = require('fs');
const rewriteCss = require('./rewriteCss');

module.exports = function (source) {
  const id = this.resourcePath;
  const cssPath = id.replace('.js', '.css');

  // if source contains "<style>" and "</style>", it is a gjs file with embedded css
  // cut it out and emmit it as a separate css file
  let originalCss;
  if (source.includes('<style>') && source.includes('</style>')) {
    originalCss = source.match(/<style>([\s\S]*)<\/style>/)[1];
    writeFileSync(cssPath, originalCss);

    // remove the css from the gjs file
    source = source.replace(/<style>([\s\S]*)<\/style>/, '');
  }

  // check if the css file exists

  const cssOnDiskExists = existsSync(cssPath);
  if (originalCss || cssOnDiskExists) {
    // try to rewrite template in gjs file
    const css = originalCss || readFileSync(cssPath, 'utf-8');
    const { classes, tags } = getClassesTagsFromCss(css);
    const cssFileName = path.basename(cssPath);
    const postfix = getPostfix(cssFileName);

    const rewrittenHbsJs = replaceHbsInJs(
      '__GLIMMER_TEMPLATE',
      source,
      (hbs) => {
        if (cssOnDiskExists) {
          this.addDependency(cssPath);
        }
        return rewriteHbs(hbs, classes, tags, postfix);
      }
    );

    return rewrittenHbsJs;
    // if colocated css file exists, import it
    // const transformed = `import './${cssFileName}';\n${rewrittenHbsJs}`;
    // return transformed;
  } else {
    return source;
  }
};
