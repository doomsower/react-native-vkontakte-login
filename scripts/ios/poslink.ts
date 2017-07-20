import * as path from 'path';
import findAppDelegate from './findAppDelegate';
import findPodfile from './findPodfile';
import modifyAppDelegate from './modifyAppDelegate';
import modifyPlist from './modifyPlist';
import modifyPods from './modifyPods';
import modifyProject from './modifyProject';

// Assumption - react-native link is always called from the top of the project
// As indicated in https://github.com/facebook/react-native/blob/4082a546495c5d9f4c6fd1b0c2f64e9bc7a88bc7/local-cli/link/getProjectDependencies.js#L7
const pjson = require(path.join(process.cwd(), './package.json'));
const packageName = pjson ? pjson.name : null;

export function postlinkIOS(vkAppId: string) {
  const appDelegatePath = findAppDelegate(packageName);
  if (!appDelegatePath) {
    console.warn(`
        Could not find AppDelegate.m file for this project at ${appDelegatePath}, so could not add the framework for iOS.
        You should add the framework manually.
    `);
    return;
  }
  const podfile = findPodfile();
  try {
    if (podfile) {
      console.log(`Found Podfile ${podfile}, will modify it`);
      modifyPods(podfile);
    } else {
      console.log('No Podfile was found, will modify pbxproj');
      modifyProject(appDelegatePath, packageName);
    }
    modifyPlist(vkAppId, appDelegatePath);
    modifyAppDelegate(appDelegatePath);
  } catch (e) {
    console.warn('Something went wrong during automatic iOS installation. Please continue manually');
  }
}
