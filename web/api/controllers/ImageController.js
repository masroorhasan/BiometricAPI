/**
 * ImageController
 *
 * @description :: Server-side logic for managing images
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

var ImageController = {

    main: function(req, res) {
        res.view();
    },

    test: function(req, res) {
	res.view();
    },

    create: function(req, res) {
        var path = require('path');
        var cv = CVService.cv;
	var imageData = req.param("imageData");
	var imageName = req.param("imageName");
	

        var base64Data = imageData.replace(/^data:image\/png;base64,/, "");
    	// console.log("base64: " + imageData);
    	console.log("image: " + imageName);
    	// console.log("dirname: " + __dirname);
    
        var imgpath = path.resolve(__dirname, '../../assets/images/sample/test.png');
        console.log(imgpath);

        require("fs").writeFileSync(imgpath, base64Data, 'base64', function(err) {
            console.log(err);
        });

        cv.readImage(imgpath, function(err, im) {
            im.detectObject(cv.FACE_CASCADE, {}, function(err, faces) {
                for (var i = 0; i < faces.length; i++) {
                    console.log(faces[i]);
                    var coord = faces[i];
                    im.ellipse(coord.x + coord.width / 2, coord.y + coord.height / 2, coord.width / 2, coord.height / 2);
                }
                im.save(path.resolve(__dirname, '../../assets/images/out/test.png'));
            });
        });

        res.send("detecting...");
        return;

    }

};

module.exports = ImageController;
