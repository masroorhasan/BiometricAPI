define(function(require) {
  var angular = require('angular');
  return ['$scope', '$http', '$log', '$interval', 'socket', '$location', 'UserService', function($scope, $http, $log, $interval, socket, $location, UserService) {
    $scope.images = [];

    $scope.inputs = {
      name: {
      },
      quiz: true
    };

    $scope.user = UserService.getUser();
    $scope.matched = null;

    socket.on("captureImage", function(res) {
      console.log("received captureImage");
      $scope.$emit('capture-image');
    });

    $scope.$on('send-image', function(scope, image) {
      $http.post('/api/auth/session', {image: image.dataUrl, username: $scope.user.username}).
        success(function(data, status, headers, config) {
          console.log('pic success');
          $scope.matched = data.user != null;
        }).
        error(function(data, status, headers, config) {
          console.log('pic failed');
          $scope.matched = false;
        });
    });

    $scope.$on('submit-quiz', function() {
      // submit quiz
      socket.emit('quiz-end');
      // redirect
      $location.path('/dashboard');
    });

    socket.emit('quiz-start');
  }];
});
