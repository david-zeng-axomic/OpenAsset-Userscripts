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

    //<svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path d="m7.775 3.275 1.25-1.25a3.5 3.5 0 1 1 4.95 4.95l-2.5 2.5a3.5 3.5 0 0 1-4.95 0 .751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018 1.998 1.998 0 0 0 2.83 0l2.5-2.5a2.002 2.002 0 0 0-2.83-2.83l-1.25 1.25a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042Zm-4.69 9.64a1.998 1.998 0 0 0 2.83 0l1.25-1.25a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042l-1.25 1.25a3.5 3.5 0 1 1-4.95-4.95l2.5-2.5a3.5 3.5 0 0 1 4.95 0 .751.751 0 0 1-.018 1.042.751.751 0 0 1-1.042.018 1.998 1.998 0 0 0-2.83 0l-2.5 2.5a1.998 1.998 0 0 0 0 2.83Z"></path></svg>
    function addUrlHash(element) {
        if (element.id) {

            //link icon and "a" tag
            let svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
            let anchorHash = document.createElement('a');

            //Copied! modal
            let container = document.createElement('div');
            let copySpan = document.createElement('h1');
            let page = document.getElementById("__next");
            copySpan.innerText = "Copied!";
            container.appendChild(copySpan);
            page.appendChild(container);
            container.id = "copied" + element.id;
            container.style = `
                    position: fixed;
                    display: flex;
                    text-align: center;
                    align-items:center;
                    justify-content: center;
                    top: 50%;
                    left:45%;
                    border-radius: 15px;
                    padding: 10px;
                    color: white;
                    background-color: black;
                    opacity: 0;
                    transition: opacity 0.5s;
                    z-index: 10;
                    width: auto;
                    height: 7%;
                `;
            copySpan.style = `
                    color: white;
                    margin: 10px;
                    font-size: 30px;
                `;

            svg.setAttribute('height',16);
            svg.setAttribute('width',16);
            svg.innerHTML = ' <path d="m7.775 3.275 1.25-1.25a3.5 3.5 0 1 1 4.95 4.95l-2.5 2.5a3.5 3.5 0 0 1-4.95 0 .751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018 1.998 1.998 0 0 0 2.83 0l2.5-2.5a2.002 2.002 0 0 0-2.83-2.83l-1.25 1.25a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042Zm-4.69 9.64a1.998 1.998 0 0 0 2.83 0l1.25-1.25a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042l-1.25 1.25a3.5 3.5 0 1 1-4.95-4.95l2.5-2.5a3.5 3.5 0 0 1 4.95 0 .751.751 0 0 1-.018 1.042.751.751 0 0 1-1.042.018 1.998 1.998 0 0 0-2.83 0l-2.5 2.5a1.998 1.998 0 0 0 0 2.83Z"></path>';
            svg.setAttribute('opacity',0);
            anchorHash.href = '#'+element.id;
            anchorHash.innerHTML = element.innerHTML + " ";
            anchorHash.style = "text-decoration: none;";

            element.innerHTML = "";

            anchorHash.onmouseover = function changeColorOver(){
                anchorHash.style.color = "orange"
                svg.style.transition = "opacity 200ms ease";
                svg.style.opacity = 1;
            }

            anchorHash.onmouseout = function changeColorOut(){
                anchorHash.style.color = "#3c3c3c";
                svg.style.transition = "opacity 100ms ease";
                svg.style.opacity = 0;
            }

            //copies link to clipboard and activates modal to give user feedback
            anchorHash.onclick = function copyLink(){
                navigator.clipboard.writeText(anchorHash.href);
                let container = document.querySelector("#copied" + element.id);
                container.style.opacity = 1;
                setTimeout( function() {
                    container.style.opacity = 0;
                }, 1500);
            }

            element.append(anchorHash);
            element.append(svg);
        }
    }

    if (window.location.pathname.startsWith('/en/articles/')) {
        document.querySelectorAll("h1").forEach(addUrlHash);
        document.querySelectorAll("h2").forEach(addUrlHash);
        document.querySelectorAll("h3").forEach(addUrlHash);
    }



})();