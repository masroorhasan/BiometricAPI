#include "Matrix.h"
#include "OpenCV.h"

struct save_baton_t {
  Matrix *mm;
  Persistent<Function> cb;
  std::string filename;
  int res;
  uv_work_t request;
};

v8::Persistent<FunctionTemplate> Matrix::constructor;

cv::Scalar setColor(Local<Object> objColor);
cv::Point setPoint(Local<Object> objPoint);
cv::Rect* setRect(Local<Object> objRect);

extern "C" 
void Matrix::Init(Handle<Object> target) {
	HandleScope scope;

	v8::Local<v8::FunctionTemplate> m = v8::FunctionTemplate::New(New);
	m->SetClassName(v8::String::NewSymbol("Matrix"));

	// Constructor
	constructor = Persistent<FunctionTemplate>::New(m);
	constructor->InstanceTemplate()->SetInternalFieldCount(1);
	constructor->SetClassName(String::NewSymbol("Matrix"));

	NODE_SET_PROTOTYPE_METHOD(constructor, "empty", Matrix::Empty);
	NODE_SET_PROTOTYPE_METHOD(constructor, "get", Matrix::Get);
	NODE_SET_PROTOTYPE_METHOD(constructor, "set", Matrix::Set);
	NODE_SET_PROTOTYPE_METHOD(constructor, "pixel", Matrix::Pixel);
	
	NODE_SET_PROTOTYPE_METHOD(constructor, "ellipse", Matrix::Ellipse);
	NODE_SET_PROTOTYPE_METHOD(constructor, "rectangle", Matrix::Rectangle);

	NODE_SET_PROTOTYPE_METHOD(constructor, "save", Matrix::Save);
	// NODE_SET_PROTOTYPE_METHOD(constructor, "saveAsync", Matrix::SaveAsync);
	NODE_SET_PROTOTYPE_METHOD(constructor, "preprocess", Matrix::PreProcess);

	target->Set(String::NewSymbol("Matrix"), m->GetFunction());
}

extern "C" 
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

extern "C" 
Matrix::Matrix(): ObjectWrap() {
	mat = cv::Mat();
}

extern "C" 
Matrix::Matrix(int rows, int cols): ObjectWrap() {
	mat = cv::Mat(rows, cols, CV_32FC3);
}

extern "C" 
Handle<Value> Matrix::Empty(const Arguments& args) {
	// SETUP_FUNCTION(Matrix)
	HandleScope scope;
	Matrix *self = ObjectWrap::Unwrap<Matrix>(args.This());

	return scope.Close(Boolean::New(self->mat.empty()));
}

extern "C" 
double Matrix::DblGet(cv::Mat mat, int i, int j){

  double val = 0;
  cv::Vec3b pix;
  unsigned int pint = 0;

  switch(mat.type()){
    case CV_32FC3:
      pix = mat.at<cv::Vec3b>(i, j);
      pint |= (uchar) pix.val[2];
      pint |= ((uchar) pix.val[1]) << 8;
      pint |= ((uchar) pix.val[0]) << 16;
      val = (double) pint;
      break;

    case CV_64FC1:
      val = mat.at<double>(i, j);
      break;

    default:
	    val = mat.at<double>(i,j);
      break;
  }

  return val;
}

extern "C" 
Handle<Value> Matrix::Pixel(const Arguments& args) {
	// SETUP_FUNCTION(Matrix)
	HandleScope scope;
	Matrix *self = ObjectWrap::Unwrap<Matrix>(args.This());

	int y = args[0]->IntegerValue();
	int x = args[1]->IntegerValue();

	//cv::Scalar scal = self->mat.at<uchar>(y, x);


	if(args.Length() == 3){

		Local<Object> objColor = args[2]->ToObject();

		self->mat.at<cv::Vec3b>(y, x)[0] =  (uchar) objColor->Get(0)->IntegerValue();
		self->mat.at<cv::Vec3b>(y, x)[1] =  (uchar) objColor->Get(1)->IntegerValue();
		self->mat.at<cv::Vec3b>(y, x)[2] =  (uchar) objColor->Get(2)->IntegerValue();
		return scope.Close(args[2]->ToObject());
	}else{
		cv::Vec3b intensity = self->mat.at<cv::Vec3b>(y, x);

		v8::Local<v8::Array> arr = v8::Array::New(3);
		arr->Set(0, Number::New( intensity[0] ));
		arr->Set(1, Number::New( intensity[1] ));
		arr->Set(2, Number::New( intensity[2] ));
		return scope.Close(arr);

	}

	return scope.Close(Undefined());
	//double val = Matrix::DblGet(t, i, j);
	//return scope.Close(Number::New(val));
}

extern "C" 
Handle<Value> Matrix::Get(const Arguments& args) {
	// SETUP_FUNCTION(Matrix)
	HandleScope scope;
	Matrix *self = ObjectWrap::Unwrap<Matrix>(args.This());

	int i = args[0]->IntegerValue();
	int j = args[1]->IntegerValue();

  double val = Matrix::DblGet(self->mat, i, j);
  return scope.Close(Number::New(val));
}

