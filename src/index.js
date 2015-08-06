/**
 * @date 06/08/15
 * @author Balard Cédric <cedric@yocto.re>
 */


// Tricks need to declare outsite. if we do not we must chain factory delacration
// more simple free like this
var service =  angular.module('yocto-encrypt-factory', []);

// Set intercept now, because yocto-angular-http-encrypt will be load easily
service.config(['$httpProvider', function($httpProvider) {
  $httpProvider.interceptors.push('httpEncryptInterceptor');
}]);

/**
* HttpInterceptor for angular request
* @see : https://docs.angularjs.org/api/ng/service/$q
* @param (Object), $q, async angular tools
*/
service.factory('httpEncryptInterceptor', ['$q', function($q) {

  /**
   * Decrypt all data in base64
   * @param  {String} val data to Decrypt
   * @return {[type]}     [description]
   */
  function decrypt(val) {
    var regexp = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/;

    // Check if is an base64 with regexp and test if it's multiple of 4
    if (val.match(regexp) && val.length % 4 === 0) {
      try {
        return JSON.parse(atob(val));
      } catch (e) {
        console.log('ERROR : data was not encoded in base64');
      }
    }
    return val;
  }

  /**
   * Encrypt all data in base64
   * @param  {Object} val object to Encrypt
   * @return {String} return the encrypted object
   */
  function encrypt(val) {
    //Jsonify the value end encrypt it
    var encrypted = {
      data : btoa(JSON.stringify(val))
    };
    return encrypted;
  }

  return {
    /**
     * Blocks each request to encrypt all data
     */
    request : function(request) {
      console.log(' [ interceptors.request ] .... ');
      console.log(request.data);
      request.data = encrypt(request.data);
      return request;
    },
    /**
    * After each response completes, decode the data.
    */
    response : function(response) {
      console.log(' [ interceptors.responseeee ] .... ');
      console.log(response);
      response.data = decrypt(response.data);
      return response;
    },
    /**
    * After each response completes, decode the data.
    */
    responseError : function(responseError) {
      console.log(' [ interceptors.responseeee error ] .... ');
      responseError.data = decrypt(responseError.data);
      return $q.reject(responseError);
    },
  };
}]);
