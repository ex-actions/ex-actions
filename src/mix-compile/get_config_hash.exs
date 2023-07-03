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
