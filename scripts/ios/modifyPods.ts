import * as cp from 'child_process';
import * as fs from 'fs';
import { EOL } from 'os';
import * as path from 'path';

import balanced = require('balanced-match');
import detectIndent = require('detect-indent');
import detectNewline = require('detect-newline');

const POD = 'pod \'VK-ios-sdk\'';

export default function modifyPods(podfile: string) {
  const content = fs.readFileSync(podfile, 'utf-8');
  const br = detectNewline(content) || EOL;
  let indent = detectIndent(content).indent || '  ';

  if (content.indexOf('react-native-vkontakte-login') !== -1) {
    // This is Podfile with  react-native-vkontakte-login v 0.1.x
    // v. 0.2.x no longer comes with Podfile, it is added via react-native link
    // Podfile is needed to fetch vk-ios-sdk dependency
    content.replace(/pod 'react-native-vkontakte-login', :path => '\S*'/, POD);
    return;
  }

  const balance = balanced('target', 'end', content);
  if (!balance) {
    console.warn('Failed to modify Podfile, please update it manually');
    return;
  }
  const { body } = balance;
  const subTargetMatch = (/$\W*target/gm).exec(body);
  const podsRegex = /$\W*(pod)/gm;
  let podsMatch = podsRegex.exec(body);
  let newBody;

  if (subTargetMatch) { // Insert pod before first target
    indent = detectIndent(subTargetMatch[0]).indent;
    newBody = body.slice(0, subTargetMatch.index) + br + indent + POD + body.slice(subTargetMatch.index);
  } else if (podsMatch) { // Insert pod before last pod
    let lastPodIndex = 0;
    while (podsMatch !== null) {
      lastPodIndex = podsRegex.lastIndex - podsMatch[1].length;
      indent = detectIndent(podsMatch[0]).indent;
      podsMatch = podsRegex.exec(body);
    }
    newBody = body.slice(0, lastPodIndex) + POD + br + indent + body.slice(lastPodIndex);
  } else { // Just target without pods or subtargets
    const doIndex = body.indexOf('do') + 2;
    newBody = body.slice(0, doIndex) + br + indent + POD + br + body.slice(doIndex);
  }

  if (newBody) {
    const newContent = content.replace(body, newBody);
    fs.writeFileSync(podfile, newContent);
    cp.spawnSync('pod', ['install'], {
      cwd: path.dirname(podfile),
      stdio: 'inherit',
    });
  } else {
    console.warn('Failed to modify Podfile, please update it manually');
  }
}
