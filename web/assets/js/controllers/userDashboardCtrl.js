define(function() {
  return function($scope, $interval, socket, UserService) {
    $scope.quizzes = [];
    $scope.quizzes.push({
      name: 'test quiz',
      url: '/quiz/1'
    });

    $scope.user = UserService.getUser();

    socket.on('user', function(user) {
      UserService.setUser(user);
      $scope.user = user;
    });

    socket.emit('user');
  };
});
