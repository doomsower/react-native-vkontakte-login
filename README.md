# React Native Vkontakte login

This module is a wrapper around native VK SDKs for [Android](https://new.vk.com/dev/android_sdk) and [iOS](https://new.vk.com/dev/ios_sdk).

It allows to log in to VK and obtain access token, which you can later use to make VK API calls.

Supports react-native **0.41** and newer. If you need to support older version, see commits history.

## Installation

`npm install --save react-native-vkontakte-login`

### vk.com

First, configure your vk.com app.

For iOS, you will need to fill in `App Bundle for iOS` field.

For Android, you will need to fill in `Package name for Android`, `Main Activity for Android`, `Signing certificate fingerprint for Android` fields. To obtain the fingerprint, you can follow the [guide](https://new.vk.com/dev/android_sdk) from VK Android SDK documentation.

<img src="https://raw.githubusercontent.com/doomsower/react-native-vkontakte-login/master/images/vk_app_settings.png" alt="vk settings" />


### Android

1. Run `react-native link`

    Alternatuvely, install it manually:

    ```gradle
    // file: android/settings.gradle
    ...

    include ':react-native-vkontakte-login'
    project(':react-native-vkontakte-login').projectDir = new File(settingsDir, '../node_modules/react-native-vkontakte-login/android')
    ```
    ```gradle
    // file: android/app/build.gradle
    ...

    dependencies {
        ...
        compile project(':react-native-vkontakte-login')
    }
    ```
    ```java
    // file: android/app/src/main/java/<...>/MainApplication.java
    ...

    import camp.kuznetsov.rn.vkontakte.VKAuthPackage; //<---- import package

    public class MainApplication extends Application implements ReactApplication {
    ...
      @Override
      protected List<ReactPackage> getPackages() {
        return Arrays.<ReactPackage>asList(
            new MainReactPackage(),
            ...
            new VKAuthPackage()//<---- Add package
          );
      }
    ...
    }
    ```
2. In your AndroidManifest.xml, add following line inside `<application>` element:
    ```xml
    <activity android:name="com.vk.sdk.VKServiceActivity" android:label="ServiceActivity" android:theme="@style/VK.Transparent" />
    ```

3. **(Optional)** Add VK Application ID to resources (main/res/values/strings.xml) so the module will initialize with it at startup:
    ```xml    
    <integer name="com_vk_sdk_AppId">VK_APP_ID</integer>
    ```
    (In this example, VK_APP_ID should be replaced with 5514471) If you do so, you won't need to call `VKLogin.initialize(vkAppId)` from your JS code.

### iOS

1. This module requires CocoaPods to be used in iOS project. To add CocoaPods to your React Native project, follow steps 2 throught 7 of [this](https://blog.callstack.io/login-users-with-facebook-in-react-native-4b230b847899#.lai35aq3a) tutorial.
Add this line  

    ```ruby
    pod 'react-native-vkontakte-login', :path => '../node_modules/react-native-vkontakte-login'
    ```
    to your Podfile (you may need to adjust path if you have non-standard project structure).
Don't forget to fix linker errors by adding `$(inherited)` to **Other Linker Flags** in Build Settings:

    <img src="https://raw.githubusercontent.com/doomsower/react-native-vkontakte-login/master/images/other_linker_flags.png" alt="xcode url type" />

2. Add following fragment to your `info.plist`:
    ```xml
    <key>LSApplicationQueriesSchemes</key>
    <array>
        <string>vk</string>
        <string>vk-share</string>
        <string>vkauthorize</string>
    </array>
    ```

3. To use authorization via VK App you need to setup a url-schema of your application.
Open your application settings then select the Info tab. In the URL Types section click the plus sign.
Enter vk+APP_ID (e.g. vk5514471) to the **Identifier** and **URL Schemes** fields.

    <img src="https://raw.githubusercontent.com/doomsower/react-native-vkontakte-login/master/images/url_types.png" alt="xcode url type" />

    Alternatively, you can add following to your info.plist (of course, you should replace 5514471 with your VK Application ID):

    ```xml
    <key>CFBundleURLTypes</key>
    <array>
        <dict>
            <key>CFBundleTypeRole</key>
            <string>Editor</string>
            <key>CFBundleURLName</key>
            <string>vk5514471</string>
            <key>CFBundleURLSchemes</key>
            <array>
                <string>vk5514471</string>
            </array>
        </dict>
    </array>
    ```

4. In your AppDelegate.m, you need to import VK SDK: `#import "VKSdk.h"` and then add following code (both methods are required):

    ```objc
    //iOS 9 workflow
    - (BOOL)application:(UIApplication *)app openURL:(NSURL *)url options:(NSDictionary<NSString *,id> *)options {
       [VKSdk processOpenURL:url fromApplication:options[UIApplicationOpenURLOptionsSourceApplicationKey]];
       return YES;
    }

    //iOS 8 and lower
    -(BOOL)application:(UIApplication *)application openURL:(NSURL *)url sourceApplication:(NSString *)sourceApplication annotation:(id)annotation
    {
       [VKSdk processOpenURL:url fromApplication:sourceApplication];
       return YES;
    }
    ```

5. **(Optional)** You can add your VK Application ID to `info.plist` so the module will initialize with it at startup:

    ```xml
    <key>VK_APP_ID</key>
    <integer>5514471</integer>
    ```

    If you do so, you won't need to call `VKLogin.initialize(vkAppId)` from your JS code.

#### Installation without CocoaPods

1. Install vk-ios-sdk. Download sdk from [https://github.com/VKCOM/vk-ios-sdk](https://github.com/VKCOM/vk-ios-sdk).
   Add VK-ios-sdk.xcodeproj as sub-project to your project. Open your project in
   Xcode -> Go to General tab -> Find the Embedded Binaries section -> Click Add items (plus sign) -> And select
   VKSdkFramework.framework from the VK-ios-sdk project
2. Create new group called _react-native-vkontakte-login_ under *Libraries* in *Project navigator* panel
3. Open *Finder* an go to _your-project_/node_modules/react-native-vkontakte-login
4. Drop folder _ios_ from *Finder* to created group. Be sure what *Copy items if needed* unchecked and *Create groups* is checked
5. Open all 4 files and replace ```#import "VKSdk.h"``` with ```#import <VKSdkFramework/VKSdkFramework.h>```
6. Add path to React Native image library to Header Search Paths
7. Follow steps 2-5 of installation guide with cocoapods (set up application query and url schemas, update AppDelegate...)
<img src="https://raw.githubusercontent.com/doomsower/react-native-vkontakte-login/master/images/header-search-path.png" alt="Header Search Paths" />


## Usage

Import module in your JS code

```js
import VKLogin from 'react-native-vkontakte-login';
```

It has following methods:

1. `VKLogin.initialize(vkAppId)` - initializes VK SDK with numeric id of your VK application. You only need to call this once before you call `login` or `logout`. You can skip this call if you've added your VK App ID to your Android's resources or iOS's info.plist as described in optional steps above.

2. `VKLogin.login(scopesArray)` - opens VK login dialog either via VK mobile app or via WebView (if app is not installed on the device).
`scopesArray` is array which contains VK access permissions as strings. For example, `VKLogin.login(['friends', 'photos', 'email'])`.
List of available permissions can be found [here](https://new.vk.com/dev/permissions)
This method returns a Promise, which resolves with following object:
    ```js
    {
        access_token: "2b4daf9a8478da9b6d95b5a4f5515534846a73d5a75ada076cb15abe829df599c04e53e2c7111dacbaf55"
        email: "user@mail.com", //or null if no permission was given
        https_required: false, //Android only: If user sets "Always use HTTPS" setting in his profile, it will be true
        secret: null, //User secret to sign requests (if nohttps used)
        user_id: "12345678", //vk user id
        expires_in: 0 //Time when token expires
    }
    ```

    If the user is already logged in and has all the requested permissions, then the promise is resolved straight away, without VK dialog.
3. `VKLogin.logout()` - performs the logout. Returns a promise.
4. `VKLogin.isLoggedIn()` - This method returns a Promise, which resolves with boolean value
5. `VKLogin.share(shareConfig)` - opens VK share dialog either via VK mobile app or via WebView (if app is not installed on the device). Make sure to have correct permissions! 
Receive `shareConfig` object with following structure:
  ```js
  {
    linkText: 'Link visible text',
    linkUrl: 'https://your.shared.url',
    description: 'Some description',
    image: require('path/to/your/image.png'), // optional
  }
  ```

  Returns a Promise, which resolves with postId.

## Example

You can find it [here](https://github.com/doomsower/react-native-vkontakte-login/tree/master/example)

## Contributing

Feel free to submit pull requests
