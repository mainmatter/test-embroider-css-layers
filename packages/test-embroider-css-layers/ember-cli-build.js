'use strict';

const EmberApp = require('ember-cli/lib/broccoli/ember-app');
const path = require('path');

module.exports = function (defaults) {
  const app = new EmberApp(defaults, {
    // Add options here
  });

  // Use `app.import` to add additional libraries to the generated
  // output files.
  //
  // If you need to use different assets in different
  // environments, specify an object as the first parameter. That
  // object's keys should be the environment name and the values
  // should be the asset to use in that environment.
  //
  // If the library that you are including contains AMD or ES6
  // modules that you would like to import into your application
  // please specify an object with the list of modules as keys
  // along with the exports of each module as its value.

  const { Webpack } = require('@embroider/webpack');
  return require('@embroider/compat').compatBuild(app, Webpack, {
    skipBabel: [
      {
        package: 'qunit',
      },
    ],
    packagerOptions: {
      webpackConfig: {
        module: {
          rules: [
            {
              test: /\.hbs$/,
              use: [
                {
                  loader: require.resolve(
                    'ember-scoped-css/src/scoped-hbs-loader.js'
                  ),
                },
              ],
              exclude: [/node_modules/, /dist/, /assets/],
            },
            {
              test: /\.js$/,
              use: [
                {
                  loader: require.resolve(
                    'ember-scoped-css/src/scoped-js-loader.js'
                  ),
                },
              ],
              exclude: [/node_modules/, /dist/, /assets/],
            },
            {
              test: /\.css$/,
              use: [
                {
                  loader: require.resolve(
                    'ember-scoped-css/src/scoped-css-loader.js'
                  ),
                },
              ],
              exclude: [/node_modules/, /dist/, /assets/],
            },
            // {
            //   test: /\.gjs$/,
            //   use: [
            //     {
            //       loader: require.resolve(
            //         'ember-scoped-css/src/scoped-gjs-loader.js'
            //       ),
            //     },
            //   ],
            //   exclude: [/node_modules/, /dist/, /assets/],
            // },
          ],
        },
      },
    },
  });
};
