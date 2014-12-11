define(function() {
  return [function($scope, socket) {
    /*socket.on("connect", _.bind(function() {
      socket.request("/image", where, _.bind(function(images) {
        this.set(images);
      }, this));

      socket.on("image", _.bind(function(res) {
        if (res.verb === "created") {
          this.add(res.data);
        } else if (res.verb === "updated") {
          this.get(res.data.id).set(res.data);
        } else if (res.verb === "destroyed") {
          this.remove(this.get(res.data.id));
        }
      }, this));
    }, this));
*/
    var x = socket.on('connect', function() {
      console.log('derp');
    });
    console.log('doop');
  }];
});
