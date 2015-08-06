

// declare a module
var myApp = angular.module('myApp', ['yocto-encrypt-factory']);


myApp.controller('formContr', ['$scope', '$http', function($scope, $http) {
  $scope.user = {};

  $scope.send = function(user) {

    var data = {
      email :  user.email,
      pwd   :  user.pwd
    };

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
