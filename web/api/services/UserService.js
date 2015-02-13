module.exports = {
    getUser: function(req) {
        /**
         * Return the unique username of the logged in
         * user given the request object
         */
        return "masroor";
    },


    createUser: function(id, username, firstname, lastname) {
        console.log("AuthService.createUser");
        // var id = AuthService.getId();
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

        // console.log('getUserByUsername, username ' + value);
        User.find({
          // id: '',
          username: value.toString()
        }).exec(function(err, model) {
            if (err) console.log(err);
            console.log(model);
            var user = _.first(model);
            // console.log(user);

            cb(err, user);

            return model;
        });

        return;
    }
};
