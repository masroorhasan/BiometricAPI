define(['angular',
  'sails.io',
  'js/controllers',
  'js/services',
  'angular-route',
  'version-dir/interpolate-filter',
  'version-dir/version-directive',
  'version-dir/version',
], function(angular, io) {
  'use strict';
  // Declare app level module which depends on views, and components
  var app = angular.module('fydp', [
    'fydp.services',
    'fydp.controllers',
    'ngRoute'
  ]);
  app.
  config(['$routeProvider', function($routeProvider) {
    $routeProvider
      .when('/login', {
        templateUrl: 'partials/login.html',
        controller: 'LoginCtrl',
        reloadOnSearch: false
      })
      .when('/deployment', {
        templateUrl: 'partials/deployment-list.html',
        controller: 'DeploymentListCtrl',
        css: 'css/deployment-list.css',
        reloadOnSearch: false
      })
      .when('/deployment/:deployment', {
        templateUrl: 'partials/deployment.html',
        controller: 'DeploymentDetailCtrl',
        css: 'css/deployment.css',
        reloadOnSearch: false
      })
      .when('/login', {
        templateUrl: 'view2/view2.html',
        controller: 'view2Ctrl'
      })
      .when('/view1', {
        templateUrl: 'view1/view1.html',
        controller: 'view1Ctrl'
      })
      .otherwise({
        redirectTo: '/view1'
      });
  }]);

    /*.run(['$rootScope', 'AuthService', function($rootScope, AuthService) {
      $rootScope.$on('$locationChangeStart', function(event, next, current) {
        if (!AuthService.isLoggedIn()) {
          if (!_.chain(next.split("#")).last().isEqual('/login').value()) {
            AuthService.authRequired();
          }
        }
      });
    }]);*/
  return app;
});
