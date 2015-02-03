define(function(require) {
  'use strict';

  var angular = require('angular'),
    Config = angular.module('fydp.config', []);

  Config.constant('COGNITECH_CONFIG', {
    api_hostname: "http://localhost:1337",
    debug: true
  });
  return Config;
});
