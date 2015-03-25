define(function(require) {
  'use strict';

  return function($resource, $log, socket) {
    var user = {};

    return {
      getUser: function() {
        return user;
      },
      setUser: function(value) {
        user = value;
      }
    };
  };
});
