import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { setupZoneTestEnv } from 'jest-preset-angular/setup-env/zone';
import { configure } from '@testing-library/angular';
import '@testing-library/jest-dom';

setupZoneTestEnv();
configure({
  defaultImports: [NoopAnimationsModule],
});
