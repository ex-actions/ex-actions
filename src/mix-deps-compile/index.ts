import * as core from '@actions/core'
import * as io from '@actions/io'
import {
  getCompiledBuildPath,
  getDestinationBuildPath,
  restore,
  save,
} from './cache'
import { DEPS_BUILD_ROOT } from '../constants'
import { exec } from '../utils'

export async function mixDepsCompile(): Promise<void> {
  core.startGroup('Running @ex-actions/mix-deps-compile')
  const cwd: string = core.getInput('working-directory')

  const cached = await restore(cwd)

  if (!cached) {
    await compileDeps(cwd)
    await save(cwd)
  }

  await moveCompiled(cwd)
  core.endGroup()
}

const compileDeps = async (cwd: string): Promise<void> => {
  const env = { ...process.env, MIX_BUILD_ROOT: DEPS_BUILD_ROOT }
  const compile = await exec(
    'mix',
    [
      'deps.compile',
      '--skip-umbrella-children',
      '--skip-local-deps',
      '--include-children',
    ],
    {
      cwd,
      env,
      silent: false,
    }
  )
  if (compile.exitCode !== 0) {
    throw new Error(`mix deps.compile failed to run`)
  }
}

const moveCompiled = async (cwd: string): Promise<void> => {
  const srcPath = await getCompiledBuildPath(cwd)
  const buildPath = await getDestinationBuildPath(cwd)

  await io.mkdirP(buildPath)
  await io.cp(`${srcPath}/.`, buildPath, { recursive: true })
}
