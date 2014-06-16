#include "OpenCV.h"

class Matrix: public node::ObjectWrap {
	public:
		cv::Mat mat;
		static Persistent<FunctionTemplate> constructor;
	    static void Init(Handle<Object> target);
	    static Handle<Value> New(const Arguments &args);
	    Matrix();
	    Matrix(int rows, int cols);

	    static Handle<Value> Empty();
        static double DblGet(cv::Mat mat, int i, int j);
};

