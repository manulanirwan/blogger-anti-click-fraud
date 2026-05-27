<script>
// MASTER Anti-Click Fraud Script for All Ad Networks
(function() {
    var maxClicks = 3; // Maximum allowed clicks across all ads per day
    var blockHours = 24; // How long to hide ads from the attacker (in hours)

    // All known ad selectors + our custom wrapper class
    var adSelectors = '.protected-ad, .adsbygoogle, ins.adsbygoogle, iframe[id^="aswift"], [id^="div-gpt-ad"], .ezoic-ad, .taboola-ad';

    // Check if the user is currently blocked
    var blockTime = localStorage.getItem('global_ad_block_time');
    if (blockTime) {
        var hoursPassed = (new Date().getTime() - blockTime) / (1000 * 60 * 60);
        if (hoursPassed < blockHours) {
            // Hide every single ad unit instantly
            var style = document.createElement('style');
            style.innerHTML = adSelectors + ' { display: none !important; opacity: 0 !important; pointer-events: none !important; }';
            document.head.appendChild(style);
            return; 
        } else {
            localStorage.removeItem('global_ad_block_time');
            localStorage.setItem('global_ad_click_count', '0');
        }
    }

    // Track mouse movement over ads
    var isOverAd = false;
    document.addEventListener('mouseover', function(e) {
        if (e.target.closest && e.target.closest(adSelectors)) {
            isOverAd = true;
        } else {
            isOverAd = false;
        }
    });

    // Detect click via window blur event
    window.addEventListener('blur', function() {
        if (isOverAd) {
            var currentClicks = parseInt(localStorage.getItem('global_ad_click_count') || '0', 10);
            currentClicks++;
            localStorage.setItem('global_ad_click_count', currentClicks);

            if (currentClicks >= maxClicks) {
                localStorage.setItem('global_ad_block_time', new Date().getTime());
                // Instantly hide all ads on the page
                var style = document.createElement('style');
                style.innerHTML = adSelectors + ' { display: none !important; opacity: 0 !important; pointer-events: none !important; }';
                document.head.appendChild(style);
            }
            isOverAd = false;
        }
    });
})();
</script>
