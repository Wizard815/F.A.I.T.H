var cd = Object.defineProperty;
var fd = (c, u, s) => u in c ? cd(c, u, { enumerable: !0, configurable: !0, writable: !0, value: s }) : c[u] = s;
var He = (c, u, s) => fd(c, typeof u != "symbol" ? u + "" : u, s);
var Ao = { exports: {} }, Nr = {}, Uo = { exports: {} }, te = {};
/**
 * @license React
 * react.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var Ba;
function dd() {
  if (Ba) return te;
  Ba = 1;
  var c = Symbol.for("react.element"), u = Symbol.for("react.portal"), s = Symbol.for("react.fragment"), C = Symbol.for("react.strict_mode"), E = Symbol.for("react.profiler"), z = Symbol.for("react.provider"), T = Symbol.for("react.context"), R = Symbol.for("react.forward_ref"), g = Symbol.for("react.suspense"), S = Symbol.for("react.memo"), H = Symbol.for("react.lazy"), W = Symbol.iterator;
  function I(f) {
    return f === null || typeof f != "object" ? null : (f = W && f[W] || f["@@iterator"], typeof f == "function" ? f : null);
  }
  var b = { isMounted: function() {
    return !1;
  }, enqueueForceUpdate: function() {
  }, enqueueReplaceState: function() {
  }, enqueueSetState: function() {
  } }, ee = Object.assign, J = {};
  function le(f, w, D) {
    this.props = f, this.context = w, this.refs = J, this.updater = D || b;
  }
  le.prototype.isReactComponent = {}, le.prototype.setState = function(f, w) {
    if (typeof f != "object" && typeof f != "function" && f != null) throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");
    this.updater.enqueueSetState(this, f, w, "setState");
  }, le.prototype.forceUpdate = function(f) {
    this.updater.enqueueForceUpdate(this, f, "forceUpdate");
  };
  function je() {
  }
  je.prototype = le.prototype;
  function Me(f, w, D) {
    this.props = f, this.context = w, this.refs = J, this.updater = D || b;
  }
  var Pe = Me.prototype = new je();
  Pe.constructor = Me, ee(Pe, le.prototype), Pe.isPureReactComponent = !0;
  var he = Array.isArray, Te = Object.prototype.hasOwnProperty, $ = { current: null }, ce = { key: !0, ref: !0, __self: !0, __source: !0 };
  function re(f, w, D) {
    var Q, Z = {}, X = null, se = null;
    if (w != null) for (Q in w.ref !== void 0 && (se = w.ref), w.key !== void 0 && (X = "" + w.key), w) Te.call(w, Q) && !ce.hasOwnProperty(Q) && (Z[Q] = w[Q]);
    var G = arguments.length - 2;
    if (G === 1) Z.children = D;
    else if (1 < G) {
      for (var oe = Array(G), Ee = 0; Ee < G; Ee++) oe[Ee] = arguments[Ee + 2];
      Z.children = oe;
    }
    if (f && f.defaultProps) for (Q in G = f.defaultProps, G) Z[Q] === void 0 && (Z[Q] = G[Q]);
    return { $$typeof: c, type: f, key: X, ref: se, props: Z, _owner: $.current };
  }
  function ue(f, w) {
    return { $$typeof: c, type: f.type, key: w, ref: f.ref, props: f.props, _owner: f._owner };
  }
  function K(f) {
    return typeof f == "object" && f !== null && f.$$typeof === c;
  }
  function ie(f) {
    var w = { "=": "=0", ":": "=2" };
    return "$" + f.replace(/[=:]/g, function(D) {
      return w[D];
    });
  }
  var ne = /\/+/g;
  function ye(f, w) {
    return typeof f == "object" && f !== null && f.key != null ? ie("" + f.key) : w.toString(36);
  }
  function Ge(f, w, D, Q, Z) {
    var X = typeof f;
    (X === "undefined" || X === "boolean") && (f = null);
    var se = !1;
    if (f === null) se = !0;
    else switch (X) {
      case "string":
      case "number":
        se = !0;
        break;
      case "object":
        switch (f.$$typeof) {
          case c:
          case u:
            se = !0;
        }
    }
    if (se) return se = f, Z = Z(se), f = Q === "" ? "." + ye(se, 0) : Q, he(Z) ? (D = "", f != null && (D = f.replace(ne, "$&/") + "/"), Ge(Z, w, D, "", function(Ee) {
      return Ee;
    })) : Z != null && (K(Z) && (Z = ue(Z, D + (!Z.key || se && se.key === Z.key ? "" : ("" + Z.key).replace(ne, "$&/") + "/") + f)), w.push(Z)), 1;
    if (se = 0, Q = Q === "" ? "." : Q + ":", he(f)) for (var G = 0; G < f.length; G++) {
      X = f[G];
      var oe = Q + ye(X, G);
      se += Ge(X, w, D, oe, Z);
    }
    else if (oe = I(f), typeof oe == "function") for (f = oe.call(f), G = 0; !(X = f.next()).done; ) X = X.value, oe = Q + ye(X, G++), se += Ge(X, w, D, oe, Z);
    else if (X === "object") throw w = String(f), Error("Objects are not valid as a React child (found: " + (w === "[object Object]" ? "object with keys {" + Object.keys(f).join(", ") + "}" : w) + "). If you meant to render a collection of children, use an array instead.");
    return se;
  }
  function Ye(f, w, D) {
    if (f == null) return f;
    var Q = [], Z = 0;
    return Ge(f, Q, "", "", function(X) {
      return w.call(D, X, Z++);
    }), Q;
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
  var xe = { current: null }, L = { transition: null }, x = { ReactCurrentDispatcher: xe, ReactCurrentBatchConfig: L, ReactCurrentOwner: $ };
  function k() {
    throw Error("act(...) is not supported in production builds of React.");
  }
  return te.Children = { map: Ye, forEach: function(f, w, D) {
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
    if (!K(f)) throw Error("React.Children.only expected to receive a single React element child.");
    return f;
  } }, te.Component = le, te.Fragment = s, te.Profiler = E, te.PureComponent = Me, te.StrictMode = C, te.Suspense = g, te.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = x, te.act = k, te.cloneElement = function(f, w, D) {
    if (f == null) throw Error("React.cloneElement(...): The argument must be a React element, but you passed " + f + ".");
    var Q = ee({}, f.props), Z = f.key, X = f.ref, se = f._owner;
    if (w != null) {
      if (w.ref !== void 0 && (X = w.ref, se = $.current), w.key !== void 0 && (Z = "" + w.key), f.type && f.type.defaultProps) var G = f.type.defaultProps;
      for (oe in w) Te.call(w, oe) && !ce.hasOwnProperty(oe) && (Q[oe] = w[oe] === void 0 && G !== void 0 ? G[oe] : w[oe]);
    }
    var oe = arguments.length - 2;
    if (oe === 1) Q.children = D;
    else if (1 < oe) {
      G = Array(oe);
      for (var Ee = 0; Ee < oe; Ee++) G[Ee] = arguments[Ee + 2];
      Q.children = G;
    }
    return { $$typeof: c, type: f.type, key: Z, ref: X, props: Q, _owner: se };
  }, te.createContext = function(f) {
    return f = { $$typeof: T, _currentValue: f, _currentValue2: f, _threadCount: 0, Provider: null, Consumer: null, _defaultValue: null, _globalName: null }, f.Provider = { $$typeof: z, _context: f }, f.Consumer = f;
  }, te.createElement = re, te.createFactory = function(f) {
    var w = re.bind(null, f);
    return w.type = f, w;
  }, te.createRef = function() {
    return { current: null };
  }, te.forwardRef = function(f) {
    return { $$typeof: R, render: f };
  }, te.isValidElement = K, te.lazy = function(f) {
    return { $$typeof: H, _payload: { _status: -1, _result: f }, _init: Ie };
  }, te.memo = function(f, w) {
    return { $$typeof: S, type: f, compare: w === void 0 ? null : w };
  }, te.startTransition = function(f) {
    var w = L.transition;
    L.transition = {};
    try {
      f();
    } finally {
      L.transition = w;
    }
  }, te.unstable_act = k, te.useCallback = function(f, w) {
    return xe.current.useCallback(f, w);
  }, te.useContext = function(f) {
    return xe.current.useContext(f);
  }, te.useDebugValue = function() {
  }, te.useDeferredValue = function(f) {
    return xe.current.useDeferredValue(f);
  }, te.useEffect = function(f, w) {
    return xe.current.useEffect(f, w);
  }, te.useId = function() {
    return xe.current.useId();
  }, te.useImperativeHandle = function(f, w, D) {
    return xe.current.useImperativeHandle(f, w, D);
  }, te.useInsertionEffect = function(f, w) {
    return xe.current.useInsertionEffect(f, w);
  }, te.useLayoutEffect = function(f, w) {
    return xe.current.useLayoutEffect(f, w);
  }, te.useMemo = function(f, w) {
    return xe.current.useMemo(f, w);
  }, te.useReducer = function(f, w, D) {
    return xe.current.useReducer(f, w, D);
  }, te.useRef = function(f) {
    return xe.current.useRef(f);
  }, te.useState = function(f) {
    return xe.current.useState(f);
  }, te.useSyncExternalStore = function(f, w, D) {
    return xe.current.useSyncExternalStore(f, w, D);
  }, te.useTransition = function() {
    return xe.current.useTransition();
  }, te.version = "18.3.1", te;
}
var Va;
function Ko() {
  return Va || (Va = 1, Uo.exports = dd()), Uo.exports;
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
var Wa;
function pd() {
  if (Wa) return Nr;
  Wa = 1;
  var c = Ko(), u = Symbol.for("react.element"), s = Symbol.for("react.fragment"), C = Object.prototype.hasOwnProperty, E = c.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner, z = { key: !0, ref: !0, __self: !0, __source: !0 };
  function T(R, g, S) {
    var H, W = {}, I = null, b = null;
    S !== void 0 && (I = "" + S), g.key !== void 0 && (I = "" + g.key), g.ref !== void 0 && (b = g.ref);
    for (H in g) C.call(g, H) && !z.hasOwnProperty(H) && (W[H] = g[H]);
    if (R && R.defaultProps) for (H in g = R.defaultProps, g) W[H] === void 0 && (W[H] = g[H]);
    return { $$typeof: u, type: R, key: I, ref: b, props: W, _owner: E.current };
  }
  return Nr.Fragment = s, Nr.jsx = T, Nr.jsxs = T, Nr;
}
var Qa;
function hd() {
  return Qa || (Qa = 1, Ao.exports = pd()), Ao.exports;
}
var d = hd(), q = Ko(), $l = {}, Ho = { exports: {} }, et = {}, $o = { exports: {} }, Bo = {};
/**
 * @license React
 * scheduler.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var Ka;
function md() {
  return Ka || (Ka = 1, (function(c) {
    function u(L, x) {
      var k = L.length;
      L.push(x);
      e: for (; 0 < k; ) {
        var f = k - 1 >>> 1, w = L[f];
        if (0 < E(w, x)) L[f] = x, L[k] = w, k = f;
        else break e;
      }
    }
    function s(L) {
      return L.length === 0 ? null : L[0];
    }
    function C(L) {
      if (L.length === 0) return null;
      var x = L[0], k = L.pop();
      if (k !== x) {
        L[0] = k;
        e: for (var f = 0, w = L.length, D = w >>> 1; f < D; ) {
          var Q = 2 * (f + 1) - 1, Z = L[Q], X = Q + 1, se = L[X];
          if (0 > E(Z, k)) X < w && 0 > E(se, Z) ? (L[f] = se, L[X] = k, f = X) : (L[f] = Z, L[Q] = k, f = Q);
          else if (X < w && 0 > E(se, k)) L[f] = se, L[X] = k, f = X;
          else break e;
        }
      }
      return x;
    }
    function E(L, x) {
      var k = L.sortIndex - x.sortIndex;
      return k !== 0 ? k : L.id - x.id;
    }
    if (typeof performance == "object" && typeof performance.now == "function") {
      var z = performance;
      c.unstable_now = function() {
        return z.now();
      };
    } else {
      var T = Date, R = T.now();
      c.unstable_now = function() {
        return T.now() - R;
      };
    }
    var g = [], S = [], H = 1, W = null, I = 3, b = !1, ee = !1, J = !1, le = typeof setTimeout == "function" ? setTimeout : null, je = typeof clearTimeout == "function" ? clearTimeout : null, Me = typeof setImmediate < "u" ? setImmediate : null;
    typeof navigator < "u" && navigator.scheduling !== void 0 && navigator.scheduling.isInputPending !== void 0 && navigator.scheduling.isInputPending.bind(navigator.scheduling);
    function Pe(L) {
      for (var x = s(S); x !== null; ) {
        if (x.callback === null) C(S);
        else if (x.startTime <= L) C(S), x.sortIndex = x.expirationTime, u(g, x);
        else break;
        x = s(S);
      }
    }
    function he(L) {
      if (J = !1, Pe(L), !ee) if (s(g) !== null) ee = !0, Ie(Te);
      else {
        var x = s(S);
        x !== null && xe(he, x.startTime - L);
      }
    }
    function Te(L, x) {
      ee = !1, J && (J = !1, je(re), re = -1), b = !0;
      var k = I;
      try {
        for (Pe(x), W = s(g); W !== null && (!(W.expirationTime > x) || L && !ie()); ) {
          var f = W.callback;
          if (typeof f == "function") {
            W.callback = null, I = W.priorityLevel;
            var w = f(W.expirationTime <= x);
            x = c.unstable_now(), typeof w == "function" ? W.callback = w : W === s(g) && C(g), Pe(x);
          } else C(g);
          W = s(g);
        }
        if (W !== null) var D = !0;
        else {
          var Q = s(S);
          Q !== null && xe(he, Q.startTime - x), D = !1;
        }
        return D;
      } finally {
        W = null, I = k, b = !1;
      }
    }
    var $ = !1, ce = null, re = -1, ue = 5, K = -1;
    function ie() {
      return !(c.unstable_now() - K < ue);
    }
    function ne() {
      if (ce !== null) {
        var L = c.unstable_now();
        K = L;
        var x = !0;
        try {
          x = ce(!0, L);
        } finally {
          x ? ye() : ($ = !1, ce = null);
        }
      } else $ = !1;
    }
    var ye;
    if (typeof Me == "function") ye = function() {
      Me(ne);
    };
    else if (typeof MessageChannel < "u") {
      var Ge = new MessageChannel(), Ye = Ge.port2;
      Ge.port1.onmessage = ne, ye = function() {
        Ye.postMessage(null);
      };
    } else ye = function() {
      le(ne, 0);
    };
    function Ie(L) {
      ce = L, $ || ($ = !0, ye());
    }
    function xe(L, x) {
      re = le(function() {
        L(c.unstable_now());
      }, x);
    }
    c.unstable_IdlePriority = 5, c.unstable_ImmediatePriority = 1, c.unstable_LowPriority = 4, c.unstable_NormalPriority = 3, c.unstable_Profiling = null, c.unstable_UserBlockingPriority = 2, c.unstable_cancelCallback = function(L) {
      L.callback = null;
    }, c.unstable_continueExecution = function() {
      ee || b || (ee = !0, Ie(Te));
    }, c.unstable_forceFrameRate = function(L) {
      0 > L || 125 < L ? console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported") : ue = 0 < L ? Math.floor(1e3 / L) : 5;
    }, c.unstable_getCurrentPriorityLevel = function() {
      return I;
    }, c.unstable_getFirstCallbackNode = function() {
      return s(g);
    }, c.unstable_next = function(L) {
      switch (I) {
        case 1:
        case 2:
        case 3:
          var x = 3;
          break;
        default:
          x = I;
      }
      var k = I;
      I = x;
      try {
        return L();
      } finally {
        I = k;
      }
    }, c.unstable_pauseExecution = function() {
    }, c.unstable_requestPaint = function() {
    }, c.unstable_runWithPriority = function(L, x) {
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
      var k = I;
      I = L;
      try {
        return x();
      } finally {
        I = k;
      }
    }, c.unstable_scheduleCallback = function(L, x, k) {
      var f = c.unstable_now();
      switch (typeof k == "object" && k !== null ? (k = k.delay, k = typeof k == "number" && 0 < k ? f + k : f) : k = f, L) {
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
      return w = k + w, L = { id: H++, callback: x, priorityLevel: L, startTime: k, expirationTime: w, sortIndex: -1 }, k > f ? (L.sortIndex = k, u(S, L), s(g) === null && L === s(S) && (J ? (je(re), re = -1) : J = !0, xe(he, k - f))) : (L.sortIndex = w, u(g, L), ee || b || (ee = !0, Ie(Te))), L;
    }, c.unstable_shouldYield = ie, c.unstable_wrapCallback = function(L) {
      var x = I;
      return function() {
        var k = I;
        I = x;
        try {
          return L.apply(this, arguments);
        } finally {
          I = k;
        }
      };
    };
  })(Bo)), Bo;
}
var Ga;
function vd() {
  return Ga || (Ga = 1, $o.exports = md()), $o.exports;
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
var Ya;
function gd() {
  if (Ya) return et;
  Ya = 1;
  var c = Ko(), u = vd();
  function s(e) {
    for (var t = "https://reactjs.org/docs/error-decoder.html?invariant=" + e, n = 1; n < arguments.length; n++) t += "&args[]=" + encodeURIComponent(arguments[n]);
    return "Minified React error #" + e + "; visit " + t + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
  }
  var C = /* @__PURE__ */ new Set(), E = {};
  function z(e, t) {
    T(e, t), T(e + "Capture", t);
  }
  function T(e, t) {
    for (E[e] = t, e = 0; e < t.length; e++) C.add(t[e]);
  }
  var R = !(typeof window > "u" || typeof window.document > "u" || typeof window.document.createElement > "u"), g = Object.prototype.hasOwnProperty, S = /^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/, H = {}, W = {};
  function I(e) {
    return g.call(W, e) ? !0 : g.call(H, e) ? !1 : S.test(e) ? W[e] = !0 : (H[e] = !0, !1);
  }
  function b(e, t, n, r) {
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
  function ee(e, t, n, r) {
    if (t === null || typeof t > "u" || b(e, t, n, r)) return !0;
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
  function J(e, t, n, r, l, i, o) {
    this.acceptsBooleans = t === 2 || t === 3 || t === 4, this.attributeName = r, this.attributeNamespace = l, this.mustUseProperty = n, this.propertyName = e, this.type = t, this.sanitizeURL = i, this.removeEmptyString = o;
  }
  var le = {};
  "children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style".split(" ").forEach(function(e) {
    le[e] = new J(e, 0, !1, e, null, !1, !1);
  }), [["acceptCharset", "accept-charset"], ["className", "class"], ["htmlFor", "for"], ["httpEquiv", "http-equiv"]].forEach(function(e) {
    var t = e[0];
    le[t] = new J(t, 1, !1, e[1], null, !1, !1);
  }), ["contentEditable", "draggable", "spellCheck", "value"].forEach(function(e) {
    le[e] = new J(e, 2, !1, e.toLowerCase(), null, !1, !1);
  }), ["autoReverse", "externalResourcesRequired", "focusable", "preserveAlpha"].forEach(function(e) {
    le[e] = new J(e, 2, !1, e, null, !1, !1);
  }), "allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope".split(" ").forEach(function(e) {
    le[e] = new J(e, 3, !1, e.toLowerCase(), null, !1, !1);
  }), ["checked", "multiple", "muted", "selected"].forEach(function(e) {
    le[e] = new J(e, 3, !0, e, null, !1, !1);
  }), ["capture", "download"].forEach(function(e) {
    le[e] = new J(e, 4, !1, e, null, !1, !1);
  }), ["cols", "rows", "size", "span"].forEach(function(e) {
    le[e] = new J(e, 6, !1, e, null, !1, !1);
  }), ["rowSpan", "start"].forEach(function(e) {
    le[e] = new J(e, 5, !1, e.toLowerCase(), null, !1, !1);
  });
  var je = /[\-:]([a-z])/g;
  function Me(e) {
    return e[1].toUpperCase();
  }
  "accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height".split(" ").forEach(function(e) {
    var t = e.replace(
      je,
      Me
    );
    le[t] = new J(t, 1, !1, e, null, !1, !1);
  }), "xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type".split(" ").forEach(function(e) {
    var t = e.replace(je, Me);
    le[t] = new J(t, 1, !1, e, "http://www.w3.org/1999/xlink", !1, !1);
  }), ["xml:base", "xml:lang", "xml:space"].forEach(function(e) {
    var t = e.replace(je, Me);
    le[t] = new J(t, 1, !1, e, "http://www.w3.org/XML/1998/namespace", !1, !1);
  }), ["tabIndex", "crossOrigin"].forEach(function(e) {
    le[e] = new J(e, 1, !1, e.toLowerCase(), null, !1, !1);
  }), le.xlinkHref = new J("xlinkHref", 1, !1, "xlink:href", "http://www.w3.org/1999/xlink", !0, !1), ["src", "href", "action", "formAction"].forEach(function(e) {
    le[e] = new J(e, 1, !1, e.toLowerCase(), null, !0, !0);
  });
  function Pe(e, t, n, r) {
    var l = le.hasOwnProperty(t) ? le[t] : null;
    (l !== null ? l.type !== 0 : r || !(2 < t.length) || t[0] !== "o" && t[0] !== "O" || t[1] !== "n" && t[1] !== "N") && (ee(t, n, l, r) && (n = null), r || l === null ? I(t) && (n === null ? e.removeAttribute(t) : e.setAttribute(t, "" + n)) : l.mustUseProperty ? e[l.propertyName] = n === null ? l.type === 3 ? !1 : "" : n : (t = l.attributeName, r = l.attributeNamespace, n === null ? e.removeAttribute(t) : (l = l.type, n = l === 3 || l === 4 && n === !0 ? "" : "" + n, r ? e.setAttributeNS(r, t, n) : e.setAttribute(t, n))));
  }
  var he = c.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED, Te = Symbol.for("react.element"), $ = Symbol.for("react.portal"), ce = Symbol.for("react.fragment"), re = Symbol.for("react.strict_mode"), ue = Symbol.for("react.profiler"), K = Symbol.for("react.provider"), ie = Symbol.for("react.context"), ne = Symbol.for("react.forward_ref"), ye = Symbol.for("react.suspense"), Ge = Symbol.for("react.suspense_list"), Ye = Symbol.for("react.memo"), Ie = Symbol.for("react.lazy"), xe = Symbol.for("react.offscreen"), L = Symbol.iterator;
  function x(e) {
    return e === null || typeof e != "object" ? null : (e = L && e[L] || e["@@iterator"], typeof e == "function" ? e : null);
  }
  var k = Object.assign, f;
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
`), o = l.length - 1, a = i.length - 1; 1 <= o && 0 <= a && l[o] !== i[a]; ) a--;
        for (; 1 <= o && 0 <= a; o--, a--) if (l[o] !== i[a]) {
          if (o !== 1 || a !== 1)
            do
              if (o--, a--, 0 > a || l[o] !== i[a]) {
                var p = `
` + l[o].replace(" at new ", " at ");
                return e.displayName && p.includes("<anonymous>") && (p = p.replace("<anonymous>", e.displayName)), p;
              }
            while (1 <= o && 0 <= a);
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
      case $:
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
  function Hn(e) {
    if (!e) return !1;
    var t = e._valueTracker;
    if (!t) return !0;
    var n = t.getValue(), r = "";
    return e && (r = oe(e) ? e.checked ? "true" : "false" : e.value), e = r, e !== n ? (t.setValue(e), !0) : !1;
  }
  function Lr(e) {
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
  function Xo(e, t) {
    var n = t.defaultValue == null ? "" : t.defaultValue, r = t.checked != null ? t.checked : t.defaultChecked;
    n = G(t.value != null ? t.value : n), e._wrapperState = { initialChecked: r, initialValue: n, controlled: t.type === "checkbox" || t.type === "radio" ? t.checked != null : t.value != null };
  }
  function Zo(e, t) {
    t = t.checked, t != null && Pe(e, "checked", t, !1);
  }
  function Ql(e, t) {
    Zo(e, t);
    var n = G(t.value), r = t.type;
    if (n != null) r === "number" ? (n === 0 && e.value === "" || e.value != n) && (e.value = "" + n) : e.value !== "" + n && (e.value = "" + n);
    else if (r === "submit" || r === "reset") {
      e.removeAttribute("value");
      return;
    }
    t.hasOwnProperty("value") ? Kl(e, t.type, n) : t.hasOwnProperty("defaultValue") && Kl(e, t.type, G(t.defaultValue)), t.checked == null && t.defaultChecked != null && (e.defaultChecked = !!t.defaultChecked);
  }
  function Jo(e, t, n) {
    if (t.hasOwnProperty("value") || t.hasOwnProperty("defaultValue")) {
      var r = t.type;
      if (!(r !== "submit" && r !== "reset" || t.value !== void 0 && t.value !== null)) return;
      t = "" + e._wrapperState.initialValue, n || t === e.value || (e.value = t), e.defaultValue = t;
    }
    n = e.name, n !== "" && (e.name = ""), e.defaultChecked = !!e._wrapperState.initialChecked, n !== "" && (e.name = n);
  }
  function Kl(e, t, n) {
    (t !== "number" || Lr(e.ownerDocument) !== e) && (n == null ? e.defaultValue = "" + e._wrapperState.initialValue : e.defaultValue !== "" + n && (e.defaultValue = "" + n));
  }
  var $n = Array.isArray;
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
  function qo(e, t) {
    var n = t.value;
    if (n == null) {
      if (n = t.children, t = t.defaultValue, n != null) {
        if (t != null) throw Error(s(92));
        if ($n(n)) {
          if (1 < n.length) throw Error(s(93));
          n = n[0];
        }
        t = n;
      }
      t == null && (t = ""), n = t;
    }
    e._wrapperState = { initialValue: G(n) };
  }
  function bo(e, t) {
    var n = G(t.value), r = G(t.defaultValue);
    n != null && (n = "" + n, n !== e.value && (e.value = n), t.defaultValue == null && e.defaultValue !== n && (e.defaultValue = n)), r != null && (e.defaultValue = "" + r);
  }
  function es(e) {
    var t = e.textContent;
    t === e._wrapperState.initialValue && t !== "" && t !== null && (e.value = t);
  }
  function ts(e) {
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
    return e == null || e === "http://www.w3.org/1999/xhtml" ? ts(t) : e === "http://www.w3.org/2000/svg" && t === "foreignObject" ? "http://www.w3.org/1999/xhtml" : e;
  }
  var Mr, ns = (function(e) {
    return typeof MSApp < "u" && MSApp.execUnsafeLocalFunction ? function(t, n, r, l) {
      MSApp.execUnsafeLocalFunction(function() {
        return e(t, n, r, l);
      });
    } : e;
  })(function(e, t) {
    if (e.namespaceURI !== "http://www.w3.org/2000/svg" || "innerHTML" in e) e.innerHTML = t;
    else {
      for (Mr = Mr || document.createElement("div"), Mr.innerHTML = "<svg>" + t.valueOf().toString() + "</svg>", t = Mr.firstChild; e.firstChild; ) e.removeChild(e.firstChild);
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
  }, pc = ["Webkit", "ms", "Moz", "O"];
  Object.keys(Vn).forEach(function(e) {
    pc.forEach(function(t) {
      t = t + e.charAt(0).toUpperCase() + e.substring(1), Vn[t] = Vn[e];
    });
  });
  function rs(e, t, n) {
    return t == null || typeof t == "boolean" || t === "" ? "" : n || typeof t != "number" || t === 0 || Vn.hasOwnProperty(e) && Vn[e] ? ("" + t).trim() : t + "px";
  }
  function ls(e, t) {
    e = e.style;
    for (var n in t) if (t.hasOwnProperty(n)) {
      var r = n.indexOf("--") === 0, l = rs(n, t[n], r);
      n === "float" && (n = "cssFloat"), r ? e.setProperty(n, l) : e[n] = l;
    }
  }
  var hc = k({ menuitem: !0 }, { area: !0, base: !0, br: !0, col: !0, embed: !0, hr: !0, img: !0, input: !0, keygen: !0, link: !0, meta: !0, param: !0, source: !0, track: !0, wbr: !0 });
  function Xl(e, t) {
    if (t) {
      if (hc[e] && (t.children != null || t.dangerouslySetInnerHTML != null)) throw Error(s(137, e));
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
  function is(e) {
    if (e = fr(e)) {
      if (typeof bl != "function") throw Error(s(280));
      var t = e.stateNode;
      t && (t = nl(t), bl(e.stateNode, e.type, t));
    }
  }
  function os(e) {
    mn ? vn ? vn.push(e) : vn = [e] : mn = e;
  }
  function ss() {
    if (mn) {
      var e = mn, t = vn;
      if (vn = mn = null, is(e), t) for (e = 0; e < t.length; e++) is(t[e]);
    }
  }
  function us(e, t) {
    return e(t);
  }
  function as() {
  }
  var ei = !1;
  function cs(e, t, n) {
    if (ei) return e(t, n);
    ei = !0;
    try {
      return us(e, t, n);
    } finally {
      ei = !1, (mn !== null || vn !== null) && (as(), ss());
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
  if (R) try {
    var Qn = {};
    Object.defineProperty(Qn, "passive", { get: function() {
      ti = !0;
    } }), window.addEventListener("test", Qn, Qn), window.removeEventListener("test", Qn, Qn);
  } catch {
    ti = !1;
  }
  function mc(e, t, n, r, l, i, o, a, p) {
    var y = Array.prototype.slice.call(arguments, 3);
    try {
      t.apply(n, y);
    } catch (N) {
      this.onError(N);
    }
  }
  var Kn = !1, Ir = null, Dr = !1, ni = null, vc = { onError: function(e) {
    Kn = !0, Ir = e;
  } };
  function gc(e, t, n, r, l, i, o, a, p) {
    Kn = !1, Ir = null, mc.apply(vc, arguments);
  }
  function yc(e, t, n, r, l, i, o, a, p) {
    if (gc.apply(this, arguments), Kn) {
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
  function ds(e) {
    if (bt(e) !== e) throw Error(s(188));
  }
  function xc(e) {
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
          if (i === n) return ds(l), e;
          if (i === r) return ds(l), t;
          i = i.sibling;
        }
        throw Error(s(188));
      }
      if (n.return !== r.return) n = l, r = i;
      else {
        for (var o = !1, a = l.child; a; ) {
          if (a === n) {
            o = !0, n = l, r = i;
            break;
          }
          if (a === r) {
            o = !0, r = l, n = i;
            break;
          }
          a = a.sibling;
        }
        if (!o) {
          for (a = i.child; a; ) {
            if (a === n) {
              o = !0, n = i, r = l;
              break;
            }
            if (a === r) {
              o = !0, r = i, n = l;
              break;
            }
            a = a.sibling;
          }
          if (!o) throw Error(s(189));
        }
      }
      if (n.alternate !== r) throw Error(s(190));
    }
    if (n.tag !== 3) throw Error(s(188));
    return n.stateNode.current === n ? e : t;
  }
  function ps(e) {
    return e = xc(e), e !== null ? hs(e) : null;
  }
  function hs(e) {
    if (e.tag === 5 || e.tag === 6) return e;
    for (e = e.child; e !== null; ) {
      var t = hs(e);
      if (t !== null) return t;
      e = e.sibling;
    }
    return null;
  }
  var ms = u.unstable_scheduleCallback, vs = u.unstable_cancelCallback, wc = u.unstable_shouldYield, kc = u.unstable_requestPaint, _e = u.unstable_now, Sc = u.unstable_getCurrentPriorityLevel, ri = u.unstable_ImmediatePriority, gs = u.unstable_UserBlockingPriority, Fr = u.unstable_NormalPriority, Ec = u.unstable_LowPriority, ys = u.unstable_IdlePriority, Or = null, wt = null;
  function Cc(e) {
    if (wt && typeof wt.onCommitFiberRoot == "function") try {
      wt.onCommitFiberRoot(Or, e, void 0, (e.current.flags & 128) === 128);
    } catch {
    }
  }
  var pt = Math.clz32 ? Math.clz32 : jc, _c = Math.log, Nc = Math.LN2;
  function jc(e) {
    return e >>>= 0, e === 0 ? 32 : 31 - (_c(e) / Nc | 0) | 0;
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
  function Hr(e, t) {
    var n = e.pendingLanes;
    if (n === 0) return 0;
    var r = 0, l = e.suspendedLanes, i = e.pingedLanes, o = n & 268435455;
    if (o !== 0) {
      var a = o & ~l;
      a !== 0 ? r = Gn(a) : (i &= o, i !== 0 && (r = Gn(i)));
    } else o = n & ~l, o !== 0 ? r = Gn(o) : i !== 0 && (r = Gn(i));
    if (r === 0) return 0;
    if (t !== 0 && t !== r && (t & l) === 0 && (l = r & -r, i = t & -t, l >= i || l === 16 && (i & 4194240) !== 0)) return t;
    if ((r & 4) !== 0 && (r |= n & 16), t = e.entangledLanes, t !== 0) for (e = e.entanglements, t &= r; 0 < t; ) n = 31 - pt(t), l = 1 << n, r |= e[n], t &= ~l;
    return r;
  }
  function zc(e, t) {
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
  function Pc(e, t) {
    for (var n = e.suspendedLanes, r = e.pingedLanes, l = e.expirationTimes, i = e.pendingLanes; 0 < i; ) {
      var o = 31 - pt(i), a = 1 << o, p = l[o];
      p === -1 ? ((a & n) === 0 || (a & r) !== 0) && (l[o] = zc(a, t)) : p <= t && (e.expiredLanes |= a), i &= ~a;
    }
  }
  function li(e) {
    return e = e.pendingLanes & -1073741825, e !== 0 ? e : e & 1073741824 ? 1073741824 : 0;
  }
  function xs() {
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
  function Tc(e, t) {
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
  function ws(e) {
    return e &= -e, 1 < e ? 4 < e ? (e & 268435455) !== 0 ? 16 : 536870912 : 4 : 1;
  }
  var ks, si, Ss, Es, Cs, ui = !1, $r = [], Mt = null, It = null, Dt = null, Xn = /* @__PURE__ */ new Map(), Zn = /* @__PURE__ */ new Map(), Ft = [], Rc = "mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset submit".split(" ");
  function _s(e, t) {
    switch (e) {
      case "focusin":
      case "focusout":
        Mt = null;
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
  function Lc(e, t, n, r, l) {
    switch (t) {
      case "focusin":
        return Mt = Jn(Mt, e, t, n, r, l), !0;
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
  function Ns(e) {
    var t = en(e.target);
    if (t !== null) {
      var n = bt(t);
      if (n !== null) {
        if (t = n.tag, t === 13) {
          if (t = fs(n), t !== null) {
            e.blockedOn = t, Cs(e.priority, function() {
              Ss(n);
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
  function js(e, t, n) {
    Br(e) && n.delete(t);
  }
  function Mc() {
    ui = !1, Mt !== null && Br(Mt) && (Mt = null), It !== null && Br(It) && (It = null), Dt !== null && Br(Dt) && (Dt = null), Xn.forEach(js), Zn.forEach(js);
  }
  function qn(e, t) {
    e.blockedOn === t && (e.blockedOn = null, ui || (ui = !0, u.unstable_scheduleCallback(u.unstable_NormalPriority, Mc)));
  }
  function bn(e) {
    function t(l) {
      return qn(l, e);
    }
    if (0 < $r.length) {
      qn($r[0], e);
      for (var n = 1; n < $r.length; n++) {
        var r = $r[n];
        r.blockedOn === e && (r.blockedOn = null);
      }
    }
    for (Mt !== null && qn(Mt, e), It !== null && qn(It, e), Dt !== null && qn(Dt, e), Xn.forEach(t), Zn.forEach(t), n = 0; n < Ft.length; n++) r = Ft[n], r.blockedOn === e && (r.blockedOn = null);
    for (; 0 < Ft.length && (n = Ft[0], n.blockedOn === null); ) Ns(n), n.blockedOn === null && Ft.shift();
  }
  var gn = he.ReactCurrentBatchConfig, Vr = !0;
  function Ic(e, t, n, r) {
    var l = de, i = gn.transition;
    gn.transition = null;
    try {
      de = 1, ai(e, t, n, r);
    } finally {
      de = l, gn.transition = i;
    }
  }
  function Dc(e, t, n, r) {
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
      else if (Lc(l, e, t, n, r)) r.stopPropagation();
      else if (_s(e, r), t & 4 && -1 < Rc.indexOf(e)) {
        for (; l !== null; ) {
          var i = fr(l);
          if (i !== null && ks(i), i = ci(e, t, n, r), i === null && ji(e, t, r, Wr, n), i === l) break;
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
      if (e = fs(t), e !== null) return e;
      e = null;
    } else if (n === 3) {
      if (t.stateNode.current.memoizedState.isDehydrated) return t.tag === 3 ? t.stateNode.containerInfo : null;
      e = null;
    } else t !== e && (e = null);
    return Wr = e, null;
  }
  function zs(e) {
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
        switch (Sc()) {
          case ri:
            return 1;
          case gs:
            return 4;
          case Fr:
          case Ec:
            return 16;
          case ys:
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
  function Ts() {
    return !1;
  }
  function tt(e) {
    function t(n, r, l, i, o) {
      this._reactName = n, this._targetInst = l, this.type = r, this.nativeEvent = i, this.target = o, this.currentTarget = null;
      for (var a in e) e.hasOwnProperty(a) && (n = e[a], this[a] = n ? n(i) : i[a]);
      return this.isDefaultPrevented = (i.defaultPrevented != null ? i.defaultPrevented : i.returnValue === !1) ? Gr : Ts, this.isPropagationStopped = Ts, this;
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
  }, defaultPrevented: 0, isTrusted: 0 }, di = tt(yn), er = k({}, yn, { view: 0, detail: 0 }), Fc = tt(er), pi, hi, tr, Yr = k({}, er, { screenX: 0, screenY: 0, clientX: 0, clientY: 0, pageX: 0, pageY: 0, ctrlKey: 0, shiftKey: 0, altKey: 0, metaKey: 0, getModifierState: vi, button: 0, buttons: 0, relatedTarget: function(e) {
    return e.relatedTarget === void 0 ? e.fromElement === e.srcElement ? e.toElement : e.fromElement : e.relatedTarget;
  }, movementX: function(e) {
    return "movementX" in e ? e.movementX : (e !== tr && (tr && e.type === "mousemove" ? (pi = e.screenX - tr.screenX, hi = e.screenY - tr.screenY) : hi = pi = 0, tr = e), pi);
  }, movementY: function(e) {
    return "movementY" in e ? e.movementY : hi;
  } }), Rs = tt(Yr), Oc = k({}, Yr, { dataTransfer: 0 }), Ac = tt(Oc), Uc = k({}, er, { relatedTarget: 0 }), mi = tt(Uc), Hc = k({}, yn, { animationName: 0, elapsedTime: 0, pseudoElement: 0 }), $c = tt(Hc), Bc = k({}, yn, { clipboardData: function(e) {
    return "clipboardData" in e ? e.clipboardData : window.clipboardData;
  } }), Vc = tt(Bc), Wc = k({}, yn, { data: 0 }), Ls = tt(Wc), Qc = {
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
  }, Kc = {
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
  }, Gc = { Alt: "altKey", Control: "ctrlKey", Meta: "metaKey", Shift: "shiftKey" };
  function Yc(e) {
    var t = this.nativeEvent;
    return t.getModifierState ? t.getModifierState(e) : (e = Gc[e]) ? !!t[e] : !1;
  }
  function vi() {
    return Yc;
  }
  var Xc = k({}, er, { key: function(e) {
    if (e.key) {
      var t = Qc[e.key] || e.key;
      if (t !== "Unidentified") return t;
    }
    return e.type === "keypress" ? (e = Kr(e), e === 13 ? "Enter" : String.fromCharCode(e)) : e.type === "keydown" || e.type === "keyup" ? Kc[e.keyCode] || "Unidentified" : "";
  }, code: 0, location: 0, ctrlKey: 0, shiftKey: 0, altKey: 0, metaKey: 0, repeat: 0, locale: 0, getModifierState: vi, charCode: function(e) {
    return e.type === "keypress" ? Kr(e) : 0;
  }, keyCode: function(e) {
    return e.type === "keydown" || e.type === "keyup" ? e.keyCode : 0;
  }, which: function(e) {
    return e.type === "keypress" ? Kr(e) : e.type === "keydown" || e.type === "keyup" ? e.keyCode : 0;
  } }), Zc = tt(Xc), Jc = k({}, Yr, { pointerId: 0, width: 0, height: 0, pressure: 0, tangentialPressure: 0, tiltX: 0, tiltY: 0, twist: 0, pointerType: 0, isPrimary: 0 }), Ms = tt(Jc), qc = k({}, er, { touches: 0, targetTouches: 0, changedTouches: 0, altKey: 0, metaKey: 0, ctrlKey: 0, shiftKey: 0, getModifierState: vi }), bc = tt(qc), ef = k({}, yn, { propertyName: 0, elapsedTime: 0, pseudoElement: 0 }), tf = tt(ef), nf = k({}, Yr, {
    deltaX: function(e) {
      return "deltaX" in e ? e.deltaX : "wheelDeltaX" in e ? -e.wheelDeltaX : 0;
    },
    deltaY: function(e) {
      return "deltaY" in e ? e.deltaY : "wheelDeltaY" in e ? -e.wheelDeltaY : "wheelDelta" in e ? -e.wheelDelta : 0;
    },
    deltaZ: 0,
    deltaMode: 0
  }), rf = tt(nf), lf = [9, 13, 27, 32], gi = R && "CompositionEvent" in window, nr = null;
  R && "documentMode" in document && (nr = document.documentMode);
  var of = R && "TextEvent" in window && !nr, Is = R && (!gi || nr && 8 < nr && 11 >= nr), Ds = " ", Fs = !1;
  function Os(e, t) {
    switch (e) {
      case "keyup":
        return lf.indexOf(t.keyCode) !== -1;
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
  function As(e) {
    return e = e.detail, typeof e == "object" && "data" in e ? e.data : null;
  }
  var xn = !1;
  function sf(e, t) {
    switch (e) {
      case "compositionend":
        return As(t);
      case "keypress":
        return t.which !== 32 ? null : (Fs = !0, Ds);
      case "textInput":
        return e = t.data, e === Ds && Fs ? null : e;
      default:
        return null;
    }
  }
  function uf(e, t) {
    if (xn) return e === "compositionend" || !gi && Os(e, t) ? (e = Ps(), Qr = fi = Ot = null, xn = !1, e) : null;
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
        return Is && t.locale !== "ko" ? null : t.data;
      default:
        return null;
    }
  }
  var af = { color: !0, date: !0, datetime: !0, "datetime-local": !0, email: !0, month: !0, number: !0, password: !0, range: !0, search: !0, tel: !0, text: !0, time: !0, url: !0, week: !0 };
  function Us(e) {
    var t = e && e.nodeName && e.nodeName.toLowerCase();
    return t === "input" ? !!af[e.type] : t === "textarea";
  }
  function Hs(e, t, n, r) {
    os(r), t = br(t, "onChange"), 0 < t.length && (n = new di("onChange", "change", null, n, r), e.push({ event: n, listeners: t }));
  }
  var rr = null, lr = null;
  function cf(e) {
    lu(e, 0);
  }
  function Xr(e) {
    var t = Cn(e);
    if (Hn(t)) return e;
  }
  function ff(e, t) {
    if (e === "change") return t;
  }
  var $s = !1;
  if (R) {
    var yi;
    if (R) {
      var xi = "oninput" in document;
      if (!xi) {
        var Bs = document.createElement("div");
        Bs.setAttribute("oninput", "return;"), xi = typeof Bs.oninput == "function";
      }
      yi = xi;
    } else yi = !1;
    $s = yi && (!document.documentMode || 9 < document.documentMode);
  }
  function Vs() {
    rr && (rr.detachEvent("onpropertychange", Ws), lr = rr = null);
  }
  function Ws(e) {
    if (e.propertyName === "value" && Xr(lr)) {
      var t = [];
      Hs(t, lr, e, ql(e)), cs(cf, t);
    }
  }
  function df(e, t, n) {
    e === "focusin" ? (Vs(), rr = t, lr = n, rr.attachEvent("onpropertychange", Ws)) : e === "focusout" && Vs();
  }
  function pf(e) {
    if (e === "selectionchange" || e === "keyup" || e === "keydown") return Xr(lr);
  }
  function hf(e, t) {
    if (e === "click") return Xr(t);
  }
  function mf(e, t) {
    if (e === "input" || e === "change") return Xr(t);
  }
  function vf(e, t) {
    return e === t && (e !== 0 || 1 / e === 1 / t) || e !== e && t !== t;
  }
  var ht = typeof Object.is == "function" ? Object.is : vf;
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
  function Qs(e) {
    for (; e && e.firstChild; ) e = e.firstChild;
    return e;
  }
  function Ks(e, t) {
    var n = Qs(e);
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
      n = Qs(n);
    }
  }
  function Gs(e, t) {
    return e && t ? e === t ? !0 : e && e.nodeType === 3 ? !1 : t && t.nodeType === 3 ? Gs(e, t.parentNode) : "contains" in e ? e.contains(t) : e.compareDocumentPosition ? !!(e.compareDocumentPosition(t) & 16) : !1 : !1;
  }
  function Ys() {
    for (var e = window, t = Lr(); t instanceof e.HTMLIFrameElement; ) {
      try {
        var n = typeof t.contentWindow.location.href == "string";
      } catch {
        n = !1;
      }
      if (n) e = t.contentWindow;
      else break;
      t = Lr(e.document);
    }
    return t;
  }
  function wi(e) {
    var t = e && e.nodeName && e.nodeName.toLowerCase();
    return t && (t === "input" && (e.type === "text" || e.type === "search" || e.type === "tel" || e.type === "url" || e.type === "password") || t === "textarea" || e.contentEditable === "true");
  }
  function gf(e) {
    var t = Ys(), n = e.focusedElem, r = e.selectionRange;
    if (t !== n && n && n.ownerDocument && Gs(n.ownerDocument.documentElement, n)) {
      if (r !== null && wi(n)) {
        if (t = r.start, e = r.end, e === void 0 && (e = t), "selectionStart" in n) n.selectionStart = t, n.selectionEnd = Math.min(e, n.value.length);
        else if (e = (t = n.ownerDocument || document) && t.defaultView || window, e.getSelection) {
          e = e.getSelection();
          var l = n.textContent.length, i = Math.min(r.start, l);
          r = r.end === void 0 ? i : Math.min(r.end, l), !e.extend && i > r && (l = r, r = i, i = l), l = Ks(n, i);
          var o = Ks(
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
  var yf = R && "documentMode" in document && 11 >= document.documentMode, wn = null, ki = null, or = null, Si = !1;
  function Xs(e, t, n) {
    var r = n.window === n ? n.document : n.nodeType === 9 ? n : n.ownerDocument;
    Si || wn == null || wn !== Lr(r) || (r = wn, "selectionStart" in r && wi(r) ? r = { start: r.selectionStart, end: r.selectionEnd } : (r = (r.ownerDocument && r.ownerDocument.defaultView || window).getSelection(), r = { anchorNode: r.anchorNode, anchorOffset: r.anchorOffset, focusNode: r.focusNode, focusOffset: r.focusOffset }), or && ir(or, r) || (or = r, r = br(ki, "onSelect"), 0 < r.length && (t = new di("onSelect", "select", null, t, n), e.push({ event: t, listeners: r }), t.target = wn)));
  }
  function Zr(e, t) {
    var n = {};
    return n[e.toLowerCase()] = t.toLowerCase(), n["Webkit" + e] = "webkit" + t, n["Moz" + e] = "moz" + t, n;
  }
  var kn = { animationend: Zr("Animation", "AnimationEnd"), animationiteration: Zr("Animation", "AnimationIteration"), animationstart: Zr("Animation", "AnimationStart"), transitionend: Zr("Transition", "TransitionEnd") }, Ei = {}, Zs = {};
  R && (Zs = document.createElement("div").style, "AnimationEvent" in window || (delete kn.animationend.animation, delete kn.animationiteration.animation, delete kn.animationstart.animation), "TransitionEvent" in window || delete kn.transitionend.transition);
  function Jr(e) {
    if (Ei[e]) return Ei[e];
    if (!kn[e]) return e;
    var t = kn[e], n;
    for (n in t) if (t.hasOwnProperty(n) && n in Zs) return Ei[e] = t[n];
    return e;
  }
  var Js = Jr("animationend"), qs = Jr("animationiteration"), bs = Jr("animationstart"), eu = Jr("transitionend"), tu = /* @__PURE__ */ new Map(), nu = "abort auxClick cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");
  function At(e, t) {
    tu.set(e, t), z(t, [e]);
  }
  for (var Ci = 0; Ci < nu.length; Ci++) {
    var _i = nu[Ci], xf = _i.toLowerCase(), wf = _i[0].toUpperCase() + _i.slice(1);
    At(xf, "on" + wf);
  }
  At(Js, "onAnimationEnd"), At(qs, "onAnimationIteration"), At(bs, "onAnimationStart"), At("dblclick", "onDoubleClick"), At("focusin", "onFocus"), At("focusout", "onBlur"), At(eu, "onTransitionEnd"), T("onMouseEnter", ["mouseout", "mouseover"]), T("onMouseLeave", ["mouseout", "mouseover"]), T("onPointerEnter", ["pointerout", "pointerover"]), T("onPointerLeave", ["pointerout", "pointerover"]), z("onChange", "change click focusin focusout input keydown keyup selectionchange".split(" ")), z("onSelect", "focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" ")), z("onBeforeInput", ["compositionend", "keypress", "textInput", "paste"]), z("onCompositionEnd", "compositionend focusout keydown keypress keyup mousedown".split(" ")), z("onCompositionStart", "compositionstart focusout keydown keypress keyup mousedown".split(" ")), z("onCompositionUpdate", "compositionupdate focusout keydown keypress keyup mousedown".split(" "));
  var sr = "abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "), kf = new Set("cancel close invalid load scroll toggle".split(" ").concat(sr));
  function ru(e, t, n) {
    var r = e.type || "unknown-event";
    e.currentTarget = n, yc(r, t, void 0, e), e.currentTarget = null;
  }
  function lu(e, t) {
    t = (t & 4) !== 0;
    for (var n = 0; n < e.length; n++) {
      var r = e[n], l = r.event;
      r = r.listeners;
      e: {
        var i = void 0;
        if (t) for (var o = r.length - 1; 0 <= o; o--) {
          var a = r[o], p = a.instance, y = a.currentTarget;
          if (a = a.listener, p !== i && l.isPropagationStopped()) break e;
          ru(l, a, y), i = p;
        }
        else for (o = 0; o < r.length; o++) {
          if (a = r[o], p = a.instance, y = a.currentTarget, a = a.listener, p !== i && l.isPropagationStopped()) break e;
          ru(l, a, y), i = p;
        }
      }
    }
    if (Dr) throw e = ni, Dr = !1, ni = null, e;
  }
  function me(e, t) {
    var n = t[Mi];
    n === void 0 && (n = t[Mi] = /* @__PURE__ */ new Set());
    var r = e + "__bubble";
    n.has(r) || (iu(t, e, 2, !1), n.add(r));
  }
  function Ni(e, t, n) {
    var r = 0;
    t && (r |= 4), iu(n, e, r, t);
  }
  var qr = "_reactListening" + Math.random().toString(36).slice(2);
  function ur(e) {
    if (!e[qr]) {
      e[qr] = !0, C.forEach(function(n) {
        n !== "selectionchange" && (kf.has(n) || Ni(n, !1, e), Ni(n, !0, e));
      });
      var t = e.nodeType === 9 ? e : e.ownerDocument;
      t === null || t[qr] || (t[qr] = !0, Ni("selectionchange", !1, t));
    }
  }
  function iu(e, t, n, r) {
    switch (zs(t)) {
      case 1:
        var l = Ic;
        break;
      case 4:
        l = Dc;
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
        var a = r.stateNode.containerInfo;
        if (a === l || a.nodeType === 8 && a.parentNode === l) break;
        if (o === 4) for (o = r.return; o !== null; ) {
          var p = o.tag;
          if ((p === 3 || p === 4) && (p = o.stateNode.containerInfo, p === l || p.nodeType === 8 && p.parentNode === l)) return;
          o = o.return;
        }
        for (; a !== null; ) {
          if (o = en(a), o === null) return;
          if (p = o.tag, p === 5 || p === 6) {
            r = i = o;
            continue e;
          }
          a = a.parentNode;
        }
      }
      r = r.return;
    }
    cs(function() {
      var y = i, N = ql(n), j = [];
      e: {
        var _ = tu.get(e);
        if (_ !== void 0) {
          var M = di, O = e;
          switch (e) {
            case "keypress":
              if (Kr(n) === 0) break e;
            case "keydown":
            case "keyup":
              M = Zc;
              break;
            case "focusin":
              O = "focus", M = mi;
              break;
            case "focusout":
              O = "blur", M = mi;
              break;
            case "beforeblur":
            case "afterblur":
              M = mi;
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
              M = Rs;
              break;
            case "drag":
            case "dragend":
            case "dragenter":
            case "dragexit":
            case "dragleave":
            case "dragover":
            case "dragstart":
            case "drop":
              M = Ac;
              break;
            case "touchcancel":
            case "touchend":
            case "touchmove":
            case "touchstart":
              M = bc;
              break;
            case Js:
            case qs:
            case bs:
              M = $c;
              break;
            case eu:
              M = tf;
              break;
            case "scroll":
              M = Fc;
              break;
            case "wheel":
              M = rf;
              break;
            case "copy":
            case "cut":
            case "paste":
              M = Vc;
              break;
            case "gotpointercapture":
            case "lostpointercapture":
            case "pointercancel":
            case "pointerdown":
            case "pointermove":
            case "pointerout":
            case "pointerover":
            case "pointerup":
              M = Ms;
          }
          var A = (t & 4) !== 0, Ne = !A && e === "scroll", m = A ? _ !== null ? _ + "Capture" : null : _;
          A = [];
          for (var h = y, v; h !== null; ) {
            v = h;
            var P = v.stateNode;
            if (v.tag === 5 && P !== null && (v = P, m !== null && (P = Wn(h, m), P != null && A.push(ar(h, P, v)))), Ne) break;
            h = h.return;
          }
          0 < A.length && (_ = new M(_, O, null, n, N), j.push({ event: _, listeners: A }));
        }
      }
      if ((t & 7) === 0) {
        e: {
          if (_ = e === "mouseover" || e === "pointerover", M = e === "mouseout" || e === "pointerout", _ && n !== Jl && (O = n.relatedTarget || n.fromElement) && (en(O) || O[_t])) break e;
          if ((M || _) && (_ = N.window === N ? N : (_ = N.ownerDocument) ? _.defaultView || _.parentWindow : window, M ? (O = n.relatedTarget || n.toElement, M = y, O = O ? en(O) : null, O !== null && (Ne = bt(O), O !== Ne || O.tag !== 5 && O.tag !== 6) && (O = null)) : (M = null, O = y), M !== O)) {
            if (A = Rs, P = "onMouseLeave", m = "onMouseEnter", h = "mouse", (e === "pointerout" || e === "pointerover") && (A = Ms, P = "onPointerLeave", m = "onPointerEnter", h = "pointer"), Ne = M == null ? _ : Cn(M), v = O == null ? _ : Cn(O), _ = new A(P, h + "leave", M, n, N), _.target = Ne, _.relatedTarget = v, P = null, en(N) === y && (A = new A(m, h + "enter", O, n, N), A.target = v, A.relatedTarget = Ne, P = A), Ne = P, M && O) t: {
              for (A = M, m = O, h = 0, v = A; v; v = Sn(v)) h++;
              for (v = 0, P = m; P; P = Sn(P)) v++;
              for (; 0 < h - v; ) A = Sn(A), h--;
              for (; 0 < v - h; ) m = Sn(m), v--;
              for (; h--; ) {
                if (A === m || m !== null && A === m.alternate) break t;
                A = Sn(A), m = Sn(m);
              }
              A = null;
            }
            else A = null;
            M !== null && ou(j, _, M, A, !1), O !== null && Ne !== null && ou(j, Ne, O, A, !0);
          }
        }
        e: {
          if (_ = y ? Cn(y) : window, M = _.nodeName && _.nodeName.toLowerCase(), M === "select" || M === "input" && _.type === "file") var U = ff;
          else if (Us(_)) if ($s) U = mf;
          else {
            U = pf;
            var B = df;
          }
          else (M = _.nodeName) && M.toLowerCase() === "input" && (_.type === "checkbox" || _.type === "radio") && (U = hf);
          if (U && (U = U(e, y))) {
            Hs(j, U, n, N);
            break e;
          }
          B && B(e, _, y), e === "focusout" && (B = _._wrapperState) && B.controlled && _.type === "number" && Kl(_, "number", _.value);
        }
        switch (B = y ? Cn(y) : window, e) {
          case "focusin":
            (Us(B) || B.contentEditable === "true") && (wn = B, ki = y, or = null);
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
            Si = !1, Xs(j, n, N);
            break;
          case "selectionchange":
            if (yf) break;
          case "keydown":
          case "keyup":
            Xs(j, n, N);
        }
        var V;
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
        else xn ? Os(e, n) && (Y = "onCompositionEnd") : e === "keydown" && n.keyCode === 229 && (Y = "onCompositionStart");
        Y && (Is && n.locale !== "ko" && (xn || Y !== "onCompositionStart" ? Y === "onCompositionEnd" && xn && (V = Ps()) : (Ot = N, fi = "value" in Ot ? Ot.value : Ot.textContent, xn = !0)), B = br(y, Y), 0 < B.length && (Y = new Ls(Y, e, null, n, N), j.push({ event: Y, listeners: B }), V ? Y.data = V : (V = As(n), V !== null && (Y.data = V)))), (V = of ? sf(e, n) : uf(e, n)) && (y = br(y, "onBeforeInput"), 0 < y.length && (N = new Ls("onBeforeInput", "beforeinput", null, n, N), j.push({ event: N, listeners: y }), N.data = V));
      }
      lu(j, t);
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
  function ou(e, t, n, r, l) {
    for (var i = t._reactName, o = []; n !== null && n !== r; ) {
      var a = n, p = a.alternate, y = a.stateNode;
      if (p !== null && p === r) break;
      a.tag === 5 && y !== null && (a = y, l ? (p = Wn(n, i), p != null && o.unshift(ar(n, p, a))) : l || (p = Wn(n, i), p != null && o.push(ar(n, p, a)))), n = n.return;
    }
    o.length !== 0 && e.push({ event: t, listeners: o });
  }
  var Sf = /\r\n?/g, Ef = /\u0000|\uFFFD/g;
  function su(e) {
    return (typeof e == "string" ? e : "" + e).replace(Sf, `
`).replace(Ef, "");
  }
  function el(e, t, n) {
    if (t = su(t), su(e) !== t && n) throw Error(s(425));
  }
  function tl() {
  }
  var zi = null, Pi = null;
  function Ti(e, t) {
    return e === "textarea" || e === "noscript" || typeof t.children == "string" || typeof t.children == "number" || typeof t.dangerouslySetInnerHTML == "object" && t.dangerouslySetInnerHTML !== null && t.dangerouslySetInnerHTML.__html != null;
  }
  var Ri = typeof setTimeout == "function" ? setTimeout : void 0, Cf = typeof clearTimeout == "function" ? clearTimeout : void 0, uu = typeof Promise == "function" ? Promise : void 0, _f = typeof queueMicrotask == "function" ? queueMicrotask : typeof uu < "u" ? function(e) {
    return uu.resolve(null).then(e).catch(Nf);
  } : Ri;
  function Nf(e) {
    setTimeout(function() {
      throw e;
    });
  }
  function Li(e, t) {
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
  function au(e) {
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
  var En = Math.random().toString(36).slice(2), kt = "__reactFiber$" + En, cr = "__reactProps$" + En, _t = "__reactContainer$" + En, Mi = "__reactEvents$" + En, jf = "__reactListeners$" + En, zf = "__reactHandles$" + En;
  function en(e) {
    var t = e[kt];
    if (t) return t;
    for (var n = e.parentNode; n; ) {
      if (t = n[_t] || n[kt]) {
        if (n = t.alternate, t.child !== null || n !== null && n.child !== null) for (e = au(e); e !== null; ) {
          if (n = e[kt]) return n;
          e = au(e);
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
  function Cn(e) {
    if (e.tag === 5 || e.tag === 6) return e.stateNode;
    throw Error(s(33));
  }
  function nl(e) {
    return e[cr] || null;
  }
  var Ii = [], _n = -1;
  function Ht(e) {
    return { current: e };
  }
  function ve(e) {
    0 > _n || (e.current = Ii[_n], Ii[_n] = null, _n--);
  }
  function pe(e, t) {
    _n++, Ii[_n] = e.current, e.current = t;
  }
  var $t = {}, $e = Ht($t), Xe = Ht(!1), tn = $t;
  function Nn(e, t) {
    var n = e.type.contextTypes;
    if (!n) return $t;
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
    ve(Xe), ve($e);
  }
  function cu(e, t, n) {
    if ($e.current !== $t) throw Error(s(168));
    pe($e, t), pe(Xe, n);
  }
  function fu(e, t, n) {
    var r = e.stateNode;
    if (t = t.childContextTypes, typeof r.getChildContext != "function") return n;
    r = r.getChildContext();
    for (var l in r) if (!(l in t)) throw Error(s(108, se(e) || "Unknown", l));
    return k({}, n, r);
  }
  function ll(e) {
    return e = (e = e.stateNode) && e.__reactInternalMemoizedMergedChildContext || $t, tn = $e.current, pe($e, e), pe(Xe, Xe.current), !0;
  }
  function du(e, t, n) {
    var r = e.stateNode;
    if (!r) throw Error(s(169));
    n ? (e = fu(e, t, tn), r.__reactInternalMemoizedMergedChildContext = e, ve(Xe), ve($e), pe($e, e)) : ve(Xe), pe(Xe, n);
  }
  var Nt = null, il = !1, Di = !1;
  function pu(e) {
    Nt === null ? Nt = [e] : Nt.push(e);
  }
  function Pf(e) {
    il = !0, pu(e);
  }
  function Bt() {
    if (!Di && Nt !== null) {
      Di = !0;
      var e = 0, t = de;
      try {
        var n = Nt;
        for (de = 1; e < n.length; e++) {
          var r = n[e];
          do
            r = r(!0);
          while (r !== null);
        }
        Nt = null, il = !1;
      } catch (l) {
        throw Nt !== null && (Nt = Nt.slice(e + 1)), ms(ri, Bt), l;
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
  function hu(e, t, n) {
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
    e.return !== null && (rn(e, 1), hu(e, 1, 0));
  }
  function Oi(e) {
    for (; e === ol; ) ol = jn[--zn], jn[zn] = null, sl = jn[--zn], jn[zn] = null;
    for (; e === nn; ) nn = ot[--st], ot[st] = null, zt = ot[--st], ot[st] = null, jt = ot[--st], ot[st] = null;
  }
  var nt = null, rt = null, we = !1, mt = null;
  function mu(e, t) {
    var n = ft(5, null, null, 0);
    n.elementType = "DELETED", n.stateNode = t, n.return = e, t = e.deletions, t === null ? (e.deletions = [n], e.flags |= 16) : t.push(n);
  }
  function vu(e, t) {
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
        if (!vu(e, t)) {
          if (Ai(e)) throw Error(s(418));
          t = Ut(n.nextSibling);
          var r = nt;
          t && vu(e, t) ? mu(r, n) : (e.flags = e.flags & -4097 | 2, we = !1, nt = e);
        }
      } else {
        if (Ai(e)) throw Error(s(418));
        e.flags = e.flags & -4097 | 2, we = !1, nt = e;
      }
    }
  }
  function gu(e) {
    for (e = e.return; e !== null && e.tag !== 5 && e.tag !== 3 && e.tag !== 13; ) e = e.return;
    nt = e;
  }
  function ul(e) {
    if (e !== nt) return !1;
    if (!we) return gu(e), we = !0, !1;
    var t;
    if ((t = e.tag !== 3) && !(t = e.tag !== 5) && (t = e.type, t = t !== "head" && t !== "body" && !Ti(e.type, e.memoizedProps)), t && (t = rt)) {
      if (Ai(e)) throw yu(), Error(s(418));
      for (; t; ) mu(e, t), t = Ut(t.nextSibling);
    }
    if (gu(e), e.tag === 13) {
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
  function yu() {
    for (var e = rt; e; ) e = Ut(e.nextSibling);
  }
  function Pn() {
    rt = nt = null, we = !1;
  }
  function Hi(e) {
    mt === null ? mt = [e] : mt.push(e);
  }
  var Tf = he.ReactCurrentBatchConfig;
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
          var a = l.refs;
          o === null ? delete a[i] : a[i] = o;
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
  function xu(e) {
    var t = e._init;
    return t(e._payload);
  }
  function wu(e) {
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
    function a(m, h, v, P) {
      return h === null || h.tag !== 6 ? (h = Lo(v, m.mode, P), h.return = m, h) : (h = l(h, v), h.return = m, h);
    }
    function p(m, h, v, P) {
      var U = v.type;
      return U === ce ? N(m, h, v.props.children, P, v.key) : h !== null && (h.elementType === U || typeof U == "object" && U !== null && U.$$typeof === Ie && xu(U) === h.type) ? (P = l(h, v.props), P.ref = dr(m, h, v), P.return = m, P) : (P = Ml(v.type, v.key, v.props, null, m.mode, P), P.ref = dr(m, h, v), P.return = m, P);
    }
    function y(m, h, v, P) {
      return h === null || h.tag !== 4 || h.stateNode.containerInfo !== v.containerInfo || h.stateNode.implementation !== v.implementation ? (h = Mo(v, m.mode, P), h.return = m, h) : (h = l(h, v.children || []), h.return = m, h);
    }
    function N(m, h, v, P, U) {
      return h === null || h.tag !== 7 ? (h = dn(v, m.mode, P, U), h.return = m, h) : (h = l(h, v), h.return = m, h);
    }
    function j(m, h, v) {
      if (typeof h == "string" && h !== "" || typeof h == "number") return h = Lo("" + h, m.mode, v), h.return = m, h;
      if (typeof h == "object" && h !== null) {
        switch (h.$$typeof) {
          case Te:
            return v = Ml(h.type, h.key, h.props, null, m.mode, v), v.ref = dr(m, null, h), v.return = m, v;
          case $:
            return h = Mo(h, m.mode, v), h.return = m, h;
          case Ie:
            var P = h._init;
            return j(m, P(h._payload), v);
        }
        if ($n(h) || x(h)) return h = dn(h, m.mode, v, null), h.return = m, h;
        al(m, h);
      }
      return null;
    }
    function _(m, h, v, P) {
      var U = h !== null ? h.key : null;
      if (typeof v == "string" && v !== "" || typeof v == "number") return U !== null ? null : a(m, h, "" + v, P);
      if (typeof v == "object" && v !== null) {
        switch (v.$$typeof) {
          case Te:
            return v.key === U ? p(m, h, v, P) : null;
          case $:
            return v.key === U ? y(m, h, v, P) : null;
          case Ie:
            return U = v._init, _(
              m,
              h,
              U(v._payload),
              P
            );
        }
        if ($n(v) || x(v)) return U !== null ? null : N(m, h, v, P, null);
        al(m, v);
      }
      return null;
    }
    function M(m, h, v, P, U) {
      if (typeof P == "string" && P !== "" || typeof P == "number") return m = m.get(v) || null, a(h, m, "" + P, U);
      if (typeof P == "object" && P !== null) {
        switch (P.$$typeof) {
          case Te:
            return m = m.get(P.key === null ? v : P.key) || null, p(h, m, P, U);
          case $:
            return m = m.get(P.key === null ? v : P.key) || null, y(h, m, P, U);
          case Ie:
            var B = P._init;
            return M(m, h, v, B(P._payload), U);
        }
        if ($n(P) || x(P)) return m = m.get(v) || null, N(h, m, P, U, null);
        al(h, P);
      }
      return null;
    }
    function O(m, h, v, P) {
      for (var U = null, B = null, V = h, Y = h = 0, Oe = null; V !== null && Y < v.length; Y++) {
        V.index > Y ? (Oe = V, V = null) : Oe = V.sibling;
        var fe = _(m, V, v[Y], P);
        if (fe === null) {
          V === null && (V = Oe);
          break;
        }
        e && V && fe.alternate === null && t(m, V), h = i(fe, h, Y), B === null ? U = fe : B.sibling = fe, B = fe, V = Oe;
      }
      if (Y === v.length) return n(m, V), we && rn(m, Y), U;
      if (V === null) {
        for (; Y < v.length; Y++) V = j(m, v[Y], P), V !== null && (h = i(V, h, Y), B === null ? U = V : B.sibling = V, B = V);
        return we && rn(m, Y), U;
      }
      for (V = r(m, V); Y < v.length; Y++) Oe = M(V, m, Y, v[Y], P), Oe !== null && (e && Oe.alternate !== null && V.delete(Oe.key === null ? Y : Oe.key), h = i(Oe, h, Y), B === null ? U = Oe : B.sibling = Oe, B = Oe);
      return e && V.forEach(function(Jt) {
        return t(m, Jt);
      }), we && rn(m, Y), U;
    }
    function A(m, h, v, P) {
      var U = x(v);
      if (typeof U != "function") throw Error(s(150));
      if (v = U.call(v), v == null) throw Error(s(151));
      for (var B = U = null, V = h, Y = h = 0, Oe = null, fe = v.next(); V !== null && !fe.done; Y++, fe = v.next()) {
        V.index > Y ? (Oe = V, V = null) : Oe = V.sibling;
        var Jt = _(m, V, fe.value, P);
        if (Jt === null) {
          V === null && (V = Oe);
          break;
        }
        e && V && Jt.alternate === null && t(m, V), h = i(Jt, h, Y), B === null ? U = Jt : B.sibling = Jt, B = Jt, V = Oe;
      }
      if (fe.done) return n(
        m,
        V
      ), we && rn(m, Y), U;
      if (V === null) {
        for (; !fe.done; Y++, fe = v.next()) fe = j(m, fe.value, P), fe !== null && (h = i(fe, h, Y), B === null ? U = fe : B.sibling = fe, B = fe);
        return we && rn(m, Y), U;
      }
      for (V = r(m, V); !fe.done; Y++, fe = v.next()) fe = M(V, m, Y, fe.value, P), fe !== null && (e && fe.alternate !== null && V.delete(fe.key === null ? Y : fe.key), h = i(fe, h, Y), B === null ? U = fe : B.sibling = fe, B = fe);
      return e && V.forEach(function(ad) {
        return t(m, ad);
      }), we && rn(m, Y), U;
    }
    function Ne(m, h, v, P) {
      if (typeof v == "object" && v !== null && v.type === ce && v.key === null && (v = v.props.children), typeof v == "object" && v !== null) {
        switch (v.$$typeof) {
          case Te:
            e: {
              for (var U = v.key, B = h; B !== null; ) {
                if (B.key === U) {
                  if (U = v.type, U === ce) {
                    if (B.tag === 7) {
                      n(m, B.sibling), h = l(B, v.props.children), h.return = m, m = h;
                      break e;
                    }
                  } else if (B.elementType === U || typeof U == "object" && U !== null && U.$$typeof === Ie && xu(U) === B.type) {
                    n(m, B.sibling), h = l(B, v.props), h.ref = dr(m, B, v), h.return = m, m = h;
                    break e;
                  }
                  n(m, B);
                  break;
                } else t(m, B);
                B = B.sibling;
              }
              v.type === ce ? (h = dn(v.props.children, m.mode, P, v.key), h.return = m, m = h) : (P = Ml(v.type, v.key, v.props, null, m.mode, P), P.ref = dr(m, h, v), P.return = m, m = P);
            }
            return o(m);
          case $:
            e: {
              for (B = v.key; h !== null; ) {
                if (h.key === B) if (h.tag === 4 && h.stateNode.containerInfo === v.containerInfo && h.stateNode.implementation === v.implementation) {
                  n(m, h.sibling), h = l(h, v.children || []), h.return = m, m = h;
                  break e;
                } else {
                  n(m, h);
                  break;
                }
                else t(m, h);
                h = h.sibling;
              }
              h = Mo(v, m.mode, P), h.return = m, m = h;
            }
            return o(m);
          case Ie:
            return B = v._init, Ne(m, h, B(v._payload), P);
        }
        if ($n(v)) return O(m, h, v, P);
        if (x(v)) return A(m, h, v, P);
        al(m, v);
      }
      return typeof v == "string" && v !== "" || typeof v == "number" ? (v = "" + v, h !== null && h.tag === 6 ? (n(m, h.sibling), h = l(h, v), h.return = m, m = h) : (n(m, h), h = Lo(v, m.mode, P), h.return = m, m = h), o(m)) : n(m, h);
    }
    return Ne;
  }
  var Tn = wu(!0), ku = wu(!1), cl = Ht(null), fl = null, Rn = null, $i = null;
  function Bi() {
    $i = Rn = fl = null;
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
  function Ln(e, t) {
    fl = e, $i = Rn = null, e = e.dependencies, e !== null && e.firstContext !== null && ((e.lanes & t) !== 0 && (Je = !0), e.firstContext = null);
  }
  function ut(e) {
    var t = e._currentValue;
    if ($i !== e) if (e = { context: e, memoizedValue: t, next: null }, Rn === null) {
      if (fl === null) throw Error(s(308));
      Rn = e, fl.dependencies = { lanes: 0, firstContext: e };
    } else Rn = Rn.next = e;
    return t;
  }
  var ln = null;
  function Qi(e) {
    ln === null ? ln = [e] : ln.push(e);
  }
  function Su(e, t, n, r) {
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
  function Eu(e, t) {
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
    var i = l.firstBaseUpdate, o = l.lastBaseUpdate, a = l.shared.pending;
    if (a !== null) {
      l.shared.pending = null;
      var p = a, y = p.next;
      p.next = null, o === null ? i = y : o.next = y, o = p;
      var N = e.alternate;
      N !== null && (N = N.updateQueue, a = N.lastBaseUpdate, a !== o && (a === null ? N.firstBaseUpdate = y : a.next = y, N.lastBaseUpdate = p));
    }
    if (i !== null) {
      var j = l.baseState;
      o = 0, N = y = p = null, a = i;
      do {
        var _ = a.lane, M = a.eventTime;
        if ((r & _) === _) {
          N !== null && (N = N.next = {
            eventTime: M,
            lane: 0,
            tag: a.tag,
            payload: a.payload,
            callback: a.callback,
            next: null
          });
          e: {
            var O = e, A = a;
            switch (_ = t, M = n, A.tag) {
              case 1:
                if (O = A.payload, typeof O == "function") {
                  j = O.call(M, j, _);
                  break e;
                }
                j = O;
                break e;
              case 3:
                O.flags = O.flags & -65537 | 128;
              case 0:
                if (O = A.payload, _ = typeof O == "function" ? O.call(M, j, _) : O, _ == null) break e;
                j = k({}, j, _);
                break e;
              case 2:
                Vt = !0;
            }
          }
          a.callback !== null && a.lane !== 0 && (e.flags |= 64, _ = l.effects, _ === null ? l.effects = [a] : _.push(a));
        } else M = { eventTime: M, lane: _, tag: a.tag, payload: a.payload, callback: a.callback, next: null }, N === null ? (y = N = M, p = j) : N = N.next = M, o |= _;
        if (a = a.next, a === null) {
          if (a = l.shared.pending, a === null) break;
          _ = a, a = _.next, _.next = null, l.lastBaseUpdate = _, l.shared.pending = null;
        }
      } while (!0);
      if (N === null && (p = j), l.baseState = p, l.firstBaseUpdate = y, l.lastBaseUpdate = N, t = l.shared.interleaved, t !== null) {
        l = t;
        do
          o |= l.lane, l = l.next;
        while (l !== t);
      } else i === null && (l.shared.lanes = 0);
      un |= o, e.lanes = o, e.memoizedState = j;
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
  var pr = {}, St = Ht(pr), hr = Ht(pr), mr = Ht(pr);
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
  function Mn() {
    ve(St), ve(hr), ve(mr);
  }
  function Nu(e) {
    on(mr.current);
    var t = on(St.current), n = Yl(t, e.type);
    t !== n && (pe(hr, e), pe(St, n));
  }
  function Yi(e) {
    hr.current === e && (ve(St), ve(hr));
  }
  var ke = Ht(0);
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
  var ml = he.ReactCurrentDispatcher, Ji = he.ReactCurrentBatchConfig, sn = 0, Se = null, Re = null, De = null, vl = !1, vr = !1, gr = 0, Rf = 0;
  function Be() {
    throw Error(s(321));
  }
  function qi(e, t) {
    if (t === null) return !1;
    for (var n = 0; n < t.length && n < e.length; n++) if (!ht(e[n], t[n])) return !1;
    return !0;
  }
  function bi(e, t, n, r, l, i) {
    if (sn = i, Se = t, t.memoizedState = null, t.updateQueue = null, t.lanes = 0, ml.current = e === null || e.memoizedState === null ? Df : Ff, e = n(r, l), vr) {
      i = 0;
      do {
        if (vr = !1, gr = 0, 25 <= i) throw Error(s(301));
        i += 1, De = Re = null, t.updateQueue = null, ml.current = Of, e = n(r, l);
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
      var a = o = null, p = null, y = i;
      do {
        var N = y.lane;
        if ((sn & N) === N) p !== null && (p = p.next = { lane: 0, action: y.action, hasEagerState: y.hasEagerState, eagerState: y.eagerState, next: null }), r = y.hasEagerState ? y.eagerState : e(r, y.action);
        else {
          var j = {
            lane: N,
            action: y.action,
            hasEagerState: y.hasEagerState,
            eagerState: y.eagerState,
            next: null
          };
          p === null ? (a = p = j, o = r) : p = p.next = j, Se.lanes |= N, un |= N;
        }
        y = y.next;
      } while (y !== null && y !== i);
      p === null ? o = r : p.next = a, ht(r, t.memoizedState) || (Je = !0), t.memoizedState = r, t.baseState = o, t.baseQueue = p, n.lastRenderedState = r;
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
  function ju() {
  }
  function zu(e, t) {
    var n = Se, r = at(), l = t(), i = !ht(r.memoizedState, l);
    if (i && (r.memoizedState = l, Je = !0), r = r.queue, ro(Ru.bind(null, n, r, e), [e]), r.getSnapshot !== t || i || De !== null && De.memoizedState.tag & 1) {
      if (n.flags |= 2048, xr(9, Tu.bind(null, n, r, l, t), void 0, null), Fe === null) throw Error(s(349));
      (sn & 30) !== 0 || Pu(n, t, l);
    }
    return l;
  }
  function Pu(e, t, n) {
    e.flags |= 16384, e = { getSnapshot: t, value: n }, t = Se.updateQueue, t === null ? (t = { lastEffect: null, stores: null }, Se.updateQueue = t, t.stores = [e]) : (n = t.stores, n === null ? t.stores = [e] : n.push(e));
  }
  function Tu(e, t, n, r) {
    t.value = n, t.getSnapshot = r, Lu(t) && Mu(e);
  }
  function Ru(e, t, n) {
    return n(function() {
      Lu(t) && Mu(e);
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
  function Mu(e) {
    var t = Pt(e, 1);
    t !== null && xt(t, e, 1, -1);
  }
  function Iu(e) {
    var t = Et();
    return typeof e == "function" && (e = e()), t.memoizedState = t.baseState = e, e = { pending: null, interleaved: null, lanes: 0, dispatch: null, lastRenderedReducer: yr, lastRenderedState: e }, t.queue = e, e = e.dispatch = If.bind(null, Se, e), [t.memoizedState, e];
  }
  function xr(e, t, n, r) {
    return e = { tag: e, create: t, destroy: n, deps: r, next: null }, t = Se.updateQueue, t === null ? (t = { lastEffect: null, stores: null }, Se.updateQueue = t, t.lastEffect = e.next = e) : (n = t.lastEffect, n === null ? t.lastEffect = e.next = e : (r = n.next, n.next = e, e.next = r, t.lastEffect = e)), e;
  }
  function Du() {
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
  function Fu(e, t) {
    return gl(8390656, 8, e, t);
  }
  function ro(e, t) {
    return yl(2048, 8, e, t);
  }
  function Ou(e, t) {
    return yl(4, 2, e, t);
  }
  function Au(e, t) {
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
  function $u(e, t) {
    var n = at();
    t = t === void 0 ? null : t;
    var r = n.memoizedState;
    return r !== null && t !== null && qi(t, r[1]) ? r[0] : (n.memoizedState = [e, t], e);
  }
  function Bu(e, t) {
    var n = at();
    t = t === void 0 ? null : t;
    var r = n.memoizedState;
    return r !== null && t !== null && qi(t, r[1]) ? r[0] : (e = e(), n.memoizedState = [e, t], e);
  }
  function Vu(e, t, n) {
    return (sn & 21) === 0 ? (e.baseState && (e.baseState = !1, Je = !0), e.memoizedState = n) : (ht(n, t) || (n = xs(), Se.lanes |= n, un |= n, e.baseState = !0), t);
  }
  function Lf(e, t) {
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
  function Wu() {
    return at().memoizedState;
  }
  function Mf(e, t, n) {
    var r = Yt(e);
    if (n = { lane: r, action: n, hasEagerState: !1, eagerState: null, next: null }, Qu(e)) Ku(t, n);
    else if (n = Su(e, t, n, r), n !== null) {
      var l = Ke();
      xt(n, e, r, l), Gu(n, t, r);
    }
  }
  function If(e, t, n) {
    var r = Yt(e), l = { lane: r, action: n, hasEagerState: !1, eagerState: null, next: null };
    if (Qu(e)) Ku(t, l);
    else {
      var i = e.alternate;
      if (e.lanes === 0 && (i === null || i.lanes === 0) && (i = t.lastRenderedReducer, i !== null)) try {
        var o = t.lastRenderedState, a = i(o, n);
        if (l.hasEagerState = !0, l.eagerState = a, ht(a, o)) {
          var p = t.interleaved;
          p === null ? (l.next = l, Qi(t)) : (l.next = p.next, p.next = l), t.interleaved = l;
          return;
        }
      } catch {
      } finally {
      }
      n = Su(e, t, l, r), n !== null && (l = Ke(), xt(n, e, r, l), Gu(n, t, r));
    }
  }
  function Qu(e) {
    var t = e.alternate;
    return e === Se || t !== null && t === Se;
  }
  function Ku(e, t) {
    vr = vl = !0;
    var n = e.pending;
    n === null ? t.next = t : (t.next = n.next, n.next = t), e.pending = t;
  }
  function Gu(e, t, n) {
    if ((n & 4194240) !== 0) {
      var r = t.lanes;
      r &= e.pendingLanes, n |= r, t.lanes = n, oi(e, n);
    }
  }
  var xl = { readContext: ut, useCallback: Be, useContext: Be, useEffect: Be, useImperativeHandle: Be, useInsertionEffect: Be, useLayoutEffect: Be, useMemo: Be, useReducer: Be, useRef: Be, useState: Be, useDebugValue: Be, useDeferredValue: Be, useTransition: Be, useMutableSource: Be, useSyncExternalStore: Be, useId: Be, unstable_isNewReconciler: !1 }, Df = { readContext: ut, useCallback: function(e, t) {
    return Et().memoizedState = [e, t === void 0 ? null : t], e;
  }, useContext: ut, useEffect: Fu, useImperativeHandle: function(e, t, n) {
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
    return t = n !== void 0 ? n(t) : t, r.memoizedState = r.baseState = t, e = { pending: null, interleaved: null, lanes: 0, dispatch: null, lastRenderedReducer: e, lastRenderedState: t }, r.queue = e, e = e.dispatch = Mf.bind(null, Se, e), [r.memoizedState, e];
  }, useRef: function(e) {
    var t = Et();
    return e = { current: e }, t.memoizedState = e;
  }, useState: Iu, useDebugValue: lo, useDeferredValue: function(e) {
    return Et().memoizedState = e;
  }, useTransition: function() {
    var e = Iu(!1), t = e[0];
    return e = Lf.bind(null, e[1]), Et().memoizedState = e, [t, e];
  }, useMutableSource: function() {
  }, useSyncExternalStore: function(e, t, n) {
    var r = Se, l = Et();
    if (we) {
      if (n === void 0) throw Error(s(407));
      n = n();
    } else {
      if (n = t(), Fe === null) throw Error(s(349));
      (sn & 30) !== 0 || Pu(r, t, n);
    }
    l.memoizedState = n;
    var i = { value: n, getSnapshot: t };
    return l.queue = i, Fu(Ru.bind(
      null,
      r,
      i,
      e
    ), [e]), r.flags |= 2048, xr(9, Tu.bind(null, r, i, n, t), void 0, null), n;
  }, useId: function() {
    var e = Et(), t = Fe.identifierPrefix;
    if (we) {
      var n = zt, r = jt;
      n = (r & ~(1 << 32 - pt(r) - 1)).toString(32) + n, t = ":" + t + "R" + n, n = gr++, 0 < n && (t += "H" + n.toString(32)), t += ":";
    } else n = Rf++, t = ":" + t + "r" + n.toString(32) + ":";
    return e.memoizedState = t;
  }, unstable_isNewReconciler: !1 }, Ff = {
    readContext: ut,
    useCallback: $u,
    useContext: ut,
    useEffect: ro,
    useImperativeHandle: Hu,
    useInsertionEffect: Ou,
    useLayoutEffect: Au,
    useMemo: Bu,
    useReducer: to,
    useRef: Du,
    useState: function() {
      return to(yr);
    },
    useDebugValue: lo,
    useDeferredValue: function(e) {
      var t = at();
      return Vu(t, Re.memoizedState, e);
    },
    useTransition: function() {
      var e = to(yr)[0], t = at().memoizedState;
      return [e, t];
    },
    useMutableSource: ju,
    useSyncExternalStore: zu,
    useId: Wu,
    unstable_isNewReconciler: !1
  }, Of = { readContext: ut, useCallback: $u, useContext: ut, useEffect: ro, useImperativeHandle: Hu, useInsertionEffect: Ou, useLayoutEffect: Au, useMemo: Bu, useReducer: no, useRef: Du, useState: function() {
    return no(yr);
  }, useDebugValue: lo, useDeferredValue: function(e) {
    var t = at();
    return Re === null ? t.memoizedState = e : Vu(t, Re.memoizedState, e);
  }, useTransition: function() {
    var e = no(yr)[0], t = at().memoizedState;
    return [e, t];
  }, useMutableSource: ju, useSyncExternalStore: zu, useId: Wu, unstable_isNewReconciler: !1 };
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
  function Yu(e, t, n, r, l, i, o) {
    return e = e.stateNode, typeof e.shouldComponentUpdate == "function" ? e.shouldComponentUpdate(r, i, o) : t.prototype && t.prototype.isPureReactComponent ? !ir(n, r) || !ir(l, i) : !0;
  }
  function Xu(e, t, n) {
    var r = !1, l = $t, i = t.contextType;
    return typeof i == "object" && i !== null ? i = ut(i) : (l = Ze(t) ? tn : $e.current, r = t.contextTypes, i = (r = r != null) ? Nn(e, l) : $t), t = new t(n, i), e.memoizedState = t.state !== null && t.state !== void 0 ? t.state : null, t.updater = wl, e.stateNode = t, t._reactInternals = e, r && (e = e.stateNode, e.__reactInternalMemoizedUnmaskedChildContext = l, e.__reactInternalMemoizedMaskedChildContext = i), t;
  }
  function Zu(e, t, n, r) {
    e = t.state, typeof t.componentWillReceiveProps == "function" && t.componentWillReceiveProps(n, r), typeof t.UNSAFE_componentWillReceiveProps == "function" && t.UNSAFE_componentWillReceiveProps(n, r), t.state !== e && wl.enqueueReplaceState(t, t.state, null);
  }
  function oo(e, t, n, r) {
    var l = e.stateNode;
    l.props = n, l.state = e.memoizedState, l.refs = {}, Ki(e);
    var i = t.contextType;
    typeof i == "object" && i !== null ? l.context = ut(i) : (i = Ze(t) ? tn : $e.current, l.context = Nn(e, i)), l.state = e.memoizedState, i = t.getDerivedStateFromProps, typeof i == "function" && (io(e, t, i, n), l.state = e.memoizedState), typeof t.getDerivedStateFromProps == "function" || typeof l.getSnapshotBeforeUpdate == "function" || typeof l.UNSAFE_componentWillMount != "function" && typeof l.componentWillMount != "function" || (t = l.state, typeof l.componentWillMount == "function" && l.componentWillMount(), typeof l.UNSAFE_componentWillMount == "function" && l.UNSAFE_componentWillMount(), t !== l.state && wl.enqueueReplaceState(l, l.state, null), pl(e, n, l, r), l.state = e.memoizedState), typeof l.componentDidMount == "function" && (e.flags |= 4194308);
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
  var Af = typeof WeakMap == "function" ? WeakMap : Map;
  function Ju(e, t, n) {
    n = Tt(-1, n), n.tag = 3, n.payload = { element: null };
    var r = t.value;
    return n.callback = function() {
      jl || (jl = !0, Co = r), uo(e, t);
    }, n;
  }
  function qu(e, t, n) {
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
  function bu(e, t, n) {
    var r = e.pingCache;
    if (r === null) {
      r = e.pingCache = new Af();
      var l = /* @__PURE__ */ new Set();
      r.set(t, l);
    } else l = r.get(t), l === void 0 && (l = /* @__PURE__ */ new Set(), r.set(t, l));
    l.has(n) || (l.add(n), e = qf.bind(null, e, t, n), t.then(e, e));
  }
  function ea(e) {
    do {
      var t;
      if ((t = e.tag === 13) && (t = e.memoizedState, t = t !== null ? t.dehydrated !== null : !0), t) return e;
      e = e.return;
    } while (e !== null);
    return null;
  }
  function ta(e, t, n, r, l) {
    return (e.mode & 1) === 0 ? (e === t ? e.flags |= 65536 : (e.flags |= 128, n.flags |= 131072, n.flags &= -52805, n.tag === 1 && (n.alternate === null ? n.tag = 17 : (t = Tt(-1, 1), t.tag = 2, Wt(n, t, 1))), n.lanes |= 1), e) : (e.flags |= 65536, e.lanes = l, e);
  }
  var Uf = he.ReactCurrentOwner, Je = !1;
  function Qe(e, t, n, r) {
    t.child = e === null ? ku(t, null, n, r) : Tn(t, e.child, n, r);
  }
  function na(e, t, n, r, l) {
    n = n.render;
    var i = t.ref;
    return Ln(t, l), r = bi(e, t, n, r, i, l), n = eo(), e !== null && !Je ? (t.updateQueue = e.updateQueue, t.flags &= -2053, e.lanes &= ~l, Rt(e, t, l)) : (we && n && Fi(t), t.flags |= 1, Qe(e, t, r, l), t.child);
  }
  function ra(e, t, n, r, l) {
    if (e === null) {
      var i = n.type;
      return typeof i == "function" && !Ro(i) && i.defaultProps === void 0 && n.compare === null && n.defaultProps === void 0 ? (t.tag = 15, t.type = i, la(e, t, i, r, l)) : (e = Ml(n.type, null, r, t, t.mode, l), e.ref = t.ref, e.return = t, t.child = e);
    }
    if (i = e.child, (e.lanes & l) === 0) {
      var o = i.memoizedProps;
      if (n = n.compare, n = n !== null ? n : ir, n(o, r) && e.ref === t.ref) return Rt(e, t, l);
    }
    return t.flags |= 1, e = Zt(i, r), e.ref = t.ref, e.return = t, t.child = e;
  }
  function la(e, t, n, r, l) {
    if (e !== null) {
      var i = e.memoizedProps;
      if (ir(i, r) && e.ref === t.ref) if (Je = !1, t.pendingProps = r = i, (e.lanes & l) !== 0) (e.flags & 131072) !== 0 && (Je = !0);
      else return t.lanes = e.lanes, Rt(e, t, l);
    }
    return ao(e, t, n, r, l);
  }
  function ia(e, t, n) {
    var r = t.pendingProps, l = r.children, i = e !== null ? e.memoizedState : null;
    if (r.mode === "hidden") if ((t.mode & 1) === 0) t.memoizedState = { baseLanes: 0, cachePool: null, transitions: null }, pe(Fn, lt), lt |= n;
    else {
      if ((n & 1073741824) === 0) return e = i !== null ? i.baseLanes | n : n, t.lanes = t.childLanes = 1073741824, t.memoizedState = { baseLanes: e, cachePool: null, transitions: null }, t.updateQueue = null, pe(Fn, lt), lt |= e, null;
      t.memoizedState = { baseLanes: 0, cachePool: null, transitions: null }, r = i !== null ? i.baseLanes : n, pe(Fn, lt), lt |= r;
    }
    else i !== null ? (r = i.baseLanes | n, t.memoizedState = null) : r = n, pe(Fn, lt), lt |= r;
    return Qe(e, t, l, n), t.child;
  }
  function oa(e, t) {
    var n = t.ref;
    (e === null && n !== null || e !== null && e.ref !== n) && (t.flags |= 512, t.flags |= 2097152);
  }
  function ao(e, t, n, r, l) {
    var i = Ze(n) ? tn : $e.current;
    return i = Nn(t, i), Ln(t, l), n = bi(e, t, n, r, i, l), r = eo(), e !== null && !Je ? (t.updateQueue = e.updateQueue, t.flags &= -2053, e.lanes &= ~l, Rt(e, t, l)) : (we && r && Fi(t), t.flags |= 1, Qe(e, t, n, l), t.child);
  }
  function sa(e, t, n, r, l) {
    if (Ze(n)) {
      var i = !0;
      ll(t);
    } else i = !1;
    if (Ln(t, l), t.stateNode === null) Sl(e, t), Xu(t, n, r), oo(t, n, r, l), r = !0;
    else if (e === null) {
      var o = t.stateNode, a = t.memoizedProps;
      o.props = a;
      var p = o.context, y = n.contextType;
      typeof y == "object" && y !== null ? y = ut(y) : (y = Ze(n) ? tn : $e.current, y = Nn(t, y));
      var N = n.getDerivedStateFromProps, j = typeof N == "function" || typeof o.getSnapshotBeforeUpdate == "function";
      j || typeof o.UNSAFE_componentWillReceiveProps != "function" && typeof o.componentWillReceiveProps != "function" || (a !== r || p !== y) && Zu(t, o, r, y), Vt = !1;
      var _ = t.memoizedState;
      o.state = _, pl(t, r, o, l), p = t.memoizedState, a !== r || _ !== p || Xe.current || Vt ? (typeof N == "function" && (io(t, n, N, r), p = t.memoizedState), (a = Vt || Yu(t, n, a, r, _, p, y)) ? (j || typeof o.UNSAFE_componentWillMount != "function" && typeof o.componentWillMount != "function" || (typeof o.componentWillMount == "function" && o.componentWillMount(), typeof o.UNSAFE_componentWillMount == "function" && o.UNSAFE_componentWillMount()), typeof o.componentDidMount == "function" && (t.flags |= 4194308)) : (typeof o.componentDidMount == "function" && (t.flags |= 4194308), t.memoizedProps = r, t.memoizedState = p), o.props = r, o.state = p, o.context = y, r = a) : (typeof o.componentDidMount == "function" && (t.flags |= 4194308), r = !1);
    } else {
      o = t.stateNode, Eu(e, t), a = t.memoizedProps, y = t.type === t.elementType ? a : vt(t.type, a), o.props = y, j = t.pendingProps, _ = o.context, p = n.contextType, typeof p == "object" && p !== null ? p = ut(p) : (p = Ze(n) ? tn : $e.current, p = Nn(t, p));
      var M = n.getDerivedStateFromProps;
      (N = typeof M == "function" || typeof o.getSnapshotBeforeUpdate == "function") || typeof o.UNSAFE_componentWillReceiveProps != "function" && typeof o.componentWillReceiveProps != "function" || (a !== j || _ !== p) && Zu(t, o, r, p), Vt = !1, _ = t.memoizedState, o.state = _, pl(t, r, o, l);
      var O = t.memoizedState;
      a !== j || _ !== O || Xe.current || Vt ? (typeof M == "function" && (io(t, n, M, r), O = t.memoizedState), (y = Vt || Yu(t, n, y, r, _, O, p) || !1) ? (N || typeof o.UNSAFE_componentWillUpdate != "function" && typeof o.componentWillUpdate != "function" || (typeof o.componentWillUpdate == "function" && o.componentWillUpdate(r, O, p), typeof o.UNSAFE_componentWillUpdate == "function" && o.UNSAFE_componentWillUpdate(r, O, p)), typeof o.componentDidUpdate == "function" && (t.flags |= 4), typeof o.getSnapshotBeforeUpdate == "function" && (t.flags |= 1024)) : (typeof o.componentDidUpdate != "function" || a === e.memoizedProps && _ === e.memoizedState || (t.flags |= 4), typeof o.getSnapshotBeforeUpdate != "function" || a === e.memoizedProps && _ === e.memoizedState || (t.flags |= 1024), t.memoizedProps = r, t.memoizedState = O), o.props = r, o.state = O, o.context = p, r = y) : (typeof o.componentDidUpdate != "function" || a === e.memoizedProps && _ === e.memoizedState || (t.flags |= 4), typeof o.getSnapshotBeforeUpdate != "function" || a === e.memoizedProps && _ === e.memoizedState || (t.flags |= 1024), r = !1);
    }
    return co(e, t, n, r, i, l);
  }
  function co(e, t, n, r, l, i) {
    oa(e, t);
    var o = (t.flags & 128) !== 0;
    if (!r && !o) return l && du(t, n, !1), Rt(e, t, i);
    r = t.stateNode, Uf.current = t;
    var a = o && typeof n.getDerivedStateFromError != "function" ? null : r.render();
    return t.flags |= 1, e !== null && o ? (t.child = Tn(t, e.child, null, i), t.child = Tn(t, null, a, i)) : Qe(e, t, a, i), t.memoizedState = r.state, l && du(t, n, !0), t.child;
  }
  function ua(e) {
    var t = e.stateNode;
    t.pendingContext ? cu(e, t.pendingContext, t.pendingContext !== t.context) : t.context && cu(e, t.context, !1), Gi(e, t.containerInfo);
  }
  function aa(e, t, n, r, l) {
    return Pn(), Hi(l), t.flags |= 256, Qe(e, t, n, r), t.child;
  }
  var fo = { dehydrated: null, treeContext: null, retryLane: 0 };
  function po(e) {
    return { baseLanes: e, cachePool: null, transitions: null };
  }
  function ca(e, t, n) {
    var r = t.pendingProps, l = ke.current, i = !1, o = (t.flags & 128) !== 0, a;
    if ((a = o) || (a = e !== null && e.memoizedState === null ? !1 : (l & 2) !== 0), a ? (i = !0, t.flags &= -129) : (e === null || e.memoizedState !== null) && (l |= 1), pe(ke, l & 1), e === null)
      return Ui(t), e = t.memoizedState, e !== null && (e = e.dehydrated, e !== null) ? ((t.mode & 1) === 0 ? t.lanes = 1 : e.data === "$!" ? t.lanes = 8 : t.lanes = 1073741824, null) : (o = r.children, e = r.fallback, i ? (r = t.mode, i = t.child, o = { mode: "hidden", children: o }, (r & 1) === 0 && i !== null ? (i.childLanes = 0, i.pendingProps = o) : i = Il(o, r, 0, null), e = dn(e, r, n, null), i.return = t, e.return = t, i.sibling = e, t.child = i, t.child.memoizedState = po(n), t.memoizedState = fo, e) : ho(t, o));
    if (l = e.memoizedState, l !== null && (a = l.dehydrated, a !== null)) return Hf(e, t, o, r, a, l, n);
    if (i) {
      i = r.fallback, o = t.mode, l = e.child, a = l.sibling;
      var p = { mode: "hidden", children: r.children };
      return (o & 1) === 0 && t.child !== l ? (r = t.child, r.childLanes = 0, r.pendingProps = p, t.deletions = null) : (r = Zt(l, p), r.subtreeFlags = l.subtreeFlags & 14680064), a !== null ? i = Zt(a, i) : (i = dn(i, o, n, null), i.flags |= 2), i.return = t, r.return = t, r.sibling = i, t.child = r, r = i, i = t.child, o = e.child.memoizedState, o = o === null ? po(n) : { baseLanes: o.baseLanes | n, cachePool: null, transitions: o.transitions }, i.memoizedState = o, i.childLanes = e.childLanes & ~n, t.memoizedState = fo, r;
    }
    return i = e.child, e = i.sibling, r = Zt(i, { mode: "visible", children: r.children }), (t.mode & 1) === 0 && (r.lanes = n), r.return = t, r.sibling = null, e !== null && (n = t.deletions, n === null ? (t.deletions = [e], t.flags |= 16) : n.push(e)), t.child = r, t.memoizedState = null, r;
  }
  function ho(e, t) {
    return t = Il({ mode: "visible", children: t }, e.mode, 0, null), t.return = e, e.child = t;
  }
  function kl(e, t, n, r) {
    return r !== null && Hi(r), Tn(t, e.child, null, n), e = ho(t, t.pendingProps.children), e.flags |= 2, t.memoizedState = null, e;
  }
  function Hf(e, t, n, r, l, i, o) {
    if (n)
      return t.flags & 256 ? (t.flags &= -257, r = so(Error(s(422))), kl(e, t, o, r)) : t.memoizedState !== null ? (t.child = e.child, t.flags |= 128, null) : (i = r.fallback, l = t.mode, r = Il({ mode: "visible", children: r.children }, l, 0, null), i = dn(i, l, o, null), i.flags |= 2, r.return = t, i.return = t, r.sibling = i, t.child = r, (t.mode & 1) !== 0 && Tn(t, e.child, null, o), t.child.memoizedState = po(o), t.memoizedState = fo, i);
    if ((t.mode & 1) === 0) return kl(e, t, o, null);
    if (l.data === "$!") {
      if (r = l.nextSibling && l.nextSibling.dataset, r) var a = r.dgst;
      return r = a, i = Error(s(419)), r = so(i, r, void 0), kl(e, t, o, r);
    }
    if (a = (o & e.childLanes) !== 0, Je || a) {
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
    return l.data === "$?" ? (t.flags |= 128, t.child = e.child, t = bf.bind(null, e), l._reactRetry = t, null) : (e = i.treeContext, rt = Ut(l.nextSibling), nt = t, we = !0, mt = null, e !== null && (ot[st++] = jt, ot[st++] = zt, ot[st++] = nn, jt = e.id, zt = e.overflow, nn = t), t = ho(t, r.children), t.flags |= 4096, t);
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
  function da(e, t, n) {
    var r = t.pendingProps, l = r.revealOrder, i = r.tail;
    if (Qe(e, t, r.children, n), r = ke.current, (r & 2) !== 0) r = r & 1 | 2, t.flags |= 128;
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
  function $f(e, t, n) {
    switch (t.tag) {
      case 3:
        ua(t), Pn();
        break;
      case 5:
        Nu(t);
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
          return r.dehydrated !== null ? (pe(ke, ke.current & 1), t.flags |= 128, null) : (n & t.child.childLanes) !== 0 ? ca(e, t, n) : (pe(ke, ke.current & 1), e = Rt(e, t, n), e !== null ? e.sibling : null);
        pe(ke, ke.current & 1);
        break;
      case 19:
        if (r = (n & t.childLanes) !== 0, (e.flags & 128) !== 0) {
          if (r) return da(e, t, n);
          t.flags |= 128;
        }
        if (l = t.memoizedState, l !== null && (l.rendering = null, l.tail = null, l.lastEffect = null), pe(ke, ke.current), r) break;
        return null;
      case 22:
      case 23:
        return t.lanes = 0, ia(e, t, n);
    }
    return Rt(e, t, n);
  }
  var pa, vo, ha, ma;
  pa = function(e, t) {
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
  }, ha = function(e, t, n, r) {
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
        var a = l[y];
        for (o in a) a.hasOwnProperty(o) && (n || (n = {}), n[o] = "");
      } else y !== "dangerouslySetInnerHTML" && y !== "children" && y !== "suppressContentEditableWarning" && y !== "suppressHydrationWarning" && y !== "autoFocus" && (E.hasOwnProperty(y) ? i || (i = []) : (i = i || []).push(y, null));
      for (y in r) {
        var p = r[y];
        if (a = l != null ? l[y] : void 0, r.hasOwnProperty(y) && p !== a && (p != null || a != null)) if (y === "style") if (a) {
          for (o in a) !a.hasOwnProperty(o) || p && p.hasOwnProperty(o) || (n || (n = {}), n[o] = "");
          for (o in p) p.hasOwnProperty(o) && a[o] !== p[o] && (n || (n = {}), n[o] = p[o]);
        } else n || (i || (i = []), i.push(
          y,
          n
        )), n = p;
        else y === "dangerouslySetInnerHTML" ? (p = p ? p.__html : void 0, a = a ? a.__html : void 0, p != null && a !== p && (i = i || []).push(y, p)) : y === "children" ? typeof p != "string" && typeof p != "number" || (i = i || []).push(y, "" + p) : y !== "suppressContentEditableWarning" && y !== "suppressHydrationWarning" && (E.hasOwnProperty(y) ? (p != null && y === "onScroll" && me("scroll", e), i || a === p || (i = [])) : (i = i || []).push(y, p));
      }
      n && (i = i || []).push("style", n);
      var y = i;
      (t.updateQueue = y) && (t.flags |= 4);
    }
  }, ma = function(e, t, n, r) {
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
  function Bf(e, t, n) {
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
        return r = t.stateNode, Mn(), ve(Xe), ve($e), Zi(), r.pendingContext && (r.context = r.pendingContext, r.pendingContext = null), (e === null || e.child === null) && (ul(t) ? t.flags |= 4 : e === null || e.memoizedState.isDehydrated && (t.flags & 256) === 0 || (t.flags |= 1024, mt !== null && (jo(mt), mt = null))), vo(e, t), Ve(t), null;
      case 5:
        Yi(t);
        var l = on(mr.current);
        if (n = t.type, e !== null && t.stateNode != null) ha(e, t, n, r, l), e.ref !== t.ref && (t.flags |= 512, t.flags |= 2097152);
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
                Xo(r, i), me("invalid", r);
                break;
              case "select":
                r._wrapperState = { wasMultiple: !!i.multiple }, me("invalid", r);
                break;
              case "textarea":
                qo(r, i), me("invalid", r);
            }
            Xl(n, i), l = null;
            for (var o in i) if (i.hasOwnProperty(o)) {
              var a = i[o];
              o === "children" ? typeof a == "string" ? r.textContent !== a && (i.suppressHydrationWarning !== !0 && el(r.textContent, a, e), l = ["children", a]) : typeof a == "number" && r.textContent !== "" + a && (i.suppressHydrationWarning !== !0 && el(
                r.textContent,
                a,
                e
              ), l = ["children", "" + a]) : E.hasOwnProperty(o) && a != null && o === "onScroll" && me("scroll", r);
            }
            switch (n) {
              case "input":
                dt(r), Jo(r, i, !0);
                break;
              case "textarea":
                dt(r), es(r);
                break;
              case "select":
              case "option":
                break;
              default:
                typeof i.onClick == "function" && (r.onclick = tl);
            }
            r = l, t.updateQueue = r, r !== null && (t.flags |= 4);
          } else {
            o = l.nodeType === 9 ? l : l.ownerDocument, e === "http://www.w3.org/1999/xhtml" && (e = ts(n)), e === "http://www.w3.org/1999/xhtml" ? n === "script" ? (e = o.createElement("div"), e.innerHTML = "<script><\/script>", e = e.removeChild(e.firstChild)) : typeof r.is == "string" ? e = o.createElement(n, { is: r.is }) : (e = o.createElement(n), n === "select" && (o = e, r.multiple ? o.multiple = !0 : r.size && (o.size = r.size))) : e = o.createElementNS(e, n), e[kt] = t, e[cr] = r, pa(e, t, !1, !1), t.stateNode = e;
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
                  Xo(e, r), l = Wl(e, r), me("invalid", e);
                  break;
                case "option":
                  l = r;
                  break;
                case "select":
                  e._wrapperState = { wasMultiple: !!r.multiple }, l = k({}, r, { value: void 0 }), me("invalid", e);
                  break;
                case "textarea":
                  qo(e, r), l = Gl(e, r), me("invalid", e);
                  break;
                default:
                  l = r;
              }
              Xl(n, l), a = l;
              for (i in a) if (a.hasOwnProperty(i)) {
                var p = a[i];
                i === "style" ? ls(e, p) : i === "dangerouslySetInnerHTML" ? (p = p ? p.__html : void 0, p != null && ns(e, p)) : i === "children" ? typeof p == "string" ? (n !== "textarea" || p !== "") && Bn(e, p) : typeof p == "number" && Bn(e, "" + p) : i !== "suppressContentEditableWarning" && i !== "suppressHydrationWarning" && i !== "autoFocus" && (E.hasOwnProperty(i) ? p != null && i === "onScroll" && me("scroll", e) : p != null && Pe(e, i, p, o));
              }
              switch (n) {
                case "input":
                  dt(e), Jo(e, r, !1);
                  break;
                case "textarea":
                  dt(e), es(e);
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
        if (e && t.stateNode != null) ma(e, t, e.memoizedProps, r);
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
          if (we && rt !== null && (t.mode & 1) !== 0 && (t.flags & 128) === 0) yu(), Pn(), t.flags |= 98560, i = !1;
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
        return (t.flags & 128) !== 0 ? (t.lanes = n, t) : (r = r !== null, r !== (e !== null && e.memoizedState !== null) && r && (t.child.flags |= 8192, (t.mode & 1) !== 0 && (e === null || (ke.current & 1) !== 0 ? Le === 0 && (Le = 3) : To())), t.updateQueue !== null && (t.flags |= 4), Ve(t), null);
      case 4:
        return Mn(), vo(e, t), e === null && ur(t.stateNode.containerInfo), Ve(t), null;
      case 10:
        return Vi(t.type._context), Ve(t), null;
      case 17:
        return Ze(t.type) && rl(), Ve(t), null;
      case 19:
        if (ve(ke), i = t.memoizedState, i === null) return Ve(t), null;
        if (r = (t.flags & 128) !== 0, o = i.rendering, o === null) if (r) wr(i, !1);
        else {
          if (Le !== 0 || e !== null && (e.flags & 128) !== 0) for (e = t.child; e !== null; ) {
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
  function Vf(e, t) {
    switch (Oi(t), t.tag) {
      case 1:
        return Ze(t.type) && rl(), e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
      case 3:
        return Mn(), ve(Xe), ve($e), Zi(), e = t.flags, (e & 65536) !== 0 && (e & 128) === 0 ? (t.flags = e & -65537 | 128, t) : null;
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
        return Mn(), null;
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
  var El = !1, We = !1, Wf = typeof WeakSet == "function" ? WeakSet : Set, F = null;
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
  var va = !1;
  function Qf(e, t) {
    if (zi = Vr, e = Ys(), wi(e)) {
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
          var o = 0, a = -1, p = -1, y = 0, N = 0, j = e, _ = null;
          t: for (; ; ) {
            for (var M; j !== n || l !== 0 && j.nodeType !== 3 || (a = o + l), j !== i || r !== 0 && j.nodeType !== 3 || (p = o + r), j.nodeType === 3 && (o += j.nodeValue.length), (M = j.firstChild) !== null; )
              _ = j, j = M;
            for (; ; ) {
              if (j === e) break t;
              if (_ === n && ++y === l && (a = o), _ === i && ++N === r && (p = o), (M = j.nextSibling) !== null) break;
              j = _, _ = j.parentNode;
            }
            j = M;
          }
          n = a === -1 || p === -1 ? null : { start: a, end: p };
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
              var A = O.memoizedProps, Ne = O.memoizedState, m = t.stateNode, h = m.getSnapshotBeforeUpdate(t.elementType === t.type ? A : vt(t.type, A), Ne);
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
      } catch (P) {
        Ce(t, t.return, P);
      }
      if (e = t.sibling, e !== null) {
        e.return = t.return, F = e;
        break;
      }
      F = t.return;
    }
    return O = va, va = !1, O;
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
  function Cl(e, t) {
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
  function ga(e) {
    var t = e.alternate;
    t !== null && (e.alternate = null, ga(t)), e.child = null, e.deletions = null, e.sibling = null, e.tag === 5 && (t = e.stateNode, t !== null && (delete t[kt], delete t[cr], delete t[Mi], delete t[jf], delete t[zf])), e.stateNode = null, e.return = null, e.dependencies = null, e.memoizedProps = null, e.memoizedState = null, e.pendingProps = null, e.stateNode = null, e.updateQueue = null;
  }
  function ya(e) {
    return e.tag === 5 || e.tag === 3 || e.tag === 4;
  }
  function xa(e) {
    e: for (; ; ) {
      for (; e.sibling === null; ) {
        if (e.return === null || ya(e.return)) return null;
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
    for (n = n.child; n !== null; ) wa(e, t, n), n = n.sibling;
  }
  function wa(e, t, n) {
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
        Ae !== null && (gt ? (e = Ae, n = n.stateNode, e.nodeType === 8 ? Li(e.parentNode, n) : e.nodeType === 1 && Li(e, n), bn(e)) : Li(Ae, n.stateNode));
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
        } catch (a) {
          Ce(n, t, a);
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
  function ka(e) {
    var t = e.updateQueue;
    if (t !== null) {
      e.updateQueue = null;
      var n = e.stateNode;
      n === null && (n = e.stateNode = new Wf()), t.forEach(function(r) {
        var l = ed.bind(null, e, r);
        n.has(r) || (n.add(r), r.then(l, l));
      });
    }
  }
  function yt(e, t) {
    var n = t.deletions;
    if (n !== null) for (var r = 0; r < n.length; r++) {
      var l = n[r];
      try {
        var i = e, o = t, a = o;
        e: for (; a !== null; ) {
          switch (a.tag) {
            case 5:
              Ae = a.stateNode, gt = !1;
              break e;
            case 3:
              Ae = a.stateNode.containerInfo, gt = !0;
              break e;
            case 4:
              Ae = a.stateNode.containerInfo, gt = !0;
              break e;
          }
          a = a.return;
        }
        if (Ae === null) throw Error(s(160));
        wa(i, o, l), Ae = null, gt = !1;
        var p = l.alternate;
        p !== null && (p.return = null), l.return = null;
      } catch (y) {
        Ce(l, t, y);
      }
    }
    if (t.subtreeFlags & 12854) for (t = t.child; t !== null; ) Sa(t, e), t = t.sibling;
  }
  function Sa(e, t) {
    var n = e.alternate, r = e.flags;
    switch (e.tag) {
      case 0:
      case 11:
      case 14:
      case 15:
        if (yt(t, e), Ct(e), r & 4) {
          try {
            kr(3, e, e.return), Cl(3, e);
          } catch (A) {
            Ce(e, e.return, A);
          }
          try {
            kr(5, e, e.return);
          } catch (A) {
            Ce(e, e.return, A);
          }
        }
        break;
      case 1:
        yt(t, e), Ct(e), r & 512 && n !== null && Dn(n, n.return);
        break;
      case 5:
        if (yt(t, e), Ct(e), r & 512 && n !== null && Dn(n, n.return), e.flags & 32) {
          var l = e.stateNode;
          try {
            Bn(l, "");
          } catch (A) {
            Ce(e, e.return, A);
          }
        }
        if (r & 4 && (l = e.stateNode, l != null)) {
          var i = e.memoizedProps, o = n !== null ? n.memoizedProps : i, a = e.type, p = e.updateQueue;
          if (e.updateQueue = null, p !== null) try {
            a === "input" && i.type === "radio" && i.name != null && Zo(l, i), Zl(a, o);
            var y = Zl(a, i);
            for (o = 0; o < p.length; o += 2) {
              var N = p[o], j = p[o + 1];
              N === "style" ? ls(l, j) : N === "dangerouslySetInnerHTML" ? ns(l, j) : N === "children" ? Bn(l, j) : Pe(l, N, j, y);
            }
            switch (a) {
              case "input":
                Ql(l, i);
                break;
              case "textarea":
                bo(l, i);
                break;
              case "select":
                var _ = l._wrapperState.wasMultiple;
                l._wrapperState.wasMultiple = !!i.multiple;
                var M = i.value;
                M != null ? hn(l, !!i.multiple, M, !1) : _ !== !!i.multiple && (i.defaultValue != null ? hn(
                  l,
                  !!i.multiple,
                  i.defaultValue,
                  !0
                ) : hn(l, !!i.multiple, i.multiple ? [] : "", !1));
            }
            l[cr] = i;
          } catch (A) {
            Ce(e, e.return, A);
          }
        }
        break;
      case 6:
        if (yt(t, e), Ct(e), r & 4) {
          if (e.stateNode === null) throw Error(s(162));
          l = e.stateNode, i = e.memoizedProps;
          try {
            l.nodeValue = i;
          } catch (A) {
            Ce(e, e.return, A);
          }
        }
        break;
      case 3:
        if (yt(t, e), Ct(e), r & 4 && n !== null && n.memoizedState.isDehydrated) try {
          bn(t.containerInfo);
        } catch (A) {
          Ce(e, e.return, A);
        }
        break;
      case 4:
        yt(t, e), Ct(e);
        break;
      case 13:
        yt(t, e), Ct(e), l = e.child, l.flags & 8192 && (i = l.memoizedState !== null, l.stateNode.isHidden = i, !i || l.alternate !== null && l.alternate.memoizedState !== null || (Eo = _e())), r & 4 && ka(e);
        break;
      case 22:
        if (N = n !== null && n.memoizedState !== null, e.mode & 1 ? (We = (y = We) || N, yt(t, e), We = y) : yt(t, e), Ct(e), r & 8192) {
          if (y = e.memoizedState !== null, (e.stateNode.isHidden = y) && !N && (e.mode & 1) !== 0) for (F = e, N = e.child; N !== null; ) {
            for (j = F = N; F !== null; ) {
              switch (_ = F, M = _.child, _.tag) {
                case 0:
                case 11:
                case 14:
                case 15:
                  kr(4, _, _.return);
                  break;
                case 1:
                  Dn(_, _.return);
                  var O = _.stateNode;
                  if (typeof O.componentWillUnmount == "function") {
                    r = _, n = _.return;
                    try {
                      t = r, O.props = t.memoizedProps, O.state = t.memoizedState, O.componentWillUnmount();
                    } catch (A) {
                      Ce(r, n, A);
                    }
                  }
                  break;
                case 5:
                  Dn(_, _.return);
                  break;
                case 22:
                  if (_.memoizedState !== null) {
                    _a(j);
                    continue;
                  }
              }
              M !== null ? (M.return = _, F = M) : _a(j);
            }
            N = N.sibling;
          }
          e: for (N = null, j = e; ; ) {
            if (j.tag === 5) {
              if (N === null) {
                N = j;
                try {
                  l = j.stateNode, y ? (i = l.style, typeof i.setProperty == "function" ? i.setProperty("display", "none", "important") : i.display = "none") : (a = j.stateNode, p = j.memoizedProps.style, o = p != null && p.hasOwnProperty("display") ? p.display : null, a.style.display = rs("display", o));
                } catch (A) {
                  Ce(e, e.return, A);
                }
              }
            } else if (j.tag === 6) {
              if (N === null) try {
                j.stateNode.nodeValue = y ? "" : j.memoizedProps;
              } catch (A) {
                Ce(e, e.return, A);
              }
            } else if ((j.tag !== 22 && j.tag !== 23 || j.memoizedState === null || j === e) && j.child !== null) {
              j.child.return = j, j = j.child;
              continue;
            }
            if (j === e) break e;
            for (; j.sibling === null; ) {
              if (j.return === null || j.return === e) break e;
              N === j && (N = null), j = j.return;
            }
            N === j && (N = null), j.sibling.return = j.return, j = j.sibling;
          }
        }
        break;
      case 19:
        yt(t, e), Ct(e), r & 4 && ka(e);
        break;
      case 21:
        break;
      default:
        yt(
          t,
          e
        ), Ct(e);
    }
  }
  function Ct(e) {
    var t = e.flags;
    if (t & 2) {
      try {
        e: {
          for (var n = e.return; n !== null; ) {
            if (ya(n)) {
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
            var i = xa(e);
            wo(e, i, l);
            break;
          case 3:
          case 4:
            var o = r.stateNode.containerInfo, a = xa(e);
            xo(e, a, o);
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
  function Kf(e, t, n) {
    F = e, Ea(e);
  }
  function Ea(e, t, n) {
    for (var r = (e.mode & 1) !== 0; F !== null; ) {
      var l = F, i = l.child;
      if (l.tag === 22 && r) {
        var o = l.memoizedState !== null || El;
        if (!o) {
          var a = l.alternate, p = a !== null && a.memoizedState !== null || We;
          a = El;
          var y = We;
          if (El = o, (We = p) && !y) for (F = l; F !== null; ) o = F, p = o.child, o.tag === 22 && o.memoizedState !== null ? Na(l) : p !== null ? (p.return = o, F = p) : Na(l);
          for (; i !== null; ) F = i, Ea(i), i = i.sibling;
          F = l, El = a, We = y;
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
              We || Cl(5, t);
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
              var a = t.stateNode;
              if (n === null && t.flags & 4) {
                n = a;
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
                  var N = y.memoizedState;
                  if (N !== null) {
                    var j = N.dehydrated;
                    j !== null && bn(j);
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
  function Na(e) {
    for (; F !== null; ) {
      var t = F;
      try {
        switch (t.tag) {
          case 0:
          case 11:
          case 15:
            var n = t.return;
            try {
              Cl(4, t);
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
      var a = t.sibling;
      if (a !== null) {
        a.return = t.return, F = a;
        break;
      }
      F = t.return;
    }
  }
  var Gf = Math.ceil, _l = he.ReactCurrentDispatcher, ko = he.ReactCurrentOwner, ct = he.ReactCurrentBatchConfig, ae = 0, Fe = null, ze = null, Ue = 0, lt = 0, Fn = Ht(0), Le = 0, Sr = null, un = 0, Nl = 0, So = 0, Er = null, qe = null, Eo = 0, On = 1 / 0, Lt = null, jl = !1, Co = null, Kt = null, zl = !1, Gt = null, Pl = 0, Cr = 0, _o = null, Tl = -1, Rl = 0;
  function Ke() {
    return (ae & 6) !== 0 ? _e() : Tl !== -1 ? Tl : Tl = _e();
  }
  function Yt(e) {
    return (e.mode & 1) === 0 ? 1 : (ae & 2) !== 0 && Ue !== 0 ? Ue & -Ue : Tf.transition !== null ? (Rl === 0 && (Rl = xs()), Rl) : (e = de, e !== 0 || (e = window.event, e = e === void 0 ? 16 : zs(e.type)), e);
  }
  function xt(e, t, n, r) {
    if (50 < Cr) throw Cr = 0, _o = null, Error(s(185));
    Yn(e, n, r), ((ae & 2) === 0 || e !== Fe) && (e === Fe && ((ae & 2) === 0 && (Nl |= n), Le === 4 && Xt(e, Ue)), be(e, r), n === 1 && ae === 0 && (t.mode & 1) === 0 && (On = _e() + 500, il && Bt()));
  }
  function be(e, t) {
    var n = e.callbackNode;
    Pc(e, t);
    var r = Hr(e, e === Fe ? Ue : 0);
    if (r === 0) n !== null && vs(n), e.callbackNode = null, e.callbackPriority = 0;
    else if (t = r & -r, e.callbackPriority !== t) {
      if (n != null && vs(n), t === 1) e.tag === 0 ? Pf(za.bind(null, e)) : pu(za.bind(null, e)), _f(function() {
        (ae & 6) === 0 && Bt();
      }), n = null;
      else {
        switch (ws(r)) {
          case 1:
            n = ri;
            break;
          case 4:
            n = gs;
            break;
          case 16:
            n = Fr;
            break;
          case 536870912:
            n = ys;
            break;
          default:
            n = Fr;
        }
        n = Fa(n, ja.bind(null, e));
      }
      e.callbackPriority = t, e.callbackNode = n;
    }
  }
  function ja(e, t) {
    if (Tl = -1, Rl = 0, (ae & 6) !== 0) throw Error(s(327));
    var n = e.callbackNode;
    if (An() && e.callbackNode !== n) return null;
    var r = Hr(e, e === Fe ? Ue : 0);
    if (r === 0) return null;
    if ((r & 30) !== 0 || (r & e.expiredLanes) !== 0 || t) t = Ll(e, r);
    else {
      t = r;
      var l = ae;
      ae |= 2;
      var i = Ta();
      (Fe !== e || Ue !== t) && (Lt = null, On = _e() + 500, cn(e, t));
      do
        try {
          Zf();
          break;
        } catch (a) {
          Pa(e, a);
        }
      while (!0);
      Bi(), _l.current = i, ae = l, ze !== null ? t = 0 : (Fe = null, Ue = 0, t = Le);
    }
    if (t !== 0) {
      if (t === 2 && (l = li(e), l !== 0 && (r = l, t = No(e, l))), t === 1) throw n = Sr, cn(e, 0), Xt(e, r), be(e, _e()), n;
      if (t === 6) Xt(e, r);
      else {
        if (l = e.current.alternate, (r & 30) === 0 && !Yf(l) && (t = Ll(e, r), t === 2 && (i = li(e), i !== 0 && (r = i, t = No(e, i))), t === 1)) throw n = Sr, cn(e, 0), Xt(e, r), be(e, _e()), n;
        switch (e.finishedWork = l, e.finishedLanes = r, t) {
          case 0:
          case 1:
            throw Error(s(345));
          case 2:
            fn(e, qe, Lt);
            break;
          case 3:
            if (Xt(e, r), (r & 130023424) === r && (t = Eo + 500 - _e(), 10 < t)) {
              if (Hr(e, 0) !== 0) break;
              if (l = e.suspendedLanes, (l & r) !== r) {
                Ke(), e.pingedLanes |= e.suspendedLanes & l;
                break;
              }
              e.timeoutHandle = Ri(fn.bind(null, e, qe, Lt), t);
              break;
            }
            fn(e, qe, Lt);
            break;
          case 4:
            if (Xt(e, r), (r & 4194240) === r) break;
            for (t = e.eventTimes, l = -1; 0 < r; ) {
              var o = 31 - pt(r);
              i = 1 << o, o = t[o], o > l && (l = o), r &= ~i;
            }
            if (r = l, r = _e() - r, r = (120 > r ? 120 : 480 > r ? 480 : 1080 > r ? 1080 : 1920 > r ? 1920 : 3e3 > r ? 3e3 : 4320 > r ? 4320 : 1960 * Gf(r / 1960)) - r, 10 < r) {
              e.timeoutHandle = Ri(fn.bind(null, e, qe, Lt), r);
              break;
            }
            fn(e, qe, Lt);
            break;
          case 5:
            fn(e, qe, Lt);
            break;
          default:
            throw Error(s(329));
        }
      }
    }
    return be(e, _e()), e.callbackNode === n ? ja.bind(null, e) : null;
  }
  function No(e, t) {
    var n = Er;
    return e.current.memoizedState.isDehydrated && (cn(e, t).flags |= 256), e = Ll(e, t), e !== 2 && (t = qe, qe = n, t !== null && jo(t)), e;
  }
  function jo(e) {
    qe === null ? qe = e : qe.push.apply(qe, e);
  }
  function Yf(e) {
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
    for (t &= ~So, t &= ~Nl, e.suspendedLanes |= t, e.pingedLanes &= ~t, e = e.expirationTimes; 0 < t; ) {
      var n = 31 - pt(t), r = 1 << n;
      e[n] = -1, t &= ~r;
    }
  }
  function za(e) {
    if ((ae & 6) !== 0) throw Error(s(327));
    An();
    var t = Hr(e, 0);
    if ((t & 1) === 0) return be(e, _e()), null;
    var n = Ll(e, t);
    if (e.tag !== 0 && n === 2) {
      var r = li(e);
      r !== 0 && (t = r, n = No(e, r));
    }
    if (n === 1) throw n = Sr, cn(e, 0), Xt(e, t), be(e, _e()), n;
    if (n === 6) throw Error(s(345));
    return e.finishedWork = e.current.alternate, e.finishedLanes = t, fn(e, qe, Lt), be(e, _e()), null;
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
    if (n !== -1 && (e.timeoutHandle = -1, Cf(n)), ze !== null) for (n = ze.return; n !== null; ) {
      var r = n;
      switch (Oi(r), r.tag) {
        case 1:
          r = r.type.childContextTypes, r != null && rl();
          break;
        case 3:
          Mn(), ve(Xe), ve($e), Zi();
          break;
        case 5:
          Yi(r);
          break;
        case 4:
          Mn();
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
    if (Fe = e, ze = e = Zt(e.current, null), Ue = lt = t, Le = 0, Sr = null, So = Nl = un = 0, qe = Er = null, ln !== null) {
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
          for (var r = Se.memoizedState; r !== null; ) {
            var l = r.queue;
            l !== null && (l.pending = null), r = r.next;
          }
          vl = !1;
        }
        if (sn = 0, De = Re = Se = null, vr = !1, gr = 0, ko.current = null, n === null || n.return === null) {
          Le = 1, Sr = t, ze = null;
          break;
        }
        e: {
          var i = e, o = n.return, a = n, p = t;
          if (t = Ue, a.flags |= 32768, p !== null && typeof p == "object" && typeof p.then == "function") {
            var y = p, N = a, j = N.tag;
            if ((N.mode & 1) === 0 && (j === 0 || j === 11 || j === 15)) {
              var _ = N.alternate;
              _ ? (N.updateQueue = _.updateQueue, N.memoizedState = _.memoizedState, N.lanes = _.lanes) : (N.updateQueue = null, N.memoizedState = null);
            }
            var M = ea(o);
            if (M !== null) {
              M.flags &= -257, ta(M, o, a, i, t), M.mode & 1 && bu(i, y, t), t = M, p = y;
              var O = t.updateQueue;
              if (O === null) {
                var A = /* @__PURE__ */ new Set();
                A.add(p), t.updateQueue = A;
              } else O.add(p);
              break e;
            } else {
              if ((t & 1) === 0) {
                bu(i, y, t), To();
                break e;
              }
              p = Error(s(426));
            }
          } else if (we && a.mode & 1) {
            var Ne = ea(o);
            if (Ne !== null) {
              (Ne.flags & 65536) === 0 && (Ne.flags |= 256), ta(Ne, o, a, i, t), Hi(In(p, a));
              break e;
            }
          }
          i = p = In(p, a), Le !== 4 && (Le = 2), Er === null ? Er = [i] : Er.push(i), i = o;
          do {
            switch (i.tag) {
              case 3:
                i.flags |= 65536, t &= -t, i.lanes |= t;
                var m = Ju(i, p, t);
                Cu(i, m);
                break e;
              case 1:
                a = p;
                var h = i.type, v = i.stateNode;
                if ((i.flags & 128) === 0 && (typeof h.getDerivedStateFromError == "function" || v !== null && typeof v.componentDidCatch == "function" && (Kt === null || !Kt.has(v)))) {
                  i.flags |= 65536, t &= -t, i.lanes |= t;
                  var P = qu(i, a, t);
                  Cu(i, P);
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
  function Ta() {
    var e = _l.current;
    return _l.current = xl, e === null ? xl : e;
  }
  function To() {
    (Le === 0 || Le === 3 || Le === 2) && (Le = 4), Fe === null || (un & 268435455) === 0 && (Nl & 268435455) === 0 || Xt(Fe, Ue);
  }
  function Ll(e, t) {
    var n = ae;
    ae |= 2;
    var r = Ta();
    (Fe !== e || Ue !== t) && (Lt = null, cn(e, t));
    do
      try {
        Xf();
        break;
      } catch (l) {
        Pa(e, l);
      }
    while (!0);
    if (Bi(), ae = n, _l.current = r, ze !== null) throw Error(s(261));
    return Fe = null, Ue = 0, Le;
  }
  function Xf() {
    for (; ze !== null; ) Ra(ze);
  }
  function Zf() {
    for (; ze !== null && !wc(); ) Ra(ze);
  }
  function Ra(e) {
    var t = Da(e.alternate, e, lt);
    e.memoizedProps = e.pendingProps, t === null ? La(e) : ze = t, ko.current = null;
  }
  function La(e) {
    var t = e;
    do {
      var n = t.alternate;
      if (e = t.return, (t.flags & 32768) === 0) {
        if (n = Bf(n, t, lt), n !== null) {
          ze = n;
          return;
        }
      } else {
        if (n = Vf(n, t), n !== null) {
          n.flags &= 32767, ze = n;
          return;
        }
        if (e !== null) e.flags |= 32768, e.subtreeFlags = 0, e.deletions = null;
        else {
          Le = 6, ze = null;
          return;
        }
      }
      if (t = t.sibling, t !== null) {
        ze = t;
        return;
      }
      ze = t = e;
    } while (t !== null);
    Le === 0 && (Le = 5);
  }
  function fn(e, t, n) {
    var r = de, l = ct.transition;
    try {
      ct.transition = null, de = 1, Jf(e, t, n, r);
    } finally {
      ct.transition = l, de = r;
    }
    return null;
  }
  function Jf(e, t, n, r) {
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
    if (Tc(e, i), e === Fe && (ze = Fe = null, Ue = 0), (n.subtreeFlags & 2064) === 0 && (n.flags & 2064) === 0 || zl || (zl = !0, Fa(Fr, function() {
      return An(), null;
    })), i = (n.flags & 15990) !== 0, (n.subtreeFlags & 15990) !== 0 || i) {
      i = ct.transition, ct.transition = null;
      var o = de;
      de = 1;
      var a = ae;
      ae |= 4, ko.current = null, Qf(e, n), Sa(n, e), gf(Pi), Vr = !!zi, Pi = zi = null, e.current = n, Kf(n), kc(), ae = a, de = o, ct.transition = i;
    } else e.current = n;
    if (zl && (zl = !1, Gt = e, Pl = l), i = e.pendingLanes, i === 0 && (Kt = null), Cc(n.stateNode), be(e, _e()), t !== null) for (r = e.onRecoverableError, n = 0; n < t.length; n++) l = t[n], r(l.value, { componentStack: l.stack, digest: l.digest });
    if (jl) throw jl = !1, e = Co, Co = null, e;
    return (Pl & 1) !== 0 && e.tag !== 0 && An(), i = e.pendingLanes, (i & 1) !== 0 ? e === _o ? Cr++ : (Cr = 0, _o = e) : Cr = 0, Bt(), null;
  }
  function An() {
    if (Gt !== null) {
      var e = ws(Pl), t = ct.transition, n = de;
      try {
        if (ct.transition = null, de = 16 > e ? 16 : e, Gt === null) var r = !1;
        else {
          if (e = Gt, Gt = null, Pl = 0, (ae & 6) !== 0) throw Error(s(331));
          var l = ae;
          for (ae |= 4, F = e.current; F !== null; ) {
            var i = F, o = i.child;
            if ((F.flags & 16) !== 0) {
              var a = i.deletions;
              if (a !== null) {
                for (var p = 0; p < a.length; p++) {
                  var y = a[p];
                  for (F = y; F !== null; ) {
                    var N = F;
                    switch (N.tag) {
                      case 0:
                      case 11:
                      case 15:
                        kr(8, N, i);
                    }
                    var j = N.child;
                    if (j !== null) j.return = N, F = j;
                    else for (; F !== null; ) {
                      N = F;
                      var _ = N.sibling, M = N.return;
                      if (ga(N), N === y) {
                        F = null;
                        break;
                      }
                      if (_ !== null) {
                        _.return = M, F = _;
                        break;
                      }
                      F = M;
                    }
                  }
                }
                var O = i.alternate;
                if (O !== null) {
                  var A = O.child;
                  if (A !== null) {
                    O.child = null;
                    do {
                      var Ne = A.sibling;
                      A.sibling = null, A = Ne;
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
              if (a = F, (a.flags & 2048) !== 0) try {
                switch (a.tag) {
                  case 0:
                  case 11:
                  case 15:
                    Cl(9, a);
                }
              } catch (U) {
                Ce(a, a.return, U);
              }
              if (a === o) {
                F = null;
                break e;
              }
              var P = a.sibling;
              if (P !== null) {
                P.return = a.return, F = P;
                break e;
              }
              F = a.return;
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
  function Ma(e, t, n) {
    t = In(n, t), t = Ju(e, t, 1), e = Wt(e, t, 1), t = Ke(), e !== null && (Yn(e, 1, t), be(e, t));
  }
  function Ce(e, t, n) {
    if (e.tag === 3) Ma(e, e, n);
    else for (; t !== null; ) {
      if (t.tag === 3) {
        Ma(t, e, n);
        break;
      } else if (t.tag === 1) {
        var r = t.stateNode;
        if (typeof t.type.getDerivedStateFromError == "function" || typeof r.componentDidCatch == "function" && (Kt === null || !Kt.has(r))) {
          e = In(n, e), e = qu(t, e, 1), t = Wt(t, e, 1), e = Ke(), t !== null && (Yn(t, 1, e), be(t, e));
          break;
        }
      }
      t = t.return;
    }
  }
  function qf(e, t, n) {
    var r = e.pingCache;
    r !== null && r.delete(t), t = Ke(), e.pingedLanes |= e.suspendedLanes & n, Fe === e && (Ue & n) === n && (Le === 4 || Le === 3 && (Ue & 130023424) === Ue && 500 > _e() - Eo ? cn(e, 0) : So |= n), be(e, t);
  }
  function Ia(e, t) {
    t === 0 && ((e.mode & 1) === 0 ? t = 1 : (t = Ur, Ur <<= 1, (Ur & 130023424) === 0 && (Ur = 4194304)));
    var n = Ke();
    e = Pt(e, t), e !== null && (Yn(e, t, n), be(e, n));
  }
  function bf(e) {
    var t = e.memoizedState, n = 0;
    t !== null && (n = t.retryLane), Ia(e, n);
  }
  function ed(e, t) {
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
    r !== null && r.delete(t), Ia(e, n);
  }
  var Da;
  Da = function(e, t, n) {
    if (e !== null) if (e.memoizedProps !== t.pendingProps || Xe.current) Je = !0;
    else {
      if ((e.lanes & n) === 0 && (t.flags & 128) === 0) return Je = !1, $f(e, t, n);
      Je = (e.flags & 131072) !== 0;
    }
    else Je = !1, we && (t.flags & 1048576) !== 0 && hu(t, sl, t.index);
    switch (t.lanes = 0, t.tag) {
      case 2:
        var r = t.type;
        Sl(e, t), e = t.pendingProps;
        var l = Nn(t, $e.current);
        Ln(t, n), l = bi(null, t, r, e, l, n);
        var i = eo();
        return t.flags |= 1, typeof l == "object" && l !== null && typeof l.render == "function" && l.$$typeof === void 0 ? (t.tag = 1, t.memoizedState = null, t.updateQueue = null, Ze(r) ? (i = !0, ll(t)) : i = !1, t.memoizedState = l.state !== null && l.state !== void 0 ? l.state : null, Ki(t), l.updater = wl, t.stateNode = l, l._reactInternals = t, oo(t, r, e, n), t = co(null, t, r, !0, i, n)) : (t.tag = 0, we && i && Fi(t), Qe(null, t, l, n), t = t.child), t;
      case 16:
        r = t.elementType;
        e: {
          switch (Sl(e, t), e = t.pendingProps, l = r._init, r = l(r._payload), t.type = r, l = t.tag = nd(r), e = vt(r, e), l) {
            case 0:
              t = ao(null, t, r, e, n);
              break e;
            case 1:
              t = sa(null, t, r, e, n);
              break e;
            case 11:
              t = na(null, t, r, e, n);
              break e;
            case 14:
              t = ra(null, t, r, vt(r.type, e), n);
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
        return r = t.type, l = t.pendingProps, l = t.elementType === r ? l : vt(r, l), sa(e, t, r, l, n);
      case 3:
        e: {
          if (ua(t), e === null) throw Error(s(387));
          r = t.pendingProps, i = t.memoizedState, l = i.element, Eu(e, t), pl(t, r, null, n);
          var o = t.memoizedState;
          if (r = o.element, i.isDehydrated) if (i = { element: r, isDehydrated: !1, cache: o.cache, pendingSuspenseBoundaries: o.pendingSuspenseBoundaries, transitions: o.transitions }, t.updateQueue.baseState = i, t.memoizedState = i, t.flags & 256) {
            l = In(Error(s(423)), t), t = aa(e, t, r, n, l);
            break e;
          } else if (r !== l) {
            l = In(Error(s(424)), t), t = aa(e, t, r, n, l);
            break e;
          } else for (rt = Ut(t.stateNode.containerInfo.firstChild), nt = t, we = !0, mt = null, n = ku(t, null, r, n), t.child = n; n; ) n.flags = n.flags & -3 | 4096, n = n.sibling;
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
        return Nu(t), e === null && Ui(t), r = t.type, l = t.pendingProps, i = e !== null ? e.memoizedProps : null, o = l.children, Ti(r, l) ? o = null : i !== null && Ti(r, i) && (t.flags |= 32), oa(e, t), Qe(e, t, o, n), t.child;
      case 6:
        return e === null && Ui(t), null;
      case 13:
        return ca(e, t, n);
      case 4:
        return Gi(t, t.stateNode.containerInfo), r = t.pendingProps, e === null ? t.child = Tn(t, null, r, n) : Qe(e, t, r, n), t.child;
      case 11:
        return r = t.type, l = t.pendingProps, l = t.elementType === r ? l : vt(r, l), na(e, t, r, l, n);
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
            var a = i.dependencies;
            if (a !== null) {
              o = i.child;
              for (var p = a.firstContext; p !== null; ) {
                if (p.context === r) {
                  if (i.tag === 1) {
                    p = Tt(-1, n & -n), p.tag = 2;
                    var y = i.updateQueue;
                    if (y !== null) {
                      y = y.shared;
                      var N = y.pending;
                      N === null ? p.next = p : (p.next = N.next, N.next = p), y.pending = p;
                    }
                  }
                  i.lanes |= n, p = i.alternate, p !== null && (p.lanes |= n), Wi(
                    i.return,
                    n,
                    t
                  ), a.lanes |= n;
                  break;
                }
                p = p.next;
              }
            } else if (i.tag === 10) o = i.type === t.type ? null : i.child;
            else if (i.tag === 18) {
              if (o = i.return, o === null) throw Error(s(341));
              o.lanes |= n, a = o.alternate, a !== null && (a.lanes |= n), Wi(o, n, t), o = i.sibling;
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
        return l = t.type, r = t.pendingProps.children, Ln(t, n), l = ut(l), r = r(l), t.flags |= 1, Qe(e, t, r, n), t.child;
      case 14:
        return r = t.type, l = vt(r, t.pendingProps), l = vt(r.type, l), ra(e, t, r, l, n);
      case 15:
        return la(e, t, t.type, t.pendingProps, n);
      case 17:
        return r = t.type, l = t.pendingProps, l = t.elementType === r ? l : vt(r, l), Sl(e, t), t.tag = 1, Ze(r) ? (e = !0, ll(t)) : e = !1, Ln(t, n), Xu(t, r, l), oo(t, r, l, n), co(null, t, r, !0, e, n);
      case 19:
        return da(e, t, n);
      case 22:
        return ia(e, t, n);
    }
    throw Error(s(156, t.tag));
  };
  function Fa(e, t) {
    return ms(e, t);
  }
  function td(e, t, n, r) {
    this.tag = e, this.key = n, this.sibling = this.child = this.return = this.stateNode = this.type = this.elementType = null, this.index = 0, this.ref = null, this.pendingProps = t, this.dependencies = this.memoizedState = this.updateQueue = this.memoizedProps = null, this.mode = r, this.subtreeFlags = this.flags = 0, this.deletions = null, this.childLanes = this.lanes = 0, this.alternate = null;
  }
  function ft(e, t, n, r) {
    return new td(e, t, n, r);
  }
  function Ro(e) {
    return e = e.prototype, !(!e || !e.isReactComponent);
  }
  function nd(e) {
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
  function Ml(e, t, n, r, l, i) {
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
  function Lo(e, t, n) {
    return e = ft(6, e, null, t), e.lanes = n, e;
  }
  function Mo(e, t, n) {
    return t = ft(4, e.children !== null ? e.children : [], e.key, t), t.lanes = n, t.stateNode = { containerInfo: e.containerInfo, pendingChildren: null, implementation: e.implementation }, t;
  }
  function rd(e, t, n, r, l) {
    this.tag = t, this.containerInfo = e, this.finishedWork = this.pingCache = this.current = this.pendingChildren = null, this.timeoutHandle = -1, this.callbackNode = this.pendingContext = this.context = null, this.callbackPriority = 0, this.eventTimes = ii(0), this.expirationTimes = ii(-1), this.entangledLanes = this.finishedLanes = this.mutableReadLanes = this.expiredLanes = this.pingedLanes = this.suspendedLanes = this.pendingLanes = 0, this.entanglements = ii(0), this.identifierPrefix = r, this.onRecoverableError = l, this.mutableSourceEagerHydrationData = null;
  }
  function Io(e, t, n, r, l, i, o, a, p) {
    return e = new rd(e, t, n, a, p), t === 1 ? (t = 1, i === !0 && (t |= 8)) : t = 0, i = ft(3, null, null, t), e.current = i, i.stateNode = e, i.memoizedState = { element: r, isDehydrated: n, cache: null, transitions: null, pendingSuspenseBoundaries: null }, Ki(i), e;
  }
  function ld(e, t, n) {
    var r = 3 < arguments.length && arguments[3] !== void 0 ? arguments[3] : null;
    return { $$typeof: $, key: r == null ? null : "" + r, children: e, containerInfo: t, implementation: n };
  }
  function Oa(e) {
    if (!e) return $t;
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
  function Aa(e, t, n, r, l, i, o, a, p) {
    return e = Io(n, r, !0, e, l, i, o, a, p), e.context = Oa(null), n = e.current, r = Ke(), l = Yt(n), i = Tt(r, l), i.callback = t ?? null, Wt(n, i, l), e.current.lanes = l, Yn(e, l, r), be(e, r), e;
  }
  function Dl(e, t, n, r) {
    var l = t.current, i = Ke(), o = Yt(l);
    return n = Oa(n), t.context === null ? t.context = n : t.pendingContext = n, t = Tt(i, o), t.payload = { element: e }, r = r === void 0 ? null : r, r !== null && (t.callback = r), e = Wt(l, t, o), e !== null && (xt(e, l, o, i), dl(e, l, o)), o;
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
  function id() {
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
      var t = Es();
      e = { blockedOn: null, target: e, priority: t };
      for (var n = 0; n < Ft.length && t !== 0 && t < Ft[n].priority; n++) ;
      Ft.splice(n, 0, e), n === 0 && Ns(e);
    }
  };
  function Oo(e) {
    return !(!e || e.nodeType !== 1 && e.nodeType !== 9 && e.nodeType !== 11);
  }
  function Al(e) {
    return !(!e || e.nodeType !== 1 && e.nodeType !== 9 && e.nodeType !== 11 && (e.nodeType !== 8 || e.nodeValue !== " react-mount-point-unstable "));
  }
  function $a() {
  }
  function od(e, t, n, r, l) {
    if (l) {
      if (typeof r == "function") {
        var i = r;
        r = function() {
          var y = Fl(o);
          i.call(y);
        };
      }
      var o = Aa(t, r, e, 0, null, !1, !1, "", $a);
      return e._reactRootContainer = o, e[_t] = o.current, ur(e.nodeType === 8 ? e.parentNode : e), an(), o;
    }
    for (; l = e.lastChild; ) e.removeChild(l);
    if (typeof r == "function") {
      var a = r;
      r = function() {
        var y = Fl(p);
        a.call(y);
      };
    }
    var p = Io(e, 0, !1, null, null, !1, !1, "", $a);
    return e._reactRootContainer = p, e[_t] = p.current, ur(e.nodeType === 8 ? e.parentNode : e), an(function() {
      Dl(t, p, n, r);
    }), p;
  }
  function Ul(e, t, n, r, l) {
    var i = n._reactRootContainer;
    if (i) {
      var o = i;
      if (typeof l == "function") {
        var a = l;
        l = function() {
          var p = Fl(o);
          a.call(p);
        };
      }
      Dl(t, o, e, l);
    } else o = od(n, t, e, l, r);
    return Fl(o);
  }
  ks = function(e) {
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
  }, Ss = function(e) {
    if (e.tag === 13) {
      var t = Yt(e), n = Pt(e, t);
      if (n !== null) {
        var r = Ke();
        xt(n, e, t, r);
      }
      Do(e, t);
    }
  }, Es = function() {
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
              Hn(r), Ql(r, l);
            }
          }
        }
        break;
      case "textarea":
        bo(e, n);
        break;
      case "select":
        t = n.value, t != null && hn(e, !!n.multiple, t, !1);
    }
  }, us = zo, as = an;
  var sd = { usingClientEntryPoint: !1, Events: [fr, Cn, nl, os, ss, zo] }, _r = { findFiberByHostInstance: en, bundleType: 0, version: "18.3.1", rendererPackageName: "react-dom" }, ud = { bundleType: _r.bundleType, version: _r.version, rendererPackageName: _r.rendererPackageName, rendererConfig: _r.rendererConfig, overrideHookState: null, overrideHookStateDeletePath: null, overrideHookStateRenamePath: null, overrideProps: null, overridePropsDeletePath: null, overridePropsRenamePath: null, setErrorHandler: null, setSuspenseHandler: null, scheduleUpdate: null, currentDispatcherRef: he.ReactCurrentDispatcher, findHostInstanceByFiber: function(e) {
    return e = ps(e), e === null ? null : e.stateNode;
  }, findFiberByHostInstance: _r.findFiberByHostInstance || id, findHostInstancesForRefresh: null, scheduleRefresh: null, scheduleRoot: null, setRefreshHandler: null, getCurrentFiber: null, reconcilerVersion: "18.3.1-next-f1338f8080-20240426" };
  if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u") {
    var Hl = __REACT_DEVTOOLS_GLOBAL_HOOK__;
    if (!Hl.isDisabled && Hl.supportsFiber) try {
      Or = Hl.inject(ud), wt = Hl;
    } catch {
    }
  }
  return et.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = sd, et.createPortal = function(e, t) {
    var n = 2 < arguments.length && arguments[2] !== void 0 ? arguments[2] : null;
    if (!Oo(t)) throw Error(s(200));
    return ld(e, t, null, n);
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
    return e = ps(t), e = e === null ? null : e.stateNode, e;
  }, et.flushSync = function(e) {
    return an(e);
  }, et.hydrate = function(e, t, n) {
    if (!Al(t)) throw Error(s(200));
    return Ul(null, e, t, !0, n);
  }, et.hydrateRoot = function(e, t, n) {
    if (!Oo(e)) throw Error(s(405));
    var r = n != null && n.hydratedSources || null, l = !1, i = "", o = Ha;
    if (n != null && (n.unstable_strictMode === !0 && (l = !0), n.identifierPrefix !== void 0 && (i = n.identifierPrefix), n.onRecoverableError !== void 0 && (o = n.onRecoverableError)), t = Aa(t, null, e, 1, n ?? null, l, !1, i, o), e[_t] = t.current, ur(e), r) for (e = 0; e < r.length; e++) n = r[e], l = n._getVersion, l = l(n._source), t.mutableSourceEagerHydrationData == null ? t.mutableSourceEagerHydrationData = [n, l] : t.mutableSourceEagerHydrationData.push(
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
var Xa;
function yd() {
  if (Xa) return Ho.exports;
  Xa = 1;
  function c() {
    if (!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function"))
      try {
        __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(c);
      } catch (u) {
        console.error(u);
      }
  }
  return c(), Ho.exports = gd(), Ho.exports;
}
var Za;
function xd() {
  if (Za) return $l;
  Za = 1;
  var c = yd();
  return $l.createRoot = c.createRoot, $l.hydrateRoot = c.hydrateRoot, $l;
}
var wd = xd();
const kd = ':host{--fc-text: var(--primary-text-color, #2b1e15);--fc-muted: var(--secondary-text-color, #786350);--fc-accent: var(--faith-accent, #b8862f);--fc-line: var(--divider-color, rgba(0,0,0,.12));--fc-bg2: var(--secondary-background-color, rgba(0,0,0,.04));--fc-ok: var(--success-color, #43a047);--fc-err: var(--error-color, #db4437);--fc-soft: color-mix(in srgb, var(--fc-accent) 14%, transparent);display:block;--fc-hex: polygon(50% 0, 93.3% 25%, 93.3% 75%, 50% 100%, 6.7% 75%, 6.7% 25%);--fc-serif: var(--faith-serif, "Fraunces Variable", Georgia, "Iowan Old Style", serif)}*{box-sizing:border-box}ha-card{padding:16px;color:var(--fc-text)}.head{display:flex;align-items:center;gap:10px;margin-bottom:12px}.head h2{margin:0;font-size:1.25rem;font-weight:600;line-height:1.2}.head .sub{color:var(--fc-muted);font-size:.85rem}.head .right{margin-left:auto;display:flex;gap:6px;align-items:center}.eyebrow{font-size:.72rem;letter-spacing:.12em;text-transform:uppercase;color:var(--fc-muted)}.hello{font-family:var(--fc-serif);margin:2px 0 14px;font-size:1.6rem;font-weight:600;line-height:1.15}.hello em{color:var(--fc-accent);font-style:italic}.section{padding:12px 0;border-top:1px solid var(--fc-line)}.section:first-of-type{border-top:0;padding-top:0}.section h3{display:flex;align-items:center;gap:8px;margin:0 0 8px;font-size:1rem;font-weight:600}.section h3 ha-icon{--mdc-icon-size: 20px;color:var(--fc-accent)}.count{background:var(--fc-bg2);color:var(--fc-muted);border-radius:999px;padding:0 8px;font-size:.8rem;font-weight:500}ul{list-style:none;margin:0;padding:0}.row{display:flex;align-items:center;gap:10px;padding:7px 0;border-bottom:1px solid var(--fc-line)}.row:last-child{border-bottom:0}.time{min-width:70px;color:var(--fc-muted);font-variant-numeric:tabular-nums}.grow{flex:1;min-width:0}.meta{color:var(--fc-muted);font-size:.85rem}.label{font-size:.72rem;letter-spacing:.1em;text-transform:uppercase;color:var(--fc-muted)}.check{width:18px;height:18px;border-radius:50%;border:2px solid var(--fc-line);flex:none}.check.done{background:var(--fc-ok);border-color:var(--fc-ok)}.tiles{display:grid;grid-template-columns:repeat(auto-fill,minmax(120px,1fr));gap:8px}.tile{background:var(--fc-bg2);border-radius:12px;padding:10px 12px}.tile .v{font-size:1.15rem;font-weight:600;text-transform:capitalize}.empty{color:var(--fc-muted);padding:4px 0}.err{color:var(--fc-err)}button{font:inherit;color:inherit;cursor:pointer;border:1px solid var(--fc-line);background:var(--fc-bg2);border-radius:10px;padding:8px 14px;min-height:40px}button.primary{background:var(--fc-accent);border-color:var(--fc-accent);color:var(--faith-accent-text, #fffaf0)}button.ghost{background:transparent;border-color:transparent;color:var(--fc-muted)}button:disabled{opacity:.5;cursor:default}.btns{display:flex;gap:6px;flex-wrap:wrap}input{font:inherit;color:var(--fc-text);background:var(--fc-bg2);border:1px solid var(--fc-line);border-radius:10px;padding:8px 12px;min-height:40px;width:100%}input:focus{outline:2px solid var(--fc-accent);outline-offset:-1px}.avatar{display:inline-grid;place-items:center;color:#fff;font-weight:600;flex:none;clip-path:var(--fc-hex)}.hexring{display:inline-grid;place-items:center;padding:3px;background:var(--fc-accent);clip-path:var(--fc-hex);flex:none}.people{display:grid;grid-template-columns:repeat(auto-fill,minmax(96px,1fr));gap:10px}.person{display:flex;flex-direction:column;align-items:center;gap:8px;padding:14px 8px;border-radius:14px;border:1px solid var(--fc-line);background:transparent;font-weight:600}.person.suggested{border:2px solid var(--fc-accent)}.pin{display:flex;flex-direction:column;align-items:center;gap:12px}.dots{display:flex;gap:10px}.dots span{width:13px;height:13px;border-radius:50%;border:2px solid var(--fc-muted)}.dots span.on{background:var(--fc-accent);border-color:var(--fc-accent)}.keys{display:grid;grid-template-columns:repeat(3,68px);gap:8px}.keys button{height:58px;font-size:1.35rem;border-radius:14px}.chat{display:flex;flex-direction:column;gap:10px;max-height:var(--faith-chat-height, 420px);overflow-y:auto;padding:2px}.msg{max-width:88%;padding:9px 13px;border-radius:16px;white-space:pre-wrap;line-height:1.4}.msg.me{align-self:flex-end;background:var(--fc-accent);color:var(--faith-accent-text, #fffaf0);border-bottom-right-radius:4px}.msg.faith{align-self:flex-start;background:var(--fc-bg2);border-bottom-left-radius:4px}.chips{display:flex;gap:4px;flex-wrap:wrap}.chip{font-size:.75rem;color:var(--fc-muted);border:1px solid var(--fc-line);border-radius:999px;padding:1px 8px}.ask{display:flex;gap:6px;margin-top:10px;align-items:center}.ask button{min-width:44px;padding:8px 10px}.rec{background:var(--fc-err)!important;color:#fff!important;border-color:var(--fc-err)!important}.box{border:1px solid var(--fc-accent);border-radius:14px;padding:10px 12px;display:flex;flex-direction:column;gap:8px}.box.wait{border-style:dashed}.big{font-size:2.6rem;font-weight:700;line-height:1}.pill{background:var(--fc-soft);color:var(--fc-accent);border-radius:999px;padding:2px 10px;font-weight:600;font-size:.85rem;white-space:nowrap}.toast{color:var(--fc-muted);font-size:.85rem}.apps{display:flex;gap:8px;flex-wrap:wrap}.apps a{text-decoration:none;color:inherit;display:flex;align-items:center;gap:8px;border:1px solid var(--fc-line);border-radius:12px;padding:6px 12px 6px 8px}.emblem{flex:none;margin:-6px -2px -6px -6px}.mine{display:flex;align-items:center;gap:16px}.honey{display:grid;place-items:center;align-content:center;width:104px;height:112px;flex:none;clip-path:var(--fc-hex);background:linear-gradient(160deg,color-mix(in srgb,var(--fc-accent) 70%,#fff),var(--fc-accent));color:var(--faith-accent-text, #fffaf0)}.honey .label{color:inherit;opacity:.85}ha-card.hub{position:relative;overflow:hidden;padding:22px 22px 18px;background:radial-gradient(90% 60% at 50% 45%,color-mix(in srgb,var(--fc-accent) 14%,transparent),transparent 70%),var(--ha-card-background, var(--card-background-color, transparent))}.hub-top{display:flex;align-items:flex-start;gap:12px}.hub-top .right{margin-left:auto;display:flex;gap:8px;align-items:center;flex-wrap:wrap;justify-content:flex-end}.clock{font-family:var(--fc-serif);font-size:3.2rem;font-weight:600;line-height:1;letter-spacing:-.02em;font-variant-numeric:tabular-nums}.hub-mid{display:flex;flex-direction:column;align-items:center;text-align:center;gap:6px;margin:8px 0 10px}.hub-mid .hello{margin:0}button.orb{background:none;border:0;padding:0;min-height:0;border-radius:50%;margin:-8px 0}button.orb:focus-visible{outline:2px solid var(--fc-accent);outline-offset:-12px}button.orb:disabled{opacity:1}.hint{font-size:.72rem;letter-spacing:.16em;text-transform:uppercase;color:var(--fc-accent);font-weight:600}.heard{color:var(--fc-muted);font-style:italic}.reply{font-family:var(--fc-serif);font-size:1.3rem;line-height:1.4;max-width:34em;white-space:pre-wrap}.hub-mid .box{text-align:left;width:min(100%,30em)}.faces{display:flex;justify-content:center;gap:18px;flex-wrap:wrap;margin-top:14px;padding-top:14px;border-top:1px solid var(--fc-line)}button.face{display:flex;flex-direction:column;align-items:center;gap:6px;background:none;border:0;padding:4px;min-height:0;font-weight:600;font-size:.9rem}.overlay{position:absolute;top:0;right:0;bottom:0;left:0;z-index:2;display:grid;place-items:center;padding:16px;background:var(--ha-card-background, var(--card-background-color, #241a13))}', Wo = (c) => `faith.hub.${c}`, nc = (c) => {
  if (c)
    try {
      return localStorage.getItem(Wo(c)) || void 0;
    } catch {
      return;
    }
};
function Go(c, u) {
  try {
    u ? localStorage.setItem(Wo(c), u) : localStorage.removeItem(Wo(c));
  } catch {
  }
  window.dispatchEvent(new CustomEvent("faith-hub-changed", { detail: { screen: c } }));
}
function Sd(c, u) {
  return {
    screen: u.screen,
    get user() {
      var s;
      return (s = c()) == null ? void 0 : s.user;
    },
    get dark() {
      var s, C;
      return !!((C = (s = c()) == null ? void 0 : s.themes) != null && C.darkMode);
    },
    call: async (s, C = {}) => {
      const E = c();
      if (!E) throw new Error("Home Assistant isn't ready yet.");
      const z = nc(u.screen);
      try {
        return await E.callWS({ type: "faith/call", path: s, body: { ...C, ...u.screen ? { screen: u.screen } : {}, ...z ? { hub_session: z } : {} } });
      } catch (T) {
        throw new Error((T == null ? void 0 : T.message) || (T == null ? void 0 : T.code) || "FAITH didn't answer.");
      }
    }
  };
}
const zr = (1 + Math.sqrt(5)) / 2, it = Math.PI * 2, Qo = (() => {
  const c = Math.hypot(1, zr), u = [];
  for (const s of [-1, 1]) for (const C of [-zr, zr]) u.push([0, s / c, C / c], [s / c, C / c, 0], [C / c, 0, s / c]);
  return u;
})(), Ed = (c, u) => (c[0] - u[0]) ** 2 + (c[1] - u[1]) ** 2 + (c[2] - u[2]) ** 2, Cd = 4 / (1 + zr * zr), Yo = [];
for (let c = 0; c < 12; c++) for (let u = c + 1; u < 12; u++) Math.abs(Ed(Qo[c], Qo[u]) - Cd) < 0.01 && Yo.push([c, u]);
const rc = [], Vo = (c, u) => Yo.some(([s, C]) => s === c && C === u || s === u && C === c);
for (let c = 0; c < 12; c++) for (let u = c + 1; u < 12; u++) for (let s = u + 1; s < 12; s++) Vo(c, u) && Vo(u, s) && Vo(c, s) && rc.push([c, u, s]);
const Pr = 7, qt = (c) => {
  const u = Math.sin(c * 127.1 + 311.7) * 43758.5453;
  return u - Math.floor(u);
}, Ja = Array.from({ length: Pr }, (c, u) => ({
  a: [0, 1, 2].map((s) => 0.3 + 0.16 * qt(u * 9 + s)),
  w: [0, 1, 2].map((s) => 0.22 + 0.3 * qt(u * 9 + s + 3)),
  p: [0, 1, 2].map((s) => it * qt(u * 9 + s + 6)),
  flap: it * qt(u * 3 + 100)
})), lc = -1, Tr = [];
for (let c = 0; c < Pr; c++) Tr.push({ a: lc, b: c, kind: "core", seed: qt(c + 40) });
for (let c = 0; c < Pr; c++) Tr.push({ a: c, b: (c + 1) % Pr, kind: "bee", seed: qt(c + 60) });
for (const [c, u] of [[0, 3], [2, 5], [4, 6]]) Tr.push({ a: c, b: u, kind: "bee", seed: qt(c * 7 + u) });
for (const [c, u] of [[1, 0], [3, 7], [5, 10]]) Tr.push({ a: c, b: u, kind: "shell", seed: qt(c + u * 3) });
const _d = [
  { r: 1.34, tiltX: 1.12, tiltZ: 0.38, precess: 0.21, phase: 0, width: 0.024, ticks: 36 },
  { r: 1.5, tiltX: 1.38, tiltZ: -0.62, precess: -0.15, phase: Math.PI / 2, width: 0.016, ticks: 0 }
], qa = ([c, u, s], C) => {
  const E = Math.cos(C), z = Math.sin(C);
  return [c, u * E - s * z, u * z + s * E];
}, ba = ([c, u, s], C) => {
  const E = Math.cos(C), z = Math.sin(C);
  return [c * E + s * z, u, -c * z + s * E];
}, ec = ([c, u, s], C) => {
  const E = Math.cos(C), z = Math.sin(C);
  return [c * E - u * z, c * z + u * E, s];
}, Nd = {
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
}, ge = (c, u) => `rgba(${c[0]},${c[1]},${c[2]},${Math.max(0, Math.min(1, u))})`, Bl = {
  idle: { spin: 0.16, bees: 1, rings: 1, sparks: 0.3, glow: 0.45, gather: 0 },
  listening: { spin: 0.1, bees: 0.7, rings: 0.6, sparks: 0.2, glow: 0.6, gather: 0.3 },
  thinking: { spin: 0.55, bees: 1.9, rings: 3.2, sparks: 1, glow: 0.8, gather: 0.1 },
  speaking: { spin: 0.22, bees: 1.2, rings: 1.4, sparks: 0.55, glow: 0.55, gather: 0 }
};
class jd {
  constructor(u, s = {}) {
    He(this, "ctx");
    He(this, "opts");
    He(this, "raf", 0);
    He(this, "last", 0);
    He(this, "t", 0);
    He(this, "acc", { spin: 0.6, bees: 3, rings: 1.2, sparks: 0 });
    He(this, "cur", { ...Bl.idle });
    He(this, "ro");
    He(this, "heading", new Array(Pr).fill(0));
    He(this, "w", 0);
    He(this, "h", 0);
    He(this, "dpr", 1);
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
      const C = Math.min(0.05, (s - this.last) / 1e3);
      this.last = s, this.frame(C), this.raf = requestAnimationFrame(u);
    };
    this.raf = requestAnimationFrame(u);
  }
  frame(u) {
    const s = Bl[this.opts.state], C = Math.min(1, u * 2.5);
    for (const E of Object.keys(s)) this.cur[E] += (s[E] - this.cur[E]) * C;
    this.t += u, this.acc.spin += this.cur.spin * u, this.acc.bees += this.cur.bees * u, this.acc.rings += this.cur.rings * u, this.acc.sparks += (0.25 + this.cur.sparks * 0.9) * u, this.draw();
  }
  level() {
    const u = this.opts.state;
    if (u !== "listening" && u !== "speaking") return 0;
    const s = typeof this.opts.level == "function" ? this.opts.level() : this.opts.level;
    if (typeof s == "number") return Math.max(0, Math.min(1, s));
    const C = this.t;
    return u === "speaking" ? 0.5 + 0.5 * Math.sin(C * 9) * Math.sin(C * 2.3) : 0.3 + 0.2 * Math.sin(C * 3);
  }
  draw() {
    const { ctx: u, w: s, h: C } = this, E = Nd[this.opts.tone], z = s / 2, T = C / 2, R = Math.min(s, C) / 2 / 1.86, g = 5, S = this.level(), H = this.acc.spin, W = 0.38 + 0.12 * Math.sin(this.t * 0.31), I = 0.08 * Math.sin(this.t * 0.23), b = (x) => qa(ec(ba(x, H), I), W), ee = (x) => {
      const k = g / (g - x[2]);
      return { x: z + x[0] * R * k, y: T - x[1] * R * k, z: x[2], s: k };
    }, J = (x) => (x + 1) / 2;
    u.clearRect(0, 0, s, C);
    const le = this.cur.glow + S * 0.5, je = u.createRadialGradient(z, T, 0, z, T, R * 1.6);
    je.addColorStop(0, ge(E.glow, 0.26 * le)), je.addColorStop(0.45, ge(E.glow, 0.1 * le)), je.addColorStop(1, ge(E.glow, 0)), u.fillStyle = je, u.fillRect(0, 0, s, C);
    const Me = [], Pe = [], he = [];
    _d.forEach((x, k) => {
      const f = x.phase + this.acc.rings * x.precess, w = (G, oe = x.r) => ba(ec(qa([Math.cos(G) * oe, 0, Math.sin(G) * oe], x.tiltX), x.tiltZ), f), D = 96, Q = [];
      let Z = ee(w(0));
      for (let G = 1; G <= D; G++) {
        const oe = w(G / D * it), Ee = ee(oe);
        Q.push({ a: Z, b: Ee, z: (Z.z + Ee.z) / 2, wd: x.width }), Z = Ee;
      }
      Me.push(Q);
      const X = [], se = this.acc.rings * 0.35 * (k ? -1 : 1);
      for (let G = 0; G < x.ticks; G++) {
        const oe = G / x.ticks * it + se, Ee = G % 3 === 0 ? 0.07 : 0.035, dt = ee(w(oe, x.r - Ee)), Hn = ee(w(oe, x.r + Ee));
        X.push({ a: dt, b: Hn, z: (dt.z + Hn.z) / 2 });
      }
      if (Pe.push(X), k === 0) for (const G of [0, Math.PI]) he.push(ee(w(se * 1.6 + G)));
      else he.push(ee(w(-se * 1.2 + 1)));
    });
    const Te = (x) => {
      u.lineCap = "round", Me.forEach((k) => {
        for (const f of k) {
          if (f.z >= 0 !== x) continue;
          const w = J(f.z);
          u.strokeStyle = `rgb(${E.ringLo.map((D, Q) => Math.round(D + (E.ringHi[Q] - D) * w)).join(",")})`, u.globalAlpha = x ? 1 : 0.55, u.lineWidth = Math.max(this.dpr * 1.2, R * f.wd * f.a.s), u.beginPath(), u.moveTo(f.a.x, f.a.y), u.lineTo(f.b.x, f.b.y), u.stroke();
        }
      }), u.lineWidth = R * 8e-3;
      for (const k of Pe) for (const f of k)
        f.z >= 0 === x && (u.strokeStyle = ge(E.ringHi, (x ? 0.9 : 0.35) * (0.4 + 0.6 * J(f.z))), u.beginPath(), u.moveTo(f.a.x, f.a.y), u.lineTo(f.b.x, f.b.y), u.stroke());
      for (const k of he) {
        if (k.z >= 0 !== x) continue;
        u.globalAlpha = x ? 1 : 0.5;
        const f = R * 0.034 * k.s, w = u.createRadialGradient(k.x - f * 0.3, k.y - f * 0.3, f * 0.1, k.x, k.y, f);
        w.addColorStop(0, ge(E.spark, 1)), w.addColorStop(1, ge(E.ringLo, 1)), u.fillStyle = w, u.beginPath(), u.arc(k.x, k.y, f, 0, it), u.fill();
      }
      u.globalAlpha = 1;
    };
    Te(!1);
    const $ = Qo.map(b), ce = $.map(ee), re = (x) => {
      for (const [k, f] of Yo) {
        const w = ($[k][2] + $[f][2]) / 2;
        w >= -0.05 === x && (u.strokeStyle = x ? ge(E.edge, 0.55 + 0.45 * J(w)) : ge(E.edgeBack, this.opts.tone === "light" ? 0.45 : 0.32), u.lineWidth = Math.max(this.dpr * (x ? 1 : 0.6), R * (x ? 0.013 : 8e-3)), u.beginPath(), u.moveTo(ce[k].x, ce[k].y), u.lineTo(ce[f].x, ce[f].y), u.stroke());
      }
    };
    re(!1);
    const ue = 1 - this.cur.gather, K = Ja.map((x) => {
      const k = (D) => [x.a[0] * Math.sin(x.w[0] * D + x.p[0]) * ue, x.a[1] * Math.sin(x.w[1] * D + x.p[1]) * ue, x.a[2] * Math.cos(x.w[2] * D + x.p[2]) * ue], f = b(k(this.acc.bees)), w = ee(b(k(this.acc.bees + 0.05)));
      return { v: f, p: ee(f), next: w };
    }), ie = ee([0, 0, 0]), ne = (x, k, f) => f === "a" && x === lc ? ie : k === "shell" && f === "b" ? ce[x] : K[x].p, ye = Tr.map((x) => ({ l: x, A: ne(x.a, x.kind, "a"), B: ne(x.b, x.kind, "b") })), Ge = (x, k) => {
      const f = Math.hypot(k.x - x.x, k.y - x.y);
      return { mx: (x.x + k.x) / 2, my: (x.y + k.y) / 2 + f * 0.12 };
    };
    u.lineCap = "round";
    for (const { l: x, A: k, B: f } of ye) {
      const { mx: w, my: D } = Ge(k, f), Q = (k.z + f.z) / 2;
      u.strokeStyle = ge(E.thread, (x.kind === "core" ? 0.6 : x.kind === "shell" ? 0.35 : 0.5) * (0.5 + 0.5 * J(Q))), u.lineWidth = Math.max(this.dpr * 0.6, R * (x.kind === "core" ? 9e-3 : 65e-4)), u.beginPath(), u.moveTo(k.x, k.y), u.quadraticCurveTo(w, D, f.x, f.y), u.stroke();
    }
    for (const { l: x, A: k, B: f } of ye) {
      if (x.kind === "shell") continue;
      const w = this.cur.sparks;
      if (x.seed > w + 0.15) continue;
      const D = (this.acc.sparks * (0.6 + x.seed) + x.seed * 7) % 1, { mx: Q, my: Z } = Ge(k, f), X = 1 - D, se = X * X * k.x + 2 * X * D * Q + D * D * f.x, G = X * X * k.y + 2 * X * D * Z + D * D * f.y, oe = R * 0.018 * (0.6 + w * 0.6), Ee = Math.sin(D * Math.PI), dt = u.createRadialGradient(se, G, 0, se, G, oe * 2.4);
      dt.addColorStop(0, ge(E.spark, 0.95 * Ee)), dt.addColorStop(1, ge(E.spark, 0)), u.fillStyle = dt, u.beginPath(), u.arc(se, G, oe * 2.4, 0, it), u.fill();
    }
    const Ye = R * (0.085 + 0.035 * S + 0.01 * Math.sin(this.t * 2)), Ie = u.createRadialGradient(ie.x, ie.y, 0, ie.x, ie.y, Ye * 3.2);
    Ie.addColorStop(0, ge(E.core, 0.55 * le)), Ie.addColorStop(1, ge(E.core, 0)), u.fillStyle = Ie, u.beginPath(), u.arc(ie.x, ie.y, Ye * 3.2, 0, it), u.fill(), this.hex(ie.x, ie.y, Ye, this.acc.spin * 0.5, E);
    const xe = K.map((x, k) => k).sort((x, k) => K[x].v[2] - K[k].v[2]);
    for (const x of xe) {
      const k = K[x];
      let w = Math.atan2(k.next.y - k.p.y, k.next.x - k.p.x) - this.heading[x];
      w = ((w + Math.PI) % it + it) % it - Math.PI, this.heading[x] += this.opts.still ? w : w * 0.15;
      const D = 0.35 + 0.65 * Math.abs(Math.sin(this.t * 26 + Ja[x].flap));
      this.bee(k.p.x, k.p.y, R * 0.15 * k.p.s, this.heading[x], D, 0.55 + 0.45 * J(k.v[2]), E);
    }
    const L = [-0.4, 0.6, 0.7];
    for (const [x, k, f] of rc) {
      const w = $[x], D = $[k], Q = $[f], Z = [(w[0] + D[0] + Q[0]) / 3, (w[1] + D[1] + Q[1]) / 3, (w[2] + D[2] + Q[2]) / 3];
      if (Z[2] <= 0) continue;
      const X = Math.max(0, (Z[0] * L[0] + Z[1] * L[1] + Z[2] * L[2]) / Math.hypot(...Z));
      u.fillStyle = ge(E.face, 0.03 + 0.07 * X * X), u.beginPath(), u.moveTo(ce[x].x, ce[x].y), u.lineTo(ce[k].x, ce[k].y), u.lineTo(ce[f].x, ce[f].y), u.closePath(), u.fill();
    }
    re(!0);
    for (let x = 0; x < 12; x++)
      $[x][2] < -0.05 || (u.fillStyle = ge(E.edge, 0.6 + 0.4 * J($[x][2])), u.beginPath(), u.arc(ce[x].x, ce[x].y, R * 0.02 * ce[x].s, 0, it), u.fill());
    Te(!0);
  }
  hex(u, s, C, E, z) {
    const { ctx: T } = this, R = Array.from({ length: 6 }, (g, S) => [u + C * Math.cos(E + S * it / 6), s + C * Math.sin(E + S * it / 6)]);
    for (let g = 0; g < 6; g++) {
      const [S, H] = R[g], [W, I] = R[(g + 1) % 6];
      T.fillStyle = ge(z.bee[g % 3], 1), T.beginPath(), T.moveTo(u, s), T.lineTo(S, H), T.lineTo(W, I), T.closePath(), T.fill();
    }
    T.strokeStyle = ge(z.spark, 0.9), T.lineWidth = C * 0.12, T.beginPath(), R.forEach(([g, S], H) => H ? T.lineTo(g, S) : T.moveTo(g, S)), T.closePath(), T.stroke();
  }
  /** One low-poly bee seen from above, facing +x in its own space. */
  bee(u, s, C, E, z, T, R) {
    const { ctx: g } = this;
    g.save(), g.translate(u, s), g.rotate(E), g.scale(C, C), g.globalAlpha = T;
    const S = (I) => {
      g.beginPath(), I.forEach(([b, ee], J) => J ? g.lineTo(b, ee) : g.moveTo(b, ee)), g.closePath();
    };
    g.fillStyle = ge(R.head, 1), S([[-1.02, -0.08], [-1.28, 0], [-1.02, 0.08]]), g.fill();
    const H = [[-1.05, 0], [-0.78, -0.4], [-0.2, -0.5], [0.28, -0.36], [0.46, 0], [0.28, 0.36], [-0.2, 0.5], [-0.78, 0.4]], W = [-0.3, 0];
    for (let I = 0; I < H.length; I++)
      g.fillStyle = ge(R.bee[I % 3], 1), S([W, H[I], H[(I + 1) % H.length]]), g.fill();
    g.save(), S(H), g.clip(), g.fillStyle = ge(R.stripe, 0.92), S([[-0.26, -0.6], [-0.44, -0.6], [-0.5, 0.6], [-0.32, 0.6]]), g.fill(), S([[-0.64, -0.6], [-0.8, -0.6], [-0.86, 0.6], [-0.7, 0.6]]), g.fill(), g.restore(), g.fillStyle = ge(R.head, 1), S([[0.42, 0], [0.58, -0.27], [0.86, -0.2], [0.95, 0], [0.86, 0.2], [0.58, 0.27]]), g.fill(), g.fillStyle = ge(R.bee[1], 0.9), S([[0.7, -0.2], [0.84, -0.14], [0.74, -0.08]]), g.fill(), S([[0.7, 0.2], [0.84, 0.14], [0.74, 0.08]]), g.fill(), g.strokeStyle = ge(R.head, 1), g.lineWidth = 0.06, g.lineCap = "round", g.beginPath(), g.moveTo(0.9, -0.1), g.lineTo(1.08, -0.2), g.lineTo(1.2, -0.4), g.moveTo(0.9, 0.1), g.lineTo(1.08, 0.2), g.lineTo(1.2, 0.4), g.stroke();
    for (const I of [-1, 1]) {
      const b = I * z, ee = [[0.22, 0.16 * I], [0.05, 1.08 * b], [-0.5, 0.92 * b], [-0.22, 0.24 * I]];
      g.fillStyle = ge(R.wing, 0.38), S(ee), g.fill(), g.strokeStyle = ge(R.bee[1], 0.85), g.lineWidth = 0.04, g.stroke(), g.beginPath(), g.moveTo(0.05, 0.2 * I), g.lineTo(-0.22, 0.95 * b), g.stroke();
    }
    g.restore();
  }
}
const tc = () => typeof matchMedia == "function" && matchMedia("(prefers-reduced-motion: reduce)").matches;
function ic({ size: c = 160, state: u = "idle", level: s, tone: C = "dark", still: E, className: z }) {
  const T = q.useRef(null), R = q.useRef();
  return q.useEffect(() => (R.current = new jd(T.current, { state: u, level: s, tone: C, still: E ?? tc() }), () => {
    var g;
    return (g = R.current) == null ? void 0 : g.destroy();
  }), []), q.useEffect(() => {
    var g;
    (g = R.current) == null || g.set({ state: u, level: s, tone: C, still: E ?? tc() });
  }, [u, s, C, E]), /* @__PURE__ */ d.jsx("canvas", { ref: T, className: z, style: { width: c, height: c, display: "block" }, role: "img", "aria-label": `FAITH (${u})` });
}
const zd = { today: "mdi:calendar-today", meals: "mdi:silverware-fork-knife", shopping: "mdi:cart-outline", chores: "mdi:broom", home: "mdi:home-outline", approvals: "mdi:shield-check-outline" }, Pd = (c) => c.split(/\s+/).map((u) => u[0]).join("").slice(0, 2).toUpperCase(), Un = ({ p: c, size: u = 40, ring: s }) => {
  const C = /* @__PURE__ */ d.jsx("span", { className: "avatar", style: { width: u, height: u, fontSize: u * 0.36, background: c.color || "var(--fc-accent)" }, children: Pd(c.name) });
  return s ? /* @__PURE__ */ d.jsx("span", { className: "hexring", children: C }) : C;
};
function jr(c) {
  if (!c) return "";
  if (/^\d{2}:\d{2}$/.test(c)) {
    const [u, s] = c.split(":").map(Number);
    return new Date(2e3, 0, 1, u, s).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
  }
  if (/^\d{4}-\d{2}-\d{2}$/.test(c)) {
    const u = /* @__PURE__ */ new Date(`${c}T12:00:00`), s = Math.round((new Date(u.toDateString()).getTime() - new Date((/* @__PURE__ */ new Date()).toDateString()).getTime()) / 864e5);
    return s === 0 ? "Today" : s === 1 ? "Tomorrow" : u.toLocaleDateString([], { weekday: "short", day: "numeric" });
  }
  return c;
}
function Vl(c, u, s = {}, C = 6e4) {
  const [E, z] = q.useState(null), [T, R] = q.useState(""), g = q.useCallback(() => c.call(u, s).then((S) => {
    z(S), R("");
  }).catch((S) => R(S.message)), [c, u, JSON.stringify(s)]);
  return q.useEffect(() => {
    g();
    const S = setInterval(g, C), H = (W) => {
      var b;
      const I = (b = W.detail) == null ? void 0 : b.screen;
      (!I || I === c.screen) && g();
    };
    return window.addEventListener("faith-hub-changed", H), () => {
      clearInterval(S), window.removeEventListener("faith-hub-changed", H);
    };
  }, [g, C]), { data: E, err: T, load: g };
}
function Td({ api: c, items: u, can: s, onDone: C }) {
  const [E, z] = q.useState(""), T = (R, g) => c.call(`/api/ha/approvals/${R}`, { approve: g }).then((S) => {
    z(S.text), C();
  }).catch((S) => z(S.message));
  return /* @__PURE__ */ d.jsxs(d.Fragment, { children: [
    /* @__PURE__ */ d.jsx("ul", { children: u.map((R) => /* @__PURE__ */ d.jsxs("li", { className: "row", children: [
      /* @__PURE__ */ d.jsxs("div", { className: "grow", children: [
        /* @__PURE__ */ d.jsx("div", { children: R.summary }),
        /* @__PURE__ */ d.jsxs("div", { className: "meta", children: [
          "Asked by ",
          R.requested_by.replace(/^household on /, "the ")
        ] })
      ] }),
      s && /* @__PURE__ */ d.jsxs("div", { className: "btns", children: [
        /* @__PURE__ */ d.jsx("button", { className: "primary", onClick: () => T(R.id, !0), children: "Approve" }),
        /* @__PURE__ */ d.jsx("button", { onClick: () => T(R.id, !1), children: "Deny" })
      ] })
    ] }, R.id)) }),
    !s && /* @__PURE__ */ d.jsx("div", { className: "meta", children: "A grown-up approves these (signed in here, or on their phone)." }),
    E && /* @__PURE__ */ d.jsx("div", { className: "toast", children: E })
  ] });
}
function Rd({ c, api: u, can: s, reload: C }) {
  var R;
  const E = c.items ?? [];
  let z;
  c.error ? z = /* @__PURE__ */ d.jsx("div", { className: "err", children: c.error }) : c.empty ? z = /* @__PURE__ */ d.jsx("div", { className: "empty", children: c.empty }) : c.kind === "schedule" ? z = /* @__PURE__ */ d.jsx("ul", { children: E.map((g, S) => /* @__PURE__ */ d.jsxs("li", { className: "row", children: [
    /* @__PURE__ */ d.jsx("span", { className: "time", children: jr(g.time) }),
    /* @__PURE__ */ d.jsxs("div", { className: "grow", children: [
      /* @__PURE__ */ d.jsx("div", { children: g.title }),
      g.meta && /* @__PURE__ */ d.jsx("div", { className: "meta", children: g.meta })
    ] })
  ] }, S)) }) : c.kind === "meals" ? z = /* @__PURE__ */ d.jsx("ul", { children: E.map((g, S) => /* @__PURE__ */ d.jsxs("li", { className: "row", children: [
    /* @__PURE__ */ d.jsxs("span", { className: "label grow", children: [
      g.label,
      g.time && jr(g.time) !== "Today" ? ` · ${jr(g.time)}` : ""
    ] }),
    /* @__PURE__ */ d.jsx("span", { children: g.title })
  ] }, S)) }) : c.kind === "checklist" || c.kind === "list" ? z = /* @__PURE__ */ d.jsx("ul", { children: E.map((g, S) => /* @__PURE__ */ d.jsxs("li", { className: "row", children: [
    c.kind === "checklist" && /* @__PURE__ */ d.jsx("span", { className: `check ${g.done ? "done" : ""}` }),
    /* @__PURE__ */ d.jsxs("span", { className: "grow", children: [
      g.label && /* @__PURE__ */ d.jsxs("span", { className: "label", children: [
        g.label,
        " "
      ] }),
      g.title
    ] }),
    (g.meta || g.time) && /* @__PURE__ */ d.jsx("span", { className: "meta", children: g.meta || jr(g.time) })
  ] }, S)) }) : c.kind === "entities" ? z = /* @__PURE__ */ d.jsx("div", { className: "tiles", children: (c.entities ?? []).map((g) => /* @__PURE__ */ d.jsxs("div", { className: "tile", children: [
    /* @__PURE__ */ d.jsx("div", { className: "meta", children: g.name }),
    /* @__PURE__ */ d.jsx("div", { className: "v", children: g.state })
  ] }, g.entity_id)) }) : c.kind === "approvals" ? z = /* @__PURE__ */ d.jsx(Td, { api: u, items: c.approvals ?? [], can: s, onDone: C }) : z = /* @__PURE__ */ d.jsx("div", { style: { whiteSpace: "pre-wrap" }, children: c.text });
  const T = c.kind === "checklist" ? E.length : c.kind === "approvals" ? (R = c.approvals) == null ? void 0 : R.length : void 0;
  return /* @__PURE__ */ d.jsxs("div", { className: "section", children: [
    /* @__PURE__ */ d.jsxs("h3", { children: [
      /* @__PURE__ */ d.jsx("ha-icon", { icon: zd[c.id] || "mdi:note-text-outline" }),
      c.title,
      T ? /* @__PURE__ */ d.jsx("span", { className: "count", children: T }) : null
    ] }),
    z
  ] });
}
function Ld({ api: c, config: u }) {
  const { data: s, err: C, load: E } = Vl(c, "/api/ha/view", u.cards ? { cards: u.cards } : {});
  if (C) return /* @__PURE__ */ d.jsx("ha-card", { children: /* @__PURE__ */ d.jsx("div", { className: "err", children: C }) });
  if (!s) return /* @__PURE__ */ d.jsx("ha-card", { children: /* @__PURE__ */ d.jsx("div", { className: "empty", children: "Loading…" }) });
  const z = s.person ? `${s.person.name}'s` : "The family's";
  return /* @__PURE__ */ d.jsxs("ha-card", { children: [
    u.title !== "" && /* @__PURE__ */ d.jsxs(d.Fragment, { children: [
      /* @__PURE__ */ d.jsx("div", { className: "eyebrow", children: (/* @__PURE__ */ new Date()).toLocaleDateString([], { weekday: "long", month: "long", day: "numeric" }) }),
      /* @__PURE__ */ d.jsx("div", { className: "hello", children: u.title ?? /* @__PURE__ */ d.jsxs(d.Fragment, { children: [
        z,
        " ",
        /* @__PURE__ */ d.jsx("em", { children: "day" }),
        ", at a glance."
      ] }) })
    ] }),
    u.show_apps !== !1 && s.apps.length > 0 && /* @__PURE__ */ d.jsx("div", { className: "section", children: /* @__PURE__ */ d.jsx("div", { className: "apps", children: s.apps.map((T) => /* @__PURE__ */ d.jsxs("a", { href: T.url, target: "_blank", rel: "noreferrer", children: [
      /* @__PURE__ */ d.jsx("span", { children: T.icon || "↗" }),
      T.name
    ] }, T.id)) }) }),
    s.cards.map((T) => /* @__PURE__ */ d.jsx(Rd, { c: T, api: c, can: s.can_approve, reload: E }, T.id)),
    !s.cards.length && /* @__PURE__ */ d.jsx("div", { className: "empty", children: "Nothing to show yet." })
  ] });
}
const oc = (c) => c.call("/api/ha/hub/people");
function sc({ api: c, people: u, pick: s, onBack: C, onDone: E }) {
  const [z, T] = q.useState(""), [R, g] = q.useState(""), S = async (W) => {
    g("");
    try {
      const I = await c.call("/api/ha/hub/signin", W);
      Go(c.screen, I.hub_session), E();
    } catch (I) {
      g(I.message), T("");
    }
  }, H = (W) => T((I) => (I + W).slice(0, 8));
  return /* @__PURE__ */ d.jsxs("div", { className: "pin", children: [
    /* @__PURE__ */ d.jsxs("div", { className: "head", style: { margin: 0 }, children: [
      /* @__PURE__ */ d.jsx(Un, { p: s, size: 44 }),
      /* @__PURE__ */ d.jsxs("h2", { children: [
        "Hi, ",
        s.name
      ] }),
      /* @__PURE__ */ d.jsx("button", { className: "ghost", style: { marginLeft: "auto" }, onClick: C, children: "Back" })
    ] }),
    (u == null ? void 0 : u.face_unlock) && u.suggested === s.id && /* @__PURE__ */ d.jsx("button", { className: "primary", onClick: () => S({ person: s.id, face: !0 }), children: "It's me (camera)" }),
    /* @__PURE__ */ d.jsx("div", { className: "dots", children: Array.from({ length: Math.max(4, z.length) }, (W, I) => /* @__PURE__ */ d.jsx("span", { className: I < z.length ? "on" : "" }, I)) }),
    /* @__PURE__ */ d.jsxs("div", { className: "keys", children: [
      ["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((W) => /* @__PURE__ */ d.jsx("button", { onClick: () => H(W), children: W }, W)),
      /* @__PURE__ */ d.jsx("button", { onClick: () => T(z.slice(0, -1)), "aria-label": "Delete", children: "⌫" }),
      /* @__PURE__ */ d.jsx("button", { onClick: () => H("0"), children: "0" }),
      /* @__PURE__ */ d.jsx("button", { className: "primary", disabled: z.length < 4, onClick: () => S({ person: s.id, pin: z }), children: "OK" })
    ] }),
    R && /* @__PURE__ */ d.jsx("div", { className: "err", children: R })
  ] });
}
function uc(c, u) {
  var C;
  const s = q.useRef(0);
  q.useEffect(() => {
    if (!(u != null && u.hub)) return;
    const E = () => {
      Date.now() - s.current > 15e3 && (s.current = Date.now(), c.call("/api/ha/hub/activity").catch(() => {
      }));
    };
    return window.addEventListener("pointerdown", E, !0), () => window.removeEventListener("pointerdown", E, !0);
  }, [(C = u == null ? void 0 : u.hub) == null ? void 0 : C.person.id]), q.useEffect(() => {
    u && !u.hub && u.household && c.screen && nc(c.screen) && Go(c.screen, null);
  }, [u]);
}
const ac = async (c) => {
  await c.call("/api/ha/hub/signout").catch(() => {
  }), Go(c.screen, null);
};
function Md({ api: c }) {
  const { data: u, err: s } = Vl(c, "/api/ha/view", { cards: [] }, 1e4), [C, E] = q.useState(null), [z, T] = q.useState(null), [R, g] = q.useState("");
  return uc(c, u), c.screen ? s ? /* @__PURE__ */ d.jsx("ha-card", { children: /* @__PURE__ */ d.jsx("div", { className: "err", children: s }) }) : u ? u.hub ? /* @__PURE__ */ d.jsx("ha-card", { children: /* @__PURE__ */ d.jsxs("div", { className: "head", children: [
    /* @__PURE__ */ d.jsx(Un, { p: u.hub.person, size: 44 }),
    /* @__PURE__ */ d.jsxs("div", { children: [
      /* @__PURE__ */ d.jsx("h2", { children: u.hub.person.name }),
      /* @__PURE__ */ d.jsxs("div", { className: "sub", children: [
        "Signed in on this screen",
        u.hub.remaining_seconds < 60 ? ` · signing out in ${u.hub.remaining_seconds}s` : ""
      ] })
    ] }),
    /* @__PURE__ */ d.jsx("div", { className: "right", children: /* @__PURE__ */ d.jsx("button", { onClick: () => ac(c), children: "Sign out" }) })
  ] }) }) : u.person ? /* @__PURE__ */ d.jsx("ha-card", { children: /* @__PURE__ */ d.jsxs("div", { className: "head", children: [
    /* @__PURE__ */ d.jsx(Un, { p: u.person, size: 44 }),
    /* @__PURE__ */ d.jsxs("div", { children: [
      /* @__PURE__ */ d.jsx("h2", { children: u.person.name }),
      /* @__PURE__ */ d.jsx("div", { className: "sub", children: "Your own Home Assistant account" })
    ] })
  ] }) }) : z ? /* @__PURE__ */ d.jsx("ha-card", { children: /* @__PURE__ */ d.jsx(sc, { api: c, people: C, pick: z, onBack: () => T(null), onDone: () => {
    T(null), E(null);
  } }) }) : C ? /* @__PURE__ */ d.jsxs("ha-card", { children: [
    /* @__PURE__ */ d.jsxs("div", { className: "head", children: [
      /* @__PURE__ */ d.jsx("h2", { children: "Who's here?" }),
      /* @__PURE__ */ d.jsx("div", { className: "right", children: /* @__PURE__ */ d.jsx("button", { className: "ghost", onClick: () => E(null), children: "Cancel" }) })
    ] }),
    /* @__PURE__ */ d.jsx("div", { className: "people", children: C.people.map((S) => /* @__PURE__ */ d.jsxs("button", { className: `person ${C.suggested === S.id ? "suggested" : ""}`, onClick: () => T(S), children: [
      /* @__PURE__ */ d.jsx(Un, { p: S, size: 52 }),
      S.name
    ] }, S.id)) })
  ] }) : /* @__PURE__ */ d.jsxs("ha-card", { children: [
    /* @__PURE__ */ d.jsxs("div", { className: "head", children: [
      /* @__PURE__ */ d.jsx("ha-icon", { icon: "mdi:account-group-outline" }),
      /* @__PURE__ */ d.jsxs("div", { children: [
        /* @__PURE__ */ d.jsx("h2", { children: "Shared view" }),
        /* @__PURE__ */ d.jsx("div", { className: "sub", children: "Everyone sees the family's things. Sign in for your own." })
      ] }),
      /* @__PURE__ */ d.jsx("div", { className: "right", children: /* @__PURE__ */ d.jsx("button", { className: "primary", onClick: () => oc(c).then((S) => {
        E(S);
        const H = S.people.find((W) => W.id === S.suggested);
        H && T(H);
      }).catch((S) => g(S.message)), children: "Sign in" }) })
    ] }),
    R && /* @__PURE__ */ d.jsx("div", { className: "err", children: R })
  ] }) : /* @__PURE__ */ d.jsx("ha-card", { children: /* @__PURE__ */ d.jsx("div", { className: "empty", children: "…" }) }) : /* @__PURE__ */ d.jsx("ha-card", { children: /* @__PURE__ */ d.jsxs("div", { className: "err", children: [
    "Give this card the screen it's on: ",
    /* @__PURE__ */ d.jsx("code", { children: "screen: kitchen" })
  ] }) });
}
const Id = [
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
], Dd = (c) => {
  var u;
  return ((u = Id.find(([s]) => s.test(c))) == null ? void 0 : u[1]) ?? c.replace(/_/g, " ");
};
let Fd;
const pn = () => Fd ?? (Fd = new AudioContext()), Od = (c) => {
  const u = new Uint8Array(c.fftSize);
  c.getByteTimeDomainData(u);
  let s = 0;
  for (const C of u) s += ((C - 128) / 128) ** 2;
  return Math.min(1, Math.sqrt(s / u.length) * 4);
}, Ad = (c) => {
  let u = "";
  for (let s = 0; s < c.length; s += 32768) u += String.fromCharCode(...c.subarray(s, s + 32768));
  return btoa(u);
};
function cc(c, u) {
  const [s, C] = q.useState([]), [E, z] = q.useState(!1), [T, R] = q.useState(null), [g, S] = q.useState(!1), [H, W] = q.useState(0), I = q.useRef(null), b = q.useRef(null), ee = q.useRef(null), J = q.useCallback(() => {
    I.current = null, c.call("/api/ha/chat/history").then((re) => {
      I.current = re.conversation_id, C(re.messages.map((ue) => ({ me: ue.role === "user", text: ue.content })));
    }).catch(() => C([]));
  }, [c]);
  q.useEffect(() => {
    J();
    const re = (ue) => {
      var K;
      ((K = ue.detail) == null ? void 0 : K.screen) === c.screen && J();
    };
    return window.addEventListener("faith-hub-changed", re), () => window.removeEventListener("faith-hub-changed", re);
  }, [J]);
  const [, le] = q.useState(0);
  q.useEffect(() => {
    if (!H) return;
    const re = setTimeout(() => le((ue) => ue + 1), 3100);
    return () => clearTimeout(re);
  }, [H]), q.useEffect(() => () => {
    var re;
    (re = ee.current) == null || re.pause();
  }, []);
  const je = async (re) => {
    var ue;
    try {
      const K = await c.call("/api/ha/speak", { text: re });
      (ue = ee.current) == null || ue.pause();
      const ie = new Audio(`data:${K.mime};base64,${K.audio}`), ne = pn().createAnalyser();
      ne.fftSize = 512, pn().createMediaElementSource(ie).connect(ne), ne.connect(pn().destination), ee.current = ie, b.current = ne, S(!0);
      const ye = () => {
        ee.current === ie && (b.current = null, S(!1));
      };
      ie.onended = ye, ie.onerror = ye, await pn().resume(), await ie.play();
    } catch {
      b.current = null, S(!1);
    }
  }, Me = async (re, ue) => {
    z(!0), C((K) => [...K, ...ue ? [{ me: !0, text: ue }] : [], { text: "…" }]);
    try {
      const K = await c.call("/api/ha/chat", { ...re, conversation_id: I.current });
      I.current = K.conversation_id, C((ie) => [
        ...ie.slice(0, -1),
        ...K.heard ? [{ me: !0, text: K.heard + (K.speaker ? ` (${K.speaker.name})` : "") }] : [],
        ...K.confirms.map((ne) => ({ text: "", confirm: ne })),
        ...K.approvals.map((ne) => ({ text: "", waiting: ne.summary })),
        { text: K.text, tools: K.tools }
      ]), W(Date.now()), u && K.text && je(K.text);
    } catch (K) {
      C((ie) => [...ie.slice(0, -1), { text: `Sorry, that didn't work: ${K.message}` }]);
    } finally {
      z(!1);
    }
  }, Pe = async () => {
    var re;
    if (T) {
      T.stop(), R(null);
      return;
    }
    (re = ee.current) == null || re.pause(), b.current = null, S(!1);
    try {
      const ue = await navigator.mediaDevices.getUserMedia({ audio: !0 }), K = new MediaRecorder(ue), ie = [];
      try {
        const ne = pn().createAnalyser();
        ne.fftSize = 512, pn().createMediaStreamSource(ue).connect(ne), b.current = ne, pn().resume();
      } catch {
      }
      K.ondataavailable = (ne) => ne.data.size && ie.push(ne.data), K.onstop = async () => {
        ue.getTracks().forEach((ye) => ye.stop()), b.current = null;
        const ne = new Blob(ie, { type: K.mimeType || "audio/webm" });
        Me({ audio: Ad(new Uint8Array(await ne.arrayBuffer())), mime: ne.type.split(";")[0] }, "");
      }, K.start(), R(K);
    } catch {
      C((ue) => [...ue, { text: "The microphone isn't available (Home Assistant needs https for it)." }]);
    }
  }, he = (re, ue) => c.call(`/api/ha/confirm/${re}`, { approve: ue }).then((K) => C((ie) => ie.map((ne) => {
    var ye;
    return ((ye = ne.confirm) == null ? void 0 : ye.id) === re ? { ...ne, confirm: { ...ne.confirm, done: K.text } } : ne;
  }))).catch((K) => C((ie) => [...ie, { text: K.message }])), Te = q.useCallback(() => b.current ? Od(b.current) : void 0, []), $ = T ? "listening" : E ? "thinking" : g || !u && Date.now() - H < 3e3 ? "speaking" : "idle";
  return { lines: s, busy: E, rec: T, state: $, level: Te, send: Me, mic: Pe, answer: he, fresh: () => {
    I.current = null, C([]);
  } };
}
function fc({ l: c, answer: u }) {
  return c.confirm ? /* @__PURE__ */ d.jsxs("div", { className: "box", children: [
    /* @__PURE__ */ d.jsxs("div", { children: [
      "Do this? ",
      /* @__PURE__ */ d.jsx("b", { children: c.confirm.summary })
    ] }),
    c.confirm.done ? /* @__PURE__ */ d.jsx("div", { className: "meta", children: c.confirm.done }) : /* @__PURE__ */ d.jsxs("div", { className: "btns", children: [
      /* @__PURE__ */ d.jsx("button", { className: "primary", onClick: () => u(c.confirm.id, !0), children: "Yes" }),
      /* @__PURE__ */ d.jsx("button", { onClick: () => u(c.confirm.id, !1), children: "No" })
    ] })
  ] }) : /* @__PURE__ */ d.jsx("div", { className: "box wait", children: /* @__PURE__ */ d.jsxs("div", { children: [
    "Waiting for a grown-up: ",
    /* @__PURE__ */ d.jsx("b", { children: c.waiting })
  ] }) });
}
function dc({ c, placeholder: u = "Ask FAITH" }) {
  const [s, C] = q.useState("");
  return /* @__PURE__ */ d.jsxs("form", { className: "ask", onSubmit: (E) => {
    E.preventDefault();
    const z = s.trim();
    z && !c.busy && (C(""), c.send({ text: z }, z));
  }, children: [
    /* @__PURE__ */ d.jsx("button", { type: "button", className: c.rec ? "rec" : "", title: c.rec ? "Stop and send" : "Talk", disabled: c.busy, onClick: c.mic, children: /* @__PURE__ */ d.jsx("ha-icon", { icon: c.rec ? "mdi:stop" : "mdi:microphone" }) }),
    /* @__PURE__ */ d.jsx("input", { value: s, onChange: (E) => C(E.target.value), placeholder: c.rec ? "Listening… tap stop when done" : u }),
    /* @__PURE__ */ d.jsx("button", { className: "primary", type: "submit", disabled: c.busy || !s.trim(), title: "Send", children: /* @__PURE__ */ d.jsx("ha-icon", { icon: "mdi:send" }) })
  ] });
}
function Ud({ api: c, config: u }) {
  const s = cc(c, u.speak === !0), C = q.useRef(null);
  return q.useEffect(() => {
    var E;
    (E = C.current) == null || E.scrollIntoView({ block: "nearest" });
  }, [s.lines]), /* @__PURE__ */ d.jsxs("ha-card", { children: [
    /* @__PURE__ */ d.jsxs("div", { className: "head", children: [
      /* @__PURE__ */ d.jsx(ic, { className: "emblem", size: 56, tone: c.dark ? "dark" : "light", state: s.state, level: s.level }),
      /* @__PURE__ */ d.jsx("h2", { children: u.title ?? "Ask FAITH" }),
      s.lines.length > 0 && /* @__PURE__ */ d.jsx("div", { className: "right", children: /* @__PURE__ */ d.jsx("button", { className: "ghost", onClick: s.fresh, children: "New" }) })
    ] }),
    /* @__PURE__ */ d.jsxs("div", { className: "chat", children: [
      !s.lines.length && /* @__PURE__ */ d.jsx("div", { className: "empty", children: "What's on today? What's for dinner? Add milk to the list. Turn off the lights." }),
      s.lines.map((E, z) => {
        var T;
        return E.confirm || E.waiting ? /* @__PURE__ */ d.jsx(fc, { l: E, answer: s.answer }, z) : /* @__PURE__ */ d.jsxs("div", { style: { display: "flex", flexDirection: "column", gap: 4, alignItems: E.me ? "flex-end" : "flex-start" }, children: [
          /* @__PURE__ */ d.jsx("div", { className: `msg ${E.me ? "me" : "faith"}`, children: E.text }),
          !!((T = E.tools) != null && T.length) && /* @__PURE__ */ d.jsx("div", { className: "chips", children: [...new Set(E.tools.map(Dd))].map((R) => /* @__PURE__ */ d.jsx("span", { className: "chip", children: R }, R)) })
        ] }, z);
      }),
      /* @__PURE__ */ d.jsx("div", { ref: C })
    ] }),
    /* @__PURE__ */ d.jsx(dc, { c: s })
  ] });
}
const Hd = (c) => c.getHours() < 5 ? "Good night" : c.getHours() < 12 ? "Good morning" : c.getHours() < 18 ? "Good afternoon" : "Good evening";
function $d({ api: c, config: u }) {
  var he, Te;
  const { data: s, err: C, load: E } = Vl(c, "/api/ha/view", { cards: u.cards ?? ["today"] }, 3e4), z = cc(c, u.speak !== !1), [T, R] = q.useState(/* @__PURE__ */ new Date()), [g, S] = q.useState(null), [H, W] = q.useState(null);
  q.useEffect(() => {
    const $ = setInterval(() => R(/* @__PURE__ */ new Date()), 1e4);
    return () => clearInterval($);
  }, []), uc(c, s);
  const I = !!c.screen && !!s && !s.person;
  if (q.useEffect(() => {
    I && (s != null && s.can_sign_in) && oc(c).then(S).catch(() => {
    });
  }, [I, s == null ? void 0 : s.can_sign_in, (he = s == null ? void 0 : s.hub) == null ? void 0 : he.person.id]), C) return /* @__PURE__ */ d.jsx("ha-card", { class: "hub", children: /* @__PURE__ */ d.jsx("div", { className: "err", children: C }) });
  const b = ((Te = s == null ? void 0 : s.hub) == null ? void 0 : Te.person) ?? (s == null ? void 0 : s.person) ?? null, ee = [...z.lines].reverse().find(($) => !$.me && !$.confirm && !$.waiting), J = [...z.lines].reverse().find(($) => $.me), le = z.lines.filter(($) => $.confirm && !$.confirm.done || $.waiting).slice(-2), je = s == null ? void 0 : s.cards.flatMap(($) => $.kind === "schedule" ? $.items ?? [] : []).find(($) => !$.done), Me = Number(u.size) || 300, Pe = z.rec ? "Listening… tap FAITH to send" : z.busy ? "Thinking…" : z.state === "speaking" ? "" : "Tap FAITH to talk";
  return /* @__PURE__ */ d.jsxs("ha-card", { class: "hub", children: [
    /* @__PURE__ */ d.jsxs("div", { className: "hub-top", children: [
      /* @__PURE__ */ d.jsxs("div", { children: [
        /* @__PURE__ */ d.jsx("div", { className: "clock", children: T.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }) }),
        /* @__PURE__ */ d.jsx("div", { className: "eyebrow", children: T.toLocaleDateString([], { weekday: "long", month: "long", day: "numeric" }) })
      ] }),
      /* @__PURE__ */ d.jsxs("div", { className: "right", children: [
        !!(s != null && s.pending_approvals) && /* @__PURE__ */ d.jsxs("span", { className: "pill", children: [
          s.pending_approvals,
          " waiting for approval"
        ] }),
        (s == null ? void 0 : s.hub) && /* @__PURE__ */ d.jsxs("button", { onClick: () => ac(c).then(E), children: [
          "Sign out ",
          s.hub.person.name
        ] })
      ] })
    ] }),
    /* @__PURE__ */ d.jsxs("div", { className: "hub-mid", children: [
      /* @__PURE__ */ d.jsxs("div", { className: "hello", children: [
        Hd(T),
        ", ",
        /* @__PURE__ */ d.jsx("em", { children: b ? b.name : "everyone" }),
        "."
      ] }),
      je && /* @__PURE__ */ d.jsxs("div", { className: "meta", children: [
        "Next: ",
        jr(je.time),
        " ",
        je.title
      ] }),
      /* @__PURE__ */ d.jsx("button", { className: "orb", onClick: z.mic, disabled: z.busy, "aria-label": z.rec ? "Stop and send" : "Talk to FAITH", children: /* @__PURE__ */ d.jsx(ic, { size: Me, tone: c.dark ? "dark" : "light", state: z.state, level: z.level }) }),
      Pe && /* @__PURE__ */ d.jsx("div", { className: "hint", children: Pe }),
      J && !z.rec && /* @__PURE__ */ d.jsxs("div", { className: "heard", children: [
        "“",
        J.text,
        "”"
      ] }),
      ee && ee.text !== "…" && /* @__PURE__ */ d.jsx("div", { className: "reply", children: ee.text }),
      le.map(($, ce) => /* @__PURE__ */ d.jsx(fc, { l: $, answer: z.answer }, ce))
    ] }),
    u.show_input !== !1 && /* @__PURE__ */ d.jsx(dc, { c: z, placeholder: "Or type to FAITH" }),
    I && g && !(s != null && s.hub) && /* @__PURE__ */ d.jsx("div", { className: "faces", children: g.people.map(($) => /* @__PURE__ */ d.jsxs("button", { className: `face ${g.suggested === $.id ? "on" : ""}`, onClick: () => W($), children: [
      /* @__PURE__ */ d.jsx(Un, { p: $, size: 56, ring: g.suggested === $.id }),
      $.name
    ] }, $.id)) }),
    H && /* @__PURE__ */ d.jsx("div", { className: "overlay", children: /* @__PURE__ */ d.jsx(sc, { api: c, people: g, pick: H, onBack: () => W(null), onDone: () => {
      W(null), E();
    } }) })
  ] });
}
function Bd({ api: c, config: u }) {
  const { data: s, err: C, load: E } = Vl(c, "/api/ha/rewards"), [z, T] = q.useState(""), R = (S, H, W) => c.call(S, { args: H }).then((I) => {
    T(I.approval ? `${W} A grown-up will approve it.` : W), E();
  }).catch((I) => T(I.message));
  if (C) return /* @__PURE__ */ d.jsx("ha-card", { children: /* @__PURE__ */ d.jsx("div", { className: "err", children: C }) });
  if (!s) return /* @__PURE__ */ d.jsx("ha-card", { children: /* @__PURE__ */ d.jsx("div", { className: "empty", children: "Loading…" }) });
  const g = (S) => `${S} pt${S === 1 ? "" : "s"}`;
  return /* @__PURE__ */ d.jsxs("ha-card", { children: [
    /* @__PURE__ */ d.jsxs("div", { className: "head", children: [
      /* @__PURE__ */ d.jsx("ha-icon", { icon: "mdi:star-circle-outline" }),
      /* @__PURE__ */ d.jsx("h2", { children: u.title ?? "Points & rewards" })
    ] }),
    s.me ? /* @__PURE__ */ d.jsxs(d.Fragment, { children: [
      /* @__PURE__ */ d.jsxs("div", { className: "section mine", children: [
        /* @__PURE__ */ d.jsxs("div", { className: "honey", children: [
          /* @__PURE__ */ d.jsx("span", { className: "big", children: s.me.points }),
          /* @__PURE__ */ d.jsx("span", { className: "label", children: "points" })
        ] }),
        /* @__PURE__ */ d.jsxs("div", { children: [
          /* @__PURE__ */ d.jsxs("div", { className: "eyebrow", children: [
            s.me.name,
            "'s points"
          ] }),
          /* @__PURE__ */ d.jsx("div", { className: "meta", children: "Do jobs, ask a grown-up, and spend them on rewards." })
        ] })
      ] }),
      /* @__PURE__ */ d.jsxs("div", { className: "section", children: [
        /* @__PURE__ */ d.jsx("h3", { children: "Jobs" }),
        /* @__PURE__ */ d.jsx("ul", { children: s.activities.filter((S) => S.kids_can_claim).map((S) => /* @__PURE__ */ d.jsxs("li", { className: "row", children: [
          /* @__PURE__ */ d.jsx("span", { className: "grow", children: S.name }),
          /* @__PURE__ */ d.jsxs("span", { className: "pill", children: [
            "+",
            g(S.points)
          ] }),
          /* @__PURE__ */ d.jsx("button", { onClick: () => R("/api/ha/rewards/claim", { activity: S.id }, `Asked for ${g(S.points)} for "${S.name}".`), children: "I did it" })
        ] }, S.id)) })
      ] }),
      /* @__PURE__ */ d.jsxs("div", { className: "section", children: [
        /* @__PURE__ */ d.jsx("h3", { children: "Rewards" }),
        /* @__PURE__ */ d.jsx("ul", { children: s.rewards.map((S) => /* @__PURE__ */ d.jsxs("li", { className: "row", children: [
          /* @__PURE__ */ d.jsx("span", { className: "grow", children: S.name }),
          /* @__PURE__ */ d.jsx("span", { className: "pill", children: g(S.cost) }),
          /* @__PURE__ */ d.jsx("button", { className: "primary", disabled: s.me.points < S.cost, onClick: () => R("/api/ha/rewards/redeem", { reward: S.id }, `Asked for "${S.name}".`), children: "Get it" })
        ] }, S.id)) })
      ] })
    ] }) : /* @__PURE__ */ d.jsxs(d.Fragment, { children: [
      !s.kids.length && /* @__PURE__ */ d.jsx("div", { className: "empty", children: "No children in FAITH's family list yet." }),
      /* @__PURE__ */ d.jsx("ul", { children: s.kids.map((S) => /* @__PURE__ */ d.jsxs("li", { className: "row", children: [
        /* @__PURE__ */ d.jsx(Un, { p: S, size: 34 }),
        /* @__PURE__ */ d.jsx("span", { className: "grow", children: S.name }),
        /* @__PURE__ */ d.jsx("span", { className: "pill", children: g(S.points) }),
        s.can_give && /* @__PURE__ */ d.jsx("div", { className: "btns", children: s.allowed_points.map((H) => /* @__PURE__ */ d.jsxs("button", { onClick: () => R("/api/ha/rewards/award", { person: S.id, points: H, reason: "Well done (from the dashboard)" }, `Gave ${S.name} ${g(H)}.`), children: [
          "+",
          H
        ] }, H)) })
      ] }, S.id)) }),
      !s.can_give && s.kids.length > 0 && /* @__PURE__ */ d.jsx("div", { className: "meta", children: "Sign in to give points." })
    ] }),
    z && /* @__PURE__ */ d.jsx("div", { className: "toast", children: z })
  ] });
}
function Rr(c, u, s, C, E) {
  if (customElements.get(c)) return;
  class z extends HTMLElement {
    constructor() {
      super(...arguments);
      He(this, "_hass");
      He(this, "_config");
      He(this, "_root");
      He(this, "_api");
    }
    setConfig(g) {
      this._config = { ...g }, this._api = void 0, this.render();
    }
    set hass(g) {
      const S = !this._hass;
      this._hass = g, S && this.render();
    }
    getCardSize() {
      return E;
    }
    static getStubConfig() {
      return c === "faith-who-card" || c === "faith-hub-card" ? { screen: "kitchen" } : {};
    }
    connectedCallback() {
      this.render();
    }
    render() {
      if (!(!this._config || !this._hass)) {
        if (!this._root) {
          const g = this.shadowRoot ?? this.attachShadow({ mode: "open" }), S = document.createElement("style");
          S.textContent = kd, g.appendChild(S);
          const H = document.createElement("div");
          g.appendChild(H), this._root = wd.createRoot(H);
        }
        this._api ?? (this._api = Sd(() => this._hass, this._config)), this._root.render(/* @__PURE__ */ d.jsx(C, { api: this._api, config: this._config }));
      }
    }
  }
  customElements.define(c, z), (window.customCards ?? (window.customCards = [])).push({ type: c, name: u, description: s, preview: !1 });
}
Rr("faith-card", "FAITH", "The family's day from FAITH: today, meals, shopping, chores, the house and approvals, for whoever is looking.", Ld, 6);
Rr("faith-who-card", "FAITH: who's here", "For a shared tablet: shows who is signed in, and lets a person sign in with their PIN.", Md, 2);
Rr("faith-chat-card", "FAITH: chat", "Talk or type to FAITH.", Ud, 6);
Rr("faith-hub-card", "FAITH: hub", "The wall screen: FAITH in the middle (tap to talk, answers out loud), the time, and who's here.", $d, 9);
Rr("faith-rewards-card", "FAITH: points & rewards", "Children's points, jobs to claim and rewards; parents give points.", Bd, 4);
