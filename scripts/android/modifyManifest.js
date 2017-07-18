"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var glob = require("glob");
var path = require("path");
var VK_ACTIVITY_NAME = 'com.vk.sdk.VKServiceActivity';
var MANIFEST_ACTIVITY = ' android:name="com.vk.sdk.VKServiceActivity" android:label="ServiceActivity" android:theme="@style/VK.Transparent" />';
function findFile(file, folder) {
    if (folder === void 0) { folder = process.cwd(); }
    var filePath = glob.sync(path.join('**', file), {
        cwd: folder,
        ignore: ['node_modules/**', '**/build/**', 'Examples/**', 'examples/**'],
    })[0];
    return filePath ? path.join(folder, filePath) : null;
}
function modifyManifest() {
    var manifest = findFile('AndroidManifest.xml');
    if (!manifest) {
        console.warn('Could not find AndroidManifest.xml, please update it manually');
        return;
    }
    var manifestContent = fs.readFileSync(manifest).toString();
    if (manifestContent.indexOf(VK_ACTIVITY_NAME) === -1) {
        var prevStart = manifestContent.lastIndexOf('<activity');
        var prevEnd = manifestContent.indexOf('/>', prevStart) + 2;
        var matches = manifestContent.match(/$(\W*<activity)/gm);
        var head = matches.pop();
        manifestContent = manifestContent.slice(0, prevEnd) + head + MANIFEST_ACTIVITY + manifestContent.slice(prevEnd);
        fs.writeFileSync(manifest, manifestContent);
    }
    else {
        console.log('Manifest already contains VK activity');
    }
}
exports.modifyManifest = modifyManifest;
