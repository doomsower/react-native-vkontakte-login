import * as glob from 'glob';
import * as fs from 'fs';
import * as path from 'path';
import * as plist from 'plist';
import * as balanced from 'balanced-match';
import * as xcode from 'xcode';
import * as createGroupWithMessage from 'react-native/local-cli/link/ios/createGroupWithMessage';
import { F_OK } from 'constants';

interface BundleURLType {
  CFBundleTypeRole: string;
  CFBundleURLName: string;
  CFBundleURLSchemes: string[];
}

// Helper that filters an array with AppDelegate.m paths for a path with the app name inside it
function findFileByAppName(paths: string[], appName: string) {
  if (paths.length === 0 || !appName) {
    return null;
  }

  for (let path of paths) {
    if (path && path.indexOf(appName) !== -1) {
      return path;
    }
  }

  return null;
}

// Assumption - react-native link is always called from the top of hte project
// As indicated in https://github.com/facebook/react-native/blob/4082a546495c5d9f4c6fd1b0c2f64e9bc7a88bc7/local-cli/link/getProjectDependencies.js#L7
const pjson = require(path.join(process.cwd(), './package.json'));
const appDelegatePaths = glob.sync("**/AppDelegate.m", { ignore: "node_modules/**" });
const appDelegatePath = findFileByAppName(appDelegatePaths, pjson ? pjson.name : null) || appDelegatePaths[0];

const APP_DELEGATE_HEADER = '#import <VKSdkFramework/VKSdkFramework.h>';
const APP_DELEGATE_CODE = `

//iOS 9 workflow
- (BOOL)application:(UIApplication *)app openURL:(NSURL *)url options:(NSDictionary<NSString *,id> *)options {
    [VKSdk processOpenURL:url fromApplication:options[UIApplicationOpenURLOptionsSourceApplicationKey]];
    return YES;
}

//iOS 8 and lower
-(BOOL)application:(UIApplication *)application openURL:(NSURL *)url sourceApplication:(NSString *)sourceApplication annotation:(id)annotation
{
    [VKSdk processOpenURL:url fromApplication:sourceApplication];
    return YES;
}
`;

function checkDelegate() {
  try {
    fs.accessSync(appDelegatePath, F_OK);
  } catch (e) {
    console.warn(`
        Could not find AppDelegate.m file for this project at ${appDelegatePath}, so could not add the framework for iOS.
        You should add the framework manually.
    `);
    return false;
  }
  return true;
}

export function modifyPlist(vkAppId: string) {
  if (!checkDelegate())
    return;
  const plistPath = path.join(path.dirname(appDelegatePath), 'Info.plist');
  const plistContents = fs.readFileSync(plistPath, "utf8");
  const plistJson = plist.parse(plistContents);

  const schemes: string[] = plistJson.LSApplicationQueriesSchemes || [];
  if (schemes.indexOf('vk') === -1) {
    schemes.push('vk');
  }
  if (schemes.indexOf('vk-share') === -1) {
    schemes.push('vk-share');
  }
  if (schemes.indexOf('vkauthorize') === -1) {
    schemes.push('vkauthorize');
  }
  plistJson.LSApplicationQueriesSchemes = schemes;

  let urlTypes: BundleURLType[] = plistJson.CFBundleURLTypes || [];
  // remove all existing VK url types
  const urlType = `vk${vkAppId}`;
  urlTypes = urlTypes.filter(ut => !/vk\d+/.test(ut.CFBundleURLName));
  urlTypes.push({ CFBundleTypeRole: 'Editor', CFBundleURLName: urlType, CFBundleURLSchemes: [urlType] });
  plistJson.CFBundleURLTypes = urlTypes;

  const newPlistContents = plist.build(plistJson);
  fs.writeFileSync(plistPath, newPlistContents);
}

export function modifyAppDelegate() {
  if (!checkDelegate())
    return;
  let content = fs.readFileSync(appDelegatePath, "utf8");
  if (content.indexOf(APP_DELEGATE_HEADER) === -1) {
    const match = content.match(/#import "AppDelegate.h"[ \t]*\r*\n/);
    if (match === null) {
      console.warn(`Could not find line '#import "AppDelegate.h"' in file AppDelegate.m.
      You have to update AppDelegate.m manually`);
      return;
    }

    const existingLine = match[0];
    content = content.replace(existingLine, `${existingLine}${APP_DELEGATE_HEADER}\n`);
  } else {
    console.log('VK iOS SDK header already added to AppDelegate.m');
  }
  if (content.indexOf(APP_DELEGATE_CODE) === -1) {
    if (content.indexOf('openURL') !== -1) {
      console.warn(`Looks like you already have openURL method(s) in your AppDelegate.m
      Maybe already added Facebook login? In this case you have update AppDelegate.m manually`);
      return;
    }
    let start = content.indexOf('didFinishLaunchingWithOptions');
    const tail = content.substr(start);
    const { end } = balanced('{', '}', tail);
    const insertAt = start + end + 1;
    content = content.slice(0, insertAt) + APP_DELEGATE_CODE + content.slice(insertAt);
  } else {
    console.log('VK iOS SDK openURL methods already added to AppDelegate.m');
  }
  fs.writeFileSync(appDelegatePath, content);
}

export function modifyProject() {
  if (!checkDelegate())
    return;
  const projectPath = path.join(path.dirname(appDelegatePath), '..', `${pjson.name}.xcodeproj`, 'project.pbxproj');
  const project = xcode.project(projectPath);

  project.parse(function (err: any) {
    if (err) {
      console.warn(`Failed to modify project ${projectPath}.
      You have to add VKSdkFramework.framework to embedded binaries manually. Error is:`);
      console.warn(err);
      return;
    }
    createGroupWithMessage(project, 'Frameworks');
    const { uuid } = project.getFirstTarget();
    if (!project.hash.project.objects['PBXCopyFilesBuildPhase']) {
      project.addBuildPhase([], 'PBXCopyFilesBuildPhase', 'Embed Frameworks', uuid,  'frameworks');
    }
    let opts = {
      embed: true,
      sign: true,
      customFramework: true,
      link: true,
      target: uuid,
      sourceTree: 'BUILT_PRODUCTS_DIR',
      lastKnownFileType: 'wrapper.framework',
    };
    project.addFramework('VKSdkFramework.framework', opts);
    fs.writeFileSync(projectPath, project.writeSync());
  });
}