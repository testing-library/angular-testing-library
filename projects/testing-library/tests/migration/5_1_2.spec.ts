import { getSystemPath, normalize, virtualFs } from '@angular-devkit/core';
import { TempScopedNodeJsSyncHost } from '@angular-devkit/core/node/testing';
import { HostTree } from '@angular-devkit/schematics';
import { SchematicTestRunner, UnitTestTree } from '@angular-devkit/schematics/testing';
import { stripIndents } from '@angular-devkit/core/src/utils/literals';

describe('Migration to version 5.1.2', () => {
  const schematicRunner = new SchematicTestRunner('migrations', require.resolve('../../migrations/migration.json'));

  test('it renames @angular-extensions to @testing-library (in files)', async () => {
    const specPath = normalize('tests/home.spec.ts');

    const host = new TempScopedNodeJsSyncHost();
    const tree = new UnitTestTree(new HostTree(host));
    tree.create('/package.json', JSON.stringify({}));
    process.chdir(getSystemPath(host.root));
    await host
      .write(
        specPath,
        virtualFs.stringToFileBuffer(stripIndents`
          import { render } from '@angular-extensions/testing-library';
          import { render } from "@angular-extensions/testing-library";
        `),
      )
      .toPromise();

    await schematicRunner.runSchematicAsync('migration-5.1.2', {}, tree).toPromise();
    await schematicRunner.engine.executePostTasks().toPromise();

    const actual = await host
      .read(specPath)
      .toPromise()
      .then(virtualFs.fileBufferToString);

    expect(actual).toBe(stripIndents`
        import { render } from '@testing-library/angular';
        import { render } from "@testing-library/angular";
      `);
  });

  test('it renames @angular-extensions to @testing-library (in package.json)', async () => {
    const packageJson = normalize('/package.json');
    const host = new TempScopedNodeJsSyncHost();
    const tree = new UnitTestTree(new HostTree(host));

    tree.create(
      packageJson,
      JSON.stringify({
        devDependencies: {
          '@angular-extensions/testing-library': '🦔',
        },
      }),
    );

    await schematicRunner.runSchematicAsync('migration-5.1.2', {}, tree).toPromise();
    await schematicRunner.engine.executePostTasks().toPromise();

    expect(tree.readContent(packageJson)).toBe(
      JSON.stringify(
        {
          devDependencies: {
            '@testing-library/angular': '^6.0.0',
          },
        },
        null,
        2,
      ),
    );
  });
});
