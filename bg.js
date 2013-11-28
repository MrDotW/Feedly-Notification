"use strict";
var oa = null,
    fdl = ["feedly.com", "http://feedly.com/", "https://feedly.com/", "*//feedly.com/*"],
    idx = 1,
    tim = 3,
    bg = false,
    flag = true,
    on ,
    btn = {
        icn: function () {
            chrome.browserAction.setIcon({"path": flag ?
            {
                "19": "/img/icn_19.png",
                "38": "/img/icn_19@2x.png"
            } : {
                "19": "/img/icn_19b.png",
                "38": "/img/icn_19b@2x.png"
            }})
        },
        bdg: function (i) {
            on || chrome.browserAction.setBadgeText({"text": i ? (i > 99 ? "..." : i.toString()) : ""})
        },
        clk: function () {
            chrome.tabs.query({"url": fdl[idx]}, function (t) {
                t.length ? (on ? chrome.tabs.reload(t[0].id) : chrome.tabs.update(t[0].id, {"active": true})) : chrome.tabs.create({"url": fdl[idx], "active": !bg});
            });
        }
    },
    oaGet = function () {
        if (!flag || chrome.cookies.getAll({"domain": fdl[0], "name": "session@cloud"}, function (ck) {
            ck.some(function (c) {
                if (c.domain == fdl[0]) {
                    oa = "OAuth " + JSON.parse(c.value).feedlyToken;
                    localStorage.setItem("oa", oa);
                    unGet();

                    return true
                } else {
                    return false
                }
            })
        })) {
            localStorage.removeItem("oa");
            oa = "";
            chrome.alarms.clearAll();
            btn.clk();
        }
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
            btn.icn();
        };
        xml.setRequestHeader("$Authorization.feedly", "$FeedlyAuth");
        xml.setRequestHeader("Authorization", oa);
        xml.send();

        chrome.alarms.create({"delayInMinutes": tim});
    };

(function () {
    btn.bdg("");
    on = false;
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
    bg = JSON.parse(localStorage.getItem("clkBg")) || false;

    (oa = localStorage.getItem("oa")) ? unGet() : oaGet();

})();