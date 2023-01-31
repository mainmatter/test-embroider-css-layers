const path = require('path');
const glob = require('glob');
const fs = require('fs');

module.exports = class ScopedComponents {
  apply(compiler) {
    compiler.hooks.emit.tapAsync(
      'ScopedComponents',
      (compilation, callback) => {
        const cssFiles = glob.sync(
          path.resolve(__dirname, 'app/components/*.css')
        );
        let concatenatedCSS = '';
        cssFiles.forEach((file) => {
          concatenatedCSS += '\n' + fs.readFileSync(file, 'utf-8');
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
