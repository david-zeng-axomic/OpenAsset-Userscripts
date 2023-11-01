// ==UserScript==
// @name         OA Files Sizes Reprocess Button
// @namespace    https://github.com/david-zeng-axomic/OpenAsset-Userscripts
// @version      0.1
// @description  Inject REST API button to various OA pages
// @author       DZE
// @match        *://*.openasset.com/*
// @grant        none
// @updateURL    https://github.com/david-zeng-axomic/OpenAsset-Userscripts/raw/main/OA_Files_Sizes_Reprocess/OA_Files_Sizes_Reprocess.user.js
// @downloadURL  https://github.com/david-zeng-axomic/OpenAsset-Userscripts/raw/main/OA_Files_Sizes_Reprocess/OA_Files_Sizes_Reprocess.user.js
// @run-at      document-idle
// ==/UserScript==

(function() {
    'use strict';

    let sizesTabClassString = '._1kpF1m3JPv86giDy6zDhMI';
    let sizeRowsClass = "._3Pq1mPq-ZorkTEuhR-SF7D";
    let sizeRowTextClass = "._2MDylJr6PDV2ekClOeMRtB";
    let sizeButtonsdivClass = "._30xcf_ZsfuPk0Al9ZEEjLy";

    let newTabSvgPath = '<path d="M464 32H48C21.5 32 0 53.5 0 80v352c0 26.5 21.5 48 48 48h416c26.5 0 48-21.5 48-48V80c0-26.5-21.5-48-48-48zM48 92c0-6.6 5.4-12 12-12h40c6.6 0 12 5.4 12 12v24c0 6.6-5.4 12-12 12H60c-6.6 0-12-5.4-12-12V92zm416 334c0 3.3-2.7 6-6 6H54c-3.3 0-6-2.7-6-6V168h416v258zm0-310c0 6.6-5.4 12-12 12H172c-6.6 0-12-5.4-12-12V92c0-6.6 5.4-12 12-12h280c6.6 0 12 5.4 12 12v24z"></path>'
    let reprocessSvgPath = '<path xmlns="http://www.w3.org/2000/svg" d="M480-160q-134 0-227-93t-93-227q0-134 93-227t227-93q69 0 132 28.5T720-690v-110h80v280H520v-80h168q-32-56-87.5-88T480-720q-100 0-170 70t-70 170q0 100 70 170t170 70q77 0 139-44t87-116h84q-28 106-114 173t-196 67Z"/>'

    // helper function to wait for an element to appear
    function waitForElement(selector = null, root = document) {
        return new Promise((resolve, reject) => {
            let timer;

            const observerConfig = {
                attributes: false,
                childList: true,
                subtree: true
            };

            function checkForElement(observer) {
                //console.log(selector);
                var elementToFind = root.querySelector(selector);

                if (elementToFind) {
                    observer.disconnect();
                    window.clearTimeout(timer);
                    resolve(elementToFind);
                    return elementToFind;
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

    // makes REST api call to reprocess size
    async function reprocessSize(sizeId) {
        console.log("Reprocessing Size:");
        let fileId = window.location.pathname.split("/")[3];
        fetch(
            `${window.location.origin}/REST/1/Files/${fileId}/Sizes?lowPriority=1`,
            {
                method: "PUT",
                body: JSON.stringify([
                    {
                        "id": sizeId,
                        "recreate": 1
                    }
                ]),
            })
            .then((response) => response.json())
            .then((data) => {
            console.log(data);
        });
    }

    function createSizeInNewTabButton(sizeButtonsdiv, sizeName) {
        let sizeInNewTabButton = sizeButtonsdiv.querySelector('a').cloneNode(true);
        sizeInNewTabButton.href = sizeInNewTabButton.href.replace('//downloads.openasset.com/','//data.openasset.com/');
        sizeInNewTabButton.title="Open Size in new tab";
        sizeInNewTabButton.target="_blank"
        sizeInNewTabButton.id = `${sizeName}_NewTab`;


        sizeInNewTabButton.querySelector("svg").innerHTML = newTabSvgPath;
        sizeInNewTabButton.querySelector("svg").setAttribute("viewBox", "0 0 512 512");

        // let newTabSvgPath = '<path xmlns="http://www.w3.org/2000/svg" d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h280v80H200v560h560v-280h80v280q0 33-23.5 56.5T760-120H200Zm188-212-56-56 372-372H560v-80h280v280h-80v-144L388-332Z"/>'
        // sizeInNewTabButton.querySelector("svg").innerHTML=newTabSvgPath;
        // sizeInNewTabButton.querySelector("svg").setAttribute("viewBox", "0 -960 960 960");
        return sizeInNewTabButton;
    }

    function createReprocessButton(sizeButtonsdiv, sizeName, sizeId) {
        let reprocessButton = sizeButtonsdiv.querySelector('button').cloneNode(true);
        reprocessButton.title="Reprocess Size";
        reprocessButton.target="_blank"
        reprocessButton.id = `${sizeName}_Reprocess`;

        reprocessButton.querySelector("svg").innerHTML = reprocessSvgPath;
        reprocessButton.querySelector("svg").setAttribute("viewBox", "0 -960 960 960");

        reprocessButton.onclick = function(){reprocessSize(sizeId)};
        return reprocessButton;
    }


    async function onUrlChange() {
        if (location.host == "whatsnew.openasset.com"){
            return;
        }

        let urlPath = window.location.pathname;

        if (urlPath.startsWith("/page/files/")){
            // wait for sizes tab to be active
            let sizesTab = await waitForElement(sizesTabClassString);

            // api call to generate object for mapping size names to size ids
            var fileSizes = {};
            await fetch(`${window.location.origin}/REST/1/Sizes?limit=0`)
                .then((response) => response.json())
                .then((data) => {
                // console.log(data);
                data.forEach((size) => {
                    fileSizes[size.name] = size.id;
                })
            })

            // loop through each size row in the sizes tab
            document.querySelectorAll(sizeRowsClass).forEach((sizeRow) => {
                let sizeRowText = sizeRow.querySelector(sizeRowTextClass);
                let sizeName = sizeRowText.innerText.split("\n").splice(-1)[0];
                let sizeId = fileSizes[sizeName];

                // only need to add new buttons for created sizes
                let sizeButtonsdiv = sizeRow.querySelector(sizeButtonsdivClass);
                if (sizeButtonsdiv){
                    // add size in new tab button
                    let sizeInNewTabButton = createSizeInNewTabButton(sizeButtonsdiv, sizeName);
                    sizeButtonsdiv.append(sizeInNewTabButton);

                    // skip original size as it can't be reprocessed
                    if (sizeId != 1){
                        // add reprocess size button
                        let reprocessButton = createReprocessButton(sizeButtonsdiv, sizeName, sizeId);
                        sizeButtonsdiv.prepend(reprocessButton);
                    }
                }

            });

        } else {
            return;
        }

    }

    function fireOnNavigation() {
        const event = new CustomEvent('Navigation');
        window.dispatchEvent(event);
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

    // continue overriding if replaceState is activated
    const replaceState = history.replaceState;
    history.replaceState = function () {
        console.log("replaceState");
        var tempReplaceState = replaceState.apply(history, arguments)
        fireOnNavigation();
        return tempReplaceState;
    }

    // activate script when popState runs.
    window.addEventListener('popstate', () => {console.log("popstate"); fireOnNavigation()});

    fireOnNavigation();

})();
