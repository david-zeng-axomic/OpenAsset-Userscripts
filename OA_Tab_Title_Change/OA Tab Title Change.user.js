// ==UserScript==
// @name         OA Tab Title Change
// @namespace    https://openasset.com/
// @version      0.1
// @description  Add subdomain to tab title
// @author       DZE
// @match        https://*.openasset.com/*
// @icon         https://www.google.com/s2/favicons?domain=openasset.com
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    document.title = document.title.replace('OpenAsset - ', window.location.host.split('.')[0]+' | ');

    new MutationObserver(function(mutations) {
        //console.log(mutations[0].target.nodeValue);
        if (document.title.includes('OpenAsset - ')){
            //console.log(document.title);
            document.title = document.title.replace('OpenAsset - ', window.location.host.split('.')[0]+' | ');
        }

    }).observe(
        document.querySelector('title'),
        { subtree: true, characterData: true, childList: true }
    );

})();