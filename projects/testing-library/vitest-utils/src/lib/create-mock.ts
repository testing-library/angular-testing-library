import { Type, Provider } from '@angular/core';
import { vi, type Mock as VitestMock } from 'vitest';

export type Mock<T> = T & { [K in keyof T]: T[K] & VitestMock };

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
      if (typeof descriptor?.value === 'function') {
        mock[prop] = vi.fn();
      }
    }

    mockFunctions(Object.getPrototypeOf(proto));
  }

  mockFunctions(type.prototype);

  return mock;
}

export function createMockWithValues<T, K extends keyof T>(type: Type<T>, values: Partial<Record<K, T[K]>>): Mock<T> {
  const mock = createMock(type);

  Object.entries(values).forEach(([field, value]) => {
    (mock as any)[field] = value;
  });

  return mock;
}

export function provideMock<T>(type: Type<T>): Provider {
  return {
    provide: type,
    useValue: createMock(type),
  };
}

export function provideMockWithValues<T, K extends keyof T>(type: Type<T>, values: Partial<Record<K, T[K]>>): Provider {
  return {
    provide: type,
    useValue: createMockWithValues(type, values),
  };
}
