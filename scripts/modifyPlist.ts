import { readFileSync, writeFileSync } from 'fs';
import { dirname, join } from 'path';
import * as plist from 'plist';
import findAppDelegate from './findAppDelegate';
import getPackageName from './getPackageName';

interface BundleURLType {
  CFBundleTypeRole: string;
  CFBundleURLName: string;
  CFBundleURLSchemes: string[];
}

export default function modifyPlist(vkAppId: string) {
  try {
    const packageName = getPackageName();
    const appDelegatePath = findAppDelegate(packageName);
    const plistPath = join(dirname(appDelegatePath), 'Info.plist');
    const plistContents = readFileSync(plistPath, 'utf8');
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
    urlTypes = urlTypes.filter((ut) => !/vk\d+/.test(ut.CFBundleURLName));
    urlTypes.push({
      CFBundleTypeRole: 'Editor',
      CFBundleURLName: urlType,
      CFBundleURLSchemes: [urlType],
    });
    plistJson.CFBundleURLTypes = urlTypes;

    const newPlistContents = plist.build(plistJson);
    writeFileSync(plistPath, newPlistContents);
  } catch (e) {
    console.warn(e);
    console.warn(
      'Failed to automatically update Info.plist. Please update it manually.',
    );
  }
}
