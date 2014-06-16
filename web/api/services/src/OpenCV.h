#ifndef __NODE_OPENCV_H__
#define __NODE_OPENCV_H__

#include <v8.h>
#include <node.h>
#include <node_object_wrap.h>
#include <node_version.h>
#include <node_buffer.h>

#include <opencv2/opencv.hpp>

#include <string.h>


using namespace v8;
using namespace node;

class OpenCV: public node::ObjectWrap {
	public:
		static void Init(Handle<Object> target);
    	static Handle<Value> ReadImage(const v8::Arguments&);
};


#endif