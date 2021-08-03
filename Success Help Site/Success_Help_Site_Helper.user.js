// ==UserScript==
// @name         Success Help Site Helper
// @namespace    https://success.openasset.com/
// @version      0.1
// @description  Adds the ability to easily obtain the hash urls to link to specific sections of articles
// @author       You
// @match        https://success.openasset.com/*
// @icon         https://www.google.com/s2/favicons?domain=openasset.com
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    function addUrlHash(element){
        let anchorHash = document.createElement('a');

        anchorHash.href = '#'+element.id;
        anchorHash.innerHTML = element.innerHTML;
        anchorHash.style = "text-decoration: none;";

        element.innerHTML = "";

        anchorHash.onmouseover = function changeColorOver(){anchorHash.style.color = "orange";}
        anchorHash.onmouseout = function changeColorOut(){anchorHash.style.color = "#3c3c3c";}

        element.append(anchorHash);
    }

    if (window.location.pathname.startsWith('/en/articles/')){
        document.querySelectorAll("h2").forEach(addUrlHash);
        document.querySelectorAll("h3").forEach(addUrlHash);
    }
})();