extern "C" 
Handle<Value> Matrix::Set(const Arguments& args) {
	SETUP_FUNCTION(Matrix)

	int i = args[0]->IntegerValue();
	int j = args[1]->IntegerValue();
	double val = args[2]->NumberValue();
  int vint = 0;

	if(args.Length() == 4) {
		self->mat.at<cv::Vec3b>(i,j)[args[3]->NumberValue()] = val;

	} else if(args.Length() == 3) {
    switch(self->mat.type()){

      case CV_32FC3:
        vint = static_cast<unsigned int>(val + 0.5);
		    self->mat.at<cv::Vec3b>(i,j)[0] = (uchar) (vint >> 16) & 0xff;
		    self->mat.at<cv::Vec3b>(i,j)[1] = (uchar) (vint >> 8) & 0xff;
		    self->mat.at<cv::Vec3b>(i,j)[2] = (uchar) (vint) & 0xff;
        //printf("!!!i %x, %x, %x", (vint >> 16) & 0xff, (vint >> 8) & 0xff, (vint) & 0xff);

        break;

      default:
        self->mat.at<double>(i,j) = val;
    }


  } else {
		return v8::ThrowException(v8::Exception::TypeError(String::New("Invalid number of arguments")));
  }

	return scope.Close(Undefined());
}

extern "C" 
Handle<Value> Matrix::Ellipse(const v8::Arguments& args){
	// SETUP_FUNCTION(Matrix)
	HandleScope scope;
	Matrix *self = ObjectWrap::Unwrap<Matrix>(args.This());

	int x = 0;
	int y = 0;
	int width = 0;
	int height = 0;
	cv::Scalar color(0, 0, 255);
	int thickness = 1;
	double angle = 0;
	double startAngle = 0;
	double endAngle = 360;
	int lineType = 8;
	int shift = 0;

	if(args[0]->IsObject()) {
		v8::Handle<v8::Object> options = v8::Handle<v8::Object>::Cast(args[0]);
		if (options->Has(v8::String::New("center"))) {
		  Local<Object> center = options->Get(v8::String::NewSymbol("center"))->ToObject();
		  x = center->Get(v8::String::NewSymbol("x"))->Uint32Value();
		  y = center->Get(v8::String::NewSymbol("y"))->Uint32Value();
		}
		if (options->Has(v8::String::New("axes"))) {
		  Local<Object> axes = options->Get(v8::String::NewSymbol("axes"))->ToObject();
		  width = axes->Get(v8::String::NewSymbol("width"))->Uint32Value();
		  height = axes->Get(v8::String::NewSymbol("height"))->Uint32Value();
		}
		if (options->Has(v8::String::New("thickness"))) {
			thickness = options->Get(v8::String::NewSymbol("thickness"))->Uint32Value();
		}
		if (options->Has(v8::String::New("angle"))) {
			angle = options->Get(v8::String::NewSymbol("angle"))->NumberValue();
		}
		if (options->Has(v8::String::New("startAngle"))) {
			startAngle = options->Get(v8::String::NewSymbol("startAngle"))->NumberValue();
		}
		if (options->Has(v8::String::New("endAngle"))) {
			endAngle = options->Get(v8::String::NewSymbol("endAngle"))->NumberValue();
		}
		if (options->Has(v8::String::New("lineType"))) {
			lineType = options->Get(v8::String::NewSymbol("lineType"))->Uint32Value();
		}
		if (options->Has(v8::String::New("shift"))) {
			shift = options->Get(v8::String::NewSymbol("shift"))->Uint32Value();
		}
		if (options->Has(v8::String::New("color"))) {
			Local<Object> objColor = options->Get(v8::String::NewSymbol("color"))->ToObject();
			color = setColor(objColor);
		}
	} else {
		x = args[0]->Uint32Value();
		y = args[1]->Uint32Value();
		width = args[2]->Uint32Value();
		height = args[3]->Uint32Value();

		if(args[4]->IsArray()) {
			Local<Object> objColor = args[4]->ToObject();
			color = setColor(objColor);
		}  

		if(args[5]->IntegerValue())
			thickness = args[5]->IntegerValue();
	}

	cv::Mat gray;
	// cvtColor(self->mat, self->mat, CV_BGR2GRAY);

	// int w = x + width/2;
	// int h = y + height/2;

	// cv::Mat im2(w, h, CV_8UC1, cv::Scalar(0,0,0));
	// cv::ellipse(im2, cv::Point(x-width,y-height), cv::Size(width, height), 0, 0, 360, cv::Scalar(255,255,255), -1, 8);
	// cv::imshow("im2", im2);

	cv::Mat res;
	
	cv::ellipse(self->mat, cv::Point(x, y), cv::Size(width, height), angle, startAngle, endAngle, color, thickness, lineType, shift);
	return scope.Close(v8::Null());
}

