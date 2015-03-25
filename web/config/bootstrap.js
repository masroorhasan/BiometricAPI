/**
 * Bootstrap
 * (sails.config.bootstrap)
 *
 * An asynchronous bootstrap function that runs before your Sails app gets lifted.
 * This gives you an opportunity to set up your data model, run jobs, or perform some special logic.
 *
 * For more information on bootstrapping your app, check out:
 * http://links.sailsjs.org/docs/config/bootstrap
 */

module.exports.bootstrap = function(cb) {
  sails.config.user_id = 0;
  sails.config.image_id = 0;

  // folders to create
  var mkdirp = require('mkdirp');
  mkdirp('assets/db');
  mkdirp('assets/images/out/auth');
  mkdirp('assets/images/sample/auth/');


  // It's very important to trigger this callack method when you are finished
  // with the bootstrap!  (otherwise your server will never lift, since it's waiting on the bootstrap)
  cb();
};
