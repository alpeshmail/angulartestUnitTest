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