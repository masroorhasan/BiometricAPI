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
      "conditions": [
            ['OS == "mac"', {
                
                "xcode_settings": {
                  "MACOSX_DEPLOYMENT_TARGET": "10.7",
                  "GCC_ENABLE_CPP_EXCEPTIONS": "YES",        # -fno-exceptions
                  "OTHER_CFLAGS": 
                      [ "-g", "-mmacosx-version-min=10.7", "-std=c++11", "-stdlib=libc++", "-O3", "-  D__STDC_CONSTANT_MACROS", "-D_FILE_OFFSET_BITS=64", "-D_LARGEFILE_SOURCE", "-Wall" 
                      ],
                  "OTHER_CPLUSPLUSFLAGS": 
                      [ "-g", "-mmacosx-version-min=10.7", "-std=c++11", "-stdlib=libc++", "-O3", "-D__STDC_CONSTANT_MACROS", "-D_FILE_OFFSET_BITS=64", "-D_LARGEFILE_SOURCE", "-Wall" 
                      ]
                }
            }]

          ]
    }
  ]
}