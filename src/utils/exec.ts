import * as core from '@actions/core'
import {exec as rawExec} from '@actions/exec'

interface ExecResponse {
  stderr: string
  stdout: string
  exitCode: number
}

export const exec = async (command: string, args?: string[], opts?: object): Promise<ExecResponse> => {
  core.debug(`command: ${command} ${args}`)
  if (opts) core.debug(`opts: ${JSON.stringify(opts)}`)

  let stdout: string = ''
  let stderr: string = ''

  const options = {
    listeners: {
      stdout: (data: Buffer) => {
        stdout += data.toString()
      },
      stderr: (data: Buffer) => {
        stderr += data.toString()
      },
    },
    ...opts
  }

  const exitCode = await rawExec(command, args, options)

  core.debug(stdout)
  if (stderr.length > 0) {
    core.error(stderr)
  }
  core.debug(`exitCode: ${exitCode}`)

  return {
    exitCode,
    stdout,
    stderr,
  }
}
