/**
 * @note this file is only used in development mode
 * If the script contain "GM" API, use @require instead of this file.
 */

function addScript(url: string) {
  const script = document.createElement('script')
  script.setAttribute('type', 'text/javascript')
  script.setAttribute('src', url)
  document.getElementsByTagName('head')[0].appendChild(script)
}
addScript(`http://localhost:3000/{filename}?t=${new Date().getTime()}`)
