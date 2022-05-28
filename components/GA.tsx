import { useEffect } from 'react'
import ReactGA from 'react-ga'

const GA = (props: any) => {
  const { gid, aid } = props

  useEffect(() => {
    if (!window.location.host.includes('localhost') && gid) {
      ReactGA.initialize(gid)
      let query = window.location.search
      if (query) {
        query += `&aid=${aid}`
        ReactGA.pageview(window.location.pathname + window.location.search)
      } else {
        ReactGA.pageview(window.location.pathname + `?aid=${aid}`)
      }
    }
  }, [])

  return null
}

export default GA
