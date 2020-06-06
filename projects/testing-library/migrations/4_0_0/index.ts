import { Rule } from '@angular-devkit/schematics';
import { TslintFixTask } from '@angular-devkit/schematics/tasks';
import * as path from 'path';

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

export default function (): Rule {
  return (_, context) => {
    const noCreateComponentRule = createRule('no-create-component');
    const noComponentParametersRule = createRule('no-component-parameters');
    const noComponentPropertyRule = createRule('no-component-property');

    const noCreateComponentRuleId = context.addTask(noCreateComponentRule);
    const noComponentParametersRuleId = context.addTask(noComponentParametersRule, [noCreateComponentRuleId]);
    context.addTask(noComponentPropertyRule, [noComponentParametersRuleId]);
  };
}
