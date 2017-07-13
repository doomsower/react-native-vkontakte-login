import * as fs from 'fs';
import * as inquirer from 'inquirer';
import * as path from 'path';
import { modifyManifest } from './postlink-android';
import { modifyAppDelegate, modifyPlist, modifyProject } from './poslink-ios';

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
    try {
      modifyManifest();
    } catch (e) {
      console.warn('Something went wrong during automatic android installation. Please continue manually');
    }
    // iOS part
    try {
      modifyPlist(answers.appId);
      modifyAppDelegate();
      modifyProject();
    } catch (e) {
      console.warn('Something went wrong during automatic iOS installation. Please continue manually');
    }
  }
}

postlink();
