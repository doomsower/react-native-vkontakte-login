import axios from 'axios';
import * as extractSync from 'extract-zip';
import * as fs from 'fs-extra';
import * as path from 'path';
import * as util from 'util';
import * as promisify from 'util.promisify';

const extract: any =
  util !== undefined ? util.promisify(extractSync) : promisify(extractSync);

interface GithubRelease {
  tarball_url: string;
  zipball_url: string;
}

const SDK_ZIP = 'vk-ios-sdk.zip';
const SDK_DIR = 'ios/vk-ios-sdk/';

export default async function downloadSdk() {
  const alreadyDownloaded = await fs.pathExistsSync(SDK_DIR);
  if (alreadyDownloaded) {
    console.log('VK iOS SDK already downloaded');
    return;
  }

  console.log(`Downloading VK iOS SDK as ${SDK_ZIP}`);
  const response = await axios.get(`https://api.github.com/repos/VKCOM/vk-ios-sdk/releases`);
  const data: GithubRelease[] = response.data;
  const zip = await axios.get(data[0].zipball_url, { responseType: 'arraybuffer' });
  await fs.writeFile(SDK_ZIP, zip.data);

  let sdkDir = '';

  console.log(`\nExtracting VK iOS SDK to ${SDK_DIR}`);
  try {
    await extract(
      SDK_ZIP,
      {
        onEntry: (entry: any) => sdkDir = sdkDir || entry.fileName,
        dir: process.cwd(),
      },
    );
    await fs.rename(sdkDir, SDK_DIR);
    console.log('\nDone\n');
  } catch (err) {
    console.warn(`Failed to download and extract VK iOS SDK: ${err}`);
  } finally {
    try {
      await fs.remove(SDK_ZIP);
    } catch (e) {
      console.warn('Failed to unlink some temporary/unnecessary files');
    }
  }
}

downloadSdk();
