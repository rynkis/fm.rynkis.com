import { useEffect, useState } from 'react'
import type { NextPage } from 'next'
import Head from 'next/head'
import 'font-awesome/css/font-awesome.css'

import Player from '../lib/player'

const Home: NextPage = () => {
  const [showAfterRender, setShowAfterRender] = useState(false)
  
  useEffect(() => {
    if (showAfterRender && !(window as any).player) {
      (window as any).player = new Player()
    }
    setShowAfterRender(true)
  }, [showAfterRender])

  if (!showAfterRender) return null
  return (
    <div>
      <Head>
        <title>{"Rynkis' FM"}</title>
        <meta name="description" content="Rynkis' FM" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <article>
        <div id="backdrop">
          <div className='color' />
        </div>
        <div id="showcase">
          <div id="surface">
            <div className="cover">
              <canvas className="album" width="100" height="100" />
            </div>
            <div className="magic"><i className="fa fa-play" /></div>
          </div>
          <div id="thread">
            <div className="buffered" />
            <div className="elapsed" />
          </div>
          <div id="detail">
            <div className="title" />
            <div className="artists" />
          </div>
          <div id="lyric">
            <div className="lrc" />
            <div className="tlrc" />
          </div>
        </div>
        <div id="controller">
          <div className="item" data-id="fa-home">
            <a className="fa-button">
              <i className="fa fa-home" title="Home" />
            </a>
          </div>
          <div className="item" data-id="fa-back">
            <a className="fa-button">
              <i className="fa fa-chevron-up" title="Prev" />
            </a>
          </div>
          <div className="item" data-id="fa-over">
            <a className="fa-button">
              <i className="fa fa-chevron-down" title="Next" />
            </a>
          </div>
          <div className="item" data-id="fa-mode">
            <a className="fa-button">
              <i className="fa fa-random" title="Random" />
            </a>
          </div>
        </div>
      </article>
    </div>
  )
}

export default Home
