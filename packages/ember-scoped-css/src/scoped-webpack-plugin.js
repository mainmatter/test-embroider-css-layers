// const { RawSource } = require('webpack-sources');
const rewriteCss = require('./rewriteCss');
const { readFileSync } = require('fs');
const glob = require('glob');
const path = require('path');
const getPostfix = require('./getPostfix');

module.exports = class {
  apply(compiler) {
    compiler.hooks.emit.tap('scoped-webpack-plugin', (compilation) => {
      // Get all the CSS files in the app/components directory

      // css files for components
      const cssFiles = glob.sync(
        path.resolve(compiler.context, 'components/*.css')
      );

      // add css files for templates
      cssFiles.push(
        ...glob.sync(path.resolve(compiler.context, 'templates/*.css'))
      );

      // Rewrite the CSS files
      const rewritenFiles = cssFiles.map((file) => {
        const fileName = path.basename(file);
        const postfix = getPostfix(fileName);
        const rewrittenCss = rewriteCss(
          readFileSync(file, 'utf-8'),
          postfix,
          fileName
        );
        return rewrittenCss;
      });

      // Concatenate the rewritten CSS files
      let concatenatedCSS = rewritenFiles.join('\n\n');

      // Store the concatenated CSS in the assets/scoped-components.css
      compilation.assets['assets/scoped.css'] = {
        source: () => concatenatedCSS,
        size: () => concatenatedCSS.length,
      };
    });
  }
};
