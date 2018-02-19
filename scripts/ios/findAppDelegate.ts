import fs from 'fs';
import glob from 'glob';
import { F_OK } from 'constants';

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

export default function findAppDelegate(packageName: string) {
  const appDelegatePaths = glob.sync("**/AppDelegate.m", { ignore: "node_modules/**" });
  const appDelegatePath = findFileByAppName(appDelegatePaths, packageName) || appDelegatePaths[0];
  try {
    fs.accessSync(appDelegatePath, F_OK);
  } catch (e) {
    return null;
  }
  return appDelegatePath;
}
