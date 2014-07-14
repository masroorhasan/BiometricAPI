#include "OpenCV.h"

class Matrix: public node::ObjectWrap {
	public:
		cv::Mat mat;
		static Persistent<FunctionTemplate> constructor;
	    static void Init(Handle<Object> target);
	    static Handle<Value> New(const Arguments &args);
	    Matrix();
	    Matrix(int rows, int cols);

	    static double DblGet(cv::Mat mat, int i, int j);
	    static Handle<Value> Empty(const Arguments& args);
	    static Handle<Value> Pixel(const Arguments& args);
	    static Handle<Value> Get(const Arguments& args);
	    static Handle<Value> Set(const Arguments& args);
	    static Handle<Value> Ellipse(const v8::Arguments& args);
	    static Handle<Value> Rectangle(const Arguments& args);
	    static Handle<Value> Save(const v8::Arguments& args);
	    static Handle<Value> SaveAsync(const v8::Arguments& args);

	    static Handle<Value> PreProcess(const v8::Arguments& args);

	    static void DoSaveAsync(uv_work_t *req);
	    static void AfterSaveAsync(uv_work_t *req);

};

