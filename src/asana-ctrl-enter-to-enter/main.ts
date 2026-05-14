/**
 * @file asana-ctrl-enter-to-enter/main.ts
 * @description
 * Intercept Ctrl+Enter keydown/keyup events on Asana and replace them with
 * plain Enter events, preventing the default "complete task" behavior.
 */

let suppressNextCtrlEnter = false

function isCtrlEnter(event: KeyboardEvent): boolean {
  return event.key === 'Enter' && event.ctrlKey
}

function dispatchPlainEnter(target: EventTarget, type: 'keydown' | 'keyup') {
  const event = new KeyboardEvent(type, {
    key: 'Enter',
    code: 'Enter',
    bubbles: true,
    cancelable: true,
    composed: true,
  })
  target.dispatchEvent(event)
}

window.addEventListener('keydown', (event) => {
  if (!event.isTrusted)
    return

  if (isCtrlEnter(event)) {
    event.preventDefault()
    event.stopImmediatePropagation()
    suppressNextCtrlEnter = true

    const target = event.target ?? document.documentElement
    dispatchPlainEnter(target, 'keydown')
  }
}, true)

window.addEventListener('keyup', (event) => {
  if (!event.isTrusted)
    return

  if (suppressNextCtrlEnter && isCtrlEnter(event)) {
    event.preventDefault()
    event.stopImmediatePropagation()
    suppressNextCtrlEnter = false

    const target = event.target ?? document.documentElement
    dispatchPlainEnter(target, 'keyup')
  }
}, true)
