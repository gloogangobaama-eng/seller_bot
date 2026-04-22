import { useEffect, useState } from 'react'

export function useTelegram() {
  const [tgUser, setTgUser] = useState(null)
  const [tg, setTg] = useState(null)

  useEffect(() => {
    const WebApp = window.Telegram?.WebApp

    if (WebApp) {
      WebApp.ready()
      WebApp.expand()
      WebApp.setHeaderColor('#0f0d0b')
      WebApp.setBackgroundColor('#0f0d0b')

      setTg(WebApp)

      const user = WebApp.initDataUnsafe?.user
      if (user) {
        setTgUser({
          id: user.id,
          username: user.username || null,
          firstName: user.first_name || null,
          lastName: user.last_name || null,
          initData: WebApp.initData,
        })
      } else {
        // Dev fallback
        setTgUser({
          id: 'dev_user',
          username: 'dev_user',
          firstName: 'Developer',
          lastName: null,
          initData: '',
        })
      }
    } else {
      // Dev fallback
      setTgUser({
        id: 'dev_user',
        username: 'dev_user',
        firstName: 'Developer',
        lastName: null,
        initData: '',
      })
    }
  }, [])

  const closeApp = () => {
    if (tg) {
      tg.close()
    } else {
      window.close()
    }
  }

  return { tgUser, tg, closeApp }
}
