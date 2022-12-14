import * as glob from '@actions/glob'
import * as path from 'path'
import { exec } from './exec'
import os from 'os'

export const getPlatform = (): string => os.platform()
export const getArch = (): string => os.arch()

export const getElixirVersion = async (): Promise<string> => {
  return await findVersion('Elixir:')
}

export const getOtpVersion = async (): Promise<string> => {
  return await findVersion('OTP:')
}

const findVersion = async (search: string): Promise<string> => {
  const hexInfo = await exec('mix', ['hex.info'])
  const name = search.toLowerCase().replace(/:/, '')

  if (hexInfo.exitCode !== 0) {
    throw new Error(`unable to run mix hex.info`)
  }

  const line: string | undefined = hexInfo.stdout
    .split('\n')
    .find((l) => l.startsWith(search))

  if (typeof line === 'string') {
    const match = line.match(/\s+(.*)$/)
    if (Array.isArray(match) && match.length >= 2) {
      return match[1]
    } else {
      throw new Error(
        `unable to determine ${name} version from hex.info ${hexInfo}`
      )
    }
  } else {
    throw new Error(
      `unable to determine ${name} version from hex.info ${hexInfo}`
    )
  }
}

export const getMixLockHash = async (cwd: string): Promise<string> => {
  const lockPath = path.join(cwd, 'mix.lock')
  const hash: string = await glob.hashFiles(lockPath)
  return hash
}
