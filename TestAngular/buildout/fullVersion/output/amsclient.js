(function () {
    'use strict';
    angular.module('testApp', []);
    angular.module('testApp', [
            'ngSanitize',
            'ngAnimate',
            'ngMessages',
            'ui.router',
            'ui.bootstrap',
            'common'
    ]
    );
}());
(function () {
    'use strict';
    PNotify.prototype.options.styling = "bootstrap3";
    PNotify.prototype.options.delay = 3000;
    PNotify.prototype.options.nonblock = true;
    PNotify.prototype.options.history = false;
    PNotify.prototype.options.type = 'info';
    var testAppVar = angular.module('testApp');
    var config = {
        docTitle: 'Test APP: ',
        baseServiceUrl: 'api'
    };
    testAppVar.value('config', config);
    testAppVar.config(['$httpProvider', '$locationProvider', function ($httpProvider, $locationProvider) {
        $httpProvider.defaults.withCredentials = true;
        //$locationProvider.hashPrefix();
        //$locationProvider.html5Mode(false);
        $httpProvider.interceptors.push('authInterceptorService');
    }]);
    //testAppVar.config(['datepickerConfig', function (datepickerConfig) {
    //    datepickerConfig.maxDate = '2099-01-01';
    //    datepickerConfig.minDate = 'minDate';
    //    datepickerConfig.datepickerOptions = 'dateOptions';
    //    datepickerConfig.closeText = 'Close';
    //    datepickerConfig.dateDisabled = 'disabled(date, mode)';
    //}]);
    testAppVar.config(['$compileProvider', '$logProvider', function ($compileProvider, $logProvider) {
        $compileProvider.debugInfoEnabled(false);
        $logProvider.debugEnabled(false);
    }]);
    testAppVar.factory('authInterceptorService',
        ['$q',
            '$injector',
            'common.notify',
            function ($q, $injector, notify) {
                var authInterceptorServiceFactory = {};
                var _responseError = function (rejection) {
                    if (rejection.status === 401) {
                        notify.open({
                            title: 'Authentication Failed:',
                            text: 'User is not logged in, redirecting to Login page',
                            type: 'error',
                            nonblock: false,
                            width: '40%'
                        });
                        $injector.get('$state').go('login', {}, { reload: true });
                    }
                    else if (rejection.status === 403) {
                        notify.open({
                            title: 'Authorization Failed:',
                            text: 'User is not entitle to content.',
                            type: 'error',
                            nonblock: false,
                            width: '40%'
                        });
                        $injector.get('$state').go('test.unauthorized', {}, { reload: true });
                    }
                    else {
                        notify.open({
                            title: 'An error occurred:',
                            text: rejection.data.errorMessage,
                            type: 'error',
                            nonblock: false,
                            width: '40%'
                        });
                    }
                    return $q.reject(rejection);
                };
                authInterceptorServiceFactory.responseError = _responseError;
                return authInterceptorServiceFactory;
            }]);
}());
(function () {
    'use strict';
    var testAppVar = angular.module('testApp');
    testAppVar.config(['$stateProvider',
      '$urlRouterProvider',
      '$locationProvider',
    function ($stateProvider, $urlRouterProvider, $locationProvider) {

        //$locationProvider.html5Mode({
        //    enabled: true,
        //    requireBase: true
        //});

        $stateProvider.state('test',
            {
            url: '/', views: {
                'navContainerView': { templateUrl: 'app/layout/topnav.html' }
            }, data: { title: 'Home', role: 'testUser' }, resolve: {
                userSession: ['test.user.userService', function (userService) {
                    return userService.isAuthenticated(this.name).then(function () {
                        return true;
                    });
                }]
            }
        });
        //$stateProvider.state('test.changePassword', { url: 'changePassword', views: { 'mainContainerView@': { templateUrl: 'app/account/partials/changePassword.html' } }, data: { title: 'Modify Password' } });
        $stateProvider.state('login', {
            url: '/login', views: { 'mainContainerView': { templateUrl: 'app/account/partials/login.html' } },
            data: { title: 'Login' },
            authenticate: false
        });
        //$stateProvider.state('test.account', { url: 'account', views: { 'mainContainerView@': { templateUrl: 'app/account/account.html' } }, data: { title: 'User Account' } });
        $stateProvider.state('test.unauthorized', {
            url: 'unauthorized', views: { 'mainContainerView@': { templateUrl: 'app/error.html' } }
            , data: { title: 'Unauthorized Access' }
            , authenticate: true
        });
        $urlRouterProvider.otherwise('/');
        //if ($window.history && $window.history.pushState) {
        //    $locationProvider.html5Mode(true);
        //}
    }
    ]);
    testAppVar.run([
      '$rootScope',
      '$state',
    
      function ($rootScope, $state) {

          //$rootScope.$on('$stateChangeStart', function (event, toState, toParams) {
          //    if (!userInfo.isAuthenticated)
          //    {
          //        $state.go('login', {}, { reload: true });
          //    }
          //    //var userInfo = authService.getUserInfo();
          //    //if (!userInfo.isAuthenticated && authenticate) {
          //    //    $rootScope.returnToState = toState.url;
          //    //    $rootScope.returnToStateParams = toParams.Id;
          //    //   // $location.path('/login');
                
          //    //}
              
          //});

          $rootScope.$on('$stateChangeStart', function (event, toState, toStateParams) {

              //var isLogin = toState.name === "login";

              //if (isLogin) {

              //    return; // no need to redirect anymore 
              //}

              if (toState.url === "/") {
                 // $state.go('login', {}, { reload: true });
                  $state.go('login');
                  event.preventDefault();
              }
             // console.log("test" + toStateParams.toState);
              // track the state the user wants to go to; authorization service needs this
              //
              //$rootScope.toState = toState;
              //$rootScope.toStateParams = toStateParams;
              //// if the principal is resolved, do an authorization check immediately. otherwise,
              //// it'll be done when the state it resolved.
              //if (principal.isIdentityResolved()) authorization.authorize();
          });
          $rootScope.$on('$stateChangeError', function (event, toState, toParams, fromState, fromParams, error) {
             // $state.go('login', {}, { reload: true });
             // $state.go('login', {}, { reload: true });
              if (error.name === 'AuthenticationRequired') {
                  userService.setNextState(toState.name, 'You must login to access this page');
                  $state.go('login', {}, { reload: true });
              }
          });
          $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
              if (angular.isDefined(toState.data.role) && !userService.hasRole(toState.data.role)) {
                  $state.go('test.unauthorized', {}, { reload: true });
              }
              if (angular.isDefined(toState.data.title)) {
                  $rootScope.title = 'test 2.0 -- '.concat(toState.data.title);
              }
          });
      }
    ]);
}());
(function () {
    'use strict';
    angular.module('testApp').factory('$exceptionHandler',
      ['common.notify',
        'common.factories.log',
        function (notify, log) {
            return function (e/*, cause*/) {
                log.error(e);
                notify.open({ title: 'An error occurred:', text: e.toString(), type: 'error', nonblock: false, width: '40%' });
            };
        }]);
}());
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