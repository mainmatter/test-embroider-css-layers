const { createUnplugin } = require('unplugin');
const replaceGlimmerAst = require('./replaceGlimmerAst');
const compiler = require('@glimmer/compiler');
const { WireFormatDebugger } = compiler;
const path = require('path');
const getPostfix = require('./getPostfix');
const getClassesTagsFromCss = require('./getClassesTagsFromCss');
// const interfaces = require('@glimmer/interfaces');
const { readFileSync } = require('fs');
const { isDeepStrictEqual } = require('util');

function* iterateOpcodes(opcodes) {
  for (let instruction of opcodes) {
    if (!Array.isArray(instruction)) {
      continue;
    }

    yield instruction;

    for (let subInstruction of iterateOpcodes(instruction)) {
      yield subInstruction;
    }
  }
}

function inflateTagName(tag) {
  if (typeof tag === 'string') {
    return tag;
  } else {
    if (tag === 0) {
      return 'div';
    } else if (tag === 1) {
      return 'span';
    } else if (tag === 2) {
      return 'p';
    } else if (tag === 3) {
      return 'a';
    }
  }
  throw new Error('Unknown tag');
}

module.exports = createUnplugin(({ appDir }) => {
  return {
    name: 'app-js-unplugin',

    transformInclude(id) {
      return (
        id.includes(path.basename(appDir)) &&
        (id.endsWith('.js') || id.endsWith('.hbs'))
      );
    },

    transform(code, id) {
      const cssPath = id.replace(/(\.js)|(\.hbs)/, '.css');
      const cssFileName = path.basename(cssPath);
      const postfix = getPostfix(cssFileName);

      return replaceGlimmerAst(code, id, this, (opcodes, css) => {
        const { classes, tags } = getClassesTagsFromCss(css);
        const a = code;
        // this.addWatchFile(cssPath);
        const tmp = this;
        const insertions = [];

        for (let instruction of iterateOpcodes(opcodes[0])) {
          // replace classes
          if (
            instruction[0] === 14 &&
            instruction[1] === 0 &&
            instruction[2] &&
            instruction[2].split(' ').find((i) => classes.has(i.trim()))
          ) {
            // 14 - css attribute, 0 - class
            instruction[2] = instruction[2]
              .split(' ')
              .map((className) => {
                if (className.trim() && classes.has(className.trim())) {
                  return className.trim() + '_' + postfix;
                } else {
                  return className;
                }
              })
              .join(' ');
          }

          // add postfix to tags
          if (
            instruction[0] === 10 &&
            tags.has(inflateTagName(instruction[1]))
          ) {
            // 10 - open element
            let existingClassInstruction;
            for (
              let i = opcodes[0].indexOf(instruction);
              i <= opcodes[0].length;
              i++
            ) {
              if (opcodes[0][i][0] === 14 && opcodes[0][i][1] === 0) {
                // 14 - css attribute, 0 - class
                existingClassInstruction = opcodes[0][i];
                break;
              }
              if (opcodes[0][i][0] === 12) {
                // 12 - flush element
                break;
              }
            }

            if (existingClassInstruction) {
              existingClassInstruction[2] += ' ' + postfix;
            } else {
              const classInstruction = [14, 0, postfix, undefined];
              insertions.push([instruction, classInstruction]);
            }
          }
        }

        // insert new instructions
        for (let [instruction, classInstruction] of insertions) {
          const index = opcodes[0].indexOf(instruction);
          opcodes[0].splice(index + 1, 0, classInstruction);
        }

        // rewrite opcodes
        // const dbg = new WireFormatDebugger(opcodes);
        // const wfd = dbg.format(opcodes);

        return opcodes;
      });
    },
  };
});
