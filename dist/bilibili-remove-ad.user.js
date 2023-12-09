// ==UserScript==
// @name Remove Bilibili Ads
// @namespace http://tampermonkey.net/
// @version 0.0.1
// @description Remove ad feed cards from Bilibili pages
// @author Ray Guo
// @match https://www.bilibili.com/*

// ==/UserScript==

"use strict";
(() => {
  // src/bilibili-remove-ad/main.ts
  function removeAds() {
    const ad = document.querySelector(".ad-report");
    if (ad)
      ad.remove();
    const ads = document.querySelectorAll(".bili-video-card__info--ad");
    if (ads.length === 0)
      return;
    ads.forEach((ad2) => {
      let currentElement = ad2;
      while (currentElement && !currentElement.classList.contains("feed-card") && !currentElement.classList.contains("bili-video-card"))
        currentElement = currentElement.parentElement;
      if (currentElement)
        currentElement.remove();
    });
  }
  setInterval(removeAds, 100);
})();
