module.exports = {
    getUser: function(req) {
        /**
         * Return the unique username of the logged in
         * user given the request object
         */
        return "masroor";
    },


    createUser: function(username, firstname, lastname) {
        console.log("AuthService.createUser");
        // var id = AuthService.getId();
        var user = {
            "index": "cognitech",
            "type": "user",
            "id": 0,    // TODO: update to autoincrement

            'username': username, 
            'firstname': firstname, 
            "lastname" : lastname, 
            "password": "foobar"
        };

        return user;
    }
};
