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
            data: req.param("data"),
            name: req.param("name")
        };

        if(!image.data) {
            console.log("Error: no image data");
            res.status(200);
            return;
        }

        image.data = image.data.replace(/^data:image\/png;base64,/, "");
        console.log("image.name: " + image.name);

        Image.create(image).exec(function(err, model) {

            if (err) {
                console.log(err);
                res.send("Error: Shit went wrong");
            } else {

                var imgpath = path.resolve(__dirname, '../../assets/images/sample/');
                imgpath += "/" + model.name + "-" + model.id + ".png";

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
                require("fs").writeFile(model.file, model.data, 'base64', function(err) {
                    if (err) {
                        console.log(err);
                    } else {
                        cv.readImage(model.file, function(err, im) {
                            im.detectObject(cv.LBP_FRONTALFACE_CASCADE, {}, function(err, faces) {
				                var goodImage = false;
                                for (var i = 0; i < faces.length; i++) {
                                    console.log("faces[" + i + "].x: " + faces[i].x);
                                    var coord = faces[i];
				                    goodImage = goodImage || coord.x ;
                                    console.log(goodImage);
                                    // im.ellipse(coord.x + coord.width / 2, coord.y + coord.height / 2, coord.width / 2, coord.height / 2);
                                    im.preprocess([coord.x, coord.y], [coord.width, coord.height]);
                                }

                				if(!goodImage) {
                                    console.log("emit badImage");
                                    console.log("   img socket id: " + req.socket.id);
                					req.socket.emit('badImage', {});
                				}

				                var out_pgm = path.resolve(__dirname, '../../assets/images/out/');
                                out_pgm += "/" + model.id + ".pgm";
                                im.save(out_pgm);

                                var out_png = path.resolve(__dirname, '../../assets/images/out/');
                                out_png += "/" + model.id + ".png";
                                im.save(out_png);

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
