# React Native Vkontakte login

This module is a wrapper around native VK SDKs for Android ([VK](https://vk.com/dev/android_sdk), [github](https://github.com/VKCOM/vk-android-sdk))
and iOS ([VK](https://vk.com/dev/ios_sdk), [github](https://github.com/VKCOM/vk-ios-sdk)).

It allows to log in to VK and obtain access token, which you can later use to make VK API calls.

## Compatibility

Use version **0.4.x** of this module if you start a new project.

If you already have a project which uses version **0.1.x** of this module, please do not upgrade to **v0.4.x**.
This procedure is not tested and can cause issues.

- Version **0.4.x** is for react-native **0.58** and higher

- Version **0.3.18** should work with react-native **0.47** and higher. However, **v0.3.x** was test only with react-native **0.52**

Readme for **0.1.x** branch can be found [here](README_V01.md)

- Version **0.1.17** is for react-native **0.47** and newer
- Version **0.1.16** supports react-native from **0.41** up to **0.46**.
- If you need to support older version, see commits history.

## Installation

See [installation guide](installation_v04.md)

## Usage

Import module in your JS code

```js
import VKLogin from 'react-native-vkontakte-login/lib/index';
```

Initialize VK with your APP ID once somewhere during your app startup:

```js
componentDidMount() {
  VKLogin.initialize(5514471);
}
```

Check if user is logged in, perform login and logout:

```js
const isLoggedIn = await VKLogin.isLoggedIn();
const auth = await VKLogin.login(['friends', 'photos', 'email']);
console.log(auth.access_token);
await VKLogin.logout();
```

The module also provides share method:

```js
const shareResponse = await VKLogin.share({
  linkText: 'Cool site',
  linkUrl: 'https://news.ycombinator.com/',
  description: 'Check out this cool site!',
  image: TEST_IMAGE,
});
```

Check [API Reference](API.md) for more information.

## Examples

Example project where this module is installed via Cocoapods: [here](https://github.com/doomsower/react-native-vkontakte-login/tree/master/example-cocoapods)
Example project where this module is installed by modifying XCode project: [here](https://github.com/doomsower/react-native-vkontakte-login/tree/master/example-xcodeproj)

## Contributing

Feel free to submit pull requests
