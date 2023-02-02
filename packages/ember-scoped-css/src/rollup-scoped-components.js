const path = require('path');
const glob = require('glob');
const fs = require('fs').promises;
const md5 = require('blueimp-md5');
const rewriteCss = require('./rewriteCss');

function getFileNames(dir, pattern) {
  return new Promise((resolve, reject) => {
    glob(path.resolve(dir, pattern), (err, files) => {
      if (err) {
        reject(err);
      } else {
        resolve(files);
      }
    });
  });
}

async function loadAndRewriteCss(filePath) {
  const fileName = path.basename(filePath);
  const postfix = md5(fileName).substring(0, 8);
  const file = await fs.readFile(filePath, 'utf-8');
  const rewrittenCss = rewriteCss(file, postfix);
  return `/* ${fileName} */\n` + rewrittenCss;
}

module.exports = function rollupScopedComponents(options = {}) {
  const { componentsRelativePath, addonDir } = options;
  const addonName = path.basename(addonDir);
  const componentsDir = path.resolve(addonDir, componentsRelativePath);

  return {
    name: 'rollupCreateFilePlugin',
    async buildStart() {},
    async generateBundle(options, bundle) {
      // read all css files from disc components/*.css
      const cssFiles = await getFileNames(componentsDir, '*.css');

      let promises = cssFiles.map((file) => loadAndRewriteCss(file));

      const rewritenFiles = await Promise.all(promises);

      // Concatenate the rewritten CSS files
      let concatenatedCSS = rewritenFiles.join('\n');

      // Write the contents to a new file
      await this.emitFile({
        type: 'asset',
        fileName: `_app_/styles/${addonName}-scoped-components.css`,
        source: concatenatedCSS,
      });

      // await this.emitFile({
      //   type: 'asset',
      //   fileName: `styles/${addonName}-scoped-components.js`,
      //   source: `import './${addonName}-scoped-components.css';`,
      // });
    },
  };
};
