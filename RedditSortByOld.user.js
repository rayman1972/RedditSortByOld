You said:
I am using a Tampermonkey script for Reddit in Firefox.
This is the script:
ChatGPT said:
ChatGPT

Please share the Tampermonkey script, and I'll help you with any questions or improvements you need!
You said:
// ==UserScript==
// @name         Reddit Bypass Enhancer
// @namespace    https://greasyfork.org/en/users/1030895-universedev
// @version      1.5
// @description  Bypass the "open in app prompt", unblur NSFW content and thumbnails, and remove the blur from community highlight cards on Reddit automatically.
// @author       UniverseDev
// @license      GPL-3.0-or-later
// @match        https://www.reddit.com/*
// @match        https://sh.reddit.com/*
// @grant        none
// @run-at       document-start
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/520603/Reddit%20Bypass%20Enhancer.user.js
// @updateURL https://update.greasyfork.org/scripts/520603/Reddit%20Bypass%20Enhancer.meta.js
// ==/UserScript==
'use strict';

(function () {
    const NSFW_MODAL_TAG = 'shreddit-async-loader';
    const NSFW_MODAL_ATTR = 'bundlename';
    const BLURRED_TAG = 'shreddit-blurred-container';
    const PROMPT_SELECTOR = 'xpromo-nsfw-blocking-container';
    const THUMBNAIL_BLUR_SELECTOR = '.thumbnail-blur';
    const BLURRED_CLICKED_CLASS = 'rbe-unblurred';
    const COMMUNITY_HIGHLIGHT_CARD_SELECTOR = 'community-highlight-card';

    function removeNSFWBlock() {
        const nsfwModal = document.querySelector(${NSFW_MODAL_TAG}[${NSFW_MODAL_ATTR}*="nsfw_blocking_modal"]);
        if (nsfwModal) nsfwModal.remove();

        const prompt = document.querySelector(${PROMPT_SELECTOR} > *)?.shadowRoot?.querySelector('.prompt');
        if (prompt) prompt.remove();

        const blurredContainers = document.querySelectorAll(BLURRED_TAG);
        blurredContainers.forEach(container => {
            if (container.shadowRoot?.innerHTML && !container.classList.contains(BLURRED_CLICKED_CLASS)) {
                container.firstElementChild.click();
                container.classList.add(BLURRED_CLICKED_CLASS);
            }
        });

        const thumbnailBlurElements = document.querySelectorAll(THUMBNAIL_BLUR_SELECTOR);
        thumbnailBlurElements.forEach(el => {
            el.classList.remove('thumbnail-blur');
        });

        const cards = document.querySelectorAll(COMMUNITY_HIGHLIGHT_CARD_SELECTOR);
        cards.forEach(card => {
            card.removeAttribute('blurred');
        });
    }

    const observer = new MutationObserver(() => {
        removeNSFWBlock();
    });

    observer.observe(document, {
        childList: true,
        subtree: true,
        attributes: false,
    });

    removeNSFWBlock();

    setTimeout(removeNSFWBlock, 100);

    const shredditCheckInterval = setInterval(() => {
        if (!document.querySelector('shreddit-app')) {
            observer.disconnect();
            clearInterval(shredditCheckInterval);
        }
    }, 5000);
})();
ChatGPT said:
ChatGPT

This Tampermonkey script is designed to enhance Reddit by bypassing various restrictions and visual modifications like NSFW content blurring, community card highlights, and app prompts. Below are some insights and potential improvements for the script:
Functionality Review:

    Removes NSFW blocks and prompts: It removes the modal blocks and prompts displayed for NSFW content.
    Unblurs NSFW thumbnails: Clears the thumbnail-blur class to show NSFW thumbnails.
    Handles community highlight cards: Removes the blurred attribute to make community highlights visible.
    Observes DOM changes: Uses MutationObserver to handle dynamic changes in Reddit's content.
    Failsafe measures: Executes removeNSFWBlock periodically and disconnects the observer if shreddit-app is not present.

Suggestions for Improvement:

    Error Handling:
        Wrap DOM manipulation code (querySelector, remove, etc.) in try-catch blocks to handle unexpected errors gracefully.

try {
    const nsfwModal = document.querySelector(`${NSFW_MODAL_TAG}[${NSFW_MODAL_ATTR}*="nsfw_blocking_modal"]`);
    if (nsfwModal) nsfwModal.remove();
} catch (error) {
    console.error('Error removing NSFW modal:', error);
}

