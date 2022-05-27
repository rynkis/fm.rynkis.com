// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import fp from 'lodash/fp'

import Meting from '../../../lib/meting'
import allowCors from '../../../lib/allowCORS'

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<any>
) => {
  const { pid } = req.query
  const meting = new Meting()

  const detInfo: any = await meting.format(true).song(pid as any)
  const covInfo: any = await meting.format(true).pic(detInfo[0]['pic_id'])
  const lrcInfo: any = await meting.format(true).lyric(pid as any)

  const urlInfo = await meting.format(true).url(pid as any)
  const playInfo: any = {
    ...urlInfo,
    id: pid,
    lrc: {},
    tlrc: {},
    cover: covInfo.url,
    title: detInfo[0]['name'],
    url: urlInfo.url.replace(/https:/, 'http:'),
    artists: detInfo[0]['artist'].join(', ')
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
          playInfo[value[0]][0] = value[1]
          break
        } else {
          const colText = rows.replace(/\[[^\[\]]*\]/g, '')
          times.every((key: string) => {
            const arr = key.split(':')
            const time = parseInt(arr[0]) * 60 + parseInt(arr[1])
            playInfo[value[0]][time] = colText
          })
        }
      }
    } else {
      playInfo[value[0]][0] = value[1]
    }
  })

  res.status(200).json(playInfo)
}

export default allowCors(handler)
