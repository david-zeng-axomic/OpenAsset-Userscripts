// ==UserScript==
// @name         OA REST Button
// @namespace    https://github.com/david-zeng-axomic/OpenAsset-Userscripts
// @version      0.6
// @description  Inject OA REST button to /page/projects and /page/employees
// @author       DZE + JSU
// @match        *://*/page/project/*
// @match        *://*.openasset.com/*
// @match        *://*/page/employee/*
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js
// @require      https://gist.github.com/raw/2625891/waitForKeyElements.js
// @updateURL    https://github.com/david-zeng-axomic/OpenAsset-Userscripts/raw/main/REST%20Button/OA_REST_Button.user.js
// @downloadURL  https://github.com/david-zeng-axomic/OpenAsset-Userscripts/raw/main/REST%20Button/OA_REST_Button.user.js
// @grant        GM_addStyle

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
    function createButton(){
        //console.log("script running");

        // Your code here...
        let myButton = document.createElement("input"),
            url_split,
            rest_endpoint,
            buttons_class_string,
            placeHolder,
            button_anchor,
            clone;

        if (window.location.href.includes("/page/project/")){
            url_split = window.location.href.split("/page/project/");
            rest_endpoint = 'Projects';
            buttons_class_string = '.qJModJzSC8ikklGUCh-MK';
            console.log("project page");
        } else if (window.location.href.includes("/page/employee/")){
            url_split = window.location.href.split("/page/employee/");
            rest_endpoint = 'Employees';
            buttons_class_string = '._1KR4uOJTCX2WL2RLHNvC8i';
        } else if (window.location.href.includes("/Page/Users")){
            console.log("test");
            url_split = window.location.href.split("/Page/Users");
            rest_endpoint = 'Users';
            buttons_class_string = '.contentFixed';
            var userPage = true;
        }

        //waitForKeyElements (buttons_class_string, actionFunction);

        async function actionFunction () {
            console.log(buttons_class_string);
            await waitForElement(buttons_class_string);
            console.log("got past wait for element");
            //-- DO WHAT YOU WANT TO THE TARGETED ELEMENTS HERE.
            // create the rest button
            placeHolder = document.getElementsByClassName(buttons_class_string.replace(".",""))[0];
            if(userPage){
                var divider = placeHolder.getElementsByClassName('divider');
                var button = placeHolder.getElementsByClassName('clearSelection');
                console.log(button);
                //rbutton resizeable menuItem  clearSelection
            }
            console.log(placeHolder);
            clone = placeHolder.lastChild.cloneNode(true);
            //console.log(clone);
            clone.href = url_split[0] + '/REST/1/'+rest_endpoint+'/' + url_split[1].split('/')[0];
            clone.dataset.title = "REST";
            clone.innerText = "REST";
            clone.style.removeProperty('border');
            placeHolder.append(clone);
        }
        actionFunction();
    }


    async function onUrlChange() {
        createButton();
    }

    function fireOnNavigation() {
        const event = new CustomEvent('Navigation');
        window.dispatchEvent(event);
        onUrlChange();
    }

    // override history states to run script when url changes
    const pushState = history.pushState;
    history.pushState = function () {
        //console.log("pushState");
        var tempPushState = pushState.apply(history, arguments)
        fireOnNavigation();
        return tempPushState;
    }

    //window.addEventListener('popstate', () => {console.log("popstate"); fireOnNavigation()});

    fireOnNavigation();
})();