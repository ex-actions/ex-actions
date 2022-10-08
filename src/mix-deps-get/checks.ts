import * as utils from '../utils'

export const checks = async (cwd: string): Promise<void> => {
  await utils.elixirInstalled()
  await utils.mixInstalled()
  await utils.hexInstalled()
  await utils.inMixProject(cwd)
  await utils.hasMixLock(cwd)
}
