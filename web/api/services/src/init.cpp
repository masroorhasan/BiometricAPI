#include "OpenCV.h"
#include "Matrix.h"
#include "CascadeClassifierWrap.h"
#include "FaceRecognizer.h"

extern "C" void
init(Handle<Object> target) {
	HandleScope scope;

	//class Init's go here
	OpenCV::Init(target);
	Matrix::Init(target);
	CascadeClassifierWrap::Init(target);
	
	#if CV_MAJOR_VERSION >= 2 && CV_MINOR_VERSION >=4
    	FaceRecognizerWrap::Init(target);
   	#endif
}


NODE_MODULE(opencv, init)