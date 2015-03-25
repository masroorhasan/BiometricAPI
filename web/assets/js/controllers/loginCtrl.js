define(function(require) {
  var angular = require('angular');
  return ['$scope', '$http', '$log', '$interval', 'socket', '$location', 'UserService', function($scope, $http, $log, $interval, socket, $location, UserService) {
    $scope.inputs = {
      name: {
        user: true,
      },
      login: true
    };

    $scope.$on('login', function() {
      // used by registerController
      $log.log("login");
      $scope.ctx.drawImage($scope.video, 0, 0, $scope.canvas.width, $scope.canvas.height);

      $http.post('/api/auth/login', {
        image: $scope.canvas.toDataURL(),
        name: $scope.name.user
      }).
      success(function(data, status, headers, config) {
        $log.log('Successful login');
        //UserService.setUser(data.user);
        $location.path('/dashboard');
      }).
      error(function(data, status, headers, config) {
        $log.error('Login failed: ' + data);
        $scope.note = 'login failed';
      });
    });

  }];
});
