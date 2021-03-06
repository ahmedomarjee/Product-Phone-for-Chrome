(function(){
  'use strict';

  ucone.factory('Auth', ['$base64', '$rootScope', '$http', 'Storage', '$q', function($base64, $rootScope, $http, Storage, $q){
    var service = {};

    service.clearCredentials = function () {
      $http.defaults.headers.common.Authorization = 'Basic ';
      $rootScope.username = '';
      $rootScope.authdata = '';
    };

    service.setCredentials = function (username, password, xsp) {
      service.clearCredentials();

      var authdata = $base64.encode(username + ':' + password);

      $rootScope.xsp = xsp;
      $rootScope.username = username;
      $rootScope.authdata = authdata;

      console.log(username);
      console.log($rootScope.username);

      $http.defaults.headers.common['Authorization'] = 'Basic ' + authdata;
    };

    service.setConfig = function(type){
      console.log('type', type);
      var defer = $q.defer();
      var configuration;

      chrome.storage.local.get(function(storage){
        configuration = {
          'ws_servers' : [ {
            'ws_uri' : type == 'attemptTwo' ? storage.sipConfig.secondaryWrsAddress : storage.sipConfig.primaryWrsAddress,
            'weight' : 0
          } ],
          'uri' : storage.sipConfig.sipLineport,
          'auth_user': storage.sipConfig.sipUsername,
          'authorization_user': storage.sipConfig.sipUsername,
          'password': storage.sipConfig.sipPassword,
          'stun_servers': type == 'attemptTwo' ? storage.sipConfig.secondaryStunServer : storage.sipConfig.primaryStunServer,
          'trace_sip' : true,
          'displayName': (_.unescape(storage.sipConfig.userFirstName + ' ' + storage.sipConfig.userLastName)).replace("&apos;", "'")
        };

        console.log("the user's config: ", configuration);

        $rootScope.userFirstName = storage.sipConfig.userFirstName;

        defer.resolve(configuration);
      });

      return defer.promise;
    };

    return service;
  }]);
})();

