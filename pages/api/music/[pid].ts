// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios'

import Meting from '../../../lib/meting'
import allowCors from '../../../lib/helper/allowCors'
import KVCache from '../../../lib/kvCache'
import { MS_5_MINS, MS_24_HOURS } from '../../../lib/consts'
import makeLrc from '../../../lib/helper/makeLrc'

const makeDatCache = async (pid: string) => {
  if (pid.startsWith('r')) {
    const url = `${process.env.SERVER_PRIVATE}/${pid.replace(/^r/, '')}.json`
    const { data: { lrc: lyric, tlrc: tlyric, ...data } } = await axios.get(url) as any
    const lrcInfo = { lyric, tlyric }
    return {
      id: pid,
      ...data,
      lyrics: makeLrc(lrcInfo)
    }
  }

  const meting = new Meting(process.env.SERVER_NAME)
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
  if (pid.startsWith('r')) {
    const filename = pid.replace(/^r/, '')
    return {
      url: `${process.env.SERVER_PRIVATE}/sources/${filename}.mp3`,
      cover: `${process.env.SERVER_PRIVATE}/covers/${filename}.jpg`,
    }
  }

  const meting = new Meting(process.env.SERVER_NAME)
  const covInfo: any = await meting.format(true).pic(picId)
  const urlInfo = await meting.format(true).url(pid)
  const url = urlInfo.url
    ? urlInfo.url.replace(/https:/, 'http:')
    : `${process.env.SERVER_PRIVATE}/sources/${pid}.mp3`
  const urlCache = {
    ...urlInfo,
    url,
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
