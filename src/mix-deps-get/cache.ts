import * as glob from '@actions/glob'
import * as utils from '../utils'
import path from 'path'

export const restore = async (cwd: string): Promise<boolean> => {
  const key = await getCacheKey(cwd)
  const depsPath = await getDepsPath(cwd)
  const paths = [depsPath]
  return await utils.restoreCache(paths, key, restoreKeys(key))
}

export const save = async (cwd: string): Promise<void> => {
  const key = await getCacheKey(cwd)
  const depsPath = await getDepsPath(cwd)
  const paths = [depsPath]
  return await utils.saveCache(paths, key)
}

export const getCacheKey = async (cwd: string): Promise<string> => {
  const parts = await Promise.all([
    'cache-deps',
    utils.getPlatform(),
    utils.getArch(),
    utils.getElixirVersion(),
    utils.getOtpVersion(),
    getDepsPath(cwd),
    getMixLockHash(cwd),
  ])
  return parts.join('--')
}

export const restoreKeys = (key: string): string[] => {
  const restorable: string = key.split('--').slice(0, -1).join('--')

  return [`${restorable}--`]
}

export const getDepsPath = async (cwd: string): Promise<string> => {
  const result = await utils.execElixir('IO.puts(Mix.Project.deps_path())', {
    cwd,
  })

  if (result.exitCode === 0) {
    const full = result.stdout.replace('\n', '')
    return full.replace(process.cwd(), '').replace(/^\//, '')
  } else {
    throw new Error('unable to find Mix.Project.deps_path()')
  }
}

export const getMixLockHash = async (cwd: string): Promise<string> => {
  const lockPath = path.join(cwd, 'mix.lock')
  const hash: string = await glob.hashFiles(lockPath)
  return hash
}
