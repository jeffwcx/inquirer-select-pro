import {
  type InquirerReadline,
  ValidationError,
  isBackspaceKey,
  isEnterKey,
  useEffect,
  useKeypress,
  useMemo,
  useRef,
  useState,
} from '@inquirer/core';
import {
  check,
  isDirectionKey,
  isDownKey,
  isEscKey,
  isSelectAllKey,
  isSelectable,
  isTabKey,
  isUpKey,
  toggle,
  useDebounce,
} from './utils';
import {
  type InternalSelectItem,
  type SelectBehaviors,
  type SelectOption,
  SelectStatus,
  type SelectValue,
  type SelectedOption,
  type UseSelectOptions,
  type UseSelectReturnValue,
} from './types';

function value2Name(value: any) {
  return typeof value === 'string' ||
    typeof value === 'number' ||
    typeof value === 'bigint' ||
    typeof value === 'boolean'
    ? value.toString()
    : '';
}

function transformDefaultValue<Value, Multiple>(
  values: SelectValue<Value, Multiple> | undefined,
  multiple: Multiple,
) {
  if (!values) return [];
  if (multiple) {
    if (!Array.isArray(values))
      throw new ValidationError(
        'In `multiple` mode, please pass the array as the default value.',
      );
    return values.map(
      (value) =>
        ({
          name: value2Name(value),
          value,
          focused: false,
        }) satisfies SelectedOption<Value>,
    );
  }
  return [
    {
      name: value2Name(values),
      value: values as Value,
    } satisfies SelectOption<Value>,
  ];
}

function transformSelections<Value, Multiple>(
  selections: SelectOption<Value>[],
  multiple: Multiple,
) {
  if (multiple) {
    return selections.map((s) => s.value);
  }
  /* v8 ignore next 3 */
  return selections.length > 0 ? selections[0].value : null;
}

/**
 * @beta
 * @group API
 */
