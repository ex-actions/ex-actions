import path from 'path'
import { constants } from 'node:fs'
import { access } from 'node:fs/promises'
import { exec } from './exec'

export const checks = async (cwd: string): Promise<void> => {
  await elixirInstalled()
  await mixInstalled()
  await hexInstalled()
  await inMixProject(cwd)
  await hasMixLock(cwd)
}

export const elixirInstalled = async (): Promise<void> => {
  const result = await exec('elixir', ['--version'])

  if (result.exitCode !== 0) {
    throw new Error('elixir executable not found')
  }
}

export const mixInstalled = async (): Promise<void> => {
  const result = await exec('mix', ['--version'])

  if (result.exitCode !== 0) {
    throw new Error('mix executable not found')
  }
}

export const hexInstalled = async (): Promise<void> => {
  const result = await exec('mix', ['hex.info'])

  if (result.exitCode !== 0) {
    throw new Error('local hex not found. Did you forget to mix local.hex?')
  }
}

export const inMixProject = async (cwd: string): Promise<void> => {
  const result = await exec(
    'mix',
    [
      'run',
      '-e',
      'Mix.Project.get!()',
      '--no-compile',
      '--no-deps-check',
      '--no-archives-check',
      '--no-start',
    ],
    { cwd }
  )

  if (result.exitCode !== 0) {
    throw new Error(`mix project not found in ${cwd}`)
  }
}

export const hasMixLock = async (cwd: string): Promise<void> => {
  const lockPath = path.join(cwd, 'mix.lock')
  await access(lockPath, constants.F_OK)
}
