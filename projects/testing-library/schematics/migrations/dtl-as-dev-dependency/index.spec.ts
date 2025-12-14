import { SchematicTestRunner, UnitTestTree } from '@angular-devkit/schematics/testing';
import * as path from 'path';
import { EmptyTree } from '@angular-devkit/schematics';

test('adds DTL to devDependencies', async () => {
  const tree = await setup({});
  const pkg = tree.readContent('package.json');

  expect(pkg).toMatchInlineSnapshot(`
    "{
      "devDependencies": {
        "@testing-library/dom": "^10.0.0"
      }
    }"
  `);
});

test('ignores if DTL is already listed as a dev dependency', async () => {
  const tree = await setup({ devDependencies: { '@testing-library/dom': '^9.0.0' } });
  const pkg = tree.readContent('package.json');

  expect(pkg).toMatchInlineSnapshot(`"{"devDependencies":{"@testing-library/dom":"^9.0.0"}}"`);
});

test('ignores if DTL is already listed as a dependency', async () => {
  const tree = await setup({ dependencies: { '@testing-library/dom': '^11.0.0' } });
  const pkg = tree.readContent('package.json');

  expect(pkg).toMatchInlineSnapshot(`"{"dependencies":{"@testing-library/dom":"^11.0.0"}}"`);
});

async function setup(packageJson: object) {
  const collectionPath = path.join(__dirname, '../migrations.json');
  const schematicRunner = new SchematicTestRunner('schematics', collectionPath);

  const tree = new UnitTestTree(new EmptyTree());
  tree.create('package.json', JSON.stringify(packageJson));

  await schematicRunner.runSchematic(`atl-add-dtl-as-dev-dependency`, {}, tree);

  return tree;
}
