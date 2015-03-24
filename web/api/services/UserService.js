module.exports = {
    getUser: function(req) {
        /**
         * Return the unique username of the logged in
         * user given the request object
         */
        return "masroor";
    },


    createUser: function(username, firstname, lastname) {
        console.log("UserService.createUser");
        var id = AuthService.getID();
        var user = {
            "index": "cognitech",
            "type": "user",
            "id": id,    // TODO: update to autoincrement

            'username': username,
            'firstname': firstname,
            "lastname" : lastname,
            "password": "foobar"
        };

        return user;
    },

    getUserByUsername: function(value, cb) {
        // console.log(value.toString());
        // console.log('getUserByUsername, username ' + value);
        User.find({
          // id: '',
          username: value.toString()
        }).exec(function(err, model) {
            if (err) console.log(err);
            // console.log(model);

            // TODO Figure out ES filtering, i.e Filter hits by username (value)
            _.each(model, function(usr){
                // console.log("user: " + usr);
                var usrname = _.property('username')(usr);
                console.log("usrname from usr property " + usrname);
                if(usrname.toString() === value.toString()) {
                    console.log(usr);
                    console.log("username matched getUserByUsername");
                    cb(err, usr);
                } else {
                  console.log("no username match found");
                  cb("no username match found", null);
                }
            });

        });

        return;
    }
};
