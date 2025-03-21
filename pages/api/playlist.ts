// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import fp from 'lodash/fp'
import md5 from 'md5'

import Meting from '../../lib/meting'
import allowCors from '../../lib/allowCors'
import KVCache from '../../lib/kvCache'
import { MS_1_HOUR } from '../../lib/consts'

const makePlaylistCache = async (json: string) => {
  const meting = new Meting(process.env.SERVER_NAME)
  const list = JSON.parse(json)
  const promises = list.map((id: string) => meting.format(false).playlist(id))
  const playlists = await Promise.all(promises)
  const msgs = fp.get('0.playlist.description')(playlists)

  const ids = fp.compose(
    fp.map('id'),
    fp.flatten,
    fp.map('playlist.tracks')
  )(playlists)

  return {
    hash: md5(json),
    ids,
    msgs
  }
}

const handler = async (req: NextApiRequest, res: NextApiResponse<any>) => {
  res.setHeader(
    'Cache-Control',
    'no-cache, no-store, max-age=0, must-revalidate'
  )
  const playlistKey = req.query.list === 'pl' ? 'SERVER_PLAYLIST_PL' : 'SERVER_PLAYLIST'
  const json = process.env[playlistKey] || '["10120837951"]'

  const CACHE_KEY = 'PLAYLIST' + playlistKey
  let playlistCache = await KVCache.get(CACHE_KEY)

  if (!playlistCache) {
    playlistCache = await makePlaylistCache(json)
  }

  res.status(200).json(playlistCache)
  await KVCache.set(CACHE_KEY, playlistCache, MS_1_HOUR)
}

export default allowCors(handler)
