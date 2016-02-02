(function () {
    'use strict';
    angular.module('testApp').controller('test.user.login',
	  ['$scope',
		'$state',
		//'test.user.userService',
		function ($scope, $state) {
		    //var vm = this;
		    //$scope.username = '';
		    //$scope.password = '';
		    //$scope.errors = [];
		    //$scope.isLoginButtonDisabled = false;
		    //vm.userServiceLocal = userService;
		    //var nextState = null;
		    //try {
		    //	nextState = vm.userServiceLocal.getNextState();
		    //} catch (e) {
		    //	nextState = null;
		    //}
		    //if (nextState !== null) {
		    //	var nameBuffer = nextState.name;
		    //	var errorBuffer = nextState.error;
		    //	vm.userServiceLocal.clearNextState();
		    //	nextState = {
		    //		name: nameBuffer,
		    //		error: errorBuffer
		    //	};
		    //	if (typeof nextState.error === 'string' && nextState.error !== '' && $scope.errors.indexOf(nextState.error) === -1) {
		    //		$scope.errors.push(nextState.error);
		    //	} else {
		    //		$scope.errors.push('You must be logged in to view this page');
		    //	}
		    //}
		    //$scope.isErrorDialogVisible = false;
		    //vm.title = 'login';
		    //function disableLoginButton() {
		    //	$scope.isLoginButtonDisabled = true;
		    //}

		    //function enableLoginButton() {
		    //	$scope.isLoginButtonDisabled = false;
		    //}

		    //function onSuccessfulLogin() {
		    //	if (nextState !== null && typeof nextState.name === 'string' && nextState.name !== '') {
		    //		$state.go(nextState.name, nextState.params);
		    //	} else {
		    //		$state.go('test');
		    //	}
		    //}

		    //$scope.login = function () {
		    //	disableLoginButton();
		    //    //vm.userServiceLocal.authenticate($scope.username, $scope.password, onSuccessfulLogin);
		    //	onSuccessfulLogin();
		    //};
		}]);
}());