import * as glob from 'glob';
import * as fs from 'fs';
import * as path from 'path';
import * as plist from 'plist';
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