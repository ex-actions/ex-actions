import path from 'path'
import * as io from '@actions/io'
import * as core from '@actions/core'
import * as glob from '@actions/glob'
import { exec, ExecResponse, checks } from '../utils'
import { restore, save, getDestinationBuildPath, getCompiledBuildPath } from './cache'
import { APP_BUILD_ROOT } from '../constants'

export async function mixCompile(): Promise<void> {
  const cwd: string = core.getInput('working-directory')
  await checks(cwd)

  const cached = await restore(cwd)

  if (!cached) {
    await compileApp(cwd)
    await save(cwd)
  }
}

const compileApp = async (cwd: string): Promise<void> => {
  const srcPath = await getCompiledBuildPath(cwd)
  const buildPath = await getDestinationBuildPath(cwd)

  // copy built dependencies into temp folder
  await io.mkdirP(srcPath)
  await io.cp(`${buildPath}/.`, srcPath, { recursive: true })
  await exec('ls -lah', [], { cwd: `${srcPath}/test/lib` })

  // compile app into the temp folder
  const env = { ...process.env, MIX_BUILD_ROOT: APP_BUILD_ROOT }
  const compile = await exec('mix', ['compile'], { cwd, env })
  if (compile.exitCode !== 0) {
    throw new Error(`mix compile failed to run`)
  }

  // delete dependencies from temp folder
  const globber = await glob.create(`${srcPath}/**`)
  const files = await globber.glob()
  console.log(files)
  await Promise.all(
    files.map(f => {
      const relativePath = f.replace(process.cwd(), '').replace(buildPath, '').replace('//', '')
      io.rmRF(relativePath)
    })
  )

  // move compiled app into the destination
  await io.cp(`${srcPath}/.`, buildPath, { recursive: true })
}
