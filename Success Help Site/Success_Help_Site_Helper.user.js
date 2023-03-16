// ==UserScript==
// @name         Success Help Site Helper
// @namespace    https://success.openasset.com/
// @version      0.2
// @description  Adds the ability to easily obtain the hash urls to link to specific sections of articles
// @author       You
// @match        https://success.openasset.com/*
// @icon         https://www.google.com/s2/favicons?domain=openasset.com
// @updateURL    https://github.com/david-zeng-axomic/OpenAsset-Userscripts/raw/main/Success%20Help%20Site/Success_Help_Site_Helper.user.js
// @downloadURL  https://github.com/david-zeng-axomic/OpenAsset-Userscripts/raw/main/Success%20Help%20Site/Success_Help_Site_Helper.user.js
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    function addUrlHash(element) {
        if (element.id) {
            let anchorHash = document.createElement('a');

            anchorHash.href = '#'+element.id;
            anchorHash.innerHTML = element.innerHTML;
            anchorHash.style = "text-decoration: none;";

            element.innerHTML = "";

            anchorHash.onmouseover = function changeColorOver(){anchorHash.style.color = "orange";}
            anchorHash.onmouseout = function changeColorOut(){anchorHash.style.color = "#3c3c3c";}

            element.append(anchorHash);
        }
    }

    if (window.location.pathname.startsWith('/en/articles/')) {
        document.querySelectorAll("h1").forEach(addUrlHash);
        document.querySelectorAll("h2").forEach(addUrlHash);
        document.querySelectorAll("h3").forEach(addUrlHash);
    }
})();