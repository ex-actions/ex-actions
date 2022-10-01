# 'benstepp/elixir-actions/mix-deps-get'

This github action will fetch and cache your elixir application's dependencies.
You probably don't need to use this directly, but the setup action uses this
internally. If you need more granular control over your github actions setup,
you can use this action to only fetch and cache dependencies.

## Usage

### Basic Usage

This will install your mix dependencies in the current drectory.

```yml
  steps:
    - uses: benstepp/elixir-actions/mix-deps-get@main
```

### Configuration

You may pass a working-directory, for example if you are in a monorepo, to
point to an elixir project in your repository.

```yml
  steps:
    - uses: benstepp/elixir-actions/mix-deps-get@main
      with:
        working-directory: 'backend'
```
