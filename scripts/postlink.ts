import * as fs from 'fs';
import * as glob from 'glob';
import * as inquirer from 'inquirer';
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

function loadVkAppId(): string | undefined {
  const envFile = path.join(process.cwd(), '.env');
  if (fs.existsSync(envFile)) {
    const envFileContent = fs.readFileSync(envFile).toString();
    const regex = /^VK_APP_ID=(\d+)/gm;
    const match = regex.exec(envFileContent);
    if (match) {
      return match[1];
    }
  }
  return;
}

function saveVkAppId(appId: string, replaceExisting: boolean) {
  const envFile = path.join(process.cwd(), '.env');
  let keyValue = `VK_APP_ID=${appId}`;
  let envFileContent = keyValue;
  if (fs.existsSync(envFile)) {
    envFileContent = fs.readFileSync(envFile).toString();
    if (replaceExisting) {
      envFileContent = envFileContent.replace(/^VK_APP_ID=\d+/gm, keyValue);
    } else {
      envFileContent = `${envFileContent}\n${keyValue}`;
    }
  }
  fs.writeFileSync(envFile, envFileContent);
}

function modifyManifest() {
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

function modifyPlist(vkAppId: string) {
  console.log('Wanna modify plist', vkAppId);
}

async function postlink() {
  let vkAppId = loadVkAppId();
  const answers = await inquirer.prompt([
    {
      name: 'automate',
      type: 'confirm',
      message: 'Automatically modify Android and iOS projects?',
      default: true,
    },
    {
      name: 'appId',
      type: 'input',
      message: 'Enter your VK Application ID',
      default: vkAppId,
      validate: (appId: string) => {
        const valid = /\d+/.test(appId);
        return valid || 'VK Application id can only contain digits';
      },
      when: hash => hash.automate,
    },
  ]);
  if (answers.appId && answers.appId !== vkAppId) {
    saveVkAppId(answers.appId, !!vkAppId);
  }
  if (answers.automate) {
    // Android part
    modifyManifest();
    // iOS part
    modifyPlist(answers.appId);
  }
}

postlink();
