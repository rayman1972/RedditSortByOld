// ==UserScript==
// @name         Reddit Sort by Old
// @namespace    https://github.com/yourusername
// @version      1.0
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
                    setTimeout(() => {
                        location.replace(url.toString()); // Use replace to prevent adding to history
                    }, 50);
                    console.log('Sorting by old enforced and page reloaded');
                }
            }
        } catch (error) {
            console.error('Error enforcing sort by old:', error);
        }
    }

    function init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                enforceOldSort();
            });
        } else {
            enforceOldSort();
        }
    }

    init();
})();
