define(function(require) {
  'use strict';
  var angular = require('angular'),
  Controllers = angular.module('fydp.controllers', []);
  Controllers
    .controller('testController',
        require('js/controllers/testController'))
    .controller('view1Ctrl',
        require('js/controllers/view1Ctrl'))
    .controller('view2Ctrl',
        require('js/controllers/view2Ctrl'));

  return Controllers;
});
