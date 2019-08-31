import { Type, Provider } from '@angular/core';

export type Mock<T> = T & { [K in keyof T]: T[K] & jest.Mock };

export function createMock<T>(type: Type<T>): Mock<T> {
  const mock: any = {};

  function mockFunctions(proto: any) {
    if (!proto) {
      return;
    }

    for (const prop of Object.getOwnPropertyNames(proto)) {
      if (prop === 'constructor') {
        continue;
      }

      const descriptor = Object.getOwnPropertyDescriptor(proto, prop);
      if (typeof descriptor.value === 'function') {
        mock[prop] = jest.fn();
      }
    }

    mockFunctions(Object.getPrototypeOf(proto));
  }

  mockFunctions(type.prototype);

  return mock;
}

export function provideMock<T>(type: Type<T>): Provider {
  return {
    provide: type,
    useValue: createMock(type),
  };
}
