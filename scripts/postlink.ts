import * as inquirer from 'inquirer';
import loadAppId from './loadAppId';
import modifyAppDelegate from './modifyAppDelegate';
import modifyManifest from './modifyManifest';
import modifyPlist from './modifyPlist';
import saveAppId from './saveAppId';

interface Answers {
  manifest: boolean;
  plist: boolean;
  delegate: boolean;
  appId: string;
}

async function postlink() {
  console.info('[react-native-vkontakte-login] Postlink');
  const vkAppId = loadAppId();
  const answers = await inquirer.prompt<Answers>([
    {
      name: 'manifest',
      type: 'confirm',
      message:
        '[react-native-vkontakte-login] Automatically modify Android manifest?',
      default: true,
    },
    {
      name: 'plist',
      type: 'confirm',
      message:
        '[react-native-vkontakte-login] Automatically modify iOS Info.plist?',
      default: true,
    },
    {
      name: 'delegate',
      type: 'confirm',
      message:
        '[react-native-vkontakte-login] Automatically modify iOS AppDelegate.m?',
      default: true,
    },
    {
      name: 'appId',
      type: 'input',
      message: '[react-native-vkontakte-login] Enter your VK Application ID',
      initial: vkAppId,
      validate: (appId: string) => {
        const valid = /\d+/.test(appId);
        return valid || 'VK Application ID can only contain digits';
      },
      when: (hash) => hash.manifest || hash.plist,
    },
  ]);
  if (answers.appId && answers.appId !== vkAppId) {
    saveAppId(answers.appId, !!vkAppId);
  }
  if (answers.manifest) {
    modifyManifest();
  }
  if (answers.plist) {
    modifyPlist(answers.appId);
  }
  if (answers.delegate) {
    modifyAppDelegate();
  }
}

postlink();
