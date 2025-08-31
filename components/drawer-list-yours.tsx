import { useState } from 'react'
import { Drawer } from 'vaul'
import { toast } from 'sonner'

const DrawerListYours = (props: any) => {
  const { children } = props
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState('')

  const handleDrawerOpenChange = async (open: boolean) => {
    setOpen(open)
    const appContainer = document.querySelector('.app-container')
    if (open) {
      if (appContainer) appContainer.classList.add('app-container-drawer-open')
    } else {
      if (appContainer) appContainer.classList.remove('app-container-drawer-open')
    }
  }

  const handleChange = (e: any) => {
    setValue(e.target.value)
  }

  const handleClick = () => {
    if (!value) {
      toast.error('未发现剪贴板内容')
      return
    }
    try {
      const url = new URL(value)
      const params = url.searchParams
      const id = params.get('id')
      ;(window as any).player.load({ id })
    } catch (e) {
      console.error(e)
      toast.error('读取歌单失败')
    } finally {
      setValue('')
    }
    setOpen(false)
    const appContainer = document.querySelector('.app-container')
    if (appContainer) appContainer.classList.remove('app-container-drawer-open')
  }

  return (
    <Drawer.Root
      open={open}
      onOpenChange={handleDrawerOpenChange}
    >
      <Drawer.Trigger className='drawer-trigger'>{children}</Drawer.Trigger>
      <Drawer.Portal>
        <Drawer.Overlay className='drawer-overlay' />
        <Drawer.Content className='drawer-content'>
          <div className='header-dash' />
          <Drawer.Title className='drawer-title'>自由歌单</Drawer.Title>
          <div className='drawer-body'>
            <div className='drawer-text'>
              <p>想听听自己的歌单？</p>
              <p>前往网易云音乐复制歌单链接，粘贴至下方输入框内后点击“播放歌单”按钮即可。</p>
            </div>
            <textarea value={value} onChange={handleChange} />
            <div
              className='load-list-link'
              onClick={handleClick}
            >
              播放歌单
            </div>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  )
}

export default DrawerListYours
