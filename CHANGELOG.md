# [0.5.0](https://github.com/uriell/u-wave-nodejs-client/compare/v0.4.0...v0.5.0) (2021-07-04)


### Features

* **chat:** adding new sendChat method to the chat module ([b8a3648](https://github.com/uriell/u-wave-nodejs-client/commit/b8a36484fe37d6cd3c0d0c5ec7aceb31ff936370))
* **chat:** creating a new chat module and exposing it on the index module ([d5a5b11](https://github.com/uriell/u-wave-nodejs-client/commit/d5a5b117414bc03e1ad0b5ff90afcb8001664738))
* **chat:** implementing deleteAll, deleteAllByUser, deleteMessage, muteUser and unmuteUser methods ([729962a](https://github.com/uriell/u-wave-nodejs-client/commit/729962ab8fe02fe4f0f7495d80606ae4854f7e36))

# [1.0.0-beta.1](https://github.com/uriell/u-wave-nodejs-client/compare/v0.4.0...v1.0.0-beta.1) (2021-07-04)


### Code Refactoring

* **http:** removing isAuthenticated getter from index module since we have it in HttpModule ([532b464](https://github.com/uriell/u-wave-nodejs-client/commit/532b464e04584b751b8af406f863de2533d4cd21))
* **http:** removing request, get, post, put, patch, delete methods and jwt getter from index ([9a8715e](https://github.com/uriell/u-wave-nodejs-client/commit/9a8715e41abbc38766568d4e83903ec48487327c))


### Features

* **http:** a new http module for request handling, based from what we had on index ([d0edb7f](https://github.com/uriell/u-wave-nodejs-client/commit/d0edb7fa0fc6dd4860e760a4fbd19f834abbe9fd))


### Performance Improvements

* **auth:** removing authImmediately and credentials options from uWave constructor ([c93d4d1](https://github.com/uriell/u-wave-nodejs-client/commit/c93d4d13c4444749e281f30417c38604df139c87))


### BREAKING CHANGES

* **auth:** the authImmediately and credentials options were removed from the uWave
constructor, please refer to the auth getter to mimic its implementation
* **http:** the request, get, post, put, patch and delete methods were removed from the index
module, please refer to the http getter for their identic implementation
* **http:** the isAuthenticated getter was removed from the index module, in favor of
HttpModule.isAuthenticated

# [1.0.0-beta.1](https://github.com/uriell/u-wave-nodejs-client/compare/v0.4.0...v1.0.0-beta.1) (2021-07-04)


### Code Refactoring

* **http:** removing isAuthenticated getter from index module since we have it in HttpModule ([11d24f6](https://github.com/uriell/u-wave-nodejs-client/commit/11d24f62bb7e64c7f6ddd144c1428a30ecddbf90))
* **http:** removing request, get, post, put, patch, delete methods and jwt getter from index ([99e9e93](https://github.com/uriell/u-wave-nodejs-client/commit/99e9e9359babc1a562553123fd9218dcf60803ed))
* **http:** a new http module for request handling, based from what we had on index ([aecd1a4](https://github.com/uriell/u-wave-nodejs-client/commit/aecd1a43ab8e5db1129046fd1020786a85b924d6))


### Performance Improvements

* **auth:** removing authImmediately and credentials options from uWave constructor ([4885f73](https://github.com/uriell/u-wave-nodejs-client/commit/4885f734c70780b8f9b1cd36c77b65865ef33851))


### BREAKING CHANGES

* **auth:** the authImmediately and credentials options were removed from the uWave
constructor, please refer to the auth getter to mimic its implementation
* **http:** the request, get, post, put, patch and delete methods were removed from the index
module, please refer to the http getter for their identic implementation
* **http:** the isAuthenticated getter was removed from the index module, in favor of
HttpModule.isAuthenticated
