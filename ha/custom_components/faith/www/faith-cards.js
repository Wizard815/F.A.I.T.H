var md = Object.defineProperty;
var vd = (a, u, s) => u in a ? md(a, u, { enumerable: !0, configurable: !0, writable: !0, value: s }) : a[u] = s;
var Ue = (a, u, s) => vd(a, typeof u != "symbol" ? u + "" : u, s);
var Ao = { exports: {} }, _r = {}, $o = { exports: {} }, ne = {};
/**
 * @license React
 * react.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var Va;
function gd() {
  if (Va) return ne;
  Va = 1;
  var a = Symbol.for("react.element"), u = Symbol.for("react.portal"), s = Symbol.for("react.fragment"), E = Symbol.for("react.strict_mode"), N = Symbol.for("react.profiler"), C = Symbol.for("react.provider"), z = Symbol.for("react.context"), P = Symbol.for("react.forward_ref"), v = Symbol.for("react.suspense"), S = Symbol.for("react.memo"), H = Symbol.for("react.lazy"), V = Symbol.iterator;
  function M(d) {
    return d === null || typeof d != "object" ? null : (d = V && d[V] || d["@@iterator"], typeof d == "function" ? d : null);
  }
  var $ = { isMounted: function() {
    return !1;
  }, enqueueForceUpdate: function() {
  }, enqueueReplaceState: function() {
  }, enqueueSetState: function() {
  } }, W = Object.assign, Y = {};
  function q(d, w, D) {
    this.props = d, this.context = w, this.refs = Y, this.updater = D || $;
  }
  q.prototype.isReactComponent = {}, q.prototype.setState = function(d, w) {
    if (typeof d != "object" && typeof d != "function" && d != null) throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");
    this.updater.enqueueSetState(this, d, w, "setState");
  }, q.prototype.forceUpdate = function(d) {
    this.updater.enqueueForceUpdate(this, d, "forceUpdate");
  };
  function pe() {
  }
  pe.prototype = q.prototype;
  function Le(d, w, D) {
    this.props = d, this.context = w, this.refs = Y, this.updater = D || $;
  }
  var Te = Le.prototype = new pe();
  Te.constructor = Le, W(Te, q.prototype), Te.isPureReactComponent = !0;
  var me = Array.isArray, Pe = Object.prototype.hasOwnProperty, fe = { current: null }, ue = { key: !0, ref: !0, __self: !0, __source: !0 };
  function O(d, w, D) {
    var G, te = {}, b = null, se = null;
    if (w != null) for (G in w.ref !== void 0 && (se = w.ref), w.key !== void 0 && (b = "" + w.key), w) Pe.call(w, G) && !ue.hasOwnProperty(G) && (te[G] = w[G]);
    var Z = arguments.length - 2;
    if (Z === 1) te.children = D;
    else if (1 < Z) {
      for (var oe = Array(Z), Ne = 0; Ne < Z; Ne++) oe[Ne] = arguments[Ne + 2];
      te.children = oe;
    }
    if (d && d.defaultProps) for (G in Z = d.defaultProps, Z) te[G] === void 0 && (te[G] = Z[G]);
    return { $$typeof: a, type: d, key: b, ref: se, props: te, _owner: fe.current };
  }
  function le(d, w) {
    return { $$typeof: a, type: d.type, key: w, ref: d.ref, props: d.props, _owner: d._owner };
  }
  function X(d) {
    return typeof d == "object" && d !== null && d.$$typeof === a;
  }
  function ie(d) {
    var w = { "=": "=0", ":": "=2" };
    return "$" + d.replace(/[=:]/g, function(D) {
      return w[D];
    });
  }
  var re = /\/+/g;
  function xe(d, w) {
    return typeof d == "object" && d !== null && d.key != null ? ie("" + d.key) : w.toString(36);
  }
  function Ge(d, w, D, G, te) {
    var b = typeof d;
    (b === "undefined" || b === "boolean") && (d = null);
    var se = !1;
    if (d === null) se = !0;
    else switch (b) {
      case "string":
      case "number":
        se = !0;
        break;
      case "object":
        switch (d.$$typeof) {
          case a:
          case u:
            se = !0;
        }
    }
    if (se) return se = d, te = te(se), d = G === "" ? "." + xe(se, 0) : G, me(te) ? (D = "", d != null && (D = d.replace(re, "$&/") + "/"), Ge(te, w, D, "", function(Ne) {
      return Ne;
    })) : te != null && (X(te) && (te = le(te, D + (!te.key || se && se.key === te.key ? "" : ("" + te.key).replace(re, "$&/") + "/") + d)), w.push(te)), 1;
    if (se = 0, G = G === "" ? "." : G + ":", me(d)) for (var Z = 0; Z < d.length; Z++) {
      b = d[Z];
      var oe = G + xe(b, Z);
      se += Ge(b, w, D, oe, te);
    }
    else if (oe = M(d), typeof oe == "function") for (d = oe.call(d), Z = 0; !(b = d.next()).done; ) b = b.value, oe = G + xe(b, Z++), se += Ge(b, w, D, oe, te);
    else if (b === "object") throw w = String(d), Error("Objects are not valid as a React child (found: " + (w === "[object Object]" ? "object with keys {" + Object.keys(d).join(", ") + "}" : w) + "). If you meant to render a collection of children, use an array instead.");
    return se;
  }
  function Ye(d, w, D) {
    if (d == null) return d;
    var G = [], te = 0;
    return Ge(d, G, "", "", function(b) {
      return w.call(D, b, te++);
    }), G;
  }
  function Ie(d) {
    if (d._status === -1) {
      var w = d._result;
      w = w(), w.then(function(D) {
        (d._status === 0 || d._status === -1) && (d._status = 1, d._result = D);
      }, function(D) {
        (d._status === 0 || d._status === -1) && (d._status = 2, d._result = D);
      }), d._status === -1 && (d._status = 0, d._result = w);
    }
    if (d._status === 1) return d._result.default;
    throw d._result;
  }
  var we = { current: null }, L = { transition: null }, x = { ReactCurrentDispatcher: we, ReactCurrentBatchConfig: L, ReactCurrentOwner: fe };
  function k() {
    throw Error("act(...) is not supported in production builds of React.");
  }
  return ne.Children = { map: Ye, forEach: function(d, w, D) {
    Ye(d, function() {
      w.apply(this, arguments);
    }, D);
  }, count: function(d) {
    var w = 0;
    return Ye(d, function() {
      w++;
    }), w;
  }, toArray: function(d) {
    return Ye(d, function(w) {
      return w;
    }) || [];
  }, only: function(d) {
    if (!X(d)) throw Error("React.Children.only expected to receive a single React element child.");
    return d;
  } }, ne.Component = q, ne.Fragment = s, ne.Profiler = N, ne.PureComponent = Le, ne.StrictMode = E, ne.Suspense = v, ne.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = x, ne.act = k, ne.cloneElement = function(d, w, D) {
    if (d == null) throw Error("React.cloneElement(...): The argument must be a React element, but you passed " + d + ".");
    var G = W({}, d.props), te = d.key, b = d.ref, se = d._owner;
    if (w != null) {
      if (w.ref !== void 0 && (b = w.ref, se = fe.current), w.key !== void 0 && (te = "" + w.key), d.type && d.type.defaultProps) var Z = d.type.defaultProps;
      for (oe in w) Pe.call(w, oe) && !ue.hasOwnProperty(oe) && (G[oe] = w[oe] === void 0 && Z !== void 0 ? Z[oe] : w[oe]);
    }
    var oe = arguments.length - 2;
    if (oe === 1) G.children = D;
    else if (1 < oe) {
      Z = Array(oe);
      for (var Ne = 0; Ne < oe; Ne++) Z[Ne] = arguments[Ne + 2];
      G.children = Z;
    }
    return { $$typeof: a, type: d.type, key: te, ref: b, props: G, _owner: se };
  }, ne.createContext = function(d) {
    return d = { $$typeof: z, _currentValue: d, _currentValue2: d, _threadCount: 0, Provider: null, Consumer: null, _defaultValue: null, _globalName: null }, d.Provider = { $$typeof: C, _context: d }, d.Consumer = d;
  }, ne.createElement = O, ne.createFactory = function(d) {
    var w = O.bind(null, d);
    return w.type = d, w;
  }, ne.createRef = function() {
    return { current: null };
  }, ne.forwardRef = function(d) {
    return { $$typeof: P, render: d };
  }, ne.isValidElement = X, ne.lazy = function(d) {
    return { $$typeof: H, _payload: { _status: -1, _result: d }, _init: Ie };
  }, ne.memo = function(d, w) {
    return { $$typeof: S, type: d, compare: w === void 0 ? null : w };
  }, ne.startTransition = function(d) {
    var w = L.transition;
    L.transition = {};
    try {
      d();
    } finally {
      L.transition = w;
    }
  }, ne.unstable_act = k, ne.useCallback = function(d, w) {
    return we.current.useCallback(d, w);
  }, ne.useContext = function(d) {
    return we.current.useContext(d);
  }, ne.useDebugValue = function() {
  }, ne.useDeferredValue = function(d) {
    return we.current.useDeferredValue(d);
  }, ne.useEffect = function(d, w) {
    return we.current.useEffect(d, w);
  }, ne.useId = function() {
    return we.current.useId();
  }, ne.useImperativeHandle = function(d, w, D) {
    return we.current.useImperativeHandle(d, w, D);
  }, ne.useInsertionEffect = function(d, w) {
    return we.current.useInsertionEffect(d, w);
  }, ne.useLayoutEffect = function(d, w) {
    return we.current.useLayoutEffect(d, w);
  }, ne.useMemo = function(d, w) {
    return we.current.useMemo(d, w);
  }, ne.useReducer = function(d, w, D) {
    return we.current.useReducer(d, w, D);
  }, ne.useRef = function(d) {
    return we.current.useRef(d);
  }, ne.useState = function(d) {
    return we.current.useState(d);
  }, ne.useSyncExternalStore = function(d, w, D) {
    return we.current.useSyncExternalStore(d, w, D);
  }, ne.useTransition = function() {
    return we.current.useTransition();
  }, ne.version = "18.3.1", ne;
}
var Wa;
function Go() {
  return Wa || (Wa = 1, $o.exports = gd()), $o.exports;
}
/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var Qa;
function yd() {
  if (Qa) return _r;
  Qa = 1;
  var a = Go(), u = Symbol.for("react.element"), s = Symbol.for("react.fragment"), E = Object.prototype.hasOwnProperty, N = a.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner, C = { key: !0, ref: !0, __self: !0, __source: !0 };
  function z(P, v, S) {
    var H, V = {}, M = null, $ = null;
    S !== void 0 && (M = "" + S), v.key !== void 0 && (M = "" + v.key), v.ref !== void 0 && ($ = v.ref);
    for (H in v) E.call(v, H) && !C.hasOwnProperty(H) && (V[H] = v[H]);
    if (P && P.defaultProps) for (H in v = P.defaultProps, v) V[H] === void 0 && (V[H] = v[H]);
    return { $$typeof: u, type: P, key: M, ref: $, props: V, _owner: N.current };
  }
  return _r.Fragment = s, _r.jsx = z, _r.jsxs = z, _r;
}
var Ka;
function xd() {
  return Ka || (Ka = 1, Ao.exports = yd()), Ao.exports;
}
var c = xd(), ee = Go(), Hl = {}, Uo = { exports: {} }, et = {}, Ho = { exports: {} }, Bo = {};
/**
 * @license React
 * scheduler.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var Ga;
function wd() {
  return Ga || (Ga = 1, (function(a) {
    function u(L, x) {
      var k = L.length;
      L.push(x);
      e: for (; 0 < k; ) {
        var d = k - 1 >>> 1, w = L[d];
        if (0 < N(w, x)) L[d] = x, L[k] = w, k = d;
        else break e;
      }
    }
    function s(L) {
      return L.length === 0 ? null : L[0];
    }
    function E(L) {
      if (L.length === 0) return null;
      var x = L[0], k = L.pop();
      if (k !== x) {
        L[0] = k;
        e: for (var d = 0, w = L.length, D = w >>> 1; d < D; ) {
          var G = 2 * (d + 1) - 1, te = L[G], b = G + 1, se = L[b];
          if (0 > N(te, k)) b < w && 0 > N(se, te) ? (L[d] = se, L[b] = k, d = b) : (L[d] = te, L[G] = k, d = G);
          else if (b < w && 0 > N(se, k)) L[d] = se, L[b] = k, d = b;
          else break e;
        }
      }
      return x;
    }
    function N(L, x) {
      var k = L.sortIndex - x.sortIndex;
      return k !== 0 ? k : L.id - x.id;
    }
    if (typeof performance == "object" && typeof performance.now == "function") {
      var C = performance;
      a.unstable_now = function() {
        return C.now();
      };
    } else {
      var z = Date, P = z.now();
      a.unstable_now = function() {
        return z.now() - P;
      };
    }
    var v = [], S = [], H = 1, V = null, M = 3, $ = !1, W = !1, Y = !1, q = typeof setTimeout == "function" ? setTimeout : null, pe = typeof clearTimeout == "function" ? clearTimeout : null, Le = typeof setImmediate < "u" ? setImmediate : null;
    typeof navigator < "u" && navigator.scheduling !== void 0 && navigator.scheduling.isInputPending !== void 0 && navigator.scheduling.isInputPending.bind(navigator.scheduling);
    function Te(L) {
      for (var x = s(S); x !== null; ) {
        if (x.callback === null) E(S);
        else if (x.startTime <= L) E(S), x.sortIndex = x.expirationTime, u(v, x);
        else break;
        x = s(S);
      }
    }
    function me(L) {
      if (Y = !1, Te(L), !W) if (s(v) !== null) W = !0, Ie(Pe);
      else {
        var x = s(S);
        x !== null && we(me, x.startTime - L);
      }
    }
    function Pe(L, x) {
      W = !1, Y && (Y = !1, pe(O), O = -1), $ = !0;
      var k = M;
      try {
        for (Te(x), V = s(v); V !== null && (!(V.expirationTime > x) || L && !ie()); ) {
          var d = V.callback;
          if (typeof d == "function") {
            V.callback = null, M = V.priorityLevel;
            var w = d(V.expirationTime <= x);
            x = a.unstable_now(), typeof w == "function" ? V.callback = w : V === s(v) && E(v), Te(x);
          } else E(v);
          V = s(v);
        }
        if (V !== null) var D = !0;
        else {
          var G = s(S);
          G !== null && we(me, G.startTime - x), D = !1;
        }
        return D;
      } finally {
        V = null, M = k, $ = !1;
      }
    }
    var fe = !1, ue = null, O = -1, le = 5, X = -1;
    function ie() {
      return !(a.unstable_now() - X < le);
    }
    function re() {
      if (ue !== null) {
        var L = a.unstable_now();
        X = L;
        var x = !0;
        try {
          x = ue(!0, L);
        } finally {
          x ? xe() : (fe = !1, ue = null);
        }
      } else fe = !1;
    }
    var xe;
    if (typeof Le == "function") xe = function() {
      Le(re);
    };
    else if (typeof MessageChannel < "u") {
      var Ge = new MessageChannel(), Ye = Ge.port2;
      Ge.port1.onmessage = re, xe = function() {
        Ye.postMessage(null);
      };
    } else xe = function() {
      q(re, 0);
    };
    function Ie(L) {
      ue = L, fe || (fe = !0, xe());
    }
    function we(L, x) {
      O = q(function() {
        L(a.unstable_now());
      }, x);
    }
    a.unstable_IdlePriority = 5, a.unstable_ImmediatePriority = 1, a.unstable_LowPriority = 4, a.unstable_NormalPriority = 3, a.unstable_Profiling = null, a.unstable_UserBlockingPriority = 2, a.unstable_cancelCallback = function(L) {
      L.callback = null;
    }, a.unstable_continueExecution = function() {
      W || $ || (W = !0, Ie(Pe));
    }, a.unstable_forceFrameRate = function(L) {
      0 > L || 125 < L ? console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported") : le = 0 < L ? Math.floor(1e3 / L) : 5;
    }, a.unstable_getCurrentPriorityLevel = function() {
      return M;
    }, a.unstable_getFirstCallbackNode = function() {
      return s(v);
    }, a.unstable_next = function(L) {
      switch (M) {
        case 1:
        case 2:
        case 3:
          var x = 3;
          break;
        default:
          x = M;
      }
      var k = M;
      M = x;
      try {
        return L();
      } finally {
        M = k;
      }
    }, a.unstable_pauseExecution = function() {
    }, a.unstable_requestPaint = function() {
    }, a.unstable_runWithPriority = function(L, x) {
      switch (L) {
        case 1:
        case 2:
        case 3:
        case 4:
        case 5:
          break;
        default:
          L = 3;
      }
      var k = M;
      M = L;
      try {
        return x();
      } finally {
        M = k;
      }
    }, a.unstable_scheduleCallback = function(L, x, k) {
      var d = a.unstable_now();
      switch (typeof k == "object" && k !== null ? (k = k.delay, k = typeof k == "number" && 0 < k ? d + k : d) : k = d, L) {
        case 1:
          var w = -1;
          break;
        case 2:
          w = 250;
          break;
        case 5:
          w = 1073741823;
          break;
        case 4:
          w = 1e4;
          break;
        default:
          w = 5e3;
      }
      return w = k + w, L = { id: H++, callback: x, priorityLevel: L, startTime: k, expirationTime: w, sortIndex: -1 }, k > d ? (L.sortIndex = k, u(S, L), s(v) === null && L === s(S) && (Y ? (pe(O), O = -1) : Y = !0, we(me, k - d))) : (L.sortIndex = w, u(v, L), W || $ || (W = !0, Ie(Pe))), L;
    }, a.unstable_shouldYield = ie, a.unstable_wrapCallback = function(L) {
      var x = M;
      return function() {
        var k = M;
        M = x;
        try {
          return L.apply(this, arguments);
        } finally {
          M = k;
        }
      };
    };
  })(Bo)), Bo;
}
var Ya;
function kd() {
  return Ya || (Ya = 1, Ho.exports = wd()), Ho.exports;
}
/**
 * @license React
 * react-dom.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var Xa;
function Sd() {
  if (Xa) return et;
  Xa = 1;
  var a = Go(), u = kd();
  function s(e) {
    for (var t = "https://reactjs.org/docs/error-decoder.html?invariant=" + e, n = 1; n < arguments.length; n++) t += "&args[]=" + encodeURIComponent(arguments[n]);
    return "Minified React error #" + e + "; visit " + t + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
  }
  var E = /* @__PURE__ */ new Set(), N = {};
  function C(e, t) {
    z(e, t), z(e + "Capture", t);
  }
  function z(e, t) {
    for (N[e] = t, e = 0; e < t.length; e++) E.add(t[e]);
  }
  var P = !(typeof window > "u" || typeof window.document > "u" || typeof window.document.createElement > "u"), v = Object.prototype.hasOwnProperty, S = /^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/, H = {}, V = {};
  function M(e) {
    return v.call(V, e) ? !0 : v.call(H, e) ? !1 : S.test(e) ? V[e] = !0 : (H[e] = !0, !1);
  }
  function $(e, t, n, r) {
    if (n !== null && n.type === 0) return !1;
    switch (typeof t) {
      case "function":
      case "symbol":
        return !0;
      case "boolean":
        return r ? !1 : n !== null ? !n.acceptsBooleans : (e = e.toLowerCase().slice(0, 5), e !== "data-" && e !== "aria-");
      default:
        return !1;
    }
  }
  function W(e, t, n, r) {
    if (t === null || typeof t > "u" || $(e, t, n, r)) return !0;
    if (r) return !1;
    if (n !== null) switch (n.type) {
      case 3:
        return !t;
      case 4:
        return t === !1;
      case 5:
        return isNaN(t);
      case 6:
        return isNaN(t) || 1 > t;
    }
    return !1;
  }
  function Y(e, t, n, r, l, i, o) {
    this.acceptsBooleans = t === 2 || t === 3 || t === 4, this.attributeName = r, this.attributeNamespace = l, this.mustUseProperty = n, this.propertyName = e, this.type = t, this.sanitizeURL = i, this.removeEmptyString = o;
  }
  var q = {};
  "children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style".split(" ").forEach(function(e) {
    q[e] = new Y(e, 0, !1, e, null, !1, !1);
  }), [["acceptCharset", "accept-charset"], ["className", "class"], ["htmlFor", "for"], ["httpEquiv", "http-equiv"]].forEach(function(e) {
    var t = e[0];
    q[t] = new Y(t, 1, !1, e[1], null, !1, !1);
  }), ["contentEditable", "draggable", "spellCheck", "value"].forEach(function(e) {
    q[e] = new Y(e, 2, !1, e.toLowerCase(), null, !1, !1);
  }), ["autoReverse", "externalResourcesRequired", "focusable", "preserveAlpha"].forEach(function(e) {
    q[e] = new Y(e, 2, !1, e, null, !1, !1);
  }), "allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope".split(" ").forEach(function(e) {
    q[e] = new Y(e, 3, !1, e.toLowerCase(), null, !1, !1);
  }), ["checked", "multiple", "muted", "selected"].forEach(function(e) {
    q[e] = new Y(e, 3, !0, e, null, !1, !1);
  }), ["capture", "download"].forEach(function(e) {
    q[e] = new Y(e, 4, !1, e, null, !1, !1);
  }), ["cols", "rows", "size", "span"].forEach(function(e) {
    q[e] = new Y(e, 6, !1, e, null, !1, !1);
  }), ["rowSpan", "start"].forEach(function(e) {
    q[e] = new Y(e, 5, !1, e.toLowerCase(), null, !1, !1);
  });
  var pe = /[\-:]([a-z])/g;
  function Le(e) {
    return e[1].toUpperCase();
  }
  "accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height".split(" ").forEach(function(e) {
    var t = e.replace(
      pe,
      Le
    );
    q[t] = new Y(t, 1, !1, e, null, !1, !1);
  }), "xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type".split(" ").forEach(function(e) {
    var t = e.replace(pe, Le);
    q[t] = new Y(t, 1, !1, e, "http://www.w3.org/1999/xlink", !1, !1);
  }), ["xml:base", "xml:lang", "xml:space"].forEach(function(e) {
    var t = e.replace(pe, Le);
    q[t] = new Y(t, 1, !1, e, "http://www.w3.org/XML/1998/namespace", !1, !1);
  }), ["tabIndex", "crossOrigin"].forEach(function(e) {
    q[e] = new Y(e, 1, !1, e.toLowerCase(), null, !1, !1);
  }), q.xlinkHref = new Y("xlinkHref", 1, !1, "xlink:href", "http://www.w3.org/1999/xlink", !0, !1), ["src", "href", "action", "formAction"].forEach(function(e) {
    q[e] = new Y(e, 1, !1, e.toLowerCase(), null, !0, !0);
  });
  function Te(e, t, n, r) {
    var l = q.hasOwnProperty(t) ? q[t] : null;
    (l !== null ? l.type !== 0 : r || !(2 < t.length) || t[0] !== "o" && t[0] !== "O" || t[1] !== "n" && t[1] !== "N") && (W(t, n, l, r) && (n = null), r || l === null ? M(t) && (n === null ? e.removeAttribute(t) : e.setAttribute(t, "" + n)) : l.mustUseProperty ? e[l.propertyName] = n === null ? l.type === 3 ? !1 : "" : n : (t = l.attributeName, r = l.attributeNamespace, n === null ? e.removeAttribute(t) : (l = l.type, n = l === 3 || l === 4 && n === !0 ? "" : "" + n, r ? e.setAttributeNS(r, t, n) : e.setAttribute(t, n))));
  }
  var me = a.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED, Pe = Symbol.for("react.element"), fe = Symbol.for("react.portal"), ue = Symbol.for("react.fragment"), O = Symbol.for("react.strict_mode"), le = Symbol.for("react.profiler"), X = Symbol.for("react.provider"), ie = Symbol.for("react.context"), re = Symbol.for("react.forward_ref"), xe = Symbol.for("react.suspense"), Ge = Symbol.for("react.suspense_list"), Ye = Symbol.for("react.memo"), Ie = Symbol.for("react.lazy"), we = Symbol.for("react.offscreen"), L = Symbol.iterator;
  function x(e) {
    return e === null || typeof e != "object" ? null : (e = L && e[L] || e["@@iterator"], typeof e == "function" ? e : null);
  }
  var k = Object.assign, d;
  function w(e) {
    if (d === void 0) try {
      throw Error();
    } catch (n) {
      var t = n.stack.trim().match(/\n( *(at )?)/);
      d = t && t[1] || "";
    }
    return `
` + d + e;
  }
  var D = !1;
  function G(e, t) {
    if (!e || D) return "";
    D = !0;
    var n = Error.prepareStackTrace;
    Error.prepareStackTrace = void 0;
    try {
      if (t) if (t = function() {
        throw Error();
      }, Object.defineProperty(t.prototype, "props", { set: function() {
        throw Error();
      } }), typeof Reflect == "object" && Reflect.construct) {
        try {
          Reflect.construct(t, []);
        } catch (y) {
          var r = y;
        }
        Reflect.construct(e, [], t);
      } else {
        try {
          t.call();
        } catch (y) {
          r = y;
        }
        e.call(t.prototype);
      }
      else {
        try {
          throw Error();
        } catch (y) {
          r = y;
        }
        e();
      }
    } catch (y) {
      if (y && r && typeof y.stack == "string") {
        for (var l = y.stack.split(`
`), i = r.stack.split(`
`), o = l.length - 1, f = i.length - 1; 1 <= o && 0 <= f && l[o] !== i[f]; ) f--;
        for (; 1 <= o && 0 <= f; o--, f--) if (l[o] !== i[f]) {
          if (o !== 1 || f !== 1)
            do
              if (o--, f--, 0 > f || l[o] !== i[f]) {
                var p = `
` + l[o].replace(" at new ", " at ");
                return e.displayName && p.includes("<anonymous>") && (p = p.replace("<anonymous>", e.displayName)), p;
              }
            while (1 <= o && 0 <= f);
          break;
        }
      }
    } finally {
      D = !1, Error.prepareStackTrace = n;
    }
    return (e = e ? e.displayName || e.name : "") ? w(e) : "";
  }
  function te(e) {
    switch (e.tag) {
      case 5:
        return w(e.type);
      case 16:
        return w("Lazy");
      case 13:
        return w("Suspense");
      case 19:
        return w("SuspenseList");
      case 0:
      case 2:
      case 15:
        return e = G(e.type, !1), e;
      case 11:
        return e = G(e.type.render, !1), e;
      case 1:
        return e = G(e.type, !0), e;
      default:
        return "";
    }
  }
  function b(e) {
    if (e == null) return null;
    if (typeof e == "function") return e.displayName || e.name || null;
    if (typeof e == "string") return e;
    switch (e) {
      case ue:
        return "Fragment";
      case fe:
        return "Portal";
      case le:
        return "Profiler";
      case O:
        return "StrictMode";
      case xe:
        return "Suspense";
      case Ge:
        return "SuspenseList";
    }
    if (typeof e == "object") switch (e.$$typeof) {
      case ie:
        return (e.displayName || "Context") + ".Consumer";
      case X:
        return (e._context.displayName || "Context") + ".Provider";
      case re:
        var t = e.render;
        return e = e.displayName, e || (e = t.displayName || t.name || "", e = e !== "" ? "ForwardRef(" + e + ")" : "ForwardRef"), e;
      case Ye:
        return t = e.displayName || null, t !== null ? t : b(e.type) || "Memo";
      case Ie:
        t = e._payload, e = e._init;
        try {
          return b(e(t));
        } catch {
        }
    }
    return null;
  }
  function se(e) {
    var t = e.type;
    switch (e.tag) {
      case 24:
        return "Cache";
      case 9:
        return (t.displayName || "Context") + ".Consumer";
      case 10:
        return (t._context.displayName || "Context") + ".Provider";
      case 18:
        return "DehydratedFragment";
      case 11:
        return e = t.render, e = e.displayName || e.name || "", t.displayName || (e !== "" ? "ForwardRef(" + e + ")" : "ForwardRef");
      case 7:
        return "Fragment";
      case 5:
        return t;
      case 4:
        return "Portal";
      case 3:
        return "Root";
      case 6:
        return "Text";
      case 16:
        return b(t);
      case 8:
        return t === O ? "StrictMode" : "Mode";
      case 22:
        return "Offscreen";
      case 12:
        return "Profiler";
      case 21:
        return "Scope";
      case 13:
        return "Suspense";
      case 19:
        return "SuspenseList";
      case 25:
        return "TracingMarker";
      case 1:
      case 0:
      case 17:
      case 2:
      case 14:
      case 15:
        if (typeof t == "function") return t.displayName || t.name || null;
        if (typeof t == "string") return t;
    }
    return null;
  }
  function Z(e) {
    switch (typeof e) {
      case "boolean":
      case "number":
      case "string":
      case "undefined":
        return e;
      case "object":
        return e;
      default:
        return "";
    }
  }
  function oe(e) {
    var t = e.type;
    return (e = e.nodeName) && e.toLowerCase() === "input" && (t === "checkbox" || t === "radio");
  }
  function Ne(e) {
    var t = oe(e) ? "checked" : "value", n = Object.getOwnPropertyDescriptor(e.constructor.prototype, t), r = "" + e[t];
    if (!e.hasOwnProperty(t) && typeof n < "u" && typeof n.get == "function" && typeof n.set == "function") {
      var l = n.get, i = n.set;
      return Object.defineProperty(e, t, { configurable: !0, get: function() {
        return l.call(this);
      }, set: function(o) {
        r = "" + o, i.call(this, o);
      } }), Object.defineProperty(e, t, { enumerable: n.enumerable }), { getValue: function() {
        return r;
      }, setValue: function(o) {
        r = "" + o;
      }, stopTracking: function() {
        e._valueTracker = null, delete e[t];
      } };
    }
  }
  function dt(e) {
    e._valueTracker || (e._valueTracker = Ne(e));
  }
  function Un(e) {
    if (!e) return !1;
    var t = e._valueTracker;
    if (!t) return !0;
    var n = t.getValue(), r = "";
    return e && (r = oe(e) ? e.checked ? "true" : "false" : e.value), e = r, e !== n ? (t.setValue(e), !0) : !1;
  }
  function Mr(e) {
    if (e = e || (typeof document < "u" ? document : void 0), typeof e > "u") return null;
    try {
      return e.activeElement || e.body;
    } catch {
      return e.body;
    }
  }
  function Wl(e, t) {
    var n = t.checked;
    return k({}, t, { defaultChecked: void 0, defaultValue: void 0, value: void 0, checked: n ?? e._wrapperState.initialChecked });
  }
  function Zo(e, t) {
    var n = t.defaultValue == null ? "" : t.defaultValue, r = t.checked != null ? t.checked : t.defaultChecked;
    n = Z(t.value != null ? t.value : n), e._wrapperState = { initialChecked: r, initialValue: n, controlled: t.type === "checkbox" || t.type === "radio" ? t.checked != null : t.value != null };
  }
  function Jo(e, t) {
    t = t.checked, t != null && Te(e, "checked", t, !1);
  }
  function Ql(e, t) {
    Jo(e, t);
    var n = Z(t.value), r = t.type;
    if (n != null) r === "number" ? (n === 0 && e.value === "" || e.value != n) && (e.value = "" + n) : e.value !== "" + n && (e.value = "" + n);
    else if (r === "submit" || r === "reset") {
      e.removeAttribute("value");
      return;
    }
    t.hasOwnProperty("value") ? Kl(e, t.type, n) : t.hasOwnProperty("defaultValue") && Kl(e, t.type, Z(t.defaultValue)), t.checked == null && t.defaultChecked != null && (e.defaultChecked = !!t.defaultChecked);
  }
  function qo(e, t, n) {
    if (t.hasOwnProperty("value") || t.hasOwnProperty("defaultValue")) {
      var r = t.type;
      if (!(r !== "submit" && r !== "reset" || t.value !== void 0 && t.value !== null)) return;
      t = "" + e._wrapperState.initialValue, n || t === e.value || (e.value = t), e.defaultValue = t;
    }
    n = e.name, n !== "" && (e.name = ""), e.defaultChecked = !!e._wrapperState.initialChecked, n !== "" && (e.name = n);
  }
  function Kl(e, t, n) {
    (t !== "number" || Mr(e.ownerDocument) !== e) && (n == null ? e.defaultValue = "" + e._wrapperState.initialValue : e.defaultValue !== "" + n && (e.defaultValue = "" + n));
  }
  var Hn = Array.isArray;
  function hn(e, t, n, r) {
    if (e = e.options, t) {
      t = {};
      for (var l = 0; l < n.length; l++) t["$" + n[l]] = !0;
      for (n = 0; n < e.length; n++) l = t.hasOwnProperty("$" + e[n].value), e[n].selected !== l && (e[n].selected = l), l && r && (e[n].defaultSelected = !0);
    } else {
      for (n = "" + Z(n), t = null, l = 0; l < e.length; l++) {
        if (e[l].value === n) {
          e[l].selected = !0, r && (e[l].defaultSelected = !0);
          return;
        }
        t !== null || e[l].disabled || (t = e[l]);
      }
      t !== null && (t.selected = !0);
    }
  }
  function Gl(e, t) {
    if (t.dangerouslySetInnerHTML != null) throw Error(s(91));
    return k({}, t, { value: void 0, defaultValue: void 0, children: "" + e._wrapperState.initialValue });
  }
  function bo(e, t) {
    var n = t.value;
    if (n == null) {
      if (n = t.children, t = t.defaultValue, n != null) {
        if (t != null) throw Error(s(92));
        if (Hn(n)) {
          if (1 < n.length) throw Error(s(93));
          n = n[0];
        }
        t = n;
      }
      t == null && (t = ""), n = t;
    }
    e._wrapperState = { initialValue: Z(n) };
  }
  function es(e, t) {
    var n = Z(t.value), r = Z(t.defaultValue);
    n != null && (n = "" + n, n !== e.value && (e.value = n), t.defaultValue == null && e.defaultValue !== n && (e.defaultValue = n)), r != null && (e.defaultValue = "" + r);
  }
  function ts(e) {
    var t = e.textContent;
    t === e._wrapperState.initialValue && t !== "" && t !== null && (e.value = t);
  }
  function ns(e) {
    switch (e) {
      case "svg":
        return "http://www.w3.org/2000/svg";
      case "math":
        return "http://www.w3.org/1998/Math/MathML";
      default:
        return "http://www.w3.org/1999/xhtml";
    }
  }
  function Yl(e, t) {
    return e == null || e === "http://www.w3.org/1999/xhtml" ? ns(t) : e === "http://www.w3.org/2000/svg" && t === "foreignObject" ? "http://www.w3.org/1999/xhtml" : e;
  }
  var Lr, rs = (function(e) {
    return typeof MSApp < "u" && MSApp.execUnsafeLocalFunction ? function(t, n, r, l) {
      MSApp.execUnsafeLocalFunction(function() {
        return e(t, n, r, l);
      });
    } : e;
  })(function(e, t) {
    if (e.namespaceURI !== "http://www.w3.org/2000/svg" || "innerHTML" in e) e.innerHTML = t;
    else {
      for (Lr = Lr || document.createElement("div"), Lr.innerHTML = "<svg>" + t.valueOf().toString() + "</svg>", t = Lr.firstChild; e.firstChild; ) e.removeChild(e.firstChild);
      for (; t.firstChild; ) e.appendChild(t.firstChild);
    }
  });
  function Bn(e, t) {
    if (t) {
      var n = e.firstChild;
      if (n && n === e.lastChild && n.nodeType === 3) {
        n.nodeValue = t;
        return;
      }
    }
    e.textContent = t;
  }
  var Vn = {
    animationIterationCount: !0,
    aspectRatio: !0,
    borderImageOutset: !0,
    borderImageSlice: !0,
    borderImageWidth: !0,
    boxFlex: !0,
    boxFlexGroup: !0,
    boxOrdinalGroup: !0,
    columnCount: !0,
    columns: !0,
    flex: !0,
    flexGrow: !0,
    flexPositive: !0,
    flexShrink: !0,
    flexNegative: !0,
    flexOrder: !0,
    gridArea: !0,
    gridRow: !0,
    gridRowEnd: !0,
    gridRowSpan: !0,
    gridRowStart: !0,
    gridColumn: !0,
    gridColumnEnd: !0,
    gridColumnSpan: !0,
    gridColumnStart: !0,
    fontWeight: !0,
    lineClamp: !0,
    lineHeight: !0,
    opacity: !0,
    order: !0,
    orphans: !0,
    tabSize: !0,
    widows: !0,
    zIndex: !0,
    zoom: !0,
    fillOpacity: !0,
    floodOpacity: !0,
    stopOpacity: !0,
    strokeDasharray: !0,
    strokeDashoffset: !0,
    strokeMiterlimit: !0,
    strokeOpacity: !0,
    strokeWidth: !0
  }, yc = ["Webkit", "ms", "Moz", "O"];
  Object.keys(Vn).forEach(function(e) {
    yc.forEach(function(t) {
      t = t + e.charAt(0).toUpperCase() + e.substring(1), Vn[t] = Vn[e];
    });
  });
  function ls(e, t, n) {
    return t == null || typeof t == "boolean" || t === "" ? "" : n || typeof t != "number" || t === 0 || Vn.hasOwnProperty(e) && Vn[e] ? ("" + t).trim() : t + "px";
  }
  function is(e, t) {
    e = e.style;
    for (var n in t) if (t.hasOwnProperty(n)) {
      var r = n.indexOf("--") === 0, l = ls(n, t[n], r);
      n === "float" && (n = "cssFloat"), r ? e.setProperty(n, l) : e[n] = l;
    }
  }
  var xc = k({ menuitem: !0 }, { area: !0, base: !0, br: !0, col: !0, embed: !0, hr: !0, img: !0, input: !0, keygen: !0, link: !0, meta: !0, param: !0, source: !0, track: !0, wbr: !0 });
  function Xl(e, t) {
    if (t) {
      if (xc[e] && (t.children != null || t.dangerouslySetInnerHTML != null)) throw Error(s(137, e));
      if (t.dangerouslySetInnerHTML != null) {
        if (t.children != null) throw Error(s(60));
        if (typeof t.dangerouslySetInnerHTML != "object" || !("__html" in t.dangerouslySetInnerHTML)) throw Error(s(61));
      }
      if (t.style != null && typeof t.style != "object") throw Error(s(62));
    }
  }
  function Zl(e, t) {
    if (e.indexOf("-") === -1) return typeof t.is == "string";
    switch (e) {
      case "annotation-xml":
      case "color-profile":
      case "font-face":
      case "font-face-src":
      case "font-face-uri":
      case "font-face-format":
      case "font-face-name":
      case "missing-glyph":
        return !1;
      default:
        return !0;
    }
  }
  var Jl = null;
  function ql(e) {
    return e = e.target || e.srcElement || window, e.correspondingUseElement && (e = e.correspondingUseElement), e.nodeType === 3 ? e.parentNode : e;
  }
  var bl = null, mn = null, vn = null;
  function os(e) {
    if (e = fr(e)) {
      if (typeof bl != "function") throw Error(s(280));
      var t = e.stateNode;
      t && (t = nl(t), bl(e.stateNode, e.type, t));
    }
  }
  function ss(e) {
    mn ? vn ? vn.push(e) : vn = [e] : mn = e;
  }
  function us() {
    if (mn) {
      var e = mn, t = vn;
      if (vn = mn = null, os(e), t) for (e = 0; e < t.length; e++) os(t[e]);
    }
  }
  function as(e, t) {
    return e(t);
  }
  function cs() {
  }
  var ei = !1;
  function fs(e, t, n) {
    if (ei) return e(t, n);
    ei = !0;
    try {
      return as(e, t, n);
    } finally {
      ei = !1, (mn !== null || vn !== null) && (cs(), us());
    }
  }
  function Wn(e, t) {
    var n = e.stateNode;
    if (n === null) return null;
    var r = nl(n);
    if (r === null) return null;
    n = r[t];
    e: switch (t) {
      case "onClick":
      case "onClickCapture":
      case "onDoubleClick":
      case "onDoubleClickCapture":
      case "onMouseDown":
      case "onMouseDownCapture":
      case "onMouseMove":
      case "onMouseMoveCapture":
      case "onMouseUp":
      case "onMouseUpCapture":
      case "onMouseEnter":
        (r = !r.disabled) || (e = e.type, r = !(e === "button" || e === "input" || e === "select" || e === "textarea")), e = !r;
        break e;
      default:
        e = !1;
    }
    if (e) return null;
    if (n && typeof n != "function") throw Error(s(231, t, typeof n));
    return n;
  }
  var ti = !1;
  if (P) try {
    var Qn = {};
    Object.defineProperty(Qn, "passive", { get: function() {
      ti = !0;
    } }), window.addEventListener("test", Qn, Qn), window.removeEventListener("test", Qn, Qn);
  } catch {
    ti = !1;
  }
  function wc(e, t, n, r, l, i, o, f, p) {
    var y = Array.prototype.slice.call(arguments, 3);
    try {
      t.apply(n, y);
    } catch (j) {
      this.onError(j);
    }
  }
  var Kn = !1, Ir = null, Dr = !1, ni = null, kc = { onError: function(e) {
    Kn = !0, Ir = e;
  } };
  function Sc(e, t, n, r, l, i, o, f, p) {
    Kn = !1, Ir = null, wc.apply(kc, arguments);
  }
  function Ec(e, t, n, r, l, i, o, f, p) {
    if (Sc.apply(this, arguments), Kn) {
      if (Kn) {
        var y = Ir;
        Kn = !1, Ir = null;
      } else throw Error(s(198));
      Dr || (Dr = !0, ni = y);
    }
  }
  function bt(e) {
    var t = e, n = e;
    if (e.alternate) for (; t.return; ) t = t.return;
    else {
      e = t;
      do
        t = e, (t.flags & 4098) !== 0 && (n = t.return), e = t.return;
      while (e);
    }
    return t.tag === 3 ? n : null;
  }
  function ds(e) {
    if (e.tag === 13) {
      var t = e.memoizedState;
      if (t === null && (e = e.alternate, e !== null && (t = e.memoizedState)), t !== null) return t.dehydrated;
    }
    return null;
  }
  function ps(e) {
    if (bt(e) !== e) throw Error(s(188));
  }
  function Nc(e) {
    var t = e.alternate;
    if (!t) {
      if (t = bt(e), t === null) throw Error(s(188));
      return t !== e ? null : e;
    }
    for (var n = e, r = t; ; ) {
      var l = n.return;
      if (l === null) break;
      var i = l.alternate;
      if (i === null) {
        if (r = l.return, r !== null) {
          n = r;
          continue;
        }
        break;
      }
      if (l.child === i.child) {
        for (i = l.child; i; ) {
          if (i === n) return ps(l), e;
          if (i === r) return ps(l), t;
          i = i.sibling;
        }
        throw Error(s(188));
      }
      if (n.return !== r.return) n = l, r = i;
      else {
        for (var o = !1, f = l.child; f; ) {
          if (f === n) {
            o = !0, n = l, r = i;
            break;
          }
          if (f === r) {
            o = !0, r = l, n = i;
            break;
          }
          f = f.sibling;
        }
        if (!o) {
          for (f = i.child; f; ) {
            if (f === n) {
              o = !0, n = i, r = l;
              break;
            }
            if (f === r) {
              o = !0, r = i, n = l;
              break;
            }
            f = f.sibling;
          }
          if (!o) throw Error(s(189));
        }
      }
      if (n.alternate !== r) throw Error(s(190));
    }
    if (n.tag !== 3) throw Error(s(188));
    return n.stateNode.current === n ? e : t;
  }
  function hs(e) {
    return e = Nc(e), e !== null ? ms(e) : null;
  }
  function ms(e) {
    if (e.tag === 5 || e.tag === 6) return e;
    for (e = e.child; e !== null; ) {
      var t = ms(e);
      if (t !== null) return t;
      e = e.sibling;
    }
    return null;
  }
  var vs = u.unstable_scheduleCallback, gs = u.unstable_cancelCallback, Cc = u.unstable_shouldYield, _c = u.unstable_requestPaint, _e = u.unstable_now, jc = u.unstable_getCurrentPriorityLevel, ri = u.unstable_ImmediatePriority, ys = u.unstable_UserBlockingPriority, Fr = u.unstable_NormalPriority, zc = u.unstable_LowPriority, xs = u.unstable_IdlePriority, Or = null, wt = null;
  function Tc(e) {
    if (wt && typeof wt.onCommitFiberRoot == "function") try {
      wt.onCommitFiberRoot(Or, e, void 0, (e.current.flags & 128) === 128);
    } catch {
    }
  }
  var pt = Math.clz32 ? Math.clz32 : Mc, Pc = Math.log, Rc = Math.LN2;
  function Mc(e) {
    return e >>>= 0, e === 0 ? 32 : 31 - (Pc(e) / Rc | 0) | 0;
  }
  var Ar = 64, $r = 4194304;
  function Gn(e) {
    switch (e & -e) {
      case 1:
        return 1;
      case 2:
        return 2;
      case 4:
        return 4;
      case 8:
        return 8;
      case 16:
        return 16;
      case 32:
        return 32;
      case 64:
      case 128:
      case 256:
      case 512:
      case 1024:
      case 2048:
      case 4096:
      case 8192:
      case 16384:
      case 32768:
      case 65536:
      case 131072:
      case 262144:
      case 524288:
      case 1048576:
      case 2097152:
        return e & 4194240;
      case 4194304:
      case 8388608:
      case 16777216:
      case 33554432:
      case 67108864:
        return e & 130023424;
      case 134217728:
        return 134217728;
      case 268435456:
        return 268435456;
      case 536870912:
        return 536870912;
      case 1073741824:
        return 1073741824;
      default:
        return e;
    }
  }
  function Ur(e, t) {
    var n = e.pendingLanes;
    if (n === 0) return 0;
    var r = 0, l = e.suspendedLanes, i = e.pingedLanes, o = n & 268435455;
    if (o !== 0) {
      var f = o & ~l;
      f !== 0 ? r = Gn(f) : (i &= o, i !== 0 && (r = Gn(i)));
    } else o = n & ~l, o !== 0 ? r = Gn(o) : i !== 0 && (r = Gn(i));
    if (r === 0) return 0;
    if (t !== 0 && t !== r && (t & l) === 0 && (l = r & -r, i = t & -t, l >= i || l === 16 && (i & 4194240) !== 0)) return t;
    if ((r & 4) !== 0 && (r |= n & 16), t = e.entangledLanes, t !== 0) for (e = e.entanglements, t &= r; 0 < t; ) n = 31 - pt(t), l = 1 << n, r |= e[n], t &= ~l;
    return r;
  }
  function Lc(e, t) {
    switch (e) {
      case 1:
      case 2:
      case 4:
        return t + 250;
      case 8:
      case 16:
      case 32:
      case 64:
      case 128:
      case 256:
      case 512:
      case 1024:
      case 2048:
      case 4096:
      case 8192:
      case 16384:
      case 32768:
      case 65536:
      case 131072:
      case 262144:
      case 524288:
      case 1048576:
      case 2097152:
        return t + 5e3;
      case 4194304:
      case 8388608:
      case 16777216:
      case 33554432:
      case 67108864:
        return -1;
      case 134217728:
      case 268435456:
      case 536870912:
      case 1073741824:
        return -1;
      default:
        return -1;
    }
  }
  function Ic(e, t) {
    for (var n = e.suspendedLanes, r = e.pingedLanes, l = e.expirationTimes, i = e.pendingLanes; 0 < i; ) {
      var o = 31 - pt(i), f = 1 << o, p = l[o];
      p === -1 ? ((f & n) === 0 || (f & r) !== 0) && (l[o] = Lc(f, t)) : p <= t && (e.expiredLanes |= f), i &= ~f;
    }
  }
  function li(e) {
    return e = e.pendingLanes & -1073741825, e !== 0 ? e : e & 1073741824 ? 1073741824 : 0;
  }
  function ws() {
    var e = Ar;
    return Ar <<= 1, (Ar & 4194240) === 0 && (Ar = 64), e;
  }
  function ii(e) {
    for (var t = [], n = 0; 31 > n; n++) t.push(e);
    return t;
  }
  function Yn(e, t, n) {
    e.pendingLanes |= t, t !== 536870912 && (e.suspendedLanes = 0, e.pingedLanes = 0), e = e.eventTimes, t = 31 - pt(t), e[t] = n;
  }
  function Dc(e, t) {
    var n = e.pendingLanes & ~t;
    e.pendingLanes = t, e.suspendedLanes = 0, e.pingedLanes = 0, e.expiredLanes &= t, e.mutableReadLanes &= t, e.entangledLanes &= t, t = e.entanglements;
    var r = e.eventTimes;
    for (e = e.expirationTimes; 0 < n; ) {
      var l = 31 - pt(n), i = 1 << l;
      t[l] = 0, r[l] = -1, e[l] = -1, n &= ~i;
    }
  }
  function oi(e, t) {
    var n = e.entangledLanes |= t;
    for (e = e.entanglements; n; ) {
      var r = 31 - pt(n), l = 1 << r;
      l & t | e[r] & t && (e[r] |= t), n &= ~l;
    }
  }
  var de = 0;
  function ks(e) {
    return e &= -e, 1 < e ? 4 < e ? (e & 268435455) !== 0 ? 16 : 536870912 : 4 : 1;
  }
  var Ss, si, Es, Ns, Cs, ui = !1, Hr = [], Lt = null, It = null, Dt = null, Xn = /* @__PURE__ */ new Map(), Zn = /* @__PURE__ */ new Map(), Ft = [], Fc = "mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset submit".split(" ");
  function _s(e, t) {
    switch (e) {
      case "focusin":
      case "focusout":
        Lt = null;
        break;
      case "dragenter":
      case "dragleave":
        It = null;
        break;
      case "mouseover":
      case "mouseout":
        Dt = null;
        break;
      case "pointerover":
      case "pointerout":
        Xn.delete(t.pointerId);
        break;
      case "gotpointercapture":
      case "lostpointercapture":
        Zn.delete(t.pointerId);
    }
  }
  function Jn(e, t, n, r, l, i) {
    return e === null || e.nativeEvent !== i ? (e = { blockedOn: t, domEventName: n, eventSystemFlags: r, nativeEvent: i, targetContainers: [l] }, t !== null && (t = fr(t), t !== null && si(t)), e) : (e.eventSystemFlags |= r, t = e.targetContainers, l !== null && t.indexOf(l) === -1 && t.push(l), e);
  }
  function Oc(e, t, n, r, l) {
    switch (t) {
      case "focusin":
        return Lt = Jn(Lt, e, t, n, r, l), !0;
      case "dragenter":
        return It = Jn(It, e, t, n, r, l), !0;
      case "mouseover":
        return Dt = Jn(Dt, e, t, n, r, l), !0;
      case "pointerover":
        var i = l.pointerId;
        return Xn.set(i, Jn(Xn.get(i) || null, e, t, n, r, l)), !0;
      case "gotpointercapture":
        return i = l.pointerId, Zn.set(i, Jn(Zn.get(i) || null, e, t, n, r, l)), !0;
    }
    return !1;
  }
  function js(e) {
    var t = en(e.target);
    if (t !== null) {
      var n = bt(t);
      if (n !== null) {
        if (t = n.tag, t === 13) {
          if (t = ds(n), t !== null) {
            e.blockedOn = t, Cs(e.priority, function() {
              Es(n);
            });
            return;
          }
        } else if (t === 3 && n.stateNode.current.memoizedState.isDehydrated) {
          e.blockedOn = n.tag === 3 ? n.stateNode.containerInfo : null;
          return;
        }
      }
    }
    e.blockedOn = null;
  }
  function Br(e) {
    if (e.blockedOn !== null) return !1;
    for (var t = e.targetContainers; 0 < t.length; ) {
      var n = ci(e.domEventName, e.eventSystemFlags, t[0], e.nativeEvent);
      if (n === null) {
        n = e.nativeEvent;
        var r = new n.constructor(n.type, n);
        Jl = r, n.target.dispatchEvent(r), Jl = null;
      } else return t = fr(n), t !== null && si(t), e.blockedOn = n, !1;
      t.shift();
    }
    return !0;
  }
  function zs(e, t, n) {
    Br(e) && n.delete(t);
  }
  function Ac() {
    ui = !1, Lt !== null && Br(Lt) && (Lt = null), It !== null && Br(It) && (It = null), Dt !== null && Br(Dt) && (Dt = null), Xn.forEach(zs), Zn.forEach(zs);
  }
  function qn(e, t) {
    e.blockedOn === t && (e.blockedOn = null, ui || (ui = !0, u.unstable_scheduleCallback(u.unstable_NormalPriority, Ac)));
  }
  function bn(e) {
    function t(l) {
      return qn(l, e);
    }
    if (0 < Hr.length) {
      qn(Hr[0], e);
      for (var n = 1; n < Hr.length; n++) {
        var r = Hr[n];
        r.blockedOn === e && (r.blockedOn = null);
      }
    }
    for (Lt !== null && qn(Lt, e), It !== null && qn(It, e), Dt !== null && qn(Dt, e), Xn.forEach(t), Zn.forEach(t), n = 0; n < Ft.length; n++) r = Ft[n], r.blockedOn === e && (r.blockedOn = null);
    for (; 0 < Ft.length && (n = Ft[0], n.blockedOn === null); ) js(n), n.blockedOn === null && Ft.shift();
  }
  var gn = me.ReactCurrentBatchConfig, Vr = !0;
  function $c(e, t, n, r) {
    var l = de, i = gn.transition;
    gn.transition = null;
    try {
      de = 1, ai(e, t, n, r);
    } finally {
      de = l, gn.transition = i;
    }
  }
  function Uc(e, t, n, r) {
    var l = de, i = gn.transition;
    gn.transition = null;
    try {
      de = 4, ai(e, t, n, r);
    } finally {
      de = l, gn.transition = i;
    }
  }
  function ai(e, t, n, r) {
    if (Vr) {
      var l = ci(e, t, n, r);
      if (l === null) ji(e, t, r, Wr, n), _s(e, r);
      else if (Oc(l, e, t, n, r)) r.stopPropagation();
      else if (_s(e, r), t & 4 && -1 < Fc.indexOf(e)) {
        for (; l !== null; ) {
          var i = fr(l);
          if (i !== null && Ss(i), i = ci(e, t, n, r), i === null && ji(e, t, r, Wr, n), i === l) break;
          l = i;
        }
        l !== null && r.stopPropagation();
      } else ji(e, t, r, null, n);
    }
  }
  var Wr = null;
  function ci(e, t, n, r) {
    if (Wr = null, e = ql(r), e = en(e), e !== null) if (t = bt(e), t === null) e = null;
    else if (n = t.tag, n === 13) {
      if (e = ds(t), e !== null) return e;
      e = null;
    } else if (n === 3) {
      if (t.stateNode.current.memoizedState.isDehydrated) return t.tag === 3 ? t.stateNode.containerInfo : null;
      e = null;
    } else t !== e && (e = null);
    return Wr = e, null;
  }
  function Ts(e) {
    switch (e) {
      case "cancel":
      case "click":
      case "close":
      case "contextmenu":
      case "copy":
      case "cut":
      case "auxclick":
      case "dblclick":
      case "dragend":
      case "dragstart":
      case "drop":
      case "focusin":
      case "focusout":
      case "input":
      case "invalid":
      case "keydown":
      case "keypress":
      case "keyup":
      case "mousedown":
      case "mouseup":
      case "paste":
      case "pause":
      case "play":
      case "pointercancel":
      case "pointerdown":
      case "pointerup":
      case "ratechange":
      case "reset":
      case "resize":
      case "seeked":
      case "submit":
      case "touchcancel":
      case "touchend":
      case "touchstart":
      case "volumechange":
      case "change":
      case "selectionchange":
      case "textInput":
      case "compositionstart":
      case "compositionend":
      case "compositionupdate":
      case "beforeblur":
      case "afterblur":
      case "beforeinput":
      case "blur":
      case "fullscreenchange":
      case "focus":
      case "hashchange":
      case "popstate":
      case "select":
      case "selectstart":
        return 1;
      case "drag":
      case "dragenter":
      case "dragexit":
      case "dragleave":
      case "dragover":
      case "mousemove":
      case "mouseout":
      case "mouseover":
      case "pointermove":
      case "pointerout":
      case "pointerover":
      case "scroll":
      case "toggle":
      case "touchmove":
      case "wheel":
      case "mouseenter":
      case "mouseleave":
      case "pointerenter":
      case "pointerleave":
        return 4;
      case "message":
        switch (jc()) {
          case ri:
            return 1;
          case ys:
            return 4;
          case Fr:
          case zc:
            return 16;
          case xs:
            return 536870912;
          default:
            return 16;
        }
      default:
        return 16;
    }
  }
  var Ot = null, fi = null, Qr = null;
  function Ps() {
    if (Qr) return Qr;
    var e, t = fi, n = t.length, r, l = "value" in Ot ? Ot.value : Ot.textContent, i = l.length;
    for (e = 0; e < n && t[e] === l[e]; e++) ;
    var o = n - e;
    for (r = 1; r <= o && t[n - r] === l[i - r]; r++) ;
    return Qr = l.slice(e, 1 < r ? 1 - r : void 0);
  }
  function Kr(e) {
    var t = e.keyCode;
    return "charCode" in e ? (e = e.charCode, e === 0 && t === 13 && (e = 13)) : e = t, e === 10 && (e = 13), 32 <= e || e === 13 ? e : 0;
  }
  function Gr() {
    return !0;
  }
  function Rs() {
    return !1;
  }
  function tt(e) {
    function t(n, r, l, i, o) {
      this._reactName = n, this._targetInst = l, this.type = r, this.nativeEvent = i, this.target = o, this.currentTarget = null;
      for (var f in e) e.hasOwnProperty(f) && (n = e[f], this[f] = n ? n(i) : i[f]);
      return this.isDefaultPrevented = (i.defaultPrevented != null ? i.defaultPrevented : i.returnValue === !1) ? Gr : Rs, this.isPropagationStopped = Rs, this;
    }
    return k(t.prototype, { preventDefault: function() {
      this.defaultPrevented = !0;
      var n = this.nativeEvent;
      n && (n.preventDefault ? n.preventDefault() : typeof n.returnValue != "unknown" && (n.returnValue = !1), this.isDefaultPrevented = Gr);
    }, stopPropagation: function() {
      var n = this.nativeEvent;
      n && (n.stopPropagation ? n.stopPropagation() : typeof n.cancelBubble != "unknown" && (n.cancelBubble = !0), this.isPropagationStopped = Gr);
    }, persist: function() {
    }, isPersistent: Gr }), t;
  }
  var yn = { eventPhase: 0, bubbles: 0, cancelable: 0, timeStamp: function(e) {
    return e.timeStamp || Date.now();
  }, defaultPrevented: 0, isTrusted: 0 }, di = tt(yn), er = k({}, yn, { view: 0, detail: 0 }), Hc = tt(er), pi, hi, tr, Yr = k({}, er, { screenX: 0, screenY: 0, clientX: 0, clientY: 0, pageX: 0, pageY: 0, ctrlKey: 0, shiftKey: 0, altKey: 0, metaKey: 0, getModifierState: vi, button: 0, buttons: 0, relatedTarget: function(e) {
    return e.relatedTarget === void 0 ? e.fromElement === e.srcElement ? e.toElement : e.fromElement : e.relatedTarget;
  }, movementX: function(e) {
    return "movementX" in e ? e.movementX : (e !== tr && (tr && e.type === "mousemove" ? (pi = e.screenX - tr.screenX, hi = e.screenY - tr.screenY) : hi = pi = 0, tr = e), pi);
  }, movementY: function(e) {
    return "movementY" in e ? e.movementY : hi;
  } }), Ms = tt(Yr), Bc = k({}, Yr, { dataTransfer: 0 }), Vc = tt(Bc), Wc = k({}, er, { relatedTarget: 0 }), mi = tt(Wc), Qc = k({}, yn, { animationName: 0, elapsedTime: 0, pseudoElement: 0 }), Kc = tt(Qc), Gc = k({}, yn, { clipboardData: function(e) {
    return "clipboardData" in e ? e.clipboardData : window.clipboardData;
  } }), Yc = tt(Gc), Xc = k({}, yn, { data: 0 }), Ls = tt(Xc), Zc = {
    Esc: "Escape",
    Spacebar: " ",
    Left: "ArrowLeft",
    Up: "ArrowUp",
    Right: "ArrowRight",
    Down: "ArrowDown",
    Del: "Delete",
    Win: "OS",
    Menu: "ContextMenu",
    Apps: "ContextMenu",
    Scroll: "ScrollLock",
    MozPrintableKey: "Unidentified"
  }, Jc = {
    8: "Backspace",
    9: "Tab",
    12: "Clear",
    13: "Enter",
    16: "Shift",
    17: "Control",
    18: "Alt",
    19: "Pause",
    20: "CapsLock",
    27: "Escape",
    32: " ",
    33: "PageUp",
    34: "PageDown",
    35: "End",
    36: "Home",
    37: "ArrowLeft",
    38: "ArrowUp",
    39: "ArrowRight",
    40: "ArrowDown",
    45: "Insert",
    46: "Delete",
    112: "F1",
    113: "F2",
    114: "F3",
    115: "F4",
    116: "F5",
    117: "F6",
    118: "F7",
    119: "F8",
    120: "F9",
    121: "F10",
    122: "F11",
    123: "F12",
    144: "NumLock",
    145: "ScrollLock",
    224: "Meta"
  }, qc = { Alt: "altKey", Control: "ctrlKey", Meta: "metaKey", Shift: "shiftKey" };
  function bc(e) {
    var t = this.nativeEvent;
    return t.getModifierState ? t.getModifierState(e) : (e = qc[e]) ? !!t[e] : !1;
  }
  function vi() {
    return bc;
  }
  var ef = k({}, er, { key: function(e) {
    if (e.key) {
      var t = Zc[e.key] || e.key;
      if (t !== "Unidentified") return t;
    }
    return e.type === "keypress" ? (e = Kr(e), e === 13 ? "Enter" : String.fromCharCode(e)) : e.type === "keydown" || e.type === "keyup" ? Jc[e.keyCode] || "Unidentified" : "";
  }, code: 0, location: 0, ctrlKey: 0, shiftKey: 0, altKey: 0, metaKey: 0, repeat: 0, locale: 0, getModifierState: vi, charCode: function(e) {
    return e.type === "keypress" ? Kr(e) : 0;
  }, keyCode: function(e) {
    return e.type === "keydown" || e.type === "keyup" ? e.keyCode : 0;
  }, which: function(e) {
    return e.type === "keypress" ? Kr(e) : e.type === "keydown" || e.type === "keyup" ? e.keyCode : 0;
  } }), tf = tt(ef), nf = k({}, Yr, { pointerId: 0, width: 0, height: 0, pressure: 0, tangentialPressure: 0, tiltX: 0, tiltY: 0, twist: 0, pointerType: 0, isPrimary: 0 }), Is = tt(nf), rf = k({}, er, { touches: 0, targetTouches: 0, changedTouches: 0, altKey: 0, metaKey: 0, ctrlKey: 0, shiftKey: 0, getModifierState: vi }), lf = tt(rf), of = k({}, yn, { propertyName: 0, elapsedTime: 0, pseudoElement: 0 }), sf = tt(of), uf = k({}, Yr, {
    deltaX: function(e) {
      return "deltaX" in e ? e.deltaX : "wheelDeltaX" in e ? -e.wheelDeltaX : 0;
    },
    deltaY: function(e) {
      return "deltaY" in e ? e.deltaY : "wheelDeltaY" in e ? -e.wheelDeltaY : "wheelDelta" in e ? -e.wheelDelta : 0;
    },
    deltaZ: 0,
    deltaMode: 0
  }), af = tt(uf), cf = [9, 13, 27, 32], gi = P && "CompositionEvent" in window, nr = null;
  P && "documentMode" in document && (nr = document.documentMode);
  var ff = P && "TextEvent" in window && !nr, Ds = P && (!gi || nr && 8 < nr && 11 >= nr), Fs = " ", Os = !1;
  function As(e, t) {
    switch (e) {
      case "keyup":
        return cf.indexOf(t.keyCode) !== -1;
      case "keydown":
        return t.keyCode !== 229;
      case "keypress":
      case "mousedown":
      case "focusout":
        return !0;
      default:
        return !1;
    }
  }
  function $s(e) {
    return e = e.detail, typeof e == "object" && "data" in e ? e.data : null;
  }
  var xn = !1;
  function df(e, t) {
    switch (e) {
      case "compositionend":
        return $s(t);
      case "keypress":
        return t.which !== 32 ? null : (Os = !0, Fs);
      case "textInput":
        return e = t.data, e === Fs && Os ? null : e;
      default:
        return null;
    }
  }
  function pf(e, t) {
    if (xn) return e === "compositionend" || !gi && As(e, t) ? (e = Ps(), Qr = fi = Ot = null, xn = !1, e) : null;
    switch (e) {
      case "paste":
        return null;
      case "keypress":
        if (!(t.ctrlKey || t.altKey || t.metaKey) || t.ctrlKey && t.altKey) {
          if (t.char && 1 < t.char.length) return t.char;
          if (t.which) return String.fromCharCode(t.which);
        }
        return null;
      case "compositionend":
        return Ds && t.locale !== "ko" ? null : t.data;
      default:
        return null;
    }
  }
  var hf = { color: !0, date: !0, datetime: !0, "datetime-local": !0, email: !0, month: !0, number: !0, password: !0, range: !0, search: !0, tel: !0, text: !0, time: !0, url: !0, week: !0 };
  function Us(e) {
    var t = e && e.nodeName && e.nodeName.toLowerCase();
    return t === "input" ? !!hf[e.type] : t === "textarea";
  }
  function Hs(e, t, n, r) {
    ss(r), t = br(t, "onChange"), 0 < t.length && (n = new di("onChange", "change", null, n, r), e.push({ event: n, listeners: t }));
  }
  var rr = null, lr = null;
  function mf(e) {
    iu(e, 0);
  }
  function Xr(e) {
    var t = Nn(e);
    if (Un(t)) return e;
  }
  function vf(e, t) {
    if (e === "change") return t;
  }
  var Bs = !1;
  if (P) {
    var yi;
    if (P) {
      var xi = "oninput" in document;
      if (!xi) {
        var Vs = document.createElement("div");
        Vs.setAttribute("oninput", "return;"), xi = typeof Vs.oninput == "function";
      }
      yi = xi;
    } else yi = !1;
    Bs = yi && (!document.documentMode || 9 < document.documentMode);
  }
  function Ws() {
    rr && (rr.detachEvent("onpropertychange", Qs), lr = rr = null);
  }
  function Qs(e) {
    if (e.propertyName === "value" && Xr(lr)) {
      var t = [];
      Hs(t, lr, e, ql(e)), fs(mf, t);
    }
  }
  function gf(e, t, n) {
    e === "focusin" ? (Ws(), rr = t, lr = n, rr.attachEvent("onpropertychange", Qs)) : e === "focusout" && Ws();
  }
  function yf(e) {
    if (e === "selectionchange" || e === "keyup" || e === "keydown") return Xr(lr);
  }
  function xf(e, t) {
    if (e === "click") return Xr(t);
  }
  function wf(e, t) {
    if (e === "input" || e === "change") return Xr(t);
  }
  function kf(e, t) {
    return e === t && (e !== 0 || 1 / e === 1 / t) || e !== e && t !== t;
  }
  var ht = typeof Object.is == "function" ? Object.is : kf;
  function ir(e, t) {
    if (ht(e, t)) return !0;
    if (typeof e != "object" || e === null || typeof t != "object" || t === null) return !1;
    var n = Object.keys(e), r = Object.keys(t);
    if (n.length !== r.length) return !1;
    for (r = 0; r < n.length; r++) {
      var l = n[r];
      if (!v.call(t, l) || !ht(e[l], t[l])) return !1;
    }
    return !0;
  }
  function Ks(e) {
    for (; e && e.firstChild; ) e = e.firstChild;
    return e;
  }
  function Gs(e, t) {
    var n = Ks(e);
    e = 0;
    for (var r; n; ) {
      if (n.nodeType === 3) {
        if (r = e + n.textContent.length, e <= t && r >= t) return { node: n, offset: t - e };
        e = r;
      }
      e: {
        for (; n; ) {
          if (n.nextSibling) {
            n = n.nextSibling;
            break e;
          }
          n = n.parentNode;
        }
        n = void 0;
      }
      n = Ks(n);
    }
  }
  function Ys(e, t) {
    return e && t ? e === t ? !0 : e && e.nodeType === 3 ? !1 : t && t.nodeType === 3 ? Ys(e, t.parentNode) : "contains" in e ? e.contains(t) : e.compareDocumentPosition ? !!(e.compareDocumentPosition(t) & 16) : !1 : !1;
  }
  function Xs() {
    for (var e = window, t = Mr(); t instanceof e.HTMLIFrameElement; ) {
      try {
        var n = typeof t.contentWindow.location.href == "string";
      } catch {
        n = !1;
      }
      if (n) e = t.contentWindow;
      else break;
      t = Mr(e.document);
    }
    return t;
  }
  function wi(e) {
    var t = e && e.nodeName && e.nodeName.toLowerCase();
    return t && (t === "input" && (e.type === "text" || e.type === "search" || e.type === "tel" || e.type === "url" || e.type === "password") || t === "textarea" || e.contentEditable === "true");
  }
  function Sf(e) {
    var t = Xs(), n = e.focusedElem, r = e.selectionRange;
    if (t !== n && n && n.ownerDocument && Ys(n.ownerDocument.documentElement, n)) {
      if (r !== null && wi(n)) {
        if (t = r.start, e = r.end, e === void 0 && (e = t), "selectionStart" in n) n.selectionStart = t, n.selectionEnd = Math.min(e, n.value.length);
        else if (e = (t = n.ownerDocument || document) && t.defaultView || window, e.getSelection) {
          e = e.getSelection();
          var l = n.textContent.length, i = Math.min(r.start, l);
          r = r.end === void 0 ? i : Math.min(r.end, l), !e.extend && i > r && (l = r, r = i, i = l), l = Gs(n, i);
          var o = Gs(
            n,
            r
          );
          l && o && (e.rangeCount !== 1 || e.anchorNode !== l.node || e.anchorOffset !== l.offset || e.focusNode !== o.node || e.focusOffset !== o.offset) && (t = t.createRange(), t.setStart(l.node, l.offset), e.removeAllRanges(), i > r ? (e.addRange(t), e.extend(o.node, o.offset)) : (t.setEnd(o.node, o.offset), e.addRange(t)));
        }
      }
      for (t = [], e = n; e = e.parentNode; ) e.nodeType === 1 && t.push({ element: e, left: e.scrollLeft, top: e.scrollTop });
      for (typeof n.focus == "function" && n.focus(), n = 0; n < t.length; n++) e = t[n], e.element.scrollLeft = e.left, e.element.scrollTop = e.top;
    }
  }
  var Ef = P && "documentMode" in document && 11 >= document.documentMode, wn = null, ki = null, or = null, Si = !1;
  function Zs(e, t, n) {
    var r = n.window === n ? n.document : n.nodeType === 9 ? n : n.ownerDocument;
    Si || wn == null || wn !== Mr(r) || (r = wn, "selectionStart" in r && wi(r) ? r = { start: r.selectionStart, end: r.selectionEnd } : (r = (r.ownerDocument && r.ownerDocument.defaultView || window).getSelection(), r = { anchorNode: r.anchorNode, anchorOffset: r.anchorOffset, focusNode: r.focusNode, focusOffset: r.focusOffset }), or && ir(or, r) || (or = r, r = br(ki, "onSelect"), 0 < r.length && (t = new di("onSelect", "select", null, t, n), e.push({ event: t, listeners: r }), t.target = wn)));
  }
  function Zr(e, t) {
    var n = {};
    return n[e.toLowerCase()] = t.toLowerCase(), n["Webkit" + e] = "webkit" + t, n["Moz" + e] = "moz" + t, n;
  }
  var kn = { animationend: Zr("Animation", "AnimationEnd"), animationiteration: Zr("Animation", "AnimationIteration"), animationstart: Zr("Animation", "AnimationStart"), transitionend: Zr("Transition", "TransitionEnd") }, Ei = {}, Js = {};
  P && (Js = document.createElement("div").style, "AnimationEvent" in window || (delete kn.animationend.animation, delete kn.animationiteration.animation, delete kn.animationstart.animation), "TransitionEvent" in window || delete kn.transitionend.transition);
  function Jr(e) {
    if (Ei[e]) return Ei[e];
    if (!kn[e]) return e;
    var t = kn[e], n;
    for (n in t) if (t.hasOwnProperty(n) && n in Js) return Ei[e] = t[n];
    return e;
  }
  var qs = Jr("animationend"), bs = Jr("animationiteration"), eu = Jr("animationstart"), tu = Jr("transitionend"), nu = /* @__PURE__ */ new Map(), ru = "abort auxClick cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");
  function At(e, t) {
    nu.set(e, t), C(t, [e]);
  }
  for (var Ni = 0; Ni < ru.length; Ni++) {
    var Ci = ru[Ni], Nf = Ci.toLowerCase(), Cf = Ci[0].toUpperCase() + Ci.slice(1);
    At(Nf, "on" + Cf);
  }
  At(qs, "onAnimationEnd"), At(bs, "onAnimationIteration"), At(eu, "onAnimationStart"), At("dblclick", "onDoubleClick"), At("focusin", "onFocus"), At("focusout", "onBlur"), At(tu, "onTransitionEnd"), z("onMouseEnter", ["mouseout", "mouseover"]), z("onMouseLeave", ["mouseout", "mouseover"]), z("onPointerEnter", ["pointerout", "pointerover"]), z("onPointerLeave", ["pointerout", "pointerover"]), C("onChange", "change click focusin focusout input keydown keyup selectionchange".split(" ")), C("onSelect", "focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" ")), C("onBeforeInput", ["compositionend", "keypress", "textInput", "paste"]), C("onCompositionEnd", "compositionend focusout keydown keypress keyup mousedown".split(" ")), C("onCompositionStart", "compositionstart focusout keydown keypress keyup mousedown".split(" ")), C("onCompositionUpdate", "compositionupdate focusout keydown keypress keyup mousedown".split(" "));
  var sr = "abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "), _f = new Set("cancel close invalid load scroll toggle".split(" ").concat(sr));
  function lu(e, t, n) {
    var r = e.type || "unknown-event";
    e.currentTarget = n, Ec(r, t, void 0, e), e.currentTarget = null;
  }
  function iu(e, t) {
    t = (t & 4) !== 0;
    for (var n = 0; n < e.length; n++) {
      var r = e[n], l = r.event;
      r = r.listeners;
      e: {
        var i = void 0;
        if (t) for (var o = r.length - 1; 0 <= o; o--) {
          var f = r[o], p = f.instance, y = f.currentTarget;
          if (f = f.listener, p !== i && l.isPropagationStopped()) break e;
          lu(l, f, y), i = p;
        }
        else for (o = 0; o < r.length; o++) {
          if (f = r[o], p = f.instance, y = f.currentTarget, f = f.listener, p !== i && l.isPropagationStopped()) break e;
          lu(l, f, y), i = p;
        }
      }
    }
    if (Dr) throw e = ni, Dr = !1, ni = null, e;
  }
  function ve(e, t) {
    var n = t[Li];
    n === void 0 && (n = t[Li] = /* @__PURE__ */ new Set());
    var r = e + "__bubble";
    n.has(r) || (ou(t, e, 2, !1), n.add(r));
  }
  function _i(e, t, n) {
    var r = 0;
    t && (r |= 4), ou(n, e, r, t);
  }
  var qr = "_reactListening" + Math.random().toString(36).slice(2);
  function ur(e) {
    if (!e[qr]) {
      e[qr] = !0, E.forEach(function(n) {
        n !== "selectionchange" && (_f.has(n) || _i(n, !1, e), _i(n, !0, e));
      });
      var t = e.nodeType === 9 ? e : e.ownerDocument;
      t === null || t[qr] || (t[qr] = !0, _i("selectionchange", !1, t));
    }
  }
  function ou(e, t, n, r) {
    switch (Ts(t)) {
      case 1:
        var l = $c;
        break;
      case 4:
        l = Uc;
        break;
      default:
        l = ai;
    }
    n = l.bind(null, t, n, e), l = void 0, !ti || t !== "touchstart" && t !== "touchmove" && t !== "wheel" || (l = !0), r ? l !== void 0 ? e.addEventListener(t, n, { capture: !0, passive: l }) : e.addEventListener(t, n, !0) : l !== void 0 ? e.addEventListener(t, n, { passive: l }) : e.addEventListener(t, n, !1);
  }
  function ji(e, t, n, r, l) {
    var i = r;
    if ((t & 1) === 0 && (t & 2) === 0 && r !== null) e: for (; ; ) {
      if (r === null) return;
      var o = r.tag;
      if (o === 3 || o === 4) {
        var f = r.stateNode.containerInfo;
        if (f === l || f.nodeType === 8 && f.parentNode === l) break;
        if (o === 4) for (o = r.return; o !== null; ) {
          var p = o.tag;
          if ((p === 3 || p === 4) && (p = o.stateNode.containerInfo, p === l || p.nodeType === 8 && p.parentNode === l)) return;
          o = o.return;
        }
        for (; f !== null; ) {
          if (o = en(f), o === null) return;
          if (p = o.tag, p === 5 || p === 6) {
            r = i = o;
            continue e;
          }
          f = f.parentNode;
        }
      }
      r = r.return;
    }
    fs(function() {
      var y = i, j = ql(n), T = [];
      e: {
        var _ = nu.get(e);
        if (_ !== void 0) {
          var I = di, A = e;
          switch (e) {
            case "keypress":
              if (Kr(n) === 0) break e;
            case "keydown":
            case "keyup":
              I = tf;
              break;
            case "focusin":
              A = "focus", I = mi;
              break;
            case "focusout":
              A = "blur", I = mi;
              break;
            case "beforeblur":
            case "afterblur":
              I = mi;
              break;
            case "click":
              if (n.button === 2) break e;
            case "auxclick":
            case "dblclick":
            case "mousedown":
            case "mousemove":
            case "mouseup":
            case "mouseout":
            case "mouseover":
            case "contextmenu":
              I = Ms;
              break;
            case "drag":
            case "dragend":
            case "dragenter":
            case "dragexit":
            case "dragleave":
            case "dragover":
            case "dragstart":
            case "drop":
              I = Vc;
              break;
            case "touchcancel":
            case "touchend":
            case "touchmove":
            case "touchstart":
              I = lf;
              break;
            case qs:
            case bs:
            case eu:
              I = Kc;
              break;
            case tu:
              I = sf;
              break;
            case "scroll":
              I = Hc;
              break;
            case "wheel":
              I = af;
              break;
            case "copy":
            case "cut":
            case "paste":
              I = Yc;
              break;
            case "gotpointercapture":
            case "lostpointercapture":
            case "pointercancel":
            case "pointerdown":
            case "pointermove":
            case "pointerout":
            case "pointerover":
            case "pointerup":
              I = Is;
          }
          var U = (t & 4) !== 0, je = !U && e === "scroll", m = U ? _ !== null ? _ + "Capture" : null : _;
          U = [];
          for (var h = y, g; h !== null; ) {
            g = h;
            var R = g.stateNode;
            if (g.tag === 5 && R !== null && (g = R, m !== null && (R = Wn(h, m), R != null && U.push(ar(h, R, g)))), je) break;
            h = h.return;
          }
          0 < U.length && (_ = new I(_, A, null, n, j), T.push({ event: _, listeners: U }));
        }
      }
      if ((t & 7) === 0) {
        e: {
          if (_ = e === "mouseover" || e === "pointerover", I = e === "mouseout" || e === "pointerout", _ && n !== Jl && (A = n.relatedTarget || n.fromElement) && (en(A) || A[Ct])) break e;
          if ((I || _) && (_ = j.window === j ? j : (_ = j.ownerDocument) ? _.defaultView || _.parentWindow : window, I ? (A = n.relatedTarget || n.toElement, I = y, A = A ? en(A) : null, A !== null && (je = bt(A), A !== je || A.tag !== 5 && A.tag !== 6) && (A = null)) : (I = null, A = y), I !== A)) {
            if (U = Ms, R = "onMouseLeave", m = "onMouseEnter", h = "mouse", (e === "pointerout" || e === "pointerover") && (U = Is, R = "onPointerLeave", m = "onPointerEnter", h = "pointer"), je = I == null ? _ : Nn(I), g = A == null ? _ : Nn(A), _ = new U(R, h + "leave", I, n, j), _.target = je, _.relatedTarget = g, R = null, en(j) === y && (U = new U(m, h + "enter", A, n, j), U.target = g, U.relatedTarget = je, R = U), je = R, I && A) t: {
              for (U = I, m = A, h = 0, g = U; g; g = Sn(g)) h++;
              for (g = 0, R = m; R; R = Sn(R)) g++;
              for (; 0 < h - g; ) U = Sn(U), h--;
              for (; 0 < g - h; ) m = Sn(m), g--;
              for (; h--; ) {
                if (U === m || m !== null && U === m.alternate) break t;
                U = Sn(U), m = Sn(m);
              }
              U = null;
            }
            else U = null;
            I !== null && su(T, _, I, U, !1), A !== null && je !== null && su(T, je, A, U, !0);
          }
        }
        e: {
          if (_ = y ? Nn(y) : window, I = _.nodeName && _.nodeName.toLowerCase(), I === "select" || I === "input" && _.type === "file") var B = vf;
          else if (Us(_)) if (Bs) B = wf;
          else {
            B = yf;
            var Q = gf;
          }
          else (I = _.nodeName) && I.toLowerCase() === "input" && (_.type === "checkbox" || _.type === "radio") && (B = xf);
          if (B && (B = B(e, y))) {
            Hs(T, B, n, j);
            break e;
          }
          Q && Q(e, _, y), e === "focusout" && (Q = _._wrapperState) && Q.controlled && _.type === "number" && Kl(_, "number", _.value);
        }
        switch (Q = y ? Nn(y) : window, e) {
          case "focusin":
            (Us(Q) || Q.contentEditable === "true") && (wn = Q, ki = y, or = null);
            break;
          case "focusout":
            or = ki = wn = null;
            break;
          case "mousedown":
            Si = !0;
            break;
          case "contextmenu":
          case "mouseup":
          case "dragend":
            Si = !1, Zs(T, n, j);
            break;
          case "selectionchange":
            if (Ef) break;
          case "keydown":
          case "keyup":
            Zs(T, n, j);
        }
        var K;
        if (gi) e: {
          switch (e) {
            case "compositionstart":
              var J = "onCompositionStart";
              break e;
            case "compositionend":
              J = "onCompositionEnd";
              break e;
            case "compositionupdate":
              J = "onCompositionUpdate";
              break e;
          }
          J = void 0;
        }
        else xn ? As(e, n) && (J = "onCompositionEnd") : e === "keydown" && n.keyCode === 229 && (J = "onCompositionStart");
        J && (Ds && n.locale !== "ko" && (xn || J !== "onCompositionStart" ? J === "onCompositionEnd" && xn && (K = Ps()) : (Ot = j, fi = "value" in Ot ? Ot.value : Ot.textContent, xn = !0)), Q = br(y, J), 0 < Q.length && (J = new Ls(J, e, null, n, j), T.push({ event: J, listeners: Q }), K ? J.data = K : (K = $s(n), K !== null && (J.data = K)))), (K = ff ? df(e, n) : pf(e, n)) && (y = br(y, "onBeforeInput"), 0 < y.length && (j = new Ls("onBeforeInput", "beforeinput", null, n, j), T.push({ event: j, listeners: y }), j.data = K));
      }
      iu(T, t);
    });
  }
  function ar(e, t, n) {
    return { instance: e, listener: t, currentTarget: n };
  }
  function br(e, t) {
    for (var n = t + "Capture", r = []; e !== null; ) {
      var l = e, i = l.stateNode;
      l.tag === 5 && i !== null && (l = i, i = Wn(e, n), i != null && r.unshift(ar(e, i, l)), i = Wn(e, t), i != null && r.push(ar(e, i, l))), e = e.return;
    }
    return r;
  }
  function Sn(e) {
    if (e === null) return null;
    do
      e = e.return;
    while (e && e.tag !== 5);
    return e || null;
  }
  function su(e, t, n, r, l) {
    for (var i = t._reactName, o = []; n !== null && n !== r; ) {
      var f = n, p = f.alternate, y = f.stateNode;
      if (p !== null && p === r) break;
      f.tag === 5 && y !== null && (f = y, l ? (p = Wn(n, i), p != null && o.unshift(ar(n, p, f))) : l || (p = Wn(n, i), p != null && o.push(ar(n, p, f)))), n = n.return;
    }
    o.length !== 0 && e.push({ event: t, listeners: o });
  }
  var jf = /\r\n?/g, zf = /\u0000|\uFFFD/g;
  function uu(e) {
    return (typeof e == "string" ? e : "" + e).replace(jf, `
`).replace(zf, "");
  }
  function el(e, t, n) {
    if (t = uu(t), uu(e) !== t && n) throw Error(s(425));
  }
  function tl() {
  }
  var zi = null, Ti = null;
  function Pi(e, t) {
    return e === "textarea" || e === "noscript" || typeof t.children == "string" || typeof t.children == "number" || typeof t.dangerouslySetInnerHTML == "object" && t.dangerouslySetInnerHTML !== null && t.dangerouslySetInnerHTML.__html != null;
  }
  var Ri = typeof setTimeout == "function" ? setTimeout : void 0, Tf = typeof clearTimeout == "function" ? clearTimeout : void 0, au = typeof Promise == "function" ? Promise : void 0, Pf = typeof queueMicrotask == "function" ? queueMicrotask : typeof au < "u" ? function(e) {
    return au.resolve(null).then(e).catch(Rf);
  } : Ri;
  function Rf(e) {
    setTimeout(function() {
      throw e;
    });
  }
  function Mi(e, t) {
    var n = t, r = 0;
    do {
      var l = n.nextSibling;
      if (e.removeChild(n), l && l.nodeType === 8) if (n = l.data, n === "/$") {
        if (r === 0) {
          e.removeChild(l), bn(t);
          return;
        }
        r--;
      } else n !== "$" && n !== "$?" && n !== "$!" || r++;
      n = l;
    } while (n);
    bn(t);
  }
  function $t(e) {
    for (; e != null; e = e.nextSibling) {
      var t = e.nodeType;
      if (t === 1 || t === 3) break;
      if (t === 8) {
        if (t = e.data, t === "$" || t === "$!" || t === "$?") break;
        if (t === "/$") return null;
      }
    }
    return e;
  }
  function cu(e) {
    e = e.previousSibling;
    for (var t = 0; e; ) {
      if (e.nodeType === 8) {
        var n = e.data;
        if (n === "$" || n === "$!" || n === "$?") {
          if (t === 0) return e;
          t--;
        } else n === "/$" && t++;
      }
      e = e.previousSibling;
    }
    return null;
  }
  var En = Math.random().toString(36).slice(2), kt = "__reactFiber$" + En, cr = "__reactProps$" + En, Ct = "__reactContainer$" + En, Li = "__reactEvents$" + En, Mf = "__reactListeners$" + En, Lf = "__reactHandles$" + En;
  function en(e) {
    var t = e[kt];
    if (t) return t;
    for (var n = e.parentNode; n; ) {
      if (t = n[Ct] || n[kt]) {
        if (n = t.alternate, t.child !== null || n !== null && n.child !== null) for (e = cu(e); e !== null; ) {
          if (n = e[kt]) return n;
          e = cu(e);
        }
        return t;
      }
      e = n, n = e.parentNode;
    }
    return null;
  }
  function fr(e) {
    return e = e[kt] || e[Ct], !e || e.tag !== 5 && e.tag !== 6 && e.tag !== 13 && e.tag !== 3 ? null : e;
  }
  function Nn(e) {
    if (e.tag === 5 || e.tag === 6) return e.stateNode;
    throw Error(s(33));
  }
  function nl(e) {
    return e[cr] || null;
  }
  var Ii = [], Cn = -1;
  function Ut(e) {
    return { current: e };
  }
  function ge(e) {
    0 > Cn || (e.current = Ii[Cn], Ii[Cn] = null, Cn--);
  }
  function he(e, t) {
    Cn++, Ii[Cn] = e.current, e.current = t;
  }
  var Ht = {}, He = Ut(Ht), Xe = Ut(!1), tn = Ht;
  function _n(e, t) {
    var n = e.type.contextTypes;
    if (!n) return Ht;
    var r = e.stateNode;
    if (r && r.__reactInternalMemoizedUnmaskedChildContext === t) return r.__reactInternalMemoizedMaskedChildContext;
    var l = {}, i;
    for (i in n) l[i] = t[i];
    return r && (e = e.stateNode, e.__reactInternalMemoizedUnmaskedChildContext = t, e.__reactInternalMemoizedMaskedChildContext = l), l;
  }
  function Ze(e) {
    return e = e.childContextTypes, e != null;
  }
  function rl() {
    ge(Xe), ge(He);
  }
  function fu(e, t, n) {
    if (He.current !== Ht) throw Error(s(168));
    he(He, t), he(Xe, n);
  }
  function du(e, t, n) {
    var r = e.stateNode;
    if (t = t.childContextTypes, typeof r.getChildContext != "function") return n;
    r = r.getChildContext();
    for (var l in r) if (!(l in t)) throw Error(s(108, se(e) || "Unknown", l));
    return k({}, n, r);
  }
  function ll(e) {
    return e = (e = e.stateNode) && e.__reactInternalMemoizedMergedChildContext || Ht, tn = He.current, he(He, e), he(Xe, Xe.current), !0;
  }
  function pu(e, t, n) {
    var r = e.stateNode;
    if (!r) throw Error(s(169));
    n ? (e = du(e, t, tn), r.__reactInternalMemoizedMergedChildContext = e, ge(Xe), ge(He), he(He, e)) : ge(Xe), he(Xe, n);
  }
  var _t = null, il = !1, Di = !1;
  function hu(e) {
    _t === null ? _t = [e] : _t.push(e);
  }
  function If(e) {
    il = !0, hu(e);
  }
  function Bt() {
    if (!Di && _t !== null) {
      Di = !0;
      var e = 0, t = de;
      try {
        var n = _t;
        for (de = 1; e < n.length; e++) {
          var r = n[e];
          do
            r = r(!0);
          while (r !== null);
        }
        _t = null, il = !1;
      } catch (l) {
        throw _t !== null && (_t = _t.slice(e + 1)), vs(ri, Bt), l;
      } finally {
        de = t, Di = !1;
      }
    }
    return null;
  }
  var jn = [], zn = 0, ol = null, sl = 0, ot = [], st = 0, nn = null, jt = 1, zt = "";
  function rn(e, t) {
    jn[zn++] = sl, jn[zn++] = ol, ol = e, sl = t;
  }
  function mu(e, t, n) {
    ot[st++] = jt, ot[st++] = zt, ot[st++] = nn, nn = e;
    var r = jt;
    e = zt;
    var l = 32 - pt(r) - 1;
    r &= ~(1 << l), n += 1;
    var i = 32 - pt(t) + l;
    if (30 < i) {
      var o = l - l % 5;
      i = (r & (1 << o) - 1).toString(32), r >>= o, l -= o, jt = 1 << 32 - pt(t) + l | n << l | r, zt = i + e;
    } else jt = 1 << i | n << l | r, zt = e;
  }
  function Fi(e) {
    e.return !== null && (rn(e, 1), mu(e, 1, 0));
  }
  function Oi(e) {
    for (; e === ol; ) ol = jn[--zn], jn[zn] = null, sl = jn[--zn], jn[zn] = null;
    for (; e === nn; ) nn = ot[--st], ot[st] = null, zt = ot[--st], ot[st] = null, jt = ot[--st], ot[st] = null;
  }
  var nt = null, rt = null, ke = !1, mt = null;
  function vu(e, t) {
    var n = ft(5, null, null, 0);
    n.elementType = "DELETED", n.stateNode = t, n.return = e, t = e.deletions, t === null ? (e.deletions = [n], e.flags |= 16) : t.push(n);
  }
  function gu(e, t) {
    switch (e.tag) {
      case 5:
        var n = e.type;
        return t = t.nodeType !== 1 || n.toLowerCase() !== t.nodeName.toLowerCase() ? null : t, t !== null ? (e.stateNode = t, nt = e, rt = $t(t.firstChild), !0) : !1;
      case 6:
        return t = e.pendingProps === "" || t.nodeType !== 3 ? null : t, t !== null ? (e.stateNode = t, nt = e, rt = null, !0) : !1;
      case 13:
        return t = t.nodeType !== 8 ? null : t, t !== null ? (n = nn !== null ? { id: jt, overflow: zt } : null, e.memoizedState = { dehydrated: t, treeContext: n, retryLane: 1073741824 }, n = ft(18, null, null, 0), n.stateNode = t, n.return = e, e.child = n, nt = e, rt = null, !0) : !1;
      default:
        return !1;
    }
  }
  function Ai(e) {
    return (e.mode & 1) !== 0 && (e.flags & 128) === 0;
  }
  function $i(e) {
    if (ke) {
      var t = rt;
      if (t) {
        var n = t;
        if (!gu(e, t)) {
          if (Ai(e)) throw Error(s(418));
          t = $t(n.nextSibling);
          var r = nt;
          t && gu(e, t) ? vu(r, n) : (e.flags = e.flags & -4097 | 2, ke = !1, nt = e);
        }
      } else {
        if (Ai(e)) throw Error(s(418));
        e.flags = e.flags & -4097 | 2, ke = !1, nt = e;
      }
    }
  }
  function yu(e) {
    for (e = e.return; e !== null && e.tag !== 5 && e.tag !== 3 && e.tag !== 13; ) e = e.return;
    nt = e;
  }
  function ul(e) {
    if (e !== nt) return !1;
    if (!ke) return yu(e), ke = !0, !1;
    var t;
    if ((t = e.tag !== 3) && !(t = e.tag !== 5) && (t = e.type, t = t !== "head" && t !== "body" && !Pi(e.type, e.memoizedProps)), t && (t = rt)) {
      if (Ai(e)) throw xu(), Error(s(418));
      for (; t; ) vu(e, t), t = $t(t.nextSibling);
    }
    if (yu(e), e.tag === 13) {
      if (e = e.memoizedState, e = e !== null ? e.dehydrated : null, !e) throw Error(s(317));
      e: {
        for (e = e.nextSibling, t = 0; e; ) {
          if (e.nodeType === 8) {
            var n = e.data;
            if (n === "/$") {
              if (t === 0) {
                rt = $t(e.nextSibling);
                break e;
              }
              t--;
            } else n !== "$" && n !== "$!" && n !== "$?" || t++;
          }
          e = e.nextSibling;
        }
        rt = null;
      }
    } else rt = nt ? $t(e.stateNode.nextSibling) : null;
    return !0;
  }
  function xu() {
    for (var e = rt; e; ) e = $t(e.nextSibling);
  }
  function Tn() {
    rt = nt = null, ke = !1;
  }
  function Ui(e) {
    mt === null ? mt = [e] : mt.push(e);
  }
  var Df = me.ReactCurrentBatchConfig;
  function dr(e, t, n) {
    if (e = n.ref, e !== null && typeof e != "function" && typeof e != "object") {
      if (n._owner) {
        if (n = n._owner, n) {
          if (n.tag !== 1) throw Error(s(309));
          var r = n.stateNode;
        }
        if (!r) throw Error(s(147, e));
        var l = r, i = "" + e;
        return t !== null && t.ref !== null && typeof t.ref == "function" && t.ref._stringRef === i ? t.ref : (t = function(o) {
          var f = l.refs;
          o === null ? delete f[i] : f[i] = o;
        }, t._stringRef = i, t);
      }
      if (typeof e != "string") throw Error(s(284));
      if (!n._owner) throw Error(s(290, e));
    }
    return e;
  }
  function al(e, t) {
    throw e = Object.prototype.toString.call(t), Error(s(31, e === "[object Object]" ? "object with keys {" + Object.keys(t).join(", ") + "}" : e));
  }
  function wu(e) {
    var t = e._init;
    return t(e._payload);
  }
  function ku(e) {
    function t(m, h) {
      if (e) {
        var g = m.deletions;
        g === null ? (m.deletions = [h], m.flags |= 16) : g.push(h);
      }
    }
    function n(m, h) {
      if (!e) return null;
      for (; h !== null; ) t(m, h), h = h.sibling;
      return null;
    }
    function r(m, h) {
      for (m = /* @__PURE__ */ new Map(); h !== null; ) h.key !== null ? m.set(h.key, h) : m.set(h.index, h), h = h.sibling;
      return m;
    }
    function l(m, h) {
      return m = Zt(m, h), m.index = 0, m.sibling = null, m;
    }
    function i(m, h, g) {
      return m.index = g, e ? (g = m.alternate, g !== null ? (g = g.index, g < h ? (m.flags |= 2, h) : g) : (m.flags |= 2, h)) : (m.flags |= 1048576, h);
    }
    function o(m) {
      return e && m.alternate === null && (m.flags |= 2), m;
    }
    function f(m, h, g, R) {
      return h === null || h.tag !== 6 ? (h = Mo(g, m.mode, R), h.return = m, h) : (h = l(h, g), h.return = m, h);
    }
    function p(m, h, g, R) {
      var B = g.type;
      return B === ue ? j(m, h, g.props.children, R, g.key) : h !== null && (h.elementType === B || typeof B == "object" && B !== null && B.$$typeof === Ie && wu(B) === h.type) ? (R = l(h, g.props), R.ref = dr(m, h, g), R.return = m, R) : (R = Ll(g.type, g.key, g.props, null, m.mode, R), R.ref = dr(m, h, g), R.return = m, R);
    }
    function y(m, h, g, R) {
      return h === null || h.tag !== 4 || h.stateNode.containerInfo !== g.containerInfo || h.stateNode.implementation !== g.implementation ? (h = Lo(g, m.mode, R), h.return = m, h) : (h = l(h, g.children || []), h.return = m, h);
    }
    function j(m, h, g, R, B) {
      return h === null || h.tag !== 7 ? (h = dn(g, m.mode, R, B), h.return = m, h) : (h = l(h, g), h.return = m, h);
    }
    function T(m, h, g) {
      if (typeof h == "string" && h !== "" || typeof h == "number") return h = Mo("" + h, m.mode, g), h.return = m, h;
      if (typeof h == "object" && h !== null) {
        switch (h.$$typeof) {
          case Pe:
            return g = Ll(h.type, h.key, h.props, null, m.mode, g), g.ref = dr(m, null, h), g.return = m, g;
          case fe:
            return h = Lo(h, m.mode, g), h.return = m, h;
          case Ie:
            var R = h._init;
            return T(m, R(h._payload), g);
        }
        if (Hn(h) || x(h)) return h = dn(h, m.mode, g, null), h.return = m, h;
        al(m, h);
      }
      return null;
    }
    function _(m, h, g, R) {
      var B = h !== null ? h.key : null;
      if (typeof g == "string" && g !== "" || typeof g == "number") return B !== null ? null : f(m, h, "" + g, R);
      if (typeof g == "object" && g !== null) {
        switch (g.$$typeof) {
          case Pe:
            return g.key === B ? p(m, h, g, R) : null;
          case fe:
            return g.key === B ? y(m, h, g, R) : null;
          case Ie:
            return B = g._init, _(
              m,
              h,
              B(g._payload),
              R
            );
        }
        if (Hn(g) || x(g)) return B !== null ? null : j(m, h, g, R, null);
        al(m, g);
      }
      return null;
    }
    function I(m, h, g, R, B) {
      if (typeof R == "string" && R !== "" || typeof R == "number") return m = m.get(g) || null, f(h, m, "" + R, B);
      if (typeof R == "object" && R !== null) {
        switch (R.$$typeof) {
          case Pe:
            return m = m.get(R.key === null ? g : R.key) || null, p(h, m, R, B);
          case fe:
            return m = m.get(R.key === null ? g : R.key) || null, y(h, m, R, B);
          case Ie:
            var Q = R._init;
            return I(m, h, g, Q(R._payload), B);
        }
        if (Hn(R) || x(R)) return m = m.get(g) || null, j(h, m, R, B, null);
        al(h, R);
      }
      return null;
    }
    function A(m, h, g, R) {
      for (var B = null, Q = null, K = h, J = h = 0, Oe = null; K !== null && J < g.length; J++) {
        K.index > J ? (Oe = K, K = null) : Oe = K.sibling;
        var ce = _(m, K, g[J], R);
        if (ce === null) {
          K === null && (K = Oe);
          break;
        }
        e && K && ce.alternate === null && t(m, K), h = i(ce, h, J), Q === null ? B = ce : Q.sibling = ce, Q = ce, K = Oe;
      }
      if (J === g.length) return n(m, K), ke && rn(m, J), B;
      if (K === null) {
        for (; J < g.length; J++) K = T(m, g[J], R), K !== null && (h = i(K, h, J), Q === null ? B = K : Q.sibling = K, Q = K);
        return ke && rn(m, J), B;
      }
      for (K = r(m, K); J < g.length; J++) Oe = I(K, m, J, g[J], R), Oe !== null && (e && Oe.alternate !== null && K.delete(Oe.key === null ? J : Oe.key), h = i(Oe, h, J), Q === null ? B = Oe : Q.sibling = Oe, Q = Oe);
      return e && K.forEach(function(Jt) {
        return t(m, Jt);
      }), ke && rn(m, J), B;
    }
    function U(m, h, g, R) {
      var B = x(g);
      if (typeof B != "function") throw Error(s(150));
      if (g = B.call(g), g == null) throw Error(s(151));
      for (var Q = B = null, K = h, J = h = 0, Oe = null, ce = g.next(); K !== null && !ce.done; J++, ce = g.next()) {
        K.index > J ? (Oe = K, K = null) : Oe = K.sibling;
        var Jt = _(m, K, ce.value, R);
        if (Jt === null) {
          K === null && (K = Oe);
          break;
        }
        e && K && Jt.alternate === null && t(m, K), h = i(Jt, h, J), Q === null ? B = Jt : Q.sibling = Jt, Q = Jt, K = Oe;
      }
      if (ce.done) return n(
        m,
        K
      ), ke && rn(m, J), B;
      if (K === null) {
        for (; !ce.done; J++, ce = g.next()) ce = T(m, ce.value, R), ce !== null && (h = i(ce, h, J), Q === null ? B = ce : Q.sibling = ce, Q = ce);
        return ke && rn(m, J), B;
      }
      for (K = r(m, K); !ce.done; J++, ce = g.next()) ce = I(K, m, J, ce.value, R), ce !== null && (e && ce.alternate !== null && K.delete(ce.key === null ? J : ce.key), h = i(ce, h, J), Q === null ? B = ce : Q.sibling = ce, Q = ce);
      return e && K.forEach(function(hd) {
        return t(m, hd);
      }), ke && rn(m, J), B;
    }
    function je(m, h, g, R) {
      if (typeof g == "object" && g !== null && g.type === ue && g.key === null && (g = g.props.children), typeof g == "object" && g !== null) {
        switch (g.$$typeof) {
          case Pe:
            e: {
              for (var B = g.key, Q = h; Q !== null; ) {
                if (Q.key === B) {
                  if (B = g.type, B === ue) {
                    if (Q.tag === 7) {
                      n(m, Q.sibling), h = l(Q, g.props.children), h.return = m, m = h;
                      break e;
                    }
                  } else if (Q.elementType === B || typeof B == "object" && B !== null && B.$$typeof === Ie && wu(B) === Q.type) {
                    n(m, Q.sibling), h = l(Q, g.props), h.ref = dr(m, Q, g), h.return = m, m = h;
                    break e;
                  }
                  n(m, Q);
                  break;
                } else t(m, Q);
                Q = Q.sibling;
              }
              g.type === ue ? (h = dn(g.props.children, m.mode, R, g.key), h.return = m, m = h) : (R = Ll(g.type, g.key, g.props, null, m.mode, R), R.ref = dr(m, h, g), R.return = m, m = R);
            }
            return o(m);
          case fe:
            e: {
              for (Q = g.key; h !== null; ) {
                if (h.key === Q) if (h.tag === 4 && h.stateNode.containerInfo === g.containerInfo && h.stateNode.implementation === g.implementation) {
                  n(m, h.sibling), h = l(h, g.children || []), h.return = m, m = h;
                  break e;
                } else {
                  n(m, h);
                  break;
                }
                else t(m, h);
                h = h.sibling;
              }
              h = Lo(g, m.mode, R), h.return = m, m = h;
            }
            return o(m);
          case Ie:
            return Q = g._init, je(m, h, Q(g._payload), R);
        }
        if (Hn(g)) return A(m, h, g, R);
        if (x(g)) return U(m, h, g, R);
        al(m, g);
      }
      return typeof g == "string" && g !== "" || typeof g == "number" ? (g = "" + g, h !== null && h.tag === 6 ? (n(m, h.sibling), h = l(h, g), h.return = m, m = h) : (n(m, h), h = Mo(g, m.mode, R), h.return = m, m = h), o(m)) : n(m, h);
    }
    return je;
  }
  var Pn = ku(!0), Su = ku(!1), cl = Ut(null), fl = null, Rn = null, Hi = null;
  function Bi() {
    Hi = Rn = fl = null;
  }
  function Vi(e) {
    var t = cl.current;
    ge(cl), e._currentValue = t;
  }
  function Wi(e, t, n) {
    for (; e !== null; ) {
      var r = e.alternate;
      if ((e.childLanes & t) !== t ? (e.childLanes |= t, r !== null && (r.childLanes |= t)) : r !== null && (r.childLanes & t) !== t && (r.childLanes |= t), e === n) break;
      e = e.return;
    }
  }
  function Mn(e, t) {
    fl = e, Hi = Rn = null, e = e.dependencies, e !== null && e.firstContext !== null && ((e.lanes & t) !== 0 && (Je = !0), e.firstContext = null);
  }
  function ut(e) {
    var t = e._currentValue;
    if (Hi !== e) if (e = { context: e, memoizedValue: t, next: null }, Rn === null) {
      if (fl === null) throw Error(s(308));
      Rn = e, fl.dependencies = { lanes: 0, firstContext: e };
    } else Rn = Rn.next = e;
    return t;
  }
  var ln = null;
  function Qi(e) {
    ln === null ? ln = [e] : ln.push(e);
  }
  function Eu(e, t, n, r) {
    var l = t.interleaved;
    return l === null ? (n.next = n, Qi(t)) : (n.next = l.next, l.next = n), t.interleaved = n, Tt(e, r);
  }
  function Tt(e, t) {
    e.lanes |= t;
    var n = e.alternate;
    for (n !== null && (n.lanes |= t), n = e, e = e.return; e !== null; ) e.childLanes |= t, n = e.alternate, n !== null && (n.childLanes |= t), n = e, e = e.return;
    return n.tag === 3 ? n.stateNode : null;
  }
  var Vt = !1;
  function Ki(e) {
    e.updateQueue = { baseState: e.memoizedState, firstBaseUpdate: null, lastBaseUpdate: null, shared: { pending: null, interleaved: null, lanes: 0 }, effects: null };
  }
  function Nu(e, t) {
    e = e.updateQueue, t.updateQueue === e && (t.updateQueue = { baseState: e.baseState, firstBaseUpdate: e.firstBaseUpdate, lastBaseUpdate: e.lastBaseUpdate, shared: e.shared, effects: e.effects });
  }
  function Pt(e, t) {
    return { eventTime: e, lane: t, tag: 0, payload: null, callback: null, next: null };
  }
  function Wt(e, t, n) {
    var r = e.updateQueue;
    if (r === null) return null;
    if (r = r.shared, (ae & 2) !== 0) {
      var l = r.pending;
      return l === null ? t.next = t : (t.next = l.next, l.next = t), r.pending = t, Tt(e, n);
    }
    return l = r.interleaved, l === null ? (t.next = t, Qi(r)) : (t.next = l.next, l.next = t), r.interleaved = t, Tt(e, n);
  }
  function dl(e, t, n) {
    if (t = t.updateQueue, t !== null && (t = t.shared, (n & 4194240) !== 0)) {
      var r = t.lanes;
      r &= e.pendingLanes, n |= r, t.lanes = n, oi(e, n);
    }
  }
  function Cu(e, t) {
    var n = e.updateQueue, r = e.alternate;
    if (r !== null && (r = r.updateQueue, n === r)) {
      var l = null, i = null;
      if (n = n.firstBaseUpdate, n !== null) {
        do {
          var o = { eventTime: n.eventTime, lane: n.lane, tag: n.tag, payload: n.payload, callback: n.callback, next: null };
          i === null ? l = i = o : i = i.next = o, n = n.next;
        } while (n !== null);
        i === null ? l = i = t : i = i.next = t;
      } else l = i = t;
      n = { baseState: r.baseState, firstBaseUpdate: l, lastBaseUpdate: i, shared: r.shared, effects: r.effects }, e.updateQueue = n;
      return;
    }
    e = n.lastBaseUpdate, e === null ? n.firstBaseUpdate = t : e.next = t, n.lastBaseUpdate = t;
  }
  function pl(e, t, n, r) {
    var l = e.updateQueue;
    Vt = !1;
    var i = l.firstBaseUpdate, o = l.lastBaseUpdate, f = l.shared.pending;
    if (f !== null) {
      l.shared.pending = null;
      var p = f, y = p.next;
      p.next = null, o === null ? i = y : o.next = y, o = p;
      var j = e.alternate;
      j !== null && (j = j.updateQueue, f = j.lastBaseUpdate, f !== o && (f === null ? j.firstBaseUpdate = y : f.next = y, j.lastBaseUpdate = p));
    }
    if (i !== null) {
      var T = l.baseState;
      o = 0, j = y = p = null, f = i;
      do {
        var _ = f.lane, I = f.eventTime;
        if ((r & _) === _) {
          j !== null && (j = j.next = {
            eventTime: I,
            lane: 0,
            tag: f.tag,
            payload: f.payload,
            callback: f.callback,
            next: null
          });
          e: {
            var A = e, U = f;
            switch (_ = t, I = n, U.tag) {
              case 1:
                if (A = U.payload, typeof A == "function") {
                  T = A.call(I, T, _);
                  break e;
                }
                T = A;
                break e;
              case 3:
                A.flags = A.flags & -65537 | 128;
              case 0:
                if (A = U.payload, _ = typeof A == "function" ? A.call(I, T, _) : A, _ == null) break e;
                T = k({}, T, _);
                break e;
              case 2:
                Vt = !0;
            }
          }
          f.callback !== null && f.lane !== 0 && (e.flags |= 64, _ = l.effects, _ === null ? l.effects = [f] : _.push(f));
        } else I = { eventTime: I, lane: _, tag: f.tag, payload: f.payload, callback: f.callback, next: null }, j === null ? (y = j = I, p = T) : j = j.next = I, o |= _;
        if (f = f.next, f === null) {
          if (f = l.shared.pending, f === null) break;
          _ = f, f = _.next, _.next = null, l.lastBaseUpdate = _, l.shared.pending = null;
        }
      } while (!0);
      if (j === null && (p = T), l.baseState = p, l.firstBaseUpdate = y, l.lastBaseUpdate = j, t = l.shared.interleaved, t !== null) {
        l = t;
        do
          o |= l.lane, l = l.next;
        while (l !== t);
      } else i === null && (l.shared.lanes = 0);
      un |= o, e.lanes = o, e.memoizedState = T;
    }
  }
  function _u(e, t, n) {
    if (e = t.effects, t.effects = null, e !== null) for (t = 0; t < e.length; t++) {
      var r = e[t], l = r.callback;
      if (l !== null) {
        if (r.callback = null, r = n, typeof l != "function") throw Error(s(191, l));
        l.call(r);
      }
    }
  }
  var pr = {}, St = Ut(pr), hr = Ut(pr), mr = Ut(pr);
  function on(e) {
    if (e === pr) throw Error(s(174));
    return e;
  }
  function Gi(e, t) {
    switch (he(mr, t), he(hr, e), he(St, pr), e = t.nodeType, e) {
      case 9:
      case 11:
        t = (t = t.documentElement) ? t.namespaceURI : Yl(null, "");
        break;
      default:
        e = e === 8 ? t.parentNode : t, t = e.namespaceURI || null, e = e.tagName, t = Yl(t, e);
    }
    ge(St), he(St, t);
  }
  function Ln() {
    ge(St), ge(hr), ge(mr);
  }
  function ju(e) {
    on(mr.current);
    var t = on(St.current), n = Yl(t, e.type);
    t !== n && (he(hr, e), he(St, n));
  }
  function Yi(e) {
    hr.current === e && (ge(St), ge(hr));
  }
  var Se = Ut(0);
  function hl(e) {
    for (var t = e; t !== null; ) {
      if (t.tag === 13) {
        var n = t.memoizedState;
        if (n !== null && (n = n.dehydrated, n === null || n.data === "$?" || n.data === "$!")) return t;
      } else if (t.tag === 19 && t.memoizedProps.revealOrder !== void 0) {
        if ((t.flags & 128) !== 0) return t;
      } else if (t.child !== null) {
        t.child.return = t, t = t.child;
        continue;
      }
      if (t === e) break;
      for (; t.sibling === null; ) {
        if (t.return === null || t.return === e) return null;
        t = t.return;
      }
      t.sibling.return = t.return, t = t.sibling;
    }
    return null;
  }
  var Xi = [];
  function Zi() {
    for (var e = 0; e < Xi.length; e++) Xi[e]._workInProgressVersionPrimary = null;
    Xi.length = 0;
  }
  var ml = me.ReactCurrentDispatcher, Ji = me.ReactCurrentBatchConfig, sn = 0, Ee = null, Re = null, De = null, vl = !1, vr = !1, gr = 0, Ff = 0;
  function Be() {
    throw Error(s(321));
  }
  function qi(e, t) {
    if (t === null) return !1;
    for (var n = 0; n < t.length && n < e.length; n++) if (!ht(e[n], t[n])) return !1;
    return !0;
  }
  function bi(e, t, n, r, l, i) {
    if (sn = i, Ee = t, t.memoizedState = null, t.updateQueue = null, t.lanes = 0, ml.current = e === null || e.memoizedState === null ? Uf : Hf, e = n(r, l), vr) {
      i = 0;
      do {
        if (vr = !1, gr = 0, 25 <= i) throw Error(s(301));
        i += 1, De = Re = null, t.updateQueue = null, ml.current = Bf, e = n(r, l);
      } while (vr);
    }
    if (ml.current = xl, t = Re !== null && Re.next !== null, sn = 0, De = Re = Ee = null, vl = !1, t) throw Error(s(300));
    return e;
  }
  function eo() {
    var e = gr !== 0;
    return gr = 0, e;
  }
  function Et() {
    var e = { memoizedState: null, baseState: null, baseQueue: null, queue: null, next: null };
    return De === null ? Ee.memoizedState = De = e : De = De.next = e, De;
  }
  function at() {
    if (Re === null) {
      var e = Ee.alternate;
      e = e !== null ? e.memoizedState : null;
    } else e = Re.next;
    var t = De === null ? Ee.memoizedState : De.next;
    if (t !== null) De = t, Re = e;
    else {
      if (e === null) throw Error(s(310));
      Re = e, e = { memoizedState: Re.memoizedState, baseState: Re.baseState, baseQueue: Re.baseQueue, queue: Re.queue, next: null }, De === null ? Ee.memoizedState = De = e : De = De.next = e;
    }
    return De;
  }
  function yr(e, t) {
    return typeof t == "function" ? t(e) : t;
  }
  function to(e) {
    var t = at(), n = t.queue;
    if (n === null) throw Error(s(311));
    n.lastRenderedReducer = e;
    var r = Re, l = r.baseQueue, i = n.pending;
    if (i !== null) {
      if (l !== null) {
        var o = l.next;
        l.next = i.next, i.next = o;
      }
      r.baseQueue = l = i, n.pending = null;
    }
    if (l !== null) {
      i = l.next, r = r.baseState;
      var f = o = null, p = null, y = i;
      do {
        var j = y.lane;
        if ((sn & j) === j) p !== null && (p = p.next = { lane: 0, action: y.action, hasEagerState: y.hasEagerState, eagerState: y.eagerState, next: null }), r = y.hasEagerState ? y.eagerState : e(r, y.action);
        else {
          var T = {
            lane: j,
            action: y.action,
            hasEagerState: y.hasEagerState,
            eagerState: y.eagerState,
            next: null
          };
          p === null ? (f = p = T, o = r) : p = p.next = T, Ee.lanes |= j, un |= j;
        }
        y = y.next;
      } while (y !== null && y !== i);
      p === null ? o = r : p.next = f, ht(r, t.memoizedState) || (Je = !0), t.memoizedState = r, t.baseState = o, t.baseQueue = p, n.lastRenderedState = r;
    }
    if (e = n.interleaved, e !== null) {
      l = e;
      do
        i = l.lane, Ee.lanes |= i, un |= i, l = l.next;
      while (l !== e);
    } else l === null && (n.lanes = 0);
    return [t.memoizedState, n.dispatch];
  }
  function no(e) {
    var t = at(), n = t.queue;
    if (n === null) throw Error(s(311));
    n.lastRenderedReducer = e;
    var r = n.dispatch, l = n.pending, i = t.memoizedState;
    if (l !== null) {
      n.pending = null;
      var o = l = l.next;
      do
        i = e(i, o.action), o = o.next;
      while (o !== l);
      ht(i, t.memoizedState) || (Je = !0), t.memoizedState = i, t.baseQueue === null && (t.baseState = i), n.lastRenderedState = i;
    }
    return [i, r];
  }
  function zu() {
  }
  function Tu(e, t) {
    var n = Ee, r = at(), l = t(), i = !ht(r.memoizedState, l);
    if (i && (r.memoizedState = l, Je = !0), r = r.queue, ro(Mu.bind(null, n, r, e), [e]), r.getSnapshot !== t || i || De !== null && De.memoizedState.tag & 1) {
      if (n.flags |= 2048, xr(9, Ru.bind(null, n, r, l, t), void 0, null), Fe === null) throw Error(s(349));
      (sn & 30) !== 0 || Pu(n, t, l);
    }
    return l;
  }
  function Pu(e, t, n) {
    e.flags |= 16384, e = { getSnapshot: t, value: n }, t = Ee.updateQueue, t === null ? (t = { lastEffect: null, stores: null }, Ee.updateQueue = t, t.stores = [e]) : (n = t.stores, n === null ? t.stores = [e] : n.push(e));
  }
  function Ru(e, t, n, r) {
    t.value = n, t.getSnapshot = r, Lu(t) && Iu(e);
  }
  function Mu(e, t, n) {
    return n(function() {
      Lu(t) && Iu(e);
    });
  }
  function Lu(e) {
    var t = e.getSnapshot;
    e = e.value;
    try {
      var n = t();
      return !ht(e, n);
    } catch {
      return !0;
    }
  }
  function Iu(e) {
    var t = Tt(e, 1);
    t !== null && xt(t, e, 1, -1);
  }
  function Du(e) {
    var t = Et();
    return typeof e == "function" && (e = e()), t.memoizedState = t.baseState = e, e = { pending: null, interleaved: null, lanes: 0, dispatch: null, lastRenderedReducer: yr, lastRenderedState: e }, t.queue = e, e = e.dispatch = $f.bind(null, Ee, e), [t.memoizedState, e];
  }
  function xr(e, t, n, r) {
    return e = { tag: e, create: t, destroy: n, deps: r, next: null }, t = Ee.updateQueue, t === null ? (t = { lastEffect: null, stores: null }, Ee.updateQueue = t, t.lastEffect = e.next = e) : (n = t.lastEffect, n === null ? t.lastEffect = e.next = e : (r = n.next, n.next = e, e.next = r, t.lastEffect = e)), e;
  }
  function Fu() {
    return at().memoizedState;
  }
  function gl(e, t, n, r) {
    var l = Et();
    Ee.flags |= e, l.memoizedState = xr(1 | t, n, void 0, r === void 0 ? null : r);
  }
  function yl(e, t, n, r) {
    var l = at();
    r = r === void 0 ? null : r;
    var i = void 0;
    if (Re !== null) {
      var o = Re.memoizedState;
      if (i = o.destroy, r !== null && qi(r, o.deps)) {
        l.memoizedState = xr(t, n, i, r);
        return;
      }
    }
    Ee.flags |= e, l.memoizedState = xr(1 | t, n, i, r);
  }
  function Ou(e, t) {
    return gl(8390656, 8, e, t);
  }
  function ro(e, t) {
    return yl(2048, 8, e, t);
  }
  function Au(e, t) {
    return yl(4, 2, e, t);
  }
  function $u(e, t) {
    return yl(4, 4, e, t);
  }
  function Uu(e, t) {
    if (typeof t == "function") return e = e(), t(e), function() {
      t(null);
    };
    if (t != null) return e = e(), t.current = e, function() {
      t.current = null;
    };
  }
  function Hu(e, t, n) {
    return n = n != null ? n.concat([e]) : null, yl(4, 4, Uu.bind(null, t, e), n);
  }
  function lo() {
  }
  function Bu(e, t) {
    var n = at();
    t = t === void 0 ? null : t;
    var r = n.memoizedState;
    return r !== null && t !== null && qi(t, r[1]) ? r[0] : (n.memoizedState = [e, t], e);
  }
  function Vu(e, t) {
    var n = at();
    t = t === void 0 ? null : t;
    var r = n.memoizedState;
    return r !== null && t !== null && qi(t, r[1]) ? r[0] : (e = e(), n.memoizedState = [e, t], e);
  }
  function Wu(e, t, n) {
    return (sn & 21) === 0 ? (e.baseState && (e.baseState = !1, Je = !0), e.memoizedState = n) : (ht(n, t) || (n = ws(), Ee.lanes |= n, un |= n, e.baseState = !0), t);
  }
  function Of(e, t) {
    var n = de;
    de = n !== 0 && 4 > n ? n : 4, e(!0);
    var r = Ji.transition;
    Ji.transition = {};
    try {
      e(!1), t();
    } finally {
      de = n, Ji.transition = r;
    }
  }
  function Qu() {
    return at().memoizedState;
  }
  function Af(e, t, n) {
    var r = Yt(e);
    if (n = { lane: r, action: n, hasEagerState: !1, eagerState: null, next: null }, Ku(e)) Gu(t, n);
    else if (n = Eu(e, t, n, r), n !== null) {
      var l = Ke();
      xt(n, e, r, l), Yu(n, t, r);
    }
  }
  function $f(e, t, n) {
    var r = Yt(e), l = { lane: r, action: n, hasEagerState: !1, eagerState: null, next: null };
    if (Ku(e)) Gu(t, l);
    else {
      var i = e.alternate;
      if (e.lanes === 0 && (i === null || i.lanes === 0) && (i = t.lastRenderedReducer, i !== null)) try {
        var o = t.lastRenderedState, f = i(o, n);
        if (l.hasEagerState = !0, l.eagerState = f, ht(f, o)) {
          var p = t.interleaved;
          p === null ? (l.next = l, Qi(t)) : (l.next = p.next, p.next = l), t.interleaved = l;
          return;
        }
      } catch {
      } finally {
      }
      n = Eu(e, t, l, r), n !== null && (l = Ke(), xt(n, e, r, l), Yu(n, t, r));
    }
  }
  function Ku(e) {
    var t = e.alternate;
    return e === Ee || t !== null && t === Ee;
  }
  function Gu(e, t) {
    vr = vl = !0;
    var n = e.pending;
    n === null ? t.next = t : (t.next = n.next, n.next = t), e.pending = t;
  }
  function Yu(e, t, n) {
    if ((n & 4194240) !== 0) {
      var r = t.lanes;
      r &= e.pendingLanes, n |= r, t.lanes = n, oi(e, n);
    }
  }
  var xl = { readContext: ut, useCallback: Be, useContext: Be, useEffect: Be, useImperativeHandle: Be, useInsertionEffect: Be, useLayoutEffect: Be, useMemo: Be, useReducer: Be, useRef: Be, useState: Be, useDebugValue: Be, useDeferredValue: Be, useTransition: Be, useMutableSource: Be, useSyncExternalStore: Be, useId: Be, unstable_isNewReconciler: !1 }, Uf = { readContext: ut, useCallback: function(e, t) {
    return Et().memoizedState = [e, t === void 0 ? null : t], e;
  }, useContext: ut, useEffect: Ou, useImperativeHandle: function(e, t, n) {
    return n = n != null ? n.concat([e]) : null, gl(
      4194308,
      4,
      Uu.bind(null, t, e),
      n
    );
  }, useLayoutEffect: function(e, t) {
    return gl(4194308, 4, e, t);
  }, useInsertionEffect: function(e, t) {
    return gl(4, 2, e, t);
  }, useMemo: function(e, t) {
    var n = Et();
    return t = t === void 0 ? null : t, e = e(), n.memoizedState = [e, t], e;
  }, useReducer: function(e, t, n) {
    var r = Et();
    return t = n !== void 0 ? n(t) : t, r.memoizedState = r.baseState = t, e = { pending: null, interleaved: null, lanes: 0, dispatch: null, lastRenderedReducer: e, lastRenderedState: t }, r.queue = e, e = e.dispatch = Af.bind(null, Ee, e), [r.memoizedState, e];
  }, useRef: function(e) {
    var t = Et();
    return e = { current: e }, t.memoizedState = e;
  }, useState: Du, useDebugValue: lo, useDeferredValue: function(e) {
    return Et().memoizedState = e;
  }, useTransition: function() {
    var e = Du(!1), t = e[0];
    return e = Of.bind(null, e[1]), Et().memoizedState = e, [t, e];
  }, useMutableSource: function() {
  }, useSyncExternalStore: function(e, t, n) {
    var r = Ee, l = Et();
    if (ke) {
      if (n === void 0) throw Error(s(407));
      n = n();
    } else {
      if (n = t(), Fe === null) throw Error(s(349));
      (sn & 30) !== 0 || Pu(r, t, n);
    }
    l.memoizedState = n;
    var i = { value: n, getSnapshot: t };
    return l.queue = i, Ou(Mu.bind(
      null,
      r,
      i,
      e
    ), [e]), r.flags |= 2048, xr(9, Ru.bind(null, r, i, n, t), void 0, null), n;
  }, useId: function() {
    var e = Et(), t = Fe.identifierPrefix;
    if (ke) {
      var n = zt, r = jt;
      n = (r & ~(1 << 32 - pt(r) - 1)).toString(32) + n, t = ":" + t + "R" + n, n = gr++, 0 < n && (t += "H" + n.toString(32)), t += ":";
    } else n = Ff++, t = ":" + t + "r" + n.toString(32) + ":";
    return e.memoizedState = t;
  }, unstable_isNewReconciler: !1 }, Hf = {
    readContext: ut,
    useCallback: Bu,
    useContext: ut,
    useEffect: ro,
    useImperativeHandle: Hu,
    useInsertionEffect: Au,
    useLayoutEffect: $u,
    useMemo: Vu,
    useReducer: to,
    useRef: Fu,
    useState: function() {
      return to(yr);
    },
    useDebugValue: lo,
    useDeferredValue: function(e) {
      var t = at();
      return Wu(t, Re.memoizedState, e);
    },
    useTransition: function() {
      var e = to(yr)[0], t = at().memoizedState;
      return [e, t];
    },
    useMutableSource: zu,
    useSyncExternalStore: Tu,
    useId: Qu,
    unstable_isNewReconciler: !1
  }, Bf = { readContext: ut, useCallback: Bu, useContext: ut, useEffect: ro, useImperativeHandle: Hu, useInsertionEffect: Au, useLayoutEffect: $u, useMemo: Vu, useReducer: no, useRef: Fu, useState: function() {
    return no(yr);
  }, useDebugValue: lo, useDeferredValue: function(e) {
    var t = at();
    return Re === null ? t.memoizedState = e : Wu(t, Re.memoizedState, e);
  }, useTransition: function() {
    var e = no(yr)[0], t = at().memoizedState;
    return [e, t];
  }, useMutableSource: zu, useSyncExternalStore: Tu, useId: Qu, unstable_isNewReconciler: !1 };
  function vt(e, t) {
    if (e && e.defaultProps) {
      t = k({}, t), e = e.defaultProps;
      for (var n in e) t[n] === void 0 && (t[n] = e[n]);
      return t;
    }
    return t;
  }
  function io(e, t, n, r) {
    t = e.memoizedState, n = n(r, t), n = n == null ? t : k({}, t, n), e.memoizedState = n, e.lanes === 0 && (e.updateQueue.baseState = n);
  }
  var wl = { isMounted: function(e) {
    return (e = e._reactInternals) ? bt(e) === e : !1;
  }, enqueueSetState: function(e, t, n) {
    e = e._reactInternals;
    var r = Ke(), l = Yt(e), i = Pt(r, l);
    i.payload = t, n != null && (i.callback = n), t = Wt(e, i, l), t !== null && (xt(t, e, l, r), dl(t, e, l));
  }, enqueueReplaceState: function(e, t, n) {
    e = e._reactInternals;
    var r = Ke(), l = Yt(e), i = Pt(r, l);
    i.tag = 1, i.payload = t, n != null && (i.callback = n), t = Wt(e, i, l), t !== null && (xt(t, e, l, r), dl(t, e, l));
  }, enqueueForceUpdate: function(e, t) {
    e = e._reactInternals;
    var n = Ke(), r = Yt(e), l = Pt(n, r);
    l.tag = 2, t != null && (l.callback = t), t = Wt(e, l, r), t !== null && (xt(t, e, r, n), dl(t, e, r));
  } };
  function Xu(e, t, n, r, l, i, o) {
    return e = e.stateNode, typeof e.shouldComponentUpdate == "function" ? e.shouldComponentUpdate(r, i, o) : t.prototype && t.prototype.isPureReactComponent ? !ir(n, r) || !ir(l, i) : !0;
  }
  function Zu(e, t, n) {
    var r = !1, l = Ht, i = t.contextType;
    return typeof i == "object" && i !== null ? i = ut(i) : (l = Ze(t) ? tn : He.current, r = t.contextTypes, i = (r = r != null) ? _n(e, l) : Ht), t = new t(n, i), e.memoizedState = t.state !== null && t.state !== void 0 ? t.state : null, t.updater = wl, e.stateNode = t, t._reactInternals = e, r && (e = e.stateNode, e.__reactInternalMemoizedUnmaskedChildContext = l, e.__reactInternalMemoizedMaskedChildContext = i), t;
  }
  function Ju(e, t, n, r) {
    e = t.state, typeof t.componentWillReceiveProps == "function" && t.componentWillReceiveProps(n, r), typeof t.UNSAFE_componentWillReceiveProps == "function" && t.UNSAFE_componentWillReceiveProps(n, r), t.state !== e && wl.enqueueReplaceState(t, t.state, null);
  }
  function oo(e, t, n, r) {
    var l = e.stateNode;
    l.props = n, l.state = e.memoizedState, l.refs = {}, Ki(e);
    var i = t.contextType;
    typeof i == "object" && i !== null ? l.context = ut(i) : (i = Ze(t) ? tn : He.current, l.context = _n(e, i)), l.state = e.memoizedState, i = t.getDerivedStateFromProps, typeof i == "function" && (io(e, t, i, n), l.state = e.memoizedState), typeof t.getDerivedStateFromProps == "function" || typeof l.getSnapshotBeforeUpdate == "function" || typeof l.UNSAFE_componentWillMount != "function" && typeof l.componentWillMount != "function" || (t = l.state, typeof l.componentWillMount == "function" && l.componentWillMount(), typeof l.UNSAFE_componentWillMount == "function" && l.UNSAFE_componentWillMount(), t !== l.state && wl.enqueueReplaceState(l, l.state, null), pl(e, n, l, r), l.state = e.memoizedState), typeof l.componentDidMount == "function" && (e.flags |= 4194308);
  }
  function In(e, t) {
    try {
      var n = "", r = t;
      do
        n += te(r), r = r.return;
      while (r);
      var l = n;
    } catch (i) {
      l = `
Error generating stack: ` + i.message + `
` + i.stack;
    }
    return { value: e, source: t, stack: l, digest: null };
  }
  function so(e, t, n) {
    return { value: e, source: null, stack: n ?? null, digest: t ?? null };
  }
  function uo(e, t) {
    try {
      console.error(t.value);
    } catch (n) {
      setTimeout(function() {
        throw n;
      });
    }
  }
  var Vf = typeof WeakMap == "function" ? WeakMap : Map;
  function qu(e, t, n) {
    n = Pt(-1, n), n.tag = 3, n.payload = { element: null };
    var r = t.value;
    return n.callback = function() {
      jl || (jl = !0, No = r), uo(e, t);
    }, n;
  }
  function bu(e, t, n) {
    n = Pt(-1, n), n.tag = 3;
    var r = e.type.getDerivedStateFromError;
    if (typeof r == "function") {
      var l = t.value;
      n.payload = function() {
        return r(l);
      }, n.callback = function() {
        uo(e, t);
      };
    }
    var i = e.stateNode;
    return i !== null && typeof i.componentDidCatch == "function" && (n.callback = function() {
      uo(e, t), typeof r != "function" && (Kt === null ? Kt = /* @__PURE__ */ new Set([this]) : Kt.add(this));
      var o = t.stack;
      this.componentDidCatch(t.value, { componentStack: o !== null ? o : "" });
    }), n;
  }
  function ea(e, t, n) {
    var r = e.pingCache;
    if (r === null) {
      r = e.pingCache = new Vf();
      var l = /* @__PURE__ */ new Set();
      r.set(t, l);
    } else l = r.get(t), l === void 0 && (l = /* @__PURE__ */ new Set(), r.set(t, l));
    l.has(n) || (l.add(n), e = rd.bind(null, e, t, n), t.then(e, e));
  }
  function ta(e) {
    do {
      var t;
      if ((t = e.tag === 13) && (t = e.memoizedState, t = t !== null ? t.dehydrated !== null : !0), t) return e;
      e = e.return;
    } while (e !== null);
    return null;
  }
  function na(e, t, n, r, l) {
    return (e.mode & 1) === 0 ? (e === t ? e.flags |= 65536 : (e.flags |= 128, n.flags |= 131072, n.flags &= -52805, n.tag === 1 && (n.alternate === null ? n.tag = 17 : (t = Pt(-1, 1), t.tag = 2, Wt(n, t, 1))), n.lanes |= 1), e) : (e.flags |= 65536, e.lanes = l, e);
  }
  var Wf = me.ReactCurrentOwner, Je = !1;
  function Qe(e, t, n, r) {
    t.child = e === null ? Su(t, null, n, r) : Pn(t, e.child, n, r);
  }
  function ra(e, t, n, r, l) {
    n = n.render;
    var i = t.ref;
    return Mn(t, l), r = bi(e, t, n, r, i, l), n = eo(), e !== null && !Je ? (t.updateQueue = e.updateQueue, t.flags &= -2053, e.lanes &= ~l, Rt(e, t, l)) : (ke && n && Fi(t), t.flags |= 1, Qe(e, t, r, l), t.child);
  }
  function la(e, t, n, r, l) {
    if (e === null) {
      var i = n.type;
      return typeof i == "function" && !Ro(i) && i.defaultProps === void 0 && n.compare === null && n.defaultProps === void 0 ? (t.tag = 15, t.type = i, ia(e, t, i, r, l)) : (e = Ll(n.type, null, r, t, t.mode, l), e.ref = t.ref, e.return = t, t.child = e);
    }
    if (i = e.child, (e.lanes & l) === 0) {
      var o = i.memoizedProps;
      if (n = n.compare, n = n !== null ? n : ir, n(o, r) && e.ref === t.ref) return Rt(e, t, l);
    }
    return t.flags |= 1, e = Zt(i, r), e.ref = t.ref, e.return = t, t.child = e;
  }
  function ia(e, t, n, r, l) {
    if (e !== null) {
      var i = e.memoizedProps;
      if (ir(i, r) && e.ref === t.ref) if (Je = !1, t.pendingProps = r = i, (e.lanes & l) !== 0) (e.flags & 131072) !== 0 && (Je = !0);
      else return t.lanes = e.lanes, Rt(e, t, l);
    }
    return ao(e, t, n, r, l);
  }
  function oa(e, t, n) {
    var r = t.pendingProps, l = r.children, i = e !== null ? e.memoizedState : null;
    if (r.mode === "hidden") if ((t.mode & 1) === 0) t.memoizedState = { baseLanes: 0, cachePool: null, transitions: null }, he(Fn, lt), lt |= n;
    else {
      if ((n & 1073741824) === 0) return e = i !== null ? i.baseLanes | n : n, t.lanes = t.childLanes = 1073741824, t.memoizedState = { baseLanes: e, cachePool: null, transitions: null }, t.updateQueue = null, he(Fn, lt), lt |= e, null;
      t.memoizedState = { baseLanes: 0, cachePool: null, transitions: null }, r = i !== null ? i.baseLanes : n, he(Fn, lt), lt |= r;
    }
    else i !== null ? (r = i.baseLanes | n, t.memoizedState = null) : r = n, he(Fn, lt), lt |= r;
    return Qe(e, t, l, n), t.child;
  }
  function sa(e, t) {
    var n = t.ref;
    (e === null && n !== null || e !== null && e.ref !== n) && (t.flags |= 512, t.flags |= 2097152);
  }
  function ao(e, t, n, r, l) {
    var i = Ze(n) ? tn : He.current;
    return i = _n(t, i), Mn(t, l), n = bi(e, t, n, r, i, l), r = eo(), e !== null && !Je ? (t.updateQueue = e.updateQueue, t.flags &= -2053, e.lanes &= ~l, Rt(e, t, l)) : (ke && r && Fi(t), t.flags |= 1, Qe(e, t, n, l), t.child);
  }
  function ua(e, t, n, r, l) {
    if (Ze(n)) {
      var i = !0;
      ll(t);
    } else i = !1;
    if (Mn(t, l), t.stateNode === null) Sl(e, t), Zu(t, n, r), oo(t, n, r, l), r = !0;
    else if (e === null) {
      var o = t.stateNode, f = t.memoizedProps;
      o.props = f;
      var p = o.context, y = n.contextType;
      typeof y == "object" && y !== null ? y = ut(y) : (y = Ze(n) ? tn : He.current, y = _n(t, y));
      var j = n.getDerivedStateFromProps, T = typeof j == "function" || typeof o.getSnapshotBeforeUpdate == "function";
      T || typeof o.UNSAFE_componentWillReceiveProps != "function" && typeof o.componentWillReceiveProps != "function" || (f !== r || p !== y) && Ju(t, o, r, y), Vt = !1;
      var _ = t.memoizedState;
      o.state = _, pl(t, r, o, l), p = t.memoizedState, f !== r || _ !== p || Xe.current || Vt ? (typeof j == "function" && (io(t, n, j, r), p = t.memoizedState), (f = Vt || Xu(t, n, f, r, _, p, y)) ? (T || typeof o.UNSAFE_componentWillMount != "function" && typeof o.componentWillMount != "function" || (typeof o.componentWillMount == "function" && o.componentWillMount(), typeof o.UNSAFE_componentWillMount == "function" && o.UNSAFE_componentWillMount()), typeof o.componentDidMount == "function" && (t.flags |= 4194308)) : (typeof o.componentDidMount == "function" && (t.flags |= 4194308), t.memoizedProps = r, t.memoizedState = p), o.props = r, o.state = p, o.context = y, r = f) : (typeof o.componentDidMount == "function" && (t.flags |= 4194308), r = !1);
    } else {
      o = t.stateNode, Nu(e, t), f = t.memoizedProps, y = t.type === t.elementType ? f : vt(t.type, f), o.props = y, T = t.pendingProps, _ = o.context, p = n.contextType, typeof p == "object" && p !== null ? p = ut(p) : (p = Ze(n) ? tn : He.current, p = _n(t, p));
      var I = n.getDerivedStateFromProps;
      (j = typeof I == "function" || typeof o.getSnapshotBeforeUpdate == "function") || typeof o.UNSAFE_componentWillReceiveProps != "function" && typeof o.componentWillReceiveProps != "function" || (f !== T || _ !== p) && Ju(t, o, r, p), Vt = !1, _ = t.memoizedState, o.state = _, pl(t, r, o, l);
      var A = t.memoizedState;
      f !== T || _ !== A || Xe.current || Vt ? (typeof I == "function" && (io(t, n, I, r), A = t.memoizedState), (y = Vt || Xu(t, n, y, r, _, A, p) || !1) ? (j || typeof o.UNSAFE_componentWillUpdate != "function" && typeof o.componentWillUpdate != "function" || (typeof o.componentWillUpdate == "function" && o.componentWillUpdate(r, A, p), typeof o.UNSAFE_componentWillUpdate == "function" && o.UNSAFE_componentWillUpdate(r, A, p)), typeof o.componentDidUpdate == "function" && (t.flags |= 4), typeof o.getSnapshotBeforeUpdate == "function" && (t.flags |= 1024)) : (typeof o.componentDidUpdate != "function" || f === e.memoizedProps && _ === e.memoizedState || (t.flags |= 4), typeof o.getSnapshotBeforeUpdate != "function" || f === e.memoizedProps && _ === e.memoizedState || (t.flags |= 1024), t.memoizedProps = r, t.memoizedState = A), o.props = r, o.state = A, o.context = p, r = y) : (typeof o.componentDidUpdate != "function" || f === e.memoizedProps && _ === e.memoizedState || (t.flags |= 4), typeof o.getSnapshotBeforeUpdate != "function" || f === e.memoizedProps && _ === e.memoizedState || (t.flags |= 1024), r = !1);
    }
    return co(e, t, n, r, i, l);
  }
  function co(e, t, n, r, l, i) {
    sa(e, t);
    var o = (t.flags & 128) !== 0;
    if (!r && !o) return l && pu(t, n, !1), Rt(e, t, i);
    r = t.stateNode, Wf.current = t;
    var f = o && typeof n.getDerivedStateFromError != "function" ? null : r.render();
    return t.flags |= 1, e !== null && o ? (t.child = Pn(t, e.child, null, i), t.child = Pn(t, null, f, i)) : Qe(e, t, f, i), t.memoizedState = r.state, l && pu(t, n, !0), t.child;
  }
  function aa(e) {
    var t = e.stateNode;
    t.pendingContext ? fu(e, t.pendingContext, t.pendingContext !== t.context) : t.context && fu(e, t.context, !1), Gi(e, t.containerInfo);
  }
  function ca(e, t, n, r, l) {
    return Tn(), Ui(l), t.flags |= 256, Qe(e, t, n, r), t.child;
  }
  var fo = { dehydrated: null, treeContext: null, retryLane: 0 };
  function po(e) {
    return { baseLanes: e, cachePool: null, transitions: null };
  }
  function fa(e, t, n) {
    var r = t.pendingProps, l = Se.current, i = !1, o = (t.flags & 128) !== 0, f;
    if ((f = o) || (f = e !== null && e.memoizedState === null ? !1 : (l & 2) !== 0), f ? (i = !0, t.flags &= -129) : (e === null || e.memoizedState !== null) && (l |= 1), he(Se, l & 1), e === null)
      return $i(t), e = t.memoizedState, e !== null && (e = e.dehydrated, e !== null) ? ((t.mode & 1) === 0 ? t.lanes = 1 : e.data === "$!" ? t.lanes = 8 : t.lanes = 1073741824, null) : (o = r.children, e = r.fallback, i ? (r = t.mode, i = t.child, o = { mode: "hidden", children: o }, (r & 1) === 0 && i !== null ? (i.childLanes = 0, i.pendingProps = o) : i = Il(o, r, 0, null), e = dn(e, r, n, null), i.return = t, e.return = t, i.sibling = e, t.child = i, t.child.memoizedState = po(n), t.memoizedState = fo, e) : ho(t, o));
    if (l = e.memoizedState, l !== null && (f = l.dehydrated, f !== null)) return Qf(e, t, o, r, f, l, n);
    if (i) {
      i = r.fallback, o = t.mode, l = e.child, f = l.sibling;
      var p = { mode: "hidden", children: r.children };
      return (o & 1) === 0 && t.child !== l ? (r = t.child, r.childLanes = 0, r.pendingProps = p, t.deletions = null) : (r = Zt(l, p), r.subtreeFlags = l.subtreeFlags & 14680064), f !== null ? i = Zt(f, i) : (i = dn(i, o, n, null), i.flags |= 2), i.return = t, r.return = t, r.sibling = i, t.child = r, r = i, i = t.child, o = e.child.memoizedState, o = o === null ? po(n) : { baseLanes: o.baseLanes | n, cachePool: null, transitions: o.transitions }, i.memoizedState = o, i.childLanes = e.childLanes & ~n, t.memoizedState = fo, r;
    }
    return i = e.child, e = i.sibling, r = Zt(i, { mode: "visible", children: r.children }), (t.mode & 1) === 0 && (r.lanes = n), r.return = t, r.sibling = null, e !== null && (n = t.deletions, n === null ? (t.deletions = [e], t.flags |= 16) : n.push(e)), t.child = r, t.memoizedState = null, r;
  }
  function ho(e, t) {
    return t = Il({ mode: "visible", children: t }, e.mode, 0, null), t.return = e, e.child = t;
  }
  function kl(e, t, n, r) {
    return r !== null && Ui(r), Pn(t, e.child, null, n), e = ho(t, t.pendingProps.children), e.flags |= 2, t.memoizedState = null, e;
  }
  function Qf(e, t, n, r, l, i, o) {
    if (n)
      return t.flags & 256 ? (t.flags &= -257, r = so(Error(s(422))), kl(e, t, o, r)) : t.memoizedState !== null ? (t.child = e.child, t.flags |= 128, null) : (i = r.fallback, l = t.mode, r = Il({ mode: "visible", children: r.children }, l, 0, null), i = dn(i, l, o, null), i.flags |= 2, r.return = t, i.return = t, r.sibling = i, t.child = r, (t.mode & 1) !== 0 && Pn(t, e.child, null, o), t.child.memoizedState = po(o), t.memoizedState = fo, i);
    if ((t.mode & 1) === 0) return kl(e, t, o, null);
    if (l.data === "$!") {
      if (r = l.nextSibling && l.nextSibling.dataset, r) var f = r.dgst;
      return r = f, i = Error(s(419)), r = so(i, r, void 0), kl(e, t, o, r);
    }
    if (f = (o & e.childLanes) !== 0, Je || f) {
      if (r = Fe, r !== null) {
        switch (o & -o) {
          case 4:
            l = 2;
            break;
          case 16:
            l = 8;
            break;
          case 64:
          case 128:
          case 256:
          case 512:
          case 1024:
          case 2048:
          case 4096:
          case 8192:
          case 16384:
          case 32768:
          case 65536:
          case 131072:
          case 262144:
          case 524288:
          case 1048576:
          case 2097152:
          case 4194304:
          case 8388608:
          case 16777216:
          case 33554432:
          case 67108864:
            l = 32;
            break;
          case 536870912:
            l = 268435456;
            break;
          default:
            l = 0;
        }
        l = (l & (r.suspendedLanes | o)) !== 0 ? 0 : l, l !== 0 && l !== i.retryLane && (i.retryLane = l, Tt(e, l), xt(r, e, l, -1));
      }
      return Po(), r = so(Error(s(421))), kl(e, t, o, r);
    }
    return l.data === "$?" ? (t.flags |= 128, t.child = e.child, t = ld.bind(null, e), l._reactRetry = t, null) : (e = i.treeContext, rt = $t(l.nextSibling), nt = t, ke = !0, mt = null, e !== null && (ot[st++] = jt, ot[st++] = zt, ot[st++] = nn, jt = e.id, zt = e.overflow, nn = t), t = ho(t, r.children), t.flags |= 4096, t);
  }
  function da(e, t, n) {
    e.lanes |= t;
    var r = e.alternate;
    r !== null && (r.lanes |= t), Wi(e.return, t, n);
  }
  function mo(e, t, n, r, l) {
    var i = e.memoizedState;
    i === null ? e.memoizedState = { isBackwards: t, rendering: null, renderingStartTime: 0, last: r, tail: n, tailMode: l } : (i.isBackwards = t, i.rendering = null, i.renderingStartTime = 0, i.last = r, i.tail = n, i.tailMode = l);
  }
  function pa(e, t, n) {
    var r = t.pendingProps, l = r.revealOrder, i = r.tail;
    if (Qe(e, t, r.children, n), r = Se.current, (r & 2) !== 0) r = r & 1 | 2, t.flags |= 128;
    else {
      if (e !== null && (e.flags & 128) !== 0) e: for (e = t.child; e !== null; ) {
        if (e.tag === 13) e.memoizedState !== null && da(e, n, t);
        else if (e.tag === 19) da(e, n, t);
        else if (e.child !== null) {
          e.child.return = e, e = e.child;
          continue;
        }
        if (e === t) break e;
        for (; e.sibling === null; ) {
          if (e.return === null || e.return === t) break e;
          e = e.return;
        }
        e.sibling.return = e.return, e = e.sibling;
      }
      r &= 1;
    }
    if (he(Se, r), (t.mode & 1) === 0) t.memoizedState = null;
    else switch (l) {
      case "forwards":
        for (n = t.child, l = null; n !== null; ) e = n.alternate, e !== null && hl(e) === null && (l = n), n = n.sibling;
        n = l, n === null ? (l = t.child, t.child = null) : (l = n.sibling, n.sibling = null), mo(t, !1, l, n, i);
        break;
      case "backwards":
        for (n = null, l = t.child, t.child = null; l !== null; ) {
          if (e = l.alternate, e !== null && hl(e) === null) {
            t.child = l;
            break;
          }
          e = l.sibling, l.sibling = n, n = l, l = e;
        }
        mo(t, !0, n, null, i);
        break;
      case "together":
        mo(t, !1, null, null, void 0);
        break;
      default:
        t.memoizedState = null;
    }
    return t.child;
  }
  function Sl(e, t) {
    (t.mode & 1) === 0 && e !== null && (e.alternate = null, t.alternate = null, t.flags |= 2);
  }
  function Rt(e, t, n) {
    if (e !== null && (t.dependencies = e.dependencies), un |= t.lanes, (n & t.childLanes) === 0) return null;
    if (e !== null && t.child !== e.child) throw Error(s(153));
    if (t.child !== null) {
      for (e = t.child, n = Zt(e, e.pendingProps), t.child = n, n.return = t; e.sibling !== null; ) e = e.sibling, n = n.sibling = Zt(e, e.pendingProps), n.return = t;
      n.sibling = null;
    }
    return t.child;
  }
  function Kf(e, t, n) {
    switch (t.tag) {
      case 3:
        aa(t), Tn();
        break;
      case 5:
        ju(t);
        break;
      case 1:
        Ze(t.type) && ll(t);
        break;
      case 4:
        Gi(t, t.stateNode.containerInfo);
        break;
      case 10:
        var r = t.type._context, l = t.memoizedProps.value;
        he(cl, r._currentValue), r._currentValue = l;
        break;
      case 13:
        if (r = t.memoizedState, r !== null)
          return r.dehydrated !== null ? (he(Se, Se.current & 1), t.flags |= 128, null) : (n & t.child.childLanes) !== 0 ? fa(e, t, n) : (he(Se, Se.current & 1), e = Rt(e, t, n), e !== null ? e.sibling : null);
        he(Se, Se.current & 1);
        break;
      case 19:
        if (r = (n & t.childLanes) !== 0, (e.flags & 128) !== 0) {
          if (r) return pa(e, t, n);
          t.flags |= 128;
        }
        if (l = t.memoizedState, l !== null && (l.rendering = null, l.tail = null, l.lastEffect = null), he(Se, Se.current), r) break;
        return null;
      case 22:
      case 23:
        return t.lanes = 0, oa(e, t, n);
    }
    return Rt(e, t, n);
  }
  var ha, vo, ma, va;
  ha = function(e, t) {
    for (var n = t.child; n !== null; ) {
      if (n.tag === 5 || n.tag === 6) e.appendChild(n.stateNode);
      else if (n.tag !== 4 && n.child !== null) {
        n.child.return = n, n = n.child;
        continue;
      }
      if (n === t) break;
      for (; n.sibling === null; ) {
        if (n.return === null || n.return === t) return;
        n = n.return;
      }
      n.sibling.return = n.return, n = n.sibling;
    }
  }, vo = function() {
  }, ma = function(e, t, n, r) {
    var l = e.memoizedProps;
    if (l !== r) {
      e = t.stateNode, on(St.current);
      var i = null;
      switch (n) {
        case "input":
          l = Wl(e, l), r = Wl(e, r), i = [];
          break;
        case "select":
          l = k({}, l, { value: void 0 }), r = k({}, r, { value: void 0 }), i = [];
          break;
        case "textarea":
          l = Gl(e, l), r = Gl(e, r), i = [];
          break;
        default:
          typeof l.onClick != "function" && typeof r.onClick == "function" && (e.onclick = tl);
      }
      Xl(n, r);
      var o;
      n = null;
      for (y in l) if (!r.hasOwnProperty(y) && l.hasOwnProperty(y) && l[y] != null) if (y === "style") {
        var f = l[y];
        for (o in f) f.hasOwnProperty(o) && (n || (n = {}), n[o] = "");
      } else y !== "dangerouslySetInnerHTML" && y !== "children" && y !== "suppressContentEditableWarning" && y !== "suppressHydrationWarning" && y !== "autoFocus" && (N.hasOwnProperty(y) ? i || (i = []) : (i = i || []).push(y, null));
      for (y in r) {
        var p = r[y];
        if (f = l != null ? l[y] : void 0, r.hasOwnProperty(y) && p !== f && (p != null || f != null)) if (y === "style") if (f) {
          for (o in f) !f.hasOwnProperty(o) || p && p.hasOwnProperty(o) || (n || (n = {}), n[o] = "");
          for (o in p) p.hasOwnProperty(o) && f[o] !== p[o] && (n || (n = {}), n[o] = p[o]);
        } else n || (i || (i = []), i.push(
          y,
          n
        )), n = p;
        else y === "dangerouslySetInnerHTML" ? (p = p ? p.__html : void 0, f = f ? f.__html : void 0, p != null && f !== p && (i = i || []).push(y, p)) : y === "children" ? typeof p != "string" && typeof p != "number" || (i = i || []).push(y, "" + p) : y !== "suppressContentEditableWarning" && y !== "suppressHydrationWarning" && (N.hasOwnProperty(y) ? (p != null && y === "onScroll" && ve("scroll", e), i || f === p || (i = [])) : (i = i || []).push(y, p));
      }
      n && (i = i || []).push("style", n);
      var y = i;
      (t.updateQueue = y) && (t.flags |= 4);
    }
  }, va = function(e, t, n, r) {
    n !== r && (t.flags |= 4);
  };
  function wr(e, t) {
    if (!ke) switch (e.tailMode) {
      case "hidden":
        t = e.tail;
        for (var n = null; t !== null; ) t.alternate !== null && (n = t), t = t.sibling;
        n === null ? e.tail = null : n.sibling = null;
        break;
      case "collapsed":
        n = e.tail;
        for (var r = null; n !== null; ) n.alternate !== null && (r = n), n = n.sibling;
        r === null ? t || e.tail === null ? e.tail = null : e.tail.sibling = null : r.sibling = null;
    }
  }
  function Ve(e) {
    var t = e.alternate !== null && e.alternate.child === e.child, n = 0, r = 0;
    if (t) for (var l = e.child; l !== null; ) n |= l.lanes | l.childLanes, r |= l.subtreeFlags & 14680064, r |= l.flags & 14680064, l.return = e, l = l.sibling;
    else for (l = e.child; l !== null; ) n |= l.lanes | l.childLanes, r |= l.subtreeFlags, r |= l.flags, l.return = e, l = l.sibling;
    return e.subtreeFlags |= r, e.childLanes = n, t;
  }
  function Gf(e, t, n) {
    var r = t.pendingProps;
    switch (Oi(t), t.tag) {
      case 2:
      case 16:
      case 15:
      case 0:
      case 11:
      case 7:
      case 8:
      case 12:
      case 9:
      case 14:
        return Ve(t), null;
      case 1:
        return Ze(t.type) && rl(), Ve(t), null;
      case 3:
        return r = t.stateNode, Ln(), ge(Xe), ge(He), Zi(), r.pendingContext && (r.context = r.pendingContext, r.pendingContext = null), (e === null || e.child === null) && (ul(t) ? t.flags |= 4 : e === null || e.memoizedState.isDehydrated && (t.flags & 256) === 0 || (t.flags |= 1024, mt !== null && (jo(mt), mt = null))), vo(e, t), Ve(t), null;
      case 5:
        Yi(t);
        var l = on(mr.current);
        if (n = t.type, e !== null && t.stateNode != null) ma(e, t, n, r, l), e.ref !== t.ref && (t.flags |= 512, t.flags |= 2097152);
        else {
          if (!r) {
            if (t.stateNode === null) throw Error(s(166));
            return Ve(t), null;
          }
          if (e = on(St.current), ul(t)) {
            r = t.stateNode, n = t.type;
            var i = t.memoizedProps;
            switch (r[kt] = t, r[cr] = i, e = (t.mode & 1) !== 0, n) {
              case "dialog":
                ve("cancel", r), ve("close", r);
                break;
              case "iframe":
              case "object":
              case "embed":
                ve("load", r);
                break;
              case "video":
              case "audio":
                for (l = 0; l < sr.length; l++) ve(sr[l], r);
                break;
              case "source":
                ve("error", r);
                break;
              case "img":
              case "image":
              case "link":
                ve(
                  "error",
                  r
                ), ve("load", r);
                break;
              case "details":
                ve("toggle", r);
                break;
              case "input":
                Zo(r, i), ve("invalid", r);
                break;
              case "select":
                r._wrapperState = { wasMultiple: !!i.multiple }, ve("invalid", r);
                break;
              case "textarea":
                bo(r, i), ve("invalid", r);
            }
            Xl(n, i), l = null;
            for (var o in i) if (i.hasOwnProperty(o)) {
              var f = i[o];
              o === "children" ? typeof f == "string" ? r.textContent !== f && (i.suppressHydrationWarning !== !0 && el(r.textContent, f, e), l = ["children", f]) : typeof f == "number" && r.textContent !== "" + f && (i.suppressHydrationWarning !== !0 && el(
                r.textContent,
                f,
                e
              ), l = ["children", "" + f]) : N.hasOwnProperty(o) && f != null && o === "onScroll" && ve("scroll", r);
            }
            switch (n) {
              case "input":
                dt(r), qo(r, i, !0);
                break;
              case "textarea":
                dt(r), ts(r);
                break;
              case "select":
              case "option":
                break;
              default:
                typeof i.onClick == "function" && (r.onclick = tl);
            }
            r = l, t.updateQueue = r, r !== null && (t.flags |= 4);
          } else {
            o = l.nodeType === 9 ? l : l.ownerDocument, e === "http://www.w3.org/1999/xhtml" && (e = ns(n)), e === "http://www.w3.org/1999/xhtml" ? n === "script" ? (e = o.createElement("div"), e.innerHTML = "<script><\/script>", e = e.removeChild(e.firstChild)) : typeof r.is == "string" ? e = o.createElement(n, { is: r.is }) : (e = o.createElement(n), n === "select" && (o = e, r.multiple ? o.multiple = !0 : r.size && (o.size = r.size))) : e = o.createElementNS(e, n), e[kt] = t, e[cr] = r, ha(e, t, !1, !1), t.stateNode = e;
            e: {
              switch (o = Zl(n, r), n) {
                case "dialog":
                  ve("cancel", e), ve("close", e), l = r;
                  break;
                case "iframe":
                case "object":
                case "embed":
                  ve("load", e), l = r;
                  break;
                case "video":
                case "audio":
                  for (l = 0; l < sr.length; l++) ve(sr[l], e);
                  l = r;
                  break;
                case "source":
                  ve("error", e), l = r;
                  break;
                case "img":
                case "image":
                case "link":
                  ve(
                    "error",
                    e
                  ), ve("load", e), l = r;
                  break;
                case "details":
                  ve("toggle", e), l = r;
                  break;
                case "input":
                  Zo(e, r), l = Wl(e, r), ve("invalid", e);
                  break;
                case "option":
                  l = r;
                  break;
                case "select":
                  e._wrapperState = { wasMultiple: !!r.multiple }, l = k({}, r, { value: void 0 }), ve("invalid", e);
                  break;
                case "textarea":
                  bo(e, r), l = Gl(e, r), ve("invalid", e);
                  break;
                default:
                  l = r;
              }
              Xl(n, l), f = l;
              for (i in f) if (f.hasOwnProperty(i)) {
                var p = f[i];
                i === "style" ? is(e, p) : i === "dangerouslySetInnerHTML" ? (p = p ? p.__html : void 0, p != null && rs(e, p)) : i === "children" ? typeof p == "string" ? (n !== "textarea" || p !== "") && Bn(e, p) : typeof p == "number" && Bn(e, "" + p) : i !== "suppressContentEditableWarning" && i !== "suppressHydrationWarning" && i !== "autoFocus" && (N.hasOwnProperty(i) ? p != null && i === "onScroll" && ve("scroll", e) : p != null && Te(e, i, p, o));
              }
              switch (n) {
                case "input":
                  dt(e), qo(e, r, !1);
                  break;
                case "textarea":
                  dt(e), ts(e);
                  break;
                case "option":
                  r.value != null && e.setAttribute("value", "" + Z(r.value));
                  break;
                case "select":
                  e.multiple = !!r.multiple, i = r.value, i != null ? hn(e, !!r.multiple, i, !1) : r.defaultValue != null && hn(
                    e,
                    !!r.multiple,
                    r.defaultValue,
                    !0
                  );
                  break;
                default:
                  typeof l.onClick == "function" && (e.onclick = tl);
              }
              switch (n) {
                case "button":
                case "input":
                case "select":
                case "textarea":
                  r = !!r.autoFocus;
                  break e;
                case "img":
                  r = !0;
                  break e;
                default:
                  r = !1;
              }
            }
            r && (t.flags |= 4);
          }
          t.ref !== null && (t.flags |= 512, t.flags |= 2097152);
        }
        return Ve(t), null;
      case 6:
        if (e && t.stateNode != null) va(e, t, e.memoizedProps, r);
        else {
          if (typeof r != "string" && t.stateNode === null) throw Error(s(166));
          if (n = on(mr.current), on(St.current), ul(t)) {
            if (r = t.stateNode, n = t.memoizedProps, r[kt] = t, (i = r.nodeValue !== n) && (e = nt, e !== null)) switch (e.tag) {
              case 3:
                el(r.nodeValue, n, (e.mode & 1) !== 0);
                break;
              case 5:
                e.memoizedProps.suppressHydrationWarning !== !0 && el(r.nodeValue, n, (e.mode & 1) !== 0);
            }
            i && (t.flags |= 4);
          } else r = (n.nodeType === 9 ? n : n.ownerDocument).createTextNode(r), r[kt] = t, t.stateNode = r;
        }
        return Ve(t), null;
      case 13:
        if (ge(Se), r = t.memoizedState, e === null || e.memoizedState !== null && e.memoizedState.dehydrated !== null) {
          if (ke && rt !== null && (t.mode & 1) !== 0 && (t.flags & 128) === 0) xu(), Tn(), t.flags |= 98560, i = !1;
          else if (i = ul(t), r !== null && r.dehydrated !== null) {
            if (e === null) {
              if (!i) throw Error(s(318));
              if (i = t.memoizedState, i = i !== null ? i.dehydrated : null, !i) throw Error(s(317));
              i[kt] = t;
            } else Tn(), (t.flags & 128) === 0 && (t.memoizedState = null), t.flags |= 4;
            Ve(t), i = !1;
          } else mt !== null && (jo(mt), mt = null), i = !0;
          if (!i) return t.flags & 65536 ? t : null;
        }
        return (t.flags & 128) !== 0 ? (t.lanes = n, t) : (r = r !== null, r !== (e !== null && e.memoizedState !== null) && r && (t.child.flags |= 8192, (t.mode & 1) !== 0 && (e === null || (Se.current & 1) !== 0 ? Me === 0 && (Me = 3) : Po())), t.updateQueue !== null && (t.flags |= 4), Ve(t), null);
      case 4:
        return Ln(), vo(e, t), e === null && ur(t.stateNode.containerInfo), Ve(t), null;
      case 10:
        return Vi(t.type._context), Ve(t), null;
      case 17:
        return Ze(t.type) && rl(), Ve(t), null;
      case 19:
        if (ge(Se), i = t.memoizedState, i === null) return Ve(t), null;
        if (r = (t.flags & 128) !== 0, o = i.rendering, o === null) if (r) wr(i, !1);
        else {
          if (Me !== 0 || e !== null && (e.flags & 128) !== 0) for (e = t.child; e !== null; ) {
            if (o = hl(e), o !== null) {
              for (t.flags |= 128, wr(i, !1), r = o.updateQueue, r !== null && (t.updateQueue = r, t.flags |= 4), t.subtreeFlags = 0, r = n, n = t.child; n !== null; ) i = n, e = r, i.flags &= 14680066, o = i.alternate, o === null ? (i.childLanes = 0, i.lanes = e, i.child = null, i.subtreeFlags = 0, i.memoizedProps = null, i.memoizedState = null, i.updateQueue = null, i.dependencies = null, i.stateNode = null) : (i.childLanes = o.childLanes, i.lanes = o.lanes, i.child = o.child, i.subtreeFlags = 0, i.deletions = null, i.memoizedProps = o.memoizedProps, i.memoizedState = o.memoizedState, i.updateQueue = o.updateQueue, i.type = o.type, e = o.dependencies, i.dependencies = e === null ? null : { lanes: e.lanes, firstContext: e.firstContext }), n = n.sibling;
              return he(Se, Se.current & 1 | 2), t.child;
            }
            e = e.sibling;
          }
          i.tail !== null && _e() > On && (t.flags |= 128, r = !0, wr(i, !1), t.lanes = 4194304);
        }
        else {
          if (!r) if (e = hl(o), e !== null) {
            if (t.flags |= 128, r = !0, n = e.updateQueue, n !== null && (t.updateQueue = n, t.flags |= 4), wr(i, !0), i.tail === null && i.tailMode === "hidden" && !o.alternate && !ke) return Ve(t), null;
          } else 2 * _e() - i.renderingStartTime > On && n !== 1073741824 && (t.flags |= 128, r = !0, wr(i, !1), t.lanes = 4194304);
          i.isBackwards ? (o.sibling = t.child, t.child = o) : (n = i.last, n !== null ? n.sibling = o : t.child = o, i.last = o);
        }
        return i.tail !== null ? (t = i.tail, i.rendering = t, i.tail = t.sibling, i.renderingStartTime = _e(), t.sibling = null, n = Se.current, he(Se, r ? n & 1 | 2 : n & 1), t) : (Ve(t), null);
      case 22:
      case 23:
        return To(), r = t.memoizedState !== null, e !== null && e.memoizedState !== null !== r && (t.flags |= 8192), r && (t.mode & 1) !== 0 ? (lt & 1073741824) !== 0 && (Ve(t), t.subtreeFlags & 6 && (t.flags |= 8192)) : Ve(t), null;
      case 24:
        return null;
      case 25:
        return null;
    }
    throw Error(s(156, t.tag));
  }
  function Yf(e, t) {
    switch (Oi(t), t.tag) {
      case 1:
        return Ze(t.type) && rl(), e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
      case 3:
        return Ln(), ge(Xe), ge(He), Zi(), e = t.flags, (e & 65536) !== 0 && (e & 128) === 0 ? (t.flags = e & -65537 | 128, t) : null;
      case 5:
        return Yi(t), null;
      case 13:
        if (ge(Se), e = t.memoizedState, e !== null && e.dehydrated !== null) {
          if (t.alternate === null) throw Error(s(340));
          Tn();
        }
        return e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
      case 19:
        return ge(Se), null;
      case 4:
        return Ln(), null;
      case 10:
        return Vi(t.type._context), null;
      case 22:
      case 23:
        return To(), null;
      case 24:
        return null;
      default:
        return null;
    }
  }
  var El = !1, We = !1, Xf = typeof WeakSet == "function" ? WeakSet : Set, F = null;
  function Dn(e, t) {
    var n = e.ref;
    if (n !== null) if (typeof n == "function") try {
      n(null);
    } catch (r) {
      Ce(e, t, r);
    }
    else n.current = null;
  }
  function go(e, t, n) {
    try {
      n();
    } catch (r) {
      Ce(e, t, r);
    }
  }
  var ga = !1;
  function Zf(e, t) {
    if (zi = Vr, e = Xs(), wi(e)) {
      if ("selectionStart" in e) var n = { start: e.selectionStart, end: e.selectionEnd };
      else e: {
        n = (n = e.ownerDocument) && n.defaultView || window;
        var r = n.getSelection && n.getSelection();
        if (r && r.rangeCount !== 0) {
          n = r.anchorNode;
          var l = r.anchorOffset, i = r.focusNode;
          r = r.focusOffset;
          try {
            n.nodeType, i.nodeType;
          } catch {
            n = null;
            break e;
          }
          var o = 0, f = -1, p = -1, y = 0, j = 0, T = e, _ = null;
          t: for (; ; ) {
            for (var I; T !== n || l !== 0 && T.nodeType !== 3 || (f = o + l), T !== i || r !== 0 && T.nodeType !== 3 || (p = o + r), T.nodeType === 3 && (o += T.nodeValue.length), (I = T.firstChild) !== null; )
              _ = T, T = I;
            for (; ; ) {
              if (T === e) break t;
              if (_ === n && ++y === l && (f = o), _ === i && ++j === r && (p = o), (I = T.nextSibling) !== null) break;
              T = _, _ = T.parentNode;
            }
            T = I;
          }
          n = f === -1 || p === -1 ? null : { start: f, end: p };
        } else n = null;
      }
      n = n || { start: 0, end: 0 };
    } else n = null;
    for (Ti = { focusedElem: e, selectionRange: n }, Vr = !1, F = t; F !== null; ) if (t = F, e = t.child, (t.subtreeFlags & 1028) !== 0 && e !== null) e.return = t, F = e;
    else for (; F !== null; ) {
      t = F;
      try {
        var A = t.alternate;
        if ((t.flags & 1024) !== 0) switch (t.tag) {
          case 0:
          case 11:
          case 15:
            break;
          case 1:
            if (A !== null) {
              var U = A.memoizedProps, je = A.memoizedState, m = t.stateNode, h = m.getSnapshotBeforeUpdate(t.elementType === t.type ? U : vt(t.type, U), je);
              m.__reactInternalSnapshotBeforeUpdate = h;
            }
            break;
          case 3:
            var g = t.stateNode.containerInfo;
            g.nodeType === 1 ? g.textContent = "" : g.nodeType === 9 && g.documentElement && g.removeChild(g.documentElement);
            break;
          case 5:
          case 6:
          case 4:
          case 17:
            break;
          default:
            throw Error(s(163));
        }
      } catch (R) {
        Ce(t, t.return, R);
      }
      if (e = t.sibling, e !== null) {
        e.return = t.return, F = e;
        break;
      }
      F = t.return;
    }
    return A = ga, ga = !1, A;
  }
  function kr(e, t, n) {
    var r = t.updateQueue;
    if (r = r !== null ? r.lastEffect : null, r !== null) {
      var l = r = r.next;
      do {
        if ((l.tag & e) === e) {
          var i = l.destroy;
          l.destroy = void 0, i !== void 0 && go(t, n, i);
        }
        l = l.next;
      } while (l !== r);
    }
  }
  function Nl(e, t) {
    if (t = t.updateQueue, t = t !== null ? t.lastEffect : null, t !== null) {
      var n = t = t.next;
      do {
        if ((n.tag & e) === e) {
          var r = n.create;
          n.destroy = r();
        }
        n = n.next;
      } while (n !== t);
    }
  }
  function yo(e) {
    var t = e.ref;
    if (t !== null) {
      var n = e.stateNode;
      switch (e.tag) {
        case 5:
          e = n;
          break;
        default:
          e = n;
      }
      typeof t == "function" ? t(e) : t.current = e;
    }
  }
  function ya(e) {
    var t = e.alternate;
    t !== null && (e.alternate = null, ya(t)), e.child = null, e.deletions = null, e.sibling = null, e.tag === 5 && (t = e.stateNode, t !== null && (delete t[kt], delete t[cr], delete t[Li], delete t[Mf], delete t[Lf])), e.stateNode = null, e.return = null, e.dependencies = null, e.memoizedProps = null, e.memoizedState = null, e.pendingProps = null, e.stateNode = null, e.updateQueue = null;
  }
  function xa(e) {
    return e.tag === 5 || e.tag === 3 || e.tag === 4;
  }
  function wa(e) {
    e: for (; ; ) {
      for (; e.sibling === null; ) {
        if (e.return === null || xa(e.return)) return null;
        e = e.return;
      }
      for (e.sibling.return = e.return, e = e.sibling; e.tag !== 5 && e.tag !== 6 && e.tag !== 18; ) {
        if (e.flags & 2 || e.child === null || e.tag === 4) continue e;
        e.child.return = e, e = e.child;
      }
      if (!(e.flags & 2)) return e.stateNode;
    }
  }
  function xo(e, t, n) {
    var r = e.tag;
    if (r === 5 || r === 6) e = e.stateNode, t ? n.nodeType === 8 ? n.parentNode.insertBefore(e, t) : n.insertBefore(e, t) : (n.nodeType === 8 ? (t = n.parentNode, t.insertBefore(e, n)) : (t = n, t.appendChild(e)), n = n._reactRootContainer, n != null || t.onclick !== null || (t.onclick = tl));
    else if (r !== 4 && (e = e.child, e !== null)) for (xo(e, t, n), e = e.sibling; e !== null; ) xo(e, t, n), e = e.sibling;
  }
  function wo(e, t, n) {
    var r = e.tag;
    if (r === 5 || r === 6) e = e.stateNode, t ? n.insertBefore(e, t) : n.appendChild(e);
    else if (r !== 4 && (e = e.child, e !== null)) for (wo(e, t, n), e = e.sibling; e !== null; ) wo(e, t, n), e = e.sibling;
  }
  var Ae = null, gt = !1;
  function Qt(e, t, n) {
    for (n = n.child; n !== null; ) ka(e, t, n), n = n.sibling;
  }
  function ka(e, t, n) {
    if (wt && typeof wt.onCommitFiberUnmount == "function") try {
      wt.onCommitFiberUnmount(Or, n);
    } catch {
    }
    switch (n.tag) {
      case 5:
        We || Dn(n, t);
      case 6:
        var r = Ae, l = gt;
        Ae = null, Qt(e, t, n), Ae = r, gt = l, Ae !== null && (gt ? (e = Ae, n = n.stateNode, e.nodeType === 8 ? e.parentNode.removeChild(n) : e.removeChild(n)) : Ae.removeChild(n.stateNode));
        break;
      case 18:
        Ae !== null && (gt ? (e = Ae, n = n.stateNode, e.nodeType === 8 ? Mi(e.parentNode, n) : e.nodeType === 1 && Mi(e, n), bn(e)) : Mi(Ae, n.stateNode));
        break;
      case 4:
        r = Ae, l = gt, Ae = n.stateNode.containerInfo, gt = !0, Qt(e, t, n), Ae = r, gt = l;
        break;
      case 0:
      case 11:
      case 14:
      case 15:
        if (!We && (r = n.updateQueue, r !== null && (r = r.lastEffect, r !== null))) {
          l = r = r.next;
          do {
            var i = l, o = i.destroy;
            i = i.tag, o !== void 0 && ((i & 2) !== 0 || (i & 4) !== 0) && go(n, t, o), l = l.next;
          } while (l !== r);
        }
        Qt(e, t, n);
        break;
      case 1:
        if (!We && (Dn(n, t), r = n.stateNode, typeof r.componentWillUnmount == "function")) try {
          r.props = n.memoizedProps, r.state = n.memoizedState, r.componentWillUnmount();
        } catch (f) {
          Ce(n, t, f);
        }
        Qt(e, t, n);
        break;
      case 21:
        Qt(e, t, n);
        break;
      case 22:
        n.mode & 1 ? (We = (r = We) || n.memoizedState !== null, Qt(e, t, n), We = r) : Qt(e, t, n);
        break;
      default:
        Qt(e, t, n);
    }
  }
  function Sa(e) {
    var t = e.updateQueue;
    if (t !== null) {
      e.updateQueue = null;
      var n = e.stateNode;
      n === null && (n = e.stateNode = new Xf()), t.forEach(function(r) {
        var l = id.bind(null, e, r);
        n.has(r) || (n.add(r), r.then(l, l));
      });
    }
  }
  function yt(e, t) {
    var n = t.deletions;
    if (n !== null) for (var r = 0; r < n.length; r++) {
      var l = n[r];
      try {
        var i = e, o = t, f = o;
        e: for (; f !== null; ) {
          switch (f.tag) {
            case 5:
              Ae = f.stateNode, gt = !1;
              break e;
            case 3:
              Ae = f.stateNode.containerInfo, gt = !0;
              break e;
            case 4:
              Ae = f.stateNode.containerInfo, gt = !0;
              break e;
          }
          f = f.return;
        }
        if (Ae === null) throw Error(s(160));
        ka(i, o, l), Ae = null, gt = !1;
        var p = l.alternate;
        p !== null && (p.return = null), l.return = null;
      } catch (y) {
        Ce(l, t, y);
      }
    }
    if (t.subtreeFlags & 12854) for (t = t.child; t !== null; ) Ea(t, e), t = t.sibling;
  }
  function Ea(e, t) {
    var n = e.alternate, r = e.flags;
    switch (e.tag) {
      case 0:
      case 11:
      case 14:
      case 15:
        if (yt(t, e), Nt(e), r & 4) {
          try {
            kr(3, e, e.return), Nl(3, e);
          } catch (U) {
            Ce(e, e.return, U);
          }
          try {
            kr(5, e, e.return);
          } catch (U) {
            Ce(e, e.return, U);
          }
        }
        break;
      case 1:
        yt(t, e), Nt(e), r & 512 && n !== null && Dn(n, n.return);
        break;
      case 5:
        if (yt(t, e), Nt(e), r & 512 && n !== null && Dn(n, n.return), e.flags & 32) {
          var l = e.stateNode;
          try {
            Bn(l, "");
          } catch (U) {
            Ce(e, e.return, U);
          }
        }
        if (r & 4 && (l = e.stateNode, l != null)) {
          var i = e.memoizedProps, o = n !== null ? n.memoizedProps : i, f = e.type, p = e.updateQueue;
          if (e.updateQueue = null, p !== null) try {
            f === "input" && i.type === "radio" && i.name != null && Jo(l, i), Zl(f, o);
            var y = Zl(f, i);
            for (o = 0; o < p.length; o += 2) {
              var j = p[o], T = p[o + 1];
              j === "style" ? is(l, T) : j === "dangerouslySetInnerHTML" ? rs(l, T) : j === "children" ? Bn(l, T) : Te(l, j, T, y);
            }
            switch (f) {
              case "input":
                Ql(l, i);
                break;
              case "textarea":
                es(l, i);
                break;
              case "select":
                var _ = l._wrapperState.wasMultiple;
                l._wrapperState.wasMultiple = !!i.multiple;
                var I = i.value;
                I != null ? hn(l, !!i.multiple, I, !1) : _ !== !!i.multiple && (i.defaultValue != null ? hn(
                  l,
                  !!i.multiple,
                  i.defaultValue,
                  !0
                ) : hn(l, !!i.multiple, i.multiple ? [] : "", !1));
            }
            l[cr] = i;
          } catch (U) {
            Ce(e, e.return, U);
          }
        }
        break;
      case 6:
        if (yt(t, e), Nt(e), r & 4) {
          if (e.stateNode === null) throw Error(s(162));
          l = e.stateNode, i = e.memoizedProps;
          try {
            l.nodeValue = i;
          } catch (U) {
            Ce(e, e.return, U);
          }
        }
        break;
      case 3:
        if (yt(t, e), Nt(e), r & 4 && n !== null && n.memoizedState.isDehydrated) try {
          bn(t.containerInfo);
        } catch (U) {
          Ce(e, e.return, U);
        }
        break;
      case 4:
        yt(t, e), Nt(e);
        break;
      case 13:
        yt(t, e), Nt(e), l = e.child, l.flags & 8192 && (i = l.memoizedState !== null, l.stateNode.isHidden = i, !i || l.alternate !== null && l.alternate.memoizedState !== null || (Eo = _e())), r & 4 && Sa(e);
        break;
      case 22:
        if (j = n !== null && n.memoizedState !== null, e.mode & 1 ? (We = (y = We) || j, yt(t, e), We = y) : yt(t, e), Nt(e), r & 8192) {
          if (y = e.memoizedState !== null, (e.stateNode.isHidden = y) && !j && (e.mode & 1) !== 0) for (F = e, j = e.child; j !== null; ) {
            for (T = F = j; F !== null; ) {
              switch (_ = F, I = _.child, _.tag) {
                case 0:
                case 11:
                case 14:
                case 15:
                  kr(4, _, _.return);
                  break;
                case 1:
                  Dn(_, _.return);
                  var A = _.stateNode;
                  if (typeof A.componentWillUnmount == "function") {
                    r = _, n = _.return;
                    try {
                      t = r, A.props = t.memoizedProps, A.state = t.memoizedState, A.componentWillUnmount();
                    } catch (U) {
                      Ce(r, n, U);
                    }
                  }
                  break;
                case 5:
                  Dn(_, _.return);
                  break;
                case 22:
                  if (_.memoizedState !== null) {
                    _a(T);
                    continue;
                  }
              }
              I !== null ? (I.return = _, F = I) : _a(T);
            }
            j = j.sibling;
          }
          e: for (j = null, T = e; ; ) {
            if (T.tag === 5) {
              if (j === null) {
                j = T;
                try {
                  l = T.stateNode, y ? (i = l.style, typeof i.setProperty == "function" ? i.setProperty("display", "none", "important") : i.display = "none") : (f = T.stateNode, p = T.memoizedProps.style, o = p != null && p.hasOwnProperty("display") ? p.display : null, f.style.display = ls("display", o));
                } catch (U) {
                  Ce(e, e.return, U);
                }
              }
            } else if (T.tag === 6) {
              if (j === null) try {
                T.stateNode.nodeValue = y ? "" : T.memoizedProps;
              } catch (U) {
                Ce(e, e.return, U);
              }
            } else if ((T.tag !== 22 && T.tag !== 23 || T.memoizedState === null || T === e) && T.child !== null) {
              T.child.return = T, T = T.child;
              continue;
            }
            if (T === e) break e;
            for (; T.sibling === null; ) {
              if (T.return === null || T.return === e) break e;
              j === T && (j = null), T = T.return;
            }
            j === T && (j = null), T.sibling.return = T.return, T = T.sibling;
          }
        }
        break;
      case 19:
        yt(t, e), Nt(e), r & 4 && Sa(e);
        break;
      case 21:
        break;
      default:
        yt(
          t,
          e
        ), Nt(e);
    }
  }
  function Nt(e) {
    var t = e.flags;
    if (t & 2) {
      try {
        e: {
          for (var n = e.return; n !== null; ) {
            if (xa(n)) {
              var r = n;
              break e;
            }
            n = n.return;
          }
          throw Error(s(160));
        }
        switch (r.tag) {
          case 5:
            var l = r.stateNode;
            r.flags & 32 && (Bn(l, ""), r.flags &= -33);
            var i = wa(e);
            wo(e, i, l);
            break;
          case 3:
          case 4:
            var o = r.stateNode.containerInfo, f = wa(e);
            xo(e, f, o);
            break;
          default:
            throw Error(s(161));
        }
      } catch (p) {
        Ce(e, e.return, p);
      }
      e.flags &= -3;
    }
    t & 4096 && (e.flags &= -4097);
  }
  function Jf(e, t, n) {
    F = e, Na(e);
  }
  function Na(e, t, n) {
    for (var r = (e.mode & 1) !== 0; F !== null; ) {
      var l = F, i = l.child;
      if (l.tag === 22 && r) {
        var o = l.memoizedState !== null || El;
        if (!o) {
          var f = l.alternate, p = f !== null && f.memoizedState !== null || We;
          f = El;
          var y = We;
          if (El = o, (We = p) && !y) for (F = l; F !== null; ) o = F, p = o.child, o.tag === 22 && o.memoizedState !== null ? ja(l) : p !== null ? (p.return = o, F = p) : ja(l);
          for (; i !== null; ) F = i, Na(i), i = i.sibling;
          F = l, El = f, We = y;
        }
        Ca(e);
      } else (l.subtreeFlags & 8772) !== 0 && i !== null ? (i.return = l, F = i) : Ca(e);
    }
  }
  function Ca(e) {
    for (; F !== null; ) {
      var t = F;
      if ((t.flags & 8772) !== 0) {
        var n = t.alternate;
        try {
          if ((t.flags & 8772) !== 0) switch (t.tag) {
            case 0:
            case 11:
            case 15:
              We || Nl(5, t);
              break;
            case 1:
              var r = t.stateNode;
              if (t.flags & 4 && !We) if (n === null) r.componentDidMount();
              else {
                var l = t.elementType === t.type ? n.memoizedProps : vt(t.type, n.memoizedProps);
                r.componentDidUpdate(l, n.memoizedState, r.__reactInternalSnapshotBeforeUpdate);
              }
              var i = t.updateQueue;
              i !== null && _u(t, i, r);
              break;
            case 3:
              var o = t.updateQueue;
              if (o !== null) {
                if (n = null, t.child !== null) switch (t.child.tag) {
                  case 5:
                    n = t.child.stateNode;
                    break;
                  case 1:
                    n = t.child.stateNode;
                }
                _u(t, o, n);
              }
              break;
            case 5:
              var f = t.stateNode;
              if (n === null && t.flags & 4) {
                n = f;
                var p = t.memoizedProps;
                switch (t.type) {
                  case "button":
                  case "input":
                  case "select":
                  case "textarea":
                    p.autoFocus && n.focus();
                    break;
                  case "img":
                    p.src && (n.src = p.src);
                }
              }
              break;
            case 6:
              break;
            case 4:
              break;
            case 12:
              break;
            case 13:
              if (t.memoizedState === null) {
                var y = t.alternate;
                if (y !== null) {
                  var j = y.memoizedState;
                  if (j !== null) {
                    var T = j.dehydrated;
                    T !== null && bn(T);
                  }
                }
              }
              break;
            case 19:
            case 17:
            case 21:
            case 22:
            case 23:
            case 25:
              break;
            default:
              throw Error(s(163));
          }
          We || t.flags & 512 && yo(t);
        } catch (_) {
          Ce(t, t.return, _);
        }
      }
      if (t === e) {
        F = null;
        break;
      }
      if (n = t.sibling, n !== null) {
        n.return = t.return, F = n;
        break;
      }
      F = t.return;
    }
  }
  function _a(e) {
    for (; F !== null; ) {
      var t = F;
      if (t === e) {
        F = null;
        break;
      }
      var n = t.sibling;
      if (n !== null) {
        n.return = t.return, F = n;
        break;
      }
      F = t.return;
    }
  }
  function ja(e) {
    for (; F !== null; ) {
      var t = F;
      try {
        switch (t.tag) {
          case 0:
          case 11:
          case 15:
            var n = t.return;
            try {
              Nl(4, t);
            } catch (p) {
              Ce(t, n, p);
            }
            break;
          case 1:
            var r = t.stateNode;
            if (typeof r.componentDidMount == "function") {
              var l = t.return;
              try {
                r.componentDidMount();
              } catch (p) {
                Ce(t, l, p);
              }
            }
            var i = t.return;
            try {
              yo(t);
            } catch (p) {
              Ce(t, i, p);
            }
            break;
          case 5:
            var o = t.return;
            try {
              yo(t);
            } catch (p) {
              Ce(t, o, p);
            }
        }
      } catch (p) {
        Ce(t, t.return, p);
      }
      if (t === e) {
        F = null;
        break;
      }
      var f = t.sibling;
      if (f !== null) {
        f.return = t.return, F = f;
        break;
      }
      F = t.return;
    }
  }
  var qf = Math.ceil, Cl = me.ReactCurrentDispatcher, ko = me.ReactCurrentOwner, ct = me.ReactCurrentBatchConfig, ae = 0, Fe = null, ze = null, $e = 0, lt = 0, Fn = Ut(0), Me = 0, Sr = null, un = 0, _l = 0, So = 0, Er = null, qe = null, Eo = 0, On = 1 / 0, Mt = null, jl = !1, No = null, Kt = null, zl = !1, Gt = null, Tl = 0, Nr = 0, Co = null, Pl = -1, Rl = 0;
  function Ke() {
    return (ae & 6) !== 0 ? _e() : Pl !== -1 ? Pl : Pl = _e();
  }
  function Yt(e) {
    return (e.mode & 1) === 0 ? 1 : (ae & 2) !== 0 && $e !== 0 ? $e & -$e : Df.transition !== null ? (Rl === 0 && (Rl = ws()), Rl) : (e = de, e !== 0 || (e = window.event, e = e === void 0 ? 16 : Ts(e.type)), e);
  }
  function xt(e, t, n, r) {
    if (50 < Nr) throw Nr = 0, Co = null, Error(s(185));
    Yn(e, n, r), ((ae & 2) === 0 || e !== Fe) && (e === Fe && ((ae & 2) === 0 && (_l |= n), Me === 4 && Xt(e, $e)), be(e, r), n === 1 && ae === 0 && (t.mode & 1) === 0 && (On = _e() + 500, il && Bt()));
  }
  function be(e, t) {
    var n = e.callbackNode;
    Ic(e, t);
    var r = Ur(e, e === Fe ? $e : 0);
    if (r === 0) n !== null && gs(n), e.callbackNode = null, e.callbackPriority = 0;
    else if (t = r & -r, e.callbackPriority !== t) {
      if (n != null && gs(n), t === 1) e.tag === 0 ? If(Ta.bind(null, e)) : hu(Ta.bind(null, e)), Pf(function() {
        (ae & 6) === 0 && Bt();
      }), n = null;
      else {
        switch (ks(r)) {
          case 1:
            n = ri;
            break;
          case 4:
            n = ys;
            break;
          case 16:
            n = Fr;
            break;
          case 536870912:
            n = xs;
            break;
          default:
            n = Fr;
        }
        n = Oa(n, za.bind(null, e));
      }
      e.callbackPriority = t, e.callbackNode = n;
    }
  }
  function za(e, t) {
    if (Pl = -1, Rl = 0, (ae & 6) !== 0) throw Error(s(327));
    var n = e.callbackNode;
    if (An() && e.callbackNode !== n) return null;
    var r = Ur(e, e === Fe ? $e : 0);
    if (r === 0) return null;
    if ((r & 30) !== 0 || (r & e.expiredLanes) !== 0 || t) t = Ml(e, r);
    else {
      t = r;
      var l = ae;
      ae |= 2;
      var i = Ra();
      (Fe !== e || $e !== t) && (Mt = null, On = _e() + 500, cn(e, t));
      do
        try {
          td();
          break;
        } catch (f) {
          Pa(e, f);
        }
      while (!0);
      Bi(), Cl.current = i, ae = l, ze !== null ? t = 0 : (Fe = null, $e = 0, t = Me);
    }
    if (t !== 0) {
      if (t === 2 && (l = li(e), l !== 0 && (r = l, t = _o(e, l))), t === 1) throw n = Sr, cn(e, 0), Xt(e, r), be(e, _e()), n;
      if (t === 6) Xt(e, r);
      else {
        if (l = e.current.alternate, (r & 30) === 0 && !bf(l) && (t = Ml(e, r), t === 2 && (i = li(e), i !== 0 && (r = i, t = _o(e, i))), t === 1)) throw n = Sr, cn(e, 0), Xt(e, r), be(e, _e()), n;
        switch (e.finishedWork = l, e.finishedLanes = r, t) {
          case 0:
          case 1:
            throw Error(s(345));
          case 2:
            fn(e, qe, Mt);
            break;
          case 3:
            if (Xt(e, r), (r & 130023424) === r && (t = Eo + 500 - _e(), 10 < t)) {
              if (Ur(e, 0) !== 0) break;
              if (l = e.suspendedLanes, (l & r) !== r) {
                Ke(), e.pingedLanes |= e.suspendedLanes & l;
                break;
              }
              e.timeoutHandle = Ri(fn.bind(null, e, qe, Mt), t);
              break;
            }
            fn(e, qe, Mt);
            break;
          case 4:
            if (Xt(e, r), (r & 4194240) === r) break;
            for (t = e.eventTimes, l = -1; 0 < r; ) {
              var o = 31 - pt(r);
              i = 1 << o, o = t[o], o > l && (l = o), r &= ~i;
            }
            if (r = l, r = _e() - r, r = (120 > r ? 120 : 480 > r ? 480 : 1080 > r ? 1080 : 1920 > r ? 1920 : 3e3 > r ? 3e3 : 4320 > r ? 4320 : 1960 * qf(r / 1960)) - r, 10 < r) {
              e.timeoutHandle = Ri(fn.bind(null, e, qe, Mt), r);
              break;
            }
            fn(e, qe, Mt);
            break;
          case 5:
            fn(e, qe, Mt);
            break;
          default:
            throw Error(s(329));
        }
      }
    }
    return be(e, _e()), e.callbackNode === n ? za.bind(null, e) : null;
  }
  function _o(e, t) {
    var n = Er;
    return e.current.memoizedState.isDehydrated && (cn(e, t).flags |= 256), e = Ml(e, t), e !== 2 && (t = qe, qe = n, t !== null && jo(t)), e;
  }
  function jo(e) {
    qe === null ? qe = e : qe.push.apply(qe, e);
  }
  function bf(e) {
    for (var t = e; ; ) {
      if (t.flags & 16384) {
        var n = t.updateQueue;
        if (n !== null && (n = n.stores, n !== null)) for (var r = 0; r < n.length; r++) {
          var l = n[r], i = l.getSnapshot;
          l = l.value;
          try {
            if (!ht(i(), l)) return !1;
          } catch {
            return !1;
          }
        }
      }
      if (n = t.child, t.subtreeFlags & 16384 && n !== null) n.return = t, t = n;
      else {
        if (t === e) break;
        for (; t.sibling === null; ) {
          if (t.return === null || t.return === e) return !0;
          t = t.return;
        }
        t.sibling.return = t.return, t = t.sibling;
      }
    }
    return !0;
  }
  function Xt(e, t) {
    for (t &= ~So, t &= ~_l, e.suspendedLanes |= t, e.pingedLanes &= ~t, e = e.expirationTimes; 0 < t; ) {
      var n = 31 - pt(t), r = 1 << n;
      e[n] = -1, t &= ~r;
    }
  }
  function Ta(e) {
    if ((ae & 6) !== 0) throw Error(s(327));
    An();
    var t = Ur(e, 0);
    if ((t & 1) === 0) return be(e, _e()), null;
    var n = Ml(e, t);
    if (e.tag !== 0 && n === 2) {
      var r = li(e);
      r !== 0 && (t = r, n = _o(e, r));
    }
    if (n === 1) throw n = Sr, cn(e, 0), Xt(e, t), be(e, _e()), n;
    if (n === 6) throw Error(s(345));
    return e.finishedWork = e.current.alternate, e.finishedLanes = t, fn(e, qe, Mt), be(e, _e()), null;
  }
  function zo(e, t) {
    var n = ae;
    ae |= 1;
    try {
      return e(t);
    } finally {
      ae = n, ae === 0 && (On = _e() + 500, il && Bt());
    }
  }
  function an(e) {
    Gt !== null && Gt.tag === 0 && (ae & 6) === 0 && An();
    var t = ae;
    ae |= 1;
    var n = ct.transition, r = de;
    try {
      if (ct.transition = null, de = 1, e) return e();
    } finally {
      de = r, ct.transition = n, ae = t, (ae & 6) === 0 && Bt();
    }
  }
  function To() {
    lt = Fn.current, ge(Fn);
  }
  function cn(e, t) {
    e.finishedWork = null, e.finishedLanes = 0;
    var n = e.timeoutHandle;
    if (n !== -1 && (e.timeoutHandle = -1, Tf(n)), ze !== null) for (n = ze.return; n !== null; ) {
      var r = n;
      switch (Oi(r), r.tag) {
        case 1:
          r = r.type.childContextTypes, r != null && rl();
          break;
        case 3:
          Ln(), ge(Xe), ge(He), Zi();
          break;
        case 5:
          Yi(r);
          break;
        case 4:
          Ln();
          break;
        case 13:
          ge(Se);
          break;
        case 19:
          ge(Se);
          break;
        case 10:
          Vi(r.type._context);
          break;
        case 22:
        case 23:
          To();
      }
      n = n.return;
    }
    if (Fe = e, ze = e = Zt(e.current, null), $e = lt = t, Me = 0, Sr = null, So = _l = un = 0, qe = Er = null, ln !== null) {
      for (t = 0; t < ln.length; t++) if (n = ln[t], r = n.interleaved, r !== null) {
        n.interleaved = null;
        var l = r.next, i = n.pending;
        if (i !== null) {
          var o = i.next;
          i.next = l, r.next = o;
        }
        n.pending = r;
      }
      ln = null;
    }
    return e;
  }
  function Pa(e, t) {
    do {
      var n = ze;
      try {
        if (Bi(), ml.current = xl, vl) {
          for (var r = Ee.memoizedState; r !== null; ) {
            var l = r.queue;
            l !== null && (l.pending = null), r = r.next;
          }
          vl = !1;
        }
        if (sn = 0, De = Re = Ee = null, vr = !1, gr = 0, ko.current = null, n === null || n.return === null) {
          Me = 1, Sr = t, ze = null;
          break;
        }
        e: {
          var i = e, o = n.return, f = n, p = t;
          if (t = $e, f.flags |= 32768, p !== null && typeof p == "object" && typeof p.then == "function") {
            var y = p, j = f, T = j.tag;
            if ((j.mode & 1) === 0 && (T === 0 || T === 11 || T === 15)) {
              var _ = j.alternate;
              _ ? (j.updateQueue = _.updateQueue, j.memoizedState = _.memoizedState, j.lanes = _.lanes) : (j.updateQueue = null, j.memoizedState = null);
            }
            var I = ta(o);
            if (I !== null) {
              I.flags &= -257, na(I, o, f, i, t), I.mode & 1 && ea(i, y, t), t = I, p = y;
              var A = t.updateQueue;
              if (A === null) {
                var U = /* @__PURE__ */ new Set();
                U.add(p), t.updateQueue = U;
              } else A.add(p);
              break e;
            } else {
              if ((t & 1) === 0) {
                ea(i, y, t), Po();
                break e;
              }
              p = Error(s(426));
            }
          } else if (ke && f.mode & 1) {
            var je = ta(o);
            if (je !== null) {
              (je.flags & 65536) === 0 && (je.flags |= 256), na(je, o, f, i, t), Ui(In(p, f));
              break e;
            }
          }
          i = p = In(p, f), Me !== 4 && (Me = 2), Er === null ? Er = [i] : Er.push(i), i = o;
          do {
            switch (i.tag) {
              case 3:
                i.flags |= 65536, t &= -t, i.lanes |= t;
                var m = qu(i, p, t);
                Cu(i, m);
                break e;
              case 1:
                f = p;
                var h = i.type, g = i.stateNode;
                if ((i.flags & 128) === 0 && (typeof h.getDerivedStateFromError == "function" || g !== null && typeof g.componentDidCatch == "function" && (Kt === null || !Kt.has(g)))) {
                  i.flags |= 65536, t &= -t, i.lanes |= t;
                  var R = bu(i, f, t);
                  Cu(i, R);
                  break e;
                }
            }
            i = i.return;
          } while (i !== null);
        }
        La(n);
      } catch (B) {
        t = B, ze === n && n !== null && (ze = n = n.return);
        continue;
      }
      break;
    } while (!0);
  }
  function Ra() {
    var e = Cl.current;
    return Cl.current = xl, e === null ? xl : e;
  }
  function Po() {
    (Me === 0 || Me === 3 || Me === 2) && (Me = 4), Fe === null || (un & 268435455) === 0 && (_l & 268435455) === 0 || Xt(Fe, $e);
  }
  function Ml(e, t) {
    var n = ae;
    ae |= 2;
    var r = Ra();
    (Fe !== e || $e !== t) && (Mt = null, cn(e, t));
    do
      try {
        ed();
        break;
      } catch (l) {
        Pa(e, l);
      }
    while (!0);
    if (Bi(), ae = n, Cl.current = r, ze !== null) throw Error(s(261));
    return Fe = null, $e = 0, Me;
  }
  function ed() {
    for (; ze !== null; ) Ma(ze);
  }
  function td() {
    for (; ze !== null && !Cc(); ) Ma(ze);
  }
  function Ma(e) {
    var t = Fa(e.alternate, e, lt);
    e.memoizedProps = e.pendingProps, t === null ? La(e) : ze = t, ko.current = null;
  }
  function La(e) {
    var t = e;
    do {
      var n = t.alternate;
      if (e = t.return, (t.flags & 32768) === 0) {
        if (n = Gf(n, t, lt), n !== null) {
          ze = n;
          return;
        }
      } else {
        if (n = Yf(n, t), n !== null) {
          n.flags &= 32767, ze = n;
          return;
        }
        if (e !== null) e.flags |= 32768, e.subtreeFlags = 0, e.deletions = null;
        else {
          Me = 6, ze = null;
          return;
        }
      }
      if (t = t.sibling, t !== null) {
        ze = t;
        return;
      }
      ze = t = e;
    } while (t !== null);
    Me === 0 && (Me = 5);
  }
  function fn(e, t, n) {
    var r = de, l = ct.transition;
    try {
      ct.transition = null, de = 1, nd(e, t, n, r);
    } finally {
      ct.transition = l, de = r;
    }
    return null;
  }
  function nd(e, t, n, r) {
    do
      An();
    while (Gt !== null);
    if ((ae & 6) !== 0) throw Error(s(327));
    n = e.finishedWork;
    var l = e.finishedLanes;
    if (n === null) return null;
    if (e.finishedWork = null, e.finishedLanes = 0, n === e.current) throw Error(s(177));
    e.callbackNode = null, e.callbackPriority = 0;
    var i = n.lanes | n.childLanes;
    if (Dc(e, i), e === Fe && (ze = Fe = null, $e = 0), (n.subtreeFlags & 2064) === 0 && (n.flags & 2064) === 0 || zl || (zl = !0, Oa(Fr, function() {
      return An(), null;
    })), i = (n.flags & 15990) !== 0, (n.subtreeFlags & 15990) !== 0 || i) {
      i = ct.transition, ct.transition = null;
      var o = de;
      de = 1;
      var f = ae;
      ae |= 4, ko.current = null, Zf(e, n), Ea(n, e), Sf(Ti), Vr = !!zi, Ti = zi = null, e.current = n, Jf(n), _c(), ae = f, de = o, ct.transition = i;
    } else e.current = n;
    if (zl && (zl = !1, Gt = e, Tl = l), i = e.pendingLanes, i === 0 && (Kt = null), Tc(n.stateNode), be(e, _e()), t !== null) for (r = e.onRecoverableError, n = 0; n < t.length; n++) l = t[n], r(l.value, { componentStack: l.stack, digest: l.digest });
    if (jl) throw jl = !1, e = No, No = null, e;
    return (Tl & 1) !== 0 && e.tag !== 0 && An(), i = e.pendingLanes, (i & 1) !== 0 ? e === Co ? Nr++ : (Nr = 0, Co = e) : Nr = 0, Bt(), null;
  }
  function An() {
    if (Gt !== null) {
      var e = ks(Tl), t = ct.transition, n = de;
      try {
        if (ct.transition = null, de = 16 > e ? 16 : e, Gt === null) var r = !1;
        else {
          if (e = Gt, Gt = null, Tl = 0, (ae & 6) !== 0) throw Error(s(331));
          var l = ae;
          for (ae |= 4, F = e.current; F !== null; ) {
            var i = F, o = i.child;
            if ((F.flags & 16) !== 0) {
              var f = i.deletions;
              if (f !== null) {
                for (var p = 0; p < f.length; p++) {
                  var y = f[p];
                  for (F = y; F !== null; ) {
                    var j = F;
                    switch (j.tag) {
                      case 0:
                      case 11:
                      case 15:
                        kr(8, j, i);
                    }
                    var T = j.child;
                    if (T !== null) T.return = j, F = T;
                    else for (; F !== null; ) {
                      j = F;
                      var _ = j.sibling, I = j.return;
                      if (ya(j), j === y) {
                        F = null;
                        break;
                      }
                      if (_ !== null) {
                        _.return = I, F = _;
                        break;
                      }
                      F = I;
                    }
                  }
                }
                var A = i.alternate;
                if (A !== null) {
                  var U = A.child;
                  if (U !== null) {
                    A.child = null;
                    do {
                      var je = U.sibling;
                      U.sibling = null, U = je;
                    } while (U !== null);
                  }
                }
                F = i;
              }
            }
            if ((i.subtreeFlags & 2064) !== 0 && o !== null) o.return = i, F = o;
            else e: for (; F !== null; ) {
              if (i = F, (i.flags & 2048) !== 0) switch (i.tag) {
                case 0:
                case 11:
                case 15:
                  kr(9, i, i.return);
              }
              var m = i.sibling;
              if (m !== null) {
                m.return = i.return, F = m;
                break e;
              }
              F = i.return;
            }
          }
          var h = e.current;
          for (F = h; F !== null; ) {
            o = F;
            var g = o.child;
            if ((o.subtreeFlags & 2064) !== 0 && g !== null) g.return = o, F = g;
            else e: for (o = h; F !== null; ) {
              if (f = F, (f.flags & 2048) !== 0) try {
                switch (f.tag) {
                  case 0:
                  case 11:
                  case 15:
                    Nl(9, f);
                }
              } catch (B) {
                Ce(f, f.return, B);
              }
              if (f === o) {
                F = null;
                break e;
              }
              var R = f.sibling;
              if (R !== null) {
                R.return = f.return, F = R;
                break e;
              }
              F = f.return;
            }
          }
          if (ae = l, Bt(), wt && typeof wt.onPostCommitFiberRoot == "function") try {
            wt.onPostCommitFiberRoot(Or, e);
          } catch {
          }
          r = !0;
        }
        return r;
      } finally {
        de = n, ct.transition = t;
      }
    }
    return !1;
  }
  function Ia(e, t, n) {
    t = In(n, t), t = qu(e, t, 1), e = Wt(e, t, 1), t = Ke(), e !== null && (Yn(e, 1, t), be(e, t));
  }
  function Ce(e, t, n) {
    if (e.tag === 3) Ia(e, e, n);
    else for (; t !== null; ) {
      if (t.tag === 3) {
        Ia(t, e, n);
        break;
      } else if (t.tag === 1) {
        var r = t.stateNode;
        if (typeof t.type.getDerivedStateFromError == "function" || typeof r.componentDidCatch == "function" && (Kt === null || !Kt.has(r))) {
          e = In(n, e), e = bu(t, e, 1), t = Wt(t, e, 1), e = Ke(), t !== null && (Yn(t, 1, e), be(t, e));
          break;
        }
      }
      t = t.return;
    }
  }
  function rd(e, t, n) {
    var r = e.pingCache;
    r !== null && r.delete(t), t = Ke(), e.pingedLanes |= e.suspendedLanes & n, Fe === e && ($e & n) === n && (Me === 4 || Me === 3 && ($e & 130023424) === $e && 500 > _e() - Eo ? cn(e, 0) : So |= n), be(e, t);
  }
  function Da(e, t) {
    t === 0 && ((e.mode & 1) === 0 ? t = 1 : (t = $r, $r <<= 1, ($r & 130023424) === 0 && ($r = 4194304)));
    var n = Ke();
    e = Tt(e, t), e !== null && (Yn(e, t, n), be(e, n));
  }
  function ld(e) {
    var t = e.memoizedState, n = 0;
    t !== null && (n = t.retryLane), Da(e, n);
  }
  function id(e, t) {
    var n = 0;
    switch (e.tag) {
      case 13:
        var r = e.stateNode, l = e.memoizedState;
        l !== null && (n = l.retryLane);
        break;
      case 19:
        r = e.stateNode;
        break;
      default:
        throw Error(s(314));
    }
    r !== null && r.delete(t), Da(e, n);
  }
  var Fa;
  Fa = function(e, t, n) {
    if (e !== null) if (e.memoizedProps !== t.pendingProps || Xe.current) Je = !0;
    else {
      if ((e.lanes & n) === 0 && (t.flags & 128) === 0) return Je = !1, Kf(e, t, n);
      Je = (e.flags & 131072) !== 0;
    }
    else Je = !1, ke && (t.flags & 1048576) !== 0 && mu(t, sl, t.index);
    switch (t.lanes = 0, t.tag) {
      case 2:
        var r = t.type;
        Sl(e, t), e = t.pendingProps;
        var l = _n(t, He.current);
        Mn(t, n), l = bi(null, t, r, e, l, n);
        var i = eo();
        return t.flags |= 1, typeof l == "object" && l !== null && typeof l.render == "function" && l.$$typeof === void 0 ? (t.tag = 1, t.memoizedState = null, t.updateQueue = null, Ze(r) ? (i = !0, ll(t)) : i = !1, t.memoizedState = l.state !== null && l.state !== void 0 ? l.state : null, Ki(t), l.updater = wl, t.stateNode = l, l._reactInternals = t, oo(t, r, e, n), t = co(null, t, r, !0, i, n)) : (t.tag = 0, ke && i && Fi(t), Qe(null, t, l, n), t = t.child), t;
      case 16:
        r = t.elementType;
        e: {
          switch (Sl(e, t), e = t.pendingProps, l = r._init, r = l(r._payload), t.type = r, l = t.tag = sd(r), e = vt(r, e), l) {
            case 0:
              t = ao(null, t, r, e, n);
              break e;
            case 1:
              t = ua(null, t, r, e, n);
              break e;
            case 11:
              t = ra(null, t, r, e, n);
              break e;
            case 14:
              t = la(null, t, r, vt(r.type, e), n);
              break e;
          }
          throw Error(s(
            306,
            r,
            ""
          ));
        }
        return t;
      case 0:
        return r = t.type, l = t.pendingProps, l = t.elementType === r ? l : vt(r, l), ao(e, t, r, l, n);
      case 1:
        return r = t.type, l = t.pendingProps, l = t.elementType === r ? l : vt(r, l), ua(e, t, r, l, n);
      case 3:
        e: {
          if (aa(t), e === null) throw Error(s(387));
          r = t.pendingProps, i = t.memoizedState, l = i.element, Nu(e, t), pl(t, r, null, n);
          var o = t.memoizedState;
          if (r = o.element, i.isDehydrated) if (i = { element: r, isDehydrated: !1, cache: o.cache, pendingSuspenseBoundaries: o.pendingSuspenseBoundaries, transitions: o.transitions }, t.updateQueue.baseState = i, t.memoizedState = i, t.flags & 256) {
            l = In(Error(s(423)), t), t = ca(e, t, r, n, l);
            break e;
          } else if (r !== l) {
            l = In(Error(s(424)), t), t = ca(e, t, r, n, l);
            break e;
          } else for (rt = $t(t.stateNode.containerInfo.firstChild), nt = t, ke = !0, mt = null, n = Su(t, null, r, n), t.child = n; n; ) n.flags = n.flags & -3 | 4096, n = n.sibling;
          else {
            if (Tn(), r === l) {
              t = Rt(e, t, n);
              break e;
            }
            Qe(e, t, r, n);
          }
          t = t.child;
        }
        return t;
      case 5:
        return ju(t), e === null && $i(t), r = t.type, l = t.pendingProps, i = e !== null ? e.memoizedProps : null, o = l.children, Pi(r, l) ? o = null : i !== null && Pi(r, i) && (t.flags |= 32), sa(e, t), Qe(e, t, o, n), t.child;
      case 6:
        return e === null && $i(t), null;
      case 13:
        return fa(e, t, n);
      case 4:
        return Gi(t, t.stateNode.containerInfo), r = t.pendingProps, e === null ? t.child = Pn(t, null, r, n) : Qe(e, t, r, n), t.child;
      case 11:
        return r = t.type, l = t.pendingProps, l = t.elementType === r ? l : vt(r, l), ra(e, t, r, l, n);
      case 7:
        return Qe(e, t, t.pendingProps, n), t.child;
      case 8:
        return Qe(e, t, t.pendingProps.children, n), t.child;
      case 12:
        return Qe(e, t, t.pendingProps.children, n), t.child;
      case 10:
        e: {
          if (r = t.type._context, l = t.pendingProps, i = t.memoizedProps, o = l.value, he(cl, r._currentValue), r._currentValue = o, i !== null) if (ht(i.value, o)) {
            if (i.children === l.children && !Xe.current) {
              t = Rt(e, t, n);
              break e;
            }
          } else for (i = t.child, i !== null && (i.return = t); i !== null; ) {
            var f = i.dependencies;
            if (f !== null) {
              o = i.child;
              for (var p = f.firstContext; p !== null; ) {
                if (p.context === r) {
                  if (i.tag === 1) {
                    p = Pt(-1, n & -n), p.tag = 2;
                    var y = i.updateQueue;
                    if (y !== null) {
                      y = y.shared;
                      var j = y.pending;
                      j === null ? p.next = p : (p.next = j.next, j.next = p), y.pending = p;
                    }
                  }
                  i.lanes |= n, p = i.alternate, p !== null && (p.lanes |= n), Wi(
                    i.return,
                    n,
                    t
                  ), f.lanes |= n;
                  break;
                }
                p = p.next;
              }
            } else if (i.tag === 10) o = i.type === t.type ? null : i.child;
            else if (i.tag === 18) {
              if (o = i.return, o === null) throw Error(s(341));
              o.lanes |= n, f = o.alternate, f !== null && (f.lanes |= n), Wi(o, n, t), o = i.sibling;
            } else o = i.child;
            if (o !== null) o.return = i;
            else for (o = i; o !== null; ) {
              if (o === t) {
                o = null;
                break;
              }
              if (i = o.sibling, i !== null) {
                i.return = o.return, o = i;
                break;
              }
              o = o.return;
            }
            i = o;
          }
          Qe(e, t, l.children, n), t = t.child;
        }
        return t;
      case 9:
        return l = t.type, r = t.pendingProps.children, Mn(t, n), l = ut(l), r = r(l), t.flags |= 1, Qe(e, t, r, n), t.child;
      case 14:
        return r = t.type, l = vt(r, t.pendingProps), l = vt(r.type, l), la(e, t, r, l, n);
      case 15:
        return ia(e, t, t.type, t.pendingProps, n);
      case 17:
        return r = t.type, l = t.pendingProps, l = t.elementType === r ? l : vt(r, l), Sl(e, t), t.tag = 1, Ze(r) ? (e = !0, ll(t)) : e = !1, Mn(t, n), Zu(t, r, l), oo(t, r, l, n), co(null, t, r, !0, e, n);
      case 19:
        return pa(e, t, n);
      case 22:
        return oa(e, t, n);
    }
    throw Error(s(156, t.tag));
  };
  function Oa(e, t) {
    return vs(e, t);
  }
  function od(e, t, n, r) {
    this.tag = e, this.key = n, this.sibling = this.child = this.return = this.stateNode = this.type = this.elementType = null, this.index = 0, this.ref = null, this.pendingProps = t, this.dependencies = this.memoizedState = this.updateQueue = this.memoizedProps = null, this.mode = r, this.subtreeFlags = this.flags = 0, this.deletions = null, this.childLanes = this.lanes = 0, this.alternate = null;
  }
  function ft(e, t, n, r) {
    return new od(e, t, n, r);
  }
  function Ro(e) {
    return e = e.prototype, !(!e || !e.isReactComponent);
  }
  function sd(e) {
    if (typeof e == "function") return Ro(e) ? 1 : 0;
    if (e != null) {
      if (e = e.$$typeof, e === re) return 11;
      if (e === Ye) return 14;
    }
    return 2;
  }
  function Zt(e, t) {
    var n = e.alternate;
    return n === null ? (n = ft(e.tag, t, e.key, e.mode), n.elementType = e.elementType, n.type = e.type, n.stateNode = e.stateNode, n.alternate = e, e.alternate = n) : (n.pendingProps = t, n.type = e.type, n.flags = 0, n.subtreeFlags = 0, n.deletions = null), n.flags = e.flags & 14680064, n.childLanes = e.childLanes, n.lanes = e.lanes, n.child = e.child, n.memoizedProps = e.memoizedProps, n.memoizedState = e.memoizedState, n.updateQueue = e.updateQueue, t = e.dependencies, n.dependencies = t === null ? null : { lanes: t.lanes, firstContext: t.firstContext }, n.sibling = e.sibling, n.index = e.index, n.ref = e.ref, n;
  }
  function Ll(e, t, n, r, l, i) {
    var o = 2;
    if (r = e, typeof e == "function") Ro(e) && (o = 1);
    else if (typeof e == "string") o = 5;
    else e: switch (e) {
      case ue:
        return dn(n.children, l, i, t);
      case O:
        o = 8, l |= 8;
        break;
      case le:
        return e = ft(12, n, t, l | 2), e.elementType = le, e.lanes = i, e;
      case xe:
        return e = ft(13, n, t, l), e.elementType = xe, e.lanes = i, e;
      case Ge:
        return e = ft(19, n, t, l), e.elementType = Ge, e.lanes = i, e;
      case we:
        return Il(n, l, i, t);
      default:
        if (typeof e == "object" && e !== null) switch (e.$$typeof) {
          case X:
            o = 10;
            break e;
          case ie:
            o = 9;
            break e;
          case re:
            o = 11;
            break e;
          case Ye:
            o = 14;
            break e;
          case Ie:
            o = 16, r = null;
            break e;
        }
        throw Error(s(130, e == null ? e : typeof e, ""));
    }
    return t = ft(o, n, t, l), t.elementType = e, t.type = r, t.lanes = i, t;
  }
  function dn(e, t, n, r) {
    return e = ft(7, e, r, t), e.lanes = n, e;
  }
  function Il(e, t, n, r) {
    return e = ft(22, e, r, t), e.elementType = we, e.lanes = n, e.stateNode = { isHidden: !1 }, e;
  }
  function Mo(e, t, n) {
    return e = ft(6, e, null, t), e.lanes = n, e;
  }
  function Lo(e, t, n) {
    return t = ft(4, e.children !== null ? e.children : [], e.key, t), t.lanes = n, t.stateNode = { containerInfo: e.containerInfo, pendingChildren: null, implementation: e.implementation }, t;
  }
  function ud(e, t, n, r, l) {
    this.tag = t, this.containerInfo = e, this.finishedWork = this.pingCache = this.current = this.pendingChildren = null, this.timeoutHandle = -1, this.callbackNode = this.pendingContext = this.context = null, this.callbackPriority = 0, this.eventTimes = ii(0), this.expirationTimes = ii(-1), this.entangledLanes = this.finishedLanes = this.mutableReadLanes = this.expiredLanes = this.pingedLanes = this.suspendedLanes = this.pendingLanes = 0, this.entanglements = ii(0), this.identifierPrefix = r, this.onRecoverableError = l, this.mutableSourceEagerHydrationData = null;
  }
  function Io(e, t, n, r, l, i, o, f, p) {
    return e = new ud(e, t, n, f, p), t === 1 ? (t = 1, i === !0 && (t |= 8)) : t = 0, i = ft(3, null, null, t), e.current = i, i.stateNode = e, i.memoizedState = { element: r, isDehydrated: n, cache: null, transitions: null, pendingSuspenseBoundaries: null }, Ki(i), e;
  }
  function ad(e, t, n) {
    var r = 3 < arguments.length && arguments[3] !== void 0 ? arguments[3] : null;
    return { $$typeof: fe, key: r == null ? null : "" + r, children: e, containerInfo: t, implementation: n };
  }
  function Aa(e) {
    if (!e) return Ht;
    e = e._reactInternals;
    e: {
      if (bt(e) !== e || e.tag !== 1) throw Error(s(170));
      var t = e;
      do {
        switch (t.tag) {
          case 3:
            t = t.stateNode.context;
            break e;
          case 1:
            if (Ze(t.type)) {
              t = t.stateNode.__reactInternalMemoizedMergedChildContext;
              break e;
            }
        }
        t = t.return;
      } while (t !== null);
      throw Error(s(171));
    }
    if (e.tag === 1) {
      var n = e.type;
      if (Ze(n)) return du(e, n, t);
    }
    return t;
  }
  function $a(e, t, n, r, l, i, o, f, p) {
    return e = Io(n, r, !0, e, l, i, o, f, p), e.context = Aa(null), n = e.current, r = Ke(), l = Yt(n), i = Pt(r, l), i.callback = t ?? null, Wt(n, i, l), e.current.lanes = l, Yn(e, l, r), be(e, r), e;
  }
  function Dl(e, t, n, r) {
    var l = t.current, i = Ke(), o = Yt(l);
    return n = Aa(n), t.context === null ? t.context = n : t.pendingContext = n, t = Pt(i, o), t.payload = { element: e }, r = r === void 0 ? null : r, r !== null && (t.callback = r), e = Wt(l, t, o), e !== null && (xt(e, l, o, i), dl(e, l, o)), o;
  }
  function Fl(e) {
    if (e = e.current, !e.child) return null;
    switch (e.child.tag) {
      case 5:
        return e.child.stateNode;
      default:
        return e.child.stateNode;
    }
  }
  function Ua(e, t) {
    if (e = e.memoizedState, e !== null && e.dehydrated !== null) {
      var n = e.retryLane;
      e.retryLane = n !== 0 && n < t ? n : t;
    }
  }
  function Do(e, t) {
    Ua(e, t), (e = e.alternate) && Ua(e, t);
  }
  function cd() {
    return null;
  }
  var Ha = typeof reportError == "function" ? reportError : function(e) {
    console.error(e);
  };
  function Fo(e) {
    this._internalRoot = e;
  }
  Ol.prototype.render = Fo.prototype.render = function(e) {
    var t = this._internalRoot;
    if (t === null) throw Error(s(409));
    Dl(e, t, null, null);
  }, Ol.prototype.unmount = Fo.prototype.unmount = function() {
    var e = this._internalRoot;
    if (e !== null) {
      this._internalRoot = null;
      var t = e.containerInfo;
      an(function() {
        Dl(null, e, null, null);
      }), t[Ct] = null;
    }
  };
  function Ol(e) {
    this._internalRoot = e;
  }
  Ol.prototype.unstable_scheduleHydration = function(e) {
    if (e) {
      var t = Ns();
      e = { blockedOn: null, target: e, priority: t };
      for (var n = 0; n < Ft.length && t !== 0 && t < Ft[n].priority; n++) ;
      Ft.splice(n, 0, e), n === 0 && js(e);
    }
  };
  function Oo(e) {
    return !(!e || e.nodeType !== 1 && e.nodeType !== 9 && e.nodeType !== 11);
  }
  function Al(e) {
    return !(!e || e.nodeType !== 1 && e.nodeType !== 9 && e.nodeType !== 11 && (e.nodeType !== 8 || e.nodeValue !== " react-mount-point-unstable "));
  }
  function Ba() {
  }
  function fd(e, t, n, r, l) {
    if (l) {
      if (typeof r == "function") {
        var i = r;
        r = function() {
          var y = Fl(o);
          i.call(y);
        };
      }
      var o = $a(t, r, e, 0, null, !1, !1, "", Ba);
      return e._reactRootContainer = o, e[Ct] = o.current, ur(e.nodeType === 8 ? e.parentNode : e), an(), o;
    }
    for (; l = e.lastChild; ) e.removeChild(l);
    if (typeof r == "function") {
      var f = r;
      r = function() {
        var y = Fl(p);
        f.call(y);
      };
    }
    var p = Io(e, 0, !1, null, null, !1, !1, "", Ba);
    return e._reactRootContainer = p, e[Ct] = p.current, ur(e.nodeType === 8 ? e.parentNode : e), an(function() {
      Dl(t, p, n, r);
    }), p;
  }
  function $l(e, t, n, r, l) {
    var i = n._reactRootContainer;
    if (i) {
      var o = i;
      if (typeof l == "function") {
        var f = l;
        l = function() {
          var p = Fl(o);
          f.call(p);
        };
      }
      Dl(t, o, e, l);
    } else o = fd(n, t, e, l, r);
    return Fl(o);
  }
  Ss = function(e) {
    switch (e.tag) {
      case 3:
        var t = e.stateNode;
        if (t.current.memoizedState.isDehydrated) {
          var n = Gn(t.pendingLanes);
          n !== 0 && (oi(t, n | 1), be(t, _e()), (ae & 6) === 0 && (On = _e() + 500, Bt()));
        }
        break;
      case 13:
        an(function() {
          var r = Tt(e, 1);
          if (r !== null) {
            var l = Ke();
            xt(r, e, 1, l);
          }
        }), Do(e, 1);
    }
  }, si = function(e) {
    if (e.tag === 13) {
      var t = Tt(e, 134217728);
      if (t !== null) {
        var n = Ke();
        xt(t, e, 134217728, n);
      }
      Do(e, 134217728);
    }
  }, Es = function(e) {
    if (e.tag === 13) {
      var t = Yt(e), n = Tt(e, t);
      if (n !== null) {
        var r = Ke();
        xt(n, e, t, r);
      }
      Do(e, t);
    }
  }, Ns = function() {
    return de;
  }, Cs = function(e, t) {
    var n = de;
    try {
      return de = e, t();
    } finally {
      de = n;
    }
  }, bl = function(e, t, n) {
    switch (t) {
      case "input":
        if (Ql(e, n), t = n.name, n.type === "radio" && t != null) {
          for (n = e; n.parentNode; ) n = n.parentNode;
          for (n = n.querySelectorAll("input[name=" + JSON.stringify("" + t) + '][type="radio"]'), t = 0; t < n.length; t++) {
            var r = n[t];
            if (r !== e && r.form === e.form) {
              var l = nl(r);
              if (!l) throw Error(s(90));
              Un(r), Ql(r, l);
            }
          }
        }
        break;
      case "textarea":
        es(e, n);
        break;
      case "select":
        t = n.value, t != null && hn(e, !!n.multiple, t, !1);
    }
  }, as = zo, cs = an;
  var dd = { usingClientEntryPoint: !1, Events: [fr, Nn, nl, ss, us, zo] }, Cr = { findFiberByHostInstance: en, bundleType: 0, version: "18.3.1", rendererPackageName: "react-dom" }, pd = { bundleType: Cr.bundleType, version: Cr.version, rendererPackageName: Cr.rendererPackageName, rendererConfig: Cr.rendererConfig, overrideHookState: null, overrideHookStateDeletePath: null, overrideHookStateRenamePath: null, overrideProps: null, overridePropsDeletePath: null, overridePropsRenamePath: null, setErrorHandler: null, setSuspenseHandler: null, scheduleUpdate: null, currentDispatcherRef: me.ReactCurrentDispatcher, findHostInstanceByFiber: function(e) {
    return e = hs(e), e === null ? null : e.stateNode;
  }, findFiberByHostInstance: Cr.findFiberByHostInstance || cd, findHostInstancesForRefresh: null, scheduleRefresh: null, scheduleRoot: null, setRefreshHandler: null, getCurrentFiber: null, reconcilerVersion: "18.3.1-next-f1338f8080-20240426" };
  if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u") {
    var Ul = __REACT_DEVTOOLS_GLOBAL_HOOK__;
    if (!Ul.isDisabled && Ul.supportsFiber) try {
      Or = Ul.inject(pd), wt = Ul;
    } catch {
    }
  }
  return et.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = dd, et.createPortal = function(e, t) {
    var n = 2 < arguments.length && arguments[2] !== void 0 ? arguments[2] : null;
    if (!Oo(t)) throw Error(s(200));
    return ad(e, t, null, n);
  }, et.createRoot = function(e, t) {
    if (!Oo(e)) throw Error(s(299));
    var n = !1, r = "", l = Ha;
    return t != null && (t.unstable_strictMode === !0 && (n = !0), t.identifierPrefix !== void 0 && (r = t.identifierPrefix), t.onRecoverableError !== void 0 && (l = t.onRecoverableError)), t = Io(e, 1, !1, null, null, n, !1, r, l), e[Ct] = t.current, ur(e.nodeType === 8 ? e.parentNode : e), new Fo(t);
  }, et.findDOMNode = function(e) {
    if (e == null) return null;
    if (e.nodeType === 1) return e;
    var t = e._reactInternals;
    if (t === void 0)
      throw typeof e.render == "function" ? Error(s(188)) : (e = Object.keys(e).join(","), Error(s(268, e)));
    return e = hs(t), e = e === null ? null : e.stateNode, e;
  }, et.flushSync = function(e) {
    return an(e);
  }, et.hydrate = function(e, t, n) {
    if (!Al(t)) throw Error(s(200));
    return $l(null, e, t, !0, n);
  }, et.hydrateRoot = function(e, t, n) {
    if (!Oo(e)) throw Error(s(405));
    var r = n != null && n.hydratedSources || null, l = !1, i = "", o = Ha;
    if (n != null && (n.unstable_strictMode === !0 && (l = !0), n.identifierPrefix !== void 0 && (i = n.identifierPrefix), n.onRecoverableError !== void 0 && (o = n.onRecoverableError)), t = $a(t, null, e, 1, n ?? null, l, !1, i, o), e[Ct] = t.current, ur(e), r) for (e = 0; e < r.length; e++) n = r[e], l = n._getVersion, l = l(n._source), t.mutableSourceEagerHydrationData == null ? t.mutableSourceEagerHydrationData = [n, l] : t.mutableSourceEagerHydrationData.push(
      n,
      l
    );
    return new Ol(t);
  }, et.render = function(e, t, n) {
    if (!Al(t)) throw Error(s(200));
    return $l(null, e, t, !1, n);
  }, et.unmountComponentAtNode = function(e) {
    if (!Al(e)) throw Error(s(40));
    return e._reactRootContainer ? (an(function() {
      $l(null, null, e, !1, function() {
        e._reactRootContainer = null, e[Ct] = null;
      });
    }), !0) : !1;
  }, et.unstable_batchedUpdates = zo, et.unstable_renderSubtreeIntoContainer = function(e, t, n, r) {
    if (!Al(n)) throw Error(s(200));
    if (e == null || e._reactInternals === void 0) throw Error(s(38));
    return $l(e, t, n, !1, r);
  }, et.version = "18.3.1-next-f1338f8080-20240426", et;
}
var Za;
function Ed() {
  if (Za) return Uo.exports;
  Za = 1;
  function a() {
    if (!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function"))
      try {
        __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(a);
      } catch (u) {
        console.error(u);
      }
  }
  return a(), Uo.exports = Sd(), Uo.exports;
}
var Ja;
function Nd() {
  if (Ja) return Hl;
  Ja = 1;
  var a = Ed();
  return Hl.createRoot = a.createRoot, Hl.hydrateRoot = a.hydrateRoot, Hl;
}
var Cd = Nd();
const _d = ':host{--fc-text: var(--primary-text-color, #2b1e15);--fc-muted: var(--secondary-text-color, #786350);--fc-accent: var(--faith-accent, #b8862f);--fc-line: var(--divider-color, rgba(0,0,0,.12));--fc-bg2: var(--secondary-background-color, rgba(0,0,0,.04));--fc-ok: var(--success-color, #43a047);--fc-err: var(--error-color, #db4437);--fc-soft: color-mix(in srgb, var(--fc-accent) 14%, transparent);display:block;--fc-hex: polygon(50% 0, 93.3% 25%, 93.3% 75%, 50% 100%, 6.7% 75%, 6.7% 25%);--fc-serif: var(--faith-serif, "Fraunces Variable", Georgia, "Iowan Old Style", serif)}*{box-sizing:border-box}ha-card{padding:16px;color:var(--fc-text)}.head{display:flex;align-items:center;gap:10px;margin-bottom:12px}.head h2{margin:0;font-size:1.25rem;font-weight:600;line-height:1.2}.head .sub{color:var(--fc-muted);font-size:.85rem}.head .right{margin-left:auto;display:flex;gap:6px;align-items:center}.eyebrow{font-size:.72rem;letter-spacing:.12em;text-transform:uppercase;color:var(--fc-muted)}.hello{font-family:var(--fc-serif);margin:2px 0 14px;font-size:1.6rem;font-weight:600;line-height:1.15}.hello em{color:var(--fc-accent);font-style:italic}.section{padding:12px 0;border-top:1px solid var(--fc-line)}.section:first-of-type{border-top:0;padding-top:0}.section h3{display:flex;align-items:center;gap:8px;margin:0 0 8px;font-size:1rem;font-weight:600}.section h3 ha-icon{--mdc-icon-size: 20px;color:var(--fc-accent)}.count{background:var(--fc-bg2);color:var(--fc-muted);border-radius:999px;padding:0 8px;font-size:.8rem;font-weight:500}ul{list-style:none;margin:0;padding:0}.row{display:flex;align-items:center;gap:10px;padding:7px 0;border-bottom:1px solid var(--fc-line)}.row:last-child{border-bottom:0}.time{min-width:70px;color:var(--fc-muted);font-variant-numeric:tabular-nums}.grow{flex:1;min-width:0}.meta{color:var(--fc-muted);font-size:.85rem}.label{font-size:.72rem;letter-spacing:.1em;text-transform:uppercase;color:var(--fc-muted)}.check{width:18px;height:18px;border-radius:50%;border:2px solid var(--fc-line);flex:none}.check.done{background:var(--fc-ok);border-color:var(--fc-ok)}.tiles{display:grid;grid-template-columns:repeat(auto-fill,minmax(120px,1fr));gap:8px}.tile{background:var(--fc-bg2);border-radius:12px;padding:10px 12px}.tile .v{font-size:1.15rem;font-weight:600;text-transform:capitalize}.empty{color:var(--fc-muted);padding:4px 0}.err{color:var(--fc-err)}button{font:inherit;color:inherit;cursor:pointer;white-space:nowrap;border:1px solid var(--fc-line);background:var(--fc-bg2);border-radius:10px;padding:8px 14px;min-height:44px}button:focus-visible,a:focus-visible,input:focus-visible{outline:2px solid var(--fc-accent);outline-offset:2px}button.primary{background:var(--fc-accent);border-color:var(--fc-accent);color:var(--faith-accent-text, #fffaf0)}button.ghost{background:transparent;border-color:transparent;color:var(--fc-muted)}button:disabled{opacity:.5;cursor:default}.btns{display:flex;gap:6px;flex-wrap:wrap}input{font:inherit;color:var(--fc-text);background:var(--fc-bg2);border:1px solid var(--fc-line);border-radius:10px;padding:8px 12px;min-height:44px;width:100%}input:focus{outline:2px solid var(--fc-accent);outline-offset:-1px}.avatar{display:inline-grid;place-items:center;color:#fff;font-weight:600;flex:none;clip-path:var(--fc-hex)}.hexring{display:inline-grid;place-items:center;padding:3px;background:var(--fc-accent);clip-path:var(--fc-hex);flex:none}.people{display:grid;grid-template-columns:repeat(auto-fill,minmax(96px,1fr));gap:10px}.person{display:flex;flex-direction:column;align-items:center;gap:8px;padding:14px 8px;border-radius:14px;border:1px solid var(--fc-line);background:transparent;font-weight:600}.person.suggested{border:2px solid var(--fc-accent)}.pin{display:flex;flex-direction:column;align-items:center;gap:12px}.dots{display:flex;gap:10px}.dots span{width:13px;height:13px;border-radius:50%;border:2px solid var(--fc-muted)}.dots span.on{background:var(--fc-accent);border-color:var(--fc-accent)}.keys{display:grid;grid-template-columns:repeat(3,68px);gap:8px}.keys button{height:58px;font-size:1.35rem;border-radius:14px}.chat{display:flex;flex-direction:column;gap:10px;max-height:var(--faith-chat-height, 420px);overflow-y:auto;padding:2px}.msg{max-width:88%;padding:9px 13px;border-radius:16px;white-space:pre-wrap;line-height:1.4}.msg.me{align-self:flex-end;background:var(--fc-accent);color:var(--faith-accent-text, #fffaf0);border-bottom-right-radius:4px}.msg.faith{align-self:flex-start;background:var(--fc-bg2);border-bottom-left-radius:4px}.chips{display:flex;gap:4px;flex-wrap:wrap}.chip{font-size:.75rem;color:var(--fc-muted);border:1px solid var(--fc-line);border-radius:999px;padding:1px 8px}.ask{display:flex;gap:6px;margin-top:10px;align-items:center}.ask button{min-width:44px;padding:8px 10px}.rec{background:var(--fc-err)!important;color:#fff!important;border-color:var(--fc-err)!important}.box{border:1px solid var(--fc-accent);border-radius:14px;padding:10px 12px;display:flex;flex-direction:column;gap:8px}.box.wait{border-style:dashed}.big{font-size:2.6rem;font-weight:700;line-height:1}.pill{background:var(--fc-soft);color:var(--fc-accent);border-radius:999px;padding:2px 10px;font-weight:600;font-size:.85rem;white-space:nowrap}.toast{color:var(--fc-muted);font-size:.85rem}.toast:empty,.err:empty{display:none}.apps{display:flex;gap:8px;flex-wrap:wrap}.apps a{text-decoration:none;color:inherit;display:flex;align-items:center;gap:8px;border:1px solid var(--fc-line);border-radius:12px;padding:6px 12px 6px 8px}.emblem{flex:none;margin:-6px -2px -6px -6px}.mine{display:flex;align-items:center;gap:16px}.honey{display:grid;place-items:center;align-content:center;width:104px;height:112px;flex:none;clip-path:var(--fc-hex);background:linear-gradient(160deg,color-mix(in srgb,var(--fc-accent) 70%,#fff),var(--fc-accent));color:var(--faith-accent-text, #fffaf0)}.honey .label{color:inherit;opacity:.85}ha-card.hub{position:relative;overflow:hidden;padding:22px 22px 18px;background:radial-gradient(90% 60% at 50% 45%,color-mix(in srgb,var(--fc-accent) 14%,transparent),transparent 70%),var(--ha-card-background, var(--card-background-color, transparent))}.hub-top{display:flex;align-items:flex-start;gap:12px}.hub-top .right{margin-left:auto;display:flex;gap:8px;align-items:center;flex-wrap:wrap;justify-content:flex-end}.clock{font-family:var(--fc-serif);font-size:3.2rem;font-weight:600;line-height:1;letter-spacing:-.02em;font-variant-numeric:tabular-nums}.hub-mid{display:flex;flex-direction:column;align-items:center;text-align:center;gap:6px;margin:8px 0 10px}.hub-mid .hello{margin:0}button.orb{background:none;border:0;padding:0;min-height:0;border-radius:50%;margin:-8px 0}button.orb:focus-visible{outline:2px solid var(--fc-accent);outline-offset:-12px}button.orb:disabled{opacity:1}.hint{font-size:.72rem;letter-spacing:.16em;text-transform:uppercase;color:var(--fc-accent);font-weight:600}.heard{color:var(--fc-muted);font-style:italic}.reply{font-family:var(--fc-serif);font-size:1.3rem;line-height:1.4;max-width:34em;white-space:pre-wrap}.hub-mid .box{text-align:left;width:min(100%,30em)}.faces{display:flex;justify-content:center;gap:18px;flex-wrap:wrap;margin-top:14px;padding-top:14px;border-top:1px solid var(--fc-line)}button.face{display:flex;flex-direction:column;align-items:center;gap:6px;background:none;border:0;padding:4px;min-height:0;font-weight:600;font-size:.9rem}.overlay{position:absolute;top:0;right:0;bottom:0;left:0;z-index:2;display:grid;place-items:center;padding:16px;background:var(--ha-card-background, var(--card-background-color, #241a13))}.md-list{list-style:disc;margin:2px 0 4px;padding-left:1.3em;text-align:left}.md-list li{margin:1px 0}.msg .md-line:last-child,.reply .md-line:last-child{white-space:normal}code{font-family:ui-monospace,monospace;font-size:.9em;background:var(--fc-bg2);border-radius:5px;padding:0 4px}.cardbal{display:flex;align-items:center;gap:6px;margin-top:8px}.cardbal ha-icon{--mdc-icon-size: 18px;color:var(--fc-accent)}input[type=checkbox]{accent-color:var(--fc-accent);width:20px;min-height:20px;height:20px;padding:0}', Qo = (a) => `faith.hub.${a}`, oc = (a) => {
  if (a)
    try {
      return localStorage.getItem(Qo(a)) || void 0;
    } catch {
      return;
    }
};
function Yo(a, u) {
  try {
    u ? localStorage.setItem(Qo(a), u) : localStorage.removeItem(Qo(a));
  } catch {
  }
  window.dispatchEvent(new CustomEvent("faith-hub-changed", { detail: { screen: a } }));
}
function jd(a, u) {
  return {
    screen: u.screen,
    get user() {
      var s;
      return (s = a()) == null ? void 0 : s.user;
    },
    get dark() {
      var s, E;
      return !!((E = (s = a()) == null ? void 0 : s.themes) != null && E.darkMode);
    },
    call: async (s, E = {}) => {
      const N = a();
      if (!N) throw new Error("Home Assistant isn't ready yet.");
      const C = oc(u.screen);
      try {
        return await N.callWS({ type: "faith/call", path: s, body: { ...E, ...u.screen ? { screen: u.screen } : {}, ...C ? { hub_session: C } : {} } });
      } catch (z) {
        throw new Error((z == null ? void 0 : z.message) || (z == null ? void 0 : z.code) || "FAITH didn't answer.");
      }
    }
  };
}
const Tr = (1 + Math.sqrt(5)) / 2, it = Math.PI * 2, Ko = (() => {
  const a = Math.hypot(1, Tr), u = [];
  for (const s of [-1, 1]) for (const E of [-Tr, Tr]) u.push([0, s / a, E / a], [s / a, E / a, 0], [E / a, 0, s / a]);
  return u;
})(), zd = (a, u) => (a[0] - u[0]) ** 2 + (a[1] - u[1]) ** 2 + (a[2] - u[2]) ** 2, Td = 4 / (1 + Tr * Tr), Xo = [];
for (let a = 0; a < 12; a++) for (let u = a + 1; u < 12; u++) Math.abs(zd(Ko[a], Ko[u]) - Td) < 0.01 && Xo.push([a, u]);
const sc = [], Vo = (a, u) => Xo.some(([s, E]) => s === a && E === u || s === u && E === a);
for (let a = 0; a < 12; a++) for (let u = a + 1; u < 12; u++) for (let s = u + 1; s < 12; s++) Vo(a, u) && Vo(u, s) && Vo(a, s) && sc.push([a, u, s]);
const Pr = 7, qt = (a) => {
  const u = Math.sin(a * 127.1 + 311.7) * 43758.5453;
  return u - Math.floor(u);
}, qa = Array.from({ length: Pr }, (a, u) => ({
  a: [0, 1, 2].map((s) => 0.3 + 0.16 * qt(u * 9 + s)),
  w: [0, 1, 2].map((s) => 0.22 + 0.3 * qt(u * 9 + s + 3)),
  p: [0, 1, 2].map((s) => it * qt(u * 9 + s + 6)),
  flap: it * qt(u * 3 + 100)
})), uc = -1, Rr = [];
for (let a = 0; a < Pr; a++) Rr.push({ a: uc, b: a, kind: "core", seed: qt(a + 40) });
for (let a = 0; a < Pr; a++) Rr.push({ a, b: (a + 1) % Pr, kind: "bee", seed: qt(a + 60) });
for (const [a, u] of [[0, 3], [2, 5], [4, 6]]) Rr.push({ a, b: u, kind: "bee", seed: qt(a * 7 + u) });
for (const [a, u] of [[1, 0], [3, 7], [5, 10]]) Rr.push({ a, b: u, kind: "shell", seed: qt(a + u * 3) });
const Pd = [
  { r: 1.34, tiltX: 1.12, tiltZ: 0.38, precess: 0.21, phase: 0, width: 0.024, ticks: 36 },
  { r: 1.5, tiltX: 1.38, tiltZ: -0.62, precess: -0.15, phase: Math.PI / 2, width: 0.016, ticks: 0 }
], ba = ([a, u, s], E) => {
  const N = Math.cos(E), C = Math.sin(E);
  return [a, u * N - s * C, u * C + s * N];
}, ec = ([a, u, s], E) => {
  const N = Math.cos(E), C = Math.sin(E);
  return [a * N + s * C, u, -a * C + s * N];
}, tc = ([a, u, s], E) => {
  const N = Math.cos(E), C = Math.sin(E);
  return [a * N - u * C, a * C + u * N, s];
}, Rd = {
  dark: {
    edge: [244, 214, 140],
    edgeBack: [176, 132, 62],
    face: [226, 178, 88],
    thread: [238, 206, 140],
    spark: [255, 236, 180],
    ringHi: [246, 216, 132],
    ringLo: [128, 92, 38],
    glow: [232, 166, 58],
    bee: [[232, 184, 82], [246, 212, 128], [196, 146, 58]],
    stripe: [46, 30, 18],
    head: [52, 34, 20],
    wing: [255, 242, 214],
    core: [255, 222, 140]
  },
  light: {
    edge: [112, 74, 20],
    edgeBack: [168, 130, 76],
    face: [176, 128, 44],
    thread: [104, 70, 36],
    spark: [204, 136, 26],
    ringHi: [176, 122, 30],
    ringLo: [138, 104, 60],
    glow: [222, 170, 80],
    bee: [[214, 160, 60], [236, 192, 102], [176, 124, 40]],
    stripe: [52, 34, 20],
    head: [58, 38, 22],
    wing: [255, 248, 230],
    core: [214, 156, 50]
  }
}, ye = (a, u) => `rgba(${a[0]},${a[1]},${a[2]},${Math.max(0, Math.min(1, u))})`, Bl = {
  idle: { spin: 0.16, bees: 1, rings: 1, sparks: 0.3, glow: 0.45, gather: 0 },
  listening: { spin: 0.1, bees: 0.7, rings: 0.6, sparks: 0.2, glow: 0.6, gather: 0.3 },
  thinking: { spin: 0.55, bees: 1.9, rings: 3.2, sparks: 1, glow: 0.8, gather: 0.1 },
  speaking: { spin: 0.22, bees: 1.2, rings: 1.4, sparks: 0.55, glow: 0.55, gather: 0 }
};
class Md {
  constructor(u, s = {}) {
    Ue(this, "ctx");
    Ue(this, "opts");
    Ue(this, "raf", 0);
    Ue(this, "last", 0);
    Ue(this, "t", 0);
    Ue(this, "acc", { spin: 0.6, bees: 3, rings: 1.2, sparks: 0 });
    Ue(this, "cur", { ...Bl.idle });
    Ue(this, "ro");
    Ue(this, "heading", new Array(Pr).fill(0));
    Ue(this, "w", 0);
    Ue(this, "h", 0);
    Ue(this, "dpr", 1);
    this.canvas = u, this.ctx = u.getContext("2d"), this.opts = { state: "idle", tone: "dark", still: !1, ...s }, this.cur = { ...Bl[this.opts.state] }, this.resize(), typeof ResizeObserver < "u" && (this.ro = new ResizeObserver(() => {
      this.resize(), this.opts.still && this.frame(0);
    }), this.ro.observe(u)), this.opts.still ? this.frame(0) : this.loop();
  }
  set(u) {
    const s = this.opts.still;
    this.opts = { ...this.opts, ...u }, this.opts.still ? (cancelAnimationFrame(this.raf), this.raf = 0, this.cur = { ...Bl[this.opts.state] }, this.frame(0)) : (s || !this.raf) && this.loop();
  }
  destroy() {
    var u;
    cancelAnimationFrame(this.raf), this.raf = 0, (u = this.ro) == null || u.disconnect();
  }
  resize() {
    this.dpr = Math.min(2, typeof devicePixelRatio == "number" && devicePixelRatio || 1);
    const u = this.canvas.getBoundingClientRect();
    this.w = Math.max(1, Math.round((u.width || this.canvas.width) * this.dpr)), this.h = Math.max(1, Math.round((u.height || this.canvas.height) * this.dpr)), this.canvas.width !== this.w && (this.canvas.width = this.w), this.canvas.height !== this.h && (this.canvas.height = this.h);
  }
  loop() {
    this.last = performance.now();
    const u = (s) => {
      const E = Math.min(0.05, (s - this.last) / 1e3);
      this.last = s, this.frame(E), this.raf = requestAnimationFrame(u);
    };
    this.raf = requestAnimationFrame(u);
  }
  frame(u) {
    const s = Bl[this.opts.state], E = Math.min(1, u * 2.5);
    for (const N of Object.keys(s)) this.cur[N] += (s[N] - this.cur[N]) * E;
    this.t += u, this.acc.spin += this.cur.spin * u, this.acc.bees += this.cur.bees * u, this.acc.rings += this.cur.rings * u, this.acc.sparks += (0.25 + this.cur.sparks * 0.9) * u, this.draw();
  }
  level() {
    const u = this.opts.state;
    if (u !== "listening" && u !== "speaking") return 0;
    const s = typeof this.opts.level == "function" ? this.opts.level() : this.opts.level;
    if (typeof s == "number") return Math.max(0, Math.min(1, s));
    const E = this.t;
    return u === "speaking" ? 0.5 + 0.5 * Math.sin(E * 9) * Math.sin(E * 2.3) : 0.3 + 0.2 * Math.sin(E * 3);
  }
  draw() {
    const { ctx: u, w: s, h: E } = this, N = Rd[this.opts.tone], C = s / 2, z = E / 2, P = Math.min(s, E) / 2 / 1.86, v = 5, S = this.level(), H = this.acc.spin, V = 0.38 + 0.12 * Math.sin(this.t * 0.31), M = 0.08 * Math.sin(this.t * 0.23), $ = (x) => ba(tc(ec(x, H), M), V), W = (x) => {
      const k = v / (v - x[2]);
      return { x: C + x[0] * P * k, y: z - x[1] * P * k, z: x[2], s: k };
    }, Y = (x) => (x + 1) / 2;
    u.clearRect(0, 0, s, E);
    const q = this.cur.glow + S * 0.5, pe = u.createRadialGradient(C, z, 0, C, z, P * 1.6);
    pe.addColorStop(0, ye(N.glow, 0.26 * q)), pe.addColorStop(0.45, ye(N.glow, 0.1 * q)), pe.addColorStop(1, ye(N.glow, 0)), u.fillStyle = pe, u.fillRect(0, 0, s, E);
    const Le = [], Te = [], me = [];
    Pd.forEach((x, k) => {
      const d = x.phase + this.acc.rings * x.precess, w = (Z, oe = x.r) => ec(tc(ba([Math.cos(Z) * oe, 0, Math.sin(Z) * oe], x.tiltX), x.tiltZ), d), D = 96, G = [];
      let te = W(w(0));
      for (let Z = 1; Z <= D; Z++) {
        const oe = w(Z / D * it), Ne = W(oe);
        G.push({ a: te, b: Ne, z: (te.z + Ne.z) / 2, wd: x.width }), te = Ne;
      }
      Le.push(G);
      const b = [], se = this.acc.rings * 0.35 * (k ? -1 : 1);
      for (let Z = 0; Z < x.ticks; Z++) {
        const oe = Z / x.ticks * it + se, Ne = Z % 3 === 0 ? 0.07 : 0.035, dt = W(w(oe, x.r - Ne)), Un = W(w(oe, x.r + Ne));
        b.push({ a: dt, b: Un, z: (dt.z + Un.z) / 2 });
      }
      if (Te.push(b), k === 0) for (const Z of [0, Math.PI]) me.push(W(w(se * 1.6 + Z)));
      else me.push(W(w(-se * 1.2 + 1)));
    });
    const Pe = (x) => {
      u.lineCap = "round", Le.forEach((k) => {
        for (const d of k) {
          if (d.z >= 0 !== x) continue;
          const w = Y(d.z);
          u.strokeStyle = `rgb(${N.ringLo.map((D, G) => Math.round(D + (N.ringHi[G] - D) * w)).join(",")})`, u.globalAlpha = x ? 1 : 0.55, u.lineWidth = Math.max(this.dpr * 1.2, P * d.wd * d.a.s), u.beginPath(), u.moveTo(d.a.x, d.a.y), u.lineTo(d.b.x, d.b.y), u.stroke();
        }
      }), u.lineWidth = P * 8e-3;
      for (const k of Te) for (const d of k)
        d.z >= 0 === x && (u.strokeStyle = ye(N.ringHi, (x ? 0.9 : 0.35) * (0.4 + 0.6 * Y(d.z))), u.beginPath(), u.moveTo(d.a.x, d.a.y), u.lineTo(d.b.x, d.b.y), u.stroke());
      for (const k of me) {
        if (k.z >= 0 !== x) continue;
        u.globalAlpha = x ? 1 : 0.5;
        const d = P * 0.034 * k.s, w = u.createRadialGradient(k.x - d * 0.3, k.y - d * 0.3, d * 0.1, k.x, k.y, d);
        w.addColorStop(0, ye(N.spark, 1)), w.addColorStop(1, ye(N.ringLo, 1)), u.fillStyle = w, u.beginPath(), u.arc(k.x, k.y, d, 0, it), u.fill();
      }
      u.globalAlpha = 1;
    };
    Pe(!1);
    const fe = Ko.map($), ue = fe.map(W), O = (x) => {
      for (const [k, d] of Xo) {
        const w = (fe[k][2] + fe[d][2]) / 2;
        w >= -0.05 === x && (u.strokeStyle = x ? ye(N.edge, 0.55 + 0.45 * Y(w)) : ye(N.edgeBack, this.opts.tone === "light" ? 0.45 : 0.32), u.lineWidth = Math.max(this.dpr * (x ? 1 : 0.6), P * (x ? 0.013 : 8e-3)), u.beginPath(), u.moveTo(ue[k].x, ue[k].y), u.lineTo(ue[d].x, ue[d].y), u.stroke());
      }
    };
    O(!1);
    const le = 1 - this.cur.gather, X = qa.map((x) => {
      const k = (D) => [x.a[0] * Math.sin(x.w[0] * D + x.p[0]) * le, x.a[1] * Math.sin(x.w[1] * D + x.p[1]) * le, x.a[2] * Math.cos(x.w[2] * D + x.p[2]) * le], d = $(k(this.acc.bees)), w = W($(k(this.acc.bees + 0.05)));
      return { v: d, p: W(d), next: w };
    }), ie = W([0, 0, 0]), re = (x, k, d) => d === "a" && x === uc ? ie : k === "shell" && d === "b" ? ue[x] : X[x].p, xe = Rr.map((x) => ({ l: x, A: re(x.a, x.kind, "a"), B: re(x.b, x.kind, "b") })), Ge = (x, k) => {
      const d = Math.hypot(k.x - x.x, k.y - x.y);
      return { mx: (x.x + k.x) / 2, my: (x.y + k.y) / 2 + d * 0.12 };
    };
    u.lineCap = "round";
    for (const { l: x, A: k, B: d } of xe) {
      const { mx: w, my: D } = Ge(k, d), G = (k.z + d.z) / 2;
      u.strokeStyle = ye(N.thread, (x.kind === "core" ? 0.6 : x.kind === "shell" ? 0.35 : 0.5) * (0.5 + 0.5 * Y(G))), u.lineWidth = Math.max(this.dpr * 0.6, P * (x.kind === "core" ? 9e-3 : 65e-4)), u.beginPath(), u.moveTo(k.x, k.y), u.quadraticCurveTo(w, D, d.x, d.y), u.stroke();
    }
    for (const { l: x, A: k, B: d } of xe) {
      if (x.kind === "shell") continue;
      const w = this.cur.sparks;
      if (x.seed > w + 0.15) continue;
      const D = (this.acc.sparks * (0.6 + x.seed) + x.seed * 7) % 1, { mx: G, my: te } = Ge(k, d), b = 1 - D, se = b * b * k.x + 2 * b * D * G + D * D * d.x, Z = b * b * k.y + 2 * b * D * te + D * D * d.y, oe = P * 0.018 * (0.6 + w * 0.6), Ne = Math.sin(D * Math.PI), dt = u.createRadialGradient(se, Z, 0, se, Z, oe * 2.4);
      dt.addColorStop(0, ye(N.spark, 0.95 * Ne)), dt.addColorStop(1, ye(N.spark, 0)), u.fillStyle = dt, u.beginPath(), u.arc(se, Z, oe * 2.4, 0, it), u.fill();
    }
    const Ye = P * (0.085 + 0.035 * S + 0.01 * Math.sin(this.t * 2)), Ie = u.createRadialGradient(ie.x, ie.y, 0, ie.x, ie.y, Ye * 3.2);
    Ie.addColorStop(0, ye(N.core, 0.55 * q)), Ie.addColorStop(1, ye(N.core, 0)), u.fillStyle = Ie, u.beginPath(), u.arc(ie.x, ie.y, Ye * 3.2, 0, it), u.fill(), this.hex(ie.x, ie.y, Ye, this.acc.spin * 0.5, N);
    const we = X.map((x, k) => k).sort((x, k) => X[x].v[2] - X[k].v[2]);
    for (const x of we) {
      const k = X[x];
      let w = Math.atan2(k.next.y - k.p.y, k.next.x - k.p.x) - this.heading[x];
      w = ((w + Math.PI) % it + it) % it - Math.PI, this.heading[x] += this.opts.still ? w : w * 0.15;
      const D = 0.35 + 0.65 * Math.abs(Math.sin(this.t * 26 + qa[x].flap));
      this.bee(k.p.x, k.p.y, P * 0.15 * k.p.s, this.heading[x], D, 0.55 + 0.45 * Y(k.v[2]), N);
    }
    const L = [-0.4, 0.6, 0.7];
    for (const [x, k, d] of sc) {
      const w = fe[x], D = fe[k], G = fe[d], te = [(w[0] + D[0] + G[0]) / 3, (w[1] + D[1] + G[1]) / 3, (w[2] + D[2] + G[2]) / 3];
      if (te[2] <= 0) continue;
      const b = Math.max(0, (te[0] * L[0] + te[1] * L[1] + te[2] * L[2]) / Math.hypot(...te));
      u.fillStyle = ye(N.face, 0.03 + 0.07 * b * b), u.beginPath(), u.moveTo(ue[x].x, ue[x].y), u.lineTo(ue[k].x, ue[k].y), u.lineTo(ue[d].x, ue[d].y), u.closePath(), u.fill();
    }
    O(!0);
    for (let x = 0; x < 12; x++)
      fe[x][2] < -0.05 || (u.fillStyle = ye(N.edge, 0.6 + 0.4 * Y(fe[x][2])), u.beginPath(), u.arc(ue[x].x, ue[x].y, P * 0.02 * ue[x].s, 0, it), u.fill());
    Pe(!0);
  }
  hex(u, s, E, N, C) {
    const { ctx: z } = this, P = Array.from({ length: 6 }, (v, S) => [u + E * Math.cos(N + S * it / 6), s + E * Math.sin(N + S * it / 6)]);
    for (let v = 0; v < 6; v++) {
      const [S, H] = P[v], [V, M] = P[(v + 1) % 6];
      z.fillStyle = ye(C.bee[v % 3], 1), z.beginPath(), z.moveTo(u, s), z.lineTo(S, H), z.lineTo(V, M), z.closePath(), z.fill();
    }
    z.strokeStyle = ye(C.spark, 0.9), z.lineWidth = E * 0.12, z.beginPath(), P.forEach(([v, S], H) => H ? z.lineTo(v, S) : z.moveTo(v, S)), z.closePath(), z.stroke();
  }
  /** One low-poly bee seen from above, facing +x in its own space. */
  bee(u, s, E, N, C, z, P) {
    const { ctx: v } = this;
    v.save(), v.translate(u, s), v.rotate(N), v.scale(E, E), v.globalAlpha = z;
    const S = (M) => {
      v.beginPath(), M.forEach(([$, W], Y) => Y ? v.lineTo($, W) : v.moveTo($, W)), v.closePath();
    };
    v.fillStyle = ye(P.head, 1), S([[-1.02, -0.08], [-1.28, 0], [-1.02, 0.08]]), v.fill();
    const H = [[-1.05, 0], [-0.78, -0.4], [-0.2, -0.5], [0.28, -0.36], [0.46, 0], [0.28, 0.36], [-0.2, 0.5], [-0.78, 0.4]], V = [-0.3, 0];
    for (let M = 0; M < H.length; M++)
      v.fillStyle = ye(P.bee[M % 3], 1), S([V, H[M], H[(M + 1) % H.length]]), v.fill();
    v.save(), S(H), v.clip(), v.fillStyle = ye(P.stripe, 0.92), S([[-0.26, -0.6], [-0.44, -0.6], [-0.5, 0.6], [-0.32, 0.6]]), v.fill(), S([[-0.64, -0.6], [-0.8, -0.6], [-0.86, 0.6], [-0.7, 0.6]]), v.fill(), v.restore(), v.fillStyle = ye(P.head, 1), S([[0.42, 0], [0.58, -0.27], [0.86, -0.2], [0.95, 0], [0.86, 0.2], [0.58, 0.27]]), v.fill(), v.fillStyle = ye(P.bee[1], 0.9), S([[0.7, -0.2], [0.84, -0.14], [0.74, -0.08]]), v.fill(), S([[0.7, 0.2], [0.84, 0.14], [0.74, 0.08]]), v.fill(), v.strokeStyle = ye(P.head, 1), v.lineWidth = 0.06, v.lineCap = "round", v.beginPath(), v.moveTo(0.9, -0.1), v.lineTo(1.08, -0.2), v.lineTo(1.2, -0.4), v.moveTo(0.9, 0.1), v.lineTo(1.08, 0.2), v.lineTo(1.2, 0.4), v.stroke();
    for (const M of [-1, 1]) {
      const $ = M * C, W = [[0.22, 0.16 * M], [0.05, 1.08 * $], [-0.5, 0.92 * $], [-0.22, 0.24 * M]];
      v.fillStyle = ye(P.wing, 0.38), S(W), v.fill(), v.strokeStyle = ye(P.bee[1], 0.85), v.lineWidth = 0.04, v.stroke(), v.beginPath(), v.moveTo(0.05, 0.2 * M), v.lineTo(-0.22, 0.95 * $), v.stroke();
    }
    v.restore();
  }
}
const nc = () => typeof matchMedia == "function" && matchMedia("(prefers-reduced-motion: reduce)").matches;
function ac({ size: a = 160, state: u = "idle", level: s, tone: E = "dark", still: N, className: C }) {
  const z = ee.useRef(null), P = ee.useRef();
  return ee.useEffect(() => (P.current = new Md(z.current, { state: u, level: s, tone: E, still: N ?? nc() }), () => {
    var v;
    return (v = P.current) == null ? void 0 : v.destroy();
  }), []), ee.useEffect(() => {
    var v;
    (v = P.current) == null || v.set({ state: u, level: s, tone: E, still: N ?? nc() });
  }, [u, s, E, N]), /* @__PURE__ */ c.jsx("canvas", { ref: z, className: C, style: { width: a, height: a, display: "block" }, role: "img", "aria-label": `FAITH (${u})` });
}
const Ld = { today: "mdi:calendar-today", meals: "mdi:silverware-fork-knife", shopping: "mdi:cart-outline", chores: "mdi:broom", home: "mdi:home-outline", approvals: "mdi:shield-check-outline" }, Id = (a) => a.split(/\s+/).map((u) => u[0]).join("").slice(0, 2).toUpperCase(), $n = ({ p: a, size: u = 40, ring: s }) => {
  const E = /* @__PURE__ */ c.jsx("span", { className: "avatar", style: { width: u, height: u, fontSize: u * 0.36, background: a.color || "var(--fc-accent)" }, children: Id(a.name) });
  return s ? /* @__PURE__ */ c.jsx("span", { className: "hexring", children: E }) : E;
};
function zr(a) {
  if (!a) return "";
  if (/^\d{2}:\d{2}$/.test(a)) {
    const [u, s] = a.split(":").map(Number);
    return new Date(2e3, 0, 1, u, s).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
  }
  if (/^\d{4}-\d{2}-\d{2}$/.test(a)) {
    const u = /* @__PURE__ */ new Date(`${a}T12:00:00`), s = Math.round((new Date(u.toDateString()).getTime() - new Date((/* @__PURE__ */ new Date()).toDateString()).getTime()) / 864e5);
    return s === 0 ? "Today" : s === 1 ? "Tomorrow" : u.toLocaleDateString([], { weekday: "short", day: "numeric" });
  }
  return a;
}
function cc({ text: a }) {
  const u = (C) => C.split(/(\*\*[^*]+\*\*|__[^_]+__|\*[^*\s][^*]*\*|`[^`]+`)/g).map((z, P) => /^(\*\*|__).+\1$/.test(z) ? /* @__PURE__ */ c.jsx("b", { children: z.slice(2, -2) }, P) : /^\*.+\*$/.test(z) ? /* @__PURE__ */ c.jsx("i", { children: z.slice(1, -1) }, P) : /^`.+`$/.test(z) ? /* @__PURE__ */ c.jsx("code", { children: z.slice(1, -1) }, P) : z), s = [];
  let E = [];
  const N = () => {
    E.length && s.push(/* @__PURE__ */ c.jsx("ul", { className: "md-list", children: E }, `l${s.length}`)), E = [];
  };
  return a.split(`
`).forEach((C, z) => {
    const P = C.replace(/^#{1,6}\s+/, ""), v = P.match(/^\s*(?:[-*•]|\d+[.)])\s+(.*)$/);
    if (v) {
      E.push(/* @__PURE__ */ c.jsx("li", { children: u(v[1]) }, z));
      return;
    }
    N(), s.push(/* @__PURE__ */ c.jsxs("span", { className: "md-line", children: [
      u(P),
      `
`
    ] }, z));
  }), N(), /* @__PURE__ */ c.jsx(c.Fragment, { children: s });
}
const Dd = (a, u = /* @__PURE__ */ new Date()) => {
  if (!a || !/^\d{2}:\d{2}$/.test(a)) return !0;
  const [s, E] = a.split(":").map(Number);
  return s * 60 + E >= u.getHours() * 60 + u.getMinutes();
};
function Vl(a, u, s = {}, E = 6e4) {
  const [N, C] = ee.useState(null), [z, P] = ee.useState(""), v = ee.useCallback(() => a.call(u, s).then((S) => {
    C(S), P("");
  }).catch((S) => P(S.message)), [a, u, JSON.stringify(s)]);
  return ee.useEffect(() => {
    v();
    const S = setInterval(v, E), H = (V) => {
      var $;
      const M = ($ = V.detail) == null ? void 0 : $.screen;
      (!M || M === a.screen) && v();
    };
    return window.addEventListener("faith-hub-changed", H), () => {
      clearInterval(S), window.removeEventListener("faith-hub-changed", H);
    };
  }, [v, E]), { data: N, err: z, load: v };
}
function Fd({ api: a, items: u, can: s, onDone: E }) {
  const [N, C] = ee.useState(""), z = (P, v) => a.call(`/api/ha/approvals/${P}`, { approve: v }).then((S) => {
    C(S.text), E();
  }).catch((S) => C(S.message));
  return /* @__PURE__ */ c.jsxs(c.Fragment, { children: [
    /* @__PURE__ */ c.jsx("ul", { children: u.map((P) => /* @__PURE__ */ c.jsxs("li", { className: "row", children: [
      /* @__PURE__ */ c.jsxs("div", { className: "grow", children: [
        /* @__PURE__ */ c.jsx("div", { children: P.summary }),
        /* @__PURE__ */ c.jsxs("div", { className: "meta", children: [
          "Asked by ",
          P.requested_by.replace(/^household on /, "the ")
        ] })
      ] }),
      s && /* @__PURE__ */ c.jsxs("div", { className: "btns", children: [
        /* @__PURE__ */ c.jsx("button", { className: "primary", "aria-label": `Approve: ${P.summary}`, onClick: () => z(P.id, !0), children: "Approve" }),
        /* @__PURE__ */ c.jsx("button", { "aria-label": `Deny: ${P.summary}`, onClick: () => z(P.id, !1), children: "Deny" })
      ] })
    ] }, P.id)) }),
    !s && /* @__PURE__ */ c.jsx("div", { className: "meta", children: "A grown-up approves these (signed in here, or on their phone)." }),
    /* @__PURE__ */ c.jsx("div", { className: "toast", role: "status", children: N })
  ] });
}
function Od({ c: a, api: u, can: s, reload: E }) {
  var P;
  const N = a.items ?? [];
  let C;
  a.error ? C = /* @__PURE__ */ c.jsx("div", { className: "err", children: a.error }) : a.empty ? C = /* @__PURE__ */ c.jsx("div", { className: "empty", children: a.empty }) : a.kind === "schedule" ? C = /* @__PURE__ */ c.jsx("ul", { children: N.map((v, S) => /* @__PURE__ */ c.jsxs("li", { className: "row", children: [
    /* @__PURE__ */ c.jsx("span", { className: "time", children: zr(v.time) }),
    /* @__PURE__ */ c.jsxs("div", { className: "grow", children: [
      /* @__PURE__ */ c.jsx("div", { children: v.title }),
      v.meta && /* @__PURE__ */ c.jsx("div", { className: "meta", children: v.meta })
    ] })
  ] }, S)) }) : a.kind === "meals" ? C = /* @__PURE__ */ c.jsx("ul", { children: N.map((v, S) => /* @__PURE__ */ c.jsxs("li", { className: "row", children: [
    /* @__PURE__ */ c.jsxs("span", { className: "label grow", children: [
      v.label,
      v.time && zr(v.time) !== "Today" ? ` · ${zr(v.time)}` : ""
    ] }),
    /* @__PURE__ */ c.jsx("span", { children: v.title })
  ] }, S)) }) : a.kind === "checklist" || a.kind === "list" ? C = /* @__PURE__ */ c.jsx("ul", { children: N.map((v, S) => /* @__PURE__ */ c.jsxs("li", { className: "row", children: [
    a.kind === "checklist" && /* @__PURE__ */ c.jsx("span", { className: `check ${v.done ? "done" : ""}` }),
    /* @__PURE__ */ c.jsxs("span", { className: "grow", children: [
      v.label && /* @__PURE__ */ c.jsxs("span", { className: "label", children: [
        v.label,
        " "
      ] }),
      v.title
    ] }),
    (v.meta || v.time) && /* @__PURE__ */ c.jsx("span", { className: "meta", children: v.meta || zr(v.time) })
  ] }, S)) }) : a.kind === "entities" ? C = /* @__PURE__ */ c.jsx("div", { className: "tiles", children: (a.entities ?? []).map((v) => /* @__PURE__ */ c.jsxs("div", { className: "tile", children: [
    /* @__PURE__ */ c.jsx("div", { className: "meta", children: v.name }),
    /* @__PURE__ */ c.jsx("div", { className: "v", children: v.state })
  ] }, v.entity_id)) }) : a.kind === "approvals" ? C = /* @__PURE__ */ c.jsx(Fd, { api: u, items: a.approvals ?? [], can: s, onDone: E }) : C = /* @__PURE__ */ c.jsx("div", { style: { whiteSpace: "pre-wrap" }, children: a.text });
  const z = a.kind === "checklist" ? N.length : a.kind === "approvals" ? (P = a.approvals) == null ? void 0 : P.length : void 0;
  return /* @__PURE__ */ c.jsxs("div", { className: "section", children: [
    /* @__PURE__ */ c.jsxs("h3", { children: [
      /* @__PURE__ */ c.jsx("ha-icon", { icon: Ld[a.id] || "mdi:note-text-outline" }),
      a.title,
      z ? /* @__PURE__ */ c.jsx("span", { className: "count", children: z }) : null
    ] }),
    C
  ] });
}
function Ad({ api: a, layout: u, onDone: s }) {
  const E = u.available, [N, C] = ee.useState([...u.order, ...E.map(($) => $.id).filter(($) => !u.order.includes($))]), [z, P] = ee.useState(u.hidden), [v, S] = ee.useState(""), H = ($) => {
    var W;
    return ((W = E.find((Y) => Y.id === $)) == null ? void 0 : W.title) ?? $;
  }, V = ($, W) => C((Y) => {
    const q = [...Y], pe = $ + W;
    return pe < 0 || pe >= q.length ? Y : ([q[$], q[pe]] = [q[pe], q[$]], q);
  }), M = ($) => a.call("/api/ha/prefs/cards", $).then(s).catch((W) => S(W.message));
  return /* @__PURE__ */ c.jsxs("div", { className: "section", children: [
    /* @__PURE__ */ c.jsx("h3", { children: "Arrange your card" }),
    /* @__PURE__ */ c.jsx("ul", { "aria-label": "Sections, in order", children: N.map(($, W) => /* @__PURE__ */ c.jsxs("li", { className: "row", children: [
      /* @__PURE__ */ c.jsxs("label", { className: "grow", style: { display: "flex", gap: 8, alignItems: "center" }, children: [
        /* @__PURE__ */ c.jsx("input", { type: "checkbox", checked: !z.includes($), onChange: (Y) => P((q) => Y.target.checked ? q.filter((pe) => pe !== $) : [...q, $]) }),
        "Show ",
        H($)
      ] }),
      /* @__PURE__ */ c.jsx("button", { className: "ghost", "aria-label": `Move ${H($)} up`, disabled: W === 0, onClick: () => V(W, -1), children: "↑" }),
      /* @__PURE__ */ c.jsx("button", { className: "ghost", "aria-label": `Move ${H($)} down`, disabled: W === N.length - 1, onClick: () => V(W, 1), children: "↓" })
    ] }, $)) }),
    /* @__PURE__ */ c.jsxs("div", { className: "btns", style: { marginTop: 10 }, children: [
      /* @__PURE__ */ c.jsx("button", { className: "primary", onClick: () => M({ order: N, hidden: z }), children: "Save" }),
      /* @__PURE__ */ c.jsx("button", { onClick: s, children: "Cancel" }),
      u.saved && /* @__PURE__ */ c.jsx("button", { className: "ghost", onClick: () => M({ reset: !0 }), children: "Back to the default" })
    ] }),
    /* @__PURE__ */ c.jsx("div", { className: "err", role: "alert", children: v })
  ] });
}
function $d({ api: a, config: u }) {
  var v;
  const { data: s, err: E, load: N } = Vl(a, "/api/ha/view", u.cards ? { cards: u.cards } : {}), [C, z] = ee.useState(!1);
  if (E) return /* @__PURE__ */ c.jsx("ha-card", { children: /* @__PURE__ */ c.jsx("div", { className: "err", children: E }) });
  if (!s) return /* @__PURE__ */ c.jsx("ha-card", { children: /* @__PURE__ */ c.jsx("div", { className: "empty", children: "Loading…" }) });
  const P = s.person ? `${s.person.name}'s` : "The family's";
  return C && s.layout ? /* @__PURE__ */ c.jsx("ha-card", { children: /* @__PURE__ */ c.jsx(Ad, { api: a, layout: s.layout, onDone: () => {
    z(!1), N();
  } }) }) : /* @__PURE__ */ c.jsxs("ha-card", { children: [
    u.title !== "" && /* @__PURE__ */ c.jsxs(c.Fragment, { children: [
      /* @__PURE__ */ c.jsxs("div", { className: "head", style: { marginBottom: 0 }, children: [
        /* @__PURE__ */ c.jsx("div", { className: "eyebrow", children: (/* @__PURE__ */ new Date()).toLocaleDateString([], { weekday: "long", month: "long", day: "numeric" }) }),
        ((v = s.layout) == null ? void 0 : v.can_arrange) && /* @__PURE__ */ c.jsx("div", { className: "right", children: /* @__PURE__ */ c.jsx("button", { className: "ghost", onClick: () => z(!0), children: "Arrange" }) })
      ] }),
      /* @__PURE__ */ c.jsx("div", { className: "hello", children: u.title ?? /* @__PURE__ */ c.jsxs(c.Fragment, { children: [
        P,
        " ",
        /* @__PURE__ */ c.jsx("em", { children: "day" }),
        ", at a glance."
      ] }) })
    ] }),
    u.show_apps !== !1 && s.apps.length > 0 && /* @__PURE__ */ c.jsx("div", { className: "section", children: /* @__PURE__ */ c.jsx("div", { className: "apps", children: s.apps.map((S) => /* @__PURE__ */ c.jsxs("a", { href: S.url, target: "_blank", rel: "noreferrer", children: [
      /* @__PURE__ */ c.jsx("span", { children: S.icon || "↗" }),
      S.name
    ] }, S.id)) }) }),
    s.cards.map((S) => /* @__PURE__ */ c.jsx(Od, { c: S, api: a, can: s.can_approve, reload: N }, S.id)),
    !s.cards.length && /* @__PURE__ */ c.jsx("div", { className: "empty", children: "Nothing to show yet." })
  ] });
}
const fc = (a) => a.call("/api/ha/hub/people");
function dc({ api: a, people: u, pick: s, onBack: E, onDone: N }) {
  const [C, z] = ee.useState(""), [P, v] = ee.useState(""), S = async (V) => {
    v("");
    try {
      const M = await a.call("/api/ha/hub/signin", V);
      Yo(a.screen, M.hub_session), N();
    } catch (M) {
      v(M.message), z("");
    }
  }, H = (V) => z((M) => (M + V).slice(0, 8));
  return ee.useEffect(() => {
    const V = (M) => {
      const $ = M.composedPath()[0];
      if (!($ && /^(INPUT|TEXTAREA|SELECT)$/.test($.tagName))) {
        if (/^[0-9]$/.test(M.key)) H(M.key);
        else if (M.key === "Backspace") z((W) => W.slice(0, -1));
        else if (M.key === "Enter")
          C.length >= 4 && S({ person: s.id, pin: C });
        else if (M.key === "Escape") E();
        else return;
        M.preventDefault();
      }
    };
    return window.addEventListener("keydown", V), () => window.removeEventListener("keydown", V);
  }, [C, s.id]), /* @__PURE__ */ c.jsxs("div", { className: "pin", role: "group", "aria-label": `PIN for ${s.name}`, children: [
    /* @__PURE__ */ c.jsxs("div", { className: "head", style: { margin: 0 }, children: [
      /* @__PURE__ */ c.jsx($n, { p: s, size: 44 }),
      /* @__PURE__ */ c.jsxs("h2", { children: [
        "Hi, ",
        s.name
      ] }),
      /* @__PURE__ */ c.jsx("button", { className: "ghost", style: { marginLeft: "auto" }, onClick: E, children: "Back" })
    ] }),
    (u == null ? void 0 : u.face_unlock) && u.suggested === s.id && /* @__PURE__ */ c.jsx("button", { className: "primary", onClick: () => S({ person: s.id, face: !0 }), children: "It's me (camera)" }),
    /* @__PURE__ */ c.jsx("div", { className: "dots", role: "status", "aria-label": `${C.length} digit${C.length === 1 ? "" : "s"} entered`, children: Array.from({ length: Math.max(4, C.length) }, (V, M) => /* @__PURE__ */ c.jsx("span", { className: M < C.length ? "on" : "" }, M)) }),
    /* @__PURE__ */ c.jsxs("div", { className: "keys", children: [
      ["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((V) => /* @__PURE__ */ c.jsx("button", { onClick: () => H(V), children: V }, V)),
      /* @__PURE__ */ c.jsx("button", { onClick: () => z(C.slice(0, -1)), "aria-label": "Delete", children: "⌫" }),
      /* @__PURE__ */ c.jsx("button", { onClick: () => H("0"), children: "0" }),
      /* @__PURE__ */ c.jsx("button", { className: "primary", disabled: C.length < 4, onClick: () => S({ person: s.id, pin: C }), children: "OK" })
    ] }),
    /* @__PURE__ */ c.jsx("div", { className: "err", role: "alert", children: P })
  ] });
}
function pc(a, u) {
  var E;
  const s = ee.useRef(0);
  ee.useEffect(() => {
    if (!(u != null && u.hub)) return;
    const N = () => {
      Date.now() - s.current > 15e3 && (s.current = Date.now(), a.call("/api/ha/hub/activity").catch(() => {
      }));
    };
    return window.addEventListener("pointerdown", N, !0), () => window.removeEventListener("pointerdown", N, !0);
  }, [(E = u == null ? void 0 : u.hub) == null ? void 0 : E.person.id]), ee.useEffect(() => {
    u && !u.hub && u.household && a.screen && oc(a.screen) && Yo(a.screen, null);
  }, [u]);
}
const hc = async (a) => {
  await a.call("/api/ha/hub/signout").catch(() => {
  }), Yo(a.screen, null);
};
function Ud({ api: a }) {
  const { data: u, err: s } = Vl(a, "/api/ha/view", { cards: [] }, 1e4), [E, N] = ee.useState(null), [C, z] = ee.useState(null), [P, v] = ee.useState("");
  return pc(a, u), a.screen ? s ? /* @__PURE__ */ c.jsx("ha-card", { children: /* @__PURE__ */ c.jsx("div", { className: "err", children: s }) }) : u ? u.hub ? /* @__PURE__ */ c.jsx("ha-card", { children: /* @__PURE__ */ c.jsxs("div", { className: "head", children: [
    /* @__PURE__ */ c.jsx($n, { p: u.hub.person, size: 44 }),
    /* @__PURE__ */ c.jsxs("div", { children: [
      /* @__PURE__ */ c.jsx("h2", { children: u.hub.person.name }),
      /* @__PURE__ */ c.jsxs("div", { className: "sub", children: [
        "Signed in on this screen",
        u.hub.remaining_seconds < 60 ? ` · signing out in ${u.hub.remaining_seconds}s` : ""
      ] })
    ] }),
    /* @__PURE__ */ c.jsx("div", { className: "right", children: /* @__PURE__ */ c.jsx("button", { onClick: () => hc(a), children: "Sign out" }) })
  ] }) }) : u.person ? /* @__PURE__ */ c.jsx("ha-card", { children: /* @__PURE__ */ c.jsxs("div", { className: "head", children: [
    /* @__PURE__ */ c.jsx($n, { p: u.person, size: 44 }),
    /* @__PURE__ */ c.jsxs("div", { children: [
      /* @__PURE__ */ c.jsx("h2", { children: u.person.name }),
      /* @__PURE__ */ c.jsx("div", { className: "sub", children: "Your own Home Assistant account" })
    ] })
  ] }) }) : C ? /* @__PURE__ */ c.jsx("ha-card", { children: /* @__PURE__ */ c.jsx(dc, { api: a, people: E, pick: C, onBack: () => z(null), onDone: () => {
    z(null), N(null);
  } }) }) : E ? /* @__PURE__ */ c.jsxs("ha-card", { children: [
    /* @__PURE__ */ c.jsxs("div", { className: "head", children: [
      /* @__PURE__ */ c.jsx("h2", { children: "Who's here?" }),
      /* @__PURE__ */ c.jsx("div", { className: "right", children: /* @__PURE__ */ c.jsx("button", { className: "ghost", onClick: () => N(null), children: "Cancel" }) })
    ] }),
    /* @__PURE__ */ c.jsx("div", { className: "people", children: E.people.map((S) => /* @__PURE__ */ c.jsxs("button", { className: `person ${E.suggested === S.id ? "suggested" : ""}`, onClick: () => z(S), children: [
      /* @__PURE__ */ c.jsx($n, { p: S, size: 52 }),
      S.name
    ] }, S.id)) })
  ] }) : /* @__PURE__ */ c.jsxs("ha-card", { children: [
    /* @__PURE__ */ c.jsxs("div", { className: "head", children: [
      /* @__PURE__ */ c.jsx("ha-icon", { icon: "mdi:account-group-outline" }),
      /* @__PURE__ */ c.jsxs("div", { children: [
        /* @__PURE__ */ c.jsx("h2", { children: "Shared view" }),
        /* @__PURE__ */ c.jsx("div", { className: "sub", children: "Everyone sees the family's things. Sign in for your own." })
      ] }),
      /* @__PURE__ */ c.jsx("div", { className: "right", children: /* @__PURE__ */ c.jsx("button", { className: "primary", onClick: () => fc(a).then((S) => {
        N(S);
        const H = S.people.find((V) => V.id === S.suggested);
        H && z(H);
      }).catch((S) => v(S.message)), children: "Sign in" }) })
    ] }),
    P && /* @__PURE__ */ c.jsx("div", { className: "err", children: P })
  ] }) : /* @__PURE__ */ c.jsx("ha-card", { children: /* @__PURE__ */ c.jsx("div", { className: "empty", children: "…" }) }) : /* @__PURE__ */ c.jsx("ha-card", { children: /* @__PURE__ */ c.jsxs("div", { className: "err", children: [
    "Give this card the screen it's on: ",
    /* @__PURE__ */ c.jsx("code", { children: "screen: kitchen" })
  ] }) });
}
const Hd = [
  [/get_day|tasks/, "Checked the calendar"],
  [/chores/, "Looked at chores"],
  [/^meals$|meal_plan/, "Meal plan"],
  [/recipe/, "Recipes"],
  [/shopping/, "Shopping list"],
  [/home_/, "The house"],
  [/memory_|context_for|wiki|notes/, "The wiki"],
  [/points|reward/, "Points"],
  [/skill_load/, "Used a skill"],
  [/message_send/, "Sent a message"],
  [/hermes|studio/, "Hermes"],
  [/coinpile/, "Money"]
], Bd = (a) => {
  var u;
  return ((u = Hd.find(([s]) => s.test(a))) == null ? void 0 : u[1]) ?? a.replace(/_/g, " ");
};
let Vd;
const pn = () => Vd ?? (Vd = new AudioContext()), Wd = (a) => {
  const u = new Uint8Array(a.fftSize);
  a.getByteTimeDomainData(u);
  let s = 0;
  for (const E of u) s += ((E - 128) / 128) ** 2;
  return Math.min(1, Math.sqrt(s / u.length) * 4);
}, Qd = (a) => {
  let u = "";
  for (let s = 0; s < a.length; s += 32768) u += String.fromCharCode(...a.subarray(s, s + 32768));
  return btoa(u);
};
function mc(a, u) {
  const [s, E] = ee.useState([]), [N, C] = ee.useState(!1), [z, P] = ee.useState(null), [v, S] = ee.useState(!1), [H, V] = ee.useState(0), M = ee.useRef(null), $ = ee.useRef(null), W = ee.useRef(null), Y = ee.useCallback(() => {
    M.current = null, a.call("/api/ha/chat/history").then((O) => {
      M.current = O.conversation_id, E(O.messages.map((le) => ({ me: le.role === "user", text: le.content })));
    }).catch(() => E([]));
  }, [a]);
  ee.useEffect(() => {
    Y();
    const O = (le) => {
      var X;
      ((X = le.detail) == null ? void 0 : X.screen) === a.screen && Y();
    };
    return window.addEventListener("faith-hub-changed", O), () => window.removeEventListener("faith-hub-changed", O);
  }, [Y]);
  const [, q] = ee.useState(0);
  ee.useEffect(() => {
    if (!H) return;
    const O = setTimeout(() => q((le) => le + 1), 3100);
    return () => clearTimeout(O);
  }, [H]), ee.useEffect(() => () => {
    var O;
    (O = W.current) == null || O.pause();
  }, []);
  const pe = async (O) => {
    var le;
    try {
      const X = await a.call("/api/ha/speak", { text: O });
      (le = W.current) == null || le.pause();
      const ie = new Audio(`data:${X.mime};base64,${X.audio}`), re = pn().createAnalyser();
      re.fftSize = 512, pn().createMediaElementSource(ie).connect(re), re.connect(pn().destination), W.current = ie, $.current = re, S(!0);
      const xe = () => {
        W.current === ie && ($.current = null, S(!1));
      };
      ie.onended = xe, ie.onerror = xe, await pn().resume(), await ie.play();
    } catch {
      $.current = null, S(!1);
    }
  }, Le = async (O, le) => {
    C(!0), E((X) => [...X, ...le ? [{ me: !0, text: le }] : [], { text: "…" }]);
    try {
      const X = await a.call("/api/ha/chat", { ...O, conversation_id: M.current });
      M.current = X.conversation_id, E((ie) => [
        ...ie.slice(0, -1),
        ...X.heard ? [{ me: !0, text: X.heard + (X.speaker ? ` (${X.speaker.name})` : "") }] : [],
        ...X.confirms.map((re) => ({ text: "", confirm: re })),
        ...X.approvals.map((re) => ({ text: "", waiting: re.summary })),
        { text: X.text, tools: X.tools }
      ]), V(Date.now()), u && X.text && pe(X.text);
    } catch (X) {
      E((ie) => [...ie.slice(0, -1), { text: `Sorry, that didn't work: ${X.message}` }]);
    } finally {
      C(!1);
    }
  }, Te = async () => {
    var O;
    if (z) {
      z.stop(), P(null);
      return;
    }
    (O = W.current) == null || O.pause(), $.current = null, S(!1);
    try {
      const le = await navigator.mediaDevices.getUserMedia({ audio: !0 }), X = new MediaRecorder(le), ie = [];
      try {
        const re = pn().createAnalyser();
        re.fftSize = 512, pn().createMediaStreamSource(le).connect(re), $.current = re, pn().resume();
      } catch {
      }
      X.ondataavailable = (re) => re.data.size && ie.push(re.data), X.onstop = async () => {
        le.getTracks().forEach((xe) => xe.stop()), $.current = null;
        const re = new Blob(ie, { type: X.mimeType || "audio/webm" });
        Le({ audio: Qd(new Uint8Array(await re.arrayBuffer())), mime: re.type.split(";")[0] }, "");
      }, X.start(), P(X);
    } catch {
      E((le) => [...le, { text: "The microphone isn't available (Home Assistant needs https for it)." }]);
    }
  }, me = (O, le) => a.call(`/api/ha/confirm/${O}`, { approve: le }).then((X) => E((ie) => ie.map((re) => {
    var xe;
    return ((xe = re.confirm) == null ? void 0 : xe.id) === O ? { ...re, confirm: { ...re.confirm, done: X.text } } : re;
  }))).catch((X) => E((ie) => [...ie, { text: X.message }])), Pe = ee.useCallback(() => $.current ? Wd($.current) : void 0, []), fe = z ? "listening" : N ? "thinking" : v || !u && Date.now() - H < 3e3 ? "speaking" : "idle";
  return { lines: s, busy: N, rec: z, state: fe, level: Pe, send: Le, mic: Te, answer: me, fresh: () => {
    M.current = null, E([]);
  } };
}
function vc({ l: a, answer: u }) {
  return a.confirm ? /* @__PURE__ */ c.jsxs("div", { className: "box", children: [
    /* @__PURE__ */ c.jsxs("div", { children: [
      "Do this? ",
      /* @__PURE__ */ c.jsx("b", { children: a.confirm.summary })
    ] }),
    a.confirm.done ? /* @__PURE__ */ c.jsx("div", { className: "meta", children: a.confirm.done }) : /* @__PURE__ */ c.jsxs("div", { className: "btns", children: [
      /* @__PURE__ */ c.jsx("button", { className: "primary", onClick: () => u(a.confirm.id, !0), children: "Yes" }),
      /* @__PURE__ */ c.jsx("button", { onClick: () => u(a.confirm.id, !1), children: "No" })
    ] })
  ] }) : /* @__PURE__ */ c.jsx("div", { className: "box wait", children: /* @__PURE__ */ c.jsxs("div", { children: [
    "Waiting for a grown-up: ",
    /* @__PURE__ */ c.jsx("b", { children: a.waiting })
  ] }) });
}
function gc({ c: a, placeholder: u = "Ask FAITH" }) {
  const [s, E] = ee.useState("");
  return /* @__PURE__ */ c.jsxs("form", { className: "ask", onSubmit: (N) => {
    N.preventDefault();
    const C = s.trim();
    C && !a.busy && (E(""), a.send({ text: C }, C));
  }, children: [
    /* @__PURE__ */ c.jsx("button", { type: "button", className: a.rec ? "rec" : "", title: a.rec ? "Stop and send" : "Talk", "aria-label": a.rec ? "Stop recording and send" : "Talk to FAITH", "aria-pressed": !!a.rec, disabled: a.busy, onClick: a.mic, children: /* @__PURE__ */ c.jsx("ha-icon", { icon: a.rec ? "mdi:stop" : "mdi:microphone" }) }),
    /* @__PURE__ */ c.jsx("input", { value: s, onChange: (N) => E(N.target.value), "aria-label": "Message to FAITH", placeholder: a.rec ? "Listening… tap stop when done" : u }),
    /* @__PURE__ */ c.jsx("button", { className: "primary", type: "submit", disabled: a.busy || !s.trim(), title: "Send", "aria-label": "Send", children: /* @__PURE__ */ c.jsx("ha-icon", { icon: "mdi:send" }) })
  ] });
}
function Kd({ api: a, config: u }) {
  const s = mc(a, u.speak === !0), E = ee.useRef(null);
  return ee.useEffect(() => {
    var N;
    (N = E.current) == null || N.scrollIntoView({ block: "nearest" });
  }, [s.lines]), /* @__PURE__ */ c.jsxs("ha-card", { children: [
    /* @__PURE__ */ c.jsxs("div", { className: "head", children: [
      /* @__PURE__ */ c.jsx(ac, { className: "emblem", size: 56, tone: a.dark ? "dark" : "light", state: s.state, level: s.level }),
      /* @__PURE__ */ c.jsx("h2", { children: u.title ?? "Ask FAITH" }),
      s.lines.length > 0 && /* @__PURE__ */ c.jsx("div", { className: "right", children: /* @__PURE__ */ c.jsx("button", { className: "ghost", onClick: s.fresh, children: "New" }) })
    ] }),
    /* @__PURE__ */ c.jsxs("div", { className: "chat", role: "log", "aria-live": "polite", "aria-label": "Conversation with FAITH", children: [
      !s.lines.length && /* @__PURE__ */ c.jsx("div", { className: "empty", children: "What's on today? What's for dinner? Add milk to the list. Turn off the lights." }),
      s.lines.map((N, C) => {
        var z;
        return N.confirm || N.waiting ? /* @__PURE__ */ c.jsx(vc, { l: N, answer: s.answer }, C) : /* @__PURE__ */ c.jsxs("div", { style: { display: "flex", flexDirection: "column", gap: 4, alignItems: N.me ? "flex-end" : "flex-start" }, children: [
          /* @__PURE__ */ c.jsx("div", { className: `msg ${N.me ? "me" : "faith"}`, children: N.me ? N.text : /* @__PURE__ */ c.jsx(cc, { text: N.text }) }),
          !!((z = N.tools) != null && z.length) && /* @__PURE__ */ c.jsx("div", { className: "chips", children: [...new Set(N.tools.map(Bd))].map((P) => /* @__PURE__ */ c.jsx("span", { className: "chip", children: P }, P)) })
        ] }, C);
      }),
      /* @__PURE__ */ c.jsx("div", { ref: E })
    ] }),
    /* @__PURE__ */ c.jsx(gc, { c: s })
  ] });
}
const Gd = (a) => a.getHours() < 5 ? "Good night" : a.getHours() < 12 ? "Good morning" : a.getHours() < 18 ? "Good afternoon" : "Good evening";
function Yd({ api: a, config: u }) {
  var me, Pe, fe, ue;
  const { data: s, err: E, load: N } = Vl(a, "/api/ha/view", { cards: u.cards ?? ["today"] }, 3e4), C = mc(a, u.speak !== !1), [z, P] = ee.useState(/* @__PURE__ */ new Date()), [v, S] = ee.useState(null), [H, V] = ee.useState(null);
  ee.useEffect(() => {
    const O = setInterval(() => P(/* @__PURE__ */ new Date()), 1e4);
    return () => clearInterval(O);
  }, []), pc(a, s);
  const M = !!a.screen && !!s && !s.person;
  if (ee.useEffect(() => {
    M && (s != null && s.can_sign_in) && fc(a).then(S).catch(() => {
    });
  }, [M, s == null ? void 0 : s.can_sign_in, (me = s == null ? void 0 : s.hub) == null ? void 0 : me.person.id]), E) return /* @__PURE__ */ c.jsx("ha-card", { class: "hub", children: /* @__PURE__ */ c.jsx("div", { className: "err", children: E }) });
  const $ = ((Pe = s == null ? void 0 : s.hub) == null ? void 0 : Pe.person) ?? (s == null ? void 0 : s.person) ?? null, W = [...C.lines].reverse().find((O) => !O.me && !O.confirm && !O.waiting), Y = [...C.lines].reverse().find((O) => O.me), q = C.lines.filter((O) => O.confirm && !O.confirm.done || O.waiting).slice(-2), pe = s == null ? void 0 : s.cards.flatMap((O) => O.kind === "schedule" ? O.items ?? [] : []).find((O) => !O.done && Dd(O.time, z)), Le = Number(u.size) || 300, Te = C.rec ? "Listening… tap FAITH to send" : C.busy ? "Thinking…" : C.state === "speaking" ? "" : "Tap FAITH to talk";
  return /* @__PURE__ */ c.jsxs("ha-card", { class: "hub", children: [
    /* @__PURE__ */ c.jsxs("div", { className: "hub-top", children: [
      /* @__PURE__ */ c.jsxs("div", { children: [
        /* @__PURE__ */ c.jsx("div", { className: "clock", children: z.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }) }),
        /* @__PURE__ */ c.jsx("div", { className: "eyebrow", children: z.toLocaleDateString([], { weekday: "long", month: "long", day: "numeric" }) })
      ] }),
      /* @__PURE__ */ c.jsxs("div", { className: "right", children: [
        !!(s != null && s.pending_approvals) && /* @__PURE__ */ c.jsxs("span", { className: "pill", children: [
          s.pending_approvals,
          " waiting for approval"
        ] }),
        (s == null ? void 0 : s.hub) && /* @__PURE__ */ c.jsxs("button", { onClick: () => hc(a).then(N), children: [
          "Sign out ",
          s.hub.person.name
        ] })
      ] })
    ] }),
    /* @__PURE__ */ c.jsxs("div", { className: "hub-mid", children: [
      /* @__PURE__ */ c.jsxs("div", { className: "hello", children: [
        Gd(z),
        ", ",
        /* @__PURE__ */ c.jsx("em", { children: $ ? $.name : "everyone" }),
        "."
      ] }),
      (pe || !!((fe = s == null ? void 0 : s.home) != null && fe.length)) && /* @__PURE__ */ c.jsx("div", { className: "meta", children: [pe ? `Next: ${zr(pe.time)} ${pe.title}` : "", (ue = s == null ? void 0 : s.home) != null && ue.length ? `Home now: ${s.home.map((O) => O.name).join(", ")}` : ""].filter(Boolean).join(" · ") }),
      /* @__PURE__ */ c.jsx("button", { className: "orb", onClick: C.mic, disabled: C.busy, "aria-label": C.rec ? "Stop and send" : "Talk to FAITH", children: /* @__PURE__ */ c.jsx(ac, { size: Le, tone: a.dark ? "dark" : "light", state: C.state, level: C.level }) }),
      Te && /* @__PURE__ */ c.jsx("div", { className: "hint", children: Te }),
      Y && !C.rec && /* @__PURE__ */ c.jsxs("div", { className: "heard", children: [
        "“",
        Y.text,
        "”"
      ] }),
      /* @__PURE__ */ c.jsx("div", { "aria-live": "polite", children: W && W.text !== "…" && /* @__PURE__ */ c.jsx("div", { className: "reply", children: /* @__PURE__ */ c.jsx(cc, { text: W.text }) }) }),
      q.map((O, le) => /* @__PURE__ */ c.jsx(vc, { l: O, answer: C.answer }, le))
    ] }),
    u.show_input !== !1 && /* @__PURE__ */ c.jsx(gc, { c: C, placeholder: "Or type to FAITH" }),
    M && v && !(s != null && s.hub) && /* @__PURE__ */ c.jsx("div", { className: "faces", children: v.people.map((O) => /* @__PURE__ */ c.jsxs("button", { className: `face ${v.suggested === O.id ? "on" : ""}`, onClick: () => V(O), children: [
      /* @__PURE__ */ c.jsx($n, { p: O, size: 56, ring: v.suggested === O.id }),
      O.name
    ] }, O.id)) }),
    H && /* @__PURE__ */ c.jsx("div", { className: "overlay", children: /* @__PURE__ */ c.jsx(dc, { api: a, people: v, pick: H, onBack: () => V(null), onDone: () => {
      V(null), N();
    } }) })
  ] });
}
const rc = (a) => {
  try {
    return new Intl.NumberFormat([], { style: "currency", currency: a.currency || "USD" }).format(a.amount);
  } catch {
    return `${a.amount.toFixed(2)} ${a.currency}`;
  }
};
function Xd({ api: a, config: u }) {
  const { data: s, err: E, load: N } = Vl(a, "/api/ha/rewards"), [C, z] = ee.useState(""), P = (S, H, V) => a.call(S, { args: H }).then((M) => {
    z(M.approval ? `${V} A grown-up will approve it.` : V), N();
  }).catch((M) => z(M.message));
  if (E) return /* @__PURE__ */ c.jsx("ha-card", { children: /* @__PURE__ */ c.jsx("div", { className: "err", children: E }) });
  if (!s) return /* @__PURE__ */ c.jsx("ha-card", { children: /* @__PURE__ */ c.jsx("div", { className: "empty", children: "Loading…" }) });
  const v = (S) => `${S} pt${S === 1 ? "" : "s"}`;
  return /* @__PURE__ */ c.jsxs("ha-card", { children: [
    /* @__PURE__ */ c.jsxs("div", { className: "head", children: [
      /* @__PURE__ */ c.jsx("ha-icon", { icon: "mdi:star-circle-outline" }),
      /* @__PURE__ */ c.jsx("h2", { children: u.title ?? "Points & rewards" })
    ] }),
    s.me ? /* @__PURE__ */ c.jsxs(c.Fragment, { children: [
      /* @__PURE__ */ c.jsxs("div", { className: "section mine", children: [
        /* @__PURE__ */ c.jsxs("div", { className: "honey", children: [
          /* @__PURE__ */ c.jsx("span", { className: "big", children: s.me.points }),
          /* @__PURE__ */ c.jsx("span", { className: "label", children: "points" })
        ] }),
        /* @__PURE__ */ c.jsxs("div", { children: [
          /* @__PURE__ */ c.jsxs("div", { className: "eyebrow", children: [
            s.me.name,
            "'s points"
          ] }),
          /* @__PURE__ */ c.jsx("div", { className: "meta", children: "Do jobs, ask a grown-up, and spend them on rewards." }),
          s.me.card && /* @__PURE__ */ c.jsxs("div", { className: "cardbal", children: [
            /* @__PURE__ */ c.jsx("ha-icon", { icon: "mdi:credit-card-outline" }),
            "My card: ",
            /* @__PURE__ */ c.jsx("b", { children: rc(s.me.card) })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ c.jsxs("div", { className: "section", children: [
        /* @__PURE__ */ c.jsx("h3", { children: "Jobs" }),
        /* @__PURE__ */ c.jsx("ul", { children: s.activities.filter((S) => S.kids_can_claim).map((S) => /* @__PURE__ */ c.jsxs("li", { className: "row", children: [
          /* @__PURE__ */ c.jsx("span", { className: "grow", children: S.name }),
          /* @__PURE__ */ c.jsxs("span", { className: "pill", children: [
            "+",
            v(S.points)
          ] }),
          /* @__PURE__ */ c.jsx("button", { onClick: () => P("/api/ha/rewards/claim", { activity: S.id }, `Asked for ${v(S.points)} for "${S.name}".`), children: "I did it" })
        ] }, S.id)) })
      ] }),
      /* @__PURE__ */ c.jsxs("div", { className: "section", children: [
        /* @__PURE__ */ c.jsx("h3", { children: "Rewards" }),
        /* @__PURE__ */ c.jsx("ul", { children: s.rewards.map((S) => /* @__PURE__ */ c.jsxs("li", { className: "row", children: [
          /* @__PURE__ */ c.jsxs("span", { className: "grow", children: [
            S.name,
            S.kind === "money" && S.amount && s.me.card && !/card/i.test(S.name) ? /* @__PURE__ */ c.jsx("span", { className: "meta", children: " · onto your card" }) : null
          ] }),
          /* @__PURE__ */ c.jsx("span", { className: "pill", children: v(S.cost) }),
          /* @__PURE__ */ c.jsx("button", { className: "primary", disabled: s.me.points < S.cost, onClick: () => P("/api/ha/rewards/redeem", { reward: S.id }, `Asked for "${S.name}".`), children: "Get it" })
        ] }, S.id)) })
      ] })
    ] }) : /* @__PURE__ */ c.jsxs(c.Fragment, { children: [
      !s.kids.length && /* @__PURE__ */ c.jsx("div", { className: "empty", children: "No children in FAITH's family list yet." }),
      /* @__PURE__ */ c.jsx("ul", { children: s.kids.map((S) => /* @__PURE__ */ c.jsxs("li", { className: "row", children: [
        /* @__PURE__ */ c.jsx($n, { p: S, size: 34 }),
        /* @__PURE__ */ c.jsxs("span", { className: "grow", children: [
          S.name,
          S.card && /* @__PURE__ */ c.jsxs("span", { className: "meta", children: [
            " · card ",
            rc(S.card)
          ] })
        ] }),
        /* @__PURE__ */ c.jsx("span", { className: "pill", children: v(S.points) }),
        s.can_give && /* @__PURE__ */ c.jsx("div", { className: "btns", children: s.allowed_points.map((H) => /* @__PURE__ */ c.jsxs("button", { "aria-label": `Give ${S.name} ${v(H)}`, onClick: () => P("/api/ha/rewards/award", { person: S.id, points: H, reason: "Well done (from the dashboard)" }, `Gave ${S.name} ${v(H)}.`), children: [
          "+",
          H
        ] }, H)) })
      ] }, S.id)) }),
      !s.can_give && s.kids.length > 0 && /* @__PURE__ */ c.jsx("div", { className: "meta", children: "Sign in to give points." })
    ] }),
    /* @__PURE__ */ c.jsx("div", { className: "toast", role: "status", children: C })
  ] });
}
function jr(a, u, s, E, N) {
  if (customElements.get(a)) return;
  class C extends HTMLElement {
    constructor() {
      super(...arguments);
      Ue(this, "_hass");
      Ue(this, "_config");
      Ue(this, "_root");
      Ue(this, "_api");
    }
    setConfig(v) {
      this._config = { ...v }, this._api = void 0, this.render();
    }
    set hass(v) {
      const S = !this._hass;
      this._hass = v, S && this.render();
    }
    getCardSize() {
      return N;
    }
    static getStubConfig() {
      return a === "faith-who-card" || a === "faith-hub-card" ? { screen: "kitchen" } : {};
    }
    connectedCallback() {
      this.render();
    }
    render() {
      if (!(!this._config || !this._hass)) {
        if (!this._root) {
          const v = this.shadowRoot ?? this.attachShadow({ mode: "open" }), S = document.createElement("style");
          S.textContent = _d, v.appendChild(S);
          const H = document.createElement("div");
          v.appendChild(H), this._root = Cd.createRoot(H);
        }
        this._api ?? (this._api = jd(() => this._hass, this._config)), this._root.render(/* @__PURE__ */ c.jsx(E, { api: this._api, config: this._config }));
      }
    }
  }
  customElements.define(a, C), (window.customCards ?? (window.customCards = [])).push({ type: a, name: u, description: s, preview: !1 });
}
let lc = !1;
function Wo() {
  if (!lc) {
    lc = !0, jr("faith-card", "FAITH", "The family's day from FAITH: today, meals, shopping, chores, the house and approvals, for whoever is looking.", $d, 6), jr("faith-who-card", "FAITH: who's here", "For a shared tablet: shows who is signed in, and lets a person sign in with their PIN.", Ud, 2), jr("faith-chat-card", "FAITH: chat", "Talk or type to FAITH.", Kd, 6), jr("faith-hub-card", "FAITH: hub", "The wall screen: FAITH in the middle (tap to talk, answers out loud), the time, and who's here.", Yd, 9), jr("faith-rewards-card", "FAITH: points & rewards", "Children's points, jobs to claim and rewards; parents give points.", Xd, 4);
    for (const a of [0, 500, 2e3, 6e3]) setTimeout(Zd, a);
  }
}
const ic = () => !!customElements.get("home-assistant");
if (ic()) Wo();
else {
  const a = setInterval(() => {
    ic() && (clearInterval(a), Wo());
  }, 50);
  setTimeout(() => {
    clearInterval(a), Wo();
  }, 2e4);
}
function Zd() {
  const a = [], u = (s) => s.querySelectorAll("*").forEach((E) => {
    var N;
    if (E.tagName === "HUI-ERROR-CARD") {
      const C = E._config ?? E.config ?? {};
      /faith-[a-z-]*card/.test(`${((N = C.origConfig) == null ? void 0 : N.type) ?? ""} ${C.message ?? ""} ${C.error ?? ""}`) && a.push(E);
    }
    E.shadowRoot && u(E.shadowRoot);
  });
  u(document);
  for (const s of a) s.dispatchEvent(new CustomEvent("ll-rebuild", { bubbles: !0, composed: !0 }));
  return a.length;
}
