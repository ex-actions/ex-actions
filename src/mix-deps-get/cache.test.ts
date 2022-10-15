import * as cache from './cache'
import { mockHash } from 'test-helpers'

describe('restoreKeys', () => {
  test('returns key without lock hash', async () => {
    const key = [
      'cache-deps',
      'linux',
      'x64',
      '1.14.1',
      '25.0.1',
      'deps',
      mockHash(),
    ].join('--')

    const restoreKeys = cache.restoreKeys(key)
    expect(restoreKeys.length).toBe(1)

    const restorable = restoreKeys[0]
    expect(restorable).toBe('cache-deps--linux--x64--1.14.1--25.0.1--deps--')
  })
})
