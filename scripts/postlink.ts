import fs from 'fs';
import inquirer from 'inquirer';
import path from 'path';
import { postlinkAndroid } from './android';
import findPodfile from './findPodfile';
import { postlinkIOS } from './ios';

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
  const keyValue = `VK_APP_ID=${appId}`;
  let envFileContent = keyValue;
  if (fs.existsSync(envFile)) {
    envFileContent = fs.readFileSync(envFile).toString();
    envFileContent = replaceExisting ?
      envFileContent.replace(/^VK_APP_ID=\d+/gm, keyValue) :
      `${envFileContent}\n${keyValue}`;
  }
  fs.writeFileSync(envFile, envFileContent);
}

async function postlink() {
  const vkAppId = loadVkAppId();
  const podfile = findPodfile();
  const answers = await inquirer.prompt([
    {
      name: 'automate',
      type: 'confirm',
      message: '[react-native-vkontakte-login] Automatically modify Android and iOS projects?',
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
    {
      name: 'modXcode',
      type: 'confirm',
      message: 'It seems that your project doesn\'t use Cocoapods. Do you want to modify XCode project file?',
      default: true,
      when: hash => hash.automate && podfile === null,
    },
  ]);
  if (answers.appId && answers.appId !== vkAppId) {
    saveVkAppId(answers.appId, !!vkAppId);
  }
  if (answers.automate) {
    postlinkAndroid();
    postlinkIOS(answers.appId, answers.modXcode);
  }
}

postlink();
