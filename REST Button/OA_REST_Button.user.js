// ==UserScript==
// @name         OA REST Button
// @namespace    https://github.com/david-zeng-axomic/OpenAsset-Userscripts
// @version      0.8
// @description  Inject REST API button to various OA pages
// @author       DZE
// @match        *://*.openasset.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=openasset.com
// @updateURL    https://github.com/david-zeng-axomic/OpenAsset-Userscripts/raw/main/REST%20Button/OA_REST_Button.user.js
// @downloadURL  https://github.com/david-zeng-axomic/OpenAsset-Userscripts/raw/main/REST%20Button/OA_REST_Button.user.js
// @run-at      document-idle
// ==/UserScript==

(function() {
    'use strict';

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

    async function createButton(restURL, parentElement, elementToAdd){

        elementToAdd.id = "rest"
        elementToAdd.href = restURL
        elementToAdd.title = "REST";
        elementToAdd.dataset.title = "REST";
        elementToAdd.innerText = "REST";

        // projects and employees make sure that the element highlighting class is not there
        // elementToAdd.style.removeProperty('border');
        elementToAdd.classList.remove("_2NvvM0jkx7ejB9_0l1zUwk")

        parentElement.append(elementToAdd);
    }


    async function onUrlChange() {
        if (location.host == "whatsnew.openasset.com"){
            return;
        }
        console.log(location.href);

        let restEndpoint,
            buttons_class_string,
            additionalQueryParams = "",
            elementToAdd;

        let urlPath = window.location.pathname
        let urlPageMatch = urlPath.split()

        if (urlPath.startsWith("/page/project/")){
            restEndpoint = 'Projects';
            buttons_class_string = '.YcNBGatz6qt_kUsFXROt';

        } else if (urlPath.startsWith("/page/employee/")){
            restEndpoint = 'Employees';
            buttons_class_string = '.YcNBGatz6qt_kUsFXROt';

        } else if (urlPath.startsWith("/page/files/")){
            restEndpoint = 'Files';
            buttons_class_string = '.YcNBGatz6qt_kUsFXROt';
            //additionalQueryParams = "?withEmbeddedFields=1&withEmbeddedKeywords=1";

        } else if (urlPath.startsWith("/Page/Users")){
            restEndpoint = 'Users';
            buttons_class_string = '.contentFixed';

        } else if (urlPath.startsWith("/page/user-management")){
            restEndpoint = 'Users';
            buttons_class_string = '.DLo6nvvq1dUOHHs8bw5r';

        } else {
            return;
        }

        let restObjID = urlPath.split('/')[3] || "";
        let restURL = `${location.origin}/REST/1/${restEndpoint}/${restObjID}`+additionalQueryParams

        await waitForElement(buttons_class_string);
        console.log(buttons_class_string);

        if (document.querySelector("#rest")) {
            document.querySelector("#rest").remove()
        }

        let parentElement = document.querySelector(buttons_class_string);
        if (parentElement.querySelector("a")) {
            elementToAdd = parentElement.querySelector("a").cloneNode(true);
        } else { // for "Users" pages
            elementToAdd = document.createElement("a");
            elementToAdd.style.fontSize = "large";
            elementToAdd.style.padding = "8px";
            elementToAdd.style.borderRadius = "5px";
            elementToAdd.style.border = "thin solid grey";
            elementToAdd.style.backgroundColor = "rgba(71,71,71,.06)";
        }

        createButton(restURL, parentElement, elementToAdd);
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
