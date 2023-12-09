// ==UserScript==
// @name Dev Utils
// @namespace http://tampermonkey.net/
// @version 0.0.1
// @description A collection of utilities for developers.
// @author Ray Guo
// @match *://*/*

// ==/UserScript==

"use strict";
(() => {
  // src/dev/main.ts
  function addScript(url) {
    const script = document.createElement("script");
    script.setAttribute("type", "text/javascript");
    script.setAttribute("src", url);
    document.getElementsByTagName("head")[0].appendChild(script);
  }
  addScript(`http://localhost:3000/{filename}?t=${(/* @__PURE__ */ new Date()).getTime()}`);
})();
