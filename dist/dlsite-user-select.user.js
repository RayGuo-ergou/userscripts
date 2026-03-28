// ==UserScript==
// @name DLSite User Select Auto
// @namespace http://tampermonkey.net/
// @version 1.0.0
// @description Enable user-select: auto and touch-action: auto on play.dlsite.com
// @author Ray Guo
// @match https://play.dlsite.com/*

// ==/UserScript==

"use strict";
(() => {
  // src/dlsite-user-select/main.ts
  var Css = String.raw;
  var userSelectStyle = Css`
* {
  user-select: auto !important;
  -webkit-user-select: auto !important;
  -moz-user-select: auto !important;
  -ms-user-select: auto !important;
  touch-action: auto !important;
  -webkit-touch-callout: default !important;
}
`;
  var styleTag = document.createElement("style");
  styleTag.textContent = userSelectStyle;
  styleTag.id = "dlsite-user-select";
  document.head.appendChild(styleTag);
})();
