/**
 * TestController
 *
 * @description :: Server-side logic for managing tests
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	


  /**
   * `TestController.helloWorld()`
   */
  helloWorld: function (req, res) {

	  var out = TestService.helloWorld();
	  res.send(out);
	  return;
  }
};

