const recast = require('recast');

module.exports = function (functionName, script, replaceFunction) {
  const ast = recast.parse(script);
  recast.visit(ast, {
    visitCallExpression(path) {
      const node = path.node;
      if (node.callee.name === functionName) {
        if (node.arguments[0].type === 'TemplateLiteral') {
          node.arguments[0].quasis[0].value.raw = replaceFunction(
            node.arguments[0].quasis[0].value.raw
          );
        } else if (node.arguments[0].type === 'Literal') {
          node.arguments[0].value = replaceFunction(node.arguments[0].value);
        }
      }
      this.traverse(path);
    },
  });
  return recast.print(ast).code;
};
