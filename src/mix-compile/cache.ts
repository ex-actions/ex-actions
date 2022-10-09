import path from 'path'
import * as glob from '@actions/glob'
import * as utils from '../utils'
import { APP_BUILD_ROOT } from '../constants'

export const restore = async (cwd: string): Promise<boolean> => {
  const key = await getCacheKey(cwd)
  const buildPath = await getCompiledBuildPath(cwd)
  const paths = [buildPath]
  return await utils.restoreCache(paths, key, [])
}

export const save = async (cwd: string): Promise<void> => {
  const key = await getCacheKey(cwd)
  const buildPath = await getCompiledBuildPath(cwd)
  const paths = [buildPath]
  return await utils.saveCache(paths, key)
}

export const getCacheKey = async (cwd: string): Promise<string> => {
  return Promise.all([
    'cache-compiled-app',
    utils.getPlatform(),
    utils.getArch(),
    utils.getElixirVersion(),
    utils.getOtpVersion(),
    getMixLockHash(cwd),
    getDestinationBuildPath(cwd),
    getConfigFilesHash(cwd),
    getSrcFilesHash(cwd),
  ]).then((parts) => parts.join('--'))
}

export const getCompiledBuildPath = async (cwd: string): Promise<string> => {
  const env = { ...process.env, MIX_BUILD_ROOT: APP_BUILD_ROOT }
  const result = await utils.execElixir('IO.puts(Mix.Project.build_path)', {
    cwd,
    env,
  })
  if (result.exitCode === 0) {
    const fullPath = result.stdout.replace('\n', '')
    return fullPath.replace(process.cwd(), '').replace(/^\//, '')
  } else {
    throw new Error('unable to find Mix.Project.build_path()')
  }
}

export const getDestinationBuildPath = async (cwd: string): Promise<string> => {
  const result = await utils.execElixir('IO.puts(Mix.Project.build_path)', {
    cwd,
  })
  if (result.exitCode === 0) {
    const fullPath = result.stdout.replace('\n', '')
    return fullPath.replace(process.cwd(), '').replace(/^\//, '')
  } else {
    throw new Error('unable to find Mix.Project.build_path()')
  }
}

export const getMixLockHash = async (cwd: string): Promise<string> => {
  const lockPath = path.join(cwd, 'mix.lock')
  const hash: string = await glob.hashFiles(lockPath)
  return hash
}

export const getConfigFilesHash = async (cwd: string): Promise<string> => {
  const script = `
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
  |> IO.puts()
  `
  const result = await utils.execElixir(script, { cwd })
  return result.stdout.replace('\n', '')
}

export const getSrcFilesHash = async (cwd: string): Promise<string> => {
  const script = `
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
  `

  const result = await utils.execElixir(script, { cwd })
  return result.stdout.replace('\n', '')
}
