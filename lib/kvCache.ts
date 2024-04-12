import { kv } from '@vercel/kv'

class KVCache {
  private readonly KV_KEY = 'FM-CACHE'
  private cache: any = {}
  constructor() {
    this.load()
  }
  private async load() {
    try {
      const json = await kv.get(this.KV_KEY)
      this.cache = JSON.parse(json as string)
    } catch (err) {
      console.error(err)
    }
  }
  private async save() {
    const json = JSON.stringify(this.cache)
    await kv.set(this.KV_KEY, json)
  }
  set (key: string, item: any, ms: number = 0) {
    this.cache[key] = { item, ms, time: new Date().valueOf() }
    this.save()
  }
  get (key: string) {
    const cache = this.cache[key]
    if (!cache) return null
    const { item, ms, time } = cache
    if (ms === 0) return item
    const now = new Date().valueOf()
    if (now > time + ms) return null
    return item
  }
  del(key: string) {
    Reflect.deleteProperty(this.cache, key)
    this.save()
  }
  clear() {
    this.cache = {}
    this.save()
  }
}

const kvCache = new KVCache()

export default kvCache
