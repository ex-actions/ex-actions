import * as cache from './cache'
import { mockHash } from 'test-helpers'

describe('restoreKeys', () => {
  test('returns restorable keys', async () => {
    const mixLockHash = mockHash()
    const configHash = mockHash()
    const srcHash = mockHash()
    const key = [
      'cache-compiled-app',
      'linux',
      'x64',
      '1.14.1',
      '25.0.1',
      '_build',
      mixLockHash,
      configHash,
      'key',
      srcHash,
    ].join('--')

    const restoreKeys = cache.restoreKeys(key)
    expect(restoreKeys.length).toBe(4)

    expect(restoreKeys[0]).toBe(
      'cache-compiled-app--linux--x64--1.14.1--25.0.1--_build--'
    )
    expect(restoreKeys[1]).toBe(
      `cache-compiled-app--linux--x64--1.14.1--25.0.1--_build--${mixLockHash}--`
    )
    expect(restoreKeys[2]).toBe(
      `cache-compiled-app--linux--x64--1.14.1--25.0.1--_build--${mixLockHash}--${configHash}--`
    )
    expect(restoreKeys[3]).toBe(
      `cache-compiled-app--linux--x64--1.14.1--25.0.1--_build--${mixLockHash}--${configHash}--key--`
    )
  })
})
