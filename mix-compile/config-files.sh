#!/usr/bin/env bash

CONFIG_FILES=$(
  mix run -e '
    Logger.remove_backend(:console)

    Mix.Project.config_files()
    |> Enum.map(&Kernel.inspect/1)
    |> Enum.join(",")
    |> then(&"[#{&1}]")
    |> IO.inspect()
  ' --no-compile --no-deps-check --no-archives-check --no-start
)

echo "::set-output name=config-files::$(echo $CONFIG_FILES | sed -n 's/^\"//pg' | sed -n 's/\"$//pg' | sed -n 's/\\//pg')"
