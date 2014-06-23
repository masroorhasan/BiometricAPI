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

                this.socket.on("image", _.bind(function(msg) {
                    var m = msg.uri.split("/").pop();
                    if (m === "create") {
                        this.add(msg.data);
                    } else if (m === "update") {
                        this.get(msg.data.id).set(msg.data);
                    } else if (m === "destroy") {
                        this.remove(this.get(msg.data.id));
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
    	defaults : {
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
        "click button.captureImage": "captureImage"
    },
    initialize: function() {
        this.collection.on('add', this.render, this);
        this.render();
    },
    template: _.template("<div>ID: <%= id %> <div id='canvasHolder'></div><input id='imageToForm'/><img id='preview'/><img src='<%= imageData %>' style='min-width:80px;min-height:80px;'></img><button class='captureImage'>Capture</button></div>"),
    render: function() {
        this.$el.html("");
        this.collection.each(function(image) {
            this.$el.append(this.template(image.toJSON()));
        }, this)
    },
    captureImage: function() {
        var canvas = this.$el.createElement('canvas ');
        canvas.id = 'hiddenCanvas';
        //add canvas to the body element
        this.$el.appendChild(canvas);
        //add canvas to #canvasHolder
        $('#canvasHolder').appendChild(canvas);
        var ctx = canvas.getContext('2d ');
        canvas.width = video.videoWidth / 4;
        canvas.height = video.videoHeight / 4;
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        //save canvas image as data url
        dataURL = canvas.toDataURL();

        newImage(dataURL);


        //set preview image src to dataURL
        this.$el('#preview').attr('src', dataURL);
        // place the image value in the text box
        this.$el('#imageToForm').val(dataURL);
    }


});

var ImagesCollection = SailsCollection.extend({
    sailsCollection: 'image',
    model: ImageModel
});

$(function() {
	var images = new ImagesCollection();
	//images.fetch();

	var iView = new ImageView({ collection: images });

	images.fetch();
});

/**
 * Convert an image 
 * to a base64 string
 * @param  {String}   url         
 * @param  {Function} callback    
 * @param  {String}   [outputFormat=image/png]           
 */
function convertImgToBase64(url, callback, outputFormat){
    var canvas = document.createElement('CANVAS'),
        ctx = canvas.getContext('2d'),
        img = new Image;
    img.crossOrigin = 'Anonymous';
    img.onload = function(){
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
/*
var socket = io.connect();

convertImgToBase64('/images/mona.png', function(base64) {
	socket.post('/image', { imageName: 'test-1', imageData: base64 }, function( res ) {
		console.log('worked?');
	});
});*/

/** Image Capture ***/
// taken from http://demo.creative-jar.com/html5-camera/

var dataURL;
var video;

//http://coderthoughts.blogspot.co.uk/2013/03/html5-video-fun.html - thanks :)
function setup() {
    navigator.myGetMedia = (navigator.getUserMedia ||
        navigator.webkitGetUserMedia ||
        navigator.mozGetUserMedia ||
        navigator.msGetUserMedia);
    navigator.myGetMedia({
        video: true
    }, connect, error);
}

function connect(stream) {
    video = document.getElementById("video");
    video.src = window.URL ? window.URL.createObjectURL(stream) : stream;
    video.play();
}

function error(e) {
    console.log(e);
}

addEventListener("load", setup);

