"use strict";
var flag;


(function () {


    window.addEventListener("storage", function (e) {
        if (e.key) {
            e.key == "session@cloud" && e.newValue && chrome.runtime.sendMessage({"id": "oa", "oa": JSON.parse(e.newValue).feedlyToken});
        } else {
            chrome.runtime.sendMessage({"id": "clr"});
        }
    });

    var tmp = document.hasOwnProperty("hidden") ? ["hidden", ""] : ["webkitHidden", "webkit"];
    flag = tmp[0];
    tmp = tmp[1];

    document.addEventListener(tmp + "visibilitychange", function () {
        if (document[flag]) {
            chrome.runtime.sendMessage({"id": "off", "un": parseInt(document.querySelector("#latesttab_header div").innerHTML) || 0});
        } else {
            chrome.runtime.sendMessage({"id": "on"})
        }
    })
    chrome.runtime.sendMessage({"id": "on"});
    window.addEventListener("beforeunload",function(){chrome.runtime.sendMessage({"id":"off"})})
})()