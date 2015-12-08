'use strict';
/**
 * Define our module
 */
angular.module('yocto-angular-jwt', [ 'angular-jwt', 'LocalStorageModule' ])
/**
 * Create our constant provider for jwt constant
 */
.provider('jwtConstant', function() {
  // default config values
  var values = {
    // set to 1 minutes by default
    refreshDelay : 60000,
    // set to # by default
    refreshUrl   : '#',
    // define localstorage data
    localStorage : {
      // use by setPrefix method
      prefix : 'jwt',
      // use by setStorageType method. value must be localStorage or session storage
      type   : 'localStorage',
      cookie : {
        // use by setStorageCookie method
        storage : {
          expire  : 0,
          path    : '/'
        },
        // use by setStorageCookieDomain method
        domain : '*',
        // use by setNotify method
        notify : {
          enableSet     : false,   // on set value
          enableDelete  : false    // on delete value
        }
      }
    },
    // auto start value
    autoStart  : false
  };

  // default statement
  return  {
    // set values
    set : function (constants) {
      // extend value
      angular.extend(values, constants);
      // freeze object value with new
      values = Object.freeze(values);
    },
    // default get fn
    $get : function () {
      // default statement
      return values;
    }
  };
})
/**
 * Add jwt insterceptor & Set Configuration for current localstorage provider
 *
 * @param {Object} $httpProvider https://docs.angularjs.org/api/ng/provider/$httpProvider
 *
 * @param {Object} localStorageServiceProvider localStorage provider for localstorage proess
 * @param {Object} jwtConstant constant object to retrieve constant in services
 */
.config([ '$httpProvider', 'localStorageServiceProvider', 'jwtConstantProvider',
function ($httpProvider, localStorageServiceProvider, jwtConstantProvider) {
  // retreive constant here
  var constants = jwtConstantProvider.$get();

  // push interceptor
  $httpProvider.interceptors.push('httpJwtInterceptor');

  // set prefix
  localStorageServiceProvider.setPrefix(constants.localStorage.prefix);
  // set storage type
  localStorageServiceProvider.setStorageType(constants.localStorage.type);
  // set cookie storage
  localStorageServiceProvider.setStorageCookie(constants.localStorage.cookie.storage.expire,
                                               constants.localStorage.cookie.storage.path);
  // set domain
  localStorageServiceProvider.setStorageCookieDomain(constants.localStorage.cookie.domain);
  // set notify
  localStorageServiceProvider.setNotify(constants.localStorage.cookie.notify.enableSet,
                                        constants.localStorage.cookie.notify.enableDelete);
}])
/**
 * A factory to refresh a token
 *
 * @param {Object} localStorageService localStorage service for localstorage proess
 * @param {Object} jwtConstant constant object to retrieve constant in services
 * @param {Object} $http https://docs.angularjs.org/api/ng/service/$http
 */
.service('httpJwtToken', [ 'localStorageService', 'jwtConstant', '$http',
function(localStorageService, jwtConstant, $http) {
  // default statement
  return {
    /**
     * Default method to start token refresh
     * @return {Object} a promise to catch
     */
    refreshToken  : function () {
      // get token
      $http.get(jwtConstant.refreshUrl, {
        headers : {
          'x-jwt-ignore-check'  : true
        }
      }).then(function (response) {
        // save token
        localStorageService.set('x-jwt-token', response.data);
      }, function () {
        // nothing to do here check server log
      });
    }
  };
}])
/**
 * Core process for http jwt process
 *
 * @param {Object} jwtHelper default jwt auth0 helper
 * @param {Object} localStorageService localStorage service for localstorage proess
 * @param {Object} jwtConstant constant object to retrieve constant in services
 */
.factory('httpJwtCore', [ 'jwtHelper', 'localStorageService', 'jwtConstant',
function (jwtHelper, localStorageService, jwtConstant) {
  // default statement
  return {
    /**
     * Add specific header on request to grant access on server
     * @param {Object} request current request object
     */
    addAccessToken : function (request) {
      // retreive token
      var token = localStorageService.get('x-jwt-token');
      // token is null ??
      if (token !== null) {
        // extend request with access token
        angular.extend(request.headers, {
          'x-jwt-access-token'    : localStorageService.get('x-jwt-token'),
          'x-jwt-ignore-decrypt'  : true
        });
      }
      // stringify data
      if (_.has(request.data, 'data')) {
        request.data.data = JSON.stringify(request.data.data);
      }
      // default statement
      return request;
    },
    /**
     * Check if a token is expired
     * @return {Boolean} true if is expired false otherwise
     */
    isExpired     : function () {
      // get current token
      var token = localStorageService.get('x-jwt-token');
      // default statement
      return jwtHelper.isTokenExpired(token);
    },
    /**
     * Decode given token
     * @param {String} token token to decode
     * @return {String} decoded token
     */
    decode        : function (response) {
      // has response config ?
      if (response.config) {
        // check if url if not the refresh url
        if (response.config.url !== jwtConstant.refreshUrl) {
          // is a correct type ??
          if (angular.isArray(response.data)) {
            // default statement
            var decoded = jwtHelper.decodeToken(response.data[0]);
            // is object ?
            if (angular.isObject(decoded)) {
              // list of omit items
              var omits = [ 'iss', 'sub', 'aud', 'exp', 'nbf', 'iat', 'jti' ];
              // remove non needed key
              angular.forEach(omits, function(value) {
                // remove item
                delete decoded[value];
              });
              // set value
              response.data = decoded;
            }
          }
        }
      }
      // default statement
      return response;
    }
  };
}])
/**
 * Process JWt Interceptor
 *
 * @param {Object} $q https://docs.angularjs.org/api/ng/service/$q
 * @param {Object} httpJwtCore core processs of angular jwt
 */
.factory('httpJwtInterceptor', [ '$q', 'httpJwtCore', function ($q, httpJwtCore) {
  // default statement
  return {
    /**
     * Blocks each request to encrypt all data
     */
    request : function(request) {
      // default statement
      return httpJwtCore.addAccessToken(request);
    },
    /**
     * After each response completes, decode the data.
     */
    response : function(response) {
      // default statement
      return httpJwtCore.decode(response);
    },
    /**
     * After each response completes, decode the data.
     */
    responseError : function(responseError) {
      // default statement
      return httpJwtCore.decode(responseError);
    }
  };
}])
/**
 * Process run action
 *
 * @param {Object} $interval https://docs.angularjs.org/api/ng/service/$interval
 * @param {Object} httpJwtToken default refresh function for jwt process
 * @param {Object} jwtConstant constant object to retrieve constant in services
 */
.run([ '$interval', 'httpJwtToken', 'jwtConstant', function($interval, httpJwtToken, jwtConstant) {
  // process an auto start on your app
  if (jwtConstant.autoStart) {
    // interval of refresh
    $interval(function() {
      // refresh token
      httpJwtToken.refreshToken();
    }, jwtConstant.refreshDelay);
  
    // first run
    httpJwtToken.refreshToken();
  }
}]);
