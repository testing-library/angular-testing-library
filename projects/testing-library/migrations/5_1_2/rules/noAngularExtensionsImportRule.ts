import * as ts from 'typescript';
import { Replacement, RuleFailure, Rules } from 'tslint';
import { tsquery } from '@phenomnomnominal/tsquery';

const IMPORT_QUERY = `ImportDeclaration StringLiteral[value="@angular-extensions/testing-library"]`;

const FAILURE_MESSAGE =
  'Found the library `@angular-extensions/testing-library`, use `@testing-library/angular` instead.';

export class Rule extends Rules.AbstractRule {
  public apply(ast: ts.SourceFile): Array<RuleFailure> {
    const imports = this.getImports(ast);
    return imports;
  }

  private getImports(ast: ts.SourceFile): Array<RuleFailure> {
    return tsquery(ast, IMPORT_QUERY).map((result) => {
      // replace text between (single) quotes
      const replacement = new Replacement(result.getStart() + 1, result.getWidth() - 2, '@testing-library/angular');
      const start = result.getStart();
      const end = result.getEnd();

      return new RuleFailure(ast, start, end, FAILURE_MESSAGE, this.ruleName, replacement);
    });
  }
}
