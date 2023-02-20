// const { RawSource } = require('webpack-sources');
const rewriteCss = require('./rewriteCss');
const { readFileSync, existsSync, writeFileSync } = require('fs');
const glob = require('glob');
const path = require('path');
const getPostfix = require('./getPostfix');

module.exports = class {
  apply(compiler) {
    compiler.hooks.emit.tap('scoped-webpack-plugin', (compilation) => {
      // Get all the CSS files in the app/components directory

      const projectPath = compiler.context.match(/.+\/embroider\/[^/]+\//)[0];
      // css files for components
      const cssFiles = glob.sync(path.resolve(projectPath, '**/*.css'));

      // add css files for templates
      cssFiles.push(
        ...glob.sync(path.resolve(compiler.context, 'templates/*.css'))
      );

      // Rewrite the CSS files
      const rewritenFiles = cssFiles.map((file) => {
        if (file.endsWith(`/${path.basename(compiler.context)}.css`)) {
          let appCss = readFileSync(file, 'utf-8');
          writeFileSync(file, `@import "scoped.css";\n${appCss}`);
        }

        if (
          ['app.css', 'test-app.css', 'test-support.css'].some((f) =>
            file.endsWith(f)
          ) ||
          file.includes('/vendor/') ||
          !existsSync(file.replace('.css', '.js'))
        ) {
          return '';
        }
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
