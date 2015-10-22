function main(e) {
    var t, r = Viva.Graph.graph(),
        i = parseInt(e.getUserID(), 10),
        o = !0,
        n = ["#b3b3b3", "#D28E00", "#731DD6", "#0081E2", "#1FB084", "#35993A", "#B3D66F", "#D2C7FB", "#00CBCD", "#2A33D5", "#802466", "#899000"],
        a = Viva.Graph.View.webglGraphics(),
        s = function (e) {
            var i = _.isCompleted(),
                o = i && e;
            if (o) $("#log").addClass("error").text(e);
            else if (i) {
                var n = r.getNodesCount();
                $("#log").text("Showing " + n + " friends").fadeOut(9e3), t && p(t)
            } else $("#log").text(e);
            $("#log").css("margin-left", -$("#log").width() / 2)
        },
        d = function () {
            $("#log").removeClass("error").stop(!0, !0).text("Searching friends...").css("margin-left", -$("#log").width() / 2).show()
        },
        u = function (e) {
            if (e.data.is_app_user && !e.data.friendsKnown) {
                var t = C.addFriendsOfFriend(e.id);
                d(), t.update(s), e.data.friendsKnown = !0
            }
        },
        c = function (e) {
            var t = $("#hoveredName"),
                r = '<br/><img src="https://graph.facebook.com/' + e.id + '/picture?type=large" alt="' + e.data.name + '"></img>';
            t.empty().text(e.data.name).append(r).show()
        },
        f = function () {
            $("#hoveredName").hide().empty()
        },
        h = function () {
            $("#detailedInfo").hide()
        },
        p = function (o) {
            var n = $("#detailedInfo"),
                a = "https://graph.facebook.com/" + o.id + "/picture?type=large",
                s = o.data,
                d = $("#imgAvatar", n),
                c = d.clone(),
                l = $("#name", n);
            t = o, d.remove(), c.attr("src", "").attr("src", a).insertAfter(l), l.text(s.name), $("#friendsShown", n).text(r.getLinks(o.id).length);
            var f = "number" == typeof s.friend_count ? s.friend_count : "N/A";
            $("#friendsCount", n).text(f);
            var p = $("#send_request_or_build_net"),
                g = r.hasLink(i, o.id) || r.hasLink(o.id, i);
            $("#request_sent_info").remove(), s.is_app_user && !s.friendsKnown && g ? p.text("Show " + s.name + "'s friends").show().unbind("click").click(function () {
                u(o)
            }) : g ? s.is_app_user || (o.appRequestSent ? p.hide().after('<div id="request_sent_info">App request sent</div>') : p.text("Invite to Yasiv").show().unbind("click").click(function () {
                e.ui({
                    method: "apprequests",
                    message: "This app shows web of your Facebook friends.",
                    to: o.id
                }, function (e) {
                    e && e.action === !0 && (p.hide().after('<div id="request_sent_info">App request sent</div>'), o.appRequestSent = !0)
                })
            })) : o.friendRequestSent ? p.hide().after('<div id="request_sent_info">Friend request sent</div>') : p.text("Send friend request...").show().unbind("click").click(function () {
                e.ui({
                    method: "friends.add",
                    id: o.id
                }, function (e) {
                    e && e.action === !0 && (p.hide().after('<div id="request_sent_info">Friend request sent</div>'), o.friendRequestSent = !0)
                })
            }), $("#send_message").unbind("click").click(function () {
                e.ui({
                    method: "send",
                    to: o.id,
                    name: "This app shows web of your friends on Facebook",
                    link: "http://www.yasiv.com/facebook"
                })
            }), $("#removeFromVisualization", n).unbind("click").click(function () {
                r.removeNode(o.id), h()
            }), $("#gotoFacebook", n).attr("href", s.profile_url), o.selectedColor = o.selectedColor || $(".color_select").first(), o.selectedColor && ($(".color_select").removeClass("selected_color"), o.selectedColor.addClass("selected_color")), n.show()
        },
        v = function (e) {
            e.node(function (e) {
                var t = Viva.Graph.svg("g"),
                    r = Viva.Graph.svg("image").attr("width", 64).attr("height", 64).link(e.data.pic_square);
                return t.append(r), $(t).hover(function () {
                    c(e)
                }, function () {
                    f()
                }).dblclick(function (t) {
                    t.stopPropagation(), u(e)
                }).click(function (t) {
                    t.stopPropagation(), p(e)
                }), t
            }).placeNode(function (e, t) {
                e.attr("transform", "translate(" + (t.x - 32) + ", " + (t.y - 32) + ")")
            })
        },
        m = 16059531,
        w = 40680,
        y = 13421772,
        b = function (e) {
            e.setNodeProgram(Viva.Graph.View.webglCustomNodeProgram()), e.node(function (e) {
                var t = w,
                    r = e.data.sex;
                o && ("female" === r ? t = m : "male" !== r && (t = y));
                var i = Viva.Graph.View.webglSquare(24, t);
                return i
            }).link(function () {
                var e = Viva.Graph.View.webglLine(3014898687);
                return e.oldColor = 3014898687, e
            });
            var t = Viva.Graph.webglInputEvents(e, r),
                i = null,
                n = function (t, i) {
                    t && t.id && r.forEachLinkedNode(t.id, function (t, r) {
                        var o = e.getLinkUI(r.id);
                        o.color = i || o.oldColor
                    })
                };
            t.mouseEnter(function (t) {
                c(t), n(i), i = t, r.forEachLinkedNode(t.id, function (t, r) {
                    var i = e.getLinkUI(r.id);
                    i.color = 4278190335, e.bringLinkToFront(i)
                }), I.rerender()
            }).mouseLeave(function (e) {
                f(), n(i), i = null, n(e), I.rerender()
            }).dblClick(function (e) {
                u(e)
            }).click(function (e) {
                p(e)
            })
        },
        S = !0,
        P = function (e) {
            if (A) {
                var t = a.getNodeUI(e.id);
                t.size = 100
            }
        },
        k = {
            springLength: 80,
            springCoeff: 1e-4,
            dragCoeff: .05,
            gravity: -60,
            theta: .5
        },
        L = {
            springLength: 10,
            springCoeff: 1e-4,
            dragCoeff: .05,
            gravity: -10,
            theta: .5
        },
        A = a.isSupported(),
        N = Viva.Graph.Layout.forceDirected(r, A ? L : k),
        C = Yasiv.facebookGraphBuilder(r, e, N),
        _ = C.buildMyFriendsGraph();
    A ? b(a) : (a = Viva.Graph.View.svgGraphics(), $(".no_webgl").show(), S = !1, v(a));
    var I = Viva.Graph.View.renderer(r, {
        container: document.getElementById("visualization"),
        graphics: a,
        layout: N,
        renderLinks: S
    });
    if (d(), _.update(s), I.run(), $(".sidebar-close").click(function () {
        h(), t = null,
    }), $("#searchForm").submit(function (e) {
        var t, i, o = $("#searchName").val();
        return o && (t = RegExp("\\b" + o, "ig")), r.forEachNode(function (e) {
            var r = e.data;
            if (o && r.name.match(t)) P(e), i = e;
            else {
                var n = a.getNodeUI(e.id);
                n.size = 24;
            }
        }), i && p(i), I.rerender(), e.preventDefault(), !1
    }), A) {
        $("#searchForm").show();
        var x = $("#linksColor"),
            E = /rgb\((\d+), (\d+), (\d+)\)/;
        x.append('<div class="color_select selected_color" style="background-color:' + n[0] + '"></div>');
        for (var R = 1; n.length > R; ++R) x.append('<div class="color_select" style="background-color:' + n[R] + '"></div>');
        $(".color_select").click(function () {
            $(".color_select").removeClass("selected_color");
            var e = $(this).css("background-color"),
                i = e.match(E),
                o = parseInt(i[1], 10),
                n = parseInt(i[2], 10),
                s = parseInt(i[3], 10),
                d = 255 | s + 256 * n + 256 * 256 * o << 8;
            $(this).addClass("selected_color"), r.forEachLinkedNode(t.id, function (e, t) {
                var r = a.getLinkUI(t.id);
                r.color = d, r.oldColor = d, a.bringLinkToFront(r)
            }), I.rerender(), t.selectedColor = $(this)
        })
    }
    g = r, l = N
}
var Yasiv = Yasiv || {};
Yasiv.utils = function () {
    var e = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return {
        formatDate: function (t, r) {
            if (t) {
                var i = new Date(t),
                    o = "";
                return r && (o += i.getHours() + ":" + i.getMinutes() + " "), o += e[i.getMonth()], o += " " + i.getDate() + ", ", o += i.getFullYear()
            }
        },
        formatNumber: function (e) {
            e += "";
            for (var t = e.split("."), r = t[0], i = t.length > 1 ? "." + t[1] : "", o = /(\d+)(\d{3})/; o.test(r);) r = r.replace(o, "$1,$2");
            return r + i
        },
        getQueryStringValue: function (e) {
            var t = RegExp(e + "=" + "([^&#]*)"),
                r = window.location.hash.match(t);
            return r ? window.unescape(r[1]) : void 0
        }
    }
}, Yasiv.progressToken = function () {
    var e, t = !1,
        r = !1;
    return {
        cancel: function () {
            t = !0
        },
        update: function (t) {
            return "function" == typeof t ? (e = t, this) : e ? (e(t), this) : void 0
        },
        complete: function (e) {
            r = !0, this.update(e)
        },
        isCanceled: function () {
            return t
        },
        isCompleted: function () {
            return r
        },
        reset: function () {
            t = r = !1
        }
    }
}, Yasiv.restClient = function () {
    return {
        get: function (e, t) {
            $.get(e, t)
        },
        getJSON: function (e, t) {
            $.getJSON(e, t).error(function () {
                window.alert("Failed to get json")
            })
        },
        put: function (e, t, r) {
            $.post(e, {
                data: JSON.stringify(t)
            }, r, "json")
        },
        getJSONPE: function (e, t, r) {
            $.jsonp({
                url: e,
                dataType: "jsonp",
                timeout: 15e3,
                success: function (e, r) {
                    t(e, r)
                },
                error: function () {
                    "function" == typeof r && r()
                }
            })
        }
    }
}, Yasiv.importanceBuilder = function (e) {
    return {
        get: function () {
            var t = [];
            e.forEachNode(function (r) {
                var i = 0;
                e.forEachLinkedNode(r.id, function (e, t) {
                    t.toId === e.id && (i += 1)
                }), t[i] || (t[i] = []), t[i].push(r)
            });
            var r = t.length,
                i = [],
                o = 0;
            if (r > 0) for (; --r;) {
                var n = t[r];
                if (n) {
                    o += 1;
                    for (var a = 0; n.length > a; ++a) i.push({
                        id: n[a].id,
                        place: o,
                        rank: r,
                        node: n[a]
                    })
                }
            }
            return i
        }
    }
}, Yasiv.facebookGraphBuilder = function (e, t, r) {
    var i = 70,
        o = 0,
        n = parseInt(t.getUserID(), 10),
        a = Viva.random("I Love U *"),
        s = function (e, t) {
            var r, i, o = e.length,
                n = o / t << 0,
                a = [];
            for (r = 0; n > r; ++r) {
                var s = [];
                for (i = r * t;
                (r + 1) * t > i; ++i) s.push(e[i]);
                a.push(s)
            }
            var d = [];
            for (i = n * t; e.length > i; ++i) d.push(e[i]);
            return d.length && a.push(d), a
        },
        d = function (t, r) {
            t !== r && (e.hasLink(t, r) || e.hasLink(r, t) || e.addLink(t, r))
        },
        u = function (e) {
            for (var t = 0; e.length > t; ++t) {
                var r = parseInt(e[t].uid1, 10),
                    i = parseInt(e[t].uid2, 10);
                d(r, i)
            }
        },
        c = function (e, r, i, n) {
            var a = r[e],
                s = i[a.set1],
                d = i[a.set2],
                l = "(" + s.join(",") + ")",
                f = "(" + d.join(",") + ")",
                h = "SELECT uid1, uid2 FROM friend where uid1 in " + l + " AND uid2 in " + f + " AND uid1 < uid2";
            t.api("/fql", {
                q: h
            }, function (t) {
                if (!n.isCanceled()) {
                    e += 1;
                    var a = Math.round(e * o / r.length);
                    n.update("Analyzed " + a + " out of " + o + " potential connections..."), u(t.data), r.length > e ? c(e, r, i, n) : n.complete()
                }
            })
        },
        l = function (t, u, l) {
            if (!l.isCanceled()) {
                var f, h = t.data,
                    p = h.map(function (e) {
                        return e.uid
                    }),
                    g = s(p, i),
                    v = [],
                    m = e.getNode(u);
                f = m ? r.getNodePosition(m.id) : {
                    x: 0,
                    y: 0
                }, o = p.length * (p.length - 1) / 2, l.update("Found " + p.length + " friends. Analyzing friends connections..."), e.beginUpdate();
                for (var w = 0; h.length > w; ++w) {
                    var y = h[w];
                    if (!e.getNode(y.uid)) {
                        y.uid == n && (y.isPinned = !0);
                        var b = e.addNode(y.uid, y),
                            S = a.nextDouble() * Math.PI;
                        b.position = {
                            x: f.x + 50 * Math.cos(S),
                            y: f.y + 50 * Math.sin(S)
                        }
                    }
                    d(u, y.uid)
                }
                for (e.endUpdate(), w = 0; g.length > w; ++w) for (var P = w; g.length > P; ++P) v.push({
                    set1: w,
                    set2: P
                });
                c(0, v, g, l)
            }
        },
        f = function (e, r) {
            t.api("/fql", {
                q: "SELECT uid, name, pic_square, friend_count,sex,profile_url, is_app_user FROM user WHERE uid = " + e + " OR uid IN (SELECT uid2 FROM friend WHERE uid1 = " + e + ")"
            }, function (t) {
                l(t, e, r)
            })
        };
    return {
        buildMyFriendsGraph: function () {
            var e = Yasiv.progressToken();
            return t.api("/fql", {
                q: "SELECT uid, name, friend_count, sex,profile_url, pic_square FROM user WHERE uid = me() OR uid IN (SELECT uid2 FROM friend WHERE uid1 = me()) and is_app_user = 1"
            }, function (t) {
                var r = t.data;
                f(r[0].uid, e)
            }), e
        },
        addFriendsOfFriend: function (e) {
            var t = Yasiv.progressToken();
            return f(e, t), t
        }
    }
}, Viva.Graph.View.webglDualColorLine = function (e, t) {
    return {
        start: Viva.Graph.View._webglUtil.parseColor(e),
        end: Viva.Graph.View._webglUtil.parseColor(t)
    }
}, Viva.Graph.View.webglDualColorLinkProgram = function () {
    var e, t, r, i, o, n, a, s, d, u, c = 6,
        l = 2 * (2 * Float32Array.BYTES_PER_ELEMENT + Uint32Array.BYTES_PER_ELEMENT),
        f = ["precision mediump float;", "varying vec4 color;", "void main(void) {", "   gl_FragColor = color;", "}"].join("\n"),
        h = ["attribute vec2 a_vertexPos;", "attribute vec4 a_color;", "uniform vec2 u_screenSize;", "uniform mat4 u_transform;", "varying vec4 color;", "void main(void) {", "   gl_Position = u_transform * vec4(a_vertexPos/u_screenSize, 0.0, 1.0);", "   color = a_color.abgr;", "}"].join("\n"),
        p = 0,
        g = new ArrayBuffer(1024 * l),
        v = new Float32Array(g),
        m = new Uint32Array(g),
        w = function () {
            if ((p + 1) * l > g.byteLength) {
                var e = new ArrayBuffer(2 * g.byteLength),
                    t = new Float32Array(e),
                    r = new Uint32Array(e);
                r.set(m), v = t, m = r, g = e
            }
        };
    return {
        load: function (n) {
            t = n, t.blendFunc(t.SRC_ALPHA, t.ONE_MINUS_SRC_ALPHA), t.enable(t.BLEND), i = Viva.Graph.webgl(n), e = i.createProgram(h, f), t.useProgram(e), o = i.getLocations(e, ["a_vertexPos", "a_color", "u_screenSize", "u_transform"]), t.enableVertexAttribArray(o.vertexPos), t.enableVertexAttribArray(o.color), r = t.createBuffer()
        },
        position: function (e, t, r) {
            var i = e.id,
                o = i * c;
            v[o] = t.x, v[o + 1] = t.y, m[o + 2] = e.start, v[o + 3] = r.x, v[o + 4] = r.y, m[o + 5] = e.end
        },
        createLink: function (e) {
            w(), p += 1, n = e.id
        },
        removeLink: function (e) {
            p > 0 && (p -= 1), p > e.id && p > 0 && i.copyArrayPart(m, e.id * c, p * c, c)
        },
        updateTransform: function (e) {
            u = !0, d = e
        },
        updateSize: function (e, t) {
            a = e, s = t, u = !0
        },
        render: function () {
            t.useProgram(e), t.bindBuffer(t.ARRAY_BUFFER, r), t.bufferData(t.ARRAY_BUFFER, g, t.DYNAMIC_DRAW), u && (u = !1, t.uniformMatrix4fv(o.transform, !1, d), t.uniform2f(o.screenSize, a, s)), t.vertexAttribPointer(o.vertexPos, 2, t.FLOAT, !1, 3 * Float32Array.BYTES_PER_ELEMENT, 0), t.vertexAttribPointer(o.color, 4, t.UNSIGNED_BYTE, !0, 3 * Float32Array.BYTES_PER_ELEMENT, 8), t.drawArrays(t.LINES, 0, 2 * p), n = p - 1
        },
        bringToFront: function (e) {
            n > e.id && i.swapArrayPart(m, e.id * c, n * c, c), n > 0 && (n -= 1)
        },
        getFrontLinkId: function () {
            return n
        }
    }
}, Viva.Graph.View.webglCustomNodeProgram = function () {
    var e, t, r, i, o, n, a, s, d, u = 4,
        c = ["precision mediump float;", "varying vec4 color;", "varying float pixelSize;", "void main(void) {", "   if (gl_PointCoord.x <= pixelSize || gl_PointCoord.x >= 1.0-pixelSize || gl_PointCoord.y <= pixelSize || gl_PointCoord.y >= 1. - pixelSize) {", "     gl_FragColor = vec4(color.xyz * 0.3, 1);", "   } else {", "     gl_FragColor = color;", "   }", "}"].join("\n"),
        l = ["attribute vec2 a_vertexPos;", "attribute vec2 a_customAttributes;", "uniform vec2 u_screenSize;", "uniform mat4 u_transform;", "varying vec4 color;", "varying float pixelSize;", "void main(void) {", "   gl_Position = u_transform * vec4(a_vertexPos/u_screenSize, 0, 1);", "   gl_PointSize = a_customAttributes[1] * u_transform[0][0];", "   float c = a_customAttributes[0];", "   color.b = mod(c, 256.0); c = floor(c/256.0);", "   color.g = mod(c, 256.0); c = floor(c/256.0);", "   color.r = mod(c, 256.0); c = floor(c/256.0); color /= 255.0;", "   color.a = 1.0;", "   pixelSize = 1.0/gl_PointSize;", "}"].join("\n"),
        f = new Float32Array(64),
        h = 0;
    return {
        load: function (n) {
            t = n, o = Viva.Graph.webgl(n), e = o.createProgram(l, c), t.useProgram(e), i = o.getLocations(e, ["a_vertexPos", "a_customAttributes", "u_screenSize", "u_transform"]), t.enableVertexAttribArray(i.vertexPos), t.enableVertexAttribArray(i.customAttributes), r = t.createBuffer()
        },
        position: function (e, t) {
            var r = e.id;
            f[r * u] = t.x, f[r * u + 1] = t.y, f[r * u + 2] = e.color, f[r * u + 3] = e.size
        },
        updateTransform: function (e) {
            d = !0, s = e
        },
        updateSize: function (e, t) {
            n = e, a = t, d = !0
        },
        createNode: function () {
            f = o.extendArray(f, h, u), h += 1
        },
        removeNode: function (e) {
            h > 0 && (h -= 1), h > e.id && h > 0 && o.copyArrayPart(f, e.id * u, h * u, u)
        },
        replaceProperties: function () {},
        render: function () {
            t.useProgram(e), t.bindBuffer(t.ARRAY_BUFFER, r), t.bufferData(t.ARRAY_BUFFER, f, t.DYNAMIC_DRAW), d && (d = !1, t.uniformMatrix4fv(i.transform, !1, s), t.uniform2f(i.screenSize, n, a)), t.vertexAttribPointer(i.vertexPos, 2, t.FLOAT, !1, u * Float32Array.BYTES_PER_ELEMENT, 0), t.vertexAttribPointer(i.customAttributes, 2, t.FLOAT, !1, u * Float32Array.BYTES_PER_ELEMENT, 8), t.drawArrays(t.POINTS, 0, h)
        }
    }
};