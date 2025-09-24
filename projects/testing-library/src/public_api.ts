/*
 * Public API Surface of testing-library
 */

export * from './lib/models';
export * from './lib/config';
export * from './lib/testing-library';

// Re-export Angular's binding functions for convenience
export { inputBinding, outputBinding, twoWayBinding, type Binding } from '@angular/core';
