import { useState } from 'react'
import { Drawer } from 'vaul'
import { toast } from 'sonner'
import mobile from 'is-mobile'

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

  const handleNumberInput = (val: number) => {
    setValue(value + val)
  }

  const handleNumberDel = () => {
    setValue(value.substring(0, value.length - 1))
  }

  const handleClick = () => {
    if (!value) {
      toast.error('读取歌单失败')
      return
    }
    try {
      if (mobile()) {
        ;(window as any).player.load(value)
      } else {
        const url = new URL(value)
        const params = url.searchParams
        const id = params.get('id')
        ;(window as any).player.load(id)
      }
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
          <div className={`drawer-body ${mobile() && 'mobile'}`}>
            <div className='drawer-text'>
              <p>想听听自己或其他人的歌单？</p>
              <p className='pc-tips'>前往网易云音乐复制歌单链接，粘贴至下方输入框内后点击“播放歌单”按钮即可。</p>
              <p className='mobile-tips'>前往网易云音乐复制歌单链接，找出列表 ID 输入后点击“播放歌单”按钮即可。</p>
            </div>
            <textarea
              disabled={mobile()}
              value={value}
              onChange={handleChange}
            />
            <div className='button-group'>
              {mobile() && (
                <>
                  {Array.from({ length: 10 }, (_, i) => i).map(val => (
                    <div
                      key={val}
                      className='number-input-key'
                      onClick={() => handleNumberInput(val)}
                    >
                      {val}
                    </div>
                  ))}
                  <div
                    className='number-input-key'
                    onClick={handleNumberDel}
                  >
                    <i className='fa fa-backspace' />
                  </div>
                </>
              )}
              <div
                className='load-list-link'
                onClick={handleClick}
              >
                播放歌单
              </div>
            </div>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  )
}

export default DrawerListYours
