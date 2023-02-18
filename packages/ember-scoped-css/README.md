I have a compiled HBS template into the glimmer wire format. I want to transform that wire format.

Here is an example of how could you get the glimmer wire format from a template string:

```js
const { precompile } = require('@glimmer/compiler');

const template = '<div>hello world</div>';
const glimmerWireFormat = precompile(template);

console.log(glimmerWireFormat);
/* 
'{"id":"056EkDbZ","block":"[[[10,0],[12],[1,\"hello world\"],[13]],[],false,[]]","moduleName":"(unknown template module)","isStrictMode":false}'
*/
```

Here is an example of how can you get AST from a template string and traverse it:

```js
const { traverse, preprocess } = require('@glimmer/syntax');

const template = '<div>hello world</div>';
const glimmerAst = parse(template);

console.log(glimmerAst);
/*
{"type":"Template","body":[{"type":"ElementNode","tag":"div","selfClosing":false,"attributes":[],"blockParams":[],"modifiers":[],"comments":[],"children":[{"type":"TextNode","chars":"hello world","loc":{"start":{"line":1,"column":5},"end":{"line":1,"column":16}}}],"loc":{"start":{"line":1,"column":0},"end":{"line":1,"column":22}}}],"blockParams":[],"loc":{"start":{"line":1,"column":0},"end":{"line":1,"column":22}}}
*/

traverse(glimmerAst, {
  AttrNode(node) {
    // do any changes to the node
  },
});
```

My question is how can I traverse the glimmer wire format? I want to transform it.
