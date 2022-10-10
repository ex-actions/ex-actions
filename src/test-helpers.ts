import * as crypto from 'node:crypto'

export const mockHash = (): string => {
  const hash = crypto.createHash('sha256')
  hash.update(`${Math.random()}`)
  return hash.digest('hex')
}
