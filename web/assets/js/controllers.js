define(function(require) {
  'use strict';
  var angular = require('angular'),
    services = require('js/services'),
  Controllers = angular.module('fydp.controllers', ['fydp.services']);
  Controllers
    .controller('testController',
        require('js/controllers/testController'))
    .controller('view1Ctrl',
        require('js/controllers/view1Ctrl'))
    .controller('LoginCtrl',
        require('js/controllers/LoginCtrl'));

  return Controllers;
});
