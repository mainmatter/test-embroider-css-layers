const path = require('path');
const glob = require('glob');
const fs = require('fs');
const md5 = require('blueimp-md5');
const rewriteCss = require('./rewriteCss');

module.exports = class ScopedComponents {
  componentsDir;

  constructor(componentsDir) {
    this.componentsDir = componentsDir;
  }

  apply(compiler) {
    compiler.hooks.make.tapAsync(
      'ScopedComponents',
      (compilation, callback) => {
        // Get all the CSS files in the app/components directory
        const cssFiles = glob.sync(path.resolve(this.componentsDir, '*.css'));

        if (cssFiles.length === 0) {
          callback();
        }

        // Rewrite the CSS files
        const rewritenFiles = cssFiles.map((file) => {
          const fileName = path.basename(file);
          const postfix = md5(fileName).substring(0, 8);
          const rewrittenCss = rewriteCss(
            fs.readFileSync(file, 'utf-8'),
            postfix
          );
          return `/* ${fileName} */\n` + rewrittenCss;
        });

        // Concatenate the rewritten CSS files
        let concatenatedCSS = rewritenFiles.join('\n');

        // Store the concatenated CSS in the assets/scoped-components.css
        compilation.assets['assets/scoped-components.css'] = {
          source: () => concatenatedCSS,
          size: () => concatenatedCSS.length,
        };
        callback();
      }
    );
  }
};
