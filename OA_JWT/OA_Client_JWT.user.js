// ==UserScript==
// @name         OA Client JWT
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://*.openasset.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=openasset.com
// @grant        none
// @run-at       document-idle
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
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
                    //console.log(elementToFind);
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
            //console.log("observing:", selector);
            observer.observe(root, observerConfig);

            // initial check to return if the element already exists on page
            //checkForElement(observer);

            /*             // timeout the observer after 10 seconds
            timer = setTimeout(() => {
                console.log("couldn't find: ", selector);
                observer.disconnect();
                reject('Stopping observation for element.');
            }, 10000); */
        });
    }

    async function newToken(url) {
        if (!url) {
            alert("Please fill out client URL first.");
            return;
        } else {
            const clienturl = "https://" + url + ".openasset.com";
            await navigator.clipboard.writeText(
                "new Rest.JWT().getOAServiceJWT().then(data => console.log(data.jwt))"
            );
            window.open(clienturl, "_blank", "noreferrer");
        }
    }

    async function copyJwtToClipboard() {
        fetch(`${window.location.origin}/REST/1/JWT?service.openasset=true&expiry=86400`)
            .then((response) => response.json())
            .then((data) => {
            console.log(data.jwt);
            navigator.clipboard.writeText(data.jwt);
        });
    }


 async function onUrlChange() {

    let test = await waitForElement('div.KtG-oLHCHxUYnSFLrZYGc > div > div > div');
    var dropDown = document.querySelector("div.KtG-oLHCHxUYnSFLrZYGc > div > div > div");
    // var jwtTemp = dropDown.firstChild.cloneNode(true);
    var jwtTemp = dropDown.querySelector("button").cloneNode(true);
    jwtTemp.id = "jwt"
    // jwtTemp.href = "/REST/1/JWT?service.openasset=true&expiry=86400"
    // jwtTemp.href = "";
    jwtTemp.onclick = function(){copyJwtToClipboard()};
    dropDown.insertBefore(jwtTemp, dropDown.lastChild);
    jwtTemp.querySelector("span:last-child").innerText = "OA JWT"
    console.log("test");


    const dropdownObserverConfig = {
        attributes: false,
        childList: true,
        subtree: false
    };

    function dropdownObserverCallback(mutationList, observer) {
        for (const mutation of mutationList) {
            if (mutation.type === 'childList') {
                console.log("test 2");
                var dropDown = document.querySelector("div.KtG-oLHCHxUYnSFLrZYGc > div > div > div");
                if (dropDown){
                    // jwtTemp = dropDown.querySelector("button").cloneNode(true);
                    if (!dropDown.querySelector('#jwt')){
                        jwtTemp = dropDown.querySelector("button").cloneNode(true);
                    }
                    dropDown.insertBefore(jwtTemp, dropDown.lastChild);
                    jwtTemp.querySelector("span:last-child").innerText = "OA JWT"
                    // jwtTemp.href = "/REST/1/JWT?service.openasset=true&expiry=86400"
                    jwtTemp.href = "";
                    jwtTemp.id = "jwt"
                    jwtTemp.onclick = function(){copyJwtToClipboard()};
                    console.log("jwtTemp", jwtTemp);
                    console.log("dropDown", dropDown);
                }
            }
        }
    }

    const dropdownObserver = new MutationObserver(dropdownObserverCallback);
    console.log("observing:", dropDown);

    dropdownObserver.observe(document.querySelector("div.KtG-oLHCHxUYnSFLrZYGc:last-child"), dropdownObserverConfig);
}


onUrlChange();
})();