(function () {
    'use strict';
    var commonModule =angular.module('common', []);

    // Must configure the common service and set its 
    // events via the commonConfigProvider
    commonModule.provider("commonConfig", function () {
        this.config = {
            // These are the properties we need to set
            //controllerActivateSuccessEvent: '',
            //spinnerToggleEvent: ''
        };

        this.$get = function () {
            return {
                config: this.config
            };
        };
    });

    function common(config) {

        function constructUrl(routename) {
            return config.baseServiceUrl.concat("/" + routename);
        }

        function getItemByKeyOfDictionary(dictionary, keyId, keyName) {
            for (var ind = 0; ind < dictionary.length; ind += 1) {
                if (dictionary[ind][keyName] === keyId) {
                    return dictionary[ind];
                }
            }
            return undefined;
        };

        function getUniqueArray(array) {
            return array.reduce(function (p, c) {
                if (p.indexOf(c) < 0) p.push(c);
                return p;
            }, []);
        }

        var service = {
            constructUrl: constructUrl,
            getItemByKeyOfDictionary: getItemByKeyOfDictionary,
            getUniqueArray: getUniqueArray
        };

        return service;
    }

    commonModule.factory("common",
    ["config", common]);

}());