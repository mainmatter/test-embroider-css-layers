const pathModule = require('path');
const fs = require('fs');
module.exports = function cssColocationPlugin(options = {}) {
  return {
    visitor: {
      Program(path, state) {
        // get file path
        const filePath = state.filename;

        // replace extension to css in filePath
        const cssPath = filePath.replace('.js', '.css');

        // check if the css file exists with fs sync
        const cssExists = fs.existsSync(cssPath);

        if (cssExists) {
          // get the css file name
          const cssFileName = pathModule.basename(cssPath);

          // check if the css file is already imported
          const cssImport = path.node.body.find(
            (node) =>
              node.type === 'ImportDeclaration' &&
              node.source.value === cssFileName
          );

          // if not, import it
          if (!cssImport) {
            path.node.body.unshift({
              type: 'ImportDeclaration',
              specifiers: [],
              source: {
                type: 'StringLiteral',
                value: './' + cssFileName,
              },
            });
          }
        }
      },
      // Program: {
      //   enter(path, state) {
      //   },
      //   exit(path, state) {
      //   },
      // },
    },
  };
};
