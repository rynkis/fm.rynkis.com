
export const parseSpeech = (speech) => {
  const lines = (speech || '').trim().split('\n').filter(x => x)
  const result = {}
  lines.forEach(line => {
    const [index, message] = line.split(':')
    result[index] = (message || '').trim().replace(/\\\./g, '\n')
  })
  return result
}

export const speakMessage = (message) => {
  if (typeof SpeechSynthesisUtterance === 'undefined') {
    return Promise.resolve()
  }

  const speechInstance = new SpeechSynthesisUtterance(message)
  speechInstance.voice =
    speechSynthesis.getVoices().find(voice => voice.lang === 'zh-CN') || null
  speechInstance.lang = 'zh-CN'

  speechSynthesis.speak(speechInstance)

  return new Promise(resolve => {
    speechInstance.onend = resolve
    speechInstance.onerror = resolve
  })
}
