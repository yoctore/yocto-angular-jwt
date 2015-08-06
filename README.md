# yocto-angular-http-encrypt

> angular factory to auto encrypt-decrypt base64

This factory create an Angular Interceptor, for http request (In and Out).
[Click here for more details about Angular Interceptor](https://docs.angularjs.org/api/ng/service/$http)

This Interceptor catch each input and output request, and encrypt or decrypt data.


## Getting started

Just import service like :
```jade
  script(src='/dist/yocto-angular-http-encrypt.min.js')
```

And load it on your angular apps :
```js
  var myApp = angular.module('myApp', ['yocto-encrypt-factory']);
```

## More details

### Output request

When a request was send to server, each data in **request.data** will be encoded in base64

### Input request

When a request was send, the response will be decoded. Each data in **response.data** will be decrypted.
**NB :** before make a decryption, a test will be do to check if data is an base64 encoded.
