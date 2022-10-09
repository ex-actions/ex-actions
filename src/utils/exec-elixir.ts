import { ExecResponse, exec } from './exec'

const DEFAULT_OPTIONS: string[] = [
  '--no-compile',
  '--no-deps-check',
  '--no-archives-check',
  '--no-start',
  '--no-elixir-version-check',
]

const SCRIPT_PREFIX = `
  :logger
  |> Application.get_env(:backends)
  |> Enum.map(&Logger.remove_backend/1)

`

export const execElixir = async (
  script: string,
  opts?: object
): Promise<ExecResponse> => {
  return await exec(
    'mix',
    ['run', '-e', SCRIPT_PREFIX + script, ...DEFAULT_OPTIONS],
    opts
  )
}
