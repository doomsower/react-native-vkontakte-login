import * as balanced from 'balanced-match';
import { readFileSync, writeFileSync } from 'fs';
import findAppDelegate from './findAppDelegate';
import getPackageName from './getPackageName';

const PRJ_IMPORT = '#import <VKSdkFramework/VKSdkFramework.h>';
const PODS_IMPORT = '#import "VKSdk.h"';

const APP_DELEGATE_HEADER = `
#if __has_include(<VKSdkFramework/VKSdkFramework.h>)
${PRJ_IMPORT}
#else
${PODS_IMPORT}
#endif
`;

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

export default function modifyAppDelegate() {
  try {
    const packageName = getPackageName();
    const appDelegatePath = findAppDelegate(packageName);
    let content: string = readFileSync(appDelegatePath, 'utf8') as string;
    if (
      content.indexOf(PODS_IMPORT) === -1 &&
      content.indexOf(PRJ_IMPORT) === -1
    ) {
      const match = content.match(/#import "AppDelegate.h"[ \t]*\r*\n/);
      if (match === null) {
        console.warn(`Could not find line '#import "AppDelegate.h"' in file AppDelegate.m.
      You have to update AppDelegate.m manually`);
        return;
      }

      const existingLine = match[0];
      content = content.replace(
        existingLine,
        `${existingLine}${APP_DELEGATE_HEADER}\n`,
      );
    } else {
      console.warn('VK iOS SDK header already added to AppDelegate.m');
    }
    if (content.indexOf(APP_DELEGATE_CODE) === -1) {
      if (content.indexOf('openURL') !== -1) {
        console.warn(`Looks like you already have openURL method(s) in your AppDelegate.m
      Maybe already added Facebook login? In this case you have to update AppDelegate.m manually`);
        return;
      }
      const start = content.indexOf('didFinishLaunchingWithOptions');
      const tail = content.substr(start);
      const { end } = balanced('{', '}', tail);
      const insertAt = start + end + 1;
      content =
        content.slice(0, insertAt) +
        APP_DELEGATE_CODE +
        content.slice(insertAt);
    } else {
      console.warn('VK iOS SDK openURL methods already added to AppDelegate.m');
    }
    writeFileSync(appDelegatePath, content);
  } catch (e) {
    console.warn(e);
    console.warn(
      'Failed to automatically update AppDelegate.m. Please update it manually.',
    );
  }
}
