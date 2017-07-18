import { modifyManifest } from './modifyManifest';

export function postlinkAndroid() {
  try {
    modifyManifest();
  } catch (e) {
    console.warn('Failed to automatically update android manifest. Please continue manually');
  }
}
