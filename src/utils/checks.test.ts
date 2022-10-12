import * as checks from './checks'
import * as execElixirModule from './exec-elixir'
import * as execModule from './exec'

describe('elixirInstalled', () => {
  test('does not throw when successful', async () => {
    const exec = jest.spyOn(execModule, 'exec')

    exec.mockResolvedValue({
      exitCode: 0,
      stdout:
        'Erlang/OTP 25 [erts-13.1] [source] [64-bit] [smp:8:8] [ds:8:8:10] [async-threads:1] [jit:ns]\n\nElixir 1.14.0 (compiled with Erlang/OTP 25)',
      stderr: '',
    })

    expect(await checks.elixirInstalled()).toBe(undefined)
    expect(exec).toHaveBeenCalledWith('elixir', ['--version'])
  })

  test('throws when elixir not available and actions exec throws', async () => {
    const exec = jest.spyOn(execModule, 'exec')

    exec.mockRejectedValue(
      new Error(
        'Unable to locate executable file: elixir. Please verify either the file path exists or the file can be found within a directory specified by the PATH environment variable. Also check the file mode to verify the file is executable.'
      )
    )

    await expect(checks.elixirInstalled()).rejects.toThrow(
      'Unable to locate executable file: elixir. Please verify either the file path exists or the file can be found within a directory specified by the PATH environment variable. Also check the file mode to verify the file is executable.'
    )

    expect(exec).toHaveBeenCalledWith('elixir', ['--version'])
  })

  test('throws when elixir not available but for some reason actions/exec does not throw', async () => {
    const exec = jest.spyOn(execModule, 'exec')

    exec.mockResolvedValue({
      exitCode: 127,
      stdout: '',
      stderr: 'bash: elixir: command not found',
    })

    await expect(checks.elixirInstalled()).rejects.toThrow(
      'elixir executable not found'
    )

    expect(exec).toHaveBeenCalledWith('elixir', ['--version'])
  })
})

describe('mixInstalled', () => {
  test('does not throw when successful', async () => {
    const exec = jest.spyOn(execModule, 'exec')

    exec.mockResolvedValue({
      exitCode: 0,
      stdout:
        'Erlang/OTP 25 [erts-13.1] [source] [64-bit] [smp:8:8] [ds:8:8:10] [async-threads:1] [jit:ns]\n\nMix 1.14.0 (compiled with Erlang/OTP 25)',
      stderr: '',
    })

    expect(await checks.mixInstalled()).toBe(undefined)
    expect(exec).toHaveBeenCalledWith('mix', ['--version'])
  })

  test('throws when mix not available and actions exec throws', async () => {
    const exec = jest.spyOn(execModule, 'exec')

    exec.mockRejectedValue(
      new Error(
        'Unable to locate executable file: mix. Please verify either the file path exists or the file can be found within a directory specified by the PATH environment variable. Also check the file mode to verify the file is executable.'
      )
    )

    await expect(checks.mixInstalled()).rejects.toThrow(
      'Unable to locate executable file: mix. Please verify either the file path exists or the file can be found within a directory specified by the PATH environment variable. Also check the file mode to verify the file is executable.'
    )

    expect(exec).toHaveBeenCalledWith('mix', ['--version'])
  })

  test('throws when mix not available but for some reason actions/exec does not throw', async () => {
    const exec = jest.spyOn(execModule, 'exec')

    exec.mockResolvedValue({
      exitCode: 127,
      stdout: '',
      stderr: 'bash: mix: command not found',
    })

    await expect(checks.mixInstalled()).rejects.toThrow(
      'mix executable not found'
    )

    expect(exec).toHaveBeenCalledWith('mix', ['--version'])
  })
})

