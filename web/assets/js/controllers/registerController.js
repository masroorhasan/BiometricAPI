define(function(require) {
  var angular = require('angular');
  return ['$scope', '$http', '$log', function($scope, $http, $log, $interval, socket) {
    $scope.images = [];
    $scope.register = true;

  }];
});
