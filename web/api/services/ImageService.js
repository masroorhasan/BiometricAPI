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

    createImageObject: function(image, imgid) {
        return {
            id: imgid,
            data: image.data + imgid,
            metadata: {
                name: image.name + imgid,
                imgtype: "",
                path: {
                    out: "",
                    sample: ""  
                },
                cognidata: {
                    distance: 0,
                    predicted: 0,
                    flag: false
                }
            }
        };
    },

    createImage: function(image, type, userid, cb) {

        // Update type
        var metadata = image.metadata;
        metadata.imgtype += type.id;

        // Update path
        var userdir = FileStructureService.getUserDir(userid);
        
        var path_out = "";
        var path_sample  = "";
        var imgpath = metadata.path;
        
        if(type.id == 'auth' && (type.data == 'register' || 'login')) {
            path_out += FileStructureService.getAuthDir(userid) + "/out";
            path_sample += FileStructureService.getAuthDir(userid) + "/sample";

            imgpath.out += path_out;
            imgpath.sample += path_sample;

            metadata.path = imgpath;
            image.metadata = metadata;

            ImageService.createAuthImage(image, userid, function(err, model) {
                console.log("createAuthImage cb, userid " + model.id);
                cb(err, model.id, model);
            });

        } else if(type.id == 'session' && sessionid != null) {
            path_out += FileStructureService.getSessionDirByID(userid, type.data) + "/out";
            path_sample += FileStructureService.getSessionDirByID(userid, type.data) + "/sample";

            imgpath.out = path_out;
            imgpath.sample = path_sample;

            metadata.path = imgpath;
            image.metadata = metadata;

            ImageService.createSessionImage(image, userid, sessionid, function(err, imageid){
                cb(err, imageid);
            });
        }
        
        return;
    },

    createAuthImage: function(image, userid, cb) {
        
        // Set ES required fields
        image.index = "cognitech";
        image.type = "image";
        
        // PUT UserImage mapping for user id
        Image.create(image).exec(function(err, imagemodel) {
            
            console.log("PUT image mapping with id " + imagemodel.id);

            cb(err, imagemodel);

            var userimage = {};
            userimage.index = "cognitech";
            userimage.type = "image";
            userimage.id = imagemodel.id;    // Same as imageid
            userimage.userid = userid;
            userimage.imageid = imagemodel.id;

            // PUT Image mapping for image id
            UserImage.create(userimage).exec(function(err, userimagemodel){
                console.log("PUT userimage mapping with id " + userimagemodel.id);
            });
        });

        // TODO
        // Save png image, detected image
        // Update image, session and user table for cv values
    },



    createSessionImage: function(image, userid, sessionid, cb) {
        // PUT Image mapping for imageid
        // PUT UserImage mapping for userid, imageid
        
        // PUT Session mapping for sessionid
        // PUT UserSession mapping for userid, sessionid
        // PUT SessionImage mapping for imageid, sessionid
    },

    recognize: function(image, callback) {
        var path = require('path');
        var cv = CVService.cv;

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

        var prediction = facerec.predictSync(image);
        console.log(prediction);

        callback(prediction);
    },

    detect: function(image, current_time, callback) {
        var path = require('path');
        var cv = CVService.cv;

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

                var out_pgm = path.resolve(__dirname, '../../assets/images/out/auth/');
                out_pgm += "/" + current_time + ".pgm"; // UserService.getUserid() + SessionService.getSessionid();
                console.log("Saving image " + out_pgm);

                im.save(out_pgm);
                callback(out_pgm);
            });
        });
    }, 

    writePNGFile: function(image, callback){
        var path = require('path');
        var imageSaved = false;

        var currentDate = new Date();
        var current_time = 0;
        current_time += currentDate.getMilliseconds();

        var imgpath = path.resolve(__dirname, '../../assets/images/sample/auth/');
        imgpath += "/" + current_time + ".png"; // {session-id_session-date_user-id_img-num}
        image.file = imgpath;

        require("fs").writeFile(image.file, image.data, 'base64', function(err) {
            if(err) {
                imageSaved = false;
                console.log("Failed to save png image");
            } else {
                imageSaved = true;
                console.log("Saved png image");
            }

            callback(imageSaved, current_time, image);
        });
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
