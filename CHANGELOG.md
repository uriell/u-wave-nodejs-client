# [1.0.0-beta.1](https://github.com/uriell/u-wave-nodejs-client/compare/v0.5.0...v1.0.0-beta.1) (2021-07-04)


### Code Refactoring

* **http:** removing isAuthenticated getter from index module since we have it in HttpModule ([690889f](https://github.com/uriell/u-wave-nodejs-client/commit/690889f8eaea38da1da09d3eb136039a261150ff))
* **http:** removing request, get, post, put, patch, delete methods and jwt getter from index ([9d0cb06](https://github.com/uriell/u-wave-nodejs-client/commit/9d0cb06e6bebc54a9d4a302c1a0d244022909af9))


### Features

* **chat:** updating chat module to use new http module ([6f68c1b](https://github.com/uriell/u-wave-nodejs-client/commit/6f68c1b11d875534ed722c449a761ecf98ba960f))
* **http:** a new http module for request handling, based from what we had on index ([bdfd926](https://github.com/uriell/u-wave-nodejs-client/commit/bdfd92648e65fb4a7ba07c7a6566f2b777ab3251))


### Performance Improvements

* **auth:** removing authImmediately and credentials options from uWave constructor ([5dbfabb](https://github.com/uriell/u-wave-nodejs-client/commit/5dbfabb84498ba411fb0684dd08545cf00c641aa))


### BREAKING CHANGES

* **auth:** the authImmediately and credentials options were removed from the uWave
constructor, please refer to the auth getter to mimic its implementation
* **http:** the request, get, post, put, patch and delete methods were removed from the index
module, please refer to the http getter for their identic implementation
* **http:** the isAuthenticated getter was removed from the index module, in favor of
HttpModule.isAuthenticated

# [0.5.0](https://github.com/uriell/u-wave-nodejs-client/compare/v0.4.0...v0.5.0) (2021-07-04)


### Features

* **chat:** adding new sendChat method to the chat module ([b8a3648](https://github.com/uriell/u-wave-nodejs-client/commit/b8a36484fe37d6cd3c0d0c5ec7aceb31ff936370))
* **chat:** creating a new chat module and exposing it on the index module ([d5a5b11](https://github.com/uriell/u-wave-nodejs-client/commit/d5a5b117414bc03e1ad0b5ff90afcb8001664738))
* **chat:** implementing deleteAll, deleteAllByUser, deleteMessage, muteUser and unmuteUser methods ([729962a](https://github.com/uriell/u-wave-nodejs-client/commit/729962ab8fe02fe4f0f7495d80606ae4854f7e36))
