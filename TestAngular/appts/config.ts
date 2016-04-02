module HaveIBeenPwned {
    'use strict';

    function routes($routeProvider: ng.route.IRouteProvider) {
        $routeProvider
            .when("/searchMyHandle", {
                templateUrl: '/scripts/modules/HaveIBeenPwned/_searchView.html',
                controller: 'SearchHandleController'
            });

        
    }

    routes.$inject = ['$routeProvider'];

    angular.module('HaveIBeenPwned')
        .config(routes);

    
}