var globalapp = {};
globalapp.ajax = {};
globalapp.debugMode = true;
globalapp.url = '/jserror'; // error tracking url 
globalapp.ajax.x = function() {
    if (typeof XMLHttpRequest !== 'undefined') {
        return new XMLHttpRequest();
    }
    var versions = ["MSXML2.XmlHttp.6.0", "MSXML2.XmlHttp.5.0", "MSXML2.XmlHttp.4.0", "MSXML2.XmlHttp.3.0", "MSXML2.XmlHttp.2.0", "Microsoft.XmlHttp"];
    var xhr;
    for (var i = 0; i < versions.length; i++) {
        try {
            xhr = new ActiveXObject(versions[i]);
            break;
        } catch (e) {}
    }
    return xhr;
};
globalapp.post = function(value) {
    var xhr = new XMLHttpRequest(); // :) we can't bind $http so this tricky code 
    xhr.open("POST", url, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify({
        value: value
    }));
}




if (!globalapp.debugMode) {
                $provide.decorator('$exceptionHandler', ['$log', '$delegate',
                    function($log, $delegate) {
                        return function(exception, cause) {
                            $delegate(exception, cause);
                            var formatted = '';
                            var properties = '';
                            formatted += 'Exception: "' + exception.toString() + '"\n';
                            formatted += 'Caused by: ' + cause + '\n';
                            properties += (exception.message) ? 'Message: ' + exception.message + '\n' : ''
                            properties += (exception.fileName) ? 'File Name: ' + exception.fileName + '\n' : ''
                            properties += (exception.lineNumber) ? 'Line Number: ' + exception.lineNumber + '\n' : ''
                            properties += (exception.stack) ? 'Stack Trace: ' + exception.stack + '\n' : ''
                            if (properties) {
                                formatted += properties;
                            }
                            var data = {
                                info: formatted
                            };
                            globalapp.post(data);
                            $log.debug('Sending Errors to Server for Developer Concerns.');
                        };
                    }
                ]);
            }
            $provide.factory('HttpInterceptor', function($q, $injector, $location) {
                var canceller = $q.defer();
                return {
                    // optional method
                    'request': function(config) {
                        // do something on success
                        return config;
                    },
                    // optional method
                    'requestError': function(rejection) {
                        // do something on error
                        // if (canRecover(rejection)) {
                        //   return responseOrNewPromise
                        // }
                        // return $q.reject(rejection);
                        return rejection;
                    },
                    // optional method
                    'response': function(response) {
                        return response;
                    },
                    // optional method
                    'responseError': function(rejection) {
                        if (rejection.status === 401) {
                            console.log('401')
                            // canceller.resolve('Unauthorized'); 
                            //$location.url('logout');
                        }
                        if (rejection.status === 403) {
                            console.log('403')
                            //canceller.resolve('Forbidden');  
                            //$location.url('/');
                        }
                        if (rejection.status === 500) {
                            console.log('500')
                            //canceller.resolve('Forbidden');  
                            //$location.url('/');
                        }
                        console.log(rejection)
                        return rejection;
                    }
                };
            });
            $httpProvider.interceptors.push('HttpInterceptor')
