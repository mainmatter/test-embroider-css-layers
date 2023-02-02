const { createUnplugin } = require('unplugin');

module.exports = createUnplugin((options) => {
  return {
    name: 'unplugin-scoped-components',
    // webpack's id filter is outside of loader logic,
    // an additional hook is needed for better perf on webpack
    transformInclude(id) {
      return id.endsWith('.hbs');
    },
    // just like rollup transform
    transform(code) {
      return code; // code.replace(/<template>/, `<template><div>Injected</div>`);
    },
    // more hooks coming
  };
});
