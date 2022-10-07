import os from 'os'
import path from 'path'
import * as core from '@actions/core'
import * as glob from '@actions/glob'
import * as cache from '@actions/cache'
import { exec } from '../exec'

export const restore = async (cwd: string): Promise<boolean> => {
  if (!cache.isFeatureAvailable()) {
    core.warning("@actions/cache feature not available")
    return false
  }

  const key = await getCacheKey(cwd)
  const depsPath = await getDepsPath(cwd)
  const paths = [depsPath]

  const restoredKey = await cache.restoreCache(paths, key, [])
  return Boolean(restoredKey)
}

export const save = async (cwd: string): Promise<void> => {
  if (!cache.isFeatureAvailable()) {
    core.warning("@actions/cache feature not available")
    return
  }

  const key = await getCacheKey(cwd)
  const depsPath = await getDepsPath(cwd)
  const paths = [depsPath]

  await cache.saveCache(paths, key)
  return
}

export const getCacheKey = async (cwd: string): Promise<string> => {
  const hexInfo = await exec('mix', ['hex.info'])
  const depsPath = await getDepsPath(cwd)
  const mixLockHash = await getMixLockHash(cwd)

  return [
    os.platform(),
    os.arch(),
    getElixirVersion(hexInfo.stdout),
    getOtpVersion(hexInfo.stdout),
    'deps',
    depsPath,
    getMixEnv(),
    mixLockHash,
  ].join('--')
}

export const getElixirVersion = (hexInfo: string): string => {
  const line: string | undefined = hexInfo
    .split('\n')
    .find(line => line.startsWith('Elixir:'))

    if(typeof line === 'string') {
      const match = line.match(/\s+(.*)$/)
      if (Array.isArray(match) && match.length >= 2) {
        return match[1]
      } else {
        throw new Error(`unable to determine elixir version from hex.info ${hexInfo}`)
      }
    } else {
      throw new Error(`unable to determine elixir version from hex.info ${hexInfo}`)
    }
}

export const getOtpVersion = (hexInfo: string): string => {
  const line: string | undefined = hexInfo
    .split('\n')
    .find(line => line.startsWith('OTP:'))

    if(typeof line === 'string') {
      const match = line.match(/\s+(.*)$/)
      if (Array.isArray(match) && match.length >= 2) {
        return match[1]
      } else {
        throw new Error(`unable to determine otp version from hex.info ${hexInfo}`)
      }
    } else {
      throw new Error(`unable to determine otp version from hex.info ${hexInfo}`)
    }
}

const SCRIPT: string = `
  Logger.remove_backend(:console)
  IO.puts(Mix.Project.deps_path())
`

export const getDepsPath = async (cwd: string): Promise<string> => {
  const result = await exec('mix', ['run', '-e', SCRIPT, '--no-compile', '--no-deps-check', '--no-archives-check', '--no-start'], {cwd})

  if (result.exitCode === 0) {
    const full = result.stdout.replace('\n', '')
    return full.replace(process.cwd(), '').replace(/^\//, '')
  } else {
    core.error(result.stderr)
    throw new Error('unable to find Mix.Project.deps_path()')
  }
}

export const getMixEnv = (): string => {
  return process.env.MIX_ENV || 'test'
}

export const getMixLockHash = async (cwd: string): Promise<string> => {
  const lockPath = path.join(cwd, 'mix.lock')
  const hash: string = await glob.hashFiles(lockPath)
  return hash
}
