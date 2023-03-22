// ==UserScript==
// @name         OA Get Client JWT
// @namespace    openasset.com
// @version      0.3
// @description  Adds an additional user dropdown option that copies a JWT to clipboard
// @author       DZE
// @match        https://*.openasset.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=openasset.com
// @grant        none
// @updateURL    https://github.com/david-zeng-axomic/OpenAsset-Userscripts/raw/main/OA_JWT/OA_Client_JWT.user.js
// @downloadURL  https://github.com/david-zeng-axomic/OpenAsset-Userscripts/raw/main/OA_JWT/OA_Client_JWT.user.js
// @run-at       document-idle
// ==/UserScript==

(function() {
    'use strict';

    // These may need to change if Front-End UI breaks from new update
    var dropdownRootSelector = "div.KtG-oLHCHxUYnSFLrZYGc:last-child"
    var dropdownMenuSelector = dropdownRootSelector+" > div > div > div";


    // waits until selector element exists
    function waitForElement(selector = null, root = document) {
        return new Promise((resolve, reject) => {
            let timer;

            const observerConfig = {
                attributes: false,
                childList: true,
                subtree: true
            };

            function checkForElement(observer) {
                var elementToFind = root.querySelector(selector);

                if (elementToFind) {
                    observer.disconnect();
                    window.clearTimeout(timer);
                    resolve(elementToFind);
                    return;
                }
            }

            function observerCallback(mutationList, observer) {
                for (const mutation of mutationList) {
                    if (mutation.type === 'childList') {
                        checkForElement(observer);
                    }
                }
            }

            const observer = new MutationObserver(observerCallback);
            observer.observe(root, observerConfig);

            // initial check to return if the element already exists on page
            checkForElement(observer);

            // timeout the observer after 5 seconds
            timer = setTimeout(() => {
                console.log("can't find: ", selector);
                observer.disconnect();
                return;
            }, 5000);
        });
    }

    // whenever dropdown menu changes, try to insert JWT button
    function dropdownObserverCallback(mutationList, observer) {
        for (const mutation of mutationList) {
            if (mutation.type === 'childList') {
                insertJwtButton();
            }
        }
    }
    var dropdownObserver = new MutationObserver(dropdownObserverCallback);

    // makes REST api call to fetch JWT and saves to clipboard
    async function copyJwtToClipboard() {
        console.log("Fetching JWT:");
        fetch(`${window.location.origin}/REST/1/JWT?service.openasset=true&expiry=86400`)
            .then((response) => response.json())
            .then((data) => {
            console.log(data.jwt);
            navigator.clipboard.writeText(data.jwt);
            console.log("Copied to clipboard!");

            // fade in span for 1.5 seconds and fade out
            let copySpan = document.querySelector("#copied");
            copySpan.style.opacity = 1;
            setTimeout( function() {
                copySpan.style.opacity = 0;
            }, 1500);
        });
    }

    // creates OA JWT button in user dropdown menu
    async function insertJwtButton() {
        var dropDown = document.querySelector(dropdownMenuSelector);
        if (dropDown){
            if (!dropDown.querySelector("#jwtButton")){
                // deep-copy existing dropdown buttons
                var jwtButton = dropDown.querySelector("button").cloneNode(true);
                jwtButton.id = "jwtButton"
                jwtButton.querySelector("span:last-child").innerText = "Copy JWT"
                jwtButton.onclick = function(){copyJwtToClipboard()};

                // update button svg to use copy icon
                jwtButton.querySelector("svg").innerHTML = `<path d="M0 0h24v24H0z" fill="none"/>
                <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>`;

                // create hidden span element for click feedback
                var copySpan = document.createElement("span");
                copySpan.innerText = "Copied!";
                copySpan.id = "copied";
                copySpan.style = `
                    position: absolute;
                    display: inline-block;
                    left: 8.25em;
                    padding: 4px;
                    border-radius: 5px;
                    color: white;
                    background-color: black;
                    font-size: small;
                    opacity: 0;
                    transition: opacity 0.25s;
                    z-index: 10;
                `;
                jwtButton.appendChild(copySpan);

                dropDown.insertBefore(jwtButton, dropDown.lastChild);
            }
        }
    }

    async function onUrlChange() {
        // wait for dropdown to render before we can observer it
        await waitForElement(dropdownRootSelector);

        // NOTE from 2023-03-14 : Before Search Phase 2
        // For some odd reason a duplicate set of dropdowns exist when going from certain pages.
        // Like for example, From '/Page/Search' to '/page/projects'
        // We need to consistently retrieve the last element to work around this
        var dropdownRootList = document.querySelectorAll(dropdownRootSelector)
        var lastDropdownRootObj = dropdownRootList[dropdownRootList.length - 1];

        // create observer for dropdown to wait for it to be clicked
        var dropdownObserverConfig = {childList: true};
        dropdownObserver.observe(lastDropdownRootObj, dropdownObserverConfig);
    }

    function fireOnNavigation() {
        const event = new CustomEvent('Navigation');
        window.dispatchEvent(event);
        dropdownObserver.disconnect();
        onUrlChange();
    }

    // override history states to run script when url changes
    const pushState = history.pushState;
    history.pushState = function () {
        console.log("pushState");
        var tempPushState = pushState.apply(history, arguments)
        fireOnNavigation();
        return tempPushState;
    }

    window.addEventListener('popstate', () => {console.log("popstate"); fireOnNavigation()});

    fireOnNavigation();
})();