// ==UserScript==
// @name         OA Open Size In New Tab
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       DZE
// @match        *://*.openasset.com/page/files/*
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
        sizes_class_string,
        new_tab_button_str,
        download_button_url,
        test_2,
        test_3,
        button_anchor,
		clone;

    if (window.location.href.includes("/page/files/")){
        sizes_class_string = '_3zmM1KhcyePM7WF8jZ9jd';
        //sizes_class_string = '_1u0k2OrrqcyK_hfnKQJymQ';
    }

    waitForKeyElements ('.'+sizes_class_string, actionFunction);

    function actionFunction (jNode) {
        //-- DO WHAT YOU WANT TO THE TARGETED ELEMENTS HERE.
        //
        // create the rest button
        placeHolder = document.getElementsByClassName(sizes_class_string)[0];
        //clone = placeHolder.lastChild.cloneNode(true);

        console.log('test');

       // test_1 = document.getElementsByClassName(sizes_class_string)[0];
        //test_1.getElementsByClassName("_2piMEf5j6R9em_qHRfceaP");
        test_2 = placeHolder.getElementsByClassName("_2piMEf5j6R9em_qHRfceaP");

        download_button_url = test_2[0].getElementsByTagName('a')[0].href.replace('//downloads.openasset.com/','//data.openasset.com/');

        new_tab_button_str = '<a class="_3rnHUjnjyGt3UNJ-6uYT9B _3H0H8rXrKRAmaSJaHF8eD1" href="'+download_button_url+'" data-title="Open Size in new tab" target="_blank"><div class="_1id5Br_xpWc4LgFhJ6yPfL"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M464 32H48C21.5 32 0 53.5 0 80v352c0 26.5 21.5 48 48 48h416c26.5 0 48-21.5 48-48V80c0-26.5-21.5-48-48-48zM48 92c0-6.6 5.4-12 12-12h40c6.6 0 12 5.4 12 12v24c0 6.6-5.4 12-12 12H60c-6.6 0-12-5.4-12-12V92zm416 334c0 3.3-2.7 6-6 6H54c-3.3 0-6-2.7-6-6V168h416v258zm0-310c0 6.6-5.4 12-12 12H172c-6.6 0-12-5.4-12-12V92c0-6.6 5.4-12 12-12h280c6.6 0 12 5.4 12 12v24z"></path></svg></div></a>'
        test_3 = document.createElement('div');
        test_3.style['width'] = "20px";
        test_3.style['height'] = "20px";
        test_3.style['background-color'] = "white";
        test_3.style['color'] = "blue"; // not working ...
        test_3.innerHTML = new_tab_button_str;
        test_2[0].append(test_3);


        //clone.dataset.title = "REST";
        //clone.innerHTML = "REST";
        //placeHolder.append(clone);
    }
})();