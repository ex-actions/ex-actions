# elixir-actions

This repository contains multiple github actions for your elixir projects. In
general, setup-elixir should be what you need, but all the internal actions are
located here too.

## Design Goals

- Almost zero configuration. The user should point to their mix project, and
  the actions should be able to handle the rest.

- Cache as much as possible. Fast CI/CD makes engineers happy.

- No footguns. loose versioning, missing lock files, etc should error.

- Support most commonly used Mix.compilers()

## Basic Usage

```yml
jobs:
  test:
    name: Test
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: 'backend'

    steps:
      - uses: actions/checkout@v3

      - uses: benstepp/elixir-actions/setup@build
        with:
          working-direcory: backend

      - name: mix test
        shell: bash
        run: mix test
```

## Recommendations

Use a versioned tag or a specific build hash. The stability of the build branch
is not guarunteed.

```yml
# Using a Versioned Tag
- uses: benstepp/elixir-actions/setup@v1

# Using a specific git sha from the build branch
- uses: benstepp/elixir-actions/setup@c8deaf50fb94cf24fe31da9f270fb17a64886710

# Not Recommended at all
- uses: benstepp/elixir-actions/setup@build
```
