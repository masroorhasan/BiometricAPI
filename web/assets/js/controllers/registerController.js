define(function(require) {
  var angular = require('angular');
  return ['$scope', '$http', '$log', function($scope, $http, $log, $interval, socket) {
    $scope.images = [];

    $scope.inputs = {
      name: {
        user: true,
        first: true,
        last: true
      },
      register: true
    };

    $scope.$on('submit', function() {
      // used by registerController
      $log.log("submit");
      $scope.images = [];
      var limit = 10;

      $scope.ctx.drawImage($scope.video, 0, 0, $scope.canvas.width, $scope.canvas.height);
      var image = $scope.canvas.toDataURL();
      socket.emit('register-start', {
        name: $scope.name,
        image: image
      });

      $interval(function() {
        image = $scope.canvas.toDataURL();
        socket.emit('register-start', {
          name: $scope.name,
          image: image
        });

      }, 500, limit);
    });
  }];
});
