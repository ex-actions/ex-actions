import * as execModule from './exec'
import * as glob from '@actions/glob'
import * as parts from './cache-key-parts'
import { mockHash } from 'test-helpers'
import os from 'os'

jest.mock('os')

describe('getPlatform', () => {
  test('returns linux when os.platform() returns linux', async () => {
    const platform = jest.spyOn(os, 'platform')
    platform.mockReturnValue('linux')

    expect(parts.getPlatform()).toBe('linux')
  })

  test('returns darwin when os.platform() returns darwin', async () => {
    const platform = jest.spyOn(os, 'platform')
    platform.mockReturnValue('darwin')

    expect(parts.getPlatform()).toBe('darwin')
  })

  test('returns win32 when os.platform() returns win32', async () => {
    const platform = jest.spyOn(os, 'platform')
    platform.mockReturnValue('win32')

    expect(parts.getPlatform()).toBe('win32')
  })
})

describe('getArch', () => {
  test('returns x64 when os.arch() returns x64', async () => {
    const platform = jest.spyOn(os, 'arch')
    platform.mockReturnValue('x64')

    expect(parts.getArch()).toBe('x64')
  })

  test('returns arm when os.arch() returns arm', async () => {
    const platform = jest.spyOn(os, 'arch')
    platform.mockReturnValue('arm')

    expect(parts.getArch()).toBe('arm')
  })

  test('returns arm64 when os.arch() returns arm64', async () => {
    const platform = jest.spyOn(os, 'arch')
    platform.mockReturnValue('arm64')

    expect(parts.getArch()).toBe('arm64')
  })
})

describe('getElixirVersion', () => {
  test('throws when mix hex.info resolves to failure', async () => {
    const exec = jest.spyOn(execModule, 'exec')

    exec.mockResolvedValue({
      exitCode: 127,
      stdout: '',
      stderr: '(Mix) The task "hex.info" could not be found.',
    })

    await expect(parts.getElixirVersion()).rejects.toThrow(
      'unable to run mix hex.info'
    )

    expect(exec).toHaveBeenCalledWith('mix', ['hex.info'])
  })

  test('throws when mix hex.info rejects', async () => {
    const exec = jest.spyOn(execModule, 'exec')

    exec.mockRejectedValue(
      new Error('(Mix) The task "hex.info" could not be found.')
    )

    await expect(parts.getElixirVersion()).rejects.toThrow(
      '(Mix) The task "hex.info" could not be found.'
    )

    expect(exec).toHaveBeenCalledWith('mix', ['hex.info'])
  })

  test('throws when mix hex.info does not have an Elixir: line', async () => {
    const exec = jest.spyOn(execModule, 'exec')

    exec.mockResolvedValue({
      exitCode: 0,
      stdout:
        'Hex:    1.0.1\n\nOTP:    25.1\nBuilt with: Elixir 1.13.0 and OTP 22.3',
      stderr: '',
    })

    await expect(parts.getElixirVersion()).rejects.toThrow(
      'unable to determine elixir version from hex.info'
    )

    expect(exec).toHaveBeenCalledWith('mix', ['hex.info'])
  })

  test('throws when mix hex.info does not have an elixir version on that line', async () => {
    const exec = jest.spyOn(execModule, 'exec')

    exec.mockResolvedValue({
      exitCode: 0,
      stdout:
        'Hex:    1.0.1\n\nOTP:    25.1\nElixir:\nBuilt with: Elixir 1.13.0 and OTP 22.3',
      stderr: '',
    })

    await expect(parts.getElixirVersion()).rejects.toThrow(
      'unable to determine elixir version from hex.info'
    )

    expect(exec).toHaveBeenCalledWith('mix', ['hex.info'])
  })

  test('returns 1.13.3 when that is in mix hex.info', async () => {
    const exec = jest.spyOn(execModule, 'exec')

    exec.mockResolvedValue({
      exitCode: 0,
      stdout:
        'Hex:    1.0.1\nElixir: 1.13.3\nOTP:    25.1\n\nBuilt with: Elixir 1.13.0 and OTP 22.3',
      stderr: '',
    })

    expect(await parts.getElixirVersion()).toBe('1.13.3')
    expect(exec).toHaveBeenCalledWith('mix', ['hex.info'])
  })

  test('returns 1.14.1 when that is in mix hex.info', async () => {
    const exec = jest.spyOn(execModule, 'exec')

    exec.mockResolvedValue({
      exitCode: 0,
      stdout:
        'Hex:    1.0.1\nElixir: 1.14.1\nOTP:    25.1\n\nBuilt with: Elixir 1.13.0 and OTP 22.3',
      stderr: '',
    })

    expect(await parts.getElixirVersion()).toBe('1.14.1')
    expect(exec).toHaveBeenCalledWith('mix', ['hex.info'])
  })

  test('returns 1.14.0-rc0 when that is in mix hex.info', async () => {
    const exec = jest.spyOn(execModule, 'exec')

    exec.mockResolvedValue({
      exitCode: 0,
      stdout:
        'Hex:    1.0.1\nElixir: 1.14.0-rc0\nOTP:    25.1\n\nBuilt with: Elixir 1.13.0 and OTP 22.3',
      stderr: '',
    })

    expect(await parts.getElixirVersion()).toBe('1.14.0-rc0')
    expect(exec).toHaveBeenCalledWith('mix', ['hex.info'])
  })
})

