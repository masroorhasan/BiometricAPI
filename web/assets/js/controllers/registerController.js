define(function(require) {
  var angular = require('angular');
  return ['$scope', '$http', '$log', '$interval', 'socket', function($scope, $http, $log, $interval, socket) {
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
      var images = [];
      var limit = 10;

      var sub = function() {
        $http.post('/api/auth/testreg', {
          name: 'timmy'
        }).
        success(function(data, status, headers, config) {
          $log.log('Successful login');
          $location.path('/dashboard');
        }).
        error(function(data, status, headers, config) {
          $log.error('Login failed: %j', data);
        });
      };

      /*$interval(function() {
        // take limit number of pictures and store in images array
        // call the http post handler when all images have been taken
        $scope.ctx.drawImage($scope.video, 0, 0, $scope.canvas.width, $scope.canvas.height);
        images.push($scope.canvas.toDataURL());
        if (images.length == limit)
          sub();
      }, 500, limit);*/
      sub();
    });
  }];
});
