/**
 * @file dlsite-highlight-asmr-on-announce/main.ts
 * @description
 * Highlight ASMR items on DLSite announce page
 * As I only purchase ASMR items on DLSite, I want to highlight them on the announce page.
 * And DLSite does not provide a filter for ASMR items, so I have to do it myself.
 */
const Css = String.raw

const borderStyle = Css`
.n_worklist_item:has(.work_category.type_SOU){
  border: 2px solid #86198f !important;
  border-radius: 0.25rem !important;
}
`
const styleTag = document.createElement('style')
styleTag.textContent = borderStyle

styleTag.id = 'dlsite-highlight-asmr-on-announce'

document.head.appendChild(styleTag)
