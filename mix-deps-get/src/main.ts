import * as core from '@actions/core'
import { checks } from './checks'
import { restore, save } from './deps-cache'
import { mixDepsGet } from './mix-deps-get'

async function run(): Promise<void> {
  try {
    const cwd: string = core.getInput('working-directory')
    await checks(cwd)

    const cached = await restore(cwd)

    if (!cached) {
      await mixDepsGet(cwd)
      await save(cwd)
    }

  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

run()
