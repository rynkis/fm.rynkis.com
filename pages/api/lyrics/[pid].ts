// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

import Meting from '../../../lib/meting'
import allowCors from '../../../lib/allowCors'
import KVCache from '../../../lib/kvCache'
import { MS_24_HOURS } from '../../../lib/consts'
import makeLrc from '../../../lib/helper/makeLrc'

const makeLyricsCache = async (pid: string) => {
  const meting = new Meting(process.env.SERVER_NAME)
  const lrcInfo: any = await meting.format(true).lyric(pid)
  return makeLrc(lrcInfo)
}

const handler = async (req: NextApiRequest, res: NextApiResponse<any>) => {
  res.setHeader(
    'Cache-Control',
    'no-cache, no-store, max-age=0, must-revalidate'
  )
  try {
    const { pid } = req.query
    const CACHE_KEY = `lyrics-${pid}`
    let lyricsCache = await KVCache.get(CACHE_KEY)

    if (!lyricsCache) {
      lyricsCache = await makeLyricsCache(pid as string)
    }

    res.status(200).json(lyricsCache)
    await KVCache.set(CACHE_KEY, lyricsCache, MS_24_HOURS)
  } catch (err) {
    console.log(err)
    res.status(500).json({})
  }
}

export default allowCors(handler)
