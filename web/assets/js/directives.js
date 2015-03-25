define(function(require) {
  'use strict';
  var angular = require('angular'),
    Directives = angular.module('fydp.directives', []);

  Directives.directive('frontEnd', function(Image, $log, $http, $interval, $location) {
    return {
      restrict: 'E',
      templateUrl: 'partials/front-end.html',
      link: function($scope, $element, attrs) {
        $scope.video = $element.find('video');
        $scope.canvas = $element.find('canvas')[0];
        $scope.ctx = $scope.canvas.getContext('2d');
      },
      controller: function($scope, $timeout) {
        var $this = this;
        $scope.images = Image.query();
        $scope.name = {
          user: 'gogrady',
          first: 'Greg',
          last: "O'Grady"
        };

        $scope.labels = {
          name: {
            user: 'Username',
            first: 'First Name',
            last: 'Last Name'
          }
        };

        //$scope.inputs = {};

        $scope.addImage = function(image) {
          $scope.images.push(image);
        };

        var captureImage = function() {
          $log.log("capture-image emitted");

          $scope.ctx.drawImage($scope.video, 0, 0, $scope.canvas.width, $scope.canvas.height);
          var dataUrl = $scope.canvas.toDataURL();
          $scope.$emit('send-image', {dataUrl});
          /*var image = new Image({
            id: null,
            data: dataUrl,
            name: 'boop'
          });
          image.$save(function(data) {
            $log.log("image save success: %s", data);
          }, function(a, b, c, d) {
            $log.log("image save failed: %s", a);
          });*/
        };

        var captureTimeout = function() {
          $timeout(captureImage, Math.floor((Math.random() * 10000) + 5000)); // 5-10 second interval
        };

        $scope.$on('capture-image', captureImage);

        var connect = function(stream) {
          $scope.video = document.getElementById("video");
          $scope.video.src = window.URL ? window.URL.createObjectURL(stream) : stream;
          $scope.video.play();
        };

        var error = function(e) {
          console.log(e);
        };

        var setup = function() {
          navigator.myGetMedia = (navigator.getUserMedia ||
            navigator.webkitGetUserMedia ||
            navigator.mozGetUserMedia ||
            navigator.msGetUserMedia);
          navigator.myGetMedia({
            video: true
          }, connect, error);
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
        setup();
        //captureTimeout();
      }
    };
  });

  Directives.directive('myBreadcrumb', function($log, $http, $interval, $location) {
    return {
      restrict: 'E',
      templateUrl: 'partials/my-breadcrumb.html',
      controller: function($scope, $location) {
        var path = $location.path().split("/");
        /*var breadcrumbs = _.map(path, function(value, index, list) {
          return {
            url: path.join*/
      }
    }
  });

  Directives.directive('myHeader', function(Image, $log, $http, $interval, $location) {
    return {
      restrict: 'E',
      templateUrl: 'partials/front-end.html'
    }
  });

  return Directives;
});
