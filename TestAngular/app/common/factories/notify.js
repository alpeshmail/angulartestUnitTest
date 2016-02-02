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