Performance Optimization:

    Minimize the usage of setInterval or reduce the frequency if possible.
    Debounce or throttle MutationObserver callbacks to prevent excessive triggering.

Flexible Selector Management:

    Store CSS selectors and constants in a separate configuration object for easier maintenance when Reddit updates their DOM structure.

const SELECTORS = {
    nsfwModal: `${NSFW_MODAL_TAG}[${NSFW_MODAL_ATTR}*="nsfw_blocking_modal"]`,
    prompt: `${PROMPT_SELECTOR} > *`,
    blurredContainers: BLURRED_TAG,
    thumbnailBlur: THUMBNAIL_BLUR_SELECTOR,
    communityHighlight: COMMUNITY_HIGHLIGHT_CARD_SELECTOR,
};

Dynamic Execution Timing:

    Use document.readyState to ensure the script runs at appropriate times for better compatibility.

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', removeNSFWBlock);
} else {
    removeNSFWBlock();
}

Improved Mutation Observer:

    Add specific conditions for observed changes to reduce unnecessary executions.

const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
        if (mutation.addedNodes.length || mutation.removedNodes.length) {
            removeNSFWBlock();
        }
    });
});

User Feedback:

    Add logs or visual indicators for users to know the script is running.

    console.log('Reddit Bypass Enhancer script active');

Debugging Tips:

    Test the script in both desktop and mobile view modes to ensure all elements are properly handled.
    Monitor the console for errors or warnings, especially during DOM changes.

If you need help implementing any specific improvements or debugging, let me know!
You said:
Can you write out the script including your enhancements?
ChatGPT said:
ChatGPT

Here’s the enhanced version of the Tampermonkey script with the suggested improvements implemented:

The script now includes:

    Improved structure and readability:
        Constants for selectors and class names are centralized for easier updates.

    Error handling:
        All DOM manipulations are wrapped in try-catch blocks to handle unexpected errors gracefully.

    Logging:
        Logs added to key actions for better debugging and user feedback.

    Optimized observer:
        Observes relevant DOM changes and ensures efficient execution.

    Failsafe mechanism:
        Periodic checks to reapply fixes and disconnects gracefully if unnecessary.

Feel free to test it and let me know if further adjustments are needed!
You said:
I really want to incorporate sorting by age per sub-reddit. All threads. This is handled in the browser manually now. For example: https://www.reddit.com/r/RetroArch/comments/1hygfbk/the_new_lrps2_core_is_legit/ but I want it to always be: https://www.reddit.com/r/RetroArch/comments/1hygfbk/the_new_lrps2_core_is_legit/?sort=old

How can I adopt the script to always sort by old when reading a post and it's replies?
ChatGPT said:
ChatGPT

The script now enforces sorting threads by "old" when viewing a post and its replies. The new enforceOldSort function checks if the URL contains a thread (/comments/) and appends or updates the ?sort=old query parameter. This ensures that the sorting behavior is consistent whenever a thread is opened. Let me know if you need further customization!
You said:
I am going to test it right now
ChatGPT said:
ChatGPT

Great! Let me know how the testing goes and if you encounter any issues or need further tweaks to the script. 😊
You said:
It doesn't work, loading the site now results in a loop and never loads completely
ChatGPT said:
ChatGPT

The script has been updated to address the infinite loop issue by replacing the page's query parameters (window.history.replaceState) instead of reloading the URL. This avoids unnecessary page reloads while still ensuring the sort is set to "old." Please test the updated version and let me know if it resolves the issue!
You said:
Almost. No loop this time, the url changes to sort to 'old' but doesn't refresh until I refresh the link
ChatGPT said:
ChatGPT

The script now forces a page reload when the URL is updated to include the ?sort=old parameter. This ensures the sorting change takes effect immediately without requiring manual refresh. Please test it again and let me know how it works!
You said:
Aaand, I am back to a loop, page doesn't load
ChatGPT said:
ChatGPT

The script has been updated to include a slight delay before reloading the page to prevent potential infinite loops. This uses setTimeout with a short delay and location.replace to avoid adding to browser history. Please test the updated version and let me know if it resolves the issue!
You said:
Oh, and we should really change the name and author, plus there is no update link and download link. It was someone else's script, but I modified it
ChatGPT said:
ChatGPT

I've updated the name, author, and namespace fields to reflect that this is your customized version. I also removed the downloadURL and updateURL fields, as you indicated they were not applicable. Let me know if you'd like to adjust these further or if there's anything else to refine!
You said:
Thank you, I don't want to overwrite something that is already out there.
ChatGPT said:
ChatGPT

