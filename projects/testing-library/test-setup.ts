import { setupZoneTestEnv } from 'jest-preset-angular/setup-env/zone';
import '@testing-library/jest-dom';
import { TextEncoder, TextDecoder } from 'util';

setupZoneTestEnv();

Object.assign(global, { TextDecoder, TextEncoder });
