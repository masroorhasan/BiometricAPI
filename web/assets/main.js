require.config({
  //urlArgs: "bust=" + (new Date()).getTime(),
  paths: {
    'jquery': '//ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min',
    'bootstrap': '//netdna.bootstrapcdn.com/bootstrap/3.3.2/js/bootstrap.min',
    'socket.io': '//cdn.socket.io/socket.io-1.0.0',
    'sails.io': 'js/dependencies/sails.io',
    'angular': 'bower_components/angular/angular',
    'angular-loader': 'bower_components/angular-loader/angular-loader',
    'angular-mocks': 'bower_components/angular-mocks/angular-mocks',
    'angular-route': 'bower_components/angular-route/angular-route',
    'angular-cookies': 'bower_components/angular-cookies/angular-cookies',
    'angular-sanitize': 'bower_components/angular-sanitize/angular-sanitize',
    'angular-resource': 'bower_components/angular-resource/angular-resource',
    'version-dir': 'components/version'
  },
  /**
   * * for libs that either do not support AMD out of the box, or
   * * require some fine tuning to dependency mgt'
   * */
  shim: {
    'angular': {
      'exports': 'angular'
    },
    'angular-route': {
      'deps': ['angular'],
      'exports': 'angular-route'
    },
    'angular-cookies': {
      'deps': ['angular']
    },
    'angular-sanitize': {
      'deps': ['angular']
    },
    'angular-resource': {
      'deps': ['angular']
    },
    'bootstrap': {
      'deps': ['jquery']
    },
    'socket.io': {
      'exports': 'io'
    },
    'sails.io': {
      'deps': ['socket.io'],
      'exports': 'io'
    }
  }
});
window.name = "NG_DEFER_BOOTSTRAP!";
require([
  'angular',
  'js/app',
  'bootstrap',
], function(angular, app) {
  'use strict';
  angular.element(document.getElementsByTagName('html')[0]);
  angular.element().ready(function() {
    // http://stackoverflow.com/a/25770449
    setTimeout(angular.resumeBootstrap, 0, [app.name]);
  });
});
