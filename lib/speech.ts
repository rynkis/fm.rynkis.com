
const parseSpeech = (speech: string) => {
  const lines = speech.trim().split('\n').filter(x => x)
  const result: any = {}
  lines.forEach(line => {
    const [index, message] = line.split(':')
    result[index] = (message || '').trim().replace(/\\\./g, '\n')
  })
  return result
}

const speech = {
  parseSpeech
}

export default speech
