import * as core from '@actions/core'
import { mixDepsCompile } from './index'

async function run(): Promise<void> {
  try {
    await mixDepsCompile()
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

run()
