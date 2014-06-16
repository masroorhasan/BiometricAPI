#include "Matrix.h"
#include "OpenCV.h"

v8::Persistent<FunctionTemplate> Matrix::constructor;

cv::Scalar setColor(Local<Object> objColor);
cv::Point setPoint(Local<Object> objPoint);
cv::Rect* setRect(Local<Object> objRect);

void Matrix::Init(Handle<Object> target) {
	HandleScope scope;

	v8::Local<v8::FunctionTemplate> m = v8::FunctionTemplate::New(New);
	m->SetClassName(v8::String::NewSymbol("Matrix"));

	// Constructor
	constructor = Persistent<FunctionTemplate>::New(m);
	constructor->InstanceTemplate()->SetInternalFieldCount(1);
	constructor->SetClassName(String::NewSymbol("Matrix"));


	target->Set(String::NewSymbol("Matrix"), m->GetFunction());
}

Handle<Value> Matrix::New(const Arguments &args) {
	HandleScope scope;

	// Error checking - should be able to instantiate matrix class
	// without calling New
	
	Matrix *mat = NULL;
	if(args.Length() == 0) {
		mat = new Matrix;
	} else if(args.Length() == 2 && args[0]->IsInt32() && args[1]->IsInt32()) {
		mat = new Matrix(args[0]->IntegerValue(), args[1]->IntegerValue());
	}

	//TODO: dynamic matrix with more arguments
	
	mat->Wrap(args.Holder());
	return scope.Close(
			args.Holder()
		);
}

Matrix::Matrix(): ObjectWrap() {
	mat = cv::Mat();
}

Matrix::Matrix(int rows, int cols): ObjectWrap() {
	mat = cv::Mat(rows, cols, CV_32FC3);
}