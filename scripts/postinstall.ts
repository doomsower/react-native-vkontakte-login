import axios from 'axios';
import * as fs from 'fs';
import * as path from 'path';
import * as extract from 'extract-zip';

interface GithubRelease {
  tarball_url: string;
  zipball_url: string;
}

const SDK_ZIP = 'vk-ios-sdk.zip';
const SDK_DIR = 'ios/vk-ios-sdk/';

async function postInstall() {
  const response = await axios.get(`https://api.github.com/repos/VKCOM/vk-ios-sdk/releases`);
  const data: GithubRelease[] = response.data;
  const zip = await axios.get(data[0].zipball_url, { responseType: 'arraybuffer' });
  fs.writeFileSync(SDK_ZIP, zip.data);

  let sdkDir: string;

  extract(
    SDK_ZIP,
    {
      onEntry: (entry: any) => sdkDir = sdkDir || entry.fileName,
      dir: process.cwd(),
    },
    (err: any) => {
      try {
        fs.unlinkSync(SDK_ZIP);
      } catch (e) {
        console.warn('Failed to unlink some temporary/unnecessary files');
      }
      if (err) {
        console.warn('Failed to download and extract VK iOS SDK');
      } else {
        // Possible this happens when installing over existing release
        // Error: ENOTEMPTY: directory not empty,
        // rename '/Users/doomsower/projects/swapp/mobile/node_modules/react-native-vkontakte-login/VKCOM-vk-ios-sdk-a681011/' ->
        // '/Users/doomsower/projects/swapp/mobile/node_modules/react-native-vkontakte-login/ios/vk-ios-sdk/'
        fs.renameSync(path.join(process.cwd(), sdkDir), path.join(process.cwd(), SDK_DIR));
      }
    },
  );
}

postInstall();
