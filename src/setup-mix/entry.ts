import * as core from '@actions/core'
import { checks } from '../utils'
import { mixCompile } from '../mix-compile'
import { mixDepsCompile } from '../mix-deps-compile'
import { mixDepsGet } from '../mix-deps-get'

async function run(): Promise<void> {
  try {
    await checks()
    await mixDepsGet()
    await mixDepsCompile()
    await mixCompile()
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

run()
