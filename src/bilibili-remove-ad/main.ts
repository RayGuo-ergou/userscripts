function removeAds() {
  const ad = document.querySelector('.ad-report')
  if (ad) {
    ad.remove()
  }
  // Find all elements with the ad class
  const ads = document.querySelectorAll('.bili-video-card__info--ad')
  if (ads.length === 0) {
    return
  }

  // Loop through each ad and remove its highest-level parent
  ads.forEach((ad) => {
    let currentElement: Element | null = ad
    // Traverse up the DOM to find the highest-level parent with a specified class
    while (
      currentElement &&
      !currentElement.classList.contains('feed-card') &&
      !currentElement.classList.contains('bili-video-card')
    ) {
      currentElement = currentElement.parentElement
    }
    // Remove the parent element
    if (currentElement) currentElement.remove()
  })
}

// Fuck it, I don't care if the pages break, the ads are fucking annoying
setInterval(removeAds, 100)
