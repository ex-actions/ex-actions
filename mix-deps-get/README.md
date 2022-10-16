# mix-deps-get

<!--AUTO-->

This GitHub action will download and cache your mix dependencies for a mix
project.

This action can also be used as a part of ex-actions/setup-mix

## Basic Usage

```yml
jobs:
  test:
    name: 'Test'
    runs-on: 'ubuntu-latest'

    steps:
      - uses: 'actions/checkout@v3'

      - uses: 'erlef/setup-beam@v1'
        with:
          elixir-version: '1.14.1'
          otp-version: '25.1.1'
          version-type: 'strict'

      - uses: 'ex-actions/mix-deps-get@main'
        with:
          working-direcory: 'backend'

      - name: 'mix test'
        run: |
          'mix compile'
          'mix test'
```

## Configuration

Configuration can be passed as action input by using the `with` key.

- `working-directory` (optional) - This is a path relative to the root of your
  repository where your mix project can be found. Examples:

  - `working-directory: 'backend'` - This would expect a mix project and a
    backend/mix.exs file.

  - `working-directory: 'elixir/my_app'` - This would expect a mix project and a
    elixir/my_app/mix.exs file.
