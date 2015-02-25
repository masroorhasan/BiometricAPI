var Session = function(username, session_id) {
    this.username = username;
    this.session_id = session_id;
};

var Sessions = function() {
    /**
     * Session in-memory cache
     * key is the session id
     */
    var $this = this;
    $this.sessions = {};
    $this.next_id = 0;
    $this.newSession = function(username) {
        var id = $this.next_id++;
        var sess = new Session(username, id);
        return sessions[id] = sess;
    };

    $this.getSession = function(session_id) {
        return $this.sessions[session_id] || null;
    };

    $this.updateSession = function(session, session_id) {
        session_id = session_id || session.id;
        $this.sessions[session_id] = session;
        // or use angular.extend?
    };
};

module.exports = {

    login: function(username, image) {
        // var image = images[0];

        // console.log(images);
        console.log("AuthService.login, username = " + username);
        console.log("Image from authController/login " + image);
        console.log("Image processing starts");


        AuthService.authUser(username, image, function(err, matched){
            if(matched == true) {
                console.log("AuthService login: success");
                return true;

                // TODO Error
                // return Sessions.newSession(username);    
            } else {
                console.log("AuthService login: failure");
            }
        });
       
        // if(AuthService.authUser(username, image)) {
        //     console.log("AuthService login: success");
        //     return Sessions.newSession(username);    
        // } else {
        //     console.log("AuthService login: failure");
        // }
    },

    register: function(user, images, cb) {
        console.log("AuthService.register");
        
        var _ = require("underscore");

        // var user_id = 0;
        AuthService.addUser(user, function(err, userid) {
            if (err) {
                console.log(err);
            } else {
                console.log("userid returned to register: " + userid);
                // user_id = userid;

                cb(err, userid);

                // TODO: Move outside callback?

                // Create user fs
                FileStructureService.createUserDir(userid);
                FileStructureService.createAuthDir(userid);
                FileStructureService.createSessionsDir(userid);
                if(!FileStructureService.checkExistsDirSync(FileStructureService.getGlobalYmlDir()))
                    FileStructureService.createGlobalYMLDirSync();

                console.log("Image processing starts");
                var imgtype = {
                    "id": "auth", 
                    "data": "register"
                };

                // Store Image, UserImage
                _.each(images, function(image, id/*, imagelist*/) {
                    ImageService.createImage(image, imgtype, userid, function(err, imageid, image){
                        console.log("Image created, id " + imageid);
                    });
                });

                console.log("After underscore images[] loop");
            }
        });
        
        // Create YML
        // Store CV, UserCV mapping
        console.log("outside AuthService.addUser cb");

        // Create user fs
        // FileStructureService.createUserDir(user.id);
        // FileStructureService.createAuthDir(user.id);
        // FileStructureService.createSessionsDir(user.id);
        // // FileStructureService.createYMLDir(userid);
        // console.log("Image processing starts");
        // // Store Image, UserImage
        // _.each(images, function(image, id/*, imagelist*/) {
            
        //     // console.log("image id " + id);
        //     // console.log(image);
        //     var type = {
        //         "id": "auth", 
        //         "data": "register"
        //     };
            
        //     ImageService.createImage(image, type, user.id, function(err, imageid, image){
        //         console.log("Image created, id " + imageid);
        //     });
        // });

        // 
        // var cvid = createCV(userid);
        // 
        // var usercvid = createUserCV(cvid, userid, function(success) {
        // 
        // });
        // return user_id;
    },

    addUser: function(user, cb) {
        console.log("AuthService.AddUser");

        // Put User Mapping with user user object
        User.create(user).exec(function(err, model) {
            if (err) {
                console.log(err);
            } else {
                console.log("user saved to ES, id: " + model.id);
                cb(err, model.id);
            }
        });   
        

        return 0;
    },

    authUser: function(username, image, logincb) {
        /**
         * authenticate user
         * returns: boolean
         */
        var io = sails.io;
        var cv = CVService.cv;

        console.log("AuthService authUser");
        console.log("authUser, username ", username);
        console.log("authUser, image " + image);
        // Get and match username
        var userMatched = false;
        // TODO: UserService.get(...)
        // Get user id from username
        UserService.getUserByUsername(username, function(err, user) {
            if(!err) {
                // console.log("found username " + username + " with userid " + user.id);
                // TODO: Filter after query
                
                // console.log("user found in authservice: " + user);
                if(username != user.username) {
                    console.log("Username does not match, found: " + user.username);
                    console.log(err);
                    // return false;
                    logincb(err, false);
                }

                userMatched = true;
                
                // TODO: Modularize code *********
                var imgtype = {
                    "id": "auth", 
                    "data": "login"
                };

                // console.log(image.data);

                // Update type
                var metadata = image.metadata;
                metadata.imgtype += imgtype.id;

                // Update path
                var userdir = FileStructureService.getUserDir(user.id);
                
                var path_out = "";
                var path_sample  = "";
                var imgpath = metadata.path;

                path_out += FileStructureService.getAuthDir(user.id) + "/out";
                path_sample += FileStructureService.getAuthDir(user.id) + "/sample";

                imgpath.out += path_out;
                imgpath.sample += path_sample;

                metadata.path = imgpath;
                image.metadata = metadata;

                console.log("Image after update: " + image);
                // TODO: 
                // Write .png and .pgm files
                // Run training (?) and predictor methods
                // Check user.id == predictor.id ?

                // Write .png and .pgm files
                ImageService.writePNGImageFile(image, function(err){
                    if(!err) {
                        // Write .pgm file
                        ImageService.writePostDetectionFile(image, function(err){
                            // console.log("writePostDetectionFile cb");

                            // TODO: Call training and precitor methods
                            console.log("Finished writing pgm file");
                            // var success = userMatched && imagedMatched;
                            
                            // Recognition CODE: *************
                            // Create recognizer object
                            var cv = CVService.cv;
                            // var facerec = cv.FaceRecognizer.createLBPHFaceRecognizer();
                            var facerec = RecognizerService.facerec();

                            var metadata = image.metadata;
                            var imgpath = metadata.path;
                            var pgm_filepath = imgpath.out + "/" + image.id + ".pgm";

                            // console.log(pgm_filepath);
                            

                            console.log("running recognizer");
                            if(FileStructureService.existsFilePathSync(pgm_filepath)) {
                                console.log("file exists " + pgm_filepath);

                                cv.readImage(pgm_filepath, function(e, im){    
                                    
                                    console.log("cv.readImage");
                                    // Image match
                                    var imageMatched = false;

                                    // Load global yml
                                    // var globalyml = FileStructureService.getGlobalYmlDir() + "/global.yml";
                                    // facerec.loadSync(globalyml);
                                    
                                    var useryml = FileStructureService.getUserYML(user.id);
                                    console.log("loading user yml " + useryml);
                                    facerec.loadSync(useryml);

                                    var predictiondata = facerec.predictSync(im);
                                    console.log(predictiondata);

                                    imageMatched |= user.id == predictiondata.id;

                                    console.log("user.id " + user.id);
                                    console.log("predictiondata.id " + predictiondata.id);
                                    console.log("imageMatched " + imageMatched);

                                    // Update yml
                                    
                                    var matched = ((imageMatched == 1) && (userMatched == 1));
                                    console.log("matched: " + matched);


                                    if(matched == true) {
                                        facerec.updateSync([user.id, pgm_filepath]);
                                    }

                                    logincb(err, matched);
                                    // return ((imageMatched == 1) && (userMatched == 1));
                                });    
                            }
                            // else {

                            //     // TODO: Couldnt find file
                            //     return false;
                            // }
                        });    
                    } 
                    // else {
                    //     return false;
                    // }
                });  
                      
            } 
            // else {
            //     console.log("username " + username + " not found");
            //     return userMatched;
            // }

        });
    },

    logout: function() {

    }
};
