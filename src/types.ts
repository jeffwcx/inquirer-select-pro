import type { PartialDeep, Prettify } from '@inquirer/type';
import type { Separator, Theme } from '@inquirer/core';

export type SelectOption<Value> = {
  name?: string;
  value: Value;
  disabled?: boolean | string;
};

export enum SelectStatus {
  UNLOADED = 'unloaded',
  FILTERING = 'filtering',
  LOADED = 'loaded',
  SUBMITTED = 'submitted',
}

export type SelectItem<Value> = Separator | SelectOption<Value>;

/**
 * @internal
 */
export type InternalSelectItem<Value> =
  | Separator
  | (SelectOption<Value> & { checked?: boolean });

export type SelectTheme = {
  icon: {
    checked: string;
    unchecked: string;
    cursor: string;
    inputCursor: string;
  };
  style: {
    disabledOption: (text: string) => string;
    renderSelectedOptions: <T>(
      selectedOptions: ReadonlyArray<SelectOption<T>>,
      allOptions: ReadonlyArray<SelectItem<T>>,
    ) => string;
    emptyText: (text: string) => string;
    placeholder: (text: string) => string;
  };
  helpMode: 'always' | 'never' | 'auto';
};

export type SelectValue<Value, Multiple> = Multiple extends true
  ? Value[]
  : Value | null;

export type SelectFilterItems<Value> = (
  input?: string,
) =>
  | Promise<ReadonlyArray<SelectItem<Value>>>
  | ReadonlyArray<SelectItem<Value>>;

/**
 * Options of useSelect
 */
export interface UseSelectOptions<Value, Multiple extends boolean = true> {
  /**
   * The options displayed can be an array or an async function.
   */
  options: ReadonlyArray<SelectItem<Value>> | SelectFilterItems<Value>;
  /**
   * Whether to enable the filter function
   *
   * @defaultValue
   * `true`
   */
  filter?: boolean;
  /**
   * Clear the filter input when the option is selected (also causes the option list to change)
   *
   * @defaultValue
   * `false`
   */
  clearInputWhenSelected?: boolean;
  /**
   * Enable toggle all options
   *
   * @defaultValue
   * `false`
   */
  canToggleAll?: boolean;

  /**
   * The user's input is debounced, and the default debounce delay is 200ms.
   *
   * @defaultValue
   * `200` ms
   */
  inputDelay?: number;

  /**
   * display options in a loop
   *
   * @defaultValue
   * `false`
   */
  loop?: boolean;
  /**
   * Determine whether two options are equivalent,
   *
   * @defaultValue
   * `(a, b) => (a === b)`;
   */
  equals?: (a: Value, b: Value) => boolean;
  /**
   * Default selected options
   */
  defaultValue?: SelectValue<Value, Multiple>;
  /**
   * triggered after the user completes the selection (or skips)
   */
  onSubmitted?: (value: SelectValue<Value, Multiple>) => void;
  /**
   * Required(true), or skip(false)
   *
   * @defaultValue
   * `false`
   */
  required?: boolean;
  /**
   * select multiple options
   *
   * @defaultValue
   * `true`
   */
  multiple?: Multiple;
  /**
   * validate when submitting (press enter). Only when true is returned will the validation pass.
   *
   * @defaultValue
   * `() => true`
   */
  validate?: (
    options: ReadonlyArray<SelectOption<Value>>,
  ) => boolean | string | Promise<string | boolean>;
}

export interface SelectBehaviors {
  submit: boolean;
  select: boolean;
  deselect: boolean;
  setCursor: boolean;
  filter: boolean;
  deleteOption: boolean;
}

export interface UseSelectReturnValue<Value> {
  selections: SelectOption<Value>[];
  filterInput: string;
  displayItems: ReadonlyArray<InternalSelectItem<Value>>;
  cursor: number;
  status: SelectStatus;
  error: string;
  loop: boolean;
  multiple: boolean;
  enableFilter: boolean;
  canToggleAll: boolean;
  required: boolean;
  behaviors: SelectBehaviors;
}

/**
 * @internal
 */
export interface SelectContext<Value> extends UseSelectReturnValue<Value> {
  theme: Prettify<Theme<SelectTheme>>;
  pageSize: number;
  instructions: SelectProps<Value>['instructions'];
  emptyText: string;
  placeholder: string;
}

export interface SelectProps<Value, Multiple extends boolean = true>
  extends UseSelectOptions<Value, Multiple> {
  /**
   * prompt message
   */
  message: string;
  /**
   * page size
   */
  pageSize?: number;
  /**
   * Pass in false to directly close the instructions.
   * If you need to display dynamic instructions based on the state of the select,
   * you can also use the function.
   */
  instructions?: boolean | ((context: SelectContext<Value>) => string);
  /**
   * The text displayed when the search results are empty
   *
   * @defaultValue
   * `"No results."`
   */
  emptyText?: string;
  /**
   * filter input placeholder
   *
   * @defaultValue
   * `"Type to search"`
   */
  placeholder?: string;
  /**
   * theming
   */
  theme?: PartialDeep<Theme<SelectTheme>>;
}
