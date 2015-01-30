define(['angular'], function(angular) {
  'use strict';

  angular.module('fydp.version', [
    'fydp.version.interpolate-filter',
    'fydp.version.version-directive'
  ])

  .value('version', '0.1');
});
