# setup-mix

This GitHub action will download and cache your mix dependencies, compile the
mix dependencies, and compile your mix application.

## Usage

### Setup in the repository root.

```yml
- uses: 'ex-actions/mix-deps-get@main'
```

### Setup in the `./backend` subdirectory

```yml
- uses: 'ex-actions/mix-deps-get@main'
  with:
    working-directory: 'backend'
```

### Setup in the `./advanced_math` subdirectory and add a custom hash for rust srcs

```yml
- uses: 'ex-actions/mix-deps-get@main'
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
