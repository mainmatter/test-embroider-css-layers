const path = require('path');
const glob = require('glob');
const fs = require('fs');
const postcss = require('postcss');
const parser = require('postcss-selector-parser');
const md5 = require('blueimp-md5');

function replaceSelector(sel, postfix) {
  const transform = (selectors) => {
    selectors.walk((selector) => {
      if (selector.type === 'class') {
        selector.value += '_' + postfix;
      } else if (selector.type === 'tag') {
        selector.replaceWith(
          parser.tag({ value: selector.value }),
          parser.className({ value: postfix })
        );
      }
    });
  };
  const transformed = parser(transform).processSync(sel);
  return transformed;
}

function simpleAppend(css, postfix) {
  const ast = postcss.parse(css);
  ast.walk((node) => {
    if (node.type === 'rule') {
      node.selector = replaceSelector(node.selector, postfix);
    }
  });
  return ast.toString();
}

module.exports = class ScopedComponents {
  apply(compiler) {
    compiler.hooks.make.tapAsync(
      'ScopedComponents',
      (compilation, callback) => {
        const cssFiles = glob.sync(
          path.resolve(__dirname, 'app/components/*.css')
        );
        let concatenatedCSS = '';
        cssFiles.forEach((file) => {
          const fileName = path.basename(file);
          const postfix = md5(fileName).substring(0, 8);
          const rewrittenCss = simpleAppend(
            fs.readFileSync(file, 'utf-8'),
            postfix
          );
          concatenatedCSS += `\n/* ${fileName} */\n` + rewrittenCss;
        });
        compilation.assets['assets/scoped-components.css'] = {
          source: () => concatenatedCSS,
          size: () => concatenatedCSS.length,
        };
        callback();
      }
    );
  }
};
