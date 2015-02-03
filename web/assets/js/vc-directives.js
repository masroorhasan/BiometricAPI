'use strict';

var directives = angular.module('vcui.directives', []);

/*
 * directive for the save bar to be fixed at the top of the window
 */
directives.directive('fixedScroll', function($window, $document) {
  return {
    link: function($scope, elem, attrs) {
      angular.element($window).bind('scroll', function($event) {
        $scope.scrollTop = $scope.scrollTop || 0;
        var parent = elem.parent(".outer-container");
        if (elem[0].getBoundingClientRect().top <= 0) {
          $scope.scrollTop = parent.hasClass("persistent") ? $scope.scrollTop : $document.find("body").prop('scrollTop');
          parent.addClass("persistent");
        }

        if ($document.find("body").prop('scrollTop') < $scope.scrollTop) {
          $scope.scrollTop = 0;
          parent.removeClass("persistent");
        }
      });
    }
  };
});

/*
 * handle add/remove of ip_port_block_list
 * TODO: this is sloppy and very back and forth
 */
directives.directive('ipPortAdd', function($compile) {
  return {
    require: '^ipPortSetting',
    link: function($scope, elem, attrs, ipPortSettingCtrl) {
      $scope.addIPPort = function($event) {
        var src = ($scope.model.src || '').split(":");
        var dst = ($scope.model.dst || '').split(":");

        if (!src && !dst) {
          // need at least one
        }

        var $model = {
          direction: $scope.model.direction,
          src: {
            ip: _.first(src),
            port: _.chain(src).rest(1).first().value()
          },
          dst: {
            ip: _.first(dst),
            port: _.chain(dst).rest(1).first().value()
          }
        };

        // only add unique values
        if (!_.contains($scope.deployment.protection_layer.ip_port_block_list, function(item) {
            return item.direction === $model.direction && _.isEqual(item.src, $model.src) && _.isEqual(item.dst, $model.dst);
          })) {
          $scope.deployment.protection_layer.ip_port_block_list.push($model);
          // reset input
          $scope.model = {
            direction: 'in',
            src: '',
            dst: ''
          };
        }
      };

      // default value
      $scope.model = {
        direction: 'in'
      };
    },
    templateUrl: 'partials/ip-port-add.html',
    restrict: 'A'
  };
});

directives.directive('ipPortSetting', function() {
  return {
    restrict: 'A',
    controller: function($scope) {
      $scope.$on('update-selected-ip-ports',
        function($event) {
          var ipPorts = $scope.track.protection_layer.ip_port_block_list;
          if ($event.targetScope.selected) {
            ipPorts.push($event.targetScope);
          } else {
            ipPorts.splice(ipPorts.indexOf($event.targetScope), 1);
          }
          $scope.$apply();
        }, true);

      $scope.removeSelected = function() {
        var ipPorts = $scope.track.protection_layer.ip_port_block_list;
        _.each(ipPorts, function(ipPortScope) {
          var depIPPorts = $scope.deployment.protection_layer.ip_port_block_list;
          var index = depIPPorts.indexOf(ipPortScope.ip_port);
          depIPPorts.splice(index, 1);
        });
        ipPorts.splice(0, ipPorts.length);
      };
    }
  };
});

directives.directive('ipPort', function() {
  return {
    restrict: 'A',
    transclude: true,
    require: '^ipPortSetting',
    templateUrl: 'partials/ip-port.html',
    link: function($scope, elem, attrs, ipPortListCtrl) {
      $scope.source = $scope.ip_port.src.ip;
      $scope.source += $scope.ip_port.src.port ? ":" + $scope.ip_port.src.port : '';
      $scope.destination = $scope.ip_port.dst.ip;
      $scope.destination += $scope.ip_port.dst.port ? ":" + $scope.ip_port.dst.port : '';
      elem.on('click', function($event, b, c) {
        $scope.$emit('update-selected-ip-ports');
      });
    }
  };
});

directives.directive('passwordMask', function() {
  var controller = function($scope) {
      var $this = this;
      this.mask = "*******";
      this.actions = {
        show: 'reveal',
        hide: 'hide'
      };

      $scope.value = this.mask;
      $scope.action= this.actions.hide;
      $scope.reveal = false;

      $scope.toggleReveal = function() {
        $scope.reveal = !$scope.reveal;
      };

      $scope.$watch('reveal', function(cur_action) {
        $scope.action = $scope.reveal ? $this.actions.hide : $this.actions.show;
        $scope.value = $scope.reveal ? $scope.password : $this.mask;
      });
    };

  return {
    restrict: 'AE',
    scope: {
      password: '='
    },
    template: '{{value}}<a class="password-mask" ng-click="toggleReveal()">{{action}}</a>',
    controller: controller,
    link: function($scope, elem, attrs) {
      elem.addClass("password-mask");
    }
  };
});
