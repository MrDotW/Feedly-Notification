"use strict";
var oa = null,
    fdl = ["cloud.feedly.com", "http://cloud.feedly.com/", "https://cloud.feedly.com/", "*//cloud.feedly.com/*"],
    idx = 1,
    tim = 3,
    flag = true,
    on = false,
    btn = {
        icn: function () {
            chrome.browserAction.setIcon({"path": "/img/icn_19" + (flag ? ".png" : "b.png")})
        },
        bdg: function (i) {
            on || chrome.browserAction.setBadgeText({"text": i ? (i > 99 ? "..." : i.toString()) : ""})
        },
        clk: function () {
            chrome.tabs.query({"url": fdl[idx]}, function (t) {
                t.length ? chrome.tabs[on ? "update" : "reload"](t[0].id, {"active": true}) : chrome.tabs.create({"url": fdl[idx]});
            });
        }
    },
    oaGet = function () {
        var ck;
        if (!flag || chrome.cookies.getAll({"domain": fdl[0], "name": "session@cloud"}, function (ck) {
            ck = ck[0];
            if (ck) {
                oa = "OAuth " + JSON.parse(ck.value).feedlyToken;
                localStorage.setItem("oa", oa);
                unGet();
                return false
            } else {
                return true
            }
        })) {
            localStorage.removeItem("oa");
            oa = "";
            chrome.alarms.clearAll();
            btn.clk();
        }
        btn.icn();

    },
    unGet = function () {
        var xml = new XMLHttpRequest;
        xml.open("GET", fdl[idx] + "v3/markers/counts?ck=" + new Date().getTime());
        xml.onloadend = function () {
            switch (xml.status) {
                case 200:
                    var un = JSON.parse(xml.response).unreadcounts, n = 0;
                    un.some(function (i) {
                        return i.id && /\/category\/global\.all$/.test(i.id) ? (n = i.count, true) : false;
                    });
                    btn.bdg(n);
                    break;
                case 401:
                    flag = false;
                    oaGet();
            }
        };
        xml.setRequestHeader("$Authorization.feedly", "$FeedlyAuth");
        xml.setRequestHeader("Authorization", oa);
        xml.send();

        chrome.alarms.create({"delayInMinutes": tim});
    };

(function () {
    btn.bdg("");
    chrome.runtime.onMessage.addListener(
        function (data) {

            switch (data.id) {
                case "oa":
                    data = "OAuth " + data.oa;
                    if (data != oa) {
                        oa = "OAuth " + JSON.parse(ck.value).feedlyToken;
                        localStorage.setItem("oa", JSON.stringify(oa));
                    }
                    break;
                case "on":
                    if (!oa) {
                        flag = true;
                        oaGet();
                    }
                    btn.bdg("on");
                    chrome.alarms.clearAll();
                    on = true;
                    break;
                case "off":
                    on = false;
                    btn.bdg(data.un);
                    unGet();
                    break;
                case "clr":
                    flag = false;
                    oaGet();
                    break;
            }
        });

    chrome.browserAction.onClicked.addListener(btn.clk);

    chrome.alarms.onAlarm.addListener(unGet);


    idx = JSON.parse(localStorage.getItem("https")) ? 2 : 1;
    tim = JSON.parse(localStorage.getItem("time")) || 3;

    (oa = localStorage.getItem("oa")) ? unGet() : oaGet();

    btn.icn();

})();