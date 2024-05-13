# inquirer-select-pro

<a href="https://www.npmjs.com/package/inquirer-select-pro" target="_blank"><img alt="NPM Version" src="https://img.shields.io/npm/v/inquirer-select-pro"></a> <a href="https://codecov.io/gh/jeffwcx/inquirer-select-pro" target="_blank"><img alt="codecov" src="https://codecov.io/gh/jeffwcx/inquirer-select-pro/graph/badge.svg?token=tjROGqr2yx"></a> <a href="https://github.com/jeffwcx/inquirer-select-pro/actions?query=branch%3Amain" target="_blank"><img src="https://img.shields.io/github/actions/workflow/status/jeffwcx/inquirer-select-pro/.github/workflows/build.yml?branch=main" alt="CI" /></a>

An inquirer select that supports multiple selections and filtering/searching.

## Install

```bash
pnpm i inquirer-select-pro
```

```bash
npm i inquirer-select-pro
```

## Try now?

```bash
npx @jeffwcx/gitignore
```

[![asciicast](https://asciinema.org/a/658848.svg)](https://asciinema.org/a/658848)

> A CLI to generate a `.gitignore` file: [@jeffwcx/gitignore](https://github.com/jeffwcx/jeffwcx-config/blob/main/packages/gitignore).

## Usage

### Multiple selection and async data source

```ts
import { select } from 'inquirer-select-pro';
const answer = await select({
  message: 'select',
  options: async (input) => {
    const res = await fetch('<url>', {
      body: new URLSearchParams({ keyword: input }),
    });
    if (!res.ok) throw new Error('fail to get list!');
    return await res.json();
  },
});
```

### Radio mode

```ts
import { select } from 'inquirer-select-pro';
const answer = await select({
  message: 'select...',
  mutiple: false,
  options: [
    { name: 'Apple', value: 'apple' },
    { name: 'Banana', value: 'banana' },
  ],
});
```

## API

### select()

An inquirer select that supports multiple selections and filtering

#### Parameters

- `config` [**_SelectProps_**](./src/types.ts#L166) <!-- -->**_\<Value, Multiple>_**

#### Returns

**_CancelablePromise_** <!-- -->**_\<Value>_**

#### Examples

```ts
import { select } from 'inquirer-select-pro';
const answer = await select({
  message: 'select',
  options: async (input) => {
    const res = await fetch('<url>', {
      body: new URLSearchParams({ keyword: input }),
    });
    if (!res.ok) throw new Error('fail to get list!');
    return await res.json();
  },
});
```

### useSelect()

> [!WARNING]
> This API is provided as a beta preview for developers and may change based on feedback that we receive. Do not use this API in a production environment.

#### Type

```typescript
declare function useSelect<Value, Multiple extends boolean>(
  props: UseSelectOptions<Value, Multiple>,
): UseSelectReturnValue<Value>;
```

#### Parameters

- `props` [**_UseSelectOptions_**](./src/types.ts#L58)<!-- -->**_\<Value, Multiple>_**

#### Returns

[**_UseSelectReturnValue_**](./src/types.ts#L149)<!-- -->**_\<Value>_**

### Theming

#### Type

```ts
export type SelectTheme = {
  prefix: string;
  spinner: {
    interval: number;
    frames: string[];
  };
  icon: {
    checked: string;
    unchecked: string;
    cursor: string;
    inputCursor: string;
  };
  style: {
    answer: (text: string) => string;
    message: (text: string) => string;
    error: (text: string) => string;
    help: (text: string) => string;
    highlight: (text: string) => string;
    key: (text: string) => string;
    disabledOption: (text: string) => string;
    renderSelectedOptions: <T>(
      selectedOptions: ReadonlyArray<SelectOption<T>>,
      allOptions: ReadonlyArray<SelectOption<T> | Separator>,
    ) => string;
    emptyText: (text: string) => string;
    placeholder: (text: string) => string;
  };
  helpMode: 'always' | 'never' | 'auto';
};
```

#### Examples

```ts
await renderPrompt({
  message,
  placeholder: 'search',
  options: () => top100Films,
  pageSize: 2,
  instructions: false,
  theme: {
    icon: {
      inputCursor: 'filter: ',
      checked: ' √',
      unchecked: ' ',
    },
    style: {
      placeholder: (text: string) => `${text}...`,
    },
  },
});
```

The appearance is as follows:

```
? Choose movie:
filter:  The Shawshank Redemption (1994)
> √ The Shawshank Redemption (1994)
    The Godfather (1972)

```

## How to contribute？

1. Fork the project

2. Start development

```bash
git clone https://github.com/yourname/inquirer-select-pro.git
cd inquirer-select-pro
pnpm i
# Create a branch
git checkout -b my-new-feature
# Develop
pnpm dev
# Build
pnpm build
# Test
pnpm test
```

> [!NOTE]
> Running `pnpm dev` actually allows you to specify the demo directly.

Here is a list of available demos:

- local
- remote
- filter-remote
- filter-local

```bash
pnpm dev filter-remote
```

Parameters can also be fixed. The following parameters can be fixed:

- filter
- clearInputWhenSelected
- required
- loop
- multiple

```bash
pnpm dev filter-demo --multiple=false
```

3. Commit changes to your branch `git commit -am 'Add some feature'`

4. Push your branch `git push origin my-new-feature`

5. Submit a pull request
