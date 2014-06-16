#include "OpenCV.h"
#include "Matrix.h"

extern "C" void
init(Handle<Object> target) {
	HandleScope scope;

	//class Init's go here
	OpenCV::Init(target);
	Matrix::Init(target);
}


NODE_MODULE(opencv, init)