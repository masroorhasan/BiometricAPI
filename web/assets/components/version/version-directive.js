define(['angular'], function(angular) {
  'use strict';

  angular.module('fydp.version.version-directive', [])

  .directive('appVersion', ['version', function(version) {
    return function(scope, elm, attrs) {
      elm.text(version);
    };
  }]);
});
