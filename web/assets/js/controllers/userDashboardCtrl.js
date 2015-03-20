define(function() {
  return function($scope, $interval, socket) {
    $scope.quizzes = [];
    $scope.quizzes.push({
      name: 'test quiz',
      url: '/quiz/1'
    });

  };
});
