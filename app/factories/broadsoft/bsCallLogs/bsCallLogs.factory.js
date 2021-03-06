(function(){
  'use strict';

  ucone.factory('BSCallLogs', ['$rootScope', '$http', '$q', function($rootScope, $http, $q){
    var service = {};

    var baseUrl = $rootScope.xsp + '/com.broadsoft.xsi-actions/v2.0/user/';

    service.formatCall = function(call, type){
      var callLogId = call.callLogId ? call.callLogId.$ : '';
      var countryCode = call.countryCode ? call.countryCode.$ : '';
      var name = call.name ? call.name.$ : '';
      var number = call.phoneNumber ? call.phoneNumber.$ : '';
      var time = call.time ? call.time.$ : '';

      var formattedTime = time.split('T')[0] + ' ' + time.split('T')[1].substring(0, 8);

      return {callLogId: callLogId, countryCode: countryCode, name: name, number: number, time: formattedTime, type: type}
    };

    service.formatCallLogs = function(CallLogs){
      var calls = [];

      _.each(CallLogs.missed.callLogsEntry, function(call){
        calls.push(service.formatCall(call, 'missed'));
      });

      _.each(CallLogs.placed.callLogsEntry, function(call){
        calls.push(service.formatCall(call, 'placed'));
      });

      _.each(CallLogs.received.callLogsEntry, function(call){
        calls.push(service.formatCall(call, 'received'));
      });

      return _.sortBy(calls, 'time').reverse();
    };

    service.getData = function () {
      var apiName = '/directories/CallLogs';
      var defer = $q.defer();

      $http.get(baseUrl + $rootScope.username + apiName)
        .success(function(response){
          console.log(service.formatCallLogs(response.CallLogs));
          defer.resolve(service.formatCallLogs(response.CallLogs));
        }).error(function(error){
          console.log(error);
          defer.reject(error);
        });

      return defer.promise;
    };

    return service;
  }]);
})();

