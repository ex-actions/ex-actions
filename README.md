# elixir-actions

This repo contains github actions for your elixir projects:

## Actions

### @benstepp/elixir-actions/setup

Github Action to cache and compile your elixir application.

env:
  elixir-version: "1.14.0"
  otp-version: "25.0.4"

jobs:
  compile:
    steps:
      - uses: "benstepp/elixir-actions/setup@v1"
        with:
          elixir-version: ${{ env.elixir-version }}
          otp-version: ${{ env.otp-version }}

  test:
    needs: [compile]
    steps:
      - uses: "benstepp/elixir-actions/setup@v1"
        with:
          elixir-version: ${{ env.elixir-version }}
          otp-version: ${{ env.otp-version }}

      - name: "mix test"
        runs: |
          mix test --color
