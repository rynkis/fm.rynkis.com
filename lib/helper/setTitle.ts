
const setTitle = (title: string) => {
  window.document.title = title
  const meta = window.document.querySelector('meta[name="description"]')
  meta?.setAttribute('content', title)
}

export default setTitle
