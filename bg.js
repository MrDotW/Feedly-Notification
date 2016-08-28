"use strict";
var
    chrome = chrome.browserAction?chrome:browser,
    data = {
        oa: null,
        id: null
    },
    prf = {},
    state = {
        oa: 1,//0 not exist; 1 to be verified; 2 verified
        focus: false
    },

    btn = {
        c:chrome.browserAction,
        icn: function () {
            var uri = "/img/icn_19" + (state.oa ? "" : "b");
            btn.c.setIcon({"path": {
                "19": uri + ".png",
                "38": uri + "@2x.png"
            }});
            btn.init();
        },
        bdg: function (i) {
            state.focus || btn.c.setBadgeText({"text": i ? (i > 99 ? "..." : i.toString()) : ""})
        },
        init: function () {
            btn.c.onClicked.removeListener(btn.clk);
            btn.c.setPopup({"popup": ""})
            if (state.oa && (prf.btn == 2)) {
                btn.c.setPopup({"popup": "pp.html"})
            } else {
                btn.c.onClicked.addListener(btn.clk);
            }
        },
        clk: function () {
            chrome.tabs.query({"url": "*://feedly.com/*"}, function (t) {
                t.length ? JJ.tab(state.focus ? "reload" : "update", t[0].id) : JJ.tab((prf.https ? "https" : "http") + "://feedly.com/" + (prf.beta ? "beta" : ""), !prf.btn);
            });
        }
    },
    oaGet = function () {
        if (state.oa < 2) {
            if (state.oa && chrome.cookies.getAll({"domain": "feedly.com", "name": "feedly.session"}, function (ck) {
                ck.some(function (c) {
                    if (c.domain == "feedly.com") {
                        var t = JSON.parse(c.value);
                        if (t.hasOwnProperty("feedlyToken")) {

                            localStorage.setItem("oa", JSON.stringify([data.oa = "OAuth " + t.feedlyToken, data.id = t.id]));
                            unGet();
                        }

                        return true
                    } else {
                        return false
                    }
                })
            })) {
                localStorage.removeItem("oa");
                data.oa = "";
                data.id = "";
                cchrome.alarms && hrome.alarms.clearAll();
                btn.icn();
            }
        }
    },
    unGet = function () {
        if (state.oa) {
            JJ.xml((prf.https ? "https" : "http") + ":feedly.com/v3/markers/counts?ck=",
                function (xml) {
                    switch (xml.status) {
                        case 200:
                            var un = JSON.parse(xml.response).unreadcounts, n = 0;
                            un.some(function (i) {
                                return i.id && /\/category\/global\.all$/.test(i.id) ? (n = i.count, true) : false;
                            });
                            state.oa = 2;
                            btn.icn();
                            btn.bdg(n);
                            break;
                        case 401:
                            state.oa = (state.oa == 1 ? 0 : 1);
                            oaGet();
                    }
                });
                
            if (chrome.alarms){
              chrome.alarms.create({"delayInMinutes": prf.time});
              }else{
                setTimeout(unGet,prf.time*60000)
              }
        }
    },
    JJ = {
        xml: function (url, fun, method, n) {
            var xml = new XMLHttpRequest;
            method = method || "GET";
            xml.n = n || 0;

            xml.open(method, url + new Date().getTime());

            xml.setRequestHeader("$Authorization.feedly", "$FeedlyAuth");
            xml.setRequestHeader("Authorization", data.oa);
            xml.timeout = 10000;
            xml.ontimeout = function () {
                xml.abort();
                if (xml.n < 3) {
                    JJ.xml(url, fun, method, ++xml.n);
                }
            };
            xml.onloadend = function () {
                JJ.xml.n = 0;
                method == "GET" && fun(xml);
            };

            xml.send(method == "PUT" ? fun : "");
        },
        tab: function (act, id) {
            var c = chrome.tabs;
            switch (act) {
                case "reload":
                    c.reload(id);
                    break;
                case "update":
                    c[act](id, {"active": true});
                    break;
                default:
                    c.create({"url": act, "active": id})
            }
        }
    };

chrome.runtime.onInstalled.addListener(
    function (obj) {
        var ls = function (key, item) {
            localStorage.setItem(key, JSON.stringify(item));
        };

        switch (obj.reason) {
            case "install":
                ls("https", true);
                ls("time", 3);
                ls("beta", false);
                ls("btn", 0);

                ls("ppOrderUn", true);
                ls("ppOrderAll", false);
                ls("ppRd", 0);
                break;
            case "update":
                if (obj.previousVersion < 0.5) {
                    localStorage.setItem("btn", JSON.stringify(JSON.parse(localStorage.getItem("clkBg") ? 1 : 0)));
                    localStorage.removeItem("clkBg");
                    localStorage.removeItem("oa");

                    ls("ppOrderUn", true);
                    ls("ppOrderAll", false);
                    ls("ppRd", 0);
                }

        }
    });

chrome.runtime.onMessage.addListener(
    function (obj) {

        switch (obj.id) {
            case "oa":
                obj.oa = "OAuth " + obj.oa;
                if (obj.oa != data.oa) {
                    data.oa = obj.oa;
                    data.id = obj.i;
                    localStorage.setItem("oa", JSON.stringify([data.oa, data.id]));
                    state.oa = 1;
                }
                break;
            case "on":
                if (!state.oa) {
                    state.oa = 1;
                    oaGet();
                }
                btn.bdg("on");
                chrome.alarms.clearAll();
                state.focus = true;
                break;
            case "off":
                state.focus = false;
                btn.bdg("");
                unGet();
                break;
            case "clr":
                state.oa = 0;
                oaGet();
                break;
        }
    });


chrome.alarms && chrome.alarms.onAlarm.addListener(unGet);


(function () {
    btn.bdg("");
    btn.icn();

    ["https", "time", "beta", "btn", "ppOrderUn", "ppOrderAll", "ppRd"].forEach(function (i) {
        prf[i] = JSON.parse(localStorage.getItem(i));
    });

    btn.init();

    if (localStorage.hasOwnProperty("oa")) {
        var t = JSON.parse(localStorage.getItem("oa"));
        data.oa = t[0];
        data.id = t[1];
        unGet()
    } else {
        oaGet()
    }

})();
