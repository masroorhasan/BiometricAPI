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
        var images = [];
        images.push(ImageService.createImageObject(img, 3));

        // Test
        var image = ImageService.createImageObject(img, 3);
        AuthService.login(data.username, image);
        res.send("Response from auth/login");

        res.status(200);
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
        var user_obj = UserService.createUser(data.id, data.username, data.firstname, data.lastname);
        console.log("user obj username " + user_obj.username);

        // Get three images (captures from user)
        // Simulation
        var images = [];

        // Create image object
        var id = 0;
        for(id = 0; id < 3; id++){
            var image = ImageService.createImageObject(img, id);
            images[id] = image;
            // console.log(images[id].data);
        }


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