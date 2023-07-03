:ok = Application.ensure_loaded(:crypto)
{:ok, _} = Application.ensure_all_started(:crypto)

if System.get_env("RUNNER_DEBUG", "0") == "1" do
  IO.inspect(Application.loaded_applications(), limit: :infinity)
  IO.inspect(Application.started_applications(), limit: :infinity)
  IO.inspect(Mix.Utils.extract_files([Mix.Project.build_path()], "*"))
end

Mix.Project.config_files()
|> Enum.sort()
|> Enum.reject(&String.ends_with?(&1, "compile.lock"))
|> Enum.reduce(:crypto.hash_init(:sha256), fn file, hash ->
  hash
  |> :crypto.hash_update(file)
  |> :crypto.hash_update(File.read!(file))
end)
|> :crypto.hash_final()
|> Base.encode16()
|> String.downcase()
|> then(output)
