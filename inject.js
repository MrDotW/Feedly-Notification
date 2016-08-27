"use strict";
var flag;


(function () {

    window.addEventListener("storage", function (e) {
        if (e.key) {
            if (e.key == "feedly.session" && e.newValue) {
                e = JSON.parse(e.newValue);
                chrome.runtime.sendMessage({"id": "oa", "oa": e.feedlyToken, "i": e.id})
            }
        } else {
            chrome.runtime.sendMessage({"id": "clr"});
        }
    });

    var tmp = document.hasOwnProperty("hidden") ? ["hidden", ""] : ["webkitHidden", "webkit"];
    flag = tmp[0];
    tmp = tmp[1];

    document.addEventListener(tmp + "visibilitychange", function () {
        if (document[flag]) {
            var d=document.querySelector("#latesttab_header div");
            chrome.runtime.sendMessage({"id": "off", "un": d?parseInt(d.innerHTML) || 0:0});
        } else {
            chrome.runtime.sendMessage({"id": "on"})
        }
    });
    window.addEventListener("beforeunload", function () {
        chrome.runtime.sendMessage({"id": "off"})
    });

    setTimeout(function () {
        document[flag] || chrome.runtime.sendMessage({"id": "on"})
    }, 3000);
})();
