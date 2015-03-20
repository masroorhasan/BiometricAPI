var mkdirs = function(path, cb) {
  /** like mkdir -p to create parent folders if they don't exist
   */
  require('mkdirp')(path, function(err) {
    if (err)
      return console.error("Failed to create directory: " + path);

    cb();
  });
};

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

    testData: function() {
        return "TWFuIGlzIGRpc3Rpbmd1aXNoZWQsIG5vdCBvbmx5IGJ5IGhpcyByZWFzb24sIGJ1dCBieSB0aGlz"
            + "IHNpbmd1bGFyIHBhc3Npb24gZnJvbSBvdGhlciBhbmltYWxzLCB3aGljaCBpcyBhIGx1c3Qgb2Yg"
            + "dGhlIG1pbmQsIHRoYXQgYnkgYSBwZXJzZXZlcmFuY2Ugb2YgZGVsaWdodCBpbiB0aGUgY29udGlu"
            + "dWVkIGFuZCBpbmRlZmF0aWdhYmxlIGdlbmVyYXRpb24gb2Yga25vd2xlZGdlLCBleGNlZWRzIHRo"
            + "ZSBzaG9ydCB2ZWhlbWVuY2Ugb2YgYW55IGNhcm5hbCBwbGVhc3VyZS4=";
    },

    createImageObject: function(image, imgid) {
        return {
            id: imgid,
            data: ImageService.testData().toString(),
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
                console.log("createAuthImage cb, imageid " + model.id);
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
                console.log("createSessionImage cb, imageid " + model.id);
                cb(err, imageid);
            });
        }

        // TODO *** Double check
        // Write .png file
        ImageService.writePNGImageFile(image, function(err){
            if(!err) {
                // Write .pgm file
                ImageService.writePostDetectionFile(image, function(err, pgmimagefilepath){
                    console.log("writePostDetectionFile cb");

                    if((!pgmimagefilepath) || (0 === pgmimagefilepath.length)) {
                        console.log("bad image");
                        // res.send("OK: Bad Image. Pgm not created.");
                        // res.status(200);
                        cb(err, -1);
                        return;
                    }

                    // If auth = register
            // train -> save -> load -> predict -> update current
            // else auth = login
            // load -> predict -> update current

            // Input to training: image object
            // TRAINING CODE
            var img_pgm = image;
            var pgm_path = img_pgm.metadata.path;
            var pgm_filepath = pgm_path.out + "/" + img_pgm.id + ".pgm";
            // console.log("current image, " + imagemodel.id);

            console.log("Populating training data");
            var trainingData = [];

            if(FileStructureService.existsFilePathSync(pgm_filepath)) {
                console.log("Adding file to training data: " + pgm_filepath);
                trainingData.push([userid, pgm_filepath]);
            } else {
                // Should be part of else statement
                // Get all images to train
                var auth_pgm_list = [];
                // TODO: while (auth_pgm_list == null)
                FileStructureService.getFilesRecursiveSync(pgm_path.out, auth_pgm_list, false);
                console.log("pgm list");
                console.log(auth_pgm_list);

                // Populate training data mapped to userid
                _.each(auth_pgm_list, function(filepath, index){
                    console.log("pgm index: " + index);
                    console.log("pgm path: " + filepath);

                    console.log([userid, filepath]);
                    trainingData.push([userid, filepath]);
                });
            }

            // TODO***
            // Use global face rec
            // var facerec = RecognizerService.facerec();

            // Create recognizer object
            var cv = CVService.cv;
            // var facerec = cv.FaceRecognizer.createLBPHFaceRecognizer();
            // TODO: Use larger threshold for registration?
            console.log("Using singleton facerec");
            var facerec = RecognizerService.facerec();

            // TRAINING END CODE


            // Global yml
            var globalyml = FileStructureService.getGlobalYmlDir() + "/global.yml";

            // User yml
            var useryml = FileStructureService.getUserYML(userid);
            var updated = false;

            // Check if global yml file exits
            // if(!FileStructureService.checkGlobalYmlSync()) {
            if(!FileStructureService.checkUserYMLSync(userid)) {

                console.log("training...");
                console.log(trainingData);
                facerec.trainSync(trainingData);
                // Create global .yml
                // console.log("creating global yml" + globalyml);

                // Create user .yml
                console.log("creating user yml" + useryml);

                // Save global yml
                // facerec.saveSync(globalyml);

                // Save user yml
                facerec.saveSync(useryml);


                console.log("updating yml with first image");
                facerec.updateSync(trainingData);

                updated = true;
            } else {
                // console.log("global yml already exists");
                console.log("user yml already exists");
                var imgmetadata = image.metadata;
                var imgtype = imgmetadata.imgtype;


                // TODO imgtype.data
                if(imgtype.id == 'auth' /*&& type.data == 'register'*/) {
                    // trainingData.push([userid, pgm_filepath]);
                    // facerec.updateSync(trainingData);
                    console.log("updating yml with image on registration before loading");
                    facerec.updateSync(trainingData);
                }

            }

            // RECOGNITION CODE: Take the one in predict function
            console.log("running recognizer");
            if(FileStructureService.existsFilePathSync(pgm_filepath)) {
                console.log("file exists " + pgm_filepath);

                cv.readImage(pgm_filepath, function(e, im){

                    // console.log("loading global yml");
                    // facerec.loadSync(globalyml);

                    console.log("loading user yml");
                    facerec.loadSync(useryml);

                    var predictiondata = facerec.predictSync(im);
                    console.log(predictiondata);

                    // console.log("updating face rec of current image");
                    // facerec.updateSync(trainingData);
                });
            }

            // TODO
            // if(!updated) {
            //     console.log("updating yml with current image");
            //     facerec.updateSync(trainingData);
            // }

            // return;

            // var prediction = facerec.predictSync(image); // must be cb value of cv.readImage
            // console.log(prediction);


            // Update image, session and user table for cv values
            // TODO
            // Update image mapping for id to update cv values
            // Update user mapping for userid to update cv values

                });
            }
        });

        console.log("after ImageService.writePNGImageFile(image)");

        return;
    },

    createAuthImage: function(image, userid, cb) {

        // Set ES required fields
        var data = image.data;
        var metadata = image.metadata;
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
            UserImage.create(userimage).exec(function(err, userimagemodel) {
                console.log("PUT userimage mapping with id " + userimagemodel.id);
            });

            // // If auth = register
            // // train -> save -> load -> predict -> update current
            // // else auth = login
            // // load -> predict -> update current

            // // Input to training: image object
            // // TRAINING CODE
            // var img_pgm = imagemodel;
            // var pgm_path = img_pgm.metadata.path;
            // var pgm_filepath = pgm_path.out + "/" + img_pgm.id + ".pgm";
            // // console.log("current image, " + imagemodel.id);

            // console.log("Populating training data");
            // var trainingData = [];

            // if(FileStructureService.existsFilePathSync(pgm_filepath)) {
            //     console.log("Adding file to training data: " + pgm_filepath);
            //     trainingData.push([userid, pgm_filepath]);
            // } else {
            //     // Should be part of else statement
            //     // Get all images to train
            //     var auth_pgm_list = [];
            //     // TODO: while (auth_pgm_list == null)
            //     FileStructureService.getFilesRecursiveSync(pgm_path.out, auth_pgm_list, false);
            //     console.log("pgm list");
            //     console.log(auth_pgm_list);

            //     // Populate training data mapped to userid
            //     _.each(auth_pgm_list, function(filepath, index){
            //         console.log("pgm index: " + index);
            //         console.log("pgm path: " + filepath);

            //         console.log([userid, filepath]);
            //         trainingData.push([userid, filepath]);
            //     });
            // }

            // // TODO***
            // // Use global face rec
            // // var facerec = RecognizerService.facerec();

            // // Create recognizer object
            // var cv = CVService.cv;
            // // var facerec = cv.FaceRecognizer.createLBPHFaceRecognizer();
            // // TODO: Use larger threshold for registration?
            // console.log("Using singleton facerec");
            // var facerec = RecognizerService.facerec();

            // // TRAINING END CODE
            // var globalyml = FileStructureService.getGlobalYmlDir() + "/global.yml";
            // var updated = false;
            // // Check if yml file exits
            // if(!FileStructureService.checkGlobalYmlSync()) {

            //     console.log("training...");
            //     console.log(trainingData);
            //     facerec.trainSync(trainingData);
            //     // Create global .yml
            //     console.log("creating yml" + globalyml);
            //     facerec.saveSync(globalyml);
            //     console.log("updating yml with first image");
            //     facerec.updateSync(trainingData);

            //     updated = true;
            // } else {
            //     console.log("global yml already exists");
            //     // trainingData = [];

            //     // console.log("pushing data");
            //     // console.log([userid, pgm_filepath]);

            //     // trainingData.push([userid, pgm_filepath]);
            //     // facerec.updateSync(trainingData);
            // }

            // // RECOGNITION CODE: Take the one in predict function
            // console.log("running recognizer");
            // if(FileStructureService.existsFilePathSync(pgm_filepath)) {
            //     console.log("file exists " + pgm_filepath);

            //     cv.readImage(pgm_filepath, function(e, im){
            //         console.log("loading yml");
            //         facerec.loadSync(globalyml);

            //         var predictiondata = facerec.predictSync(im);
            //         console.log(predictiondata);

            //         console.log("updating face rec of current image");
            //         facerec.updateSync(trainingData);
            //     });
            // }

            // // TODO
            // // if(!updated) {
            // //     console.log("updating yml with current image");
            // //     facerec.updateSync(trainingData);
            // // }

            // // return;

            // // var prediction = facerec.predictSync(image); // must be cb value of cv.readImage
            // // console.log(prediction);


            // // Update image, session and user table for cv values
            // // TODO
            // // Update image mapping for id to update cv values
            // // Update user mapping for userid to update cv values

        });
    },

    writePNGImageFile: function(image, cb) {
        console.log("ImageService.writePNGImageFile");

        var imgdata = image.data;

        // console.log("imgdata " + imgdata);

        var metadata = image.metadata;
        var imgpath = metadata.path;
        var imgfilepath = imgpath.sample + "/" + image.id + ".png";
        console.log("saving png image, path = " + imgfilepath);

        var err = false;
        cb(err);

        // TODO: consider making writeFileSync
        // require("fs").writeFile(imgfilepath, imgdata.toString(), 'base64', function(err) {
        //     if(err) {
        //         // imageSaved = false;
        //         console.log("Failed to save png image");
        //     } else {
        //         // imageSaved = true;
        //         console.log("Saved png image");
        //         cb(err);
        //     }
        //     // callback(imageSaved, current_time, image);
        // });
    },

    writePostDetectionFile: function(image, cb) {
        console.log("writePostDetectionFile");
        // Import cv
        var cv = CVService.cv;
        var imgdata = image.data;

        var metadata = image.metadata;
        var imgpath = metadata.path;

        var imgfilepath = imgpath.sample + "/" + image.id + ".png";
        console.log("reading png image, path = " + imgfilepath);

        // READ png image
        cv.readImage(imgfilepath, function(err, im) {

            console.log("cv.readImage callback");

            im.detectObject(cv.LBP_FRONTALFACE_CASCADE, {}, function(err, faces) {

                console.log("im.detectObject callback");

                // TODO: ********* Hanlde faces == null && faces.length > 1 ********
                // Test with assets/images/sample/auth/704.png
                console.log(faces);

                if(!faces || _.isEmpty(faces) == true) {
                    console.log("No faces detected: UNKNOWN state");
                    cb(err, "");
                    return;
                }

                if(faces.length > 1) {
                    console.log("Multiple faces detected: MULTIPLE state");
                }

                // Max area of face
                var face = _.chain(faces)
                            .sortBy(function(coord){
                                return coord.x * coord.y;
                            })
                            .last()
                            .value();

                console.log("face x " + face.x + ", y " + face.y);
                console.log("x+width/2 : " + (face.x+(face.width/2)));
                console.log("y+height/2 : " + (face.y+(face.height/2)));

                if (face.x > 0 && face.y > 0) {
                    console.log("Single face detected");
                    im.preprocess([face.x, face.y], [face.width, face.height]);
                }

                /*
                // var goodImage = false;
                for (var i = 0; i < faces.length; i++) {
                    console.log("faces[" + i + "].x: " + faces[i].x);
                    var coord = faces[i];
                    console.log(coord);

                    // matrix.inspect
                    // goodImage = goodImage || coord.x > -1;
                    // console.log(goodImage);
                    // im.ellipse(coord.x + coord.width / 2, coord.y + coord.height / 2, coord.width / 2, coord.height / 2);

                    // TODO: verify upper bound with resizing
                    if (coord.x > -1) {
                        im.preprocess([coord.x, coord.y], [coord.width, coord.height]);
                    }
                }
                */

                var pgmfilepath = imgpath.out + "/" + image.id + ".pgm";
                console.log("saving pgm image, path = " + pgmfilepath);

                // Save pgm file
                im.save(pgmfilepath);

                cb(err, pgmfilepath);
            });
        });
    },

    createSessionImage: function(image, userid, sessionid, cb) {
        // PUT Image mapping for imageid
        // PUT UserImage mapping for userid, imageid

        // PUT Session mapping for sessionid
        // PUT UserSession mapping for userid, sessionid
        // PUT SessionImage mapping for imageid, sessionid
    },

    recognize: function(pgmfilepath, callback) {
        var path = require('path');
        var cv = CVService.cv;

        // console.log("image in recog: " + image);
        var imagefilepath = pgmfilepath; //"../../assets/facerec/facedb/custom/p1/" + 3 + ".pgm";
        console.log("imagefilepath in recognize: " + imagefilepath);
        // TODO***
        // Use global face rec
        var facerec = RecognizerService.facerec();
        // var facerec = cv.FaceRecognizer.createLBPHFaceRecognizer();
        // var facerec = RecognizerService.facerec();

        // TODO: move training to CV/Session service
        var xmlfile = path.resolve(__dirname, "../../assets/facerec/faces.xml");
        var trainingData = [];

        if(!require('fs').existsSync(xmlfile)) {
            console.log("xml does not exist");
            for (var i = 0; i < 2; i++) {
                for (var j = 0; j < 3; j++) {
                    var filepath = "../../assets/facerec/facedb/custom/p" + i + "/" + j + ".pgm";
                    console.log("pushing file to training set");
                    console.log([i, path.resolve(__dirname, filepath)]);
                    trainingData.push([i, path.resolve(__dirname, filepath)]);
                }
            }

            console.log("training...");
            facerec.trainSync(trainingData);
            facerec.saveSync(xmlfile);

        } else {
            // trainingData = [];
            // var filepath = "../../assets/facerec/facedb/custom/p0/" + 3 + ".pgm";
            // console.log("pushing filepath, " + filepath);
            // trainingData.push([0, path.resolve(__dirname, imagefilepath)]);

            // trainingData = [];
            // trainingData.push([1, path.resolve(__dirname, imagefilepath)]);
            // facerec.updateSync(trainingData);

            // console.log(filepath);
            // facerec.trainSync(trainingData);
            // facerec.updateSync(trainingData);
        }


        // Prediction code
        var facerec = RecognizerService.facerec();
        cv.readImage(path.resolve(__dirname, imagefilepath), function(err, im) {

            console.log("loading xml");
            facerec.loadSync(xmlfile);

            var prediction = facerec.predictSync(im);
            console.log(prediction);

            if(require('fs').existsSync(xmlfile)) {
                console.log("updating xml with ");
                console.log([1, path.resolve(__dirname, imagefilepath)]);

                trainingData = [];
                trainingData.push([1, path.resolve(__dirname, imagefilepath)]);
                facerec.updateSync(trainingData);
            }


            callback(prediction);
        });
    },

    detect: function(image, current_time, callback) {
        var path = require('path');
        var cv = CVService.cv;
        var _ = require('underscore');

        cv.readImage(image.file, function(err, im) {
            im.detectObject(cv.LBP_FRONTALFACE_CASCADE, {}, function(err, faces) {

                // TODO ***
                // Handle faces.length > 1
                // Handle image dimensions + coords before resize

                console.log(faces);

                if(!faces || _.isEmpty(faces) == true) {
                    console.log("No faces detected: UNKNOWN state");
                    var pgmfilenotfound = "";
                    callback(pgmfilenotfound);
                    return;
                }

                if(faces.length > 1) {
                    console.log("Multiple faces detected: MULTIPLE state");
                }

                // Max area of face
                var face = _.chain(faces)
                            .sortBy(function(coord){
                                return coord.x * coord.y;
                            })
                            .last()
                            .value();

                console.log("face x " + face.x + ", y " + face.y);
                console.log("x+width/2 : " + (face.x+(face.width/2)));
                console.log("y+height/2 : " + (face.y+(face.height/2)));

                if (face.x > 0 && face.y > 0) {
                    console.log("Single face detected");
                    im.preprocess([face.x, face.y], [face.width, face.height]);
                }

                /*
                var goodImage = false;
                for (var i = 0; i < faces.length; i++) {
                    console.log("faces[" + i + "].x: " + faces[i].x);
                    var coord = faces[i];
                    goodImage = goodImage || coord.x > -1;
                    // console.log(goodImage);
                    console.log([coord.x, coord.y], [coord.width, coord.height]);
                    // im.ellipse(coord.x + coord.width / 2, coord.y + coord.height / 2, coord.width / 2, coord.height / 2);
                    if (coord.x > -1) {
                        im.preprocess([coord.x, coord.y], [coord.width, coord.height]);
                    }
                }
                */

                var out_pgm = path.resolve(__dirname, '../../assets/images/out/auth/');
                mkdirs(out_pgm, function() {
                  out_pgm += "/" + current_time + ".pgm"; // UserService.getUserid() + SessionService.getSessionid();
                  console.log("Saving image " + out_pgm);

                  im.save(out_pgm);
                  callback(out_pgm);
              });
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
        mkdirs(imgpath, function() {
          imgpath += "/" + current_time + ".png"; // {session-id_session-date_user-id_img-num}
          image.file = imgpath;

          console.log("Saving png image " + imgpath);

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
