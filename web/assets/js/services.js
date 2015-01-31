define(function(require) {
  'use strict';
  var angular = require('angular'),
    cookies = require('angular-cookies'),
    resource = require('angular-resource'),
    Services = angular.module('fydp.services', ['ngResource']);

  Services.factory('socket', function($rootScope) {
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

  Services
    .factory('AuthService',
      require('js/services/AuthService'))
    .factory('Image',
        require('js/services/ImageService'));

  return Services;
});
