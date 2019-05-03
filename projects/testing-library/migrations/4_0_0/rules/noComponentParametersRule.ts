import * as ts from 'typescript';
import { Replacement, RuleFailure, Rules } from 'tslint';
import { tsquery } from '@phenomnomnominal/tsquery';

const IS_COMPONENT_PROPERTY_QUERY =
  'CallExpression:has(Identifier[name="render"]) > ObjectLiteralExpression:first-child';
const RENDER_OPTIONS_QUERY = 'CallExpression:has(Identifier[name="render"]) > ObjectLiteralExpression:last-child';
const COMPONENT_PARAMETERS_PROPERTY_VALUE_QUERY = 'PropertyAssignment:has(Identifier[name="parameters"]) :last-child';

const FAILURE_MESSAGE = 'Found `parameters` parameter, use `componentProperties` instead.';

export class Rule extends Rules.AbstractRule {
  public apply(ast: ts.SourceFile): Array<RuleFailure> {
    return tsquery(ast, IS_COMPONENT_PROPERTY_QUERY)
      .map(result => {
        const [parameterNode] = tsquery(result, COMPONENT_PARAMETERS_PROPERTY_VALUE_QUERY);
        if (!parameterNode) {
          return [];
        }
        const [renderOptionsNode] = tsquery(ast, RENDER_OPTIONS_QUERY);

        const renderOptionsText = renderOptionsNode.getFullText();
        const bracketIndex = renderOptionsText.indexOf('{');
        const renderOptions =
          renderOptionsText.substring(0, bracketIndex + 1) +
          `componentProperties:${parameterNode.getFullText()},` +
          renderOptionsText.substr(bracketIndex + 1);

        const replacement = new Replacement(renderOptionsNode.getStart(), renderOptionsNode.getWidth(), renderOptions);
        const start = renderOptionsNode.getStart();
        const end = renderOptionsNode.getEnd();

        const replacementOriginal = new Replacement(parameterNode.getStart(), parameterNode.getWidth(), '');
        const startOriginal = renderOptionsNode.getStart();
        const endOriginal = renderOptionsNode.getEnd();

        return [
          new RuleFailure(ast, startOriginal, endOriginal, FAILURE_MESSAGE, this.ruleName, replacementOriginal),
          new RuleFailure(ast, start, end, FAILURE_MESSAGE, this.ruleName, replacement),
        ];
      })
      .reduce((rules, rule) => rules.concat(rule), []);
  }
}
