define(function(require) {
  'use strict';
  var angular = require('angular'),
    Services = angular.module('fydp.services', []);

  Services.factory('socket', require('js/services/socket'));
  return Services;
});
