// ==UserScript==
// @name         OA REST test v4
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  Inject OA REST button to /page/projects and /page/employees
// @author       DZE
// @match        *://*/page/project/*
// @match        *://*/page/employee/*
// @require  http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js
// @require  https://gist.github.com/raw/2625891/waitForKeyElements.js
// @grant    GM_addStyle

// @run-at      document-idle
// ==/UserScript==

(function() {
    'use strict';

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
        buttons_class_string = 'qJModJzSC8ikklGUCh-MK';
    } else if (window.location.href.includes("/page/employee/")){
        url_split = window.location.href.split("/page/employee/");
        rest_endpoint = 'Employees';
        buttons_class_string = '_3p2ELBWrCGJ7u9YnvzQPGJ';
    }

    waitForKeyElements ('.'+buttons_class_string, actionFunction);

    function actionFunction (jNode) {
        //-- DO WHAT YOU WANT TO THE TARGETED ELEMENTS HERE.
        //
        // create the rest button
        placeHolder = document.getElementsByClassName(buttons_class_string)[0];
        clone = placeHolder.lastChild.cloneNode(true);
        clone.href = url_split[0] + '/REST/1/'+rest_endpoint+'/' + url_split[1].split('/')[0];
        clone.dataset.title = "REST";
        clone.innerText = "REST";
        clone.className = clone.className.split(' ')[0];
        clone.style.removeProperty('border');
        placeHolder.append(clone);
    }
})();