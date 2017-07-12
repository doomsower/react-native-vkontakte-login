import * as fs from 'fs';
import * as glob from 'glob';
import * as path from 'path';

const VK_ACTIVITY_NAME = 'com.vk.sdk.VKServiceActivity';
const MANIFEST_ACTIVITY = ' android:name="com.vk.sdk.VKServiceActivity" android:label="ServiceActivity" android:theme="@style/VK.Transparent" />';

function findFile(file: string, folder: string = process.cwd()) {
  const filePath = glob.sync(path.join('**', file), {
    cwd: folder,
    ignore: ['node_modules/**', '**/build/**', 'Examples/**', 'examples/**'],
  })[0];

  return filePath ? path.join(folder, filePath) : null;
}

export function modifyManifest() {
  const manifest = findFile('AndroidManifest.xml');
  if (!manifest) {
    console.warn('Could not find AndroidManifest.xml, please update it manually');
    return;
  }
  let manifestContent: string = fs.readFileSync(manifest).toString();
  if (manifestContent.indexOf(VK_ACTIVITY_NAME) === -1) {
    const prevStart = manifestContent.lastIndexOf('<activity');
    const prevEnd = manifestContent.indexOf('/>', prevStart) + 2;
    const matches = manifestContent.match(/^(\W*<activity)/gm);
    const head = matches!.pop();
    manifestContent = manifestContent.slice(0, prevEnd) + head + MANIFEST_ACTIVITY + '\n' + manifestContent.slice(prevEnd);
    fs.writeFileSync(manifest, manifestContent);
  } else {
    console.log('Manifest already contains VK activity');
  }
}
