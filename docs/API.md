React-native wrapper around vk-ios-sdk and vk-android-sdk Provides login and share functionality

# Index

* [initialize](#initialize)
* [isLoggedIn](#isloggedin)
* [getAccessToken](#getAccessToken)
* [login](#login)
* [logout](#logout)
* [share](#share)
* [getCertificateFingerprint](#getcertificatefingerprint)

---
## Methods

### initialize

► **initialize**(vkAppId: *`number`⎮`string`*): `void`

Initializes VK SDK from JS code. You only need to call this once before you call login or logout. You can skip this call if you've added your VK App ID to your Android's resources or iOS's info.plist.

**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| vkAppId | `number`⎮`string`   |  Your VK app id |

**Returns:** `void`

___

### isLoggedIn

► **isLoggedIn**(): `Promise<boolean>`

Checks if user is already logged in.  
This means that access token exists and is not expired.

**Returns:** `Promise<boolean>`
Promise that resolves with boolean value

___

### getAccessToken

► **getAccessToken**(): `Promise`<[VKLoginResult](#interface-vkloginresult) | null>

Returns VK access token (if it exists)

**Returns:** `Promise<boolean>`
Promise that resolves with VKLoginResult (access token) or null

___

### login

► **login**(scopesArray: *`string[]`*): `Promise`<[VKLoginResult](#interface-vkloginresult)>

Opens VK login dialog either via VK mobile app or via WebView (if app is not installed on the device). If the user is already logged in and has all the requested permissions, then the promise is resolved straight away, without VK dialog.

**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| scopesArray | `string[]`   |  array which contains VK access permissions as strings,e.g. `['friends', 'photos', 'email']`List of available permissions can be found [here](https://new.vk.com/dev/permissions) |

**Returns:** `Promise`<[VKLoginResult](#interface-vkloginresult)>
Promise will be resolved with VKLoginResult object

___

### logout

► **logout**(): `Promise<void>`

Performs the logout

**Returns:** `Promise<void>`
empty promise

___

### share

► **share**(options: *[VKShareOptions](#interface-vkshareoptions)*): `Promise<number>`

Opens VK share dialog either via VK mobile app or via WebView (if app is not installed on the device). Make sure to have correct permissions!

**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| options | [VKShareOptions](#interface-vkshareoptions)   |  VKShareOptions object |

**Returns:** `Promise<number>`
Promise that resolves with postId number

___

### getCertificateFingerprint

► **getCertificateFingerprint**(): `Promise<string[]>`

**Android only** - helper method to get fingerprints on JS side

**Returns:** `Promise<string[]>`
Promise that resolves with array of string fingerprints

___

## Interface: VKLoginResult

Response from login method

| Property | Type | Description |
| ------ | ------ | ------ |
| access_token | `string`⎮`null`   |  String token for use in request parameters |
| email | `string`⎮`null`   |  User email, or null, if permission was not given |
| expires_in | `number`⎮`undefined`   |  Time when token expires |
| https_required | `boolean`⎮`undefined`   |  **Android only** If user sets "Always use HTTPS" setting in his profile, it will be true |
| secret | `string`⎮`null`   |  User secret to sign requests (if nohttps used)  |
| user_id | `string`⎮`null`   |  Current user id for this token  |

___

## Interface: VKShareOptions

Share dialog options

| Property | Type | Description |
| ------ | ------ | ------ |
| description | `string`⎮`undefined`   |  Shared text message |
| image | `number`⎮`undefined`   |  Shared image, local file resource, i.e. `require('path/to/your/image.png')` |
| linkText | `string`⎮`undefined`   |  Shared link name |
| linkUrl | `string`⎮`undefined`   |  Shared link URL |

___

## Enum constant: VKError

Constant ot compare error codes of rejected promises

Common errors:

- VKError.E_NOT_INITIALIZED
- VKError.E_VK_UNKNOWN
- VKError.E_VK_API_ERROR
- VKError.E_VK_CANCELED
- VKError.E_VK_REQUEST_NOT_PREPARED

iOS specific errors:

- VKError.E_VK_RESPONSE_STRING_PARSING_ERROR
- VKError.E_VK_AUTHORIZE_CONTROLLER_CANCEL

Android specific errors:

- VKError.E_VK_JSON_FAILED
- VKError.E_VK_REQUEST_HTTP_FAILED
- VKError.E_ACTIVITY_DOES_NOT_EXIST
- VKError.E_FINGERPRINTS_ERROR

___
