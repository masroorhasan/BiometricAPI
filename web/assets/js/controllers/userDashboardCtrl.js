define(function() {
  return function($scope, $interval, socket, UserService) {
    $scope.quizzes = [];
    $scope.quizzes.push({
      name: 'test quiz',
      url: '/quiz/1'
    });
    $scope.user = UserService.getUser();

    socket.on('user', function(data) {
      UserService.setUser(data);
      $scope.user = data;
    });
    socket.emit('user');

  };
});
