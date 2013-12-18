"use strict";
var bg ,
    out = document.getElementsByTagName("output")[0];

(function () {
    chrome.runtime.getBackgroundPage(function (b) {

        bg = b;

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
        });

        t = document.getElementById("clkBg");
        t.checked = bg.bg;
        t.addEventListener("change", function () {
            var v = this.checked;
            localStorage.setItem("clkBg", JSON.stringify(v));
            bg.bg = v;
        });

        t = document.getElementById("beta");
        t.checked = bg.bt;
        t.addEventListener("change", function () {
            var v = this.checked;
            localStorage.setItem("beta", JSON.stringify(v));
            bg.bt = v;
        })
    });

    var t=document.getElementsByTagName("footer")[0],o=chrome.runtime.getManifest();
    //<a>2013@windlibra</a><span>ver 0.4</span>
    t.innerHTML="<span>2013@"+ (o.hasOwnProperty("developer")?o.developer.name:"windlibra")+"</span><span>ver "+ o.version+"</span>"

})();