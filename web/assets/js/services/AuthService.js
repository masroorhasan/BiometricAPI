define(function(require) {
  'use strict';

  var angular = require('angular');

  /*
   * Handles authorization/login.
   */

  return function($cookieStore, $http, $location, $log, COGNITECH_CONFIG) {
    $log.info('Initializing AuthService');

    var cookieUsername = '';
    var cookieSessionID;
    try {
      cookieUsername = $cookieStore.get('username');
    } catch (err) {
      $log.warn('unable to retrieve username cookie: ' + err);
    }
    try {
      cookieSessionID = $cookieStore.get('sessionID');
    } catch (err) {
      $log.warn('unable to retrieve sessionID cookie: ' + err);
    }

    $log.info(cookieUsername);
    $log.info(cookieSessionID);

    return {
      username: cookieUsername,
      sessionID: cookieSessionID,
      cookieUsername: cookieUsername,
      authOKCallbackQueue: [],
      oldPath: undefined,

      /*
       * Called when authorization is successful.
       * Stores the sessionID
       * Restores and then unsets 'oldPath'
       */
      authOK: function(username, sessionID) {
        this.sessionID = sessionID;
        this.username = username;
        if (this.oldPath) {
          $location.path(this.oldPath);
          this.oldPath = undefined;
        }
        $cookieStore.put('username', username);
        $cookieStore.put('sessionID', sessionID);
        angular.forEach(this.authOKCallbackQueue, function(callback) {
          if (callback) {
            callback();
          }
        });
        if ($location.path() == '/login') {
          $location.path('/');
        }
      },

      /*
       * Called when an auth error is encountered
       * Clear any stored sessionID
       * Present the login screen
       */
      authRequired: function(callback) {
        this.sessionID = undefined;
        $cookieStore.remove('username');
        $cookieStore.remove('sessionID');
        if (callback) {
          this.authOKCallbackQueue.push(callback);
        }
        if (!this.oldPath) {
          this.oldPath = $location.path();
        }
        $location.path('/login');
      },

      /*
       * Send the login request to the server
       */
      sendLogin: function(username, image, callback) {
        $http.post(COGNITECH_CONFIG.api_hostname + 'auth/', {
          'username': username,
          'image': image
        }).success(function(data) {
          $log.info('Login ok for ' + username);
          callback(null, data.result);
        }).error(function(data) {
          $log.warn('Login failure for ' + username + ': ' + data.message);
          callback(new Error(data.message), null);
        });
      },

      /*
       * Send the logout request to the server
       */
      sendLogout: function(callback) {
        var self = this;
        var username = self.username;
        var sessionID = self.sessionID;
        $http.post('logout?username=' + username, {
          'sessionID': sessionID
        }).success(function(data) {
          $log.info('Logout OK for ' + username);
          if (callback) {
            callback(null, true);
          }
        }).error(function(data) {
          $log.warn('Logout failure for ' + username + ': ' + data.message);
          if (callback) {
            callback(new Error(data.message), null);
          }
        });
        self.username = undefined;
        self.sessionID = undefined;
      },

      /*
       * Returns true if the client thinks it's logged in, false otherwise
       */
      isLoggedIn: function() {
        var self = this;
        if ((self.username && self.sessionID) || COGNITECH_CONFIG.debug || $location.search()['static']) {
          return true;
        } else {
          return false;
        }
      },
    };
  };
});
