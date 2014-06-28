var SailsCollection = Backbone.Collection.extend({
    sailsCollection: "",
    socket: null,
    sync: function(method, model, options) {
        var where = {};
        if (options.where) {
            where = {
                where: options.where
            }
        }
        if (typeof this.sailsCollection === "string" && this.sailsCollection !== "") {
            this.socket = io.connect();
            this.socket.on("connect", _.bind(function() {
                this.socket.request("/" + this.sailsCollection, where, _.bind(function(images) {
                    this.set(images);
                }, this));

                this.socket.on("image", _.bind(function(res) {
                    if (res.verb === "created") {
                        this.add(res.data);
                    } else if (res.verb === "updated") {
                        this.get(res.data.id).set(res.data);
                    } else if (res.verb === "destroyed") {
                        this.remove(this.get(res.data.id));
                    }
                }, this));
            }, this));
        } else {
            console.log("Error: Cannot retrieve models because property 'sailsCollection' not set on the collection");
        }
    }
});

var ImageModel = Backbone.Model.extend({
    urlRoot: 'image',
    defaults: {
        imageName: null,
        imageData: null
    },
    url: function() {
        return this.id ? '/image/' + this.id : '/image';
    }
});

var ImageView = Backbone.View.extend({
    el: '#image-container',
    events: {
        "click button.startCapture": "startCapture",
    	"click button.stopCapture" : "stopCapture"
    },
    initialize: function() {
        this.collection.on('add', this.render, this);
        this.render();
	this.setup();
	setTimeout(_.bind(this.startCapture, this), 5000);
    },
    template: _.template("<div class='image'>ID: <%= id %> <div id='canvasHolder'></div><input id='imageToForm'/><img id='preview'/><img src='data:image/png;base64,<%= imageData %>' style='width:640px;min-height:480px;'></img></div>"),
    render: function() {
	this.$el.find("div.image").remove();

        this.collection.each(function(image) {
            image = image.toJSON();
            image.imageData = image.imageData.replace(/^data:image\/png;base64,/, "");

            this.$el.append(this.template(image));
        }, this)
    },
    captureImage: function() {
        var canvas = this.$el.find("canvas#hiddenCanvas");
        var ctx = canvas[0].getContext('2d');
        //canvas.width = this.video.videoWidth / 4;
        //canvas.height = this.video.videoHeight / 4;
        ctx.drawImage(video, 0, 0, canvas[0].width, canvas[0].height);
        //save canvas image as data url
        dataURL = canvas[0].toDataURL();

        var newImage = this.collection.create({
            id: null,
            imageData: dataURL,
            imageName: 'boop'
        });
    },
    setup: function() {
        navigator.myGetMedia = (navigator.getUserMedia ||
            navigator.webkitGetUserMedia ||
            navigator.mozGetUserMedia ||
            navigator.msGetUserMedia);
        navigator.myGetMedia({
            video: true
        }, _.bind(this.connect, this), _.bind(this.error, this));
    },
    connect: function(stream) {
        var video = this.$el.find("video")[0];
        video.src = window.URL ? window.URL.createObjectURL(stream) : stream;
        video.play();
    },
    error: function(e) {
        console.log(e);
    },
    startCapture: function() {
	this.timer = setInterval(_.bind(this.captureImage, this), 5000);
    },
    stopCapture: function() {
	window.clearInterval(this.timer);
    }


});

var ImagesCollection = SailsCollection.extend({
    sailsCollection: 'image',
    model: ImageModel
});

$(function() {
    var images = new ImagesCollection();
    //images.fetch();

    var iView = new ImageView({
        collection: images
    });

    images.fetch();

});

/**
 * Convert an image
 * to a base64 string
 * @param  {String}   url
 * @param  {Function} callback
 * @param  {String}   [outputFormat=image/png]
 */
function convertImgToBase64(url, callback, outputFormat) {
    var canvas = document.createElement('CANVAS'),
        ctx = canvas.getContext('2d'),
        img = new Image;
    img.crossOrigin = 'Anonymous';
    img.onload = function() {
        var dataURL;
        canvas.height = img.height;
        canvas.width = img.width;
        ctx.drawImage(img, 0, 0);
        dataURL = canvas.toDataURL(outputFormat);
        callback.call(this, dataURL);
        canvas = null;
    };
    img.src = url;
}
