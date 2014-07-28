var fydp = {
    socket: null
};

var SailsCollection = Backbone.Collection.extend({
    sailsCollection: "",
    sync: function(method, model, options) {
        var where = {};
        if (options.where) {
            where = {
                where: options.where
            }
        }
        if (typeof this.sailsCollection === "string" && this.sailsCollection !== "") {
            fydp.socket = io.connect();
            console.log("connect");
            fydp.socket.on("captureImage", _.bind(function(res) {
                console.log('socket: captureImage');
                this.trigger('captureImage', res);
            }, this));

            fydp.socket.on("preFlag", _.bind(function(res) {
                console.log('socket: preFlag');
                this.trigger('preFlag', res);
            }, this));

	    fydp.socket.on("badImage", function(res) {
		    console.log("badImage");
	    });

        } else {
            console.log("Error: Cannot retrieve models because property 'sailsCollection' not set on the collection");
        }
    },
    clearFlag: function() {
        if (typeof this.sailsCollection === "string" && this.sailsCollection !== "") {
            if (fydp.socket) {
                fydp.socket.emit('clearFlag', {});
            } else {
                console.log("Error: socket has not been connected");
            }
        } else {
            console.log("Error: Cannot retrieve models because property 'sailsCollection' not set on the collection");
        }
    },
    createImage: function(method, model, options) {
        if (typeof this.sailsCollection === "string" && this.sailsCollection !== "") {
            
        } else {
            console.log("Error: Cannot retrieve models because property 'sailsCollection' not set on the collection");
        }
    }

});

var ImageModel = Backbone.Model.extend({
    urlRoot: 'image',
    defaults: {
        name: null,
        data: null
    },
    url: function() {
        return this.id ? '/image/' + this.id : '/image';
    },
    sync: function(method, model, options) {
        if(method == 'create') {
            if (fydp.socket) {
                fydp.socket.post(model.url(), model);
            } else {
                console.log("Error: socket has not been connected");
            }
        } else {
            Backbone.sync(method, model, options);
        }
    }
});

var ImageView = Backbone.View.extend({
    el: '#image-container',
    events: {
        "click button.captureButton": "captureButton",
    },
    initialize: function(options) {
        this.listenTo(this.collection, 'add', this.render);
        this.listenTo(this.collection, 'captureImage', this.captureImage);
        this.listenTo(this.collection, 'preFlag', this.preFlag);
        this.setup();
    },
    captureButton: function() {
	this.captureImage();
	this.collection.clearFlag();
        this.$el.find("#note").hide();
        this.$el.hide();
    },
    captureImage: function(res) {
        console.log('captureImage');
        this.$el.find('#note').hide();
        var canvas = this.$el.find("canvas#hiddenCanvas");
        var ctx = canvas[0].getContext('2d');
        //canvas.width = this.video.videoWidth / 4;
        //canvas.height = this.video.videoHeight / 4;
        ctx.drawImage(video, 0, 0, canvas[0].width, canvas[0].height);
        //save canvas image as data url
        dataURL = canvas[0].toDataURL();

        var newImage = this.collection.create({
            id: null,
            data: dataURL,
            name: 'boop'
        });
    },
    preFlag: function(res) {
        console.log('preFlag');
        this.$el.find('#note').html("You have not taken a good picture in awhile. Please look at the camera and click capture when you are facing the camera").show();
        this.$el.show();
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
        //setTimeout(_.bind(this.startCapture, this), 5000);
    },
    error: function(e) {
        console.log(e);
    },
    startCapture: function() {
        //this.timer = setInterval(_.bind(this.captureImage, this), 5000);
        console.log('startCapture');
        this.captureImage();
        this.$el.hide();
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
    images.fetch();

    var iView = new ImageView({
        collection: images
    });

    //images.fetch();

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
        img = new Image();
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
