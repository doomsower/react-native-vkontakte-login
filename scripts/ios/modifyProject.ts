import createGroupWithMessage from 'react-native/local-cli/link/ios/createGroupWithMessage';
import fs from 'fs';
import path from 'path';
import xcode from 'xcode';

export default function modifyProject(appDelegatePath: string, packageName: string) {
  const projectPath = path.join(path.dirname(appDelegatePath), '..', `${packageName}.xcodeproj`, 'project.pbxproj');
  const project = xcode.project(projectPath);

  project.parse((err: any) => {
    if (err) {
      console.warn(`Failed to modify project ${projectPath}.
      You have to add VKSdkFramework.framework to embedded binaries manually. Error is: ${err.stack}`);
      return;
    }
    createGroupWithMessage(project, 'Frameworks');
    const { uuid } = project.getFirstTarget();
    if (!project.hash.project.objects.PBXCopyFilesBuildPhase) {
      project.addBuildPhase([], 'PBXCopyFilesBuildPhase', 'Embed Frameworks', uuid,  'frameworks');
    }
    const opts = {
      embed: true,
      sign: true,
      customFramework: true,
      link: true,
      target: uuid,
      sourceTree: 'BUILT_PRODUCTS_DIR',
      lastKnownFileType: 'wrapper.framework',
    };
    project.addFramework('VKSdkFramework.framework', opts);
    fs.writeFileSync(projectPath, project.writeSync());
  });
}
