
const setTitle = (title: string) => {
  window.document.title = title
  const meta = window.document.querySelector('meta[name="description"]')
  console.log(meta)
  meta?.setAttribute('content', title)
}

export default setTitle
