// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

import Meting from '../../../lib/meting'
import allowCors from '../../../lib/allowCors'
import KVCache from '../../../lib/kvCache'
import { _5_MINS, _24_HOURS } from '../../../lib/consts'

const makeDatCache = async (cacheKey: string, pid: string) => {
  const meting = new Meting()
  const datInfo: any = await meting.format(true).song(pid as string)
  const datCache: any = {
    id: pid,
    title: datInfo[0]['name'],
    album: datInfo[0]['album'],
    artists: datInfo[0]['artist'].join(', '),
    picId: datInfo[0]['pic_id']
  }
  await KVCache.set(cacheKey, datCache, _24_HOURS)
  return datCache
}

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
    const cachedUrl: any = await KVCache.get(URL_CACHE_KEY)
    const cachedDat: any = await KVCache.get(DAT_CACHE_KEY)

    if (cachedUrl) {
      const data = { ...cachedUrl, ...cachedDat }
      return res.status(200).json(data)
    } else if (cachedDat) {
      const urlCache = await makeUrlCache(URL_CACHE_KEY, cachedDat.picId, pid as string)
      const data = { ...urlCache, ...cachedDat }
      return res.status(200).json(data)
    }

    const datCache = await makeDatCache(DAT_CACHE_KEY, pid as string)
    const urlCache = await makeUrlCache(URL_CACHE_KEY, datCache.picId, pid as string)

    const data = { ...urlCache, ...datCache }
    res.status(200).json(data)
  } catch (err) {
    console.log(err)
    res.status(500).json({})
  }
}

export default allowCors(handler)