You're absolutely right to ensure you're not overwriting someone else's work without acknowledgment. With the modifications, this script is now entirely your version. If you ever decide to share it publicly, you can provide credit to the original author or script you based it on, alongside a note explaining your modifications.

Let me know if there’s anything else you’d like to refine or add!
You said:
Tadaaa. The script works now
ChatGPT said:
ChatGPT

That's fantastic news! 🎉 I'm glad the script is working perfectly now. If you need further tweaks, new features, or assistance in sharing it on a platform like GitHub or Greasy Fork, feel free to ask. Enjoy your improved Reddit experience! 😊
You said:
I just don't understand why 'sorting preference' is not possible in Reddit. But I like to read it chronically 
ChatGPT said:
ChatGPT

It’s surprising that Reddit doesn’t include a persistent sorting preference in its settings. Sorting chronologically (by "old") is essential for following discussions as they happen, especially in communities where context matters.

Your script fills a significant usability gap, ensuring that you can consume content in the order you prefer without needing to adjust settings manually each time. It’s also an example of how users can take control of their browsing experience when platforms don’t offer certain features.

If you'd like, we could add additional enhancements to the script, like:

    Supporting multiple sorting preferences (e.g., "new," "top," or "controversial").
    A toggle or notification to show that the script is actively applying changes.

Let me know! 😊
You said:
Well, maybe we can make it so that all the options in the script are toggles? Y/N Do you think that is a good idea or do you have an even beter idea?
ChatGPT said:
ChatGPT

Adding toggles to the script is an excellent idea! It gives users flexibility to enable or disable features as needed. We can use a simple configuration object at the top of the script where users can set features to true or false. Here's how we can incorporate toggles:

I've added a configuration object at the top of the script with toggles for each feature. Users can enable or disable individual features by setting the corresponding value to true or false. This makes the script more flexible and customizable.

Let me know if you want to refine it further or add additional options! 😊
You said:
Testing it now
ChatGPT said:
ChatGPT

That's great! Let me know how the test goes and if you’d like further refinements. If everything works perfectly, you now have a flexible and highly customizable script for Reddit. 😊
You said:
Where would I see the toggles?
ChatGPT said:
ChatGPT

The toggles are part of the configuration object at the top of the script. Here's where you can see them:

const config = {
    removeNSFWModal: true, // Removes the NSFW modal (set to false to disable this feature)
    removeAppPrompt: true, // Removes the app prompt (set to false to disable this feature)
    unblurNSFWContent: true, // Unblurs NSFW content (set to false to disable this feature)
    unblurThumbnails: true, // Unblurs blurred thumbnails (set to false to disable this feature)
    unblurCommunityHighlightCards: true, // Unblurs community highlight cards (set to false to disable this feature)
    enforceSortByOld: true, // Always sort threads by "old" (set to false to disable this feature)
};

You can enable or disable any feature by setting its value to true or false. For example:

    If you want to stop unblurring NSFW content, change unblurNSFWContent to false.
    If you don't want threads to automatically sort by "old," set enforceSortByOld to false.

Simply modify these values before running the script, and it will adjust its behavior based on your preferences. If you'd like an interface to toggle these dynamically in the browser, I can help add that too! Let me know. 😊
You said:
Yes, it is easier and more professional to edit the preference via a gui
ChatGPT said:
ChatGPT

I’ve added a settings menu to the script that allows you to toggle features via a simple GUI. You can now enable or disable options like removing the NSFW modal, sorting threads, or unblurring content directly in the browser.

The menu will appear as a small overlay on the top-right corner of the page. Once you save your settings, they’ll persist across sessions using localStorage. You’ll need to reload the page to apply any changes.

Feel free to test it and let me know if you'd like further refinements! 😊
You said:
I see, as I am using privacy related tools, I guess the new window gets killed
ChatGPT said:
ChatGPT

It seems that privacy-related tools might block certain localStorage functionalities or the UI injection itself. To address this:

    Fallback to Default Settings: If localStorage fails or privacy tools block the menu from appearing, the script should operate with its default settings.

    Alternative Setting Methods: We could add a keyboard shortcut or a special URL query parameter (e.g., ?enhancer-settings) that triggers the settings menu instead of embedding it directly into the DOM. This bypasses any privacy-related interference with DOM injection.

    Confirmation of Permissions: Verify that the script has the necessary permissions in your browser. Some privacy-focused tools restrict JavaScript injection, especially for things like UI overlays.

