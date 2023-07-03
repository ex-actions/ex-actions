# setup-mix

This GitHub action will download and cache your mix dependencies, compile the
mix dependencies, and compile your mix application.

## Usage

```yml
steps:
  - uses: 'actions/checkout@v3'

  - uses: 'erlef/setup-beam@v1'
    with:
      elixir-version: '1.15.1'
      otp-version: '25.3.2.2'
      version-type: 'strict'

  - uses: 'ex-actions/setup-mix@main'

  - name: 'mix test'
    run: 'mix test'
```

## Options

### Setup in the repository root.

```yml
- uses: 'ex-actions/setup-mix@main'
```

### Setup in the `./backend` subdirectory

```yml
- uses: 'ex-actions/setup-mix@main'
  with:
    working-directory: 'backend'
```

### Setup in the `./advanced_math` subdirectory and add a custom hash for rust srcs

```yml
- uses: 'ex-actions/setup-mix@main'
  with:
    working-directory: 'advanced_math'
    cache-key: '${{ env.rust-version }}-${{ hashFiles('**/*.rs') }}'
```

## Limitations

# No support for `@external_resources`

If your project uses `@external_resources`, they may not be supported here.
There is limited support for file-extensions and search paths based on your
application's dependencies. If you need granular support of your application
src files, you can pass a `cache-key` (see above for examples).
