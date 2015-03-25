define(function(require) {
  var angular = require('angular');
  return ['$scope', '$http', '$log', '$interval', 'socket', '$location', function($scope, $http, $log, $interval, socket, $location) {
    $scope.images = [];

    $scope.inputs = {
      name: {
        user: true,
        first: true,
        last: true
      },
      quiz: true
    };

    socket.emit('quiz-start');

    socket.on("captureImage", function(res) {
      console.log("received captureImage");
      $scope.$emit('capture-image');
    });

    $scope.$on('submit-quiz', function() {
      // submit quiz
      socket.emit('quiz-end');
      // redirect
      $location.path('/dashboard');
    });
  }];
});
