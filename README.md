![alt text](https://david-dm.org/yoctore/yocto-angular-jwt.svg "Dependencies Status")

## Overview

This module provide an utility tools for manage access token based on jwt
if you use [yocto-jwt](https://www.npmjs.com/package/yocto-jwt) npm package on our serveur.

## Motivation 

We designed and wrote this module to have a front-end tools that can manage automatically our
jwt token process build with [yocto-jwt](https://www.npmjs.com/package/yocto-jwt) package.

## How it works ?

For each http request an access token was sent with each request.

If you don't have a valid access token your access will be rejected.

The access token was refresh from the server each time your set in `refreshToken` property config.

For more details about this access token please read [yocto-jwt](https://www.npmjs.com/package/yocto-jwt) README

## How to use

```bash
bower install --save yocto-angular-jwt
```

1. First include our dist file in your html header
2. Include in your angular apps our services `yocto-angular-jwt` like : 

```javascript
angular.module('YOUR-APP', [ 'yocto-angular-jwt' ]);
// Your code
```
3. Set your refresh token url and the associated delay like this : 

```javascript
angular.module('YOUR-APP', [ 'yocto-angular-jwt' ])
.config(['jwtConstantProvider', function (jwtConstantProvider) {
  jwtConstantProvider.set({ refreshToken : 30000, refreshUrl : 'YOUR-URL', autoStart : true });
}])
```
## IMPORTANT

Is you are using `yocto-angular-jwt` without [yocto-jwt](https://www.npmjs.com/package/yocto-jwt) you must unstringify.