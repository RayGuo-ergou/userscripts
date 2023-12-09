// ==UserScript==
// @name DLSite Highlight ASMR on announce
// @namespace http://tampermonkey.net/
// @version 0.0.1
// @description To highlight ASMR on DLSite announce page
// @author Ray Guo
// @match https://www.dlsite.com/maniax/announce/list/*

// ==/UserScript==

"use strict";
(() => {
  // src/utility/document.ts
  function findElementsByXPath(xpath2, contextNode = document) {
    const result = document.evaluate(
      xpath2,
      contextNode,
      null,
      XPathResult.ANY_TYPE,
      null
    );
    const nodes = [];
    let node = result.iterateNext();
    while (node) {
      nodes.push(node);
      node = result.iterateNext();
    }
    return nodes;
  }

  // src/dlsite-highlight-asmr-on-announce/main.ts
  var xpath = "//*[contains(text(), '\u30DC\u30A4\u30B9\u30FBASMR')]";
  var elements = findElementsByXPath(xpath);
  elements.forEach((el) => {
    let parent = el.parentElement;
    while (parent && !parent.classList.contains("n_worklist_item"))
      parent = parent.parentElement;
    if (parent) {
      parent.style.border = "2px solid #86198f";
      parent.style.borderRadius = "0.25rem";
    }
  });
})();
