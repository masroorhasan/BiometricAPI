module.exports = {
    goodImage: function(sock) {
        var connection = SessionService.getConnection(sock);
        connection.counter = 0;
        // TODO: how to clear the flag timer?
    },

    badImage: function(sock) {
        var connection = SessionService.getConnection(sock);

        connection.counter++;
        connection.last_modified = new Date();

        // if we've gotten more than 4 bad in a row
        // send a preflag event
        if (connection.counter >= 4 && !connection.flagging) {
            sock.emit('preFlag');
            connection.flagging = true;
        }
    },

    create: function(req, image, callback) {
        var path = require('path');
        var socket = req.socket;
        var io = sails.io;
        var cv = CVService.cv;

        var currentDate = new Date();
        var current_time = 0;
        current_time += currentDate.getMilliseconds();

        // Save (physical) img
        var imgpath = path.resolve(__dirname, '../../assets/images/sample/');
        // UserService.getUserid() + SessionService.getSessionid();
        imgpath += "/" + current_time + ".png"; // {session-id_session-date_user-id_img-num}
        image.file = imgpath;

        //
        var imageToSave = {
            id: current_time,
            type: "image"
        };

        // Run cv transformations (From cv service)
        // async write
        require("fs").writeFile(image.file, image.data, 'base64', function(err) {
            if (err) {
                console.log(err);
            } else {
                cv.readImage(image.file, function(err, im) {
                    im.detectObject(cv.LBP_FRONTALFACE_CASCADE, {}, function(err, faces) {
                        var goodImage = false;
                        for (var i = 0; i < faces.length; i++) {
                            console.log("faces[" + i + "].x: " + faces[i].x);
                            var coord = faces[i];
                            goodImage = goodImage || coord.x > -1;
                            console.log(goodImage);
                            // im.ellipse(coord.x + coord.width / 2, coord.y + coord.height / 2, coord.width / 2, coord.height / 2);
                            if (coord.x > -1) {
                                im.preprocess([coord.x, coord.y], [coord.width, coord.height]);
                            }
                        }

                        if (!goodImage) {
                            //io.sockets.in('room-' + socket.id).emit('badImage', {});
                            ImageService.badImage(req.socket);
                            console.log("BAD IMAGE");
                            //console.log('socket id img: ' + socket.id);
                        } else {
                            console.log("GOOD IMAGE");

                            // TODO: move training to CV/Session service
                            var trainingData = [];

                            for (var i = 1; i < 6; i++) {
                                for (var j = 1; j < 6; j++) {
                                    var filepath = "../../assets/facerec/facedb/custom/s" + i + "/" + j + ".pgm";
                                    trainingData.push([i, path.resolve(__dirname, filepath)]);
                                }
                            }

                            var facerec = cv.FaceRecognizer.createEigenFaceRecognizer();
                            // console.log("training...");
                            facerec.trainSync(trainingData);
                            // console.log("done training");

                            //io.sockets.in('room-' + socket.id).emit('goodImage', {});
                            ImageService.goodImage(req.socket);
                            console.log('socket id img: ' + socket.id);

                            var out_pgm = path.resolve(__dirname, '../../assets/images/out/');
                            out_pgm += "/" + current_time + ".pgm"; // UserService.getUserid() + SessionService.getSessionid();
                            im.save(out_pgm);

                            var predictedImg = {};

                            predictedImg = facerec.predictSync(out_pgm);
                            console.log(predictedImg);

                            imageToSave.path = out_pgm;
                            imageToSave.predicted = predictedImg;

                            //console.log("image to save in cb: " + imageToSave);

                            callback(imageToSave);
                        }
                    });
                });
            }
        });
    }
};
