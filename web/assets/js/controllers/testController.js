define(function(require) {
  var angular = require('angular');
  return ['$scope', '$http', '$log', '$interval', 'socket', function($scope, $http, $log, $interval, socket) {
    $scope.images = [];
    socket.on("connect", function() {
      $log.info('socket connected');

      socket.request("/api/image", {}, function(images) {
        $scope.images = images;
      });

      socket.on("image", function(res) {
        if (res.verb === "created") {
          $scope.images.push(res.data);
        } else if (res.verb === "updated") {
          var image = _.findWhere($scope.images, {id: res.data.id});
          var idx = _.indexOf($scope.images, image);


        } else if (res.verb === "destroyed") {
          $scope.images.remove($scope.images.get(res.data.id));
        }
      });

    });
    socket.on("captureImage", function(res) {
      console.log("received captureImage");
      $scope.$emit('capture-image');
    });
  }];
});
