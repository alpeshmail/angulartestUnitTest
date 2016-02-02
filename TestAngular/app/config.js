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