import * as ts from 'typescript';
import { Replacement, RuleFailure, Rules } from 'tslint';
import { tsquery } from '@phenomnomnominal/tsquery';

const CREATE_COMPONENT_IDENTIFIER = 'Identifier[name="createComponent"]';
const CREATE_COMPONENT_IMPORT_QUERY = `ImportSpecifier > ${CREATE_COMPONENT_IDENTIFIER}`;
const CREATE_COMPONENT_CALL_EXPRESSION_QUERY = `CallExpression > ${CREATE_COMPONENT_IDENTIFIER}`;

const RENDER = 'render';

const FAILURE_MESSAGE = 'Found `createComponent`, use `render` instead.';

export class Rule extends Rules.AbstractRule {
  public apply(ast: ts.SourceFile): Array<RuleFailure> {
    const imports = this.getImports(ast);
    const usages = this.getUsages(ast);

    return [...imports, ...usages];
  }

  private getImports(ast: ts.SourceFile): Array<RuleFailure> {
    return tsquery(ast, CREATE_COMPONENT_IMPORT_QUERY).map((result) => {
      const replacement = new Replacement(result.getStart(), result.getWidth(), RENDER);
      const start = result.getStart();
      const end = result.getEnd();

      return new RuleFailure(ast, start, end, FAILURE_MESSAGE, this.ruleName, replacement);
    });
  }

  private getUsages(ast: ts.SourceFile): Array<RuleFailure> {
    return tsquery(ast, CREATE_COMPONENT_CALL_EXPRESSION_QUERY).map((result) => {
      const replacement = new Replacement(result.getStart(), result.getWidth(), RENDER);
      const start = result.getStart();
      const end = result.getEnd();

      return new RuleFailure(ast, start, end, FAILURE_MESSAGE, this.ruleName, replacement);
    });
  }
}
