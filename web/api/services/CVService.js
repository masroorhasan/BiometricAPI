var Stream = require('stream').Stream
  , Buffers = require('buffers')
  , util = require('util')
  , path = require('path')

var bindings = require('./build/Release/opencv');

var cv = module.exports = {};

cv.__proto__ = bindings;
/*

# Matrix #
The matrix is one of opencv's most core datatypes.

*/


var matrix = cv.Matrix.prototype;

matrix.detectObject = function(classifier, opts, cb){
	opts = opts || {}

  cv._detectObjectClassifiers = cv._detectObjectClassifiers || {}

  if (cv._detectObjectClassifiers[classifier]){
    var face_cascade = cv._detectObjectClassifiers[classifier];
  } else{
	  var face_cascade = new cv.CascadeClassifier(classifier);
    cv._detectObjectClassifiers[classifier] = face_cascade;
  }

	face_cascade.detectMultiScale(this, cb, opts.scale, opts.neighbors
		, opts.min && opts.min[0], opts.min && opts.min[1]);
}

matrix.inspect = function(){
	var size = this.size() ? (this.size()[0] + 'x' + this.size()[1]) : '';

	return "[Matrix " + size + " ]";

}

module.exports = {
	cv: cv,
	matrix: matrix
};
