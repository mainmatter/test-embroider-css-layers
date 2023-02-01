# ember-scoped-css

This app is an investigation of how to implement scoped CSS in Ember. It should work in classic Ember apps and Embroider apps with V2 addons.

## Requirement

A custom-css-loader should discover `@import url('scoped-components.css')` in `app/styles/app.css`.
If the `scoped-components.css` is imported then the custom-css-loader will load and emit all co-located CSS files.

##

Problem is that `app/styles/app.css` is not imported to any JS file. So the custom-css-loader will not discover it.
There is probably used `CopyWebpackPlugin` to copy the `app/styles/app.css` to the dist folder directly. In this case the custom-css-loader will not discover it. (checking it by debugging embroider and searching where the webpack config is created)

> Note: I did not find how the `app/styles/app.css` is copied to the dist folder. If it was imported to some JS file then the custom-css-loader will discover imports inside it.

## 2. webpack plugin

I am going to create a webpack plugin which will discover all co-located CSS files and will emit them to the dist folder combined to one file `scoped-components.css`.

> Note: I couldn't resist to implement simple append logic for replacing css selectors.

## 3. hbs loader

I have found, that I can use hbs loader to load hbs files.

> Note: It was fun to implement replace logic based on info from css file.

## 4. CSS loader

Checking why I cannot use css loader to load css files. Looks like css files are somehow simply copied to the dist folder??? Loaders are not used.

I debugged embroider building process, and I have found pathToVanillaApp. This app is passed to webpack, so I am going to see how app.css is copied to the dist folder.

## 5. unplugin

1. Wrap everything in unplugin
2. Generate V2 addon with addon blueprint with co-located css (use unplugin in rolup config)
   And make sure when it is build the css is outputed in the build directory.
3. Import the V2 addon with the css to test-embroider-css-layers app
