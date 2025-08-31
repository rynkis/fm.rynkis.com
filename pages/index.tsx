import { useEffect, useState } from 'react'
import type { NextPage } from 'next'
import Head from 'next/head'
import { Toaster } from 'sonner'

import Player from '../lib/player'
import GA from '../components/GA'
import DrawerListHistory from '../components/drawer-list-history'
import DrawerListYours from '../components/drawer-list-yours'

const Home: NextPage = () => {
  const [showAfterRender, setShowAfterRender] = useState(false)

  useEffect(() => {
    if (showAfterRender && !(window as any).player) {
      ;(window as any).player = new Player()
    }
    setShowAfterRender(true)
  }, [showAfterRender])

  if (!showAfterRender) return null
  return (
    <>
      <Head>
        <title>{"Rynkis' FM"}</title>
        <meta
          name='description'
          content="Rynkis' FM"
        />
        <meta
          name='mobile-web-app-capable'
          content='yes'
        />
        <meta
          name='apple-mobile-web-app-capable'
          content='yes'
        />
        <meta
          name='apple-mobile-web-app-status-bar-style'
          content='black-translucent'
        />
        <meta
          name='viewport'
          content='width=device-width, initial-scale=1, viewport-fit=cover, user-scalable=no'
        />
        <link
          rel='icon'
          href='/favicon.ico'
        />
        <link
          rel='manifest'
          href='/manifest.json'
        />
      </Head>
      <GA
        gid='UA-33540710-3'
        aid='music-fm'
      />
      <div className='app-container'>
        <div id='backdrop'>
          <div className='mask' />
        </div>
        <div id='main-container'>
          <div id='player-container'>
            <div id='surface'>
              <div className='cover'>
                <canvas
                  className='album'
                  width='100'
                  height='100'
                />
              </div>
              <div className='magic'>
                <i className='fa fa-play' />
              </div>
            </div>
            <div id='lyric'>
              <div className='lrc' />
              <div className='tlrc' />
            </div>
            <canvas id='waveform' />
            <div id='player-panel'>
              <div id='detail'>
                <div className='title' />
                <div className='artists' />
              </div>
              <div id='thread'>
                <div className='progress'>
                  <div className='buffered' />
                  <div className='elapsed' />
                </div>
              </div>
              <div
                id='controller'
                data-id='fa-over'
              >
                <div className='player-controller'>
                  <div
                    className='item'
                    data-id='fa-back'
                  >
                    <a className='fa-button'>
                      <i
                        className='fa fa-skip-back'
                        title='Prev'
                      />
                    </a>
                  </div>
                  <div
                    className='item'
                    data-id='fa-play'
                  >
                    <a className='fa-button fa-button-prime'>
                      <i
                        className='fa fa-play'
                        title='play'
                      />
                    </a>
                  </div>
                  <div
                    className='item'
                    data-id='fa-over'
                  >
                    <a className='fa-button'>
                      <i
                        className='fa fa-skip-forward'
                        title='Next'
                      />
                    </a>
                  </div>
                </div>
                <div className='sharing-tools'>
                  <div
                    className='item'
                    data-id='fa-github'
                  >
                    <a className='fa-button'>
                      <i
                        className='fa fa-github'
                        title='Home'
                      />
                    </a>
                  </div>
                  <DrawerListHistory>
                    <div
                      className='item'
                      data-id='fa-list'
                    >
                      <a className='fa-button'>
                        <i
                          className='fa fa-list'
                          title='List'
                        />
                      </a>
                    </div>
                  </DrawerListHistory>
                  <DrawerListYours>
                    <div
                      className='item'
                      data-id='fa-music-plus'
                    >
                      <a className='fa-button'>
                        <i
                          className='fa fa-music-plus'
                          title='My list'
                        />
                      </a>
                    </div>
                  </DrawerListYours>
                  <div
                    className='item'
                    data-id='fa-mode'
                  >
                    <a className='fa-button'>
                      <i
                        className='fa fa-repeat'
                        title='List loop'
                      />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <canvas id='frequency' />
        </div>
      </div>
      <div className='fullscreen-mask'>
        <span></span>
      </div>
      <div className='fullscreen-mask-mobile'>
        <span>
          点触开始
          <br />
          touch to start
        </span>
      </div>
      <Toaster position='top-center' />
    </>
  )
}

export default Home
