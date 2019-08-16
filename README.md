# React Native Vkontakte login

This module is a wrapper around native VK SDKs for Android (v1) ([VK](https://vk.com/dev/android_sdk), [github](https://github.com/VKCOM/vk-android-sdk))
and iOS ([VK](https://vk.com/dev/ios_sdk), [github](https://github.com/VKCOM/vk-ios-sdk)).

It allows to log in to VK and obtain access token, which you can later use to make VK API calls.

## Compatibility

| React Native version(s) | react-native-vkontakte-login version(s) | Old readme                |
| ----------------------- | --------------------------------------- | ------------------------- |
| 1.0.0                   | 0.60+                                   |
| 0.4.x                   | 0.58 - 0.59                             | [0.4](docs/README_V04.md) |
| 0.3.18                  | 0.52 - 0.57                             |
| 0.1.17                  | 0.47 - 0.51                             | [0.1](docs/README_V01.md) |
| 0.1.16                  | 0.41 - 0.46                             | [0.1](docs/README_V01.md) |

## Installation

```bash
yarn add react-native-vkontakte-login
```

This module support autolinking. However, some additional steps are required to configure native parts. They can be done automatically by running this script and answering questions:

```bash
yarn rn-vk-postlink
```

The last step is to run `pod install`:

```bash
cd ios && pod install
```

For manual installation instructions and for more detailed script description [read this](docs/installation.md).

## Usage

Import module in your JS code

```js
import VKLogin from 'react-native-vkontakte-login';
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

Check out [API Reference](docs/API.md) for more information.

## License

[MIT](https://github.com/doomsower/react-native-vkontakte-login/blob/master/LICENSE)

## Contributing

Feel free to submit pull requests
