define(function(require) {
  'use strict';
  var angular = require('angular'),
    services = require('js/services'),
  Controllers = angular.module('fydp.controllers', ['fydp.services']);
  Controllers
    .controller('testController',
        require('js/controllers/testController'))
    .controller('registerController',
        require('js/controllers/registerController'))
    .controller('userDashboardCtrl',
        require('js/controllers/userDashboardCtrl'))
    .controller('quizController',
        require('js/controllers/quizController'))
    .controller('LoginCtrl',
        require('js/controllers/LoginCtrl'));

  return Controllers;
});
