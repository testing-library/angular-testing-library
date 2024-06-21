import 'jest-preset-angular/setup-jest';
import '@testing-library/jest-dom';
import { TextEncoder, TextDecoder } from 'util';

// eslint-disable-next-line @typescript-eslint/naming-convention
Object.assign(global, { TextDecoder, TextEncoder });
