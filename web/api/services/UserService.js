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
      "id": id, // TODO: update to autoincrement

      'username': username,
      'firstname': firstname,
      "lastname": lastname,
      "password": "foobar"
    };

    return user;
  },

  getUserByUsername: function(username, cb) {
    // console.log(value.toString());
    // console.log('getUserByUsername, username ' + value);
    User.find({
      // id: '',
      username: username.toString()
    }).exec(function(err, model) {
      if (err) console.log(err);

      // TODO Figure out ES filtering, i.e Filter hits by username (value)
      var user = _.findWhere(model, {
        username: username
      });
      console.log("found user: %j", user);
      if (user) {
        console.log(user);
        console.log("username matched getUserByUsername");
      } else {
        console.log("no username match found");
      }
      cb(user);
    });

    return;
  }
};
