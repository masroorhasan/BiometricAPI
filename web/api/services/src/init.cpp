#include "OpenCV.h"
#include "Matrix.h"
#include "CascadeClassifierWrap.h"

extern "C" void
init(Handle<Object> target) {
	HandleScope scope;

	//class Init's go here
	OpenCV::Init(target);
	Matrix::Init(target);
	CascadeClassifierWrap::Init(target);
}


NODE_MODULE(opencv, init)