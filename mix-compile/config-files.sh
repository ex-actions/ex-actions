#!/usr/bin/env bash

CONFIG_FILES=$(
  mix run -e '
    Logger.remove_backend(:console)

    Mix.Project.config_files()
    |> Enum.sort()
    |> Enum.reduce(:crypto.hash_init(:sha256), fn file, hash ->
      hash
      |> :crypto.hash_update(file)
      |> :crypto.hash_update(File.read!(file))
    end)
    |> :crypto.hash_final()
    |> IO.inspect()
  ' --no-compile --no-deps-check --no-archives-check --no-start
)

echo "::set-output name=config-files::$CONFIG_FILES"
