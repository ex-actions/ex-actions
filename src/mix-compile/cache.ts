import * as core from '@actions/core'
import * as utils from '../utils'
import { APP_BUILD_ROOT } from '../constants'
import get_config_hash from './get_config_hash.exs'
import get_src_hash from './get_src_hash.exs'

export const restore = async (cwd: string): Promise<boolean> => {
  const key = await getCacheKey(cwd)
  const buildPath = await getCompiledBuildPath(cwd)
  const paths = [buildPath]
  return await utils.restoreCache(paths, key, restoreKeys(key))
}

export const save = async (cwd: string): Promise<void> => {
  const key = await getCacheKey(cwd)
  const buildPath = await getCompiledBuildPath(cwd)
  const paths = [buildPath]
  return await utils.saveCache(paths, key)
}

export const getCacheKey = async (cwd: string): Promise<string> => {
  core.startGroup('generating cache key')

  const parts = await Promise.all([
    'cache-compiled-app',
    utils.getPlatform(),
    utils.getArch(),
    utils.getElixirVersion(),
    utils.getOtpVersion(),
    getDestinationBuildPath(cwd),
    utils.getMixLockHash(cwd),
    getConfigFilesHash(cwd),
    core.getInput('cache-key'),
    getSrcFilesHash(cwd),
  ])

  core.endGroup()
  return parts.join('--')
}

export const restoreKeys = (key: string): string[] => {
  const parts: string[] = key.split('--')

  return [
    `${parts.slice(0, -4).join('--')}--`,
    `${parts.slice(0, -3).join('--')}--`,
    `${parts.slice(0, -2).join('--')}--`,
    `${parts.slice(0, -1).join('--')}--`,
  ]
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

export const getConfigFilesHash = async (cwd: string): Promise<string> => {
  const result = await utils.execElixir(get_config_hash, { cwd })
  return result.stdout.replace('\n', '')
}

export const getSrcFilesHash = async (cwd: string): Promise<string> => {
  const result = await utils.execElixir(get_src_hash, { cwd })
  return result.stdout.replace('\n', '')
}
