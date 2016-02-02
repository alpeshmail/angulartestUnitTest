(function () {
    "use strict";
    angular.module("common").factory("common.factories.webApi",
      ["$http",
        "$q",
        "common.factories.log",
        function ($http, $q, log) {
            var _buildRequestObject = function (request) {
                var parsedRequest = { webApiMarker: true };
                if (angular.isString(request)) {
                    parsedRequest.method = "GET";
                    parsedRequest.url = request;
                }
                else {
                    parsedRequest.method = request.method || "GET";
                    parsedRequest.url = request.url;
                    parsedRequest.params = request.params;
                    parsedRequest.data = request.data;
                    parsedRequest.headers = request.headers;
                    parsedRequest.timeout = request.timeout;
                    parsedRequest.cache = request.cache;
                    parsedRequest.responseType = request.responseType;
                    if (angular.isDefined(request.transformRequest)) {
                        parsedRequest.transformRequest = request.transformRequest;
                    }
                }
                return parsedRequest;
            };
            var _formatSuccessCallLog = function (execTime, data, status, headers, config) {
                var callData = config.data ? JSON.stringify(config.data) : "empty"; //.replace(/[\n\r]/g, ' ')
                return "[WebApi:" + status + " " + execTime / 1000 + "sec]: " + config.url + " data:" + callData + ", " + ((data && data.length) ? data.length + " items returned " : "object returned ");
            };
            var _call = function (request) {
                var parsedRequest = _buildRequestObject(request);
                var deferred = $q.defer();
                var startExec = new Date();
                $http.defaults.headers.common["X-Xsrf-Token"] = localStorage.getItem("CsrfToken");
                $http(parsedRequest)
                  .success(function (data, status, headers, config) {
                      log.debug(_formatSuccessCallLog(new Date() - startExec, data, status, headers, config));
                      deferred.resolve(data);
                  })
                  .error(function (data, status, headers, config) {
                      deferred.reject(data);
                  });
                return deferred.promise;
            };
            return { call: _call };
        }]);
}());