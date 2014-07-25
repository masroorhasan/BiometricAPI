#include "OpenCV.h"

#if CV_MAJOR_VERSION >= 2 && CV_MINOR_VERSION >= 4

#include "opencv2/contrib/contrib.hpp"

class FaceRecognizerWrap: public node::ObjectWrap {
	public:
		cv::Ptr<cv::FaceRecognizer> rec;
		int typ;

		static Persistent<FunctionTemplate> constructor;
    	static void Init(Handle<Object> target);
    	static Handle<Value> New(const Arguments &args);

    	FaceRecognizerWrap(cv::Ptr<cv::FaceRecognizer> f, int type);

    	static Handle<Value> CreateLBPH(const Arguments& args);
    	static Handle<Value> CreateEigen(const Arguments& args);
    	static Handle<Value> CreateFisher(const Arguments& args);

		static Handle<Value> TrainSync(const Arguments& args);    	
		static Handle<Value> UpdateSync(const Arguments& args);
		static Handle<Value> PredictSync(const Arguments& args);

		static Handle<Value> SaveSync(const Arguments& args);
		static Handle<Value> LoadSync(const Arguments& args);
		static Handle<Value> GetMat(const Arguments& args);						
};

#endif