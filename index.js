import { NativeModules } from 'react-native';
import resolveAssetSource from 'react-native/Libraries/Image/resolveAssetSource';

module.exports = NativeModules.VkontakteManager;

module.exports.share = (options) => {
  if (options.image) {
    options.image = resolveAssetSource(options.image).uri;
  }

  return NativeModules.VkontakteSharing.share(options);
};
