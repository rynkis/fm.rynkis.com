import { useState } from 'react'
import { Drawer } from 'vaul'

const DrawerListHistory = (props: any) => {
  const { children } = props
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [visible, setVisible] = useState(false)
  const [playingList, setPlayingList] = useState('')
  const [listHistory, setListHistory] = useState([])

  const handleDrawerOpenChange = async (open: boolean) => {
    setOpen(open)
    const appContainer = document.querySelector('.app-container')
    if (open) {
      if (appContainer) appContainer.classList.add('app-container-drawer-open')
    } else {
      if (appContainer) appContainer.classList.remove('app-container-drawer-open')
    }
  }

  const handleAnimationEnd = (open: boolean) => {
    const hash = (window as any).player.listHash
    setPlayingList(hash)
    if (!listHistory.length) {
      try {
        setLoading(true)
        const data = (window as any).player.getHistory()
        if (data) setListHistory(data)
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    setVisible(open)
  }

  const handleLiked = (e: Event, hash: string) => {
    e.stopPropagation()
    ;(window as any).player.toggleListLiked(hash)
    const data = (window as any).player.getHistory()
    if (data) setListHistory(data)
  }

  const handleClick = (hash: string) => () => {
    ;(window as any).player.play(hash)
    setOpen(false)
    const appContainer = document.querySelector('.app-container')
    if (appContainer) appContainer.classList.remove('app-container-drawer-open')
  }

  const handleDelete = (e: Event, hash: string) => {
    e.stopPropagation()
    ;(window as any).player.historyRemove(hash)
    const data = (window as any).player.getHistory()
    if (data) setListHistory(data)
  }

  return (
    <Drawer.Root
      open={open}
      onOpenChange={handleDrawerOpenChange}
      onAnimationEnd={handleAnimationEnd}
    >
      <Drawer.Trigger className='drawer-trigger'>{children}</Drawer.Trigger>
      <Drawer.Portal>
        <Drawer.Overlay className='drawer-overlay' />
        <Drawer.Content className='drawer-content'>
          <div className='header-dash' />
          <Drawer.Title className='drawer-title'>历史歌单</Drawer.Title>
          <div className='drawer-body'>
            <div className='drawer-text'>
              <p style={{ marginBottom: '1rem' }}>这里可以回顾并播放最近 50 条历史歌单，点击封面可锁定。</p>
            </div>
            {listHistory.length && visible ? (
              listHistory
                .map((val: any, idx) => (
                  <div
                    key={idx}
                    className={`item ${val.hash === playingList && 'item-playing'} ${!!val.liked && 'item-liked'}`}
                  >
                    <div
                      className='cover'
                      style={{ backgroundImage: `url(${val.cover})` }}
                      onClick={(e: any) => handleLiked(e, val.hash)}
                    >
                      <div className='mask'>
                        <i className='fa fa-heart' />
                      </div>
                    </div>
                    <span className='name' onClick={handleClick(val.hash)}>{val.name}</span>
                    <i
                      className='fa fa-x'
                      onClick={(e: any) => handleDelete(e, val.hash)}
                    />
                    <i className='fa fa-music-notes' />
                    <i className='fa fa-heart liked' />
                  </div>
                ))
                .reverse()
            ) : loading ? (
              <div className='loading'>Loading...</div>
            ) : (
              <div className='no-data'>暂无内容</div>
            )}
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  )
}

export default DrawerListHistory
