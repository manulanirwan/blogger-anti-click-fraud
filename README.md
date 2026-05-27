Universal Ad Click Fraud Protection for Blogger

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

------------------------------------------------------------------------------------------------------------------------------------------

Click the Save icon (floppy disk) in the top right.

Step 2: Wrap Non-AdSense Network Codes
For any ad network other than Google AdSense or Ezoic, you must wrap their script tags in a protected-ad container when placing them into your blog widgets or posts:

HTML
------------------------------------------------------------------------------------------------------------------------------------------

<div class="protected-ad">
    </div>
------------------------------------------------------------------------------------------------------------------------------------------

🔧 CustomizationYou can easily modify the behavior of the script by editing these two variables at the top of the code:VariableDefault ValueDescriptionmaxClicks3The maximum number of clicks a user can make across all ads before being blocked.blockHours24How many hours the ads will stay hidden from that specific user.🛑 Limitations & Best PracticesIncognito/Private Browsing: Since this solution relies on browser localStorage, if an attacker uses Incognito mode or clears their browser cookies/storage, their click counter resets.VPN/IP Changes: Unlike server-side setups, this client-side code blocks the browser, not the IP. This is highly effective against individual trolls clicking repeatedly, but less effective against automated distributed botnets.Reporting: If using AdSense, always report significant spikes in invalid traffic using the official Google AdSense Invalid Clicks Contact Form to create a paper trail defending your account status.
------------------------------------------------------------------------------------------------------------------------------------------

📄 LicenseThis project is licensed under the MIT License - see the LICENSE file for details."""js_content = """// Universal Ad Click Fraud Protection for Blogger// Keeps your ad network accounts safe from Click Bombing / Invalid Traffic (IVT)(function() {// === CONFIGURATION ===var maxClicks = 3;       // Maximum allowed clicks per user per dayvar blockHours = 24;     // Duration to hide ads from attackers (in hours)// =====================// Selectors for auto-detected networks + custom protected wrapper class
var adSelectors = '.protected-ad, .adsbygoogle, ins.adsbygoogle, iframe[id^="aswift"], [id^="div-gpt-ad"], .ezoic-ad, .taboola-ad';

// 1. Check if the user is currently under a block penalty
var blockTime = localStorage.getItem('global_ad_block_time');
if (blockTime) {
    var hoursPassed = (new Date().getTime() - blockTime) / (1000 * 60 * 60);
    if (hoursPassed < blockHours) {
        // Forcefully hide all ad units from the attacker's DOM layout
        var style = document.createElement('style');
        style.innerHTML = adSelectors + ' { display: none !important; opacity: 0 !important; pointer-events: none !important; }';
        document.head.appendChild(style);
        return; 
    } else {
        // Block duration expired, reset metrics for clean slate
        localStorage.removeItem('global_ad_block_time');
        localStorage.setItem('global_ad_click_count', '0');
    }
}

// 2. Track window focus & hover state over targeted elements
var isOverAd = false;
document.addEventListener('mouseover', function(e) {
    if (e.target.closest && e.target.closest(adSelectors)) {
        isOverAd = true;
    } else {
        isOverAd = false;
    }
});

// 3. Intercept iframe interactions via window blur tracking
window.addEventListener('blur', function() {
    if (isOverAd) {
        var currentClicks = parseInt(localStorage.getItem('global_ad_click_count') || '0', 10);
        currentClicks++;
        localStorage.setItem('global_ad_click_count', currentClicks);

        // 4. Trigger penalty protocol if clicks exceed maximum threshold
        if (currentClicks >= maxClicks) {
            localStorage.setItem('global_ad_block_time', new Date().getTime());
            
            var style = document.createElement('style');
            style.innerHTML = adSelectors + ' { display: none !important; opacity: 0 !important; pointer-events: none !important; }';
            document.head.appendChild(style);
        }
        isOverAd = false;
    }
});
})();"""with open("README.md", "w", encoding="utf-8") as f:f.write(readme_content)with open("anti-click-fraud.js", "w", encoding="utf-8") as f:f.write(js_content)print("Files generated successfully.")
------------------------------------------------------------------------------------------------------------------------------------------


🔬 Core Concepts: How the Technical Mechanics Work
If developers ask issues or comment on your code inside GitHub, you can explain the core architecture using these principles:

1. The Cross-Origin Iframe Barrier
Modern web browsers enforce strict security rules via the Same-Origin Policy. Because ad networks serve their banners inside an HTML <iframe> hosted on an external server (like googleads.g.doubleclick.net or adsterra.com), your main Blogger site cannot read what is happening inside that iframe. You cannot attach a standard JavaScript addEventListener('click') to an ad wrapper and register when a mouse button is pressed down.

2. The Focus Trick (window.blur)
To get around the cross-origin restriction, this tool relies on tracking browser window focus shifts.

When a visitor views your blog, the main window has user focus.

When a user clicks anywhere inside an ad iframe, the browser treats that iframe as its own independent window, causing the parent window to instantly lose focus.

The script listens for this frame shift using the global window.blur event listener.

3. Combining Mouse Tracking with Blur Events
A blur event can happen for multiple reasons (e.g., a user clicks the address bar, hits Alt+Tab, or clicks a browser extension). To prevent false positives, the script couples window blur events with continuous structural hover tracking:

JavaScript

------------------------------------------------------------------------------------------------------------------------------------------

// 1. Tracks if user's pointer sits directly on an ad zone
document.addEventListener('mouseover', function(e) {
    if (e.target.closest(adSelectors)) {
        isOverAd = true;
    } else {
        isOverAd = false;
    }
});

// 2. Only counts a blur as a valid ad click if the pointer is currently hovering over an ad zone
window.addEventListener('blur', function() {
    if (isOverAd) {
        // Increment invalid traffic counters
    }
});
4. Mitigation via Global CSS Injection
Once a malicious user crosses the threshold configured in maxClicks, the code stops processing tracking counters and executes an active penalty block. Instead of modifying every single HTML element one by one (which can cause layout issues or performance lag), it injects a raw global CSS stylesheet directly into the webpage header:

CSS
------------------------------------------------------------------------------------------------------------------------------------------

.protected-ad, .adsbygoogle { 
    display: none !important; 
    opacity: 0 !important; 
    pointer-events: none !important; 
}
display: none !important; completely collapses the container so the ad space is removed from view.

pointer-events: none !important; ensures that even if any residual pixel elements linger, mouse clicks will pass through them transparently, rendering further click attacks impossible.
