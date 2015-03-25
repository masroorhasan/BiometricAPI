define(function(require) {
  var angular = require('angular');
  return ['$scope', '$http', '$log', '$interval', 'socket', '$location', function($scope, $http, $log, $interval, socket, $location) {
    $scope.inputs = {
      name: {
        user: true,
        first: true,
        last: true
      },
      register: true
    };

    $scope.left = 0;

    $scope.$on('submit', function() {
      // used by registerController
      $log.log("submit");
      var count = 0;
      var limit = 15;

      $interval(function() {
        $log.log('interval');
        // take limit number of pictures and store in images array
        // call the http post handler when all images have been taken
        $scope.ctx.drawImage($scope.video, 0, 0, $scope.canvas.width, $scope.canvas.height);
        socket.emit('register-image', {
          name: $scope.name,
          image: $scope.canvas.toDataURL()
        });
        if (++count == limit) {
          socket.emit('register-end', {
            name: $scope.name
          });
          $location.path('/login');
        }
        $scope.left = limit - count;
      }, 150, limit);
    });
  }];
});
