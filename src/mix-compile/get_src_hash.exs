get_files_for_srcs = fn (srcs_key, extensions) ->
  if Mix.Project.umbrella?() do
    Mix.Project.apps_paths()
    |> Map.to_list()
    |> then(&Mix.Project.in_project(elem(&1, 0), elem(&1, 1), fn _ ->
      srcs = Mix.Project.config[srcs_key]
      Mix.Utils.extract_files(srcs, extensions)
    end))
  else
    srcs = Mix.Project.config[srcs_key]
    Mix.Utils.extract_files(srcs, extensions)
  end
end

get_files = fn
  :app ->
    []
  :elixir ->
    get_files_for_srcs.(:elixirc_paths, [:ex])
  :erlang ->
    get_files_for_srcs.(:erlc_paths, [:erl])
  :leex ->
    get_files_for_srcs.(:erlc_paths, [:xrl])
  :yecc ->
    get_files_for_srcs.(:erlc_paths, [:yrl])
  _unknown_compiler ->
    []
end

add_priv_and_include = fn files ->
  [Mix.Utils.extract_files(["priv", "include"], "*")| files]
end

Mix.Tasks.Compile.compilers()
|> Enum.map(&get_files.(&1))
|> then(&add_priv_and_include.(&1))
|> List.flatten()
|> Enum.reduce(:crypto.hash_init(:sha256), fn file, hash ->
  hash
  |> :crypto.hash_update(file)
  |> :crypto.hash_update(File.read!(file))
end)
|> :crypto.hash_final()
|> Base.encode16()
|> String.downcase()
|> IO.puts()
