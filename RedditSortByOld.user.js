// ==UserScript==
// @name         Reddit Sort by Old
// @namespace    https://github.com/rayman1972
// @version      1.1
// @description  Automatically sorts Reddit comments by "old".
// @author       Rayman30
// @license      GPL-3.0-or-later
// @match        https://www.reddit.com/*
// @match        https://sh.reddit.com/*
// @grant        none
// @run-at       document-start
// @noframes
// ==/UserScript==
'use strict';

(function () {
    function enforceOldSort() {
        try {
            if (location.pathname.includes('/comments/')) {
                const url = new URL(location.href);
                if (url.searchParams.get('sort') !== 'old') {
                    url.searchParams.set('sort', 'old');
                    location.replace(url.toString()); // Use replace to prevent adding to history
                    console.log('Sorting by old enforced and page reloaded');
                }
            }
        } catch (error) {
            console.error('Error enforcing sort by old:', error);
        }
    }

    function init() {
        // Run enforceOldSort on load
        enforceOldSort();

        // Fallback for dynamic content or delayed script execution
        const observer = new MutationObserver(() => {
            enforceOldSort();
        });

        observer.observe(document, {
            childList: true,
            subtree: true,
        });

        console.log('Observer initialized for dynamic content.');
    }

    init();
})();
