define(['angular',
  'sails.io',
  'js/controllers',
  'js/services',
  'js/directives',
  'js/config',
  'angular-route',
  'angular-sanitize',
  'version-dir/interpolate-filter',
  'version-dir/version-directive',
  'version-dir/version',
], function(angular, io) {
  'use strict';
  // Declare app level module which depends on views, and components
  var app = angular.module('fydp', [
    'fydp.services',
    'fydp.controllers',
    'fydp.directives',
    'fydp.config',
    'ngSanitize',
    'ngRoute',
    'ngCookies'
  ]);
  app
    .config(function($routeProvider, $locationProvider) {
      $locationProvider.html5Mode(true);
      $routeProvider
        .when('/', {
          templateUrl: 'partials/index.html',
        })
        .when('/login', {
          templateUrl: 'partials/login.html',
          controller: 'LoginCtrl',
        })
        .when('/dashboard', {
          templateUrl: 'partials/userDashboard.html',
          controller: 'userDashboardCtrl'
        })
        .when('/test', {
          templateUrl: 'partials/test.html',
          controller: 'testController',
        })
        .when('/quiz/:id', {
          templateUrl: 'partials/test-quiz.html',
          controller: 'quizController',
        })
        .when('/register', {
          templateUrl: 'partials/test.html',
          controller: 'registerController',
        })
        .when('/user/:user', {
          templateUrl: 'partials/user_profile.html',
          controller: 'UserProfileCtrl',
          css: 'styles/user.css'
        })
        .when('/admin/:admin', {
          templateUrl: 'partials/admin_profile.html',
          controller: 'AdminProfileCtrl',
          css: 'styles/admin.css'
        })
        .when('/admin/session', {
          templateUrl: 'partials/admin/session_list.html',
          controller: 'SessionListCtrl',
          css: 'styles/session_list.css'
        })
        .when('/admin/session/:session', {
          templateUrl: 'partials/admin/session.html',
          controller: 'SessionCtrl',
          css: 'styles/session.css'
        })
        .otherwise({
          redirectTo: '/'
        });
    });

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
