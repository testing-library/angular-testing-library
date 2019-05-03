import * as ts from 'typescript';
import { Replacement, RuleFailure, Rules } from 'tslint';
import { tsquery } from '@phenomnomnominal/tsquery';

const IS_COMPONENT_PROPERTY_QUERY =
  'CallExpression:has(Identifier[name="render"]) > ObjectLiteralExpression:first-child';
const COMPONENT_PROPERTY_VALUE_QUERY = 'PropertyAssignment:has(Identifier[name="component"]) :last-child';

const FAILURE_MESSAGE = 'Found component propety syntax, signature looks different.';

export class Rule extends Rules.AbstractRule {
  public apply(ast: ts.SourceFile): Array<RuleFailure> {
    return tsquery(ast, IS_COMPONENT_PROPERTY_QUERY).map(result => {
      const [valueNode] = tsquery(result, COMPONENT_PROPERTY_VALUE_QUERY);
      const replacement = new Replacement(result.getStart(), result.getWidth(), (valueNode || result).text);
      const start = result.getStart();
      const end = result.getEnd();

      return new RuleFailure(ast, start, end, FAILURE_MESSAGE, this.ruleName, replacement);
    });
  }
}
