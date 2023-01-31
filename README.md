# Requirement

A custom-css-loader should discover `@import url('scoped-components.css')` in `app/styles/app.css`.
If the `scoped-components.css` is imported then the custom-css-loader will load and emit all co-located CSS files.

## 1

Problem is that `app/styles/app.css` is not imported to any JS file. So the custom-css-loader will not discover it.
There is probably used `CopyWebpackPlugin` to copy the `app/styles/app.css` to the dist folder directly. In this case the custom-css-loader will not discover it. (checking it by debugging embroider and searching where the webpack config is created)

> Note: I did not find how the `app/styles/app.css` is copied to the dist folder. If it was imported to some JS file then the custom-css-loader will discover imports inside it.

## 2 webpack plugin

I am going to create a webpack plugin which will discover all co-located CSS files and will emit them to the dist folder combined to one file `scoped-components.css`.
