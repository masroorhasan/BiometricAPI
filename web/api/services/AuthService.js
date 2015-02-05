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
        if(AuthService.authUser(username, image)) {
            return Sessions.newSession(username);
        }
        // try again shit
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

                // Create user fs
                FileStructureService.createUserDir(userid);
                FileStructureService.createAuthDir(userid);
                FileStructureService.createSessionsDir(userid);
                // FileStructureService.createYMLDir(userid);
                console.log("Image processing starts");
                // Store Image, UserImage
                _.each(images, function(image, id/*, imagelist*/) {
                    
                    // console.log("image id " + id);
                    // console.log(image);
                    var type = {
                        "id": "auth", 
                        "data": "register"
                    };
                    
                    ImageService.createImage(image, type, userid, function(err, imageid, image){
                        console.log("Image created, id " + imageid);
                    });
                });
            }
        });
        
        // Create YML
        // Store CV, UserCV mapping

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
        // Create User dir with user id
        // 
        // return userid
    },

    addImage: function(image, type) {
        // Create Image Mapping with image object
        
        if(type == 'register') {

        }
    },

    addUserImage: function(userid, imageid) {
        // Create UserImage Mapping with userimage object
    },

    authUser: function(username, image) {
        /**
         * authenticate user
         * returns: boolean
         */
        var io = sails.io;
        var cv = CVService.cv;

        // Get and match username
        var userMatched = false;
        // TODO: UserService.get(...)

        // Get and match image
        var imageMatched = false;

        // 1. Create actual .png image
        // 2. Run detection using .png image and create .pgm image
        // 3. Run recognition with detected .pgm image
        // 4. Verify the result of recognition is the same user as username
        
        //var rawImgPath = '../../assets/images/sample/auth/';
        // Create png file
        ImageService.writePNGFile(image, function(imageSaved, current_time, image){
            if(imageSaved)
            {
                //var processedImgPath = '../../assets/images/out/auth/';
                // Detection
                ImageService.detect(image, current_time, function(pgmImage) {
                    // Recognition
                    ImageService.recognize(pgmImage, function(prediction){
                        // Verify if prediction.id == userid
                        console.log(prediction);
                    });
                });
            }
        });

        return userMatched && imagedMatched;
    },

    logout: function() {

    }
};
