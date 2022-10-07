import * as core from '@actions/core'
import { exec } from './exec'

export const mixDepsGet = async (cwd: string): Promise<void> => {
  const result = await exec('mix', ['deps.get'], { cwd })

  if (result.exitCode !== 0) {
    core.error(result.stderr)
    throw new Error(`mix deps.get failed to run`)
  }
}
