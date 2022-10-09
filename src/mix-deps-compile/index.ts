import * as core from '@actions/core'
import * as io from '@actions/io'
import { checks, exec } from '../utils'
import {
  getCompiledBuildPath,
  getDestinationBuildPath,
  restore,
  save,
} from './cache'
import { DEPS_BUILD_ROOT } from '../constants'

export async function mixDepsCompile(): Promise<void> {
  const cwd: string = core.getInput('working-directory')
  await checks(cwd)

  const cached = await restore(cwd)

  if (!cached) {
    await compileDeps(cwd)
    await save(cwd)
  }
}

const compileDeps = async (cwd: string): Promise<void> => {
  const env = { ...process.env, MIX_BUILD_ROOT: DEPS_BUILD_ROOT }
  const compile = await exec('mix', ['deps.compile'], { cwd, env })
  if (compile.exitCode !== 0) {
    throw new Error(`mix deps.compile failed to run`)
  }

  const srcPath = await getCompiledBuildPath(cwd)
  const buildPath = await getDestinationBuildPath(cwd)

  await io.mkdirP(buildPath)
  await io.cp(srcPath, buildPath, { recursive: true })
}
