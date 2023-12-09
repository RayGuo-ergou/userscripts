/**
 * @file dlsite-highlight-asmr-on-announce/main.ts
 * @description
 * Highlight ASMR items on DLSite announce page
 * As I only purchase ASMR items on DLSite, I want to highlight them on the announce page.
 * And DLSite does not provide a filter for ASMR items, so I have to do it myself.
 */
import { findElementsByXPath } from '../utility/document'

const xpath = '//*[contains(text(), \'ボイス・ASMR\')]'
// Find elements using XPath
const elements = findElementsByXPath(xpath)

// Loop through these elements
elements.forEach((el) => {
  // Traverse up the DOM tree to find the parent with class 'n_worklist_item'
  let parent = el.parentElement
  while (parent && !parent.classList.contains('n_worklist_item'))
    parent = parent.parentElement

  // If a matching parent is found, add a border to it
  if (parent) {
    parent.style.border = '2px solid #86198f' // Customize the border style here
    parent.style.borderRadius = '0.25rem'
  }
})
