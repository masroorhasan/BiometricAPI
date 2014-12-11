define(['angular',
  'sails.io',
  'js/controllers',
  'version-dir/interpolate-filter',
  'version-dir/version-directive',
  'version-dir/version',
], function(angular, io) {
  'use strict';
  // Declare app level module which depends on views, and components
  var app = angular.module('fydp', [
    'fydp.controllers',
  ]);
  /*app.
  config(['$routeProvider', function($routeProvider) {
    $routeProvider
      .when('/view2', {
        templateUrl: 'view2/view2.html',
        controller: 'View2Ctrl'
      })
      .when('/view1', {
        templateUrl: 'view1/view1.html',
        controller: 'View1Ctrl'
      })
      .otherwise({
        redirectTo: '/view1'
      });
  }]);*/
  app.factory('socket', function($rootScope) {
    var socket = io.connect();
    return {
      on: function(eventName, callback) {
        socket.on(eventName, function() {
          var args = arguments;
          $rootScope.$apply(function() {
            callback.apply(socket, args);
          });
        });
      },
      emit: function(eventName, data, callback) {
        socket.emit(eventName, data, function() {
          var args = arguments;
          $rootScope.$apply(function() {
            if (callback) {
              callback.apply(socket, args);
            }
          });
        })
      },
      request: function(url, where, callback) {
        socket.request(url, where, function() {
          var args = arguments;
          $rootScope.$apply(function() {
            if (callback) {
              callback.apply(socket, args);
            }
          });
        });
      }
    };
  });
  return app;
});
