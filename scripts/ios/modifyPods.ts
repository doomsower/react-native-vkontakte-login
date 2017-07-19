import * as cp from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import balanced = require('balanced-match');

const POD = "pod 'react-native-vkontakte-login', :path => '../node_modules/react-native-vkontakte-login'\n";

export default function modifyPods(podfile: string) {
  const content = fs.readFileSync(podfile, 'utf-8');

  if (content.indexOf('react-native-vkontakte-login') !== -1) {
    console.warn('Looks like react-native-vkontakte-login is already in your Podfile');
    return;
  }

  const balance = balanced('target', 'end', content);
  if (!balance) {
    console.warn('Failed to modify Podfile, please update it manually');
    return;
  }
  const { body } = balance;
  const subTargetMatch = (/$\W*target/gm).exec(body);
  let podsRegex = /$(\W*pod)/gm;
  const podsMatch = podsRegex.exec(body);
  let newBody;

  if (subTargetMatch) { // Insert pod before first target
    newBody = body.slice(0, subTargetMatch.index) + POD + body.slice(subTargetMatch.index);
  } else if (podsMatch) { // Insert pod before last pod
    let lastPodIndex = podsRegex.lastIndex - podsMatch[podsMatch.length - 1].length;
    newBody = body.slice(0, lastPodIndex) + POD + body.slice(lastPodIndex);
  } else { // Just target without pods or subtargets
    const doIndex = body.indexOf('do') + 2;
    newBody = body.slice(0, doIndex) + '\n' + POD + body.slice(doIndex);
  }

  if (newBody) {
    const newContent = content.replace(body, newBody);
    fs.writeFileSync(podfile, newContent);
    cp.spawnSync('pod', ['install'], {
      cwd: path.dirname(podfile),
      stdio: 'inherit'
    });
  } else {
    console.warn('Failed to modify Podfile, please update it manually');
  }
}
