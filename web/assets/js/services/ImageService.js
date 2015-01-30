define(function(require) {
  'use strict';

  return function($resource, $log) {
    $log.info('Initializing ImageService');
    var baseUrl = 'https://localhost:port/image/:id'; // put in a config file

    return $resource(baseUrl, {
      port: ':1337',
      id: '@_id'
    }, {
      'update': {
        method: 'PUT'
      },
      'delete': {
        method: 'DELETE',
        isArray: true
      }
    });

  };
});
