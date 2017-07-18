import * as glob from 'glob';
import * as which from 'which';

export default function findPodifile() {
  try {
    which.sync('pod');
  } catch (e) {
    console.warn('Cannot find Cocoapods executable');
    return null;
  }
  const podFilePaths = glob.sync("**/Podfile", { ignore: "node_modules/**" });
  if (podFilePaths.length === 1) {
    return podFilePaths[0];
  }
  return null;
}
