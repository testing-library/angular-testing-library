// @ts-check

import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import angular from 'angular-eslint';
import jestDom from 'eslint-plugin-jest-dom';
import testingLibrary from 'eslint-plugin-testing-library';
import browserSecurity from 'eslint-plugin-browser-security';
import secureCoding from 'eslint-plugin-secure-coding';

export default tseslint.config(
  {
    files: ['**/*.ts'],
    extends: [
      eslint.configs.recommended,
      ...tseslint.configs.recommended,
      ...tseslint.configs.stylistic,
      ...angular.configs.tsRecommended,
    ],
    processor: angular.processInlineTemplates,
    rules: {
      '@angular-eslint/directive-selector': [
        'error',
        {
          type: 'attribute',
          prefix: 'atl',
          style: 'camelCase',
        },
      ],
      '@angular-eslint/component-selector': [
        'error',
        {
          type: 'element',
          prefix: 'atl',
          style: 'kebab-case',
        },
      ],
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
      '@angular-eslint/prefer-standalone': 'off',
      '@angular-eslint/no-input-rename': 'off',
    },
  },
  // Security rules, CWE- and CVSS-tagged. Scoped to library source: the spec
  // files below are fixtures, and a fixture states the insecure thing on
  // purpose. Measured against this repository before proposing: 0 findings.
  {
    files: ['**/*.ts'],
    ignores: ['**/*.spec.ts'],
    plugins: {
      'browser-security': browserSecurity,
      'secure-coding': secureCoding,
    },
    rules: {
      ...browserSecurity.configs.recommended.rules,
      ...secureCoding.configs.recommended.rules,
    },
  },
  {
    files: ['**/*.spec.ts'],
    extends: [jestDom.configs['flat/recommended'], testingLibrary.configs['flat/angular']],
  },
  {
    files: ['**/*.html'],
    extends: [...angular.configs.templateRecommended, ...angular.configs.templateAccessibility],
    rules: {
      '@angular-eslint/template/prefer-control-flow': 'off',
    },
  },
);
