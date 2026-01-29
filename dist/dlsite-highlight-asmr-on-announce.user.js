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
  // src/dlsite-highlight-asmr-on-announce/main.ts
  var Css = String.raw;
  var borderStyle = Css`
.n_worklist_item:has(.work_category.type_SOU){
  border: 2px solid #86198f !important;
  border-radius: 0.25rem !important;
}
`;
  var styleTag = document.createElement("style");
  styleTag.textContent = borderStyle;
  styleTag.id = "dlsite-highlight-asmr-on-announce";
  document.head.appendChild(styleTag);
})();
