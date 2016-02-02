(function () {
    'use strict';
    angular.module('testApp').controller('test.topnav',
      ['test.user.userService',
        function (userService) {
            var vm = this;
            vm.userServiceLocal = userService;
            vm.name = vm.userServiceLocal.getUserInfo().firstName + vm.userServiceLocal.getUserInfo().lastName;
            vm.logoff = function () {
                vm.userServiceLocal.logoff();
            };
        }]);
}());