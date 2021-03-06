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


    create: function(req, res) {
        var image = {
            id: SessionService.newImageID(req.socket),
            data: req.param("data"),
            name: req.param("name")
        };

        if (!image.data) {
            console.log("Error: no image data");
            res.status(200);
            return;
        }

        image.data = image.data.replace(/^data:image\/png;base64,/, "");
        /*
        ImageService.create(req, image, function(img) {
            // Write to ES
            Image.create(img).exec(function(err, model) {

                if (err) {
                    console.log(err);
                    res.send("Error: Shit went wrong");
                } else {
                    console.log("Saving to elastic search - image collection");
                    console.log("image to save id: " + model.id);
                }
            });
        });
        */
       
       //var rawImgPath = '../../assets/images/sample/';
       
       // TODO: Use new methods
       ImageService.writePNGFile(image, function(imageSaved, current_time, image){
            if(imageSaved)
            {
                //var processedImgPath = '../../assets/images/out/';
                // Detection
                ImageService.detect(image, current_time, function(pgmImage) {
                    // Recognition
                    
                    console.log("pgmImage in controller before recognize " + pgmImage);

                    if((!pgmImage) || (0 === pgmImage.length)) {
                        console.log("bad image");
                        res.send("OK: Bad Image. Pgm not created.");
                        res.status(200);
                        return;
                    }

                    ImageService.recognize(pgmImage, function(prediction){
                        // Verify if prediction.id == userid
                        
                        console.log(prediction);
                        res.send("OK");
                        res.status(200);
                    });
                });
            }
        });

       
    },

    retrieve: function(req, res) {
        var id = req.param("id");
        
        Image.findOne({id: 556}).exec(function(err, model){
            if(err) {
                console.log(err);
                console.log("Couldnt retrieve image");
            } else {
                console.log("path: " + model.path);
                console.log("prediction: " + model.predicted);
            }
        });
    }

};

module.exports = ImageController;
