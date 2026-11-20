var gf = Object.defineProperty;
var yf = (a, u, s) => u in a ? gf(a, u, { enumerable: !0, configurable: !0, writable: !0, value: s }) : a[u] = s;
var Ue = (a, u, s) => yf(a, typeof u != "symbol" ? u + "" : u, s);
var Ao = { exports: {} }, Cr = {}, $o = { exports: {} }, ne = {};
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
function xf() {
  if (Va) return ne;
  Va = 1;
  var a = Symbol.for("react.element"), u = Symbol.for("react.portal"), s = Symbol.for("react.fragment"), k = Symbol.for("react.strict_mode"), N = Symbol.for("react.profiler"), j = Symbol.for("react.provider"), T = Symbol.for("react.context"), P = Symbol.for("react.forward_ref"), v = Symbol.for("react.suspense"), E = Symbol.for("react.memo"), H = Symbol.for("react.lazy"), V = Symbol.iterator;
  function R(f) {
    return f === null || typeof f != "object" ? null : (f = V && f[V] || f["@@iterator"], typeof f == "function" ? f : null);
  }
  var $ = { isMounted: function() {
    return !1;
  }, enqueueForceUpdate: function() {
  }, enqueueReplaceState: function() {
  }, enqueueSetState: function() {
  } }, W = Object.assign, Y = {};
  function b(f, w, D) {
    this.props = f, this.context = w, this.refs = Y, this.updater = D || $;
  }
  b.prototype.isReactComponent = {}, b.prototype.setState = function(f, w) {
    if (typeof f != "object" && typeof f != "function" && f != null) throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");
    this.updater.enqueueSetState(this, f, w, "setState");
  }, b.prototype.forceUpdate = function(f) {
    this.updater.enqueueForceUpdate(this, f, "forceUpdate");
  };
  function pe() {
  }
  pe.prototype = b.prototype;
  function Le(f, w, D) {
    this.props = f, this.context = w, this.refs = Y, this.updater = D || $;
  }
  var Te = Le.prototype = new pe();
  Te.constructor = Le, W(Te, b.prototype), Te.isPureReactComponent = !0;
  var me = Array.isArray, ze = Object.prototype.hasOwnProperty, de = { current: null }, ue = { key: !0, ref: !0, __self: !0, __source: !0 };
  function O(f, w, D) {
    var G, te = {}, ee = null, se = null;
    if (w != null) for (G in w.ref !== void 0 && (se = w.ref), w.key !== void 0 && (ee = "" + w.key), w) ze.call(w, G) && !ue.hasOwnProperty(G) && (te[G] = w[G]);
    var Z = arguments.length - 2;
    if (Z === 1) te.children = D;
    else if (1 < Z) {
      for (var oe = Array(Z), Ne = 0; Ne < Z; Ne++) oe[Ne] = arguments[Ne + 2];
      te.children = oe;
    }
    if (f && f.defaultProps) for (G in Z = f.defaultProps, Z) te[G] === void 0 && (te[G] = Z[G]);
    return { $$typeof: a, type: f, key: ee, ref: se, props: te, _owner: de.current };
  }
  function le(f, w) {
    return { $$typeof: a, type: f.type, key: w, ref: f.ref, props: f.props, _owner: f._owner };
  }
  function X(f) {
    return typeof f == "object" && f !== null && f.$$typeof === a;
  }
  function ie(f) {
    var w = { "=": "=0", ":": "=2" };
    return "$" + f.replace(/[=:]/g, function(D) {
      return w[D];
    });
  }
  var re = /\/+/g;
  function xe(f, w) {
    return typeof f == "object" && f !== null && f.key != null ? ie("" + f.key) : w.toString(36);
  }
  function Ge(f, w, D, G, te) {
    var ee = typeof f;
    (ee === "undefined" || ee === "boolean") && (f = null);
    var se = !1;
    if (f === null) se = !0;
    else switch (ee) {
      case "string":
      case "number":
        se = !0;
        break;
      case "object":
        switch (f.$$typeof) {
          case a:
          case u:
            se = !0;
        }
    }
    if (se) return se = f, te = te(se), f = G === "" ? "." + xe(se, 0) : G, me(te) ? (D = "", f != null && (D = f.replace(re, "$&/") + "/"), Ge(te, w, D, "", function(Ne) {
      return Ne;
    })) : te != null && (X(te) && (te = le(te, D + (!te.key || se && se.key === te.key ? "" : ("" + te.key).replace(re, "$&/") + "/") + f)), w.push(te)), 1;
    if (se = 0, G = G === "" ? "." : G + ":", me(f)) for (var Z = 0; Z < f.length; Z++) {
      ee = f[Z];
      var oe = G + xe(ee, Z);
      se += Ge(ee, w, D, oe, te);
    }
    else if (oe = R(f), typeof oe == "function") for (f = oe.call(f), Z = 0; !(ee = f.next()).done; ) ee = ee.value, oe = G + xe(ee, Z++), se += Ge(ee, w, D, oe, te);
    else if (ee === "object") throw w = String(f), Error("Objects are not valid as a React child (found: " + (w === "[object Object]" ? "object with keys {" + Object.keys(f).join(", ") + "}" : w) + "). If you meant to render a collection of children, use an array instead.");
    return se;
  }
  function Ye(f, w, D) {
    if (f == null) return f;
    var G = [], te = 0;
    return Ge(f, G, "", "", function(ee) {
      return w.call(D, ee, te++);
    }), G;
  }
  function Ie(f) {
    if (f._status === -1) {
      var w = f._result;
      w = w(), w.then(function(D) {
        (f._status === 0 || f._status === -1) && (f._status = 1, f._result = D);
      }, function(D) {
        (f._status === 0 || f._status === -1) && (f._status = 2, f._result = D);
      }), f._status === -1 && (f._status = 0, f._result = w);
    }
    if (f._status === 1) return f._result.default;
    throw f._result;
  }
  var we = { current: null }, L = { transition: null }, x = { ReactCurrentDispatcher: we, ReactCurrentBatchConfig: L, ReactCurrentOwner: de };
  function S() {
    throw Error("act(...) is not supported in production builds of React.");
  }
  return ne.Children = { map: Ye, forEach: function(f, w, D) {
    Ye(f, function() {
      w.apply(this, arguments);
    }, D);
  }, count: function(f) {
    var w = 0;
    return Ye(f, function() {
      w++;
    }), w;
  }, toArray: function(f) {
    return Ye(f, function(w) {
      return w;
    }) || [];
  }, only: function(f) {
    if (!X(f)) throw Error("React.Children.only expected to receive a single React element child.");
    return f;
  } }, ne.Component = b, ne.Fragment = s, ne.Profiler = N, ne.PureComponent = Le, ne.StrictMode = k, ne.Suspense = v, ne.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = x, ne.act = S, ne.cloneElement = function(f, w, D) {
    if (f == null) throw Error("React.cloneElement(...): The argument must be a React element, but you passed " + f + ".");
    var G = W({}, f.props), te = f.key, ee = f.ref, se = f._owner;
    if (w != null) {
      if (w.ref !== void 0 && (ee = w.ref, se = de.current), w.key !== void 0 && (te = "" + w.key), f.type && f.type.defaultProps) var Z = f.type.defaultProps;
      for (oe in w) ze.call(w, oe) && !ue.hasOwnProperty(oe) && (G[oe] = w[oe] === void 0 && Z !== void 0 ? Z[oe] : w[oe]);
    }
    var oe = arguments.length - 2;
    if (oe === 1) G.children = D;
    else if (1 < oe) {
      Z = Array(oe);
      for (var Ne = 0; Ne < oe; Ne++) Z[Ne] = arguments[Ne + 2];
      G.children = Z;
    }
    return { $$typeof: a, type: f.type, key: te, ref: ee, props: G, _owner: se };
  }, ne.createContext = function(f) {
    return f = { $$typeof: T, _currentValue: f, _currentValue2: f, _threadCount: 0, Provider: null, Consumer: null, _defaultValue: null, _globalName: null }, f.Provider = { $$typeof: j, _context: f }, f.Consumer = f;
  }, ne.createElement = O, ne.createFactory = function(f) {
    var w = O.bind(null, f);
    return w.type = f, w;
  }, ne.createRef = function() {
    return { current: null };
  }, ne.forwardRef = function(f) {
    return { $$typeof: P, render: f };
  }, ne.isValidElement = X, ne.lazy = function(f) {
    return { $$typeof: H, _payload: { _status: -1, _result: f }, _init: Ie };
  }, ne.memo = function(f, w) {
    return { $$typeof: E, type: f, compare: w === void 0 ? null : w };
  }, ne.startTransition = function(f) {
    var w = L.transition;
    L.transition = {};
    try {
      f();
    } finally {
      L.transition = w;
    }
  }, ne.unstable_act = S, ne.useCallback = function(f, w) {
    return we.current.useCallback(f, w);
  }, ne.useContext = function(f) {
    return we.current.useContext(f);
  }, ne.useDebugValue = function() {
  }, ne.useDeferredValue = function(f) {
    return we.current.useDeferredValue(f);
  }, ne.useEffect = function(f, w) {
    return we.current.useEffect(f, w);
  }, ne.useId = function() {
    return we.current.useId();
  }, ne.useImperativeHandle = function(f, w, D) {
    return we.current.useImperativeHandle(f, w, D);
  }, ne.useInsertionEffect = function(f, w) {
    return we.current.useInsertionEffect(f, w);
  }, ne.useLayoutEffect = function(f, w) {
    return we.current.useLayoutEffect(f, w);
  }, ne.useMemo = function(f, w) {
    return we.current.useMemo(f, w);
  }, ne.useReducer = function(f, w, D) {
    return we.current.useReducer(f, w, D);
  }, ne.useRef = function(f) {
    return we.current.useRef(f);
  }, ne.useState = function(f) {
    return we.current.useState(f);
  }, ne.useSyncExternalStore = function(f, w, D) {
    return we.current.useSyncExternalStore(f, w, D);
  }, ne.useTransition = function() {
    return we.current.useTransition();
  }, ne.version = "18.3.1", ne;
}
var Wa;
function Go() {
  return Wa || (Wa = 1, $o.exports = xf()), $o.exports;
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
function wf() {
  if (Qa) return Cr;
  Qa = 1;
  var a = Go(), u = Symbol.for("react.element"), s = Symbol.for("react.fragment"), k = Object.prototype.hasOwnProperty, N = a.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner, j = { key: !0, ref: !0, __self: !0, __source: !0 };
  function T(P, v, E) {
    var H, V = {}, R = null, $ = null;
    E !== void 0 && (R = "" + E), v.key !== void 0 && (R = "" + v.key), v.ref !== void 0 && ($ = v.ref);
    for (H in v) k.call(v, H) && !j.hasOwnProperty(H) && (V[H] = v[H]);
    if (P && P.defaultProps) for (H in v = P.defaultProps, v) V[H] === void 0 && (V[H] = v[H]);
    return { $$typeof: u, type: P, key: R, ref: $, props: V, _owner: N.current };
  }
  return Cr.Fragment = s, Cr.jsx = T, Cr.jsxs = T, Cr;
}
var Ka;
function kf() {
  return Ka || (Ka = 1, Ao.exports = wf()), Ao.exports;
}
var c = kf(), q = Go(), Hl = {}, Uo = { exports: {} }, et = {}, Ho = { exports: {} }, Bo = {};
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
function Sf() {
  return Ga || (Ga = 1, (function(a) {
    function u(L, x) {
      var S = L.length;
      L.push(x);
      e: for (; 0 < S; ) {
        var f = S - 1 >>> 1, w = L[f];
        if (0 < N(w, x)) L[f] = x, L[S] = w, S = f;
        else break e;
      }
    }
    function s(L) {
      return L.length === 0 ? null : L[0];
    }
    function k(L) {
      if (L.length === 0) return null;
      var x = L[0], S = L.pop();
      if (S !== x) {
        L[0] = S;
        e: for (var f = 0, w = L.length, D = w >>> 1; f < D; ) {
          var G = 2 * (f + 1) - 1, te = L[G], ee = G + 1, se = L[ee];
          if (0 > N(te, S)) ee < w && 0 > N(se, te) ? (L[f] = se, L[ee] = S, f = ee) : (L[f] = te, L[G] = S, f = G);
          else if (ee < w && 0 > N(se, S)) L[f] = se, L[ee] = S, f = ee;
          else break e;
        }
      }
      return x;
    }
    function N(L, x) {
      var S = L.sortIndex - x.sortIndex;
      return S !== 0 ? S : L.id - x.id;
    }
    if (typeof performance == "object" && typeof performance.now == "function") {
      var j = performance;
      a.unstable_now = function() {
        return j.now();
      };
    } else {
      var T = Date, P = T.now();
      a.unstable_now = function() {
        return T.now() - P;
      };
    }
    var v = [], E = [], H = 1, V = null, R = 3, $ = !1, W = !1, Y = !1, b = typeof setTimeout == "function" ? setTimeout : null, pe = typeof clearTimeout == "function" ? clearTimeout : null, Le = typeof setImmediate < "u" ? setImmediate : null;
    typeof navigator < "u" && navigator.scheduling !== void 0 && navigator.scheduling.isInputPending !== void 0 && navigator.scheduling.isInputPending.bind(navigator.scheduling);
    function Te(L) {
      for (var x = s(E); x !== null; ) {
        if (x.callback === null) k(E);
        else if (x.startTime <= L) k(E), x.sortIndex = x.expirationTime, u(v, x);
        else break;
        x = s(E);
      }
    }
    function me(L) {
      if (Y = !1, Te(L), !W) if (s(v) !== null) W = !0, Ie(ze);
      else {
        var x = s(E);
        x !== null && we(me, x.startTime - L);
      }
    }
    function ze(L, x) {
      W = !1, Y && (Y = !1, pe(O), O = -1), $ = !0;
      var S = R;
      try {
        for (Te(x), V = s(v); V !== null && (!(V.expirationTime > x) || L && !ie()); ) {
          var f = V.callback;
          if (typeof f == "function") {
            V.callback = null, R = V.priorityLevel;
            var w = f(V.expirationTime <= x);
            x = a.unstable_now(), typeof w == "function" ? V.callback = w : V === s(v) && k(v), Te(x);
          } else k(v);
          V = s(v);
        }
        if (V !== null) var D = !0;
        else {
          var G = s(E);
          G !== null && we(me, G.startTime - x), D = !1;
        }
        return D;
      } finally {
        V = null, R = S, $ = !1;
      }
    }
    var de = !1, ue = null, O = -1, le = 5, X = -1;
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
          x ? xe() : (de = !1, ue = null);
        }
      } else de = !1;
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
      b(re, 0);
    };
    function Ie(L) {
      ue = L, de || (de = !0, xe());
    }
    function we(L, x) {
      O = b(function() {
        L(a.unstable_now());
      }, x);
    }
    a.unstable_IdlePriority = 5, a.unstable_ImmediatePriority = 1, a.unstable_LowPriority = 4, a.unstable_NormalPriority = 3, a.unstable_Profiling = null, a.unstable_UserBlockingPriority = 2, a.unstable_cancelCallback = function(L) {
      L.callback = null;
    }, a.unstable_continueExecution = function() {
      W || $ || (W = !0, Ie(ze));
    }, a.unstable_forceFrameRate = function(L) {
      0 > L || 125 < L ? console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported") : le = 0 < L ? Math.floor(1e3 / L) : 5;
    }, a.unstable_getCurrentPriorityLevel = function() {
      return R;
    }, a.unstable_getFirstCallbackNode = function() {
      return s(v);
    }, a.unstable_next = function(L) {
      switch (R) {
        case 1:
        case 2:
        case 3:
          var x = 3;
          break;
        default:
          x = R;
      }
      var S = R;
      R = x;
      try {
        return L();
      } finally {
        R = S;
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
      var S = R;
      R = L;
      try {
        return x();
      } finally {
        R = S;
      }
    }, a.unstable_scheduleCallback = function(L, x, S) {
      var f = a.unstable_now();
      switch (typeof S == "object" && S !== null ? (S = S.delay, S = typeof S == "number" && 0 < S ? f + S : f) : S = f, L) {
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
      return w = S + w, L = { id: H++, callback: x, priorityLevel: L, startTime: S, expirationTime: w, sortIndex: -1 }, S > f ? (L.sortIndex = S, u(E, L), s(v) === null && L === s(E) && (Y ? (pe(O), O = -1) : Y = !0, we(me, S - f))) : (L.sortIndex = w, u(v, L), W || $ || (W = !0, Ie(ze))), L;
    }, a.unstable_shouldYield = ie, a.unstable_wrapCallback = function(L) {
      var x = R;
      return function() {
        var S = R;
        R = x;
        try {
          return L.apply(this, arguments);
        } finally {
          R = S;
        }
      };
    };
  })(Bo)), Bo;
}
var Ya;
function Ef() {
  return Ya || (Ya = 1, Ho.exports = Sf()), Ho.exports;
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
function Nf() {
  if (Xa) return et;
  Xa = 1;
  var a = Go(), u = Ef();
  function s(e) {
    for (var t = "https://reactjs.org/docs/error-decoder.html?invariant=" + e, n = 1; n < arguments.length; n++) t += "&args[]=" + encodeURIComponent(arguments[n]);
    return "Minified React error #" + e + "; visit " + t + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
  }
  var k = /* @__PURE__ */ new Set(), N = {};
  function j(e, t) {
    T(e, t), T(e + "Capture", t);
  }
  function T(e, t) {
    for (N[e] = t, e = 0; e < t.length; e++) k.add(t[e]);
  }
  var P = !(typeof window > "u" || typeof window.document > "u" || typeof window.document.createElement > "u"), v = Object.prototype.hasOwnProperty, E = /^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/, H = {}, V = {};
  function R(e) {
    return v.call(V, e) ? !0 : v.call(H, e) ? !1 : E.test(e) ? V[e] = !0 : (H[e] = !0, !1);
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
  var b = {};
  "children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style".split(" ").forEach(function(e) {
    b[e] = new Y(e, 0, !1, e, null, !1, !1);
  }), [["acceptCharset", "accept-charset"], ["className", "class"], ["htmlFor", "for"], ["httpEquiv", "http-equiv"]].forEach(function(e) {
    var t = e[0];
    b[t] = new Y(t, 1, !1, e[1], null, !1, !1);
  }), ["contentEditable", "draggable", "spellCheck", "value"].forEach(function(e) {
    b[e] = new Y(e, 2, !1, e.toLowerCase(), null, !1, !1);
  }), ["autoReverse", "externalResourcesRequired", "focusable", "preserveAlpha"].forEach(function(e) {
    b[e] = new Y(e, 2, !1, e, null, !1, !1);
  }), "allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope".split(" ").forEach(function(e) {
    b[e] = new Y(e, 3, !1, e.toLowerCase(), null, !1, !1);
  }), ["checked", "multiple", "muted", "selected"].forEach(function(e) {
    b[e] = new Y(e, 3, !0, e, null, !1, !1);
  }), ["capture", "download"].forEach(function(e) {
    b[e] = new Y(e, 4, !1, e, null, !1, !1);
  }), ["cols", "rows", "size", "span"].forEach(function(e) {
    b[e] = new Y(e, 6, !1, e, null, !1, !1);
  }), ["rowSpan", "start"].forEach(function(e) {
    b[e] = new Y(e, 5, !1, e.toLowerCase(), null, !1, !1);
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
    b[t] = new Y(t, 1, !1, e, null, !1, !1);
  }), "xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type".split(" ").forEach(function(e) {
    var t = e.replace(pe, Le);
    b[t] = new Y(t, 1, !1, e, "http://www.w3.org/1999/xlink", !1, !1);
  }), ["xml:base", "xml:lang", "xml:space"].forEach(function(e) {
    var t = e.replace(pe, Le);
    b[t] = new Y(t, 1, !1, e, "http://www.w3.org/XML/1998/namespace", !1, !1);
  }), ["tabIndex", "crossOrigin"].forEach(function(e) {
    b[e] = new Y(e, 1, !1, e.toLowerCase(), null, !1, !1);
  }), b.xlinkHref = new Y("xlinkHref", 1, !1, "xlink:href", "http://www.w3.org/1999/xlink", !0, !1), ["src", "href", "action", "formAction"].forEach(function(e) {
    b[e] = new Y(e, 1, !1, e.toLowerCase(), null, !0, !0);
  });
  function Te(e, t, n, r) {
    var l = b.hasOwnProperty(t) ? b[t] : null;
    (l !== null ? l.type !== 0 : r || !(2 < t.length) || t[0] !== "o" && t[0] !== "O" || t[1] !== "n" && t[1] !== "N") && (W(t, n, l, r) && (n = null), r || l === null ? R(t) && (n === null ? e.removeAttribute(t) : e.setAttribute(t, "" + n)) : l.mustUseProperty ? e[l.propertyName] = n === null ? l.type === 3 ? !1 : "" : n : (t = l.attributeName, r = l.attributeNamespace, n === null ? e.removeAttribute(t) : (l = l.type, n = l === 3 || l === 4 && n === !0 ? "" : "" + n, r ? e.setAttributeNS(r, t, n) : e.setAttribute(t, n))));
  }
  var me = a.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED, ze = Symbol.for("react.element"), de = Symbol.for("react.portal"), ue = Symbol.for("react.fragment"), O = Symbol.for("react.strict_mode"), le = Symbol.for("react.profiler"), X = Symbol.for("react.provider"), ie = Symbol.for("react.context"), re = Symbol.for("react.forward_ref"), xe = Symbol.for("react.suspense"), Ge = Symbol.for("react.suspense_list"), Ye = Symbol.for("react.memo"), Ie = Symbol.for("react.lazy"), we = Symbol.for("react.offscreen"), L = Symbol.iterator;
  function x(e) {
    return e === null || typeof e != "object" ? null : (e = L && e[L] || e["@@iterator"], typeof e == "function" ? e : null);
  }
  var S = Object.assign, f;
  function w(e) {
    if (f === void 0) try {
      throw Error();
    } catch (n) {
      var t = n.stack.trim().match(/\n( *(at )?)/);
      f = t && t[1] || "";
    }
    return `
` + f + e;
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
`), o = l.length - 1, d = i.length - 1; 1 <= o && 0 <= d && l[o] !== i[d]; ) d--;
        for (; 1 <= o && 0 <= d; o--, d--) if (l[o] !== i[d]) {
          if (o !== 1 || d !== 1)
            do
              if (o--, d--, 0 > d || l[o] !== i[d]) {
                var p = `
` + l[o].replace(" at new ", " at ");
                return e.displayName && p.includes("<anonymous>") && (p = p.replace("<anonymous>", e.displayName)), p;
              }
            while (1 <= o && 0 <= d);
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
  function ee(e) {
    if (e == null) return null;
    if (typeof e == "function") return e.displayName || e.name || null;
    if (typeof e == "string") return e;
    switch (e) {
      case ue:
        return "Fragment";
      case de:
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
        return t = e.displayName || null, t !== null ? t : ee(e.type) || "Memo";
      case Ie:
        t = e._payload, e = e._init;
        try {
          return ee(e(t));
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
        return ee(t);
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
  function ft(e) {
    e._valueTracker || (e._valueTracker = Ne(e));
  }
  function Un(e) {
    if (!e) return !1;
    var t = e._valueTracker;
    if (!t) return !0;
    var n = t.getValue(), r = "";
    return e && (r = oe(e) ? e.checked ? "true" : "false" : e.value), e = r, e !== n ? (t.setValue(e), !0) : !1;
  }
  function Rr(e) {
    if (e = e || (typeof document < "u" ? document : void 0), typeof e > "u") return null;
    try {
      return e.activeElement || e.body;
    } catch {
      return e.body;
    }
  }
  function Wl(e, t) {
    var n = t.checked;
    return S({}, t, { defaultChecked: void 0, defaultValue: void 0, value: void 0, checked: n ?? e._wrapperState.initialChecked });
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
    (t !== "number" || Rr(e.ownerDocument) !== e) && (n == null ? e.defaultValue = "" + e._wrapperState.initialValue : e.defaultValue !== "" + n && (e.defaultValue = "" + n));
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
    return S({}, t, { value: void 0, defaultValue: void 0, children: "" + e._wrapperState.initialValue });
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
  }, wc = ["Webkit", "ms", "Moz", "O"];
  Object.keys(Vn).forEach(function(e) {
    wc.forEach(function(t) {
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
  var kc = S({ menuitem: !0 }, { area: !0, base: !0, br: !0, col: !0, embed: !0, hr: !0, img: !0, input: !0, keygen: !0, link: !0, meta: !0, param: !0, source: !0, track: !0, wbr: !0 });
  function Xl(e, t) {
    if (t) {
      if (kc[e] && (t.children != null || t.dangerouslySetInnerHTML != null)) throw Error(s(137, e));
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
    if (e = dr(e)) {
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
  function ds(e, t, n) {
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
  function Sc(e, t, n, r, l, i, o, d, p) {
    var y = Array.prototype.slice.call(arguments, 3);
    try {
      t.apply(n, y);
    } catch (_) {
      this.onError(_);
    }
  }
  var Kn = !1, Ir = null, Dr = !1, ni = null, Ec = { onError: function(e) {
    Kn = !0, Ir = e;
  } };
  function Nc(e, t, n, r, l, i, o, d, p) {
    Kn = !1, Ir = null, Sc.apply(Ec, arguments);
  }
  function jc(e, t, n, r, l, i, o, d, p) {
    if (Nc.apply(this, arguments), Kn) {
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
  function fs(e) {
    if (e.tag === 13) {
      var t = e.memoizedState;
      if (t === null && (e = e.alternate, e !== null && (t = e.memoizedState)), t !== null) return t.dehydrated;
    }
    return null;
  }
  function ps(e) {
    if (bt(e) !== e) throw Error(s(188));
  }
  function Cc(e) {
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
        for (var o = !1, d = l.child; d; ) {
          if (d === n) {
            o = !0, n = l, r = i;
            break;
          }
          if (d === r) {
            o = !0, r = l, n = i;
            break;
          }
          d = d.sibling;
        }
        if (!o) {
          for (d = i.child; d; ) {
            if (d === n) {
              o = !0, n = i, r = l;
              break;
            }
            if (d === r) {
              o = !0, r = i, n = l;
              break;
            }
            d = d.sibling;
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
    return e = Cc(e), e !== null ? ms(e) : null;
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
  var vs = u.unstable_scheduleCallback, gs = u.unstable_cancelCallback, _c = u.unstable_shouldYield, Pc = u.unstable_requestPaint, Ce = u.unstable_now, Tc = u.unstable_getCurrentPriorityLevel, ri = u.unstable_ImmediatePriority, ys = u.unstable_UserBlockingPriority, Fr = u.unstable_NormalPriority, zc = u.unstable_LowPriority, xs = u.unstable_IdlePriority, Or = null, wt = null;
  function Mc(e) {
    if (wt && typeof wt.onCommitFiberRoot == "function") try {
      wt.onCommitFiberRoot(Or, e, void 0, (e.current.flags & 128) === 128);
    } catch {
    }
  }
  var pt = Math.clz32 ? Math.clz32 : Ic, Rc = Math.log, Lc = Math.LN2;
  function Ic(e) {
    return e >>>= 0, e === 0 ? 32 : 31 - (Rc(e) / Lc | 0) | 0;
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
      var d = o & ~l;
      d !== 0 ? r = Gn(d) : (i &= o, i !== 0 && (r = Gn(i)));
    } else o = n & ~l, o !== 0 ? r = Gn(o) : i !== 0 && (r = Gn(i));
    if (r === 0) return 0;
    if (t !== 0 && t !== r && (t & l) === 0 && (l = r & -r, i = t & -t, l >= i || l === 16 && (i & 4194240) !== 0)) return t;
    if ((r & 4) !== 0 && (r |= n & 16), t = e.entangledLanes, t !== 0) for (e = e.entanglements, t &= r; 0 < t; ) n = 31 - pt(t), l = 1 << n, r |= e[n], t &= ~l;
    return r;
  }
  function Dc(e, t) {
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
  function Fc(e, t) {
    for (var n = e.suspendedLanes, r = e.pingedLanes, l = e.expirationTimes, i = e.pendingLanes; 0 < i; ) {
      var o = 31 - pt(i), d = 1 << o, p = l[o];
      p === -1 ? ((d & n) === 0 || (d & r) !== 0) && (l[o] = Dc(d, t)) : p <= t && (e.expiredLanes |= d), i &= ~d;
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
  function Oc(e, t) {
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
  var fe = 0;
  function ks(e) {
    return e &= -e, 1 < e ? 4 < e ? (e & 268435455) !== 0 ? 16 : 536870912 : 4 : 1;
  }
  var Ss, si, Es, Ns, js, ui = !1, Hr = [], Lt = null, It = null, Dt = null, Xn = /* @__PURE__ */ new Map(), Zn = /* @__PURE__ */ new Map(), Ft = [], Ac = "mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset submit".split(" ");
  function Cs(e, t) {
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
    return e === null || e.nativeEvent !== i ? (e = { blockedOn: t, domEventName: n, eventSystemFlags: r, nativeEvent: i, targetContainers: [l] }, t !== null && (t = dr(t), t !== null && si(t)), e) : (e.eventSystemFlags |= r, t = e.targetContainers, l !== null && t.indexOf(l) === -1 && t.push(l), e);
  }
  function $c(e, t, n, r, l) {
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
  function _s(e) {
    var t = en(e.target);
    if (t !== null) {
      var n = bt(t);
      if (n !== null) {
        if (t = n.tag, t === 13) {
          if (t = fs(n), t !== null) {
            e.blockedOn = t, js(e.priority, function() {
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
      } else return t = dr(n), t !== null && si(t), e.blockedOn = n, !1;
      t.shift();
    }
    return !0;
  }
  function Ps(e, t, n) {
    Br(e) && n.delete(t);
  }
  function Uc() {
    ui = !1, Lt !== null && Br(Lt) && (Lt = null), It !== null && Br(It) && (It = null), Dt !== null && Br(Dt) && (Dt = null), Xn.forEach(Ps), Zn.forEach(Ps);
  }
  function qn(e, t) {
    e.blockedOn === t && (e.blockedOn = null, ui || (ui = !0, u.unstable_scheduleCallback(u.unstable_NormalPriority, Uc)));
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
    for (; 0 < Ft.length && (n = Ft[0], n.blockedOn === null); ) _s(n), n.blockedOn === null && Ft.shift();
  }
  var gn = me.ReactCurrentBatchConfig, Vr = !0;
  function Hc(e, t, n, r) {
    var l = fe, i = gn.transition;
    gn.transition = null;
    try {
      fe = 1, ai(e, t, n, r);
    } finally {
      fe = l, gn.transition = i;
    }
  }
  function Bc(e, t, n, r) {
    var l = fe, i = gn.transition;
    gn.transition = null;
    try {
      fe = 4, ai(e, t, n, r);
    } finally {
      fe = l, gn.transition = i;
    }
  }
  function ai(e, t, n, r) {
    if (Vr) {
      var l = ci(e, t, n, r);
      if (l === null) _i(e, t, r, Wr, n), Cs(e, r);
      else if ($c(l, e, t, n, r)) r.stopPropagation();
      else if (Cs(e, r), t & 4 && -1 < Ac.indexOf(e)) {
        for (; l !== null; ) {
          var i = dr(l);
          if (i !== null && Ss(i), i = ci(e, t, n, r), i === null && _i(e, t, r, Wr, n), i === l) break;
          l = i;
        }
        l !== null && r.stopPropagation();
      } else _i(e, t, r, null, n);
    }
  }
  var Wr = null;
  function ci(e, t, n, r) {
    if (Wr = null, e = ql(r), e = en(e), e !== null) if (t = bt(e), t === null) e = null;
    else if (n = t.tag, n === 13) {
      if (e = fs(t), e !== null) return e;
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
        switch (Tc()) {
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
  var Ot = null, di = null, Qr = null;
  function zs() {
    if (Qr) return Qr;
    var e, t = di, n = t.length, r, l = "value" in Ot ? Ot.value : Ot.textContent, i = l.length;
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
  function Ms() {
    return !1;
  }
  function tt(e) {
    function t(n, r, l, i, o) {
      this._reactName = n, this._targetInst = l, this.type = r, this.nativeEvent = i, this.target = o, this.currentTarget = null;
      for (var d in e) e.hasOwnProperty(d) && (n = e[d], this[d] = n ? n(i) : i[d]);
      return this.isDefaultPrevented = (i.defaultPrevented != null ? i.defaultPrevented : i.returnValue === !1) ? Gr : Ms, this.isPropagationStopped = Ms, this;
    }
    return S(t.prototype, { preventDefault: function() {
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
  }, defaultPrevented: 0, isTrusted: 0 }, fi = tt(yn), er = S({}, yn, { view: 0, detail: 0 }), Vc = tt(er), pi, hi, tr, Yr = S({}, er, { screenX: 0, screenY: 0, clientX: 0, clientY: 0, pageX: 0, pageY: 0, ctrlKey: 0, shiftKey: 0, altKey: 0, metaKey: 0, getModifierState: vi, button: 0, buttons: 0, relatedTarget: function(e) {
    return e.relatedTarget === void 0 ? e.fromElement === e.srcElement ? e.toElement : e.fromElement : e.relatedTarget;
  }, movementX: function(e) {
    return "movementX" in e ? e.movementX : (e !== tr && (tr && e.type === "mousemove" ? (pi = e.screenX - tr.screenX, hi = e.screenY - tr.screenY) : hi = pi = 0, tr = e), pi);
  }, movementY: function(e) {
    return "movementY" in e ? e.movementY : hi;
  } }), Rs = tt(Yr), Wc = S({}, Yr, { dataTransfer: 0 }), Qc = tt(Wc), Kc = S({}, er, { relatedTarget: 0 }), mi = tt(Kc), Gc = S({}, yn, { animationName: 0, elapsedTime: 0, pseudoElement: 0 }), Yc = tt(Gc), Xc = S({}, yn, { clipboardData: function(e) {
    return "clipboardData" in e ? e.clipboardData : window.clipboardData;
  } }), Zc = tt(Xc), Jc = S({}, yn, { data: 0 }), Ls = tt(Jc), qc = {
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
  }, bc = {
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
  }, ed = { Alt: "altKey", Control: "ctrlKey", Meta: "metaKey", Shift: "shiftKey" };
  function td(e) {
    var t = this.nativeEvent;
    return t.getModifierState ? t.getModifierState(e) : (e = ed[e]) ? !!t[e] : !1;
  }
  function vi() {
    return td;
  }
  var nd = S({}, er, { key: function(e) {
    if (e.key) {
      var t = qc[e.key] || e.key;
      if (t !== "Unidentified") return t;
    }
    return e.type === "keypress" ? (e = Kr(e), e === 13 ? "Enter" : String.fromCharCode(e)) : e.type === "keydown" || e.type === "keyup" ? bc[e.keyCode] || "Unidentified" : "";
  }, code: 0, location: 0, ctrlKey: 0, shiftKey: 0, altKey: 0, metaKey: 0, repeat: 0, locale: 0, getModifierState: vi, charCode: function(e) {
    return e.type === "keypress" ? Kr(e) : 0;
  }, keyCode: function(e) {
    return e.type === "keydown" || e.type === "keyup" ? e.keyCode : 0;
  }, which: function(e) {
    return e.type === "keypress" ? Kr(e) : e.type === "keydown" || e.type === "keyup" ? e.keyCode : 0;
  } }), rd = tt(nd), ld = S({}, Yr, { pointerId: 0, width: 0, height: 0, pressure: 0, tangentialPressure: 0, tiltX: 0, tiltY: 0, twist: 0, pointerType: 0, isPrimary: 0 }), Is = tt(ld), id = S({}, er, { touches: 0, targetTouches: 0, changedTouches: 0, altKey: 0, metaKey: 0, ctrlKey: 0, shiftKey: 0, getModifierState: vi }), od = tt(id), sd = S({}, yn, { propertyName: 0, elapsedTime: 0, pseudoElement: 0 }), ud = tt(sd), ad = S({}, Yr, {
    deltaX: function(e) {
      return "deltaX" in e ? e.deltaX : "wheelDeltaX" in e ? -e.wheelDeltaX : 0;
    },
    deltaY: function(e) {
      return "deltaY" in e ? e.deltaY : "wheelDeltaY" in e ? -e.wheelDeltaY : "wheelDelta" in e ? -e.wheelDelta : 0;
    },
    deltaZ: 0,
    deltaMode: 0
  }), cd = tt(ad), dd = [9, 13, 27, 32], gi = P && "CompositionEvent" in window, nr = null;
  P && "documentMode" in document && (nr = document.documentMode);
  var fd = P && "TextEvent" in window && !nr, Ds = P && (!gi || nr && 8 < nr && 11 >= nr), Fs = " ", Os = !1;
  function As(e, t) {
    switch (e) {
      case "keyup":
        return dd.indexOf(t.keyCode) !== -1;
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
  function pd(e, t) {
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
  function hd(e, t) {
    if (xn) return e === "compositionend" || !gi && As(e, t) ? (e = zs(), Qr = di = Ot = null, xn = !1, e) : null;
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
  var md = { color: !0, date: !0, datetime: !0, "datetime-local": !0, email: !0, month: !0, number: !0, password: !0, range: !0, search: !0, tel: !0, text: !0, time: !0, url: !0, week: !0 };
  function Us(e) {
    var t = e && e.nodeName && e.nodeName.toLowerCase();
    return t === "input" ? !!md[e.type] : t === "textarea";
  }
  function Hs(e, t, n, r) {
    ss(r), t = br(t, "onChange"), 0 < t.length && (n = new fi("onChange", "change", null, n, r), e.push({ event: n, listeners: t }));
  }
  var rr = null, lr = null;
  function vd(e) {
    iu(e, 0);
  }
  function Xr(e) {
    var t = Nn(e);
    if (Un(t)) return e;
  }
  function gd(e, t) {
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
      Hs(t, lr, e, ql(e)), ds(vd, t);
    }
  }
  function yd(e, t, n) {
    e === "focusin" ? (Ws(), rr = t, lr = n, rr.attachEvent("onpropertychange", Qs)) : e === "focusout" && Ws();
  }
  function xd(e) {
    if (e === "selectionchange" || e === "keyup" || e === "keydown") return Xr(lr);
  }
  function wd(e, t) {
    if (e === "click") return Xr(t);
  }
  function kd(e, t) {
    if (e === "input" || e === "change") return Xr(t);
  }
  function Sd(e, t) {
    return e === t && (e !== 0 || 1 / e === 1 / t) || e !== e && t !== t;
  }
  var ht = typeof Object.is == "function" ? Object.is : Sd;
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
    for (var e = window, t = Rr(); t instanceof e.HTMLIFrameElement; ) {
      try {
        var n = typeof t.contentWindow.location.href == "string";
      } catch {
        n = !1;
      }
      if (n) e = t.contentWindow;
      else break;
      t = Rr(e.document);
    }
    return t;
  }
  function wi(e) {
    var t = e && e.nodeName && e.nodeName.toLowerCase();
    return t && (t === "input" && (e.type === "text" || e.type === "search" || e.type === "tel" || e.type === "url" || e.type === "password") || t === "textarea" || e.contentEditable === "true");
  }
  function Ed(e) {
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
  var Nd = P && "documentMode" in document && 11 >= document.documentMode, wn = null, ki = null, or = null, Si = !1;
  function Zs(e, t, n) {
    var r = n.window === n ? n.document : n.nodeType === 9 ? n : n.ownerDocument;
    Si || wn == null || wn !== Rr(r) || (r = wn, "selectionStart" in r && wi(r) ? r = { start: r.selectionStart, end: r.selectionEnd } : (r = (r.ownerDocument && r.ownerDocument.defaultView || window).getSelection(), r = { anchorNode: r.anchorNode, anchorOffset: r.anchorOffset, focusNode: r.focusNode, focusOffset: r.focusOffset }), or && ir(or, r) || (or = r, r = br(ki, "onSelect"), 0 < r.length && (t = new fi("onSelect", "select", null, t, n), e.push({ event: t, listeners: r }), t.target = wn)));
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
    nu.set(e, t), j(t, [e]);
  }
  for (var Ni = 0; Ni < ru.length; Ni++) {
    var ji = ru[Ni], jd = ji.toLowerCase(), Cd = ji[0].toUpperCase() + ji.slice(1);
    At(jd, "on" + Cd);
  }
  At(qs, "onAnimationEnd"), At(bs, "onAnimationIteration"), At(eu, "onAnimationStart"), At("dblclick", "onDoubleClick"), At("focusin", "onFocus"), At("focusout", "onBlur"), At(tu, "onTransitionEnd"), T("onMouseEnter", ["mouseout", "mouseover"]), T("onMouseLeave", ["mouseout", "mouseover"]), T("onPointerEnter", ["pointerout", "pointerover"]), T("onPointerLeave", ["pointerout", "pointerover"]), j("onChange", "change click focusin focusout input keydown keyup selectionchange".split(" ")), j("onSelect", "focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" ")), j("onBeforeInput", ["compositionend", "keypress", "textInput", "paste"]), j("onCompositionEnd", "compositionend focusout keydown keypress keyup mousedown".split(" ")), j("onCompositionStart", "compositionstart focusout keydown keypress keyup mousedown".split(" ")), j("onCompositionUpdate", "compositionupdate focusout keydown keypress keyup mousedown".split(" "));
  var sr = "abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "), _d = new Set("cancel close invalid load scroll toggle".split(" ").concat(sr));
  function lu(e, t, n) {
    var r = e.type || "unknown-event";
    e.currentTarget = n, jc(r, t, void 0, e), e.currentTarget = null;
  }
  function iu(e, t) {
    t = (t & 4) !== 0;
    for (var n = 0; n < e.length; n++) {
      var r = e[n], l = r.event;
      r = r.listeners;
      e: {
        var i = void 0;
        if (t) for (var o = r.length - 1; 0 <= o; o--) {
          var d = r[o], p = d.instance, y = d.currentTarget;
          if (d = d.listener, p !== i && l.isPropagationStopped()) break e;
          lu(l, d, y), i = p;
        }
        else for (o = 0; o < r.length; o++) {
          if (d = r[o], p = d.instance, y = d.currentTarget, d = d.listener, p !== i && l.isPropagationStopped()) break e;
          lu(l, d, y), i = p;
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
  function Ci(e, t, n) {
    var r = 0;
    t && (r |= 4), ou(n, e, r, t);
  }
  var qr = "_reactListening" + Math.random().toString(36).slice(2);
  function ur(e) {
    if (!e[qr]) {
      e[qr] = !0, k.forEach(function(n) {
        n !== "selectionchange" && (_d.has(n) || Ci(n, !1, e), Ci(n, !0, e));
      });
      var t = e.nodeType === 9 ? e : e.ownerDocument;
      t === null || t[qr] || (t[qr] = !0, Ci("selectionchange", !1, t));
    }
  }
  function ou(e, t, n, r) {
    switch (Ts(t)) {
      case 1:
        var l = Hc;
        break;
      case 4:
        l = Bc;
        break;
      default:
        l = ai;
    }
    n = l.bind(null, t, n, e), l = void 0, !ti || t !== "touchstart" && t !== "touchmove" && t !== "wheel" || (l = !0), r ? l !== void 0 ? e.addEventListener(t, n, { capture: !0, passive: l }) : e.addEventListener(t, n, !0) : l !== void 0 ? e.addEventListener(t, n, { passive: l }) : e.addEventListener(t, n, !1);
  }
  function _i(e, t, n, r, l) {
    var i = r;
    if ((t & 1) === 0 && (t & 2) === 0 && r !== null) e: for (; ; ) {
      if (r === null) return;
      var o = r.tag;
      if (o === 3 || o === 4) {
        var d = r.stateNode.containerInfo;
        if (d === l || d.nodeType === 8 && d.parentNode === l) break;
        if (o === 4) for (o = r.return; o !== null; ) {
          var p = o.tag;
          if ((p === 3 || p === 4) && (p = o.stateNode.containerInfo, p === l || p.nodeType === 8 && p.parentNode === l)) return;
          o = o.return;
        }
        for (; d !== null; ) {
          if (o = en(d), o === null) return;
          if (p = o.tag, p === 5 || p === 6) {
            r = i = o;
            continue e;
          }
          d = d.parentNode;
        }
      }
      r = r.return;
    }
    ds(function() {
      var y = i, _ = ql(n), z = [];
      e: {
        var C = nu.get(e);
        if (C !== void 0) {
          var I = fi, A = e;
          switch (e) {
            case "keypress":
              if (Kr(n) === 0) break e;
            case "keydown":
            case "keyup":
              I = rd;
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
              I = Rs;
              break;
            case "drag":
            case "dragend":
            case "dragenter":
            case "dragexit":
            case "dragleave":
            case "dragover":
            case "dragstart":
            case "drop":
              I = Qc;
              break;
            case "touchcancel":
            case "touchend":
            case "touchmove":
            case "touchstart":
              I = od;
              break;
            case qs:
            case bs:
            case eu:
              I = Yc;
              break;
            case tu:
              I = ud;
              break;
            case "scroll":
              I = Vc;
              break;
            case "wheel":
              I = cd;
              break;
            case "copy":
            case "cut":
            case "paste":
              I = Zc;
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
          var U = (t & 4) !== 0, _e = !U && e === "scroll", m = U ? C !== null ? C + "Capture" : null : C;
          U = [];
          for (var h = y, g; h !== null; ) {
            g = h;
            var M = g.stateNode;
            if (g.tag === 5 && M !== null && (g = M, m !== null && (M = Wn(h, m), M != null && U.push(ar(h, M, g)))), _e) break;
            h = h.return;
          }
          0 < U.length && (C = new I(C, A, null, n, _), z.push({ event: C, listeners: U }));
        }
      }
      if ((t & 7) === 0) {
        e: {
          if (C = e === "mouseover" || e === "pointerover", I = e === "mouseout" || e === "pointerout", C && n !== Jl && (A = n.relatedTarget || n.fromElement) && (en(A) || A[jt])) break e;
          if ((I || C) && (C = _.window === _ ? _ : (C = _.ownerDocument) ? C.defaultView || C.parentWindow : window, I ? (A = n.relatedTarget || n.toElement, I = y, A = A ? en(A) : null, A !== null && (_e = bt(A), A !== _e || A.tag !== 5 && A.tag !== 6) && (A = null)) : (I = null, A = y), I !== A)) {
            if (U = Rs, M = "onMouseLeave", m = "onMouseEnter", h = "mouse", (e === "pointerout" || e === "pointerover") && (U = Is, M = "onPointerLeave", m = "onPointerEnter", h = "pointer"), _e = I == null ? C : Nn(I), g = A == null ? C : Nn(A), C = new U(M, h + "leave", I, n, _), C.target = _e, C.relatedTarget = g, M = null, en(_) === y && (U = new U(m, h + "enter", A, n, _), U.target = g, U.relatedTarget = _e, M = U), _e = M, I && A) t: {
              for (U = I, m = A, h = 0, g = U; g; g = Sn(g)) h++;
              for (g = 0, M = m; M; M = Sn(M)) g++;
              for (; 0 < h - g; ) U = Sn(U), h--;
              for (; 0 < g - h; ) m = Sn(m), g--;
              for (; h--; ) {
                if (U === m || m !== null && U === m.alternate) break t;
                U = Sn(U), m = Sn(m);
              }
              U = null;
            }
            else U = null;
            I !== null && su(z, C, I, U, !1), A !== null && _e !== null && su(z, _e, A, U, !0);
          }
        }
        e: {
          if (C = y ? Nn(y) : window, I = C.nodeName && C.nodeName.toLowerCase(), I === "select" || I === "input" && C.type === "file") var B = gd;
          else if (Us(C)) if (Bs) B = kd;
          else {
            B = xd;
            var Q = yd;
          }
          else (I = C.nodeName) && I.toLowerCase() === "input" && (C.type === "checkbox" || C.type === "radio") && (B = wd);
          if (B && (B = B(e, y))) {
            Hs(z, B, n, _);
            break e;
          }
          Q && Q(e, C, y), e === "focusout" && (Q = C._wrapperState) && Q.controlled && C.type === "number" && Kl(C, "number", C.value);
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
            Si = !1, Zs(z, n, _);
            break;
          case "selectionchange":
            if (Nd) break;
          case "keydown":
          case "keyup":
            Zs(z, n, _);
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
        J && (Ds && n.locale !== "ko" && (xn || J !== "onCompositionStart" ? J === "onCompositionEnd" && xn && (K = zs()) : (Ot = _, di = "value" in Ot ? Ot.value : Ot.textContent, xn = !0)), Q = br(y, J), 0 < Q.length && (J = new Ls(J, e, null, n, _), z.push({ event: J, listeners: Q }), K ? J.data = K : (K = $s(n), K !== null && (J.data = K)))), (K = fd ? pd(e, n) : hd(e, n)) && (y = br(y, "onBeforeInput"), 0 < y.length && (_ = new Ls("onBeforeInput", "beforeinput", null, n, _), z.push({ event: _, listeners: y }), _.data = K));
      }
      iu(z, t);
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
      var d = n, p = d.alternate, y = d.stateNode;
      if (p !== null && p === r) break;
      d.tag === 5 && y !== null && (d = y, l ? (p = Wn(n, i), p != null && o.unshift(ar(n, p, d))) : l || (p = Wn(n, i), p != null && o.push(ar(n, p, d)))), n = n.return;
    }
    o.length !== 0 && e.push({ event: t, listeners: o });
  }
  var Pd = /\r\n?/g, Td = /\u0000|\uFFFD/g;
  function uu(e) {
    return (typeof e == "string" ? e : "" + e).replace(Pd, `
`).replace(Td, "");
  }
  function el(e, t, n) {
    if (t = uu(t), uu(e) !== t && n) throw Error(s(425));
  }
  function tl() {
  }
  var Pi = null, Ti = null;
  function zi(e, t) {
    return e === "textarea" || e === "noscript" || typeof t.children == "string" || typeof t.children == "number" || typeof t.dangerouslySetInnerHTML == "object" && t.dangerouslySetInnerHTML !== null && t.dangerouslySetInnerHTML.__html != null;
  }
  var Mi = typeof setTimeout == "function" ? setTimeout : void 0, zd = typeof clearTimeout == "function" ? clearTimeout : void 0, au = typeof Promise == "function" ? Promise : void 0, Md = typeof queueMicrotask == "function" ? queueMicrotask : typeof au < "u" ? function(e) {
    return au.resolve(null).then(e).catch(Rd);
  } : Mi;
  function Rd(e) {
    setTimeout(function() {
      throw e;
    });
  }
  function Ri(e, t) {
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
  var En = Math.random().toString(36).slice(2), kt = "__reactFiber$" + En, cr = "__reactProps$" + En, jt = "__reactContainer$" + En, Li = "__reactEvents$" + En, Ld = "__reactListeners$" + En, Id = "__reactHandles$" + En;
  function en(e) {
    var t = e[kt];
    if (t) return t;
    for (var n = e.parentNode; n; ) {
      if (t = n[jt] || n[kt]) {
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
  function dr(e) {
    return e = e[kt] || e[jt], !e || e.tag !== 5 && e.tag !== 6 && e.tag !== 13 && e.tag !== 3 ? null : e;
  }
  function Nn(e) {
    if (e.tag === 5 || e.tag === 6) return e.stateNode;
    throw Error(s(33));
  }
  function nl(e) {
    return e[cr] || null;
  }
  var Ii = [], jn = -1;
  function Ut(e) {
    return { current: e };
  }
  function ge(e) {
    0 > jn || (e.current = Ii[jn], Ii[jn] = null, jn--);
  }
  function he(e, t) {
    jn++, Ii[jn] = e.current, e.current = t;
  }
  var Ht = {}, He = Ut(Ht), Xe = Ut(!1), tn = Ht;
  function Cn(e, t) {
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
  function du(e, t, n) {
    if (He.current !== Ht) throw Error(s(168));
    he(He, t), he(Xe, n);
  }
  function fu(e, t, n) {
    var r = e.stateNode;
    if (t = t.childContextTypes, typeof r.getChildContext != "function") return n;
    r = r.getChildContext();
    for (var l in r) if (!(l in t)) throw Error(s(108, se(e) || "Unknown", l));
    return S({}, n, r);
  }
  function ll(e) {
    return e = (e = e.stateNode) && e.__reactInternalMemoizedMergedChildContext || Ht, tn = He.current, he(He, e), he(Xe, Xe.current), !0;
  }
  function pu(e, t, n) {
    var r = e.stateNode;
    if (!r) throw Error(s(169));
    n ? (e = fu(e, t, tn), r.__reactInternalMemoizedMergedChildContext = e, ge(Xe), ge(He), he(He, e)) : ge(Xe), he(Xe, n);
  }
  var Ct = null, il = !1, Di = !1;
  function hu(e) {
    Ct === null ? Ct = [e] : Ct.push(e);
  }
  function Dd(e) {
    il = !0, hu(e);
  }
  function Bt() {
    if (!Di && Ct !== null) {
      Di = !0;
      var e = 0, t = fe;
      try {
        var n = Ct;
        for (fe = 1; e < n.length; e++) {
          var r = n[e];
          do
            r = r(!0);
          while (r !== null);
        }
        Ct = null, il = !1;
      } catch (l) {
        throw Ct !== null && (Ct = Ct.slice(e + 1)), vs(ri, Bt), l;
      } finally {
        fe = t, Di = !1;
      }
    }
    return null;
  }
  var _n = [], Pn = 0, ol = null, sl = 0, ot = [], st = 0, nn = null, _t = 1, Pt = "";
  function rn(e, t) {
    _n[Pn++] = sl, _n[Pn++] = ol, ol = e, sl = t;
  }
  function mu(e, t, n) {
    ot[st++] = _t, ot[st++] = Pt, ot[st++] = nn, nn = e;
    var r = _t;
    e = Pt;
    var l = 32 - pt(r) - 1;
    r &= ~(1 << l), n += 1;
    var i = 32 - pt(t) + l;
    if (30 < i) {
      var o = l - l % 5;
      i = (r & (1 << o) - 1).toString(32), r >>= o, l -= o, _t = 1 << 32 - pt(t) + l | n << l | r, Pt = i + e;
    } else _t = 1 << i | n << l | r, Pt = e;
  }
  function Fi(e) {
    e.return !== null && (rn(e, 1), mu(e, 1, 0));
  }
  function Oi(e) {
    for (; e === ol; ) ol = _n[--Pn], _n[Pn] = null, sl = _n[--Pn], _n[Pn] = null;
    for (; e === nn; ) nn = ot[--st], ot[st] = null, Pt = ot[--st], ot[st] = null, _t = ot[--st], ot[st] = null;
  }
  var nt = null, rt = null, ke = !1, mt = null;
  function vu(e, t) {
    var n = dt(5, null, null, 0);
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
        return t = t.nodeType !== 8 ? null : t, t !== null ? (n = nn !== null ? { id: _t, overflow: Pt } : null, e.memoizedState = { dehydrated: t, treeContext: n, retryLane: 1073741824 }, n = dt(18, null, null, 0), n.stateNode = t, n.return = e, e.child = n, nt = e, rt = null, !0) : !1;
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
    if ((t = e.tag !== 3) && !(t = e.tag !== 5) && (t = e.type, t = t !== "head" && t !== "body" && !zi(e.type, e.memoizedProps)), t && (t = rt)) {
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
  var Fd = me.ReactCurrentBatchConfig;
  function fr(e, t, n) {
    if (e = n.ref, e !== null && typeof e != "function" && typeof e != "object") {
      if (n._owner) {
        if (n = n._owner, n) {
          if (n.tag !== 1) throw Error(s(309));
          var r = n.stateNode;
        }
        if (!r) throw Error(s(147, e));
        var l = r, i = "" + e;
        return t !== null && t.ref !== null && typeof t.ref == "function" && t.ref._stringRef === i ? t.ref : (t = function(o) {
          var d = l.refs;
          o === null ? delete d[i] : d[i] = o;
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
    function d(m, h, g, M) {
      return h === null || h.tag !== 6 ? (h = Ro(g, m.mode, M), h.return = m, h) : (h = l(h, g), h.return = m, h);
    }
    function p(m, h, g, M) {
      var B = g.type;
      return B === ue ? _(m, h, g.props.children, M, g.key) : h !== null && (h.elementType === B || typeof B == "object" && B !== null && B.$$typeof === Ie && wu(B) === h.type) ? (M = l(h, g.props), M.ref = fr(m, h, g), M.return = m, M) : (M = Ll(g.type, g.key, g.props, null, m.mode, M), M.ref = fr(m, h, g), M.return = m, M);
    }
    function y(m, h, g, M) {
      return h === null || h.tag !== 4 || h.stateNode.containerInfo !== g.containerInfo || h.stateNode.implementation !== g.implementation ? (h = Lo(g, m.mode, M), h.return = m, h) : (h = l(h, g.children || []), h.return = m, h);
    }
    function _(m, h, g, M, B) {
      return h === null || h.tag !== 7 ? (h = fn(g, m.mode, M, B), h.return = m, h) : (h = l(h, g), h.return = m, h);
    }
    function z(m, h, g) {
      if (typeof h == "string" && h !== "" || typeof h == "number") return h = Ro("" + h, m.mode, g), h.return = m, h;
      if (typeof h == "object" && h !== null) {
        switch (h.$$typeof) {
          case ze:
            return g = Ll(h.type, h.key, h.props, null, m.mode, g), g.ref = fr(m, null, h), g.return = m, g;
          case de:
            return h = Lo(h, m.mode, g), h.return = m, h;
          case Ie:
            var M = h._init;
            return z(m, M(h._payload), g);
        }
        if (Hn(h) || x(h)) return h = fn(h, m.mode, g, null), h.return = m, h;
        al(m, h);
      }
      return null;
    }
    function C(m, h, g, M) {
      var B = h !== null ? h.key : null;
      if (typeof g == "string" && g !== "" || typeof g == "number") return B !== null ? null : d(m, h, "" + g, M);
      if (typeof g == "object" && g !== null) {
        switch (g.$$typeof) {
          case ze:
            return g.key === B ? p(m, h, g, M) : null;
          case de:
            return g.key === B ? y(m, h, g, M) : null;
          case Ie:
            return B = g._init, C(
              m,
              h,
              B(g._payload),
              M
            );
        }
        if (Hn(g) || x(g)) return B !== null ? null : _(m, h, g, M, null);
        al(m, g);
      }
      return null;
    }
    function I(m, h, g, M, B) {
      if (typeof M == "string" && M !== "" || typeof M == "number") return m = m.get(g) || null, d(h, m, "" + M, B);
      if (typeof M == "object" && M !== null) {
        switch (M.$$typeof) {
          case ze:
            return m = m.get(M.key === null ? g : M.key) || null, p(h, m, M, B);
          case de:
            return m = m.get(M.key === null ? g : M.key) || null, y(h, m, M, B);
          case Ie:
            var Q = M._init;
            return I(m, h, g, Q(M._payload), B);
        }
        if (Hn(M) || x(M)) return m = m.get(g) || null, _(h, m, M, B, null);
        al(h, M);
      }
      return null;
    }
    function A(m, h, g, M) {
      for (var B = null, Q = null, K = h, J = h = 0, Oe = null; K !== null && J < g.length; J++) {
        K.index > J ? (Oe = K, K = null) : Oe = K.sibling;
        var ce = C(m, K, g[J], M);
        if (ce === null) {
          K === null && (K = Oe);
          break;
        }
        e && K && ce.alternate === null && t(m, K), h = i(ce, h, J), Q === null ? B = ce : Q.sibling = ce, Q = ce, K = Oe;
      }
      if (J === g.length) return n(m, K), ke && rn(m, J), B;
      if (K === null) {
        for (; J < g.length; J++) K = z(m, g[J], M), K !== null && (h = i(K, h, J), Q === null ? B = K : Q.sibling = K, Q = K);
        return ke && rn(m, J), B;
      }
      for (K = r(m, K); J < g.length; J++) Oe = I(K, m, J, g[J], M), Oe !== null && (e && Oe.alternate !== null && K.delete(Oe.key === null ? J : Oe.key), h = i(Oe, h, J), Q === null ? B = Oe : Q.sibling = Oe, Q = Oe);
      return e && K.forEach(function(Jt) {
        return t(m, Jt);
      }), ke && rn(m, J), B;
    }
    function U(m, h, g, M) {
      var B = x(g);
      if (typeof B != "function") throw Error(s(150));
      if (g = B.call(g), g == null) throw Error(s(151));
      for (var Q = B = null, K = h, J = h = 0, Oe = null, ce = g.next(); K !== null && !ce.done; J++, ce = g.next()) {
        K.index > J ? (Oe = K, K = null) : Oe = K.sibling;
        var Jt = C(m, K, ce.value, M);
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
        for (; !ce.done; J++, ce = g.next()) ce = z(m, ce.value, M), ce !== null && (h = i(ce, h, J), Q === null ? B = ce : Q.sibling = ce, Q = ce);
        return ke && rn(m, J), B;
      }
      for (K = r(m, K); !ce.done; J++, ce = g.next()) ce = I(K, m, J, ce.value, M), ce !== null && (e && ce.alternate !== null && K.delete(ce.key === null ? J : ce.key), h = i(ce, h, J), Q === null ? B = ce : Q.sibling = ce, Q = ce);
      return e && K.forEach(function(vf) {
        return t(m, vf);
      }), ke && rn(m, J), B;
    }
    function _e(m, h, g, M) {
      if (typeof g == "object" && g !== null && g.type === ue && g.key === null && (g = g.props.children), typeof g == "object" && g !== null) {
        switch (g.$$typeof) {
          case ze:
            e: {
              for (var B = g.key, Q = h; Q !== null; ) {
                if (Q.key === B) {
                  if (B = g.type, B === ue) {
                    if (Q.tag === 7) {
                      n(m, Q.sibling), h = l(Q, g.props.children), h.return = m, m = h;
                      break e;
                    }
                  } else if (Q.elementType === B || typeof B == "object" && B !== null && B.$$typeof === Ie && wu(B) === Q.type) {
                    n(m, Q.sibling), h = l(Q, g.props), h.ref = fr(m, Q, g), h.return = m, m = h;
                    break e;
                  }
                  n(m, Q);
                  break;
                } else t(m, Q);
                Q = Q.sibling;
              }
              g.type === ue ? (h = fn(g.props.children, m.mode, M, g.key), h.return = m, m = h) : (M = Ll(g.type, g.key, g.props, null, m.mode, M), M.ref = fr(m, h, g), M.return = m, m = M);
            }
            return o(m);
          case de:
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
              h = Lo(g, m.mode, M), h.return = m, m = h;
            }
            return o(m);
          case Ie:
            return Q = g._init, _e(m, h, Q(g._payload), M);
        }
        if (Hn(g)) return A(m, h, g, M);
        if (x(g)) return U(m, h, g, M);
        al(m, g);
      }
      return typeof g == "string" && g !== "" || typeof g == "number" ? (g = "" + g, h !== null && h.tag === 6 ? (n(m, h.sibling), h = l(h, g), h.return = m, m = h) : (n(m, h), h = Ro(g, m.mode, M), h.return = m, m = h), o(m)) : n(m, h);
    }
    return _e;
  }
  var zn = ku(!0), Su = ku(!1), cl = Ut(null), dl = null, Mn = null, Hi = null;
  function Bi() {
    Hi = Mn = dl = null;
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
  function Rn(e, t) {
    dl = e, Hi = Mn = null, e = e.dependencies, e !== null && e.firstContext !== null && ((e.lanes & t) !== 0 && (Je = !0), e.firstContext = null);
  }
  function ut(e) {
    var t = e._currentValue;
    if (Hi !== e) if (e = { context: e, memoizedValue: t, next: null }, Mn === null) {
      if (dl === null) throw Error(s(308));
      Mn = e, dl.dependencies = { lanes: 0, firstContext: e };
    } else Mn = Mn.next = e;
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
  function zt(e, t) {
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
  function fl(e, t, n) {
    if (t = t.updateQueue, t !== null && (t = t.shared, (n & 4194240) !== 0)) {
      var r = t.lanes;
      r &= e.pendingLanes, n |= r, t.lanes = n, oi(e, n);
    }
  }
  function ju(e, t) {
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
    var i = l.firstBaseUpdate, o = l.lastBaseUpdate, d = l.shared.pending;
    if (d !== null) {
      l.shared.pending = null;
      var p = d, y = p.next;
      p.next = null, o === null ? i = y : o.next = y, o = p;
      var _ = e.alternate;
      _ !== null && (_ = _.updateQueue, d = _.lastBaseUpdate, d !== o && (d === null ? _.firstBaseUpdate = y : d.next = y, _.lastBaseUpdate = p));
    }
    if (i !== null) {
      var z = l.baseState;
      o = 0, _ = y = p = null, d = i;
      do {
        var C = d.lane, I = d.eventTime;
        if ((r & C) === C) {
          _ !== null && (_ = _.next = {
            eventTime: I,
            lane: 0,
            tag: d.tag,
            payload: d.payload,
            callback: d.callback,
            next: null
          });
          e: {
            var A = e, U = d;
            switch (C = t, I = n, U.tag) {
              case 1:
                if (A = U.payload, typeof A == "function") {
                  z = A.call(I, z, C);
                  break e;
                }
                z = A;
                break e;
              case 3:
                A.flags = A.flags & -65537 | 128;
              case 0:
                if (A = U.payload, C = typeof A == "function" ? A.call(I, z, C) : A, C == null) break e;
                z = S({}, z, C);
                break e;
              case 2:
                Vt = !0;
            }
          }
          d.callback !== null && d.lane !== 0 && (e.flags |= 64, C = l.effects, C === null ? l.effects = [d] : C.push(d));
        } else I = { eventTime: I, lane: C, tag: d.tag, payload: d.payload, callback: d.callback, next: null }, _ === null ? (y = _ = I, p = z) : _ = _.next = I, o |= C;
        if (d = d.next, d === null) {
          if (d = l.shared.pending, d === null) break;
          C = d, d = C.next, C.next = null, l.lastBaseUpdate = C, l.shared.pending = null;
        }
      } while (!0);
      if (_ === null && (p = z), l.baseState = p, l.firstBaseUpdate = y, l.lastBaseUpdate = _, t = l.shared.interleaved, t !== null) {
        l = t;
        do
          o |= l.lane, l = l.next;
        while (l !== t);
      } else i === null && (l.shared.lanes = 0);
      un |= o, e.lanes = o, e.memoizedState = z;
    }
  }
  function Cu(e, t, n) {
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
  function _u(e) {
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
  var ml = me.ReactCurrentDispatcher, Ji = me.ReactCurrentBatchConfig, sn = 0, Ee = null, Me = null, De = null, vl = !1, vr = !1, gr = 0, Od = 0;
  function Be() {
    throw Error(s(321));
  }
  function qi(e, t) {
    if (t === null) return !1;
    for (var n = 0; n < t.length && n < e.length; n++) if (!ht(e[n], t[n])) return !1;
    return !0;
  }
  function bi(e, t, n, r, l, i) {
    if (sn = i, Ee = t, t.memoizedState = null, t.updateQueue = null, t.lanes = 0, ml.current = e === null || e.memoizedState === null ? Hd : Bd, e = n(r, l), vr) {
      i = 0;
      do {
        if (vr = !1, gr = 0, 25 <= i) throw Error(s(301));
        i += 1, De = Me = null, t.updateQueue = null, ml.current = Vd, e = n(r, l);
      } while (vr);
    }
    if (ml.current = xl, t = Me !== null && Me.next !== null, sn = 0, De = Me = Ee = null, vl = !1, t) throw Error(s(300));
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
    if (Me === null) {
      var e = Ee.alternate;
      e = e !== null ? e.memoizedState : null;
    } else e = Me.next;
    var t = De === null ? Ee.memoizedState : De.next;
    if (t !== null) De = t, Me = e;
    else {
      if (e === null) throw Error(s(310));
      Me = e, e = { memoizedState: Me.memoizedState, baseState: Me.baseState, baseQueue: Me.baseQueue, queue: Me.queue, next: null }, De === null ? Ee.memoizedState = De = e : De = De.next = e;
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
    var r = Me, l = r.baseQueue, i = n.pending;
    if (i !== null) {
      if (l !== null) {
        var o = l.next;
        l.next = i.next, i.next = o;
      }
      r.baseQueue = l = i, n.pending = null;
    }
    if (l !== null) {
      i = l.next, r = r.baseState;
      var d = o = null, p = null, y = i;
      do {
        var _ = y.lane;
        if ((sn & _) === _) p !== null && (p = p.next = { lane: 0, action: y.action, hasEagerState: y.hasEagerState, eagerState: y.eagerState, next: null }), r = y.hasEagerState ? y.eagerState : e(r, y.action);
        else {
          var z = {
            lane: _,
            action: y.action,
            hasEagerState: y.hasEagerState,
            eagerState: y.eagerState,
            next: null
          };
          p === null ? (d = p = z, o = r) : p = p.next = z, Ee.lanes |= _, un |= _;
        }
        y = y.next;
      } while (y !== null && y !== i);
      p === null ? o = r : p.next = d, ht(r, t.memoizedState) || (Je = !0), t.memoizedState = r, t.baseState = o, t.baseQueue = p, n.lastRenderedState = r;
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
  function Pu() {
  }
  function Tu(e, t) {
    var n = Ee, r = at(), l = t(), i = !ht(r.memoizedState, l);
    if (i && (r.memoizedState = l, Je = !0), r = r.queue, ro(Ru.bind(null, n, r, e), [e]), r.getSnapshot !== t || i || De !== null && De.memoizedState.tag & 1) {
      if (n.flags |= 2048, xr(9, Mu.bind(null, n, r, l, t), void 0, null), Fe === null) throw Error(s(349));
      (sn & 30) !== 0 || zu(n, t, l);
    }
    return l;
  }
  function zu(e, t, n) {
    e.flags |= 16384, e = { getSnapshot: t, value: n }, t = Ee.updateQueue, t === null ? (t = { lastEffect: null, stores: null }, Ee.updateQueue = t, t.stores = [e]) : (n = t.stores, n === null ? t.stores = [e] : n.push(e));
  }
  function Mu(e, t, n, r) {
    t.value = n, t.getSnapshot = r, Lu(t) && Iu(e);
  }
  function Ru(e, t, n) {
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
    return typeof e == "function" && (e = e()), t.memoizedState = t.baseState = e, e = { pending: null, interleaved: null, lanes: 0, dispatch: null, lastRenderedReducer: yr, lastRenderedState: e }, t.queue = e, e = e.dispatch = Ud.bind(null, Ee, e), [t.memoizedState, e];
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
    if (Me !== null) {
      var o = Me.memoizedState;
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
  function Ad(e, t) {
    var n = fe;
    fe = n !== 0 && 4 > n ? n : 4, e(!0);
    var r = Ji.transition;
    Ji.transition = {};
    try {
      e(!1), t();
    } finally {
      fe = n, Ji.transition = r;
    }
  }
  function Qu() {
    return at().memoizedState;
  }
  function $d(e, t, n) {
    var r = Yt(e);
    if (n = { lane: r, action: n, hasEagerState: !1, eagerState: null, next: null }, Ku(e)) Gu(t, n);
    else if (n = Eu(e, t, n, r), n !== null) {
      var l = Ke();
      xt(n, e, r, l), Yu(n, t, r);
    }
  }
  function Ud(e, t, n) {
    var r = Yt(e), l = { lane: r, action: n, hasEagerState: !1, eagerState: null, next: null };
    if (Ku(e)) Gu(t, l);
    else {
      var i = e.alternate;
      if (e.lanes === 0 && (i === null || i.lanes === 0) && (i = t.lastRenderedReducer, i !== null)) try {
        var o = t.lastRenderedState, d = i(o, n);
        if (l.hasEagerState = !0, l.eagerState = d, ht(d, o)) {
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
  var xl = { readContext: ut, useCallback: Be, useContext: Be, useEffect: Be, useImperativeHandle: Be, useInsertionEffect: Be, useLayoutEffect: Be, useMemo: Be, useReducer: Be, useRef: Be, useState: Be, useDebugValue: Be, useDeferredValue: Be, useTransition: Be, useMutableSource: Be, useSyncExternalStore: Be, useId: Be, unstable_isNewReconciler: !1 }, Hd = { readContext: ut, useCallback: function(e, t) {
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
    return t = n !== void 0 ? n(t) : t, r.memoizedState = r.baseState = t, e = { pending: null, interleaved: null, lanes: 0, dispatch: null, lastRenderedReducer: e, lastRenderedState: t }, r.queue = e, e = e.dispatch = $d.bind(null, Ee, e), [r.memoizedState, e];
  }, useRef: function(e) {
    var t = Et();
    return e = { current: e }, t.memoizedState = e;
  }, useState: Du, useDebugValue: lo, useDeferredValue: function(e) {
    return Et().memoizedState = e;
  }, useTransition: function() {
    var e = Du(!1), t = e[0];
    return e = Ad.bind(null, e[1]), Et().memoizedState = e, [t, e];
  }, useMutableSource: function() {
  }, useSyncExternalStore: function(e, t, n) {
    var r = Ee, l = Et();
    if (ke) {
      if (n === void 0) throw Error(s(407));
      n = n();
    } else {
      if (n = t(), Fe === null) throw Error(s(349));
      (sn & 30) !== 0 || zu(r, t, n);
    }
    l.memoizedState = n;
    var i = { value: n, getSnapshot: t };
    return l.queue = i, Ou(Ru.bind(
      null,
      r,
      i,
      e
    ), [e]), r.flags |= 2048, xr(9, Mu.bind(null, r, i, n, t), void 0, null), n;
  }, useId: function() {
    var e = Et(), t = Fe.identifierPrefix;
    if (ke) {
      var n = Pt, r = _t;
      n = (r & ~(1 << 32 - pt(r) - 1)).toString(32) + n, t = ":" + t + "R" + n, n = gr++, 0 < n && (t += "H" + n.toString(32)), t += ":";
    } else n = Od++, t = ":" + t + "r" + n.toString(32) + ":";
    return e.memoizedState = t;
  }, unstable_isNewReconciler: !1 }, Bd = {
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
      return Wu(t, Me.memoizedState, e);
    },
    useTransition: function() {
      var e = to(yr)[0], t = at().memoizedState;
      return [e, t];
    },
    useMutableSource: Pu,
    useSyncExternalStore: Tu,
    useId: Qu,
    unstable_isNewReconciler: !1
  }, Vd = { readContext: ut, useCallback: Bu, useContext: ut, useEffect: ro, useImperativeHandle: Hu, useInsertionEffect: Au, useLayoutEffect: $u, useMemo: Vu, useReducer: no, useRef: Fu, useState: function() {
    return no(yr);
  }, useDebugValue: lo, useDeferredValue: function(e) {
    var t = at();
    return Me === null ? t.memoizedState = e : Wu(t, Me.memoizedState, e);
  }, useTransition: function() {
    var e = no(yr)[0], t = at().memoizedState;
    return [e, t];
  }, useMutableSource: Pu, useSyncExternalStore: Tu, useId: Qu, unstable_isNewReconciler: !1 };
  function vt(e, t) {
    if (e && e.defaultProps) {
      t = S({}, t), e = e.defaultProps;
      for (var n in e) t[n] === void 0 && (t[n] = e[n]);
      return t;
    }
    return t;
  }
  function io(e, t, n, r) {
    t = e.memoizedState, n = n(r, t), n = n == null ? t : S({}, t, n), e.memoizedState = n, e.lanes === 0 && (e.updateQueue.baseState = n);
  }
  var wl = { isMounted: function(e) {
    return (e = e._reactInternals) ? bt(e) === e : !1;
  }, enqueueSetState: function(e, t, n) {
    e = e._reactInternals;
    var r = Ke(), l = Yt(e), i = zt(r, l);
    i.payload = t, n != null && (i.callback = n), t = Wt(e, i, l), t !== null && (xt(t, e, l, r), fl(t, e, l));
  }, enqueueReplaceState: function(e, t, n) {
    e = e._reactInternals;
    var r = Ke(), l = Yt(e), i = zt(r, l);
    i.tag = 1, i.payload = t, n != null && (i.callback = n), t = Wt(e, i, l), t !== null && (xt(t, e, l, r), fl(t, e, l));
  }, enqueueForceUpdate: function(e, t) {
    e = e._reactInternals;
    var n = Ke(), r = Yt(e), l = zt(n, r);
    l.tag = 2, t != null && (l.callback = t), t = Wt(e, l, r), t !== null && (xt(t, e, r, n), fl(t, e, r));
  } };
  function Xu(e, t, n, r, l, i, o) {
    return e = e.stateNode, typeof e.shouldComponentUpdate == "function" ? e.shouldComponentUpdate(r, i, o) : t.prototype && t.prototype.isPureReactComponent ? !ir(n, r) || !ir(l, i) : !0;
  }
  function Zu(e, t, n) {
    var r = !1, l = Ht, i = t.contextType;
    return typeof i == "object" && i !== null ? i = ut(i) : (l = Ze(t) ? tn : He.current, r = t.contextTypes, i = (r = r != null) ? Cn(e, l) : Ht), t = new t(n, i), e.memoizedState = t.state !== null && t.state !== void 0 ? t.state : null, t.updater = wl, e.stateNode = t, t._reactInternals = e, r && (e = e.stateNode, e.__reactInternalMemoizedUnmaskedChildContext = l, e.__reactInternalMemoizedMaskedChildContext = i), t;
  }
  function Ju(e, t, n, r) {
    e = t.state, typeof t.componentWillReceiveProps == "function" && t.componentWillReceiveProps(n, r), typeof t.UNSAFE_componentWillReceiveProps == "function" && t.UNSAFE_componentWillReceiveProps(n, r), t.state !== e && wl.enqueueReplaceState(t, t.state, null);
  }
  function oo(e, t, n, r) {
    var l = e.stateNode;
    l.props = n, l.state = e.memoizedState, l.refs = {}, Ki(e);
    var i = t.contextType;
    typeof i == "object" && i !== null ? l.context = ut(i) : (i = Ze(t) ? tn : He.current, l.context = Cn(e, i)), l.state = e.memoizedState, i = t.getDerivedStateFromProps, typeof i == "function" && (io(e, t, i, n), l.state = e.memoizedState), typeof t.getDerivedStateFromProps == "function" || typeof l.getSnapshotBeforeUpdate == "function" || typeof l.UNSAFE_componentWillMount != "function" && typeof l.componentWillMount != "function" || (t = l.state, typeof l.componentWillMount == "function" && l.componentWillMount(), typeof l.UNSAFE_componentWillMount == "function" && l.UNSAFE_componentWillMount(), t !== l.state && wl.enqueueReplaceState(l, l.state, null), pl(e, n, l, r), l.state = e.memoizedState), typeof l.componentDidMount == "function" && (e.flags |= 4194308);
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
  var Wd = typeof WeakMap == "function" ? WeakMap : Map;
  function qu(e, t, n) {
    n = zt(-1, n), n.tag = 3, n.payload = { element: null };
    var r = t.value;
    return n.callback = function() {
      _l || (_l = !0, No = r), uo(e, t);
    }, n;
  }
  function bu(e, t, n) {
    n = zt(-1, n), n.tag = 3;
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
      r = e.pingCache = new Wd();
      var l = /* @__PURE__ */ new Set();
      r.set(t, l);
    } else l = r.get(t), l === void 0 && (l = /* @__PURE__ */ new Set(), r.set(t, l));
    l.has(n) || (l.add(n), e = lf.bind(null, e, t, n), t.then(e, e));
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
    return (e.mode & 1) === 0 ? (e === t ? e.flags |= 65536 : (e.flags |= 128, n.flags |= 131072, n.flags &= -52805, n.tag === 1 && (n.alternate === null ? n.tag = 17 : (t = zt(-1, 1), t.tag = 2, Wt(n, t, 1))), n.lanes |= 1), e) : (e.flags |= 65536, e.lanes = l, e);
  }
  var Qd = me.ReactCurrentOwner, Je = !1;
  function Qe(e, t, n, r) {
    t.child = e === null ? Su(t, null, n, r) : zn(t, e.child, n, r);
  }
  function ra(e, t, n, r, l) {
    n = n.render;
    var i = t.ref;
    return Rn(t, l), r = bi(e, t, n, r, i, l), n = eo(), e !== null && !Je ? (t.updateQueue = e.updateQueue, t.flags &= -2053, e.lanes &= ~l, Mt(e, t, l)) : (ke && n && Fi(t), t.flags |= 1, Qe(e, t, r, l), t.child);
  }
  function la(e, t, n, r, l) {
    if (e === null) {
      var i = n.type;
      return typeof i == "function" && !Mo(i) && i.defaultProps === void 0 && n.compare === null && n.defaultProps === void 0 ? (t.tag = 15, t.type = i, ia(e, t, i, r, l)) : (e = Ll(n.type, null, r, t, t.mode, l), e.ref = t.ref, e.return = t, t.child = e);
    }
    if (i = e.child, (e.lanes & l) === 0) {
      var o = i.memoizedProps;
      if (n = n.compare, n = n !== null ? n : ir, n(o, r) && e.ref === t.ref) return Mt(e, t, l);
    }
    return t.flags |= 1, e = Zt(i, r), e.ref = t.ref, e.return = t, t.child = e;
  }
  function ia(e, t, n, r, l) {
    if (e !== null) {
      var i = e.memoizedProps;
      if (ir(i, r) && e.ref === t.ref) if (Je = !1, t.pendingProps = r = i, (e.lanes & l) !== 0) (e.flags & 131072) !== 0 && (Je = !0);
      else return t.lanes = e.lanes, Mt(e, t, l);
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
    return i = Cn(t, i), Rn(t, l), n = bi(e, t, n, r, i, l), r = eo(), e !== null && !Je ? (t.updateQueue = e.updateQueue, t.flags &= -2053, e.lanes &= ~l, Mt(e, t, l)) : (ke && r && Fi(t), t.flags |= 1, Qe(e, t, n, l), t.child);
  }
  function ua(e, t, n, r, l) {
    if (Ze(n)) {
      var i = !0;
      ll(t);
    } else i = !1;
    if (Rn(t, l), t.stateNode === null) Sl(e, t), Zu(t, n, r), oo(t, n, r, l), r = !0;
    else if (e === null) {
      var o = t.stateNode, d = t.memoizedProps;
      o.props = d;
      var p = o.context, y = n.contextType;
      typeof y == "object" && y !== null ? y = ut(y) : (y = Ze(n) ? tn : He.current, y = Cn(t, y));
      var _ = n.getDerivedStateFromProps, z = typeof _ == "function" || typeof o.getSnapshotBeforeUpdate == "function";
      z || typeof o.UNSAFE_componentWillReceiveProps != "function" && typeof o.componentWillReceiveProps != "function" || (d !== r || p !== y) && Ju(t, o, r, y), Vt = !1;
      var C = t.memoizedState;
      o.state = C, pl(t, r, o, l), p = t.memoizedState, d !== r || C !== p || Xe.current || Vt ? (typeof _ == "function" && (io(t, n, _, r), p = t.memoizedState), (d = Vt || Xu(t, n, d, r, C, p, y)) ? (z || typeof o.UNSAFE_componentWillMount != "function" && typeof o.componentWillMount != "function" || (typeof o.componentWillMount == "function" && o.componentWillMount(), typeof o.UNSAFE_componentWillMount == "function" && o.UNSAFE_componentWillMount()), typeof o.componentDidMount == "function" && (t.flags |= 4194308)) : (typeof o.componentDidMount == "function" && (t.flags |= 4194308), t.memoizedProps = r, t.memoizedState = p), o.props = r, o.state = p, o.context = y, r = d) : (typeof o.componentDidMount == "function" && (t.flags |= 4194308), r = !1);
    } else {
      o = t.stateNode, Nu(e, t), d = t.memoizedProps, y = t.type === t.elementType ? d : vt(t.type, d), o.props = y, z = t.pendingProps, C = o.context, p = n.contextType, typeof p == "object" && p !== null ? p = ut(p) : (p = Ze(n) ? tn : He.current, p = Cn(t, p));
      var I = n.getDerivedStateFromProps;
      (_ = typeof I == "function" || typeof o.getSnapshotBeforeUpdate == "function") || typeof o.UNSAFE_componentWillReceiveProps != "function" && typeof o.componentWillReceiveProps != "function" || (d !== z || C !== p) && Ju(t, o, r, p), Vt = !1, C = t.memoizedState, o.state = C, pl(t, r, o, l);
      var A = t.memoizedState;
      d !== z || C !== A || Xe.current || Vt ? (typeof I == "function" && (io(t, n, I, r), A = t.memoizedState), (y = Vt || Xu(t, n, y, r, C, A, p) || !1) ? (_ || typeof o.UNSAFE_componentWillUpdate != "function" && typeof o.componentWillUpdate != "function" || (typeof o.componentWillUpdate == "function" && o.componentWillUpdate(r, A, p), typeof o.UNSAFE_componentWillUpdate == "function" && o.UNSAFE_componentWillUpdate(r, A, p)), typeof o.componentDidUpdate == "function" && (t.flags |= 4), typeof o.getSnapshotBeforeUpdate == "function" && (t.flags |= 1024)) : (typeof o.componentDidUpdate != "function" || d === e.memoizedProps && C === e.memoizedState || (t.flags |= 4), typeof o.getSnapshotBeforeUpdate != "function" || d === e.memoizedProps && C === e.memoizedState || (t.flags |= 1024), t.memoizedProps = r, t.memoizedState = A), o.props = r, o.state = A, o.context = p, r = y) : (typeof o.componentDidUpdate != "function" || d === e.memoizedProps && C === e.memoizedState || (t.flags |= 4), typeof o.getSnapshotBeforeUpdate != "function" || d === e.memoizedProps && C === e.memoizedState || (t.flags |= 1024), r = !1);
    }
    return co(e, t, n, r, i, l);
  }
  function co(e, t, n, r, l, i) {
    sa(e, t);
    var o = (t.flags & 128) !== 0;
    if (!r && !o) return l && pu(t, n, !1), Mt(e, t, i);
    r = t.stateNode, Qd.current = t;
    var d = o && typeof n.getDerivedStateFromError != "function" ? null : r.render();
    return t.flags |= 1, e !== null && o ? (t.child = zn(t, e.child, null, i), t.child = zn(t, null, d, i)) : Qe(e, t, d, i), t.memoizedState = r.state, l && pu(t, n, !0), t.child;
  }
  function aa(e) {
    var t = e.stateNode;
    t.pendingContext ? du(e, t.pendingContext, t.pendingContext !== t.context) : t.context && du(e, t.context, !1), Gi(e, t.containerInfo);
  }
  function ca(e, t, n, r, l) {
    return Tn(), Ui(l), t.flags |= 256, Qe(e, t, n, r), t.child;
  }
  var fo = { dehydrated: null, treeContext: null, retryLane: 0 };
  function po(e) {
    return { baseLanes: e, cachePool: null, transitions: null };
  }
  function da(e, t, n) {
    var r = t.pendingProps, l = Se.current, i = !1, o = (t.flags & 128) !== 0, d;
    if ((d = o) || (d = e !== null && e.memoizedState === null ? !1 : (l & 2) !== 0), d ? (i = !0, t.flags &= -129) : (e === null || e.memoizedState !== null) && (l |= 1), he(Se, l & 1), e === null)
      return $i(t), e = t.memoizedState, e !== null && (e = e.dehydrated, e !== null) ? ((t.mode & 1) === 0 ? t.lanes = 1 : e.data === "$!" ? t.lanes = 8 : t.lanes = 1073741824, null) : (o = r.children, e = r.fallback, i ? (r = t.mode, i = t.child, o = { mode: "hidden", children: o }, (r & 1) === 0 && i !== null ? (i.childLanes = 0, i.pendingProps = o) : i = Il(o, r, 0, null), e = fn(e, r, n, null), i.return = t, e.return = t, i.sibling = e, t.child = i, t.child.memoizedState = po(n), t.memoizedState = fo, e) : ho(t, o));
    if (l = e.memoizedState, l !== null && (d = l.dehydrated, d !== null)) return Kd(e, t, o, r, d, l, n);
    if (i) {
      i = r.fallback, o = t.mode, l = e.child, d = l.sibling;
      var p = { mode: "hidden", children: r.children };
      return (o & 1) === 0 && t.child !== l ? (r = t.child, r.childLanes = 0, r.pendingProps = p, t.deletions = null) : (r = Zt(l, p), r.subtreeFlags = l.subtreeFlags & 14680064), d !== null ? i = Zt(d, i) : (i = fn(i, o, n, null), i.flags |= 2), i.return = t, r.return = t, r.sibling = i, t.child = r, r = i, i = t.child, o = e.child.memoizedState, o = o === null ? po(n) : { baseLanes: o.baseLanes | n, cachePool: null, transitions: o.transitions }, i.memoizedState = o, i.childLanes = e.childLanes & ~n, t.memoizedState = fo, r;
    }
    return i = e.child, e = i.sibling, r = Zt(i, { mode: "visible", children: r.children }), (t.mode & 1) === 0 && (r.lanes = n), r.return = t, r.sibling = null, e !== null && (n = t.deletions, n === null ? (t.deletions = [e], t.flags |= 16) : n.push(e)), t.child = r, t.memoizedState = null, r;
  }
  function ho(e, t) {
    return t = Il({ mode: "visible", children: t }, e.mode, 0, null), t.return = e, e.child = t;
  }
  function kl(e, t, n, r) {
    return r !== null && Ui(r), zn(t, e.child, null, n), e = ho(t, t.pendingProps.children), e.flags |= 2, t.memoizedState = null, e;
  }
  function Kd(e, t, n, r, l, i, o) {
    if (n)
      return t.flags & 256 ? (t.flags &= -257, r = so(Error(s(422))), kl(e, t, o, r)) : t.memoizedState !== null ? (t.child = e.child, t.flags |= 128, null) : (i = r.fallback, l = t.mode, r = Il({ mode: "visible", children: r.children }, l, 0, null), i = fn(i, l, o, null), i.flags |= 2, r.return = t, i.return = t, r.sibling = i, t.child = r, (t.mode & 1) !== 0 && zn(t, e.child, null, o), t.child.memoizedState = po(o), t.memoizedState = fo, i);
    if ((t.mode & 1) === 0) return kl(e, t, o, null);
    if (l.data === "$!") {
      if (r = l.nextSibling && l.nextSibling.dataset, r) var d = r.dgst;
      return r = d, i = Error(s(419)), r = so(i, r, void 0), kl(e, t, o, r);
    }
    if (d = (o & e.childLanes) !== 0, Je || d) {
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
      return zo(), r = so(Error(s(421))), kl(e, t, o, r);
    }
    return l.data === "$?" ? (t.flags |= 128, t.child = e.child, t = of.bind(null, e), l._reactRetry = t, null) : (e = i.treeContext, rt = $t(l.nextSibling), nt = t, ke = !0, mt = null, e !== null && (ot[st++] = _t, ot[st++] = Pt, ot[st++] = nn, _t = e.id, Pt = e.overflow, nn = t), t = ho(t, r.children), t.flags |= 4096, t);
  }
  function fa(e, t, n) {
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
        if (e.tag === 13) e.memoizedState !== null && fa(e, n, t);
        else if (e.tag === 19) fa(e, n, t);
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
  function Mt(e, t, n) {
    if (e !== null && (t.dependencies = e.dependencies), un |= t.lanes, (n & t.childLanes) === 0) return null;
    if (e !== null && t.child !== e.child) throw Error(s(153));
    if (t.child !== null) {
      for (e = t.child, n = Zt(e, e.pendingProps), t.child = n, n.return = t; e.sibling !== null; ) e = e.sibling, n = n.sibling = Zt(e, e.pendingProps), n.return = t;
      n.sibling = null;
    }
    return t.child;
  }
  function Gd(e, t, n) {
    switch (t.tag) {
      case 3:
        aa(t), Tn();
        break;
      case 5:
        _u(t);
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
          return r.dehydrated !== null ? (he(Se, Se.current & 1), t.flags |= 128, null) : (n & t.child.childLanes) !== 0 ? da(e, t, n) : (he(Se, Se.current & 1), e = Mt(e, t, n), e !== null ? e.sibling : null);
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
    return Mt(e, t, n);
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
          l = S({}, l, { value: void 0 }), r = S({}, r, { value: void 0 }), i = [];
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
        var d = l[y];
        for (o in d) d.hasOwnProperty(o) && (n || (n = {}), n[o] = "");
      } else y !== "dangerouslySetInnerHTML" && y !== "children" && y !== "suppressContentEditableWarning" && y !== "suppressHydrationWarning" && y !== "autoFocus" && (N.hasOwnProperty(y) ? i || (i = []) : (i = i || []).push(y, null));
      for (y in r) {
        var p = r[y];
        if (d = l != null ? l[y] : void 0, r.hasOwnProperty(y) && p !== d && (p != null || d != null)) if (y === "style") if (d) {
          for (o in d) !d.hasOwnProperty(o) || p && p.hasOwnProperty(o) || (n || (n = {}), n[o] = "");
          for (o in p) p.hasOwnProperty(o) && d[o] !== p[o] && (n || (n = {}), n[o] = p[o]);
        } else n || (i || (i = []), i.push(
          y,
          n
        )), n = p;
        else y === "dangerouslySetInnerHTML" ? (p = p ? p.__html : void 0, d = d ? d.__html : void 0, p != null && d !== p && (i = i || []).push(y, p)) : y === "children" ? typeof p != "string" && typeof p != "number" || (i = i || []).push(y, "" + p) : y !== "suppressContentEditableWarning" && y !== "suppressHydrationWarning" && (N.hasOwnProperty(y) ? (p != null && y === "onScroll" && ve("scroll", e), i || d === p || (i = [])) : (i = i || []).push(y, p));
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
  function Yd(e, t, n) {
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
        return r = t.stateNode, Ln(), ge(Xe), ge(He), Zi(), r.pendingContext && (r.context = r.pendingContext, r.pendingContext = null), (e === null || e.child === null) && (ul(t) ? t.flags |= 4 : e === null || e.memoizedState.isDehydrated && (t.flags & 256) === 0 || (t.flags |= 1024, mt !== null && (_o(mt), mt = null))), vo(e, t), Ve(t), null;
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
              var d = i[o];
              o === "children" ? typeof d == "string" ? r.textContent !== d && (i.suppressHydrationWarning !== !0 && el(r.textContent, d, e), l = ["children", d]) : typeof d == "number" && r.textContent !== "" + d && (i.suppressHydrationWarning !== !0 && el(
                r.textContent,
                d,
                e
              ), l = ["children", "" + d]) : N.hasOwnProperty(o) && d != null && o === "onScroll" && ve("scroll", r);
            }
            switch (n) {
              case "input":
                ft(r), qo(r, i, !0);
                break;
              case "textarea":
                ft(r), ts(r);
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
                  e._wrapperState = { wasMultiple: !!r.multiple }, l = S({}, r, { value: void 0 }), ve("invalid", e);
                  break;
                case "textarea":
                  bo(e, r), l = Gl(e, r), ve("invalid", e);
                  break;
                default:
                  l = r;
              }
              Xl(n, l), d = l;
              for (i in d) if (d.hasOwnProperty(i)) {
                var p = d[i];
                i === "style" ? is(e, p) : i === "dangerouslySetInnerHTML" ? (p = p ? p.__html : void 0, p != null && rs(e, p)) : i === "children" ? typeof p == "string" ? (n !== "textarea" || p !== "") && Bn(e, p) : typeof p == "number" && Bn(e, "" + p) : i !== "suppressContentEditableWarning" && i !== "suppressHydrationWarning" && i !== "autoFocus" && (N.hasOwnProperty(i) ? p != null && i === "onScroll" && ve("scroll", e) : p != null && Te(e, i, p, o));
              }
              switch (n) {
                case "input":
                  ft(e), qo(e, r, !1);
                  break;
                case "textarea":
                  ft(e), ts(e);
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
          } else mt !== null && (_o(mt), mt = null), i = !0;
          if (!i) return t.flags & 65536 ? t : null;
        }
        return (t.flags & 128) !== 0 ? (t.lanes = n, t) : (r = r !== null, r !== (e !== null && e.memoizedState !== null) && r && (t.child.flags |= 8192, (t.mode & 1) !== 0 && (e === null || (Se.current & 1) !== 0 ? Re === 0 && (Re = 3) : zo())), t.updateQueue !== null && (t.flags |= 4), Ve(t), null);
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
          if (Re !== 0 || e !== null && (e.flags & 128) !== 0) for (e = t.child; e !== null; ) {
            if (o = hl(e), o !== null) {
              for (t.flags |= 128, wr(i, !1), r = o.updateQueue, r !== null && (t.updateQueue = r, t.flags |= 4), t.subtreeFlags = 0, r = n, n = t.child; n !== null; ) i = n, e = r, i.flags &= 14680066, o = i.alternate, o === null ? (i.childLanes = 0, i.lanes = e, i.child = null, i.subtreeFlags = 0, i.memoizedProps = null, i.memoizedState = null, i.updateQueue = null, i.dependencies = null, i.stateNode = null) : (i.childLanes = o.childLanes, i.lanes = o.lanes, i.child = o.child, i.subtreeFlags = 0, i.deletions = null, i.memoizedProps = o.memoizedProps, i.memoizedState = o.memoizedState, i.updateQueue = o.updateQueue, i.type = o.type, e = o.dependencies, i.dependencies = e === null ? null : { lanes: e.lanes, firstContext: e.firstContext }), n = n.sibling;
              return he(Se, Se.current & 1 | 2), t.child;
            }
            e = e.sibling;
          }
          i.tail !== null && Ce() > On && (t.flags |= 128, r = !0, wr(i, !1), t.lanes = 4194304);
        }
        else {
          if (!r) if (e = hl(o), e !== null) {
            if (t.flags |= 128, r = !0, n = e.updateQueue, n !== null && (t.updateQueue = n, t.flags |= 4), wr(i, !0), i.tail === null && i.tailMode === "hidden" && !o.alternate && !ke) return Ve(t), null;
          } else 2 * Ce() - i.renderingStartTime > On && n !== 1073741824 && (t.flags |= 128, r = !0, wr(i, !1), t.lanes = 4194304);
          i.isBackwards ? (o.sibling = t.child, t.child = o) : (n = i.last, n !== null ? n.sibling = o : t.child = o, i.last = o);
        }
        return i.tail !== null ? (t = i.tail, i.rendering = t, i.tail = t.sibling, i.renderingStartTime = Ce(), t.sibling = null, n = Se.current, he(Se, r ? n & 1 | 2 : n & 1), t) : (Ve(t), null);
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
  function Xd(e, t) {
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
  var El = !1, We = !1, Zd = typeof WeakSet == "function" ? WeakSet : Set, F = null;
  function Dn(e, t) {
    var n = e.ref;
    if (n !== null) if (typeof n == "function") try {
      n(null);
    } catch (r) {
      je(e, t, r);
    }
    else n.current = null;
  }
  function go(e, t, n) {
    try {
      n();
    } catch (r) {
      je(e, t, r);
    }
  }
  var ga = !1;
  function Jd(e, t) {
    if (Pi = Vr, e = Xs(), wi(e)) {
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
          var o = 0, d = -1, p = -1, y = 0, _ = 0, z = e, C = null;
          t: for (; ; ) {
            for (var I; z !== n || l !== 0 && z.nodeType !== 3 || (d = o + l), z !== i || r !== 0 && z.nodeType !== 3 || (p = o + r), z.nodeType === 3 && (o += z.nodeValue.length), (I = z.firstChild) !== null; )
              C = z, z = I;
            for (; ; ) {
              if (z === e) break t;
              if (C === n && ++y === l && (d = o), C === i && ++_ === r && (p = o), (I = z.nextSibling) !== null) break;
              z = C, C = z.parentNode;
            }
            z = I;
          }
          n = d === -1 || p === -1 ? null : { start: d, end: p };
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
              var U = A.memoizedProps, _e = A.memoizedState, m = t.stateNode, h = m.getSnapshotBeforeUpdate(t.elementType === t.type ? U : vt(t.type, U), _e);
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
      } catch (M) {
        je(t, t.return, M);
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
    t !== null && (e.alternate = null, ya(t)), e.child = null, e.deletions = null, e.sibling = null, e.tag === 5 && (t = e.stateNode, t !== null && (delete t[kt], delete t[cr], delete t[Li], delete t[Ld], delete t[Id])), e.stateNode = null, e.return = null, e.dependencies = null, e.memoizedProps = null, e.memoizedState = null, e.pendingProps = null, e.stateNode = null, e.updateQueue = null;
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
        Ae !== null && (gt ? (e = Ae, n = n.stateNode, e.nodeType === 8 ? Ri(e.parentNode, n) : e.nodeType === 1 && Ri(e, n), bn(e)) : Ri(Ae, n.stateNode));
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
        } catch (d) {
          je(n, t, d);
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
      n === null && (n = e.stateNode = new Zd()), t.forEach(function(r) {
        var l = sf.bind(null, e, r);
        n.has(r) || (n.add(r), r.then(l, l));
      });
    }
  }
  function yt(e, t) {
    var n = t.deletions;
    if (n !== null) for (var r = 0; r < n.length; r++) {
      var l = n[r];
      try {
        var i = e, o = t, d = o;
        e: for (; d !== null; ) {
          switch (d.tag) {
            case 5:
              Ae = d.stateNode, gt = !1;
              break e;
            case 3:
              Ae = d.stateNode.containerInfo, gt = !0;
              break e;
            case 4:
              Ae = d.stateNode.containerInfo, gt = !0;
              break e;
          }
          d = d.return;
        }
        if (Ae === null) throw Error(s(160));
        ka(i, o, l), Ae = null, gt = !1;
        var p = l.alternate;
        p !== null && (p.return = null), l.return = null;
      } catch (y) {
        je(l, t, y);
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
            je(e, e.return, U);
          }
          try {
            kr(5, e, e.return);
          } catch (U) {
            je(e, e.return, U);
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
            je(e, e.return, U);
          }
        }
        if (r & 4 && (l = e.stateNode, l != null)) {
          var i = e.memoizedProps, o = n !== null ? n.memoizedProps : i, d = e.type, p = e.updateQueue;
          if (e.updateQueue = null, p !== null) try {
            d === "input" && i.type === "radio" && i.name != null && Jo(l, i), Zl(d, o);
            var y = Zl(d, i);
            for (o = 0; o < p.length; o += 2) {
              var _ = p[o], z = p[o + 1];
              _ === "style" ? is(l, z) : _ === "dangerouslySetInnerHTML" ? rs(l, z) : _ === "children" ? Bn(l, z) : Te(l, _, z, y);
            }
            switch (d) {
              case "input":
                Ql(l, i);
                break;
              case "textarea":
                es(l, i);
                break;
              case "select":
                var C = l._wrapperState.wasMultiple;
                l._wrapperState.wasMultiple = !!i.multiple;
                var I = i.value;
                I != null ? hn(l, !!i.multiple, I, !1) : C !== !!i.multiple && (i.defaultValue != null ? hn(
                  l,
                  !!i.multiple,
                  i.defaultValue,
                  !0
                ) : hn(l, !!i.multiple, i.multiple ? [] : "", !1));
            }
            l[cr] = i;
          } catch (U) {
            je(e, e.return, U);
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
            je(e, e.return, U);
          }
        }
        break;
      case 3:
        if (yt(t, e), Nt(e), r & 4 && n !== null && n.memoizedState.isDehydrated) try {
          bn(t.containerInfo);
        } catch (U) {
          je(e, e.return, U);
        }
        break;
      case 4:
        yt(t, e), Nt(e);
        break;
      case 13:
        yt(t, e), Nt(e), l = e.child, l.flags & 8192 && (i = l.memoizedState !== null, l.stateNode.isHidden = i, !i || l.alternate !== null && l.alternate.memoizedState !== null || (Eo = Ce())), r & 4 && Sa(e);
        break;
      case 22:
        if (_ = n !== null && n.memoizedState !== null, e.mode & 1 ? (We = (y = We) || _, yt(t, e), We = y) : yt(t, e), Nt(e), r & 8192) {
          if (y = e.memoizedState !== null, (e.stateNode.isHidden = y) && !_ && (e.mode & 1) !== 0) for (F = e, _ = e.child; _ !== null; ) {
            for (z = F = _; F !== null; ) {
              switch (C = F, I = C.child, C.tag) {
                case 0:
                case 11:
                case 14:
                case 15:
                  kr(4, C, C.return);
                  break;
                case 1:
                  Dn(C, C.return);
                  var A = C.stateNode;
                  if (typeof A.componentWillUnmount == "function") {
                    r = C, n = C.return;
                    try {
                      t = r, A.props = t.memoizedProps, A.state = t.memoizedState, A.componentWillUnmount();
                    } catch (U) {
                      je(r, n, U);
                    }
                  }
                  break;
                case 5:
                  Dn(C, C.return);
                  break;
                case 22:
                  if (C.memoizedState !== null) {
                    Ca(z);
                    continue;
                  }
              }
              I !== null ? (I.return = C, F = I) : Ca(z);
            }
            _ = _.sibling;
          }
          e: for (_ = null, z = e; ; ) {
            if (z.tag === 5) {
              if (_ === null) {
                _ = z;
                try {
                  l = z.stateNode, y ? (i = l.style, typeof i.setProperty == "function" ? i.setProperty("display", "none", "important") : i.display = "none") : (d = z.stateNode, p = z.memoizedProps.style, o = p != null && p.hasOwnProperty("display") ? p.display : null, d.style.display = ls("display", o));
                } catch (U) {
                  je(e, e.return, U);
                }
              }
            } else if (z.tag === 6) {
              if (_ === null) try {
                z.stateNode.nodeValue = y ? "" : z.memoizedProps;
              } catch (U) {
                je(e, e.return, U);
              }
            } else if ((z.tag !== 22 && z.tag !== 23 || z.memoizedState === null || z === e) && z.child !== null) {
              z.child.return = z, z = z.child;
              continue;
            }
            if (z === e) break e;
            for (; z.sibling === null; ) {
              if (z.return === null || z.return === e) break e;
              _ === z && (_ = null), z = z.return;
            }
            _ === z && (_ = null), z.sibling.return = z.return, z = z.sibling;
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
            var o = r.stateNode.containerInfo, d = wa(e);
            xo(e, d, o);
            break;
          default:
            throw Error(s(161));
        }
      } catch (p) {
        je(e, e.return, p);
      }
      e.flags &= -3;
    }
    t & 4096 && (e.flags &= -4097);
  }
  function qd(e, t, n) {
    F = e, Na(e);
  }
  function Na(e, t, n) {
    for (var r = (e.mode & 1) !== 0; F !== null; ) {
      var l = F, i = l.child;
      if (l.tag === 22 && r) {
        var o = l.memoizedState !== null || El;
        if (!o) {
          var d = l.alternate, p = d !== null && d.memoizedState !== null || We;
          d = El;
          var y = We;
          if (El = o, (We = p) && !y) for (F = l; F !== null; ) o = F, p = o.child, o.tag === 22 && o.memoizedState !== null ? _a(l) : p !== null ? (p.return = o, F = p) : _a(l);
          for (; i !== null; ) F = i, Na(i), i = i.sibling;
          F = l, El = d, We = y;
        }
        ja(e);
      } else (l.subtreeFlags & 8772) !== 0 && i !== null ? (i.return = l, F = i) : ja(e);
    }
  }
  function ja(e) {
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
              i !== null && Cu(t, i, r);
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
                Cu(t, o, n);
              }
              break;
            case 5:
              var d = t.stateNode;
              if (n === null && t.flags & 4) {
                n = d;
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
                  var _ = y.memoizedState;
                  if (_ !== null) {
                    var z = _.dehydrated;
                    z !== null && bn(z);
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
        } catch (C) {
          je(t, t.return, C);
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
  function Ca(e) {
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
  function _a(e) {
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
              je(t, n, p);
            }
            break;
          case 1:
            var r = t.stateNode;
            if (typeof r.componentDidMount == "function") {
              var l = t.return;
              try {
                r.componentDidMount();
              } catch (p) {
                je(t, l, p);
              }
            }
            var i = t.return;
            try {
              yo(t);
            } catch (p) {
              je(t, i, p);
            }
            break;
          case 5:
            var o = t.return;
            try {
              yo(t);
            } catch (p) {
              je(t, o, p);
            }
        }
      } catch (p) {
        je(t, t.return, p);
      }
      if (t === e) {
        F = null;
        break;
      }
      var d = t.sibling;
      if (d !== null) {
        d.return = t.return, F = d;
        break;
      }
      F = t.return;
    }
  }
  var bd = Math.ceil, jl = me.ReactCurrentDispatcher, ko = me.ReactCurrentOwner, ct = me.ReactCurrentBatchConfig, ae = 0, Fe = null, Pe = null, $e = 0, lt = 0, Fn = Ut(0), Re = 0, Sr = null, un = 0, Cl = 0, So = 0, Er = null, qe = null, Eo = 0, On = 1 / 0, Rt = null, _l = !1, No = null, Kt = null, Pl = !1, Gt = null, Tl = 0, Nr = 0, jo = null, zl = -1, Ml = 0;
  function Ke() {
    return (ae & 6) !== 0 ? Ce() : zl !== -1 ? zl : zl = Ce();
  }
  function Yt(e) {
    return (e.mode & 1) === 0 ? 1 : (ae & 2) !== 0 && $e !== 0 ? $e & -$e : Fd.transition !== null ? (Ml === 0 && (Ml = ws()), Ml) : (e = fe, e !== 0 || (e = window.event, e = e === void 0 ? 16 : Ts(e.type)), e);
  }
  function xt(e, t, n, r) {
    if (50 < Nr) throw Nr = 0, jo = null, Error(s(185));
    Yn(e, n, r), ((ae & 2) === 0 || e !== Fe) && (e === Fe && ((ae & 2) === 0 && (Cl |= n), Re === 4 && Xt(e, $e)), be(e, r), n === 1 && ae === 0 && (t.mode & 1) === 0 && (On = Ce() + 500, il && Bt()));
  }
  function be(e, t) {
    var n = e.callbackNode;
    Fc(e, t);
    var r = Ur(e, e === Fe ? $e : 0);
    if (r === 0) n !== null && gs(n), e.callbackNode = null, e.callbackPriority = 0;
    else if (t = r & -r, e.callbackPriority !== t) {
      if (n != null && gs(n), t === 1) e.tag === 0 ? Dd(Ta.bind(null, e)) : hu(Ta.bind(null, e)), Md(function() {
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
        n = Oa(n, Pa.bind(null, e));
      }
      e.callbackPriority = t, e.callbackNode = n;
    }
  }
  function Pa(e, t) {
    if (zl = -1, Ml = 0, (ae & 6) !== 0) throw Error(s(327));
    var n = e.callbackNode;
    if (An() && e.callbackNode !== n) return null;
    var r = Ur(e, e === Fe ? $e : 0);
    if (r === 0) return null;
    if ((r & 30) !== 0 || (r & e.expiredLanes) !== 0 || t) t = Rl(e, r);
    else {
      t = r;
      var l = ae;
      ae |= 2;
      var i = Ma();
      (Fe !== e || $e !== t) && (Rt = null, On = Ce() + 500, cn(e, t));
      do
        try {
          nf();
          break;
        } catch (d) {
          za(e, d);
        }
      while (!0);
      Bi(), jl.current = i, ae = l, Pe !== null ? t = 0 : (Fe = null, $e = 0, t = Re);
    }
    if (t !== 0) {
      if (t === 2 && (l = li(e), l !== 0 && (r = l, t = Co(e, l))), t === 1) throw n = Sr, cn(e, 0), Xt(e, r), be(e, Ce()), n;
      if (t === 6) Xt(e, r);
      else {
        if (l = e.current.alternate, (r & 30) === 0 && !ef(l) && (t = Rl(e, r), t === 2 && (i = li(e), i !== 0 && (r = i, t = Co(e, i))), t === 1)) throw n = Sr, cn(e, 0), Xt(e, r), be(e, Ce()), n;
        switch (e.finishedWork = l, e.finishedLanes = r, t) {
          case 0:
          case 1:
            throw Error(s(345));
          case 2:
            dn(e, qe, Rt);
            break;
          case 3:
            if (Xt(e, r), (r & 130023424) === r && (t = Eo + 500 - Ce(), 10 < t)) {
              if (Ur(e, 0) !== 0) break;
              if (l = e.suspendedLanes, (l & r) !== r) {
                Ke(), e.pingedLanes |= e.suspendedLanes & l;
                break;
              }
              e.timeoutHandle = Mi(dn.bind(null, e, qe, Rt), t);
              break;
            }
            dn(e, qe, Rt);
            break;
          case 4:
            if (Xt(e, r), (r & 4194240) === r) break;
            for (t = e.eventTimes, l = -1; 0 < r; ) {
              var o = 31 - pt(r);
              i = 1 << o, o = t[o], o > l && (l = o), r &= ~i;
            }
            if (r = l, r = Ce() - r, r = (120 > r ? 120 : 480 > r ? 480 : 1080 > r ? 1080 : 1920 > r ? 1920 : 3e3 > r ? 3e3 : 4320 > r ? 4320 : 1960 * bd(r / 1960)) - r, 10 < r) {
              e.timeoutHandle = Mi(dn.bind(null, e, qe, Rt), r);
              break;
            }
            dn(e, qe, Rt);
            break;
          case 5:
            dn(e, qe, Rt);
            break;
          default:
            throw Error(s(329));
        }
      }
    }
    return be(e, Ce()), e.callbackNode === n ? Pa.bind(null, e) : null;
  }
  function Co(e, t) {
    var n = Er;
    return e.current.memoizedState.isDehydrated && (cn(e, t).flags |= 256), e = Rl(e, t), e !== 2 && (t = qe, qe = n, t !== null && _o(t)), e;
  }
  function _o(e) {
    qe === null ? qe = e : qe.push.apply(qe, e);
  }
  function ef(e) {
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
    for (t &= ~So, t &= ~Cl, e.suspendedLanes |= t, e.pingedLanes &= ~t, e = e.expirationTimes; 0 < t; ) {
      var n = 31 - pt(t), r = 1 << n;
      e[n] = -1, t &= ~r;
    }
  }
  function Ta(e) {
    if ((ae & 6) !== 0) throw Error(s(327));
    An();
    var t = Ur(e, 0);
    if ((t & 1) === 0) return be(e, Ce()), null;
    var n = Rl(e, t);
    if (e.tag !== 0 && n === 2) {
      var r = li(e);
      r !== 0 && (t = r, n = Co(e, r));
    }
    if (n === 1) throw n = Sr, cn(e, 0), Xt(e, t), be(e, Ce()), n;
    if (n === 6) throw Error(s(345));
    return e.finishedWork = e.current.alternate, e.finishedLanes = t, dn(e, qe, Rt), be(e, Ce()), null;
  }
  function Po(e, t) {
    var n = ae;
    ae |= 1;
    try {
      return e(t);
    } finally {
      ae = n, ae === 0 && (On = Ce() + 500, il && Bt());
    }
  }
  function an(e) {
    Gt !== null && Gt.tag === 0 && (ae & 6) === 0 && An();
    var t = ae;
    ae |= 1;
    var n = ct.transition, r = fe;
    try {
      if (ct.transition = null, fe = 1, e) return e();
    } finally {
      fe = r, ct.transition = n, ae = t, (ae & 6) === 0 && Bt();
    }
  }
  function To() {
    lt = Fn.current, ge(Fn);
  }
  function cn(e, t) {
    e.finishedWork = null, e.finishedLanes = 0;
    var n = e.timeoutHandle;
    if (n !== -1 && (e.timeoutHandle = -1, zd(n)), Pe !== null) for (n = Pe.return; n !== null; ) {
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
    if (Fe = e, Pe = e = Zt(e.current, null), $e = lt = t, Re = 0, Sr = null, So = Cl = un = 0, qe = Er = null, ln !== null) {
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
  function za(e, t) {
    do {
      var n = Pe;
      try {
        if (Bi(), ml.current = xl, vl) {
          for (var r = Ee.memoizedState; r !== null; ) {
            var l = r.queue;
            l !== null && (l.pending = null), r = r.next;
          }
          vl = !1;
        }
        if (sn = 0, De = Me = Ee = null, vr = !1, gr = 0, ko.current = null, n === null || n.return === null) {
          Re = 1, Sr = t, Pe = null;
          break;
        }
        e: {
          var i = e, o = n.return, d = n, p = t;
          if (t = $e, d.flags |= 32768, p !== null && typeof p == "object" && typeof p.then == "function") {
            var y = p, _ = d, z = _.tag;
            if ((_.mode & 1) === 0 && (z === 0 || z === 11 || z === 15)) {
              var C = _.alternate;
              C ? (_.updateQueue = C.updateQueue, _.memoizedState = C.memoizedState, _.lanes = C.lanes) : (_.updateQueue = null, _.memoizedState = null);
            }
            var I = ta(o);
            if (I !== null) {
              I.flags &= -257, na(I, o, d, i, t), I.mode & 1 && ea(i, y, t), t = I, p = y;
              var A = t.updateQueue;
              if (A === null) {
                var U = /* @__PURE__ */ new Set();
                U.add(p), t.updateQueue = U;
              } else A.add(p);
              break e;
            } else {
              if ((t & 1) === 0) {
                ea(i, y, t), zo();
                break e;
              }
              p = Error(s(426));
            }
          } else if (ke && d.mode & 1) {
            var _e = ta(o);
            if (_e !== null) {
              (_e.flags & 65536) === 0 && (_e.flags |= 256), na(_e, o, d, i, t), Ui(In(p, d));
              break e;
            }
          }
          i = p = In(p, d), Re !== 4 && (Re = 2), Er === null ? Er = [i] : Er.push(i), i = o;
          do {
            switch (i.tag) {
              case 3:
                i.flags |= 65536, t &= -t, i.lanes |= t;
                var m = qu(i, p, t);
                ju(i, m);
                break e;
              case 1:
                d = p;
                var h = i.type, g = i.stateNode;
                if ((i.flags & 128) === 0 && (typeof h.getDerivedStateFromError == "function" || g !== null && typeof g.componentDidCatch == "function" && (Kt === null || !Kt.has(g)))) {
                  i.flags |= 65536, t &= -t, i.lanes |= t;
                  var M = bu(i, d, t);
                  ju(i, M);
                  break e;
                }
            }
            i = i.return;
          } while (i !== null);
        }
        La(n);
      } catch (B) {
        t = B, Pe === n && n !== null && (Pe = n = n.return);
        continue;
      }
      break;
    } while (!0);
  }
  function Ma() {
    var e = jl.current;
    return jl.current = xl, e === null ? xl : e;
  }
  function zo() {
    (Re === 0 || Re === 3 || Re === 2) && (Re = 4), Fe === null || (un & 268435455) === 0 && (Cl & 268435455) === 0 || Xt(Fe, $e);
  }
  function Rl(e, t) {
    var n = ae;
    ae |= 2;
    var r = Ma();
    (Fe !== e || $e !== t) && (Rt = null, cn(e, t));
    do
      try {
        tf();
        break;
      } catch (l) {
        za(e, l);
      }
    while (!0);
    if (Bi(), ae = n, jl.current = r, Pe !== null) throw Error(s(261));
    return Fe = null, $e = 0, Re;
  }
  function tf() {
    for (; Pe !== null; ) Ra(Pe);
  }
  function nf() {
    for (; Pe !== null && !_c(); ) Ra(Pe);
  }
  function Ra(e) {
    var t = Fa(e.alternate, e, lt);
    e.memoizedProps = e.pendingProps, t === null ? La(e) : Pe = t, ko.current = null;
  }
  function La(e) {
    var t = e;
    do {
      var n = t.alternate;
      if (e = t.return, (t.flags & 32768) === 0) {
        if (n = Yd(n, t, lt), n !== null) {
          Pe = n;
          return;
        }
      } else {
        if (n = Xd(n, t), n !== null) {
          n.flags &= 32767, Pe = n;
          return;
        }
        if (e !== null) e.flags |= 32768, e.subtreeFlags = 0, e.deletions = null;
        else {
          Re = 6, Pe = null;
          return;
        }
      }
      if (t = t.sibling, t !== null) {
        Pe = t;
        return;
      }
      Pe = t = e;
    } while (t !== null);
    Re === 0 && (Re = 5);
  }
  function dn(e, t, n) {
    var r = fe, l = ct.transition;
    try {
      ct.transition = null, fe = 1, rf(e, t, n, r);
    } finally {
      ct.transition = l, fe = r;
    }
    return null;
  }
  function rf(e, t, n, r) {
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
    if (Oc(e, i), e === Fe && (Pe = Fe = null, $e = 0), (n.subtreeFlags & 2064) === 0 && (n.flags & 2064) === 0 || Pl || (Pl = !0, Oa(Fr, function() {
      return An(), null;
    })), i = (n.flags & 15990) !== 0, (n.subtreeFlags & 15990) !== 0 || i) {
      i = ct.transition, ct.transition = null;
      var o = fe;
      fe = 1;
      var d = ae;
      ae |= 4, ko.current = null, Jd(e, n), Ea(n, e), Ed(Ti), Vr = !!Pi, Ti = Pi = null, e.current = n, qd(n), Pc(), ae = d, fe = o, ct.transition = i;
    } else e.current = n;
    if (Pl && (Pl = !1, Gt = e, Tl = l), i = e.pendingLanes, i === 0 && (Kt = null), Mc(n.stateNode), be(e, Ce()), t !== null) for (r = e.onRecoverableError, n = 0; n < t.length; n++) l = t[n], r(l.value, { componentStack: l.stack, digest: l.digest });
    if (_l) throw _l = !1, e = No, No = null, e;
    return (Tl & 1) !== 0 && e.tag !== 0 && An(), i = e.pendingLanes, (i & 1) !== 0 ? e === jo ? Nr++ : (Nr = 0, jo = e) : Nr = 0, Bt(), null;
  }
  function An() {
    if (Gt !== null) {
      var e = ks(Tl), t = ct.transition, n = fe;
      try {
        if (ct.transition = null, fe = 16 > e ? 16 : e, Gt === null) var r = !1;
        else {
          if (e = Gt, Gt = null, Tl = 0, (ae & 6) !== 0) throw Error(s(331));
          var l = ae;
          for (ae |= 4, F = e.current; F !== null; ) {
            var i = F, o = i.child;
            if ((F.flags & 16) !== 0) {
              var d = i.deletions;
              if (d !== null) {
                for (var p = 0; p < d.length; p++) {
                  var y = d[p];
                  for (F = y; F !== null; ) {
                    var _ = F;
                    switch (_.tag) {
                      case 0:
                      case 11:
                      case 15:
                        kr(8, _, i);
                    }
                    var z = _.child;
                    if (z !== null) z.return = _, F = z;
                    else for (; F !== null; ) {
                      _ = F;
                      var C = _.sibling, I = _.return;
                      if (ya(_), _ === y) {
                        F = null;
                        break;
                      }
                      if (C !== null) {
                        C.return = I, F = C;
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
                      var _e = U.sibling;
                      U.sibling = null, U = _e;
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
              if (d = F, (d.flags & 2048) !== 0) try {
                switch (d.tag) {
                  case 0:
                  case 11:
                  case 15:
                    Nl(9, d);
                }
              } catch (B) {
                je(d, d.return, B);
              }
              if (d === o) {
                F = null;
                break e;
              }
              var M = d.sibling;
              if (M !== null) {
                M.return = d.return, F = M;
                break e;
              }
              F = d.return;
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
        fe = n, ct.transition = t;
      }
    }
    return !1;
  }
  function Ia(e, t, n) {
    t = In(n, t), t = qu(e, t, 1), e = Wt(e, t, 1), t = Ke(), e !== null && (Yn(e, 1, t), be(e, t));
  }
  function je(e, t, n) {
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
  function lf(e, t, n) {
    var r = e.pingCache;
    r !== null && r.delete(t), t = Ke(), e.pingedLanes |= e.suspendedLanes & n, Fe === e && ($e & n) === n && (Re === 4 || Re === 3 && ($e & 130023424) === $e && 500 > Ce() - Eo ? cn(e, 0) : So |= n), be(e, t);
  }
  function Da(e, t) {
    t === 0 && ((e.mode & 1) === 0 ? t = 1 : (t = $r, $r <<= 1, ($r & 130023424) === 0 && ($r = 4194304)));
    var n = Ke();
    e = Tt(e, t), e !== null && (Yn(e, t, n), be(e, n));
  }
  function of(e) {
    var t = e.memoizedState, n = 0;
    t !== null && (n = t.retryLane), Da(e, n);
  }
  function sf(e, t) {
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
      if ((e.lanes & n) === 0 && (t.flags & 128) === 0) return Je = !1, Gd(e, t, n);
      Je = (e.flags & 131072) !== 0;
    }
    else Je = !1, ke && (t.flags & 1048576) !== 0 && mu(t, sl, t.index);
    switch (t.lanes = 0, t.tag) {
      case 2:
        var r = t.type;
        Sl(e, t), e = t.pendingProps;
        var l = Cn(t, He.current);
        Rn(t, n), l = bi(null, t, r, e, l, n);
        var i = eo();
        return t.flags |= 1, typeof l == "object" && l !== null && typeof l.render == "function" && l.$$typeof === void 0 ? (t.tag = 1, t.memoizedState = null, t.updateQueue = null, Ze(r) ? (i = !0, ll(t)) : i = !1, t.memoizedState = l.state !== null && l.state !== void 0 ? l.state : null, Ki(t), l.updater = wl, t.stateNode = l, l._reactInternals = t, oo(t, r, e, n), t = co(null, t, r, !0, i, n)) : (t.tag = 0, ke && i && Fi(t), Qe(null, t, l, n), t = t.child), t;
      case 16:
        r = t.elementType;
        e: {
          switch (Sl(e, t), e = t.pendingProps, l = r._init, r = l(r._payload), t.type = r, l = t.tag = af(r), e = vt(r, e), l) {
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
              t = Mt(e, t, n);
              break e;
            }
            Qe(e, t, r, n);
          }
          t = t.child;
        }
        return t;
      case 5:
        return _u(t), e === null && $i(t), r = t.type, l = t.pendingProps, i = e !== null ? e.memoizedProps : null, o = l.children, zi(r, l) ? o = null : i !== null && zi(r, i) && (t.flags |= 32), sa(e, t), Qe(e, t, o, n), t.child;
      case 6:
        return e === null && $i(t), null;
      case 13:
        return da(e, t, n);
      case 4:
        return Gi(t, t.stateNode.containerInfo), r = t.pendingProps, e === null ? t.child = zn(t, null, r, n) : Qe(e, t, r, n), t.child;
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
              t = Mt(e, t, n);
              break e;
            }
          } else for (i = t.child, i !== null && (i.return = t); i !== null; ) {
            var d = i.dependencies;
            if (d !== null) {
              o = i.child;
              for (var p = d.firstContext; p !== null; ) {
                if (p.context === r) {
                  if (i.tag === 1) {
                    p = zt(-1, n & -n), p.tag = 2;
                    var y = i.updateQueue;
                    if (y !== null) {
                      y = y.shared;
                      var _ = y.pending;
                      _ === null ? p.next = p : (p.next = _.next, _.next = p), y.pending = p;
                    }
                  }
                  i.lanes |= n, p = i.alternate, p !== null && (p.lanes |= n), Wi(
                    i.return,
                    n,
                    t
                  ), d.lanes |= n;
                  break;
                }
                p = p.next;
              }
            } else if (i.tag === 10) o = i.type === t.type ? null : i.child;
            else if (i.tag === 18) {
              if (o = i.return, o === null) throw Error(s(341));
              o.lanes |= n, d = o.alternate, d !== null && (d.lanes |= n), Wi(o, n, t), o = i.sibling;
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
        return l = t.type, r = t.pendingProps.children, Rn(t, n), l = ut(l), r = r(l), t.flags |= 1, Qe(e, t, r, n), t.child;
      case 14:
        return r = t.type, l = vt(r, t.pendingProps), l = vt(r.type, l), la(e, t, r, l, n);
      case 15:
        return ia(e, t, t.type, t.pendingProps, n);
      case 17:
        return r = t.type, l = t.pendingProps, l = t.elementType === r ? l : vt(r, l), Sl(e, t), t.tag = 1, Ze(r) ? (e = !0, ll(t)) : e = !1, Rn(t, n), Zu(t, r, l), oo(t, r, l, n), co(null, t, r, !0, e, n);
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
  function uf(e, t, n, r) {
    this.tag = e, this.key = n, this.sibling = this.child = this.return = this.stateNode = this.type = this.elementType = null, this.index = 0, this.ref = null, this.pendingProps = t, this.dependencies = this.memoizedState = this.updateQueue = this.memoizedProps = null, this.mode = r, this.subtreeFlags = this.flags = 0, this.deletions = null, this.childLanes = this.lanes = 0, this.alternate = null;
  }
  function dt(e, t, n, r) {
    return new uf(e, t, n, r);
  }
  function Mo(e) {
    return e = e.prototype, !(!e || !e.isReactComponent);
  }
  function af(e) {
    if (typeof e == "function") return Mo(e) ? 1 : 0;
    if (e != null) {
      if (e = e.$$typeof, e === re) return 11;
      if (e === Ye) return 14;
    }
    return 2;
  }
  function Zt(e, t) {
    var n = e.alternate;
    return n === null ? (n = dt(e.tag, t, e.key, e.mode), n.elementType = e.elementType, n.type = e.type, n.stateNode = e.stateNode, n.alternate = e, e.alternate = n) : (n.pendingProps = t, n.type = e.type, n.flags = 0, n.subtreeFlags = 0, n.deletions = null), n.flags = e.flags & 14680064, n.childLanes = e.childLanes, n.lanes = e.lanes, n.child = e.child, n.memoizedProps = e.memoizedProps, n.memoizedState = e.memoizedState, n.updateQueue = e.updateQueue, t = e.dependencies, n.dependencies = t === null ? null : { lanes: t.lanes, firstContext: t.firstContext }, n.sibling = e.sibling, n.index = e.index, n.ref = e.ref, n;
  }
  function Ll(e, t, n, r, l, i) {
    var o = 2;
    if (r = e, typeof e == "function") Mo(e) && (o = 1);
    else if (typeof e == "string") o = 5;
    else e: switch (e) {
      case ue:
        return fn(n.children, l, i, t);
      case O:
        o = 8, l |= 8;
        break;
      case le:
        return e = dt(12, n, t, l | 2), e.elementType = le, e.lanes = i, e;
      case xe:
        return e = dt(13, n, t, l), e.elementType = xe, e.lanes = i, e;
      case Ge:
        return e = dt(19, n, t, l), e.elementType = Ge, e.lanes = i, e;
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
    return t = dt(o, n, t, l), t.elementType = e, t.type = r, t.lanes = i, t;
  }
  function fn(e, t, n, r) {
    return e = dt(7, e, r, t), e.lanes = n, e;
  }
  function Il(e, t, n, r) {
    return e = dt(22, e, r, t), e.elementType = we, e.lanes = n, e.stateNode = { isHidden: !1 }, e;
  }
  function Ro(e, t, n) {
    return e = dt(6, e, null, t), e.lanes = n, e;
  }
  function Lo(e, t, n) {
    return t = dt(4, e.children !== null ? e.children : [], e.key, t), t.lanes = n, t.stateNode = { containerInfo: e.containerInfo, pendingChildren: null, implementation: e.implementation }, t;
  }
  function cf(e, t, n, r, l) {
    this.tag = t, this.containerInfo = e, this.finishedWork = this.pingCache = this.current = this.pendingChildren = null, this.timeoutHandle = -1, this.callbackNode = this.pendingContext = this.context = null, this.callbackPriority = 0, this.eventTimes = ii(0), this.expirationTimes = ii(-1), this.entangledLanes = this.finishedLanes = this.mutableReadLanes = this.expiredLanes = this.pingedLanes = this.suspendedLanes = this.pendingLanes = 0, this.entanglements = ii(0), this.identifierPrefix = r, this.onRecoverableError = l, this.mutableSourceEagerHydrationData = null;
  }
  function Io(e, t, n, r, l, i, o, d, p) {
    return e = new cf(e, t, n, d, p), t === 1 ? (t = 1, i === !0 && (t |= 8)) : t = 0, i = dt(3, null, null, t), e.current = i, i.stateNode = e, i.memoizedState = { element: r, isDehydrated: n, cache: null, transitions: null, pendingSuspenseBoundaries: null }, Ki(i), e;
  }
  function df(e, t, n) {
    var r = 3 < arguments.length && arguments[3] !== void 0 ? arguments[3] : null;
    return { $$typeof: de, key: r == null ? null : "" + r, children: e, containerInfo: t, implementation: n };
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
      if (Ze(n)) return fu(e, n, t);
    }
    return t;
  }
  function $a(e, t, n, r, l, i, o, d, p) {
    return e = Io(n, r, !0, e, l, i, o, d, p), e.context = Aa(null), n = e.current, r = Ke(), l = Yt(n), i = zt(r, l), i.callback = t ?? null, Wt(n, i, l), e.current.lanes = l, Yn(e, l, r), be(e, r), e;
  }
  function Dl(e, t, n, r) {
    var l = t.current, i = Ke(), o = Yt(l);
    return n = Aa(n), t.context === null ? t.context = n : t.pendingContext = n, t = zt(i, o), t.payload = { element: e }, r = r === void 0 ? null : r, r !== null && (t.callback = r), e = Wt(l, t, o), e !== null && (xt(e, l, o, i), fl(e, l, o)), o;
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
  function ff() {
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
      }), t[jt] = null;
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
      Ft.splice(n, 0, e), n === 0 && _s(e);
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
  function pf(e, t, n, r, l) {
    if (l) {
      if (typeof r == "function") {
        var i = r;
        r = function() {
          var y = Fl(o);
          i.call(y);
        };
      }
      var o = $a(t, r, e, 0, null, !1, !1, "", Ba);
      return e._reactRootContainer = o, e[jt] = o.current, ur(e.nodeType === 8 ? e.parentNode : e), an(), o;
    }
    for (; l = e.lastChild; ) e.removeChild(l);
    if (typeof r == "function") {
      var d = r;
      r = function() {
        var y = Fl(p);
        d.call(y);
      };
    }
    var p = Io(e, 0, !1, null, null, !1, !1, "", Ba);
    return e._reactRootContainer = p, e[jt] = p.current, ur(e.nodeType === 8 ? e.parentNode : e), an(function() {
      Dl(t, p, n, r);
    }), p;
  }
  function $l(e, t, n, r, l) {
    var i = n._reactRootContainer;
    if (i) {
      var o = i;
      if (typeof l == "function") {
        var d = l;
        l = function() {
          var p = Fl(o);
          d.call(p);
        };
      }
      Dl(t, o, e, l);
    } else o = pf(n, t, e, l, r);
    return Fl(o);
  }
  Ss = function(e) {
    switch (e.tag) {
      case 3:
        var t = e.stateNode;
        if (t.current.memoizedState.isDehydrated) {
          var n = Gn(t.pendingLanes);
          n !== 0 && (oi(t, n | 1), be(t, Ce()), (ae & 6) === 0 && (On = Ce() + 500, Bt()));
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
    return fe;
  }, js = function(e, t) {
    var n = fe;
    try {
      return fe = e, t();
    } finally {
      fe = n;
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
  }, as = Po, cs = an;
  var hf = { usingClientEntryPoint: !1, Events: [dr, Nn, nl, ss, us, Po] }, jr = { findFiberByHostInstance: en, bundleType: 0, version: "18.3.1", rendererPackageName: "react-dom" }, mf = { bundleType: jr.bundleType, version: jr.version, rendererPackageName: jr.rendererPackageName, rendererConfig: jr.rendererConfig, overrideHookState: null, overrideHookStateDeletePath: null, overrideHookStateRenamePath: null, overrideProps: null, overridePropsDeletePath: null, overridePropsRenamePath: null, setErrorHandler: null, setSuspenseHandler: null, scheduleUpdate: null, currentDispatcherRef: me.ReactCurrentDispatcher, findHostInstanceByFiber: function(e) {
    return e = hs(e), e === null ? null : e.stateNode;
  }, findFiberByHostInstance: jr.findFiberByHostInstance || ff, findHostInstancesForRefresh: null, scheduleRefresh: null, scheduleRoot: null, setRefreshHandler: null, getCurrentFiber: null, reconcilerVersion: "18.3.1-next-f1338f8080-20240426" };
  if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u") {
    var Ul = __REACT_DEVTOOLS_GLOBAL_HOOK__;
    if (!Ul.isDisabled && Ul.supportsFiber) try {
      Or = Ul.inject(mf), wt = Ul;
    } catch {
    }
  }
  return et.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = hf, et.createPortal = function(e, t) {
    var n = 2 < arguments.length && arguments[2] !== void 0 ? arguments[2] : null;
    if (!Oo(t)) throw Error(s(200));
    return df(e, t, null, n);
  }, et.createRoot = function(e, t) {
    if (!Oo(e)) throw Error(s(299));
    var n = !1, r = "", l = Ha;
    return t != null && (t.unstable_strictMode === !0 && (n = !0), t.identifierPrefix !== void 0 && (r = t.identifierPrefix), t.onRecoverableError !== void 0 && (l = t.onRecoverableError)), t = Io(e, 1, !1, null, null, n, !1, r, l), e[jt] = t.current, ur(e.nodeType === 8 ? e.parentNode : e), new Fo(t);
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
    if (n != null && (n.unstable_strictMode === !0 && (l = !0), n.identifierPrefix !== void 0 && (i = n.identifierPrefix), n.onRecoverableError !== void 0 && (o = n.onRecoverableError)), t = $a(t, null, e, 1, n ?? null, l, !1, i, o), e[jt] = t.current, ur(e), r) for (e = 0; e < r.length; e++) n = r[e], l = n._getVersion, l = l(n._source), t.mutableSourceEagerHydrationData == null ? t.mutableSourceEagerHydrationData = [n, l] : t.mutableSourceEagerHydrationData.push(
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
        e._reactRootContainer = null, e[jt] = null;
      });
    }), !0) : !1;
  }, et.unstable_batchedUpdates = Po, et.unstable_renderSubtreeIntoContainer = function(e, t, n, r) {
    if (!Al(n)) throw Error(s(200));
    if (e == null || e._reactInternals === void 0) throw Error(s(38));
    return $l(e, t, n, !1, r);
  }, et.version = "18.3.1-next-f1338f8080-20240426", et;
}
var Za;
function jf() {
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
  return a(), Uo.exports = Nf(), Uo.exports;
}
var Ja;
function Cf() {
  if (Ja) return Hl;
  Ja = 1;
  var a = jf();
  return Hl.createRoot = a.createRoot, Hl.hydrateRoot = a.hydrateRoot, Hl;
}
var _f = Cf();
const Pf = ':host{--fc-text: var(--primary-text-color, #2b1e15);--fc-muted: var(--secondary-text-color, #786350);--fc-accent: var(--faith-accent, #b8862f);--fc-line: var(--divider-color, rgba(0,0,0,.12));--fc-bg2: var(--secondary-background-color, rgba(0,0,0,.04));--fc-ok: var(--success-color, #43a047);--fc-err: var(--error-color, #db4437);--fc-soft: color-mix(in srgb, var(--fc-accent) 14%, transparent);display:block;--fc-hex: polygon(50% 0, 93.3% 25%, 93.3% 75%, 50% 100%, 6.7% 75%, 6.7% 25%);--fc-serif: var(--faith-serif, "Fraunces Variable", Georgia, "Iowan Old Style", serif)}*{box-sizing:border-box}ha-card{padding:16px;color:var(--fc-text)}.head{display:flex;align-items:center;gap:10px;margin-bottom:12px}.head h2{margin:0;font-size:1.25rem;font-weight:600;line-height:1.2}.head .sub{color:var(--fc-muted);font-size:.85rem}.head .right{margin-left:auto;display:flex;gap:6px;align-items:center}.eyebrow{font-size:.72rem;letter-spacing:.12em;text-transform:uppercase;color:var(--fc-muted)}.hello{font-family:var(--fc-serif);margin:2px 0 14px;font-size:1.6rem;font-weight:600;line-height:1.15}.hello em{color:var(--fc-accent);font-style:italic}.section{padding:12px 0;border-top:1px solid var(--fc-line)}.section:first-of-type{border-top:0;padding-top:0}.section h3{display:flex;align-items:center;gap:8px;margin:0 0 8px;font-size:1rem;font-weight:600}.section h3 ha-icon{--mdc-icon-size: 20px;color:var(--fc-accent)}.count{background:var(--fc-bg2);color:var(--fc-muted);border-radius:999px;padding:0 8px;font-size:.8rem;font-weight:500}ul{list-style:none;margin:0;padding:0}.row{display:flex;align-items:center;gap:10px;padding:7px 0;border-bottom:1px solid var(--fc-line)}.row:last-child{border-bottom:0}.time{min-width:70px;color:var(--fc-muted);font-variant-numeric:tabular-nums}.grow{flex:1;min-width:0}.meta{color:var(--fc-muted);font-size:.85rem}.label{font-size:.72rem;letter-spacing:.1em;text-transform:uppercase;color:var(--fc-muted)}.check{width:18px;height:18px;border-radius:50%;border:2px solid var(--fc-line);flex:none}.check.done{background:var(--fc-ok);border-color:var(--fc-ok)}.tiles{display:grid;grid-template-columns:repeat(auto-fill,minmax(120px,1fr));gap:8px}.tile{background:var(--fc-bg2);border-radius:12px;padding:10px 12px}.tile .v{font-size:1.15rem;font-weight:600;text-transform:capitalize}.empty{color:var(--fc-muted);padding:4px 0}.err{color:var(--fc-err)}button{font:inherit;color:inherit;cursor:pointer;white-space:nowrap;border:1px solid var(--fc-line);background:var(--fc-bg2);border-radius:10px;padding:8px 14px;min-height:44px}button:focus-visible,a:focus-visible,input:focus-visible{outline:2px solid var(--fc-accent);outline-offset:2px}button.primary{background:var(--fc-accent);border-color:var(--fc-accent);color:var(--faith-accent-text, #fffaf0)}button.ghost{background:transparent;border-color:transparent;color:var(--fc-muted)}button:disabled{opacity:.5;cursor:default}.btns{display:flex;gap:6px;flex-wrap:wrap}input{font:inherit;color:var(--fc-text);background:var(--fc-bg2);border:1px solid var(--fc-line);border-radius:10px;padding:8px 12px;min-height:44px;width:100%}input:focus{outline:2px solid var(--fc-accent);outline-offset:-1px}.avatar{display:inline-grid;place-items:center;color:#fff;font-weight:600;flex:none;clip-path:var(--fc-hex)}.hexring{display:inline-grid;place-items:center;padding:3px;background:var(--fc-accent);clip-path:var(--fc-hex);flex:none}.people{display:grid;grid-template-columns:repeat(auto-fill,minmax(96px,1fr));gap:10px}.person{display:flex;flex-direction:column;align-items:center;gap:8px;padding:14px 8px;border-radius:14px;border:1px solid var(--fc-line);background:transparent;font-weight:600}.person.suggested{border:2px solid var(--fc-accent)}.pin{display:flex;flex-direction:column;align-items:center;gap:12px}.dots{display:flex;gap:10px}.dots span{width:13px;height:13px;border-radius:50%;border:2px solid var(--fc-muted)}.dots span.on{background:var(--fc-accent);border-color:var(--fc-accent)}.keys{display:grid;grid-template-columns:repeat(3,68px);gap:8px}.keys button{height:58px;font-size:1.35rem;border-radius:14px}.chat{display:flex;flex-direction:column;gap:10px;max-height:var(--faith-chat-height, 420px);overflow-y:auto;padding:2px}.msg{max-width:88%;padding:9px 13px;border-radius:16px;white-space:pre-wrap;line-height:1.4}.msg.me{align-self:flex-end;background:var(--fc-accent);color:var(--faith-accent-text, #fffaf0);border-bottom-right-radius:4px}.msg.faith{align-self:flex-start;background:var(--fc-bg2);border-bottom-left-radius:4px}.chips{display:flex;gap:4px;flex-wrap:wrap}.chip{font-size:.75rem;color:var(--fc-muted);border:1px solid var(--fc-line);border-radius:999px;padding:1px 8px}.ask{display:flex;gap:6px;margin-top:10px;align-items:center}.ask button{min-width:44px;padding:8px 10px}.rec{background:var(--fc-err)!important;color:#fff!important;border-color:var(--fc-err)!important}.box{border:1px solid var(--fc-accent);border-radius:14px;padding:10px 12px;display:flex;flex-direction:column;gap:8px}.box.wait{border-style:dashed}.big{font-size:2.6rem;font-weight:700;line-height:1}.pill{background:var(--fc-soft);color:var(--fc-accent);border-radius:999px;padding:2px 10px;font-weight:600;font-size:.85rem;white-space:nowrap}.toast{color:var(--fc-muted);font-size:.85rem}.toast:empty,.err:empty{display:none}.apps{display:flex;gap:8px;flex-wrap:wrap}.apps a{text-decoration:none;color:inherit;display:flex;align-items:center;gap:8px;border:1px solid var(--fc-line);border-radius:12px;padding:6px 12px 6px 8px}.emblem{flex:none;margin:-6px -2px -6px -6px}.mine{display:flex;align-items:center;gap:16px}.honey{display:grid;place-items:center;align-content:center;width:104px;height:112px;flex:none;clip-path:var(--fc-hex);background:linear-gradient(160deg,color-mix(in srgb,var(--fc-accent) 70%,#fff),var(--fc-accent));color:var(--faith-accent-text, #fffaf0)}.honey .label{color:inherit;opacity:.85}ha-card.hub{position:relative;overflow:hidden;padding:22px 22px 18px;background:radial-gradient(90% 60% at 50% 45%,color-mix(in srgb,var(--fc-accent) 14%,transparent),transparent 70%),var(--ha-card-background, var(--card-background-color, transparent))}.hub-top{display:flex;align-items:flex-start;gap:12px}.hub-top .right{margin-left:auto;display:flex;gap:8px;align-items:center;flex-wrap:wrap;justify-content:flex-end}.clock{font-family:var(--fc-serif);font-size:3.2rem;font-weight:600;line-height:1;letter-spacing:-.02em;font-variant-numeric:tabular-nums}.hub-mid{display:flex;flex-direction:column;align-items:center;text-align:center;gap:6px;margin:8px 0 10px}.hub-mid .hello{margin:0}button.orb{background:none;border:0;padding:0;min-height:0;border-radius:50%;margin:-8px 0}button.orb:focus-visible{outline:2px solid var(--fc-accent);outline-offset:-12px}button.orb:disabled{opacity:1}.hint{font-size:.72rem;letter-spacing:.16em;text-transform:uppercase;color:var(--fc-accent);font-weight:600}.heard{color:var(--fc-muted);font-style:italic}.reply{font-family:var(--fc-serif);font-size:1.3rem;line-height:1.4;max-width:34em;white-space:pre-wrap}.hub-mid .box{text-align:left;width:min(100%,30em)}.faces{display:flex;justify-content:center;gap:18px;flex-wrap:wrap;margin-top:14px;padding-top:14px;border-top:1px solid var(--fc-line)}button.face{display:flex;flex-direction:column;align-items:center;gap:6px;background:none;border:0;padding:4px;min-height:0;font-weight:600;font-size:.9rem}.overlay{position:absolute;top:0;right:0;bottom:0;left:0;z-index:2;display:grid;place-items:center;padding:16px;background:var(--ha-card-background, var(--card-background-color, #241a13))}.md-list{list-style:disc;margin:2px 0 4px;padding-left:1.3em;text-align:left}.md-list li{margin:1px 0}.msg .md-line:last-child,.reply .md-line:last-child{white-space:normal}code{font-family:ui-monospace,monospace;font-size:.9em;background:var(--fc-bg2);border-radius:5px;padding:0 4px}.cardbal{display:flex;align-items:center;gap:6px;margin-top:8px}.cardbal ha-icon{--mdc-icon-size: 18px;color:var(--fc-accent)}input[type=checkbox]{accent-color:var(--fc-accent);width:20px;min-height:20px;height:20px;padding:0}', Qo = (a) => `faith.hub.${a}`, oc = (a) => {
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
const sc = (a) => `faith.device.${a}`, Tf = (a) => {
  if (a)
    try {
      return localStorage.getItem(sc(a)) || void 0;
    } catch {
      return;
    }
};
function zf(a, u) {
  try {
    localStorage.setItem(sc(a), u);
  } catch {
  }
  window.dispatchEvent(new CustomEvent("faith-hub-changed", { detail: { screen: a } }));
}
function Mf(a, u) {
  return {
    screen: u.screen,
    get user() {
      var s;
      return (s = a()) == null ? void 0 : s.user;
    },
    get dark() {
      var s, k;
      return !!((k = (s = a()) == null ? void 0 : s.themes) != null && k.darkMode);
    },
    call: async (s, k = {}) => {
      const N = a();
      if (!N) throw new Error("Home Assistant isn't ready yet.");
      const j = oc(u.screen), T = Tf(u.screen);
      try {
        return await N.callWS({ type: "faith/call", path: s, body: { ...k, ...u.screen ? { screen: u.screen } : {}, ...j ? { hub_session: j } : {}, ...T ? { device_token: T } : {} } });
      } catch (P) {
        throw new Error((P == null ? void 0 : P.message) || (P == null ? void 0 : P.code) || "FAITH didn't answer.");
      }
    }
  };
}
const Tr = (1 + Math.sqrt(5)) / 2, it = Math.PI * 2, Ko = (() => {
  const a = Math.hypot(1, Tr), u = [];
  for (const s of [-1, 1]) for (const k of [-Tr, Tr]) u.push([0, s / a, k / a], [s / a, k / a, 0], [k / a, 0, s / a]);
  return u;
})(), Rf = (a, u) => (a[0] - u[0]) ** 2 + (a[1] - u[1]) ** 2 + (a[2] - u[2]) ** 2, Lf = 4 / (1 + Tr * Tr), Xo = [];
for (let a = 0; a < 12; a++) for (let u = a + 1; u < 12; u++) Math.abs(Rf(Ko[a], Ko[u]) - Lf) < 0.01 && Xo.push([a, u]);
const uc = [], Vo = (a, u) => Xo.some(([s, k]) => s === a && k === u || s === u && k === a);
for (let a = 0; a < 12; a++) for (let u = a + 1; u < 12; u++) for (let s = u + 1; s < 12; s++) Vo(a, u) && Vo(u, s) && Vo(a, s) && uc.push([a, u, s]);
const zr = 7, qt = (a) => {
  const u = Math.sin(a * 127.1 + 311.7) * 43758.5453;
  return u - Math.floor(u);
}, qa = Array.from({ length: zr }, (a, u) => ({
  a: [0, 1, 2].map((s) => 0.3 + 0.16 * qt(u * 9 + s)),
  w: [0, 1, 2].map((s) => 0.22 + 0.3 * qt(u * 9 + s + 3)),
  p: [0, 1, 2].map((s) => it * qt(u * 9 + s + 6)),
  flap: it * qt(u * 3 + 100)
})), ac = -1, Mr = [];
for (let a = 0; a < zr; a++) Mr.push({ a: ac, b: a, kind: "core", seed: qt(a + 40) });
for (let a = 0; a < zr; a++) Mr.push({ a, b: (a + 1) % zr, kind: "bee", seed: qt(a + 60) });
for (const [a, u] of [[0, 3], [2, 5], [4, 6]]) Mr.push({ a, b: u, kind: "bee", seed: qt(a * 7 + u) });
for (const [a, u] of [[1, 0], [3, 7], [5, 10]]) Mr.push({ a, b: u, kind: "shell", seed: qt(a + u * 3) });
const If = [
  { r: 1.34, tiltX: 1.12, tiltZ: 0.38, precess: 0.21, phase: 0, width: 0.024, ticks: 36 },
  { r: 1.5, tiltX: 1.38, tiltZ: -0.62, precess: -0.15, phase: Math.PI / 2, width: 0.016, ticks: 0 }
], ba = ([a, u, s], k) => {
  const N = Math.cos(k), j = Math.sin(k);
  return [a, u * N - s * j, u * j + s * N];
}, ec = ([a, u, s], k) => {
  const N = Math.cos(k), j = Math.sin(k);
  return [a * N + s * j, u, -a * j + s * N];
}, tc = ([a, u, s], k) => {
  const N = Math.cos(k), j = Math.sin(k);
  return [a * N - u * j, a * j + u * N, s];
}, Df = {
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
class Ff {
  constructor(u, s = {}) {
    Ue(this, "ctx");
    Ue(this, "opts");
    Ue(this, "raf", 0);
    Ue(this, "last", 0);
    Ue(this, "t", 0);
    Ue(this, "acc", { spin: 0.6, bees: 3, rings: 1.2, sparks: 0 });
    Ue(this, "cur", { ...Bl.idle });
    Ue(this, "ro");
    Ue(this, "heading", new Array(zr).fill(0));
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
      const k = Math.min(0.05, (s - this.last) / 1e3);
      this.last = s, this.frame(k), this.raf = requestAnimationFrame(u);
    };
    this.raf = requestAnimationFrame(u);
  }
  frame(u) {
    const s = Bl[this.opts.state], k = Math.min(1, u * 2.5);
    for (const N of Object.keys(s)) this.cur[N] += (s[N] - this.cur[N]) * k;
    this.t += u, this.acc.spin += this.cur.spin * u, this.acc.bees += this.cur.bees * u, this.acc.rings += this.cur.rings * u, this.acc.sparks += (0.25 + this.cur.sparks * 0.9) * u, this.draw();
  }
  level() {
    const u = this.opts.state;
    if (u !== "listening" && u !== "speaking") return 0;
    const s = typeof this.opts.level == "function" ? this.opts.level() : this.opts.level;
    if (typeof s == "number") return Math.max(0, Math.min(1, s));
    const k = this.t;
    return u === "speaking" ? 0.5 + 0.5 * Math.sin(k * 9) * Math.sin(k * 2.3) : 0.3 + 0.2 * Math.sin(k * 3);
  }
  draw() {
    const { ctx: u, w: s, h: k } = this, N = Df[this.opts.tone], j = s / 2, T = k / 2, P = Math.min(s, k) / 2 / 1.86, v = 5, E = this.level(), H = this.acc.spin, V = 0.38 + 0.12 * Math.sin(this.t * 0.31), R = 0.08 * Math.sin(this.t * 0.23), $ = (x) => ba(tc(ec(x, H), R), V), W = (x) => {
      const S = v / (v - x[2]);
      return { x: j + x[0] * P * S, y: T - x[1] * P * S, z: x[2], s: S };
    }, Y = (x) => (x + 1) / 2;
    u.clearRect(0, 0, s, k);
    const b = this.cur.glow + E * 0.5, pe = u.createRadialGradient(j, T, 0, j, T, P * 1.6);
    pe.addColorStop(0, ye(N.glow, 0.26 * b)), pe.addColorStop(0.45, ye(N.glow, 0.1 * b)), pe.addColorStop(1, ye(N.glow, 0)), u.fillStyle = pe, u.fillRect(0, 0, s, k);
    const Le = [], Te = [], me = [];
    If.forEach((x, S) => {
      const f = x.phase + this.acc.rings * x.precess, w = (Z, oe = x.r) => ec(tc(ba([Math.cos(Z) * oe, 0, Math.sin(Z) * oe], x.tiltX), x.tiltZ), f), D = 96, G = [];
      let te = W(w(0));
      for (let Z = 1; Z <= D; Z++) {
        const oe = w(Z / D * it), Ne = W(oe);
        G.push({ a: te, b: Ne, z: (te.z + Ne.z) / 2, wd: x.width }), te = Ne;
      }
      Le.push(G);
      const ee = [], se = this.acc.rings * 0.35 * (S ? -1 : 1);
      for (let Z = 0; Z < x.ticks; Z++) {
        const oe = Z / x.ticks * it + se, Ne = Z % 3 === 0 ? 0.07 : 0.035, ft = W(w(oe, x.r - Ne)), Un = W(w(oe, x.r + Ne));
        ee.push({ a: ft, b: Un, z: (ft.z + Un.z) / 2 });
      }
      if (Te.push(ee), S === 0) for (const Z of [0, Math.PI]) me.push(W(w(se * 1.6 + Z)));
      else me.push(W(w(-se * 1.2 + 1)));
    });
    const ze = (x) => {
      u.lineCap = "round", Le.forEach((S) => {
        for (const f of S) {
          if (f.z >= 0 !== x) continue;
          const w = Y(f.z);
          u.strokeStyle = `rgb(${N.ringLo.map((D, G) => Math.round(D + (N.ringHi[G] - D) * w)).join(",")})`, u.globalAlpha = x ? 1 : 0.55, u.lineWidth = Math.max(this.dpr * 1.2, P * f.wd * f.a.s), u.beginPath(), u.moveTo(f.a.x, f.a.y), u.lineTo(f.b.x, f.b.y), u.stroke();
        }
      }), u.lineWidth = P * 8e-3;
      for (const S of Te) for (const f of S)
        f.z >= 0 === x && (u.strokeStyle = ye(N.ringHi, (x ? 0.9 : 0.35) * (0.4 + 0.6 * Y(f.z))), u.beginPath(), u.moveTo(f.a.x, f.a.y), u.lineTo(f.b.x, f.b.y), u.stroke());
      for (const S of me) {
        if (S.z >= 0 !== x) continue;
        u.globalAlpha = x ? 1 : 0.5;
        const f = P * 0.034 * S.s, w = u.createRadialGradient(S.x - f * 0.3, S.y - f * 0.3, f * 0.1, S.x, S.y, f);
        w.addColorStop(0, ye(N.spark, 1)), w.addColorStop(1, ye(N.ringLo, 1)), u.fillStyle = w, u.beginPath(), u.arc(S.x, S.y, f, 0, it), u.fill();
      }
      u.globalAlpha = 1;
    };
    ze(!1);
    const de = Ko.map($), ue = de.map(W), O = (x) => {
      for (const [S, f] of Xo) {
        const w = (de[S][2] + de[f][2]) / 2;
        w >= -0.05 === x && (u.strokeStyle = x ? ye(N.edge, 0.55 + 0.45 * Y(w)) : ye(N.edgeBack, this.opts.tone === "light" ? 0.45 : 0.32), u.lineWidth = Math.max(this.dpr * (x ? 1 : 0.6), P * (x ? 0.013 : 8e-3)), u.beginPath(), u.moveTo(ue[S].x, ue[S].y), u.lineTo(ue[f].x, ue[f].y), u.stroke());
      }
    };
    O(!1);
    const le = 1 - this.cur.gather, X = qa.map((x) => {
      const S = (D) => [x.a[0] * Math.sin(x.w[0] * D + x.p[0]) * le, x.a[1] * Math.sin(x.w[1] * D + x.p[1]) * le, x.a[2] * Math.cos(x.w[2] * D + x.p[2]) * le], f = $(S(this.acc.bees)), w = W($(S(this.acc.bees + 0.05)));
      return { v: f, p: W(f), next: w };
    }), ie = W([0, 0, 0]), re = (x, S, f) => f === "a" && x === ac ? ie : S === "shell" && f === "b" ? ue[x] : X[x].p, xe = Mr.map((x) => ({ l: x, A: re(x.a, x.kind, "a"), B: re(x.b, x.kind, "b") })), Ge = (x, S) => {
      const f = Math.hypot(S.x - x.x, S.y - x.y);
      return { mx: (x.x + S.x) / 2, my: (x.y + S.y) / 2 + f * 0.12 };
    };
    u.lineCap = "round";
    for (const { l: x, A: S, B: f } of xe) {
      const { mx: w, my: D } = Ge(S, f), G = (S.z + f.z) / 2;
      u.strokeStyle = ye(N.thread, (x.kind === "core" ? 0.6 : x.kind === "shell" ? 0.35 : 0.5) * (0.5 + 0.5 * Y(G))), u.lineWidth = Math.max(this.dpr * 0.6, P * (x.kind === "core" ? 9e-3 : 65e-4)), u.beginPath(), u.moveTo(S.x, S.y), u.quadraticCurveTo(w, D, f.x, f.y), u.stroke();
    }
    for (const { l: x, A: S, B: f } of xe) {
      if (x.kind === "shell") continue;
      const w = this.cur.sparks;
      if (x.seed > w + 0.15) continue;
      const D = (this.acc.sparks * (0.6 + x.seed) + x.seed * 7) % 1, { mx: G, my: te } = Ge(S, f), ee = 1 - D, se = ee * ee * S.x + 2 * ee * D * G + D * D * f.x, Z = ee * ee * S.y + 2 * ee * D * te + D * D * f.y, oe = P * 0.018 * (0.6 + w * 0.6), Ne = Math.sin(D * Math.PI), ft = u.createRadialGradient(se, Z, 0, se, Z, oe * 2.4);
      ft.addColorStop(0, ye(N.spark, 0.95 * Ne)), ft.addColorStop(1, ye(N.spark, 0)), u.fillStyle = ft, u.beginPath(), u.arc(se, Z, oe * 2.4, 0, it), u.fill();
    }
    const Ye = P * (0.085 + 0.035 * E + 0.01 * Math.sin(this.t * 2)), Ie = u.createRadialGradient(ie.x, ie.y, 0, ie.x, ie.y, Ye * 3.2);
    Ie.addColorStop(0, ye(N.core, 0.55 * b)), Ie.addColorStop(1, ye(N.core, 0)), u.fillStyle = Ie, u.beginPath(), u.arc(ie.x, ie.y, Ye * 3.2, 0, it), u.fill(), this.hex(ie.x, ie.y, Ye, this.acc.spin * 0.5, N);
    const we = X.map((x, S) => S).sort((x, S) => X[x].v[2] - X[S].v[2]);
    for (const x of we) {
      const S = X[x];
      let w = Math.atan2(S.next.y - S.p.y, S.next.x - S.p.x) - this.heading[x];
      w = ((w + Math.PI) % it + it) % it - Math.PI, this.heading[x] += this.opts.still ? w : w * 0.15;
      const D = 0.35 + 0.65 * Math.abs(Math.sin(this.t * 26 + qa[x].flap));
      this.bee(S.p.x, S.p.y, P * 0.15 * S.p.s, this.heading[x], D, 0.55 + 0.45 * Y(S.v[2]), N);
    }
    const L = [-0.4, 0.6, 0.7];
    for (const [x, S, f] of uc) {
      const w = de[x], D = de[S], G = de[f], te = [(w[0] + D[0] + G[0]) / 3, (w[1] + D[1] + G[1]) / 3, (w[2] + D[2] + G[2]) / 3];
      if (te[2] <= 0) continue;
      const ee = Math.max(0, (te[0] * L[0] + te[1] * L[1] + te[2] * L[2]) / Math.hypot(...te));
      u.fillStyle = ye(N.face, 0.03 + 0.07 * ee * ee), u.beginPath(), u.moveTo(ue[x].x, ue[x].y), u.lineTo(ue[S].x, ue[S].y), u.lineTo(ue[f].x, ue[f].y), u.closePath(), u.fill();
    }
    O(!0);
    for (let x = 0; x < 12; x++)
      de[x][2] < -0.05 || (u.fillStyle = ye(N.edge, 0.6 + 0.4 * Y(de[x][2])), u.beginPath(), u.arc(ue[x].x, ue[x].y, P * 0.02 * ue[x].s, 0, it), u.fill());
    ze(!0);
  }
  hex(u, s, k, N, j) {
    const { ctx: T } = this, P = Array.from({ length: 6 }, (v, E) => [u + k * Math.cos(N + E * it / 6), s + k * Math.sin(N + E * it / 6)]);
    for (let v = 0; v < 6; v++) {
      const [E, H] = P[v], [V, R] = P[(v + 1) % 6];
      T.fillStyle = ye(j.bee[v % 3], 1), T.beginPath(), T.moveTo(u, s), T.lineTo(E, H), T.lineTo(V, R), T.closePath(), T.fill();
    }
    T.strokeStyle = ye(j.spark, 0.9), T.lineWidth = k * 0.12, T.beginPath(), P.forEach(([v, E], H) => H ? T.lineTo(v, E) : T.moveTo(v, E)), T.closePath(), T.stroke();
  }
  /** One low-poly bee seen from above, facing +x in its own space. */
  bee(u, s, k, N, j, T, P) {
    const { ctx: v } = this;
    v.save(), v.translate(u, s), v.rotate(N), v.scale(k, k), v.globalAlpha = T;
    const E = (R) => {
      v.beginPath(), R.forEach(([$, W], Y) => Y ? v.lineTo($, W) : v.moveTo($, W)), v.closePath();
    };
    v.fillStyle = ye(P.head, 1), E([[-1.02, -0.08], [-1.28, 0], [-1.02, 0.08]]), v.fill();
    const H = [[-1.05, 0], [-0.78, -0.4], [-0.2, -0.5], [0.28, -0.36], [0.46, 0], [0.28, 0.36], [-0.2, 0.5], [-0.78, 0.4]], V = [-0.3, 0];
    for (let R = 0; R < H.length; R++)
      v.fillStyle = ye(P.bee[R % 3], 1), E([V, H[R], H[(R + 1) % H.length]]), v.fill();
    v.save(), E(H), v.clip(), v.fillStyle = ye(P.stripe, 0.92), E([[-0.26, -0.6], [-0.44, -0.6], [-0.5, 0.6], [-0.32, 0.6]]), v.fill(), E([[-0.64, -0.6], [-0.8, -0.6], [-0.86, 0.6], [-0.7, 0.6]]), v.fill(), v.restore(), v.fillStyle = ye(P.head, 1), E([[0.42, 0], [0.58, -0.27], [0.86, -0.2], [0.95, 0], [0.86, 0.2], [0.58, 0.27]]), v.fill(), v.fillStyle = ye(P.bee[1], 0.9), E([[0.7, -0.2], [0.84, -0.14], [0.74, -0.08]]), v.fill(), E([[0.7, 0.2], [0.84, 0.14], [0.74, 0.08]]), v.fill(), v.strokeStyle = ye(P.head, 1), v.lineWidth = 0.06, v.lineCap = "round", v.beginPath(), v.moveTo(0.9, -0.1), v.lineTo(1.08, -0.2), v.lineTo(1.2, -0.4), v.moveTo(0.9, 0.1), v.lineTo(1.08, 0.2), v.lineTo(1.2, 0.4), v.stroke();
    for (const R of [-1, 1]) {
      const $ = R * j, W = [[0.22, 0.16 * R], [0.05, 1.08 * $], [-0.5, 0.92 * $], [-0.22, 0.24 * R]];
      v.fillStyle = ye(P.wing, 0.38), E(W), v.fill(), v.strokeStyle = ye(P.bee[1], 0.85), v.lineWidth = 0.04, v.stroke(), v.beginPath(), v.moveTo(0.05, 0.2 * R), v.lineTo(-0.22, 0.95 * $), v.stroke();
    }
    v.restore();
  }
}
const nc = () => typeof matchMedia == "function" && matchMedia("(prefers-reduced-motion: reduce)").matches;
function cc({ size: a = 160, state: u = "idle", level: s, tone: k = "dark", still: N, className: j }) {
  const T = q.useRef(null), P = q.useRef();
  return q.useEffect(() => (P.current = new Ff(T.current, { state: u, level: s, tone: k, still: N ?? nc() }), () => {
    var v;
    return (v = P.current) == null ? void 0 : v.destroy();
  }), []), q.useEffect(() => {
    var v;
    (v = P.current) == null || v.set({ state: u, level: s, tone: k, still: N ?? nc() });
  }, [u, s, k, N]), /* @__PURE__ */ c.jsx("canvas", { ref: T, className: j, style: { width: a, height: a, display: "block" }, role: "img", "aria-label": `FAITH (${u})` });
}
const Of = { today: "mdi:calendar-today", meals: "mdi:silverware-fork-knife", shopping: "mdi:cart-outline", chores: "mdi:broom", home: "mdi:home-outline", approvals: "mdi:shield-check-outline" }, Af = (a) => a.split(/\s+/).map((u) => u[0]).join("").slice(0, 2).toUpperCase(), $n = ({ p: a, size: u = 40, ring: s }) => {
  const k = /* @__PURE__ */ c.jsx("span", { className: "avatar", style: { width: u, height: u, fontSize: u * 0.36, background: a.color || "var(--fc-accent)" }, children: Af(a.name) });
  return s ? /* @__PURE__ */ c.jsx("span", { className: "hexring", children: k }) : k;
};
function Pr(a) {
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
function dc({ text: a }) {
  const u = (j) => j.split(/(\*\*[^*]+\*\*|__[^_]+__|\*[^*\s][^*]*\*|`[^`]+`)/g).map((T, P) => /^(\*\*|__).+\1$/.test(T) ? /* @__PURE__ */ c.jsx("b", { children: T.slice(2, -2) }, P) : /^\*.+\*$/.test(T) ? /* @__PURE__ */ c.jsx("i", { children: T.slice(1, -1) }, P) : /^`.+`$/.test(T) ? /* @__PURE__ */ c.jsx("code", { children: T.slice(1, -1) }, P) : T), s = [];
  let k = [];
  const N = () => {
    k.length && s.push(/* @__PURE__ */ c.jsx("ul", { className: "md-list", children: k }, `l${s.length}`)), k = [];
  };
  return a.split(`
`).forEach((j, T) => {
    const P = j.replace(/^#{1,6}\s+/, ""), v = P.match(/^\s*(?:[-*•]|\d+[.)])\s+(.*)$/);
    if (v) {
      k.push(/* @__PURE__ */ c.jsx("li", { children: u(v[1]) }, T));
      return;
    }
    N(), s.push(/* @__PURE__ */ c.jsxs("span", { className: "md-line", children: [
      u(P),
      `
`
    ] }, T));
  }), N(), /* @__PURE__ */ c.jsx(c.Fragment, { children: s });
}
const $f = (a, u = /* @__PURE__ */ new Date()) => {
  if (!a || !/^\d{2}:\d{2}$/.test(a)) return !0;
  const [s, k] = a.split(":").map(Number);
  return s * 60 + k >= u.getHours() * 60 + u.getMinutes();
};
function Vl(a, u, s = {}, k = 6e4) {
  const [N, j] = q.useState(null), [T, P] = q.useState(""), v = q.useCallback(() => a.call(u, s).then((E) => {
    j(E), P("");
  }).catch((E) => P(E.message)), [a, u, JSON.stringify(s)]);
  return q.useEffect(() => {
    v();
    const E = setInterval(v, k), H = (V) => {
      var $;
      const R = ($ = V.detail) == null ? void 0 : $.screen;
      (!R || R === a.screen) && v();
    };
    return window.addEventListener("faith-hub-changed", H), () => {
      clearInterval(E), window.removeEventListener("faith-hub-changed", H);
    };
  }, [v, k]), { data: N, err: T, load: v };
}
function Uf({ api: a, items: u, can: s, onDone: k }) {
  const [N, j] = q.useState(""), T = (P, v) => a.call(`/api/ha/approvals/${P}`, { approve: v }).then((E) => {
    j(E.text), k();
  }).catch((E) => j(E.message));
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
        /* @__PURE__ */ c.jsx("button", { className: "primary", "aria-label": `Approve: ${P.summary}`, onClick: () => T(P.id, !0), children: "Approve" }),
        /* @__PURE__ */ c.jsx("button", { "aria-label": `Deny: ${P.summary}`, onClick: () => T(P.id, !1), children: "Deny" })
      ] })
    ] }, P.id)) }),
    !s && /* @__PURE__ */ c.jsx("div", { className: "meta", children: "A grown-up approves these (signed in here, or on their phone)." }),
    /* @__PURE__ */ c.jsx("div", { className: "toast", role: "status", children: N })
  ] });
}
function Hf({ c: a, api: u, can: s, reload: k }) {
  var P;
  const N = a.items ?? [];
  let j;
  a.error ? j = /* @__PURE__ */ c.jsx("div", { className: "err", children: a.error }) : a.empty ? j = /* @__PURE__ */ c.jsx("div", { className: "empty", children: a.empty }) : a.kind === "schedule" ? j = /* @__PURE__ */ c.jsx("ul", { children: N.map((v, E) => /* @__PURE__ */ c.jsxs("li", { className: "row", children: [
    /* @__PURE__ */ c.jsx("span", { className: "time", children: Pr(v.time) }),
    /* @__PURE__ */ c.jsxs("div", { className: "grow", children: [
      /* @__PURE__ */ c.jsx("div", { children: v.title }),
      v.meta && /* @__PURE__ */ c.jsx("div", { className: "meta", children: v.meta })
    ] })
  ] }, E)) }) : a.kind === "meals" ? j = /* @__PURE__ */ c.jsx("ul", { children: N.map((v, E) => /* @__PURE__ */ c.jsxs("li", { className: "row", children: [
    /* @__PURE__ */ c.jsxs("span", { className: "label grow", children: [
      v.label,
      v.time && Pr(v.time) !== "Today" ? ` · ${Pr(v.time)}` : ""
    ] }),
    /* @__PURE__ */ c.jsx("span", { children: v.title })
  ] }, E)) }) : a.kind === "checklist" || a.kind === "list" ? j = /* @__PURE__ */ c.jsx("ul", { children: N.map((v, E) => /* @__PURE__ */ c.jsxs("li", { className: "row", children: [
    a.kind === "checklist" && /* @__PURE__ */ c.jsx("span", { className: `check ${v.done ? "done" : ""}` }),
    /* @__PURE__ */ c.jsxs("span", { className: "grow", children: [
      v.label && /* @__PURE__ */ c.jsxs("span", { className: "label", children: [
        v.label,
        " "
      ] }),
      v.title
    ] }),
    (v.meta || v.time) && /* @__PURE__ */ c.jsx("span", { className: "meta", children: v.meta || Pr(v.time) })
  ] }, E)) }) : a.kind === "entities" ? j = /* @__PURE__ */ c.jsx("div", { className: "tiles", children: (a.entities ?? []).map((v) => /* @__PURE__ */ c.jsxs("div", { className: "tile", children: [
    /* @__PURE__ */ c.jsx("div", { className: "meta", children: v.name }),
    /* @__PURE__ */ c.jsx("div", { className: "v", children: v.state })
  ] }, v.entity_id)) }) : a.kind === "approvals" ? j = /* @__PURE__ */ c.jsx(Uf, { api: u, items: a.approvals ?? [], can: s, onDone: k }) : j = /* @__PURE__ */ c.jsx("div", { style: { whiteSpace: "pre-wrap" }, children: a.text });
  const T = a.kind === "checklist" ? N.length : a.kind === "approvals" ? (P = a.approvals) == null ? void 0 : P.length : void 0;
  return /* @__PURE__ */ c.jsxs("div", { className: "section", children: [
    /* @__PURE__ */ c.jsxs("h3", { children: [
      /* @__PURE__ */ c.jsx("ha-icon", { icon: Of[a.id] || "mdi:note-text-outline" }),
      a.title,
      T ? /* @__PURE__ */ c.jsx("span", { className: "count", children: T }) : null
    ] }),
    j
  ] });
}
function Bf({ api: a, layout: u, onDone: s }) {
  const k = u.available, [N, j] = q.useState([...u.order, ...k.map(($) => $.id).filter(($) => !u.order.includes($))]), [T, P] = q.useState(u.hidden), [v, E] = q.useState(""), H = ($) => {
    var W;
    return ((W = k.find((Y) => Y.id === $)) == null ? void 0 : W.title) ?? $;
  }, V = ($, W) => j((Y) => {
    const b = [...Y], pe = $ + W;
    return pe < 0 || pe >= b.length ? Y : ([b[$], b[pe]] = [b[pe], b[$]], b);
  }), R = ($) => a.call("/api/ha/prefs/cards", $).then(s).catch((W) => E(W.message));
  return /* @__PURE__ */ c.jsxs("div", { className: "section", children: [
    /* @__PURE__ */ c.jsx("h3", { children: "Arrange your card" }),
    /* @__PURE__ */ c.jsx("ul", { "aria-label": "Sections, in order", children: N.map(($, W) => /* @__PURE__ */ c.jsxs("li", { className: "row", children: [
      /* @__PURE__ */ c.jsxs("label", { className: "grow", style: { display: "flex", gap: 8, alignItems: "center" }, children: [
        /* @__PURE__ */ c.jsx("input", { type: "checkbox", checked: !T.includes($), onChange: (Y) => P((b) => Y.target.checked ? b.filter((pe) => pe !== $) : [...b, $]) }),
        "Show ",
        H($)
      ] }),
      /* @__PURE__ */ c.jsx("button", { className: "ghost", "aria-label": `Move ${H($)} up`, disabled: W === 0, onClick: () => V(W, -1), children: "↑" }),
      /* @__PURE__ */ c.jsx("button", { className: "ghost", "aria-label": `Move ${H($)} down`, disabled: W === N.length - 1, onClick: () => V(W, 1), children: "↓" })
    ] }, $)) }),
    /* @__PURE__ */ c.jsxs("div", { className: "btns", style: { marginTop: 10 }, children: [
      /* @__PURE__ */ c.jsx("button", { className: "primary", onClick: () => R({ order: N, hidden: T }), children: "Save" }),
      /* @__PURE__ */ c.jsx("button", { onClick: s, children: "Cancel" }),
      u.saved && /* @__PURE__ */ c.jsx("button", { className: "ghost", onClick: () => R({ reset: !0 }), children: "Back to the default" })
    ] }),
    /* @__PURE__ */ c.jsx("div", { className: "err", role: "alert", children: v })
  ] });
}
function Vf({ api: a, config: u }) {
  var v;
  const { data: s, err: k, load: N } = Vl(a, "/api/ha/view", u.cards ? { cards: u.cards } : {}), [j, T] = q.useState(!1);
  if (k) return /* @__PURE__ */ c.jsx("ha-card", { children: /* @__PURE__ */ c.jsx("div", { className: "err", children: k }) });
  if (!s) return /* @__PURE__ */ c.jsx("ha-card", { children: /* @__PURE__ */ c.jsx("div", { className: "empty", children: "Loading…" }) });
  const P = s.person ? `${s.person.name}'s` : "The family's";
  return j && s.layout ? /* @__PURE__ */ c.jsx("ha-card", { children: /* @__PURE__ */ c.jsx(Bf, { api: a, layout: s.layout, onDone: () => {
    T(!1), N();
  } }) }) : /* @__PURE__ */ c.jsxs("ha-card", { children: [
    u.title !== "" && /* @__PURE__ */ c.jsxs(c.Fragment, { children: [
      /* @__PURE__ */ c.jsxs("div", { className: "head", style: { marginBottom: 0 }, children: [
        /* @__PURE__ */ c.jsx("div", { className: "eyebrow", children: (/* @__PURE__ */ new Date()).toLocaleDateString([], { weekday: "long", month: "long", day: "numeric" }) }),
        ((v = s.layout) == null ? void 0 : v.can_arrange) && /* @__PURE__ */ c.jsx("div", { className: "right", children: /* @__PURE__ */ c.jsx("button", { className: "ghost", onClick: () => T(!0), children: "Arrange" }) })
      ] }),
      /* @__PURE__ */ c.jsx("div", { className: "hello", children: u.title ?? /* @__PURE__ */ c.jsxs(c.Fragment, { children: [
        P,
        " ",
        /* @__PURE__ */ c.jsx("em", { children: "day" }),
        ", at a glance."
      ] }) })
    ] }),
    u.show_apps !== !1 && s.apps.length > 0 && /* @__PURE__ */ c.jsx("div", { className: "section", children: /* @__PURE__ */ c.jsx("div", { className: "apps", children: s.apps.map((E) => /* @__PURE__ */ c.jsxs("a", { href: E.url, target: "_blank", rel: "noreferrer", children: [
      /* @__PURE__ */ c.jsx("span", { children: E.icon || "↗" }),
      E.name
    ] }, E.id)) }) }),
    s.cards.map((E) => /* @__PURE__ */ c.jsx(Hf, { c: E, api: a, can: s.can_approve, reload: N }, E.id)),
    !s.cards.length && /* @__PURE__ */ c.jsx("div", { className: "empty", children: "Nothing to show yet." })
  ] });
}
const fc = (a) => a.call("/api/ha/hub/people");
function pc({ api: a, people: u, pick: s, onBack: k, onDone: N }) {
  const [j, T] = q.useState(""), [P, v] = q.useState(""), E = async (V) => {
    v("");
    try {
      const R = await a.call("/api/ha/hub/signin", V);
      Yo(a.screen, R.hub_session), N();
    } catch (R) {
      v(R.message), T("");
    }
  }, H = (V) => T((R) => (R + V).slice(0, 8));
  return q.useEffect(() => {
    const V = (R) => {
      const $ = R.composedPath()[0];
      if (!($ && /^(INPUT|TEXTAREA|SELECT)$/.test($.tagName))) {
        if (/^[0-9]$/.test(R.key)) H(R.key);
        else if (R.key === "Backspace") T((W) => W.slice(0, -1));
        else if (R.key === "Enter")
          j.length >= 4 && E({ person: s.id, pin: j });
        else if (R.key === "Escape") k();
        else return;
        R.preventDefault();
      }
    };
    return window.addEventListener("keydown", V), () => window.removeEventListener("keydown", V);
  }, [j, s.id]), /* @__PURE__ */ c.jsxs("div", { className: "pin", role: "group", "aria-label": `PIN for ${s.name}`, children: [
    /* @__PURE__ */ c.jsxs("div", { className: "head", style: { margin: 0 }, children: [
      /* @__PURE__ */ c.jsx($n, { p: s, size: 44 }),
      /* @__PURE__ */ c.jsxs("h2", { children: [
        "Hi, ",
        s.name
      ] }),
      /* @__PURE__ */ c.jsx("button", { className: "ghost", style: { marginLeft: "auto" }, onClick: k, children: "Back" })
    ] }),
    (u == null ? void 0 : u.face_unlock) && u.suggested === s.id && /* @__PURE__ */ c.jsx("button", { className: "primary", onClick: () => E({ person: s.id, face: !0 }), children: "It's me (camera)" }),
    /* @__PURE__ */ c.jsx("div", { className: "dots", role: "status", "aria-label": `${j.length} digit${j.length === 1 ? "" : "s"} entered`, children: Array.from({ length: Math.max(4, j.length) }, (V, R) => /* @__PURE__ */ c.jsx("span", { className: R < j.length ? "on" : "" }, R)) }),
    /* @__PURE__ */ c.jsxs("div", { className: "keys", children: [
      ["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((V) => /* @__PURE__ */ c.jsx("button", { onClick: () => H(V), children: V }, V)),
      /* @__PURE__ */ c.jsx("button", { onClick: () => T(j.slice(0, -1)), "aria-label": "Delete", children: "⌫" }),
      /* @__PURE__ */ c.jsx("button", { onClick: () => H("0"), children: "0" }),
      /* @__PURE__ */ c.jsx("button", { className: "primary", disabled: j.length < 4, onClick: () => E({ person: s.id, pin: j }), children: "OK" })
    ] }),
    /* @__PURE__ */ c.jsx("div", { className: "err", role: "alert", children: P })
  ] });
}
function hc({ api: a }) {
  const [u, s] = q.useState(""), [k, N] = q.useState("");
  return /* @__PURE__ */ c.jsxs("form", { className: "pin", onSubmit: (j) => {
    j.preventDefault(), a.call("/api/ha/hub/pair", { code: u }).then((T) => zf(a.screen, T.device_token)).catch((T) => N(T.message));
  }, children: [
    /* @__PURE__ */ c.jsx("h2", { children: "Pair this screen" }),
    /* @__PURE__ */ c.jsxs("div", { className: "meta", style: { textAlign: "center" }, children: [
      "Before people can sign in here, pair this tablet as ",
      /* @__PURE__ */ c.jsx("b", { children: a.screen }),
      ". On the server run ",
      /* @__PURE__ */ c.jsxs("code", { children: [
        "faith pair ",
        a.screen
      ] }),
      ", then type the code."
    ] }),
    /* @__PURE__ */ c.jsx("input", { value: u, onChange: (j) => s(j.target.value), inputMode: "numeric", autoComplete: "one-time-code", "aria-label": "Pairing code", placeholder: "Pairing code", style: { maxWidth: 220, textAlign: "center" } }),
    /* @__PURE__ */ c.jsx("button", { className: "primary", type: "submit", disabled: !u.trim(), children: "Pair" }),
    /* @__PURE__ */ c.jsx("div", { className: "err", role: "alert", children: k })
  ] });
}
function mc(a, u) {
  var k;
  const s = q.useRef(0);
  q.useEffect(() => {
    if (!(u != null && u.hub)) return;
    const N = () => {
      Date.now() - s.current > 15e3 && (s.current = Date.now(), a.call("/api/ha/hub/activity").catch(() => {
      }));
    };
    return window.addEventListener("pointerdown", N, !0), () => window.removeEventListener("pointerdown", N, !0);
  }, [(k = u == null ? void 0 : u.hub) == null ? void 0 : k.person.id]), q.useEffect(() => {
    u && !u.hub && u.household && a.screen && oc(a.screen) && Yo(a.screen, null);
  }, [u]);
}
const vc = async (a) => {
  await a.call("/api/ha/hub/signout").catch(() => {
  }), Yo(a.screen, null);
};
function Wf({ api: a }) {
  const { data: u, err: s } = Vl(a, "/api/ha/view", { cards: [] }, 1e4), [k, N] = q.useState(null), [j, T] = q.useState(null), [P, v] = q.useState("");
  return mc(a, u), a.screen ? s ? /* @__PURE__ */ c.jsx("ha-card", { children: /* @__PURE__ */ c.jsx("div", { className: "err", children: s }) }) : u ? u.hub ? /* @__PURE__ */ c.jsx("ha-card", { children: /* @__PURE__ */ c.jsxs("div", { className: "head", children: [
    /* @__PURE__ */ c.jsx($n, { p: u.hub.person, size: 44 }),
    /* @__PURE__ */ c.jsxs("div", { children: [
      /* @__PURE__ */ c.jsx("h2", { children: u.hub.person.name }),
      /* @__PURE__ */ c.jsxs("div", { className: "sub", children: [
        "Signed in on this screen",
        u.hub.remaining_seconds < 60 ? ` · signing out in ${u.hub.remaining_seconds}s` : ""
      ] })
    ] }),
    /* @__PURE__ */ c.jsx("div", { className: "right", children: /* @__PURE__ */ c.jsx("button", { onClick: () => vc(a), children: "Sign out" }) })
  ] }) }) : u.person ? /* @__PURE__ */ c.jsx("ha-card", { children: /* @__PURE__ */ c.jsxs("div", { className: "head", children: [
    /* @__PURE__ */ c.jsx($n, { p: u.person, size: 44 }),
    /* @__PURE__ */ c.jsxs("div", { children: [
      /* @__PURE__ */ c.jsx("h2", { children: u.person.name }),
      /* @__PURE__ */ c.jsx("div", { className: "sub", children: "Your own Home Assistant account" })
    ] })
  ] }) }) : u.pair_needed ? /* @__PURE__ */ c.jsx("ha-card", { children: /* @__PURE__ */ c.jsx(hc, { api: a }) }) : j ? /* @__PURE__ */ c.jsx("ha-card", { children: /* @__PURE__ */ c.jsx(pc, { api: a, people: k, pick: j, onBack: () => T(null), onDone: () => {
    T(null), N(null);
  } }) }) : k ? /* @__PURE__ */ c.jsxs("ha-card", { children: [
    /* @__PURE__ */ c.jsxs("div", { className: "head", children: [
      /* @__PURE__ */ c.jsx("h2", { children: "Who's here?" }),
      /* @__PURE__ */ c.jsx("div", { className: "right", children: /* @__PURE__ */ c.jsx("button", { className: "ghost", onClick: () => N(null), children: "Cancel" }) })
    ] }),
    /* @__PURE__ */ c.jsx("div", { className: "people", children: k.people.map((E) => /* @__PURE__ */ c.jsxs("button", { className: `person ${k.suggested === E.id ? "suggested" : ""}`, onClick: () => T(E), children: [
      /* @__PURE__ */ c.jsx($n, { p: E, size: 52 }),
      E.name
    ] }, E.id)) })
  ] }) : /* @__PURE__ */ c.jsxs("ha-card", { children: [
    /* @__PURE__ */ c.jsxs("div", { className: "head", children: [
      /* @__PURE__ */ c.jsx("ha-icon", { icon: "mdi:account-group-outline" }),
      /* @__PURE__ */ c.jsxs("div", { children: [
        /* @__PURE__ */ c.jsx("h2", { children: "Shared view" }),
        /* @__PURE__ */ c.jsx("div", { className: "sub", children: "Everyone sees the family's things. Sign in for your own." })
      ] }),
      /* @__PURE__ */ c.jsx("div", { className: "right", children: /* @__PURE__ */ c.jsx("button", { className: "primary", onClick: () => fc(a).then((E) => {
        N(E);
        const H = E.people.find((V) => V.id === E.suggested);
        H && T(H);
      }).catch((E) => v(E.message)), children: "Sign in" }) })
    ] }),
    P && /* @__PURE__ */ c.jsx("div", { className: "err", children: P })
  ] }) : /* @__PURE__ */ c.jsx("ha-card", { children: /* @__PURE__ */ c.jsx("div", { className: "empty", children: "…" }) }) : /* @__PURE__ */ c.jsx("ha-card", { children: /* @__PURE__ */ c.jsxs("div", { className: "err", children: [
    "Give this card the screen it's on: ",
    /* @__PURE__ */ c.jsx("code", { children: "screen: kitchen" })
  ] }) });
}
const Qf = [
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
], Kf = (a) => {
  var u;
  return ((u = Qf.find(([s]) => s.test(a))) == null ? void 0 : u[1]) ?? a.replace(/_/g, " ");
};
let Gf;
const pn = () => Gf ?? (Gf = new AudioContext()), Yf = (a) => {
  const u = new Uint8Array(a.fftSize);
  a.getByteTimeDomainData(u);
  let s = 0;
  for (const k of u) s += ((k - 128) / 128) ** 2;
  return Math.min(1, Math.sqrt(s / u.length) * 4);
}, Xf = (a) => {
  let u = "";
  for (let s = 0; s < a.length; s += 32768) u += String.fromCharCode(...a.subarray(s, s + 32768));
  return btoa(u);
};
function gc(a, u) {
  const [s, k] = q.useState([]), [N, j] = q.useState(!1), [T, P] = q.useState(null), [v, E] = q.useState(!1), [H, V] = q.useState(0), R = q.useRef(null), $ = q.useRef(null), W = q.useRef(null), Y = q.useCallback(() => {
    R.current = null, a.call("/api/ha/chat/history").then((O) => {
      R.current = O.conversation_id, k(O.messages.map((le) => ({ me: le.role === "user", text: le.content })));
    }).catch(() => k([]));
  }, [a]);
  q.useEffect(() => {
    Y();
    const O = (le) => {
      var X;
      ((X = le.detail) == null ? void 0 : X.screen) === a.screen && Y();
    };
    return window.addEventListener("faith-hub-changed", O), () => window.removeEventListener("faith-hub-changed", O);
  }, [Y]);
  const [, b] = q.useState(0);
  q.useEffect(() => {
    if (!H) return;
    const O = setTimeout(() => b((le) => le + 1), 3100);
    return () => clearTimeout(O);
  }, [H]), q.useEffect(() => () => {
    var O;
    (O = W.current) == null || O.pause();
  }, []);
  const pe = async (O) => {
    var le;
    try {
      const X = await a.call("/api/ha/speak", { text: O });
      (le = W.current) == null || le.pause();
      const ie = new Audio(`data:${X.mime};base64,${X.audio}`), re = pn().createAnalyser();
      re.fftSize = 512, pn().createMediaElementSource(ie).connect(re), re.connect(pn().destination), W.current = ie, $.current = re, E(!0);
      const xe = () => {
        W.current === ie && ($.current = null, E(!1));
      };
      ie.onended = xe, ie.onerror = xe, await pn().resume(), await ie.play();
    } catch {
      $.current = null, E(!1);
    }
  }, Le = async (O, le) => {
    j(!0), k((X) => [...X, ...le ? [{ me: !0, text: le }] : [], { text: "…" }]);
    try {
      const X = await a.call("/api/ha/chat", { ...O, conversation_id: R.current });
      R.current = X.conversation_id, k((ie) => [
        ...ie.slice(0, -1),
        ...X.heard ? [{ me: !0, text: X.heard + (X.speaker ? ` (${X.speaker.name})` : "") }] : [],
        ...X.confirms.map((re) => ({ text: "", confirm: re })),
        ...X.approvals.map((re) => ({ text: "", waiting: re.summary })),
        { text: X.text, tools: X.tools }
      ]), V(Date.now()), u && X.text && pe(X.text);
    } catch (X) {
      k((ie) => [...ie.slice(0, -1), { text: `Sorry, that didn't work: ${X.message}` }]);
    } finally {
      j(!1);
    }
  }, Te = async () => {
    var O;
    if (T) {
      T.stop(), P(null);
      return;
    }
    (O = W.current) == null || O.pause(), $.current = null, E(!1);
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
        Le({ audio: Xf(new Uint8Array(await re.arrayBuffer())), mime: re.type.split(";")[0] }, "");
      }, X.start(), P(X);
    } catch {
      k((le) => [...le, { text: "The microphone isn't available (Home Assistant needs https for it)." }]);
    }
  }, me = (O, le) => a.call(`/api/ha/confirm/${O}`, { approve: le }).then((X) => k((ie) => ie.map((re) => {
    var xe;
    return ((xe = re.confirm) == null ? void 0 : xe.id) === O ? { ...re, confirm: { ...re.confirm, done: X.text } } : re;
  }))).catch((X) => k((ie) => [...ie, { text: X.message }])), ze = q.useCallback(() => $.current ? Yf($.current) : void 0, []), de = T ? "listening" : N ? "thinking" : v || !u && Date.now() - H < 3e3 ? "speaking" : "idle";
  return { lines: s, busy: N, rec: T, state: de, level: ze, send: Le, mic: Te, answer: me, fresh: () => {
    R.current = null, k([]);
  } };
}
function yc({ l: a, answer: u }) {
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
function xc({ c: a, placeholder: u = "Ask FAITH" }) {
  const [s, k] = q.useState("");
  return /* @__PURE__ */ c.jsxs("form", { className: "ask", onSubmit: (N) => {
    N.preventDefault();
    const j = s.trim();
    j && !a.busy && (k(""), a.send({ text: j }, j));
  }, children: [
    /* @__PURE__ */ c.jsx("button", { type: "button", className: a.rec ? "rec" : "", title: a.rec ? "Stop and send" : "Talk", "aria-label": a.rec ? "Stop recording and send" : "Talk to FAITH", "aria-pressed": !!a.rec, disabled: a.busy, onClick: a.mic, children: /* @__PURE__ */ c.jsx("ha-icon", { icon: a.rec ? "mdi:stop" : "mdi:microphone" }) }),
    /* @__PURE__ */ c.jsx("input", { value: s, onChange: (N) => k(N.target.value), "aria-label": "Message to FAITH", placeholder: a.rec ? "Listening… tap stop when done" : u }),
    /* @__PURE__ */ c.jsx("button", { className: "primary", type: "submit", disabled: a.busy || !s.trim(), title: "Send", "aria-label": "Send", children: /* @__PURE__ */ c.jsx("ha-icon", { icon: "mdi:send" }) })
  ] });
}
function Zf({ api: a, config: u }) {
  const s = gc(a, u.speak === !0), k = q.useRef(null);
  return q.useEffect(() => {
    var N;
    (N = k.current) == null || N.scrollIntoView({ block: "nearest" });
  }, [s.lines]), /* @__PURE__ */ c.jsxs("ha-card", { children: [
    /* @__PURE__ */ c.jsxs("div", { className: "head", children: [
      /* @__PURE__ */ c.jsx(cc, { className: "emblem", size: 56, tone: a.dark ? "dark" : "light", state: s.state, level: s.level }),
      /* @__PURE__ */ c.jsx("h2", { children: u.title ?? "Ask FAITH" }),
      s.lines.length > 0 && /* @__PURE__ */ c.jsx("div", { className: "right", children: /* @__PURE__ */ c.jsx("button", { className: "ghost", onClick: s.fresh, children: "New" }) })
    ] }),
    /* @__PURE__ */ c.jsxs("div", { className: "chat", role: "log", "aria-live": "polite", "aria-label": "Conversation with FAITH", children: [
      !s.lines.length && /* @__PURE__ */ c.jsx("div", { className: "empty", children: "What's on today? What's for dinner? Add milk to the list. Turn off the lights." }),
      s.lines.map((N, j) => {
        var T;
        return N.confirm || N.waiting ? /* @__PURE__ */ c.jsx(yc, { l: N, answer: s.answer }, j) : /* @__PURE__ */ c.jsxs("div", { style: { display: "flex", flexDirection: "column", gap: 4, alignItems: N.me ? "flex-end" : "flex-start" }, children: [
          /* @__PURE__ */ c.jsx("div", { className: `msg ${N.me ? "me" : "faith"}`, children: N.me ? N.text : /* @__PURE__ */ c.jsx(dc, { text: N.text }) }),
          !!((T = N.tools) != null && T.length) && /* @__PURE__ */ c.jsx("div", { className: "chips", children: [...new Set(N.tools.map(Kf))].map((P) => /* @__PURE__ */ c.jsx("span", { className: "chip", children: P }, P)) })
        ] }, j);
      }),
      /* @__PURE__ */ c.jsx("div", { ref: k })
    ] }),
    /* @__PURE__ */ c.jsx(xc, { c: s })
  ] });
}
const Jf = (a) => a.getHours() < 5 ? "Good night" : a.getHours() < 12 ? "Good morning" : a.getHours() < 18 ? "Good afternoon" : "Good evening";
function qf({ api: a, config: u }) {
  var me, ze, de, ue;
  const { data: s, err: k, load: N } = Vl(a, "/api/ha/view", { cards: u.cards ?? ["today"] }, 3e4), j = gc(a, u.speak !== !1), [T, P] = q.useState(/* @__PURE__ */ new Date()), [v, E] = q.useState(null), [H, V] = q.useState(null);
  q.useEffect(() => {
    const O = setInterval(() => P(/* @__PURE__ */ new Date()), 1e4);
    return () => clearInterval(O);
  }, []), mc(a, s);
  const R = !!a.screen && !!s && !s.person;
  if (q.useEffect(() => {
    R && (s != null && s.can_sign_in) && fc(a).then(E).catch(() => {
    });
  }, [R, s == null ? void 0 : s.can_sign_in, (me = s == null ? void 0 : s.hub) == null ? void 0 : me.person.id]), k) return /* @__PURE__ */ c.jsx("ha-card", { class: "hub", children: /* @__PURE__ */ c.jsx("div", { className: "err", children: k }) });
  const $ = ((ze = s == null ? void 0 : s.hub) == null ? void 0 : ze.person) ?? (s == null ? void 0 : s.person) ?? null, W = [...j.lines].reverse().find((O) => !O.me && !O.confirm && !O.waiting), Y = [...j.lines].reverse().find((O) => O.me), b = j.lines.filter((O) => O.confirm && !O.confirm.done || O.waiting).slice(-2), pe = s == null ? void 0 : s.cards.flatMap((O) => O.kind === "schedule" ? O.items ?? [] : []).find((O) => !O.done && $f(O.time, T)), Le = Number(u.size) || 300, Te = j.rec ? "Listening… tap FAITH to send" : j.busy ? "Thinking…" : j.state === "speaking" ? "" : "Tap FAITH to talk";
  return /* @__PURE__ */ c.jsxs("ha-card", { class: "hub", children: [
    /* @__PURE__ */ c.jsxs("div", { className: "hub-top", children: [
      /* @__PURE__ */ c.jsxs("div", { children: [
        /* @__PURE__ */ c.jsx("div", { className: "clock", children: T.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }) }),
        /* @__PURE__ */ c.jsx("div", { className: "eyebrow", children: T.toLocaleDateString([], { weekday: "long", month: "long", day: "numeric" }) })
      ] }),
      /* @__PURE__ */ c.jsxs("div", { className: "right", children: [
        !!(s != null && s.pending_approvals) && /* @__PURE__ */ c.jsxs("span", { className: "pill", children: [
          s.pending_approvals,
          " waiting for approval"
        ] }),
        (s == null ? void 0 : s.hub) && /* @__PURE__ */ c.jsxs("button", { onClick: () => vc(a).then(N), children: [
          "Sign out ",
          s.hub.person.name
        ] })
      ] })
    ] }),
    /* @__PURE__ */ c.jsxs("div", { className: "hub-mid", children: [
      /* @__PURE__ */ c.jsxs("div", { className: "hello", children: [
        Jf(T),
        ", ",
        /* @__PURE__ */ c.jsx("em", { children: $ ? $.name : "everyone" }),
        "."
      ] }),
      (pe || !!((de = s == null ? void 0 : s.home) != null && de.length)) && /* @__PURE__ */ c.jsx("div", { className: "meta", children: [pe ? `Next: ${Pr(pe.time)} ${pe.title}` : "", (ue = s == null ? void 0 : s.home) != null && ue.length ? `Home now: ${s.home.map((O) => O.name).join(", ")}` : ""].filter(Boolean).join(" · ") }),
      /* @__PURE__ */ c.jsx("button", { className: "orb", onClick: j.mic, disabled: j.busy, "aria-label": j.rec ? "Stop and send" : "Talk to FAITH", children: /* @__PURE__ */ c.jsx(cc, { size: Le, tone: a.dark ? "dark" : "light", state: j.state, level: j.level }) }),
      Te && /* @__PURE__ */ c.jsx("div", { className: "hint", children: Te }),
      Y && !j.rec && /* @__PURE__ */ c.jsxs("div", { className: "heard", children: [
        "“",
        Y.text,
        "”"
      ] }),
      /* @__PURE__ */ c.jsx("div", { "aria-live": "polite", children: W && W.text !== "…" && /* @__PURE__ */ c.jsx("div", { className: "reply", children: /* @__PURE__ */ c.jsx(dc, { text: W.text }) }) }),
      b.map((O, le) => /* @__PURE__ */ c.jsx(yc, { l: O, answer: j.answer }, le))
    ] }),
    u.show_input !== !1 && /* @__PURE__ */ c.jsx(xc, { c: j, placeholder: "Or type to FAITH" }),
    R && (s == null ? void 0 : s.pair_needed) && /* @__PURE__ */ c.jsx("div", { className: "faces", children: /* @__PURE__ */ c.jsx(hc, { api: a }) }),
    R && v && !(s != null && s.hub) && /* @__PURE__ */ c.jsx("div", { className: "faces", children: v.people.map((O) => /* @__PURE__ */ c.jsxs("button", { className: `face ${v.suggested === O.id ? "on" : ""}`, onClick: () => V(O), children: [
      /* @__PURE__ */ c.jsx($n, { p: O, size: 56, ring: v.suggested === O.id }),
      O.name
    ] }, O.id)) }),
    H && /* @__PURE__ */ c.jsx("div", { className: "overlay", children: /* @__PURE__ */ c.jsx(pc, { api: a, people: v, pick: H, onBack: () => V(null), onDone: () => {
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
function bf({ api: a, config: u }) {
  const { data: s, err: k, load: N } = Vl(a, "/api/ha/rewards"), [j, T] = q.useState(""), P = (E, H, V) => a.call(E, { args: H }).then((R) => {
    T(R.approval ? `${V} A grown-up will approve it.` : V), N();
  }).catch((R) => T(R.message));
  if (k) return /* @__PURE__ */ c.jsx("ha-card", { children: /* @__PURE__ */ c.jsx("div", { className: "err", children: k }) });
  if (!s) return /* @__PURE__ */ c.jsx("ha-card", { children: /* @__PURE__ */ c.jsx("div", { className: "empty", children: "Loading…" }) });
  const v = (E) => `${E} pt${E === 1 ? "" : "s"}`;
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
        /* @__PURE__ */ c.jsx("ul", { children: s.activities.filter((E) => E.kids_can_claim).map((E) => /* @__PURE__ */ c.jsxs("li", { className: "row", children: [
          /* @__PURE__ */ c.jsx("span", { className: "grow", children: E.name }),
          /* @__PURE__ */ c.jsxs("span", { className: "pill", children: [
            "+",
            v(E.points)
          ] }),
          /* @__PURE__ */ c.jsx("button", { onClick: () => P("/api/ha/rewards/claim", { activity: E.id }, `Asked for ${v(E.points)} for "${E.name}".`), children: "I did it" })
        ] }, E.id)) })
      ] }),
      /* @__PURE__ */ c.jsxs("div", { className: "section", children: [
        /* @__PURE__ */ c.jsx("h3", { children: "Rewards" }),
        /* @__PURE__ */ c.jsx("ul", { children: s.rewards.map((E) => /* @__PURE__ */ c.jsxs("li", { className: "row", children: [
          /* @__PURE__ */ c.jsxs("span", { className: "grow", children: [
            E.name,
            E.kind === "money" && E.amount && s.me.card && !/card/i.test(E.name) ? /* @__PURE__ */ c.jsx("span", { className: "meta", children: " · onto your card" }) : null
          ] }),
          /* @__PURE__ */ c.jsx("span", { className: "pill", children: v(E.cost) }),
          /* @__PURE__ */ c.jsx("button", { className: "primary", disabled: s.me.points < E.cost, onClick: () => P("/api/ha/rewards/redeem", { reward: E.id }, `Asked for "${E.name}".`), children: "Get it" })
        ] }, E.id)) })
      ] })
    ] }) : /* @__PURE__ */ c.jsxs(c.Fragment, { children: [
      !s.kids.length && /* @__PURE__ */ c.jsx("div", { className: "empty", children: "No children in FAITH's family list yet." }),
      /* @__PURE__ */ c.jsx("ul", { children: s.kids.map((E) => /* @__PURE__ */ c.jsxs("li", { className: "row", children: [
        /* @__PURE__ */ c.jsx($n, { p: E, size: 34 }),
        /* @__PURE__ */ c.jsxs("span", { className: "grow", children: [
          E.name,
          E.card && /* @__PURE__ */ c.jsxs("span", { className: "meta", children: [
            " · card ",
            rc(E.card)
          ] })
        ] }),
        /* @__PURE__ */ c.jsx("span", { className: "pill", children: v(E.points) }),
        s.can_give && /* @__PURE__ */ c.jsx("div", { className: "btns", children: s.allowed_points.map((H) => /* @__PURE__ */ c.jsxs("button", { "aria-label": `Give ${E.name} ${v(H)}`, onClick: () => P("/api/ha/rewards/award", { person: E.id, points: H, reason: "Well done (from the dashboard)" }, `Gave ${E.name} ${v(H)}.`), children: [
          "+",
          H
        ] }, H)) })
      ] }, E.id)) }),
      !s.can_give && s.kids.length > 0 && /* @__PURE__ */ c.jsx("div", { className: "meta", children: "Sign in to give points." })
    ] }),
    /* @__PURE__ */ c.jsx("div", { className: "toast", role: "status", children: j })
  ] });
}
function _r(a, u, s, k, N) {
  if (customElements.get(a)) return;
  class j extends HTMLElement {
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
      const E = !this._hass;
      this._hass = v, E && this.render();
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
          const v = this.shadowRoot ?? this.attachShadow({ mode: "open" }), E = document.createElement("style");
          E.textContent = Pf, v.appendChild(E);
          const H = document.createElement("div");
          v.appendChild(H), this._root = _f.createRoot(H);
        }
        this._api ?? (this._api = Mf(() => this._hass, this._config)), this._root.render(/* @__PURE__ */ c.jsx(k, { api: this._api, config: this._config }));
      }
    }
  }
  customElements.define(a, j), (window.customCards ?? (window.customCards = [])).push({ type: a, name: u, description: s, preview: !1 });
}
let lc = !1;
function Wo() {
  if (!lc) {
    lc = !0, _r("faith-card", "FAITH", "The family's day from FAITH: today, meals, shopping, chores, the house and approvals, for whoever is looking.", Vf, 6), _r("faith-who-card", "FAITH: who's here", "For a shared tablet: shows who is signed in, and lets a person sign in with their PIN.", Wf, 2), _r("faith-chat-card", "FAITH: chat", "Talk or type to FAITH.", Zf, 6), _r("faith-hub-card", "FAITH: hub", "The wall screen: FAITH in the middle (tap to talk, answers out loud), the time, and who's here.", qf, 9), _r("faith-rewards-card", "FAITH: points & rewards", "Children's points, jobs to claim and rewards; parents give points.", bf, 4);
    for (const a of [0, 500, 2e3, 6e3]) setTimeout(ep, a);
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
function ep() {
  const a = [], u = (s) => s.querySelectorAll("*").forEach((k) => {
    var N;
    if (k.tagName === "HUI-ERROR-CARD") {
      const j = k._config ?? k.config ?? {};
      /faith-[a-z-]*card/.test(`${((N = j.origConfig) == null ? void 0 : N.type) ?? ""} ${j.message ?? ""} ${j.error ?? ""}`) && a.push(k);
    }
    k.shadowRoot && u(k.shadowRoot);
  });
  u(document);
  for (const s of a) s.dispatchEvent(new CustomEvent("ll-rebuild", { bubbles: !0, composed: !0 }));
  return a.length;
}
