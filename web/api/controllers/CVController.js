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
    // var rand = 7;
    // rand = CVService.cv.random();
    // res.send(rand);
    // console.log(rand);
    // return;
      res.send(CVService.cv.readImage());
      return;
  }
};

