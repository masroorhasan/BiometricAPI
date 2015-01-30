define(function() {
  return function($scope, $interval, socket) {
    var $scope = this;
    $scope.timey = 0;


    var x = socket.on('connect', function() {
      console.log('derp');
      $interval(function() {$scope.timey += 1;}, 100);
    });
    console.log('doop');
  };
});
