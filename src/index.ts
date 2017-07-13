import { NativeModules, Platform } from 'react-native';
import resolveAssetSource from 'react-native/Libraries/Image/resolveAssetSource';

const VKLogin: any = NativeModules.VkontakteManager;
const VKShare: any = NativeModules.VkontakteSharing;

export interface VKLoginResult {
  /**
   * String token for use in request parameters
   */
  access_token: string | null;
  /**
   * User email
   */
  email: string | null;
  /**
   * If user sets "Always use HTTPS" setting in his profile, it will be true
   */
  https_required?: boolean;
  /**
   * User secret to sign requests (if nohttps used)
   */
  secret: string | null;
  /**
   * Current user id for this token
   */
  user_id: string | null;
  /**
   * Time when token expires
   */
  expires_in?: number;
}

export interface VKShareOptions {
  /**
   * Shared link name
   */
  linkText?: string;
  /**
   * Shared link URL
   */
  linkUrl?: string;
  /**
   * Shared text message
   */
  description?: string;
  /**
   * Shared image, local file resource, i.e. require('path/to/your/image.png')
   */
  image?: number;
}

export default {

  /**
   * Initializes VK SDK with numeric id of your VK application.
   * You only need to call this once before you call login or logout.
   * You can skip this call if you've added your VK App ID to your Android's resources or iOS's info.plist.
   * @param vkAppId {Number} number
   */
  initialize(vkAppId: number): void {
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
  login(scopesArray: string[]):Promise<VKLoginResult> {
    return VKLogin.login(scopesArray)
  },
  /**
   * Performs the logout
   * @returns {Promise} empty promise
   */
  logout():Promise<undefined> {
    return VKLogin.logout();
  },
  /**
   * Checks if user is already logged in
   * @returns {Promise} Promise that resolves with boolean value
   */
  isLoggedIn():Promise<boolean> {
    return VKLogin.isLoggedIn();
  },
  /**
   * Opens VK share dialog either via VK mobile app or via WebView (if app is not installed on the device).
   * Make sure to have correct permissions!

   * @returns {Promise} Promise that resolves with postId
   */
  share(options: VKShareOptions):Promise<number> {
    if (options.image) {
      options.image = resolveAssetSource(options.image).uri;
    }
    return VKShare.share(options);
  },

  /**
   * Android only - helper method to get fingerprints on JS side
   * @returns {Promise<string[]>} Promise that resolves with array of string fingerprints
   */
  getCertificateFingerprint(): Promise<string[]> {
    if (Platform.OS === 'ios') {
      console.warn('getCertificateFingerprint is for Android only');
      return Promise.resolve([]);
    }
    return VKLogin.getCertificateFingerprint();
  },
};
