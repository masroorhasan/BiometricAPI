#include "Matrix.h"

v8::Persistent<FunctionTemplate> Matrix::constructor;

cv::Scalar setColor(Local<Object> objColor);
cv::Point setPoint(Local<Object> objPoint);
cv::Rect* setRect(Local<Object> objRect);

void Matrix::Init(Handle<Object> args) {
	HandleScope scope;

	// v8::Local<v8::FunctionTemplate> m = v8::FunctionTemplate::New(New);
	// m->SetClassName(v8::String::NewSymbol("Matrix"));

	// Constructor
	// constructor = Persistent<FunctionTemplate>::New(m);
	// constructor->InstanceTemplate()->SetInternalFieldCount(1);
	// constructor->SetClassName(String::NewSymbol("Matrix"));
}