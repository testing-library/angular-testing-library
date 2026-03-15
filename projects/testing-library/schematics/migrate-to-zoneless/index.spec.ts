import { SchematicTestRunner, UnitTestTree } from '@angular-devkit/schematics/testing';
import * as path from 'path';
import { EmptyTree } from '@angular-devkit/schematics';
import { test, expect } from 'vitest';

test('migrates imports from @testing-library/angular to @testing-library/angular/zoneless', async () => {
  const before = `
import { render, screen } from '@testing-library/angular';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
  it('should render', async () => {
    await render(AppComponent);
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });
});
`;

  const after = `
import { render, screen } from '@testing-library/angular/zoneless';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
  it('should render', async () => {
    await render(AppComponent);
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });
});
`;

  const tree = await setup({
    'src/app.spec.ts': before,
  });

  expect(tree.readContent('src/app.spec.ts')).toBe(after);
});

test('migrates imports with double quotes', async () => {
  const before = `import { render } from "@testing-library/angular";`;
  const after = `import { render } from "@testing-library/angular/zoneless";`;

  const tree = await setup({
    'src/test.spec.ts': before,
  });

  expect(tree.readContent('src/test.spec.ts')).toBe(after);
});

test('migrates multiple imports in the same file', async () => {
  const before = `
import { render, screen } from '@testing-library/angular';
import { fireEvent } from '@testing-library/angular';
`;

  const after = `
import { render, screen } from '@testing-library/angular/zoneless';
import { fireEvent } from '@testing-library/angular/zoneless';
`;

  const tree = await setup({
    'src/multi.spec.ts': before,
  });

  expect(tree.readContent('src/multi.spec.ts')).toBe(after);
});

test('does not modify imports from other packages', async () => {
  const before = `
import { render } from '@testing-library/angular';
import { screen } from '@testing-library/dom';
import { Component } from '@angular/core';
`;

  const after = `
import { render } from '@testing-library/angular/zoneless';
import { screen } from '@testing-library/dom';
import { Component } from '@angular/core';
`;

  const tree = await setup({
    'src/other.spec.ts': before,
  });

  expect(tree.readContent('src/other.spec.ts')).toBe(after);
});

test('handles files without @testing-library/angular imports', async () => {
  const content = `
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: '<h1>Hello</h1>'
})
export class AppComponent {}
`;

  const tree = await setup({
    'src/regular.ts': content,
  });

  expect(tree.readContent('src/regular.ts')).toBe(content);
});

test('migrates multiple files', async () => {
  const tree = await setup({
    'src/file1.spec.ts': `import { render } from '@testing-library/angular';`,
    'src/file2.spec.ts': `import { screen } from '@testing-library/angular';`,
    'src/file3.spec.ts': `import { fireEvent } from '@testing-library/angular';`,
  });

  expect(tree.readContent('src/file1.spec.ts')).toBe(`import { render } from '@testing-library/angular/zoneless';`);
  expect(tree.readContent('src/file2.spec.ts')).toBe(`import { screen } from '@testing-library/angular/zoneless';`);
  expect(tree.readContent('src/file3.spec.ts')).toBe(`import { fireEvent } from '@testing-library/angular/zoneless';`);
});

async function setup(files: Record<string, string>) {
  const collectionPath = path.join(__dirname, '../../../../dist/@testing-library/angular/schematics/collection.json');
  const schematicRunner = new SchematicTestRunner('schematics', collectionPath);

  const tree = new UnitTestTree(new EmptyTree());

  for (const [filePath, content] of Object.entries(files)) {
    tree.create(filePath, content);
  }

  await schematicRunner.runSchematic('migrate-to-zoneless', {}, tree);

  return tree;
}
