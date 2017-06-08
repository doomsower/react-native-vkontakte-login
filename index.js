import { NativeModules } from 'react-native';
import resolveAssetSource from 'react-native/Libraries/Image/resolveAssetSource';

const VKLogin = NativeModules.VkontakteManager;
const VKShare = NativeModules.VkontakteSharing;

export default {
  /**
   * Initializes VK SDK with numeric id of your VK application.
   * You only need to call this once before you call login or logout.
   * You can skip this call if you've added your VK App ID to your Android's resources or iOS's info.plist.
   * @param vkAppId {Number} number
   */
  initialize(vkAppId) {
    VKLogin.initialize(vkAppId);
  },
  /**
   * Opens VK login dialog either via VK mobile app or via WebView (if app is not installed on the device).
   * If the user is already logged in and has all the requested permissions, then the promise is resolved straight away, without VK dialog.
   * @param scopesArray {String[]} array which contains VK access permissions as strings, e.g. ['friends', 'photos', 'email']
   * List of available permissions can be found <a href="https://new.vk.com/dev/permissions">here</a>
   * @returns {Promise} Promise which resolves with following object:
   * {
   *      access_token: "2b4daf9a8478da9b6d95b5a4f5515534846a73d5a75ada076cb15abe829df599c04e53e2c7111dacbaf55"
   *      email: "user@mail.com", //or null if no permission was given
   *      https_required: false, //Android only: If user sets "Always use HTTPS" setting in his profile, it will be true
   *      secret: null, //User secret to sign requests (if nohttps used)
   *      user_id: "12345678", //vk user id
   *      expires_in: 0 //Time when token expires
   *  }
   */
  login(scopesArray) {
    return VKLogin.login(scopesArray)
  },
  /**
   * Performs the logout
   * @returns {Promise} empty promise
   */
  logout() {
    return VKLogin.logout();
  },
  /**
   * Checks if user is already logged in
   * @returns {Promise} Promise that resolves with boolean value
   */
  isLoggedIn() {
    return VKLogin.isLoggedIn();
  },
  /**
   * Opens VK share dialog either via VK mobile app or via WebView (if app is not installed on the device).
   * Make sure to have correct permissions!
   * @param options.linkText Attached link title
   * @param options.linkUrl Attached link URL
   * @param options.description Text
   * @param options.image Local file resource, i.e. require('path/to/your/image.png')
   * @returns {Promise} Promise that resolves with postId
   */
  share(options) {
    if (options.image) {
      options.image = resolveAssetSource(options.image).uri;
    }
    return VKShare.share(options);
  },
};
