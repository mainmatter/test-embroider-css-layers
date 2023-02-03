const path = require('path');
const fs = require('fs');
const md5 = require('blueimp-md5');
const rewriteCss = require('./rewriteCss');

module.exports = function rollupCssScoping(options = {}) {
  return {
    name: 'css-scoping',

    // async resolveId(source, importer) {
    //   if (!source.endsWith('.css') || !importer.endsWith('.js')) {
    //     return;
    //   }

    //   // compare source name and importer name without extension if they are not the same return
    //   const sourceName = path.basename(source);
    //   const sourcePath = path.dirname(source);
    //   const importerName = path.basename(importer);

    //   const isColocated =
    //     sourceName.replace('.css', '') === importerName.replace('.js', '') &&
    //     sourcePath === '.';

    //   if (isColocated) {
    //     let resolution = await this.resolve(source, importer, {
    //       skipSelf: true,
    //       ...options,
    //     });

    //     resolution.external = false;

    //     return {
    //       ...resolution,
    //       external: false,
    //       id: importer.replace('.js', '.css'),
    //     };
    //   }
    // },

    generateBundle(options, bundle) {
      // if (!id.endsWith('.css')) {
      //   return;
      // }
      // const fileName = path.basename(id);
      // const postfix = 'e' + md5(fileName).substring(0, 8);
      // const rewrittenCss = rewriteCss(code, postfix);
      // return `/* ${fileName} */\n` + rewrittenCss;
    },
  };
};
