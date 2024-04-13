// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

import Meting from '../../../lib/meting'
import allowCors from '../../../lib/allowCors'
import KVCache from '../../../lib/kvCache'
import { MS_5_MINS, MS_24_HOURS } from '../../../lib/consts'

const makeDatCache = async (pid: string) => {
  const meting = new Meting()
  const datInfo: any = await meting.format(true).song(pid as string)
  const datCache: any = {
    id: pid,
    title: datInfo[0]['name'],
    album: datInfo[0]['album'],
    artists: datInfo[0]['artist'].join(', '),
    picId: datInfo[0]['pic_id']
  }
  return datCache
}

const makeUrlCache = async (picId: string, pid: string) => {
  const meting = new Meting()
  const covInfo: any = await meting.format(true).pic(picId)
  const urlInfo = await meting.format(true).url(pid)
  const urlCache = {
    ...urlInfo,
    url: urlInfo.url.replace(/https:/, 'http:'),
    cover: covInfo.url
  }
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
    let urlCache: any = await KVCache.get(URL_CACHE_KEY)
    let datCache: any = await KVCache.get(DAT_CACHE_KEY)

    if (!datCache) {
      datCache = await makeDatCache(pid as string)
    }
    if (!urlCache) {
      urlCache = await makeUrlCache(datCache.picId, pid as string)
    }

    const data = { ...urlCache, ...datCache }
    res.status(200).json(data)

    await KVCache.set(URL_CACHE_KEY, urlCache, MS_5_MINS)
    await KVCache.set(DAT_CACHE_KEY, datCache, MS_24_HOURS)
  } catch (err) {
    console.log(err)
    res.status(500).json({})
  }
}

export default allowCors(handler)
