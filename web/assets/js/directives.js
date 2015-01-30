define(function(require) {
  'use strict';
  var angular = require('angular'),
    Directives = angular.module('fydp.directives', []);

  Directives.directive('frontEnd', function(ImageService) {
    return {
      restrict: 'E',
      templateUrl: 'partials/front-end.html',
      controller: function($scope) {
        $scope.images = ImageService.query();

        $scope.addImage = function(image) {
          $scope.images.push(image);
        };

        $scope.$on('capture-image', function() {
          console.log("capture-image emitted");
          convertImgToBase64('http://localhost:1337/images/test.png', function(base64) {
            console.log("convertToBase callback");
            var image = new Image({
              id: null,
              imageData: base64,
              imageName: 'boop'
            });
            image.$save(function(data) {
              var x = "";
            });
          });
        });

        var setup = function() {
          navigator.myGetMedia = (navigator.getUserMedia ||
            navigator.webkitGetUserMedia ||
            navigator.mozGetUserMedia ||
            navigator.msGetUserMedia);
          navigator.myGetMedia({
            video: true
          }, connect, error);
        };

        var connect = function(stream) {
          video = document.getElementById("video");
          video.src = window.URL ? window.URL.createObjectURL(stream) : stream;
          video.play();
        };

        var error = function(e) {
          console.log(e);
        };


        var convertImgToBase64 = function(url, callback, $scope, outputFormat) {
          $scope = $scope || this;
          var canvas = document.createElement('CANVAS'),
            ctx = canvas.getContext('2d'),
            img = new Image;
          img.crossOrigin = 'Anonymous';
          img.onload = function() {
            var dataURL;
            canvas.height = img.height;
            canvas.width = img.width;
            ctx.drawImage(img, 0, 0);
            dataURL = canvas.toDataURL(outputFormat);
            callback.call($scope, dataURL);
            canvas = null;
          };
          img.src = url;
        };

      }
    };
  });

  return Directives;
});
