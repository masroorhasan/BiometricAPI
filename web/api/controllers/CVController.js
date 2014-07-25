/**
 * TestController
 *
 * @description :: Server-side logic for managing tests
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	


  /**
   * `CVController.init()`
   */
  init: function (req, res) {
      var asset = require('assert');
      var fs = require('fs');
      var path = require('path');

      var cv = CVService.cv;
      var trainingData = [];

      for (var i = 1; i < 41; i++){
          for (var j = 1; j < 11; j++){
            var filepath = "../../assets/facerec/facedb/att_faces/s" + i + "/" + j + ".pgm";
            path.resolve(__dirname, filepath);
            trainingData.push([i, path.resolve(__dirname, filepath) ]);
          }
      }

      var facerec = cv.FaceRecognizer.createEigenFaceRecognizer();

      console.log("training...");
      facerec.trainSync(trainingData);
      console.log("done training");
      facerec.saveSync(path.resolve(__dirname, "../../assets/facerec/eigenfaces.yml"));

      res.send("CV API");
      return;
  },

  detect: function(req, res) {
      var path = require('path');
      var cv = CVService.cv;

      cv.readImage(path.resolve(__dirname, '../../assets/images/sample/lena.png'), function(err, im) {
          im.detectObject(cv.LBP_FRONTALFACE_CASCADE, {}, function(err, faces) {
              for(var i = 0; i < faces.length; i++) {
                  console.log(faces[i]);
                  var coord = faces[i];
                  // im.ellipse(coord.x + coord.width/2, coord.y + coord.height/2, coord.width/2, coord.height/2);
                  // im.rectangle([coord.x, coord.y], [coord.width, coord.height]);
                  im.preprocess([coord.x, coord.y], [coord.width, coord.height]);
              }
              im.save(path.resolve(__dirname, '../../assets/images/out/lena.pgm'));
          });
      });

      res.send("detecting...");
      return;
  },

  recognize: function(req, res) {
      var path = require('path');
      var cv = CVService.cv;

      var trainingData = [];

      for (var i = 1; i < 41; i++){
          for (var j = 1; j < 10; j++){
            var filepath = "../../assets/facerec/facedb/att_faces/s" + i + "/" + j + ".pgm";
            trainingData.push([i, path.resolve(__dirname, filepath) ]);
          }
      }

      cv.readImage("/Users/masroorhasan/Downloads/att_faces/s6/9.pgm", function(e, im){
          var facerec = cv.FaceRecognizer.createEigenFaceRecognizer();
          console.log("training...");
          facerec.trainSync(trainingData);
          console.log("done training");
          // facerec.loadSync(path.resolve(__dirname, "../../assets/facerec/eigenfaces.yml"));
        
          console.log(facerec.predictSync(im));
      });

      res.send("recognize");
      return;
  }
};

