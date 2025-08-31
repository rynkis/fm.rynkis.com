// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import fp from 'lodash/fp'
import md5 from 'md5'

import Meting from '../../lib/meting'
import allowCors from '../../lib/helper/allowCors'
import KVCache from '../../lib/kvCache'
import { MS_1_HOUR } from '../../lib/consts'

const makePlaylistCache = async (json: string) => {
  const meting = new Meting(process.env.SERVER_NAME)
  const list = JSON.parse(json)
  const promises = list.map((id: string) => meting.format(false).playlist(id))
  const playlists: any = await Promise.all(promises)

  const ids = fp.compose(fp.map('id'), fp.flatten, fp.map('playlist.tracks'))(playlists)

  const description = (fp.get('0.playlist.description')(playlists) || '').split('\n')
  const msgs: string[] = []
  description.forEach((msg: string) => {
    if (msg.startsWith('r')) {
      const [index, hash] = msg.replace(/^r/, '').split(':')
      ids[index] = 'r' + hash
    } else {
      msgs.push(msg)
    }
  })
  const { coverImgUrl: cover, name } = fp.get('0.playlist')(playlists) || {}

  return {
    hash: md5(json),
    name,
    cover,
    ids,
    msgs: msgs.join('\n')
  }
}

const handler = async (req: NextApiRequest, res: NextApiResponse<any>) => {
  res.setHeader('Cache-Control', 'no-cache, no-store, max-age=0, must-revalidate')
  let playlistKey = req.query.list === 'pl' ? 'SERVER_PLAYLIST_PL' : 'SERVER_PLAYLIST'
  let json = process.env[playlistKey] || '["10120837951"]'
  if (req.query.id) {
    json = `["${req.query.id}"]`
    playlistKey = req.query.id as string
  }
  if (req.query.hid) {
    json = process.env.SERVER_PLAYLIST_HISTORY || '[]'
    const data = JSON.parse(json)
    const id = data[req.query.hid as string]
    json = JSON.stringify([id])
    playlistKey = id as string
  }

  const CACHE_KEY = 'PLAYLIST' + playlistKey
  let playlistCache = await KVCache.get(CACHE_KEY)

  if (!playlistCache) {
    playlistCache = await makePlaylistCache(json)
  }

  res.status(200).json(playlistCache)
  await KVCache.set(CACHE_KEY, playlistCache, MS_1_HOUR)
}

export default allowCors(handler)
