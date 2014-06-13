

var ffi = require('ffi');

var testspace = ffi.Library('./libtestspace', {
    "helloWorld": [ "string", [] ]
});

module.exports = {
    helloWorld: testspace.helloWorld
};

