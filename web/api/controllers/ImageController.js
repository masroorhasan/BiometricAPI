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
        var image = {
            imageData: req.param("imageData"),
            imageName: req.param("imageName")
        };


        image.imageData = image.imageData.replace(/^data:image\/png;base64,/, "");
        // console.log("base64: " + imageData);
        console.log("image: " + image.imageName);
        // console.log("dirname: " + __dirname);

        console.log(Image);
        Image.create(image).exec(function(err, model) {

            if (err) {
                console.log(err);
                res.send("Error: Shit went wrong");
            } else {

                console.log(model);
                var imgpath = path.resolve(__dirname, '../../assets/images/sample/');
                imgpath += "/" + model.imageName + "-" + model.id + ".png";
                console.log(imgpath);

                model.file = imgpath;
                model.save(function(err) {
                    if (err) {
                        console.log(err);
                        res.send("Error: saving");
                    } else {
                        res.send("Success");
                    }
                });

                // async write
                require("fs").writeFile(model.file, model.imageData, 'base64', function(err) {
                    if (err) {
                        console.log(err);
                    } else {
                        cv.readImage(model.file, function(err, im) {
                            im.detectObject(cv.FACE_CASCADE, {}, function(err, faces) {
                                for (var i = 0; i < faces.length; i++) {
                                    console.log(faces[i]);
                                    var coord = faces[i];
                                    im.ellipse(coord.x + coord.width / 2, coord.y + coord.height / 2, coord.width / 2, coord.height / 2);
                                }
				var out = path.resolve(__dirname, '../../assets/images/out/');
				out += "/" + model.imageName + "-" + model.id + ".png";
                                im.save(out);
                            });
                        });
                    }
                });

            }

        });




        res.send("detecting...");

    }

};

module.exports = ImageController;
