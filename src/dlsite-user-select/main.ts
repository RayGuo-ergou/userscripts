/**
 * @file dlsite-user-select/main.ts
 * @description
 * Enable user-select: auto and touch-action: auto on all elements on play.dlsite.com
 * This allows text selection and touch actions that are normally disabled.
 */
const Css = String.raw

const userSelectStyle = Css`
* {
  user-select: auto !important;
  -webkit-user-select: auto !important;
  -moz-user-select: auto !important;
  -ms-user-select: auto !important;
  touch-action: auto !important;
  -webkit-touch-callout: default !important;
}
`

const styleTag = document.createElement('style')
styleTag.textContent = userSelectStyle
styleTag.id = 'dlsite-user-select'

document.head.appendChild(styleTag)
