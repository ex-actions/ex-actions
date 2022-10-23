# mix-deps-compile

This GitHub action will compile and cache your mix dependencies for a mix
project. This action is also used internally as a part of
[ex-actions/setup-mix](https://github.com/ex-actions/setup-mix)

## Usage

### Runs `mix deps.compile` in the repository root.

```yml
- uses: 'ex-actions/mix-deps-compile@main'
```

### Runs `mix deps.compile` in the `./backend` subdirectory

```yml
- uses: 'ex-actions/mix-deps-compile@main'
  with:
    working-directory: 'backend'
```
