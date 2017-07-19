"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var path = require("path");
var findAppDelegate_1 = require("./findAppDelegate");
var findPodfile_1 = require("./findPodfile");
var modifyAppDelegate_1 = require("./modifyAppDelegate");
var modifyPlist_1 = require("./modifyPlist");
var modifyPods_1 = require("./modifyPods");
var modifyProject_1 = require("./modifyProject");
var pjson = require(path.join(process.cwd(), './package.json'));
var packageName = pjson ? pjson.name : null;
function postlinkIOS(vkAppId) {
    var appDelegatePath = findAppDelegate_1.default(packageName);
    if (!appDelegatePath) {
        console.warn("\n        Could not find AppDelegate.m file for this project at " + appDelegatePath + ", so could not add the framework for iOS.\n        You should add the framework manually.\n    ");
        return;
    }
    var podfile = findPodfile_1.default();
    try {
        if (podfile) {
            modifyPods_1.default(podfile);
        }
        else {
            modifyPlist_1.default(vkAppId, appDelegatePath);
            modifyAppDelegate_1.default(appDelegatePath);
            modifyProject_1.default(appDelegatePath, packageName);
        }
    }
    catch (e) {
        console.warn('Something went wrong during automatic iOS installation. Please continue manually');
    }
}
exports.postlinkIOS = postlinkIOS;
