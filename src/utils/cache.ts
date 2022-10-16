import * as core from '@actions/core'
import * as rawCache from '@actions/cache'

export const restoreCache = async (
  paths: string[],
  key: string,
  restoreKeys: string[]
): Promise<boolean> => {
  core.info(`@actions/cache/restore ${key}`)
  core.debug(key)

  if (!rawCache.isFeatureAvailable()) {
    core.warning('@actions/cache feature not available')
    return false
  }

  const restoredKey = await rawCache.restoreCache(paths, key, restoreKeys)
  return Boolean(restoredKey)
}

export const saveCache = async (
  paths: string[],
  key: string
): Promise<void> => {
  core.info(`@actions/cache/save ${key}`)
  core.debug(key)

  if (!rawCache.isFeatureAvailable()) {
    core.warning('@actions/cache feature not available')
    return
  }

  await rawCache.saveCache(paths, key)
  return
}
