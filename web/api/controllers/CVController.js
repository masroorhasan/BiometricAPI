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

      // var img = path.dirname(require.main.filename);
      // var img = path.resolve(__dirname, '../../assets/data/haarcascade_frontalface_alt.xml')
      // console.log(img);
      var img = path.resolve(__dirname, '../../assets/images/mona.png');
      console.log(img);

      cv.readImage(img, function(err, im) {
          im.detectObject(cv.FACE_CASCADE, {}, function(err, faces) {
              for(var i = 0; i < faces.length; i++) {
                  console.log(faces[i]);
                  var x = faces[i];
                  im.ellipse(x.x + x.width/2, x.y + x.height/2, x.width/2, x.height/2);
              }
              // console.log(path.resolve(__dirname, '../../assets/images/out.png'));
              im.save(path.resolve(__dirname, '../../assets/images/out.png')); 
          });
      });

      // res.send(CVService.cv.readImage());
      res.send("ok");
      return;
  }
};

