var md = Object.defineProperty;
var vd = (a, u, s) => u in a ? md(a, u, { enumerable: !0, configurable: !0, writable: !0, value: s }) : a[u] = s;
var $e = (a, u, s) => vd(a, typeof u != "symbol" ? u + "" : u, s);
var Ao = { exports: {} }, Cr = {}, Uo = { exports: {} }, te = {};
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
  if (Va) return te;
  Va = 1;
  var a = Symbol.for("react.element"), u = Symbol.for("react.portal"), s = Symbol.for("react.fragment"), S = Symbol.for("react.strict_mode"), N = Symbol.for("react.profiler"), _ = Symbol.for("react.provider"), z = Symbol.for("react.context"), T = Symbol.for("react.forward_ref"), g = Symbol.for("react.suspense"), E = Symbol.for("react.memo"), $ = Symbol.for("react.lazy"), H = Symbol.iterator;
  function L(d) {
    return d === null || typeof d != "object" ? null : (d = H && d[H] || d["@@iterator"], typeof d == "function" ? d : null);
  }
  var J = { isMounted: function() {
    return !1;
  }, enqueueForceUpdate: function() {
  }, enqueueReplaceState: function() {
  }, enqueueSetState: function() {
  } }, b = Object.assign, ee = {};
  function le(d, w, D) {
    this.props = d, this.context = w, this.refs = ee, this.updater = D || J;
  }
  le.prototype.isReactComponent = {}, le.prototype.setState = function(d, w) {
    if (typeof d != "object" && typeof d != "function" && d != null) throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");
    this.updater.enqueueSetState(this, d, w, "setState");
  }, le.prototype.forceUpdate = function(d) {
    this.updater.enqueueForceUpdate(this, d, "forceUpdate");
  };
  function je() {
  }
  je.prototype = le.prototype;
  function Le(d, w, D) {
    this.props = d, this.context = w, this.refs = ee, this.updater = D || J;
  }
  var Pe = Le.prototype = new je();
  Pe.constructor = Le, b(Pe, le.prototype), Pe.isPureReactComponent = !0;
  var he = Array.isArray, Te = Object.prototype.hasOwnProperty, B = { current: null }, ce = { key: !0, ref: !0, __self: !0, __source: !0 };
  function re(d, w, D) {
    var Q, Z = {}, X = null, se = null;
    if (w != null) for (Q in w.ref !== void 0 && (se = w.ref), w.key !== void 0 && (X = "" + w.key), w) Te.call(w, Q) && !ce.hasOwnProperty(Q) && (Z[Q] = w[Q]);
    var G = arguments.length - 2;
    if (G === 1) Z.children = D;
    else if (1 < G) {
      for (var oe = Array(G), Ee = 0; Ee < G; Ee++) oe[Ee] = arguments[Ee + 2];
      Z.children = oe;
    }
    if (d && d.defaultProps) for (Q in G = d.defaultProps, G) Z[Q] === void 0 && (Z[Q] = G[Q]);
    return { $$typeof: a, type: d, key: X, ref: se, props: Z, _owner: B.current };
  }
  function ue(d, w) {
    return { $$typeof: a, type: d.type, key: w, ref: d.ref, props: d.props, _owner: d._owner };
  }
  function K(d) {
    return typeof d == "object" && d !== null && d.$$typeof === a;
  }
  function ie(d) {
    var w = { "=": "=0", ":": "=2" };
    return "$" + d.replace(/[=:]/g, function(D) {
      return w[D];
    });
  }
  var ne = /\/+/g;
  function ye(d, w) {
    return typeof d == "object" && d !== null && d.key != null ? ie("" + d.key) : w.toString(36);
  }
  function Ge(d, w, D, Q, Z) {
    var X = typeof d;
    (X === "undefined" || X === "boolean") && (d = null);
    var se = !1;
    if (d === null) se = !0;
    else switch (X) {
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
    if (se) return se = d, Z = Z(se), d = Q === "" ? "." + ye(se, 0) : Q, he(Z) ? (D = "", d != null && (D = d.replace(ne, "$&/") + "/"), Ge(Z, w, D, "", function(Ee) {
      return Ee;
    })) : Z != null && (K(Z) && (Z = ue(Z, D + (!Z.key || se && se.key === Z.key ? "" : ("" + Z.key).replace(ne, "$&/") + "/") + d)), w.push(Z)), 1;
    if (se = 0, Q = Q === "" ? "." : Q + ":", he(d)) for (var G = 0; G < d.length; G++) {
      X = d[G];
      var oe = Q + ye(X, G);
      se += Ge(X, w, D, oe, Z);
    }
    else if (oe = L(d), typeof oe == "function") for (d = oe.call(d), G = 0; !(X = d.next()).done; ) X = X.value, oe = Q + ye(X, G++), se += Ge(X, w, D, oe, Z);
    else if (X === "object") throw w = String(d), Error("Objects are not valid as a React child (found: " + (w === "[object Object]" ? "object with keys {" + Object.keys(d).join(", ") + "}" : w) + "). If you meant to render a collection of children, use an array instead.");
    return se;
  }
  function Ye(d, w, D) {
    if (d == null) return d;
    var Q = [], Z = 0;
    return Ge(d, Q, "", "", function(X) {
      return w.call(D, X, Z++);
    }), Q;
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
  var xe = { current: null }, M = { transition: null }, x = { ReactCurrentDispatcher: xe, ReactCurrentBatchConfig: M, ReactCurrentOwner: B };
  function k() {
    throw Error("act(...) is not supported in production builds of React.");
  }
  return te.Children = { map: Ye, forEach: function(d, w, D) {
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
    if (!K(d)) throw Error("React.Children.only expected to receive a single React element child.");
    return d;
  } }, te.Component = le, te.Fragment = s, te.Profiler = N, te.PureComponent = Le, te.StrictMode = S, te.Suspense = g, te.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = x, te.act = k, te.cloneElement = function(d, w, D) {
    if (d == null) throw Error("React.cloneElement(...): The argument must be a React element, but you passed " + d + ".");
    var Q = b({}, d.props), Z = d.key, X = d.ref, se = d._owner;
    if (w != null) {
      if (w.ref !== void 0 && (X = w.ref, se = B.current), w.key !== void 0 && (Z = "" + w.key), d.type && d.type.defaultProps) var G = d.type.defaultProps;
      for (oe in w) Te.call(w, oe) && !ce.hasOwnProperty(oe) && (Q[oe] = w[oe] === void 0 && G !== void 0 ? G[oe] : w[oe]);
    }
    var oe = arguments.length - 2;
    if (oe === 1) Q.children = D;
    else if (1 < oe) {
      G = Array(oe);
      for (var Ee = 0; Ee < oe; Ee++) G[Ee] = arguments[Ee + 2];
      Q.children = G;
    }
    return { $$typeof: a, type: d.type, key: Z, ref: X, props: Q, _owner: se };
  }, te.createContext = function(d) {
    return d = { $$typeof: z, _currentValue: d, _currentValue2: d, _threadCount: 0, Provider: null, Consumer: null, _defaultValue: null, _globalName: null }, d.Provider = { $$typeof: _, _context: d }, d.Consumer = d;
  }, te.createElement = re, te.createFactory = function(d) {
    var w = re.bind(null, d);
    return w.type = d, w;
  }, te.createRef = function() {
    return { current: null };
  }, te.forwardRef = function(d) {
    return { $$typeof: T, render: d };
  }, te.isValidElement = K, te.lazy = function(d) {
    return { $$typeof: $, _payload: { _status: -1, _result: d }, _init: Ie };
  }, te.memo = function(d, w) {
    return { $$typeof: E, type: d, compare: w === void 0 ? null : w };
  }, te.startTransition = function(d) {
    var w = M.transition;
    M.transition = {};
    try {
      d();
    } finally {
      M.transition = w;
    }
  }, te.unstable_act = k, te.useCallback = function(d, w) {
    return xe.current.useCallback(d, w);
  }, te.useContext = function(d) {
    return xe.current.useContext(d);
  }, te.useDebugValue = function() {
  }, te.useDeferredValue = function(d) {
    return xe.current.useDeferredValue(d);
  }, te.useEffect = function(d, w) {
    return xe.current.useEffect(d, w);
  }, te.useId = function() {
    return xe.current.useId();
  }, te.useImperativeHandle = function(d, w, D) {
    return xe.current.useImperativeHandle(d, w, D);
  }, te.useInsertionEffect = function(d, w) {
    return xe.current.useInsertionEffect(d, w);
  }, te.useLayoutEffect = function(d, w) {
    return xe.current.useLayoutEffect(d, w);
  }, te.useMemo = function(d, w) {
    return xe.current.useMemo(d, w);
  }, te.useReducer = function(d, w, D) {
    return xe.current.useReducer(d, w, D);
  }, te.useRef = function(d) {
    return xe.current.useRef(d);
  }, te.useState = function(d) {
    return xe.current.useState(d);
  }, te.useSyncExternalStore = function(d, w, D) {
    return xe.current.useSyncExternalStore(d, w, D);
  }, te.useTransition = function() {
    return xe.current.useTransition();
  }, te.version = "18.3.1", te;
}
var Wa;
function Go() {
  return Wa || (Wa = 1, Uo.exports = gd()), Uo.exports;
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
  if (Qa) return Cr;
  Qa = 1;
  var a = Go(), u = Symbol.for("react.element"), s = Symbol.for("react.fragment"), S = Object.prototype.hasOwnProperty, N = a.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner, _ = { key: !0, ref: !0, __self: !0, __source: !0 };
  function z(T, g, E) {
    var $, H = {}, L = null, J = null;
    E !== void 0 && (L = "" + E), g.key !== void 0 && (L = "" + g.key), g.ref !== void 0 && (J = g.ref);
    for ($ in g) S.call(g, $) && !_.hasOwnProperty($) && (H[$] = g[$]);
    if (T && T.defaultProps) for ($ in g = T.defaultProps, g) H[$] === void 0 && (H[$] = g[$]);
    return { $$typeof: u, type: T, key: L, ref: J, props: H, _owner: N.current };
  }
  return Cr.Fragment = s, Cr.jsx = z, Cr.jsxs = z, Cr;
}
var Ka;
function xd() {
  return Ka || (Ka = 1, Ao.exports = yd()), Ao.exports;
}
var f = xd(), q = Go(), Hl = {}, $o = { exports: {} }, et = {}, Ho = { exports: {} }, Bo = {};
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
    function u(M, x) {
      var k = M.length;
      M.push(x);
      e: for (; 0 < k; ) {
        var d = k - 1 >>> 1, w = M[d];
        if (0 < N(w, x)) M[d] = x, M[k] = w, k = d;
        else break e;
      }
    }
    function s(M) {
      return M.length === 0 ? null : M[0];
    }
    function S(M) {
      if (M.length === 0) return null;
      var x = M[0], k = M.pop();
      if (k !== x) {
        M[0] = k;
        e: for (var d = 0, w = M.length, D = w >>> 1; d < D; ) {
          var Q = 2 * (d + 1) - 1, Z = M[Q], X = Q + 1, se = M[X];
          if (0 > N(Z, k)) X < w && 0 > N(se, Z) ? (M[d] = se, M[X] = k, d = X) : (M[d] = Z, M[Q] = k, d = Q);
          else if (X < w && 0 > N(se, k)) M[d] = se, M[X] = k, d = X;
          else break e;
        }
      }
      return x;
    }
    function N(M, x) {
      var k = M.sortIndex - x.sortIndex;
      return k !== 0 ? k : M.id - x.id;
    }
    if (typeof performance == "object" && typeof performance.now == "function") {
      var _ = performance;
      a.unstable_now = function() {
        return _.now();
      };
    } else {
      var z = Date, T = z.now();
      a.unstable_now = function() {
        return z.now() - T;
      };
    }
    var g = [], E = [], $ = 1, H = null, L = 3, J = !1, b = !1, ee = !1, le = typeof setTimeout == "function" ? setTimeout : null, je = typeof clearTimeout == "function" ? clearTimeout : null, Le = typeof setImmediate < "u" ? setImmediate : null;
    typeof navigator < "u" && navigator.scheduling !== void 0 && navigator.scheduling.isInputPending !== void 0 && navigator.scheduling.isInputPending.bind(navigator.scheduling);
    function Pe(M) {
      for (var x = s(E); x !== null; ) {
        if (x.callback === null) S(E);
        else if (x.startTime <= M) S(E), x.sortIndex = x.expirationTime, u(g, x);
        else break;
        x = s(E);
      }
    }
    function he(M) {
      if (ee = !1, Pe(M), !b) if (s(g) !== null) b = !0, Ie(Te);
      else {
        var x = s(E);
        x !== null && xe(he, x.startTime - M);
      }
    }
    function Te(M, x) {
      b = !1, ee && (ee = !1, je(re), re = -1), J = !0;
      var k = L;
      try {
        for (Pe(x), H = s(g); H !== null && (!(H.expirationTime > x) || M && !ie()); ) {
          var d = H.callback;
          if (typeof d == "function") {
            H.callback = null, L = H.priorityLevel;
            var w = d(H.expirationTime <= x);
            x = a.unstable_now(), typeof w == "function" ? H.callback = w : H === s(g) && S(g), Pe(x);
          } else S(g);
          H = s(g);
        }
        if (H !== null) var D = !0;
        else {
          var Q = s(E);
          Q !== null && xe(he, Q.startTime - x), D = !1;
        }
        return D;
      } finally {
        H = null, L = k, J = !1;
      }
    }
    var B = !1, ce = null, re = -1, ue = 5, K = -1;
    function ie() {
      return !(a.unstable_now() - K < ue);
    }
    function ne() {
      if (ce !== null) {
        var M = a.unstable_now();
        K = M;
        var x = !0;
        try {
          x = ce(!0, M);
        } finally {
          x ? ye() : (B = !1, ce = null);
        }
      } else B = !1;
    }
    var ye;
    if (typeof Le == "function") ye = function() {
      Le(ne);
    };
    else if (typeof MessageChannel < "u") {
      var Ge = new MessageChannel(), Ye = Ge.port2;
      Ge.port1.onmessage = ne, ye = function() {
        Ye.postMessage(null);
      };
    } else ye = function() {
      le(ne, 0);
    };
    function Ie(M) {
      ce = M, B || (B = !0, ye());
    }
    function xe(M, x) {
      re = le(function() {
        M(a.unstable_now());
      }, x);
    }
    a.unstable_IdlePriority = 5, a.unstable_ImmediatePriority = 1, a.unstable_LowPriority = 4, a.unstable_NormalPriority = 3, a.unstable_Profiling = null, a.unstable_UserBlockingPriority = 2, a.unstable_cancelCallback = function(M) {
      M.callback = null;
    }, a.unstable_continueExecution = function() {
      b || J || (b = !0, Ie(Te));
    }, a.unstable_forceFrameRate = function(M) {
      0 > M || 125 < M ? console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported") : ue = 0 < M ? Math.floor(1e3 / M) : 5;
    }, a.unstable_getCurrentPriorityLevel = function() {
      return L;
    }, a.unstable_getFirstCallbackNode = function() {
      return s(g);
    }, a.unstable_next = function(M) {
      switch (L) {
        case 1:
        case 2:
        case 3:
          var x = 3;
          break;
        default:
          x = L;
      }
      var k = L;
      L = x;
      try {
        return M();
      } finally {
        L = k;
      }
    }, a.unstable_pauseExecution = function() {
    }, a.unstable_requestPaint = function() {
    }, a.unstable_runWithPriority = function(M, x) {
      switch (M) {
        case 1:
        case 2:
        case 3:
        case 4:
        case 5:
          break;
        default:
          M = 3;
      }
      var k = L;
      L = M;
      try {
        return x();
      } finally {
        L = k;
      }
    }, a.unstable_scheduleCallback = function(M, x, k) {
      var d = a.unstable_now();
      switch (typeof k == "object" && k !== null ? (k = k.delay, k = typeof k == "number" && 0 < k ? d + k : d) : k = d, M) {
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
      return w = k + w, M = { id: $++, callback: x, priorityLevel: M, startTime: k, expirationTime: w, sortIndex: -1 }, k > d ? (M.sortIndex = k, u(E, M), s(g) === null && M === s(E) && (ee ? (je(re), re = -1) : ee = !0, xe(he, k - d))) : (M.sortIndex = w, u(g, M), b || J || (b = !0, Ie(Te))), M;
    }, a.unstable_shouldYield = ie, a.unstable_wrapCallback = function(M) {
      var x = L;
      return function() {
        var k = L;
        L = x;
        try {
          return M.apply(this, arguments);
        } finally {
          L = k;
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
  var S = /* @__PURE__ */ new Set(), N = {};
  function _(e, t) {
    z(e, t), z(e + "Capture", t);
  }
  function z(e, t) {
    for (N[e] = t, e = 0; e < t.length; e++) S.add(t[e]);
  }
  var T = !(typeof window > "u" || typeof window.document > "u" || typeof window.document.createElement > "u"), g = Object.prototype.hasOwnProperty, E = /^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/, $ = {}, H = {};
  function L(e) {
    return g.call(H, e) ? !0 : g.call($, e) ? !1 : E.test(e) ? H[e] = !0 : ($[e] = !0, !1);
  }
  function J(e, t, n, r) {
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
  function b(e, t, n, r) {
    if (t === null || typeof t > "u" || J(e, t, n, r)) return !0;
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
  function ee(e, t, n, r, l, i, o) {
    this.acceptsBooleans = t === 2 || t === 3 || t === 4, this.attributeName = r, this.attributeNamespace = l, this.mustUseProperty = n, this.propertyName = e, this.type = t, this.sanitizeURL = i, this.removeEmptyString = o;
  }
  var le = {};
  "children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style".split(" ").forEach(function(e) {
    le[e] = new ee(e, 0, !1, e, null, !1, !1);
  }), [["acceptCharset", "accept-charset"], ["className", "class"], ["htmlFor", "for"], ["httpEquiv", "http-equiv"]].forEach(function(e) {
    var t = e[0];
    le[t] = new ee(t, 1, !1, e[1], null, !1, !1);
  }), ["contentEditable", "draggable", "spellCheck", "value"].forEach(function(e) {
    le[e] = new ee(e, 2, !1, e.toLowerCase(), null, !1, !1);
  }), ["autoReverse", "externalResourcesRequired", "focusable", "preserveAlpha"].forEach(function(e) {
    le[e] = new ee(e, 2, !1, e, null, !1, !1);
  }), "allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope".split(" ").forEach(function(e) {
    le[e] = new ee(e, 3, !1, e.toLowerCase(), null, !1, !1);
  }), ["checked", "multiple", "muted", "selected"].forEach(function(e) {
    le[e] = new ee(e, 3, !0, e, null, !1, !1);
  }), ["capture", "download"].forEach(function(e) {
    le[e] = new ee(e, 4, !1, e, null, !1, !1);
  }), ["cols", "rows", "size", "span"].forEach(function(e) {
    le[e] = new ee(e, 6, !1, e, null, !1, !1);
  }), ["rowSpan", "start"].forEach(function(e) {
    le[e] = new ee(e, 5, !1, e.toLowerCase(), null, !1, !1);
  });
  var je = /[\-:]([a-z])/g;
  function Le(e) {
    return e[1].toUpperCase();
  }
  "accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height".split(" ").forEach(function(e) {
    var t = e.replace(
      je,
      Le
    );
    le[t] = new ee(t, 1, !1, e, null, !1, !1);
  }), "xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type".split(" ").forEach(function(e) {
    var t = e.replace(je, Le);
    le[t] = new ee(t, 1, !1, e, "http://www.w3.org/1999/xlink", !1, !1);
  }), ["xml:base", "xml:lang", "xml:space"].forEach(function(e) {
    var t = e.replace(je, Le);
    le[t] = new ee(t, 1, !1, e, "http://www.w3.org/XML/1998/namespace", !1, !1);
  }), ["tabIndex", "crossOrigin"].forEach(function(e) {
    le[e] = new ee(e, 1, !1, e.toLowerCase(), null, !1, !1);
  }), le.xlinkHref = new ee("xlinkHref", 1, !1, "xlink:href", "http://www.w3.org/1999/xlink", !0, !1), ["src", "href", "action", "formAction"].forEach(function(e) {
    le[e] = new ee(e, 1, !1, e.toLowerCase(), null, !0, !0);
  });
  function Pe(e, t, n, r) {
    var l = le.hasOwnProperty(t) ? le[t] : null;
    (l !== null ? l.type !== 0 : r || !(2 < t.length) || t[0] !== "o" && t[0] !== "O" || t[1] !== "n" && t[1] !== "N") && (b(t, n, l, r) && (n = null), r || l === null ? L(t) && (n === null ? e.removeAttribute(t) : e.setAttribute(t, "" + n)) : l.mustUseProperty ? e[l.propertyName] = n === null ? l.type === 3 ? !1 : "" : n : (t = l.attributeName, r = l.attributeNamespace, n === null ? e.removeAttribute(t) : (l = l.type, n = l === 3 || l === 4 && n === !0 ? "" : "" + n, r ? e.setAttributeNS(r, t, n) : e.setAttribute(t, n))));
  }
  var he = a.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED, Te = Symbol.for("react.element"), B = Symbol.for("react.portal"), ce = Symbol.for("react.fragment"), re = Symbol.for("react.strict_mode"), ue = Symbol.for("react.profiler"), K = Symbol.for("react.provider"), ie = Symbol.for("react.context"), ne = Symbol.for("react.forward_ref"), ye = Symbol.for("react.suspense"), Ge = Symbol.for("react.suspense_list"), Ye = Symbol.for("react.memo"), Ie = Symbol.for("react.lazy"), xe = Symbol.for("react.offscreen"), M = Symbol.iterator;
  function x(e) {
    return e === null || typeof e != "object" ? null : (e = M && e[M] || e["@@iterator"], typeof e == "function" ? e : null);
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
  function Q(e, t) {
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
`), o = l.length - 1, c = i.length - 1; 1 <= o && 0 <= c && l[o] !== i[c]; ) c--;
        for (; 1 <= o && 0 <= c; o--, c--) if (l[o] !== i[c]) {
          if (o !== 1 || c !== 1)
            do
              if (o--, c--, 0 > c || l[o] !== i[c]) {
                var p = `
` + l[o].replace(" at new ", " at ");
                return e.displayName && p.includes("<anonymous>") && (p = p.replace("<anonymous>", e.displayName)), p;
              }
            while (1 <= o && 0 <= c);
          break;
        }
      }
    } finally {
      D = !1, Error.prepareStackTrace = n;
    }
    return (e = e ? e.displayName || e.name : "") ? w(e) : "";
  }
  function Z(e) {
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
        return e = Q(e.type, !1), e;
      case 11:
        return e = Q(e.type.render, !1), e;
      case 1:
        return e = Q(e.type, !0), e;
      default:
        return "";
    }
  }
  function X(e) {
    if (e == null) return null;
    if (typeof e == "function") return e.displayName || e.name || null;
    if (typeof e == "string") return e;
    switch (e) {
      case ce:
        return "Fragment";
      case B:
        return "Portal";
      case ue:
        return "Profiler";
      case re:
        return "StrictMode";
      case ye:
        return "Suspense";
      case Ge:
        return "SuspenseList";
    }
    if (typeof e == "object") switch (e.$$typeof) {
      case ie:
        return (e.displayName || "Context") + ".Consumer";
      case K:
        return (e._context.displayName || "Context") + ".Provider";
      case ne:
        var t = e.render;
        return e = e.displayName, e || (e = t.displayName || t.name || "", e = e !== "" ? "ForwardRef(" + e + ")" : "ForwardRef"), e;
      case Ye:
        return t = e.displayName || null, t !== null ? t : X(e.type) || "Memo";
      case Ie:
        t = e._payload, e = e._init;
        try {
          return X(e(t));
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
        return X(t);
      case 8:
        return t === re ? "StrictMode" : "Mode";
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
  function G(e) {
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
  function Ee(e) {
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
    e._valueTracker || (e._valueTracker = Ee(e));
  }
  function $n(e) {
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
    n = G(t.value != null ? t.value : n), e._wrapperState = { initialChecked: r, initialValue: n, controlled: t.type === "checkbox" || t.type === "radio" ? t.checked != null : t.value != null };
  }
  function Jo(e, t) {
    t = t.checked, t != null && Pe(e, "checked", t, !1);
  }
  function Ql(e, t) {
    Jo(e, t);
    var n = G(t.value), r = t.type;
    if (n != null) r === "number" ? (n === 0 && e.value === "" || e.value != n) && (e.value = "" + n) : e.value !== "" + n && (e.value = "" + n);
    else if (r === "submit" || r === "reset") {
      e.removeAttribute("value");
      return;
    }
    t.hasOwnProperty("value") ? Kl(e, t.type, n) : t.hasOwnProperty("defaultValue") && Kl(e, t.type, G(t.defaultValue)), t.checked == null && t.defaultChecked != null && (e.defaultChecked = !!t.defaultChecked);
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
      for (n = "" + G(n), t = null, l = 0; l < e.length; l++) {
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
    e._wrapperState = { initialValue: G(n) };
  }
  function es(e, t) {
    var n = G(t.value), r = G(t.defaultValue);
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
  if (T) try {
    var Qn = {};
    Object.defineProperty(Qn, "passive", { get: function() {
      ti = !0;
    } }), window.addEventListener("test", Qn, Qn), window.removeEventListener("test", Qn, Qn);
  } catch {
    ti = !1;
  }
  function wc(e, t, n, r, l, i, o, c, p) {
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
  function Sc(e, t, n, r, l, i, o, c, p) {
    Kn = !1, Ir = null, wc.apply(kc, arguments);
  }
  function Ec(e, t, n, r, l, i, o, c, p) {
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
        for (var o = !1, c = l.child; c; ) {
          if (c === n) {
            o = !0, n = l, r = i;
            break;
          }
          if (c === r) {
            o = !0, r = l, n = i;
            break;
          }
          c = c.sibling;
        }
        if (!o) {
          for (c = i.child; c; ) {
            if (c === n) {
              o = !0, n = i, r = l;
              break;
            }
            if (c === r) {
              o = !0, r = i, n = l;
              break;
            }
            c = c.sibling;
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
  var vs = u.unstable_scheduleCallback, gs = u.unstable_cancelCallback, _c = u.unstable_shouldYield, Cc = u.unstable_requestPaint, _e = u.unstable_now, jc = u.unstable_getCurrentPriorityLevel, ri = u.unstable_ImmediatePriority, ys = u.unstable_UserBlockingPriority, Fr = u.unstable_NormalPriority, zc = u.unstable_LowPriority, xs = u.unstable_IdlePriority, Or = null, wt = null;
  function Pc(e) {
    if (wt && typeof wt.onCommitFiberRoot == "function") try {
      wt.onCommitFiberRoot(Or, e, void 0, (e.current.flags & 128) === 128);
    } catch {
    }
  }
  var pt = Math.clz32 ? Math.clz32 : Mc, Tc = Math.log, Rc = Math.LN2;
  function Mc(e) {
    return e >>>= 0, e === 0 ? 32 : 31 - (Tc(e) / Rc | 0) | 0;
  }
  var Ar = 64, Ur = 4194304;
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
  function $r(e, t) {
    var n = e.pendingLanes;
    if (n === 0) return 0;
    var r = 0, l = e.suspendedLanes, i = e.pingedLanes, o = n & 268435455;
    if (o !== 0) {
      var c = o & ~l;
      c !== 0 ? r = Gn(c) : (i &= o, i !== 0 && (r = Gn(i)));
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
      var o = 31 - pt(i), c = 1 << o, p = l[o];
      p === -1 ? ((c & n) === 0 || (c & r) !== 0) && (l[o] = Lc(c, t)) : p <= t && (e.expiredLanes |= c), i &= ~c;
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
  var Ss, si, Es, Ns, _s, ui = !1, Hr = [], Lt = null, It = null, Dt = null, Xn = /* @__PURE__ */ new Map(), Zn = /* @__PURE__ */ new Map(), Ft = [], Fc = "mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset submit".split(" ");
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
            e.blockedOn = t, _s(e.priority, function() {
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
  var gn = he.ReactCurrentBatchConfig, Vr = !0;
  function Uc(e, t, n, r) {
    var l = de, i = gn.transition;
    gn.transition = null;
    try {
      de = 1, ai(e, t, n, r);
    } finally {
      de = l, gn.transition = i;
    }
  }
  function $c(e, t, n, r) {
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
      if (l === null) ji(e, t, r, Wr, n), Cs(e, r);
      else if (Oc(l, e, t, n, r)) r.stopPropagation();
      else if (Cs(e, r), t & 4 && -1 < Fc.indexOf(e)) {
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
  function Ps(e) {
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
  function Ts() {
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
      for (var c in e) e.hasOwnProperty(c) && (n = e[c], this[c] = n ? n(i) : i[c]);
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
  }), af = tt(uf), cf = [9, 13, 27, 32], gi = T && "CompositionEvent" in window, nr = null;
  T && "documentMode" in document && (nr = document.documentMode);
  var ff = T && "TextEvent" in window && !nr, Ds = T && (!gi || nr && 8 < nr && 11 >= nr), Fs = " ", Os = !1;
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
  function Us(e) {
    return e = e.detail, typeof e == "object" && "data" in e ? e.data : null;
  }
  var xn = !1;
  function df(e, t) {
    switch (e) {
      case "compositionend":
        return Us(t);
      case "keypress":
        return t.which !== 32 ? null : (Os = !0, Fs);
      case "textInput":
        return e = t.data, e === Fs && Os ? null : e;
      default:
        return null;
    }
  }
  function pf(e, t) {
    if (xn) return e === "compositionend" || !gi && As(e, t) ? (e = Ts(), Qr = fi = Ot = null, xn = !1, e) : null;
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
  function $s(e) {
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
    if ($n(t)) return e;
  }
  function vf(e, t) {
    if (e === "change") return t;
  }
  var Bs = !1;
  if (T) {
    var yi;
    if (T) {
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
      if (!g.call(t, l) || !ht(e[l], t[l])) return !1;
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
  var Ef = T && "documentMode" in document && 11 >= document.documentMode, wn = null, ki = null, or = null, Si = !1;
  function Zs(e, t, n) {
    var r = n.window === n ? n.document : n.nodeType === 9 ? n : n.ownerDocument;
    Si || wn == null || wn !== Mr(r) || (r = wn, "selectionStart" in r && wi(r) ? r = { start: r.selectionStart, end: r.selectionEnd } : (r = (r.ownerDocument && r.ownerDocument.defaultView || window).getSelection(), r = { anchorNode: r.anchorNode, anchorOffset: r.anchorOffset, focusNode: r.focusNode, focusOffset: r.focusOffset }), or && ir(or, r) || (or = r, r = br(ki, "onSelect"), 0 < r.length && (t = new di("onSelect", "select", null, t, n), e.push({ event: t, listeners: r }), t.target = wn)));
  }
  function Zr(e, t) {
    var n = {};
    return n[e.toLowerCase()] = t.toLowerCase(), n["Webkit" + e] = "webkit" + t, n["Moz" + e] = "moz" + t, n;
  }
  var kn = { animationend: Zr("Animation", "AnimationEnd"), animationiteration: Zr("Animation", "AnimationIteration"), animationstart: Zr("Animation", "AnimationStart"), transitionend: Zr("Transition", "TransitionEnd") }, Ei = {}, Js = {};
  T && (Js = document.createElement("div").style, "AnimationEvent" in window || (delete kn.animationend.animation, delete kn.animationiteration.animation, delete kn.animationstart.animation), "TransitionEvent" in window || delete kn.transitionend.transition);
  function Jr(e) {
    if (Ei[e]) return Ei[e];
    if (!kn[e]) return e;
    var t = kn[e], n;
    for (n in t) if (t.hasOwnProperty(n) && n in Js) return Ei[e] = t[n];
    return e;
  }
  var qs = Jr("animationend"), bs = Jr("animationiteration"), eu = Jr("animationstart"), tu = Jr("transitionend"), nu = /* @__PURE__ */ new Map(), ru = "abort auxClick cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");
  function At(e, t) {
    nu.set(e, t), _(t, [e]);
  }
  for (var Ni = 0; Ni < ru.length; Ni++) {
    var _i = ru[Ni], Nf = _i.toLowerCase(), _f = _i[0].toUpperCase() + _i.slice(1);
    At(Nf, "on" + _f);
  }
  At(qs, "onAnimationEnd"), At(bs, "onAnimationIteration"), At(eu, "onAnimationStart"), At("dblclick", "onDoubleClick"), At("focusin", "onFocus"), At("focusout", "onBlur"), At(tu, "onTransitionEnd"), z("onMouseEnter", ["mouseout", "mouseover"]), z("onMouseLeave", ["mouseout", "mouseover"]), z("onPointerEnter", ["pointerout", "pointerover"]), z("onPointerLeave", ["pointerout", "pointerover"]), _("onChange", "change click focusin focusout input keydown keyup selectionchange".split(" ")), _("onSelect", "focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" ")), _("onBeforeInput", ["compositionend", "keypress", "textInput", "paste"]), _("onCompositionEnd", "compositionend focusout keydown keypress keyup mousedown".split(" ")), _("onCompositionStart", "compositionstart focusout keydown keypress keyup mousedown".split(" ")), _("onCompositionUpdate", "compositionupdate focusout keydown keypress keyup mousedown".split(" "));
  var sr = "abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "), Cf = new Set("cancel close invalid load scroll toggle".split(" ").concat(sr));
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
          var c = r[o], p = c.instance, y = c.currentTarget;
          if (c = c.listener, p !== i && l.isPropagationStopped()) break e;
          lu(l, c, y), i = p;
        }
        else for (o = 0; o < r.length; o++) {
          if (c = r[o], p = c.instance, y = c.currentTarget, c = c.listener, p !== i && l.isPropagationStopped()) break e;
          lu(l, c, y), i = p;
        }
      }
    }
    if (Dr) throw e = ni, Dr = !1, ni = null, e;
  }
  function me(e, t) {
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
      e[qr] = !0, S.forEach(function(n) {
        n !== "selectionchange" && (Cf.has(n) || Ci(n, !1, e), Ci(n, !0, e));
      });
      var t = e.nodeType === 9 ? e : e.ownerDocument;
      t === null || t[qr] || (t[qr] = !0, Ci("selectionchange", !1, t));
    }
  }
  function ou(e, t, n, r) {
    switch (Ps(t)) {
      case 1:
        var l = Uc;
        break;
      case 4:
        l = $c;
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
        var c = r.stateNode.containerInfo;
        if (c === l || c.nodeType === 8 && c.parentNode === l) break;
        if (o === 4) for (o = r.return; o !== null; ) {
          var p = o.tag;
          if ((p === 3 || p === 4) && (p = o.stateNode.containerInfo, p === l || p.nodeType === 8 && p.parentNode === l)) return;
          o = o.return;
        }
        for (; c !== null; ) {
          if (o = en(c), o === null) return;
          if (p = o.tag, p === 5 || p === 6) {
            r = i = o;
            continue e;
          }
          c = c.parentNode;
        }
      }
      r = r.return;
    }
    fs(function() {
      var y = i, j = ql(n), P = [];
      e: {
        var C = nu.get(e);
        if (C !== void 0) {
          var I = di, O = e;
          switch (e) {
            case "keypress":
              if (Kr(n) === 0) break e;
            case "keydown":
            case "keyup":
              I = tf;
              break;
            case "focusin":
              O = "focus", I = mi;
              break;
            case "focusout":
              O = "blur", I = mi;
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
          var A = (t & 4) !== 0, Ce = !A && e === "scroll", m = A ? C !== null ? C + "Capture" : null : C;
          A = [];
          for (var h = y, v; h !== null; ) {
            v = h;
            var R = v.stateNode;
            if (v.tag === 5 && R !== null && (v = R, m !== null && (R = Wn(h, m), R != null && A.push(ar(h, R, v)))), Ce) break;
            h = h.return;
          }
          0 < A.length && (C = new I(C, O, null, n, j), P.push({ event: C, listeners: A }));
        }
      }
      if ((t & 7) === 0) {
        e: {
          if (C = e === "mouseover" || e === "pointerover", I = e === "mouseout" || e === "pointerout", C && n !== Jl && (O = n.relatedTarget || n.fromElement) && (en(O) || O[_t])) break e;
          if ((I || C) && (C = j.window === j ? j : (C = j.ownerDocument) ? C.defaultView || C.parentWindow : window, I ? (O = n.relatedTarget || n.toElement, I = y, O = O ? en(O) : null, O !== null && (Ce = bt(O), O !== Ce || O.tag !== 5 && O.tag !== 6) && (O = null)) : (I = null, O = y), I !== O)) {
            if (A = Ms, R = "onMouseLeave", m = "onMouseEnter", h = "mouse", (e === "pointerout" || e === "pointerover") && (A = Is, R = "onPointerLeave", m = "onPointerEnter", h = "pointer"), Ce = I == null ? C : Nn(I), v = O == null ? C : Nn(O), C = new A(R, h + "leave", I, n, j), C.target = Ce, C.relatedTarget = v, R = null, en(j) === y && (A = new A(m, h + "enter", O, n, j), A.target = v, A.relatedTarget = Ce, R = A), Ce = R, I && O) t: {
              for (A = I, m = O, h = 0, v = A; v; v = Sn(v)) h++;
              for (v = 0, R = m; R; R = Sn(R)) v++;
              for (; 0 < h - v; ) A = Sn(A), h--;
              for (; 0 < v - h; ) m = Sn(m), v--;
              for (; h--; ) {
                if (A === m || m !== null && A === m.alternate) break t;
                A = Sn(A), m = Sn(m);
              }
              A = null;
            }
            else A = null;
            I !== null && su(P, C, I, A, !1), O !== null && Ce !== null && su(P, Ce, O, A, !0);
          }
        }
        e: {
          if (C = y ? Nn(y) : window, I = C.nodeName && C.nodeName.toLowerCase(), I === "select" || I === "input" && C.type === "file") var U = vf;
          else if ($s(C)) if (Bs) U = wf;
          else {
            U = yf;
            var V = gf;
          }
          else (I = C.nodeName) && I.toLowerCase() === "input" && (C.type === "checkbox" || C.type === "radio") && (U = xf);
          if (U && (U = U(e, y))) {
            Hs(P, U, n, j);
            break e;
          }
          V && V(e, C, y), e === "focusout" && (V = C._wrapperState) && V.controlled && C.type === "number" && Kl(C, "number", C.value);
        }
        switch (V = y ? Nn(y) : window, e) {
          case "focusin":
            ($s(V) || V.contentEditable === "true") && (wn = V, ki = y, or = null);
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
            Si = !1, Zs(P, n, j);
            break;
          case "selectionchange":
            if (Ef) break;
          case "keydown":
          case "keyup":
            Zs(P, n, j);
        }
        var W;
        if (gi) e: {
          switch (e) {
            case "compositionstart":
              var Y = "onCompositionStart";
              break e;
            case "compositionend":
              Y = "onCompositionEnd";
              break e;
            case "compositionupdate":
              Y = "onCompositionUpdate";
              break e;
          }
          Y = void 0;
        }
        else xn ? As(e, n) && (Y = "onCompositionEnd") : e === "keydown" && n.keyCode === 229 && (Y = "onCompositionStart");
        Y && (Ds && n.locale !== "ko" && (xn || Y !== "onCompositionStart" ? Y === "onCompositionEnd" && xn && (W = Ts()) : (Ot = j, fi = "value" in Ot ? Ot.value : Ot.textContent, xn = !0)), V = br(y, Y), 0 < V.length && (Y = new Ls(Y, e, null, n, j), P.push({ event: Y, listeners: V }), W ? Y.data = W : (W = Us(n), W !== null && (Y.data = W)))), (W = ff ? df(e, n) : pf(e, n)) && (y = br(y, "onBeforeInput"), 0 < y.length && (j = new Ls("onBeforeInput", "beforeinput", null, n, j), P.push({ event: j, listeners: y }), j.data = W));
      }
      iu(P, t);
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
      var c = n, p = c.alternate, y = c.stateNode;
      if (p !== null && p === r) break;
      c.tag === 5 && y !== null && (c = y, l ? (p = Wn(n, i), p != null && o.unshift(ar(n, p, c))) : l || (p = Wn(n, i), p != null && o.push(ar(n, p, c)))), n = n.return;
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
  var zi = null, Pi = null;
  function Ti(e, t) {
    return e === "textarea" || e === "noscript" || typeof t.children == "string" || typeof t.children == "number" || typeof t.dangerouslySetInnerHTML == "object" && t.dangerouslySetInnerHTML !== null && t.dangerouslySetInnerHTML.__html != null;
  }
  var Ri = typeof setTimeout == "function" ? setTimeout : void 0, Pf = typeof clearTimeout == "function" ? clearTimeout : void 0, au = typeof Promise == "function" ? Promise : void 0, Tf = typeof queueMicrotask == "function" ? queueMicrotask : typeof au < "u" ? function(e) {
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
  function Ut(e) {
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
  var En = Math.random().toString(36).slice(2), kt = "__reactFiber$" + En, cr = "__reactProps$" + En, _t = "__reactContainer$" + En, Li = "__reactEvents$" + En, Mf = "__reactListeners$" + En, Lf = "__reactHandles$" + En;
  function en(e) {
    var t = e[kt];
    if (t) return t;
    for (var n = e.parentNode; n; ) {
      if (t = n[_t] || n[kt]) {
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
    return e = e[kt] || e[_t], !e || e.tag !== 5 && e.tag !== 6 && e.tag !== 13 && e.tag !== 3 ? null : e;
  }
  function Nn(e) {
    if (e.tag === 5 || e.tag === 6) return e.stateNode;
    throw Error(s(33));
  }
  function nl(e) {
    return e[cr] || null;
  }
  var Ii = [], _n = -1;
  function $t(e) {
    return { current: e };
  }
  function ve(e) {
    0 > _n || (e.current = Ii[_n], Ii[_n] = null, _n--);
  }
  function pe(e, t) {
    _n++, Ii[_n] = e.current, e.current = t;
  }
  var Ht = {}, He = $t(Ht), Xe = $t(!1), tn = Ht;
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
    ve(Xe), ve(He);
  }
  function fu(e, t, n) {
    if (He.current !== Ht) throw Error(s(168));
    pe(He, t), pe(Xe, n);
  }
  function du(e, t, n) {
    var r = e.stateNode;
    if (t = t.childContextTypes, typeof r.getChildContext != "function") return n;
    r = r.getChildContext();
    for (var l in r) if (!(l in t)) throw Error(s(108, se(e) || "Unknown", l));
    return k({}, n, r);
  }
  function ll(e) {
    return e = (e = e.stateNode) && e.__reactInternalMemoizedMergedChildContext || Ht, tn = He.current, pe(He, e), pe(Xe, Xe.current), !0;
  }
  function pu(e, t, n) {
    var r = e.stateNode;
    if (!r) throw Error(s(169));
    n ? (e = du(e, t, tn), r.__reactInternalMemoizedMergedChildContext = e, ve(Xe), ve(He), pe(He, e)) : ve(Xe), pe(Xe, n);
  }
  var Ct = null, il = !1, Di = !1;
  function hu(e) {
    Ct === null ? Ct = [e] : Ct.push(e);
  }
  function If(e) {
    il = !0, hu(e);
  }
  function Bt() {
    if (!Di && Ct !== null) {
      Di = !0;
      var e = 0, t = de;
      try {
        var n = Ct;
        for (de = 1; e < n.length; e++) {
          var r = n[e];
          do
            r = r(!0);
          while (r !== null);
        }
        Ct = null, il = !1;
      } catch (l) {
        throw Ct !== null && (Ct = Ct.slice(e + 1)), vs(ri, Bt), l;
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
  var nt = null, rt = null, we = !1, mt = null;
  function vu(e, t) {
    var n = ft(5, null, null, 0);
    n.elementType = "DELETED", n.stateNode = t, n.return = e, t = e.deletions, t === null ? (e.deletions = [n], e.flags |= 16) : t.push(n);
  }
  function gu(e, t) {
    switch (e.tag) {
      case 5:
        var n = e.type;
        return t = t.nodeType !== 1 || n.toLowerCase() !== t.nodeName.toLowerCase() ? null : t, t !== null ? (e.stateNode = t, nt = e, rt = Ut(t.firstChild), !0) : !1;
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
  function Ui(e) {
    if (we) {
      var t = rt;
      if (t) {
        var n = t;
        if (!gu(e, t)) {
          if (Ai(e)) throw Error(s(418));
          t = Ut(n.nextSibling);
          var r = nt;
          t && gu(e, t) ? vu(r, n) : (e.flags = e.flags & -4097 | 2, we = !1, nt = e);
        }
      } else {
        if (Ai(e)) throw Error(s(418));
        e.flags = e.flags & -4097 | 2, we = !1, nt = e;
      }
    }
  }
  function yu(e) {
    for (e = e.return; e !== null && e.tag !== 5 && e.tag !== 3 && e.tag !== 13; ) e = e.return;
    nt = e;
  }
  function ul(e) {
    if (e !== nt) return !1;
    if (!we) return yu(e), we = !0, !1;
    var t;
    if ((t = e.tag !== 3) && !(t = e.tag !== 5) && (t = e.type, t = t !== "head" && t !== "body" && !Ti(e.type, e.memoizedProps)), t && (t = rt)) {
      if (Ai(e)) throw xu(), Error(s(418));
      for (; t; ) vu(e, t), t = Ut(t.nextSibling);
    }
    if (yu(e), e.tag === 13) {
      if (e = e.memoizedState, e = e !== null ? e.dehydrated : null, !e) throw Error(s(317));
      e: {
        for (e = e.nextSibling, t = 0; e; ) {
          if (e.nodeType === 8) {
            var n = e.data;
            if (n === "/$") {
              if (t === 0) {
                rt = Ut(e.nextSibling);
                break e;
              }
              t--;
            } else n !== "$" && n !== "$!" && n !== "$?" || t++;
          }
          e = e.nextSibling;
        }
        rt = null;
      }
    } else rt = nt ? Ut(e.stateNode.nextSibling) : null;
    return !0;
  }
  function xu() {
    for (var e = rt; e; ) e = Ut(e.nextSibling);
  }
  function Pn() {
    rt = nt = null, we = !1;
  }
  function $i(e) {
    mt === null ? mt = [e] : mt.push(e);
  }
  var Df = he.ReactCurrentBatchConfig;
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
          var c = l.refs;
          o === null ? delete c[i] : c[i] = o;
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
        var v = m.deletions;
        v === null ? (m.deletions = [h], m.flags |= 16) : v.push(h);
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
    function i(m, h, v) {
      return m.index = v, e ? (v = m.alternate, v !== null ? (v = v.index, v < h ? (m.flags |= 2, h) : v) : (m.flags |= 2, h)) : (m.flags |= 1048576, h);
    }
    function o(m) {
      return e && m.alternate === null && (m.flags |= 2), m;
    }
    function c(m, h, v, R) {
      return h === null || h.tag !== 6 ? (h = Mo(v, m.mode, R), h.return = m, h) : (h = l(h, v), h.return = m, h);
    }
    function p(m, h, v, R) {
      var U = v.type;
      return U === ce ? j(m, h, v.props.children, R, v.key) : h !== null && (h.elementType === U || typeof U == "object" && U !== null && U.$$typeof === Ie && wu(U) === h.type) ? (R = l(h, v.props), R.ref = dr(m, h, v), R.return = m, R) : (R = Ll(v.type, v.key, v.props, null, m.mode, R), R.ref = dr(m, h, v), R.return = m, R);
    }
    function y(m, h, v, R) {
      return h === null || h.tag !== 4 || h.stateNode.containerInfo !== v.containerInfo || h.stateNode.implementation !== v.implementation ? (h = Lo(v, m.mode, R), h.return = m, h) : (h = l(h, v.children || []), h.return = m, h);
    }
    function j(m, h, v, R, U) {
      return h === null || h.tag !== 7 ? (h = dn(v, m.mode, R, U), h.return = m, h) : (h = l(h, v), h.return = m, h);
    }
    function P(m, h, v) {
      if (typeof h == "string" && h !== "" || typeof h == "number") return h = Mo("" + h, m.mode, v), h.return = m, h;
      if (typeof h == "object" && h !== null) {
        switch (h.$$typeof) {
          case Te:
            return v = Ll(h.type, h.key, h.props, null, m.mode, v), v.ref = dr(m, null, h), v.return = m, v;
          case B:
            return h = Lo(h, m.mode, v), h.return = m, h;
          case Ie:
            var R = h._init;
            return P(m, R(h._payload), v);
        }
        if (Hn(h) || x(h)) return h = dn(h, m.mode, v, null), h.return = m, h;
        al(m, h);
      }
      return null;
    }
    function C(m, h, v, R) {
      var U = h !== null ? h.key : null;
      if (typeof v == "string" && v !== "" || typeof v == "number") return U !== null ? null : c(m, h, "" + v, R);
      if (typeof v == "object" && v !== null) {
        switch (v.$$typeof) {
          case Te:
            return v.key === U ? p(m, h, v, R) : null;
          case B:
            return v.key === U ? y(m, h, v, R) : null;
          case Ie:
            return U = v._init, C(
              m,
              h,
              U(v._payload),
              R
            );
        }
        if (Hn(v) || x(v)) return U !== null ? null : j(m, h, v, R, null);
        al(m, v);
      }
      return null;
    }
    function I(m, h, v, R, U) {
      if (typeof R == "string" && R !== "" || typeof R == "number") return m = m.get(v) || null, c(h, m, "" + R, U);
      if (typeof R == "object" && R !== null) {
        switch (R.$$typeof) {
          case Te:
            return m = m.get(R.key === null ? v : R.key) || null, p(h, m, R, U);
          case B:
            return m = m.get(R.key === null ? v : R.key) || null, y(h, m, R, U);
          case Ie:
            var V = R._init;
            return I(m, h, v, V(R._payload), U);
        }
        if (Hn(R) || x(R)) return m = m.get(v) || null, j(h, m, R, U, null);
        al(h, R);
      }
      return null;
    }
    function O(m, h, v, R) {
      for (var U = null, V = null, W = h, Y = h = 0, Oe = null; W !== null && Y < v.length; Y++) {
        W.index > Y ? (Oe = W, W = null) : Oe = W.sibling;
        var fe = C(m, W, v[Y], R);
        if (fe === null) {
          W === null && (W = Oe);
          break;
        }
        e && W && fe.alternate === null && t(m, W), h = i(fe, h, Y), V === null ? U = fe : V.sibling = fe, V = fe, W = Oe;
      }
      if (Y === v.length) return n(m, W), we && rn(m, Y), U;
      if (W === null) {
        for (; Y < v.length; Y++) W = P(m, v[Y], R), W !== null && (h = i(W, h, Y), V === null ? U = W : V.sibling = W, V = W);
        return we && rn(m, Y), U;
      }
      for (W = r(m, W); Y < v.length; Y++) Oe = I(W, m, Y, v[Y], R), Oe !== null && (e && Oe.alternate !== null && W.delete(Oe.key === null ? Y : Oe.key), h = i(Oe, h, Y), V === null ? U = Oe : V.sibling = Oe, V = Oe);
      return e && W.forEach(function(Jt) {
        return t(m, Jt);
      }), we && rn(m, Y), U;
    }
    function A(m, h, v, R) {
      var U = x(v);
      if (typeof U != "function") throw Error(s(150));
      if (v = U.call(v), v == null) throw Error(s(151));
      for (var V = U = null, W = h, Y = h = 0, Oe = null, fe = v.next(); W !== null && !fe.done; Y++, fe = v.next()) {
        W.index > Y ? (Oe = W, W = null) : Oe = W.sibling;
        var Jt = C(m, W, fe.value, R);
        if (Jt === null) {
          W === null && (W = Oe);
          break;
        }
        e && W && Jt.alternate === null && t(m, W), h = i(Jt, h, Y), V === null ? U = Jt : V.sibling = Jt, V = Jt, W = Oe;
      }
      if (fe.done) return n(
        m,
        W
      ), we && rn(m, Y), U;
      if (W === null) {
        for (; !fe.done; Y++, fe = v.next()) fe = P(m, fe.value, R), fe !== null && (h = i(fe, h, Y), V === null ? U = fe : V.sibling = fe, V = fe);
        return we && rn(m, Y), U;
      }
      for (W = r(m, W); !fe.done; Y++, fe = v.next()) fe = I(W, m, Y, fe.value, R), fe !== null && (e && fe.alternate !== null && W.delete(fe.key === null ? Y : fe.key), h = i(fe, h, Y), V === null ? U = fe : V.sibling = fe, V = fe);
      return e && W.forEach(function(hd) {
        return t(m, hd);
      }), we && rn(m, Y), U;
    }
    function Ce(m, h, v, R) {
      if (typeof v == "object" && v !== null && v.type === ce && v.key === null && (v = v.props.children), typeof v == "object" && v !== null) {
        switch (v.$$typeof) {
          case Te:
            e: {
              for (var U = v.key, V = h; V !== null; ) {
                if (V.key === U) {
                  if (U = v.type, U === ce) {
                    if (V.tag === 7) {
                      n(m, V.sibling), h = l(V, v.props.children), h.return = m, m = h;
                      break e;
                    }
                  } else if (V.elementType === U || typeof U == "object" && U !== null && U.$$typeof === Ie && wu(U) === V.type) {
                    n(m, V.sibling), h = l(V, v.props), h.ref = dr(m, V, v), h.return = m, m = h;
                    break e;
                  }
                  n(m, V);
                  break;
                } else t(m, V);
                V = V.sibling;
              }
              v.type === ce ? (h = dn(v.props.children, m.mode, R, v.key), h.return = m, m = h) : (R = Ll(v.type, v.key, v.props, null, m.mode, R), R.ref = dr(m, h, v), R.return = m, m = R);
            }
            return o(m);
          case B:
            e: {
              for (V = v.key; h !== null; ) {
                if (h.key === V) if (h.tag === 4 && h.stateNode.containerInfo === v.containerInfo && h.stateNode.implementation === v.implementation) {
                  n(m, h.sibling), h = l(h, v.children || []), h.return = m, m = h;
                  break e;
                } else {
                  n(m, h);
                  break;
                }
                else t(m, h);
                h = h.sibling;
              }
              h = Lo(v, m.mode, R), h.return = m, m = h;
            }
            return o(m);
          case Ie:
            return V = v._init, Ce(m, h, V(v._payload), R);
        }
        if (Hn(v)) return O(m, h, v, R);
        if (x(v)) return A(m, h, v, R);
        al(m, v);
      }
      return typeof v == "string" && v !== "" || typeof v == "number" ? (v = "" + v, h !== null && h.tag === 6 ? (n(m, h.sibling), h = l(h, v), h.return = m, m = h) : (n(m, h), h = Mo(v, m.mode, R), h.return = m, m = h), o(m)) : n(m, h);
    }
    return Ce;
  }
  var Tn = ku(!0), Su = ku(!1), cl = $t(null), fl = null, Rn = null, Hi = null;
  function Bi() {
    Hi = Rn = fl = null;
  }
  function Vi(e) {
    var t = cl.current;
    ve(cl), e._currentValue = t;
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
    return l === null ? (n.next = n, Qi(t)) : (n.next = l.next, l.next = n), t.interleaved = n, Pt(e, r);
  }
  function Pt(e, t) {
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
  function Tt(e, t) {
    return { eventTime: e, lane: t, tag: 0, payload: null, callback: null, next: null };
  }
  function Wt(e, t, n) {
    var r = e.updateQueue;
    if (r === null) return null;
    if (r = r.shared, (ae & 2) !== 0) {
      var l = r.pending;
      return l === null ? t.next = t : (t.next = l.next, l.next = t), r.pending = t, Pt(e, n);
    }
    return l = r.interleaved, l === null ? (t.next = t, Qi(r)) : (t.next = l.next, l.next = t), r.interleaved = t, Pt(e, n);
  }
  function dl(e, t, n) {
    if (t = t.updateQueue, t !== null && (t = t.shared, (n & 4194240) !== 0)) {
      var r = t.lanes;
      r &= e.pendingLanes, n |= r, t.lanes = n, oi(e, n);
    }
  }
  function _u(e, t) {
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
    var i = l.firstBaseUpdate, o = l.lastBaseUpdate, c = l.shared.pending;
    if (c !== null) {
      l.shared.pending = null;
      var p = c, y = p.next;
      p.next = null, o === null ? i = y : o.next = y, o = p;
      var j = e.alternate;
      j !== null && (j = j.updateQueue, c = j.lastBaseUpdate, c !== o && (c === null ? j.firstBaseUpdate = y : c.next = y, j.lastBaseUpdate = p));
    }
    if (i !== null) {
      var P = l.baseState;
      o = 0, j = y = p = null, c = i;
      do {
        var C = c.lane, I = c.eventTime;
        if ((r & C) === C) {
          j !== null && (j = j.next = {
            eventTime: I,
            lane: 0,
            tag: c.tag,
            payload: c.payload,
            callback: c.callback,
            next: null
          });
          e: {
            var O = e, A = c;
            switch (C = t, I = n, A.tag) {
              case 1:
                if (O = A.payload, typeof O == "function") {
                  P = O.call(I, P, C);
                  break e;
                }
                P = O;
                break e;
              case 3:
                O.flags = O.flags & -65537 | 128;
              case 0:
                if (O = A.payload, C = typeof O == "function" ? O.call(I, P, C) : O, C == null) break e;
                P = k({}, P, C);
                break e;
              case 2:
                Vt = !0;
            }
          }
          c.callback !== null && c.lane !== 0 && (e.flags |= 64, C = l.effects, C === null ? l.effects = [c] : C.push(c));
        } else I = { eventTime: I, lane: C, tag: c.tag, payload: c.payload, callback: c.callback, next: null }, j === null ? (y = j = I, p = P) : j = j.next = I, o |= C;
        if (c = c.next, c === null) {
          if (c = l.shared.pending, c === null) break;
          C = c, c = C.next, C.next = null, l.lastBaseUpdate = C, l.shared.pending = null;
        }
      } while (!0);
      if (j === null && (p = P), l.baseState = p, l.firstBaseUpdate = y, l.lastBaseUpdate = j, t = l.shared.interleaved, t !== null) {
        l = t;
        do
          o |= l.lane, l = l.next;
        while (l !== t);
      } else i === null && (l.shared.lanes = 0);
      un |= o, e.lanes = o, e.memoizedState = P;
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
  var pr = {}, St = $t(pr), hr = $t(pr), mr = $t(pr);
  function on(e) {
    if (e === pr) throw Error(s(174));
    return e;
  }
  function Gi(e, t) {
    switch (pe(mr, t), pe(hr, e), pe(St, pr), e = t.nodeType, e) {
      case 9:
      case 11:
        t = (t = t.documentElement) ? t.namespaceURI : Yl(null, "");
        break;
      default:
        e = e === 8 ? t.parentNode : t, t = e.namespaceURI || null, e = e.tagName, t = Yl(t, e);
    }
    ve(St), pe(St, t);
  }
  function Ln() {
    ve(St), ve(hr), ve(mr);
  }
  function ju(e) {
    on(mr.current);
    var t = on(St.current), n = Yl(t, e.type);
    t !== n && (pe(hr, e), pe(St, n));
  }
  function Yi(e) {
    hr.current === e && (ve(St), ve(hr));
  }
  var ke = $t(0);
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
  var ml = he.ReactCurrentDispatcher, Ji = he.ReactCurrentBatchConfig, sn = 0, Se = null, Re = null, De = null, vl = !1, vr = !1, gr = 0, Ff = 0;
  function Be() {
    throw Error(s(321));
  }
  function qi(e, t) {
    if (t === null) return !1;
    for (var n = 0; n < t.length && n < e.length; n++) if (!ht(e[n], t[n])) return !1;
    return !0;
  }
  function bi(e, t, n, r, l, i) {
    if (sn = i, Se = t, t.memoizedState = null, t.updateQueue = null, t.lanes = 0, ml.current = e === null || e.memoizedState === null ? $f : Hf, e = n(r, l), vr) {
      i = 0;
      do {
        if (vr = !1, gr = 0, 25 <= i) throw Error(s(301));
        i += 1, De = Re = null, t.updateQueue = null, ml.current = Bf, e = n(r, l);
      } while (vr);
    }
    if (ml.current = xl, t = Re !== null && Re.next !== null, sn = 0, De = Re = Se = null, vl = !1, t) throw Error(s(300));
    return e;
  }
  function eo() {
    var e = gr !== 0;
    return gr = 0, e;
  }
  function Et() {
    var e = { memoizedState: null, baseState: null, baseQueue: null, queue: null, next: null };
    return De === null ? Se.memoizedState = De = e : De = De.next = e, De;
  }
  function at() {
    if (Re === null) {
      var e = Se.alternate;
      e = e !== null ? e.memoizedState : null;
    } else e = Re.next;
    var t = De === null ? Se.memoizedState : De.next;
    if (t !== null) De = t, Re = e;
    else {
      if (e === null) throw Error(s(310));
      Re = e, e = { memoizedState: Re.memoizedState, baseState: Re.baseState, baseQueue: Re.baseQueue, queue: Re.queue, next: null }, De === null ? Se.memoizedState = De = e : De = De.next = e;
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
      var c = o = null, p = null, y = i;
      do {
        var j = y.lane;
        if ((sn & j) === j) p !== null && (p = p.next = { lane: 0, action: y.action, hasEagerState: y.hasEagerState, eagerState: y.eagerState, next: null }), r = y.hasEagerState ? y.eagerState : e(r, y.action);
        else {
          var P = {
            lane: j,
            action: y.action,
            hasEagerState: y.hasEagerState,
            eagerState: y.eagerState,
            next: null
          };
          p === null ? (c = p = P, o = r) : p = p.next = P, Se.lanes |= j, un |= j;
        }
        y = y.next;
      } while (y !== null && y !== i);
      p === null ? o = r : p.next = c, ht(r, t.memoizedState) || (Je = !0), t.memoizedState = r, t.baseState = o, t.baseQueue = p, n.lastRenderedState = r;
    }
    if (e = n.interleaved, e !== null) {
      l = e;
      do
        i = l.lane, Se.lanes |= i, un |= i, l = l.next;
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
  function Pu(e, t) {
    var n = Se, r = at(), l = t(), i = !ht(r.memoizedState, l);
    if (i && (r.memoizedState = l, Je = !0), r = r.queue, ro(Mu.bind(null, n, r, e), [e]), r.getSnapshot !== t || i || De !== null && De.memoizedState.tag & 1) {
      if (n.flags |= 2048, xr(9, Ru.bind(null, n, r, l, t), void 0, null), Fe === null) throw Error(s(349));
      (sn & 30) !== 0 || Tu(n, t, l);
    }
    return l;
  }
  function Tu(e, t, n) {
    e.flags |= 16384, e = { getSnapshot: t, value: n }, t = Se.updateQueue, t === null ? (t = { lastEffect: null, stores: null }, Se.updateQueue = t, t.stores = [e]) : (n = t.stores, n === null ? t.stores = [e] : n.push(e));
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
    var t = Pt(e, 1);
    t !== null && xt(t, e, 1, -1);
  }
  function Du(e) {
    var t = Et();
    return typeof e == "function" && (e = e()), t.memoizedState = t.baseState = e, e = { pending: null, interleaved: null, lanes: 0, dispatch: null, lastRenderedReducer: yr, lastRenderedState: e }, t.queue = e, e = e.dispatch = Uf.bind(null, Se, e), [t.memoizedState, e];
  }
  function xr(e, t, n, r) {
    return e = { tag: e, create: t, destroy: n, deps: r, next: null }, t = Se.updateQueue, t === null ? (t = { lastEffect: null, stores: null }, Se.updateQueue = t, t.lastEffect = e.next = e) : (n = t.lastEffect, n === null ? t.lastEffect = e.next = e : (r = n.next, n.next = e, e.next = r, t.lastEffect = e)), e;
  }
  function Fu() {
    return at().memoizedState;
  }
  function gl(e, t, n, r) {
    var l = Et();
    Se.flags |= e, l.memoizedState = xr(1 | t, n, void 0, r === void 0 ? null : r);
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
    Se.flags |= e, l.memoizedState = xr(1 | t, n, i, r);
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
  function Uu(e, t) {
    return yl(4, 4, e, t);
  }
  function $u(e, t) {
    if (typeof t == "function") return e = e(), t(e), function() {
      t(null);
    };
    if (t != null) return e = e(), t.current = e, function() {
      t.current = null;
    };
  }
  function Hu(e, t, n) {
    return n = n != null ? n.concat([e]) : null, yl(4, 4, $u.bind(null, t, e), n);
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
    return (sn & 21) === 0 ? (e.baseState && (e.baseState = !1, Je = !0), e.memoizedState = n) : (ht(n, t) || (n = ws(), Se.lanes |= n, un |= n, e.baseState = !0), t);
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
  function Uf(e, t, n) {
    var r = Yt(e), l = { lane: r, action: n, hasEagerState: !1, eagerState: null, next: null };
    if (Ku(e)) Gu(t, l);
    else {
      var i = e.alternate;
      if (e.lanes === 0 && (i === null || i.lanes === 0) && (i = t.lastRenderedReducer, i !== null)) try {
        var o = t.lastRenderedState, c = i(o, n);
        if (l.hasEagerState = !0, l.eagerState = c, ht(c, o)) {
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
    return e === Se || t !== null && t === Se;
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
  var xl = { readContext: ut, useCallback: Be, useContext: Be, useEffect: Be, useImperativeHandle: Be, useInsertionEffect: Be, useLayoutEffect: Be, useMemo: Be, useReducer: Be, useRef: Be, useState: Be, useDebugValue: Be, useDeferredValue: Be, useTransition: Be, useMutableSource: Be, useSyncExternalStore: Be, useId: Be, unstable_isNewReconciler: !1 }, $f = { readContext: ut, useCallback: function(e, t) {
    return Et().memoizedState = [e, t === void 0 ? null : t], e;
  }, useContext: ut, useEffect: Ou, useImperativeHandle: function(e, t, n) {
    return n = n != null ? n.concat([e]) : null, gl(
      4194308,
      4,
      $u.bind(null, t, e),
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
    return t = n !== void 0 ? n(t) : t, r.memoizedState = r.baseState = t, e = { pending: null, interleaved: null, lanes: 0, dispatch: null, lastRenderedReducer: e, lastRenderedState: t }, r.queue = e, e = e.dispatch = Af.bind(null, Se, e), [r.memoizedState, e];
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
    var r = Se, l = Et();
    if (we) {
      if (n === void 0) throw Error(s(407));
      n = n();
    } else {
      if (n = t(), Fe === null) throw Error(s(349));
      (sn & 30) !== 0 || Tu(r, t, n);
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
    if (we) {
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
    useLayoutEffect: Uu,
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
    useSyncExternalStore: Pu,
    useId: Qu,
    unstable_isNewReconciler: !1
  }, Bf = { readContext: ut, useCallback: Bu, useContext: ut, useEffect: ro, useImperativeHandle: Hu, useInsertionEffect: Au, useLayoutEffect: Uu, useMemo: Vu, useReducer: no, useRef: Fu, useState: function() {
    return no(yr);
  }, useDebugValue: lo, useDeferredValue: function(e) {
    var t = at();
    return Re === null ? t.memoizedState = e : Wu(t, Re.memoizedState, e);
  }, useTransition: function() {
    var e = no(yr)[0], t = at().memoizedState;
    return [e, t];
  }, useMutableSource: zu, useSyncExternalStore: Pu, useId: Qu, unstable_isNewReconciler: !1 };
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
    var r = Ke(), l = Yt(e), i = Tt(r, l);
    i.payload = t, n != null && (i.callback = n), t = Wt(e, i, l), t !== null && (xt(t, e, l, r), dl(t, e, l));
  }, enqueueReplaceState: function(e, t, n) {
    e = e._reactInternals;
    var r = Ke(), l = Yt(e), i = Tt(r, l);
    i.tag = 1, i.payload = t, n != null && (i.callback = n), t = Wt(e, i, l), t !== null && (xt(t, e, l, r), dl(t, e, l));
  }, enqueueForceUpdate: function(e, t) {
    e = e._reactInternals;
    var n = Ke(), r = Yt(e), l = Tt(n, r);
    l.tag = 2, t != null && (l.callback = t), t = Wt(e, l, r), t !== null && (xt(t, e, r, n), dl(t, e, r));
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
        n += Z(r), r = r.return;
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
    n = Tt(-1, n), n.tag = 3, n.payload = { element: null };
    var r = t.value;
    return n.callback = function() {
      jl || (jl = !0, No = r), uo(e, t);
    }, n;
  }
  function bu(e, t, n) {
    n = Tt(-1, n), n.tag = 3;
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
    return (e.mode & 1) === 0 ? (e === t ? e.flags |= 65536 : (e.flags |= 128, n.flags |= 131072, n.flags &= -52805, n.tag === 1 && (n.alternate === null ? n.tag = 17 : (t = Tt(-1, 1), t.tag = 2, Wt(n, t, 1))), n.lanes |= 1), e) : (e.flags |= 65536, e.lanes = l, e);
  }
  var Wf = he.ReactCurrentOwner, Je = !1;
  function Qe(e, t, n, r) {
    t.child = e === null ? Su(t, null, n, r) : Tn(t, e.child, n, r);
  }
  function ra(e, t, n, r, l) {
    n = n.render;
    var i = t.ref;
    return Mn(t, l), r = bi(e, t, n, r, i, l), n = eo(), e !== null && !Je ? (t.updateQueue = e.updateQueue, t.flags &= -2053, e.lanes &= ~l, Rt(e, t, l)) : (we && n && Fi(t), t.flags |= 1, Qe(e, t, r, l), t.child);
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
    if (r.mode === "hidden") if ((t.mode & 1) === 0) t.memoizedState = { baseLanes: 0, cachePool: null, transitions: null }, pe(Fn, lt), lt |= n;
    else {
      if ((n & 1073741824) === 0) return e = i !== null ? i.baseLanes | n : n, t.lanes = t.childLanes = 1073741824, t.memoizedState = { baseLanes: e, cachePool: null, transitions: null }, t.updateQueue = null, pe(Fn, lt), lt |= e, null;
      t.memoizedState = { baseLanes: 0, cachePool: null, transitions: null }, r = i !== null ? i.baseLanes : n, pe(Fn, lt), lt |= r;
    }
    else i !== null ? (r = i.baseLanes | n, t.memoizedState = null) : r = n, pe(Fn, lt), lt |= r;
    return Qe(e, t, l, n), t.child;
  }
  function sa(e, t) {
    var n = t.ref;
    (e === null && n !== null || e !== null && e.ref !== n) && (t.flags |= 512, t.flags |= 2097152);
  }
  function ao(e, t, n, r, l) {
    var i = Ze(n) ? tn : He.current;
    return i = Cn(t, i), Mn(t, l), n = bi(e, t, n, r, i, l), r = eo(), e !== null && !Je ? (t.updateQueue = e.updateQueue, t.flags &= -2053, e.lanes &= ~l, Rt(e, t, l)) : (we && r && Fi(t), t.flags |= 1, Qe(e, t, n, l), t.child);
  }
  function ua(e, t, n, r, l) {
    if (Ze(n)) {
      var i = !0;
      ll(t);
    } else i = !1;
    if (Mn(t, l), t.stateNode === null) Sl(e, t), Zu(t, n, r), oo(t, n, r, l), r = !0;
    else if (e === null) {
      var o = t.stateNode, c = t.memoizedProps;
      o.props = c;
      var p = o.context, y = n.contextType;
      typeof y == "object" && y !== null ? y = ut(y) : (y = Ze(n) ? tn : He.current, y = Cn(t, y));
      var j = n.getDerivedStateFromProps, P = typeof j == "function" || typeof o.getSnapshotBeforeUpdate == "function";
      P || typeof o.UNSAFE_componentWillReceiveProps != "function" && typeof o.componentWillReceiveProps != "function" || (c !== r || p !== y) && Ju(t, o, r, y), Vt = !1;
      var C = t.memoizedState;
      o.state = C, pl(t, r, o, l), p = t.memoizedState, c !== r || C !== p || Xe.current || Vt ? (typeof j == "function" && (io(t, n, j, r), p = t.memoizedState), (c = Vt || Xu(t, n, c, r, C, p, y)) ? (P || typeof o.UNSAFE_componentWillMount != "function" && typeof o.componentWillMount != "function" || (typeof o.componentWillMount == "function" && o.componentWillMount(), typeof o.UNSAFE_componentWillMount == "function" && o.UNSAFE_componentWillMount()), typeof o.componentDidMount == "function" && (t.flags |= 4194308)) : (typeof o.componentDidMount == "function" && (t.flags |= 4194308), t.memoizedProps = r, t.memoizedState = p), o.props = r, o.state = p, o.context = y, r = c) : (typeof o.componentDidMount == "function" && (t.flags |= 4194308), r = !1);
    } else {
      o = t.stateNode, Nu(e, t), c = t.memoizedProps, y = t.type === t.elementType ? c : vt(t.type, c), o.props = y, P = t.pendingProps, C = o.context, p = n.contextType, typeof p == "object" && p !== null ? p = ut(p) : (p = Ze(n) ? tn : He.current, p = Cn(t, p));
      var I = n.getDerivedStateFromProps;
      (j = typeof I == "function" || typeof o.getSnapshotBeforeUpdate == "function") || typeof o.UNSAFE_componentWillReceiveProps != "function" && typeof o.componentWillReceiveProps != "function" || (c !== P || C !== p) && Ju(t, o, r, p), Vt = !1, C = t.memoizedState, o.state = C, pl(t, r, o, l);
      var O = t.memoizedState;
      c !== P || C !== O || Xe.current || Vt ? (typeof I == "function" && (io(t, n, I, r), O = t.memoizedState), (y = Vt || Xu(t, n, y, r, C, O, p) || !1) ? (j || typeof o.UNSAFE_componentWillUpdate != "function" && typeof o.componentWillUpdate != "function" || (typeof o.componentWillUpdate == "function" && o.componentWillUpdate(r, O, p), typeof o.UNSAFE_componentWillUpdate == "function" && o.UNSAFE_componentWillUpdate(r, O, p)), typeof o.componentDidUpdate == "function" && (t.flags |= 4), typeof o.getSnapshotBeforeUpdate == "function" && (t.flags |= 1024)) : (typeof o.componentDidUpdate != "function" || c === e.memoizedProps && C === e.memoizedState || (t.flags |= 4), typeof o.getSnapshotBeforeUpdate != "function" || c === e.memoizedProps && C === e.memoizedState || (t.flags |= 1024), t.memoizedProps = r, t.memoizedState = O), o.props = r, o.state = O, o.context = p, r = y) : (typeof o.componentDidUpdate != "function" || c === e.memoizedProps && C === e.memoizedState || (t.flags |= 4), typeof o.getSnapshotBeforeUpdate != "function" || c === e.memoizedProps && C === e.memoizedState || (t.flags |= 1024), r = !1);
    }
    return co(e, t, n, r, i, l);
  }
  function co(e, t, n, r, l, i) {
    sa(e, t);
    var o = (t.flags & 128) !== 0;
    if (!r && !o) return l && pu(t, n, !1), Rt(e, t, i);
    r = t.stateNode, Wf.current = t;
    var c = o && typeof n.getDerivedStateFromError != "function" ? null : r.render();
    return t.flags |= 1, e !== null && o ? (t.child = Tn(t, e.child, null, i), t.child = Tn(t, null, c, i)) : Qe(e, t, c, i), t.memoizedState = r.state, l && pu(t, n, !0), t.child;
  }
  function aa(e) {
    var t = e.stateNode;
    t.pendingContext ? fu(e, t.pendingContext, t.pendingContext !== t.context) : t.context && fu(e, t.context, !1), Gi(e, t.containerInfo);
  }
  function ca(e, t, n, r, l) {
    return Pn(), $i(l), t.flags |= 256, Qe(e, t, n, r), t.child;
  }
  var fo = { dehydrated: null, treeContext: null, retryLane: 0 };
  function po(e) {
    return { baseLanes: e, cachePool: null, transitions: null };
  }
  function fa(e, t, n) {
    var r = t.pendingProps, l = ke.current, i = !1, o = (t.flags & 128) !== 0, c;
    if ((c = o) || (c = e !== null && e.memoizedState === null ? !1 : (l & 2) !== 0), c ? (i = !0, t.flags &= -129) : (e === null || e.memoizedState !== null) && (l |= 1), pe(ke, l & 1), e === null)
      return Ui(t), e = t.memoizedState, e !== null && (e = e.dehydrated, e !== null) ? ((t.mode & 1) === 0 ? t.lanes = 1 : e.data === "$!" ? t.lanes = 8 : t.lanes = 1073741824, null) : (o = r.children, e = r.fallback, i ? (r = t.mode, i = t.child, o = { mode: "hidden", children: o }, (r & 1) === 0 && i !== null ? (i.childLanes = 0, i.pendingProps = o) : i = Il(o, r, 0, null), e = dn(e, r, n, null), i.return = t, e.return = t, i.sibling = e, t.child = i, t.child.memoizedState = po(n), t.memoizedState = fo, e) : ho(t, o));
    if (l = e.memoizedState, l !== null && (c = l.dehydrated, c !== null)) return Qf(e, t, o, r, c, l, n);
    if (i) {
      i = r.fallback, o = t.mode, l = e.child, c = l.sibling;
      var p = { mode: "hidden", children: r.children };
      return (o & 1) === 0 && t.child !== l ? (r = t.child, r.childLanes = 0, r.pendingProps = p, t.deletions = null) : (r = Zt(l, p), r.subtreeFlags = l.subtreeFlags & 14680064), c !== null ? i = Zt(c, i) : (i = dn(i, o, n, null), i.flags |= 2), i.return = t, r.return = t, r.sibling = i, t.child = r, r = i, i = t.child, o = e.child.memoizedState, o = o === null ? po(n) : { baseLanes: o.baseLanes | n, cachePool: null, transitions: o.transitions }, i.memoizedState = o, i.childLanes = e.childLanes & ~n, t.memoizedState = fo, r;
    }
    return i = e.child, e = i.sibling, r = Zt(i, { mode: "visible", children: r.children }), (t.mode & 1) === 0 && (r.lanes = n), r.return = t, r.sibling = null, e !== null && (n = t.deletions, n === null ? (t.deletions = [e], t.flags |= 16) : n.push(e)), t.child = r, t.memoizedState = null, r;
  }
  function ho(e, t) {
    return t = Il({ mode: "visible", children: t }, e.mode, 0, null), t.return = e, e.child = t;
  }
  function kl(e, t, n, r) {
    return r !== null && $i(r), Tn(t, e.child, null, n), e = ho(t, t.pendingProps.children), e.flags |= 2, t.memoizedState = null, e;
  }
  function Qf(e, t, n, r, l, i, o) {
    if (n)
      return t.flags & 256 ? (t.flags &= -257, r = so(Error(s(422))), kl(e, t, o, r)) : t.memoizedState !== null ? (t.child = e.child, t.flags |= 128, null) : (i = r.fallback, l = t.mode, r = Il({ mode: "visible", children: r.children }, l, 0, null), i = dn(i, l, o, null), i.flags |= 2, r.return = t, i.return = t, r.sibling = i, t.child = r, (t.mode & 1) !== 0 && Tn(t, e.child, null, o), t.child.memoizedState = po(o), t.memoizedState = fo, i);
    if ((t.mode & 1) === 0) return kl(e, t, o, null);
    if (l.data === "$!") {
      if (r = l.nextSibling && l.nextSibling.dataset, r) var c = r.dgst;
      return r = c, i = Error(s(419)), r = so(i, r, void 0), kl(e, t, o, r);
    }
    if (c = (o & e.childLanes) !== 0, Je || c) {
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
        l = (l & (r.suspendedLanes | o)) !== 0 ? 0 : l, l !== 0 && l !== i.retryLane && (i.retryLane = l, Pt(e, l), xt(r, e, l, -1));
      }
      return To(), r = so(Error(s(421))), kl(e, t, o, r);
    }
    return l.data === "$?" ? (t.flags |= 128, t.child = e.child, t = ld.bind(null, e), l._reactRetry = t, null) : (e = i.treeContext, rt = Ut(l.nextSibling), nt = t, we = !0, mt = null, e !== null && (ot[st++] = jt, ot[st++] = zt, ot[st++] = nn, jt = e.id, zt = e.overflow, nn = t), t = ho(t, r.children), t.flags |= 4096, t);
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
    if (Qe(e, t, r.children, n), r = ke.current, (r & 2) !== 0) r = r & 1 | 2, t.flags |= 128;
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
    if (pe(ke, r), (t.mode & 1) === 0) t.memoizedState = null;
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
        aa(t), Pn();
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
        pe(cl, r._currentValue), r._currentValue = l;
        break;
      case 13:
        if (r = t.memoizedState, r !== null)
          return r.dehydrated !== null ? (pe(ke, ke.current & 1), t.flags |= 128, null) : (n & t.child.childLanes) !== 0 ? fa(e, t, n) : (pe(ke, ke.current & 1), e = Rt(e, t, n), e !== null ? e.sibling : null);
        pe(ke, ke.current & 1);
        break;
      case 19:
        if (r = (n & t.childLanes) !== 0, (e.flags & 128) !== 0) {
          if (r) return pa(e, t, n);
          t.flags |= 128;
        }
        if (l = t.memoizedState, l !== null && (l.rendering = null, l.tail = null, l.lastEffect = null), pe(ke, ke.current), r) break;
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
        var c = l[y];
        for (o in c) c.hasOwnProperty(o) && (n || (n = {}), n[o] = "");
      } else y !== "dangerouslySetInnerHTML" && y !== "children" && y !== "suppressContentEditableWarning" && y !== "suppressHydrationWarning" && y !== "autoFocus" && (N.hasOwnProperty(y) ? i || (i = []) : (i = i || []).push(y, null));
      for (y in r) {
        var p = r[y];
        if (c = l != null ? l[y] : void 0, r.hasOwnProperty(y) && p !== c && (p != null || c != null)) if (y === "style") if (c) {
          for (o in c) !c.hasOwnProperty(o) || p && p.hasOwnProperty(o) || (n || (n = {}), n[o] = "");
          for (o in p) p.hasOwnProperty(o) && c[o] !== p[o] && (n || (n = {}), n[o] = p[o]);
        } else n || (i || (i = []), i.push(
          y,
          n
        )), n = p;
        else y === "dangerouslySetInnerHTML" ? (p = p ? p.__html : void 0, c = c ? c.__html : void 0, p != null && c !== p && (i = i || []).push(y, p)) : y === "children" ? typeof p != "string" && typeof p != "number" || (i = i || []).push(y, "" + p) : y !== "suppressContentEditableWarning" && y !== "suppressHydrationWarning" && (N.hasOwnProperty(y) ? (p != null && y === "onScroll" && me("scroll", e), i || c === p || (i = [])) : (i = i || []).push(y, p));
      }
      n && (i = i || []).push("style", n);
      var y = i;
      (t.updateQueue = y) && (t.flags |= 4);
    }
  }, va = function(e, t, n, r) {
    n !== r && (t.flags |= 4);
  };
  function wr(e, t) {
    if (!we) switch (e.tailMode) {
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
        return r = t.stateNode, Ln(), ve(Xe), ve(He), Zi(), r.pendingContext && (r.context = r.pendingContext, r.pendingContext = null), (e === null || e.child === null) && (ul(t) ? t.flags |= 4 : e === null || e.memoizedState.isDehydrated && (t.flags & 256) === 0 || (t.flags |= 1024, mt !== null && (jo(mt), mt = null))), vo(e, t), Ve(t), null;
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
                me("cancel", r), me("close", r);
                break;
              case "iframe":
              case "object":
              case "embed":
                me("load", r);
                break;
              case "video":
              case "audio":
                for (l = 0; l < sr.length; l++) me(sr[l], r);
                break;
              case "source":
                me("error", r);
                break;
              case "img":
              case "image":
              case "link":
                me(
                  "error",
                  r
                ), me("load", r);
                break;
              case "details":
                me("toggle", r);
                break;
              case "input":
                Zo(r, i), me("invalid", r);
                break;
              case "select":
                r._wrapperState = { wasMultiple: !!i.multiple }, me("invalid", r);
                break;
              case "textarea":
                bo(r, i), me("invalid", r);
            }
            Xl(n, i), l = null;
            for (var o in i) if (i.hasOwnProperty(o)) {
              var c = i[o];
              o === "children" ? typeof c == "string" ? r.textContent !== c && (i.suppressHydrationWarning !== !0 && el(r.textContent, c, e), l = ["children", c]) : typeof c == "number" && r.textContent !== "" + c && (i.suppressHydrationWarning !== !0 && el(
                r.textContent,
                c,
                e
              ), l = ["children", "" + c]) : N.hasOwnProperty(o) && c != null && o === "onScroll" && me("scroll", r);
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
                  me("cancel", e), me("close", e), l = r;
                  break;
                case "iframe":
                case "object":
                case "embed":
                  me("load", e), l = r;
                  break;
                case "video":
                case "audio":
                  for (l = 0; l < sr.length; l++) me(sr[l], e);
                  l = r;
                  break;
                case "source":
                  me("error", e), l = r;
                  break;
                case "img":
                case "image":
                case "link":
                  me(
                    "error",
                    e
                  ), me("load", e), l = r;
                  break;
                case "details":
                  me("toggle", e), l = r;
                  break;
                case "input":
                  Zo(e, r), l = Wl(e, r), me("invalid", e);
                  break;
                case "option":
                  l = r;
                  break;
                case "select":
                  e._wrapperState = { wasMultiple: !!r.multiple }, l = k({}, r, { value: void 0 }), me("invalid", e);
                  break;
                case "textarea":
                  bo(e, r), l = Gl(e, r), me("invalid", e);
                  break;
                default:
                  l = r;
              }
              Xl(n, l), c = l;
              for (i in c) if (c.hasOwnProperty(i)) {
                var p = c[i];
                i === "style" ? is(e, p) : i === "dangerouslySetInnerHTML" ? (p = p ? p.__html : void 0, p != null && rs(e, p)) : i === "children" ? typeof p == "string" ? (n !== "textarea" || p !== "") && Bn(e, p) : typeof p == "number" && Bn(e, "" + p) : i !== "suppressContentEditableWarning" && i !== "suppressHydrationWarning" && i !== "autoFocus" && (N.hasOwnProperty(i) ? p != null && i === "onScroll" && me("scroll", e) : p != null && Pe(e, i, p, o));
              }
              switch (n) {
                case "input":
                  dt(e), qo(e, r, !1);
                  break;
                case "textarea":
                  dt(e), ts(e);
                  break;
                case "option":
                  r.value != null && e.setAttribute("value", "" + G(r.value));
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
        if (ve(ke), r = t.memoizedState, e === null || e.memoizedState !== null && e.memoizedState.dehydrated !== null) {
          if (we && rt !== null && (t.mode & 1) !== 0 && (t.flags & 128) === 0) xu(), Pn(), t.flags |= 98560, i = !1;
          else if (i = ul(t), r !== null && r.dehydrated !== null) {
            if (e === null) {
              if (!i) throw Error(s(318));
              if (i = t.memoizedState, i = i !== null ? i.dehydrated : null, !i) throw Error(s(317));
              i[kt] = t;
            } else Pn(), (t.flags & 128) === 0 && (t.memoizedState = null), t.flags |= 4;
            Ve(t), i = !1;
          } else mt !== null && (jo(mt), mt = null), i = !0;
          if (!i) return t.flags & 65536 ? t : null;
        }
        return (t.flags & 128) !== 0 ? (t.lanes = n, t) : (r = r !== null, r !== (e !== null && e.memoizedState !== null) && r && (t.child.flags |= 8192, (t.mode & 1) !== 0 && (e === null || (ke.current & 1) !== 0 ? Me === 0 && (Me = 3) : To())), t.updateQueue !== null && (t.flags |= 4), Ve(t), null);
      case 4:
        return Ln(), vo(e, t), e === null && ur(t.stateNode.containerInfo), Ve(t), null;
      case 10:
        return Vi(t.type._context), Ve(t), null;
      case 17:
        return Ze(t.type) && rl(), Ve(t), null;
      case 19:
        if (ve(ke), i = t.memoizedState, i === null) return Ve(t), null;
        if (r = (t.flags & 128) !== 0, o = i.rendering, o === null) if (r) wr(i, !1);
        else {
          if (Me !== 0 || e !== null && (e.flags & 128) !== 0) for (e = t.child; e !== null; ) {
            if (o = hl(e), o !== null) {
              for (t.flags |= 128, wr(i, !1), r = o.updateQueue, r !== null && (t.updateQueue = r, t.flags |= 4), t.subtreeFlags = 0, r = n, n = t.child; n !== null; ) i = n, e = r, i.flags &= 14680066, o = i.alternate, o === null ? (i.childLanes = 0, i.lanes = e, i.child = null, i.subtreeFlags = 0, i.memoizedProps = null, i.memoizedState = null, i.updateQueue = null, i.dependencies = null, i.stateNode = null) : (i.childLanes = o.childLanes, i.lanes = o.lanes, i.child = o.child, i.subtreeFlags = 0, i.deletions = null, i.memoizedProps = o.memoizedProps, i.memoizedState = o.memoizedState, i.updateQueue = o.updateQueue, i.type = o.type, e = o.dependencies, i.dependencies = e === null ? null : { lanes: e.lanes, firstContext: e.firstContext }), n = n.sibling;
              return pe(ke, ke.current & 1 | 2), t.child;
            }
            e = e.sibling;
          }
          i.tail !== null && _e() > On && (t.flags |= 128, r = !0, wr(i, !1), t.lanes = 4194304);
        }
        else {
          if (!r) if (e = hl(o), e !== null) {
            if (t.flags |= 128, r = !0, n = e.updateQueue, n !== null && (t.updateQueue = n, t.flags |= 4), wr(i, !0), i.tail === null && i.tailMode === "hidden" && !o.alternate && !we) return Ve(t), null;
          } else 2 * _e() - i.renderingStartTime > On && n !== 1073741824 && (t.flags |= 128, r = !0, wr(i, !1), t.lanes = 4194304);
          i.isBackwards ? (o.sibling = t.child, t.child = o) : (n = i.last, n !== null ? n.sibling = o : t.child = o, i.last = o);
        }
        return i.tail !== null ? (t = i.tail, i.rendering = t, i.tail = t.sibling, i.renderingStartTime = _e(), t.sibling = null, n = ke.current, pe(ke, r ? n & 1 | 2 : n & 1), t) : (Ve(t), null);
      case 22:
      case 23:
        return Po(), r = t.memoizedState !== null, e !== null && e.memoizedState !== null !== r && (t.flags |= 8192), r && (t.mode & 1) !== 0 ? (lt & 1073741824) !== 0 && (Ve(t), t.subtreeFlags & 6 && (t.flags |= 8192)) : Ve(t), null;
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
        return Ln(), ve(Xe), ve(He), Zi(), e = t.flags, (e & 65536) !== 0 && (e & 128) === 0 ? (t.flags = e & -65537 | 128, t) : null;
      case 5:
        return Yi(t), null;
      case 13:
        if (ve(ke), e = t.memoizedState, e !== null && e.dehydrated !== null) {
          if (t.alternate === null) throw Error(s(340));
          Pn();
        }
        return e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
      case 19:
        return ve(ke), null;
      case 4:
        return Ln(), null;
      case 10:
        return Vi(t.type._context), null;
      case 22:
      case 23:
        return Po(), null;
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
      Ne(e, t, r);
    }
    else n.current = null;
  }
  function go(e, t, n) {
    try {
      n();
    } catch (r) {
      Ne(e, t, r);
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
          var o = 0, c = -1, p = -1, y = 0, j = 0, P = e, C = null;
          t: for (; ; ) {
            for (var I; P !== n || l !== 0 && P.nodeType !== 3 || (c = o + l), P !== i || r !== 0 && P.nodeType !== 3 || (p = o + r), P.nodeType === 3 && (o += P.nodeValue.length), (I = P.firstChild) !== null; )
              C = P, P = I;
            for (; ; ) {
              if (P === e) break t;
              if (C === n && ++y === l && (c = o), C === i && ++j === r && (p = o), (I = P.nextSibling) !== null) break;
              P = C, C = P.parentNode;
            }
            P = I;
          }
          n = c === -1 || p === -1 ? null : { start: c, end: p };
        } else n = null;
      }
      n = n || { start: 0, end: 0 };
    } else n = null;
    for (Pi = { focusedElem: e, selectionRange: n }, Vr = !1, F = t; F !== null; ) if (t = F, e = t.child, (t.subtreeFlags & 1028) !== 0 && e !== null) e.return = t, F = e;
    else for (; F !== null; ) {
      t = F;
      try {
        var O = t.alternate;
        if ((t.flags & 1024) !== 0) switch (t.tag) {
          case 0:
          case 11:
          case 15:
            break;
          case 1:
            if (O !== null) {
              var A = O.memoizedProps, Ce = O.memoizedState, m = t.stateNode, h = m.getSnapshotBeforeUpdate(t.elementType === t.type ? A : vt(t.type, A), Ce);
              m.__reactInternalSnapshotBeforeUpdate = h;
            }
            break;
          case 3:
            var v = t.stateNode.containerInfo;
            v.nodeType === 1 ? v.textContent = "" : v.nodeType === 9 && v.documentElement && v.removeChild(v.documentElement);
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
        Ne(t, t.return, R);
      }
      if (e = t.sibling, e !== null) {
        e.return = t.return, F = e;
        break;
      }
      F = t.return;
    }
    return O = ga, ga = !1, O;
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
        } catch (c) {
          Ne(n, t, c);
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
        var i = e, o = t, c = o;
        e: for (; c !== null; ) {
          switch (c.tag) {
            case 5:
              Ae = c.stateNode, gt = !1;
              break e;
            case 3:
              Ae = c.stateNode.containerInfo, gt = !0;
              break e;
            case 4:
              Ae = c.stateNode.containerInfo, gt = !0;
              break e;
          }
          c = c.return;
        }
        if (Ae === null) throw Error(s(160));
        ka(i, o, l), Ae = null, gt = !1;
        var p = l.alternate;
        p !== null && (p.return = null), l.return = null;
      } catch (y) {
        Ne(l, t, y);
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
          } catch (A) {
            Ne(e, e.return, A);
          }
          try {
            kr(5, e, e.return);
          } catch (A) {
            Ne(e, e.return, A);
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
          } catch (A) {
            Ne(e, e.return, A);
          }
        }
        if (r & 4 && (l = e.stateNode, l != null)) {
          var i = e.memoizedProps, o = n !== null ? n.memoizedProps : i, c = e.type, p = e.updateQueue;
          if (e.updateQueue = null, p !== null) try {
            c === "input" && i.type === "radio" && i.name != null && Jo(l, i), Zl(c, o);
            var y = Zl(c, i);
            for (o = 0; o < p.length; o += 2) {
              var j = p[o], P = p[o + 1];
              j === "style" ? is(l, P) : j === "dangerouslySetInnerHTML" ? rs(l, P) : j === "children" ? Bn(l, P) : Pe(l, j, P, y);
            }
            switch (c) {
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
          } catch (A) {
            Ne(e, e.return, A);
          }
        }
        break;
      case 6:
        if (yt(t, e), Nt(e), r & 4) {
          if (e.stateNode === null) throw Error(s(162));
          l = e.stateNode, i = e.memoizedProps;
          try {
            l.nodeValue = i;
          } catch (A) {
            Ne(e, e.return, A);
          }
        }
        break;
      case 3:
        if (yt(t, e), Nt(e), r & 4 && n !== null && n.memoizedState.isDehydrated) try {
          bn(t.containerInfo);
        } catch (A) {
          Ne(e, e.return, A);
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
            for (P = F = j; F !== null; ) {
              switch (C = F, I = C.child, C.tag) {
                case 0:
                case 11:
                case 14:
                case 15:
                  kr(4, C, C.return);
                  break;
                case 1:
                  Dn(C, C.return);
                  var O = C.stateNode;
                  if (typeof O.componentWillUnmount == "function") {
                    r = C, n = C.return;
                    try {
                      t = r, O.props = t.memoizedProps, O.state = t.memoizedState, O.componentWillUnmount();
                    } catch (A) {
                      Ne(r, n, A);
                    }
                  }
                  break;
                case 5:
                  Dn(C, C.return);
                  break;
                case 22:
                  if (C.memoizedState !== null) {
                    Ca(P);
                    continue;
                  }
              }
              I !== null ? (I.return = C, F = I) : Ca(P);
            }
            j = j.sibling;
          }
          e: for (j = null, P = e; ; ) {
            if (P.tag === 5) {
              if (j === null) {
                j = P;
                try {
                  l = P.stateNode, y ? (i = l.style, typeof i.setProperty == "function" ? i.setProperty("display", "none", "important") : i.display = "none") : (c = P.stateNode, p = P.memoizedProps.style, o = p != null && p.hasOwnProperty("display") ? p.display : null, c.style.display = ls("display", o));
                } catch (A) {
                  Ne(e, e.return, A);
                }
              }
            } else if (P.tag === 6) {
              if (j === null) try {
                P.stateNode.nodeValue = y ? "" : P.memoizedProps;
              } catch (A) {
                Ne(e, e.return, A);
              }
            } else if ((P.tag !== 22 && P.tag !== 23 || P.memoizedState === null || P === e) && P.child !== null) {
              P.child.return = P, P = P.child;
              continue;
            }
            if (P === e) break e;
            for (; P.sibling === null; ) {
              if (P.return === null || P.return === e) break e;
              j === P && (j = null), P = P.return;
            }
            j === P && (j = null), P.sibling.return = P.return, P = P.sibling;
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
            var o = r.stateNode.containerInfo, c = wa(e);
            xo(e, c, o);
            break;
          default:
            throw Error(s(161));
        }
      } catch (p) {
        Ne(e, e.return, p);
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
          var c = l.alternate, p = c !== null && c.memoizedState !== null || We;
          c = El;
          var y = We;
          if (El = o, (We = p) && !y) for (F = l; F !== null; ) o = F, p = o.child, o.tag === 22 && o.memoizedState !== null ? ja(l) : p !== null ? (p.return = o, F = p) : ja(l);
          for (; i !== null; ) F = i, Na(i), i = i.sibling;
          F = l, El = c, We = y;
        }
        _a(e);
      } else (l.subtreeFlags & 8772) !== 0 && i !== null ? (i.return = l, F = i) : _a(e);
    }
  }
  function _a(e) {
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
              var c = t.stateNode;
              if (n === null && t.flags & 4) {
                n = c;
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
                    var P = j.dehydrated;
                    P !== null && bn(P);
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
          Ne(t, t.return, C);
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
              Ne(t, n, p);
            }
            break;
          case 1:
            var r = t.stateNode;
            if (typeof r.componentDidMount == "function") {
              var l = t.return;
              try {
                r.componentDidMount();
              } catch (p) {
                Ne(t, l, p);
              }
            }
            var i = t.return;
            try {
              yo(t);
            } catch (p) {
              Ne(t, i, p);
            }
            break;
          case 5:
            var o = t.return;
            try {
              yo(t);
            } catch (p) {
              Ne(t, o, p);
            }
        }
      } catch (p) {
        Ne(t, t.return, p);
      }
      if (t === e) {
        F = null;
        break;
      }
      var c = t.sibling;
      if (c !== null) {
        c.return = t.return, F = c;
        break;
      }
      F = t.return;
    }
  }
  var qf = Math.ceil, _l = he.ReactCurrentDispatcher, ko = he.ReactCurrentOwner, ct = he.ReactCurrentBatchConfig, ae = 0, Fe = null, ze = null, Ue = 0, lt = 0, Fn = $t(0), Me = 0, Sr = null, un = 0, Cl = 0, So = 0, Er = null, qe = null, Eo = 0, On = 1 / 0, Mt = null, jl = !1, No = null, Kt = null, zl = !1, Gt = null, Pl = 0, Nr = 0, _o = null, Tl = -1, Rl = 0;
  function Ke() {
    return (ae & 6) !== 0 ? _e() : Tl !== -1 ? Tl : Tl = _e();
  }
  function Yt(e) {
    return (e.mode & 1) === 0 ? 1 : (ae & 2) !== 0 && Ue !== 0 ? Ue & -Ue : Df.transition !== null ? (Rl === 0 && (Rl = ws()), Rl) : (e = de, e !== 0 || (e = window.event, e = e === void 0 ? 16 : Ps(e.type)), e);
  }
  function xt(e, t, n, r) {
    if (50 < Nr) throw Nr = 0, _o = null, Error(s(185));
    Yn(e, n, r), ((ae & 2) === 0 || e !== Fe) && (e === Fe && ((ae & 2) === 0 && (Cl |= n), Me === 4 && Xt(e, Ue)), be(e, r), n === 1 && ae === 0 && (t.mode & 1) === 0 && (On = _e() + 500, il && Bt()));
  }
  function be(e, t) {
    var n = e.callbackNode;
    Ic(e, t);
    var r = $r(e, e === Fe ? Ue : 0);
    if (r === 0) n !== null && gs(n), e.callbackNode = null, e.callbackPriority = 0;
    else if (t = r & -r, e.callbackPriority !== t) {
      if (n != null && gs(n), t === 1) e.tag === 0 ? If(Pa.bind(null, e)) : hu(Pa.bind(null, e)), Tf(function() {
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
    if (Tl = -1, Rl = 0, (ae & 6) !== 0) throw Error(s(327));
    var n = e.callbackNode;
    if (An() && e.callbackNode !== n) return null;
    var r = $r(e, e === Fe ? Ue : 0);
    if (r === 0) return null;
    if ((r & 30) !== 0 || (r & e.expiredLanes) !== 0 || t) t = Ml(e, r);
    else {
      t = r;
      var l = ae;
      ae |= 2;
      var i = Ra();
      (Fe !== e || Ue !== t) && (Mt = null, On = _e() + 500, cn(e, t));
      do
        try {
          td();
          break;
        } catch (c) {
          Ta(e, c);
        }
      while (!0);
      Bi(), _l.current = i, ae = l, ze !== null ? t = 0 : (Fe = null, Ue = 0, t = Me);
    }
    if (t !== 0) {
      if (t === 2 && (l = li(e), l !== 0 && (r = l, t = Co(e, l))), t === 1) throw n = Sr, cn(e, 0), Xt(e, r), be(e, _e()), n;
      if (t === 6) Xt(e, r);
      else {
        if (l = e.current.alternate, (r & 30) === 0 && !bf(l) && (t = Ml(e, r), t === 2 && (i = li(e), i !== 0 && (r = i, t = Co(e, i))), t === 1)) throw n = Sr, cn(e, 0), Xt(e, r), be(e, _e()), n;
        switch (e.finishedWork = l, e.finishedLanes = r, t) {
          case 0:
          case 1:
            throw Error(s(345));
          case 2:
            fn(e, qe, Mt);
            break;
          case 3:
            if (Xt(e, r), (r & 130023424) === r && (t = Eo + 500 - _e(), 10 < t)) {
              if ($r(e, 0) !== 0) break;
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
  function Co(e, t) {
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
    for (t &= ~So, t &= ~Cl, e.suspendedLanes |= t, e.pingedLanes &= ~t, e = e.expirationTimes; 0 < t; ) {
      var n = 31 - pt(t), r = 1 << n;
      e[n] = -1, t &= ~r;
    }
  }
  function Pa(e) {
    if ((ae & 6) !== 0) throw Error(s(327));
    An();
    var t = $r(e, 0);
    if ((t & 1) === 0) return be(e, _e()), null;
    var n = Ml(e, t);
    if (e.tag !== 0 && n === 2) {
      var r = li(e);
      r !== 0 && (t = r, n = Co(e, r));
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
  function Po() {
    lt = Fn.current, ve(Fn);
  }
  function cn(e, t) {
    e.finishedWork = null, e.finishedLanes = 0;
    var n = e.timeoutHandle;
    if (n !== -1 && (e.timeoutHandle = -1, Pf(n)), ze !== null) for (n = ze.return; n !== null; ) {
      var r = n;
      switch (Oi(r), r.tag) {
        case 1:
          r = r.type.childContextTypes, r != null && rl();
          break;
        case 3:
          Ln(), ve(Xe), ve(He), Zi();
          break;
        case 5:
          Yi(r);
          break;
        case 4:
          Ln();
          break;
        case 13:
          ve(ke);
          break;
        case 19:
          ve(ke);
          break;
        case 10:
          Vi(r.type._context);
          break;
        case 22:
        case 23:
          Po();
      }
      n = n.return;
    }
    if (Fe = e, ze = e = Zt(e.current, null), Ue = lt = t, Me = 0, Sr = null, So = Cl = un = 0, qe = Er = null, ln !== null) {
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
  function Ta(e, t) {
    do {
      var n = ze;
      try {
        if (Bi(), ml.current = xl, vl) {
          for (var r = Se.memoizedState; r !== null; ) {
            var l = r.queue;
            l !== null && (l.pending = null), r = r.next;
          }
          vl = !1;
        }
        if (sn = 0, De = Re = Se = null, vr = !1, gr = 0, ko.current = null, n === null || n.return === null) {
          Me = 1, Sr = t, ze = null;
          break;
        }
        e: {
          var i = e, o = n.return, c = n, p = t;
          if (t = Ue, c.flags |= 32768, p !== null && typeof p == "object" && typeof p.then == "function") {
            var y = p, j = c, P = j.tag;
            if ((j.mode & 1) === 0 && (P === 0 || P === 11 || P === 15)) {
              var C = j.alternate;
              C ? (j.updateQueue = C.updateQueue, j.memoizedState = C.memoizedState, j.lanes = C.lanes) : (j.updateQueue = null, j.memoizedState = null);
            }
            var I = ta(o);
            if (I !== null) {
              I.flags &= -257, na(I, o, c, i, t), I.mode & 1 && ea(i, y, t), t = I, p = y;
              var O = t.updateQueue;
              if (O === null) {
                var A = /* @__PURE__ */ new Set();
                A.add(p), t.updateQueue = A;
              } else O.add(p);
              break e;
            } else {
              if ((t & 1) === 0) {
                ea(i, y, t), To();
                break e;
              }
              p = Error(s(426));
            }
          } else if (we && c.mode & 1) {
            var Ce = ta(o);
            if (Ce !== null) {
              (Ce.flags & 65536) === 0 && (Ce.flags |= 256), na(Ce, o, c, i, t), $i(In(p, c));
              break e;
            }
          }
          i = p = In(p, c), Me !== 4 && (Me = 2), Er === null ? Er = [i] : Er.push(i), i = o;
          do {
            switch (i.tag) {
              case 3:
                i.flags |= 65536, t &= -t, i.lanes |= t;
                var m = qu(i, p, t);
                _u(i, m);
                break e;
              case 1:
                c = p;
                var h = i.type, v = i.stateNode;
                if ((i.flags & 128) === 0 && (typeof h.getDerivedStateFromError == "function" || v !== null && typeof v.componentDidCatch == "function" && (Kt === null || !Kt.has(v)))) {
                  i.flags |= 65536, t &= -t, i.lanes |= t;
                  var R = bu(i, c, t);
                  _u(i, R);
                  break e;
                }
            }
            i = i.return;
          } while (i !== null);
        }
        La(n);
      } catch (U) {
        t = U, ze === n && n !== null && (ze = n = n.return);
        continue;
      }
      break;
    } while (!0);
  }
  function Ra() {
    var e = _l.current;
    return _l.current = xl, e === null ? xl : e;
  }
  function To() {
    (Me === 0 || Me === 3 || Me === 2) && (Me = 4), Fe === null || (un & 268435455) === 0 && (Cl & 268435455) === 0 || Xt(Fe, Ue);
  }
  function Ml(e, t) {
    var n = ae;
    ae |= 2;
    var r = Ra();
    (Fe !== e || Ue !== t) && (Mt = null, cn(e, t));
    do
      try {
        ed();
        break;
      } catch (l) {
        Ta(e, l);
      }
    while (!0);
    if (Bi(), ae = n, _l.current = r, ze !== null) throw Error(s(261));
    return Fe = null, Ue = 0, Me;
  }
  function ed() {
    for (; ze !== null; ) Ma(ze);
  }
  function td() {
    for (; ze !== null && !_c(); ) Ma(ze);
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
    if (Dc(e, i), e === Fe && (ze = Fe = null, Ue = 0), (n.subtreeFlags & 2064) === 0 && (n.flags & 2064) === 0 || zl || (zl = !0, Oa(Fr, function() {
      return An(), null;
    })), i = (n.flags & 15990) !== 0, (n.subtreeFlags & 15990) !== 0 || i) {
      i = ct.transition, ct.transition = null;
      var o = de;
      de = 1;
      var c = ae;
      ae |= 4, ko.current = null, Zf(e, n), Ea(n, e), Sf(Pi), Vr = !!zi, Pi = zi = null, e.current = n, Jf(n), Cc(), ae = c, de = o, ct.transition = i;
    } else e.current = n;
    if (zl && (zl = !1, Gt = e, Pl = l), i = e.pendingLanes, i === 0 && (Kt = null), Pc(n.stateNode), be(e, _e()), t !== null) for (r = e.onRecoverableError, n = 0; n < t.length; n++) l = t[n], r(l.value, { componentStack: l.stack, digest: l.digest });
    if (jl) throw jl = !1, e = No, No = null, e;
    return (Pl & 1) !== 0 && e.tag !== 0 && An(), i = e.pendingLanes, (i & 1) !== 0 ? e === _o ? Nr++ : (Nr = 0, _o = e) : Nr = 0, Bt(), null;
  }
  function An() {
    if (Gt !== null) {
      var e = ks(Pl), t = ct.transition, n = de;
      try {
        if (ct.transition = null, de = 16 > e ? 16 : e, Gt === null) var r = !1;
        else {
          if (e = Gt, Gt = null, Pl = 0, (ae & 6) !== 0) throw Error(s(331));
          var l = ae;
          for (ae |= 4, F = e.current; F !== null; ) {
            var i = F, o = i.child;
            if ((F.flags & 16) !== 0) {
              var c = i.deletions;
              if (c !== null) {
                for (var p = 0; p < c.length; p++) {
                  var y = c[p];
                  for (F = y; F !== null; ) {
                    var j = F;
                    switch (j.tag) {
                      case 0:
                      case 11:
                      case 15:
                        kr(8, j, i);
                    }
                    var P = j.child;
                    if (P !== null) P.return = j, F = P;
                    else for (; F !== null; ) {
                      j = F;
                      var C = j.sibling, I = j.return;
                      if (ya(j), j === y) {
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
                var O = i.alternate;
                if (O !== null) {
                  var A = O.child;
                  if (A !== null) {
                    O.child = null;
                    do {
                      var Ce = A.sibling;
                      A.sibling = null, A = Ce;
                    } while (A !== null);
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
            var v = o.child;
            if ((o.subtreeFlags & 2064) !== 0 && v !== null) v.return = o, F = v;
            else e: for (o = h; F !== null; ) {
              if (c = F, (c.flags & 2048) !== 0) try {
                switch (c.tag) {
                  case 0:
                  case 11:
                  case 15:
                    Nl(9, c);
                }
              } catch (U) {
                Ne(c, c.return, U);
              }
              if (c === o) {
                F = null;
                break e;
              }
              var R = c.sibling;
              if (R !== null) {
                R.return = c.return, F = R;
                break e;
              }
              F = c.return;
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
  function Ne(e, t, n) {
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
    r !== null && r.delete(t), t = Ke(), e.pingedLanes |= e.suspendedLanes & n, Fe === e && (Ue & n) === n && (Me === 4 || Me === 3 && (Ue & 130023424) === Ue && 500 > _e() - Eo ? cn(e, 0) : So |= n), be(e, t);
  }
  function Da(e, t) {
    t === 0 && ((e.mode & 1) === 0 ? t = 1 : (t = Ur, Ur <<= 1, (Ur & 130023424) === 0 && (Ur = 4194304)));
    var n = Ke();
    e = Pt(e, t), e !== null && (Yn(e, t, n), be(e, n));
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
    else Je = !1, we && (t.flags & 1048576) !== 0 && mu(t, sl, t.index);
    switch (t.lanes = 0, t.tag) {
      case 2:
        var r = t.type;
        Sl(e, t), e = t.pendingProps;
        var l = Cn(t, He.current);
        Mn(t, n), l = bi(null, t, r, e, l, n);
        var i = eo();
        return t.flags |= 1, typeof l == "object" && l !== null && typeof l.render == "function" && l.$$typeof === void 0 ? (t.tag = 1, t.memoizedState = null, t.updateQueue = null, Ze(r) ? (i = !0, ll(t)) : i = !1, t.memoizedState = l.state !== null && l.state !== void 0 ? l.state : null, Ki(t), l.updater = wl, t.stateNode = l, l._reactInternals = t, oo(t, r, e, n), t = co(null, t, r, !0, i, n)) : (t.tag = 0, we && i && Fi(t), Qe(null, t, l, n), t = t.child), t;
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
          } else for (rt = Ut(t.stateNode.containerInfo.firstChild), nt = t, we = !0, mt = null, n = Su(t, null, r, n), t.child = n; n; ) n.flags = n.flags & -3 | 4096, n = n.sibling;
          else {
            if (Pn(), r === l) {
              t = Rt(e, t, n);
              break e;
            }
            Qe(e, t, r, n);
          }
          t = t.child;
        }
        return t;
      case 5:
        return ju(t), e === null && Ui(t), r = t.type, l = t.pendingProps, i = e !== null ? e.memoizedProps : null, o = l.children, Ti(r, l) ? o = null : i !== null && Ti(r, i) && (t.flags |= 32), sa(e, t), Qe(e, t, o, n), t.child;
      case 6:
        return e === null && Ui(t), null;
      case 13:
        return fa(e, t, n);
      case 4:
        return Gi(t, t.stateNode.containerInfo), r = t.pendingProps, e === null ? t.child = Tn(t, null, r, n) : Qe(e, t, r, n), t.child;
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
          if (r = t.type._context, l = t.pendingProps, i = t.memoizedProps, o = l.value, pe(cl, r._currentValue), r._currentValue = o, i !== null) if (ht(i.value, o)) {
            if (i.children === l.children && !Xe.current) {
              t = Rt(e, t, n);
              break e;
            }
          } else for (i = t.child, i !== null && (i.return = t); i !== null; ) {
            var c = i.dependencies;
            if (c !== null) {
              o = i.child;
              for (var p = c.firstContext; p !== null; ) {
                if (p.context === r) {
                  if (i.tag === 1) {
                    p = Tt(-1, n & -n), p.tag = 2;
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
                  ), c.lanes |= n;
                  break;
                }
                p = p.next;
              }
            } else if (i.tag === 10) o = i.type === t.type ? null : i.child;
            else if (i.tag === 18) {
              if (o = i.return, o === null) throw Error(s(341));
              o.lanes |= n, c = o.alternate, c !== null && (c.lanes |= n), Wi(o, n, t), o = i.sibling;
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
      if (e = e.$$typeof, e === ne) return 11;
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
      case ce:
        return dn(n.children, l, i, t);
      case re:
        o = 8, l |= 8;
        break;
      case ue:
        return e = ft(12, n, t, l | 2), e.elementType = ue, e.lanes = i, e;
      case ye:
        return e = ft(13, n, t, l), e.elementType = ye, e.lanes = i, e;
      case Ge:
        return e = ft(19, n, t, l), e.elementType = Ge, e.lanes = i, e;
      case xe:
        return Il(n, l, i, t);
      default:
        if (typeof e == "object" && e !== null) switch (e.$$typeof) {
          case K:
            o = 10;
            break e;
          case ie:
            o = 9;
            break e;
          case ne:
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
    return e = ft(22, e, r, t), e.elementType = xe, e.lanes = n, e.stateNode = { isHidden: !1 }, e;
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
  function Io(e, t, n, r, l, i, o, c, p) {
    return e = new ud(e, t, n, c, p), t === 1 ? (t = 1, i === !0 && (t |= 8)) : t = 0, i = ft(3, null, null, t), e.current = i, i.stateNode = e, i.memoizedState = { element: r, isDehydrated: n, cache: null, transitions: null, pendingSuspenseBoundaries: null }, Ki(i), e;
  }
  function ad(e, t, n) {
    var r = 3 < arguments.length && arguments[3] !== void 0 ? arguments[3] : null;
    return { $$typeof: B, key: r == null ? null : "" + r, children: e, containerInfo: t, implementation: n };
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
  function Ua(e, t, n, r, l, i, o, c, p) {
    return e = Io(n, r, !0, e, l, i, o, c, p), e.context = Aa(null), n = e.current, r = Ke(), l = Yt(n), i = Tt(r, l), i.callback = t ?? null, Wt(n, i, l), e.current.lanes = l, Yn(e, l, r), be(e, r), e;
  }
  function Dl(e, t, n, r) {
    var l = t.current, i = Ke(), o = Yt(l);
    return n = Aa(n), t.context === null ? t.context = n : t.pendingContext = n, t = Tt(i, o), t.payload = { element: e }, r = r === void 0 ? null : r, r !== null && (t.callback = r), e = Wt(l, t, o), e !== null && (xt(e, l, o, i), dl(e, l, o)), o;
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
  function $a(e, t) {
    if (e = e.memoizedState, e !== null && e.dehydrated !== null) {
      var n = e.retryLane;
      e.retryLane = n !== 0 && n < t ? n : t;
    }
  }
  function Do(e, t) {
    $a(e, t), (e = e.alternate) && $a(e, t);
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
      }), t[_t] = null;
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
      var o = Ua(t, r, e, 0, null, !1, !1, "", Ba);
      return e._reactRootContainer = o, e[_t] = o.current, ur(e.nodeType === 8 ? e.parentNode : e), an(), o;
    }
    for (; l = e.lastChild; ) e.removeChild(l);
    if (typeof r == "function") {
      var c = r;
      r = function() {
        var y = Fl(p);
        c.call(y);
      };
    }
    var p = Io(e, 0, !1, null, null, !1, !1, "", Ba);
    return e._reactRootContainer = p, e[_t] = p.current, ur(e.nodeType === 8 ? e.parentNode : e), an(function() {
      Dl(t, p, n, r);
    }), p;
  }
  function Ul(e, t, n, r, l) {
    var i = n._reactRootContainer;
    if (i) {
      var o = i;
      if (typeof l == "function") {
        var c = l;
        l = function() {
          var p = Fl(o);
          c.call(p);
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
          var r = Pt(e, 1);
          if (r !== null) {
            var l = Ke();
            xt(r, e, 1, l);
          }
        }), Do(e, 1);
    }
  }, si = function(e) {
    if (e.tag === 13) {
      var t = Pt(e, 134217728);
      if (t !== null) {
        var n = Ke();
        xt(t, e, 134217728, n);
      }
      Do(e, 134217728);
    }
  }, Es = function(e) {
    if (e.tag === 13) {
      var t = Yt(e), n = Pt(e, t);
      if (n !== null) {
        var r = Ke();
        xt(n, e, t, r);
      }
      Do(e, t);
    }
  }, Ns = function() {
    return de;
  }, _s = function(e, t) {
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
              $n(r), Ql(r, l);
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
  var dd = { usingClientEntryPoint: !1, Events: [fr, Nn, nl, ss, us, zo] }, _r = { findFiberByHostInstance: en, bundleType: 0, version: "18.3.1", rendererPackageName: "react-dom" }, pd = { bundleType: _r.bundleType, version: _r.version, rendererPackageName: _r.rendererPackageName, rendererConfig: _r.rendererConfig, overrideHookState: null, overrideHookStateDeletePath: null, overrideHookStateRenamePath: null, overrideProps: null, overridePropsDeletePath: null, overridePropsRenamePath: null, setErrorHandler: null, setSuspenseHandler: null, scheduleUpdate: null, currentDispatcherRef: he.ReactCurrentDispatcher, findHostInstanceByFiber: function(e) {
    return e = hs(e), e === null ? null : e.stateNode;
  }, findFiberByHostInstance: _r.findFiberByHostInstance || cd, findHostInstancesForRefresh: null, scheduleRefresh: null, scheduleRoot: null, setRefreshHandler: null, getCurrentFiber: null, reconcilerVersion: "18.3.1-next-f1338f8080-20240426" };
  if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u") {
    var $l = __REACT_DEVTOOLS_GLOBAL_HOOK__;
    if (!$l.isDisabled && $l.supportsFiber) try {
      Or = $l.inject(pd), wt = $l;
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
    return t != null && (t.unstable_strictMode === !0 && (n = !0), t.identifierPrefix !== void 0 && (r = t.identifierPrefix), t.onRecoverableError !== void 0 && (l = t.onRecoverableError)), t = Io(e, 1, !1, null, null, n, !1, r, l), e[_t] = t.current, ur(e.nodeType === 8 ? e.parentNode : e), new Fo(t);
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
    return Ul(null, e, t, !0, n);
  }, et.hydrateRoot = function(e, t, n) {
    if (!Oo(e)) throw Error(s(405));
    var r = n != null && n.hydratedSources || null, l = !1, i = "", o = Ha;
    if (n != null && (n.unstable_strictMode === !0 && (l = !0), n.identifierPrefix !== void 0 && (i = n.identifierPrefix), n.onRecoverableError !== void 0 && (o = n.onRecoverableError)), t = Ua(t, null, e, 1, n ?? null, l, !1, i, o), e[_t] = t.current, ur(e), r) for (e = 0; e < r.length; e++) n = r[e], l = n._getVersion, l = l(n._source), t.mutableSourceEagerHydrationData == null ? t.mutableSourceEagerHydrationData = [n, l] : t.mutableSourceEagerHydrationData.push(
      n,
      l
    );
    return new Ol(t);
  }, et.render = function(e, t, n) {
    if (!Al(t)) throw Error(s(200));
    return Ul(null, e, t, !1, n);
  }, et.unmountComponentAtNode = function(e) {
    if (!Al(e)) throw Error(s(40));
    return e._reactRootContainer ? (an(function() {
      Ul(null, null, e, !1, function() {
        e._reactRootContainer = null, e[_t] = null;
      });
    }), !0) : !1;
  }, et.unstable_batchedUpdates = zo, et.unstable_renderSubtreeIntoContainer = function(e, t, n, r) {
    if (!Al(n)) throw Error(s(200));
    if (e == null || e._reactInternals === void 0) throw Error(s(38));
    return Ul(e, t, n, !1, r);
  }, et.version = "18.3.1-next-f1338f8080-20240426", et;
}
var Za;
function Ed() {
  if (Za) return $o.exports;
  Za = 1;
  function a() {
    if (!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function"))
      try {
        __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(a);
      } catch (u) {
        console.error(u);
      }
  }
  return a(), $o.exports = Sd(), $o.exports;
}
var Ja;
function Nd() {
  if (Ja) return Hl;
  Ja = 1;
  var a = Ed();
  return Hl.createRoot = a.createRoot, Hl.hydrateRoot = a.hydrateRoot, Hl;
}
var _d = Nd();
const Cd = ':host{--fc-text: var(--primary-text-color, #2b1e15);--fc-muted: var(--secondary-text-color, #786350);--fc-accent: var(--faith-accent, #b8862f);--fc-line: var(--divider-color, rgba(0,0,0,.12));--fc-bg2: var(--secondary-background-color, rgba(0,0,0,.04));--fc-ok: var(--success-color, #43a047);--fc-err: var(--error-color, #db4437);--fc-soft: color-mix(in srgb, var(--fc-accent) 14%, transparent);display:block;--fc-hex: polygon(50% 0, 93.3% 25%, 93.3% 75%, 50% 100%, 6.7% 75%, 6.7% 25%);--fc-serif: var(--faith-serif, "Fraunces Variable", Georgia, "Iowan Old Style", serif)}*{box-sizing:border-box}ha-card{padding:16px;color:var(--fc-text)}.head{display:flex;align-items:center;gap:10px;margin-bottom:12px}.head h2{margin:0;font-size:1.25rem;font-weight:600;line-height:1.2}.head .sub{color:var(--fc-muted);font-size:.85rem}.head .right{margin-left:auto;display:flex;gap:6px;align-items:center}.eyebrow{font-size:.72rem;letter-spacing:.12em;text-transform:uppercase;color:var(--fc-muted)}.hello{font-family:var(--fc-serif);margin:2px 0 14px;font-size:1.6rem;font-weight:600;line-height:1.15}.hello em{color:var(--fc-accent);font-style:italic}.section{padding:12px 0;border-top:1px solid var(--fc-line)}.section:first-of-type{border-top:0;padding-top:0}.section h3{display:flex;align-items:center;gap:8px;margin:0 0 8px;font-size:1rem;font-weight:600}.section h3 ha-icon{--mdc-icon-size: 20px;color:var(--fc-accent)}.count{background:var(--fc-bg2);color:var(--fc-muted);border-radius:999px;padding:0 8px;font-size:.8rem;font-weight:500}ul{list-style:none;margin:0;padding:0}.row{display:flex;align-items:center;gap:10px;padding:7px 0;border-bottom:1px solid var(--fc-line)}.row:last-child{border-bottom:0}.time{min-width:70px;color:var(--fc-muted);font-variant-numeric:tabular-nums}.grow{flex:1;min-width:0}.meta{color:var(--fc-muted);font-size:.85rem}.label{font-size:.72rem;letter-spacing:.1em;text-transform:uppercase;color:var(--fc-muted)}.check{width:18px;height:18px;border-radius:50%;border:2px solid var(--fc-line);flex:none}.check.done{background:var(--fc-ok);border-color:var(--fc-ok)}.tiles{display:grid;grid-template-columns:repeat(auto-fill,minmax(120px,1fr));gap:8px}.tile{background:var(--fc-bg2);border-radius:12px;padding:10px 12px}.tile .v{font-size:1.15rem;font-weight:600;text-transform:capitalize}.empty{color:var(--fc-muted);padding:4px 0}.err{color:var(--fc-err)}button{font:inherit;color:inherit;cursor:pointer;white-space:nowrap;border:1px solid var(--fc-line);background:var(--fc-bg2);border-radius:10px;padding:8px 14px;min-height:44px}button:focus-visible,a:focus-visible,input:focus-visible{outline:2px solid var(--fc-accent);outline-offset:2px}button.primary{background:var(--fc-accent);border-color:var(--fc-accent);color:var(--faith-accent-text, #fffaf0)}button.ghost{background:transparent;border-color:transparent;color:var(--fc-muted)}button:disabled{opacity:.5;cursor:default}.btns{display:flex;gap:6px;flex-wrap:wrap}input{font:inherit;color:var(--fc-text);background:var(--fc-bg2);border:1px solid var(--fc-line);border-radius:10px;padding:8px 12px;min-height:44px;width:100%}input:focus{outline:2px solid var(--fc-accent);outline-offset:-1px}.avatar{display:inline-grid;place-items:center;color:#fff;font-weight:600;flex:none;clip-path:var(--fc-hex)}.hexring{display:inline-grid;place-items:center;padding:3px;background:var(--fc-accent);clip-path:var(--fc-hex);flex:none}.people{display:grid;grid-template-columns:repeat(auto-fill,minmax(96px,1fr));gap:10px}.person{display:flex;flex-direction:column;align-items:center;gap:8px;padding:14px 8px;border-radius:14px;border:1px solid var(--fc-line);background:transparent;font-weight:600}.person.suggested{border:2px solid var(--fc-accent)}.pin{display:flex;flex-direction:column;align-items:center;gap:12px}.dots{display:flex;gap:10px}.dots span{width:13px;height:13px;border-radius:50%;border:2px solid var(--fc-muted)}.dots span.on{background:var(--fc-accent);border-color:var(--fc-accent)}.keys{display:grid;grid-template-columns:repeat(3,68px);gap:8px}.keys button{height:58px;font-size:1.35rem;border-radius:14px}.chat{display:flex;flex-direction:column;gap:10px;max-height:var(--faith-chat-height, 420px);overflow-y:auto;padding:2px}.msg{max-width:88%;padding:9px 13px;border-radius:16px;white-space:pre-wrap;line-height:1.4}.msg.me{align-self:flex-end;background:var(--fc-accent);color:var(--faith-accent-text, #fffaf0);border-bottom-right-radius:4px}.msg.faith{align-self:flex-start;background:var(--fc-bg2);border-bottom-left-radius:4px}.chips{display:flex;gap:4px;flex-wrap:wrap}.chip{font-size:.75rem;color:var(--fc-muted);border:1px solid var(--fc-line);border-radius:999px;padding:1px 8px}.ask{display:flex;gap:6px;margin-top:10px;align-items:center}.ask button{min-width:44px;padding:8px 10px}.rec{background:var(--fc-err)!important;color:#fff!important;border-color:var(--fc-err)!important}.box{border:1px solid var(--fc-accent);border-radius:14px;padding:10px 12px;display:flex;flex-direction:column;gap:8px}.box.wait{border-style:dashed}.big{font-size:2.6rem;font-weight:700;line-height:1}.pill{background:var(--fc-soft);color:var(--fc-accent);border-radius:999px;padding:2px 10px;font-weight:600;font-size:.85rem;white-space:nowrap}.toast{color:var(--fc-muted);font-size:.85rem}.toast:empty,.err:empty{display:none}.apps{display:flex;gap:8px;flex-wrap:wrap}.apps a{text-decoration:none;color:inherit;display:flex;align-items:center;gap:8px;border:1px solid var(--fc-line);border-radius:12px;padding:6px 12px 6px 8px}.emblem{flex:none;margin:-6px -2px -6px -6px}.mine{display:flex;align-items:center;gap:16px}.honey{display:grid;place-items:center;align-content:center;width:104px;height:112px;flex:none;clip-path:var(--fc-hex);background:linear-gradient(160deg,color-mix(in srgb,var(--fc-accent) 70%,#fff),var(--fc-accent));color:var(--faith-accent-text, #fffaf0)}.honey .label{color:inherit;opacity:.85}ha-card.hub{position:relative;overflow:hidden;padding:22px 22px 18px;background:radial-gradient(90% 60% at 50% 45%,color-mix(in srgb,var(--fc-accent) 14%,transparent),transparent 70%),var(--ha-card-background, var(--card-background-color, transparent))}.hub-top{display:flex;align-items:flex-start;gap:12px}.hub-top .right{margin-left:auto;display:flex;gap:8px;align-items:center;flex-wrap:wrap;justify-content:flex-end}.clock{font-family:var(--fc-serif);font-size:3.2rem;font-weight:600;line-height:1;letter-spacing:-.02em;font-variant-numeric:tabular-nums}.hub-mid{display:flex;flex-direction:column;align-items:center;text-align:center;gap:6px;margin:8px 0 10px}.hub-mid .hello{margin:0}button.orb{background:none;border:0;padding:0;min-height:0;border-radius:50%;margin:-8px 0}button.orb:focus-visible{outline:2px solid var(--fc-accent);outline-offset:-12px}button.orb:disabled{opacity:1}.hint{font-size:.72rem;letter-spacing:.16em;text-transform:uppercase;color:var(--fc-accent);font-weight:600}.heard{color:var(--fc-muted);font-style:italic}.reply{font-family:var(--fc-serif);font-size:1.3rem;line-height:1.4;max-width:34em;white-space:pre-wrap}.hub-mid .box{text-align:left;width:min(100%,30em)}.faces{display:flex;justify-content:center;gap:18px;flex-wrap:wrap;margin-top:14px;padding-top:14px;border-top:1px solid var(--fc-line)}button.face{display:flex;flex-direction:column;align-items:center;gap:6px;background:none;border:0;padding:4px;min-height:0;font-weight:600;font-size:.9rem}.overlay{position:absolute;top:0;right:0;bottom:0;left:0;z-index:2;display:grid;place-items:center;padding:16px;background:var(--ha-card-background, var(--card-background-color, #241a13))}.md-list{list-style:disc;margin:2px 0 4px;padding-left:1.3em;text-align:left}.md-list li{margin:1px 0}.msg .md-line:last-child,.reply .md-line:last-child{white-space:normal}code{font-family:ui-monospace,monospace;font-size:.9em;background:var(--fc-bg2);border-radius:5px;padding:0 4px}.cardbal{display:flex;align-items:center;gap:6px;margin-top:8px}.cardbal ha-icon{--mdc-icon-size: 18px;color:var(--fc-accent)}', Qo = (a) => `faith.hub.${a}`, oc = (a) => {
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
      var s, S;
      return !!((S = (s = a()) == null ? void 0 : s.themes) != null && S.darkMode);
    },
    call: async (s, S = {}) => {
      const N = a();
      if (!N) throw new Error("Home Assistant isn't ready yet.");
      const _ = oc(u.screen);
      try {
        return await N.callWS({ type: "faith/call", path: s, body: { ...S, ...u.screen ? { screen: u.screen } : {}, ..._ ? { hub_session: _ } : {} } });
      } catch (z) {
        throw new Error((z == null ? void 0 : z.message) || (z == null ? void 0 : z.code) || "FAITH didn't answer.");
      }
    }
  };
}
const Pr = (1 + Math.sqrt(5)) / 2, it = Math.PI * 2, Ko = (() => {
  const a = Math.hypot(1, Pr), u = [];
  for (const s of [-1, 1]) for (const S of [-Pr, Pr]) u.push([0, s / a, S / a], [s / a, S / a, 0], [S / a, 0, s / a]);
  return u;
})(), zd = (a, u) => (a[0] - u[0]) ** 2 + (a[1] - u[1]) ** 2 + (a[2] - u[2]) ** 2, Pd = 4 / (1 + Pr * Pr), Xo = [];
for (let a = 0; a < 12; a++) for (let u = a + 1; u < 12; u++) Math.abs(zd(Ko[a], Ko[u]) - Pd) < 0.01 && Xo.push([a, u]);
const sc = [], Vo = (a, u) => Xo.some(([s, S]) => s === a && S === u || s === u && S === a);
for (let a = 0; a < 12; a++) for (let u = a + 1; u < 12; u++) for (let s = u + 1; s < 12; s++) Vo(a, u) && Vo(u, s) && Vo(a, s) && sc.push([a, u, s]);
const Tr = 7, qt = (a) => {
  const u = Math.sin(a * 127.1 + 311.7) * 43758.5453;
  return u - Math.floor(u);
}, qa = Array.from({ length: Tr }, (a, u) => ({
  a: [0, 1, 2].map((s) => 0.3 + 0.16 * qt(u * 9 + s)),
  w: [0, 1, 2].map((s) => 0.22 + 0.3 * qt(u * 9 + s + 3)),
  p: [0, 1, 2].map((s) => it * qt(u * 9 + s + 6)),
  flap: it * qt(u * 3 + 100)
})), uc = -1, Rr = [];
for (let a = 0; a < Tr; a++) Rr.push({ a: uc, b: a, kind: "core", seed: qt(a + 40) });
for (let a = 0; a < Tr; a++) Rr.push({ a, b: (a + 1) % Tr, kind: "bee", seed: qt(a + 60) });
for (const [a, u] of [[0, 3], [2, 5], [4, 6]]) Rr.push({ a, b: u, kind: "bee", seed: qt(a * 7 + u) });
for (const [a, u] of [[1, 0], [3, 7], [5, 10]]) Rr.push({ a, b: u, kind: "shell", seed: qt(a + u * 3) });
const Td = [
  { r: 1.34, tiltX: 1.12, tiltZ: 0.38, precess: 0.21, phase: 0, width: 0.024, ticks: 36 },
  { r: 1.5, tiltX: 1.38, tiltZ: -0.62, precess: -0.15, phase: Math.PI / 2, width: 0.016, ticks: 0 }
], ba = ([a, u, s], S) => {
  const N = Math.cos(S), _ = Math.sin(S);
  return [a, u * N - s * _, u * _ + s * N];
}, ec = ([a, u, s], S) => {
  const N = Math.cos(S), _ = Math.sin(S);
  return [a * N + s * _, u, -a * _ + s * N];
}, tc = ([a, u, s], S) => {
  const N = Math.cos(S), _ = Math.sin(S);
  return [a * N - u * _, a * _ + u * N, s];
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
}, ge = (a, u) => `rgba(${a[0]},${a[1]},${a[2]},${Math.max(0, Math.min(1, u))})`, Bl = {
  idle: { spin: 0.16, bees: 1, rings: 1, sparks: 0.3, glow: 0.45, gather: 0 },
  listening: { spin: 0.1, bees: 0.7, rings: 0.6, sparks: 0.2, glow: 0.6, gather: 0.3 },
  thinking: { spin: 0.55, bees: 1.9, rings: 3.2, sparks: 1, glow: 0.8, gather: 0.1 },
  speaking: { spin: 0.22, bees: 1.2, rings: 1.4, sparks: 0.55, glow: 0.55, gather: 0 }
};
class Md {
  constructor(u, s = {}) {
    $e(this, "ctx");
    $e(this, "opts");
    $e(this, "raf", 0);
    $e(this, "last", 0);
    $e(this, "t", 0);
    $e(this, "acc", { spin: 0.6, bees: 3, rings: 1.2, sparks: 0 });
    $e(this, "cur", { ...Bl.idle });
    $e(this, "ro");
    $e(this, "heading", new Array(Tr).fill(0));
    $e(this, "w", 0);
    $e(this, "h", 0);
    $e(this, "dpr", 1);
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
      const S = Math.min(0.05, (s - this.last) / 1e3);
      this.last = s, this.frame(S), this.raf = requestAnimationFrame(u);
    };
    this.raf = requestAnimationFrame(u);
  }
  frame(u) {
    const s = Bl[this.opts.state], S = Math.min(1, u * 2.5);
    for (const N of Object.keys(s)) this.cur[N] += (s[N] - this.cur[N]) * S;
    this.t += u, this.acc.spin += this.cur.spin * u, this.acc.bees += this.cur.bees * u, this.acc.rings += this.cur.rings * u, this.acc.sparks += (0.25 + this.cur.sparks * 0.9) * u, this.draw();
  }
  level() {
    const u = this.opts.state;
    if (u !== "listening" && u !== "speaking") return 0;
    const s = typeof this.opts.level == "function" ? this.opts.level() : this.opts.level;
    if (typeof s == "number") return Math.max(0, Math.min(1, s));
    const S = this.t;
    return u === "speaking" ? 0.5 + 0.5 * Math.sin(S * 9) * Math.sin(S * 2.3) : 0.3 + 0.2 * Math.sin(S * 3);
  }
  draw() {
    const { ctx: u, w: s, h: S } = this, N = Rd[this.opts.tone], _ = s / 2, z = S / 2, T = Math.min(s, S) / 2 / 1.86, g = 5, E = this.level(), $ = this.acc.spin, H = 0.38 + 0.12 * Math.sin(this.t * 0.31), L = 0.08 * Math.sin(this.t * 0.23), J = (x) => ba(tc(ec(x, $), L), H), b = (x) => {
      const k = g / (g - x[2]);
      return { x: _ + x[0] * T * k, y: z - x[1] * T * k, z: x[2], s: k };
    }, ee = (x) => (x + 1) / 2;
    u.clearRect(0, 0, s, S);
    const le = this.cur.glow + E * 0.5, je = u.createRadialGradient(_, z, 0, _, z, T * 1.6);
    je.addColorStop(0, ge(N.glow, 0.26 * le)), je.addColorStop(0.45, ge(N.glow, 0.1 * le)), je.addColorStop(1, ge(N.glow, 0)), u.fillStyle = je, u.fillRect(0, 0, s, S);
    const Le = [], Pe = [], he = [];
    Td.forEach((x, k) => {
      const d = x.phase + this.acc.rings * x.precess, w = (G, oe = x.r) => ec(tc(ba([Math.cos(G) * oe, 0, Math.sin(G) * oe], x.tiltX), x.tiltZ), d), D = 96, Q = [];
      let Z = b(w(0));
      for (let G = 1; G <= D; G++) {
        const oe = w(G / D * it), Ee = b(oe);
        Q.push({ a: Z, b: Ee, z: (Z.z + Ee.z) / 2, wd: x.width }), Z = Ee;
      }
      Le.push(Q);
      const X = [], se = this.acc.rings * 0.35 * (k ? -1 : 1);
      for (let G = 0; G < x.ticks; G++) {
        const oe = G / x.ticks * it + se, Ee = G % 3 === 0 ? 0.07 : 0.035, dt = b(w(oe, x.r - Ee)), $n = b(w(oe, x.r + Ee));
        X.push({ a: dt, b: $n, z: (dt.z + $n.z) / 2 });
      }
      if (Pe.push(X), k === 0) for (const G of [0, Math.PI]) he.push(b(w(se * 1.6 + G)));
      else he.push(b(w(-se * 1.2 + 1)));
    });
    const Te = (x) => {
      u.lineCap = "round", Le.forEach((k) => {
        for (const d of k) {
          if (d.z >= 0 !== x) continue;
          const w = ee(d.z);
          u.strokeStyle = `rgb(${N.ringLo.map((D, Q) => Math.round(D + (N.ringHi[Q] - D) * w)).join(",")})`, u.globalAlpha = x ? 1 : 0.55, u.lineWidth = Math.max(this.dpr * 1.2, T * d.wd * d.a.s), u.beginPath(), u.moveTo(d.a.x, d.a.y), u.lineTo(d.b.x, d.b.y), u.stroke();
        }
      }), u.lineWidth = T * 8e-3;
      for (const k of Pe) for (const d of k)
        d.z >= 0 === x && (u.strokeStyle = ge(N.ringHi, (x ? 0.9 : 0.35) * (0.4 + 0.6 * ee(d.z))), u.beginPath(), u.moveTo(d.a.x, d.a.y), u.lineTo(d.b.x, d.b.y), u.stroke());
      for (const k of he) {
        if (k.z >= 0 !== x) continue;
        u.globalAlpha = x ? 1 : 0.5;
        const d = T * 0.034 * k.s, w = u.createRadialGradient(k.x - d * 0.3, k.y - d * 0.3, d * 0.1, k.x, k.y, d);
        w.addColorStop(0, ge(N.spark, 1)), w.addColorStop(1, ge(N.ringLo, 1)), u.fillStyle = w, u.beginPath(), u.arc(k.x, k.y, d, 0, it), u.fill();
      }
      u.globalAlpha = 1;
    };
    Te(!1);
    const B = Ko.map(J), ce = B.map(b), re = (x) => {
      for (const [k, d] of Xo) {
        const w = (B[k][2] + B[d][2]) / 2;
        w >= -0.05 === x && (u.strokeStyle = x ? ge(N.edge, 0.55 + 0.45 * ee(w)) : ge(N.edgeBack, this.opts.tone === "light" ? 0.45 : 0.32), u.lineWidth = Math.max(this.dpr * (x ? 1 : 0.6), T * (x ? 0.013 : 8e-3)), u.beginPath(), u.moveTo(ce[k].x, ce[k].y), u.lineTo(ce[d].x, ce[d].y), u.stroke());
      }
    };
    re(!1);
    const ue = 1 - this.cur.gather, K = qa.map((x) => {
      const k = (D) => [x.a[0] * Math.sin(x.w[0] * D + x.p[0]) * ue, x.a[1] * Math.sin(x.w[1] * D + x.p[1]) * ue, x.a[2] * Math.cos(x.w[2] * D + x.p[2]) * ue], d = J(k(this.acc.bees)), w = b(J(k(this.acc.bees + 0.05)));
      return { v: d, p: b(d), next: w };
    }), ie = b([0, 0, 0]), ne = (x, k, d) => d === "a" && x === uc ? ie : k === "shell" && d === "b" ? ce[x] : K[x].p, ye = Rr.map((x) => ({ l: x, A: ne(x.a, x.kind, "a"), B: ne(x.b, x.kind, "b") })), Ge = (x, k) => {
      const d = Math.hypot(k.x - x.x, k.y - x.y);
      return { mx: (x.x + k.x) / 2, my: (x.y + k.y) / 2 + d * 0.12 };
    };
    u.lineCap = "round";
    for (const { l: x, A: k, B: d } of ye) {
      const { mx: w, my: D } = Ge(k, d), Q = (k.z + d.z) / 2;
      u.strokeStyle = ge(N.thread, (x.kind === "core" ? 0.6 : x.kind === "shell" ? 0.35 : 0.5) * (0.5 + 0.5 * ee(Q))), u.lineWidth = Math.max(this.dpr * 0.6, T * (x.kind === "core" ? 9e-3 : 65e-4)), u.beginPath(), u.moveTo(k.x, k.y), u.quadraticCurveTo(w, D, d.x, d.y), u.stroke();
    }
    for (const { l: x, A: k, B: d } of ye) {
      if (x.kind === "shell") continue;
      const w = this.cur.sparks;
      if (x.seed > w + 0.15) continue;
      const D = (this.acc.sparks * (0.6 + x.seed) + x.seed * 7) % 1, { mx: Q, my: Z } = Ge(k, d), X = 1 - D, se = X * X * k.x + 2 * X * D * Q + D * D * d.x, G = X * X * k.y + 2 * X * D * Z + D * D * d.y, oe = T * 0.018 * (0.6 + w * 0.6), Ee = Math.sin(D * Math.PI), dt = u.createRadialGradient(se, G, 0, se, G, oe * 2.4);
      dt.addColorStop(0, ge(N.spark, 0.95 * Ee)), dt.addColorStop(1, ge(N.spark, 0)), u.fillStyle = dt, u.beginPath(), u.arc(se, G, oe * 2.4, 0, it), u.fill();
    }
    const Ye = T * (0.085 + 0.035 * E + 0.01 * Math.sin(this.t * 2)), Ie = u.createRadialGradient(ie.x, ie.y, 0, ie.x, ie.y, Ye * 3.2);
    Ie.addColorStop(0, ge(N.core, 0.55 * le)), Ie.addColorStop(1, ge(N.core, 0)), u.fillStyle = Ie, u.beginPath(), u.arc(ie.x, ie.y, Ye * 3.2, 0, it), u.fill(), this.hex(ie.x, ie.y, Ye, this.acc.spin * 0.5, N);
    const xe = K.map((x, k) => k).sort((x, k) => K[x].v[2] - K[k].v[2]);
    for (const x of xe) {
      const k = K[x];
      let w = Math.atan2(k.next.y - k.p.y, k.next.x - k.p.x) - this.heading[x];
      w = ((w + Math.PI) % it + it) % it - Math.PI, this.heading[x] += this.opts.still ? w : w * 0.15;
      const D = 0.35 + 0.65 * Math.abs(Math.sin(this.t * 26 + qa[x].flap));
      this.bee(k.p.x, k.p.y, T * 0.15 * k.p.s, this.heading[x], D, 0.55 + 0.45 * ee(k.v[2]), N);
    }
    const M = [-0.4, 0.6, 0.7];
    for (const [x, k, d] of sc) {
      const w = B[x], D = B[k], Q = B[d], Z = [(w[0] + D[0] + Q[0]) / 3, (w[1] + D[1] + Q[1]) / 3, (w[2] + D[2] + Q[2]) / 3];
      if (Z[2] <= 0) continue;
      const X = Math.max(0, (Z[0] * M[0] + Z[1] * M[1] + Z[2] * M[2]) / Math.hypot(...Z));
      u.fillStyle = ge(N.face, 0.03 + 0.07 * X * X), u.beginPath(), u.moveTo(ce[x].x, ce[x].y), u.lineTo(ce[k].x, ce[k].y), u.lineTo(ce[d].x, ce[d].y), u.closePath(), u.fill();
    }
    re(!0);
    for (let x = 0; x < 12; x++)
      B[x][2] < -0.05 || (u.fillStyle = ge(N.edge, 0.6 + 0.4 * ee(B[x][2])), u.beginPath(), u.arc(ce[x].x, ce[x].y, T * 0.02 * ce[x].s, 0, it), u.fill());
    Te(!0);
  }
  hex(u, s, S, N, _) {
    const { ctx: z } = this, T = Array.from({ length: 6 }, (g, E) => [u + S * Math.cos(N + E * it / 6), s + S * Math.sin(N + E * it / 6)]);
    for (let g = 0; g < 6; g++) {
      const [E, $] = T[g], [H, L] = T[(g + 1) % 6];
      z.fillStyle = ge(_.bee[g % 3], 1), z.beginPath(), z.moveTo(u, s), z.lineTo(E, $), z.lineTo(H, L), z.closePath(), z.fill();
    }
    z.strokeStyle = ge(_.spark, 0.9), z.lineWidth = S * 0.12, z.beginPath(), T.forEach(([g, E], $) => $ ? z.lineTo(g, E) : z.moveTo(g, E)), z.closePath(), z.stroke();
  }
  /** One low-poly bee seen from above, facing +x in its own space. */
  bee(u, s, S, N, _, z, T) {
    const { ctx: g } = this;
    g.save(), g.translate(u, s), g.rotate(N), g.scale(S, S), g.globalAlpha = z;
    const E = (L) => {
      g.beginPath(), L.forEach(([J, b], ee) => ee ? g.lineTo(J, b) : g.moveTo(J, b)), g.closePath();
    };
    g.fillStyle = ge(T.head, 1), E([[-1.02, -0.08], [-1.28, 0], [-1.02, 0.08]]), g.fill();
    const $ = [[-1.05, 0], [-0.78, -0.4], [-0.2, -0.5], [0.28, -0.36], [0.46, 0], [0.28, 0.36], [-0.2, 0.5], [-0.78, 0.4]], H = [-0.3, 0];
    for (let L = 0; L < $.length; L++)
      g.fillStyle = ge(T.bee[L % 3], 1), E([H, $[L], $[(L + 1) % $.length]]), g.fill();
    g.save(), E($), g.clip(), g.fillStyle = ge(T.stripe, 0.92), E([[-0.26, -0.6], [-0.44, -0.6], [-0.5, 0.6], [-0.32, 0.6]]), g.fill(), E([[-0.64, -0.6], [-0.8, -0.6], [-0.86, 0.6], [-0.7, 0.6]]), g.fill(), g.restore(), g.fillStyle = ge(T.head, 1), E([[0.42, 0], [0.58, -0.27], [0.86, -0.2], [0.95, 0], [0.86, 0.2], [0.58, 0.27]]), g.fill(), g.fillStyle = ge(T.bee[1], 0.9), E([[0.7, -0.2], [0.84, -0.14], [0.74, -0.08]]), g.fill(), E([[0.7, 0.2], [0.84, 0.14], [0.74, 0.08]]), g.fill(), g.strokeStyle = ge(T.head, 1), g.lineWidth = 0.06, g.lineCap = "round", g.beginPath(), g.moveTo(0.9, -0.1), g.lineTo(1.08, -0.2), g.lineTo(1.2, -0.4), g.moveTo(0.9, 0.1), g.lineTo(1.08, 0.2), g.lineTo(1.2, 0.4), g.stroke();
    for (const L of [-1, 1]) {
      const J = L * _, b = [[0.22, 0.16 * L], [0.05, 1.08 * J], [-0.5, 0.92 * J], [-0.22, 0.24 * L]];
      g.fillStyle = ge(T.wing, 0.38), E(b), g.fill(), g.strokeStyle = ge(T.bee[1], 0.85), g.lineWidth = 0.04, g.stroke(), g.beginPath(), g.moveTo(0.05, 0.2 * L), g.lineTo(-0.22, 0.95 * J), g.stroke();
    }
    g.restore();
  }
}
const nc = () => typeof matchMedia == "function" && matchMedia("(prefers-reduced-motion: reduce)").matches;
function ac({ size: a = 160, state: u = "idle", level: s, tone: S = "dark", still: N, className: _ }) {
  const z = q.useRef(null), T = q.useRef();
  return q.useEffect(() => (T.current = new Md(z.current, { state: u, level: s, tone: S, still: N ?? nc() }), () => {
    var g;
    return (g = T.current) == null ? void 0 : g.destroy();
  }), []), q.useEffect(() => {
    var g;
    (g = T.current) == null || g.set({ state: u, level: s, tone: S, still: N ?? nc() });
  }, [u, s, S, N]), /* @__PURE__ */ f.jsx("canvas", { ref: z, className: _, style: { width: a, height: a, display: "block" }, role: "img", "aria-label": `FAITH (${u})` });
}
const Ld = { today: "mdi:calendar-today", meals: "mdi:silverware-fork-knife", shopping: "mdi:cart-outline", chores: "mdi:broom", home: "mdi:home-outline", approvals: "mdi:shield-check-outline" }, Id = (a) => a.split(/\s+/).map((u) => u[0]).join("").slice(0, 2).toUpperCase(), Un = ({ p: a, size: u = 40, ring: s }) => {
  const S = /* @__PURE__ */ f.jsx("span", { className: "avatar", style: { width: u, height: u, fontSize: u * 0.36, background: a.color || "var(--fc-accent)" }, children: Id(a.name) });
  return s ? /* @__PURE__ */ f.jsx("span", { className: "hexring", children: S }) : S;
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
  const u = (_) => _.split(/(\*\*[^*]+\*\*|__[^_]+__|\*[^*\s][^*]*\*|`[^`]+`)/g).map((z, T) => /^(\*\*|__).+\1$/.test(z) ? /* @__PURE__ */ f.jsx("b", { children: z.slice(2, -2) }, T) : /^\*.+\*$/.test(z) ? /* @__PURE__ */ f.jsx("i", { children: z.slice(1, -1) }, T) : /^`.+`$/.test(z) ? /* @__PURE__ */ f.jsx("code", { children: z.slice(1, -1) }, T) : z), s = [];
  let S = [];
  const N = () => {
    S.length && s.push(/* @__PURE__ */ f.jsx("ul", { className: "md-list", children: S }, `l${s.length}`)), S = [];
  };
  return a.split(`
`).forEach((_, z) => {
    const T = _.replace(/^#{1,6}\s+/, ""), g = T.match(/^\s*(?:[-*•]|\d+[.)])\s+(.*)$/);
    if (g) {
      S.push(/* @__PURE__ */ f.jsx("li", { children: u(g[1]) }, z));
      return;
    }
    N(), s.push(/* @__PURE__ */ f.jsxs("span", { className: "md-line", children: [
      u(T),
      `
`
    ] }, z));
  }), N(), /* @__PURE__ */ f.jsx(f.Fragment, { children: s });
}
const Dd = (a, u = /* @__PURE__ */ new Date()) => {
  if (!a || !/^\d{2}:\d{2}$/.test(a)) return !0;
  const [s, S] = a.split(":").map(Number);
  return s * 60 + S >= u.getHours() * 60 + u.getMinutes();
};
function Vl(a, u, s = {}, S = 6e4) {
  const [N, _] = q.useState(null), [z, T] = q.useState(""), g = q.useCallback(() => a.call(u, s).then((E) => {
    _(E), T("");
  }).catch((E) => T(E.message)), [a, u, JSON.stringify(s)]);
  return q.useEffect(() => {
    g();
    const E = setInterval(g, S), $ = (H) => {
      var J;
      const L = (J = H.detail) == null ? void 0 : J.screen;
      (!L || L === a.screen) && g();
    };
    return window.addEventListener("faith-hub-changed", $), () => {
      clearInterval(E), window.removeEventListener("faith-hub-changed", $);
    };
  }, [g, S]), { data: N, err: z, load: g };
}
function Fd({ api: a, items: u, can: s, onDone: S }) {
  const [N, _] = q.useState(""), z = (T, g) => a.call(`/api/ha/approvals/${T}`, { approve: g }).then((E) => {
    _(E.text), S();
  }).catch((E) => _(E.message));
  return /* @__PURE__ */ f.jsxs(f.Fragment, { children: [
    /* @__PURE__ */ f.jsx("ul", { children: u.map((T) => /* @__PURE__ */ f.jsxs("li", { className: "row", children: [
      /* @__PURE__ */ f.jsxs("div", { className: "grow", children: [
        /* @__PURE__ */ f.jsx("div", { children: T.summary }),
        /* @__PURE__ */ f.jsxs("div", { className: "meta", children: [
          "Asked by ",
          T.requested_by.replace(/^household on /, "the ")
        ] })
      ] }),
      s && /* @__PURE__ */ f.jsxs("div", { className: "btns", children: [
        /* @__PURE__ */ f.jsx("button", { className: "primary", "aria-label": `Approve: ${T.summary}`, onClick: () => z(T.id, !0), children: "Approve" }),
        /* @__PURE__ */ f.jsx("button", { "aria-label": `Deny: ${T.summary}`, onClick: () => z(T.id, !1), children: "Deny" })
      ] })
    ] }, T.id)) }),
    !s && /* @__PURE__ */ f.jsx("div", { className: "meta", children: "A grown-up approves these (signed in here, or on their phone)." }),
    /* @__PURE__ */ f.jsx("div", { className: "toast", role: "status", children: N })
  ] });
}
function Od({ c: a, api: u, can: s, reload: S }) {
  var T;
  const N = a.items ?? [];
  let _;
  a.error ? _ = /* @__PURE__ */ f.jsx("div", { className: "err", children: a.error }) : a.empty ? _ = /* @__PURE__ */ f.jsx("div", { className: "empty", children: a.empty }) : a.kind === "schedule" ? _ = /* @__PURE__ */ f.jsx("ul", { children: N.map((g, E) => /* @__PURE__ */ f.jsxs("li", { className: "row", children: [
    /* @__PURE__ */ f.jsx("span", { className: "time", children: zr(g.time) }),
    /* @__PURE__ */ f.jsxs("div", { className: "grow", children: [
      /* @__PURE__ */ f.jsx("div", { children: g.title }),
      g.meta && /* @__PURE__ */ f.jsx("div", { className: "meta", children: g.meta })
    ] })
  ] }, E)) }) : a.kind === "meals" ? _ = /* @__PURE__ */ f.jsx("ul", { children: N.map((g, E) => /* @__PURE__ */ f.jsxs("li", { className: "row", children: [
    /* @__PURE__ */ f.jsxs("span", { className: "label grow", children: [
      g.label,
      g.time && zr(g.time) !== "Today" ? ` · ${zr(g.time)}` : ""
    ] }),
    /* @__PURE__ */ f.jsx("span", { children: g.title })
  ] }, E)) }) : a.kind === "checklist" || a.kind === "list" ? _ = /* @__PURE__ */ f.jsx("ul", { children: N.map((g, E) => /* @__PURE__ */ f.jsxs("li", { className: "row", children: [
    a.kind === "checklist" && /* @__PURE__ */ f.jsx("span", { className: `check ${g.done ? "done" : ""}` }),
    /* @__PURE__ */ f.jsxs("span", { className: "grow", children: [
      g.label && /* @__PURE__ */ f.jsxs("span", { className: "label", children: [
        g.label,
        " "
      ] }),
      g.title
    ] }),
    (g.meta || g.time) && /* @__PURE__ */ f.jsx("span", { className: "meta", children: g.meta || zr(g.time) })
  ] }, E)) }) : a.kind === "entities" ? _ = /* @__PURE__ */ f.jsx("div", { className: "tiles", children: (a.entities ?? []).map((g) => /* @__PURE__ */ f.jsxs("div", { className: "tile", children: [
    /* @__PURE__ */ f.jsx("div", { className: "meta", children: g.name }),
    /* @__PURE__ */ f.jsx("div", { className: "v", children: g.state })
  ] }, g.entity_id)) }) : a.kind === "approvals" ? _ = /* @__PURE__ */ f.jsx(Fd, { api: u, items: a.approvals ?? [], can: s, onDone: S }) : _ = /* @__PURE__ */ f.jsx("div", { style: { whiteSpace: "pre-wrap" }, children: a.text });
  const z = a.kind === "checklist" ? N.length : a.kind === "approvals" ? (T = a.approvals) == null ? void 0 : T.length : void 0;
  return /* @__PURE__ */ f.jsxs("div", { className: "section", children: [
    /* @__PURE__ */ f.jsxs("h3", { children: [
      /* @__PURE__ */ f.jsx("ha-icon", { icon: Ld[a.id] || "mdi:note-text-outline" }),
      a.title,
      z ? /* @__PURE__ */ f.jsx("span", { className: "count", children: z }) : null
    ] }),
    _
  ] });
}
function Ad({ api: a, config: u }) {
  const { data: s, err: S, load: N } = Vl(a, "/api/ha/view", u.cards ? { cards: u.cards } : {});
  if (S) return /* @__PURE__ */ f.jsx("ha-card", { children: /* @__PURE__ */ f.jsx("div", { className: "err", children: S }) });
  if (!s) return /* @__PURE__ */ f.jsx("ha-card", { children: /* @__PURE__ */ f.jsx("div", { className: "empty", children: "Loading…" }) });
  const _ = s.person ? `${s.person.name}'s` : "The family's";
  return /* @__PURE__ */ f.jsxs("ha-card", { children: [
    u.title !== "" && /* @__PURE__ */ f.jsxs(f.Fragment, { children: [
      /* @__PURE__ */ f.jsx("div", { className: "eyebrow", children: (/* @__PURE__ */ new Date()).toLocaleDateString([], { weekday: "long", month: "long", day: "numeric" }) }),
      /* @__PURE__ */ f.jsx("div", { className: "hello", children: u.title ?? /* @__PURE__ */ f.jsxs(f.Fragment, { children: [
        _,
        " ",
        /* @__PURE__ */ f.jsx("em", { children: "day" }),
        ", at a glance."
      ] }) })
    ] }),
    u.show_apps !== !1 && s.apps.length > 0 && /* @__PURE__ */ f.jsx("div", { className: "section", children: /* @__PURE__ */ f.jsx("div", { className: "apps", children: s.apps.map((z) => /* @__PURE__ */ f.jsxs("a", { href: z.url, target: "_blank", rel: "noreferrer", children: [
      /* @__PURE__ */ f.jsx("span", { children: z.icon || "↗" }),
      z.name
    ] }, z.id)) }) }),
    s.cards.map((z) => /* @__PURE__ */ f.jsx(Od, { c: z, api: a, can: s.can_approve, reload: N }, z.id)),
    !s.cards.length && /* @__PURE__ */ f.jsx("div", { className: "empty", children: "Nothing to show yet." })
  ] });
}
const fc = (a) => a.call("/api/ha/hub/people");
function dc({ api: a, people: u, pick: s, onBack: S, onDone: N }) {
  const [_, z] = q.useState(""), [T, g] = q.useState(""), E = async (H) => {
    g("");
    try {
      const L = await a.call("/api/ha/hub/signin", H);
      Yo(a.screen, L.hub_session), N();
    } catch (L) {
      g(L.message), z("");
    }
  }, $ = (H) => z((L) => (L + H).slice(0, 8));
  return q.useEffect(() => {
    const H = (L) => {
      const J = L.composedPath()[0];
      if (!(J && /^(INPUT|TEXTAREA|SELECT)$/.test(J.tagName))) {
        if (/^[0-9]$/.test(L.key)) $(L.key);
        else if (L.key === "Backspace") z((b) => b.slice(0, -1));
        else if (L.key === "Enter")
          _.length >= 4 && E({ person: s.id, pin: _ });
        else if (L.key === "Escape") S();
        else return;
        L.preventDefault();
      }
    };
    return window.addEventListener("keydown", H), () => window.removeEventListener("keydown", H);
  }, [_, s.id]), /* @__PURE__ */ f.jsxs("div", { className: "pin", role: "group", "aria-label": `PIN for ${s.name}`, children: [
    /* @__PURE__ */ f.jsxs("div", { className: "head", style: { margin: 0 }, children: [
      /* @__PURE__ */ f.jsx(Un, { p: s, size: 44 }),
      /* @__PURE__ */ f.jsxs("h2", { children: [
        "Hi, ",
        s.name
      ] }),
      /* @__PURE__ */ f.jsx("button", { className: "ghost", style: { marginLeft: "auto" }, onClick: S, children: "Back" })
    ] }),
    (u == null ? void 0 : u.face_unlock) && u.suggested === s.id && /* @__PURE__ */ f.jsx("button", { className: "primary", onClick: () => E({ person: s.id, face: !0 }), children: "It's me (camera)" }),
    /* @__PURE__ */ f.jsx("div", { className: "dots", role: "status", "aria-label": `${_.length} digit${_.length === 1 ? "" : "s"} entered`, children: Array.from({ length: Math.max(4, _.length) }, (H, L) => /* @__PURE__ */ f.jsx("span", { className: L < _.length ? "on" : "" }, L)) }),
    /* @__PURE__ */ f.jsxs("div", { className: "keys", children: [
      ["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((H) => /* @__PURE__ */ f.jsx("button", { onClick: () => $(H), children: H }, H)),
      /* @__PURE__ */ f.jsx("button", { onClick: () => z(_.slice(0, -1)), "aria-label": "Delete", children: "⌫" }),
      /* @__PURE__ */ f.jsx("button", { onClick: () => $("0"), children: "0" }),
      /* @__PURE__ */ f.jsx("button", { className: "primary", disabled: _.length < 4, onClick: () => E({ person: s.id, pin: _ }), children: "OK" })
    ] }),
    /* @__PURE__ */ f.jsx("div", { className: "err", role: "alert", children: T })
  ] });
}
function pc(a, u) {
  var S;
  const s = q.useRef(0);
  q.useEffect(() => {
    if (!(u != null && u.hub)) return;
    const N = () => {
      Date.now() - s.current > 15e3 && (s.current = Date.now(), a.call("/api/ha/hub/activity").catch(() => {
      }));
    };
    return window.addEventListener("pointerdown", N, !0), () => window.removeEventListener("pointerdown", N, !0);
  }, [(S = u == null ? void 0 : u.hub) == null ? void 0 : S.person.id]), q.useEffect(() => {
    u && !u.hub && u.household && a.screen && oc(a.screen) && Yo(a.screen, null);
  }, [u]);
}
const hc = async (a) => {
  await a.call("/api/ha/hub/signout").catch(() => {
  }), Yo(a.screen, null);
};
function Ud({ api: a }) {
  const { data: u, err: s } = Vl(a, "/api/ha/view", { cards: [] }, 1e4), [S, N] = q.useState(null), [_, z] = q.useState(null), [T, g] = q.useState("");
  return pc(a, u), a.screen ? s ? /* @__PURE__ */ f.jsx("ha-card", { children: /* @__PURE__ */ f.jsx("div", { className: "err", children: s }) }) : u ? u.hub ? /* @__PURE__ */ f.jsx("ha-card", { children: /* @__PURE__ */ f.jsxs("div", { className: "head", children: [
    /* @__PURE__ */ f.jsx(Un, { p: u.hub.person, size: 44 }),
    /* @__PURE__ */ f.jsxs("div", { children: [
      /* @__PURE__ */ f.jsx("h2", { children: u.hub.person.name }),
      /* @__PURE__ */ f.jsxs("div", { className: "sub", children: [
        "Signed in on this screen",
        u.hub.remaining_seconds < 60 ? ` · signing out in ${u.hub.remaining_seconds}s` : ""
      ] })
    ] }),
    /* @__PURE__ */ f.jsx("div", { className: "right", children: /* @__PURE__ */ f.jsx("button", { onClick: () => hc(a), children: "Sign out" }) })
  ] }) }) : u.person ? /* @__PURE__ */ f.jsx("ha-card", { children: /* @__PURE__ */ f.jsxs("div", { className: "head", children: [
    /* @__PURE__ */ f.jsx(Un, { p: u.person, size: 44 }),
    /* @__PURE__ */ f.jsxs("div", { children: [
      /* @__PURE__ */ f.jsx("h2", { children: u.person.name }),
      /* @__PURE__ */ f.jsx("div", { className: "sub", children: "Your own Home Assistant account" })
    ] })
  ] }) }) : _ ? /* @__PURE__ */ f.jsx("ha-card", { children: /* @__PURE__ */ f.jsx(dc, { api: a, people: S, pick: _, onBack: () => z(null), onDone: () => {
    z(null), N(null);
  } }) }) : S ? /* @__PURE__ */ f.jsxs("ha-card", { children: [
    /* @__PURE__ */ f.jsxs("div", { className: "head", children: [
      /* @__PURE__ */ f.jsx("h2", { children: "Who's here?" }),
      /* @__PURE__ */ f.jsx("div", { className: "right", children: /* @__PURE__ */ f.jsx("button", { className: "ghost", onClick: () => N(null), children: "Cancel" }) })
    ] }),
    /* @__PURE__ */ f.jsx("div", { className: "people", children: S.people.map((E) => /* @__PURE__ */ f.jsxs("button", { className: `person ${S.suggested === E.id ? "suggested" : ""}`, onClick: () => z(E), children: [
      /* @__PURE__ */ f.jsx(Un, { p: E, size: 52 }),
      E.name
    ] }, E.id)) })
  ] }) : /* @__PURE__ */ f.jsxs("ha-card", { children: [
    /* @__PURE__ */ f.jsxs("div", { className: "head", children: [
      /* @__PURE__ */ f.jsx("ha-icon", { icon: "mdi:account-group-outline" }),
      /* @__PURE__ */ f.jsxs("div", { children: [
        /* @__PURE__ */ f.jsx("h2", { children: "Shared view" }),
        /* @__PURE__ */ f.jsx("div", { className: "sub", children: "Everyone sees the family's things. Sign in for your own." })
      ] }),
      /* @__PURE__ */ f.jsx("div", { className: "right", children: /* @__PURE__ */ f.jsx("button", { className: "primary", onClick: () => fc(a).then((E) => {
        N(E);
        const $ = E.people.find((H) => H.id === E.suggested);
        $ && z($);
      }).catch((E) => g(E.message)), children: "Sign in" }) })
    ] }),
    T && /* @__PURE__ */ f.jsx("div", { className: "err", children: T })
  ] }) : /* @__PURE__ */ f.jsx("ha-card", { children: /* @__PURE__ */ f.jsx("div", { className: "empty", children: "…" }) }) : /* @__PURE__ */ f.jsx("ha-card", { children: /* @__PURE__ */ f.jsxs("div", { className: "err", children: [
    "Give this card the screen it's on: ",
    /* @__PURE__ */ f.jsx("code", { children: "screen: kitchen" })
  ] }) });
}
const $d = [
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
], Hd = (a) => {
  var u;
  return ((u = $d.find(([s]) => s.test(a))) == null ? void 0 : u[1]) ?? a.replace(/_/g, " ");
};
let Bd;
const pn = () => Bd ?? (Bd = new AudioContext()), Vd = (a) => {
  const u = new Uint8Array(a.fftSize);
  a.getByteTimeDomainData(u);
  let s = 0;
  for (const S of u) s += ((S - 128) / 128) ** 2;
  return Math.min(1, Math.sqrt(s / u.length) * 4);
}, Wd = (a) => {
  let u = "";
  for (let s = 0; s < a.length; s += 32768) u += String.fromCharCode(...a.subarray(s, s + 32768));
  return btoa(u);
};
function mc(a, u) {
  const [s, S] = q.useState([]), [N, _] = q.useState(!1), [z, T] = q.useState(null), [g, E] = q.useState(!1), [$, H] = q.useState(0), L = q.useRef(null), J = q.useRef(null), b = q.useRef(null), ee = q.useCallback(() => {
    L.current = null, a.call("/api/ha/chat/history").then((re) => {
      L.current = re.conversation_id, S(re.messages.map((ue) => ({ me: ue.role === "user", text: ue.content })));
    }).catch(() => S([]));
  }, [a]);
  q.useEffect(() => {
    ee();
    const re = (ue) => {
      var K;
      ((K = ue.detail) == null ? void 0 : K.screen) === a.screen && ee();
    };
    return window.addEventListener("faith-hub-changed", re), () => window.removeEventListener("faith-hub-changed", re);
  }, [ee]);
  const [, le] = q.useState(0);
  q.useEffect(() => {
    if (!$) return;
    const re = setTimeout(() => le((ue) => ue + 1), 3100);
    return () => clearTimeout(re);
  }, [$]), q.useEffect(() => () => {
    var re;
    (re = b.current) == null || re.pause();
  }, []);
  const je = async (re) => {
    var ue;
    try {
      const K = await a.call("/api/ha/speak", { text: re });
      (ue = b.current) == null || ue.pause();
      const ie = new Audio(`data:${K.mime};base64,${K.audio}`), ne = pn().createAnalyser();
      ne.fftSize = 512, pn().createMediaElementSource(ie).connect(ne), ne.connect(pn().destination), b.current = ie, J.current = ne, E(!0);
      const ye = () => {
        b.current === ie && (J.current = null, E(!1));
      };
      ie.onended = ye, ie.onerror = ye, await pn().resume(), await ie.play();
    } catch {
      J.current = null, E(!1);
    }
  }, Le = async (re, ue) => {
    _(!0), S((K) => [...K, ...ue ? [{ me: !0, text: ue }] : [], { text: "…" }]);
    try {
      const K = await a.call("/api/ha/chat", { ...re, conversation_id: L.current });
      L.current = K.conversation_id, S((ie) => [
        ...ie.slice(0, -1),
        ...K.heard ? [{ me: !0, text: K.heard + (K.speaker ? ` (${K.speaker.name})` : "") }] : [],
        ...K.confirms.map((ne) => ({ text: "", confirm: ne })),
        ...K.approvals.map((ne) => ({ text: "", waiting: ne.summary })),
        { text: K.text, tools: K.tools }
      ]), H(Date.now()), u && K.text && je(K.text);
    } catch (K) {
      S((ie) => [...ie.slice(0, -1), { text: `Sorry, that didn't work: ${K.message}` }]);
    } finally {
      _(!1);
    }
  }, Pe = async () => {
    var re;
    if (z) {
      z.stop(), T(null);
      return;
    }
    (re = b.current) == null || re.pause(), J.current = null, E(!1);
    try {
      const ue = await navigator.mediaDevices.getUserMedia({ audio: !0 }), K = new MediaRecorder(ue), ie = [];
      try {
        const ne = pn().createAnalyser();
        ne.fftSize = 512, pn().createMediaStreamSource(ue).connect(ne), J.current = ne, pn().resume();
      } catch {
      }
      K.ondataavailable = (ne) => ne.data.size && ie.push(ne.data), K.onstop = async () => {
        ue.getTracks().forEach((ye) => ye.stop()), J.current = null;
        const ne = new Blob(ie, { type: K.mimeType || "audio/webm" });
        Le({ audio: Wd(new Uint8Array(await ne.arrayBuffer())), mime: ne.type.split(";")[0] }, "");
      }, K.start(), T(K);
    } catch {
      S((ue) => [...ue, { text: "The microphone isn't available (Home Assistant needs https for it)." }]);
    }
  }, he = (re, ue) => a.call(`/api/ha/confirm/${re}`, { approve: ue }).then((K) => S((ie) => ie.map((ne) => {
    var ye;
    return ((ye = ne.confirm) == null ? void 0 : ye.id) === re ? { ...ne, confirm: { ...ne.confirm, done: K.text } } : ne;
  }))).catch((K) => S((ie) => [...ie, { text: K.message }])), Te = q.useCallback(() => J.current ? Vd(J.current) : void 0, []), B = z ? "listening" : N ? "thinking" : g || !u && Date.now() - $ < 3e3 ? "speaking" : "idle";
  return { lines: s, busy: N, rec: z, state: B, level: Te, send: Le, mic: Pe, answer: he, fresh: () => {
    L.current = null, S([]);
  } };
}
function vc({ l: a, answer: u }) {
  return a.confirm ? /* @__PURE__ */ f.jsxs("div", { className: "box", children: [
    /* @__PURE__ */ f.jsxs("div", { children: [
      "Do this? ",
      /* @__PURE__ */ f.jsx("b", { children: a.confirm.summary })
    ] }),
    a.confirm.done ? /* @__PURE__ */ f.jsx("div", { className: "meta", children: a.confirm.done }) : /* @__PURE__ */ f.jsxs("div", { className: "btns", children: [
      /* @__PURE__ */ f.jsx("button", { className: "primary", onClick: () => u(a.confirm.id, !0), children: "Yes" }),
      /* @__PURE__ */ f.jsx("button", { onClick: () => u(a.confirm.id, !1), children: "No" })
    ] })
  ] }) : /* @__PURE__ */ f.jsx("div", { className: "box wait", children: /* @__PURE__ */ f.jsxs("div", { children: [
    "Waiting for a grown-up: ",
    /* @__PURE__ */ f.jsx("b", { children: a.waiting })
  ] }) });
}
function gc({ c: a, placeholder: u = "Ask FAITH" }) {
  const [s, S] = q.useState("");
  return /* @__PURE__ */ f.jsxs("form", { className: "ask", onSubmit: (N) => {
    N.preventDefault();
    const _ = s.trim();
    _ && !a.busy && (S(""), a.send({ text: _ }, _));
  }, children: [
    /* @__PURE__ */ f.jsx("button", { type: "button", className: a.rec ? "rec" : "", title: a.rec ? "Stop and send" : "Talk", "aria-label": a.rec ? "Stop recording and send" : "Talk to FAITH", "aria-pressed": !!a.rec, disabled: a.busy, onClick: a.mic, children: /* @__PURE__ */ f.jsx("ha-icon", { icon: a.rec ? "mdi:stop" : "mdi:microphone" }) }),
    /* @__PURE__ */ f.jsx("input", { value: s, onChange: (N) => S(N.target.value), "aria-label": "Message to FAITH", placeholder: a.rec ? "Listening… tap stop when done" : u }),
    /* @__PURE__ */ f.jsx("button", { className: "primary", type: "submit", disabled: a.busy || !s.trim(), title: "Send", "aria-label": "Send", children: /* @__PURE__ */ f.jsx("ha-icon", { icon: "mdi:send" }) })
  ] });
}
function Qd({ api: a, config: u }) {
  const s = mc(a, u.speak === !0), S = q.useRef(null);
  return q.useEffect(() => {
    var N;
    (N = S.current) == null || N.scrollIntoView({ block: "nearest" });
  }, [s.lines]), /* @__PURE__ */ f.jsxs("ha-card", { children: [
    /* @__PURE__ */ f.jsxs("div", { className: "head", children: [
      /* @__PURE__ */ f.jsx(ac, { className: "emblem", size: 56, tone: a.dark ? "dark" : "light", state: s.state, level: s.level }),
      /* @__PURE__ */ f.jsx("h2", { children: u.title ?? "Ask FAITH" }),
      s.lines.length > 0 && /* @__PURE__ */ f.jsx("div", { className: "right", children: /* @__PURE__ */ f.jsx("button", { className: "ghost", onClick: s.fresh, children: "New" }) })
    ] }),
    /* @__PURE__ */ f.jsxs("div", { className: "chat", role: "log", "aria-live": "polite", "aria-label": "Conversation with FAITH", children: [
      !s.lines.length && /* @__PURE__ */ f.jsx("div", { className: "empty", children: "What's on today? What's for dinner? Add milk to the list. Turn off the lights." }),
      s.lines.map((N, _) => {
        var z;
        return N.confirm || N.waiting ? /* @__PURE__ */ f.jsx(vc, { l: N, answer: s.answer }, _) : /* @__PURE__ */ f.jsxs("div", { style: { display: "flex", flexDirection: "column", gap: 4, alignItems: N.me ? "flex-end" : "flex-start" }, children: [
          /* @__PURE__ */ f.jsx("div", { className: `msg ${N.me ? "me" : "faith"}`, children: N.me ? N.text : /* @__PURE__ */ f.jsx(cc, { text: N.text }) }),
          !!((z = N.tools) != null && z.length) && /* @__PURE__ */ f.jsx("div", { className: "chips", children: [...new Set(N.tools.map(Hd))].map((T) => /* @__PURE__ */ f.jsx("span", { className: "chip", children: T }, T)) })
        ] }, _);
      }),
      /* @__PURE__ */ f.jsx("div", { ref: S })
    ] }),
    /* @__PURE__ */ f.jsx(gc, { c: s })
  ] });
}
const Kd = (a) => a.getHours() < 5 ? "Good night" : a.getHours() < 12 ? "Good morning" : a.getHours() < 18 ? "Good afternoon" : "Good evening";
function Gd({ api: a, config: u }) {
  var he, Te;
  const { data: s, err: S, load: N } = Vl(a, "/api/ha/view", { cards: u.cards ?? ["today"] }, 3e4), _ = mc(a, u.speak !== !1), [z, T] = q.useState(/* @__PURE__ */ new Date()), [g, E] = q.useState(null), [$, H] = q.useState(null);
  q.useEffect(() => {
    const B = setInterval(() => T(/* @__PURE__ */ new Date()), 1e4);
    return () => clearInterval(B);
  }, []), pc(a, s);
  const L = !!a.screen && !!s && !s.person;
  if (q.useEffect(() => {
    L && (s != null && s.can_sign_in) && fc(a).then(E).catch(() => {
    });
  }, [L, s == null ? void 0 : s.can_sign_in, (he = s == null ? void 0 : s.hub) == null ? void 0 : he.person.id]), S) return /* @__PURE__ */ f.jsx("ha-card", { class: "hub", children: /* @__PURE__ */ f.jsx("div", { className: "err", children: S }) });
  const J = ((Te = s == null ? void 0 : s.hub) == null ? void 0 : Te.person) ?? (s == null ? void 0 : s.person) ?? null, b = [..._.lines].reverse().find((B) => !B.me && !B.confirm && !B.waiting), ee = [..._.lines].reverse().find((B) => B.me), le = _.lines.filter((B) => B.confirm && !B.confirm.done || B.waiting).slice(-2), je = s == null ? void 0 : s.cards.flatMap((B) => B.kind === "schedule" ? B.items ?? [] : []).find((B) => !B.done && Dd(B.time, z)), Le = Number(u.size) || 300, Pe = _.rec ? "Listening… tap FAITH to send" : _.busy ? "Thinking…" : _.state === "speaking" ? "" : "Tap FAITH to talk";
  return /* @__PURE__ */ f.jsxs("ha-card", { class: "hub", children: [
    /* @__PURE__ */ f.jsxs("div", { className: "hub-top", children: [
      /* @__PURE__ */ f.jsxs("div", { children: [
        /* @__PURE__ */ f.jsx("div", { className: "clock", children: z.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }) }),
        /* @__PURE__ */ f.jsx("div", { className: "eyebrow", children: z.toLocaleDateString([], { weekday: "long", month: "long", day: "numeric" }) })
      ] }),
      /* @__PURE__ */ f.jsxs("div", { className: "right", children: [
        !!(s != null && s.pending_approvals) && /* @__PURE__ */ f.jsxs("span", { className: "pill", children: [
          s.pending_approvals,
          " waiting for approval"
        ] }),
        (s == null ? void 0 : s.hub) && /* @__PURE__ */ f.jsxs("button", { onClick: () => hc(a).then(N), children: [
          "Sign out ",
          s.hub.person.name
        ] })
      ] })
    ] }),
    /* @__PURE__ */ f.jsxs("div", { className: "hub-mid", children: [
      /* @__PURE__ */ f.jsxs("div", { className: "hello", children: [
        Kd(z),
        ", ",
        /* @__PURE__ */ f.jsx("em", { children: J ? J.name : "everyone" }),
        "."
      ] }),
      je && /* @__PURE__ */ f.jsxs("div", { className: "meta", children: [
        "Next: ",
        zr(je.time),
        " ",
        je.title
      ] }),
      /* @__PURE__ */ f.jsx("button", { className: "orb", onClick: _.mic, disabled: _.busy, "aria-label": _.rec ? "Stop and send" : "Talk to FAITH", children: /* @__PURE__ */ f.jsx(ac, { size: Le, tone: a.dark ? "dark" : "light", state: _.state, level: _.level }) }),
      Pe && /* @__PURE__ */ f.jsx("div", { className: "hint", children: Pe }),
      ee && !_.rec && /* @__PURE__ */ f.jsxs("div", { className: "heard", children: [
        "“",
        ee.text,
        "”"
      ] }),
      /* @__PURE__ */ f.jsx("div", { "aria-live": "polite", children: b && b.text !== "…" && /* @__PURE__ */ f.jsx("div", { className: "reply", children: /* @__PURE__ */ f.jsx(cc, { text: b.text }) }) }),
      le.map((B, ce) => /* @__PURE__ */ f.jsx(vc, { l: B, answer: _.answer }, ce))
    ] }),
    u.show_input !== !1 && /* @__PURE__ */ f.jsx(gc, { c: _, placeholder: "Or type to FAITH" }),
    L && g && !(s != null && s.hub) && /* @__PURE__ */ f.jsx("div", { className: "faces", children: g.people.map((B) => /* @__PURE__ */ f.jsxs("button", { className: `face ${g.suggested === B.id ? "on" : ""}`, onClick: () => H(B), children: [
      /* @__PURE__ */ f.jsx(Un, { p: B, size: 56, ring: g.suggested === B.id }),
      B.name
    ] }, B.id)) }),
    $ && /* @__PURE__ */ f.jsx("div", { className: "overlay", children: /* @__PURE__ */ f.jsx(dc, { api: a, people: g, pick: $, onBack: () => H(null), onDone: () => {
      H(null), N();
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
function Yd({ api: a, config: u }) {
  const { data: s, err: S, load: N } = Vl(a, "/api/ha/rewards"), [_, z] = q.useState(""), T = (E, $, H) => a.call(E, { args: $ }).then((L) => {
    z(L.approval ? `${H} A grown-up will approve it.` : H), N();
  }).catch((L) => z(L.message));
  if (S) return /* @__PURE__ */ f.jsx("ha-card", { children: /* @__PURE__ */ f.jsx("div", { className: "err", children: S }) });
  if (!s) return /* @__PURE__ */ f.jsx("ha-card", { children: /* @__PURE__ */ f.jsx("div", { className: "empty", children: "Loading…" }) });
  const g = (E) => `${E} pt${E === 1 ? "" : "s"}`;
  return /* @__PURE__ */ f.jsxs("ha-card", { children: [
    /* @__PURE__ */ f.jsxs("div", { className: "head", children: [
      /* @__PURE__ */ f.jsx("ha-icon", { icon: "mdi:star-circle-outline" }),
      /* @__PURE__ */ f.jsx("h2", { children: u.title ?? "Points & rewards" })
    ] }),
    s.me ? /* @__PURE__ */ f.jsxs(f.Fragment, { children: [
      /* @__PURE__ */ f.jsxs("div", { className: "section mine", children: [
        /* @__PURE__ */ f.jsxs("div", { className: "honey", children: [
          /* @__PURE__ */ f.jsx("span", { className: "big", children: s.me.points }),
          /* @__PURE__ */ f.jsx("span", { className: "label", children: "points" })
        ] }),
        /* @__PURE__ */ f.jsxs("div", { children: [
          /* @__PURE__ */ f.jsxs("div", { className: "eyebrow", children: [
            s.me.name,
            "'s points"
          ] }),
          /* @__PURE__ */ f.jsx("div", { className: "meta", children: "Do jobs, ask a grown-up, and spend them on rewards." }),
          s.me.card && /* @__PURE__ */ f.jsxs("div", { className: "cardbal", children: [
            /* @__PURE__ */ f.jsx("ha-icon", { icon: "mdi:credit-card-outline" }),
            "My card: ",
            /* @__PURE__ */ f.jsx("b", { children: rc(s.me.card) })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ f.jsxs("div", { className: "section", children: [
        /* @__PURE__ */ f.jsx("h3", { children: "Jobs" }),
        /* @__PURE__ */ f.jsx("ul", { children: s.activities.filter((E) => E.kids_can_claim).map((E) => /* @__PURE__ */ f.jsxs("li", { className: "row", children: [
          /* @__PURE__ */ f.jsx("span", { className: "grow", children: E.name }),
          /* @__PURE__ */ f.jsxs("span", { className: "pill", children: [
            "+",
            g(E.points)
          ] }),
          /* @__PURE__ */ f.jsx("button", { onClick: () => T("/api/ha/rewards/claim", { activity: E.id }, `Asked for ${g(E.points)} for "${E.name}".`), children: "I did it" })
        ] }, E.id)) })
      ] }),
      /* @__PURE__ */ f.jsxs("div", { className: "section", children: [
        /* @__PURE__ */ f.jsx("h3", { children: "Rewards" }),
        /* @__PURE__ */ f.jsx("ul", { children: s.rewards.map((E) => /* @__PURE__ */ f.jsxs("li", { className: "row", children: [
          /* @__PURE__ */ f.jsxs("span", { className: "grow", children: [
            E.name,
            E.kind === "money" && E.amount && s.me.card && !/card/i.test(E.name) ? /* @__PURE__ */ f.jsx("span", { className: "meta", children: " · onto your card" }) : null
          ] }),
          /* @__PURE__ */ f.jsx("span", { className: "pill", children: g(E.cost) }),
          /* @__PURE__ */ f.jsx("button", { className: "primary", disabled: s.me.points < E.cost, onClick: () => T("/api/ha/rewards/redeem", { reward: E.id }, `Asked for "${E.name}".`), children: "Get it" })
        ] }, E.id)) })
      ] })
    ] }) : /* @__PURE__ */ f.jsxs(f.Fragment, { children: [
      !s.kids.length && /* @__PURE__ */ f.jsx("div", { className: "empty", children: "No children in FAITH's family list yet." }),
      /* @__PURE__ */ f.jsx("ul", { children: s.kids.map((E) => /* @__PURE__ */ f.jsxs("li", { className: "row", children: [
        /* @__PURE__ */ f.jsx(Un, { p: E, size: 34 }),
        /* @__PURE__ */ f.jsxs("span", { className: "grow", children: [
          E.name,
          E.card && /* @__PURE__ */ f.jsxs("span", { className: "meta", children: [
            " · card ",
            rc(E.card)
          ] })
        ] }),
        /* @__PURE__ */ f.jsx("span", { className: "pill", children: g(E.points) }),
        s.can_give && /* @__PURE__ */ f.jsx("div", { className: "btns", children: s.allowed_points.map(($) => /* @__PURE__ */ f.jsxs("button", { "aria-label": `Give ${E.name} ${g($)}`, onClick: () => T("/api/ha/rewards/award", { person: E.id, points: $, reason: "Well done (from the dashboard)" }, `Gave ${E.name} ${g($)}.`), children: [
          "+",
          $
        ] }, $)) })
      ] }, E.id)) }),
      !s.can_give && s.kids.length > 0 && /* @__PURE__ */ f.jsx("div", { className: "meta", children: "Sign in to give points." })
    ] }),
    /* @__PURE__ */ f.jsx("div", { className: "toast", role: "status", children: _ })
  ] });
}
function jr(a, u, s, S, N) {
  if (customElements.get(a)) return;
  class _ extends HTMLElement {
    constructor() {
      super(...arguments);
      $e(this, "_hass");
      $e(this, "_config");
      $e(this, "_root");
      $e(this, "_api");
    }
    setConfig(g) {
      this._config = { ...g }, this._api = void 0, this.render();
    }
    set hass(g) {
      const E = !this._hass;
      this._hass = g, E && this.render();
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
          const g = this.shadowRoot ?? this.attachShadow({ mode: "open" }), E = document.createElement("style");
          E.textContent = Cd, g.appendChild(E);
          const $ = document.createElement("div");
          g.appendChild($), this._root = _d.createRoot($);
        }
        this._api ?? (this._api = jd(() => this._hass, this._config)), this._root.render(/* @__PURE__ */ f.jsx(S, { api: this._api, config: this._config }));
      }
    }
  }
  customElements.define(a, _), (window.customCards ?? (window.customCards = [])).push({ type: a, name: u, description: s, preview: !1 });
}
let lc = !1;
function Wo() {
  if (!lc) {
    lc = !0, jr("faith-card", "FAITH", "The family's day from FAITH: today, meals, shopping, chores, the house and approvals, for whoever is looking.", Ad, 6), jr("faith-who-card", "FAITH: who's here", "For a shared tablet: shows who is signed in, and lets a person sign in with their PIN.", Ud, 2), jr("faith-chat-card", "FAITH: chat", "Talk or type to FAITH.", Qd, 6), jr("faith-hub-card", "FAITH: hub", "The wall screen: FAITH in the middle (tap to talk, answers out loud), the time, and who's here.", Gd, 9), jr("faith-rewards-card", "FAITH: points & rewards", "Children's points, jobs to claim and rewards; parents give points.", Yd, 4);
    for (const a of [0, 500, 2e3, 6e3]) setTimeout(Xd, a);
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
function Xd() {
  const a = [], u = (s) => s.querySelectorAll("*").forEach((S) => {
    var N;
    if (S.tagName === "HUI-ERROR-CARD") {
      const _ = S._config ?? S.config ?? {};
      /faith-[a-z-]*card/.test(`${((N = _.origConfig) == null ? void 0 : N.type) ?? ""} ${_.message ?? ""} ${_.error ?? ""}`) && a.push(S);
    }
    S.shadowRoot && u(S.shadowRoot);
  });
  u(document);
  for (const s of a) s.dispatchEvent(new CustomEvent("ll-rebuild", { bubbles: !0, composed: !0 }));
  return a.length;
}
