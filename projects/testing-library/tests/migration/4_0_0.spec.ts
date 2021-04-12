import { getSystemPath, normalize, virtualFs } from '@angular-devkit/core';
import { TempScopedNodeJsSyncHost } from '@angular-devkit/core/node/testing';
import { HostTree } from '@angular-devkit/schematics';
import { SchematicTestRunner, UnitTestTree } from '@angular-devkit/schematics/testing';

describe('Migration to version 4.0.0', () => {
  /* eslint-disable */
  const fixtures = [
    {
      description: 'template syntax',
      input: virtualFs.stringToFileBuffer(`
        import { createComponent } from '@testing-library/angular';
        import { HomeComponent } from './home.component';

        async function setup() {
          await createComponent<HomeComponent>('<home></home>', {
            declarations: [HomeComponent],
          });
        }`),
      expected: `
        import { render } from '@testing-library/angular';
        import { HomeComponent } from './home.component';

        async function setup() {
          await render<HomeComponent>('<home></home>', {
            declarations: [HomeComponent],
          });
        }`,
    },
    {
      description: 'component syntax',
      input: virtualFs.stringToFileBuffer(`
        import { createComponent } from '@testing-library/angular';
        import { HomeComponent } from './home.component';

        async function setup() {
          await createComponent(
            {
              component: HomeComponent
            },
            {
              declarations: [HomeComponent],
            }
          );
        }`),
      expected: `
        import { render } from '@testing-library/angular';
        import { HomeComponent } from './home.component';

        async function setup() {
          await render(
            HomeComponent,
            {
              declarations: [HomeComponent],
            }
          );
        }`,
    },
    {
      description: 'component syntax with properties',
      input: virtualFs.stringToFileBuffer(`
        import { createComponent } from '@testing-library/angular';
        import { HomeComponent } from './home.component';

        async function setup() {
          await createComponent(
            {
              component: HomeComponent,
              parameters: {
                value: 'foo',
                count: 2
              },
            },
            {
              declarations: [HomeComponent],
            }
          );
        }`),
      expected: `
        import { render } from '@testing-library/angular';
        import { HomeComponent } from './home.component';

        async function setup() {
          await render(
            HomeComponent,

            {componentProperties: {
                value: 'foo',
                count: 2
              },
              declarations: [HomeComponent],
            }
          );
        }`,
    },
  ];
  /* eslint-enable */

  const schematicRunner = new SchematicTestRunner('migrations', require.resolve('../../migrations/migration.json'));
  const specPath = normalize('tests/home.spec.ts');

  fixtures.forEach(async ({ description, input, expected }) => {
    it(description, async () => {
      const host = new TempScopedNodeJsSyncHost();
      const tree = new UnitTestTree(new HostTree(host));
      tree.create('/package.json', JSON.stringify({}));
      process.chdir(getSystemPath(host.root));
      await host.write(specPath, input).toPromise();

      await schematicRunner.runSchematicAsync('migration-4.0.0', {}, tree).toPromise();
      await schematicRunner.engine.executePostTasks().toPromise();

      const actual = await host.read(specPath).toPromise().then(virtualFs.fileBufferToString);

      expect(actual.replace(/\s/g, '')).toBe(expected.replace(/\s/g, ''));
    });
  });
});
