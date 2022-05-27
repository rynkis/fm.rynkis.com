// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import fp from 'lodash/fp'

import Meting from '../../lib/meting'
import allowCors from '../../lib/allowCORS'

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<any>
) => {
  const meting = new Meting()
  const promises = ['7320208569'].map(id => meting.format(true).playlist(id))
  const playlist = await Promise.all(promises)
  const ids = fp.compose(
    fp.map('id'),
    fp.flatten
  )(playlist)
  res.status(200).json(ids)
}

export default allowCors(handler)