describe('getOtpVersion', () => {
  test('throws when mix hex.info resolves to failure', async () => {
    const exec = jest.spyOn(execModule, 'exec')

    exec.mockResolvedValue({
      exitCode: 127,
      stdout: '',
      stderr: '(Mix) The task "hex.info" could not be found.',
    })

    await expect(parts.getOtpVersion()).rejects.toThrow(
      'unable to run mix hex.info'
    )

    expect(exec).toHaveBeenCalledWith('mix', ['hex.info'])
  })

  test('throws when mix hex.info rejects', async () => {
    const exec = jest.spyOn(execModule, 'exec')

    exec.mockRejectedValue(
      new Error('(Mix) The task "hex.info" could not be found.')
    )

    await expect(parts.getOtpVersion()).rejects.toThrow(
      '(Mix) The task "hex.info" could not be found.'
    )

    expect(exec).toHaveBeenCalledWith('mix', ['hex.info'])
  })

  test('throws when mix hex.info does not have an OTP: line', async () => {
    const exec = jest.spyOn(execModule, 'exec')

    exec.mockResolvedValue({
      exitCode: 0,
      stdout:
        'Hex:    1.0.1\nElixir: 1.14.1\nBuilt with: Elixir 1.13.0 and OTP 22.3',
      stderr: '',
    })

    await expect(parts.getOtpVersion()).rejects.toThrow(
      'unable to determine otp version from hex.info'
    )

    expect(exec).toHaveBeenCalledWith('mix', ['hex.info'])
  })

  test('throws when mix hex.info does not have an otp version on that line', async () => {
    const exec = jest.spyOn(execModule, 'exec')

    exec.mockResolvedValue({
      exitCode: 0,
      stdout:
        'Hex:    1.0.1\nElixir: 1.14.1\nOTP:\n\nBuilt with: Elixir 1.13.0 and OTP 22.3',
      stderr: '',
    })

    await expect(parts.getOtpVersion()).rejects.toThrow(
      'unable to determine otp version from hex.info'
    )

    expect(exec).toHaveBeenCalledWith('mix', ['hex.info'])
  })

  test('returns 22.3.4.26 when that is in mix hex.info', async () => {
    const exec = jest.spyOn(execModule, 'exec')

    exec.mockResolvedValue({
      exitCode: 0,
      stdout:
        'Hex:    1.0.1\nElixir: 1.13.3\nOTP:    22.3.4.26\n\nBuilt with: Elixir 1.13.0 and OTP 22.3',
      stderr: '',
    })

    expect(await parts.getOtpVersion()).toBe('22.3.4.26')
    expect(exec).toHaveBeenCalledWith('mix', ['hex.info'])
  })

  test('returns 25.0 when that is in mix hex.info', async () => {
    const exec = jest.spyOn(execModule, 'exec')

    exec.mockResolvedValue({
      exitCode: 0,
      stdout:
        'Hex:    1.0.1\nElixir: 1.14.1\nOTP:    25.0\n\nBuilt with: Elixir 1.13.0 and OTP 22.3',
      stderr: '',
    })

    expect(await parts.getOtpVersion()).toBe('25.0')
    expect(exec).toHaveBeenCalledWith('mix', ['hex.info'])
  })

  test('returns 25.1.1 when that is in mix hex.info', async () => {
    const exec = jest.spyOn(execModule, 'exec')

    exec.mockResolvedValue({
      exitCode: 0,
      stdout:
        'Hex:    1.0.1\nElixir: 1.14.1\nOTP:    25.1.1\n\nBuilt with: Elixir 1.13.0 and OTP 22.3',
      stderr: '',
    })

    expect(await parts.getOtpVersion()).toBe('25.1.1')
    expect(exec).toHaveBeenCalledWith('mix', ['hex.info'])
  })

  test('returns 25.0-rc3 when that is in mix hex.info', async () => {
    const exec = jest.spyOn(execModule, 'exec')

    exec.mockResolvedValue({
      exitCode: 0,
      stdout:
        'Hex:    1.0.1\nElixir: 1.14.0-rc0\nOTP:    25.0-rc3\n\nBuilt with: Elixir 1.13.0 and OTP 22.3',
      stderr: '',
    })

    expect(await parts.getOtpVersion()).toBe('25.0-rc3')
    expect(exec).toHaveBeenCalledWith('mix', ['hex.info'])
  })
})

describe('getMixLockHash', () => {
  test('calls glob with a working-directory', async () => {
    const hashFiles = jest.spyOn(glob, 'hashFiles')
    const hash = mockHash()
    hashFiles.mockResolvedValue(hash)

    expect(await parts.getMixLockHash('backend')).toBe(hash)
    expect(hashFiles).toHaveBeenCalledWith('backend/mix.lock')
  })

  test('calls glob without a working-directory', async () => {
    const hashFiles = jest.spyOn(glob, 'hashFiles')
    const hash = mockHash()
    hashFiles.mockResolvedValue(hash)

    expect(await parts.getMixLockHash('')).toBe(hash)
    expect(hashFiles).toHaveBeenCalledWith('mix.lock')
  })
})
