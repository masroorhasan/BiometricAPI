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
      
      // res.send(CVService.cv.readImage());
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
                  im.ellipse(coord.x + coord.width/2, coord.y + coord.height/2, coord.width/2, coord.height/2);
              }
              im.save(path.resolve(__dirname, '../../assets/images/out/lena_out.png'));
          });
      });

      res.send("detecting...");
      return;
  },

  recognize: function(req, res) {

      res.send("recognize");
      return;
  }
};