Would you like me to implement one of these alternatives? For instance, I could add a keyboard-triggered menu or a URL-based configuration loader. Let me know how you'd like to proceed!
You said:
Let's go back to the version where you have to edit the script with false or true to enable function. Please activate the functions as default
ChatGPT said:
ChatGPT

The script has been reverted to use a simple config object where you can enable or disable features by setting their values to true or false. All features are activated by default for your convenience.

Let me know if you need further adjustments! 😊
You said:
I couldn't care less for NFSW and blurry pictures, but being able to sort by age is THE BOMB
ChatGPT said:
ChatGPT

Got it! If sorting by age is your main focus, let's simplify the script by disabling or removing the unnecessary NSFW and blur-related functionalities while keeping the sorting by age feature fully functional. Would you like me to clean up the script for this purpose?
You said:
Yes, that was just an example for you so you understand the TemperMonkey script. All I need from the script is to sort comments by 'old'
ChatGPT said:
ChatGPT

The script has been streamlined to focus solely on sorting Reddit comments by "old." All unrelated functionality has been removed for simplicity. Let me know if there’s anything else you’d like to tweak! 😊
You said:
I made rayman1972/
RedditSortByOld Github. But how do I get the script in that repo?
ChatGPT said:
ChatGPT

To add the script to your GitHub repository, follow these steps:
1. Prepare the Script

The script is already in its final form, as shown in the canvas. Save this script locally on your computer as RedditSortByOld.user.js.
2. Upload to Your GitHub Repository

    Navigate to your GitHub Repository: Go to the Rayman1972/RedditSortByOld repository in your browser.

    Add a New File:
        Click on the "Add file" button (near the top-right).
        Select "Create new file".

    Name the File:
        Enter RedditSortByOld.user.js as the filename at the top.

    Paste the Script:
        Copy the script from the canvas.
        Paste it into the text area on the GitHub page.

    Commit the File:
        Scroll down to the "Commit new file" section.
        Add a commit message like Add RedditSortByOld.user.js.
        Click "Commit new file".

3. Optional: Provide Installation Instructions

To make it easier for others to use your script:

    Create a README.md file in your repository.
    Include instructions like:

    # Reddit Sort by Old

    A Tampermonkey/Greasemonkey user script that automatically sorts Reddit comments by "old".

    ## Installation

    1. Install a userscript manager like [Tampermonkey](https://www.tampermonkey.net/) or [Greasemonkey](https://addons.mozilla.org/en-US/firefox/addon/greasemonkey/).
    2. Click [here](https://github.com/rayman1972/RedditSortByOld/raw/main/RedditSortByOld.user.js) to install the script.
    3. Enjoy Reddit sorted by "old" automatically!

4. Publish and Share

Once the file is in the repository, you can share the script's raw URL for direct installation:

    Example: https://github.com/rayman1972/RedditSortByOld/raw/main/RedditSortByOld.user.js

Let me know if you’d like help with any of these steps! 😊
You said:
Okay, I put the script on Greecemonkey. Can you write a catching explaintion. and install instruction?
ChatGPT said:
ChatGPT

Here’s a catchy explanation and installation instructions you can use for Greasemonkey:
Reddit Sort by Old

Are you tired of manually sorting Reddit comments to "old" every time? Reddit Sort by Old is a simple and effective userscript that does it for you! Automatically sorts all Reddit comment threads chronologically so you can follow conversations the way they happened.
Features

    Automatically sorts Reddit comment threads by "old."
    Lightweight and runs seamlessly in the background.
    Works across all Reddit comment pages.

Installation Instructions

    Install a Userscript Manager:
        For Firefox: Greasemonkey
        For Chrome: Tampermonkey
        For other browsers, ensure you have a compatible userscript manager.

    Add the Script:
        Visit the Reddit Sort by Old script on GitHub.
        Click "Install" when prompted by your userscript manager.

    Enjoy:
        Open any Reddit comment thread.
        Watch as it automatically sorts by "old" for you!

Let me know if you'd like tweaks to this! 😊
You said:
Okay, I published it, and started using it, but my first feed wasn't filtered by 'old' What are we missing?
ChatGPT said:
ChatGPT

If the first feed (comments page) wasn’t sorted by "old," it might be due to one of these reasons:
1. Page Already Loaded Before Script Execution

The script runs at document-start, which should ideally trigger before the page fully loads. However, if the page is already partially or fully loaded when the script runs, the changes might not take effect.
Solution: Add a Fallback for Late Execution

We can enhance the script to handle cases where the page is already loaded. This ensures the sort is enforced even if the script is executed after the page starts rendering.
Updated Script:

Here's the adjusted script:

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
