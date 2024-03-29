output = fn text -> IO.puts("<<ex-actions#output>>#{text}<<ex-actions#output>>") end

{:ok, _} = Application.ensure_all_started(:crypto)
{:ok, _} = Application.ensure_all_started(:mix)

path = Path.join(Mix.Utils.mix_config(), "config.exs")
if File.regular?(path), do: Mix.Tasks.Loadconfig.load_compile(path)
file = System.get_env("MIX_EXS") || "mix.exs"

if File.regular?(file) do
  Mix.ProjectStack.post_config(state_loader: {:cli, List.first(System.argv())})
  old_undefined = Code.get_compiler_option(:no_warn_undefined)
  Code.put_compiler_option(:no_warn_undefined, :all)
  Code.compile_file(file)
  Code.put_compiler_option(:no_warn_undefined, old_undefined)
end

Mix.Task.run("app.config", [
  "--no-app-loading",
  "--no-compile",
  "--no-archives-check",
  "--no-app-loading",
  "--no-deps-check",
  "--no-elixir-version-check",
  "--no-validate-compile-env"
])

if System.get_env("RUNNER_DEBUG", "0") == "1" do
  IO.inspect(Application.loaded_applications(), limit: :infinity)
  IO.inspect(Application.started_applications(), limit: :infinity)
  IO.inspect(Mix.Utils.extract_files([Mix.Project.build_path()], "*"), limit: :infinity)
end
