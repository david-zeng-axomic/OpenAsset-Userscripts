# OpenAsset-Userscripts

A collection of userscripts various functionality with OpenAsset.

Userscripts are small JavaScript programs that can be used to add new features or modify existing ones on web pages.

You can think of them as a way to automate javascript code that you can paste into the dev tools console, but in a more managed and powerful way. They sort of work like mini-browser extensions, but without the overhead of creating a full browser extension.

Some of these scripts may need to be updated over time if there are any breaking UI changes made ot the codebase.

> If there are any issues with the scripts or any questions about how they currently work, feel free to reach out to **DZE** on slack. Any suggestions for new scripts or improvements to existing ones are welcome.
___

## Prerequisites

An userscript management extension will need to be installed in your browser in order to use this.

I generally use and test with [Tampermonkey](https://www.tampermonkey.net):
- [Chrome](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo)
- [Firefox](https://addons.mozilla.org/en-US/firefox/addon/tampermonkey/)

Once the extension is set up, you should be able to manually add and edit scripts or access a raw `user.js` file link and have userscripts be auto-detected by the extension for installation.

To install a script you can manually navigate to a script file in the repo and click on the "raw" button. Alternatively you can click on the quick links in the sections down below:

___

## Success Help Site Helper
This script makes header tags on the OA Success help site articles clickable. This makes it easier to link to specific sections of a long success article: https://success.openasset.com

### [Install](https://github.com/david-zeng-axomic/OpenAsset-Userscripts/raw/main/Success%20Help%20Site/Success_Help_Site_Helper.user.js)

>### Notes:
> This works by updating header tags with id to add `<a>` links with the `href="#{id}"`. This allows for the headers to be clickable and automatically scrolled into view. The urls in the browser will also update with the `#{id}`.

___

## OA Tab Title Change

This script replaces "OpenAsset - " in the browser tab titles with "{subdomain} | " instead. Makes it easier to keep track of which OA instance the tab is for with just the tab title

### [Install](https://github.com/david-zeng-axomic/OpenAsset-Userscripts/raw/main/OA_Tab_Title_Change/OA_Tab_Title_Change.user.js)

> #### Notes:
> A mutation observer is used to continue checking for any additional tab changes and continue to update the tab title with the new format.

___

## OA Client JWT

This script adds an additional user dropdown menu option to fetch an OA JWT that can be used as a bearer token for the REST api. Clicking the button will fetch a JWT via the REST api and save the jwt response in the clipboard and output it to the console logs.

### [Install](https://github.com/david-zeng-axomic/OpenAsset-Userscripts/raw/main/OA_JWT/OA_Client_JWT.user.js)

> #### Notes:
> This uses two mutation observers to wait for the dropdown menu option to appear and to observer the dropdown menu for when it is opened. When the menu is opened a button for the OA JWT is injected. The push and pop history states changes are also checked to allow for this to continue working even after navigating to different pages.
___

## REST Button
Adds a "REST" button to certain pages to make it easier to navigate to or retrieve the REST api url from the front-end of OA.

> **IMPORTANT: This still needs to be updated to be better.**
>
> Currently this will only work on a page load or reload. If the button does not appear from navigating into the page try refreshing the page.


### [Install]( https://github.com/david-zeng-axomic/OpenAsset-Userscripts/raw/main/REST%20Button/OA_REST_Button.user.js)

### [Install (Legacy)](https://raw.githubusercontent.com/david-zeng-axomic/OpenAsset-Userscripts/main/REST%20Button/OA_REST_Legacy_Button.user.js)


> #### Notes:
> There are currently two scripts because I planed to do a full refactored rewrite to address certain issues and make it easier to maintain/set up but never got around it.