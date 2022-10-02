#!/usr/bin/env bash

echo "::set-output name=apps::$(
  mix run -e '
  add_deps = fn ({app, path}, acc) ->
    Mix.Project.in_project(app, path, fn _ ->
      Mix.Project.config()
      |> Access.get(:deps, [])
      |> Kernel.||([])
      |> Enum.reduce(acc, fn {dep, config}, acc ->
        case is_list(config) and config[:in_umbrella] do
          true ->
            Map.update(acc, dep, [], fn l -> l ++ [app] end)
          _ ->
          acc
        end
      end)
    end)
  end

  [changes, pwd, working_directory] = System.argv()
  base = String.replace_suffix(pwd, working_directory, "")

  apps_map = Mix.Project.apps_paths()
             |> Enum.reduce(%{}, &add_deps.(&1, &2))

  apps_paths = Mix.Project.apps_paths()
  |> Enum.map(fn {app, path} ->
    [pwd, "", path]
    |> Enum.reject(& &1 == "" or &1 == nil)
    |> Path.join()
    |> then(&{app, &1})
  end)

  changed_apps = System.argv()
  |> List.first()
  |> String.split(" ")
  |> Enum.reduce([], fn file, acc ->
    full_path = Path.join(base, file)

    Enum.reduce(apps_paths, acc, fn {app, path}, acc ->
      case String.starts_with?(full_path, path) do
        true -> [app|acc]
        false -> acc
      end
    end)
  end)
  |> List.flatten()
  |> Enum.uniq()

  changed_apps
  |> Enum.map(&Map.get(apps_map, &1) ++ [&1])
  |> List.flatten()
  |> Enum.uniq()
  |> Enum.map(&to_string/1)
  |> Enum.map(&Kernel.inspect/1)
  |> Enum.join(",")
  |> then(&"[#{&1}]")
  |> IO.inspect()
  ' --no-deps-check --no-compile --no-archives-check --no-start -- $1 $(pwd) $2
)"
