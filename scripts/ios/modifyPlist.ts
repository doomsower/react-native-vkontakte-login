import fs from 'fs';
import path from 'path';
import plist from 'plist';

interface BundleURLType {
  CFBundleTypeRole: string;
  CFBundleURLName: string;
  CFBundleURLSchemes: string[];
}

export default function modifyPlist(vkAppId: string, appDelegatePath: string) {
  const plistPath = path.join(path.dirname(appDelegatePath), 'Info.plist');
  const plistContents = fs.readFileSync(plistPath, 'utf8');
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
