// ==UserScript==
// @name         OA Files Sizes Reprocess Button
// @namespace    https://github.com/david-zeng-axomic/OpenAsset-Userscripts
// @version      0.3
// @description  Inject "Open size in new tab" and "reprocess size" buttons for the file info sizes tab
// @author       DZE
// @match        *://*.openasset.com/*
// @grant        none
// @updateURL    https://github.com/david-zeng-axomic/OpenAsset-Userscripts/raw/main/OA_Files_Sizes_Reprocess/OA_Files_Sizes_Reprocess.user.js
// @downloadURL  https://github.com/david-zeng-axomic/OpenAsset-Userscripts/raw/main/OA_Files_Sizes_Reprocess/OA_Files_Sizes_Reprocess.user.js
// @run-at      document-idle
// ==/UserScript==

(function() {
    'use strict';

    // css class selector strings:
    let sizesTabClassStr = '._1kpF1m3JPv86giDy6zDhMI'; // sizes tab table
    let sizeRowsClassStr = "._3Pq1mPq-ZorkTEuhR-SF7D"; // individual size row
    let sizeRowTextClassStr = "._2MDylJr6PDV2ekClOeMRtB"; // size name text div
    let sizeButtonsdivClassStr = "._30xcf_ZsfuPk0Al9ZEEjLy"; // div for size row buttons

    let newTabSvgPath = '<path d="M464 32H48C21.5 32 0 53.5 0 80v352c0 26.5 21.5 48 48 48h416c26.5 0 48-21.5 48-48V80c0-26.5-21.5-48-48-48zM48 92c0-6.6 5.4-12 12-12h40c6.6 0 12 5.4 12 12v24c0 6.6-5.4 12-12 12H60c-6.6 0-12-5.4-12-12V92zm416 334c0 3.3-2.7 6-6 6H54c-3.3 0-6-2.7-6-6V168h416v258zm0-310c0 6.6-5.4 12-12 12H172c-6.6 0-12-5.4-12-12V92c0-6.6 5.4-12 12-12h280c6.6 0 12 5.4 12 12v24z"></path>'
    let reprocessSvgPath = '<path xmlns="http://www.w3.org/2000/svg" d="M480-160q-134 0-227-93t-93-227q0-134 93-227t227-93q69 0 132 28.5T720-690v-110h80v280H520v-80h168q-32-56-87.5-88T480-720q-100 0-170 70t-70 170q0 100 70 170t170 70q77 0 139-44t87-116h84q-28 106-114 173t-196 67Z"/>'
    let reprocessSuccessSvgPath = '<path xmlns="http://www.w3.org/2000/svg" d="M440-82q-76-8-141.5-41.5t-114-87Q136-264 108-333T80-480q0-91 36.5-168T216-780h-96v-80h240v240h-80v-109q-55 44-87.5 108.5T160-480q0 123 80.5 212.5T440-163v81Zm-17-214L254-466l56-56 113 113 227-227 56 57-283 283Zm177 196v-240h80v109q55-45 87.5-109T800-480q0-123-80.5-212.5T520-797v-81q152 15 256 128t104 270q0 91-36.5 168T744-180h96v80H600Z"/>'
    let reprocessFailedSvgPath = '<path xmlns="http://www.w3.org/2000/svg" d="M791-55 671-175q-42 26-90 40.5T480-120q-75 0-140.5-28.5t-114-77q-48.5-48.5-77-114T120-480q0-53 14.5-101t40.5-90L55-791l57-57 736 736-57 57ZM480-200q36 0 69.5-8.5T613-233L233-613q-16 30-24.5 63.5T200-480q0 117 81.5 198.5T480-200Zm120-360v-80h110q-41-56-101-88t-129-32q-36 0-69.5 8.5T347-727l-58-58q42-26 90-40.5T480-840q82 0 155.5 35T760-706v-94h80v240H600Zm-80 6-80-80v-46h80v126Zm265 265-58-58q11-22 18.5-45t10.5-48h82q-5 42-18.5 80T785-289Z"/>'
    let reprocessAllSvgPath ='<path xmlns="http://www.w3.org/2000/svg" d="M314-115q-104-48-169-145T80-479q0-26 2.5-51t8.5-49l-46 27-40-69 191-110 110 190-70 40-54-94q-11 27-16.5 56t-5.5 60q0 97 53 176.5T354-185l-40 70Zm306-485v-80h109q-46-57-111-88.5T480-800q-55 0-104 17t-90 48l-40-70q50-35 109-55t125-20q79 0 151 29.5T760-765v-55h80v220H620ZM594 0 403-110l110-190 69 40-57 98q118-17 196.5-107T800-480q0-11-.5-20.5T797-520h81q1 10 1.5 19.5t.5 20.5q0 135-80.5 241.5T590-95l44 26-40 69Z"/>';

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

    async function reprocessSize(reprocessButton, sizeId, fileSizes) {
        console.log("Reprocessing Size:", sizeId);

        let jsonBody = JSON.stringify([
            {
                "id": sizeId,
                "recreate": 1
            }
        ]);

        // if original size, reprocess all existing sizes
        if (sizeId == 1){
            let existingSizes = []
            document.querySelectorAll(sizeRowsClassStr).forEach((sizeRow) => {
                let sizeRowText = sizeRow.querySelector(sizeRowTextClassStr);
                let sizeName = sizeRowText.innerText.split("\n").splice(-1)[0];
                let sizeId = fileSizes[sizeName];

                // only need to add new buttons for created sizes
                let sizeButtonsdiv = sizeRow.querySelector(sizeButtonsdivClassStr);
                if (sizeButtonsdiv){
                    if (sizeId != 1){
                        existingSizes.push({"id": sizeId, "recreate": 1})
                    }
                }
            });

            jsonBody = JSON.stringify(existingSizes);
        }

        let fileId = window.location.pathname.split("/")[3];
        console.log("Reprocessing Size:");
        console.log("Payload:", jsonBody);
        fetch(
            `${window.location.origin}/REST/1/Files/${fileId}/Sizes?lowPriority=1&limit=0`,
            {
                method: "PUT",
                body: jsonBody,
            })
            .then((response) => {
            if (response.ok) {
                return response.json();
            } else{
                return response.text().then(text => { throw new Error(text) });
            }
        })
            .then((data) => { // successful reprocess
            console.log(data);
            reprocessButton.querySelector("svg").innerHTML = reprocessSuccessSvgPath;
            reprocessButton.querySelector("svg").setAttribute("viewBox", "0 -960 960 960");
            reprocessButton.querySelector("svg").setAttribute("fill", "green");

            // disable button if reprocess has started
            reprocessButton.disabled = true;
        })
            .catch((error) => { // failed reprocess
            console.log(error);
            reprocessButton.querySelector("svg").innerHTML = reprocessFailedSvgPath;
            reprocessButton.querySelector("svg").setAttribute("viewBox", "0 -960 960 960");
            reprocessButton.querySelector("svg").setAttribute("fill", "red");
        });
    }

    function createSizeInNewTabButton(sizeButtonsdiv, sizeName) {
        // lazily ensure no duplicate elements are created
        if (sizeButtonsdiv.querySelector(`#${sizeName}_NewTab`)) {
            sizeButtonsdiv.querySelector(`#${sizeName}_NewTab`).remove();
        }
        let sizeInNewTabButton = sizeButtonsdiv.querySelector('a').cloneNode(true);
        sizeInNewTabButton.href = sizeInNewTabButton.href.replace('//downloads','//data');
        sizeInNewTabButton.title="Open Size in new tab";
        sizeInNewTabButton.target="_blank"
        sizeInNewTabButton.id = `${sizeName}_NewTab`;

        sizeInNewTabButton.querySelector("svg").innerHTML = newTabSvgPath;
        sizeInNewTabButton.querySelector("svg").setAttribute("viewBox", "0 0 512 512");

        // Quick fix hack to resolve issue with href urls not updating as expected.
        // I suspect that this is due to some sort of delay on the react rendering when
        // user moves from one image to next in a search result without refreshing
        sizeInNewTabButton.onmouseover = function(){
            sizeInNewTabButton.href = sizeButtonsdiv.querySelector('a').href.replace('//downloads','//data');
        };

        return sizeInNewTabButton;
    }

    function createReprocessButton(sizeButtonsdiv, sizeName, sizeId, fileSizes) {
        // lazily ensure no duplicate elements are created
        if (sizeButtonsdiv.querySelector(`#${sizeName}_Reprocess`)) {
            sizeButtonsdiv.querySelector(`#${sizeName}_Reprocess`).remove();
        }
        let reprocessButton = sizeButtonsdiv.querySelector('button').cloneNode(true);
        reprocessButton.title="Reprocess Size";
        reprocessButton.target="_blank"
        reprocessButton.id = `${sizeName}_Reprocess`;

        // differentiate svg icon for original size for reprocess all sizes
        if(sizeId == 1){
            reprocessButton.querySelector("svg").innerHTML = reprocessAllSvgPath
            reprocessButton.title="Reprocess All Sizes";
        } else {
            reprocessButton.querySelector("svg").innerHTML = reprocessSvgPath;
        }
        reprocessButton.querySelector("svg").setAttribute("viewBox", "0 -960 960 960");

        reprocessButton.onclick = function(){reprocessSize(reprocessButton, sizeId, fileSizes)};

        return reprocessButton;
    }

    function createNewButtons(fileSizes) {
        // loop through each size row in the sizes tab
        document.querySelectorAll(sizeRowsClassStr).forEach((sizeRow) => {
            let sizeRowText = sizeRow.querySelector(sizeRowTextClassStr);
            let sizeName = sizeRowText.innerText.split("\n").splice(-1)[0];
            let sizeId = fileSizes[sizeName];

            // only need to add new buttons for created sizes
            let sizeButtonsdiv = sizeRow.querySelector(sizeButtonsdivClassStr);
            if (sizeButtonsdiv){
                // add size in new tab button
                let sizeInNewTabButton = createSizeInNewTabButton(sizeButtonsdiv, `size_${sizeId}`);
                sizeButtonsdiv.append(sizeInNewTabButton);

                // add reprocess size button
                let reprocessButton = createReprocessButton(sizeButtonsdiv, `size_${sizeId}`, sizeId, fileSizes);
                sizeButtonsdiv.prepend(reprocessButton);
            }

        });
    }


    async function onUrlChange() {
        if (location.host == "whatsnew.openasset.com"){
            return;
        }

        let urlPath = window.location.pathname;
        if (urlPath.startsWith("/page/files/")){
            // wait for sizes tab to be active
            let sizesTab = await waitForElement(sizesTabClassStr);

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

            createNewButtons(fileSizes);
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
