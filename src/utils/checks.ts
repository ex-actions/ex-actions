import * as core from '@actions/core'
import { access } from 'node:fs/promises'
import { constants } from 'node:fs'
import { exec } from './exec'
import { execElixir } from './exec-elixir'
import path from 'path'

export const checks = async (): Promise<void> => {
  core.startGroup('Running Checks')
  const cwd: string = core.getInput('working-directory')
  await elixirInstalled()
  await mixInstalled()
  await hexInstalled()
  await inMixProject(cwd)
  await hasMixLock(cwd)
  core.endGroup()
}

export const elixirInstalled = async (): Promise<void> => {
  const result = await exec('elixir', ['--version'])

  if (result.exitCode !== 0) {
    throw new Error('elixir executable not found')
  }

  core.info('elixir installed')
}

export const mixInstalled = async (): Promise<void> => {
  const result = await exec('mix', ['--version'])

  if (result.exitCode !== 0) {
    throw new Error('mix executable not found')
  }

  core.info('mix installed')
}

export const hexInstalled = async (): Promise<void> => {
  const result = await exec('mix', ['hex.info'])

  if (result.exitCode !== 0) {
    throw new Error('local hex not found. Did you forget to mix local.hex?')
  }

  core.info('mix local.hex installed')
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
  core.info('mix project found')
}

export const hasMixLock = async (cwd: string): Promise<void> => {
  const lockPath = path.join(cwd, 'mix.lock')
  await access(lockPath, constants.F_OK)
  core.info('mix.lock found')
}
