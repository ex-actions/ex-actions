import { ExecResponse, exec } from './exec'
import script_prefix from './script_prefix.exs'

const TAG = '<<ex-actions#output>>'

export const execElixir = async (
  script: string,
  opts?: object
): Promise<ExecResponse> => {
  const result = await exec('elixir', ['-e', script_prefix + script], opts)

  const parts = result.stdout.split(TAG)
  const stdout = parts.length === 3 ? parts[1] : result.stdout

  return { ...result, stdout }
}
