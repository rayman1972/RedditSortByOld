// ==UserScript==
// @name         Reddit Sort by Old
// @namespace    https://github.com/rayman1972
// @version      1.2
// @description  Automatically sorts Reddit comments by "old" without refreshing the feed unnecessarily.
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
                    // Update the URL without reloading the page
                    window.history.replaceState(null, '', url.toString());
                    console.log('Sorting by old applied without reloading.');
                }
            }
        } catch (error) {
            console.error('Error enforcing sort by old:', error);
        }
    }

    function init() {
        // Apply sorting immediately
        enforceOldSort();

        // Observe changes for dynamic content
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
