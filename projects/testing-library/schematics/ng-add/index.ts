import { chain, noop, Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
import {
  addPackageJsonDependency,
  getPackageJsonDependency,
  NodeDependencyType,
} from '@schematics/angular/utility/dependencies';
import { NodePackageInstallTask } from '@angular-devkit/schematics/tasks';
import { Schema } from './schema';

export default function ({ installJestDom, installUserEvent }: Schema): Rule {
  return () => {
    return chain([
      addDependency('@testing-library/dom', '^10.0.0', NodeDependencyType.Dev),
      installJestDom ? addDependency('@testing-library/jest-dom', '^6.4.8', NodeDependencyType.Dev) : noop(),
      installUserEvent ? addDependency('@testing-library/user-event', '^14.5.2', NodeDependencyType.Dev) : noop(),
      installDependencies(),
    ]);
  };
}

function addDependency(packageName: string, version: string, dependencyType: NodeDependencyType) {
  return (tree: Tree, context: SchematicContext) => {
    const dtlDep = getPackageJsonDependency(tree, packageName);
    if (dtlDep) {
      context.logger.info(`Skipping installation of '${packageName}' because it's already installed.`);
    } else {
      context.logger.info(`Adding '${packageName}' as a dev dependency.`);
      addPackageJsonDependency(tree, { name: packageName, type: dependencyType, overwrite: false, version });
    }

    return tree;
  };
}

export function installDependencies(packageManager = 'npm') {
  return (_tree: Tree, context: SchematicContext) => {
    context.addTask(new NodePackageInstallTask({ packageManager }));

    context.logger.info(
      `Correctly installed @testing-library/angular.
See our docs at https://testing-library.com/docs/angular-testing-library/intro/ to get started.`,
    );
  };
}
