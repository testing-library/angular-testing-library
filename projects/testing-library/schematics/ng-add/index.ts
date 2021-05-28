import { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';

export default function (): Rule {
  return (_host: Tree, context: SchematicContext) => {
    context.logger.info(
      `Correctly installed @testing-library/angular.
See our docs at https://testing-library.com/docs/angular-testing-library/intro/ to get started.`,
    );
  };
}
