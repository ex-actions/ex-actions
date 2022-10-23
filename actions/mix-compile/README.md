# mix-compile

This GitHub action will compile and cache your mix application. This action is
also used internally as a part of
[ex-actions/setup-mix](https://github.com/ex-actions/setup-mix)

## Usage

### Runs `mix compile` in the repository root.

```yml
- uses: 'ex-actions/mix-compile@main'
```

### Runs `mix compile` in the `./backend` subdirectory

```yml
- uses: 'ex-actions/mix-compile@main'
  with:
    working-directory: 'backend'
```

### Custom Cache Key hashing a custom lock file

```yml
- uses: 'ex-actions/mix-compile@main'
  with:
    cache-key: ${{ hashFiles('**/custom.lock') }}
```

### Custom Cache Key hashing rust srcs

```yml
- uses: 'ex-actions/mix-compile@main'
  with:
    cache-key: '${{ env.rust-version }}-${{ hashFiles('**/*.rs') }}'
```
