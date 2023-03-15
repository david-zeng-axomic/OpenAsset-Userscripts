// ==UserScript==
// @name         OA Client JWT
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
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

    var dropdownRootSelector = "div.KtG-oLHCHxUYnSFLrZYGc:last-child"
    var dropdownMenuSelector = dropdownRootSelector+" > div > div > div";

    function dropdownObserverCallback(mutationList, observer) {
        for (const mutation of mutationList) {
            if (mutation.type === 'childList') {
                var dropDown = document.querySelector(dropdownMenuSelector);
                insertJwtOption(dropDown);
            }
        }
    }
    var dropdownObserver = new MutationObserver(dropdownObserverCallback);

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
                // reject('Stopping observation');
                return;
            }, 5000);
        });
    }

    async function copyJwtToClipboard() {
        console.log("Fetching JWT:");
        fetch(`${window.location.origin}/REST/1/JWT?service.openasset=true&expiry=86400`)
            .then((response) => response.json())
            .then((data) => {
            console.log(data.jwt);
            navigator.clipboard.writeText(data.jwt);
            console.log("Copied to clipboard!");
        });
    }

    async function insertJwtOption(dropDown) {
        if (dropDown){
            if (!dropDown.querySelector("#jtw")) {
                console.log("inserting JWT option");
                var jwtTemp = dropDown.querySelector("button").cloneNode(true);
                jwtTemp.id = "jwt"
                jwtTemp.querySelector("span:last-child").innerText = "OA JWT"
                jwtTemp.onclick = function(){copyJwtToClipboard()};
                dropDown.insertBefore(jwtTemp, dropDown.lastChild);
            }
        }
    }


    async function onUrlChange() {
        await waitForElement(dropdownRootSelector);
        var dropDown = document.querySelector(dropdownMenuSelector);
        insertJwtOption(dropDown);

        console.log("Observing Dropdown for JWT option");

        var dropdownObserverConfig = {childList: true};
        // dropdownObserver.disconnect();

        // NOTE: 2023-03-14 - Before Search Phase 2
        // For some odd reason a duplicate set of dropdowns exist when going from something like:
        //     '/Page/Search' to '/page/projects'
        // We need to consistently retrieve the last element

        // var dropdownRootList = [...document.querySelectorAll(dropdownRootSelector)].at(-1)
        // dropdownObserver.observe(dropdownRoot, dropdownObserverConfig);
        var dropdownRootList = document.querySelectorAll(dropdownRootSelector)
        var lastDropdownRootObj = dropdownRootList[dropdownRootList.length - 1];
        dropdownObserver.observe(lastDropdownRootObj, dropdownObserverConfig);
    }

    function fireOnNavigation() {
        const event = new CustomEvent('Navigation');

        window.dispatchEvent(event);
        dropdownObserver.disconnect();
        onUrlChange();
    }

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