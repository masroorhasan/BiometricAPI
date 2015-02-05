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
    
    register: function(req, res) {
        var data = req.param("data");
        console.log("registerController data.username: "+ data.username);

        var img = {
            id: 0, // SessionService.newImageID(req.socket),
            data: "data", // req.param("data"),
            name: "name" //req.param("name")
        };

        if (!img.data) {
            console.log("Error: no image data");
            res.status(200);
            return;
        }

        // img.data = img.data.replace(/^data:image\/png;base64,/, "");

        // Create user object
        var user_obj = UserService.createUser(data.username, data.firstname, data.lastname);
        console.log("user obj username " + user_obj.username);

        // Get three images (captures from user)
        // Simulation
        var images = [];

        // Create image object
        var id = 0;
        for(id = 0; id < 3; id++) {
            var image = ImageService.createImageObject(img, id);
            images[id] = image;
            console.log(images[id].data);
        }

        AuthService.register(user_obj, images, function(err, user_id/*, imageids, usercvid*/){
            if(err) {
                console.log("err " + err);
                res.status(200);
            } else {
                console.log("registerController user_id " + user_id);
                res.status(200);
            }
        });
        

        res.status(200);
    }
};

module.exports = AuthController;