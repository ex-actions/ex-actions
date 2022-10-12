import { access } from 'node:fs/promises'
import { constants } from 'node:fs'
import { exec } from './exec'
import { execElixir } from './exec-elixir'
import path from 'path'

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
  const options: { cwd?: string } = {}
  if (cwd !== '') options.cwd = cwd
  const result = await execElixir('Mix.Project.get!()', options)

  if (result.exitCode !== 0) {
    let message = 'mix project not found'
    if (cwd) message += ` in ${cwd}`
    throw new Error(message)
  }
}

export const hasMixLock = async (cwd: string): Promise<void> => {
  const lockPath = path.join(cwd, 'mix.lock')
  await access(lockPath, constants.F_OK)
}