elixir_3p = [
  {:phoenix, [:heex]},
]

add_third_party_extensions = fn ({dep, extensions}, acc) ->
  if dep in Mix.Project.deps_apps() do
    [extensions|acc]
  else
    acc
  end
end

get_srcs = fn base_path ->
  extensions = List.flatten(Enum.reduce(elixir_3p, [:ex, :eex], &add_third_party_extensions.(&1, &2)))

  elixir = Mix.Project.config()
  |> Keyword.get(:elixirc_paths)
  |> then(&Mix.Utils.extract_files(&1, extensions))

  erlang = Mix.Project.config()
  |> Keyword.get(:erlc_paths)
  |> then(&Mix.Utils.extract_files(&1, [:erl, :xrl, :yrl]))

  include = Mix.Project.config()
  |> Keyword.get(:erlc_include_path)
  |> List.wrap()
  |> then(&Mix.Utils.extract_files(&1, "*"))

  priv = Mix.Utils.extract_files(["priv"], "*")

  [elixir,erlang, priv, include]
  |> List.flatten()
  |> Enum.map(&"#{base_path}/#{&1}")
  |> Enum.map(&String.replace_leading(&1, "/", ""))
end

get_srcs_for_app = fn {app, path} when is_atom(app) and is_binary(path) ->
  Mix.Project.in_project(app, path, fn _mod -> get_srcs.(path) end)
end

if Mix.Project.umbrella?() do
  Enum.map(Mix.Project.apps_paths(), &get_srcs_for_app.(&1))
else
  get_srcs.("")
end
|> List.flatten()
|> Enum.sort()
|> Enum.reduce(:crypto.hash_init(:sha256), fn file, hash ->
  case File.read(file) do
    {:ok, binary} ->
      hash
      |> :crypto.hash_update(file)
      |> :crypto.hash_update(binary)

    {:error, :eisdir} ->
      hash

    {:error, reason} ->
      raise "cannot read #{file} #{reason}"
  end
end)
|> :crypto.hash_final()
|> Base.encode16()
|> String.downcase()
|> then(output)
