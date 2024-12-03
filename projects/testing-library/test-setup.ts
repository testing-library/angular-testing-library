import { setupZoneTestEnv } from 'jest-preset-angular/setup-env/zone';
import '@testing-library/jest-dom';
import { TextEncoder, TextDecoder } from 'util';

setupZoneTestEnv();

// eslint-disable-next-line @typescript-eslint/naming-convention
Object.assign(global, { TextDecoder, TextEncoder });
