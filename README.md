"""# Universal Ad Click Fraud Protection for Blogger

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Platform: Blogger](https://img.shields.io/badge/Platform-Blogger-orange.svg)](https://www.blogger.com)
[![Category: Security](https://img.shields.io/badge/Category-Security-blue.svg)]()

A lightweight, client-side JavaScript solution designed to protect Blogger (Blogspot) websites from **Click Bombing**, **Invalid Traffic (IVT)**, and malicious automated bots. This script helps prevent Google AdSense ad serving limits and keeps your account safe across multiple ad networks simultaneously.

---

## 🚀 Supported Ad Networks

This script works natively for automated networks and uses a universal container class to protect **all other networks**:

* **Native Auto-Detection:** Google AdSense, Ezoic
* **Universal Wrapper Support:** Adsterra, Media.net, PropellerAds, Monetag, Taboola, Outbrain, MGID, Revcontent, Infolinks, BuySellAds, Amazon Publisher Services, SHE Media, and more.

> ⚠️ **Note on Formats:** This script protects **Display Banners, Native Grids, In-Text Links, and Sticky/Anchor ads**. It *cannot* stop Popunders or Push Notifications due to browser architecture limitations.

---

## 🛠️ How It Works (The Mechanics)

Since ad units run inside cross-origin `<iframe>` elements, standard JavaScript `click` events cannot detect user interactions inside them. This script uses a highly efficient workaround:

1.  **Hover Tracking (`mouseover`):** It tracks whether the user's cursor is currently hovering over an ad element or a protected ad wrapper.
2.  **Focus Monitoring (`window.blur`):** When a user clicks inside an iframe, the main browser window loses focus, triggering a `blur` event. If a `blur` event occurs while `isOverAd` is true, a click is registered.
3.  **State Persistence (`localStorage`):** The total number of clicks per user is saved locally. If the clicks exceed your threshold, a timestamp is recorded.
4.  **Instant Mitigation (CSS Injection):** Once blocked, the script dynamically injects a global CSS style rule (`display: none !important; pointer-events: none !important;`) that completely removes all ad spaces from the attacker's view for a set period (e.g., 24 hours).

---

## ⚙️ Installation Guide for Blogger

### Step 1: Install the Core Script
1. Log in to your **Blogger Dashboard**.
2. Go to **Theme** on the left menu.
3. Click the downward arrow next to "Customize" and select **Edit HTML**.
4. Scroll to the very bottom of the code and find the closing `</body>` tag.
5. Paste the code from `anti-click-fraud.js` (or copy it below) exactly **above/before** the `</body>` tag:

Code output
Files generated successfully.

```html
<script>
// Universal Ad Click Fraud Protection
(function() {
    var maxClicks = 3; // Maximum allowed clicks per user per day
    var blockHours = 24; // Duration to hide ads from attackers (in hours)

    // Selectors for automatic networks + custom protected class
    var adSelectors = '.protected-ad, .adsbygoogle, ins.adsbygoogle, iframe[id^="aswift"], [id^="div-gpt-ad"], .ezoic-ad, .taboola-ad';

    var blockTime = localStorage.getItem('global_ad_block_time');
    if (blockTime) {
        var hoursPassed = (new Date().getTime() - blockTime) / (1000 * 60 * 60);
        if (hoursPassed < blockHours) {
            var style = document.createElement('style');
            style.innerHTML = adSelectors + ' { display: none !important; opacity: 0 !important; pointer-events: none !important; }';
            document.head.appendChild(style);
            return; 
        } else {
            localStorage.removeItem('global_ad_block_time');
            localStorage.setItem('global_ad_click_count', '0');
        }
    }

    var isOverAd = false;
    document.addEventListener('mouseover', function(e) {
        if (e.target.closest && e.target.closest(adSelectors)) {
            isOverAd = true;
        } else {
            isOverAd = false;
        }
    });

    window.addEventListener('blur', function() {
        if (isOverAd) {
            var currentClicks = parseInt(localStorage.getItem('global_ad_click_count') || '0', 10);
            currentClicks++;
            localStorage.setItem('global_ad_click_count', currentClicks);

            if (currentClicks >= maxClicks) {
                localStorage.setItem('global_ad_block_time', new Date().getTime());
                var style = document.createElement('style');
                style.innerHTML = adSelectors + ' { display: none !important; opacity: 0 !important; pointer-events: none !important; }';
                document.head.appendChild(style);
            }
            isOverAd = false;
        }
    });
})();
</script>
