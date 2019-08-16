import { readFileSync, writeFileSync } from 'fs';
import { sync } from 'glob';
import { join } from 'path';

const VK_ACTIVITY_NAME = 'com.vk.sdk.VKServiceActivity';
const MANIFEST_ACTIVITY =
  ' android:name="com.vk.sdk.VKServiceActivity" android:label="ServiceActivity" android:theme="@style/VK.Transparent" />';

function findFile(file: string, folder: string = process.cwd()) {
  const filePaths = sync(join('**', file), {
    cwd: folder,
    ignore: ['node_modules/**', '**/build/**', 'Examples/**', 'examples/**'],
  });
  const filePath = filePaths.find((fp) => fp.indexOf('main') >= 0);

  return filePath ? join(folder, filePath) : null;
}

function modifyManifest() {
  const manifest = findFile('AndroidManifest.xml');
  if (!manifest) {
    console.warn(
      'Could not find AndroidManifest.xml, please update it manually',
    );
    return;
  }
  try {
    let manifestContent: string = readFileSync(manifest).toString();
    if (manifestContent.indexOf(VK_ACTIVITY_NAME) === -1) {
      const prevStart = manifestContent.lastIndexOf('<activity');
      const prevEnd = manifestContent.indexOf('/>', prevStart) + 2;
      const matches = manifestContent.match(/$(\W*<activity)/gm);
      const head = matches!.pop();
      manifestContent =
        manifestContent.slice(0, prevEnd) +
        head +
        MANIFEST_ACTIVITY +
        manifestContent.slice(prevEnd);
      writeFileSync(manifest, manifestContent);
    } else {
      console.warn('Manifest already contains VK activity');
    }
  } catch (e) {
    console.warn(e.message);
    console.warn(
      'Failed to automatically update android manifest. Please continue manually.',
    );
  }
}

export default modifyManifest;
