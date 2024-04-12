import { kv } from '@vercel/kv'

class KVCache {
  static async set (key: string, item: any, ms: number = 0) {
    await kv.set(key, item, { px: ms })
  }
  static async get (key: string) {
    const cached = await kv.get(key)
    return cached
  }
}

export default KVCache
