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

      cv.readImage(path.resolve(__dirname, '../../assets/images/mona.png'), function(err, im) {
          im.detectObject(cv.FACE_CASCADE, {}, function(err, faces) {
              for(var i = 0; i < faces.length; i++) {
                  console.log(faces[i]);
                  var x = faces[i];
                  im.ellipse(x.x + x.width/2, x.y + x.height/2, x.width/2, x.height/2);
              }
              im.save(path.resolve(__dirname, '../../assets/images/out.png')); 
          });
      });

      // res.send(CVService.cv.readImage());
      res.send("ok");
      return;
  }
};

