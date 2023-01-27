import EmberRouter from '@ember/routing/router';
import config from 'test-embroider-css-layers/config/environment';

export default class Router extends EmberRouter {
  location = config.locationType;
  rootURL = config.rootURL;
}

Router.map(function () {});
