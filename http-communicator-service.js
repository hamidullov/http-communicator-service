(function () {
    'use strict';

    var HttpCommunicator = function () {

        var baseUrl ="";
        var httpHeaders = {};
        var httpMethod = 'GET';
        var requestTimeout = 60000;


        this.setHeaders = function (headers) {
            return angular.extend(httpHeaders, headers);
        }

        this.getHeaders = function () {
            return angular.copy(httpHeaders);
        }

        this.setBaseUrl = function (url) {
            return baseUrl = url;
        }

        this.setTimeout = function (timeout) {
            return requestTimeout = timeout;
        }

        this.getTimeout = function () {
            return requestTimeout;
        }


        this.setHttpMethod = function (method) {
            return httpMethod = method;
        }

        this.getHttpMethod = function () {
            return httpMethod;
        }


        this.$get = ["_","$http", "$q", "$location", function (_, $http, $q, $location) {

            function getUrl(url, path) {
                return path ? [url.replace(/\/$/, ''), ('' + path).replace(/^\//, '')].join('/') : url;
            };

            function getCanceller(timeout) {
                var req = $q.defer();
                setTimeout(req.resolve, timeout);
                return req;
            }

            return {
                doGetRequest : function doGetRequest(){
                    var args = Array.prototype.slice.call(arguments);
                    args = [baseUrl, 'GET'].concat(args);
                    return this.doRequest.apply(this, args);
                },
                doRESTRequest : function doRESTRequest(){
                    var args = Array.prototype.slice.call(arguments);
                    args = [baseUrl, 'POST'].concat(args);
                    args[5] = angular.extend(args[5] || {}, { 'Content-Type': 'application/json' });

                    return this.doRequest.apply(this, args);
                },
                doDELETERequest: function doRESTRequest() {
                    var args = Array.prototype.slice.call(arguments);
                    args = [baseUrl, 'DELETE'].concat(args);
                    args[5] = angular.extend(args[5] || {}, { 'Content-Type': 'application/json' });

                    return this.doRequest.apply(this, args);
                },
                doRequest: function doRequest(url, method, path, data, urlParams, headers){
                    var method = method || httpMethod,
                        path = path || '',
                        data = data || {},
                        urlParams = urlParams || {},
                        headers = angular.extend({ 'Content-Type': 'application/x-www-form-urlencoded' }
                        , httpHeaders, headers);

                    var canceller = getCanceller(requestTimeout);

                    return $http({
                        method: method,
                        url: getUrl(url, path),
                        headers: headers,
                        timeout: canceller.promise,
                        cancel: canceller,
                        timeoutValue: requestTimeout,
                        data: data,
                        params: urlParams,
                        cache: false,
                        withCredentials: true
                    });
                }
            }

        }];
        
    };

    angular.module('vtbClientPortal.http', []).provider('HttpCommunicator', HttpCommunicator);
})();