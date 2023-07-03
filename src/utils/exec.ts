import * as core from '@actions/core'
import { exec as rawExec } from '@actions/exec'

export interface ExecResponse {
  stderr: string
  stdout: string
  exitCode: number
}

export const exec = async (
  command: string,
  args?: string[],
  opts?: object
): Promise<ExecResponse> => {
  core.debug(`command: ${command} ${args}`)
  if (opts) core.debug(`opts: ${JSON.stringify({ ...opts, env: {} })}`)

  let stdout = ''
  let stderr = ''

  const options = {
    silent: !core.isDebug(),

    ignoreReturnCode: true,
    listeners: {
      stdout: (data: Buffer) => {
        stdout += data.toString()
      },
      stderr: (data: Buffer) => {
        stderr += data.toString()
      },
    },
    ...opts,
  }

  const exitCode = await rawExec(command, args, options)

  core.debug(stdout)
  if (exitCode !== 0) {
    core.error(stdout)
    core.error(stderr)
    throw new Error(`The process ${command} failed with exitCode ${exitCode}`)
  }

  return {
    exitCode,
    stdout,
    stderr,
  }
}
