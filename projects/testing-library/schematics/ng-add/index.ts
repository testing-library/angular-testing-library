import { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
import {
  addPackageJsonDependency,
  getPackageJsonDependency,
  NodeDependencyType,
} from '@schematics/angular/utility/dependencies';

const dtl = '@testing-library/dom';

export default function (): Rule {
  return (tree: Tree, context: SchematicContext) => {
    const dtlDep = getPackageJsonDependency(tree, dtl);
    if (dtlDep) {
      context.logger.info(`Skipping installation of '@testing-library/dom' because it's already installed.`);
    } else {
      context.logger.info(`Adding '@testing-library/dom' as a dev dependency.`);
      addPackageJsonDependency(tree, { name: dtl, type: NodeDependencyType.Dev, overwrite: false, version: '^10.0.0' });
    }

    context.logger.info(
      `Correctly installed @testing-library/angular.
See our docs at https://testing-library.com/docs/angular-testing-library/intro/ to get started.`,
    );

    return tree;
  };
}
