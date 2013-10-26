"use strict";
var bg = chrome.extension.getBackgroundPage(),
    out = document.getElementsByTagName("output")[0];

(function () {

    out.value = bg.tim;
    var t = document.getElementById("time");
    t.value = bg.tim;


    t.addEventListener("change", function () {
        var v = parseInt(this.value, 10);
        out.value = v;
        localStorage.setItem("time", JSON.stringify(v));
        bg.tim = v;
    });
    t = document.getElementById("https");
    t.checked = (bg.idx == 2);
    t.addEventListener("change", function () {
        var v = this.checked;
        localStorage.setItem("https", JSON.stringify(v));
        bg.idx = v ? 2 : 1;
    })

})();