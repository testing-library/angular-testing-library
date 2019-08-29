import { fireEvent } from '@testing-library/dom';
import { createType } from './type';
import { createSelectOptions } from './selectOptions';

export interface UserEvents {
  type: ReturnType<typeof createType>;
  selectOptions: ReturnType<typeof createSelectOptions>;
}

const type = createType(fireEvent);
const selectOptions = createSelectOptions(fireEvent);

export { createType, type, createSelectOptions, selectOptions };
