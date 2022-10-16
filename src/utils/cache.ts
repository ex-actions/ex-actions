import * as core from '@actions/core'
import * as rawCache from '@actions/cache'

export const restoreCache = async (
  paths: string[],
  key: string,
  restoreKeys: string[]
): Promise<boolean> => {
  core.startGroup(`restore-cache: ${key}`)
  core.debug(key)

  if (!rawCache.isFeatureAvailable()) {
    core.warning('@actions/cache feature not available')
    core.endGroup()
    return false
  }

  const restoredKey = await rawCache.restoreCache(paths, key, restoreKeys)
  core.endGroup()
  return Boolean(restoredKey)
}

export const saveCache = async (
  paths: string[],
  key: string
): Promise<void> => {
  core.startGroup(`saving-cache: ${key}`)
  core.debug(key)

  if (!rawCache.isFeatureAvailable()) {
    core.warning('@actions/cache feature not available')
    core.endGroup()
    return
  }

  await rawCache.saveCache(paths, key)
  core.endGroup()
  return
}
