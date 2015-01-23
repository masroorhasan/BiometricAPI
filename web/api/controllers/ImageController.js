/**
 * ImageController
 *
 * @description :: Server-side logic for managing images
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

var ImageController = {

    main: function(req, res) {
        res.view();
    },

    test: function(req, res) {
        res.view();
    },

    capture: function(req, res){
        // Capture image
        // ImageService.create()
        // 
    },

    create: function(req, res) {
        
        var image = {
            data: req.param("data"),
            name: req.param("name")
        };

        if (!image.data) {
            console.log("Error: no image data");
            res.status(200);
            return;
        }

        image.data = image.data.replace(/^data:image\/png;base64,/, "");

        var imageToSave;
        ImageService.create(req, image, function(img) {
            imageToSave = img;
        
        
            console.log("image to save: " + imageToSave);

            Image.create(imageToSave).exec(function(err, model) {

                if (err) {
                    console.log(err);
                    res.send("Error: Shit went wrong");
                } else {
                    console.log("Saving to elastic search - image collection");
                    console.log("image to save id: " + model.id);
                }
            });
    });
  }

};

module.exports = ImageController;
