import axios from 'axios';
import * as extractSync from 'extract-zip';
import * as fs from 'fs-extra';
import * as path from 'path';
import * as util from 'util';

const extract: any = util.promisify(extractSync);

interface GithubRelease {
  tarball_url: string;
  zipball_url: string;
}

const SDK_ZIP = 'vk-ios-sdk.zip';
const SDK_DIR = 'ios/vk-ios-sdk/';

export default async function downloadSdk() {
  const finalSdkDir = path.resolve(process.cwd(), 'node_modules/react-native-vkontakte-login', SDK_DIR);
  const finalZipFile = path.resolve(process.cwd(), 'node_modules/react-native-vkontakte-login', SDK_ZIP);

  process.stdout.write('Downloading VK iOS SDK');
  const response = await axios.get(`https://api.github.com/repos/VKCOM/vk-ios-sdk/releases`);
  const data: GithubRelease[] = response.data;
  const zip = await axios.get(data[0].zipball_url, { responseType: 'arraybuffer' });
  await fs.writeFile(finalZipFile, zip.data);

  let sdkDir = '';
  fs.remove(finalSdkDir);

  process.stdout.write(`\nExtracting VK iOS SDK to ${finalSdkDir}`);
  try {
    await extract(
      finalZipFile,
      {
        onEntry: (entry: any) => {
          sdkDir = sdkDir || entry.fileName;
          process.stdout.write('.');
        },
        dir: process.cwd(),
      },
    );
    await fs.rename(path.join(process.cwd(), sdkDir), `${finalSdkDir}/`);
    process.stdout.write('\nDone\n');
  } catch (err) {
    console.warn(`Failed to download and extract VK iOS SDK: ${err}`);
  } finally {
      try {
        await fs.remove(finalZipFile);
      } catch (e) {
        console.warn('Failed to unlink some temporary/unnecessary files');
      }
  }
}
