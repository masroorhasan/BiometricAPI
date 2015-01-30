'use strict';

/* VC UI Module */

angular.module('vcui', ['ngCookies', 'ngRoute', 'ngResource', 'ui.bootstrap', 'vcui.services', 'vcui.controllers', 'vcui.filters'])
.config(['$routeProvider', '$httpProvider', '$resourceProvider', function($routeProvider, $httpProvider, $resourceProvider) {
  $routeProvider.
  when('/deployment', {
    templateUrl: 'partials/deployment-list.html',
    controller: 'DeploymentListCtrl',
    css: 'css/deployment-list.css',
    reloadOnSearch: false
  }).
  when('/deployment/:deployment', {
    templateUrl: 'partials/deployment.html',
    controller: 'DeploymentDetailCtrl',
    css: 'css/deployment.css',
    reloadOnSearch: false
  }).
  when('/login', {
    templateUrl: 'partials/login.html',
    controller: 'LoginCtrl',
    reloadOnSearch: false
  }).
  otherwise({
    redirectTo: '/deployment'
  });

  // TODO: check if withCredentials is needed or was just for cookies
  $httpProvider.defaults.withCredentials = true;
  $resourceProvider.defaults.stripTrailingSlashes = false;
}])
.run(['$rootScope', 'AuthService', function($rootScope, AuthService) {
  $rootScope.$on('$locationChangeStart', function(event, next, current) {
    if (!AuthService.isLoggedIn()) {
      if (!_.chain(next.split("#")).last().isEqual('/login').value()) {
        AuthService.authRequired();
      }
    }
  });
}]);

if (!String.prototype.format) {
  /**
   * Formats a string using {digit} replacement
   */
  String.prototype.format = function() {
    var args = arguments;
    return this.replace(/{(\d+)}/g, function(match, number) {
      return typeof args[number] != 'undefined' ? args[number] : match;
    });
  };
}
