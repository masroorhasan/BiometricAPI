define(['angular'], function(angular) {
  'use strict';

  angular.module('fydp.view2', ['ngRoute'])

  .config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/view2', {
      templateUrl: 'view2/view2.html',
      controller: 'View2Ctrl'
    });
  }])

  .controller('View2Ctrl', [function() {

  }]);
});
