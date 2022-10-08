import path from 'path'
import * as glob from '@actions/glob'
import * as utils from '../utils'
import { DEPS_BUILD_ROOT } from '../constants'

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
    utils.getPlatform(),
    utils.getArch(),
    utils.getElixirVersion(),
    utils.getOtpVersion(),
    getMixLockHash(cwd),
    getDestinationBuildPath(cwd),
  ]).then(parts => parts.join('--'))
}

export const getCompiledBuildPath = async (cwd: string): Promise<string> => {
  const env = { ...process.env, MIX_BUILD_ROOT: DEPS_BUILD_ROOT }
  const result = await utils.execElixir('IO.puts(Mix.Project.build_path)', { cwd, env })
  if (result.exitCode === 0) {
    const fullPath = result.stdout.replace('\n', '')
    return fullPath.replace(process.cwd(), '').replace(/^\//, '')
  } else {
    throw new Error('unable to find Mix.Project.build_path()')
  }
}

export const getDestinationBuildPath = async (cwd: string): Promise<string> => {
  const result = await utils.execElixir('IO.puts(Mix.Project.build_path)', { cwd })
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
