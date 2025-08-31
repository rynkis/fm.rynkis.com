import { useState } from 'react'
import { Drawer } from 'vaul'
import axios from 'axios'

const DrawerListHistory = (props: any) => {
  const { children } = props
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [visible, setVisible] = useState(false)
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

  const handleAnimationEnd = async (open: boolean) => {
    if (!listHistory.length) {
      try {
        setLoading(true)
        const { data } = await axios.get('/api/playlist-history')
        if (data) setListHistory(data)
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    setVisible(open)
  }

  const handleClick = (hid: string) => () => {
    ;(window as any).player.load({ hid })
    setOpen(false)
    const appContainer = document.querySelector('.app-container')
    if (appContainer) appContainer.classList.remove('app-container-drawer-open')
  }

  return (
    <Drawer.Root
      open={open}
      onOpenChange={handleDrawerOpenChange}
      onAnimationEnd={handleAnimationEnd}
    >
      <Drawer.Trigger className='drawer-trigger'>
        {children}
      </Drawer.Trigger>
      <Drawer.Portal>
        <Drawer.Overlay className='drawer-overlay' />
        <Drawer.Content className='drawer-content'>
          <div className='header-dash' />
          <Drawer.Title className='drawer-title'>历史歌单</Drawer.Title>
          <div className='drawer-body'>
            {listHistory.length && visible ? (
              listHistory.reverse().map((val: any, idx) => (
                <div
                  key={idx}
                  className='item'
                  onClick={handleClick(val.id)}
                >
                  <div
                    className='cover'
                    style={{ backgroundImage: `url(${val.cover})` }}
                  />
                  <span className='name'>{val.name}</span>
                </div>
              ))
            ) : (
              loading ? (
                <div className='loading'>Loading...</div>
              ) : (
                <div className='no-data'>暂无内容</div>
              )
            )}
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  )
}

export default DrawerListHistory
