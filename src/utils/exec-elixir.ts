import { ExecResponse, exec } from './exec'

const DEFAULT_OPTIONS: string[] = [
  '--no-compile',
  '--no-deps-check',
  '--no-archives-check',
  '--no-elixir-version-check',
]

const TAG = '<<ex-actions#output>>'
const SCRIPT_PREFIX = `
  output = fn text ->
    IO.puts("${TAG}#{text}${TAG}")
  end
`

export const execElixir = async (
  script: string,
  opts?: object
): Promise<ExecResponse> => {
  const result = await exec(
    'mix',
    ['eval', SCRIPT_PREFIX + script, ...DEFAULT_OPTIONS],
    opts
  )

  const parts = result.stdout.split(TAG)
  const stdout = parts.length === 3 ? parts[1] : result.stdout

  return { ...result, stdout }
}
