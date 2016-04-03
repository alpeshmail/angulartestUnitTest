var HaveIBeenPwned;
(function (HaveIBeenPwned) {
    'use strict';
    function routes($routeProvider) {
        $routeProvider
            .when("/searchMyHandle", {
            templateUrl: '/scripts/modules/HaveIBeenPwned/_searchView.html',
            controller: 'SearchHandleController'
        });
    }
    routes.$inject = ['$routeProvider'];
    angular.module('HaveIBeenPwned')
        .config(routes);
})(HaveIBeenPwned || (HaveIBeenPwned = {}));
//# sourceMappingURL=config.js.map