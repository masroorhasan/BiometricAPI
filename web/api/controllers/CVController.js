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
      var cv = CVService.cv;

      cv.readImage("./assets/images/mona.png", function(err, im) {
          // im.detectObject(cv.FACE_CASCADE, {}, function(err, faces) {
              // for(var i = 0; i < faces.length; i++) {
                  // console.log(faces[i]);
              // }
          // });
          // console.log(im);
      });

      // res.send(CVService.cv.readImage());
      res.send("ok");
      return;
  }
};

