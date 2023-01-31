const path = require('path');
const postcss = require('postcss');
const parser = require('postcss-selector-parser');
const md5 = require('blueimp-md5');
const recast = require('ember-template-recast');

function addPostfix(hbs, classes, tags, postfix) {
  let ast = recast.parse(hbs);

  recast.traverse(ast, {
    AttrNode(node) {
      if (node.name === 'class') {
        const newClasses = node.value.chars.split(' ').map((c) => {
          if (c.trim() && classes.has(c.trim())) {
            return c.trim() + '_' + postfix;
          } else {
            return c;
          }
        });

        node.value.chars = newClasses.join(' ');
      }
    },

    ElementNode(node) {
      if (tags.has(node.tag)) {
        // check if class attribute already exists
        const classAttr = node.attributes.find((attr) => attr.name === 'class');
        if (classAttr) {
          classAttr.value.chars += ' ' + postfix;
        } else {
          // push class attribute
          node.attributes.push(
            recast.builders.attr('class', recast.builders.text(postfix))
          );
        }
      }
    },
  });

  let result = recast.print(ast);
  return result;
}

function getClassesAndTags(sel, classes, tags) {
  const transform = (sls) => {
    sls.walk((selector) => {
      if (selector.type === 'class') {
        classes.add(selector.value);
      } else if (selector.type === 'tag') {
        tags.add(selector.value);
      }
    });
  };

  parser(transform).processSync(sel);
}

module.exports = function (source) {
  const classes = new Set();
  const tags = new Set();

  // get path of the template and replace it with the path of the css file
  const cssPath = this.resourcePath.replace('.hbs', '.css');

  // if css file does not exist, return the original template
  if (!this.fs.existsSync(cssPath)) {
    return source;
  }

  // read the css file
  const css = this.fs.readFileSync(cssPath, 'utf-8');
  const ast = postcss.parse(css);
  ast.walk((node) => {
    if (node.type === 'rule') {
      getClassesAndTags(node.selector, classes, tags);
    }
  });

  // css file name with extension
  const fileName = path.basename(cssPath);
  const postfix = md5(fileName).substring(0, 8);

  const transformedHbs = addPostfix(source, classes, tags, postfix);

  return '<!-- Processed by layer-loader -->\n' + transformedHbs;
};
