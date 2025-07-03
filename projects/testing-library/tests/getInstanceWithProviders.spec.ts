import { Injectable } from '@angular/core';
import { getInstanceWithProviders } from '../src/lib/testing-library';

describe('getInstanceWithProviders', () => {
  @Injectable()
  class DatabaseService {
    getData() {
      return 'real data';
    }
  }

  @Injectable()
  class UserService {
    constructor(private db: DatabaseService) {}

    getUser() {
      return `User: ${this.db.getData()}`;
    }
  }

  it('should inject a mock service into a service that depends on it', () => {
    const mockDatabase = { getData: () => 'mock data' };

    const userService = getInstanceWithProviders(UserService, [{ provide: DatabaseService, useValue: mockDatabase }]);

    expect(userService.getUser()).toBe('User: mock data');
  });
});
