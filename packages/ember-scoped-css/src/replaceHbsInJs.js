const recast = require('recast');

module.exports = function (script, replaceFunction) {
  const ast = recast.parse(script);
  recast.visit(ast, {
    visitCallExpression(path) {
      const node = path.node;
      if (
        node.callee.name === 'precompileTemplate' &&
        node.arguments[0].type === 'Literal'
      ) {
        node.arguments[0].value = replaceFunction(node.arguments[0].value);
      }
      this.traverse(path);
    },
  });
  return recast.print(ast).code;
};
