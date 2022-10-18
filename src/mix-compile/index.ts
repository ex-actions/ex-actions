import * as core from '@actions/core'
import * as glob from '@actions/glob'
import * as io from '@actions/io'
import {
  getCompiledBuildPath,
  getDestinationBuildPath,
  restore,
  save,
} from './cache'
import { APP_BUILD_ROOT } from '../constants'
import { exec } from '../utils'

export async function mixCompile(): Promise<void> {
  core.startGroup('Running @ex-actions/mix-compile')
  const cwd: string = core.getInput('working-directory')

  const cached = await restore(cwd)
  const force = core.getBooleanInput('force-compile')

  if (!cached || force) {
    await moveCompiledDeps(cwd)
    await compileApp(cwd)
    await deleteCompiledDeps(cwd)
    if (!cached) {
      await save(cwd)
    }
  }

  await moveCompiledApp(cwd)
  core.endGroup()
}

const moveCompiledDeps = async (cwd: string): Promise<void> => {
  const srcPath = await getCompiledBuildPath(cwd)
  const buildPath = await getDestinationBuildPath(cwd)
  await io.mkdirP(srcPath)
  await io.cp(`${buildPath}/.`, srcPath, { recursive: true })
}

const compileApp = async (cwd: string): Promise<void> => {
  const env = { ...process.env, MIX_BUILD_ROOT: APP_BUILD_ROOT }
  const compile = await exec('mix', ['compile'], { cwd, env, silent: false })
  if (compile.exitCode !== 0) {
    throw new Error(`mix compile failed to run`)
  }
}

const deleteCompiledDeps = async (cwd: string): Promise<void> => {
  const srcPath = await getCompiledBuildPath(cwd)
  const buildPath = await getDestinationBuildPath(cwd)

  const globber = await glob.create(`${srcPath}/**`)
  const files = await globber.glob()
  await Promise.all(
    files.map((f) => {
      const relativePath = f
        .replace(process.cwd(), '')
        .replace(buildPath, '')
        .replace('//', '')
      io.rmRF(relativePath)
    })
  )
}

const moveCompiledApp = async (cwd: string): Promise<void> => {
  const srcPath = await getCompiledBuildPath(cwd)
  const buildPath = await getDestinationBuildPath(cwd)
  await io.mkdirP(buildPath)
  await io.cp(`${srcPath}/.`, buildPath, { recursive: true })
}
