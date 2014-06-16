#include "OpenCV.h"

void OpenCV::Init(Handle<Object> target) {
	HandleScope scope;

	// Version string.
	char out [21];
	int n = sprintf(out, "%i.%i", CV_MAJOR_VERSION, CV_MINOR_VERSION);
	target->Set(String::NewSymbol("version"), String::New(out, n));

	NODE_SET_METHOD(target, "readImage", ReadImage);
}

Handle<Value> OpenCV::ReadImage(const Arguments &args) {
	HandleScope scope;

	return scope.Close(String::New("ReadImage in OpenCV module"));	
}
