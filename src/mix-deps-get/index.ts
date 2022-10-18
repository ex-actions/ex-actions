import * as core from '@actions/core'
import { restore, save } from './cache'
import { exec } from '../utils'

export async function mixDepsGet(): Promise<void> {
  core.startGroup('Running @ex-actions/mix-deps-get')
  const cwd: string = core.getInput('working-directory')

  const cached = await restore(cwd)

  if (!cached) {
    const result = await exec('mix', ['deps.get'], { cwd })

    if (result.exitCode !== 0) {
      throw new Error(`mix deps.get failed to run`)
    }

    await save(cwd)
  }

  core.endGroup()
}
