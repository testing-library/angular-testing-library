import { Rule, chain, Tree, SchematicContext } from '@angular-devkit/schematics';
import { TslintFixTask } from '@angular-devkit/schematics/tasks';
import * as path from 'path';
import { stripIndents } from '@angular-devkit/core/src/utils/literals';

function createRule(ruleName: string): TslintFixTask {
  return new TslintFixTask(
    {
      rulesDirectory: path.join(__dirname, 'rules'),
      rules: {
        [ruleName]: [true],
      },
    },
    {
      includes: ['**/*.spec.ts', '**/*.test.ts'],
      silent: false,
    },
  );
}

function displayInformation(tree, context: SchematicContext) {
  context.logger.info(stripIndents`
    @angular-extensions/testing-library has moved to @testing-library/angular.

    Learn more about this change here: https://github.com/testing-library/dom-testing-library/issues/260
  `);

  return tree;
}

function updatePackageJson(host: Tree) {
  if (host.exists('package.json')) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const sourceText = host.read('package.json')!.toString('utf-8');
    const json = JSON.parse(sourceText);

    if (json['devDependencies'] && json['devDependencies']['@angular-extensions/testing-library']) {
      json['devDependencies']['@testing-library/angular'] = '^6.0.0';
      delete json['devDependencies']['@angular-extensions/testing-library'];
      host.overwrite('package.json', JSON.stringify(json, null, 2));
    }
  }

  return host;
}

export default function (): Rule {
  return (host, context) => {
    context.addTask(createRule('no-angular-extensions-import'));

    return chain([displayInformation, updatePackageJson])(host, context);
  };
}
