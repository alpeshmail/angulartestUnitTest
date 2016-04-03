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