export function useSelect<Value, Multiple extends boolean>(
  props: UseSelectOptions<Value, Multiple>,
): UseSelectReturnValue<Value> {
  const {
    options,
    loop = false,
    multiple = true,
    selectFocusedOnSubmit = false,
    filter = true,
    required = false,
    defaultValue,
    clearInputWhenSelected = false,
    canToggleAll = false,
    confirmDelete = false,
    inputDelay = 200,
    validate = () => true,
    equals = (a, b) => a === b,
    onSubmitted,
  } = props;

  const enableFilter = Array.isArray(options) ? false : filter;

  const [displayItems, setDisplayItems] = useState<
    ReadonlyArray<InternalSelectItem<Value>>
  >([]);

  const bounds = useMemo(() => {
    const first = displayItems.findIndex(isSelectable);
    const last = displayItems.findLastIndex(isSelectable);
    return { first, last };
  }, [displayItems]);
  const [cursor, setCursor] = useState(-1);

  const [status, setStatus] = useState(SelectStatus.UNLOADED);
  const [error, setError] = useState<string>('');

  const loader = useRef<Promise<any>>();
  const [filterInput, setFilterInput] = useState<string>('');

  const [focused, setFocused] = useState(-1);
  const selections = useRef<SelectedOption<Value>[]>(
    transformDefaultValue(defaultValue, multiple),
  );

  const [behaviors, setBehaviors] = useState<SelectBehaviors>({
    submit: false,
    select: false,
    deselect: false,
    filter: false,
    setCursor: false,
    deleteOption: false,
    blur: false,
  });

  function setBehavior(key: keyof SelectBehaviors, value: boolean) {
    if (behaviors[key] === value) return;
    setBehaviors({
      ...behaviors,
      [key]: value,
    });
  }

  // ============================= interactions start =============================

  function clearFilterInput(rl: InquirerReadline) {
    setFilterInput('');
    rl.clearLine(0);
  }
  function keepFilterInput(rl: InquirerReadline) {
    rl.clearLine(0);
    rl.write(filterInput);
  }

  // <tab> selects or deselects an option
  function handleSelect(
    rl: InquirerReadline,
    clearInput = clearInputWhenSelected,
  ) {
    if (cursor < 0 || displayItems.length <= 0) {
      if (enableFilter) {
        keepFilterInput(rl);
      }
      return;
    }
    const targetOption = displayItems[cursor];
    if (isSelectable(targetOption)) {
      if (multiple) {
        if (targetOption.checked) {
          const currentSelection = selections.current.filter(
            (op) => !equals(targetOption.value, op.value),
          );
          setBehavior('deselect', true);
          selections.current = currentSelection;
        } else {
          setBehavior('select', true);
          selections.current = [...selections.current, { ...targetOption }];
        }
      } else {
        setBehavior('select', true);
        selections.current = [{ ...targetOption }];
      }
      if (enableFilter && !targetOption.checked && clearInput) {
        clearFilterInput(rl);
      } else {
        keepFilterInput(rl);
      }
    }
    setDisplayItems(
      displayItems.map((item, i) => {
        return i === cursor ? toggle(item) : item;
      }),
    );
  }

  // <ctrl+a> toggle all options
  function toggleAll(rl: InquirerReadline) {
    if (cursor < 0 || displayItems.length <= 0) {
      if (enableFilter) {
        keepFilterInput(rl);
      }
      return;
    }
    const hasSelectAll = !displayItems.find(
      (item) => isSelectable(item) && !item.checked,
    );
    if (hasSelectAll) {
      selections.current = [];
      setBehavior('deselect', true);
      setDisplayItems(displayItems.map((item) => check(item, false)));
    } else {
      selections.current = displayItems.reduce((ss, item) => {
        if (isSelectable(item)) {
          ss.push({ ...item });
        }
        return ss;
      }, [] as SelectOption<Value>[]);
      setBehavior('select', true);
      setDisplayItems(displayItems.map((item) => check(item, true)));
    }
  }

  // <backspace> Remove the last selected option when filterInput is empty
  function removeLastSection() {
    if (selections.current.length <= 0) return;
    const lastIndex = selections.current.length - 1;
    const lastSection = selections.current[lastIndex];
    // enter focus mode
    if (confirmDelete && focused < 0) {
      lastSection.focused = true;
      setFocused(lastIndex);
      return;
    }
    const ss = selections.current.slice(0, lastIndex);
    setBehavior('deleteOption', true);
    selections.current = ss;
    setDisplayItems(
      displayItems.map((item) =>
        isSelectable(item) && equals(item.value, lastSection.value)
          ? toggle(item)
          : item,
      ),
    );
  }

  // <enter> submit selected options
  async function submit() {
    setBehavior('submit', true);
    const isValid = await validate([...selections.current]);
    if (required && selections.current.length <= 0) {
      setError('At least one option must be selected');
    } else if (isValid === true) {
      setStatus(SelectStatus.SUBMITTED);
      if (onSubmitted) {
        const finalValue = transformSelections(
          selections.current,
          multiple,
        ) as SelectValue<Value, Multiple>;
        onSubmitted(finalValue);
      }
    } else {
      setError(isValid || 'You must select a valid value');
    }
  }

  useKeypress(async (key, rl) => {
    if (focused >= 0) {
      if (isBackspaceKey(key)) {
        removeLastSection();
        setFocused(-1);
      } else if (isDirectionKey(key) || isEscKey(key)) {
        // quit focus mode
        const focusedSelection = selections.current[focused];
        focusedSelection.focused = false;
        setFocused(-1);
        setBehavior('blur', true);
      }
      clearFilterInput(rl);
      return;
    }
    if (isEnterKey(key)) {
      if (status !== SelectStatus.LOADED) {
        return;
      }
      if (
        !multiple ||
        (selectFocusedOnSubmit && selections.current.length === 0)
      ) {
        // For single selection or if no option is selected and selectFocusedOnSubmit is enabled, directly use <enter> to select
        handleSelect(rl);
      }
      await submit();
    } else if (isBackspaceKey(key) && !filterInput) {
      setFilterInput('');
      removeLastSection();
    } else if (isUpKey(key) || isDownKey(key)) {
      if (bounds.first < 0 || status !== SelectStatus.LOADED) return;
      if (
        loop ||
        (isUpKey(key) && cursor !== bounds.first) ||
        (isDownKey(key) && cursor !== bounds.last)
      ) {
        const offset = isUpKey(key) ? -1 : 1;
        let next = cursor;
        do {
          next = (next + offset + displayItems.length) % displayItems.length;
        } while (!isSelectable(displayItems[next]!));
        setBehavior('setCursor', true);
        setCursor(next);
      }
    } else if (canToggleAll && multiple && isSelectAllKey(key)) {
      toggleAll(rl);
    } else if (multiple && isTabKey(key)) {
      handleSelect(rl);
    } else {
      if (!enableFilter || status === SelectStatus.UNLOADED) return;
      setError('');
      setBehavior('filter', true);
      setFilterInput(rl.line);
    }
  });

  // ============================= interactions end =============================

  function handleItems(items: ReadonlyArray<InternalSelectItem<Value>>) {
    if (items.length <= 0) {
      setDisplayItems([]);
      setCursor(-1);
      return;
    }
    const ss = [...selections.current];
    let firstChecked = -1;
    let firstSelectable = -1;
    const finalItems = items.map((item, index) => {
      const finalItem = { ...item };
      if (isSelectable(finalItem)) {
        if (firstSelectable < 0) {
          firstSelectable = index;
        }
        ss.forEach((op) => {
          if (equals(op.value, finalItem.value)) {
            finalItem.checked = true;
            op.name = finalItem.name;
            if (firstChecked < 0) {
              firstChecked = index;
            }
          }
        });
      }
      return finalItem;
    });
    setDisplayItems(finalItems);
    selections.current = ss;
    if (multiple) {
      setCursor(firstSelectable);
    } else {
      setCursor(firstChecked < 0 ? firstSelectable : firstChecked);
    }
  }

  async function loadData() {
    if (status !== SelectStatus.UNLOADED) {
      setStatus(SelectStatus.FILTERING);
    }
    setError('');
    if (loader.current) {
      await loader.current;
    }
    const result =
      options instanceof Function
        ? enableFilter
          ? options(filterInput)
          : options()
        : options;
    loader.current = (
      result instanceof Promise ? result : Promise.resolve(result)
    )
      .then(handleItems)
      .catch((err) => setError(err))
      .finally(() => setStatus(SelectStatus.LOADED));
  }

  const debouncedLoadData = useDebounce(loadData, inputDelay);

  if (enableFilter) {
    useEffect(() => {
      debouncedLoadData();
    }, [filterInput]);
  } else {
    useEffect(() => {
      loadData();
    }, []);
  }

  return {
    selections: selections.current,
    focusedSelection: focused,
    confirmDelete,
    filterInput,
    displayItems,
    cursor,
    status,
    error,
    loop,
    multiple,
    enableFilter,
    canToggleAll,
    required,
    behaviors,
  };
}
