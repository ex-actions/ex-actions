import * as core from '@actions/core'
import { mixCompile } from '../mix-compile'
import { mixDepsCompile } from '../mix-deps-compile'
import { mixDepsGet } from '../mix-deps-get'

async function run(): Promise<void> {
  try {
    await mixDepsGet()
    await mixDepsCompile(true)
    await mixCompile(true)
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

run()
