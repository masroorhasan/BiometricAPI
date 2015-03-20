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
        var data = req.param("data");
        console.log("loginController data.username: "+ data.username);

        var img = {
            id: 0,
            data: "data",
            name: "name"
        };

        // var img = {
        //     id: SessionService.newImageID(req.socket),
        //     data: req.param("data"),
        //     name: req.param("name")
        // };

        if (!img.data) {
            console.log("Error: no image data");
            res.status(200);
            return;
        }

        // img.data = img.data.replace(/^data:image\/png;base64,/, "");        
        var images = [];
        images.push(ImageService.createImageObject(img, 9));

        // Test
        var image = ImageService.createImageObject(img, 9);
        AuthService.login(data.username, image);
        res.send("Response from auth/login");

        res.status(200);
    },

    register: function(req, res) {
        // array of 10 base64 image data
        var images_data = req.param("images");
        var name = req.param("name");
        console.log("registerController name: " + name.user);

        // var img = {
        //     id: SessionService.newImageID(req.socket),
        //     data: req.param("data"),
        //     name: req.param("name")
        // };

        if (images_data.length < 1) {
            console.log("Error: no image data");
            res.status(200);
            return;
        }

        // img.data = img.data.replace(/^data:image\/png;base64,/, "");

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
