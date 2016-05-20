

// declare a module
angular.module('myApp', [ 'yocto-angular-jwt' ])
.config(['jwtConstantProvider', function (jwtConstantProvider) {
  jwtConstantProvider.set({ refreshToken : 30000, refreshUrl : 'http://localhost:3000/token/refresh', autoStart : true });
}])
.controller('formContr', ['$scope', '$http', 'jwtConstant', function($scope, $http, jwtConstant) {

  $scope.user = {};

  $scope.send = function(user) {

    var data = {
      email :  user.email,
      pwd   :  user.pwd
    };

    $http.get('http://localhost:3000/home');

    console.log('\n --------------------- encoded data = ');
    console.log(data);
    console.log('-------------------- send request : ');

  $http.post('http://localhost:3000/login', data).
    then(function(response) {
      console.log(' ----- success promise, data decrypted:');
      console.log(response.data);
    }, function(response) {
      console.log(' ----- failed promise, data decrypted');
      console.log(response.data);
    });
  };
}]);
