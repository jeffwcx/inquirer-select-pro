import debounce from 'lodash-es/debounce';
import { type KeypressEvent, Separator, useMemo, useRef } from '@inquirer/core';
import type { InternalSelectItem, SelectOption } from './types';

export function isUpKey(key: KeypressEvent) {
  return key.name === 'up';
}

export function isDownKey(key: KeypressEvent) {
  return key.name === 'down';
}

export function isTabKey(key: KeypressEvent) {
  return key.name === 'tab';
}

export function isSelectAllKey(key: KeypressEvent) {
  return key.name === 'a' && key.ctrl;
}

export function isSelectable<Value>(
  item: InternalSelectItem<Value>,
): item is SelectOption<Value> {
  return !Separator.isSeparator(item) && !item.disabled;
}

export function toggle<Value>(
  item: InternalSelectItem<Value>,
): InternalSelectItem<Value> {
  /* v8 ignore next 3 */
  return isSelectable(item) ? { ...item, checked: !item.checked } : item;
}

export function check<Value>(
  item: InternalSelectItem<Value>,
  checked = true,
): InternalSelectItem<Value> {
  return isSelectable(item) && item.checked !== checked
    ? { ...item, checked }
    : item;
}

export function useDebounce<F extends () => void>(func: F, wait: number) {
  const ref = useRef<F>();
  ref.current = func;
  return useMemo(
    () =>
      debounce(() => {
        ref.current?.();
      }, wait),
    [wait],
  );
}
