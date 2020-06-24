import 'jest-preset-angular';
import '@testing-library/jest-dom';
import { configure } from '@testing-library/angular';
import { ReactiveFormsModule } from '@angular/forms';

beforeEach(() => {
  configure({
    defaultImports: [ReactiveFormsModule],
  });
});
