import * as io from '@actions/io'
import * as core from '@actions/core'
import { exec, ExecResponse, checks } from '../utils'
import { restore, save, getDestinationBuildPath, getCompiledBuildPath } from './cache'
import { DEPS_BUILD_ROOT } from '../constants'

export async function run(): Promise<void> {
  try {
    const cwd: string = core.getInput('working-directory')
    await checks(cwd)

    const cached = await restore(cwd)

    if (!cached) {
      await compileDeps(cwd)
      await save(cwd)
    }

  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
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
