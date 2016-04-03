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