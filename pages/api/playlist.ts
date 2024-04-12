// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import fp from 'lodash/fp'

import Meting from '../../lib/meting'
import allowCors from '../../lib/allowCors'
import KVCache from '../../lib/kvCache'

const makePlaylistCache = async () => {
  const meting = new Meting()
  const promises = ['7320208569'].map(id => meting.format(true).playlist(id))
  const playlist = await Promise.all(promises)
  const ids = fp.compose(fp.map('id'), fp.flatten)(playlist)

  return ids
}

const handler = async (req: NextApiRequest, res: NextApiResponse<any>) => {
  res.setHeader(
    'Cache-Control',
    'no-cache, no-store, max-age=0, must-revalidate'
  )

  const CACHE_KEY = 'PLAYLIST'
  let playlistCache = await KVCache.get(CACHE_KEY)

  if (playlistCache) {
    // do nothing
  } else {
    playlistCache = await makePlaylistCache()
  }

  res.status(200).json(playlistCache)
  await KVCache.set(CACHE_KEY, playlistCache, 60 * 60 * 1000)
}

export default allowCors(handler)
