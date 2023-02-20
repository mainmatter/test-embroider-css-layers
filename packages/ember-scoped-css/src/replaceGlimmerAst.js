const recast = require('recast');
const babelParser = require('recast/parsers/babel');
const getClassesTagsFromCss = require('./getClassesTagsFromCss');
const rewriteCss = require('./rewriteCss');
const path = require('path');
const { writeFileSync, readFileSync, existsSync } = require('fs');
const { isClassName } = require('postcss-selector-parser');

const parseOptions = {
  parser: babelParser,
};

module.exports = function (script, id, unplugin, replaceFunction) {
  const ast = recast.parse(script, parseOptions);
  let css;
  // emit styles, get classes and tags
  // recast.visit(ast, {
  //   visitCallExpression(nodePath) {
  //     const node = nodePath.node;
  //     if (
  //       node.callee.name === '__GLIMMER_STYLES' &&
  //       node.arguments.length === 1
  //     ) {
  //       css = node.arguments[0].quasis[0].value.raw;
  //       // remove path from ast
  //       nodePath.prune();
  //       return false;
  //     } else {
  //       this.traverse(nodePath);
  //     }
  //   },
  // });

  const cssPath = id.replace(/(\.js)|(\.hbs)/, '.css');

  let importPath;
  // if (css) {
  //   // importPath = path.join(appDir, 'dist', path.basename(cssPath));
  //   importPath = path.join('/tmp', path.basename(cssPath));
  //   writeFileSync(importPath, css);
  // } else {
  if (existsSync(cssPath)) {
    css = readFileSync(cssPath, 'utf-8');
  }
  // }

  if (!css) {
    return script;
  }

  recast.visit(ast, {
    visitCallExpression(nodePath) {
      const node = nodePath.node;
      let addImport = false;
      if (
        node.callee.name === 'createTemplateFactory' &&
        node.arguments.length === 1
      ) {
        const blockProp = node.arguments[0].properties.find(
          (prop) => prop.key.value === 'block'
        );
        const opcodes = JSON.parse(blockProp.value.value);
        const a = id;
        const newOpcodes = replaceFunction(opcodes, css);
        blockProp.value.value = JSON.stringify(newOpcodes);
        addImport = true;
      }
      // else if (node.callee.name === 'setComponentTemplate') {
      //   addImport = true;
      // }

      if (addImport) {
        // add import './${result.importCssName}'; to the top of the file
        const fileName = path.basename(cssPath);
        if (!importPath) {
          unplugin.addWatchFile(cssPath);
        }
        const importCss = recast.parse(`import './${fileName}';`, parseOptions);
        const importCssNode = importCss.program.body[0];
        ast.program.body.unshift(importCssNode);
      }
      this.traverse(nodePath);
    },
  });
  const resultScript = recast.print(ast).code;
  return resultScript;
};
