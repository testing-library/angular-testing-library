import { fireEvent } from '@testing-library/dom';
import { createType } from './type';

export interface UserEvents {
  type: ReturnType<typeof createType>;
}

const type = createType(fireEvent);

export { createType, type };
