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
    const CACHE_KEY = `lyrics-${pid}`
    const cached = await KVCache.get(CACHE_KEY)
    if (cached) {
      return res.status(200).json(cached)
    }

    const meting = new Meting()
    const lrcInfo: any = await meting.format(true).lyric(pid as any)

    const result: any = {
      lrc: {},
      tlrc: {}
    }

    const ly: any = {
      lyric: ['lrc', 'No Lyrics'],
      tlyric: ['tlrc', '']
    }
    Object.keys(ly).forEach(keyName => {
      const value = ly[keyName]
      if (lrcInfo[keyName] !== '') {
        const lrc = lrcInfo[keyName].split('\n')
        for (const rows of lrc) {
          const match = rows.match(/\[[^\[\]]*\]/g) || []
          const times = match.map((val: string) => val.substring(1, val.length - 1))
          if (times.length === 0) {
            result[value[0]][0] = value[1]
            break
          } else {
            const colText = rows.replace(/\[[^\[\]]*\]/g, '')
            times.every((key: string) => {
              const arr = key.split(':')
              const time = parseInt(arr[0]) * 60 + parseInt(arr[1])
              result[value[0]][time] = colText
            })
          }
        }
      } else {
        result[value[0]][0] = value[1]
      }
    })

    res.status(200).json(result)
    await KVCache.set(CACHE_KEY, result, 24 * 60 * 60 * 1000)
  } catch (err) {
    console.log(err)
    res.status(500).json({})
  }
}

export default allowCors(handler)
