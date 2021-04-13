// ==UserScript==
// @name         OA REST test v3
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Inject OA REST button to /page/files and /Page/Projects and /Page/Users
// @author       DZE
// @match        *://*/page/files/*
// @match        *://*/Page/Project?id=*
// @match        *://*/Page/Users*
// @grant        none
// @run-at      document-complete
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    let myButton = document.createElement("input"),
		url_split,
        placeHolder;

    myButton.type = "button";
    myButton.value = "REST";
    myButton.onclick = function visitPage(){
        if (window.location.href.includes('files')){
            url_split = window.location.href.split("/page/files/")
            window.location= url_split[0] + '/REST/1/Files/' + url_split[1].split('/')[0];
            myButton.style = "bottom:10px;left:10px;position:absolute;z-index: 9999"
            document.body.appendChild(myButton);
        }
        else if (window.location.href.includes('Project')) {
            url_split = window.location.href.split("/Page/Project?id=")
            window.location = url_split[0] + '/REST/1/Projects/' + url_split[1].split('#')[0];
        }
        else if (window.location.href.includes('Users')) {
            url_split = window.location.href.split("/Page/Users")
            window.location = url_split[0] + '/REST/1/Users';
        }
        else {
        }
    };
    //myButton.style = "bottom:10px;left:10px;position:absolute;z-index: 9999"
    // document.body.appendChild(myButton);
    //var placeHolder = document.getElementsByClassName("_1PciGUCbSukEr4OR50kA0q");
    //placeHolder.appendChild(myButton);
    if (window.location.href.includes('files')){
        myButton.style = "bottom:10px;left:10px;position:absolute;z-index: 9999"
        document.body.appendChild(myButton);
        document.body.appendChild(myButton);
    } else if (window.location.href.includes('Project')) {
        placeHolder = document.getElementsByClassName("content contentFullWidth")[0];
        placeHolder.append(myButton);
    } else if (window.location.href.includes('Users')) {
        placeHolder = document.getElementsByClassName("content contentFixed")[0];
        placeHolder.append(myButton);
    } else {
    }
})();