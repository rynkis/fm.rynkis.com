
const makeLrc = (lrcInfo: any) => {
  const result: any = {
    lrc: {},
    tlrc: {}
  }

  const ly: any = {
    lyric: ['lrc', '  '],
    tlyric: ['tlrc', '  ']
  }
  Object.keys(ly).forEach(keyName => {
    const value = ly[keyName]
    if (typeof lrcInfo[keyName] === 'string' && lrcInfo[keyName] !== '') {
      const lrc = lrcInfo[keyName].split('\n')
      for (const rows of lrc) {
        const match = rows.match(/\[[^\[\]]*\]/g) || []
        const times = match.map((val: string) =>
          val.substring(1, val.length - 1)
        )
        if (times.length === 0) {
          if (!result[value[0]][0]) result[value[0]][0] = value[1]
          break
        } else {
          const colText = rows.replace(/\[[^\[\]]*\]/g, '')
          times.forEach((key: string) => {
            const [m, s] = key.split(':')
            const time = parseInt(m) * 60 + parseInt(s)
            if (!Number.isNaN(time)) result[value[0]][time] = colText
          })
        }
      }
    } else {
      result[value[0]][0] = value[1]
    }
  })

  return result
}

export default makeLrc
