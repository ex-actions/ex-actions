import * as core from '@actions/core'
import { mixDepsGet } from '../mix-deps-get'
import { mixDepsCompile } from '../mix-deps-compile'
import { mixCompile } from '../mix-compile'

async function run(): Promise<void> {
  try {
    await mixDepsGet()
    await mixDepsCompile()
    await mixCompile()
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

run()
