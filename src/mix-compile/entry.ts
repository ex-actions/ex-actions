import * as core from '@actions/core'
import { checks } from '../utils'
import { mixCompile } from './index'

async function run(): Promise<void> {
  try {
    await checks()
    await mixCompile()
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

run()
