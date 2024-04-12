import fs from 'fs'
import { resolve } from 'path'

class LocalCache {
  private cachePath: string
  private cache: any = {}
  constructor() {
    this.cachePath = resolve(process.cwd(), 'temp/cache')
    this.load()
  }
  private load() {
    if (fs.existsSync(this.cachePath)) {
      const json = fs.readFileSync(this.cachePath, 'utf-8')
      try {
        this.cache = JSON.parse(json)
      } catch (err) {
        console.error(err)
      }
    }
  }
  private save() {
    const json = JSON.stringify(this.cache)
    fs.writeFileSync(this.cachePath, json, { encoding: 'utf-8' })
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

const localCache = new LocalCache()

export default localCache
