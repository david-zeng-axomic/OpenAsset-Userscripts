// ==UserScript==
// @name         OA Tab Title Change
// @namespace    https://openasset.com
// @version      0.1
// @description  Add subdomain to tab title
// @author       DZE
// @match        https://*.openasset.com/*
// @icon         https://www.google.com/s2/favicons?domain=openasset.com
// @updateURL    https://github.com/david-zeng-axomic/OpenAsset-Userscripts/raw/main/OA_Tab_Title_Change/OA_Tab_Title_Change.user.js
// @downloadURL  https://github.com/david-zeng-axomic/OpenAsset-Userscripts/raw/main/OA_Tab_Title_Change/OA_Tab_Title_Change.user.js
// @grant        none
// @run-at       document-start
// ==/UserScript==

(function() {
    'use strict';

    document.title = document.title.replace('OpenAsset - ', window.location.host.split('.')[0]+' | ');

    new MutationObserver(function(mutations) {
        if (document.title.includes('OpenAsset - ')){
            document.title = document.title.replace('OpenAsset - ', window.location.host.split('.')[0]+' | ');
        }
    }).observe(
        document.querySelector('title'),
        { subtree: true, characterData: true, childList: true }
    );

})();