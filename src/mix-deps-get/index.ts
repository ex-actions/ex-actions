import * as core from '@actions/core'
import { checks, exec } from '../utils'
import { restore, save } from './cache'

export async function mixDepsGet(): Promise<void> {
  const cwd: string = core.getInput('working-directory')
  await checks(cwd)

  const cached = await restore(cwd)

  if (!cached) {
    const result = await exec('mix', ['deps.get'], { cwd })

    if (result.exitCode !== 0) {
      throw new Error(`mix deps.get failed to run`)
    }

    await save(cwd)
  }
}
