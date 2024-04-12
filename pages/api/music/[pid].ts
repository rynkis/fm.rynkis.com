// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

import Meting from '../../../lib/meting'
import allowCors from '../../../lib/allowCors'
import KVCache from '../../../lib/kvCache'
import { _1_MINS, _5_MINS } from '../../../lib/consts'

const makeUrlCache = async (cacheKey: string, picId: string, pid: string) => {
  const meting = new Meting()
  const covInfo: any = await meting.format(true).pic(picId)
  const urlInfo = await meting.format(true).url(pid)
  const urlCache = {
    ...urlInfo,
    url: urlInfo.url.replace(/https:/, 'http:'),
    cover: covInfo.url
  }
  await KVCache.set(cacheKey, urlCache, _5_MINS)
  return urlCache
}

const handler = async (req: NextApiRequest, res: NextApiResponse<any>) => {
  res.setHeader(
    'Cache-Control',
    'no-cache, no-store, max-age=0, must-revalidate'
  )
  try {
    const { pid } = req.query
    const URL_CACHE_KEY = `music-url-${pid}`
    const DAT_CACHE_KEY = `music-info-${pid}`
    const cachedUrl = await KVCache.get(URL_CACHE_KEY)
    const cachedDat: any = await KVCache.get(DAT_CACHE_KEY)
    const meting = new Meting()

    if (cachedUrl) {
      const data = { ...cachedUrl, ...cachedDat }
      return res.status(200).json(data)
    } else if (cachedDat) {
      const urlCache = await makeUrlCache(URL_CACHE_KEY, cachedDat.picId, pid)
      const data = { ...urlCache, ...cachedDat }
      return res.status(200).json(data)
    }

    const detInfo: any = await meting.format(true).song(pid as any)
    const urlCache = await makeUrlCache(URL_CACHE_KEY, detInfo[0]['pic_id'], pid)

    const playInfo: any = {
      id: pid,
      title: detInfo[0]['name'],
      album: detInfo[0]['album'],
      artists: detInfo[0]['artist'].join(', ')
    }

    const data = { ...urlCache, ...playInfo }
    res.status(200).json(data)
    await KVCache.set(DAT_CACHE_KEY, playInfo, _1_MINS)
  } catch (err) {
    console.log(err)
    res.status(500).json({})
  }
}

export default allowCors(handler)
