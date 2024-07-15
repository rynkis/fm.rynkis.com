import { kv } from '@vercel/kv'

class KVCache {
  static noCache: Boolean = process.env.NO_CACHE === 'true'
  static async set (key: string, item: any, ms: number = 0) {
    if (this.noCache) return null
    await kv.set(key, item, { px: ms })
  }
  static async get (key: string) {
    if (this.noCache) return null
    const cached = await kv.get(key)
    return cached
  }
}

export default KVCache