extern "C" 
Handle<Value> Matrix::Rectangle(const Arguments& args) {
	// SETUP_FUNCTION(Matrix)
	HandleScope scope;
	Matrix *self = ObjectWrap::Unwrap<Matrix>(args.This());

	if(args[0]->IsArray() && args[1]->IsArray()) {
		Local<Object> xy = args[0]->ToObject();
		Local<Object> width_height = args[1]->ToObject();

		cv::Scalar color(0, 0, 255);

		if(args[2]->IsArray()) {
			Local<Object> objColor = args[2]->ToObject();
			color = setColor(objColor);
		}

		int x = xy->Get(0)->IntegerValue();
		int y = xy->Get(1)->IntegerValue();

		int width = width_height->Get(0)->IntegerValue();
		int height = width_height->Get(1)->IntegerValue();

		int thickness = 1;

		if(args[3]->IntegerValue())
			thickness = args[3]->IntegerValue();


		cv::Size size(width, height);
		cv::Point2f pt(x+(width/2), y+(height/2));
		cv::Mat dst;
		cv::getRectSubPix(self->mat, size, pt, dst, CV_8U);
		cv::imshow("dst", dst);

		cv::rectangle(self->mat, cv::Point(x, y), cv::Point(x+width, y+height), color, thickness);
	}

	return scope.Close(v8::Null());
}

extern "C" 
Handle<Value> Matrix::Save(const v8::Arguments& args) {
  // SETUP_FUNCTION(Matrix)
  HandleScope scope;
  Matrix *self = ObjectWrap::Unwrap<Matrix>(args.This());

  if (args.Length() > 1) {
    return SaveAsync(args);
  }
  
  if (!args[0]->IsString())
    return v8::ThrowException(v8::Exception::TypeError(String::New("filename required")));

  String::AsciiValue filename(args[0]);
  int res = cv::imwrite(*filename, self->mat);
  return scope.Close(Number::New(res));
}

extern "C" 
Handle<Value> Matrix::SaveAsync(const v8::Arguments& args){
  // SETUP_FUNCTION(Matrix)
  HandleScope scope;
  Matrix *self = ObjectWrap::Unwrap<Matrix>(args.This());

  if (!args[0]->IsString())
    return v8::ThrowException(v8::Exception::TypeError(String::New("filename required")));

  String::AsciiValue filename(args[0]);

  REQ_FUN_ARG(1, cb);

  save_baton_t *baton = new save_baton_t();
  baton->mm = self;
  baton->cb = Persistent<Function>::New(cb);
  baton->filename = *filename;
  baton->request.data = baton;

  uv_queue_work(uv_default_loop(), &baton->request, DoSaveAsync, (uv_after_work_cb)AfterSaveAsync);

  return Undefined();
}

extern "C" 
void Matrix::DoSaveAsync(uv_work_t *req) {
  save_baton_t *baton = static_cast<save_baton_t *>(req->data);

  int res = cv::imwrite(baton->filename.c_str(), baton->mm->mat);
  baton->res = res;
}

extern "C" 
void Matrix::AfterSaveAsync(uv_work_t *req) {
  HandleScope scope;
  save_baton_t *baton = static_cast<save_baton_t *>(req->data);

  Local<Value> argv[2];  // (err, result)

  argv[0] = Local<Value>::New(Null());
  argv[1] = Number::New(baton->res);

  TryCatch try_catch;

  baton->cb->Call(Context::GetCurrent()->Global(), 2, argv);

  if (try_catch.HasCaught()) {
    FatalException(try_catch);
  }

  baton->cb.Dispose();

  delete baton;
}

extern "C" 
Handle<Value> Matrix::PreProcess(const v8::Arguments& args) {
	HandleScope scope;
	Matrix *self = ObjectWrap::Unwrap<Matrix>(args.This());

	//Preprocessing before adding to training set
	if(args[0]->IsArray() && args[1]->IsArray()) {
		Local<Object> xy = args[0]->ToObject();
		Local<Object> width_height = args[1]->ToObject();

		int x = xy->Get(0)->IntegerValue();
		int y = xy->Get(1)->IntegerValue();

		int width = width_height->Get(0)->IntegerValue();
		int height = width_height->Get(1)->IntegerValue();

		cv::Mat gray;
		if(self->mat.channels() != 1)
			cvtColor(self->mat, gray, CV_BGR2GRAY);

		int detection_width = 320;
		int detection_height = 320;
		cv::Mat smallImg;
		float scale = gray.cols / (float)detection_width;
		// if(gray.cols > detection_width) {
			int scaledHeight = cvRound(gray.rows / scale);
			// cv::resize(gray, smallImg, cv::Size(detection_width, scaledHeight));
			cv::resize(gray, smallImg, cv::Size(detection_width, scaledHeight));
		// } else {
		// 	smallImg = gray;
		// }

		equalizeHist(smallImg, smallImg);

		cv::Size size(width, height);
		cv::Point2f pt( (x+(width/2)), (y+(height/2)));
		cv::Mat dst;
		cv::getRectSubPix(smallImg, size, pt, dst, CV_8U);

		self->mat = dst;
	}

	return scope.Close(v8::Null());
}