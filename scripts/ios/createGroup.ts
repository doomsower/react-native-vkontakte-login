const getFirstProject = (project) => project.getFirstProject().firstProject;

const findGroup = (group, name) => group.children.find(group => group.comment === name);

/**
 * Returns group from .xcodeproj if one exists, null otherwise
 *
 * Unlike node-xcode `pbxGroupByName` - it does not return `first-matching`
 * group if multiple groups with the same name exist
 *
 * If path is not provided, it returns top-level group
 */
module.exports = function getGroup(project, path) {
  const firstProject = getFirstProject(project);

  var group = project.getPBXGroupByKey(firstProject.mainGroup);

  if (!path) {
    return group;
  }

  for (var name of path.split('/')) {
    var foundGroup = findGroup(group, name);

    if (foundGroup) {
      group = project.getPBXGroupByKey(foundGroup.value);
    } else {
      group = null;
      break;
    }
  }

  return group;
};


const hasGroup = (pbxGroup, name) => pbxGroup.children.find(group => group.comment === name);

/**
 * Given project and path of the group, it deeply creates a given group
 * making all outer groups if neccessary
 *
 * Returns newly created group
 */
module.exports = function createGroup(project, path) {
  return path.split('/').reduce(
    (group, name) => {
      if (!hasGroup(group, name)) {
        const uuid = project.pbxCreateGroup(name, '""');

        group.children.push({
          value: uuid,
          comment: name,
        });
      }

      return project.pbxGroupByName(name);
    },
    getGroup(project)
  );
};

/**
 * Given project and path of the group, it checks if a group exists at that path,
 * and deeply creates a group for that path if its does not already exist.
 *
 * Returns the existing or newly created group
 */
module.exports = function createGroupWithMessage(project, path) {
  var group = getGroup(project, path);

  if (!group) {
    group = createGroup(project, path);

    log.warn(
      'ERRGROUP',
      `Group '${path}' does not exist in your Xcode project. We have created it automatically for you.`
    );
  }

  return group;
};