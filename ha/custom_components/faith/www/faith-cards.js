var ed = Object.defineProperty;
var td = (d, c, u) => c in d ? ed(d, c, { enumerable: !0, configurable: !0, writable: !0, value: u }) : d[c] = u;
var Fe = (d, c, u) => td(d, typeof c != "symbol" ? c + "" : c, u);
var Fo = { exports: {} }, Cr = {}, Oo = { exports: {} }, te = {};
/**
 * @license React
 * react.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var Ha;
function nd() {
  if (Ha) return te;
  Ha = 1;
  var d = Symbol.for("react.element"), c = Symbol.for("react.portal"), u = Symbol.for("react.fragment"), P = Symbol.for("react.strict_mode"), j = Symbol.for("react.profiler"), M = Symbol.for("react.provider"), R = Symbol.for("react.context"), z = Symbol.for("react.forward_ref"), g = Symbol.for("react.suspense"), _ = Symbol.for("react.memo"), B = Symbol.for("react.lazy"), Z = Symbol.iterator;
  function $(a) {
    return a === null || typeof a != "object" ? null : (a = Z && a[Z] || a["@@iterator"], typeof a == "function" ? a : null);
  }
  var ue = { isMounted: function() {
    return !1;
  }, enqueueForceUpdate: function() {
  }, enqueueReplaceState: function() {
  }, enqueueSetState: function() {
  } }, le = Object.assign, ne = {};
  function re(a, x, I) {
    this.props = a, this.context = x, this.refs = ne, this.updater = I || ue;
  }
  re.prototype.isReactComponent = {}, re.prototype.setState = function(a, x) {
    if (typeof a != "object" && typeof a != "function" && a != null) throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");
    this.updater.enqueueSetState(this, a, x, "setState");
  }, re.prototype.forceUpdate = function(a) {
    this.updater.enqueueForceUpdate(this, a, "forceUpdate");
  };
  function Ne() {
  }
  Ne.prototype = re.prototype;
  function b(a, x, I) {
    this.props = a, this.context = x, this.refs = ne, this.updater = I || ue;
  }
  var F = b.prototype = new Ne();
  F.constructor = b, le(F, re.prototype), F.isPureReactComponent = !0;
  var Q = Array.isArray, J = Object.prototype.hasOwnProperty, q = { current: null }, ee = { key: !0, ref: !0, __self: !0, __source: !0 };
  function Ce(a, x, I) {
    var W, X = {}, G = null, oe = null;
    if (x != null) for (W in x.ref !== void 0 && (oe = x.ref), x.key !== void 0 && (G = "" + x.key), x) J.call(x, W) && !ee.hasOwnProperty(W) && (X[W] = x[W]);
    var K = arguments.length - 2;
    if (K === 1) X.children = I;
    else if (1 < K) {
      for (var ie = Array(K), xe = 0; xe < K; xe++) ie[xe] = arguments[xe + 2];
      X.children = ie;
    }
    if (a && a.defaultProps) for (W in K = a.defaultProps, K) X[W] === void 0 && (X[W] = K[W]);
    return { $$typeof: d, type: a, key: G, ref: oe, props: X, _owner: q.current };
  }
  function it(a, x) {
    return { $$typeof: d, type: a.type, key: x, ref: a.ref, props: a.props, _owner: a._owner };
  }
  function Ve(a) {
    return typeof a == "object" && a !== null && a.$$typeof === d;
  }
  function Me(a) {
    var x = { "=": "=0", ":": "=2" };
    return "$" + a.replace(/[=:]/g, function(I) {
      return x[I];
    });
  }
  var be = /\/+/g;
  function Oe(a, x) {
    return typeof a == "object" && a !== null && a.key != null ? Me("" + a.key) : x.toString(36);
  }
  function Qe(a, x, I, W, X) {
    var G = typeof a;
    (G === "undefined" || G === "boolean") && (a = null);
    var oe = !1;
    if (a === null) oe = !0;
    else switch (G) {
      case "string":
      case "number":
        oe = !0;
        break;
      case "object":
        switch (a.$$typeof) {
          case d:
          case c:
            oe = !0;
        }
    }
    if (oe) return oe = a, X = X(oe), a = W === "" ? "." + Oe(oe, 0) : W, Q(X) ? (I = "", a != null && (I = a.replace(be, "$&/") + "/"), Qe(X, x, I, "", function(xe) {
      return xe;
    })) : X != null && (Ve(X) && (X = it(X, I + (!X.key || oe && oe.key === X.key ? "" : ("" + X.key).replace(be, "$&/") + "/") + a)), x.push(X)), 1;
    if (oe = 0, W = W === "" ? "." : W + ":", Q(a)) for (var K = 0; K < a.length; K++) {
      G = a[K];
      var ie = W + Oe(G, K);
      oe += Qe(G, x, I, ie, X);
    }
    else if (ie = $(a), typeof ie == "function") for (a = ie.call(a), K = 0; !(G = a.next()).done; ) G = G.value, ie = W + Oe(G, K++), oe += Qe(G, x, I, ie, X);
    else if (G === "object") throw x = String(a), Error("Objects are not valid as a React child (found: " + (x === "[object Object]" ? "object with keys {" + Object.keys(a).join(", ") + "}" : x) + "). If you meant to render a collection of children, use an array instead.");
    return oe;
  }
  function Ke(a, x, I) {
    if (a == null) return a;
    var W = [], X = 0;
    return Qe(a, W, "", "", function(G) {
      return x.call(I, G, X++);
    }), W;
  }
  function ze(a) {
    if (a._status === -1) {
      var x = a._result;
      x = x(), x.then(function(I) {
        (a._status === 0 || a._status === -1) && (a._status = 1, a._result = I);
      }, function(I) {
        (a._status === 0 || a._status === -1) && (a._status = 2, a._result = I);
      }), a._status === -1 && (a._status = 0, a._result = x);
    }
    if (a._status === 1) return a._result.default;
    throw a._result;
  }
  var ve = { current: null }, T = { transition: null }, w = { ReactCurrentDispatcher: ve, ReactCurrentBatchConfig: T, ReactCurrentOwner: q };
  function k() {
    throw Error("act(...) is not supported in production builds of React.");
  }
  return te.Children = { map: Ke, forEach: function(a, x, I) {
    Ke(a, function() {
      x.apply(this, arguments);
    }, I);
  }, count: function(a) {
    var x = 0;
    return Ke(a, function() {
      x++;
    }), x;
  }, toArray: function(a) {
    return Ke(a, function(x) {
      return x;
    }) || [];
  }, only: function(a) {
    if (!Ve(a)) throw Error("React.Children.only expected to receive a single React element child.");
    return a;
  } }, te.Component = re, te.Fragment = u, te.Profiler = j, te.PureComponent = b, te.StrictMode = P, te.Suspense = g, te.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = w, te.act = k, te.cloneElement = function(a, x, I) {
    if (a == null) throw Error("React.cloneElement(...): The argument must be a React element, but you passed " + a + ".");
    var W = le({}, a.props), X = a.key, G = a.ref, oe = a._owner;
    if (x != null) {
      if (x.ref !== void 0 && (G = x.ref, oe = q.current), x.key !== void 0 && (X = "" + x.key), a.type && a.type.defaultProps) var K = a.type.defaultProps;
      for (ie in x) J.call(x, ie) && !ee.hasOwnProperty(ie) && (W[ie] = x[ie] === void 0 && K !== void 0 ? K[ie] : x[ie]);
    }
    var ie = arguments.length - 2;
    if (ie === 1) W.children = I;
    else if (1 < ie) {
      K = Array(ie);
      for (var xe = 0; xe < ie; xe++) K[xe] = arguments[xe + 2];
      W.children = K;
    }
    return { $$typeof: d, type: a.type, key: X, ref: G, props: W, _owner: oe };
  }, te.createContext = function(a) {
    return a = { $$typeof: R, _currentValue: a, _currentValue2: a, _threadCount: 0, Provider: null, Consumer: null, _defaultValue: null, _globalName: null }, a.Provider = { $$typeof: M, _context: a }, a.Consumer = a;
  }, te.createElement = Ce, te.createFactory = function(a) {
    var x = Ce.bind(null, a);
    return x.type = a, x;
  }, te.createRef = function() {
    return { current: null };
  }, te.forwardRef = function(a) {
    return { $$typeof: z, render: a };
  }, te.isValidElement = Ve, te.lazy = function(a) {
    return { $$typeof: B, _payload: { _status: -1, _result: a }, _init: ze };
  }, te.memo = function(a, x) {
    return { $$typeof: _, type: a, compare: x === void 0 ? null : x };
  }, te.startTransition = function(a) {
    var x = T.transition;
    T.transition = {};
    try {
      a();
    } finally {
      T.transition = x;
    }
  }, te.unstable_act = k, te.useCallback = function(a, x) {
    return ve.current.useCallback(a, x);
  }, te.useContext = function(a) {
    return ve.current.useContext(a);
  }, te.useDebugValue = function() {
  }, te.useDeferredValue = function(a) {
    return ve.current.useDeferredValue(a);
  }, te.useEffect = function(a, x) {
    return ve.current.useEffect(a, x);
  }, te.useId = function() {
    return ve.current.useId();
  }, te.useImperativeHandle = function(a, x, I) {
    return ve.current.useImperativeHandle(a, x, I);
  }, te.useInsertionEffect = function(a, x) {
    return ve.current.useInsertionEffect(a, x);
  }, te.useLayoutEffect = function(a, x) {
    return ve.current.useLayoutEffect(a, x);
  }, te.useMemo = function(a, x) {
    return ve.current.useMemo(a, x);
  }, te.useReducer = function(a, x, I) {
    return ve.current.useReducer(a, x, I);
  }, te.useRef = function(a) {
    return ve.current.useRef(a);
  }, te.useState = function(a) {
    return ve.current.useState(a);
  }, te.useSyncExternalStore = function(a, x, I) {
    return ve.current.useSyncExternalStore(a, x, I);
  }, te.useTransition = function() {
    return ve.current.useTransition();
  }, te.version = "18.3.1", te;
}
var Va;
function Qo() {
  return Va || (Va = 1, Oo.exports = nd()), Oo.exports;
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
var Ba;
function rd() {
  if (Ba) return Cr;
  Ba = 1;
  var d = Qo(), c = Symbol.for("react.element"), u = Symbol.for("react.fragment"), P = Object.prototype.hasOwnProperty, j = d.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner, M = { key: !0, ref: !0, __self: !0, __source: !0 };
  function R(z, g, _) {
    var B, Z = {}, $ = null, ue = null;
    _ !== void 0 && ($ = "" + _), g.key !== void 0 && ($ = "" + g.key), g.ref !== void 0 && (ue = g.ref);
    for (B in g) P.call(g, B) && !M.hasOwnProperty(B) && (Z[B] = g[B]);
    if (z && z.defaultProps) for (B in g = z.defaultProps, g) Z[B] === void 0 && (Z[B] = g[B]);
    return { $$typeof: c, type: z, key: $, ref: ue, props: Z, _owner: j.current };
  }
  return Cr.Fragment = u, Cr.jsx = R, Cr.jsxs = R, Cr;
}
var Wa;
function ld() {
  return Wa || (Wa = 1, Fo.exports = rd()), Fo.exports;
}
var h = ld(), fe = Qo(), Al = {}, Ao = { exports: {} }, qe = {}, Uo = { exports: {} }, $o = {};
/**
 * @license React
 * scheduler.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var Qa;
function id() {
  return Qa || (Qa = 1, (function(d) {
    function c(T, w) {
      var k = T.length;
      T.push(w);
      e: for (; 0 < k; ) {
        var a = k - 1 >>> 1, x = T[a];
        if (0 < j(x, w)) T[a] = w, T[k] = x, k = a;
        else break e;
      }
    }
    function u(T) {
      return T.length === 0 ? null : T[0];
    }
    function P(T) {
      if (T.length === 0) return null;
      var w = T[0], k = T.pop();
      if (k !== w) {
        T[0] = k;
        e: for (var a = 0, x = T.length, I = x >>> 1; a < I; ) {
          var W = 2 * (a + 1) - 1, X = T[W], G = W + 1, oe = T[G];
          if (0 > j(X, k)) G < x && 0 > j(oe, X) ? (T[a] = oe, T[G] = k, a = G) : (T[a] = X, T[W] = k, a = W);
          else if (G < x && 0 > j(oe, k)) T[a] = oe, T[G] = k, a = G;
          else break e;
        }
      }
      return w;
    }
    function j(T, w) {
      var k = T.sortIndex - w.sortIndex;
      return k !== 0 ? k : T.id - w.id;
    }
    if (typeof performance == "object" && typeof performance.now == "function") {
      var M = performance;
      d.unstable_now = function() {
        return M.now();
      };
    } else {
      var R = Date, z = R.now();
      d.unstable_now = function() {
        return R.now() - z;
      };
    }
    var g = [], _ = [], B = 1, Z = null, $ = 3, ue = !1, le = !1, ne = !1, re = typeof setTimeout == "function" ? setTimeout : null, Ne = typeof clearTimeout == "function" ? clearTimeout : null, b = typeof setImmediate < "u" ? setImmediate : null;
    typeof navigator < "u" && navigator.scheduling !== void 0 && navigator.scheduling.isInputPending !== void 0 && navigator.scheduling.isInputPending.bind(navigator.scheduling);
    function F(T) {
      for (var w = u(_); w !== null; ) {
        if (w.callback === null) P(_);
        else if (w.startTime <= T) P(_), w.sortIndex = w.expirationTime, c(g, w);
        else break;
        w = u(_);
      }
    }
    function Q(T) {
      if (ne = !1, F(T), !le) if (u(g) !== null) le = !0, ze(J);
      else {
        var w = u(_);
        w !== null && ve(Q, w.startTime - T);
      }
    }
    function J(T, w) {
      le = !1, ne && (ne = !1, Ne(Ce), Ce = -1), ue = !0;
      var k = $;
      try {
        for (F(w), Z = u(g); Z !== null && (!(Z.expirationTime > w) || T && !Me()); ) {
          var a = Z.callback;
          if (typeof a == "function") {
            Z.callback = null, $ = Z.priorityLevel;
            var x = a(Z.expirationTime <= w);
            w = d.unstable_now(), typeof x == "function" ? Z.callback = x : Z === u(g) && P(g), F(w);
          } else P(g);
          Z = u(g);
        }
        if (Z !== null) var I = !0;
        else {
          var W = u(_);
          W !== null && ve(Q, W.startTime - w), I = !1;
        }
        return I;
      } finally {
        Z = null, $ = k, ue = !1;
      }
    }
    var q = !1, ee = null, Ce = -1, it = 5, Ve = -1;
    function Me() {
      return !(d.unstable_now() - Ve < it);
    }
    function be() {
      if (ee !== null) {
        var T = d.unstable_now();
        Ve = T;
        var w = !0;
        try {
          w = ee(!0, T);
        } finally {
          w ? Oe() : (q = !1, ee = null);
        }
      } else q = !1;
    }
    var Oe;
    if (typeof b == "function") Oe = function() {
      b(be);
    };
    else if (typeof MessageChannel < "u") {
      var Qe = new MessageChannel(), Ke = Qe.port2;
      Qe.port1.onmessage = be, Oe = function() {
        Ke.postMessage(null);
      };
    } else Oe = function() {
      re(be, 0);
    };
    function ze(T) {
      ee = T, q || (q = !0, Oe());
    }
    function ve(T, w) {
      Ce = re(function() {
        T(d.unstable_now());
      }, w);
    }
    d.unstable_IdlePriority = 5, d.unstable_ImmediatePriority = 1, d.unstable_LowPriority = 4, d.unstable_NormalPriority = 3, d.unstable_Profiling = null, d.unstable_UserBlockingPriority = 2, d.unstable_cancelCallback = function(T) {
      T.callback = null;
    }, d.unstable_continueExecution = function() {
      le || ue || (le = !0, ze(J));
    }, d.unstable_forceFrameRate = function(T) {
      0 > T || 125 < T ? console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported") : it = 0 < T ? Math.floor(1e3 / T) : 5;
    }, d.unstable_getCurrentPriorityLevel = function() {
      return $;
    }, d.unstable_getFirstCallbackNode = function() {
      return u(g);
    }, d.unstable_next = function(T) {
      switch ($) {
        case 1:
        case 2:
        case 3:
          var w = 3;
          break;
        default:
          w = $;
      }
      var k = $;
      $ = w;
      try {
        return T();
      } finally {
        $ = k;
      }
    }, d.unstable_pauseExecution = function() {
    }, d.unstable_requestPaint = function() {
    }, d.unstable_runWithPriority = function(T, w) {
      switch (T) {
        case 1:
        case 2:
        case 3:
        case 4:
        case 5:
          break;
        default:
          T = 3;
      }
      var k = $;
      $ = T;
      try {
        return w();
      } finally {
        $ = k;
      }
    }, d.unstable_scheduleCallback = function(T, w, k) {
      var a = d.unstable_now();
      switch (typeof k == "object" && k !== null ? (k = k.delay, k = typeof k == "number" && 0 < k ? a + k : a) : k = a, T) {
        case 1:
          var x = -1;
          break;
        case 2:
          x = 250;
          break;
        case 5:
          x = 1073741823;
          break;
        case 4:
          x = 1e4;
          break;
        default:
          x = 5e3;
      }
      return x = k + x, T = { id: B++, callback: w, priorityLevel: T, startTime: k, expirationTime: x, sortIndex: -1 }, k > a ? (T.sortIndex = k, c(_, T), u(g) === null && T === u(_) && (ne ? (Ne(Ce), Ce = -1) : ne = !0, ve(Q, k - a))) : (T.sortIndex = x, c(g, T), le || ue || (le = !0, ze(J))), T;
    }, d.unstable_shouldYield = Me, d.unstable_wrapCallback = function(T) {
      var w = $;
      return function() {
        var k = $;
        $ = w;
        try {
          return T.apply(this, arguments);
        } finally {
          $ = k;
        }
      };
    };
  })($o)), $o;
}
var Ka;
function od() {
  return Ka || (Ka = 1, Uo.exports = id()), Uo.exports;
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
function sd() {
  if (Ya) return qe;
  Ya = 1;
  var d = Qo(), c = od();
  function u(e) {
    for (var t = "https://reactjs.org/docs/error-decoder.html?invariant=" + e, n = 1; n < arguments.length; n++) t += "&args[]=" + encodeURIComponent(arguments[n]);
    return "Minified React error #" + e + "; visit " + t + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
  }
  var P = /* @__PURE__ */ new Set(), j = {};
  function M(e, t) {
    R(e, t), R(e + "Capture", t);
  }
  function R(e, t) {
    for (j[e] = t, e = 0; e < t.length; e++) P.add(t[e]);
  }
  var z = !(typeof window > "u" || typeof window.document > "u" || typeof window.document.createElement > "u"), g = Object.prototype.hasOwnProperty, _ = /^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/, B = {}, Z = {};
  function $(e) {
    return g.call(Z, e) ? !0 : g.call(B, e) ? !1 : _.test(e) ? Z[e] = !0 : (B[e] = !0, !1);
  }
  function ue(e, t, n, r) {
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
  function le(e, t, n, r) {
    if (t === null || typeof t > "u" || ue(e, t, n, r)) return !0;
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
  function ne(e, t, n, r, l, i, o) {
    this.acceptsBooleans = t === 2 || t === 3 || t === 4, this.attributeName = r, this.attributeNamespace = l, this.mustUseProperty = n, this.propertyName = e, this.type = t, this.sanitizeURL = i, this.removeEmptyString = o;
  }
  var re = {};
  "children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style".split(" ").forEach(function(e) {
    re[e] = new ne(e, 0, !1, e, null, !1, !1);
  }), [["acceptCharset", "accept-charset"], ["className", "class"], ["htmlFor", "for"], ["httpEquiv", "http-equiv"]].forEach(function(e) {
    var t = e[0];
    re[t] = new ne(t, 1, !1, e[1], null, !1, !1);
  }), ["contentEditable", "draggable", "spellCheck", "value"].forEach(function(e) {
    re[e] = new ne(e, 2, !1, e.toLowerCase(), null, !1, !1);
  }), ["autoReverse", "externalResourcesRequired", "focusable", "preserveAlpha"].forEach(function(e) {
    re[e] = new ne(e, 2, !1, e, null, !1, !1);
  }), "allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope".split(" ").forEach(function(e) {
    re[e] = new ne(e, 3, !1, e.toLowerCase(), null, !1, !1);
  }), ["checked", "multiple", "muted", "selected"].forEach(function(e) {
    re[e] = new ne(e, 3, !0, e, null, !1, !1);
  }), ["capture", "download"].forEach(function(e) {
    re[e] = new ne(e, 4, !1, e, null, !1, !1);
  }), ["cols", "rows", "size", "span"].forEach(function(e) {
    re[e] = new ne(e, 6, !1, e, null, !1, !1);
  }), ["rowSpan", "start"].forEach(function(e) {
    re[e] = new ne(e, 5, !1, e.toLowerCase(), null, !1, !1);
  });
  var Ne = /[\-:]([a-z])/g;
  function b(e) {
    return e[1].toUpperCase();
  }
  "accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height".split(" ").forEach(function(e) {
    var t = e.replace(
      Ne,
      b
    );
    re[t] = new ne(t, 1, !1, e, null, !1, !1);
  }), "xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type".split(" ").forEach(function(e) {
    var t = e.replace(Ne, b);
    re[t] = new ne(t, 1, !1, e, "http://www.w3.org/1999/xlink", !1, !1);
  }), ["xml:base", "xml:lang", "xml:space"].forEach(function(e) {
    var t = e.replace(Ne, b);
    re[t] = new ne(t, 1, !1, e, "http://www.w3.org/XML/1998/namespace", !1, !1);
  }), ["tabIndex", "crossOrigin"].forEach(function(e) {
    re[e] = new ne(e, 1, !1, e.toLowerCase(), null, !1, !1);
  }), re.xlinkHref = new ne("xlinkHref", 1, !1, "xlink:href", "http://www.w3.org/1999/xlink", !0, !1), ["src", "href", "action", "formAction"].forEach(function(e) {
    re[e] = new ne(e, 1, !1, e.toLowerCase(), null, !0, !0);
  });
  function F(e, t, n, r) {
    var l = re.hasOwnProperty(t) ? re[t] : null;
    (l !== null ? l.type !== 0 : r || !(2 < t.length) || t[0] !== "o" && t[0] !== "O" || t[1] !== "n" && t[1] !== "N") && (le(t, n, l, r) && (n = null), r || l === null ? $(t) && (n === null ? e.removeAttribute(t) : e.setAttribute(t, "" + n)) : l.mustUseProperty ? e[l.propertyName] = n === null ? l.type === 3 ? !1 : "" : n : (t = l.attributeName, r = l.attributeNamespace, n === null ? e.removeAttribute(t) : (l = l.type, n = l === 3 || l === 4 && n === !0 ? "" : "" + n, r ? e.setAttributeNS(r, t, n) : e.setAttribute(t, n))));
  }
  var Q = d.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED, J = Symbol.for("react.element"), q = Symbol.for("react.portal"), ee = Symbol.for("react.fragment"), Ce = Symbol.for("react.strict_mode"), it = Symbol.for("react.profiler"), Ve = Symbol.for("react.provider"), Me = Symbol.for("react.context"), be = Symbol.for("react.forward_ref"), Oe = Symbol.for("react.suspense"), Qe = Symbol.for("react.suspense_list"), Ke = Symbol.for("react.memo"), ze = Symbol.for("react.lazy"), ve = Symbol.for("react.offscreen"), T = Symbol.iterator;
  function w(e) {
    return e === null || typeof e != "object" ? null : (e = T && e[T] || e["@@iterator"], typeof e == "function" ? e : null);
  }
  var k = Object.assign, a;
  function x(e) {
    if (a === void 0) try {
      throw Error();
    } catch (n) {
      var t = n.stack.trim().match(/\n( *(at )?)/);
      a = t && t[1] || "";
    }
    return `
` + a + e;
  }
  var I = !1;
  function W(e, t) {
    if (!e || I) return "";
    I = !0;
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
`), o = l.length - 1, s = i.length - 1; 1 <= o && 0 <= s && l[o] !== i[s]; ) s--;
        for (; 1 <= o && 0 <= s; o--, s--) if (l[o] !== i[s]) {
          if (o !== 1 || s !== 1)
            do
              if (o--, s--, 0 > s || l[o] !== i[s]) {
                var f = `
` + l[o].replace(" at new ", " at ");
                return e.displayName && f.includes("<anonymous>") && (f = f.replace("<anonymous>", e.displayName)), f;
              }
            while (1 <= o && 0 <= s);
          break;
        }
      }
    } finally {
      I = !1, Error.prepareStackTrace = n;
    }
    return (e = e ? e.displayName || e.name : "") ? x(e) : "";
  }
  function X(e) {
    switch (e.tag) {
      case 5:
        return x(e.type);
      case 16:
        return x("Lazy");
      case 13:
        return x("Suspense");
      case 19:
        return x("SuspenseList");
      case 0:
      case 2:
      case 15:
        return e = W(e.type, !1), e;
      case 11:
        return e = W(e.type.render, !1), e;
      case 1:
        return e = W(e.type, !0), e;
      default:
        return "";
    }
  }
  function G(e) {
    if (e == null) return null;
    if (typeof e == "function") return e.displayName || e.name || null;
    if (typeof e == "string") return e;
    switch (e) {
      case ee:
        return "Fragment";
      case q:
        return "Portal";
      case it:
        return "Profiler";
      case Ce:
        return "StrictMode";
      case Oe:
        return "Suspense";
      case Qe:
        return "SuspenseList";
    }
    if (typeof e == "object") switch (e.$$typeof) {
      case Me:
        return (e.displayName || "Context") + ".Consumer";
      case Ve:
        return (e._context.displayName || "Context") + ".Provider";
      case be:
        var t = e.render;
        return e = e.displayName, e || (e = t.displayName || t.name || "", e = e !== "" ? "ForwardRef(" + e + ")" : "ForwardRef"), e;
      case Ke:
        return t = e.displayName || null, t !== null ? t : G(e.type) || "Memo";
      case ze:
        t = e._payload, e = e._init;
        try {
          return G(e(t));
        } catch {
        }
    }
    return null;
  }
  function oe(e) {
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
        return G(t);
      case 8:
        return t === Ce ? "StrictMode" : "Mode";
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
  function K(e) {
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
  function ie(e) {
    var t = e.type;
    return (e = e.nodeName) && e.toLowerCase() === "input" && (t === "checkbox" || t === "radio");
  }
  function xe(e) {
    var t = ie(e) ? "checked" : "value", n = Object.getOwnPropertyDescriptor(e.constructor.prototype, t), r = "" + e[t];
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
    e._valueTracker || (e._valueTracker = xe(e));
  }
  function An(e) {
    if (!e) return !1;
    var t = e._valueTracker;
    if (!t) return !0;
    var n = t.getValue(), r = "";
    return e && (r = ie(e) ? e.checked ? "true" : "false" : e.value), e = r, e !== n ? (t.setValue(e), !0) : !1;
  }
  function zr(e) {
    if (e = e || (typeof document < "u" ? document : void 0), typeof e > "u") return null;
    try {
      return e.activeElement || e.body;
    } catch {
      return e.body;
    }
  }
  function Vl(e, t) {
    var n = t.checked;
    return k({}, t, { defaultChecked: void 0, defaultValue: void 0, value: void 0, checked: n ?? e._wrapperState.initialChecked });
  }
  function Go(e, t) {
    var n = t.defaultValue == null ? "" : t.defaultValue, r = t.checked != null ? t.checked : t.defaultChecked;
    n = K(t.value != null ? t.value : n), e._wrapperState = { initialChecked: r, initialValue: n, controlled: t.type === "checkbox" || t.type === "radio" ? t.checked != null : t.value != null };
  }
  function Xo(e, t) {
    t = t.checked, t != null && F(e, "checked", t, !1);
  }
  function Bl(e, t) {
    Xo(e, t);
    var n = K(t.value), r = t.type;
    if (n != null) r === "number" ? (n === 0 && e.value === "" || e.value != n) && (e.value = "" + n) : e.value !== "" + n && (e.value = "" + n);
    else if (r === "submit" || r === "reset") {
      e.removeAttribute("value");
      return;
    }
    t.hasOwnProperty("value") ? Wl(e, t.type, n) : t.hasOwnProperty("defaultValue") && Wl(e, t.type, K(t.defaultValue)), t.checked == null && t.defaultChecked != null && (e.defaultChecked = !!t.defaultChecked);
  }
  function Zo(e, t, n) {
    if (t.hasOwnProperty("value") || t.hasOwnProperty("defaultValue")) {
      var r = t.type;
      if (!(r !== "submit" && r !== "reset" || t.value !== void 0 && t.value !== null)) return;
      t = "" + e._wrapperState.initialValue, n || t === e.value || (e.value = t), e.defaultValue = t;
    }
    n = e.name, n !== "" && (e.name = ""), e.defaultChecked = !!e._wrapperState.initialChecked, n !== "" && (e.name = n);
  }
  function Wl(e, t, n) {
    (t !== "number" || zr(e.ownerDocument) !== e) && (n == null ? e.defaultValue = "" + e._wrapperState.initialValue : e.defaultValue !== "" + n && (e.defaultValue = "" + n));
  }
  var Un = Array.isArray;
  function pn(e, t, n, r) {
    if (e = e.options, t) {
      t = {};
      for (var l = 0; l < n.length; l++) t["$" + n[l]] = !0;
      for (n = 0; n < e.length; n++) l = t.hasOwnProperty("$" + e[n].value), e[n].selected !== l && (e[n].selected = l), l && r && (e[n].defaultSelected = !0);
    } else {
      for (n = "" + K(n), t = null, l = 0; l < e.length; l++) {
        if (e[l].value === n) {
          e[l].selected = !0, r && (e[l].defaultSelected = !0);
          return;
        }
        t !== null || e[l].disabled || (t = e[l]);
      }
      t !== null && (t.selected = !0);
    }
  }
  function Ql(e, t) {
    if (t.dangerouslySetInnerHTML != null) throw Error(u(91));
    return k({}, t, { value: void 0, defaultValue: void 0, children: "" + e._wrapperState.initialValue });
  }
  function Jo(e, t) {
    var n = t.value;
    if (n == null) {
      if (n = t.children, t = t.defaultValue, n != null) {
        if (t != null) throw Error(u(92));
        if (Un(n)) {
          if (1 < n.length) throw Error(u(93));
          n = n[0];
        }
        t = n;
      }
      t == null && (t = ""), n = t;
    }
    e._wrapperState = { initialValue: K(n) };
  }
  function qo(e, t) {
    var n = K(t.value), r = K(t.defaultValue);
    n != null && (n = "" + n, n !== e.value && (e.value = n), t.defaultValue == null && e.defaultValue !== n && (e.defaultValue = n)), r != null && (e.defaultValue = "" + r);
  }
  function bo(e) {
    var t = e.textContent;
    t === e._wrapperState.initialValue && t !== "" && t !== null && (e.value = t);
  }
  function es(e) {
    switch (e) {
      case "svg":
        return "http://www.w3.org/2000/svg";
      case "math":
        return "http://www.w3.org/1998/Math/MathML";
      default:
        return "http://www.w3.org/1999/xhtml";
    }
  }
  function Kl(e, t) {
    return e == null || e === "http://www.w3.org/1999/xhtml" ? es(t) : e === "http://www.w3.org/2000/svg" && t === "foreignObject" ? "http://www.w3.org/1999/xhtml" : e;
  }
  var Tr, ts = (function(e) {
    return typeof MSApp < "u" && MSApp.execUnsafeLocalFunction ? function(t, n, r, l) {
      MSApp.execUnsafeLocalFunction(function() {
        return e(t, n, r, l);
      });
    } : e;
  })(function(e, t) {
    if (e.namespaceURI !== "http://www.w3.org/2000/svg" || "innerHTML" in e) e.innerHTML = t;
    else {
      for (Tr = Tr || document.createElement("div"), Tr.innerHTML = "<svg>" + t.valueOf().toString() + "</svg>", t = Tr.firstChild; e.firstChild; ) e.removeChild(e.firstChild);
      for (; t.firstChild; ) e.appendChild(t.firstChild);
    }
  });
  function $n(e, t) {
    if (t) {
      var n = e.firstChild;
      if (n && n === e.lastChild && n.nodeType === 3) {
        n.nodeValue = t;
        return;
      }
    }
    e.textContent = t;
  }
  var Hn = {
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
  }, rc = ["Webkit", "ms", "Moz", "O"];
  Object.keys(Hn).forEach(function(e) {
    rc.forEach(function(t) {
      t = t + e.charAt(0).toUpperCase() + e.substring(1), Hn[t] = Hn[e];
    });
  });
  function ns(e, t, n) {
    return t == null || typeof t == "boolean" || t === "" ? "" : n || typeof t != "number" || t === 0 || Hn.hasOwnProperty(e) && Hn[e] ? ("" + t).trim() : t + "px";
  }
  function rs(e, t) {
    e = e.style;
    for (var n in t) if (t.hasOwnProperty(n)) {
      var r = n.indexOf("--") === 0, l = ns(n, t[n], r);
      n === "float" && (n = "cssFloat"), r ? e.setProperty(n, l) : e[n] = l;
    }
  }
  var lc = k({ menuitem: !0 }, { area: !0, base: !0, br: !0, col: !0, embed: !0, hr: !0, img: !0, input: !0, keygen: !0, link: !0, meta: !0, param: !0, source: !0, track: !0, wbr: !0 });
  function Yl(e, t) {
    if (t) {
      if (lc[e] && (t.children != null || t.dangerouslySetInnerHTML != null)) throw Error(u(137, e));
      if (t.dangerouslySetInnerHTML != null) {
        if (t.children != null) throw Error(u(60));
        if (typeof t.dangerouslySetInnerHTML != "object" || !("__html" in t.dangerouslySetInnerHTML)) throw Error(u(61));
      }
      if (t.style != null && typeof t.style != "object") throw Error(u(62));
    }
  }
  function Gl(e, t) {
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
  var Xl = null;
  function Zl(e) {
    return e = e.target || e.srcElement || window, e.correspondingUseElement && (e = e.correspondingUseElement), e.nodeType === 3 ? e.parentNode : e;
  }
  var Jl = null, hn = null, mn = null;
  function ls(e) {
    if (e = ar(e)) {
      if (typeof Jl != "function") throw Error(u(280));
      var t = e.stateNode;
      t && (t = br(t), Jl(e.stateNode, e.type, t));
    }
  }
  function is(e) {
    hn ? mn ? mn.push(e) : mn = [e] : hn = e;
  }
  function os() {
    if (hn) {
      var e = hn, t = mn;
      if (mn = hn = null, ls(e), t) for (e = 0; e < t.length; e++) ls(t[e]);
    }
  }
  function ss(e, t) {
    return e(t);
  }
  function us() {
  }
  var ql = !1;
  function as(e, t, n) {
    if (ql) return e(t, n);
    ql = !0;
    try {
      return ss(e, t, n);
    } finally {
      ql = !1, (hn !== null || mn !== null) && (us(), os());
    }
  }
  function Vn(e, t) {
    var n = e.stateNode;
    if (n === null) return null;
    var r = br(n);
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
    if (n && typeof n != "function") throw Error(u(231, t, typeof n));
    return n;
  }
  var bl = !1;
  if (z) try {
    var Bn = {};
    Object.defineProperty(Bn, "passive", { get: function() {
      bl = !0;
    } }), window.addEventListener("test", Bn, Bn), window.removeEventListener("test", Bn, Bn);
  } catch {
    bl = !1;
  }
  function ic(e, t, n, r, l, i, o, s, f) {
    var y = Array.prototype.slice.call(arguments, 3);
    try {
      t.apply(n, y);
    } catch (E) {
      this.onError(E);
    }
  }
  var Wn = !1, Rr = null, Lr = !1, ei = null, oc = { onError: function(e) {
    Wn = !0, Rr = e;
  } };
  function sc(e, t, n, r, l, i, o, s, f) {
    Wn = !1, Rr = null, ic.apply(oc, arguments);
  }
  function uc(e, t, n, r, l, i, o, s, f) {
    if (sc.apply(this, arguments), Wn) {
      if (Wn) {
        var y = Rr;
        Wn = !1, Rr = null;
      } else throw Error(u(198));
      Lr || (Lr = !0, ei = y);
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
  function cs(e) {
    if (e.tag === 13) {
      var t = e.memoizedState;
      if (t === null && (e = e.alternate, e !== null && (t = e.memoizedState)), t !== null) return t.dehydrated;
    }
    return null;
  }
  function fs(e) {
    if (bt(e) !== e) throw Error(u(188));
  }
  function ac(e) {
    var t = e.alternate;
    if (!t) {
      if (t = bt(e), t === null) throw Error(u(188));
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
          if (i === n) return fs(l), e;
          if (i === r) return fs(l), t;
          i = i.sibling;
        }
        throw Error(u(188));
      }
      if (n.return !== r.return) n = l, r = i;
      else {
        for (var o = !1, s = l.child; s; ) {
          if (s === n) {
            o = !0, n = l, r = i;
            break;
          }
          if (s === r) {
            o = !0, r = l, n = i;
            break;
          }
          s = s.sibling;
        }
        if (!o) {
          for (s = i.child; s; ) {
            if (s === n) {
              o = !0, n = i, r = l;
              break;
            }
            if (s === r) {
              o = !0, r = i, n = l;
              break;
            }
            s = s.sibling;
          }
          if (!o) throw Error(u(189));
        }
      }
      if (n.alternate !== r) throw Error(u(190));
    }
    if (n.tag !== 3) throw Error(u(188));
    return n.stateNode.current === n ? e : t;
  }
  function ds(e) {
    return e = ac(e), e !== null ? ps(e) : null;
  }
  function ps(e) {
    if (e.tag === 5 || e.tag === 6) return e;
    for (e = e.child; e !== null; ) {
      var t = ps(e);
      if (t !== null) return t;
      e = e.sibling;
    }
    return null;
  }
  var hs = c.unstable_scheduleCallback, ms = c.unstable_cancelCallback, cc = c.unstable_shouldYield, fc = c.unstable_requestPaint, Se = c.unstable_now, dc = c.unstable_getCurrentPriorityLevel, ti = c.unstable_ImmediatePriority, vs = c.unstable_UserBlockingPriority, Mr = c.unstable_NormalPriority, pc = c.unstable_LowPriority, gs = c.unstable_IdlePriority, Ir = null, xt = null;
  function hc(e) {
    if (xt && typeof xt.onCommitFiberRoot == "function") try {
      xt.onCommitFiberRoot(Ir, e, void 0, (e.current.flags & 128) === 128);
    } catch {
    }
  }
  var pt = Math.clz32 ? Math.clz32 : gc, mc = Math.log, vc = Math.LN2;
  function gc(e) {
    return e >>>= 0, e === 0 ? 32 : 31 - (mc(e) / vc | 0) | 0;
  }
  var Dr = 64, Fr = 4194304;
  function Qn(e) {
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
  function Or(e, t) {
    var n = e.pendingLanes;
    if (n === 0) return 0;
    var r = 0, l = e.suspendedLanes, i = e.pingedLanes, o = n & 268435455;
    if (o !== 0) {
      var s = o & ~l;
      s !== 0 ? r = Qn(s) : (i &= o, i !== 0 && (r = Qn(i)));
    } else o = n & ~l, o !== 0 ? r = Qn(o) : i !== 0 && (r = Qn(i));
    if (r === 0) return 0;
    if (t !== 0 && t !== r && (t & l) === 0 && (l = r & -r, i = t & -t, l >= i || l === 16 && (i & 4194240) !== 0)) return t;
    if ((r & 4) !== 0 && (r |= n & 16), t = e.entangledLanes, t !== 0) for (e = e.entanglements, t &= r; 0 < t; ) n = 31 - pt(t), l = 1 << n, r |= e[n], t &= ~l;
    return r;
  }
  function yc(e, t) {
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
  function wc(e, t) {
    for (var n = e.suspendedLanes, r = e.pingedLanes, l = e.expirationTimes, i = e.pendingLanes; 0 < i; ) {
      var o = 31 - pt(i), s = 1 << o, f = l[o];
      f === -1 ? ((s & n) === 0 || (s & r) !== 0) && (l[o] = yc(s, t)) : f <= t && (e.expiredLanes |= s), i &= ~s;
    }
  }
  function ni(e) {
    return e = e.pendingLanes & -1073741825, e !== 0 ? e : e & 1073741824 ? 1073741824 : 0;
  }
  function ys() {
    var e = Dr;
    return Dr <<= 1, (Dr & 4194240) === 0 && (Dr = 64), e;
  }
  function ri(e) {
    for (var t = [], n = 0; 31 > n; n++) t.push(e);
    return t;
  }
  function Kn(e, t, n) {
    e.pendingLanes |= t, t !== 536870912 && (e.suspendedLanes = 0, e.pingedLanes = 0), e = e.eventTimes, t = 31 - pt(t), e[t] = n;
  }
  function xc(e, t) {
    var n = e.pendingLanes & ~t;
    e.pendingLanes = t, e.suspendedLanes = 0, e.pingedLanes = 0, e.expiredLanes &= t, e.mutableReadLanes &= t, e.entangledLanes &= t, t = e.entanglements;
    var r = e.eventTimes;
    for (e = e.expirationTimes; 0 < n; ) {
      var l = 31 - pt(n), i = 1 << l;
      t[l] = 0, r[l] = -1, e[l] = -1, n &= ~i;
    }
  }
  function li(e, t) {
    var n = e.entangledLanes |= t;
    for (e = e.entanglements; n; ) {
      var r = 31 - pt(n), l = 1 << r;
      l & t | e[r] & t && (e[r] |= t), n &= ~l;
    }
  }
  var ce = 0;
  function ws(e) {
    return e &= -e, 1 < e ? 4 < e ? (e & 268435455) !== 0 ? 16 : 536870912 : 4 : 1;
  }
  var xs, ii, ks, Ss, Es, oi = !1, Ar = [], Mt = null, It = null, Dt = null, Yn = /* @__PURE__ */ new Map(), Gn = /* @__PURE__ */ new Map(), Ft = [], kc = "mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset submit".split(" ");
  function Cs(e, t) {
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
        Yn.delete(t.pointerId);
        break;
      case "gotpointercapture":
      case "lostpointercapture":
        Gn.delete(t.pointerId);
    }
  }
  function Xn(e, t, n, r, l, i) {
    return e === null || e.nativeEvent !== i ? (e = { blockedOn: t, domEventName: n, eventSystemFlags: r, nativeEvent: i, targetContainers: [l] }, t !== null && (t = ar(t), t !== null && ii(t)), e) : (e.eventSystemFlags |= r, t = e.targetContainers, l !== null && t.indexOf(l) === -1 && t.push(l), e);
  }
  function Sc(e, t, n, r, l) {
    switch (t) {
      case "focusin":
        return Mt = Xn(Mt, e, t, n, r, l), !0;
      case "dragenter":
        return It = Xn(It, e, t, n, r, l), !0;
      case "mouseover":
        return Dt = Xn(Dt, e, t, n, r, l), !0;
      case "pointerover":
        var i = l.pointerId;
        return Yn.set(i, Xn(Yn.get(i) || null, e, t, n, r, l)), !0;
      case "gotpointercapture":
        return i = l.pointerId, Gn.set(i, Xn(Gn.get(i) || null, e, t, n, r, l)), !0;
    }
    return !1;
  }
  function _s(e) {
    var t = en(e.target);
    if (t !== null) {
      var n = bt(t);
      if (n !== null) {
        if (t = n.tag, t === 13) {
          if (t = cs(n), t !== null) {
            e.blockedOn = t, Es(e.priority, function() {
              ks(n);
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
  function Ur(e) {
    if (e.blockedOn !== null) return !1;
    for (var t = e.targetContainers; 0 < t.length; ) {
      var n = ui(e.domEventName, e.eventSystemFlags, t[0], e.nativeEvent);
      if (n === null) {
        n = e.nativeEvent;
        var r = new n.constructor(n.type, n);
        Xl = r, n.target.dispatchEvent(r), Xl = null;
      } else return t = ar(n), t !== null && ii(t), e.blockedOn = n, !1;
      t.shift();
    }
    return !0;
  }
  function Ns(e, t, n) {
    Ur(e) && n.delete(t);
  }
  function Ec() {
    oi = !1, Mt !== null && Ur(Mt) && (Mt = null), It !== null && Ur(It) && (It = null), Dt !== null && Ur(Dt) && (Dt = null), Yn.forEach(Ns), Gn.forEach(Ns);
  }
  function Zn(e, t) {
    e.blockedOn === t && (e.blockedOn = null, oi || (oi = !0, c.unstable_scheduleCallback(c.unstable_NormalPriority, Ec)));
  }
  function Jn(e) {
    function t(l) {
      return Zn(l, e);
    }
    if (0 < Ar.length) {
      Zn(Ar[0], e);
      for (var n = 1; n < Ar.length; n++) {
        var r = Ar[n];
        r.blockedOn === e && (r.blockedOn = null);
      }
    }
    for (Mt !== null && Zn(Mt, e), It !== null && Zn(It, e), Dt !== null && Zn(Dt, e), Yn.forEach(t), Gn.forEach(t), n = 0; n < Ft.length; n++) r = Ft[n], r.blockedOn === e && (r.blockedOn = null);
    for (; 0 < Ft.length && (n = Ft[0], n.blockedOn === null); ) _s(n), n.blockedOn === null && Ft.shift();
  }
  var vn = Q.ReactCurrentBatchConfig, $r = !0;
  function Cc(e, t, n, r) {
    var l = ce, i = vn.transition;
    vn.transition = null;
    try {
      ce = 1, si(e, t, n, r);
    } finally {
      ce = l, vn.transition = i;
    }
  }
  function _c(e, t, n, r) {
    var l = ce, i = vn.transition;
    vn.transition = null;
    try {
      ce = 4, si(e, t, n, r);
    } finally {
      ce = l, vn.transition = i;
    }
  }
  function si(e, t, n, r) {
    if ($r) {
      var l = ui(e, t, n, r);
      if (l === null) _i(e, t, r, Hr, n), Cs(e, r);
      else if (Sc(l, e, t, n, r)) r.stopPropagation();
      else if (Cs(e, r), t & 4 && -1 < kc.indexOf(e)) {
        for (; l !== null; ) {
          var i = ar(l);
          if (i !== null && xs(i), i = ui(e, t, n, r), i === null && _i(e, t, r, Hr, n), i === l) break;
          l = i;
        }
        l !== null && r.stopPropagation();
      } else _i(e, t, r, null, n);
    }
  }
  var Hr = null;
  function ui(e, t, n, r) {
    if (Hr = null, e = Zl(r), e = en(e), e !== null) if (t = bt(e), t === null) e = null;
    else if (n = t.tag, n === 13) {
      if (e = cs(t), e !== null) return e;
      e = null;
    } else if (n === 3) {
      if (t.stateNode.current.memoizedState.isDehydrated) return t.tag === 3 ? t.stateNode.containerInfo : null;
      e = null;
    } else t !== e && (e = null);
    return Hr = e, null;
  }
  function js(e) {
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
        switch (dc()) {
          case ti:
            return 1;
          case vs:
            return 4;
          case Mr:
          case pc:
            return 16;
          case gs:
            return 536870912;
          default:
            return 16;
        }
      default:
        return 16;
    }
  }
  var Ot = null, ai = null, Vr = null;
  function Ps() {
    if (Vr) return Vr;
    var e, t = ai, n = t.length, r, l = "value" in Ot ? Ot.value : Ot.textContent, i = l.length;
    for (e = 0; e < n && t[e] === l[e]; e++) ;
    var o = n - e;
    for (r = 1; r <= o && t[n - r] === l[i - r]; r++) ;
    return Vr = l.slice(e, 1 < r ? 1 - r : void 0);
  }
  function Br(e) {
    var t = e.keyCode;
    return "charCode" in e ? (e = e.charCode, e === 0 && t === 13 && (e = 13)) : e = t, e === 10 && (e = 13), 32 <= e || e === 13 ? e : 0;
  }
  function Wr() {
    return !0;
  }
  function zs() {
    return !1;
  }
  function et(e) {
    function t(n, r, l, i, o) {
      this._reactName = n, this._targetInst = l, this.type = r, this.nativeEvent = i, this.target = o, this.currentTarget = null;
      for (var s in e) e.hasOwnProperty(s) && (n = e[s], this[s] = n ? n(i) : i[s]);
      return this.isDefaultPrevented = (i.defaultPrevented != null ? i.defaultPrevented : i.returnValue === !1) ? Wr : zs, this.isPropagationStopped = zs, this;
    }
    return k(t.prototype, { preventDefault: function() {
      this.defaultPrevented = !0;
      var n = this.nativeEvent;
      n && (n.preventDefault ? n.preventDefault() : typeof n.returnValue != "unknown" && (n.returnValue = !1), this.isDefaultPrevented = Wr);
    }, stopPropagation: function() {
      var n = this.nativeEvent;
      n && (n.stopPropagation ? n.stopPropagation() : typeof n.cancelBubble != "unknown" && (n.cancelBubble = !0), this.isPropagationStopped = Wr);
    }, persist: function() {
    }, isPersistent: Wr }), t;
  }
  var gn = { eventPhase: 0, bubbles: 0, cancelable: 0, timeStamp: function(e) {
    return e.timeStamp || Date.now();
  }, defaultPrevented: 0, isTrusted: 0 }, ci = et(gn), qn = k({}, gn, { view: 0, detail: 0 }), Nc = et(qn), fi, di, bn, Qr = k({}, qn, { screenX: 0, screenY: 0, clientX: 0, clientY: 0, pageX: 0, pageY: 0, ctrlKey: 0, shiftKey: 0, altKey: 0, metaKey: 0, getModifierState: hi, button: 0, buttons: 0, relatedTarget: function(e) {
    return e.relatedTarget === void 0 ? e.fromElement === e.srcElement ? e.toElement : e.fromElement : e.relatedTarget;
  }, movementX: function(e) {
    return "movementX" in e ? e.movementX : (e !== bn && (bn && e.type === "mousemove" ? (fi = e.screenX - bn.screenX, di = e.screenY - bn.screenY) : di = fi = 0, bn = e), fi);
  }, movementY: function(e) {
    return "movementY" in e ? e.movementY : di;
  } }), Ts = et(Qr), jc = k({}, Qr, { dataTransfer: 0 }), Pc = et(jc), zc = k({}, qn, { relatedTarget: 0 }), pi = et(zc), Tc = k({}, gn, { animationName: 0, elapsedTime: 0, pseudoElement: 0 }), Rc = et(Tc), Lc = k({}, gn, { clipboardData: function(e) {
    return "clipboardData" in e ? e.clipboardData : window.clipboardData;
  } }), Mc = et(Lc), Ic = k({}, gn, { data: 0 }), Rs = et(Ic), Dc = {
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
  }, Fc = {
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
  }, Oc = { Alt: "altKey", Control: "ctrlKey", Meta: "metaKey", Shift: "shiftKey" };
  function Ac(e) {
    var t = this.nativeEvent;
    return t.getModifierState ? t.getModifierState(e) : (e = Oc[e]) ? !!t[e] : !1;
  }
  function hi() {
    return Ac;
  }
  var Uc = k({}, qn, { key: function(e) {
    if (e.key) {
      var t = Dc[e.key] || e.key;
      if (t !== "Unidentified") return t;
    }
    return e.type === "keypress" ? (e = Br(e), e === 13 ? "Enter" : String.fromCharCode(e)) : e.type === "keydown" || e.type === "keyup" ? Fc[e.keyCode] || "Unidentified" : "";
  }, code: 0, location: 0, ctrlKey: 0, shiftKey: 0, altKey: 0, metaKey: 0, repeat: 0, locale: 0, getModifierState: hi, charCode: function(e) {
    return e.type === "keypress" ? Br(e) : 0;
  }, keyCode: function(e) {
    return e.type === "keydown" || e.type === "keyup" ? e.keyCode : 0;
  }, which: function(e) {
    return e.type === "keypress" ? Br(e) : e.type === "keydown" || e.type === "keyup" ? e.keyCode : 0;
  } }), $c = et(Uc), Hc = k({}, Qr, { pointerId: 0, width: 0, height: 0, pressure: 0, tangentialPressure: 0, tiltX: 0, tiltY: 0, twist: 0, pointerType: 0, isPrimary: 0 }), Ls = et(Hc), Vc = k({}, qn, { touches: 0, targetTouches: 0, changedTouches: 0, altKey: 0, metaKey: 0, ctrlKey: 0, shiftKey: 0, getModifierState: hi }), Bc = et(Vc), Wc = k({}, gn, { propertyName: 0, elapsedTime: 0, pseudoElement: 0 }), Qc = et(Wc), Kc = k({}, Qr, {
    deltaX: function(e) {
      return "deltaX" in e ? e.deltaX : "wheelDeltaX" in e ? -e.wheelDeltaX : 0;
    },
    deltaY: function(e) {
      return "deltaY" in e ? e.deltaY : "wheelDeltaY" in e ? -e.wheelDeltaY : "wheelDelta" in e ? -e.wheelDelta : 0;
    },
    deltaZ: 0,
    deltaMode: 0
  }), Yc = et(Kc), Gc = [9, 13, 27, 32], mi = z && "CompositionEvent" in window, er = null;
  z && "documentMode" in document && (er = document.documentMode);
  var Xc = z && "TextEvent" in window && !er, Ms = z && (!mi || er && 8 < er && 11 >= er), Is = " ", Ds = !1;
  function Fs(e, t) {
    switch (e) {
      case "keyup":
        return Gc.indexOf(t.keyCode) !== -1;
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
  function Os(e) {
    return e = e.detail, typeof e == "object" && "data" in e ? e.data : null;
  }
  var yn = !1;
  function Zc(e, t) {
    switch (e) {
      case "compositionend":
        return Os(t);
      case "keypress":
        return t.which !== 32 ? null : (Ds = !0, Is);
      case "textInput":
        return e = t.data, e === Is && Ds ? null : e;
      default:
        return null;
    }
  }
  function Jc(e, t) {
    if (yn) return e === "compositionend" || !mi && Fs(e, t) ? (e = Ps(), Vr = ai = Ot = null, yn = !1, e) : null;
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
        return Ms && t.locale !== "ko" ? null : t.data;
      default:
        return null;
    }
  }
  var qc = { color: !0, date: !0, datetime: !0, "datetime-local": !0, email: !0, month: !0, number: !0, password: !0, range: !0, search: !0, tel: !0, text: !0, time: !0, url: !0, week: !0 };
  function As(e) {
    var t = e && e.nodeName && e.nodeName.toLowerCase();
    return t === "input" ? !!qc[e.type] : t === "textarea";
  }
  function Us(e, t, n, r) {
    is(r), t = Zr(t, "onChange"), 0 < t.length && (n = new ci("onChange", "change", null, n, r), e.push({ event: n, listeners: t }));
  }
  var tr = null, nr = null;
  function bc(e) {
    ru(e, 0);
  }
  function Kr(e) {
    var t = En(e);
    if (An(t)) return e;
  }
  function ef(e, t) {
    if (e === "change") return t;
  }
  var $s = !1;
  if (z) {
    var vi;
    if (z) {
      var gi = "oninput" in document;
      if (!gi) {
        var Hs = document.createElement("div");
        Hs.setAttribute("oninput", "return;"), gi = typeof Hs.oninput == "function";
      }
      vi = gi;
    } else vi = !1;
    $s = vi && (!document.documentMode || 9 < document.documentMode);
  }
  function Vs() {
    tr && (tr.detachEvent("onpropertychange", Bs), nr = tr = null);
  }
  function Bs(e) {
    if (e.propertyName === "value" && Kr(nr)) {
      var t = [];
      Us(t, nr, e, Zl(e)), as(bc, t);
    }
  }
  function tf(e, t, n) {
    e === "focusin" ? (Vs(), tr = t, nr = n, tr.attachEvent("onpropertychange", Bs)) : e === "focusout" && Vs();
  }
  function nf(e) {
    if (e === "selectionchange" || e === "keyup" || e === "keydown") return Kr(nr);
  }
  function rf(e, t) {
    if (e === "click") return Kr(t);
  }
  function lf(e, t) {
    if (e === "input" || e === "change") return Kr(t);
  }
  function of(e, t) {
    return e === t && (e !== 0 || 1 / e === 1 / t) || e !== e && t !== t;
  }
  var ht = typeof Object.is == "function" ? Object.is : of;
  function rr(e, t) {
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
  function Ws(e) {
    for (; e && e.firstChild; ) e = e.firstChild;
    return e;
  }
  function Qs(e, t) {
    var n = Ws(e);
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
      n = Ws(n);
    }
  }
  function Ks(e, t) {
    return e && t ? e === t ? !0 : e && e.nodeType === 3 ? !1 : t && t.nodeType === 3 ? Ks(e, t.parentNode) : "contains" in e ? e.contains(t) : e.compareDocumentPosition ? !!(e.compareDocumentPosition(t) & 16) : !1 : !1;
  }
  function Ys() {
    for (var e = window, t = zr(); t instanceof e.HTMLIFrameElement; ) {
      try {
        var n = typeof t.contentWindow.location.href == "string";
      } catch {
        n = !1;
      }
      if (n) e = t.contentWindow;
      else break;
      t = zr(e.document);
    }
    return t;
  }
  function yi(e) {
    var t = e && e.nodeName && e.nodeName.toLowerCase();
    return t && (t === "input" && (e.type === "text" || e.type === "search" || e.type === "tel" || e.type === "url" || e.type === "password") || t === "textarea" || e.contentEditable === "true");
  }
  function sf(e) {
    var t = Ys(), n = e.focusedElem, r = e.selectionRange;
    if (t !== n && n && n.ownerDocument && Ks(n.ownerDocument.documentElement, n)) {
      if (r !== null && yi(n)) {
        if (t = r.start, e = r.end, e === void 0 && (e = t), "selectionStart" in n) n.selectionStart = t, n.selectionEnd = Math.min(e, n.value.length);
        else if (e = (t = n.ownerDocument || document) && t.defaultView || window, e.getSelection) {
          e = e.getSelection();
          var l = n.textContent.length, i = Math.min(r.start, l);
          r = r.end === void 0 ? i : Math.min(r.end, l), !e.extend && i > r && (l = r, r = i, i = l), l = Qs(n, i);
          var o = Qs(
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
  var uf = z && "documentMode" in document && 11 >= document.documentMode, wn = null, wi = null, lr = null, xi = !1;
  function Gs(e, t, n) {
    var r = n.window === n ? n.document : n.nodeType === 9 ? n : n.ownerDocument;
    xi || wn == null || wn !== zr(r) || (r = wn, "selectionStart" in r && yi(r) ? r = { start: r.selectionStart, end: r.selectionEnd } : (r = (r.ownerDocument && r.ownerDocument.defaultView || window).getSelection(), r = { anchorNode: r.anchorNode, anchorOffset: r.anchorOffset, focusNode: r.focusNode, focusOffset: r.focusOffset }), lr && rr(lr, r) || (lr = r, r = Zr(wi, "onSelect"), 0 < r.length && (t = new ci("onSelect", "select", null, t, n), e.push({ event: t, listeners: r }), t.target = wn)));
  }
  function Yr(e, t) {
    var n = {};
    return n[e.toLowerCase()] = t.toLowerCase(), n["Webkit" + e] = "webkit" + t, n["Moz" + e] = "moz" + t, n;
  }
  var xn = { animationend: Yr("Animation", "AnimationEnd"), animationiteration: Yr("Animation", "AnimationIteration"), animationstart: Yr("Animation", "AnimationStart"), transitionend: Yr("Transition", "TransitionEnd") }, ki = {}, Xs = {};
  z && (Xs = document.createElement("div").style, "AnimationEvent" in window || (delete xn.animationend.animation, delete xn.animationiteration.animation, delete xn.animationstart.animation), "TransitionEvent" in window || delete xn.transitionend.transition);
  function Gr(e) {
    if (ki[e]) return ki[e];
    if (!xn[e]) return e;
    var t = xn[e], n;
    for (n in t) if (t.hasOwnProperty(n) && n in Xs) return ki[e] = t[n];
    return e;
  }
  var Zs = Gr("animationend"), Js = Gr("animationiteration"), qs = Gr("animationstart"), bs = Gr("transitionend"), eu = /* @__PURE__ */ new Map(), tu = "abort auxClick cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");
  function At(e, t) {
    eu.set(e, t), M(t, [e]);
  }
  for (var Si = 0; Si < tu.length; Si++) {
    var Ei = tu[Si], af = Ei.toLowerCase(), cf = Ei[0].toUpperCase() + Ei.slice(1);
    At(af, "on" + cf);
  }
  At(Zs, "onAnimationEnd"), At(Js, "onAnimationIteration"), At(qs, "onAnimationStart"), At("dblclick", "onDoubleClick"), At("focusin", "onFocus"), At("focusout", "onBlur"), At(bs, "onTransitionEnd"), R("onMouseEnter", ["mouseout", "mouseover"]), R("onMouseLeave", ["mouseout", "mouseover"]), R("onPointerEnter", ["pointerout", "pointerover"]), R("onPointerLeave", ["pointerout", "pointerover"]), M("onChange", "change click focusin focusout input keydown keyup selectionchange".split(" ")), M("onSelect", "focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" ")), M("onBeforeInput", ["compositionend", "keypress", "textInput", "paste"]), M("onCompositionEnd", "compositionend focusout keydown keypress keyup mousedown".split(" ")), M("onCompositionStart", "compositionstart focusout keydown keypress keyup mousedown".split(" ")), M("onCompositionUpdate", "compositionupdate focusout keydown keypress keyup mousedown".split(" "));
  var ir = "abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "), ff = new Set("cancel close invalid load scroll toggle".split(" ").concat(ir));
  function nu(e, t, n) {
    var r = e.type || "unknown-event";
    e.currentTarget = n, uc(r, t, void 0, e), e.currentTarget = null;
  }
  function ru(e, t) {
    t = (t & 4) !== 0;
    for (var n = 0; n < e.length; n++) {
      var r = e[n], l = r.event;
      r = r.listeners;
      e: {
        var i = void 0;
        if (t) for (var o = r.length - 1; 0 <= o; o--) {
          var s = r[o], f = s.instance, y = s.currentTarget;
          if (s = s.listener, f !== i && l.isPropagationStopped()) break e;
          nu(l, s, y), i = f;
        }
        else for (o = 0; o < r.length; o++) {
          if (s = r[o], f = s.instance, y = s.currentTarget, s = s.listener, f !== i && l.isPropagationStopped()) break e;
          nu(l, s, y), i = f;
        }
      }
    }
    if (Lr) throw e = ei, Lr = !1, ei = null, e;
  }
  function pe(e, t) {
    var n = t[Ri];
    n === void 0 && (n = t[Ri] = /* @__PURE__ */ new Set());
    var r = e + "__bubble";
    n.has(r) || (lu(t, e, 2, !1), n.add(r));
  }
  function Ci(e, t, n) {
    var r = 0;
    t && (r |= 4), lu(n, e, r, t);
  }
  var Xr = "_reactListening" + Math.random().toString(36).slice(2);
  function or(e) {
    if (!e[Xr]) {
      e[Xr] = !0, P.forEach(function(n) {
        n !== "selectionchange" && (ff.has(n) || Ci(n, !1, e), Ci(n, !0, e));
      });
      var t = e.nodeType === 9 ? e : e.ownerDocument;
      t === null || t[Xr] || (t[Xr] = !0, Ci("selectionchange", !1, t));
    }
  }
  function lu(e, t, n, r) {
    switch (js(t)) {
      case 1:
        var l = Cc;
        break;
      case 4:
        l = _c;
        break;
      default:
        l = si;
    }
    n = l.bind(null, t, n, e), l = void 0, !bl || t !== "touchstart" && t !== "touchmove" && t !== "wheel" || (l = !0), r ? l !== void 0 ? e.addEventListener(t, n, { capture: !0, passive: l }) : e.addEventListener(t, n, !0) : l !== void 0 ? e.addEventListener(t, n, { passive: l }) : e.addEventListener(t, n, !1);
  }
  function _i(e, t, n, r, l) {
    var i = r;
    if ((t & 1) === 0 && (t & 2) === 0 && r !== null) e: for (; ; ) {
      if (r === null) return;
      var o = r.tag;
      if (o === 3 || o === 4) {
        var s = r.stateNode.containerInfo;
        if (s === l || s.nodeType === 8 && s.parentNode === l) break;
        if (o === 4) for (o = r.return; o !== null; ) {
          var f = o.tag;
          if ((f === 3 || f === 4) && (f = o.stateNode.containerInfo, f === l || f.nodeType === 8 && f.parentNode === l)) return;
          o = o.return;
        }
        for (; s !== null; ) {
          if (o = en(s), o === null) return;
          if (f = o.tag, f === 5 || f === 6) {
            r = i = o;
            continue e;
          }
          s = s.parentNode;
        }
      }
      r = r.return;
    }
    as(function() {
      var y = i, E = Zl(n), C = [];
      e: {
        var S = eu.get(e);
        if (S !== void 0) {
          var L = ci, O = e;
          switch (e) {
            case "keypress":
              if (Br(n) === 0) break e;
            case "keydown":
            case "keyup":
              L = $c;
              break;
            case "focusin":
              O = "focus", L = pi;
              break;
            case "focusout":
              O = "blur", L = pi;
              break;
            case "beforeblur":
            case "afterblur":
              L = pi;
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
              L = Ts;
              break;
            case "drag":
            case "dragend":
            case "dragenter":
            case "dragexit":
            case "dragleave":
            case "dragover":
            case "dragstart":
            case "drop":
              L = Pc;
              break;
            case "touchcancel":
            case "touchend":
            case "touchmove":
            case "touchstart":
              L = Bc;
              break;
            case Zs:
            case Js:
            case qs:
              L = Rc;
              break;
            case bs:
              L = Qc;
              break;
            case "scroll":
              L = Nc;
              break;
            case "wheel":
              L = Yc;
              break;
            case "copy":
            case "cut":
            case "paste":
              L = Mc;
              break;
            case "gotpointercapture":
            case "lostpointercapture":
            case "pointercancel":
            case "pointerdown":
            case "pointermove":
            case "pointerout":
            case "pointerover":
            case "pointerup":
              L = Ls;
          }
          var A = (t & 4) !== 0, Ee = !A && e === "scroll", m = A ? S !== null ? S + "Capture" : null : S;
          A = [];
          for (var p = y, v; p !== null; ) {
            v = p;
            var N = v.stateNode;
            if (v.tag === 5 && N !== null && (v = N, m !== null && (N = Vn(p, m), N != null && A.push(sr(p, N, v)))), Ee) break;
            p = p.return;
          }
          0 < A.length && (S = new L(S, O, null, n, E), C.push({ event: S, listeners: A }));
        }
      }
      if ((t & 7) === 0) {
        e: {
          if (S = e === "mouseover" || e === "pointerover", L = e === "mouseout" || e === "pointerout", S && n !== Xl && (O = n.relatedTarget || n.fromElement) && (en(O) || O[_t])) break e;
          if ((L || S) && (S = E.window === E ? E : (S = E.ownerDocument) ? S.defaultView || S.parentWindow : window, L ? (O = n.relatedTarget || n.toElement, L = y, O = O ? en(O) : null, O !== null && (Ee = bt(O), O !== Ee || O.tag !== 5 && O.tag !== 6) && (O = null)) : (L = null, O = y), L !== O)) {
            if (A = Ts, N = "onMouseLeave", m = "onMouseEnter", p = "mouse", (e === "pointerout" || e === "pointerover") && (A = Ls, N = "onPointerLeave", m = "onPointerEnter", p = "pointer"), Ee = L == null ? S : En(L), v = O == null ? S : En(O), S = new A(N, p + "leave", L, n, E), S.target = Ee, S.relatedTarget = v, N = null, en(E) === y && (A = new A(m, p + "enter", O, n, E), A.target = v, A.relatedTarget = Ee, N = A), Ee = N, L && O) t: {
              for (A = L, m = O, p = 0, v = A; v; v = kn(v)) p++;
              for (v = 0, N = m; N; N = kn(N)) v++;
              for (; 0 < p - v; ) A = kn(A), p--;
              for (; 0 < v - p; ) m = kn(m), v--;
              for (; p--; ) {
                if (A === m || m !== null && A === m.alternate) break t;
                A = kn(A), m = kn(m);
              }
              A = null;
            }
            else A = null;
            L !== null && iu(C, S, L, A, !1), O !== null && Ee !== null && iu(C, Ee, O, A, !0);
          }
        }
        e: {
          if (S = y ? En(y) : window, L = S.nodeName && S.nodeName.toLowerCase(), L === "select" || L === "input" && S.type === "file") var U = ef;
          else if (As(S)) if ($s) U = lf;
          else {
            U = nf;
            var H = tf;
          }
          else (L = S.nodeName) && L.toLowerCase() === "input" && (S.type === "checkbox" || S.type === "radio") && (U = rf);
          if (U && (U = U(e, y))) {
            Us(C, U, n, E);
            break e;
          }
          H && H(e, S, y), e === "focusout" && (H = S._wrapperState) && H.controlled && S.type === "number" && Wl(S, "number", S.value);
        }
        switch (H = y ? En(y) : window, e) {
          case "focusin":
            (As(H) || H.contentEditable === "true") && (wn = H, wi = y, lr = null);
            break;
          case "focusout":
            lr = wi = wn = null;
            break;
          case "mousedown":
            xi = !0;
            break;
          case "contextmenu":
          case "mouseup":
          case "dragend":
            xi = !1, Gs(C, n, E);
            break;
          case "selectionchange":
            if (uf) break;
          case "keydown":
          case "keyup":
            Gs(C, n, E);
        }
        var V;
        if (mi) e: {
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
        else yn ? Fs(e, n) && (Y = "onCompositionEnd") : e === "keydown" && n.keyCode === 229 && (Y = "onCompositionStart");
        Y && (Ms && n.locale !== "ko" && (yn || Y !== "onCompositionStart" ? Y === "onCompositionEnd" && yn && (V = Ps()) : (Ot = E, ai = "value" in Ot ? Ot.value : Ot.textContent, yn = !0)), H = Zr(y, Y), 0 < H.length && (Y = new Rs(Y, e, null, n, E), C.push({ event: Y, listeners: H }), V ? Y.data = V : (V = Os(n), V !== null && (Y.data = V)))), (V = Xc ? Zc(e, n) : Jc(e, n)) && (y = Zr(y, "onBeforeInput"), 0 < y.length && (E = new Rs("onBeforeInput", "beforeinput", null, n, E), C.push({ event: E, listeners: y }), E.data = V));
      }
      ru(C, t);
    });
  }
  function sr(e, t, n) {
    return { instance: e, listener: t, currentTarget: n };
  }
  function Zr(e, t) {
    for (var n = t + "Capture", r = []; e !== null; ) {
      var l = e, i = l.stateNode;
      l.tag === 5 && i !== null && (l = i, i = Vn(e, n), i != null && r.unshift(sr(e, i, l)), i = Vn(e, t), i != null && r.push(sr(e, i, l))), e = e.return;
    }
    return r;
  }
  function kn(e) {
    if (e === null) return null;
    do
      e = e.return;
    while (e && e.tag !== 5);
    return e || null;
  }
  function iu(e, t, n, r, l) {
    for (var i = t._reactName, o = []; n !== null && n !== r; ) {
      var s = n, f = s.alternate, y = s.stateNode;
      if (f !== null && f === r) break;
      s.tag === 5 && y !== null && (s = y, l ? (f = Vn(n, i), f != null && o.unshift(sr(n, f, s))) : l || (f = Vn(n, i), f != null && o.push(sr(n, f, s)))), n = n.return;
    }
    o.length !== 0 && e.push({ event: t, listeners: o });
  }
  var df = /\r\n?/g, pf = /\u0000|\uFFFD/g;
  function ou(e) {
    return (typeof e == "string" ? e : "" + e).replace(df, `
`).replace(pf, "");
  }
  function Jr(e, t, n) {
    if (t = ou(t), ou(e) !== t && n) throw Error(u(425));
  }
  function qr() {
  }
  var Ni = null, ji = null;
  function Pi(e, t) {
    return e === "textarea" || e === "noscript" || typeof t.children == "string" || typeof t.children == "number" || typeof t.dangerouslySetInnerHTML == "object" && t.dangerouslySetInnerHTML !== null && t.dangerouslySetInnerHTML.__html != null;
  }
  var zi = typeof setTimeout == "function" ? setTimeout : void 0, hf = typeof clearTimeout == "function" ? clearTimeout : void 0, su = typeof Promise == "function" ? Promise : void 0, mf = typeof queueMicrotask == "function" ? queueMicrotask : typeof su < "u" ? function(e) {
    return su.resolve(null).then(e).catch(vf);
  } : zi;
  function vf(e) {
    setTimeout(function() {
      throw e;
    });
  }
  function Ti(e, t) {
    var n = t, r = 0;
    do {
      var l = n.nextSibling;
      if (e.removeChild(n), l && l.nodeType === 8) if (n = l.data, n === "/$") {
        if (r === 0) {
          e.removeChild(l), Jn(t);
          return;
        }
        r--;
      } else n !== "$" && n !== "$?" && n !== "$!" || r++;
      n = l;
    } while (n);
    Jn(t);
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
  function uu(e) {
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
  var Sn = Math.random().toString(36).slice(2), kt = "__reactFiber$" + Sn, ur = "__reactProps$" + Sn, _t = "__reactContainer$" + Sn, Ri = "__reactEvents$" + Sn, gf = "__reactListeners$" + Sn, yf = "__reactHandles$" + Sn;
  function en(e) {
    var t = e[kt];
    if (t) return t;
    for (var n = e.parentNode; n; ) {
      if (t = n[_t] || n[kt]) {
        if (n = t.alternate, t.child !== null || n !== null && n.child !== null) for (e = uu(e); e !== null; ) {
          if (n = e[kt]) return n;
          e = uu(e);
        }
        return t;
      }
      e = n, n = e.parentNode;
    }
    return null;
  }
  function ar(e) {
    return e = e[kt] || e[_t], !e || e.tag !== 5 && e.tag !== 6 && e.tag !== 13 && e.tag !== 3 ? null : e;
  }
  function En(e) {
    if (e.tag === 5 || e.tag === 6) return e.stateNode;
    throw Error(u(33));
  }
  function br(e) {
    return e[ur] || null;
  }
  var Li = [], Cn = -1;
  function $t(e) {
    return { current: e };
  }
  function he(e) {
    0 > Cn || (e.current = Li[Cn], Li[Cn] = null, Cn--);
  }
  function de(e, t) {
    Cn++, Li[Cn] = e.current, e.current = t;
  }
  var Ht = {}, Ae = $t(Ht), Ye = $t(!1), tn = Ht;
  function _n(e, t) {
    var n = e.type.contextTypes;
    if (!n) return Ht;
    var r = e.stateNode;
    if (r && r.__reactInternalMemoizedUnmaskedChildContext === t) return r.__reactInternalMemoizedMaskedChildContext;
    var l = {}, i;
    for (i in n) l[i] = t[i];
    return r && (e = e.stateNode, e.__reactInternalMemoizedUnmaskedChildContext = t, e.__reactInternalMemoizedMaskedChildContext = l), l;
  }
  function Ge(e) {
    return e = e.childContextTypes, e != null;
  }
  function el() {
    he(Ye), he(Ae);
  }
  function au(e, t, n) {
    if (Ae.current !== Ht) throw Error(u(168));
    de(Ae, t), de(Ye, n);
  }
  function cu(e, t, n) {
    var r = e.stateNode;
    if (t = t.childContextTypes, typeof r.getChildContext != "function") return n;
    r = r.getChildContext();
    for (var l in r) if (!(l in t)) throw Error(u(108, oe(e) || "Unknown", l));
    return k({}, n, r);
  }
  function tl(e) {
    return e = (e = e.stateNode) && e.__reactInternalMemoizedMergedChildContext || Ht, tn = Ae.current, de(Ae, e), de(Ye, Ye.current), !0;
  }
  function fu(e, t, n) {
    var r = e.stateNode;
    if (!r) throw Error(u(169));
    n ? (e = cu(e, t, tn), r.__reactInternalMemoizedMergedChildContext = e, he(Ye), he(Ae), de(Ae, e)) : he(Ye), de(Ye, n);
  }
  var Nt = null, nl = !1, Mi = !1;
  function du(e) {
    Nt === null ? Nt = [e] : Nt.push(e);
  }
  function wf(e) {
    nl = !0, du(e);
  }
  function Vt() {
    if (!Mi && Nt !== null) {
      Mi = !0;
      var e = 0, t = ce;
      try {
        var n = Nt;
        for (ce = 1; e < n.length; e++) {
          var r = n[e];
          do
            r = r(!0);
          while (r !== null);
        }
        Nt = null, nl = !1;
      } catch (l) {
        throw Nt !== null && (Nt = Nt.slice(e + 1)), hs(ti, Vt), l;
      } finally {
        ce = t, Mi = !1;
      }
    }
    return null;
  }
  var Nn = [], jn = 0, rl = null, ll = 0, ot = [], st = 0, nn = null, jt = 1, Pt = "";
  function rn(e, t) {
    Nn[jn++] = ll, Nn[jn++] = rl, rl = e, ll = t;
  }
  function pu(e, t, n) {
    ot[st++] = jt, ot[st++] = Pt, ot[st++] = nn, nn = e;
    var r = jt;
    e = Pt;
    var l = 32 - pt(r) - 1;
    r &= ~(1 << l), n += 1;
    var i = 32 - pt(t) + l;
    if (30 < i) {
      var o = l - l % 5;
      i = (r & (1 << o) - 1).toString(32), r >>= o, l -= o, jt = 1 << 32 - pt(t) + l | n << l | r, Pt = i + e;
    } else jt = 1 << i | n << l | r, Pt = e;
  }
  function Ii(e) {
    e.return !== null && (rn(e, 1), pu(e, 1, 0));
  }
  function Di(e) {
    for (; e === rl; ) rl = Nn[--jn], Nn[jn] = null, ll = Nn[--jn], Nn[jn] = null;
    for (; e === nn; ) nn = ot[--st], ot[st] = null, Pt = ot[--st], ot[st] = null, jt = ot[--st], ot[st] = null;
  }
  var tt = null, nt = null, ge = !1, mt = null;
  function hu(e, t) {
    var n = ft(5, null, null, 0);
    n.elementType = "DELETED", n.stateNode = t, n.return = e, t = e.deletions, t === null ? (e.deletions = [n], e.flags |= 16) : t.push(n);
  }
  function mu(e, t) {
    switch (e.tag) {
      case 5:
        var n = e.type;
        return t = t.nodeType !== 1 || n.toLowerCase() !== t.nodeName.toLowerCase() ? null : t, t !== null ? (e.stateNode = t, tt = e, nt = Ut(t.firstChild), !0) : !1;
      case 6:
        return t = e.pendingProps === "" || t.nodeType !== 3 ? null : t, t !== null ? (e.stateNode = t, tt = e, nt = null, !0) : !1;
      case 13:
        return t = t.nodeType !== 8 ? null : t, t !== null ? (n = nn !== null ? { id: jt, overflow: Pt } : null, e.memoizedState = { dehydrated: t, treeContext: n, retryLane: 1073741824 }, n = ft(18, null, null, 0), n.stateNode = t, n.return = e, e.child = n, tt = e, nt = null, !0) : !1;
      default:
        return !1;
    }
  }
  function Fi(e) {
    return (e.mode & 1) !== 0 && (e.flags & 128) === 0;
  }
  function Oi(e) {
    if (ge) {
      var t = nt;
      if (t) {
        var n = t;
        if (!mu(e, t)) {
          if (Fi(e)) throw Error(u(418));
          t = Ut(n.nextSibling);
          var r = tt;
          t && mu(e, t) ? hu(r, n) : (e.flags = e.flags & -4097 | 2, ge = !1, tt = e);
        }
      } else {
        if (Fi(e)) throw Error(u(418));
        e.flags = e.flags & -4097 | 2, ge = !1, tt = e;
      }
    }
  }
  function vu(e) {
    for (e = e.return; e !== null && e.tag !== 5 && e.tag !== 3 && e.tag !== 13; ) e = e.return;
    tt = e;
  }
  function il(e) {
    if (e !== tt) return !1;
    if (!ge) return vu(e), ge = !0, !1;
    var t;
    if ((t = e.tag !== 3) && !(t = e.tag !== 5) && (t = e.type, t = t !== "head" && t !== "body" && !Pi(e.type, e.memoizedProps)), t && (t = nt)) {
      if (Fi(e)) throw gu(), Error(u(418));
      for (; t; ) hu(e, t), t = Ut(t.nextSibling);
    }
    if (vu(e), e.tag === 13) {
      if (e = e.memoizedState, e = e !== null ? e.dehydrated : null, !e) throw Error(u(317));
      e: {
        for (e = e.nextSibling, t = 0; e; ) {
          if (e.nodeType === 8) {
            var n = e.data;
            if (n === "/$") {
              if (t === 0) {
                nt = Ut(e.nextSibling);
                break e;
              }
              t--;
            } else n !== "$" && n !== "$!" && n !== "$?" || t++;
          }
          e = e.nextSibling;
        }
        nt = null;
      }
    } else nt = tt ? Ut(e.stateNode.nextSibling) : null;
    return !0;
  }
  function gu() {
    for (var e = nt; e; ) e = Ut(e.nextSibling);
  }
  function Pn() {
    nt = tt = null, ge = !1;
  }
  function Ai(e) {
    mt === null ? mt = [e] : mt.push(e);
  }
  var xf = Q.ReactCurrentBatchConfig;
  function cr(e, t, n) {
    if (e = n.ref, e !== null && typeof e != "function" && typeof e != "object") {
      if (n._owner) {
        if (n = n._owner, n) {
          if (n.tag !== 1) throw Error(u(309));
          var r = n.stateNode;
        }
        if (!r) throw Error(u(147, e));
        var l = r, i = "" + e;
        return t !== null && t.ref !== null && typeof t.ref == "function" && t.ref._stringRef === i ? t.ref : (t = function(o) {
          var s = l.refs;
          o === null ? delete s[i] : s[i] = o;
        }, t._stringRef = i, t);
      }
      if (typeof e != "string") throw Error(u(284));
      if (!n._owner) throw Error(u(290, e));
    }
    return e;
  }
  function ol(e, t) {
    throw e = Object.prototype.toString.call(t), Error(u(31, e === "[object Object]" ? "object with keys {" + Object.keys(t).join(", ") + "}" : e));
  }
  function yu(e) {
    var t = e._init;
    return t(e._payload);
  }
  function wu(e) {
    function t(m, p) {
      if (e) {
        var v = m.deletions;
        v === null ? (m.deletions = [p], m.flags |= 16) : v.push(p);
      }
    }
    function n(m, p) {
      if (!e) return null;
      for (; p !== null; ) t(m, p), p = p.sibling;
      return null;
    }
    function r(m, p) {
      for (m = /* @__PURE__ */ new Map(); p !== null; ) p.key !== null ? m.set(p.key, p) : m.set(p.index, p), p = p.sibling;
      return m;
    }
    function l(m, p) {
      return m = Zt(m, p), m.index = 0, m.sibling = null, m;
    }
    function i(m, p, v) {
      return m.index = v, e ? (v = m.alternate, v !== null ? (v = v.index, v < p ? (m.flags |= 2, p) : v) : (m.flags |= 2, p)) : (m.flags |= 1048576, p);
    }
    function o(m) {
      return e && m.alternate === null && (m.flags |= 2), m;
    }
    function s(m, p, v, N) {
      return p === null || p.tag !== 6 ? (p = To(v, m.mode, N), p.return = m, p) : (p = l(p, v), p.return = m, p);
    }
    function f(m, p, v, N) {
      var U = v.type;
      return U === ee ? E(m, p, v.props.children, N, v.key) : p !== null && (p.elementType === U || typeof U == "object" && U !== null && U.$$typeof === ze && yu(U) === p.type) ? (N = l(p, v.props), N.ref = cr(m, p, v), N.return = m, N) : (N = Tl(v.type, v.key, v.props, null, m.mode, N), N.ref = cr(m, p, v), N.return = m, N);
    }
    function y(m, p, v, N) {
      return p === null || p.tag !== 4 || p.stateNode.containerInfo !== v.containerInfo || p.stateNode.implementation !== v.implementation ? (p = Ro(v, m.mode, N), p.return = m, p) : (p = l(p, v.children || []), p.return = m, p);
    }
    function E(m, p, v, N, U) {
      return p === null || p.tag !== 7 ? (p = dn(v, m.mode, N, U), p.return = m, p) : (p = l(p, v), p.return = m, p);
    }
    function C(m, p, v) {
      if (typeof p == "string" && p !== "" || typeof p == "number") return p = To("" + p, m.mode, v), p.return = m, p;
      if (typeof p == "object" && p !== null) {
        switch (p.$$typeof) {
          case J:
            return v = Tl(p.type, p.key, p.props, null, m.mode, v), v.ref = cr(m, null, p), v.return = m, v;
          case q:
            return p = Ro(p, m.mode, v), p.return = m, p;
          case ze:
            var N = p._init;
            return C(m, N(p._payload), v);
        }
        if (Un(p) || w(p)) return p = dn(p, m.mode, v, null), p.return = m, p;
        ol(m, p);
      }
      return null;
    }
    function S(m, p, v, N) {
      var U = p !== null ? p.key : null;
      if (typeof v == "string" && v !== "" || typeof v == "number") return U !== null ? null : s(m, p, "" + v, N);
      if (typeof v == "object" && v !== null) {
        switch (v.$$typeof) {
          case J:
            return v.key === U ? f(m, p, v, N) : null;
          case q:
            return v.key === U ? y(m, p, v, N) : null;
          case ze:
            return U = v._init, S(
              m,
              p,
              U(v._payload),
              N
            );
        }
        if (Un(v) || w(v)) return U !== null ? null : E(m, p, v, N, null);
        ol(m, v);
      }
      return null;
    }
    function L(m, p, v, N, U) {
      if (typeof N == "string" && N !== "" || typeof N == "number") return m = m.get(v) || null, s(p, m, "" + N, U);
      if (typeof N == "object" && N !== null) {
        switch (N.$$typeof) {
          case J:
            return m = m.get(N.key === null ? v : N.key) || null, f(p, m, N, U);
          case q:
            return m = m.get(N.key === null ? v : N.key) || null, y(p, m, N, U);
          case ze:
            var H = N._init;
            return L(m, p, v, H(N._payload), U);
        }
        if (Un(N) || w(N)) return m = m.get(v) || null, E(p, m, N, U, null);
        ol(p, N);
      }
      return null;
    }
    function O(m, p, v, N) {
      for (var U = null, H = null, V = p, Y = p = 0, Le = null; V !== null && Y < v.length; Y++) {
        V.index > Y ? (Le = V, V = null) : Le = V.sibling;
        var ae = S(m, V, v[Y], N);
        if (ae === null) {
          V === null && (V = Le);
          break;
        }
        e && V && ae.alternate === null && t(m, V), p = i(ae, p, Y), H === null ? U = ae : H.sibling = ae, H = ae, V = Le;
      }
      if (Y === v.length) return n(m, V), ge && rn(m, Y), U;
      if (V === null) {
        for (; Y < v.length; Y++) V = C(m, v[Y], N), V !== null && (p = i(V, p, Y), H === null ? U = V : H.sibling = V, H = V);
        return ge && rn(m, Y), U;
      }
      for (V = r(m, V); Y < v.length; Y++) Le = L(V, m, Y, v[Y], N), Le !== null && (e && Le.alternate !== null && V.delete(Le.key === null ? Y : Le.key), p = i(Le, p, Y), H === null ? U = Le : H.sibling = Le, H = Le);
      return e && V.forEach(function(Jt) {
        return t(m, Jt);
      }), ge && rn(m, Y), U;
    }
    function A(m, p, v, N) {
      var U = w(v);
      if (typeof U != "function") throw Error(u(150));
      if (v = U.call(v), v == null) throw Error(u(151));
      for (var H = U = null, V = p, Y = p = 0, Le = null, ae = v.next(); V !== null && !ae.done; Y++, ae = v.next()) {
        V.index > Y ? (Le = V, V = null) : Le = V.sibling;
        var Jt = S(m, V, ae.value, N);
        if (Jt === null) {
          V === null && (V = Le);
          break;
        }
        e && V && Jt.alternate === null && t(m, V), p = i(Jt, p, Y), H === null ? U = Jt : H.sibling = Jt, H = Jt, V = Le;
      }
      if (ae.done) return n(
        m,
        V
      ), ge && rn(m, Y), U;
      if (V === null) {
        for (; !ae.done; Y++, ae = v.next()) ae = C(m, ae.value, N), ae !== null && (p = i(ae, p, Y), H === null ? U = ae : H.sibling = ae, H = ae);
        return ge && rn(m, Y), U;
      }
      for (V = r(m, V); !ae.done; Y++, ae = v.next()) ae = L(V, m, Y, ae.value, N), ae !== null && (e && ae.alternate !== null && V.delete(ae.key === null ? Y : ae.key), p = i(ae, p, Y), H === null ? U = ae : H.sibling = ae, H = ae);
      return e && V.forEach(function(bf) {
        return t(m, bf);
      }), ge && rn(m, Y), U;
    }
    function Ee(m, p, v, N) {
      if (typeof v == "object" && v !== null && v.type === ee && v.key === null && (v = v.props.children), typeof v == "object" && v !== null) {
        switch (v.$$typeof) {
          case J:
            e: {
              for (var U = v.key, H = p; H !== null; ) {
                if (H.key === U) {
                  if (U = v.type, U === ee) {
                    if (H.tag === 7) {
                      n(m, H.sibling), p = l(H, v.props.children), p.return = m, m = p;
                      break e;
                    }
                  } else if (H.elementType === U || typeof U == "object" && U !== null && U.$$typeof === ze && yu(U) === H.type) {
                    n(m, H.sibling), p = l(H, v.props), p.ref = cr(m, H, v), p.return = m, m = p;
                    break e;
                  }
                  n(m, H);
                  break;
                } else t(m, H);
                H = H.sibling;
              }
              v.type === ee ? (p = dn(v.props.children, m.mode, N, v.key), p.return = m, m = p) : (N = Tl(v.type, v.key, v.props, null, m.mode, N), N.ref = cr(m, p, v), N.return = m, m = N);
            }
            return o(m);
          case q:
            e: {
              for (H = v.key; p !== null; ) {
                if (p.key === H) if (p.tag === 4 && p.stateNode.containerInfo === v.containerInfo && p.stateNode.implementation === v.implementation) {
                  n(m, p.sibling), p = l(p, v.children || []), p.return = m, m = p;
                  break e;
                } else {
                  n(m, p);
                  break;
                }
                else t(m, p);
                p = p.sibling;
              }
              p = Ro(v, m.mode, N), p.return = m, m = p;
            }
            return o(m);
          case ze:
            return H = v._init, Ee(m, p, H(v._payload), N);
        }
        if (Un(v)) return O(m, p, v, N);
        if (w(v)) return A(m, p, v, N);
        ol(m, v);
      }
      return typeof v == "string" && v !== "" || typeof v == "number" ? (v = "" + v, p !== null && p.tag === 6 ? (n(m, p.sibling), p = l(p, v), p.return = m, m = p) : (n(m, p), p = To(v, m.mode, N), p.return = m, m = p), o(m)) : n(m, p);
    }
    return Ee;
  }
  var zn = wu(!0), xu = wu(!1), sl = $t(null), ul = null, Tn = null, Ui = null;
  function $i() {
    Ui = Tn = ul = null;
  }
  function Hi(e) {
    var t = sl.current;
    he(sl), e._currentValue = t;
  }
  function Vi(e, t, n) {
    for (; e !== null; ) {
      var r = e.alternate;
      if ((e.childLanes & t) !== t ? (e.childLanes |= t, r !== null && (r.childLanes |= t)) : r !== null && (r.childLanes & t) !== t && (r.childLanes |= t), e === n) break;
      e = e.return;
    }
  }
  function Rn(e, t) {
    ul = e, Ui = Tn = null, e = e.dependencies, e !== null && e.firstContext !== null && ((e.lanes & t) !== 0 && (Xe = !0), e.firstContext = null);
  }
  function ut(e) {
    var t = e._currentValue;
    if (Ui !== e) if (e = { context: e, memoizedValue: t, next: null }, Tn === null) {
      if (ul === null) throw Error(u(308));
      Tn = e, ul.dependencies = { lanes: 0, firstContext: e };
    } else Tn = Tn.next = e;
    return t;
  }
  var ln = null;
  function Bi(e) {
    ln === null ? ln = [e] : ln.push(e);
  }
  function ku(e, t, n, r) {
    var l = t.interleaved;
    return l === null ? (n.next = n, Bi(t)) : (n.next = l.next, l.next = n), t.interleaved = n, zt(e, r);
  }
  function zt(e, t) {
    e.lanes |= t;
    var n = e.alternate;
    for (n !== null && (n.lanes |= t), n = e, e = e.return; e !== null; ) e.childLanes |= t, n = e.alternate, n !== null && (n.childLanes |= t), n = e, e = e.return;
    return n.tag === 3 ? n.stateNode : null;
  }
  var Bt = !1;
  function Wi(e) {
    e.updateQueue = { baseState: e.memoizedState, firstBaseUpdate: null, lastBaseUpdate: null, shared: { pending: null, interleaved: null, lanes: 0 }, effects: null };
  }
  function Su(e, t) {
    e = e.updateQueue, t.updateQueue === e && (t.updateQueue = { baseState: e.baseState, firstBaseUpdate: e.firstBaseUpdate, lastBaseUpdate: e.lastBaseUpdate, shared: e.shared, effects: e.effects });
  }
  function Tt(e, t) {
    return { eventTime: e, lane: t, tag: 0, payload: null, callback: null, next: null };
  }
  function Wt(e, t, n) {
    var r = e.updateQueue;
    if (r === null) return null;
    if (r = r.shared, (se & 2) !== 0) {
      var l = r.pending;
      return l === null ? t.next = t : (t.next = l.next, l.next = t), r.pending = t, zt(e, n);
    }
    return l = r.interleaved, l === null ? (t.next = t, Bi(r)) : (t.next = l.next, l.next = t), r.interleaved = t, zt(e, n);
  }
  function al(e, t, n) {
    if (t = t.updateQueue, t !== null && (t = t.shared, (n & 4194240) !== 0)) {
      var r = t.lanes;
      r &= e.pendingLanes, n |= r, t.lanes = n, li(e, n);
    }
  }
  function Eu(e, t) {
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
  function cl(e, t, n, r) {
    var l = e.updateQueue;
    Bt = !1;
    var i = l.firstBaseUpdate, o = l.lastBaseUpdate, s = l.shared.pending;
    if (s !== null) {
      l.shared.pending = null;
      var f = s, y = f.next;
      f.next = null, o === null ? i = y : o.next = y, o = f;
      var E = e.alternate;
      E !== null && (E = E.updateQueue, s = E.lastBaseUpdate, s !== o && (s === null ? E.firstBaseUpdate = y : s.next = y, E.lastBaseUpdate = f));
    }
    if (i !== null) {
      var C = l.baseState;
      o = 0, E = y = f = null, s = i;
      do {
        var S = s.lane, L = s.eventTime;
        if ((r & S) === S) {
          E !== null && (E = E.next = {
            eventTime: L,
            lane: 0,
            tag: s.tag,
            payload: s.payload,
            callback: s.callback,
            next: null
          });
          e: {
            var O = e, A = s;
            switch (S = t, L = n, A.tag) {
              case 1:
                if (O = A.payload, typeof O == "function") {
                  C = O.call(L, C, S);
                  break e;
                }
                C = O;
                break e;
              case 3:
                O.flags = O.flags & -65537 | 128;
              case 0:
                if (O = A.payload, S = typeof O == "function" ? O.call(L, C, S) : O, S == null) break e;
                C = k({}, C, S);
                break e;
              case 2:
                Bt = !0;
            }
          }
          s.callback !== null && s.lane !== 0 && (e.flags |= 64, S = l.effects, S === null ? l.effects = [s] : S.push(s));
        } else L = { eventTime: L, lane: S, tag: s.tag, payload: s.payload, callback: s.callback, next: null }, E === null ? (y = E = L, f = C) : E = E.next = L, o |= S;
        if (s = s.next, s === null) {
          if (s = l.shared.pending, s === null) break;
          S = s, s = S.next, S.next = null, l.lastBaseUpdate = S, l.shared.pending = null;
        }
      } while (!0);
      if (E === null && (f = C), l.baseState = f, l.firstBaseUpdate = y, l.lastBaseUpdate = E, t = l.shared.interleaved, t !== null) {
        l = t;
        do
          o |= l.lane, l = l.next;
        while (l !== t);
      } else i === null && (l.shared.lanes = 0);
      un |= o, e.lanes = o, e.memoizedState = C;
    }
  }
  function Cu(e, t, n) {
    if (e = t.effects, t.effects = null, e !== null) for (t = 0; t < e.length; t++) {
      var r = e[t], l = r.callback;
      if (l !== null) {
        if (r.callback = null, r = n, typeof l != "function") throw Error(u(191, l));
        l.call(r);
      }
    }
  }
  var fr = {}, St = $t(fr), dr = $t(fr), pr = $t(fr);
  function on(e) {
    if (e === fr) throw Error(u(174));
    return e;
  }
  function Qi(e, t) {
    switch (de(pr, t), de(dr, e), de(St, fr), e = t.nodeType, e) {
      case 9:
      case 11:
        t = (t = t.documentElement) ? t.namespaceURI : Kl(null, "");
        break;
      default:
        e = e === 8 ? t.parentNode : t, t = e.namespaceURI || null, e = e.tagName, t = Kl(t, e);
    }
    he(St), de(St, t);
  }
  function Ln() {
    he(St), he(dr), he(pr);
  }
  function _u(e) {
    on(pr.current);
    var t = on(St.current), n = Kl(t, e.type);
    t !== n && (de(dr, e), de(St, n));
  }
  function Ki(e) {
    dr.current === e && (he(St), he(dr));
  }
  var ye = $t(0);
  function fl(e) {
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
  var Yi = [];
  function Gi() {
    for (var e = 0; e < Yi.length; e++) Yi[e]._workInProgressVersionPrimary = null;
    Yi.length = 0;
  }
  var dl = Q.ReactCurrentDispatcher, Xi = Q.ReactCurrentBatchConfig, sn = 0, we = null, je = null, Te = null, pl = !1, hr = !1, mr = 0, kf = 0;
  function Ue() {
    throw Error(u(321));
  }
  function Zi(e, t) {
    if (t === null) return !1;
    for (var n = 0; n < t.length && n < e.length; n++) if (!ht(e[n], t[n])) return !1;
    return !0;
  }
  function Ji(e, t, n, r, l, i) {
    if (sn = i, we = t, t.memoizedState = null, t.updateQueue = null, t.lanes = 0, dl.current = e === null || e.memoizedState === null ? _f : Nf, e = n(r, l), hr) {
      i = 0;
      do {
        if (hr = !1, mr = 0, 25 <= i) throw Error(u(301));
        i += 1, Te = je = null, t.updateQueue = null, dl.current = jf, e = n(r, l);
      } while (hr);
    }
    if (dl.current = vl, t = je !== null && je.next !== null, sn = 0, Te = je = we = null, pl = !1, t) throw Error(u(300));
    return e;
  }
  function qi() {
    var e = mr !== 0;
    return mr = 0, e;
  }
  function Et() {
    var e = { memoizedState: null, baseState: null, baseQueue: null, queue: null, next: null };
    return Te === null ? we.memoizedState = Te = e : Te = Te.next = e, Te;
  }
  function at() {
    if (je === null) {
      var e = we.alternate;
      e = e !== null ? e.memoizedState : null;
    } else e = je.next;
    var t = Te === null ? we.memoizedState : Te.next;
    if (t !== null) Te = t, je = e;
    else {
      if (e === null) throw Error(u(310));
      je = e, e = { memoizedState: je.memoizedState, baseState: je.baseState, baseQueue: je.baseQueue, queue: je.queue, next: null }, Te === null ? we.memoizedState = Te = e : Te = Te.next = e;
    }
    return Te;
  }
  function vr(e, t) {
    return typeof t == "function" ? t(e) : t;
  }
  function bi(e) {
    var t = at(), n = t.queue;
    if (n === null) throw Error(u(311));
    n.lastRenderedReducer = e;
    var r = je, l = r.baseQueue, i = n.pending;
    if (i !== null) {
      if (l !== null) {
        var o = l.next;
        l.next = i.next, i.next = o;
      }
      r.baseQueue = l = i, n.pending = null;
    }
    if (l !== null) {
      i = l.next, r = r.baseState;
      var s = o = null, f = null, y = i;
      do {
        var E = y.lane;
        if ((sn & E) === E) f !== null && (f = f.next = { lane: 0, action: y.action, hasEagerState: y.hasEagerState, eagerState: y.eagerState, next: null }), r = y.hasEagerState ? y.eagerState : e(r, y.action);
        else {
          var C = {
            lane: E,
            action: y.action,
            hasEagerState: y.hasEagerState,
            eagerState: y.eagerState,
            next: null
          };
          f === null ? (s = f = C, o = r) : f = f.next = C, we.lanes |= E, un |= E;
        }
        y = y.next;
      } while (y !== null && y !== i);
      f === null ? o = r : f.next = s, ht(r, t.memoizedState) || (Xe = !0), t.memoizedState = r, t.baseState = o, t.baseQueue = f, n.lastRenderedState = r;
    }
    if (e = n.interleaved, e !== null) {
      l = e;
      do
        i = l.lane, we.lanes |= i, un |= i, l = l.next;
      while (l !== e);
    } else l === null && (n.lanes = 0);
    return [t.memoizedState, n.dispatch];
  }
  function eo(e) {
    var t = at(), n = t.queue;
    if (n === null) throw Error(u(311));
    n.lastRenderedReducer = e;
    var r = n.dispatch, l = n.pending, i = t.memoizedState;
    if (l !== null) {
      n.pending = null;
      var o = l = l.next;
      do
        i = e(i, o.action), o = o.next;
      while (o !== l);
      ht(i, t.memoizedState) || (Xe = !0), t.memoizedState = i, t.baseQueue === null && (t.baseState = i), n.lastRenderedState = i;
    }
    return [i, r];
  }
  function Nu() {
  }
  function ju(e, t) {
    var n = we, r = at(), l = t(), i = !ht(r.memoizedState, l);
    if (i && (r.memoizedState = l, Xe = !0), r = r.queue, to(Tu.bind(null, n, r, e), [e]), r.getSnapshot !== t || i || Te !== null && Te.memoizedState.tag & 1) {
      if (n.flags |= 2048, gr(9, zu.bind(null, n, r, l, t), void 0, null), Re === null) throw Error(u(349));
      (sn & 30) !== 0 || Pu(n, t, l);
    }
    return l;
  }
  function Pu(e, t, n) {
    e.flags |= 16384, e = { getSnapshot: t, value: n }, t = we.updateQueue, t === null ? (t = { lastEffect: null, stores: null }, we.updateQueue = t, t.stores = [e]) : (n = t.stores, n === null ? t.stores = [e] : n.push(e));
  }
  function zu(e, t, n, r) {
    t.value = n, t.getSnapshot = r, Ru(t) && Lu(e);
  }
  function Tu(e, t, n) {
    return n(function() {
      Ru(t) && Lu(e);
    });
  }
  function Ru(e) {
    var t = e.getSnapshot;
    e = e.value;
    try {
      var n = t();
      return !ht(e, n);
    } catch {
      return !0;
    }
  }
  function Lu(e) {
    var t = zt(e, 1);
    t !== null && wt(t, e, 1, -1);
  }
  function Mu(e) {
    var t = Et();
    return typeof e == "function" && (e = e()), t.memoizedState = t.baseState = e, e = { pending: null, interleaved: null, lanes: 0, dispatch: null, lastRenderedReducer: vr, lastRenderedState: e }, t.queue = e, e = e.dispatch = Cf.bind(null, we, e), [t.memoizedState, e];
  }
  function gr(e, t, n, r) {
    return e = { tag: e, create: t, destroy: n, deps: r, next: null }, t = we.updateQueue, t === null ? (t = { lastEffect: null, stores: null }, we.updateQueue = t, t.lastEffect = e.next = e) : (n = t.lastEffect, n === null ? t.lastEffect = e.next = e : (r = n.next, n.next = e, e.next = r, t.lastEffect = e)), e;
  }
  function Iu() {
    return at().memoizedState;
  }
  function hl(e, t, n, r) {
    var l = Et();
    we.flags |= e, l.memoizedState = gr(1 | t, n, void 0, r === void 0 ? null : r);
  }
  function ml(e, t, n, r) {
    var l = at();
    r = r === void 0 ? null : r;
    var i = void 0;
    if (je !== null) {
      var o = je.memoizedState;
      if (i = o.destroy, r !== null && Zi(r, o.deps)) {
        l.memoizedState = gr(t, n, i, r);
        return;
      }
    }
    we.flags |= e, l.memoizedState = gr(1 | t, n, i, r);
  }
  function Du(e, t) {
    return hl(8390656, 8, e, t);
  }
  function to(e, t) {
    return ml(2048, 8, e, t);
  }
  function Fu(e, t) {
    return ml(4, 2, e, t);
  }
  function Ou(e, t) {
    return ml(4, 4, e, t);
  }
  function Au(e, t) {
    if (typeof t == "function") return e = e(), t(e), function() {
      t(null);
    };
    if (t != null) return e = e(), t.current = e, function() {
      t.current = null;
    };
  }
  function Uu(e, t, n) {
    return n = n != null ? n.concat([e]) : null, ml(4, 4, Au.bind(null, t, e), n);
  }
  function no() {
  }
  function $u(e, t) {
    var n = at();
    t = t === void 0 ? null : t;
    var r = n.memoizedState;
    return r !== null && t !== null && Zi(t, r[1]) ? r[0] : (n.memoizedState = [e, t], e);
  }
  function Hu(e, t) {
    var n = at();
    t = t === void 0 ? null : t;
    var r = n.memoizedState;
    return r !== null && t !== null && Zi(t, r[1]) ? r[0] : (e = e(), n.memoizedState = [e, t], e);
  }
  function Vu(e, t, n) {
    return (sn & 21) === 0 ? (e.baseState && (e.baseState = !1, Xe = !0), e.memoizedState = n) : (ht(n, t) || (n = ys(), we.lanes |= n, un |= n, e.baseState = !0), t);
  }
  function Sf(e, t) {
    var n = ce;
    ce = n !== 0 && 4 > n ? n : 4, e(!0);
    var r = Xi.transition;
    Xi.transition = {};
    try {
      e(!1), t();
    } finally {
      ce = n, Xi.transition = r;
    }
  }
  function Bu() {
    return at().memoizedState;
  }
  function Ef(e, t, n) {
    var r = Gt(e);
    if (n = { lane: r, action: n, hasEagerState: !1, eagerState: null, next: null }, Wu(e)) Qu(t, n);
    else if (n = ku(e, t, n, r), n !== null) {
      var l = We();
      wt(n, e, r, l), Ku(n, t, r);
    }
  }
  function Cf(e, t, n) {
    var r = Gt(e), l = { lane: r, action: n, hasEagerState: !1, eagerState: null, next: null };
    if (Wu(e)) Qu(t, l);
    else {
      var i = e.alternate;
      if (e.lanes === 0 && (i === null || i.lanes === 0) && (i = t.lastRenderedReducer, i !== null)) try {
        var o = t.lastRenderedState, s = i(o, n);
        if (l.hasEagerState = !0, l.eagerState = s, ht(s, o)) {
          var f = t.interleaved;
          f === null ? (l.next = l, Bi(t)) : (l.next = f.next, f.next = l), t.interleaved = l;
          return;
        }
      } catch {
      } finally {
      }
      n = ku(e, t, l, r), n !== null && (l = We(), wt(n, e, r, l), Ku(n, t, r));
    }
  }
  function Wu(e) {
    var t = e.alternate;
    return e === we || t !== null && t === we;
  }
  function Qu(e, t) {
    hr = pl = !0;
    var n = e.pending;
    n === null ? t.next = t : (t.next = n.next, n.next = t), e.pending = t;
  }
  function Ku(e, t, n) {
    if ((n & 4194240) !== 0) {
      var r = t.lanes;
      r &= e.pendingLanes, n |= r, t.lanes = n, li(e, n);
    }
  }
  var vl = { readContext: ut, useCallback: Ue, useContext: Ue, useEffect: Ue, useImperativeHandle: Ue, useInsertionEffect: Ue, useLayoutEffect: Ue, useMemo: Ue, useReducer: Ue, useRef: Ue, useState: Ue, useDebugValue: Ue, useDeferredValue: Ue, useTransition: Ue, useMutableSource: Ue, useSyncExternalStore: Ue, useId: Ue, unstable_isNewReconciler: !1 }, _f = { readContext: ut, useCallback: function(e, t) {
    return Et().memoizedState = [e, t === void 0 ? null : t], e;
  }, useContext: ut, useEffect: Du, useImperativeHandle: function(e, t, n) {
    return n = n != null ? n.concat([e]) : null, hl(
      4194308,
      4,
      Au.bind(null, t, e),
      n
    );
  }, useLayoutEffect: function(e, t) {
    return hl(4194308, 4, e, t);
  }, useInsertionEffect: function(e, t) {
    return hl(4, 2, e, t);
  }, useMemo: function(e, t) {
    var n = Et();
    return t = t === void 0 ? null : t, e = e(), n.memoizedState = [e, t], e;
  }, useReducer: function(e, t, n) {
    var r = Et();
    return t = n !== void 0 ? n(t) : t, r.memoizedState = r.baseState = t, e = { pending: null, interleaved: null, lanes: 0, dispatch: null, lastRenderedReducer: e, lastRenderedState: t }, r.queue = e, e = e.dispatch = Ef.bind(null, we, e), [r.memoizedState, e];
  }, useRef: function(e) {
    var t = Et();
    return e = { current: e }, t.memoizedState = e;
  }, useState: Mu, useDebugValue: no, useDeferredValue: function(e) {
    return Et().memoizedState = e;
  }, useTransition: function() {
    var e = Mu(!1), t = e[0];
    return e = Sf.bind(null, e[1]), Et().memoizedState = e, [t, e];
  }, useMutableSource: function() {
  }, useSyncExternalStore: function(e, t, n) {
    var r = we, l = Et();
    if (ge) {
      if (n === void 0) throw Error(u(407));
      n = n();
    } else {
      if (n = t(), Re === null) throw Error(u(349));
      (sn & 30) !== 0 || Pu(r, t, n);
    }
    l.memoizedState = n;
    var i = { value: n, getSnapshot: t };
    return l.queue = i, Du(Tu.bind(
      null,
      r,
      i,
      e
    ), [e]), r.flags |= 2048, gr(9, zu.bind(null, r, i, n, t), void 0, null), n;
  }, useId: function() {
    var e = Et(), t = Re.identifierPrefix;
    if (ge) {
      var n = Pt, r = jt;
      n = (r & ~(1 << 32 - pt(r) - 1)).toString(32) + n, t = ":" + t + "R" + n, n = mr++, 0 < n && (t += "H" + n.toString(32)), t += ":";
    } else n = kf++, t = ":" + t + "r" + n.toString(32) + ":";
    return e.memoizedState = t;
  }, unstable_isNewReconciler: !1 }, Nf = {
    readContext: ut,
    useCallback: $u,
    useContext: ut,
    useEffect: to,
    useImperativeHandle: Uu,
    useInsertionEffect: Fu,
    useLayoutEffect: Ou,
    useMemo: Hu,
    useReducer: bi,
    useRef: Iu,
    useState: function() {
      return bi(vr);
    },
    useDebugValue: no,
    useDeferredValue: function(e) {
      var t = at();
      return Vu(t, je.memoizedState, e);
    },
    useTransition: function() {
      var e = bi(vr)[0], t = at().memoizedState;
      return [e, t];
    },
    useMutableSource: Nu,
    useSyncExternalStore: ju,
    useId: Bu,
    unstable_isNewReconciler: !1
  }, jf = { readContext: ut, useCallback: $u, useContext: ut, useEffect: to, useImperativeHandle: Uu, useInsertionEffect: Fu, useLayoutEffect: Ou, useMemo: Hu, useReducer: eo, useRef: Iu, useState: function() {
    return eo(vr);
  }, useDebugValue: no, useDeferredValue: function(e) {
    var t = at();
    return je === null ? t.memoizedState = e : Vu(t, je.memoizedState, e);
  }, useTransition: function() {
    var e = eo(vr)[0], t = at().memoizedState;
    return [e, t];
  }, useMutableSource: Nu, useSyncExternalStore: ju, useId: Bu, unstable_isNewReconciler: !1 };
  function vt(e, t) {
    if (e && e.defaultProps) {
      t = k({}, t), e = e.defaultProps;
      for (var n in e) t[n] === void 0 && (t[n] = e[n]);
      return t;
    }
    return t;
  }
  function ro(e, t, n, r) {
    t = e.memoizedState, n = n(r, t), n = n == null ? t : k({}, t, n), e.memoizedState = n, e.lanes === 0 && (e.updateQueue.baseState = n);
  }
  var gl = { isMounted: function(e) {
    return (e = e._reactInternals) ? bt(e) === e : !1;
  }, enqueueSetState: function(e, t, n) {
    e = e._reactInternals;
    var r = We(), l = Gt(e), i = Tt(r, l);
    i.payload = t, n != null && (i.callback = n), t = Wt(e, i, l), t !== null && (wt(t, e, l, r), al(t, e, l));
  }, enqueueReplaceState: function(e, t, n) {
    e = e._reactInternals;
    var r = We(), l = Gt(e), i = Tt(r, l);
    i.tag = 1, i.payload = t, n != null && (i.callback = n), t = Wt(e, i, l), t !== null && (wt(t, e, l, r), al(t, e, l));
  }, enqueueForceUpdate: function(e, t) {
    e = e._reactInternals;
    var n = We(), r = Gt(e), l = Tt(n, r);
    l.tag = 2, t != null && (l.callback = t), t = Wt(e, l, r), t !== null && (wt(t, e, r, n), al(t, e, r));
  } };
  function Yu(e, t, n, r, l, i, o) {
    return e = e.stateNode, typeof e.shouldComponentUpdate == "function" ? e.shouldComponentUpdate(r, i, o) : t.prototype && t.prototype.isPureReactComponent ? !rr(n, r) || !rr(l, i) : !0;
  }
  function Gu(e, t, n) {
    var r = !1, l = Ht, i = t.contextType;
    return typeof i == "object" && i !== null ? i = ut(i) : (l = Ge(t) ? tn : Ae.current, r = t.contextTypes, i = (r = r != null) ? _n(e, l) : Ht), t = new t(n, i), e.memoizedState = t.state !== null && t.state !== void 0 ? t.state : null, t.updater = gl, e.stateNode = t, t._reactInternals = e, r && (e = e.stateNode, e.__reactInternalMemoizedUnmaskedChildContext = l, e.__reactInternalMemoizedMaskedChildContext = i), t;
  }
  function Xu(e, t, n, r) {
    e = t.state, typeof t.componentWillReceiveProps == "function" && t.componentWillReceiveProps(n, r), typeof t.UNSAFE_componentWillReceiveProps == "function" && t.UNSAFE_componentWillReceiveProps(n, r), t.state !== e && gl.enqueueReplaceState(t, t.state, null);
  }
  function lo(e, t, n, r) {
    var l = e.stateNode;
    l.props = n, l.state = e.memoizedState, l.refs = {}, Wi(e);
    var i = t.contextType;
    typeof i == "object" && i !== null ? l.context = ut(i) : (i = Ge(t) ? tn : Ae.current, l.context = _n(e, i)), l.state = e.memoizedState, i = t.getDerivedStateFromProps, typeof i == "function" && (ro(e, t, i, n), l.state = e.memoizedState), typeof t.getDerivedStateFromProps == "function" || typeof l.getSnapshotBeforeUpdate == "function" || typeof l.UNSAFE_componentWillMount != "function" && typeof l.componentWillMount != "function" || (t = l.state, typeof l.componentWillMount == "function" && l.componentWillMount(), typeof l.UNSAFE_componentWillMount == "function" && l.UNSAFE_componentWillMount(), t !== l.state && gl.enqueueReplaceState(l, l.state, null), cl(e, n, l, r), l.state = e.memoizedState), typeof l.componentDidMount == "function" && (e.flags |= 4194308);
  }
  function Mn(e, t) {
    try {
      var n = "", r = t;
      do
        n += X(r), r = r.return;
      while (r);
      var l = n;
    } catch (i) {
      l = `
Error generating stack: ` + i.message + `
` + i.stack;
    }
    return { value: e, source: t, stack: l, digest: null };
  }
  function io(e, t, n) {
    return { value: e, source: null, stack: n ?? null, digest: t ?? null };
  }
  function oo(e, t) {
    try {
      console.error(t.value);
    } catch (n) {
      setTimeout(function() {
        throw n;
      });
    }
  }
  var Pf = typeof WeakMap == "function" ? WeakMap : Map;
  function Zu(e, t, n) {
    n = Tt(-1, n), n.tag = 3, n.payload = { element: null };
    var r = t.value;
    return n.callback = function() {
      Cl || (Cl = !0, So = r), oo(e, t);
    }, n;
  }
  function Ju(e, t, n) {
    n = Tt(-1, n), n.tag = 3;
    var r = e.type.getDerivedStateFromError;
    if (typeof r == "function") {
      var l = t.value;
      n.payload = function() {
        return r(l);
      }, n.callback = function() {
        oo(e, t);
      };
    }
    var i = e.stateNode;
    return i !== null && typeof i.componentDidCatch == "function" && (n.callback = function() {
      oo(e, t), typeof r != "function" && (Kt === null ? Kt = /* @__PURE__ */ new Set([this]) : Kt.add(this));
      var o = t.stack;
      this.componentDidCatch(t.value, { componentStack: o !== null ? o : "" });
    }), n;
  }
  function qu(e, t, n) {
    var r = e.pingCache;
    if (r === null) {
      r = e.pingCache = new Pf();
      var l = /* @__PURE__ */ new Set();
      r.set(t, l);
    } else l = r.get(t), l === void 0 && (l = /* @__PURE__ */ new Set(), r.set(t, l));
    l.has(n) || (l.add(n), e = Vf.bind(null, e, t, n), t.then(e, e));
  }
  function bu(e) {
    do {
      var t;
      if ((t = e.tag === 13) && (t = e.memoizedState, t = t !== null ? t.dehydrated !== null : !0), t) return e;
      e = e.return;
    } while (e !== null);
    return null;
  }
  function ea(e, t, n, r, l) {
    return (e.mode & 1) === 0 ? (e === t ? e.flags |= 65536 : (e.flags |= 128, n.flags |= 131072, n.flags &= -52805, n.tag === 1 && (n.alternate === null ? n.tag = 17 : (t = Tt(-1, 1), t.tag = 2, Wt(n, t, 1))), n.lanes |= 1), e) : (e.flags |= 65536, e.lanes = l, e);
  }
  var zf = Q.ReactCurrentOwner, Xe = !1;
  function Be(e, t, n, r) {
    t.child = e === null ? xu(t, null, n, r) : zn(t, e.child, n, r);
  }
  function ta(e, t, n, r, l) {
    n = n.render;
    var i = t.ref;
    return Rn(t, l), r = Ji(e, t, n, r, i, l), n = qi(), e !== null && !Xe ? (t.updateQueue = e.updateQueue, t.flags &= -2053, e.lanes &= ~l, Rt(e, t, l)) : (ge && n && Ii(t), t.flags |= 1, Be(e, t, r, l), t.child);
  }
  function na(e, t, n, r, l) {
    if (e === null) {
      var i = n.type;
      return typeof i == "function" && !zo(i) && i.defaultProps === void 0 && n.compare === null && n.defaultProps === void 0 ? (t.tag = 15, t.type = i, ra(e, t, i, r, l)) : (e = Tl(n.type, null, r, t, t.mode, l), e.ref = t.ref, e.return = t, t.child = e);
    }
    if (i = e.child, (e.lanes & l) === 0) {
      var o = i.memoizedProps;
      if (n = n.compare, n = n !== null ? n : rr, n(o, r) && e.ref === t.ref) return Rt(e, t, l);
    }
    return t.flags |= 1, e = Zt(i, r), e.ref = t.ref, e.return = t, t.child = e;
  }
  function ra(e, t, n, r, l) {
    if (e !== null) {
      var i = e.memoizedProps;
      if (rr(i, r) && e.ref === t.ref) if (Xe = !1, t.pendingProps = r = i, (e.lanes & l) !== 0) (e.flags & 131072) !== 0 && (Xe = !0);
      else return t.lanes = e.lanes, Rt(e, t, l);
    }
    return so(e, t, n, r, l);
  }
  function la(e, t, n) {
    var r = t.pendingProps, l = r.children, i = e !== null ? e.memoizedState : null;
    if (r.mode === "hidden") if ((t.mode & 1) === 0) t.memoizedState = { baseLanes: 0, cachePool: null, transitions: null }, de(Dn, rt), rt |= n;
    else {
      if ((n & 1073741824) === 0) return e = i !== null ? i.baseLanes | n : n, t.lanes = t.childLanes = 1073741824, t.memoizedState = { baseLanes: e, cachePool: null, transitions: null }, t.updateQueue = null, de(Dn, rt), rt |= e, null;
      t.memoizedState = { baseLanes: 0, cachePool: null, transitions: null }, r = i !== null ? i.baseLanes : n, de(Dn, rt), rt |= r;
    }
    else i !== null ? (r = i.baseLanes | n, t.memoizedState = null) : r = n, de(Dn, rt), rt |= r;
    return Be(e, t, l, n), t.child;
  }
  function ia(e, t) {
    var n = t.ref;
    (e === null && n !== null || e !== null && e.ref !== n) && (t.flags |= 512, t.flags |= 2097152);
  }
  function so(e, t, n, r, l) {
    var i = Ge(n) ? tn : Ae.current;
    return i = _n(t, i), Rn(t, l), n = Ji(e, t, n, r, i, l), r = qi(), e !== null && !Xe ? (t.updateQueue = e.updateQueue, t.flags &= -2053, e.lanes &= ~l, Rt(e, t, l)) : (ge && r && Ii(t), t.flags |= 1, Be(e, t, n, l), t.child);
  }
  function oa(e, t, n, r, l) {
    if (Ge(n)) {
      var i = !0;
      tl(t);
    } else i = !1;
    if (Rn(t, l), t.stateNode === null) wl(e, t), Gu(t, n, r), lo(t, n, r, l), r = !0;
    else if (e === null) {
      var o = t.stateNode, s = t.memoizedProps;
      o.props = s;
      var f = o.context, y = n.contextType;
      typeof y == "object" && y !== null ? y = ut(y) : (y = Ge(n) ? tn : Ae.current, y = _n(t, y));
      var E = n.getDerivedStateFromProps, C = typeof E == "function" || typeof o.getSnapshotBeforeUpdate == "function";
      C || typeof o.UNSAFE_componentWillReceiveProps != "function" && typeof o.componentWillReceiveProps != "function" || (s !== r || f !== y) && Xu(t, o, r, y), Bt = !1;
      var S = t.memoizedState;
      o.state = S, cl(t, r, o, l), f = t.memoizedState, s !== r || S !== f || Ye.current || Bt ? (typeof E == "function" && (ro(t, n, E, r), f = t.memoizedState), (s = Bt || Yu(t, n, s, r, S, f, y)) ? (C || typeof o.UNSAFE_componentWillMount != "function" && typeof o.componentWillMount != "function" || (typeof o.componentWillMount == "function" && o.componentWillMount(), typeof o.UNSAFE_componentWillMount == "function" && o.UNSAFE_componentWillMount()), typeof o.componentDidMount == "function" && (t.flags |= 4194308)) : (typeof o.componentDidMount == "function" && (t.flags |= 4194308), t.memoizedProps = r, t.memoizedState = f), o.props = r, o.state = f, o.context = y, r = s) : (typeof o.componentDidMount == "function" && (t.flags |= 4194308), r = !1);
    } else {
      o = t.stateNode, Su(e, t), s = t.memoizedProps, y = t.type === t.elementType ? s : vt(t.type, s), o.props = y, C = t.pendingProps, S = o.context, f = n.contextType, typeof f == "object" && f !== null ? f = ut(f) : (f = Ge(n) ? tn : Ae.current, f = _n(t, f));
      var L = n.getDerivedStateFromProps;
      (E = typeof L == "function" || typeof o.getSnapshotBeforeUpdate == "function") || typeof o.UNSAFE_componentWillReceiveProps != "function" && typeof o.componentWillReceiveProps != "function" || (s !== C || S !== f) && Xu(t, o, r, f), Bt = !1, S = t.memoizedState, o.state = S, cl(t, r, o, l);
      var O = t.memoizedState;
      s !== C || S !== O || Ye.current || Bt ? (typeof L == "function" && (ro(t, n, L, r), O = t.memoizedState), (y = Bt || Yu(t, n, y, r, S, O, f) || !1) ? (E || typeof o.UNSAFE_componentWillUpdate != "function" && typeof o.componentWillUpdate != "function" || (typeof o.componentWillUpdate == "function" && o.componentWillUpdate(r, O, f), typeof o.UNSAFE_componentWillUpdate == "function" && o.UNSAFE_componentWillUpdate(r, O, f)), typeof o.componentDidUpdate == "function" && (t.flags |= 4), typeof o.getSnapshotBeforeUpdate == "function" && (t.flags |= 1024)) : (typeof o.componentDidUpdate != "function" || s === e.memoizedProps && S === e.memoizedState || (t.flags |= 4), typeof o.getSnapshotBeforeUpdate != "function" || s === e.memoizedProps && S === e.memoizedState || (t.flags |= 1024), t.memoizedProps = r, t.memoizedState = O), o.props = r, o.state = O, o.context = f, r = y) : (typeof o.componentDidUpdate != "function" || s === e.memoizedProps && S === e.memoizedState || (t.flags |= 4), typeof o.getSnapshotBeforeUpdate != "function" || s === e.memoizedProps && S === e.memoizedState || (t.flags |= 1024), r = !1);
    }
    return uo(e, t, n, r, i, l);
  }
  function uo(e, t, n, r, l, i) {
    ia(e, t);
    var o = (t.flags & 128) !== 0;
    if (!r && !o) return l && fu(t, n, !1), Rt(e, t, i);
    r = t.stateNode, zf.current = t;
    var s = o && typeof n.getDerivedStateFromError != "function" ? null : r.render();
    return t.flags |= 1, e !== null && o ? (t.child = zn(t, e.child, null, i), t.child = zn(t, null, s, i)) : Be(e, t, s, i), t.memoizedState = r.state, l && fu(t, n, !0), t.child;
  }
  function sa(e) {
    var t = e.stateNode;
    t.pendingContext ? au(e, t.pendingContext, t.pendingContext !== t.context) : t.context && au(e, t.context, !1), Qi(e, t.containerInfo);
  }
  function ua(e, t, n, r, l) {
    return Pn(), Ai(l), t.flags |= 256, Be(e, t, n, r), t.child;
  }
  var ao = { dehydrated: null, treeContext: null, retryLane: 0 };
  function co(e) {
    return { baseLanes: e, cachePool: null, transitions: null };
  }
  function aa(e, t, n) {
    var r = t.pendingProps, l = ye.current, i = !1, o = (t.flags & 128) !== 0, s;
    if ((s = o) || (s = e !== null && e.memoizedState === null ? !1 : (l & 2) !== 0), s ? (i = !0, t.flags &= -129) : (e === null || e.memoizedState !== null) && (l |= 1), de(ye, l & 1), e === null)
      return Oi(t), e = t.memoizedState, e !== null && (e = e.dehydrated, e !== null) ? ((t.mode & 1) === 0 ? t.lanes = 1 : e.data === "$!" ? t.lanes = 8 : t.lanes = 1073741824, null) : (o = r.children, e = r.fallback, i ? (r = t.mode, i = t.child, o = { mode: "hidden", children: o }, (r & 1) === 0 && i !== null ? (i.childLanes = 0, i.pendingProps = o) : i = Rl(o, r, 0, null), e = dn(e, r, n, null), i.return = t, e.return = t, i.sibling = e, t.child = i, t.child.memoizedState = co(n), t.memoizedState = ao, e) : fo(t, o));
    if (l = e.memoizedState, l !== null && (s = l.dehydrated, s !== null)) return Tf(e, t, o, r, s, l, n);
    if (i) {
      i = r.fallback, o = t.mode, l = e.child, s = l.sibling;
      var f = { mode: "hidden", children: r.children };
      return (o & 1) === 0 && t.child !== l ? (r = t.child, r.childLanes = 0, r.pendingProps = f, t.deletions = null) : (r = Zt(l, f), r.subtreeFlags = l.subtreeFlags & 14680064), s !== null ? i = Zt(s, i) : (i = dn(i, o, n, null), i.flags |= 2), i.return = t, r.return = t, r.sibling = i, t.child = r, r = i, i = t.child, o = e.child.memoizedState, o = o === null ? co(n) : { baseLanes: o.baseLanes | n, cachePool: null, transitions: o.transitions }, i.memoizedState = o, i.childLanes = e.childLanes & ~n, t.memoizedState = ao, r;
    }
    return i = e.child, e = i.sibling, r = Zt(i, { mode: "visible", children: r.children }), (t.mode & 1) === 0 && (r.lanes = n), r.return = t, r.sibling = null, e !== null && (n = t.deletions, n === null ? (t.deletions = [e], t.flags |= 16) : n.push(e)), t.child = r, t.memoizedState = null, r;
  }
  function fo(e, t) {
    return t = Rl({ mode: "visible", children: t }, e.mode, 0, null), t.return = e, e.child = t;
  }
  function yl(e, t, n, r) {
    return r !== null && Ai(r), zn(t, e.child, null, n), e = fo(t, t.pendingProps.children), e.flags |= 2, t.memoizedState = null, e;
  }
  function Tf(e, t, n, r, l, i, o) {
    if (n)
      return t.flags & 256 ? (t.flags &= -257, r = io(Error(u(422))), yl(e, t, o, r)) : t.memoizedState !== null ? (t.child = e.child, t.flags |= 128, null) : (i = r.fallback, l = t.mode, r = Rl({ mode: "visible", children: r.children }, l, 0, null), i = dn(i, l, o, null), i.flags |= 2, r.return = t, i.return = t, r.sibling = i, t.child = r, (t.mode & 1) !== 0 && zn(t, e.child, null, o), t.child.memoizedState = co(o), t.memoizedState = ao, i);
    if ((t.mode & 1) === 0) return yl(e, t, o, null);
    if (l.data === "$!") {
      if (r = l.nextSibling && l.nextSibling.dataset, r) var s = r.dgst;
      return r = s, i = Error(u(419)), r = io(i, r, void 0), yl(e, t, o, r);
    }
    if (s = (o & e.childLanes) !== 0, Xe || s) {
      if (r = Re, r !== null) {
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
        l = (l & (r.suspendedLanes | o)) !== 0 ? 0 : l, l !== 0 && l !== i.retryLane && (i.retryLane = l, zt(e, l), wt(r, e, l, -1));
      }
      return Po(), r = io(Error(u(421))), yl(e, t, o, r);
    }
    return l.data === "$?" ? (t.flags |= 128, t.child = e.child, t = Bf.bind(null, e), l._reactRetry = t, null) : (e = i.treeContext, nt = Ut(l.nextSibling), tt = t, ge = !0, mt = null, e !== null && (ot[st++] = jt, ot[st++] = Pt, ot[st++] = nn, jt = e.id, Pt = e.overflow, nn = t), t = fo(t, r.children), t.flags |= 4096, t);
  }
  function ca(e, t, n) {
    e.lanes |= t;
    var r = e.alternate;
    r !== null && (r.lanes |= t), Vi(e.return, t, n);
  }
  function po(e, t, n, r, l) {
    var i = e.memoizedState;
    i === null ? e.memoizedState = { isBackwards: t, rendering: null, renderingStartTime: 0, last: r, tail: n, tailMode: l } : (i.isBackwards = t, i.rendering = null, i.renderingStartTime = 0, i.last = r, i.tail = n, i.tailMode = l);
  }
  function fa(e, t, n) {
    var r = t.pendingProps, l = r.revealOrder, i = r.tail;
    if (Be(e, t, r.children, n), r = ye.current, (r & 2) !== 0) r = r & 1 | 2, t.flags |= 128;
    else {
      if (e !== null && (e.flags & 128) !== 0) e: for (e = t.child; e !== null; ) {
        if (e.tag === 13) e.memoizedState !== null && ca(e, n, t);
        else if (e.tag === 19) ca(e, n, t);
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
    if (de(ye, r), (t.mode & 1) === 0) t.memoizedState = null;
    else switch (l) {
      case "forwards":
        for (n = t.child, l = null; n !== null; ) e = n.alternate, e !== null && fl(e) === null && (l = n), n = n.sibling;
        n = l, n === null ? (l = t.child, t.child = null) : (l = n.sibling, n.sibling = null), po(t, !1, l, n, i);
        break;
      case "backwards":
        for (n = null, l = t.child, t.child = null; l !== null; ) {
          if (e = l.alternate, e !== null && fl(e) === null) {
            t.child = l;
            break;
          }
          e = l.sibling, l.sibling = n, n = l, l = e;
        }
        po(t, !0, n, null, i);
        break;
      case "together":
        po(t, !1, null, null, void 0);
        break;
      default:
        t.memoizedState = null;
    }
    return t.child;
  }
  function wl(e, t) {
    (t.mode & 1) === 0 && e !== null && (e.alternate = null, t.alternate = null, t.flags |= 2);
  }
  function Rt(e, t, n) {
    if (e !== null && (t.dependencies = e.dependencies), un |= t.lanes, (n & t.childLanes) === 0) return null;
    if (e !== null && t.child !== e.child) throw Error(u(153));
    if (t.child !== null) {
      for (e = t.child, n = Zt(e, e.pendingProps), t.child = n, n.return = t; e.sibling !== null; ) e = e.sibling, n = n.sibling = Zt(e, e.pendingProps), n.return = t;
      n.sibling = null;
    }
    return t.child;
  }
  function Rf(e, t, n) {
    switch (t.tag) {
      case 3:
        sa(t), Pn();
        break;
      case 5:
        _u(t);
        break;
      case 1:
        Ge(t.type) && tl(t);
        break;
      case 4:
        Qi(t, t.stateNode.containerInfo);
        break;
      case 10:
        var r = t.type._context, l = t.memoizedProps.value;
        de(sl, r._currentValue), r._currentValue = l;
        break;
      case 13:
        if (r = t.memoizedState, r !== null)
          return r.dehydrated !== null ? (de(ye, ye.current & 1), t.flags |= 128, null) : (n & t.child.childLanes) !== 0 ? aa(e, t, n) : (de(ye, ye.current & 1), e = Rt(e, t, n), e !== null ? e.sibling : null);
        de(ye, ye.current & 1);
        break;
      case 19:
        if (r = (n & t.childLanes) !== 0, (e.flags & 128) !== 0) {
          if (r) return fa(e, t, n);
          t.flags |= 128;
        }
        if (l = t.memoizedState, l !== null && (l.rendering = null, l.tail = null, l.lastEffect = null), de(ye, ye.current), r) break;
        return null;
      case 22:
      case 23:
        return t.lanes = 0, la(e, t, n);
    }
    return Rt(e, t, n);
  }
  var da, ho, pa, ha;
  da = function(e, t) {
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
  }, ho = function() {
  }, pa = function(e, t, n, r) {
    var l = e.memoizedProps;
    if (l !== r) {
      e = t.stateNode, on(St.current);
      var i = null;
      switch (n) {
        case "input":
          l = Vl(e, l), r = Vl(e, r), i = [];
          break;
        case "select":
          l = k({}, l, { value: void 0 }), r = k({}, r, { value: void 0 }), i = [];
          break;
        case "textarea":
          l = Ql(e, l), r = Ql(e, r), i = [];
          break;
        default:
          typeof l.onClick != "function" && typeof r.onClick == "function" && (e.onclick = qr);
      }
      Yl(n, r);
      var o;
      n = null;
      for (y in l) if (!r.hasOwnProperty(y) && l.hasOwnProperty(y) && l[y] != null) if (y === "style") {
        var s = l[y];
        for (o in s) s.hasOwnProperty(o) && (n || (n = {}), n[o] = "");
      } else y !== "dangerouslySetInnerHTML" && y !== "children" && y !== "suppressContentEditableWarning" && y !== "suppressHydrationWarning" && y !== "autoFocus" && (j.hasOwnProperty(y) ? i || (i = []) : (i = i || []).push(y, null));
      for (y in r) {
        var f = r[y];
        if (s = l != null ? l[y] : void 0, r.hasOwnProperty(y) && f !== s && (f != null || s != null)) if (y === "style") if (s) {
          for (o in s) !s.hasOwnProperty(o) || f && f.hasOwnProperty(o) || (n || (n = {}), n[o] = "");
          for (o in f) f.hasOwnProperty(o) && s[o] !== f[o] && (n || (n = {}), n[o] = f[o]);
        } else n || (i || (i = []), i.push(
          y,
          n
        )), n = f;
        else y === "dangerouslySetInnerHTML" ? (f = f ? f.__html : void 0, s = s ? s.__html : void 0, f != null && s !== f && (i = i || []).push(y, f)) : y === "children" ? typeof f != "string" && typeof f != "number" || (i = i || []).push(y, "" + f) : y !== "suppressContentEditableWarning" && y !== "suppressHydrationWarning" && (j.hasOwnProperty(y) ? (f != null && y === "onScroll" && pe("scroll", e), i || s === f || (i = [])) : (i = i || []).push(y, f));
      }
      n && (i = i || []).push("style", n);
      var y = i;
      (t.updateQueue = y) && (t.flags |= 4);
    }
  }, ha = function(e, t, n, r) {
    n !== r && (t.flags |= 4);
  };
  function yr(e, t) {
    if (!ge) switch (e.tailMode) {
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
  function $e(e) {
    var t = e.alternate !== null && e.alternate.child === e.child, n = 0, r = 0;
    if (t) for (var l = e.child; l !== null; ) n |= l.lanes | l.childLanes, r |= l.subtreeFlags & 14680064, r |= l.flags & 14680064, l.return = e, l = l.sibling;
    else for (l = e.child; l !== null; ) n |= l.lanes | l.childLanes, r |= l.subtreeFlags, r |= l.flags, l.return = e, l = l.sibling;
    return e.subtreeFlags |= r, e.childLanes = n, t;
  }
  function Lf(e, t, n) {
    var r = t.pendingProps;
    switch (Di(t), t.tag) {
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
        return $e(t), null;
      case 1:
        return Ge(t.type) && el(), $e(t), null;
      case 3:
        return r = t.stateNode, Ln(), he(Ye), he(Ae), Gi(), r.pendingContext && (r.context = r.pendingContext, r.pendingContext = null), (e === null || e.child === null) && (il(t) ? t.flags |= 4 : e === null || e.memoizedState.isDehydrated && (t.flags & 256) === 0 || (t.flags |= 1024, mt !== null && (_o(mt), mt = null))), ho(e, t), $e(t), null;
      case 5:
        Ki(t);
        var l = on(pr.current);
        if (n = t.type, e !== null && t.stateNode != null) pa(e, t, n, r, l), e.ref !== t.ref && (t.flags |= 512, t.flags |= 2097152);
        else {
          if (!r) {
            if (t.stateNode === null) throw Error(u(166));
            return $e(t), null;
          }
          if (e = on(St.current), il(t)) {
            r = t.stateNode, n = t.type;
            var i = t.memoizedProps;
            switch (r[kt] = t, r[ur] = i, e = (t.mode & 1) !== 0, n) {
              case "dialog":
                pe("cancel", r), pe("close", r);
                break;
              case "iframe":
              case "object":
              case "embed":
                pe("load", r);
                break;
              case "video":
              case "audio":
                for (l = 0; l < ir.length; l++) pe(ir[l], r);
                break;
              case "source":
                pe("error", r);
                break;
              case "img":
              case "image":
              case "link":
                pe(
                  "error",
                  r
                ), pe("load", r);
                break;
              case "details":
                pe("toggle", r);
                break;
              case "input":
                Go(r, i), pe("invalid", r);
                break;
              case "select":
                r._wrapperState = { wasMultiple: !!i.multiple }, pe("invalid", r);
                break;
              case "textarea":
                Jo(r, i), pe("invalid", r);
            }
            Yl(n, i), l = null;
            for (var o in i) if (i.hasOwnProperty(o)) {
              var s = i[o];
              o === "children" ? typeof s == "string" ? r.textContent !== s && (i.suppressHydrationWarning !== !0 && Jr(r.textContent, s, e), l = ["children", s]) : typeof s == "number" && r.textContent !== "" + s && (i.suppressHydrationWarning !== !0 && Jr(
                r.textContent,
                s,
                e
              ), l = ["children", "" + s]) : j.hasOwnProperty(o) && s != null && o === "onScroll" && pe("scroll", r);
            }
            switch (n) {
              case "input":
                dt(r), Zo(r, i, !0);
                break;
              case "textarea":
                dt(r), bo(r);
                break;
              case "select":
              case "option":
                break;
              default:
                typeof i.onClick == "function" && (r.onclick = qr);
            }
            r = l, t.updateQueue = r, r !== null && (t.flags |= 4);
          } else {
            o = l.nodeType === 9 ? l : l.ownerDocument, e === "http://www.w3.org/1999/xhtml" && (e = es(n)), e === "http://www.w3.org/1999/xhtml" ? n === "script" ? (e = o.createElement("div"), e.innerHTML = "<script><\/script>", e = e.removeChild(e.firstChild)) : typeof r.is == "string" ? e = o.createElement(n, { is: r.is }) : (e = o.createElement(n), n === "select" && (o = e, r.multiple ? o.multiple = !0 : r.size && (o.size = r.size))) : e = o.createElementNS(e, n), e[kt] = t, e[ur] = r, da(e, t, !1, !1), t.stateNode = e;
            e: {
              switch (o = Gl(n, r), n) {
                case "dialog":
                  pe("cancel", e), pe("close", e), l = r;
                  break;
                case "iframe":
                case "object":
                case "embed":
                  pe("load", e), l = r;
                  break;
                case "video":
                case "audio":
                  for (l = 0; l < ir.length; l++) pe(ir[l], e);
                  l = r;
                  break;
                case "source":
                  pe("error", e), l = r;
                  break;
                case "img":
                case "image":
                case "link":
                  pe(
                    "error",
                    e
                  ), pe("load", e), l = r;
                  break;
                case "details":
                  pe("toggle", e), l = r;
                  break;
                case "input":
                  Go(e, r), l = Vl(e, r), pe("invalid", e);
                  break;
                case "option":
                  l = r;
                  break;
                case "select":
                  e._wrapperState = { wasMultiple: !!r.multiple }, l = k({}, r, { value: void 0 }), pe("invalid", e);
                  break;
                case "textarea":
                  Jo(e, r), l = Ql(e, r), pe("invalid", e);
                  break;
                default:
                  l = r;
              }
              Yl(n, l), s = l;
              for (i in s) if (s.hasOwnProperty(i)) {
                var f = s[i];
                i === "style" ? rs(e, f) : i === "dangerouslySetInnerHTML" ? (f = f ? f.__html : void 0, f != null && ts(e, f)) : i === "children" ? typeof f == "string" ? (n !== "textarea" || f !== "") && $n(e, f) : typeof f == "number" && $n(e, "" + f) : i !== "suppressContentEditableWarning" && i !== "suppressHydrationWarning" && i !== "autoFocus" && (j.hasOwnProperty(i) ? f != null && i === "onScroll" && pe("scroll", e) : f != null && F(e, i, f, o));
              }
              switch (n) {
                case "input":
                  dt(e), Zo(e, r, !1);
                  break;
                case "textarea":
                  dt(e), bo(e);
                  break;
                case "option":
                  r.value != null && e.setAttribute("value", "" + K(r.value));
                  break;
                case "select":
                  e.multiple = !!r.multiple, i = r.value, i != null ? pn(e, !!r.multiple, i, !1) : r.defaultValue != null && pn(
                    e,
                    !!r.multiple,
                    r.defaultValue,
                    !0
                  );
                  break;
                default:
                  typeof l.onClick == "function" && (e.onclick = qr);
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
        return $e(t), null;
      case 6:
        if (e && t.stateNode != null) ha(e, t, e.memoizedProps, r);
        else {
          if (typeof r != "string" && t.stateNode === null) throw Error(u(166));
          if (n = on(pr.current), on(St.current), il(t)) {
            if (r = t.stateNode, n = t.memoizedProps, r[kt] = t, (i = r.nodeValue !== n) && (e = tt, e !== null)) switch (e.tag) {
              case 3:
                Jr(r.nodeValue, n, (e.mode & 1) !== 0);
                break;
              case 5:
                e.memoizedProps.suppressHydrationWarning !== !0 && Jr(r.nodeValue, n, (e.mode & 1) !== 0);
            }
            i && (t.flags |= 4);
          } else r = (n.nodeType === 9 ? n : n.ownerDocument).createTextNode(r), r[kt] = t, t.stateNode = r;
        }
        return $e(t), null;
      case 13:
        if (he(ye), r = t.memoizedState, e === null || e.memoizedState !== null && e.memoizedState.dehydrated !== null) {
          if (ge && nt !== null && (t.mode & 1) !== 0 && (t.flags & 128) === 0) gu(), Pn(), t.flags |= 98560, i = !1;
          else if (i = il(t), r !== null && r.dehydrated !== null) {
            if (e === null) {
              if (!i) throw Error(u(318));
              if (i = t.memoizedState, i = i !== null ? i.dehydrated : null, !i) throw Error(u(317));
              i[kt] = t;
            } else Pn(), (t.flags & 128) === 0 && (t.memoizedState = null), t.flags |= 4;
            $e(t), i = !1;
          } else mt !== null && (_o(mt), mt = null), i = !0;
          if (!i) return t.flags & 65536 ? t : null;
        }
        return (t.flags & 128) !== 0 ? (t.lanes = n, t) : (r = r !== null, r !== (e !== null && e.memoizedState !== null) && r && (t.child.flags |= 8192, (t.mode & 1) !== 0 && (e === null || (ye.current & 1) !== 0 ? Pe === 0 && (Pe = 3) : Po())), t.updateQueue !== null && (t.flags |= 4), $e(t), null);
      case 4:
        return Ln(), ho(e, t), e === null && or(t.stateNode.containerInfo), $e(t), null;
      case 10:
        return Hi(t.type._context), $e(t), null;
      case 17:
        return Ge(t.type) && el(), $e(t), null;
      case 19:
        if (he(ye), i = t.memoizedState, i === null) return $e(t), null;
        if (r = (t.flags & 128) !== 0, o = i.rendering, o === null) if (r) yr(i, !1);
        else {
          if (Pe !== 0 || e !== null && (e.flags & 128) !== 0) for (e = t.child; e !== null; ) {
            if (o = fl(e), o !== null) {
              for (t.flags |= 128, yr(i, !1), r = o.updateQueue, r !== null && (t.updateQueue = r, t.flags |= 4), t.subtreeFlags = 0, r = n, n = t.child; n !== null; ) i = n, e = r, i.flags &= 14680066, o = i.alternate, o === null ? (i.childLanes = 0, i.lanes = e, i.child = null, i.subtreeFlags = 0, i.memoizedProps = null, i.memoizedState = null, i.updateQueue = null, i.dependencies = null, i.stateNode = null) : (i.childLanes = o.childLanes, i.lanes = o.lanes, i.child = o.child, i.subtreeFlags = 0, i.deletions = null, i.memoizedProps = o.memoizedProps, i.memoizedState = o.memoizedState, i.updateQueue = o.updateQueue, i.type = o.type, e = o.dependencies, i.dependencies = e === null ? null : { lanes: e.lanes, firstContext: e.firstContext }), n = n.sibling;
              return de(ye, ye.current & 1 | 2), t.child;
            }
            e = e.sibling;
          }
          i.tail !== null && Se() > Fn && (t.flags |= 128, r = !0, yr(i, !1), t.lanes = 4194304);
        }
        else {
          if (!r) if (e = fl(o), e !== null) {
            if (t.flags |= 128, r = !0, n = e.updateQueue, n !== null && (t.updateQueue = n, t.flags |= 4), yr(i, !0), i.tail === null && i.tailMode === "hidden" && !o.alternate && !ge) return $e(t), null;
          } else 2 * Se() - i.renderingStartTime > Fn && n !== 1073741824 && (t.flags |= 128, r = !0, yr(i, !1), t.lanes = 4194304);
          i.isBackwards ? (o.sibling = t.child, t.child = o) : (n = i.last, n !== null ? n.sibling = o : t.child = o, i.last = o);
        }
        return i.tail !== null ? (t = i.tail, i.rendering = t, i.tail = t.sibling, i.renderingStartTime = Se(), t.sibling = null, n = ye.current, de(ye, r ? n & 1 | 2 : n & 1), t) : ($e(t), null);
      case 22:
      case 23:
        return jo(), r = t.memoizedState !== null, e !== null && e.memoizedState !== null !== r && (t.flags |= 8192), r && (t.mode & 1) !== 0 ? (rt & 1073741824) !== 0 && ($e(t), t.subtreeFlags & 6 && (t.flags |= 8192)) : $e(t), null;
      case 24:
        return null;
      case 25:
        return null;
    }
    throw Error(u(156, t.tag));
  }
  function Mf(e, t) {
    switch (Di(t), t.tag) {
      case 1:
        return Ge(t.type) && el(), e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
      case 3:
        return Ln(), he(Ye), he(Ae), Gi(), e = t.flags, (e & 65536) !== 0 && (e & 128) === 0 ? (t.flags = e & -65537 | 128, t) : null;
      case 5:
        return Ki(t), null;
      case 13:
        if (he(ye), e = t.memoizedState, e !== null && e.dehydrated !== null) {
          if (t.alternate === null) throw Error(u(340));
          Pn();
        }
        return e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
      case 19:
        return he(ye), null;
      case 4:
        return Ln(), null;
      case 10:
        return Hi(t.type._context), null;
      case 22:
      case 23:
        return jo(), null;
      case 24:
        return null;
      default:
        return null;
    }
  }
  var xl = !1, He = !1, If = typeof WeakSet == "function" ? WeakSet : Set, D = null;
  function In(e, t) {
    var n = e.ref;
    if (n !== null) if (typeof n == "function") try {
      n(null);
    } catch (r) {
      ke(e, t, r);
    }
    else n.current = null;
  }
  function mo(e, t, n) {
    try {
      n();
    } catch (r) {
      ke(e, t, r);
    }
  }
  var ma = !1;
  function Df(e, t) {
    if (Ni = $r, e = Ys(), yi(e)) {
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
          var o = 0, s = -1, f = -1, y = 0, E = 0, C = e, S = null;
          t: for (; ; ) {
            for (var L; C !== n || l !== 0 && C.nodeType !== 3 || (s = o + l), C !== i || r !== 0 && C.nodeType !== 3 || (f = o + r), C.nodeType === 3 && (o += C.nodeValue.length), (L = C.firstChild) !== null; )
              S = C, C = L;
            for (; ; ) {
              if (C === e) break t;
              if (S === n && ++y === l && (s = o), S === i && ++E === r && (f = o), (L = C.nextSibling) !== null) break;
              C = S, S = C.parentNode;
            }
            C = L;
          }
          n = s === -1 || f === -1 ? null : { start: s, end: f };
        } else n = null;
      }
      n = n || { start: 0, end: 0 };
    } else n = null;
    for (ji = { focusedElem: e, selectionRange: n }, $r = !1, D = t; D !== null; ) if (t = D, e = t.child, (t.subtreeFlags & 1028) !== 0 && e !== null) e.return = t, D = e;
    else for (; D !== null; ) {
      t = D;
      try {
        var O = t.alternate;
        if ((t.flags & 1024) !== 0) switch (t.tag) {
          case 0:
          case 11:
          case 15:
            break;
          case 1:
            if (O !== null) {
              var A = O.memoizedProps, Ee = O.memoizedState, m = t.stateNode, p = m.getSnapshotBeforeUpdate(t.elementType === t.type ? A : vt(t.type, A), Ee);
              m.__reactInternalSnapshotBeforeUpdate = p;
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
            throw Error(u(163));
        }
      } catch (N) {
        ke(t, t.return, N);
      }
      if (e = t.sibling, e !== null) {
        e.return = t.return, D = e;
        break;
      }
      D = t.return;
    }
    return O = ma, ma = !1, O;
  }
  function wr(e, t, n) {
    var r = t.updateQueue;
    if (r = r !== null ? r.lastEffect : null, r !== null) {
      var l = r = r.next;
      do {
        if ((l.tag & e) === e) {
          var i = l.destroy;
          l.destroy = void 0, i !== void 0 && mo(t, n, i);
        }
        l = l.next;
      } while (l !== r);
    }
  }
  function kl(e, t) {
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
  function vo(e) {
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
  function va(e) {
    var t = e.alternate;
    t !== null && (e.alternate = null, va(t)), e.child = null, e.deletions = null, e.sibling = null, e.tag === 5 && (t = e.stateNode, t !== null && (delete t[kt], delete t[ur], delete t[Ri], delete t[gf], delete t[yf])), e.stateNode = null, e.return = null, e.dependencies = null, e.memoizedProps = null, e.memoizedState = null, e.pendingProps = null, e.stateNode = null, e.updateQueue = null;
  }
  function ga(e) {
    return e.tag === 5 || e.tag === 3 || e.tag === 4;
  }
  function ya(e) {
    e: for (; ; ) {
      for (; e.sibling === null; ) {
        if (e.return === null || ga(e.return)) return null;
        e = e.return;
      }
      for (e.sibling.return = e.return, e = e.sibling; e.tag !== 5 && e.tag !== 6 && e.tag !== 18; ) {
        if (e.flags & 2 || e.child === null || e.tag === 4) continue e;
        e.child.return = e, e = e.child;
      }
      if (!(e.flags & 2)) return e.stateNode;
    }
  }
  function go(e, t, n) {
    var r = e.tag;
    if (r === 5 || r === 6) e = e.stateNode, t ? n.nodeType === 8 ? n.parentNode.insertBefore(e, t) : n.insertBefore(e, t) : (n.nodeType === 8 ? (t = n.parentNode, t.insertBefore(e, n)) : (t = n, t.appendChild(e)), n = n._reactRootContainer, n != null || t.onclick !== null || (t.onclick = qr));
    else if (r !== 4 && (e = e.child, e !== null)) for (go(e, t, n), e = e.sibling; e !== null; ) go(e, t, n), e = e.sibling;
  }
  function yo(e, t, n) {
    var r = e.tag;
    if (r === 5 || r === 6) e = e.stateNode, t ? n.insertBefore(e, t) : n.appendChild(e);
    else if (r !== 4 && (e = e.child, e !== null)) for (yo(e, t, n), e = e.sibling; e !== null; ) yo(e, t, n), e = e.sibling;
  }
  var Ie = null, gt = !1;
  function Qt(e, t, n) {
    for (n = n.child; n !== null; ) wa(e, t, n), n = n.sibling;
  }
  function wa(e, t, n) {
    if (xt && typeof xt.onCommitFiberUnmount == "function") try {
      xt.onCommitFiberUnmount(Ir, n);
    } catch {
    }
    switch (n.tag) {
      case 5:
        He || In(n, t);
      case 6:
        var r = Ie, l = gt;
        Ie = null, Qt(e, t, n), Ie = r, gt = l, Ie !== null && (gt ? (e = Ie, n = n.stateNode, e.nodeType === 8 ? e.parentNode.removeChild(n) : e.removeChild(n)) : Ie.removeChild(n.stateNode));
        break;
      case 18:
        Ie !== null && (gt ? (e = Ie, n = n.stateNode, e.nodeType === 8 ? Ti(e.parentNode, n) : e.nodeType === 1 && Ti(e, n), Jn(e)) : Ti(Ie, n.stateNode));
        break;
      case 4:
        r = Ie, l = gt, Ie = n.stateNode.containerInfo, gt = !0, Qt(e, t, n), Ie = r, gt = l;
        break;
      case 0:
      case 11:
      case 14:
      case 15:
        if (!He && (r = n.updateQueue, r !== null && (r = r.lastEffect, r !== null))) {
          l = r = r.next;
          do {
            var i = l, o = i.destroy;
            i = i.tag, o !== void 0 && ((i & 2) !== 0 || (i & 4) !== 0) && mo(n, t, o), l = l.next;
          } while (l !== r);
        }
        Qt(e, t, n);
        break;
      case 1:
        if (!He && (In(n, t), r = n.stateNode, typeof r.componentWillUnmount == "function")) try {
          r.props = n.memoizedProps, r.state = n.memoizedState, r.componentWillUnmount();
        } catch (s) {
          ke(n, t, s);
        }
        Qt(e, t, n);
        break;
      case 21:
        Qt(e, t, n);
        break;
      case 22:
        n.mode & 1 ? (He = (r = He) || n.memoizedState !== null, Qt(e, t, n), He = r) : Qt(e, t, n);
        break;
      default:
        Qt(e, t, n);
    }
  }
  function xa(e) {
    var t = e.updateQueue;
    if (t !== null) {
      e.updateQueue = null;
      var n = e.stateNode;
      n === null && (n = e.stateNode = new If()), t.forEach(function(r) {
        var l = Wf.bind(null, e, r);
        n.has(r) || (n.add(r), r.then(l, l));
      });
    }
  }
  function yt(e, t) {
    var n = t.deletions;
    if (n !== null) for (var r = 0; r < n.length; r++) {
      var l = n[r];
      try {
        var i = e, o = t, s = o;
        e: for (; s !== null; ) {
          switch (s.tag) {
            case 5:
              Ie = s.stateNode, gt = !1;
              break e;
            case 3:
              Ie = s.stateNode.containerInfo, gt = !0;
              break e;
            case 4:
              Ie = s.stateNode.containerInfo, gt = !0;
              break e;
          }
          s = s.return;
        }
        if (Ie === null) throw Error(u(160));
        wa(i, o, l), Ie = null, gt = !1;
        var f = l.alternate;
        f !== null && (f.return = null), l.return = null;
      } catch (y) {
        ke(l, t, y);
      }
    }
    if (t.subtreeFlags & 12854) for (t = t.child; t !== null; ) ka(t, e), t = t.sibling;
  }
  function ka(e, t) {
    var n = e.alternate, r = e.flags;
    switch (e.tag) {
      case 0:
      case 11:
      case 14:
      case 15:
        if (yt(t, e), Ct(e), r & 4) {
          try {
            wr(3, e, e.return), kl(3, e);
          } catch (A) {
            ke(e, e.return, A);
          }
          try {
            wr(5, e, e.return);
          } catch (A) {
            ke(e, e.return, A);
          }
        }
        break;
      case 1:
        yt(t, e), Ct(e), r & 512 && n !== null && In(n, n.return);
        break;
      case 5:
        if (yt(t, e), Ct(e), r & 512 && n !== null && In(n, n.return), e.flags & 32) {
          var l = e.stateNode;
          try {
            $n(l, "");
          } catch (A) {
            ke(e, e.return, A);
          }
        }
        if (r & 4 && (l = e.stateNode, l != null)) {
          var i = e.memoizedProps, o = n !== null ? n.memoizedProps : i, s = e.type, f = e.updateQueue;
          if (e.updateQueue = null, f !== null) try {
            s === "input" && i.type === "radio" && i.name != null && Xo(l, i), Gl(s, o);
            var y = Gl(s, i);
            for (o = 0; o < f.length; o += 2) {
              var E = f[o], C = f[o + 1];
              E === "style" ? rs(l, C) : E === "dangerouslySetInnerHTML" ? ts(l, C) : E === "children" ? $n(l, C) : F(l, E, C, y);
            }
            switch (s) {
              case "input":
                Bl(l, i);
                break;
              case "textarea":
                qo(l, i);
                break;
              case "select":
                var S = l._wrapperState.wasMultiple;
                l._wrapperState.wasMultiple = !!i.multiple;
                var L = i.value;
                L != null ? pn(l, !!i.multiple, L, !1) : S !== !!i.multiple && (i.defaultValue != null ? pn(
                  l,
                  !!i.multiple,
                  i.defaultValue,
                  !0
                ) : pn(l, !!i.multiple, i.multiple ? [] : "", !1));
            }
            l[ur] = i;
          } catch (A) {
            ke(e, e.return, A);
          }
        }
        break;
      case 6:
        if (yt(t, e), Ct(e), r & 4) {
          if (e.stateNode === null) throw Error(u(162));
          l = e.stateNode, i = e.memoizedProps;
          try {
            l.nodeValue = i;
          } catch (A) {
            ke(e, e.return, A);
          }
        }
        break;
      case 3:
        if (yt(t, e), Ct(e), r & 4 && n !== null && n.memoizedState.isDehydrated) try {
          Jn(t.containerInfo);
        } catch (A) {
          ke(e, e.return, A);
        }
        break;
      case 4:
        yt(t, e), Ct(e);
        break;
      case 13:
        yt(t, e), Ct(e), l = e.child, l.flags & 8192 && (i = l.memoizedState !== null, l.stateNode.isHidden = i, !i || l.alternate !== null && l.alternate.memoizedState !== null || (ko = Se())), r & 4 && xa(e);
        break;
      case 22:
        if (E = n !== null && n.memoizedState !== null, e.mode & 1 ? (He = (y = He) || E, yt(t, e), He = y) : yt(t, e), Ct(e), r & 8192) {
          if (y = e.memoizedState !== null, (e.stateNode.isHidden = y) && !E && (e.mode & 1) !== 0) for (D = e, E = e.child; E !== null; ) {
            for (C = D = E; D !== null; ) {
              switch (S = D, L = S.child, S.tag) {
                case 0:
                case 11:
                case 14:
                case 15:
                  wr(4, S, S.return);
                  break;
                case 1:
                  In(S, S.return);
                  var O = S.stateNode;
                  if (typeof O.componentWillUnmount == "function") {
                    r = S, n = S.return;
                    try {
                      t = r, O.props = t.memoizedProps, O.state = t.memoizedState, O.componentWillUnmount();
                    } catch (A) {
                      ke(r, n, A);
                    }
                  }
                  break;
                case 5:
                  In(S, S.return);
                  break;
                case 22:
                  if (S.memoizedState !== null) {
                    Ca(C);
                    continue;
                  }
              }
              L !== null ? (L.return = S, D = L) : Ca(C);
            }
            E = E.sibling;
          }
          e: for (E = null, C = e; ; ) {
            if (C.tag === 5) {
              if (E === null) {
                E = C;
                try {
                  l = C.stateNode, y ? (i = l.style, typeof i.setProperty == "function" ? i.setProperty("display", "none", "important") : i.display = "none") : (s = C.stateNode, f = C.memoizedProps.style, o = f != null && f.hasOwnProperty("display") ? f.display : null, s.style.display = ns("display", o));
                } catch (A) {
                  ke(e, e.return, A);
                }
              }
            } else if (C.tag === 6) {
              if (E === null) try {
                C.stateNode.nodeValue = y ? "" : C.memoizedProps;
              } catch (A) {
                ke(e, e.return, A);
              }
            } else if ((C.tag !== 22 && C.tag !== 23 || C.memoizedState === null || C === e) && C.child !== null) {
              C.child.return = C, C = C.child;
              continue;
            }
            if (C === e) break e;
            for (; C.sibling === null; ) {
              if (C.return === null || C.return === e) break e;
              E === C && (E = null), C = C.return;
            }
            E === C && (E = null), C.sibling.return = C.return, C = C.sibling;
          }
        }
        break;
      case 19:
        yt(t, e), Ct(e), r & 4 && xa(e);
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
            if (ga(n)) {
              var r = n;
              break e;
            }
            n = n.return;
          }
          throw Error(u(160));
        }
        switch (r.tag) {
          case 5:
            var l = r.stateNode;
            r.flags & 32 && ($n(l, ""), r.flags &= -33);
            var i = ya(e);
            yo(e, i, l);
            break;
          case 3:
          case 4:
            var o = r.stateNode.containerInfo, s = ya(e);
            go(e, s, o);
            break;
          default:
            throw Error(u(161));
        }
      } catch (f) {
        ke(e, e.return, f);
      }
      e.flags &= -3;
    }
    t & 4096 && (e.flags &= -4097);
  }
  function Ff(e, t, n) {
    D = e, Sa(e);
  }
  function Sa(e, t, n) {
    for (var r = (e.mode & 1) !== 0; D !== null; ) {
      var l = D, i = l.child;
      if (l.tag === 22 && r) {
        var o = l.memoizedState !== null || xl;
        if (!o) {
          var s = l.alternate, f = s !== null && s.memoizedState !== null || He;
          s = xl;
          var y = He;
          if (xl = o, (He = f) && !y) for (D = l; D !== null; ) o = D, f = o.child, o.tag === 22 && o.memoizedState !== null ? _a(l) : f !== null ? (f.return = o, D = f) : _a(l);
          for (; i !== null; ) D = i, Sa(i), i = i.sibling;
          D = l, xl = s, He = y;
        }
        Ea(e);
      } else (l.subtreeFlags & 8772) !== 0 && i !== null ? (i.return = l, D = i) : Ea(e);
    }
  }
  function Ea(e) {
    for (; D !== null; ) {
      var t = D;
      if ((t.flags & 8772) !== 0) {
        var n = t.alternate;
        try {
          if ((t.flags & 8772) !== 0) switch (t.tag) {
            case 0:
            case 11:
            case 15:
              He || kl(5, t);
              break;
            case 1:
              var r = t.stateNode;
              if (t.flags & 4 && !He) if (n === null) r.componentDidMount();
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
              var s = t.stateNode;
              if (n === null && t.flags & 4) {
                n = s;
                var f = t.memoizedProps;
                switch (t.type) {
                  case "button":
                  case "input":
                  case "select":
                  case "textarea":
                    f.autoFocus && n.focus();
                    break;
                  case "img":
                    f.src && (n.src = f.src);
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
                  var E = y.memoizedState;
                  if (E !== null) {
                    var C = E.dehydrated;
                    C !== null && Jn(C);
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
              throw Error(u(163));
          }
          He || t.flags & 512 && vo(t);
        } catch (S) {
          ke(t, t.return, S);
        }
      }
      if (t === e) {
        D = null;
        break;
      }
      if (n = t.sibling, n !== null) {
        n.return = t.return, D = n;
        break;
      }
      D = t.return;
    }
  }
  function Ca(e) {
    for (; D !== null; ) {
      var t = D;
      if (t === e) {
        D = null;
        break;
      }
      var n = t.sibling;
      if (n !== null) {
        n.return = t.return, D = n;
        break;
      }
      D = t.return;
    }
  }
  function _a(e) {
    for (; D !== null; ) {
      var t = D;
      try {
        switch (t.tag) {
          case 0:
          case 11:
          case 15:
            var n = t.return;
            try {
              kl(4, t);
            } catch (f) {
              ke(t, n, f);
            }
            break;
          case 1:
            var r = t.stateNode;
            if (typeof r.componentDidMount == "function") {
              var l = t.return;
              try {
                r.componentDidMount();
              } catch (f) {
                ke(t, l, f);
              }
            }
            var i = t.return;
            try {
              vo(t);
            } catch (f) {
              ke(t, i, f);
            }
            break;
          case 5:
            var o = t.return;
            try {
              vo(t);
            } catch (f) {
              ke(t, o, f);
            }
        }
      } catch (f) {
        ke(t, t.return, f);
      }
      if (t === e) {
        D = null;
        break;
      }
      var s = t.sibling;
      if (s !== null) {
        s.return = t.return, D = s;
        break;
      }
      D = t.return;
    }
  }
  var Of = Math.ceil, Sl = Q.ReactCurrentDispatcher, wo = Q.ReactCurrentOwner, ct = Q.ReactCurrentBatchConfig, se = 0, Re = null, _e = null, De = 0, rt = 0, Dn = $t(0), Pe = 0, xr = null, un = 0, El = 0, xo = 0, kr = null, Ze = null, ko = 0, Fn = 1 / 0, Lt = null, Cl = !1, So = null, Kt = null, _l = !1, Yt = null, Nl = 0, Sr = 0, Eo = null, jl = -1, Pl = 0;
  function We() {
    return (se & 6) !== 0 ? Se() : jl !== -1 ? jl : jl = Se();
  }
  function Gt(e) {
    return (e.mode & 1) === 0 ? 1 : (se & 2) !== 0 && De !== 0 ? De & -De : xf.transition !== null ? (Pl === 0 && (Pl = ys()), Pl) : (e = ce, e !== 0 || (e = window.event, e = e === void 0 ? 16 : js(e.type)), e);
  }
  function wt(e, t, n, r) {
    if (50 < Sr) throw Sr = 0, Eo = null, Error(u(185));
    Kn(e, n, r), ((se & 2) === 0 || e !== Re) && (e === Re && ((se & 2) === 0 && (El |= n), Pe === 4 && Xt(e, De)), Je(e, r), n === 1 && se === 0 && (t.mode & 1) === 0 && (Fn = Se() + 500, nl && Vt()));
  }
  function Je(e, t) {
    var n = e.callbackNode;
    wc(e, t);
    var r = Or(e, e === Re ? De : 0);
    if (r === 0) n !== null && ms(n), e.callbackNode = null, e.callbackPriority = 0;
    else if (t = r & -r, e.callbackPriority !== t) {
      if (n != null && ms(n), t === 1) e.tag === 0 ? wf(ja.bind(null, e)) : du(ja.bind(null, e)), mf(function() {
        (se & 6) === 0 && Vt();
      }), n = null;
      else {
        switch (ws(r)) {
          case 1:
            n = ti;
            break;
          case 4:
            n = vs;
            break;
          case 16:
            n = Mr;
            break;
          case 536870912:
            n = gs;
            break;
          default:
            n = Mr;
        }
        n = Da(n, Na.bind(null, e));
      }
      e.callbackPriority = t, e.callbackNode = n;
    }
  }
  function Na(e, t) {
    if (jl = -1, Pl = 0, (se & 6) !== 0) throw Error(u(327));
    var n = e.callbackNode;
    if (On() && e.callbackNode !== n) return null;
    var r = Or(e, e === Re ? De : 0);
    if (r === 0) return null;
    if ((r & 30) !== 0 || (r & e.expiredLanes) !== 0 || t) t = zl(e, r);
    else {
      t = r;
      var l = se;
      se |= 2;
      var i = za();
      (Re !== e || De !== t) && (Lt = null, Fn = Se() + 500, cn(e, t));
      do
        try {
          $f();
          break;
        } catch (s) {
          Pa(e, s);
        }
      while (!0);
      $i(), Sl.current = i, se = l, _e !== null ? t = 0 : (Re = null, De = 0, t = Pe);
    }
    if (t !== 0) {
      if (t === 2 && (l = ni(e), l !== 0 && (r = l, t = Co(e, l))), t === 1) throw n = xr, cn(e, 0), Xt(e, r), Je(e, Se()), n;
      if (t === 6) Xt(e, r);
      else {
        if (l = e.current.alternate, (r & 30) === 0 && !Af(l) && (t = zl(e, r), t === 2 && (i = ni(e), i !== 0 && (r = i, t = Co(e, i))), t === 1)) throw n = xr, cn(e, 0), Xt(e, r), Je(e, Se()), n;
        switch (e.finishedWork = l, e.finishedLanes = r, t) {
          case 0:
          case 1:
            throw Error(u(345));
          case 2:
            fn(e, Ze, Lt);
            break;
          case 3:
            if (Xt(e, r), (r & 130023424) === r && (t = ko + 500 - Se(), 10 < t)) {
              if (Or(e, 0) !== 0) break;
              if (l = e.suspendedLanes, (l & r) !== r) {
                We(), e.pingedLanes |= e.suspendedLanes & l;
                break;
              }
              e.timeoutHandle = zi(fn.bind(null, e, Ze, Lt), t);
              break;
            }
            fn(e, Ze, Lt);
            break;
          case 4:
            if (Xt(e, r), (r & 4194240) === r) break;
            for (t = e.eventTimes, l = -1; 0 < r; ) {
              var o = 31 - pt(r);
              i = 1 << o, o = t[o], o > l && (l = o), r &= ~i;
            }
            if (r = l, r = Se() - r, r = (120 > r ? 120 : 480 > r ? 480 : 1080 > r ? 1080 : 1920 > r ? 1920 : 3e3 > r ? 3e3 : 4320 > r ? 4320 : 1960 * Of(r / 1960)) - r, 10 < r) {
              e.timeoutHandle = zi(fn.bind(null, e, Ze, Lt), r);
              break;
            }
            fn(e, Ze, Lt);
            break;
          case 5:
            fn(e, Ze, Lt);
            break;
          default:
            throw Error(u(329));
        }
      }
    }
    return Je(e, Se()), e.callbackNode === n ? Na.bind(null, e) : null;
  }
  function Co(e, t) {
    var n = kr;
    return e.current.memoizedState.isDehydrated && (cn(e, t).flags |= 256), e = zl(e, t), e !== 2 && (t = Ze, Ze = n, t !== null && _o(t)), e;
  }
  function _o(e) {
    Ze === null ? Ze = e : Ze.push.apply(Ze, e);
  }
  function Af(e) {
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
    for (t &= ~xo, t &= ~El, e.suspendedLanes |= t, e.pingedLanes &= ~t, e = e.expirationTimes; 0 < t; ) {
      var n = 31 - pt(t), r = 1 << n;
      e[n] = -1, t &= ~r;
    }
  }
  function ja(e) {
    if ((se & 6) !== 0) throw Error(u(327));
    On();
    var t = Or(e, 0);
    if ((t & 1) === 0) return Je(e, Se()), null;
    var n = zl(e, t);
    if (e.tag !== 0 && n === 2) {
      var r = ni(e);
      r !== 0 && (t = r, n = Co(e, r));
    }
    if (n === 1) throw n = xr, cn(e, 0), Xt(e, t), Je(e, Se()), n;
    if (n === 6) throw Error(u(345));
    return e.finishedWork = e.current.alternate, e.finishedLanes = t, fn(e, Ze, Lt), Je(e, Se()), null;
  }
  function No(e, t) {
    var n = se;
    se |= 1;
    try {
      return e(t);
    } finally {
      se = n, se === 0 && (Fn = Se() + 500, nl && Vt());
    }
  }
  function an(e) {
    Yt !== null && Yt.tag === 0 && (se & 6) === 0 && On();
    var t = se;
    se |= 1;
    var n = ct.transition, r = ce;
    try {
      if (ct.transition = null, ce = 1, e) return e();
    } finally {
      ce = r, ct.transition = n, se = t, (se & 6) === 0 && Vt();
    }
  }
  function jo() {
    rt = Dn.current, he(Dn);
  }
  function cn(e, t) {
    e.finishedWork = null, e.finishedLanes = 0;
    var n = e.timeoutHandle;
    if (n !== -1 && (e.timeoutHandle = -1, hf(n)), _e !== null) for (n = _e.return; n !== null; ) {
      var r = n;
      switch (Di(r), r.tag) {
        case 1:
          r = r.type.childContextTypes, r != null && el();
          break;
        case 3:
          Ln(), he(Ye), he(Ae), Gi();
          break;
        case 5:
          Ki(r);
          break;
        case 4:
          Ln();
          break;
        case 13:
          he(ye);
          break;
        case 19:
          he(ye);
          break;
        case 10:
          Hi(r.type._context);
          break;
        case 22:
        case 23:
          jo();
      }
      n = n.return;
    }
    if (Re = e, _e = e = Zt(e.current, null), De = rt = t, Pe = 0, xr = null, xo = El = un = 0, Ze = kr = null, ln !== null) {
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
      var n = _e;
      try {
        if ($i(), dl.current = vl, pl) {
          for (var r = we.memoizedState; r !== null; ) {
            var l = r.queue;
            l !== null && (l.pending = null), r = r.next;
          }
          pl = !1;
        }
        if (sn = 0, Te = je = we = null, hr = !1, mr = 0, wo.current = null, n === null || n.return === null) {
          Pe = 1, xr = t, _e = null;
          break;
        }
        e: {
          var i = e, o = n.return, s = n, f = t;
          if (t = De, s.flags |= 32768, f !== null && typeof f == "object" && typeof f.then == "function") {
            var y = f, E = s, C = E.tag;
            if ((E.mode & 1) === 0 && (C === 0 || C === 11 || C === 15)) {
              var S = E.alternate;
              S ? (E.updateQueue = S.updateQueue, E.memoizedState = S.memoizedState, E.lanes = S.lanes) : (E.updateQueue = null, E.memoizedState = null);
            }
            var L = bu(o);
            if (L !== null) {
              L.flags &= -257, ea(L, o, s, i, t), L.mode & 1 && qu(i, y, t), t = L, f = y;
              var O = t.updateQueue;
              if (O === null) {
                var A = /* @__PURE__ */ new Set();
                A.add(f), t.updateQueue = A;
              } else O.add(f);
              break e;
            } else {
              if ((t & 1) === 0) {
                qu(i, y, t), Po();
                break e;
              }
              f = Error(u(426));
            }
          } else if (ge && s.mode & 1) {
            var Ee = bu(o);
            if (Ee !== null) {
              (Ee.flags & 65536) === 0 && (Ee.flags |= 256), ea(Ee, o, s, i, t), Ai(Mn(f, s));
              break e;
            }
          }
          i = f = Mn(f, s), Pe !== 4 && (Pe = 2), kr === null ? kr = [i] : kr.push(i), i = o;
          do {
            switch (i.tag) {
              case 3:
                i.flags |= 65536, t &= -t, i.lanes |= t;
                var m = Zu(i, f, t);
                Eu(i, m);
                break e;
              case 1:
                s = f;
                var p = i.type, v = i.stateNode;
                if ((i.flags & 128) === 0 && (typeof p.getDerivedStateFromError == "function" || v !== null && typeof v.componentDidCatch == "function" && (Kt === null || !Kt.has(v)))) {
                  i.flags |= 65536, t &= -t, i.lanes |= t;
                  var N = Ju(i, s, t);
                  Eu(i, N);
                  break e;
                }
            }
            i = i.return;
          } while (i !== null);
        }
        Ra(n);
      } catch (U) {
        t = U, _e === n && n !== null && (_e = n = n.return);
        continue;
      }
      break;
    } while (!0);
  }
  function za() {
    var e = Sl.current;
    return Sl.current = vl, e === null ? vl : e;
  }
  function Po() {
    (Pe === 0 || Pe === 3 || Pe === 2) && (Pe = 4), Re === null || (un & 268435455) === 0 && (El & 268435455) === 0 || Xt(Re, De);
  }
  function zl(e, t) {
    var n = se;
    se |= 2;
    var r = za();
    (Re !== e || De !== t) && (Lt = null, cn(e, t));
    do
      try {
        Uf();
        break;
      } catch (l) {
        Pa(e, l);
      }
    while (!0);
    if ($i(), se = n, Sl.current = r, _e !== null) throw Error(u(261));
    return Re = null, De = 0, Pe;
  }
  function Uf() {
    for (; _e !== null; ) Ta(_e);
  }
  function $f() {
    for (; _e !== null && !cc(); ) Ta(_e);
  }
  function Ta(e) {
    var t = Ia(e.alternate, e, rt);
    e.memoizedProps = e.pendingProps, t === null ? Ra(e) : _e = t, wo.current = null;
  }
  function Ra(e) {
    var t = e;
    do {
      var n = t.alternate;
      if (e = t.return, (t.flags & 32768) === 0) {
        if (n = Lf(n, t, rt), n !== null) {
          _e = n;
          return;
        }
      } else {
        if (n = Mf(n, t), n !== null) {
          n.flags &= 32767, _e = n;
          return;
        }
        if (e !== null) e.flags |= 32768, e.subtreeFlags = 0, e.deletions = null;
        else {
          Pe = 6, _e = null;
          return;
        }
      }
      if (t = t.sibling, t !== null) {
        _e = t;
        return;
      }
      _e = t = e;
    } while (t !== null);
    Pe === 0 && (Pe = 5);
  }
  function fn(e, t, n) {
    var r = ce, l = ct.transition;
    try {
      ct.transition = null, ce = 1, Hf(e, t, n, r);
    } finally {
      ct.transition = l, ce = r;
    }
    return null;
  }
  function Hf(e, t, n, r) {
    do
      On();
    while (Yt !== null);
    if ((se & 6) !== 0) throw Error(u(327));
    n = e.finishedWork;
    var l = e.finishedLanes;
    if (n === null) return null;
    if (e.finishedWork = null, e.finishedLanes = 0, n === e.current) throw Error(u(177));
    e.callbackNode = null, e.callbackPriority = 0;
    var i = n.lanes | n.childLanes;
    if (xc(e, i), e === Re && (_e = Re = null, De = 0), (n.subtreeFlags & 2064) === 0 && (n.flags & 2064) === 0 || _l || (_l = !0, Da(Mr, function() {
      return On(), null;
    })), i = (n.flags & 15990) !== 0, (n.subtreeFlags & 15990) !== 0 || i) {
      i = ct.transition, ct.transition = null;
      var o = ce;
      ce = 1;
      var s = se;
      se |= 4, wo.current = null, Df(e, n), ka(n, e), sf(ji), $r = !!Ni, ji = Ni = null, e.current = n, Ff(n), fc(), se = s, ce = o, ct.transition = i;
    } else e.current = n;
    if (_l && (_l = !1, Yt = e, Nl = l), i = e.pendingLanes, i === 0 && (Kt = null), hc(n.stateNode), Je(e, Se()), t !== null) for (r = e.onRecoverableError, n = 0; n < t.length; n++) l = t[n], r(l.value, { componentStack: l.stack, digest: l.digest });
    if (Cl) throw Cl = !1, e = So, So = null, e;
    return (Nl & 1) !== 0 && e.tag !== 0 && On(), i = e.pendingLanes, (i & 1) !== 0 ? e === Eo ? Sr++ : (Sr = 0, Eo = e) : Sr = 0, Vt(), null;
  }
  function On() {
    if (Yt !== null) {
      var e = ws(Nl), t = ct.transition, n = ce;
      try {
        if (ct.transition = null, ce = 16 > e ? 16 : e, Yt === null) var r = !1;
        else {
          if (e = Yt, Yt = null, Nl = 0, (se & 6) !== 0) throw Error(u(331));
          var l = se;
          for (se |= 4, D = e.current; D !== null; ) {
            var i = D, o = i.child;
            if ((D.flags & 16) !== 0) {
              var s = i.deletions;
              if (s !== null) {
                for (var f = 0; f < s.length; f++) {
                  var y = s[f];
                  for (D = y; D !== null; ) {
                    var E = D;
                    switch (E.tag) {
                      case 0:
                      case 11:
                      case 15:
                        wr(8, E, i);
                    }
                    var C = E.child;
                    if (C !== null) C.return = E, D = C;
                    else for (; D !== null; ) {
                      E = D;
                      var S = E.sibling, L = E.return;
                      if (va(E), E === y) {
                        D = null;
                        break;
                      }
                      if (S !== null) {
                        S.return = L, D = S;
                        break;
                      }
                      D = L;
                    }
                  }
                }
                var O = i.alternate;
                if (O !== null) {
                  var A = O.child;
                  if (A !== null) {
                    O.child = null;
                    do {
                      var Ee = A.sibling;
                      A.sibling = null, A = Ee;
                    } while (A !== null);
                  }
                }
                D = i;
              }
            }
            if ((i.subtreeFlags & 2064) !== 0 && o !== null) o.return = i, D = o;
            else e: for (; D !== null; ) {
              if (i = D, (i.flags & 2048) !== 0) switch (i.tag) {
                case 0:
                case 11:
                case 15:
                  wr(9, i, i.return);
              }
              var m = i.sibling;
              if (m !== null) {
                m.return = i.return, D = m;
                break e;
              }
              D = i.return;
            }
          }
          var p = e.current;
          for (D = p; D !== null; ) {
            o = D;
            var v = o.child;
            if ((o.subtreeFlags & 2064) !== 0 && v !== null) v.return = o, D = v;
            else e: for (o = p; D !== null; ) {
              if (s = D, (s.flags & 2048) !== 0) try {
                switch (s.tag) {
                  case 0:
                  case 11:
                  case 15:
                    kl(9, s);
                }
              } catch (U) {
                ke(s, s.return, U);
              }
              if (s === o) {
                D = null;
                break e;
              }
              var N = s.sibling;
              if (N !== null) {
                N.return = s.return, D = N;
                break e;
              }
              D = s.return;
            }
          }
          if (se = l, Vt(), xt && typeof xt.onPostCommitFiberRoot == "function") try {
            xt.onPostCommitFiberRoot(Ir, e);
          } catch {
          }
          r = !0;
        }
        return r;
      } finally {
        ce = n, ct.transition = t;
      }
    }
    return !1;
  }
  function La(e, t, n) {
    t = Mn(n, t), t = Zu(e, t, 1), e = Wt(e, t, 1), t = We(), e !== null && (Kn(e, 1, t), Je(e, t));
  }
  function ke(e, t, n) {
    if (e.tag === 3) La(e, e, n);
    else for (; t !== null; ) {
      if (t.tag === 3) {
        La(t, e, n);
        break;
      } else if (t.tag === 1) {
        var r = t.stateNode;
        if (typeof t.type.getDerivedStateFromError == "function" || typeof r.componentDidCatch == "function" && (Kt === null || !Kt.has(r))) {
          e = Mn(n, e), e = Ju(t, e, 1), t = Wt(t, e, 1), e = We(), t !== null && (Kn(t, 1, e), Je(t, e));
          break;
        }
      }
      t = t.return;
    }
  }
  function Vf(e, t, n) {
    var r = e.pingCache;
    r !== null && r.delete(t), t = We(), e.pingedLanes |= e.suspendedLanes & n, Re === e && (De & n) === n && (Pe === 4 || Pe === 3 && (De & 130023424) === De && 500 > Se() - ko ? cn(e, 0) : xo |= n), Je(e, t);
  }
  function Ma(e, t) {
    t === 0 && ((e.mode & 1) === 0 ? t = 1 : (t = Fr, Fr <<= 1, (Fr & 130023424) === 0 && (Fr = 4194304)));
    var n = We();
    e = zt(e, t), e !== null && (Kn(e, t, n), Je(e, n));
  }
  function Bf(e) {
    var t = e.memoizedState, n = 0;
    t !== null && (n = t.retryLane), Ma(e, n);
  }
  function Wf(e, t) {
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
        throw Error(u(314));
    }
    r !== null && r.delete(t), Ma(e, n);
  }
  var Ia;
  Ia = function(e, t, n) {
    if (e !== null) if (e.memoizedProps !== t.pendingProps || Ye.current) Xe = !0;
    else {
      if ((e.lanes & n) === 0 && (t.flags & 128) === 0) return Xe = !1, Rf(e, t, n);
      Xe = (e.flags & 131072) !== 0;
    }
    else Xe = !1, ge && (t.flags & 1048576) !== 0 && pu(t, ll, t.index);
    switch (t.lanes = 0, t.tag) {
      case 2:
        var r = t.type;
        wl(e, t), e = t.pendingProps;
        var l = _n(t, Ae.current);
        Rn(t, n), l = Ji(null, t, r, e, l, n);
        var i = qi();
        return t.flags |= 1, typeof l == "object" && l !== null && typeof l.render == "function" && l.$$typeof === void 0 ? (t.tag = 1, t.memoizedState = null, t.updateQueue = null, Ge(r) ? (i = !0, tl(t)) : i = !1, t.memoizedState = l.state !== null && l.state !== void 0 ? l.state : null, Wi(t), l.updater = gl, t.stateNode = l, l._reactInternals = t, lo(t, r, e, n), t = uo(null, t, r, !0, i, n)) : (t.tag = 0, ge && i && Ii(t), Be(null, t, l, n), t = t.child), t;
      case 16:
        r = t.elementType;
        e: {
          switch (wl(e, t), e = t.pendingProps, l = r._init, r = l(r._payload), t.type = r, l = t.tag = Kf(r), e = vt(r, e), l) {
            case 0:
              t = so(null, t, r, e, n);
              break e;
            case 1:
              t = oa(null, t, r, e, n);
              break e;
            case 11:
              t = ta(null, t, r, e, n);
              break e;
            case 14:
              t = na(null, t, r, vt(r.type, e), n);
              break e;
          }
          throw Error(u(
            306,
            r,
            ""
          ));
        }
        return t;
      case 0:
        return r = t.type, l = t.pendingProps, l = t.elementType === r ? l : vt(r, l), so(e, t, r, l, n);
      case 1:
        return r = t.type, l = t.pendingProps, l = t.elementType === r ? l : vt(r, l), oa(e, t, r, l, n);
      case 3:
        e: {
          if (sa(t), e === null) throw Error(u(387));
          r = t.pendingProps, i = t.memoizedState, l = i.element, Su(e, t), cl(t, r, null, n);
          var o = t.memoizedState;
          if (r = o.element, i.isDehydrated) if (i = { element: r, isDehydrated: !1, cache: o.cache, pendingSuspenseBoundaries: o.pendingSuspenseBoundaries, transitions: o.transitions }, t.updateQueue.baseState = i, t.memoizedState = i, t.flags & 256) {
            l = Mn(Error(u(423)), t), t = ua(e, t, r, n, l);
            break e;
          } else if (r !== l) {
            l = Mn(Error(u(424)), t), t = ua(e, t, r, n, l);
            break e;
          } else for (nt = Ut(t.stateNode.containerInfo.firstChild), tt = t, ge = !0, mt = null, n = xu(t, null, r, n), t.child = n; n; ) n.flags = n.flags & -3 | 4096, n = n.sibling;
          else {
            if (Pn(), r === l) {
              t = Rt(e, t, n);
              break e;
            }
            Be(e, t, r, n);
          }
          t = t.child;
        }
        return t;
      case 5:
        return _u(t), e === null && Oi(t), r = t.type, l = t.pendingProps, i = e !== null ? e.memoizedProps : null, o = l.children, Pi(r, l) ? o = null : i !== null && Pi(r, i) && (t.flags |= 32), ia(e, t), Be(e, t, o, n), t.child;
      case 6:
        return e === null && Oi(t), null;
      case 13:
        return aa(e, t, n);
      case 4:
        return Qi(t, t.stateNode.containerInfo), r = t.pendingProps, e === null ? t.child = zn(t, null, r, n) : Be(e, t, r, n), t.child;
      case 11:
        return r = t.type, l = t.pendingProps, l = t.elementType === r ? l : vt(r, l), ta(e, t, r, l, n);
      case 7:
        return Be(e, t, t.pendingProps, n), t.child;
      case 8:
        return Be(e, t, t.pendingProps.children, n), t.child;
      case 12:
        return Be(e, t, t.pendingProps.children, n), t.child;
      case 10:
        e: {
          if (r = t.type._context, l = t.pendingProps, i = t.memoizedProps, o = l.value, de(sl, r._currentValue), r._currentValue = o, i !== null) if (ht(i.value, o)) {
            if (i.children === l.children && !Ye.current) {
              t = Rt(e, t, n);
              break e;
            }
          } else for (i = t.child, i !== null && (i.return = t); i !== null; ) {
            var s = i.dependencies;
            if (s !== null) {
              o = i.child;
              for (var f = s.firstContext; f !== null; ) {
                if (f.context === r) {
                  if (i.tag === 1) {
                    f = Tt(-1, n & -n), f.tag = 2;
                    var y = i.updateQueue;
                    if (y !== null) {
                      y = y.shared;
                      var E = y.pending;
                      E === null ? f.next = f : (f.next = E.next, E.next = f), y.pending = f;
                    }
                  }
                  i.lanes |= n, f = i.alternate, f !== null && (f.lanes |= n), Vi(
                    i.return,
                    n,
                    t
                  ), s.lanes |= n;
                  break;
                }
                f = f.next;
              }
            } else if (i.tag === 10) o = i.type === t.type ? null : i.child;
            else if (i.tag === 18) {
              if (o = i.return, o === null) throw Error(u(341));
              o.lanes |= n, s = o.alternate, s !== null && (s.lanes |= n), Vi(o, n, t), o = i.sibling;
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
          Be(e, t, l.children, n), t = t.child;
        }
        return t;
      case 9:
        return l = t.type, r = t.pendingProps.children, Rn(t, n), l = ut(l), r = r(l), t.flags |= 1, Be(e, t, r, n), t.child;
      case 14:
        return r = t.type, l = vt(r, t.pendingProps), l = vt(r.type, l), na(e, t, r, l, n);
      case 15:
        return ra(e, t, t.type, t.pendingProps, n);
      case 17:
        return r = t.type, l = t.pendingProps, l = t.elementType === r ? l : vt(r, l), wl(e, t), t.tag = 1, Ge(r) ? (e = !0, tl(t)) : e = !1, Rn(t, n), Gu(t, r, l), lo(t, r, l, n), uo(null, t, r, !0, e, n);
      case 19:
        return fa(e, t, n);
      case 22:
        return la(e, t, n);
    }
    throw Error(u(156, t.tag));
  };
  function Da(e, t) {
    return hs(e, t);
  }
  function Qf(e, t, n, r) {
    this.tag = e, this.key = n, this.sibling = this.child = this.return = this.stateNode = this.type = this.elementType = null, this.index = 0, this.ref = null, this.pendingProps = t, this.dependencies = this.memoizedState = this.updateQueue = this.memoizedProps = null, this.mode = r, this.subtreeFlags = this.flags = 0, this.deletions = null, this.childLanes = this.lanes = 0, this.alternate = null;
  }
  function ft(e, t, n, r) {
    return new Qf(e, t, n, r);
  }
  function zo(e) {
    return e = e.prototype, !(!e || !e.isReactComponent);
  }
  function Kf(e) {
    if (typeof e == "function") return zo(e) ? 1 : 0;
    if (e != null) {
      if (e = e.$$typeof, e === be) return 11;
      if (e === Ke) return 14;
    }
    return 2;
  }
  function Zt(e, t) {
    var n = e.alternate;
    return n === null ? (n = ft(e.tag, t, e.key, e.mode), n.elementType = e.elementType, n.type = e.type, n.stateNode = e.stateNode, n.alternate = e, e.alternate = n) : (n.pendingProps = t, n.type = e.type, n.flags = 0, n.subtreeFlags = 0, n.deletions = null), n.flags = e.flags & 14680064, n.childLanes = e.childLanes, n.lanes = e.lanes, n.child = e.child, n.memoizedProps = e.memoizedProps, n.memoizedState = e.memoizedState, n.updateQueue = e.updateQueue, t = e.dependencies, n.dependencies = t === null ? null : { lanes: t.lanes, firstContext: t.firstContext }, n.sibling = e.sibling, n.index = e.index, n.ref = e.ref, n;
  }
  function Tl(e, t, n, r, l, i) {
    var o = 2;
    if (r = e, typeof e == "function") zo(e) && (o = 1);
    else if (typeof e == "string") o = 5;
    else e: switch (e) {
      case ee:
        return dn(n.children, l, i, t);
      case Ce:
        o = 8, l |= 8;
        break;
      case it:
        return e = ft(12, n, t, l | 2), e.elementType = it, e.lanes = i, e;
      case Oe:
        return e = ft(13, n, t, l), e.elementType = Oe, e.lanes = i, e;
      case Qe:
        return e = ft(19, n, t, l), e.elementType = Qe, e.lanes = i, e;
      case ve:
        return Rl(n, l, i, t);
      default:
        if (typeof e == "object" && e !== null) switch (e.$$typeof) {
          case Ve:
            o = 10;
            break e;
          case Me:
            o = 9;
            break e;
          case be:
            o = 11;
            break e;
          case Ke:
            o = 14;
            break e;
          case ze:
            o = 16, r = null;
            break e;
        }
        throw Error(u(130, e == null ? e : typeof e, ""));
    }
    return t = ft(o, n, t, l), t.elementType = e, t.type = r, t.lanes = i, t;
  }
  function dn(e, t, n, r) {
    return e = ft(7, e, r, t), e.lanes = n, e;
  }
  function Rl(e, t, n, r) {
    return e = ft(22, e, r, t), e.elementType = ve, e.lanes = n, e.stateNode = { isHidden: !1 }, e;
  }
  function To(e, t, n) {
    return e = ft(6, e, null, t), e.lanes = n, e;
  }
  function Ro(e, t, n) {
    return t = ft(4, e.children !== null ? e.children : [], e.key, t), t.lanes = n, t.stateNode = { containerInfo: e.containerInfo, pendingChildren: null, implementation: e.implementation }, t;
  }
  function Yf(e, t, n, r, l) {
    this.tag = t, this.containerInfo = e, this.finishedWork = this.pingCache = this.current = this.pendingChildren = null, this.timeoutHandle = -1, this.callbackNode = this.pendingContext = this.context = null, this.callbackPriority = 0, this.eventTimes = ri(0), this.expirationTimes = ri(-1), this.entangledLanes = this.finishedLanes = this.mutableReadLanes = this.expiredLanes = this.pingedLanes = this.suspendedLanes = this.pendingLanes = 0, this.entanglements = ri(0), this.identifierPrefix = r, this.onRecoverableError = l, this.mutableSourceEagerHydrationData = null;
  }
  function Lo(e, t, n, r, l, i, o, s, f) {
    return e = new Yf(e, t, n, s, f), t === 1 ? (t = 1, i === !0 && (t |= 8)) : t = 0, i = ft(3, null, null, t), e.current = i, i.stateNode = e, i.memoizedState = { element: r, isDehydrated: n, cache: null, transitions: null, pendingSuspenseBoundaries: null }, Wi(i), e;
  }
  function Gf(e, t, n) {
    var r = 3 < arguments.length && arguments[3] !== void 0 ? arguments[3] : null;
    return { $$typeof: q, key: r == null ? null : "" + r, children: e, containerInfo: t, implementation: n };
  }
  function Fa(e) {
    if (!e) return Ht;
    e = e._reactInternals;
    e: {
      if (bt(e) !== e || e.tag !== 1) throw Error(u(170));
      var t = e;
      do {
        switch (t.tag) {
          case 3:
            t = t.stateNode.context;
            break e;
          case 1:
            if (Ge(t.type)) {
              t = t.stateNode.__reactInternalMemoizedMergedChildContext;
              break e;
            }
        }
        t = t.return;
      } while (t !== null);
      throw Error(u(171));
    }
    if (e.tag === 1) {
      var n = e.type;
      if (Ge(n)) return cu(e, n, t);
    }
    return t;
  }
  function Oa(e, t, n, r, l, i, o, s, f) {
    return e = Lo(n, r, !0, e, l, i, o, s, f), e.context = Fa(null), n = e.current, r = We(), l = Gt(n), i = Tt(r, l), i.callback = t ?? null, Wt(n, i, l), e.current.lanes = l, Kn(e, l, r), Je(e, r), e;
  }
  function Ll(e, t, n, r) {
    var l = t.current, i = We(), o = Gt(l);
    return n = Fa(n), t.context === null ? t.context = n : t.pendingContext = n, t = Tt(i, o), t.payload = { element: e }, r = r === void 0 ? null : r, r !== null && (t.callback = r), e = Wt(l, t, o), e !== null && (wt(e, l, o, i), al(e, l, o)), o;
  }
  function Ml(e) {
    if (e = e.current, !e.child) return null;
    switch (e.child.tag) {
      case 5:
        return e.child.stateNode;
      default:
        return e.child.stateNode;
    }
  }
  function Aa(e, t) {
    if (e = e.memoizedState, e !== null && e.dehydrated !== null) {
      var n = e.retryLane;
      e.retryLane = n !== 0 && n < t ? n : t;
    }
  }
  function Mo(e, t) {
    Aa(e, t), (e = e.alternate) && Aa(e, t);
  }
  function Xf() {
    return null;
  }
  var Ua = typeof reportError == "function" ? reportError : function(e) {
    console.error(e);
  };
  function Io(e) {
    this._internalRoot = e;
  }
  Il.prototype.render = Io.prototype.render = function(e) {
    var t = this._internalRoot;
    if (t === null) throw Error(u(409));
    Ll(e, t, null, null);
  }, Il.prototype.unmount = Io.prototype.unmount = function() {
    var e = this._internalRoot;
    if (e !== null) {
      this._internalRoot = null;
      var t = e.containerInfo;
      an(function() {
        Ll(null, e, null, null);
      }), t[_t] = null;
    }
  };
  function Il(e) {
    this._internalRoot = e;
  }
  Il.prototype.unstable_scheduleHydration = function(e) {
    if (e) {
      var t = Ss();
      e = { blockedOn: null, target: e, priority: t };
      for (var n = 0; n < Ft.length && t !== 0 && t < Ft[n].priority; n++) ;
      Ft.splice(n, 0, e), n === 0 && _s(e);
    }
  };
  function Do(e) {
    return !(!e || e.nodeType !== 1 && e.nodeType !== 9 && e.nodeType !== 11);
  }
  function Dl(e) {
    return !(!e || e.nodeType !== 1 && e.nodeType !== 9 && e.nodeType !== 11 && (e.nodeType !== 8 || e.nodeValue !== " react-mount-point-unstable "));
  }
  function $a() {
  }
  function Zf(e, t, n, r, l) {
    if (l) {
      if (typeof r == "function") {
        var i = r;
        r = function() {
          var y = Ml(o);
          i.call(y);
        };
      }
      var o = Oa(t, r, e, 0, null, !1, !1, "", $a);
      return e._reactRootContainer = o, e[_t] = o.current, or(e.nodeType === 8 ? e.parentNode : e), an(), o;
    }
    for (; l = e.lastChild; ) e.removeChild(l);
    if (typeof r == "function") {
      var s = r;
      r = function() {
        var y = Ml(f);
        s.call(y);
      };
    }
    var f = Lo(e, 0, !1, null, null, !1, !1, "", $a);
    return e._reactRootContainer = f, e[_t] = f.current, or(e.nodeType === 8 ? e.parentNode : e), an(function() {
      Ll(t, f, n, r);
    }), f;
  }
  function Fl(e, t, n, r, l) {
    var i = n._reactRootContainer;
    if (i) {
      var o = i;
      if (typeof l == "function") {
        var s = l;
        l = function() {
          var f = Ml(o);
          s.call(f);
        };
      }
      Ll(t, o, e, l);
    } else o = Zf(n, t, e, l, r);
    return Ml(o);
  }
  xs = function(e) {
    switch (e.tag) {
      case 3:
        var t = e.stateNode;
        if (t.current.memoizedState.isDehydrated) {
          var n = Qn(t.pendingLanes);
          n !== 0 && (li(t, n | 1), Je(t, Se()), (se & 6) === 0 && (Fn = Se() + 500, Vt()));
        }
        break;
      case 13:
        an(function() {
          var r = zt(e, 1);
          if (r !== null) {
            var l = We();
            wt(r, e, 1, l);
          }
        }), Mo(e, 1);
    }
  }, ii = function(e) {
    if (e.tag === 13) {
      var t = zt(e, 134217728);
      if (t !== null) {
        var n = We();
        wt(t, e, 134217728, n);
      }
      Mo(e, 134217728);
    }
  }, ks = function(e) {
    if (e.tag === 13) {
      var t = Gt(e), n = zt(e, t);
      if (n !== null) {
        var r = We();
        wt(n, e, t, r);
      }
      Mo(e, t);
    }
  }, Ss = function() {
    return ce;
  }, Es = function(e, t) {
    var n = ce;
    try {
      return ce = e, t();
    } finally {
      ce = n;
    }
  }, Jl = function(e, t, n) {
    switch (t) {
      case "input":
        if (Bl(e, n), t = n.name, n.type === "radio" && t != null) {
          for (n = e; n.parentNode; ) n = n.parentNode;
          for (n = n.querySelectorAll("input[name=" + JSON.stringify("" + t) + '][type="radio"]'), t = 0; t < n.length; t++) {
            var r = n[t];
            if (r !== e && r.form === e.form) {
              var l = br(r);
              if (!l) throw Error(u(90));
              An(r), Bl(r, l);
            }
          }
        }
        break;
      case "textarea":
        qo(e, n);
        break;
      case "select":
        t = n.value, t != null && pn(e, !!n.multiple, t, !1);
    }
  }, ss = No, us = an;
  var Jf = { usingClientEntryPoint: !1, Events: [ar, En, br, is, os, No] }, Er = { findFiberByHostInstance: en, bundleType: 0, version: "18.3.1", rendererPackageName: "react-dom" }, qf = { bundleType: Er.bundleType, version: Er.version, rendererPackageName: Er.rendererPackageName, rendererConfig: Er.rendererConfig, overrideHookState: null, overrideHookStateDeletePath: null, overrideHookStateRenamePath: null, overrideProps: null, overridePropsDeletePath: null, overridePropsRenamePath: null, setErrorHandler: null, setSuspenseHandler: null, scheduleUpdate: null, currentDispatcherRef: Q.ReactCurrentDispatcher, findHostInstanceByFiber: function(e) {
    return e = ds(e), e === null ? null : e.stateNode;
  }, findFiberByHostInstance: Er.findFiberByHostInstance || Xf, findHostInstancesForRefresh: null, scheduleRefresh: null, scheduleRoot: null, setRefreshHandler: null, getCurrentFiber: null, reconcilerVersion: "18.3.1-next-f1338f8080-20240426" };
  if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u") {
    var Ol = __REACT_DEVTOOLS_GLOBAL_HOOK__;
    if (!Ol.isDisabled && Ol.supportsFiber) try {
      Ir = Ol.inject(qf), xt = Ol;
    } catch {
    }
  }
  return qe.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = Jf, qe.createPortal = function(e, t) {
    var n = 2 < arguments.length && arguments[2] !== void 0 ? arguments[2] : null;
    if (!Do(t)) throw Error(u(200));
    return Gf(e, t, null, n);
  }, qe.createRoot = function(e, t) {
    if (!Do(e)) throw Error(u(299));
    var n = !1, r = "", l = Ua;
    return t != null && (t.unstable_strictMode === !0 && (n = !0), t.identifierPrefix !== void 0 && (r = t.identifierPrefix), t.onRecoverableError !== void 0 && (l = t.onRecoverableError)), t = Lo(e, 1, !1, null, null, n, !1, r, l), e[_t] = t.current, or(e.nodeType === 8 ? e.parentNode : e), new Io(t);
  }, qe.findDOMNode = function(e) {
    if (e == null) return null;
    if (e.nodeType === 1) return e;
    var t = e._reactInternals;
    if (t === void 0)
      throw typeof e.render == "function" ? Error(u(188)) : (e = Object.keys(e).join(","), Error(u(268, e)));
    return e = ds(t), e = e === null ? null : e.stateNode, e;
  }, qe.flushSync = function(e) {
    return an(e);
  }, qe.hydrate = function(e, t, n) {
    if (!Dl(t)) throw Error(u(200));
    return Fl(null, e, t, !0, n);
  }, qe.hydrateRoot = function(e, t, n) {
    if (!Do(e)) throw Error(u(405));
    var r = n != null && n.hydratedSources || null, l = !1, i = "", o = Ua;
    if (n != null && (n.unstable_strictMode === !0 && (l = !0), n.identifierPrefix !== void 0 && (i = n.identifierPrefix), n.onRecoverableError !== void 0 && (o = n.onRecoverableError)), t = Oa(t, null, e, 1, n ?? null, l, !1, i, o), e[_t] = t.current, or(e), r) for (e = 0; e < r.length; e++) n = r[e], l = n._getVersion, l = l(n._source), t.mutableSourceEagerHydrationData == null ? t.mutableSourceEagerHydrationData = [n, l] : t.mutableSourceEagerHydrationData.push(
      n,
      l
    );
    return new Il(t);
  }, qe.render = function(e, t, n) {
    if (!Dl(t)) throw Error(u(200));
    return Fl(null, e, t, !1, n);
  }, qe.unmountComponentAtNode = function(e) {
    if (!Dl(e)) throw Error(u(40));
    return e._reactRootContainer ? (an(function() {
      Fl(null, null, e, !1, function() {
        e._reactRootContainer = null, e[_t] = null;
      });
    }), !0) : !1;
  }, qe.unstable_batchedUpdates = No, qe.unstable_renderSubtreeIntoContainer = function(e, t, n, r) {
    if (!Dl(n)) throw Error(u(200));
    if (e == null || e._reactInternals === void 0) throw Error(u(38));
    return Fl(e, t, n, !1, r);
  }, qe.version = "18.3.1-next-f1338f8080-20240426", qe;
}
var Ga;
function ud() {
  if (Ga) return Ao.exports;
  Ga = 1;
  function d() {
    if (!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function"))
      try {
        __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(d);
      } catch (c) {
        console.error(c);
      }
  }
  return d(), Ao.exports = sd(), Ao.exports;
}
var Xa;
function ad() {
  if (Xa) return Al;
  Xa = 1;
  var d = ud();
  return Al.createRoot = d.createRoot, Al.hydrateRoot = d.hydrateRoot, Al;
}
var cd = ad();
const fd = ":host{--fc-text: var(--primary-text-color, #2b1e15);--fc-muted: var(--secondary-text-color, #786350);--fc-accent: var(--faith-accent, #b8862f);--fc-line: var(--divider-color, rgba(0,0,0,.12));--fc-bg2: var(--secondary-background-color, rgba(0,0,0,.04));--fc-ok: var(--success-color, #43a047);--fc-err: var(--error-color, #db4437);--fc-soft: color-mix(in srgb, var(--fc-accent) 14%, transparent);display:block}*{box-sizing:border-box}ha-card{padding:16px;color:var(--fc-text)}.head{display:flex;align-items:center;gap:10px;margin-bottom:12px}.head h2{margin:0;font-size:1.25rem;font-weight:600;line-height:1.2}.head .sub{color:var(--fc-muted);font-size:.85rem}.head .right{margin-left:auto;display:flex;gap:6px;align-items:center}.eyebrow{font-size:.72rem;letter-spacing:.12em;text-transform:uppercase;color:var(--fc-muted)}.hello{margin:2px 0 14px;font-size:1.6rem;font-weight:600;line-height:1.15}.hello em{color:var(--fc-accent);font-style:italic}.section{padding:12px 0;border-top:1px solid var(--fc-line)}.section:first-of-type{border-top:0;padding-top:0}.section h3{display:flex;align-items:center;gap:8px;margin:0 0 8px;font-size:1rem;font-weight:600}.section h3 ha-icon{--mdc-icon-size: 20px;color:var(--fc-accent)}.count{background:var(--fc-bg2);color:var(--fc-muted);border-radius:999px;padding:0 8px;font-size:.8rem;font-weight:500}ul{list-style:none;margin:0;padding:0}.row{display:flex;align-items:center;gap:10px;padding:7px 0;border-bottom:1px solid var(--fc-line)}.row:last-child{border-bottom:0}.time{min-width:70px;color:var(--fc-muted);font-variant-numeric:tabular-nums}.grow{flex:1;min-width:0}.meta{color:var(--fc-muted);font-size:.85rem}.label{font-size:.72rem;letter-spacing:.1em;text-transform:uppercase;color:var(--fc-muted)}.check{width:18px;height:18px;border-radius:50%;border:2px solid var(--fc-line);flex:none}.check.done{background:var(--fc-ok);border-color:var(--fc-ok)}.tiles{display:grid;grid-template-columns:repeat(auto-fill,minmax(120px,1fr));gap:8px}.tile{background:var(--fc-bg2);border-radius:12px;padding:10px 12px}.tile .v{font-size:1.15rem;font-weight:600;text-transform:capitalize}.empty{color:var(--fc-muted);padding:4px 0}.err{color:var(--fc-err)}button{font:inherit;color:inherit;cursor:pointer;border:1px solid var(--fc-line);background:var(--fc-bg2);border-radius:10px;padding:8px 14px;min-height:40px}button.primary{background:var(--fc-accent);border-color:var(--fc-accent);color:var(--faith-accent-text, #fffaf0)}button.ghost{background:transparent;border-color:transparent;color:var(--fc-muted)}button:disabled{opacity:.5;cursor:default}.btns{display:flex;gap:6px;flex-wrap:wrap}input{font:inherit;color:var(--fc-text);background:var(--fc-bg2);border:1px solid var(--fc-line);border-radius:10px;padding:8px 12px;min-height:40px;width:100%}input:focus{outline:2px solid var(--fc-accent);outline-offset:-1px}.avatar{display:inline-grid;place-items:center;border-radius:50%;color:#fff;font-weight:600;flex:none}.people{display:grid;grid-template-columns:repeat(auto-fill,minmax(96px,1fr));gap:10px}.person{display:flex;flex-direction:column;align-items:center;gap:8px;padding:14px 8px;border-radius:14px;border:1px solid var(--fc-line);background:transparent;font-weight:600}.person.suggested{border:2px solid var(--fc-accent)}.pin{display:flex;flex-direction:column;align-items:center;gap:12px}.dots{display:flex;gap:10px}.dots span{width:13px;height:13px;border-radius:50%;border:2px solid var(--fc-muted)}.dots span.on{background:var(--fc-accent);border-color:var(--fc-accent)}.keys{display:grid;grid-template-columns:repeat(3,68px);gap:8px}.keys button{height:58px;font-size:1.35rem;border-radius:14px}.chat{display:flex;flex-direction:column;gap:10px;max-height:var(--faith-chat-height, 420px);overflow-y:auto;padding:2px}.msg{max-width:88%;padding:9px 13px;border-radius:16px;white-space:pre-wrap;line-height:1.4}.msg.me{align-self:flex-end;background:var(--fc-accent);color:var(--faith-accent-text, #fffaf0);border-bottom-right-radius:4px}.msg.faith{align-self:flex-start;background:var(--fc-bg2);border-bottom-left-radius:4px}.chips{display:flex;gap:4px;flex-wrap:wrap}.chip{font-size:.75rem;color:var(--fc-muted);border:1px solid var(--fc-line);border-radius:999px;padding:1px 8px}.ask{display:flex;gap:6px;margin-top:10px;align-items:center}.ask button{min-width:44px;padding:8px 10px}.rec{background:var(--fc-err)!important;color:#fff!important;border-color:var(--fc-err)!important}.box{border:1px solid var(--fc-accent);border-radius:14px;padding:10px 12px;display:flex;flex-direction:column;gap:8px}.box.wait{border-style:dashed}.big{font-size:2.6rem;font-weight:700;line-height:1}.pill{background:var(--fc-soft);color:var(--fc-accent);border-radius:999px;padding:2px 10px;font-weight:600;font-size:.85rem;white-space:nowrap}.toast{color:var(--fc-muted);font-size:.85rem}.apps{display:flex;gap:8px;flex-wrap:wrap}.apps a{text-decoration:none;color:inherit;display:flex;align-items:center;gap:8px;border:1px solid var(--fc-line);border-radius:12px;padding:6px 12px 6px 8px}.emblem{flex:none;margin:-6px -2px -6px -6px}", Bo = (d) => `faith.hub.${d}`, dd = (d) => {
  if (d)
    try {
      return localStorage.getItem(Bo(d)) || void 0;
    } catch {
      return;
    }
};
function Ho(d, c) {
  try {
    c ? localStorage.setItem(Bo(d), c) : localStorage.removeItem(Bo(d));
  } catch {
  }
  window.dispatchEvent(new CustomEvent("faith-hub-changed", { detail: { screen: d } }));
}
function pd(d, c) {
  return {
    screen: c.screen,
    get user() {
      var u;
      return (u = d()) == null ? void 0 : u.user;
    },
    get dark() {
      var u, P;
      return !!((P = (u = d()) == null ? void 0 : u.themes) != null && P.darkMode);
    },
    call: async (u, P = {}) => {
      const j = d();
      if (!j) throw new Error("Home Assistant isn't ready yet.");
      const M = dd(c.screen);
      try {
        return await j.callWS({ type: "faith/call", path: u, body: { ...P, ...c.screen ? { screen: c.screen } : {}, ...M ? { hub_session: M } : {} } });
      } catch (R) {
        throw new Error((R == null ? void 0 : R.message) || (R == null ? void 0 : R.code) || "FAITH didn't answer.");
      }
    }
  };
}
const Nr = (1 + Math.sqrt(5)) / 2, lt = Math.PI * 2, Wo = (() => {
  const d = Math.hypot(1, Nr), c = [];
  for (const u of [-1, 1]) for (const P of [-Nr, Nr]) c.push([0, u / d, P / d], [u / d, P / d, 0], [P / d, 0, u / d]);
  return c;
})(), hd = (d, c) => (d[0] - c[0]) ** 2 + (d[1] - c[1]) ** 2 + (d[2] - c[2]) ** 2, md = 4 / (1 + Nr * Nr), Ko = [];
for (let d = 0; d < 12; d++) for (let c = d + 1; c < 12; c++) Math.abs(hd(Wo[d], Wo[c]) - md) < 0.01 && Ko.push([d, c]);
const tc = [], Vo = (d, c) => Ko.some(([u, P]) => u === d && P === c || u === c && P === d);
for (let d = 0; d < 12; d++) for (let c = d + 1; c < 12; c++) for (let u = c + 1; u < 12; u++) Vo(d, c) && Vo(c, u) && Vo(d, u) && tc.push([d, c, u]);
const jr = 7, qt = (d) => {
  const c = Math.sin(d * 127.1 + 311.7) * 43758.5453;
  return c - Math.floor(c);
}, Za = Array.from({ length: jr }, (d, c) => ({
  a: [0, 1, 2].map((u) => 0.3 + 0.16 * qt(c * 9 + u)),
  w: [0, 1, 2].map((u) => 0.22 + 0.3 * qt(c * 9 + u + 3)),
  p: [0, 1, 2].map((u) => lt * qt(c * 9 + u + 6)),
  flap: lt * qt(c * 3 + 100)
})), nc = -1, Pr = [];
for (let d = 0; d < jr; d++) Pr.push({ a: nc, b: d, kind: "core", seed: qt(d + 40) });
for (let d = 0; d < jr; d++) Pr.push({ a: d, b: (d + 1) % jr, kind: "bee", seed: qt(d + 60) });
for (const [d, c] of [[0, 3], [2, 5], [4, 6]]) Pr.push({ a: d, b: c, kind: "bee", seed: qt(d * 7 + c) });
for (const [d, c] of [[1, 0], [3, 7], [5, 10]]) Pr.push({ a: d, b: c, kind: "shell", seed: qt(d + c * 3) });
const vd = [
  { r: 1.34, tiltX: 1.12, tiltZ: 0.38, precess: 0.21, phase: 0, width: 0.024, ticks: 36 },
  { r: 1.5, tiltX: 1.38, tiltZ: -0.62, precess: -0.15, phase: Math.PI / 2, width: 0.016, ticks: 0 }
], Ja = ([d, c, u], P) => {
  const j = Math.cos(P), M = Math.sin(P);
  return [d, c * j - u * M, c * M + u * j];
}, qa = ([d, c, u], P) => {
  const j = Math.cos(P), M = Math.sin(P);
  return [d * j + u * M, c, -d * M + u * j];
}, ba = ([d, c, u], P) => {
  const j = Math.cos(P), M = Math.sin(P);
  return [d * j - c * M, d * M + c * j, u];
}, gd = {
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
}, me = (d, c) => `rgba(${d[0]},${d[1]},${d[2]},${Math.max(0, Math.min(1, c))})`, Ul = {
  idle: { spin: 0.16, bees: 1, rings: 1, sparks: 0.3, glow: 0.45, gather: 0 },
  listening: { spin: 0.1, bees: 0.7, rings: 0.6, sparks: 0.2, glow: 0.6, gather: 0.3 },
  thinking: { spin: 0.55, bees: 1.9, rings: 3.2, sparks: 1, glow: 0.8, gather: 0.1 },
  speaking: { spin: 0.22, bees: 1.2, rings: 1.4, sparks: 0.55, glow: 0.55, gather: 0 }
};
class yd {
  constructor(c, u = {}) {
    Fe(this, "ctx");
    Fe(this, "opts");
    Fe(this, "raf", 0);
    Fe(this, "last", 0);
    Fe(this, "t", 0);
    Fe(this, "acc", { spin: 0.6, bees: 3, rings: 1.2, sparks: 0 });
    Fe(this, "cur", { ...Ul.idle });
    Fe(this, "ro");
    Fe(this, "heading", new Array(jr).fill(0));
    Fe(this, "w", 0);
    Fe(this, "h", 0);
    Fe(this, "dpr", 1);
    this.canvas = c, this.ctx = c.getContext("2d"), this.opts = { state: "idle", tone: "dark", still: !1, ...u }, this.cur = { ...Ul[this.opts.state] }, this.resize(), typeof ResizeObserver < "u" && (this.ro = new ResizeObserver(() => {
      this.resize(), this.opts.still && this.frame(0);
    }), this.ro.observe(c)), this.opts.still ? this.frame(0) : this.loop();
  }
  set(c) {
    const u = this.opts.still;
    this.opts = { ...this.opts, ...c }, this.opts.still ? (cancelAnimationFrame(this.raf), this.raf = 0, this.cur = { ...Ul[this.opts.state] }, this.frame(0)) : (u || !this.raf) && this.loop();
  }
  destroy() {
    var c;
    cancelAnimationFrame(this.raf), this.raf = 0, (c = this.ro) == null || c.disconnect();
  }
  resize() {
    this.dpr = Math.min(2, typeof devicePixelRatio == "number" && devicePixelRatio || 1);
    const c = this.canvas.getBoundingClientRect();
    this.w = Math.max(1, Math.round((c.width || this.canvas.width) * this.dpr)), this.h = Math.max(1, Math.round((c.height || this.canvas.height) * this.dpr)), this.canvas.width !== this.w && (this.canvas.width = this.w), this.canvas.height !== this.h && (this.canvas.height = this.h);
  }
  loop() {
    this.last = performance.now();
    const c = (u) => {
      const P = Math.min(0.05, (u - this.last) / 1e3);
      this.last = u, this.frame(P), this.raf = requestAnimationFrame(c);
    };
    this.raf = requestAnimationFrame(c);
  }
  frame(c) {
    const u = Ul[this.opts.state], P = Math.min(1, c * 2.5);
    for (const j of Object.keys(u)) this.cur[j] += (u[j] - this.cur[j]) * P;
    this.t += c, this.acc.spin += this.cur.spin * c, this.acc.bees += this.cur.bees * c, this.acc.rings += this.cur.rings * c, this.acc.sparks += (0.25 + this.cur.sparks * 0.9) * c, this.draw();
  }
  level() {
    const c = this.opts.state;
    if (c !== "listening" && c !== "speaking") return 0;
    if (typeof this.opts.level == "number") return Math.max(0, Math.min(1, this.opts.level));
    const u = this.t;
    return c === "speaking" ? 0.5 + 0.5 * Math.sin(u * 9) * Math.sin(u * 2.3) : 0.3 + 0.2 * Math.sin(u * 3);
  }
  draw() {
    const { ctx: c, w: u, h: P } = this, j = gd[this.opts.tone], M = u / 2, R = P / 2, z = Math.min(u, P) / 2 / 1.86, g = 5, _ = this.level(), B = this.acc.spin, Z = 0.38 + 0.12 * Math.sin(this.t * 0.31), $ = 0.08 * Math.sin(this.t * 0.23), ue = (w) => Ja(ba(qa(w, B), $), Z), le = (w) => {
      const k = g / (g - w[2]);
      return { x: M + w[0] * z * k, y: R - w[1] * z * k, z: w[2], s: k };
    }, ne = (w) => (w + 1) / 2;
    c.clearRect(0, 0, u, P);
    const re = this.cur.glow + _ * 0.5, Ne = c.createRadialGradient(M, R, 0, M, R, z * 1.6);
    Ne.addColorStop(0, me(j.glow, 0.26 * re)), Ne.addColorStop(0.45, me(j.glow, 0.1 * re)), Ne.addColorStop(1, me(j.glow, 0)), c.fillStyle = Ne, c.fillRect(0, 0, u, P);
    const b = [], F = [], Q = [];
    vd.forEach((w, k) => {
      const a = w.phase + this.acc.rings * w.precess, x = (K, ie = w.r) => qa(ba(Ja([Math.cos(K) * ie, 0, Math.sin(K) * ie], w.tiltX), w.tiltZ), a), I = 96, W = [];
      let X = le(x(0));
      for (let K = 1; K <= I; K++) {
        const ie = x(K / I * lt), xe = le(ie);
        W.push({ a: X, b: xe, z: (X.z + xe.z) / 2, wd: w.width }), X = xe;
      }
      b.push(W);
      const G = [], oe = this.acc.rings * 0.35 * (k ? -1 : 1);
      for (let K = 0; K < w.ticks; K++) {
        const ie = K / w.ticks * lt + oe, xe = K % 3 === 0 ? 0.07 : 0.035, dt = le(x(ie, w.r - xe)), An = le(x(ie, w.r + xe));
        G.push({ a: dt, b: An, z: (dt.z + An.z) / 2 });
      }
      if (F.push(G), k === 0) for (const K of [0, Math.PI]) Q.push(le(x(oe * 1.6 + K)));
      else Q.push(le(x(-oe * 1.2 + 1)));
    });
    const J = (w) => {
      c.lineCap = "round", b.forEach((k) => {
        for (const a of k) {
          if (a.z >= 0 !== w) continue;
          const x = ne(a.z);
          c.strokeStyle = `rgb(${j.ringLo.map((I, W) => Math.round(I + (j.ringHi[W] - I) * x)).join(",")})`, c.globalAlpha = w ? 1 : 0.55, c.lineWidth = Math.max(this.dpr * 1.2, z * a.wd * a.a.s), c.beginPath(), c.moveTo(a.a.x, a.a.y), c.lineTo(a.b.x, a.b.y), c.stroke();
        }
      }), c.lineWidth = z * 8e-3;
      for (const k of F) for (const a of k)
        a.z >= 0 === w && (c.strokeStyle = me(j.ringHi, (w ? 0.9 : 0.35) * (0.4 + 0.6 * ne(a.z))), c.beginPath(), c.moveTo(a.a.x, a.a.y), c.lineTo(a.b.x, a.b.y), c.stroke());
      for (const k of Q) {
        if (k.z >= 0 !== w) continue;
        c.globalAlpha = w ? 1 : 0.5;
        const a = z * 0.034 * k.s, x = c.createRadialGradient(k.x - a * 0.3, k.y - a * 0.3, a * 0.1, k.x, k.y, a);
        x.addColorStop(0, me(j.spark, 1)), x.addColorStop(1, me(j.ringLo, 1)), c.fillStyle = x, c.beginPath(), c.arc(k.x, k.y, a, 0, lt), c.fill();
      }
      c.globalAlpha = 1;
    };
    J(!1);
    const q = Wo.map(ue), ee = q.map(le), Ce = (w) => {
      for (const [k, a] of Ko) {
        const x = (q[k][2] + q[a][2]) / 2;
        x >= -0.05 === w && (c.strokeStyle = w ? me(j.edge, 0.55 + 0.45 * ne(x)) : me(j.edgeBack, this.opts.tone === "light" ? 0.45 : 0.32), c.lineWidth = Math.max(this.dpr * (w ? 1 : 0.6), z * (w ? 0.013 : 8e-3)), c.beginPath(), c.moveTo(ee[k].x, ee[k].y), c.lineTo(ee[a].x, ee[a].y), c.stroke());
      }
    };
    Ce(!1);
    const it = 1 - this.cur.gather, Ve = Za.map((w) => {
      const k = (I) => [w.a[0] * Math.sin(w.w[0] * I + w.p[0]) * it, w.a[1] * Math.sin(w.w[1] * I + w.p[1]) * it, w.a[2] * Math.cos(w.w[2] * I + w.p[2]) * it], a = ue(k(this.acc.bees)), x = le(ue(k(this.acc.bees + 0.05)));
      return { v: a, p: le(a), next: x };
    }), Me = le([0, 0, 0]), be = (w, k, a) => a === "a" && w === nc ? Me : k === "shell" && a === "b" ? ee[w] : Ve[w].p, Oe = Pr.map((w) => ({ l: w, A: be(w.a, w.kind, "a"), B: be(w.b, w.kind, "b") })), Qe = (w, k) => {
      const a = Math.hypot(k.x - w.x, k.y - w.y);
      return { mx: (w.x + k.x) / 2, my: (w.y + k.y) / 2 + a * 0.12 };
    };
    c.lineCap = "round";
    for (const { l: w, A: k, B: a } of Oe) {
      const { mx: x, my: I } = Qe(k, a), W = (k.z + a.z) / 2;
      c.strokeStyle = me(j.thread, (w.kind === "core" ? 0.6 : w.kind === "shell" ? 0.35 : 0.5) * (0.5 + 0.5 * ne(W))), c.lineWidth = Math.max(this.dpr * 0.6, z * (w.kind === "core" ? 9e-3 : 65e-4)), c.beginPath(), c.moveTo(k.x, k.y), c.quadraticCurveTo(x, I, a.x, a.y), c.stroke();
    }
    for (const { l: w, A: k, B: a } of Oe) {
      if (w.kind === "shell") continue;
      const x = this.cur.sparks;
      if (w.seed > x + 0.15) continue;
      const I = (this.acc.sparks * (0.6 + w.seed) + w.seed * 7) % 1, { mx: W, my: X } = Qe(k, a), G = 1 - I, oe = G * G * k.x + 2 * G * I * W + I * I * a.x, K = G * G * k.y + 2 * G * I * X + I * I * a.y, ie = z * 0.018 * (0.6 + x * 0.6), xe = Math.sin(I * Math.PI), dt = c.createRadialGradient(oe, K, 0, oe, K, ie * 2.4);
      dt.addColorStop(0, me(j.spark, 0.95 * xe)), dt.addColorStop(1, me(j.spark, 0)), c.fillStyle = dt, c.beginPath(), c.arc(oe, K, ie * 2.4, 0, lt), c.fill();
    }
    const Ke = z * (0.085 + 0.035 * _ + 0.01 * Math.sin(this.t * 2)), ze = c.createRadialGradient(Me.x, Me.y, 0, Me.x, Me.y, Ke * 3.2);
    ze.addColorStop(0, me(j.core, 0.55 * re)), ze.addColorStop(1, me(j.core, 0)), c.fillStyle = ze, c.beginPath(), c.arc(Me.x, Me.y, Ke * 3.2, 0, lt), c.fill(), this.hex(Me.x, Me.y, Ke, this.acc.spin * 0.5, j);
    const ve = Ve.map((w, k) => k).sort((w, k) => Ve[w].v[2] - Ve[k].v[2]);
    for (const w of ve) {
      const k = Ve[w];
      let x = Math.atan2(k.next.y - k.p.y, k.next.x - k.p.x) - this.heading[w];
      x = ((x + Math.PI) % lt + lt) % lt - Math.PI, this.heading[w] += this.opts.still ? x : x * 0.15;
      const I = 0.35 + 0.65 * Math.abs(Math.sin(this.t * 26 + Za[w].flap));
      this.bee(k.p.x, k.p.y, z * 0.15 * k.p.s, this.heading[w], I, 0.55 + 0.45 * ne(k.v[2]), j);
    }
    const T = [-0.4, 0.6, 0.7];
    for (const [w, k, a] of tc) {
      const x = q[w], I = q[k], W = q[a], X = [(x[0] + I[0] + W[0]) / 3, (x[1] + I[1] + W[1]) / 3, (x[2] + I[2] + W[2]) / 3];
      if (X[2] <= 0) continue;
      const G = Math.max(0, (X[0] * T[0] + X[1] * T[1] + X[2] * T[2]) / Math.hypot(...X));
      c.fillStyle = me(j.face, 0.03 + 0.07 * G * G), c.beginPath(), c.moveTo(ee[w].x, ee[w].y), c.lineTo(ee[k].x, ee[k].y), c.lineTo(ee[a].x, ee[a].y), c.closePath(), c.fill();
    }
    Ce(!0);
    for (let w = 0; w < 12; w++)
      q[w][2] < -0.05 || (c.fillStyle = me(j.edge, 0.6 + 0.4 * ne(q[w][2])), c.beginPath(), c.arc(ee[w].x, ee[w].y, z * 0.02 * ee[w].s, 0, lt), c.fill());
    J(!0);
  }
  hex(c, u, P, j, M) {
    const { ctx: R } = this, z = Array.from({ length: 6 }, (g, _) => [c + P * Math.cos(j + _ * lt / 6), u + P * Math.sin(j + _ * lt / 6)]);
    for (let g = 0; g < 6; g++) {
      const [_, B] = z[g], [Z, $] = z[(g + 1) % 6];
      R.fillStyle = me(M.bee[g % 3], 1), R.beginPath(), R.moveTo(c, u), R.lineTo(_, B), R.lineTo(Z, $), R.closePath(), R.fill();
    }
    R.strokeStyle = me(M.spark, 0.9), R.lineWidth = P * 0.12, R.beginPath(), z.forEach(([g, _], B) => B ? R.lineTo(g, _) : R.moveTo(g, _)), R.closePath(), R.stroke();
  }
  /** One low-poly bee seen from above, facing +x in its own space. */
  bee(c, u, P, j, M, R, z) {
    const { ctx: g } = this;
    g.save(), g.translate(c, u), g.rotate(j), g.scale(P, P), g.globalAlpha = R;
    const _ = ($) => {
      g.beginPath(), $.forEach(([ue, le], ne) => ne ? g.lineTo(ue, le) : g.moveTo(ue, le)), g.closePath();
    };
    g.fillStyle = me(z.head, 1), _([[-1.02, -0.08], [-1.28, 0], [-1.02, 0.08]]), g.fill();
    const B = [[-1.05, 0], [-0.78, -0.4], [-0.2, -0.5], [0.28, -0.36], [0.46, 0], [0.28, 0.36], [-0.2, 0.5], [-0.78, 0.4]], Z = [-0.3, 0];
    for (let $ = 0; $ < B.length; $++)
      g.fillStyle = me(z.bee[$ % 3], 1), _([Z, B[$], B[($ + 1) % B.length]]), g.fill();
    g.save(), _(B), g.clip(), g.fillStyle = me(z.stripe, 0.92), _([[-0.26, -0.6], [-0.44, -0.6], [-0.5, 0.6], [-0.32, 0.6]]), g.fill(), _([[-0.64, -0.6], [-0.8, -0.6], [-0.86, 0.6], [-0.7, 0.6]]), g.fill(), g.restore(), g.fillStyle = me(z.head, 1), _([[0.42, 0], [0.58, -0.27], [0.86, -0.2], [0.95, 0], [0.86, 0.2], [0.58, 0.27]]), g.fill(), g.fillStyle = me(z.bee[1], 0.9), _([[0.7, -0.2], [0.84, -0.14], [0.74, -0.08]]), g.fill(), _([[0.7, 0.2], [0.84, 0.14], [0.74, 0.08]]), g.fill(), g.strokeStyle = me(z.head, 1), g.lineWidth = 0.06, g.lineCap = "round", g.beginPath(), g.moveTo(0.9, -0.1), g.lineTo(1.08, -0.2), g.lineTo(1.2, -0.4), g.moveTo(0.9, 0.1), g.lineTo(1.08, 0.2), g.lineTo(1.2, 0.4), g.stroke();
    for (const $ of [-1, 1]) {
      const ue = $ * M, le = [[0.22, 0.16 * $], [0.05, 1.08 * ue], [-0.5, 0.92 * ue], [-0.22, 0.24 * $]];
      g.fillStyle = me(z.wing, 0.38), _(le), g.fill(), g.strokeStyle = me(z.bee[1], 0.85), g.lineWidth = 0.04, g.stroke(), g.beginPath(), g.moveTo(0.05, 0.2 * $), g.lineTo(-0.22, 0.95 * ue), g.stroke();
    }
    g.restore();
  }
}
const ec = () => typeof matchMedia == "function" && matchMedia("(prefers-reduced-motion: reduce)").matches;
function wd({ size: d = 160, state: c = "idle", level: u, tone: P = "dark", still: j, className: M }) {
  const R = fe.useRef(null), z = fe.useRef();
  return fe.useEffect(() => (z.current = new yd(R.current, { state: c, level: u, tone: P, still: j ?? ec() }), () => {
    var g;
    return (g = z.current) == null ? void 0 : g.destroy();
  }), []), fe.useEffect(() => {
    var g;
    (g = z.current) == null || g.set({ state: c, level: u, tone: P, still: j ?? ec() });
  }, [c, u, P, j]), /* @__PURE__ */ h.jsx("canvas", { ref: R, className: M, style: { width: d, height: d, display: "block" }, role: "img", "aria-label": `FAITH (${c})` });
}
const xd = { today: "mdi:calendar-today", meals: "mdi:silverware-fork-knife", shopping: "mdi:cart-outline", chores: "mdi:broom", home: "mdi:home-outline", approvals: "mdi:shield-check-outline" }, kd = (d) => d.split(/\s+/).map((c) => c[0]).join("").slice(0, 2).toUpperCase(), _r = ({ p: d, size: c = 40 }) => /* @__PURE__ */ h.jsx("span", { className: "avatar", style: { width: c, height: c, fontSize: c * 0.38, background: d.color || "var(--fc-accent)" }, children: kd(d.name) });
function $l(d) {
  if (!d) return "";
  if (/^\d{2}:\d{2}$/.test(d)) {
    const [c, u] = d.split(":").map(Number);
    return new Date(2e3, 0, 1, c, u).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
  }
  if (/^\d{4}-\d{2}-\d{2}$/.test(d)) {
    const c = /* @__PURE__ */ new Date(`${d}T12:00:00`), u = Math.round((new Date(c.toDateString()).getTime() - new Date((/* @__PURE__ */ new Date()).toDateString()).getTime()) / 864e5);
    return u === 0 ? "Today" : u === 1 ? "Tomorrow" : c.toLocaleDateString([], { weekday: "short", day: "numeric" });
  }
  return d;
}
function Yo(d, c, u = {}, P = 6e4) {
  const [j, M] = fe.useState(null), [R, z] = fe.useState(""), g = fe.useCallback(() => d.call(c, u).then((_) => {
    M(_), z("");
  }).catch((_) => z(_.message)), [d, c, JSON.stringify(u)]);
  return fe.useEffect(() => {
    g();
    const _ = setInterval(g, P), B = (Z) => {
      var ue;
      const $ = (ue = Z.detail) == null ? void 0 : ue.screen;
      (!$ || $ === d.screen) && g();
    };
    return window.addEventListener("faith-hub-changed", B), () => {
      clearInterval(_), window.removeEventListener("faith-hub-changed", B);
    };
  }, [g, P]), { data: j, err: R, load: g };
}
function Sd({ api: d, items: c, can: u, onDone: P }) {
  const [j, M] = fe.useState(""), R = (z, g) => d.call(`/api/ha/approvals/${z}`, { approve: g }).then((_) => {
    M(_.text), P();
  }).catch((_) => M(_.message));
  return /* @__PURE__ */ h.jsxs(h.Fragment, { children: [
    /* @__PURE__ */ h.jsx("ul", { children: c.map((z) => /* @__PURE__ */ h.jsxs("li", { className: "row", children: [
      /* @__PURE__ */ h.jsxs("div", { className: "grow", children: [
        /* @__PURE__ */ h.jsx("div", { children: z.summary }),
        /* @__PURE__ */ h.jsxs("div", { className: "meta", children: [
          "Asked by ",
          z.requested_by.replace(/^household on /, "the ")
        ] })
      ] }),
      u && /* @__PURE__ */ h.jsxs("div", { className: "btns", children: [
        /* @__PURE__ */ h.jsx("button", { className: "primary", onClick: () => R(z.id, !0), children: "Approve" }),
        /* @__PURE__ */ h.jsx("button", { onClick: () => R(z.id, !1), children: "Deny" })
      ] })
    ] }, z.id)) }),
    !u && /* @__PURE__ */ h.jsx("div", { className: "meta", children: "A grown-up approves these (signed in here, or on their phone)." }),
    j && /* @__PURE__ */ h.jsx("div", { className: "toast", children: j })
  ] });
}
function Ed({ c: d, api: c, can: u, reload: P }) {
  var z;
  const j = d.items ?? [];
  let M;
  d.error ? M = /* @__PURE__ */ h.jsx("div", { className: "err", children: d.error }) : d.empty ? M = /* @__PURE__ */ h.jsx("div", { className: "empty", children: d.empty }) : d.kind === "schedule" ? M = /* @__PURE__ */ h.jsx("ul", { children: j.map((g, _) => /* @__PURE__ */ h.jsxs("li", { className: "row", children: [
    /* @__PURE__ */ h.jsx("span", { className: "time", children: $l(g.time) }),
    /* @__PURE__ */ h.jsxs("div", { className: "grow", children: [
      /* @__PURE__ */ h.jsx("div", { children: g.title }),
      g.meta && /* @__PURE__ */ h.jsx("div", { className: "meta", children: g.meta })
    ] })
  ] }, _)) }) : d.kind === "meals" ? M = /* @__PURE__ */ h.jsx("ul", { children: j.map((g, _) => /* @__PURE__ */ h.jsxs("li", { className: "row", children: [
    /* @__PURE__ */ h.jsxs("span", { className: "label grow", children: [
      g.label,
      g.time && $l(g.time) !== "Today" ? ` · ${$l(g.time)}` : ""
    ] }),
    /* @__PURE__ */ h.jsx("span", { children: g.title })
  ] }, _)) }) : d.kind === "checklist" || d.kind === "list" ? M = /* @__PURE__ */ h.jsx("ul", { children: j.map((g, _) => /* @__PURE__ */ h.jsxs("li", { className: "row", children: [
    d.kind === "checklist" && /* @__PURE__ */ h.jsx("span", { className: `check ${g.done ? "done" : ""}` }),
    /* @__PURE__ */ h.jsxs("span", { className: "grow", children: [
      g.label && /* @__PURE__ */ h.jsxs("span", { className: "label", children: [
        g.label,
        " "
      ] }),
      g.title
    ] }),
    (g.meta || g.time) && /* @__PURE__ */ h.jsx("span", { className: "meta", children: g.meta || $l(g.time) })
  ] }, _)) }) : d.kind === "entities" ? M = /* @__PURE__ */ h.jsx("div", { className: "tiles", children: (d.entities ?? []).map((g) => /* @__PURE__ */ h.jsxs("div", { className: "tile", children: [
    /* @__PURE__ */ h.jsx("div", { className: "meta", children: g.name }),
    /* @__PURE__ */ h.jsx("div", { className: "v", children: g.state })
  ] }, g.entity_id)) }) : d.kind === "approvals" ? M = /* @__PURE__ */ h.jsx(Sd, { api: c, items: d.approvals ?? [], can: u, onDone: P }) : M = /* @__PURE__ */ h.jsx("div", { style: { whiteSpace: "pre-wrap" }, children: d.text });
  const R = d.kind === "checklist" ? j.length : d.kind === "approvals" ? (z = d.approvals) == null ? void 0 : z.length : void 0;
  return /* @__PURE__ */ h.jsxs("div", { className: "section", children: [
    /* @__PURE__ */ h.jsxs("h3", { children: [
      /* @__PURE__ */ h.jsx("ha-icon", { icon: xd[d.id] || "mdi:note-text-outline" }),
      d.title,
      R ? /* @__PURE__ */ h.jsx("span", { className: "count", children: R }) : null
    ] }),
    M
  ] });
}
function Cd({ api: d, config: c }) {
  const { data: u, err: P, load: j } = Yo(d, "/api/ha/view", c.cards ? { cards: c.cards } : {});
  if (P) return /* @__PURE__ */ h.jsx("ha-card", { children: /* @__PURE__ */ h.jsx("div", { className: "err", children: P }) });
  if (!u) return /* @__PURE__ */ h.jsx("ha-card", { children: /* @__PURE__ */ h.jsx("div", { className: "empty", children: "Loading…" }) });
  const M = u.person ? `${u.person.name}'s` : "The family's";
  return /* @__PURE__ */ h.jsxs("ha-card", { children: [
    c.title !== "" && /* @__PURE__ */ h.jsxs(h.Fragment, { children: [
      /* @__PURE__ */ h.jsx("div", { className: "eyebrow", children: (/* @__PURE__ */ new Date()).toLocaleDateString([], { weekday: "long", month: "long", day: "numeric" }) }),
      /* @__PURE__ */ h.jsx("div", { className: "hello", children: c.title ?? /* @__PURE__ */ h.jsxs(h.Fragment, { children: [
        M,
        " ",
        /* @__PURE__ */ h.jsx("em", { children: "day" }),
        ", at a glance."
      ] }) })
    ] }),
    c.show_apps !== !1 && u.apps.length > 0 && /* @__PURE__ */ h.jsx("div", { className: "section", children: /* @__PURE__ */ h.jsx("div", { className: "apps", children: u.apps.map((R) => /* @__PURE__ */ h.jsxs("a", { href: R.url, target: "_blank", rel: "noreferrer", children: [
      /* @__PURE__ */ h.jsx("span", { children: R.icon || "↗" }),
      R.name
    ] }, R.id)) }) }),
    u.cards.map((R) => /* @__PURE__ */ h.jsx(Ed, { c: R, api: d, can: u.can_approve, reload: j }, R.id)),
    !u.cards.length && /* @__PURE__ */ h.jsx("div", { className: "empty", children: "Nothing to show yet." })
  ] });
}
function _d({ api: d, config: c }) {
  var Ne;
  const { data: u, err: P, load: j } = Yo(d, "/api/ha/view", { cards: [] }, 1e4), [M, R] = fe.useState(null), [z, g] = fe.useState(null), [_, B] = fe.useState(""), [Z, $] = fe.useState(""), ue = fe.useRef(0);
  if (fe.useEffect(() => {
    if (!(u != null && u.hub)) return;
    const b = () => {
      Date.now() - ue.current > 15e3 && (ue.current = Date.now(), d.call("/api/ha/hub/activity").catch(() => {
      }));
    };
    return window.addEventListener("pointerdown", b, !0), () => window.removeEventListener("pointerdown", b, !0);
  }, [(Ne = u == null ? void 0 : u.hub) == null ? void 0 : Ne.person.id]), fe.useEffect(() => {
    u && !u.hub && u.household && d.screen && localStorage.getItem(`faith.hub.${d.screen}`) && Ho(d.screen, null);
  }, [u]), !d.screen) return /* @__PURE__ */ h.jsx("ha-card", { children: /* @__PURE__ */ h.jsxs("div", { className: "err", children: [
    "Give this card the screen it's on: ",
    /* @__PURE__ */ h.jsx("code", { children: "screen: kitchen" })
  ] }) });
  if (P) return /* @__PURE__ */ h.jsx("ha-card", { children: /* @__PURE__ */ h.jsx("div", { className: "err", children: P }) });
  if (!u) return /* @__PURE__ */ h.jsx("ha-card", { children: /* @__PURE__ */ h.jsx("div", { className: "empty", children: "…" }) });
  const le = async (b) => {
    $("");
    try {
      const F = await d.call("/api/ha/hub/signin", b);
      Ho(d.screen, F.hub_session), g(null), B(""), R(null);
    } catch (F) {
      $(F.message), B("");
    }
  }, ne = async () => {
    await d.call("/api/ha/hub/signout").catch(() => {
    }), Ho(d.screen, null), j();
  };
  if (u.hub) return /* @__PURE__ */ h.jsx("ha-card", { children: /* @__PURE__ */ h.jsxs("div", { className: "head", children: [
    /* @__PURE__ */ h.jsx(_r, { p: u.hub.person, size: 44 }),
    /* @__PURE__ */ h.jsxs("div", { children: [
      /* @__PURE__ */ h.jsx("h2", { children: u.hub.person.name }),
      /* @__PURE__ */ h.jsxs("div", { className: "sub", children: [
        "Signed in on this screen",
        u.hub.remaining_seconds < 60 ? ` · signing out in ${u.hub.remaining_seconds}s` : ""
      ] })
    ] }),
    /* @__PURE__ */ h.jsx("div", { className: "right", children: /* @__PURE__ */ h.jsx("button", { onClick: ne, children: "Sign out" }) })
  ] }) });
  if (u.person) return /* @__PURE__ */ h.jsx("ha-card", { children: /* @__PURE__ */ h.jsxs("div", { className: "head", children: [
    /* @__PURE__ */ h.jsx(_r, { p: u.person, size: 44 }),
    /* @__PURE__ */ h.jsxs("div", { children: [
      /* @__PURE__ */ h.jsx("h2", { children: u.person.name }),
      /* @__PURE__ */ h.jsx("div", { className: "sub", children: "Your own Home Assistant account" })
    ] })
  ] }) });
  if (!M && !z) return /* @__PURE__ */ h.jsxs("ha-card", { children: [
    /* @__PURE__ */ h.jsxs("div", { className: "head", children: [
      /* @__PURE__ */ h.jsx("ha-icon", { icon: "mdi:account-group-outline" }),
      /* @__PURE__ */ h.jsxs("div", { children: [
        /* @__PURE__ */ h.jsx("h2", { children: "Shared view" }),
        /* @__PURE__ */ h.jsx("div", { className: "sub", children: "Everyone sees the family's things. Sign in for your own." })
      ] }),
      /* @__PURE__ */ h.jsx("div", { className: "right", children: /* @__PURE__ */ h.jsx("button", { className: "primary", onClick: () => d.call("/api/ha/hub/people").then((b) => {
        R(b);
        const F = b.people.find((Q) => Q.id === b.suggested);
        F && g(F);
      }).catch((b) => $(b.message)), children: "Sign in" }) })
    ] }),
    Z && /* @__PURE__ */ h.jsx("div", { className: "err", children: Z })
  ] });
  if (!z) return /* @__PURE__ */ h.jsxs("ha-card", { children: [
    /* @__PURE__ */ h.jsxs("div", { className: "head", children: [
      /* @__PURE__ */ h.jsx("h2", { children: "Who's here?" }),
      /* @__PURE__ */ h.jsx("div", { className: "right", children: /* @__PURE__ */ h.jsx("button", { className: "ghost", onClick: () => R(null), children: "Cancel" }) })
    ] }),
    /* @__PURE__ */ h.jsx("div", { className: "people", children: M.people.map((b) => /* @__PURE__ */ h.jsxs("button", { className: `person ${M.suggested === b.id ? "suggested" : ""}`, onClick: () => g(b), children: [
      /* @__PURE__ */ h.jsx(_r, { p: b, size: 52 }),
      b.name
    ] }, b.id)) }),
    Z && /* @__PURE__ */ h.jsx("div", { className: "err", children: Z })
  ] });
  const re = (b) => B((F) => (F + b).slice(0, 8));
  return /* @__PURE__ */ h.jsxs("ha-card", { children: [
    /* @__PURE__ */ h.jsxs("div", { className: "head", children: [
      /* @__PURE__ */ h.jsx(_r, { p: z, size: 44 }),
      /* @__PURE__ */ h.jsxs("h2", { children: [
        "Hi, ",
        z.name
      ] }),
      /* @__PURE__ */ h.jsx("div", { className: "right", children: /* @__PURE__ */ h.jsx("button", { className: "ghost", onClick: () => {
        g(null), B(""), $("");
      }, children: "Back" }) })
    ] }),
    /* @__PURE__ */ h.jsxs("div", { className: "pin", children: [
      (M == null ? void 0 : M.face_unlock) && M.suggested === z.id && /* @__PURE__ */ h.jsx("button", { className: "primary", onClick: () => le({ person: z.id, face: !0 }), children: "It's me (camera)" }),
      /* @__PURE__ */ h.jsx("div", { className: "dots", children: Array.from({ length: Math.max(4, _.length) }, (b, F) => /* @__PURE__ */ h.jsx("span", { className: F < _.length ? "on" : "" }, F)) }),
      /* @__PURE__ */ h.jsxs("div", { className: "keys", children: [
        ["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((b) => /* @__PURE__ */ h.jsx("button", { onClick: () => re(b), children: b }, b)),
        /* @__PURE__ */ h.jsx("button", { onClick: () => B(_.slice(0, -1)), children: "⌫" }),
        /* @__PURE__ */ h.jsx("button", { onClick: () => re("0"), children: "0" }),
        /* @__PURE__ */ h.jsx("button", { className: "primary", disabled: _.length < 4, onClick: () => le({ person: z.id, pin: _ }), children: "OK" })
      ] }),
      Z && /* @__PURE__ */ h.jsx("div", { className: "err", children: Z })
    ] })
  ] });
}
const Nd = [
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
], jd = (d) => {
  var c;
  return ((c = Nd.find(([u]) => u.test(d))) == null ? void 0 : c[1]) ?? d.replace(/_/g, " ");
};
function Pd({ api: d, config: c }) {
  const [u, P] = fe.useState([]), [j, M] = fe.useState(""), [R, z] = fe.useState(!1), [g, _] = fe.useState(null), [B, Z] = fe.useState(0), $ = fe.useRef(null), ue = fe.useRef(null), le = fe.useCallback(() => {
    $.current = null, d.call("/api/ha/chat/history").then((F) => {
      $.current = F.conversation_id, P(F.messages.map((Q) => ({ me: Q.role === "user", text: Q.content })));
    }).catch(() => P([]));
  }, [d]);
  fe.useEffect(() => {
    le();
    const F = (Q) => {
      var J;
      ((J = Q.detail) == null ? void 0 : J.screen) === d.screen && le();
    };
    return window.addEventListener("faith-hub-changed", F), () => window.removeEventListener("faith-hub-changed", F);
  }, [le]), fe.useEffect(() => {
    var F;
    (F = ue.current) == null || F.scrollIntoView({ block: "nearest" });
  }, [u]);
  const [, ne] = fe.useState(0);
  fe.useEffect(() => {
    if (!B) return;
    const F = setTimeout(() => ne((Q) => Q + 1), 3100);
    return () => clearTimeout(F);
  }, [B]);
  const re = async (F, Q) => {
    z(!0), P((J) => [...J, ...Q ? [{ me: !0, text: Q }] : [], { text: "…" }]);
    try {
      const J = await d.call("/api/ha/chat", { ...F, conversation_id: $.current });
      $.current = J.conversation_id, P((q) => [
        ...q.slice(0, -1),
        ...J.heard ? [{ me: !0, text: J.heard + (J.speaker ? ` (${J.speaker.name})` : "") }] : [],
        ...J.confirms.map((ee) => ({ text: "", confirm: ee })),
        ...J.approvals.map((ee) => ({ text: "", waiting: ee.summary })),
        { text: J.text, tools: J.tools }
      ]), Z(Date.now());
    } catch (J) {
      P((q) => [...q.slice(0, -1), { text: `Sorry, that didn't work: ${J.message}` }]);
    } finally {
      z(!1);
    }
  }, Ne = async () => {
    if (g) {
      g.stop(), _(null);
      return;
    }
    try {
      const F = await navigator.mediaDevices.getUserMedia({ audio: !0 }), Q = new MediaRecorder(F), J = [];
      Q.ondataavailable = (q) => q.data.size && J.push(q.data), Q.onstop = async () => {
        F.getTracks().forEach((Ce) => Ce.stop());
        const q = new Blob(J, { type: Q.mimeType || "audio/webm" }), ee = btoa(String.fromCharCode(...new Uint8Array(await q.arrayBuffer())));
        re({ audio: ee, mime: q.type.split(";")[0] }, "");
      }, Q.start(), _(Q);
    } catch {
      P((F) => [...F, { text: "The microphone isn't available (Home Assistant needs https for it)." }]);
    }
  }, b = (F, Q) => d.call(`/api/ha/confirm/${F}`, { approve: Q }).then((J) => P((q) => q.map((ee) => {
    var Ce;
    return ((Ce = ee.confirm) == null ? void 0 : Ce.id) === F ? { ...ee, confirm: { ...ee.confirm, done: J.text } } : ee;
  }))).catch((J) => P((q) => [...q, { text: J.message }]));
  return /* @__PURE__ */ h.jsxs("ha-card", { children: [
    /* @__PURE__ */ h.jsxs("div", { className: "head", children: [
      /* @__PURE__ */ h.jsx(wd, { className: "emblem", size: 56, tone: d.dark ? "dark" : "light", state: g ? "listening" : R ? "thinking" : Date.now() - B < 3e3 ? "speaking" : "idle" }),
      /* @__PURE__ */ h.jsx("h2", { children: c.title ?? "Ask FAITH" }),
      u.length > 0 && /* @__PURE__ */ h.jsx("div", { className: "right", children: /* @__PURE__ */ h.jsx("button", { className: "ghost", onClick: () => {
        $.current = null, P([]);
      }, children: "New" }) })
    ] }),
    /* @__PURE__ */ h.jsxs("div", { className: "chat", children: [
      !u.length && /* @__PURE__ */ h.jsx("div", { className: "empty", children: "What's on today? What's for dinner? Add milk to the list. Turn off the lights." }),
      u.map((F, Q) => {
        var J;
        return F.confirm ? /* @__PURE__ */ h.jsxs("div", { className: "box", children: [
          /* @__PURE__ */ h.jsxs("div", { children: [
            "Do this? ",
            /* @__PURE__ */ h.jsx("b", { children: F.confirm.summary })
          ] }),
          F.confirm.done ? /* @__PURE__ */ h.jsx("div", { className: "meta", children: F.confirm.done }) : /* @__PURE__ */ h.jsxs("div", { className: "btns", children: [
            /* @__PURE__ */ h.jsx("button", { className: "primary", onClick: () => b(F.confirm.id, !0), children: "Yes" }),
            /* @__PURE__ */ h.jsx("button", { onClick: () => b(F.confirm.id, !1), children: "No" })
          ] })
        ] }, Q) : F.waiting ? /* @__PURE__ */ h.jsx("div", { className: "box wait", children: /* @__PURE__ */ h.jsxs("div", { children: [
          "Waiting for a grown-up: ",
          /* @__PURE__ */ h.jsx("b", { children: F.waiting })
        ] }) }, Q) : /* @__PURE__ */ h.jsxs("div", { style: { display: "flex", flexDirection: "column", gap: 4, alignItems: F.me ? "flex-end" : "flex-start" }, children: [
          /* @__PURE__ */ h.jsx("div", { className: `msg ${F.me ? "me" : "faith"}`, children: F.text }),
          !!((J = F.tools) != null && J.length) && /* @__PURE__ */ h.jsx("div", { className: "chips", children: [...new Set(F.tools.map(jd))].map((q) => /* @__PURE__ */ h.jsx("span", { className: "chip", children: q }, q)) })
        ] }, Q);
      }),
      /* @__PURE__ */ h.jsx("div", { ref: ue })
    ] }),
    /* @__PURE__ */ h.jsxs("form", { className: "ask", onSubmit: (F) => {
      F.preventDefault();
      const Q = j.trim();
      Q && !R && (M(""), re({ text: Q }, Q));
    }, children: [
      /* @__PURE__ */ h.jsx("button", { type: "button", className: g ? "rec" : "", title: g ? "Stop and send" : "Talk", disabled: R, onClick: Ne, children: /* @__PURE__ */ h.jsx("ha-icon", { icon: g ? "mdi:stop" : "mdi:microphone" }) }),
      /* @__PURE__ */ h.jsx("input", { value: j, onChange: (F) => M(F.target.value), placeholder: g ? "Listening… tap stop when done" : "Ask FAITH" }),
      /* @__PURE__ */ h.jsx("button", { className: "primary", type: "submit", disabled: R || !j.trim(), title: "Send", children: /* @__PURE__ */ h.jsx("ha-icon", { icon: "mdi:send" }) })
    ] })
  ] });
}
function zd({ api: d, config: c }) {
  const { data: u, err: P, load: j } = Yo(d, "/api/ha/rewards"), [M, R] = fe.useState(""), z = (_, B, Z) => d.call(_, { args: B }).then(($) => {
    R($.approval ? `${Z} A grown-up will approve it.` : Z), j();
  }).catch(($) => R($.message));
  if (P) return /* @__PURE__ */ h.jsx("ha-card", { children: /* @__PURE__ */ h.jsx("div", { className: "err", children: P }) });
  if (!u) return /* @__PURE__ */ h.jsx("ha-card", { children: /* @__PURE__ */ h.jsx("div", { className: "empty", children: "Loading…" }) });
  const g = (_) => `${_} pt${_ === 1 ? "" : "s"}`;
  return /* @__PURE__ */ h.jsxs("ha-card", { children: [
    /* @__PURE__ */ h.jsxs("div", { className: "head", children: [
      /* @__PURE__ */ h.jsx("ha-icon", { icon: "mdi:star-circle-outline" }),
      /* @__PURE__ */ h.jsx("h2", { children: c.title ?? "Points & rewards" })
    ] }),
    u.me ? /* @__PURE__ */ h.jsxs(h.Fragment, { children: [
      /* @__PURE__ */ h.jsxs("div", { className: "section", children: [
        /* @__PURE__ */ h.jsxs("div", { className: "eyebrow", children: [
          u.me.name,
          "'s points"
        ] }),
        /* @__PURE__ */ h.jsx("div", { className: "big", children: u.me.points })
      ] }),
      /* @__PURE__ */ h.jsxs("div", { className: "section", children: [
        /* @__PURE__ */ h.jsx("h3", { children: "Jobs" }),
        /* @__PURE__ */ h.jsx("ul", { children: u.activities.filter((_) => _.kids_can_claim).map((_) => /* @__PURE__ */ h.jsxs("li", { className: "row", children: [
          /* @__PURE__ */ h.jsx("span", { className: "grow", children: _.name }),
          /* @__PURE__ */ h.jsxs("span", { className: "pill", children: [
            "+",
            g(_.points)
          ] }),
          /* @__PURE__ */ h.jsx("button", { onClick: () => z("/api/ha/rewards/claim", { activity: _.id }, `Asked for ${g(_.points)} for "${_.name}".`), children: "I did it" })
        ] }, _.id)) })
      ] }),
      /* @__PURE__ */ h.jsxs("div", { className: "section", children: [
        /* @__PURE__ */ h.jsx("h3", { children: "Rewards" }),
        /* @__PURE__ */ h.jsx("ul", { children: u.rewards.map((_) => /* @__PURE__ */ h.jsxs("li", { className: "row", children: [
          /* @__PURE__ */ h.jsx("span", { className: "grow", children: _.name }),
          /* @__PURE__ */ h.jsx("span", { className: "pill", children: g(_.cost) }),
          /* @__PURE__ */ h.jsx("button", { className: "primary", disabled: u.me.points < _.cost, onClick: () => z("/api/ha/rewards/redeem", { reward: _.id }, `Asked for "${_.name}".`), children: "Get it" })
        ] }, _.id)) })
      ] })
    ] }) : /* @__PURE__ */ h.jsxs(h.Fragment, { children: [
      !u.kids.length && /* @__PURE__ */ h.jsx("div", { className: "empty", children: "No children in FAITH's family list yet." }),
      /* @__PURE__ */ h.jsx("ul", { children: u.kids.map((_) => /* @__PURE__ */ h.jsxs("li", { className: "row", children: [
        /* @__PURE__ */ h.jsx(_r, { p: _, size: 34 }),
        /* @__PURE__ */ h.jsx("span", { className: "grow", children: _.name }),
        /* @__PURE__ */ h.jsx("span", { className: "pill", children: g(_.points) }),
        u.can_give && /* @__PURE__ */ h.jsx("div", { className: "btns", children: u.allowed_points.map((B) => /* @__PURE__ */ h.jsxs("button", { onClick: () => z("/api/ha/rewards/award", { person: _.id, points: B, reason: "Well done (from the dashboard)" }, `Gave ${_.name} ${g(B)}.`), children: [
          "+",
          B
        ] }, B)) })
      ] }, _.id)) }),
      !u.can_give && u.kids.length > 0 && /* @__PURE__ */ h.jsx("div", { className: "meta", children: "Sign in to give points." })
    ] }),
    M && /* @__PURE__ */ h.jsx("div", { className: "toast", children: M })
  ] });
}
function Hl(d, c, u, P, j) {
  if (customElements.get(d)) return;
  class M extends HTMLElement {
    constructor() {
      super(...arguments);
      Fe(this, "_hass");
      Fe(this, "_config");
      Fe(this, "_root");
      Fe(this, "_api");
    }
    setConfig(g) {
      this._config = { ...g }, this._api = void 0, this.render();
    }
    set hass(g) {
      const _ = !this._hass;
      this._hass = g, _ && this.render();
    }
    getCardSize() {
      return j;
    }
    static getStubConfig() {
      return d === "faith-who-card" ? { screen: "kitchen" } : {};
    }
    connectedCallback() {
      this.render();
    }
    render() {
      if (!(!this._config || !this._hass)) {
        if (!this._root) {
          const g = this.shadowRoot ?? this.attachShadow({ mode: "open" }), _ = document.createElement("style");
          _.textContent = fd, g.appendChild(_);
          const B = document.createElement("div");
          g.appendChild(B), this._root = cd.createRoot(B);
        }
        this._api ?? (this._api = pd(() => this._hass, this._config)), this._root.render(/* @__PURE__ */ h.jsx(P, { api: this._api, config: this._config }));
      }
    }
  }
  customElements.define(d, M), (window.customCards ?? (window.customCards = [])).push({ type: d, name: c, description: u, preview: !1 });
}
Hl("faith-card", "FAITH", "The family's day from FAITH: today, meals, shopping, chores, the house and approvals, for whoever is looking.", Cd, 6);
Hl("faith-who-card", "FAITH: who's here", "For a shared tablet: shows who is signed in, and lets a person sign in with their PIN.", _d, 2);
Hl("faith-chat-card", "FAITH: chat", "Talk or type to FAITH.", Pd, 6);
Hl("faith-rewards-card", "FAITH: points & rewards", "Children's points, jobs to claim and rewards; parents give points.", zd, 4);
