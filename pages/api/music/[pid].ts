// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

import Meting from '../../../lib/meting'
import allowCors from '../../../lib/allowCors'
import KVCache from '../../../lib/kvCache'

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<any>
) => {
  res.setHeader(
    'Cache-Control',
    'no-cache, no-store, max-age=0, must-revalidate'
  )
  try {
    const { pid } = req.query
    const CACHE_KEY = `music-${pid}`
    const cached = await KVCache.get(CACHE_KEY)
    if (cached) {
      return res.status(200).json(cached)
    }

    const meting = new Meting()
    const detInfo: any = await meting.format(true).song(pid as any)
    const covInfo: any = await meting.format(true).pic(detInfo[0]['pic_id'])
    const urlInfo = await meting.format(true).url(pid as any)

    const playInfo: any = {
      ...urlInfo,
      id: pid,
      cover: covInfo.url,
      title: detInfo[0]['name'],
      album: detInfo[0]['album'],
      url: urlInfo.url.replace(/https:/, 'http:'),
      artists: detInfo[0]['artist'].join(', ')
    }

    res.status(200).json(playInfo)
    await KVCache.set(CACHE_KEY, playInfo, 60 * 1000)
  } catch (err) {
    console.log(err)
    res.status(500).json({})
  }
}

export default allowCors(handler)
