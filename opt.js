"use strict";
var bg ,
    dom = {
        out: document.getElementsByTagName("output")[0],
        btn: document.getElementById("secBtn"),
        rd: document.getElementsByTagName("select")[0]
    },
    ls = function (k, i) {
        localStorage.setItem(k, JSON.stringify(bg.prf[k] = i))
        //console.log(k + ":" + i + "," + flag);

    };

(function () {
    chrome = chrome.runtime?chrome:browser,
      chrome.runtime.getBackgroundPage(function (b) {

        bg = b;

        //refresh time
        var ins = document.getElementById("time");
        dom.out.innerText = ins.value = bg.prf.time;
        ins.addEventListener("change", function () {
            var v = parseInt(this.value);
            dom.out.innerText = v;
            ls("time", v);
        });

        //https
        ins = document.getElementById("https");
        ins.checked = bg.prf.https;
        ins.addEventListener("change", function () {
            ls("https", this.checked);
        });

        //click btn
        document.querySelector("#secBtn div").addEventListener("change", function (e) {
            e = e.srcElement;
            var v = e.value;
            if (isNaN(v)) {
                ls("beta", e.checked)
            } else {
                ls("btn", parseInt(v));
                dom.btn.setAttribute("class", v < 2 ? "beta" : "pp");
                bg.btn.init();
            }
        });
        document.getElementById("beta").checked = bg.prf.beta;
        document.getElementsByName("btn")[bg.prf.btn].checked = true;
        dom.btn.setAttribute("class", bg.prf.btn < 2 ? "beta" : "pp");

    });


    //footer content
    var o = chrome.runtime.getManifest();
    document.getElementsByTagName("footer")[0].innerHTML = "<span>2013, 2014, 2016@" + (o.hasOwnProperty("developer") ? o.developer.name : "windlibra") + "</span><span>ver " + o.version + "</span>"

})();
