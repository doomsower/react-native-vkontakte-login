import { F_OK } from 'constants';
import { accessSync } from 'fs';
import { sync } from 'glob';

// Helper that filters an array with AppDelegate.m paths for a path with the app name inside it
function findFileByAppName(paths: string[], appName: string) {
  if (paths.length === 0 || !appName) {
    return null;
  }

  for (const path of paths) {
    if (path && path.indexOf(appName) !== -1) {
      return path;
    }
  }

  return null;
}

export default function findAppDelegate(packageName: string) {
  const appDelegatePaths = sync('**/AppDelegate.m', {
    ignore: 'node_modules/**',
  });
  const appDelegatePath = findFileByAppName(appDelegatePaths, packageName);
  if (!appDelegatePath) {
    throw new Error('cannot find AppDelegate.m location');
  }
  accessSync(appDelegatePath, F_OK);
  return appDelegatePath;
}
