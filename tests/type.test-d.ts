import { expectTypeOf, test } from 'vitest';
import { select } from '../dist';
import type { CancelablePromise } from '@inquirer/type';

test('api type test', () => {
  expectTypeOf<CancelablePromise<number[]>>(
    select({
      message: 'test',
      multiple: true,
      options: [{ value: 1 }],
    }),
  );
  expectTypeOf<CancelablePromise<number | null>>(
    select({
      message: 'test',
      multiple: false,
      options: [{ value: 1 }],
    }),
  );
});
