# https://github.com/peterbraden/node-opencv/issues/87
# https://github.com/mshick/node-protobuf/blob/9a38ebe577836c5d66b977c513df3f6672c9a7d3/binding.gyp

{
  "targets": [
    {
      "target_name": "opencv",
      "sources": [ 
      				"src/init.cpp",
      				"src/OpenCV.cpp",
      				"src/Matrix.cpp" 
      			 ],
      "cflags!" : [ "-fno-exceptions"],
      "cflags_cc!": [ "-fno-rtti",  "-fno-exceptions"],
      'cflags' : ['-Wno-unused-variable'],
      "conditions": [
            ['OS=="mac"', {
            'include_dirs':['/usr/local/include/opencv2'],
            'xcode_settings': {
              'GCC_ENABLE_CPP_EXCEPTIONS': 'YES'
            },
            'libraries':[
              '-lopencv_core', 
              '-lopencv_imgproc', 
              '-lopencv_calib3d',
              '-lopencv_features2d', 
              '-lopencv_objdetect', 
              '-lopencv_video', 
              '-lopencv_highgui', 
              '-lopencv_contrib', 
              '-lopencv_flann', 
              '-lopencv_ml', 
              '-lopencv_gpu', 
              '-lopencv_legacy',
              '-lopencv_nonfree'
            ]
          }]

          ]
    }
  ]
}