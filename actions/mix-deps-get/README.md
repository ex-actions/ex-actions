# mix-deps-get

<!--AUTO-->

This GitHub action will download and cache your mix dependencies for a mix
project. This action is also used internally as a part of
[ex-actions/setup-mix](https://github.com/ex-actions/setup-mix)

## Usage

### Runs `mix deps.get` in the repository root.

```yml
- uses: 'ex-actions/mix-deps-get@main'
```

### Runs `mix deps.get` in the `./backend` subdirectory

```yml
- uses: 'ex-actions/mix-deps-get@main'
  with:
    working-directory: 'backend'
```
