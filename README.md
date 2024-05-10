# inquirer-select-pro

An inquirer select that supports multiple selections and filtering/searching.

Try now?

```bash
npx @jeffwcx/gitignore
```

[![asciicast](https://asciinema.org/a/658334.svg)](https://asciinema.org/a/658334)

> A CLI to generate a `.gitignore` file: [@jeffwcx/gitignore](https://github.com/jeffwcx/jeffwcx-config/blob/main/packages/gitignore).

## Usage

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

### select

<img style="display: inline-block; vertical-align: top;" alt="Variable" src="https://img.shields.io/badge/Variable-666eff?style=flat"> An inquirer select that supports multiple selections and filtering

#### Parameters

- `config` [**_SelectProps_**](./src/types.ts#L168)

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

<img style="display: inline-block; vertical-align: top;" alt="Function" src="https://img.shields.io/badge/Function-666eff?style=flat">

> [!WARNING]
> This API is provided as a beta preview for developers and may change based on feedback that we receive. Do not use this API in a production environment.

#### Type

```typescript
declare function useSelect<Value, Multiple extends boolean>(
  props: UseSelectOptions<Value, Multiple>,
): UseSelectReturnValue<Value>;
```

#### Parameters

- `props` [**_UseSelectOptions_**](./src/types.ts#L56)<!-- -->**_\<Value, Multiple>_**

#### Returns [`UseSelectReturnValue`](./src/types.ts#L145)`<Value>`

## Play

```bash
pnpm install

# select demo
pnpm dev
```

Demo can be specified, and the following demos are available:

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
