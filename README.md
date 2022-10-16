# elixir-actions

<!--AUTO-->

This repository contains multiple github actions for your elixir projects. In
general, setup-mix should be what you need, but all the internal actions are
located here too.

## Basic Usage

Use as a step in your workflow:

```yml
jobs:
  test:
    name: 'Test'
    runs-on: 'ubuntu-latest'
    defaults:
      run:
        working-directory: 'backend'

    steps:
      - uses: 'actions/checkout@v3'

      - uses: 'erlef/setup-beam@v1'
        with:
          elixir-version: '1.14.1'
          otp-version: '25.1.1'
          version-type: 'strict'

      - uses: 'ex-actions/setup-mix@main'
        with:
          working-direcory: 'backend'

      - name: 'mix test'
        run: 'mix test'
```

## Documentation

- [**setup-mix**](actions/setup-mix/README.md) - Sets up your mix project. It
  will install dependencies, compile dependecies, compile your application, and
  do its best to cache each step.

- [umbrella-changes-matrix](actions/umbrella-changes-matrix/README.md) - (wip)
  Tries to return a list of changed apps in your umbrella.

### Internal Actions

They are used internally as a part of setup-mix, but are extracted here in case
you need more granular control over your project.

- [mix-deps-get](actions/mix-deps-get/README.md)
- [mix-deps-compile](actions/mix-deps-compile/README.md)
- [mix-compile](actions/mix-compile/README.md)