describe('hexInstalled', () => {
  test('does not throw when successful', async () => {
    const exec = jest.spyOn(execModule, 'exec')

    exec.mockResolvedValue({
      exitCode: 0,
      stdout:
        'Hex:    1.0.1\nElixir: 1.14.0\nOTP:    25.1\n\nBuilt with: Elixir 1.13.0 and OTP 22.3',
      stderr: '',
    })

    expect(await checks.hexInstalled()).toBe(undefined)
    expect(exec).toHaveBeenCalledWith('mix', ['hex.info'])
  })

  test('throws when hex not available and actions exec throws', async () => {
    const exec = jest.spyOn(execModule, 'exec')

    exec.mockRejectedValue(
      new Error('(Mix) The task "hex.info" could not be found.')
    )

    await expect(checks.hexInstalled()).rejects.toThrow(
      '(Mix) The task "hex.info" could not be found.'
    )

    expect(exec).toHaveBeenCalledWith('mix', ['hex.info'])
  })

  test('throws when hex not available but for some reason actions/exec does not throw', async () => {
    const exec = jest.spyOn(execModule, 'exec')

    exec.mockResolvedValue({
      exitCode: 127,
      stdout: '',
      stderr: '(Mix) The task "hex.info" could not be found.',
    })

    await expect(checks.hexInstalled()).rejects.toThrow(
      'local hex not found. Did you forget to mix local.hex'
    )

    expect(exec).toHaveBeenCalledWith('mix', ['hex.info'])
  })
})

describe('inMixProject', () => {
  test('does not throw when successful with working-directory', async () => {
    const exec = jest.spyOn(execElixirModule, 'execElixir')

    exec.mockResolvedValue({ exitCode: 0, stdout: '', stderr: '' })

    expect(await checks.inMixProject('backend')).toBe(undefined)
    expect(exec).toHaveBeenCalledWith('Mix.Project.get!()', { cwd: 'backend' })
  })

  test('does not throw when successful without working-directory', async () => {
    const exec = jest.spyOn(execElixirModule, 'execElixir')

    exec.mockResolvedValue({ exitCode: 0, stdout: '', stderr: '' })

    expect(await checks.inMixProject('')).toBe(undefined)
    expect(exec).toHaveBeenCalledWith('Mix.Project.get!()', {})
  })

  test('throws when mix project cannot be found with working-directory and rejected', async () => {
    const exec = jest.spyOn(execElixirModule, 'execElixir')

    exec.mockRejectedValue(
      new Error(
        '** (Mix) Cannot execute "mix run" without a Mix.Project, please ensure you are running Mix in a directory with a mix.exs file or pass the --no-mix-exs option'
      )
    )

    await expect(checks.inMixProject('backend')).rejects.toThrow(
      '** (Mix) Cannot execute "mix run" without a Mix.Project, please ensure you are running Mix in a directory with a mix.exs file or pass the --no-mix-exs option'
    )
    expect(exec).toHaveBeenCalledWith('Mix.Project.get!()', { cwd: 'backend' })
  })

  test('throws when mix project cannot be found without working-directory and rejected', async () => {
    const exec = jest.spyOn(execElixirModule, 'execElixir')

    exec.mockRejectedValue(
      new Error(
        '** (Mix) Cannot execute "mix run" without a Mix.Project, please ensure you are running Mix in a directory with a mix.exs file or pass the --no-mix-exs option'
      )
    )

    await expect(checks.inMixProject('')).rejects.toThrow(
      '** (Mix) Cannot execute "mix run" without a Mix.Project, please ensure you are running Mix in a directory with a mix.exs file or pass the --no-mix-exs option'
    )
    expect(exec).toHaveBeenCalledWith('Mix.Project.get!()', {})
  })

  test('throws when mix project cannot be found with working-directory and resolved', async () => {
    const exec = jest.spyOn(execElixirModule, 'execElixir')

    exec.mockResolvedValue({
      exitCode: 1,
      stdout: '',
      stderr:
        '** (Mix) Cannot execute "mix run" without a Mix.Project, please ensure you are running Mix in a directory with a mix.exs file or pass the --no-mix-exs option',
    })

    await expect(checks.inMixProject('backend')).rejects.toThrow(
      'mix project not found in backend'
    )

    expect(exec).toHaveBeenCalledWith('Mix.Project.get!()', { cwd: 'backend' })
  })

  test('throws when mix project cannot be found without working-directory and resolved', async () => {
    const exec = jest.spyOn(execElixirModule, 'execElixir')

    exec.mockResolvedValue({
      exitCode: 1,
      stdout: '',
      stderr:
        '** (Mix) Cannot execute "mix run" without a Mix.Project, please ensure you are running Mix in a directory with a mix.exs file or pass the --no-mix-exs option',
    })

    await expect(checks.inMixProject('')).rejects.toThrow(
      'mix project not found'
    )
    expect(exec).toHaveBeenCalledWith('Mix.Project.get!()', {})
  })
})
