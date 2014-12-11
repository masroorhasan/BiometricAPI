define(function(require) {
  var angular = require('angular');
  return ['$scope', '$http', '$log', '$interval', 'socket', function($scope, $http, $log, $interval, socket) {
    var $this = this;
    $this.images = [];
    $this.timey = 0;
    socket.on("connect", function() {
      $log.info('socket connected');
      socket.request("/image", {}, function(images) {
        $this.images = images;
        $interval(function() {$this.timey += 1;}, 100);
      });

      socket.on("image", function(res) {
        if (res.verb === "created") {
          $this.images.push(res.data);
        } else if (res.verb === "updated") {
          var image = _.findWhere($this.images, {id: res.data.id});
          var idx = _.indexOf($this.images, image);


        } else if (res.verb === "destroyed") {
          $this.images.remove($this.images.get(res.data.id));
        }
      });
    });
  }];
});
