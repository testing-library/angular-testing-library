import { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
import * as ts from 'typescript';

export default function (): Rule {
  return async (tree: Tree, context: SchematicContext) => {
    context.logger.info('Migrating imports from @testing-library/angular to @testing-library/angular/zoneless...');

    let filesUpdated = 0;

    tree.visit((path) => {
      if (!path.endsWith('.ts') || path.includes('node_modules')) {
        return;
      }

      const content = tree.read(path);
      if (!content) {
        return;
      }

      const text = content.toString('utf-8');

      if (!text.includes('@testing-library/angular')) {
        return;
      }

      const sourceFile = ts.createSourceFile(path, text, ts.ScriptTarget.Latest, true);

      const changes: { start: number; end: number; newText: string }[] = [];

      function visit(node: ts.Node) {
        if (ts.isImportDeclaration(node)) {
          const moduleSpecifier = node.moduleSpecifier;

          if (ts.isStringLiteral(moduleSpecifier) && moduleSpecifier.text === '@testing-library/angular') {
            const fullText = moduleSpecifier.getFullText(sourceFile);
            const quoteChar = fullText.trim()[0]; // ' or "

            changes.push({
              start: moduleSpecifier.getStart(sourceFile),
              end: moduleSpecifier.getEnd(),
              newText: `${quoteChar}@testing-library/angular/zoneless${quoteChar}`,
            });
          }
        }

        ts.forEachChild(node, visit);
      }

      visit(sourceFile);

      if (changes.length > 0) {
        changes.sort((a, b) => b.start - a.start);

        let updatedText = text;
        for (const change of changes) {
          updatedText = updatedText.slice(0, change.start) + change.newText + updatedText.slice(change.end);
        }

        tree.overwrite(path, updatedText);
        filesUpdated++;
        context.logger.info(`Updated: ${path}`);
      }
    });

    if (filesUpdated > 0) {
      context.logger.info(`✓ Successfully migrated ${filesUpdated} file(s) to use @testing-library/angular/zoneless`);
    } else {
      context.logger.warn('No files found with @testing-library/angular imports.');
    }

    return tree;
  };
}
