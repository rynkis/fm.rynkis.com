import { useEffect, useState } from 'react'
import type { NextPage } from 'next'
import Head from 'next/head'
import 'font-awesome/css/font-awesome.css'

import Player from './player'

const Home: NextPage = () => {
  const [showAfterRender, setShowAfterRender] = useState(false)
  
  useEffect(() => {
    if (showAfterRender) {
      new Player()
    }
    setShowAfterRender(true)
  }, [showAfterRender])

  return (
    <div>
      <Head>
        <title>{"Rynkis' FM"}</title>
        <meta name="description" content="Rynkis' FM" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <article>
        <div id="backdrop"></div>
        <div id="showcase">
          <div id="surface">
            <div className="cover"><canvas className="album" width="100" height="100"></canvas></div>
            <div className="magic"><i className="fa fa-play"></i></div>
          </div>
          <div id="thread">
            <div className="buffered"></div>
            <div className="elapsed"></div>
          </div>
          <div id="detail">
            <div className="title"></div>
            <div className="artists"></div>
          </div>
          <div id="lyric">
            <div className="lrc"></div>
            <div className="tlrc"></div>
          </div>
        </div>
        <div id="controller">
          <div className="item" data-id="fa-home"><a className="fa-button"><i className="fa fa-home" title="Home"></i></a></div>
          <div className="item" data-id="fa-back"><a className="fa-button"><i className="fa fa-chevron-up" title="Prev"></i></a></div>
          <div className="item" data-id="fa-over"><a className="fa-button"><i className="fa fa-chevron-down" title="Next"></i></a></div>
          <div className="item" data-id="fa-mode"><a className="fa-button"><i className="fa fa-random" title="Random"></i></a></div>
        </div>
      </article>
    </div>
  )
}

export default Home
