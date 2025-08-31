// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import fp from 'lodash/fp'

import Meting from '../../lib/meting'
import allowCors from '../../lib/helper/allowCors'
import KVCache from '../../lib/kvCache'
import { MS_1_HOUR } from '../../lib/consts'

const makePlaylistCache = async (json: string) => {
  const meting = new Meting(process.env.SERVER_NAME)
  const list = JSON.parse(json)
  const promises = list.map((id: string) => meting.format(false).playlist(id))
  const playlists: any = await Promise.all(promises)

  return playlists.map((list: any, idx: number) => {
    const { coverImgUrl: cover, name } = list.playlist || {}
    return {
      id: idx,
      name,
      cover
    }
  })
}

const handler = async (req: NextApiRequest, res: NextApiResponse<any>) => {
  res.setHeader(
    'Cache-Control',
    'no-cache, no-store, max-age=0, must-revalidate'
  )
  const playlistKey = 'SERVER_PLAYLIST_HISTORY'
  let json = process.env[playlistKey] || '[]'

  const CACHE_KEY = 'PLAYLIST' + playlistKey
  let playlistCache = await KVCache.get(CACHE_KEY)

  if (!playlistCache) {
    playlistCache = await makePlaylistCache(json)
  }

  res.status(200).json(playlistCache)
  await KVCache.set(CACHE_KEY, playlistCache, MS_1_HOUR)
}

export default allowCors(handler)
