(function () {
    'use strict';
    angular.module('testApp').factory('test.user.userService',
      [
       // 'common.factories.webApi',
        //'common',
        '$q',
        '$rootScope',
        '$state',
        'common.factories.webApi',
        function ($q, $rootScope, $state, webapi) {
            var _getUserInfo, _authenticate, _setNextState, _isAuthenticated, _getNextState, _clearNextState,
              _hasRole, _logoff;
            var userInfo = {
                isAuthenticated: false,
                firstName: undefined,
                lastName: undefined,
                email: undefined,
                userName: undefined,
                roles: undefined
            };
            var nextState = {
                name: '',
                error: ''
            };

            function setuserInfo(data) {
                userInfo.isAuthenticated = true;
                userInfo.lastName = data.LastName;
                userInfo.firstName = data.FirstName;
                userInfo.email = data.Email;
                userInfo.userName = data.UserName;
                userInfo.roles = data.RolesList;
                $rootScope.$broadcast('rolesChanged');
            }

            function NextStateUndefinedException(message) {
                nextState.name = 'NextStateUndefined';
                nextState.message = message;
            }

            function resetuserInfo() {
                userInfo.isAuthenticated = false;
                userInfo.lastName = undefined;
                userInfo.firstName = undefined;
                userInfo.email = undefined;
                userInfo.userName = undefined;
                userInfo.roles = undefined;
                $rootScope.$broadcast('rolesChanged');
            }

            _getUserInfo = function () {
                return userInfo;
            };
            _authenticate = function (username, password, successCallback) {
                var request = {
                    url: common.constructUrl('Account/login'),
                    method: 'POST',
                    data: {
                        UserName: username,
                        password: password
                    }
                };
                webApi.call(request).then(function (data) {
                    setuserInfo(data);
                    localStorage.setItem("CsrfToken", data.CsrfToken);
                    if (typeof successCallback === 'function') {
                        successCallback();
                    }
                });
            };
            _logoff = function () {
                var request = {
                    url: common.constructUrl('Account/logout'),
                    method: 'POST'
                };
                webApi.call(request).then(function () {
                    resetuserInfo();
                    $state.go('login', {}, { reload: true });
                });
            };
            _setNextState = function (name, error) {
                nextState.name = name;
                nextState.error = error;
            };
            _isAuthenticated = function (stateName) {
                //First Check if user is already logged in
                if (userInfo.isAuthenticated) {
                    var deferred = $q.defer();
                    var promise = deferred.promise;
                    deferred.resolve();
                    return promise.then(function success() {
                        return true;
                    });
                }
                //if user is not logged in, check with server, if user has already open session
                var request = {
                    url: common.constructUrl('Account/UserInfo'),
                    method: 'GET'
                };
                if (nextState.name === '') {
                    _setNextState(stateName, 'You must re-login to continue');
                }
                return webApi.call(request).then(function (data) {
                    setuserInfo(data);
                    return true;
                });
            };
            _getNextState = function () {
                if (nextState.name === '') {
                    throw new NextStateUndefinedException('No state data was set');
                }
                return nextState;
            };
            _clearNextState = function () {
                nextState.name = '';
                nextState.error = '';
            };
            _hasRole = function (role) {
                var hasRole = false;
                angular.forEach(userInfo.roles, function (item) {
                    if (item === role) {
                        hasRole = true;
                    }
                });
                return hasRole;
            };
            return {
                getUserInfo: _getUserInfo,
                authenticate: _authenticate,
                isAuthenticated: _isAuthenticated,
                setNextState: _setNextState,
                clearNextState: _clearNextState,
                getNextState: _getNextState,
                hasRole: _hasRole,
                logoff: _logoff
            };
        }]);
}());