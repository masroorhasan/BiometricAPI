define(function() {
  return function($scope, socket) {
    var x = socket.on('connect', function() {
      console.log('derp');
    });
    console.log('doop');
  };
});
