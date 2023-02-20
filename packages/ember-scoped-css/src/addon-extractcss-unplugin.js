const { createUnplugin } = require('unplugin');
const recast = require('recast');
const { existsSync, readFileSync, writeFileSync } = require('fs');
const path = require('path');
const getClassesTagsFromCss = require('./getClassesTagsFromCss');
const getPostfix = require('./getPostfix');
const rewriteHbs = require('./rewriteHbs');

module.exports = createUnplugin((options) => {
  return {
    name: 'addon-extractcss-unplugin',

    async resolveId(source, importer, options) {
      if (source.endsWith('.css')) {
        const resolution = await this.resolve(source, importer, {
          skipSelf: true,
          ...options,
        });
        if (!resolution) {
          return {
            external: true,
            id: source,
            meta: {
              importer,
            },
          };
        }
      }
      return null;
    },

    // load(id) {
    //   if (id.endsWith('.css')) {
    //     const importer = this.getModuleInfo(id)?.meta?.importer;
    //     const cssPath = importer.replace(/\.js$/, '.css');
    //     const cssRelativePath = cssPath.replace(options.addonDir + '/src/', '');

    //     const cssExist = existsSync(cssPath, 'utf-8');
    //     if (!cssExist) {
    //       const fileName = path.basename(cssPath);
    //       return `import './ttttt';`;
    //     }
    //   }
    //   return null;
    // },

    transformInclude(id) {
      return id.endsWith('.js');
    },

    transform(code, id) {
      const ast = recast.parse(code);
      const cssPath = id.replace(/\.js$/, '.css');
      const cssFileName = path.basename(cssPath);
      const cssRelativePath = cssPath.replace(options.addonDir + '/src/', '');

      const emitFile = this.emitFile.bind(this);
      const getFileName = this.getFileName.bind(this);
      const self = this;

      let css;
      // extract CSS from __GLIMMER_STYLES into co-located .css file
      recast.visit(ast, {
        visitCallExpression(nodePath) {
          const node = nodePath.node;
          if (
            node.callee.name === '__GLIMMER_STYLES' &&
            node.arguments.length === 1
          ) {
            css = node.arguments[0].quasis[0].value.raw;
            // get relative path of co-located .css file
            // get path of addon

            const emited = emitFile({
              type: 'asset',
              fileName: cssRelativePath,
              // fileName: cssPath,
              source: css,
            });
            const fileName = self.getFileName(emited);
            const fileName2 = self.getAssetFileName(emited);
            // writeFileSync(cssPath, css);
            nodePath.prune();
            return false;
          } else {
            this.traverse(nodePath);
          }
        },
      });

      if (!css && existsSync(cssPath)) {
        css = readFileSync(cssPath, 'utf-8');
      }

      if (css) {
        // import co-located .css file
        const importCss = recast.parse(`import './${cssFileName}';`);
        const importCssNode = importCss.program.body[0];
        ast.program.body.unshift(importCssNode);

        //rewrite hbs template
        const postfix = getPostfix(cssFileName);
        recast.visit(ast, {
          visitCallExpression(nodePath) {
            const node = nodePath.node;
            if (node.callee.name === 'precompileTemplate') {
              const hbs = node.arguments[0].quasis[0].value.raw;
              const { classes, tags } = getClassesTagsFromCss(css);
              node.arguments[0].quasis[0].value.raw = rewriteHbs(
                hbs,
                classes,
                tags,
                postfix
              );
            }
            this.traverse(nodePath);
          },
        });
      }

      const newCode = recast.print(ast).code;
      return newCode;
    },
  };
});
