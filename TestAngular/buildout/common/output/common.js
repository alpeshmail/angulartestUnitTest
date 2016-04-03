(function () {
    'use strict';
    var commonModule =angular.module('common', []);

    // Must configure the common service and set its 
    // events via the commonConfigProvider
    commonModule.provider("commonConfig", function () {
        this.config = {
            // These are the properties we need to set
            //controllerActivateSuccessEvent: '',
            //spinnerToggleEvent: ''
        };

        this.$get = function () {
            return {
                config: this.config
            };
        };
    });

    function common(config) {

        function constructUrl(routename) {
            return config.baseServiceUrl.concat("/" + routename);
        }

        function getItemByKeyOfDictionary(dictionary, keyId, keyName) {
            for (var ind = 0; ind < dictionary.length; ind += 1) {
                if (dictionary[ind][keyName] === keyId) {
                    return dictionary[ind];
                }
            }
            return undefined;
        };

        function getUniqueArray(array) {
            return array.reduce(function (p, c) {
                if (p.indexOf(c) < 0) p.push(c);
                return p;
            }, []);
        }

        var service = {
            constructUrl: constructUrl,
            getItemByKeyOfDictionary: getItemByKeyOfDictionary,
            getUniqueArray: getUniqueArray
        };

        return service;
    }

    commonModule.factory("common",
    ["config", common]);

}());
(function () {
    "use strict";
    
    angular.module("common").factory("common.helper",
        [function () {
            var _service;

            var _generateSearchParams = function(param){
                var options,searchParams,searchFilters;
                options = param.options;
                searchFilters = param.searchFilters;
                searchParams = {
                    Take: options.data.take,
                    Skip: options.data.skip,
                    Filter: undefined,
                    Sort: undefined,
                    Group: options.data.group
                };

                // Add sorting
                if (angular.isDefined(options.data.sort) && options.data.sort !== null) {
                    searchParams.Sort = options.data.sort;
                }

                // Add Filtering
                if (!angular.isDefined(searchFilters) || searchFilters === null) {
                    searchParams.Filter = options.data.filter;
                }
                else if (angular.isDefined(options.data.filter) && options.data.filter !== null) {
                    options.data.filter.filters = options.data.filter.filters.concat(searchFilters);
                    searchParams.Filter = options.data.filter;
                }
                else if (searchFilters.length > 0) {
                    searchParams.Filter = ({
                        logic: "and",
                        filters: searchFilters
                    });
                }
                return searchParams;
            };

            function deleteKey(obj,keyToRemove)
            {
                if(Object.getOwnPropertyNames(obj).length === 0){
                    return;
                }
                for(var removeKey in keyToRemove)
                {
                    var notPostedKey=keyToRemove[removeKey];
                    if (angular.isDefined(obj[notPostedKey]))
                    {
                        delete obj[notPostedKey];
                    }
                }
                for (var key in obj) {
                    if (obj.hasOwnProperty(key)) {
                        if (obj[key] !== null && typeof obj[key] === "object") {
                            deleteKey(obj[key],keyToRemove);
                        }
                    }
                }
            }

            var _deleteUnwantedPostData = function (param){
                //var copyData={};
                var copyData = JSON.parse(JSON.stringify(param.data));
                //angular.copy(param.data, copyData);
                deleteKey(param.data,param.keyToRemove);
                return copyData;
            }

            var removeNulls = function (obj){
                if(Object.getOwnPropertyNames(obj).length === 0){
                    return;
                }
                for (var key in obj) {
                    if (obj.hasOwnProperty(key)) {
                        if (typeof obj[key] === "object") {
                            removeNulls(obj[key],keyToRemove);
                            if(Object.getOwnPropertyNames(obj[key]).length === 0){
                                delete obj[key];
                            }
                        }
                        else
                        {
                            if (key === null || angular.isUndefined(key))
                            {
                                delete obj[key];
                            }
                        }
                    }
                }
            }

            _service = {
                generateSearchParams : _generateSearchParams,
                deleteUnwantedPostData:_deleteUnwantedPostData,
                removeNulls:removeNulls
            };
            return _service;

        }]);
}());
(function () {
    "use strict";
    angular.module("common").factory("common.factories.log",
      ["$log",
        function ($log) {
            var timers = {};
            var _debug = function () {
                $log.debug.apply($log, arguments);
            };
            var _error = function () {
                $log.error.apply($log, arguments);
            };
            var _info = function () {
                $log.info.apply($log, arguments);
            };
            var _log = function () {
                $log.log.apply($log, arguments);
            };
            var _warn = function () {
                $log.warn.apply($log, arguments);
            };
            var _setTimer = function (/*timerName, optional message(s)*/) {
                var timerName = arguments.length > 0 ? arguments[0] : null;
                var messages = arguments.length > 1 ? Array.prototype.slice.call(arguments, 1) : [];
                if (!timerName) {
                    throw new Error("timerName is not specified");
                }
                var newTime = new Date();
                var timerMessage = timers[timerName] ? ("[Timer:" + timerName + " reset] ") : ("[Timer:" + timerName + " set] ");
                messages.unshift(timerMessage);
                timers[timerName] = newTime;
                $log.debug.apply($log, messages);
            };
            var _clearTimer = function (/*timerName, optional message(s)*/) {
                var timerName = arguments.length > 0 ? arguments[0] : null;
                var messages = arguments.length > 1 ? Array.prototype.slice.call(arguments, 1) : [];
                if (!timerName) {
                    throw new Error("timerName is not specified");
                }
                var timerMessage = timers[timerName] ? ("[Timer:" + timerName + " execution: " + (new Date() - timers[timerName]) / 1000 + "ms] ") : ("[Timer:" + timerName + " not exists] ");
                messages.unshift(timerMessage);
                delete timers[timerName];
                $log.debug.apply($log, messages);
            };
            return { debug: _debug, error: _error, info: _info, log: _log, warn: _warn, setTimer: _setTimer, clearTimer: _clearTimer };
        }]);
}());
(function () {
    "use strict";
    angular.module("common").factory("common.notify",
      [function () {
          var _open = function (options) {
              var notify = new PNotify(options);
              //var notify = $.pnotify(options);
              return notify;
          };
          var _close = function (instance) {
              if (instance && instance.pnotify_remove) {
                  instance.pnotify_remove();
              }
          };
          var _closeAll = function () {
              $.pnotify_remove_all();
          };
          return {
              open: _open,
              close: _close,
              closeAll: _closeAll
          };
      }]);
}());
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