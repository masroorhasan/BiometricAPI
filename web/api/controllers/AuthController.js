var derp = 0;

var AuthController = {

    main: function(req, res) {
        res.view();
    },

    authTest: function(req, res) {

        res.status(200);
        res.send((new Date()).getTime().toString());
        setTimeout(function(){
            console.log((new Date()).getTime().toString());
        }, 25000);

        console.log((new Date()).getTime().toString());
    },

    login: function(req, res) {
        var data = req.param("image");
        var username = req.param("name");
        console.log("loginController data.username: " + username);

        if (!data) {
            console.log("Error: no image data");
            res.status(200);
            return;
        }

        data = data.replace(/^data:image\/png;base64,/, "");
        var img = ImageService.createImageObject(username, data, derp++);

        var success =

        AuthService.login(username, img, function(matched) {
          if (!matched) {
            console.log("failed login");
            res.status(401).json({msg: 'Failed login', error: 'failed login'});
            //res.send("Login failure");
          } else {
            //res.send("Response from auth/login");
            console.log("success login");
            res.status(200).json({msg: 'Successful login'});
          }
        });
    },

    testreg: function(req, res) {
      console.log("name: %j", req.param("name"));
      console.log("params: %j", req.params);
      res.send(200);
    },

    register: function(req, res) {
        // array of 10 base64 image data
        var name = req.param('name');
        var images_data = req.param('images');
        console.log("registerController name: %j", name);

        if (images_data.length < 1) {
            console.log("Error: no image data");
            res.status(200);
            return;
        }

        // Create user object
        var user_obj = UserService.createUser(name.user, name.first, name.last);
        console.log("user obj username " + user_obj.username);

        // Get three images (captures from user)
        // Simulation
        var images = [];

        // Create image object
        require('underscore').each(images_data, function(elem, idx, list) {
          elem = elem.replace(/^data:image\/png;base64,/, "");
          images.push(ImageService.createImageObject(user_obj.username, elem, idx));
        });


        // AuthService.register:
        // Save images (pngs and pgms) - ImageService
        // Save users and images in ES
        //

        AuthService.register(user_obj, images, function(err, user_id/*, imageids, usercvid*/){
            if(err) {
                console.log("err " + err);
                res.status(200);
            } else {
                console.log("registerController user_id " + user_id);
                res.status(200);
                res.send("Response from auth/register");
            }
        });

        res.status(200);
    }
};

module.exports = AuthController;
