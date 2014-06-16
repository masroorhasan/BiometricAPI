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
  		var rand = 7;
  		rand = TestService.moduleName.random();
		res.send(rand);
		console.log(rand);
		return;
  }
};

