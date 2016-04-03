(function () {
    "use strict";
    
    angular.module("common").factory("common.helper",
        [function () {
            var _service;

            var _generateSearchParams = function(param){
                var options,searchParams,searchFilters;
                options = param.options;
                searchFilters = param.searchFilters;
                searchParams = {
                    Take: options.data.take,
                    Skip: options.data.skip,
                    Filter: undefined,
                    Sort: undefined,
                    Group: options.data.group
                };

                // Add sorting
                if (angular.isDefined(options.data.sort) && options.data.sort !== null) {
                    searchParams.Sort = options.data.sort;
                }

                // Add Filtering
                if (!angular.isDefined(searchFilters) || searchFilters === null) {
                    searchParams.Filter = options.data.filter;
                }
                else if (angular.isDefined(options.data.filter) && options.data.filter !== null) {
                    options.data.filter.filters = options.data.filter.filters.concat(searchFilters);
                    searchParams.Filter = options.data.filter;
                }
                else if (searchFilters.length > 0) {
                    searchParams.Filter = ({
                        logic: "and",
                        filters: searchFilters
                    });
                }
                return searchParams;
            };

            function deleteKey(obj,keyToRemove)
            {
                if(Object.getOwnPropertyNames(obj).length === 0){
                    return;
                }
                for(var removeKey in keyToRemove)
                {
                    var notPostedKey=keyToRemove[removeKey];
                    if (angular.isDefined(obj[notPostedKey]))
                    {
                        delete obj[notPostedKey];
                    }
                }
                for (var key in obj) {
                    if (obj.hasOwnProperty(key)) {
                        if (obj[key] !== null && typeof obj[key] === "object") {
                            deleteKey(obj[key],keyToRemove);
                        }
                    }
                }
            }

            var _deleteUnwantedPostData = function (param){
                //var copyData={};
                var copyData = JSON.parse(JSON.stringify(param.data));
                //angular.copy(param.data, copyData);
                deleteKey(param.data,param.keyToRemove);
                return copyData;
            }

            var removeNulls = function (obj){
                if(Object.getOwnPropertyNames(obj).length === 0){
                    return;
                }
                for (var key in obj) {
                    if (obj.hasOwnProperty(key)) {
                        if (typeof obj[key] === "object") {
                            removeNulls(obj[key],keyToRemove);
                            if(Object.getOwnPropertyNames(obj[key]).length === 0){
                                delete obj[key];
                            }
                        }
                        else
                        {
                            if (key === null || angular.isUndefined(key))
                            {
                                delete obj[key];
                            }
                        }
                    }
                }
            }

            _service = {
                generateSearchParams : _generateSearchParams,
                deleteUnwantedPostData:_deleteUnwantedPostData,
                removeNulls:removeNulls
            };
            return _service;

        }]);
}());