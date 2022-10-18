import * as core from '@actions/core'
import { checks } from '../utils'
import { mixDepsCompile } from './index'

async function run(): Promise<void> {
  try {
    await checks()
    await mixDepsCompile()
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

run()
