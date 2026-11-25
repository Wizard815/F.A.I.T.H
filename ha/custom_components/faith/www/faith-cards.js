var kf = Object.defineProperty;
var Sf = (a, u, s) => u in a ? kf(a, u, { enumerable: !0, configurable: !0, writable: !0, value: s }) : a[u] = s;
var Ue = (a, u, s) => Sf(a, typeof u != "symbol" ? u + "" : u, s);
var $o = { exports: {} }, _r = {}, Uo = { exports: {} }, ne = {};
/**
 * @license React
 * react.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var Wa;
function Ef() {
  if (Wa) return ne;
  Wa = 1;
  var a = Symbol.for("react.element"), u = Symbol.for("react.portal"), s = Symbol.for("react.fragment"), w = Symbol.for("react.strict_mode"), v = Symbol.for("react.profiler"), E = Symbol.for("react.provider"), N = Symbol.for("react.context"), C = Symbol.for("react.forward_ref"), y = Symbol.for("react.suspense"), T = Symbol.for("react.memo"), M = Symbol.for("react.lazy"), _ = Symbol.iterator;
  function L(f) {
    return f === null || typeof f != "object" ? null : (f = _ && f[_] || f["@@iterator"], typeof f == "function" ? f : null);
  }
  var A = { isMounted: function() {
    return !1;
  }, enqueueForceUpdate: function() {
  }, enqueueReplaceState: function() {
  }, enqueueSetState: function() {
  } }, G = Object.assign, Y = {};
  function q(f, S, $) {
    this.props = f, this.context = S, this.refs = Y, this.updater = $ || A;
  }
  q.prototype.isReactComponent = {}, q.prototype.setState = function(f, S) {
    if (typeof f != "object" && typeof f != "function" && f != null) throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");
    this.updater.enqueueSetState(this, f, S, "setState");
  }, q.prototype.forceUpdate = function(f) {
    this.updater.enqueueForceUpdate(this, f, "forceUpdate");
  };
  function me() {
  }
  me.prototype = q.prototype;
  function Ce(f, S, $) {
    this.props = f, this.context = S, this.refs = Y, this.updater = $ || A;
  }
  var Le = Ce.prototype = new me();
  Le.constructor = Ce, G(Le, q.prototype), Le.isPureReactComponent = !0;
  var ve = Array.isArray, ze = Object.prototype.hasOwnProperty, de = { current: null }, ue = { key: !0, ref: !0, __self: !0, __source: !0 };
  function te(f, S, $) {
    var X, ee = {}, b = null, se = null;
    if (S != null) for (X in S.ref !== void 0 && (se = S.ref), S.key !== void 0 && (b = "" + S.key), S) ze.call(S, X) && !ue.hasOwnProperty(X) && (ee[X] = S[X]);
    var Z = arguments.length - 2;
    if (Z === 1) ee.children = $;
    else if (1 < Z) {
      for (var oe = Array(Z), je = 0; je < Z; je++) oe[je] = arguments[je + 2];
      ee.children = oe;
    }
    if (f && f.defaultProps) for (X in Z = f.defaultProps, Z) ee[X] === void 0 && (ee[X] = Z[X]);
    return { $$typeof: a, type: f, key: b, ref: se, props: ee, _owner: de.current };
  }
  function le(f, S) {
    return { $$typeof: a, type: f.type, key: S, ref: f.ref, props: f.props, _owner: f._owner };
  }
  function D(f) {
    return typeof f == "object" && f !== null && f.$$typeof === a;
  }
  function re(f) {
    var S = { "=": "=0", ":": "=2" };
    return "$" + f.replace(/[=:]/g, function($) {
      return S[$];
    });
  }
  var ie = /\/+/g;
  function pe(f, S) {
    return typeof f == "object" && f !== null && f.key != null ? re("" + f.key) : S.toString(36);
  }
  function Ge(f, S, $, X, ee) {
    var b = typeof f;
    (b === "undefined" || b === "boolean") && (f = null);
    var se = !1;
    if (f === null) se = !0;
    else switch (b) {
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
    if (se) return se = f, ee = ee(se), f = X === "" ? "." + pe(se, 0) : X, ve(ee) ? ($ = "", f != null && ($ = f.replace(ie, "$&/") + "/"), Ge(ee, S, $, "", function(je) {
      return je;
    })) : ee != null && (D(ee) && (ee = le(ee, $ + (!ee.key || se && se.key === ee.key ? "" : ("" + ee.key).replace(ie, "$&/") + "/") + f)), S.push(ee)), 1;
    if (se = 0, X = X === "" ? "." : X + ":", ve(f)) for (var Z = 0; Z < f.length; Z++) {
      b = f[Z];
      var oe = X + pe(b, Z);
      se += Ge(b, S, $, oe, ee);
    }
    else if (oe = L(f), typeof oe == "function") for (f = oe.call(f), Z = 0; !(b = f.next()).done; ) b = b.value, oe = X + pe(b, Z++), se += Ge(b, S, $, oe, ee);
    else if (b === "object") throw S = String(f), Error("Objects are not valid as a React child (found: " + (S === "[object Object]" ? "object with keys {" + Object.keys(f).join(", ") + "}" : S) + "). If you meant to render a collection of children, use an array instead.");
    return se;
  }
  function Ye(f, S, $) {
    if (f == null) return f;
    var X = [], ee = 0;
    return Ge(f, X, "", "", function(b) {
      return S.call($, b, ee++);
    }), X;
  }
  function Ie(f) {
    if (f._status === -1) {
      var S = f._result;
      S = S(), S.then(function($) {
        (f._status === 0 || f._status === -1) && (f._status = 1, f._result = $);
      }, function($) {
        (f._status === 0 || f._status === -1) && (f._status = 2, f._result = $);
      }), f._status === -1 && (f._status = 0, f._result = S);
    }
    if (f._status === 1) return f._result.default;
    throw f._result;
  }
  var we = { current: null }, F = { transition: null }, k = { ReactCurrentDispatcher: we, ReactCurrentBatchConfig: F, ReactCurrentOwner: de };
  function j() {
    throw Error("act(...) is not supported in production builds of React.");
  }
  return ne.Children = { map: Ye, forEach: function(f, S, $) {
    Ye(f, function() {
      S.apply(this, arguments);
    }, $);
  }, count: function(f) {
    var S = 0;
    return Ye(f, function() {
      S++;
    }), S;
  }, toArray: function(f) {
    return Ye(f, function(S) {
      return S;
    }) || [];
  }, only: function(f) {
    if (!D(f)) throw Error("React.Children.only expected to receive a single React element child.");
    return f;
  } }, ne.Component = q, ne.Fragment = s, ne.Profiler = v, ne.PureComponent = Ce, ne.StrictMode = w, ne.Suspense = y, ne.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = k, ne.act = j, ne.cloneElement = function(f, S, $) {
    if (f == null) throw Error("React.cloneElement(...): The argument must be a React element, but you passed " + f + ".");
    var X = G({}, f.props), ee = f.key, b = f.ref, se = f._owner;
    if (S != null) {
      if (S.ref !== void 0 && (b = S.ref, se = de.current), S.key !== void 0 && (ee = "" + S.key), f.type && f.type.defaultProps) var Z = f.type.defaultProps;
      for (oe in S) ze.call(S, oe) && !ue.hasOwnProperty(oe) && (X[oe] = S[oe] === void 0 && Z !== void 0 ? Z[oe] : S[oe]);
    }
    var oe = arguments.length - 2;
    if (oe === 1) X.children = $;
    else if (1 < oe) {
      Z = Array(oe);
      for (var je = 0; je < oe; je++) Z[je] = arguments[je + 2];
      X.children = Z;
    }
    return { $$typeof: a, type: f.type, key: ee, ref: b, props: X, _owner: se };
  }, ne.createContext = function(f) {
    return f = { $$typeof: N, _currentValue: f, _currentValue2: f, _threadCount: 0, Provider: null, Consumer: null, _defaultValue: null, _globalName: null }, f.Provider = { $$typeof: E, _context: f }, f.Consumer = f;
  }, ne.createElement = te, ne.createFactory = function(f) {
    var S = te.bind(null, f);
    return S.type = f, S;
  }, ne.createRef = function() {
    return { current: null };
  }, ne.forwardRef = function(f) {
    return { $$typeof: C, render: f };
  }, ne.isValidElement = D, ne.lazy = function(f) {
    return { $$typeof: M, _payload: { _status: -1, _result: f }, _init: Ie };
  }, ne.memo = function(f, S) {
    return { $$typeof: T, type: f, compare: S === void 0 ? null : S };
  }, ne.startTransition = function(f) {
    var S = F.transition;
    F.transition = {};
    try {
      f();
    } finally {
      F.transition = S;
    }
  }, ne.unstable_act = j, ne.useCallback = function(f, S) {
    return we.current.useCallback(f, S);
  }, ne.useContext = function(f) {
    return we.current.useContext(f);
  }, ne.useDebugValue = function() {
  }, ne.useDeferredValue = function(f) {
    return we.current.useDeferredValue(f);
  }, ne.useEffect = function(f, S) {
    return we.current.useEffect(f, S);
  }, ne.useId = function() {
    return we.current.useId();
  }, ne.useImperativeHandle = function(f, S, $) {
    return we.current.useImperativeHandle(f, S, $);
  }, ne.useInsertionEffect = function(f, S) {
    return we.current.useInsertionEffect(f, S);
  }, ne.useLayoutEffect = function(f, S) {
    return we.current.useLayoutEffect(f, S);
  }, ne.useMemo = function(f, S) {
    return we.current.useMemo(f, S);
  }, ne.useReducer = function(f, S, $) {
    return we.current.useReducer(f, S, $);
  }, ne.useRef = function(f) {
    return we.current.useRef(f);
  }, ne.useState = function(f) {
    return we.current.useState(f);
  }, ne.useSyncExternalStore = function(f, S, $) {
    return we.current.useSyncExternalStore(f, S, $);
  }, ne.useTransition = function() {
    return we.current.useTransition();
  }, ne.version = "18.3.1", ne;
}
var Qa;
function Yo() {
  return Qa || (Qa = 1, Uo.exports = Ef()), Uo.exports;
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
var Ka;
function jf() {
  if (Ka) return _r;
  Ka = 1;
  var a = Yo(), u = Symbol.for("react.element"), s = Symbol.for("react.fragment"), w = Object.prototype.hasOwnProperty, v = a.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner, E = { key: !0, ref: !0, __self: !0, __source: !0 };
  function N(C, y, T) {
    var M, _ = {}, L = null, A = null;
    T !== void 0 && (L = "" + T), y.key !== void 0 && (L = "" + y.key), y.ref !== void 0 && (A = y.ref);
    for (M in y) w.call(y, M) && !E.hasOwnProperty(M) && (_[M] = y[M]);
    if (C && C.defaultProps) for (M in y = C.defaultProps, y) _[M] === void 0 && (_[M] = y[M]);
    return { $$typeof: u, type: C, key: L, ref: A, props: _, _owner: v.current };
  }
  return _r.Fragment = s, _r.jsx = N, _r.jsxs = N, _r;
}
var Ga;
function Nf() {
  return Ga || (Ga = 1, $o.exports = jf()), $o.exports;
}
var c = Nf(), W = Yo(), Bl = {}, Ho = { exports: {} }, et = {}, Bo = { exports: {} }, Vo = {};
/**
 * @license React
 * scheduler.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var Ya;
function Cf() {
  return Ya || (Ya = 1, (function(a) {
    function u(F, k) {
      var j = F.length;
      F.push(k);
      e: for (; 0 < j; ) {
        var f = j - 1 >>> 1, S = F[f];
        if (0 < v(S, k)) F[f] = k, F[j] = S, j = f;
        else break e;
      }
    }
    function s(F) {
      return F.length === 0 ? null : F[0];
    }
    function w(F) {
      if (F.length === 0) return null;
      var k = F[0], j = F.pop();
      if (j !== k) {
        F[0] = j;
        e: for (var f = 0, S = F.length, $ = S >>> 1; f < $; ) {
          var X = 2 * (f + 1) - 1, ee = F[X], b = X + 1, se = F[b];
          if (0 > v(ee, j)) b < S && 0 > v(se, ee) ? (F[f] = se, F[b] = j, f = b) : (F[f] = ee, F[X] = j, f = X);
          else if (b < S && 0 > v(se, j)) F[f] = se, F[b] = j, f = b;
          else break e;
        }
      }
      return k;
    }
    function v(F, k) {
      var j = F.sortIndex - k.sortIndex;
      return j !== 0 ? j : F.id - k.id;
    }
    if (typeof performance == "object" && typeof performance.now == "function") {
      var E = performance;
      a.unstable_now = function() {
        return E.now();
      };
    } else {
      var N = Date, C = N.now();
      a.unstable_now = function() {
        return N.now() - C;
      };
    }
    var y = [], T = [], M = 1, _ = null, L = 3, A = !1, G = !1, Y = !1, q = typeof setTimeout == "function" ? setTimeout : null, me = typeof clearTimeout == "function" ? clearTimeout : null, Ce = typeof setImmediate < "u" ? setImmediate : null;
    typeof navigator < "u" && navigator.scheduling !== void 0 && navigator.scheduling.isInputPending !== void 0 && navigator.scheduling.isInputPending.bind(navigator.scheduling);
    function Le(F) {
      for (var k = s(T); k !== null; ) {
        if (k.callback === null) w(T);
        else if (k.startTime <= F) w(T), k.sortIndex = k.expirationTime, u(y, k);
        else break;
        k = s(T);
      }
    }
    function ve(F) {
      if (Y = !1, Le(F), !G) if (s(y) !== null) G = !0, Ie(ze);
      else {
        var k = s(T);
        k !== null && we(ve, k.startTime - F);
      }
    }
    function ze(F, k) {
      G = !1, Y && (Y = !1, me(te), te = -1), A = !0;
      var j = L;
      try {
        for (Le(k), _ = s(y); _ !== null && (!(_.expirationTime > k) || F && !re()); ) {
          var f = _.callback;
          if (typeof f == "function") {
            _.callback = null, L = _.priorityLevel;
            var S = f(_.expirationTime <= k);
            k = a.unstable_now(), typeof S == "function" ? _.callback = S : _ === s(y) && w(y), Le(k);
          } else w(y);
          _ = s(y);
        }
        if (_ !== null) var $ = !0;
        else {
          var X = s(T);
          X !== null && we(ve, X.startTime - k), $ = !1;
        }
        return $;
      } finally {
        _ = null, L = j, A = !1;
      }
    }
    var de = !1, ue = null, te = -1, le = 5, D = -1;
    function re() {
      return !(a.unstable_now() - D < le);
    }
    function ie() {
      if (ue !== null) {
        var F = a.unstable_now();
        D = F;
        var k = !0;
        try {
          k = ue(!0, F);
        } finally {
          k ? pe() : (de = !1, ue = null);
        }
      } else de = !1;
    }
    var pe;
    if (typeof Ce == "function") pe = function() {
      Ce(ie);
    };
    else if (typeof MessageChannel < "u") {
      var Ge = new MessageChannel(), Ye = Ge.port2;
      Ge.port1.onmessage = ie, pe = function() {
        Ye.postMessage(null);
      };
    } else pe = function() {
      q(ie, 0);
    };
    function Ie(F) {
      ue = F, de || (de = !0, pe());
    }
    function we(F, k) {
      te = q(function() {
        F(a.unstable_now());
      }, k);
    }
    a.unstable_IdlePriority = 5, a.unstable_ImmediatePriority = 1, a.unstable_LowPriority = 4, a.unstable_NormalPriority = 3, a.unstable_Profiling = null, a.unstable_UserBlockingPriority = 2, a.unstable_cancelCallback = function(F) {
      F.callback = null;
    }, a.unstable_continueExecution = function() {
      G || A || (G = !0, Ie(ze));
    }, a.unstable_forceFrameRate = function(F) {
      0 > F || 125 < F ? console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported") : le = 0 < F ? Math.floor(1e3 / F) : 5;
    }, a.unstable_getCurrentPriorityLevel = function() {
      return L;
    }, a.unstable_getFirstCallbackNode = function() {
      return s(y);
    }, a.unstable_next = function(F) {
      switch (L) {
        case 1:
        case 2:
        case 3:
          var k = 3;
          break;
        default:
          k = L;
      }
      var j = L;
      L = k;
      try {
        return F();
      } finally {
        L = j;
      }
    }, a.unstable_pauseExecution = function() {
    }, a.unstable_requestPaint = function() {
    }, a.unstable_runWithPriority = function(F, k) {
      switch (F) {
        case 1:
        case 2:
        case 3:
        case 4:
        case 5:
          break;
        default:
          F = 3;
      }
      var j = L;
      L = F;
      try {
        return k();
      } finally {
        L = j;
      }
    }, a.unstable_scheduleCallback = function(F, k, j) {
      var f = a.unstable_now();
      switch (typeof j == "object" && j !== null ? (j = j.delay, j = typeof j == "number" && 0 < j ? f + j : f) : j = f, F) {
        case 1:
          var S = -1;
          break;
        case 2:
          S = 250;
          break;
        case 5:
          S = 1073741823;
          break;
        case 4:
          S = 1e4;
          break;
        default:
          S = 5e3;
      }
      return S = j + S, F = { id: M++, callback: k, priorityLevel: F, startTime: j, expirationTime: S, sortIndex: -1 }, j > f ? (F.sortIndex = j, u(T, F), s(y) === null && F === s(T) && (Y ? (me(te), te = -1) : Y = !0, we(ve, j - f))) : (F.sortIndex = S, u(y, F), G || A || (G = !0, Ie(ze))), F;
    }, a.unstable_shouldYield = re, a.unstable_wrapCallback = function(F) {
      var k = L;
      return function() {
        var j = L;
        L = k;
        try {
          return F.apply(this, arguments);
        } finally {
          L = j;
        }
      };
    };
  })(Vo)), Vo;
}
var Xa;
function _f() {
  return Xa || (Xa = 1, Bo.exports = Cf()), Bo.exports;
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
var Za;
function Tf() {
  if (Za) return et;
  Za = 1;
  var a = Yo(), u = _f();
  function s(e) {
    for (var t = "https://reactjs.org/docs/error-decoder.html?invariant=" + e, n = 1; n < arguments.length; n++) t += "&args[]=" + encodeURIComponent(arguments[n]);
    return "Minified React error #" + e + "; visit " + t + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
  }
  var w = /* @__PURE__ */ new Set(), v = {};
  function E(e, t) {
    N(e, t), N(e + "Capture", t);
  }
  function N(e, t) {
    for (v[e] = t, e = 0; e < t.length; e++) w.add(t[e]);
  }
  var C = !(typeof window > "u" || typeof window.document > "u" || typeof window.document.createElement > "u"), y = Object.prototype.hasOwnProperty, T = /^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/, M = {}, _ = {};
  function L(e) {
    return y.call(_, e) ? !0 : y.call(M, e) ? !1 : T.test(e) ? _[e] = !0 : (M[e] = !0, !1);
  }
  function A(e, t, n, r) {
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
  function G(e, t, n, r) {
    if (t === null || typeof t > "u" || A(e, t, n, r)) return !0;
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
  var me = /[\-:]([a-z])/g;
  function Ce(e) {
    return e[1].toUpperCase();
  }
  "accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height".split(" ").forEach(function(e) {
    var t = e.replace(
      me,
      Ce
    );
    q[t] = new Y(t, 1, !1, e, null, !1, !1);
  }), "xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type".split(" ").forEach(function(e) {
    var t = e.replace(me, Ce);
    q[t] = new Y(t, 1, !1, e, "http://www.w3.org/1999/xlink", !1, !1);
  }), ["xml:base", "xml:lang", "xml:space"].forEach(function(e) {
    var t = e.replace(me, Ce);
    q[t] = new Y(t, 1, !1, e, "http://www.w3.org/XML/1998/namespace", !1, !1);
  }), ["tabIndex", "crossOrigin"].forEach(function(e) {
    q[e] = new Y(e, 1, !1, e.toLowerCase(), null, !1, !1);
  }), q.xlinkHref = new Y("xlinkHref", 1, !1, "xlink:href", "http://www.w3.org/1999/xlink", !0, !1), ["src", "href", "action", "formAction"].forEach(function(e) {
    q[e] = new Y(e, 1, !1, e.toLowerCase(), null, !0, !0);
  });
  function Le(e, t, n, r) {
    var l = q.hasOwnProperty(t) ? q[t] : null;
    (l !== null ? l.type !== 0 : r || !(2 < t.length) || t[0] !== "o" && t[0] !== "O" || t[1] !== "n" && t[1] !== "N") && (G(t, n, l, r) && (n = null), r || l === null ? L(t) && (n === null ? e.removeAttribute(t) : e.setAttribute(t, "" + n)) : l.mustUseProperty ? e[l.propertyName] = n === null ? l.type === 3 ? !1 : "" : n : (t = l.attributeName, r = l.attributeNamespace, n === null ? e.removeAttribute(t) : (l = l.type, n = l === 3 || l === 4 && n === !0 ? "" : "" + n, r ? e.setAttributeNS(r, t, n) : e.setAttribute(t, n))));
  }
  var ve = a.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED, ze = Symbol.for("react.element"), de = Symbol.for("react.portal"), ue = Symbol.for("react.fragment"), te = Symbol.for("react.strict_mode"), le = Symbol.for("react.profiler"), D = Symbol.for("react.provider"), re = Symbol.for("react.context"), ie = Symbol.for("react.forward_ref"), pe = Symbol.for("react.suspense"), Ge = Symbol.for("react.suspense_list"), Ye = Symbol.for("react.memo"), Ie = Symbol.for("react.lazy"), we = Symbol.for("react.offscreen"), F = Symbol.iterator;
  function k(e) {
    return e === null || typeof e != "object" ? null : (e = F && e[F] || e["@@iterator"], typeof e == "function" ? e : null);
  }
  var j = Object.assign, f;
  function S(e) {
    if (f === void 0) try {
      throw Error();
    } catch (n) {
      var t = n.stack.trim().match(/\n( *(at )?)/);
      f = t && t[1] || "";
    }
    return `
` + f + e;
  }
  var $ = !1;
  function X(e, t) {
    if (!e || $) return "";
    $ = !0;
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
        } catch (x) {
          var r = x;
        }
        Reflect.construct(e, [], t);
      } else {
        try {
          t.call();
        } catch (x) {
          r = x;
        }
        e.call(t.prototype);
      }
      else {
        try {
          throw Error();
        } catch (x) {
          r = x;
        }
        e();
      }
    } catch (x) {
      if (x && r && typeof x.stack == "string") {
        for (var l = x.stack.split(`
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
      $ = !1, Error.prepareStackTrace = n;
    }
    return (e = e ? e.displayName || e.name : "") ? S(e) : "";
  }
  function ee(e) {
    switch (e.tag) {
      case 5:
        return S(e.type);
      case 16:
        return S("Lazy");
      case 13:
        return S("Suspense");
      case 19:
        return S("SuspenseList");
      case 0:
      case 2:
      case 15:
        return e = X(e.type, !1), e;
      case 11:
        return e = X(e.type.render, !1), e;
      case 1:
        return e = X(e.type, !0), e;
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
      case de:
        return "Portal";
      case le:
        return "Profiler";
      case te:
        return "StrictMode";
      case pe:
        return "Suspense";
      case Ge:
        return "SuspenseList";
    }
    if (typeof e == "object") switch (e.$$typeof) {
      case re:
        return (e.displayName || "Context") + ".Consumer";
      case D:
        return (e._context.displayName || "Context") + ".Provider";
      case ie:
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
        return t === te ? "StrictMode" : "Mode";
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
  function je(e) {
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
    e._valueTracker || (e._valueTracker = je(e));
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
  function Ql(e, t) {
    var n = t.checked;
    return j({}, t, { defaultChecked: void 0, defaultValue: void 0, value: void 0, checked: n ?? e._wrapperState.initialChecked });
  }
  function Jo(e, t) {
    var n = t.defaultValue == null ? "" : t.defaultValue, r = t.checked != null ? t.checked : t.defaultChecked;
    n = Z(t.value != null ? t.value : n), e._wrapperState = { initialChecked: r, initialValue: n, controlled: t.type === "checkbox" || t.type === "radio" ? t.checked != null : t.value != null };
  }
  function qo(e, t) {
    t = t.checked, t != null && Le(e, "checked", t, !1);
  }
  function Kl(e, t) {
    qo(e, t);
    var n = Z(t.value), r = t.type;
    if (n != null) r === "number" ? (n === 0 && e.value === "" || e.value != n) && (e.value = "" + n) : e.value !== "" + n && (e.value = "" + n);
    else if (r === "submit" || r === "reset") {
      e.removeAttribute("value");
      return;
    }
    t.hasOwnProperty("value") ? Gl(e, t.type, n) : t.hasOwnProperty("defaultValue") && Gl(e, t.type, Z(t.defaultValue)), t.checked == null && t.defaultChecked != null && (e.defaultChecked = !!t.defaultChecked);
  }
  function bo(e, t, n) {
    if (t.hasOwnProperty("value") || t.hasOwnProperty("defaultValue")) {
      var r = t.type;
      if (!(r !== "submit" && r !== "reset" || t.value !== void 0 && t.value !== null)) return;
      t = "" + e._wrapperState.initialValue, n || t === e.value || (e.value = t), e.defaultValue = t;
    }
    n = e.name, n !== "" && (e.name = ""), e.defaultChecked = !!e._wrapperState.initialChecked, n !== "" && (e.name = n);
  }
  function Gl(e, t, n) {
    (t !== "number" || Lr(e.ownerDocument) !== e) && (n == null ? e.defaultValue = "" + e._wrapperState.initialValue : e.defaultValue !== "" + n && (e.defaultValue = "" + n));
  }
  var Bn = Array.isArray;
  function mn(e, t, n, r) {
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
  function Yl(e, t) {
    if (t.dangerouslySetInnerHTML != null) throw Error(s(91));
    return j({}, t, { value: void 0, defaultValue: void 0, children: "" + e._wrapperState.initialValue });
  }
  function es(e, t) {
    var n = t.value;
    if (n == null) {
      if (n = t.children, t = t.defaultValue, n != null) {
        if (t != null) throw Error(s(92));
        if (Bn(n)) {
          if (1 < n.length) throw Error(s(93));
          n = n[0];
        }
        t = n;
      }
      t == null && (t = ""), n = t;
    }
    e._wrapperState = { initialValue: Z(n) };
  }
  function ts(e, t) {
    var n = Z(t.value), r = Z(t.defaultValue);
    n != null && (n = "" + n, n !== e.value && (e.value = n), t.defaultValue == null && e.defaultValue !== n && (e.defaultValue = n)), r != null && (e.defaultValue = "" + r);
  }
  function ns(e) {
    var t = e.textContent;
    t === e._wrapperState.initialValue && t !== "" && t !== null && (e.value = t);
  }
  function rs(e) {
    switch (e) {
      case "svg":
        return "http://www.w3.org/2000/svg";
      case "math":
        return "http://www.w3.org/1998/Math/MathML";
      default:
        return "http://www.w3.org/1999/xhtml";
    }
  }
  function Xl(e, t) {
    return e == null || e === "http://www.w3.org/1999/xhtml" ? rs(t) : e === "http://www.w3.org/2000/svg" && t === "foreignObject" ? "http://www.w3.org/1999/xhtml" : e;
  }
  var Ir, ls = (function(e) {
    return typeof MSApp < "u" && MSApp.execUnsafeLocalFunction ? function(t, n, r, l) {
      MSApp.execUnsafeLocalFunction(function() {
        return e(t, n, r, l);
      });
    } : e;
  })(function(e, t) {
    if (e.namespaceURI !== "http://www.w3.org/2000/svg" || "innerHTML" in e) e.innerHTML = t;
    else {
      for (Ir = Ir || document.createElement("div"), Ir.innerHTML = "<svg>" + t.valueOf().toString() + "</svg>", t = Ir.firstChild; e.firstChild; ) e.removeChild(e.firstChild);
      for (; t.firstChild; ) e.appendChild(t.firstChild);
    }
  });
  function Vn(e, t) {
    if (t) {
      var n = e.firstChild;
      if (n && n === e.lastChild && n.nodeType === 3) {
        n.nodeValue = t;
        return;
      }
    }
    e.textContent = t;
  }
  var Wn = {
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
  }, jc = ["Webkit", "ms", "Moz", "O"];
  Object.keys(Wn).forEach(function(e) {
    jc.forEach(function(t) {
      t = t + e.charAt(0).toUpperCase() + e.substring(1), Wn[t] = Wn[e];
    });
  });
  function is(e, t, n) {
    return t == null || typeof t == "boolean" || t === "" ? "" : n || typeof t != "number" || t === 0 || Wn.hasOwnProperty(e) && Wn[e] ? ("" + t).trim() : t + "px";
  }
  function os(e, t) {
    e = e.style;
    for (var n in t) if (t.hasOwnProperty(n)) {
      var r = n.indexOf("--") === 0, l = is(n, t[n], r);
      n === "float" && (n = "cssFloat"), r ? e.setProperty(n, l) : e[n] = l;
    }
  }
  var Nc = j({ menuitem: !0 }, { area: !0, base: !0, br: !0, col: !0, embed: !0, hr: !0, img: !0, input: !0, keygen: !0, link: !0, meta: !0, param: !0, source: !0, track: !0, wbr: !0 });
  function Zl(e, t) {
    if (t) {
      if (Nc[e] && (t.children != null || t.dangerouslySetInnerHTML != null)) throw Error(s(137, e));
      if (t.dangerouslySetInnerHTML != null) {
        if (t.children != null) throw Error(s(60));
        if (typeof t.dangerouslySetInnerHTML != "object" || !("__html" in t.dangerouslySetInnerHTML)) throw Error(s(61));
      }
      if (t.style != null && typeof t.style != "object") throw Error(s(62));
    }
  }
  function Jl(e, t) {
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
  var ql = null;
  function bl(e) {
    return e = e.target || e.srcElement || window, e.correspondingUseElement && (e = e.correspondingUseElement), e.nodeType === 3 ? e.parentNode : e;
  }
  var ei = null, vn = null, gn = null;
  function ss(e) {
    if (e = fr(e)) {
      if (typeof ei != "function") throw Error(s(280));
      var t = e.stateNode;
      t && (t = rl(t), ei(e.stateNode, e.type, t));
    }
  }
  function us(e) {
    vn ? gn ? gn.push(e) : gn = [e] : vn = e;
  }
  function as() {
    if (vn) {
      var e = vn, t = gn;
      if (gn = vn = null, ss(e), t) for (e = 0; e < t.length; e++) ss(t[e]);
    }
  }
  function cs(e, t) {
    return e(t);
  }
  function ds() {
  }
  var ti = !1;
  function fs(e, t, n) {
    if (ti) return e(t, n);
    ti = !0;
    try {
      return cs(e, t, n);
    } finally {
      ti = !1, (vn !== null || gn !== null) && (ds(), as());
    }
  }
  function Qn(e, t) {
    var n = e.stateNode;
    if (n === null) return null;
    var r = rl(n);
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
  var ni = !1;
  if (C) try {
    var Kn = {};
    Object.defineProperty(Kn, "passive", { get: function() {
      ni = !0;
    } }), window.addEventListener("test", Kn, Kn), window.removeEventListener("test", Kn, Kn);
  } catch {
    ni = !1;
  }
  function Cc(e, t, n, r, l, i, o, d, p) {
    var x = Array.prototype.slice.call(arguments, 3);
    try {
      t.apply(n, x);
    } catch (z) {
      this.onError(z);
    }
  }
  var Gn = !1, Dr = null, Fr = !1, ri = null, _c = { onError: function(e) {
    Gn = !0, Dr = e;
  } };
  function Tc(e, t, n, r, l, i, o, d, p) {
    Gn = !1, Dr = null, Cc.apply(_c, arguments);
  }
  function Pc(e, t, n, r, l, i, o, d, p) {
    if (Tc.apply(this, arguments), Gn) {
      if (Gn) {
        var x = Dr;
        Gn = !1, Dr = null;
      } else throw Error(s(198));
      Fr || (Fr = !0, ri = x);
    }
  }
  function en(e) {
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
  function ps(e) {
    if (e.tag === 13) {
      var t = e.memoizedState;
      if (t === null && (e = e.alternate, e !== null && (t = e.memoizedState)), t !== null) return t.dehydrated;
    }
    return null;
  }
  function hs(e) {
    if (en(e) !== e) throw Error(s(188));
  }
  function zc(e) {
    var t = e.alternate;
    if (!t) {
      if (t = en(e), t === null) throw Error(s(188));
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
          if (i === n) return hs(l), e;
          if (i === r) return hs(l), t;
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
  function ms(e) {
    return e = zc(e), e !== null ? vs(e) : null;
  }
  function vs(e) {
    if (e.tag === 5 || e.tag === 6) return e;
    for (e = e.child; e !== null; ) {
      var t = vs(e);
      if (t !== null) return t;
      e = e.sibling;
    }
    return null;
  }
  var gs = u.unstable_scheduleCallback, ys = u.unstable_cancelCallback, Mc = u.unstable_shouldYield, Rc = u.unstable_requestPaint, _e = u.unstable_now, Lc = u.unstable_getCurrentPriorityLevel, li = u.unstable_ImmediatePriority, xs = u.unstable_UserBlockingPriority, Or = u.unstable_NormalPriority, Ic = u.unstable_LowPriority, ws = u.unstable_IdlePriority, Ar = null, wt = null;
  function Dc(e) {
    if (wt && typeof wt.onCommitFiberRoot == "function") try {
      wt.onCommitFiberRoot(Ar, e, void 0, (e.current.flags & 128) === 128);
    } catch {
    }
  }
  var pt = Math.clz32 ? Math.clz32 : Ac, Fc = Math.log, Oc = Math.LN2;
  function Ac(e) {
    return e >>>= 0, e === 0 ? 32 : 31 - (Fc(e) / Oc | 0) | 0;
  }
  var $r = 64, Ur = 4194304;
  function Yn(e) {
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
      var d = o & ~l;
      d !== 0 ? r = Yn(d) : (i &= o, i !== 0 && (r = Yn(i)));
    } else o = n & ~l, o !== 0 ? r = Yn(o) : i !== 0 && (r = Yn(i));
    if (r === 0) return 0;
    if (t !== 0 && t !== r && (t & l) === 0 && (l = r & -r, i = t & -t, l >= i || l === 16 && (i & 4194240) !== 0)) return t;
    if ((r & 4) !== 0 && (r |= n & 16), t = e.entangledLanes, t !== 0) for (e = e.entanglements, t &= r; 0 < t; ) n = 31 - pt(t), l = 1 << n, r |= e[n], t &= ~l;
    return r;
  }
  function $c(e, t) {
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
  function Uc(e, t) {
    for (var n = e.suspendedLanes, r = e.pingedLanes, l = e.expirationTimes, i = e.pendingLanes; 0 < i; ) {
      var o = 31 - pt(i), d = 1 << o, p = l[o];
      p === -1 ? ((d & n) === 0 || (d & r) !== 0) && (l[o] = $c(d, t)) : p <= t && (e.expiredLanes |= d), i &= ~d;
    }
  }
  function ii(e) {
    return e = e.pendingLanes & -1073741825, e !== 0 ? e : e & 1073741824 ? 1073741824 : 0;
  }
  function ks() {
    var e = $r;
    return $r <<= 1, ($r & 4194240) === 0 && ($r = 64), e;
  }
  function oi(e) {
    for (var t = [], n = 0; 31 > n; n++) t.push(e);
    return t;
  }
  function Xn(e, t, n) {
    e.pendingLanes |= t, t !== 536870912 && (e.suspendedLanes = 0, e.pingedLanes = 0), e = e.eventTimes, t = 31 - pt(t), e[t] = n;
  }
  function Hc(e, t) {
    var n = e.pendingLanes & ~t;
    e.pendingLanes = t, e.suspendedLanes = 0, e.pingedLanes = 0, e.expiredLanes &= t, e.mutableReadLanes &= t, e.entangledLanes &= t, t = e.entanglements;
    var r = e.eventTimes;
    for (e = e.expirationTimes; 0 < n; ) {
      var l = 31 - pt(n), i = 1 << l;
      t[l] = 0, r[l] = -1, e[l] = -1, n &= ~i;
    }
  }
  function si(e, t) {
    var n = e.entangledLanes |= t;
    for (e = e.entanglements; n; ) {
      var r = 31 - pt(n), l = 1 << r;
      l & t | e[r] & t && (e[r] |= t), n &= ~l;
    }
  }
  var fe = 0;
  function Ss(e) {
    return e &= -e, 1 < e ? 4 < e ? (e & 268435455) !== 0 ? 16 : 536870912 : 4 : 1;
  }
  var Es, ui, js, Ns, Cs, ai = !1, Br = [], It = null, Dt = null, Ft = null, Zn = /* @__PURE__ */ new Map(), Jn = /* @__PURE__ */ new Map(), Ot = [], Bc = "mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset submit".split(" ");
  function _s(e, t) {
    switch (e) {
      case "focusin":
      case "focusout":
        It = null;
        break;
      case "dragenter":
      case "dragleave":
        Dt = null;
        break;
      case "mouseover":
      case "mouseout":
        Ft = null;
        break;
      case "pointerover":
      case "pointerout":
        Zn.delete(t.pointerId);
        break;
      case "gotpointercapture":
      case "lostpointercapture":
        Jn.delete(t.pointerId);
    }
  }
  function qn(e, t, n, r, l, i) {
    return e === null || e.nativeEvent !== i ? (e = { blockedOn: t, domEventName: n, eventSystemFlags: r, nativeEvent: i, targetContainers: [l] }, t !== null && (t = fr(t), t !== null && ui(t)), e) : (e.eventSystemFlags |= r, t = e.targetContainers, l !== null && t.indexOf(l) === -1 && t.push(l), e);
  }
  function Vc(e, t, n, r, l) {
    switch (t) {
      case "focusin":
        return It = qn(It, e, t, n, r, l), !0;
      case "dragenter":
        return Dt = qn(Dt, e, t, n, r, l), !0;
      case "mouseover":
        return Ft = qn(Ft, e, t, n, r, l), !0;
      case "pointerover":
        var i = l.pointerId;
        return Zn.set(i, qn(Zn.get(i) || null, e, t, n, r, l)), !0;
      case "gotpointercapture":
        return i = l.pointerId, Jn.set(i, qn(Jn.get(i) || null, e, t, n, r, l)), !0;
    }
    return !1;
  }
  function Ts(e) {
    var t = tn(e.target);
    if (t !== null) {
      var n = en(t);
      if (n !== null) {
        if (t = n.tag, t === 13) {
          if (t = ps(n), t !== null) {
            e.blockedOn = t, Cs(e.priority, function() {
              js(n);
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
  function Vr(e) {
    if (e.blockedOn !== null) return !1;
    for (var t = e.targetContainers; 0 < t.length; ) {
      var n = di(e.domEventName, e.eventSystemFlags, t[0], e.nativeEvent);
      if (n === null) {
        n = e.nativeEvent;
        var r = new n.constructor(n.type, n);
        ql = r, n.target.dispatchEvent(r), ql = null;
      } else return t = fr(n), t !== null && ui(t), e.blockedOn = n, !1;
      t.shift();
    }
    return !0;
  }
  function Ps(e, t, n) {
    Vr(e) && n.delete(t);
  }
  function Wc() {
    ai = !1, It !== null && Vr(It) && (It = null), Dt !== null && Vr(Dt) && (Dt = null), Ft !== null && Vr(Ft) && (Ft = null), Zn.forEach(Ps), Jn.forEach(Ps);
  }
  function bn(e, t) {
    e.blockedOn === t && (e.blockedOn = null, ai || (ai = !0, u.unstable_scheduleCallback(u.unstable_NormalPriority, Wc)));
  }
  function er(e) {
    function t(l) {
      return bn(l, e);
    }
    if (0 < Br.length) {
      bn(Br[0], e);
      for (var n = 1; n < Br.length; n++) {
        var r = Br[n];
        r.blockedOn === e && (r.blockedOn = null);
      }
    }
    for (It !== null && bn(It, e), Dt !== null && bn(Dt, e), Ft !== null && bn(Ft, e), Zn.forEach(t), Jn.forEach(t), n = 0; n < Ot.length; n++) r = Ot[n], r.blockedOn === e && (r.blockedOn = null);
    for (; 0 < Ot.length && (n = Ot[0], n.blockedOn === null); ) Ts(n), n.blockedOn === null && Ot.shift();
  }
  var yn = ve.ReactCurrentBatchConfig, Wr = !0;
  function Qc(e, t, n, r) {
    var l = fe, i = yn.transition;
    yn.transition = null;
    try {
      fe = 1, ci(e, t, n, r);
    } finally {
      fe = l, yn.transition = i;
    }
  }
  function Kc(e, t, n, r) {
    var l = fe, i = yn.transition;
    yn.transition = null;
    try {
      fe = 4, ci(e, t, n, r);
    } finally {
      fe = l, yn.transition = i;
    }
  }
  function ci(e, t, n, r) {
    if (Wr) {
      var l = di(e, t, n, r);
      if (l === null) Ti(e, t, r, Qr, n), _s(e, r);
      else if (Vc(l, e, t, n, r)) r.stopPropagation();
      else if (_s(e, r), t & 4 && -1 < Bc.indexOf(e)) {
        for (; l !== null; ) {
          var i = fr(l);
          if (i !== null && Es(i), i = di(e, t, n, r), i === null && Ti(e, t, r, Qr, n), i === l) break;
          l = i;
        }
        l !== null && r.stopPropagation();
      } else Ti(e, t, r, null, n);
    }
  }
  var Qr = null;
  function di(e, t, n, r) {
    if (Qr = null, e = bl(r), e = tn(e), e !== null) if (t = en(e), t === null) e = null;
    else if (n = t.tag, n === 13) {
      if (e = ps(t), e !== null) return e;
      e = null;
    } else if (n === 3) {
      if (t.stateNode.current.memoizedState.isDehydrated) return t.tag === 3 ? t.stateNode.containerInfo : null;
      e = null;
    } else t !== e && (e = null);
    return Qr = e, null;
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
        switch (Lc()) {
          case li:
            return 1;
          case xs:
            return 4;
          case Or:
          case Ic:
            return 16;
          case ws:
            return 536870912;
          default:
            return 16;
        }
      default:
        return 16;
    }
  }
  var At = null, fi = null, Kr = null;
  function Ms() {
    if (Kr) return Kr;
    var e, t = fi, n = t.length, r, l = "value" in At ? At.value : At.textContent, i = l.length;
    for (e = 0; e < n && t[e] === l[e]; e++) ;
    var o = n - e;
    for (r = 1; r <= o && t[n - r] === l[i - r]; r++) ;
    return Kr = l.slice(e, 1 < r ? 1 - r : void 0);
  }
  function Gr(e) {
    var t = e.keyCode;
    return "charCode" in e ? (e = e.charCode, e === 0 && t === 13 && (e = 13)) : e = t, e === 10 && (e = 13), 32 <= e || e === 13 ? e : 0;
  }
  function Yr() {
    return !0;
  }
  function Rs() {
    return !1;
  }
  function tt(e) {
    function t(n, r, l, i, o) {
      this._reactName = n, this._targetInst = l, this.type = r, this.nativeEvent = i, this.target = o, this.currentTarget = null;
      for (var d in e) e.hasOwnProperty(d) && (n = e[d], this[d] = n ? n(i) : i[d]);
      return this.isDefaultPrevented = (i.defaultPrevented != null ? i.defaultPrevented : i.returnValue === !1) ? Yr : Rs, this.isPropagationStopped = Rs, this;
    }
    return j(t.prototype, { preventDefault: function() {
      this.defaultPrevented = !0;
      var n = this.nativeEvent;
      n && (n.preventDefault ? n.preventDefault() : typeof n.returnValue != "unknown" && (n.returnValue = !1), this.isDefaultPrevented = Yr);
    }, stopPropagation: function() {
      var n = this.nativeEvent;
      n && (n.stopPropagation ? n.stopPropagation() : typeof n.cancelBubble != "unknown" && (n.cancelBubble = !0), this.isPropagationStopped = Yr);
    }, persist: function() {
    }, isPersistent: Yr }), t;
  }
  var xn = { eventPhase: 0, bubbles: 0, cancelable: 0, timeStamp: function(e) {
    return e.timeStamp || Date.now();
  }, defaultPrevented: 0, isTrusted: 0 }, pi = tt(xn), tr = j({}, xn, { view: 0, detail: 0 }), Gc = tt(tr), hi, mi, nr, Xr = j({}, tr, { screenX: 0, screenY: 0, clientX: 0, clientY: 0, pageX: 0, pageY: 0, ctrlKey: 0, shiftKey: 0, altKey: 0, metaKey: 0, getModifierState: gi, button: 0, buttons: 0, relatedTarget: function(e) {
    return e.relatedTarget === void 0 ? e.fromElement === e.srcElement ? e.toElement : e.fromElement : e.relatedTarget;
  }, movementX: function(e) {
    return "movementX" in e ? e.movementX : (e !== nr && (nr && e.type === "mousemove" ? (hi = e.screenX - nr.screenX, mi = e.screenY - nr.screenY) : mi = hi = 0, nr = e), hi);
  }, movementY: function(e) {
    return "movementY" in e ? e.movementY : mi;
  } }), Ls = tt(Xr), Yc = j({}, Xr, { dataTransfer: 0 }), Xc = tt(Yc), Zc = j({}, tr, { relatedTarget: 0 }), vi = tt(Zc), Jc = j({}, xn, { animationName: 0, elapsedTime: 0, pseudoElement: 0 }), qc = tt(Jc), bc = j({}, xn, { clipboardData: function(e) {
    return "clipboardData" in e ? e.clipboardData : window.clipboardData;
  } }), ed = tt(bc), td = j({}, xn, { data: 0 }), Is = tt(td), nd = {
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
  }, rd = {
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
  }, ld = { Alt: "altKey", Control: "ctrlKey", Meta: "metaKey", Shift: "shiftKey" };
  function id(e) {
    var t = this.nativeEvent;
    return t.getModifierState ? t.getModifierState(e) : (e = ld[e]) ? !!t[e] : !1;
  }
  function gi() {
    return id;
  }
  var od = j({}, tr, { key: function(e) {
    if (e.key) {
      var t = nd[e.key] || e.key;
      if (t !== "Unidentified") return t;
    }
    return e.type === "keypress" ? (e = Gr(e), e === 13 ? "Enter" : String.fromCharCode(e)) : e.type === "keydown" || e.type === "keyup" ? rd[e.keyCode] || "Unidentified" : "";
  }, code: 0, location: 0, ctrlKey: 0, shiftKey: 0, altKey: 0, metaKey: 0, repeat: 0, locale: 0, getModifierState: gi, charCode: function(e) {
    return e.type === "keypress" ? Gr(e) : 0;
  }, keyCode: function(e) {
    return e.type === "keydown" || e.type === "keyup" ? e.keyCode : 0;
  }, which: function(e) {
    return e.type === "keypress" ? Gr(e) : e.type === "keydown" || e.type === "keyup" ? e.keyCode : 0;
  } }), sd = tt(od), ud = j({}, Xr, { pointerId: 0, width: 0, height: 0, pressure: 0, tangentialPressure: 0, tiltX: 0, tiltY: 0, twist: 0, pointerType: 0, isPrimary: 0 }), Ds = tt(ud), ad = j({}, tr, { touches: 0, targetTouches: 0, changedTouches: 0, altKey: 0, metaKey: 0, ctrlKey: 0, shiftKey: 0, getModifierState: gi }), cd = tt(ad), dd = j({}, xn, { propertyName: 0, elapsedTime: 0, pseudoElement: 0 }), fd = tt(dd), pd = j({}, Xr, {
    deltaX: function(e) {
      return "deltaX" in e ? e.deltaX : "wheelDeltaX" in e ? -e.wheelDeltaX : 0;
    },
    deltaY: function(e) {
      return "deltaY" in e ? e.deltaY : "wheelDeltaY" in e ? -e.wheelDeltaY : "wheelDelta" in e ? -e.wheelDelta : 0;
    },
    deltaZ: 0,
    deltaMode: 0
  }), hd = tt(pd), md = [9, 13, 27, 32], yi = C && "CompositionEvent" in window, rr = null;
  C && "documentMode" in document && (rr = document.documentMode);
  var vd = C && "TextEvent" in window && !rr, Fs = C && (!yi || rr && 8 < rr && 11 >= rr), Os = " ", As = !1;
  function $s(e, t) {
    switch (e) {
      case "keyup":
        return md.indexOf(t.keyCode) !== -1;
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
  var wn = !1;
  function gd(e, t) {
    switch (e) {
      case "compositionend":
        return Us(t);
      case "keypress":
        return t.which !== 32 ? null : (As = !0, Os);
      case "textInput":
        return e = t.data, e === Os && As ? null : e;
      default:
        return null;
    }
  }
  function yd(e, t) {
    if (wn) return e === "compositionend" || !yi && $s(e, t) ? (e = Ms(), Kr = fi = At = null, wn = !1, e) : null;
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
        return Fs && t.locale !== "ko" ? null : t.data;
      default:
        return null;
    }
  }
  var xd = { color: !0, date: !0, datetime: !0, "datetime-local": !0, email: !0, month: !0, number: !0, password: !0, range: !0, search: !0, tel: !0, text: !0, time: !0, url: !0, week: !0 };
  function Hs(e) {
    var t = e && e.nodeName && e.nodeName.toLowerCase();
    return t === "input" ? !!xd[e.type] : t === "textarea";
  }
  function Bs(e, t, n, r) {
    us(r), t = el(t, "onChange"), 0 < t.length && (n = new pi("onChange", "change", null, n, r), e.push({ event: n, listeners: t }));
  }
  var lr = null, ir = null;
  function wd(e) {
    ou(e, 0);
  }
  function Zr(e) {
    var t = Nn(e);
    if (Hn(t)) return e;
  }
  function kd(e, t) {
    if (e === "change") return t;
  }
  var Vs = !1;
  if (C) {
    var xi;
    if (C) {
      var wi = "oninput" in document;
      if (!wi) {
        var Ws = document.createElement("div");
        Ws.setAttribute("oninput", "return;"), wi = typeof Ws.oninput == "function";
      }
      xi = wi;
    } else xi = !1;
    Vs = xi && (!document.documentMode || 9 < document.documentMode);
  }
  function Qs() {
    lr && (lr.detachEvent("onpropertychange", Ks), ir = lr = null);
  }
  function Ks(e) {
    if (e.propertyName === "value" && Zr(ir)) {
      var t = [];
      Bs(t, ir, e, bl(e)), fs(wd, t);
    }
  }
  function Sd(e, t, n) {
    e === "focusin" ? (Qs(), lr = t, ir = n, lr.attachEvent("onpropertychange", Ks)) : e === "focusout" && Qs();
  }
  function Ed(e) {
    if (e === "selectionchange" || e === "keyup" || e === "keydown") return Zr(ir);
  }
  function jd(e, t) {
    if (e === "click") return Zr(t);
  }
  function Nd(e, t) {
    if (e === "input" || e === "change") return Zr(t);
  }
  function Cd(e, t) {
    return e === t && (e !== 0 || 1 / e === 1 / t) || e !== e && t !== t;
  }
  var ht = typeof Object.is == "function" ? Object.is : Cd;
  function or(e, t) {
    if (ht(e, t)) return !0;
    if (typeof e != "object" || e === null || typeof t != "object" || t === null) return !1;
    var n = Object.keys(e), r = Object.keys(t);
    if (n.length !== r.length) return !1;
    for (r = 0; r < n.length; r++) {
      var l = n[r];
      if (!y.call(t, l) || !ht(e[l], t[l])) return !1;
    }
    return !0;
  }
  function Gs(e) {
    for (; e && e.firstChild; ) e = e.firstChild;
    return e;
  }
  function Ys(e, t) {
    var n = Gs(e);
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
      n = Gs(n);
    }
  }
  function Xs(e, t) {
    return e && t ? e === t ? !0 : e && e.nodeType === 3 ? !1 : t && t.nodeType === 3 ? Xs(e, t.parentNode) : "contains" in e ? e.contains(t) : e.compareDocumentPosition ? !!(e.compareDocumentPosition(t) & 16) : !1 : !1;
  }
  function Zs() {
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
  function ki(e) {
    var t = e && e.nodeName && e.nodeName.toLowerCase();
    return t && (t === "input" && (e.type === "text" || e.type === "search" || e.type === "tel" || e.type === "url" || e.type === "password") || t === "textarea" || e.contentEditable === "true");
  }
  function _d(e) {
    var t = Zs(), n = e.focusedElem, r = e.selectionRange;
    if (t !== n && n && n.ownerDocument && Xs(n.ownerDocument.documentElement, n)) {
      if (r !== null && ki(n)) {
        if (t = r.start, e = r.end, e === void 0 && (e = t), "selectionStart" in n) n.selectionStart = t, n.selectionEnd = Math.min(e, n.value.length);
        else if (e = (t = n.ownerDocument || document) && t.defaultView || window, e.getSelection) {
          e = e.getSelection();
          var l = n.textContent.length, i = Math.min(r.start, l);
          r = r.end === void 0 ? i : Math.min(r.end, l), !e.extend && i > r && (l = r, r = i, i = l), l = Ys(n, i);
          var o = Ys(
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
  var Td = C && "documentMode" in document && 11 >= document.documentMode, kn = null, Si = null, sr = null, Ei = !1;
  function Js(e, t, n) {
    var r = n.window === n ? n.document : n.nodeType === 9 ? n : n.ownerDocument;
    Ei || kn == null || kn !== Lr(r) || (r = kn, "selectionStart" in r && ki(r) ? r = { start: r.selectionStart, end: r.selectionEnd } : (r = (r.ownerDocument && r.ownerDocument.defaultView || window).getSelection(), r = { anchorNode: r.anchorNode, anchorOffset: r.anchorOffset, focusNode: r.focusNode, focusOffset: r.focusOffset }), sr && or(sr, r) || (sr = r, r = el(Si, "onSelect"), 0 < r.length && (t = new pi("onSelect", "select", null, t, n), e.push({ event: t, listeners: r }), t.target = kn)));
  }
  function Jr(e, t) {
    var n = {};
    return n[e.toLowerCase()] = t.toLowerCase(), n["Webkit" + e] = "webkit" + t, n["Moz" + e] = "moz" + t, n;
  }
  var Sn = { animationend: Jr("Animation", "AnimationEnd"), animationiteration: Jr("Animation", "AnimationIteration"), animationstart: Jr("Animation", "AnimationStart"), transitionend: Jr("Transition", "TransitionEnd") }, ji = {}, qs = {};
  C && (qs = document.createElement("div").style, "AnimationEvent" in window || (delete Sn.animationend.animation, delete Sn.animationiteration.animation, delete Sn.animationstart.animation), "TransitionEvent" in window || delete Sn.transitionend.transition);
  function qr(e) {
    if (ji[e]) return ji[e];
    if (!Sn[e]) return e;
    var t = Sn[e], n;
    for (n in t) if (t.hasOwnProperty(n) && n in qs) return ji[e] = t[n];
    return e;
  }
  var bs = qr("animationend"), eu = qr("animationiteration"), tu = qr("animationstart"), nu = qr("transitionend"), ru = /* @__PURE__ */ new Map(), lu = "abort auxClick cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");
  function $t(e, t) {
    ru.set(e, t), E(t, [e]);
  }
  for (var Ni = 0; Ni < lu.length; Ni++) {
    var Ci = lu[Ni], Pd = Ci.toLowerCase(), zd = Ci[0].toUpperCase() + Ci.slice(1);
    $t(Pd, "on" + zd);
  }
  $t(bs, "onAnimationEnd"), $t(eu, "onAnimationIteration"), $t(tu, "onAnimationStart"), $t("dblclick", "onDoubleClick"), $t("focusin", "onFocus"), $t("focusout", "onBlur"), $t(nu, "onTransitionEnd"), N("onMouseEnter", ["mouseout", "mouseover"]), N("onMouseLeave", ["mouseout", "mouseover"]), N("onPointerEnter", ["pointerout", "pointerover"]), N("onPointerLeave", ["pointerout", "pointerover"]), E("onChange", "change click focusin focusout input keydown keyup selectionchange".split(" ")), E("onSelect", "focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" ")), E("onBeforeInput", ["compositionend", "keypress", "textInput", "paste"]), E("onCompositionEnd", "compositionend focusout keydown keypress keyup mousedown".split(" ")), E("onCompositionStart", "compositionstart focusout keydown keypress keyup mousedown".split(" ")), E("onCompositionUpdate", "compositionupdate focusout keydown keypress keyup mousedown".split(" "));
  var ur = "abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "), Md = new Set("cancel close invalid load scroll toggle".split(" ").concat(ur));
  function iu(e, t, n) {
    var r = e.type || "unknown-event";
    e.currentTarget = n, Pc(r, t, void 0, e), e.currentTarget = null;
  }
  function ou(e, t) {
    t = (t & 4) !== 0;
    for (var n = 0; n < e.length; n++) {
      var r = e[n], l = r.event;
      r = r.listeners;
      e: {
        var i = void 0;
        if (t) for (var o = r.length - 1; 0 <= o; o--) {
          var d = r[o], p = d.instance, x = d.currentTarget;
          if (d = d.listener, p !== i && l.isPropagationStopped()) break e;
          iu(l, d, x), i = p;
        }
        else for (o = 0; o < r.length; o++) {
          if (d = r[o], p = d.instance, x = d.currentTarget, d = d.listener, p !== i && l.isPropagationStopped()) break e;
          iu(l, d, x), i = p;
        }
      }
    }
    if (Fr) throw e = ri, Fr = !1, ri = null, e;
  }
  function ge(e, t) {
    var n = t[Ii];
    n === void 0 && (n = t[Ii] = /* @__PURE__ */ new Set());
    var r = e + "__bubble";
    n.has(r) || (su(t, e, 2, !1), n.add(r));
  }
  function _i(e, t, n) {
    var r = 0;
    t && (r |= 4), su(n, e, r, t);
  }
  var br = "_reactListening" + Math.random().toString(36).slice(2);
  function ar(e) {
    if (!e[br]) {
      e[br] = !0, w.forEach(function(n) {
        n !== "selectionchange" && (Md.has(n) || _i(n, !1, e), _i(n, !0, e));
      });
      var t = e.nodeType === 9 ? e : e.ownerDocument;
      t === null || t[br] || (t[br] = !0, _i("selectionchange", !1, t));
    }
  }
  function su(e, t, n, r) {
    switch (zs(t)) {
      case 1:
        var l = Qc;
        break;
      case 4:
        l = Kc;
        break;
      default:
        l = ci;
    }
    n = l.bind(null, t, n, e), l = void 0, !ni || t !== "touchstart" && t !== "touchmove" && t !== "wheel" || (l = !0), r ? l !== void 0 ? e.addEventListener(t, n, { capture: !0, passive: l }) : e.addEventListener(t, n, !0) : l !== void 0 ? e.addEventListener(t, n, { passive: l }) : e.addEventListener(t, n, !1);
  }
  function Ti(e, t, n, r, l) {
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
          if (o = tn(d), o === null) return;
          if (p = o.tag, p === 5 || p === 6) {
            r = i = o;
            continue e;
          }
          d = d.parentNode;
        }
      }
      r = r.return;
    }
    fs(function() {
      var x = i, z = bl(n), R = [];
      e: {
        var P = ru.get(e);
        if (P !== void 0) {
          var O = pi, H = e;
          switch (e) {
            case "keypress":
              if (Gr(n) === 0) break e;
            case "keydown":
            case "keyup":
              O = sd;
              break;
            case "focusin":
              H = "focus", O = vi;
              break;
            case "focusout":
              H = "blur", O = vi;
              break;
            case "beforeblur":
            case "afterblur":
              O = vi;
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
              O = Ls;
              break;
            case "drag":
            case "dragend":
            case "dragenter":
            case "dragexit":
            case "dragleave":
            case "dragover":
            case "dragstart":
            case "drop":
              O = Xc;
              break;
            case "touchcancel":
            case "touchend":
            case "touchmove":
            case "touchstart":
              O = cd;
              break;
            case bs:
            case eu:
            case tu:
              O = qc;
              break;
            case nu:
              O = fd;
              break;
            case "scroll":
              O = Gc;
              break;
            case "wheel":
              O = hd;
              break;
            case "copy":
            case "cut":
            case "paste":
              O = ed;
              break;
            case "gotpointercapture":
            case "lostpointercapture":
            case "pointercancel":
            case "pointerdown":
            case "pointermove":
            case "pointerout":
            case "pointerover":
            case "pointerup":
              O = Ds;
          }
          var B = (t & 4) !== 0, Te = !B && e === "scroll", m = B ? P !== null ? P + "Capture" : null : P;
          B = [];
          for (var h = x, g; h !== null; ) {
            g = h;
            var I = g.stateNode;
            if (g.tag === 5 && I !== null && (g = I, m !== null && (I = Qn(h, m), I != null && B.push(cr(h, I, g)))), Te) break;
            h = h.return;
          }
          0 < B.length && (P = new O(P, H, null, n, z), R.push({ event: P, listeners: B }));
        }
      }
      if ((t & 7) === 0) {
        e: {
          if (P = e === "mouseover" || e === "pointerover", O = e === "mouseout" || e === "pointerout", P && n !== ql && (H = n.relatedTarget || n.fromElement) && (tn(H) || H[Nt])) break e;
          if ((O || P) && (P = z.window === z ? z : (P = z.ownerDocument) ? P.defaultView || P.parentWindow : window, O ? (H = n.relatedTarget || n.toElement, O = x, H = H ? tn(H) : null, H !== null && (Te = en(H), H !== Te || H.tag !== 5 && H.tag !== 6) && (H = null)) : (O = null, H = x), O !== H)) {
            if (B = Ls, I = "onMouseLeave", m = "onMouseEnter", h = "mouse", (e === "pointerout" || e === "pointerover") && (B = Ds, I = "onPointerLeave", m = "onPointerEnter", h = "pointer"), Te = O == null ? P : Nn(O), g = H == null ? P : Nn(H), P = new B(I, h + "leave", O, n, z), P.target = Te, P.relatedTarget = g, I = null, tn(z) === x && (B = new B(m, h + "enter", H, n, z), B.target = g, B.relatedTarget = Te, I = B), Te = I, O && H) t: {
              for (B = O, m = H, h = 0, g = B; g; g = En(g)) h++;
              for (g = 0, I = m; I; I = En(I)) g++;
              for (; 0 < h - g; ) B = En(B), h--;
              for (; 0 < g - h; ) m = En(m), g--;
              for (; h--; ) {
                if (B === m || m !== null && B === m.alternate) break t;
                B = En(B), m = En(m);
              }
              B = null;
            }
            else B = null;
            O !== null && uu(R, P, O, B, !1), H !== null && Te !== null && uu(R, Te, H, B, !0);
          }
        }
        e: {
          if (P = x ? Nn(x) : window, O = P.nodeName && P.nodeName.toLowerCase(), O === "select" || O === "input" && P.type === "file") var V = kd;
          else if (Hs(P)) if (Vs) V = Nd;
          else {
            V = Ed;
            var Q = Sd;
          }
          else (O = P.nodeName) && O.toLowerCase() === "input" && (P.type === "checkbox" || P.type === "radio") && (V = jd);
          if (V && (V = V(e, x))) {
            Bs(R, V, n, z);
            break e;
          }
          Q && Q(e, P, x), e === "focusout" && (Q = P._wrapperState) && Q.controlled && P.type === "number" && Gl(P, "number", P.value);
        }
        switch (Q = x ? Nn(x) : window, e) {
          case "focusin":
            (Hs(Q) || Q.contentEditable === "true") && (kn = Q, Si = x, sr = null);
            break;
          case "focusout":
            sr = Si = kn = null;
            break;
          case "mousedown":
            Ei = !0;
            break;
          case "contextmenu":
          case "mouseup":
          case "dragend":
            Ei = !1, Js(R, n, z);
            break;
          case "selectionchange":
            if (Td) break;
          case "keydown":
          case "keyup":
            Js(R, n, z);
        }
        var K;
        if (yi) e: {
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
        else wn ? $s(e, n) && (J = "onCompositionEnd") : e === "keydown" && n.keyCode === 229 && (J = "onCompositionStart");
        J && (Fs && n.locale !== "ko" && (wn || J !== "onCompositionStart" ? J === "onCompositionEnd" && wn && (K = Ms()) : (At = z, fi = "value" in At ? At.value : At.textContent, wn = !0)), Q = el(x, J), 0 < Q.length && (J = new Is(J, e, null, n, z), R.push({ event: J, listeners: Q }), K ? J.data = K : (K = Us(n), K !== null && (J.data = K)))), (K = vd ? gd(e, n) : yd(e, n)) && (x = el(x, "onBeforeInput"), 0 < x.length && (z = new Is("onBeforeInput", "beforeinput", null, n, z), R.push({ event: z, listeners: x }), z.data = K));
      }
      ou(R, t);
    });
  }
  function cr(e, t, n) {
    return { instance: e, listener: t, currentTarget: n };
  }
  function el(e, t) {
    for (var n = t + "Capture", r = []; e !== null; ) {
      var l = e, i = l.stateNode;
      l.tag === 5 && i !== null && (l = i, i = Qn(e, n), i != null && r.unshift(cr(e, i, l)), i = Qn(e, t), i != null && r.push(cr(e, i, l))), e = e.return;
    }
    return r;
  }
  function En(e) {
    if (e === null) return null;
    do
      e = e.return;
    while (e && e.tag !== 5);
    return e || null;
  }
  function uu(e, t, n, r, l) {
    for (var i = t._reactName, o = []; n !== null && n !== r; ) {
      var d = n, p = d.alternate, x = d.stateNode;
      if (p !== null && p === r) break;
      d.tag === 5 && x !== null && (d = x, l ? (p = Qn(n, i), p != null && o.unshift(cr(n, p, d))) : l || (p = Qn(n, i), p != null && o.push(cr(n, p, d)))), n = n.return;
    }
    o.length !== 0 && e.push({ event: t, listeners: o });
  }
  var Rd = /\r\n?/g, Ld = /\u0000|\uFFFD/g;
  function au(e) {
    return (typeof e == "string" ? e : "" + e).replace(Rd, `
`).replace(Ld, "");
  }
  function tl(e, t, n) {
    if (t = au(t), au(e) !== t && n) throw Error(s(425));
  }
  function nl() {
  }
  var Pi = null, zi = null;
  function Mi(e, t) {
    return e === "textarea" || e === "noscript" || typeof t.children == "string" || typeof t.children == "number" || typeof t.dangerouslySetInnerHTML == "object" && t.dangerouslySetInnerHTML !== null && t.dangerouslySetInnerHTML.__html != null;
  }
  var Ri = typeof setTimeout == "function" ? setTimeout : void 0, Id = typeof clearTimeout == "function" ? clearTimeout : void 0, cu = typeof Promise == "function" ? Promise : void 0, Dd = typeof queueMicrotask == "function" ? queueMicrotask : typeof cu < "u" ? function(e) {
    return cu.resolve(null).then(e).catch(Fd);
  } : Ri;
  function Fd(e) {
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
          e.removeChild(l), er(t);
          return;
        }
        r--;
      } else n !== "$" && n !== "$?" && n !== "$!" || r++;
      n = l;
    } while (n);
    er(t);
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
  function du(e) {
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
  var jn = Math.random().toString(36).slice(2), kt = "__reactFiber$" + jn, dr = "__reactProps$" + jn, Nt = "__reactContainer$" + jn, Ii = "__reactEvents$" + jn, Od = "__reactListeners$" + jn, Ad = "__reactHandles$" + jn;
  function tn(e) {
    var t = e[kt];
    if (t) return t;
    for (var n = e.parentNode; n; ) {
      if (t = n[Nt] || n[kt]) {
        if (n = t.alternate, t.child !== null || n !== null && n.child !== null) for (e = du(e); e !== null; ) {
          if (n = e[kt]) return n;
          e = du(e);
        }
        return t;
      }
      e = n, n = e.parentNode;
    }
    return null;
  }
  function fr(e) {
    return e = e[kt] || e[Nt], !e || e.tag !== 5 && e.tag !== 6 && e.tag !== 13 && e.tag !== 3 ? null : e;
  }
  function Nn(e) {
    if (e.tag === 5 || e.tag === 6) return e.stateNode;
    throw Error(s(33));
  }
  function rl(e) {
    return e[dr] || null;
  }
  var Di = [], Cn = -1;
  function Ht(e) {
    return { current: e };
  }
  function ye(e) {
    0 > Cn || (e.current = Di[Cn], Di[Cn] = null, Cn--);
  }
  function he(e, t) {
    Cn++, Di[Cn] = e.current, e.current = t;
  }
  var Bt = {}, He = Ht(Bt), Xe = Ht(!1), nn = Bt;
  function _n(e, t) {
    var n = e.type.contextTypes;
    if (!n) return Bt;
    var r = e.stateNode;
    if (r && r.__reactInternalMemoizedUnmaskedChildContext === t) return r.__reactInternalMemoizedMaskedChildContext;
    var l = {}, i;
    for (i in n) l[i] = t[i];
    return r && (e = e.stateNode, e.__reactInternalMemoizedUnmaskedChildContext = t, e.__reactInternalMemoizedMaskedChildContext = l), l;
  }
  function Ze(e) {
    return e = e.childContextTypes, e != null;
  }
  function ll() {
    ye(Xe), ye(He);
  }
  function fu(e, t, n) {
    if (He.current !== Bt) throw Error(s(168));
    he(He, t), he(Xe, n);
  }
  function pu(e, t, n) {
    var r = e.stateNode;
    if (t = t.childContextTypes, typeof r.getChildContext != "function") return n;
    r = r.getChildContext();
    for (var l in r) if (!(l in t)) throw Error(s(108, se(e) || "Unknown", l));
    return j({}, n, r);
  }
  function il(e) {
    return e = (e = e.stateNode) && e.__reactInternalMemoizedMergedChildContext || Bt, nn = He.current, he(He, e), he(Xe, Xe.current), !0;
  }
  function hu(e, t, n) {
    var r = e.stateNode;
    if (!r) throw Error(s(169));
    n ? (e = pu(e, t, nn), r.__reactInternalMemoizedMergedChildContext = e, ye(Xe), ye(He), he(He, e)) : ye(Xe), he(Xe, n);
  }
  var Ct = null, ol = !1, Fi = !1;
  function mu(e) {
    Ct === null ? Ct = [e] : Ct.push(e);
  }
  function $d(e) {
    ol = !0, mu(e);
  }
  function Vt() {
    if (!Fi && Ct !== null) {
      Fi = !0;
      var e = 0, t = fe;
      try {
        var n = Ct;
        for (fe = 1; e < n.length; e++) {
          var r = n[e];
          do
            r = r(!0);
          while (r !== null);
        }
        Ct = null, ol = !1;
      } catch (l) {
        throw Ct !== null && (Ct = Ct.slice(e + 1)), gs(li, Vt), l;
      } finally {
        fe = t, Fi = !1;
      }
    }
    return null;
  }
  var Tn = [], Pn = 0, sl = null, ul = 0, ot = [], st = 0, rn = null, _t = 1, Tt = "";
  function ln(e, t) {
    Tn[Pn++] = ul, Tn[Pn++] = sl, sl = e, ul = t;
  }
  function vu(e, t, n) {
    ot[st++] = _t, ot[st++] = Tt, ot[st++] = rn, rn = e;
    var r = _t;
    e = Tt;
    var l = 32 - pt(r) - 1;
    r &= ~(1 << l), n += 1;
    var i = 32 - pt(t) + l;
    if (30 < i) {
      var o = l - l % 5;
      i = (r & (1 << o) - 1).toString(32), r >>= o, l -= o, _t = 1 << 32 - pt(t) + l | n << l | r, Tt = i + e;
    } else _t = 1 << i | n << l | r, Tt = e;
  }
  function Oi(e) {
    e.return !== null && (ln(e, 1), vu(e, 1, 0));
  }
  function Ai(e) {
    for (; e === sl; ) sl = Tn[--Pn], Tn[Pn] = null, ul = Tn[--Pn], Tn[Pn] = null;
    for (; e === rn; ) rn = ot[--st], ot[st] = null, Tt = ot[--st], ot[st] = null, _t = ot[--st], ot[st] = null;
  }
  var nt = null, rt = null, ke = !1, mt = null;
  function gu(e, t) {
    var n = dt(5, null, null, 0);
    n.elementType = "DELETED", n.stateNode = t, n.return = e, t = e.deletions, t === null ? (e.deletions = [n], e.flags |= 16) : t.push(n);
  }
  function yu(e, t) {
    switch (e.tag) {
      case 5:
        var n = e.type;
        return t = t.nodeType !== 1 || n.toLowerCase() !== t.nodeName.toLowerCase() ? null : t, t !== null ? (e.stateNode = t, nt = e, rt = Ut(t.firstChild), !0) : !1;
      case 6:
        return t = e.pendingProps === "" || t.nodeType !== 3 ? null : t, t !== null ? (e.stateNode = t, nt = e, rt = null, !0) : !1;
      case 13:
        return t = t.nodeType !== 8 ? null : t, t !== null ? (n = rn !== null ? { id: _t, overflow: Tt } : null, e.memoizedState = { dehydrated: t, treeContext: n, retryLane: 1073741824 }, n = dt(18, null, null, 0), n.stateNode = t, n.return = e, e.child = n, nt = e, rt = null, !0) : !1;
      default:
        return !1;
    }
  }
  function $i(e) {
    return (e.mode & 1) !== 0 && (e.flags & 128) === 0;
  }
  function Ui(e) {
    if (ke) {
      var t = rt;
      if (t) {
        var n = t;
        if (!yu(e, t)) {
          if ($i(e)) throw Error(s(418));
          t = Ut(n.nextSibling);
          var r = nt;
          t && yu(e, t) ? gu(r, n) : (e.flags = e.flags & -4097 | 2, ke = !1, nt = e);
        }
      } else {
        if ($i(e)) throw Error(s(418));
        e.flags = e.flags & -4097 | 2, ke = !1, nt = e;
      }
    }
  }
  function xu(e) {
    for (e = e.return; e !== null && e.tag !== 5 && e.tag !== 3 && e.tag !== 13; ) e = e.return;
    nt = e;
  }
  function al(e) {
    if (e !== nt) return !1;
    if (!ke) return xu(e), ke = !0, !1;
    var t;
    if ((t = e.tag !== 3) && !(t = e.tag !== 5) && (t = e.type, t = t !== "head" && t !== "body" && !Mi(e.type, e.memoizedProps)), t && (t = rt)) {
      if ($i(e)) throw wu(), Error(s(418));
      for (; t; ) gu(e, t), t = Ut(t.nextSibling);
    }
    if (xu(e), e.tag === 13) {
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
  function wu() {
    for (var e = rt; e; ) e = Ut(e.nextSibling);
  }
  function zn() {
    rt = nt = null, ke = !1;
  }
  function Hi(e) {
    mt === null ? mt = [e] : mt.push(e);
  }
  var Ud = ve.ReactCurrentBatchConfig;
  function pr(e, t, n) {
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
  function cl(e, t) {
    throw e = Object.prototype.toString.call(t), Error(s(31, e === "[object Object]" ? "object with keys {" + Object.keys(t).join(", ") + "}" : e));
  }
  function ku(e) {
    var t = e._init;
    return t(e._payload);
  }
  function Su(e) {
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
      return m = Jt(m, h), m.index = 0, m.sibling = null, m;
    }
    function i(m, h, g) {
      return m.index = g, e ? (g = m.alternate, g !== null ? (g = g.index, g < h ? (m.flags |= 2, h) : g) : (m.flags |= 2, h)) : (m.flags |= 1048576, h);
    }
    function o(m) {
      return e && m.alternate === null && (m.flags |= 2), m;
    }
    function d(m, h, g, I) {
      return h === null || h.tag !== 6 ? (h = Lo(g, m.mode, I), h.return = m, h) : (h = l(h, g), h.return = m, h);
    }
    function p(m, h, g, I) {
      var V = g.type;
      return V === ue ? z(m, h, g.props.children, I, g.key) : h !== null && (h.elementType === V || typeof V == "object" && V !== null && V.$$typeof === Ie && ku(V) === h.type) ? (I = l(h, g.props), I.ref = pr(m, h, g), I.return = m, I) : (I = Il(g.type, g.key, g.props, null, m.mode, I), I.ref = pr(m, h, g), I.return = m, I);
    }
    function x(m, h, g, I) {
      return h === null || h.tag !== 4 || h.stateNode.containerInfo !== g.containerInfo || h.stateNode.implementation !== g.implementation ? (h = Io(g, m.mode, I), h.return = m, h) : (h = l(h, g.children || []), h.return = m, h);
    }
    function z(m, h, g, I, V) {
      return h === null || h.tag !== 7 ? (h = pn(g, m.mode, I, V), h.return = m, h) : (h = l(h, g), h.return = m, h);
    }
    function R(m, h, g) {
      if (typeof h == "string" && h !== "" || typeof h == "number") return h = Lo("" + h, m.mode, g), h.return = m, h;
      if (typeof h == "object" && h !== null) {
        switch (h.$$typeof) {
          case ze:
            return g = Il(h.type, h.key, h.props, null, m.mode, g), g.ref = pr(m, null, h), g.return = m, g;
          case de:
            return h = Io(h, m.mode, g), h.return = m, h;
          case Ie:
            var I = h._init;
            return R(m, I(h._payload), g);
        }
        if (Bn(h) || k(h)) return h = pn(h, m.mode, g, null), h.return = m, h;
        cl(m, h);
      }
      return null;
    }
    function P(m, h, g, I) {
      var V = h !== null ? h.key : null;
      if (typeof g == "string" && g !== "" || typeof g == "number") return V !== null ? null : d(m, h, "" + g, I);
      if (typeof g == "object" && g !== null) {
        switch (g.$$typeof) {
          case ze:
            return g.key === V ? p(m, h, g, I) : null;
          case de:
            return g.key === V ? x(m, h, g, I) : null;
          case Ie:
            return V = g._init, P(
              m,
              h,
              V(g._payload),
              I
            );
        }
        if (Bn(g) || k(g)) return V !== null ? null : z(m, h, g, I, null);
        cl(m, g);
      }
      return null;
    }
    function O(m, h, g, I, V) {
      if (typeof I == "string" && I !== "" || typeof I == "number") return m = m.get(g) || null, d(h, m, "" + I, V);
      if (typeof I == "object" && I !== null) {
        switch (I.$$typeof) {
          case ze:
            return m = m.get(I.key === null ? g : I.key) || null, p(h, m, I, V);
          case de:
            return m = m.get(I.key === null ? g : I.key) || null, x(h, m, I, V);
          case Ie:
            var Q = I._init;
            return O(m, h, g, Q(I._payload), V);
        }
        if (Bn(I) || k(I)) return m = m.get(g) || null, z(h, m, I, V, null);
        cl(h, I);
      }
      return null;
    }
    function H(m, h, g, I) {
      for (var V = null, Q = null, K = h, J = h = 0, Oe = null; K !== null && J < g.length; J++) {
        K.index > J ? (Oe = K, K = null) : Oe = K.sibling;
        var ce = P(m, K, g[J], I);
        if (ce === null) {
          K === null && (K = Oe);
          break;
        }
        e && K && ce.alternate === null && t(m, K), h = i(ce, h, J), Q === null ? V = ce : Q.sibling = ce, Q = ce, K = Oe;
      }
      if (J === g.length) return n(m, K), ke && ln(m, J), V;
      if (K === null) {
        for (; J < g.length; J++) K = R(m, g[J], I), K !== null && (h = i(K, h, J), Q === null ? V = K : Q.sibling = K, Q = K);
        return ke && ln(m, J), V;
      }
      for (K = r(m, K); J < g.length; J++) Oe = O(K, m, J, g[J], I), Oe !== null && (e && Oe.alternate !== null && K.delete(Oe.key === null ? J : Oe.key), h = i(Oe, h, J), Q === null ? V = Oe : Q.sibling = Oe, Q = Oe);
      return e && K.forEach(function(qt) {
        return t(m, qt);
      }), ke && ln(m, J), V;
    }
    function B(m, h, g, I) {
      var V = k(g);
      if (typeof V != "function") throw Error(s(150));
      if (g = V.call(g), g == null) throw Error(s(151));
      for (var Q = V = null, K = h, J = h = 0, Oe = null, ce = g.next(); K !== null && !ce.done; J++, ce = g.next()) {
        K.index > J ? (Oe = K, K = null) : Oe = K.sibling;
        var qt = P(m, K, ce.value, I);
        if (qt === null) {
          K === null && (K = Oe);
          break;
        }
        e && K && qt.alternate === null && t(m, K), h = i(qt, h, J), Q === null ? V = qt : Q.sibling = qt, Q = qt, K = Oe;
      }
      if (ce.done) return n(
        m,
        K
      ), ke && ln(m, J), V;
      if (K === null) {
        for (; !ce.done; J++, ce = g.next()) ce = R(m, ce.value, I), ce !== null && (h = i(ce, h, J), Q === null ? V = ce : Q.sibling = ce, Q = ce);
        return ke && ln(m, J), V;
      }
      for (K = r(m, K); !ce.done; J++, ce = g.next()) ce = O(K, m, J, ce.value, I), ce !== null && (e && ce.alternate !== null && K.delete(ce.key === null ? J : ce.key), h = i(ce, h, J), Q === null ? V = ce : Q.sibling = ce, Q = ce);
      return e && K.forEach(function(wf) {
        return t(m, wf);
      }), ke && ln(m, J), V;
    }
    function Te(m, h, g, I) {
      if (typeof g == "object" && g !== null && g.type === ue && g.key === null && (g = g.props.children), typeof g == "object" && g !== null) {
        switch (g.$$typeof) {
          case ze:
            e: {
              for (var V = g.key, Q = h; Q !== null; ) {
                if (Q.key === V) {
                  if (V = g.type, V === ue) {
                    if (Q.tag === 7) {
                      n(m, Q.sibling), h = l(Q, g.props.children), h.return = m, m = h;
                      break e;
                    }
                  } else if (Q.elementType === V || typeof V == "object" && V !== null && V.$$typeof === Ie && ku(V) === Q.type) {
                    n(m, Q.sibling), h = l(Q, g.props), h.ref = pr(m, Q, g), h.return = m, m = h;
                    break e;
                  }
                  n(m, Q);
                  break;
                } else t(m, Q);
                Q = Q.sibling;
              }
              g.type === ue ? (h = pn(g.props.children, m.mode, I, g.key), h.return = m, m = h) : (I = Il(g.type, g.key, g.props, null, m.mode, I), I.ref = pr(m, h, g), I.return = m, m = I);
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
              h = Io(g, m.mode, I), h.return = m, m = h;
            }
            return o(m);
          case Ie:
            return Q = g._init, Te(m, h, Q(g._payload), I);
        }
        if (Bn(g)) return H(m, h, g, I);
        if (k(g)) return B(m, h, g, I);
        cl(m, g);
      }
      return typeof g == "string" && g !== "" || typeof g == "number" ? (g = "" + g, h !== null && h.tag === 6 ? (n(m, h.sibling), h = l(h, g), h.return = m, m = h) : (n(m, h), h = Lo(g, m.mode, I), h.return = m, m = h), o(m)) : n(m, h);
    }
    return Te;
  }
  var Mn = Su(!0), Eu = Su(!1), dl = Ht(null), fl = null, Rn = null, Bi = null;
  function Vi() {
    Bi = Rn = fl = null;
  }
  function Wi(e) {
    var t = dl.current;
    ye(dl), e._currentValue = t;
  }
  function Qi(e, t, n) {
    for (; e !== null; ) {
      var r = e.alternate;
      if ((e.childLanes & t) !== t ? (e.childLanes |= t, r !== null && (r.childLanes |= t)) : r !== null && (r.childLanes & t) !== t && (r.childLanes |= t), e === n) break;
      e = e.return;
    }
  }
  function Ln(e, t) {
    fl = e, Bi = Rn = null, e = e.dependencies, e !== null && e.firstContext !== null && ((e.lanes & t) !== 0 && (Je = !0), e.firstContext = null);
  }
  function ut(e) {
    var t = e._currentValue;
    if (Bi !== e) if (e = { context: e, memoizedValue: t, next: null }, Rn === null) {
      if (fl === null) throw Error(s(308));
      Rn = e, fl.dependencies = { lanes: 0, firstContext: e };
    } else Rn = Rn.next = e;
    return t;
  }
  var on = null;
  function Ki(e) {
    on === null ? on = [e] : on.push(e);
  }
  function ju(e, t, n, r) {
    var l = t.interleaved;
    return l === null ? (n.next = n, Ki(t)) : (n.next = l.next, l.next = n), t.interleaved = n, Pt(e, r);
  }
  function Pt(e, t) {
    e.lanes |= t;
    var n = e.alternate;
    for (n !== null && (n.lanes |= t), n = e, e = e.return; e !== null; ) e.childLanes |= t, n = e.alternate, n !== null && (n.childLanes |= t), n = e, e = e.return;
    return n.tag === 3 ? n.stateNode : null;
  }
  var Wt = !1;
  function Gi(e) {
    e.updateQueue = { baseState: e.memoizedState, firstBaseUpdate: null, lastBaseUpdate: null, shared: { pending: null, interleaved: null, lanes: 0 }, effects: null };
  }
  function Nu(e, t) {
    e = e.updateQueue, t.updateQueue === e && (t.updateQueue = { baseState: e.baseState, firstBaseUpdate: e.firstBaseUpdate, lastBaseUpdate: e.lastBaseUpdate, shared: e.shared, effects: e.effects });
  }
  function zt(e, t) {
    return { eventTime: e, lane: t, tag: 0, payload: null, callback: null, next: null };
  }
  function Qt(e, t, n) {
    var r = e.updateQueue;
    if (r === null) return null;
    if (r = r.shared, (ae & 2) !== 0) {
      var l = r.pending;
      return l === null ? t.next = t : (t.next = l.next, l.next = t), r.pending = t, Pt(e, n);
    }
    return l = r.interleaved, l === null ? (t.next = t, Ki(r)) : (t.next = l.next, l.next = t), r.interleaved = t, Pt(e, n);
  }
  function pl(e, t, n) {
    if (t = t.updateQueue, t !== null && (t = t.shared, (n & 4194240) !== 0)) {
      var r = t.lanes;
      r &= e.pendingLanes, n |= r, t.lanes = n, si(e, n);
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
  function hl(e, t, n, r) {
    var l = e.updateQueue;
    Wt = !1;
    var i = l.firstBaseUpdate, o = l.lastBaseUpdate, d = l.shared.pending;
    if (d !== null) {
      l.shared.pending = null;
      var p = d, x = p.next;
      p.next = null, o === null ? i = x : o.next = x, o = p;
      var z = e.alternate;
      z !== null && (z = z.updateQueue, d = z.lastBaseUpdate, d !== o && (d === null ? z.firstBaseUpdate = x : d.next = x, z.lastBaseUpdate = p));
    }
    if (i !== null) {
      var R = l.baseState;
      o = 0, z = x = p = null, d = i;
      do {
        var P = d.lane, O = d.eventTime;
        if ((r & P) === P) {
          z !== null && (z = z.next = {
            eventTime: O,
            lane: 0,
            tag: d.tag,
            payload: d.payload,
            callback: d.callback,
            next: null
          });
          e: {
            var H = e, B = d;
            switch (P = t, O = n, B.tag) {
              case 1:
                if (H = B.payload, typeof H == "function") {
                  R = H.call(O, R, P);
                  break e;
                }
                R = H;
                break e;
              case 3:
                H.flags = H.flags & -65537 | 128;
              case 0:
                if (H = B.payload, P = typeof H == "function" ? H.call(O, R, P) : H, P == null) break e;
                R = j({}, R, P);
                break e;
              case 2:
                Wt = !0;
            }
          }
          d.callback !== null && d.lane !== 0 && (e.flags |= 64, P = l.effects, P === null ? l.effects = [d] : P.push(d));
        } else O = { eventTime: O, lane: P, tag: d.tag, payload: d.payload, callback: d.callback, next: null }, z === null ? (x = z = O, p = R) : z = z.next = O, o |= P;
        if (d = d.next, d === null) {
          if (d = l.shared.pending, d === null) break;
          P = d, d = P.next, P.next = null, l.lastBaseUpdate = P, l.shared.pending = null;
        }
      } while (!0);
      if (z === null && (p = R), l.baseState = p, l.firstBaseUpdate = x, l.lastBaseUpdate = z, t = l.shared.interleaved, t !== null) {
        l = t;
        do
          o |= l.lane, l = l.next;
        while (l !== t);
      } else i === null && (l.shared.lanes = 0);
      an |= o, e.lanes = o, e.memoizedState = R;
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
  var hr = {}, St = Ht(hr), mr = Ht(hr), vr = Ht(hr);
  function sn(e) {
    if (e === hr) throw Error(s(174));
    return e;
  }
  function Yi(e, t) {
    switch (he(vr, t), he(mr, e), he(St, hr), e = t.nodeType, e) {
      case 9:
      case 11:
        t = (t = t.documentElement) ? t.namespaceURI : Xl(null, "");
        break;
      default:
        e = e === 8 ? t.parentNode : t, t = e.namespaceURI || null, e = e.tagName, t = Xl(t, e);
    }
    ye(St), he(St, t);
  }
  function In() {
    ye(St), ye(mr), ye(vr);
  }
  function Tu(e) {
    sn(vr.current);
    var t = sn(St.current), n = Xl(t, e.type);
    t !== n && (he(mr, e), he(St, n));
  }
  function Xi(e) {
    mr.current === e && (ye(St), ye(mr));
  }
  var Se = Ht(0);
  function ml(e) {
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
  var Zi = [];
  function Ji() {
    for (var e = 0; e < Zi.length; e++) Zi[e]._workInProgressVersionPrimary = null;
    Zi.length = 0;
  }
  var vl = ve.ReactCurrentDispatcher, qi = ve.ReactCurrentBatchConfig, un = 0, Ee = null, Me = null, De = null, gl = !1, gr = !1, yr = 0, Hd = 0;
  function Be() {
    throw Error(s(321));
  }
  function bi(e, t) {
    if (t === null) return !1;
    for (var n = 0; n < t.length && n < e.length; n++) if (!ht(e[n], t[n])) return !1;
    return !0;
  }
  function eo(e, t, n, r, l, i) {
    if (un = i, Ee = t, t.memoizedState = null, t.updateQueue = null, t.lanes = 0, vl.current = e === null || e.memoizedState === null ? Qd : Kd, e = n(r, l), gr) {
      i = 0;
      do {
        if (gr = !1, yr = 0, 25 <= i) throw Error(s(301));
        i += 1, De = Me = null, t.updateQueue = null, vl.current = Gd, e = n(r, l);
      } while (gr);
    }
    if (vl.current = wl, t = Me !== null && Me.next !== null, un = 0, De = Me = Ee = null, gl = !1, t) throw Error(s(300));
    return e;
  }
  function to() {
    var e = yr !== 0;
    return yr = 0, e;
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
  function xr(e, t) {
    return typeof t == "function" ? t(e) : t;
  }
  function no(e) {
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
      var d = o = null, p = null, x = i;
      do {
        var z = x.lane;
        if ((un & z) === z) p !== null && (p = p.next = { lane: 0, action: x.action, hasEagerState: x.hasEagerState, eagerState: x.eagerState, next: null }), r = x.hasEagerState ? x.eagerState : e(r, x.action);
        else {
          var R = {
            lane: z,
            action: x.action,
            hasEagerState: x.hasEagerState,
            eagerState: x.eagerState,
            next: null
          };
          p === null ? (d = p = R, o = r) : p = p.next = R, Ee.lanes |= z, an |= z;
        }
        x = x.next;
      } while (x !== null && x !== i);
      p === null ? o = r : p.next = d, ht(r, t.memoizedState) || (Je = !0), t.memoizedState = r, t.baseState = o, t.baseQueue = p, n.lastRenderedState = r;
    }
    if (e = n.interleaved, e !== null) {
      l = e;
      do
        i = l.lane, Ee.lanes |= i, an |= i, l = l.next;
      while (l !== e);
    } else l === null && (n.lanes = 0);
    return [t.memoizedState, n.dispatch];
  }
  function ro(e) {
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
  function zu(e, t) {
    var n = Ee, r = at(), l = t(), i = !ht(r.memoizedState, l);
    if (i && (r.memoizedState = l, Je = !0), r = r.queue, lo(Lu.bind(null, n, r, e), [e]), r.getSnapshot !== t || i || De !== null && De.memoizedState.tag & 1) {
      if (n.flags |= 2048, wr(9, Ru.bind(null, n, r, l, t), void 0, null), Fe === null) throw Error(s(349));
      (un & 30) !== 0 || Mu(n, t, l);
    }
    return l;
  }
  function Mu(e, t, n) {
    e.flags |= 16384, e = { getSnapshot: t, value: n }, t = Ee.updateQueue, t === null ? (t = { lastEffect: null, stores: null }, Ee.updateQueue = t, t.stores = [e]) : (n = t.stores, n === null ? t.stores = [e] : n.push(e));
  }
  function Ru(e, t, n, r) {
    t.value = n, t.getSnapshot = r, Iu(t) && Du(e);
  }
  function Lu(e, t, n) {
    return n(function() {
      Iu(t) && Du(e);
    });
  }
  function Iu(e) {
    var t = e.getSnapshot;
    e = e.value;
    try {
      var n = t();
      return !ht(e, n);
    } catch {
      return !0;
    }
  }
  function Du(e) {
    var t = Pt(e, 1);
    t !== null && xt(t, e, 1, -1);
  }
  function Fu(e) {
    var t = Et();
    return typeof e == "function" && (e = e()), t.memoizedState = t.baseState = e, e = { pending: null, interleaved: null, lanes: 0, dispatch: null, lastRenderedReducer: xr, lastRenderedState: e }, t.queue = e, e = e.dispatch = Wd.bind(null, Ee, e), [t.memoizedState, e];
  }
  function wr(e, t, n, r) {
    return e = { tag: e, create: t, destroy: n, deps: r, next: null }, t = Ee.updateQueue, t === null ? (t = { lastEffect: null, stores: null }, Ee.updateQueue = t, t.lastEffect = e.next = e) : (n = t.lastEffect, n === null ? t.lastEffect = e.next = e : (r = n.next, n.next = e, e.next = r, t.lastEffect = e)), e;
  }
  function Ou() {
    return at().memoizedState;
  }
  function yl(e, t, n, r) {
    var l = Et();
    Ee.flags |= e, l.memoizedState = wr(1 | t, n, void 0, r === void 0 ? null : r);
  }
  function xl(e, t, n, r) {
    var l = at();
    r = r === void 0 ? null : r;
    var i = void 0;
    if (Me !== null) {
      var o = Me.memoizedState;
      if (i = o.destroy, r !== null && bi(r, o.deps)) {
        l.memoizedState = wr(t, n, i, r);
        return;
      }
    }
    Ee.flags |= e, l.memoizedState = wr(1 | t, n, i, r);
  }
  function Au(e, t) {
    return yl(8390656, 8, e, t);
  }
  function lo(e, t) {
    return xl(2048, 8, e, t);
  }
  function $u(e, t) {
    return xl(4, 2, e, t);
  }
  function Uu(e, t) {
    return xl(4, 4, e, t);
  }
  function Hu(e, t) {
    if (typeof t == "function") return e = e(), t(e), function() {
      t(null);
    };
    if (t != null) return e = e(), t.current = e, function() {
      t.current = null;
    };
  }
  function Bu(e, t, n) {
    return n = n != null ? n.concat([e]) : null, xl(4, 4, Hu.bind(null, t, e), n);
  }
  function io() {
  }
  function Vu(e, t) {
    var n = at();
    t = t === void 0 ? null : t;
    var r = n.memoizedState;
    return r !== null && t !== null && bi(t, r[1]) ? r[0] : (n.memoizedState = [e, t], e);
  }
  function Wu(e, t) {
    var n = at();
    t = t === void 0 ? null : t;
    var r = n.memoizedState;
    return r !== null && t !== null && bi(t, r[1]) ? r[0] : (e = e(), n.memoizedState = [e, t], e);
  }
  function Qu(e, t, n) {
    return (un & 21) === 0 ? (e.baseState && (e.baseState = !1, Je = !0), e.memoizedState = n) : (ht(n, t) || (n = ks(), Ee.lanes |= n, an |= n, e.baseState = !0), t);
  }
  function Bd(e, t) {
    var n = fe;
    fe = n !== 0 && 4 > n ? n : 4, e(!0);
    var r = qi.transition;
    qi.transition = {};
    try {
      e(!1), t();
    } finally {
      fe = n, qi.transition = r;
    }
  }
  function Ku() {
    return at().memoizedState;
  }
  function Vd(e, t, n) {
    var r = Xt(e);
    if (n = { lane: r, action: n, hasEagerState: !1, eagerState: null, next: null }, Gu(e)) Yu(t, n);
    else if (n = ju(e, t, n, r), n !== null) {
      var l = Ke();
      xt(n, e, r, l), Xu(n, t, r);
    }
  }
  function Wd(e, t, n) {
    var r = Xt(e), l = { lane: r, action: n, hasEagerState: !1, eagerState: null, next: null };
    if (Gu(e)) Yu(t, l);
    else {
      var i = e.alternate;
      if (e.lanes === 0 && (i === null || i.lanes === 0) && (i = t.lastRenderedReducer, i !== null)) try {
        var o = t.lastRenderedState, d = i(o, n);
        if (l.hasEagerState = !0, l.eagerState = d, ht(d, o)) {
          var p = t.interleaved;
          p === null ? (l.next = l, Ki(t)) : (l.next = p.next, p.next = l), t.interleaved = l;
          return;
        }
      } catch {
      } finally {
      }
      n = ju(e, t, l, r), n !== null && (l = Ke(), xt(n, e, r, l), Xu(n, t, r));
    }
  }
  function Gu(e) {
    var t = e.alternate;
    return e === Ee || t !== null && t === Ee;
  }
  function Yu(e, t) {
    gr = gl = !0;
    var n = e.pending;
    n === null ? t.next = t : (t.next = n.next, n.next = t), e.pending = t;
  }
  function Xu(e, t, n) {
    if ((n & 4194240) !== 0) {
      var r = t.lanes;
      r &= e.pendingLanes, n |= r, t.lanes = n, si(e, n);
    }
  }
  var wl = { readContext: ut, useCallback: Be, useContext: Be, useEffect: Be, useImperativeHandle: Be, useInsertionEffect: Be, useLayoutEffect: Be, useMemo: Be, useReducer: Be, useRef: Be, useState: Be, useDebugValue: Be, useDeferredValue: Be, useTransition: Be, useMutableSource: Be, useSyncExternalStore: Be, useId: Be, unstable_isNewReconciler: !1 }, Qd = { readContext: ut, useCallback: function(e, t) {
    return Et().memoizedState = [e, t === void 0 ? null : t], e;
  }, useContext: ut, useEffect: Au, useImperativeHandle: function(e, t, n) {
    return n = n != null ? n.concat([e]) : null, yl(
      4194308,
      4,
      Hu.bind(null, t, e),
      n
    );
  }, useLayoutEffect: function(e, t) {
    return yl(4194308, 4, e, t);
  }, useInsertionEffect: function(e, t) {
    return yl(4, 2, e, t);
  }, useMemo: function(e, t) {
    var n = Et();
    return t = t === void 0 ? null : t, e = e(), n.memoizedState = [e, t], e;
  }, useReducer: function(e, t, n) {
    var r = Et();
    return t = n !== void 0 ? n(t) : t, r.memoizedState = r.baseState = t, e = { pending: null, interleaved: null, lanes: 0, dispatch: null, lastRenderedReducer: e, lastRenderedState: t }, r.queue = e, e = e.dispatch = Vd.bind(null, Ee, e), [r.memoizedState, e];
  }, useRef: function(e) {
    var t = Et();
    return e = { current: e }, t.memoizedState = e;
  }, useState: Fu, useDebugValue: io, useDeferredValue: function(e) {
    return Et().memoizedState = e;
  }, useTransition: function() {
    var e = Fu(!1), t = e[0];
    return e = Bd.bind(null, e[1]), Et().memoizedState = e, [t, e];
  }, useMutableSource: function() {
  }, useSyncExternalStore: function(e, t, n) {
    var r = Ee, l = Et();
    if (ke) {
      if (n === void 0) throw Error(s(407));
      n = n();
    } else {
      if (n = t(), Fe === null) throw Error(s(349));
      (un & 30) !== 0 || Mu(r, t, n);
    }
    l.memoizedState = n;
    var i = { value: n, getSnapshot: t };
    return l.queue = i, Au(Lu.bind(
      null,
      r,
      i,
      e
    ), [e]), r.flags |= 2048, wr(9, Ru.bind(null, r, i, n, t), void 0, null), n;
  }, useId: function() {
    var e = Et(), t = Fe.identifierPrefix;
    if (ke) {
      var n = Tt, r = _t;
      n = (r & ~(1 << 32 - pt(r) - 1)).toString(32) + n, t = ":" + t + "R" + n, n = yr++, 0 < n && (t += "H" + n.toString(32)), t += ":";
    } else n = Hd++, t = ":" + t + "r" + n.toString(32) + ":";
    return e.memoizedState = t;
  }, unstable_isNewReconciler: !1 }, Kd = {
    readContext: ut,
    useCallback: Vu,
    useContext: ut,
    useEffect: lo,
    useImperativeHandle: Bu,
    useInsertionEffect: $u,
    useLayoutEffect: Uu,
    useMemo: Wu,
    useReducer: no,
    useRef: Ou,
    useState: function() {
      return no(xr);
    },
    useDebugValue: io,
    useDeferredValue: function(e) {
      var t = at();
      return Qu(t, Me.memoizedState, e);
    },
    useTransition: function() {
      var e = no(xr)[0], t = at().memoizedState;
      return [e, t];
    },
    useMutableSource: Pu,
    useSyncExternalStore: zu,
    useId: Ku,
    unstable_isNewReconciler: !1
  }, Gd = { readContext: ut, useCallback: Vu, useContext: ut, useEffect: lo, useImperativeHandle: Bu, useInsertionEffect: $u, useLayoutEffect: Uu, useMemo: Wu, useReducer: ro, useRef: Ou, useState: function() {
    return ro(xr);
  }, useDebugValue: io, useDeferredValue: function(e) {
    var t = at();
    return Me === null ? t.memoizedState = e : Qu(t, Me.memoizedState, e);
  }, useTransition: function() {
    var e = ro(xr)[0], t = at().memoizedState;
    return [e, t];
  }, useMutableSource: Pu, useSyncExternalStore: zu, useId: Ku, unstable_isNewReconciler: !1 };
  function vt(e, t) {
    if (e && e.defaultProps) {
      t = j({}, t), e = e.defaultProps;
      for (var n in e) t[n] === void 0 && (t[n] = e[n]);
      return t;
    }
    return t;
  }
  function oo(e, t, n, r) {
    t = e.memoizedState, n = n(r, t), n = n == null ? t : j({}, t, n), e.memoizedState = n, e.lanes === 0 && (e.updateQueue.baseState = n);
  }
  var kl = { isMounted: function(e) {
    return (e = e._reactInternals) ? en(e) === e : !1;
  }, enqueueSetState: function(e, t, n) {
    e = e._reactInternals;
    var r = Ke(), l = Xt(e), i = zt(r, l);
    i.payload = t, n != null && (i.callback = n), t = Qt(e, i, l), t !== null && (xt(t, e, l, r), pl(t, e, l));
  }, enqueueReplaceState: function(e, t, n) {
    e = e._reactInternals;
    var r = Ke(), l = Xt(e), i = zt(r, l);
    i.tag = 1, i.payload = t, n != null && (i.callback = n), t = Qt(e, i, l), t !== null && (xt(t, e, l, r), pl(t, e, l));
  }, enqueueForceUpdate: function(e, t) {
    e = e._reactInternals;
    var n = Ke(), r = Xt(e), l = zt(n, r);
    l.tag = 2, t != null && (l.callback = t), t = Qt(e, l, r), t !== null && (xt(t, e, r, n), pl(t, e, r));
  } };
  function Zu(e, t, n, r, l, i, o) {
    return e = e.stateNode, typeof e.shouldComponentUpdate == "function" ? e.shouldComponentUpdate(r, i, o) : t.prototype && t.prototype.isPureReactComponent ? !or(n, r) || !or(l, i) : !0;
  }
  function Ju(e, t, n) {
    var r = !1, l = Bt, i = t.contextType;
    return typeof i == "object" && i !== null ? i = ut(i) : (l = Ze(t) ? nn : He.current, r = t.contextTypes, i = (r = r != null) ? _n(e, l) : Bt), t = new t(n, i), e.memoizedState = t.state !== null && t.state !== void 0 ? t.state : null, t.updater = kl, e.stateNode = t, t._reactInternals = e, r && (e = e.stateNode, e.__reactInternalMemoizedUnmaskedChildContext = l, e.__reactInternalMemoizedMaskedChildContext = i), t;
  }
  function qu(e, t, n, r) {
    e = t.state, typeof t.componentWillReceiveProps == "function" && t.componentWillReceiveProps(n, r), typeof t.UNSAFE_componentWillReceiveProps == "function" && t.UNSAFE_componentWillReceiveProps(n, r), t.state !== e && kl.enqueueReplaceState(t, t.state, null);
  }
  function so(e, t, n, r) {
    var l = e.stateNode;
    l.props = n, l.state = e.memoizedState, l.refs = {}, Gi(e);
    var i = t.contextType;
    typeof i == "object" && i !== null ? l.context = ut(i) : (i = Ze(t) ? nn : He.current, l.context = _n(e, i)), l.state = e.memoizedState, i = t.getDerivedStateFromProps, typeof i == "function" && (oo(e, t, i, n), l.state = e.memoizedState), typeof t.getDerivedStateFromProps == "function" || typeof l.getSnapshotBeforeUpdate == "function" || typeof l.UNSAFE_componentWillMount != "function" && typeof l.componentWillMount != "function" || (t = l.state, typeof l.componentWillMount == "function" && l.componentWillMount(), typeof l.UNSAFE_componentWillMount == "function" && l.UNSAFE_componentWillMount(), t !== l.state && kl.enqueueReplaceState(l, l.state, null), hl(e, n, l, r), l.state = e.memoizedState), typeof l.componentDidMount == "function" && (e.flags |= 4194308);
  }
  function Dn(e, t) {
    try {
      var n = "", r = t;
      do
        n += ee(r), r = r.return;
      while (r);
      var l = n;
    } catch (i) {
      l = `
Error generating stack: ` + i.message + `
` + i.stack;
    }
    return { value: e, source: t, stack: l, digest: null };
  }
  function uo(e, t, n) {
    return { value: e, source: null, stack: n ?? null, digest: t ?? null };
  }
  function ao(e, t) {
    try {
      console.error(t.value);
    } catch (n) {
      setTimeout(function() {
        throw n;
      });
    }
  }
  var Yd = typeof WeakMap == "function" ? WeakMap : Map;
  function bu(e, t, n) {
    n = zt(-1, n), n.tag = 3, n.payload = { element: null };
    var r = t.value;
    return n.callback = function() {
      Tl || (Tl = !0, No = r), ao(e, t);
    }, n;
  }
  function ea(e, t, n) {
    n = zt(-1, n), n.tag = 3;
    var r = e.type.getDerivedStateFromError;
    if (typeof r == "function") {
      var l = t.value;
      n.payload = function() {
        return r(l);
      }, n.callback = function() {
        ao(e, t);
      };
    }
    var i = e.stateNode;
    return i !== null && typeof i.componentDidCatch == "function" && (n.callback = function() {
      ao(e, t), typeof r != "function" && (Gt === null ? Gt = /* @__PURE__ */ new Set([this]) : Gt.add(this));
      var o = t.stack;
      this.componentDidCatch(t.value, { componentStack: o !== null ? o : "" });
    }), n;
  }
  function ta(e, t, n) {
    var r = e.pingCache;
    if (r === null) {
      r = e.pingCache = new Yd();
      var l = /* @__PURE__ */ new Set();
      r.set(t, l);
    } else l = r.get(t), l === void 0 && (l = /* @__PURE__ */ new Set(), r.set(t, l));
    l.has(n) || (l.add(n), e = af.bind(null, e, t, n), t.then(e, e));
  }
  function na(e) {
    do {
      var t;
      if ((t = e.tag === 13) && (t = e.memoizedState, t = t !== null ? t.dehydrated !== null : !0), t) return e;
      e = e.return;
    } while (e !== null);
    return null;
  }
  function ra(e, t, n, r, l) {
    return (e.mode & 1) === 0 ? (e === t ? e.flags |= 65536 : (e.flags |= 128, n.flags |= 131072, n.flags &= -52805, n.tag === 1 && (n.alternate === null ? n.tag = 17 : (t = zt(-1, 1), t.tag = 2, Qt(n, t, 1))), n.lanes |= 1), e) : (e.flags |= 65536, e.lanes = l, e);
  }
  var Xd = ve.ReactCurrentOwner, Je = !1;
  function Qe(e, t, n, r) {
    t.child = e === null ? Eu(t, null, n, r) : Mn(t, e.child, n, r);
  }
  function la(e, t, n, r, l) {
    n = n.render;
    var i = t.ref;
    return Ln(t, l), r = eo(e, t, n, r, i, l), n = to(), e !== null && !Je ? (t.updateQueue = e.updateQueue, t.flags &= -2053, e.lanes &= ~l, Mt(e, t, l)) : (ke && n && Oi(t), t.flags |= 1, Qe(e, t, r, l), t.child);
  }
  function ia(e, t, n, r, l) {
    if (e === null) {
      var i = n.type;
      return typeof i == "function" && !Ro(i) && i.defaultProps === void 0 && n.compare === null && n.defaultProps === void 0 ? (t.tag = 15, t.type = i, oa(e, t, i, r, l)) : (e = Il(n.type, null, r, t, t.mode, l), e.ref = t.ref, e.return = t, t.child = e);
    }
    if (i = e.child, (e.lanes & l) === 0) {
      var o = i.memoizedProps;
      if (n = n.compare, n = n !== null ? n : or, n(o, r) && e.ref === t.ref) return Mt(e, t, l);
    }
    return t.flags |= 1, e = Jt(i, r), e.ref = t.ref, e.return = t, t.child = e;
  }
  function oa(e, t, n, r, l) {
    if (e !== null) {
      var i = e.memoizedProps;
      if (or(i, r) && e.ref === t.ref) if (Je = !1, t.pendingProps = r = i, (e.lanes & l) !== 0) (e.flags & 131072) !== 0 && (Je = !0);
      else return t.lanes = e.lanes, Mt(e, t, l);
    }
    return co(e, t, n, r, l);
  }
  function sa(e, t, n) {
    var r = t.pendingProps, l = r.children, i = e !== null ? e.memoizedState : null;
    if (r.mode === "hidden") if ((t.mode & 1) === 0) t.memoizedState = { baseLanes: 0, cachePool: null, transitions: null }, he(On, lt), lt |= n;
    else {
      if ((n & 1073741824) === 0) return e = i !== null ? i.baseLanes | n : n, t.lanes = t.childLanes = 1073741824, t.memoizedState = { baseLanes: e, cachePool: null, transitions: null }, t.updateQueue = null, he(On, lt), lt |= e, null;
      t.memoizedState = { baseLanes: 0, cachePool: null, transitions: null }, r = i !== null ? i.baseLanes : n, he(On, lt), lt |= r;
    }
    else i !== null ? (r = i.baseLanes | n, t.memoizedState = null) : r = n, he(On, lt), lt |= r;
    return Qe(e, t, l, n), t.child;
  }
  function ua(e, t) {
    var n = t.ref;
    (e === null && n !== null || e !== null && e.ref !== n) && (t.flags |= 512, t.flags |= 2097152);
  }
  function co(e, t, n, r, l) {
    var i = Ze(n) ? nn : He.current;
    return i = _n(t, i), Ln(t, l), n = eo(e, t, n, r, i, l), r = to(), e !== null && !Je ? (t.updateQueue = e.updateQueue, t.flags &= -2053, e.lanes &= ~l, Mt(e, t, l)) : (ke && r && Oi(t), t.flags |= 1, Qe(e, t, n, l), t.child);
  }
  function aa(e, t, n, r, l) {
    if (Ze(n)) {
      var i = !0;
      il(t);
    } else i = !1;
    if (Ln(t, l), t.stateNode === null) El(e, t), Ju(t, n, r), so(t, n, r, l), r = !0;
    else if (e === null) {
      var o = t.stateNode, d = t.memoizedProps;
      o.props = d;
      var p = o.context, x = n.contextType;
      typeof x == "object" && x !== null ? x = ut(x) : (x = Ze(n) ? nn : He.current, x = _n(t, x));
      var z = n.getDerivedStateFromProps, R = typeof z == "function" || typeof o.getSnapshotBeforeUpdate == "function";
      R || typeof o.UNSAFE_componentWillReceiveProps != "function" && typeof o.componentWillReceiveProps != "function" || (d !== r || p !== x) && qu(t, o, r, x), Wt = !1;
      var P = t.memoizedState;
      o.state = P, hl(t, r, o, l), p = t.memoizedState, d !== r || P !== p || Xe.current || Wt ? (typeof z == "function" && (oo(t, n, z, r), p = t.memoizedState), (d = Wt || Zu(t, n, d, r, P, p, x)) ? (R || typeof o.UNSAFE_componentWillMount != "function" && typeof o.componentWillMount != "function" || (typeof o.componentWillMount == "function" && o.componentWillMount(), typeof o.UNSAFE_componentWillMount == "function" && o.UNSAFE_componentWillMount()), typeof o.componentDidMount == "function" && (t.flags |= 4194308)) : (typeof o.componentDidMount == "function" && (t.flags |= 4194308), t.memoizedProps = r, t.memoizedState = p), o.props = r, o.state = p, o.context = x, r = d) : (typeof o.componentDidMount == "function" && (t.flags |= 4194308), r = !1);
    } else {
      o = t.stateNode, Nu(e, t), d = t.memoizedProps, x = t.type === t.elementType ? d : vt(t.type, d), o.props = x, R = t.pendingProps, P = o.context, p = n.contextType, typeof p == "object" && p !== null ? p = ut(p) : (p = Ze(n) ? nn : He.current, p = _n(t, p));
      var O = n.getDerivedStateFromProps;
      (z = typeof O == "function" || typeof o.getSnapshotBeforeUpdate == "function") || typeof o.UNSAFE_componentWillReceiveProps != "function" && typeof o.componentWillReceiveProps != "function" || (d !== R || P !== p) && qu(t, o, r, p), Wt = !1, P = t.memoizedState, o.state = P, hl(t, r, o, l);
      var H = t.memoizedState;
      d !== R || P !== H || Xe.current || Wt ? (typeof O == "function" && (oo(t, n, O, r), H = t.memoizedState), (x = Wt || Zu(t, n, x, r, P, H, p) || !1) ? (z || typeof o.UNSAFE_componentWillUpdate != "function" && typeof o.componentWillUpdate != "function" || (typeof o.componentWillUpdate == "function" && o.componentWillUpdate(r, H, p), typeof o.UNSAFE_componentWillUpdate == "function" && o.UNSAFE_componentWillUpdate(r, H, p)), typeof o.componentDidUpdate == "function" && (t.flags |= 4), typeof o.getSnapshotBeforeUpdate == "function" && (t.flags |= 1024)) : (typeof o.componentDidUpdate != "function" || d === e.memoizedProps && P === e.memoizedState || (t.flags |= 4), typeof o.getSnapshotBeforeUpdate != "function" || d === e.memoizedProps && P === e.memoizedState || (t.flags |= 1024), t.memoizedProps = r, t.memoizedState = H), o.props = r, o.state = H, o.context = p, r = x) : (typeof o.componentDidUpdate != "function" || d === e.memoizedProps && P === e.memoizedState || (t.flags |= 4), typeof o.getSnapshotBeforeUpdate != "function" || d === e.memoizedProps && P === e.memoizedState || (t.flags |= 1024), r = !1);
    }
    return fo(e, t, n, r, i, l);
  }
  function fo(e, t, n, r, l, i) {
    ua(e, t);
    var o = (t.flags & 128) !== 0;
    if (!r && !o) return l && hu(t, n, !1), Mt(e, t, i);
    r = t.stateNode, Xd.current = t;
    var d = o && typeof n.getDerivedStateFromError != "function" ? null : r.render();
    return t.flags |= 1, e !== null && o ? (t.child = Mn(t, e.child, null, i), t.child = Mn(t, null, d, i)) : Qe(e, t, d, i), t.memoizedState = r.state, l && hu(t, n, !0), t.child;
  }
  function ca(e) {
    var t = e.stateNode;
    t.pendingContext ? fu(e, t.pendingContext, t.pendingContext !== t.context) : t.context && fu(e, t.context, !1), Yi(e, t.containerInfo);
  }
  function da(e, t, n, r, l) {
    return zn(), Hi(l), t.flags |= 256, Qe(e, t, n, r), t.child;
  }
  var po = { dehydrated: null, treeContext: null, retryLane: 0 };
  function ho(e) {
    return { baseLanes: e, cachePool: null, transitions: null };
  }
  function fa(e, t, n) {
    var r = t.pendingProps, l = Se.current, i = !1, o = (t.flags & 128) !== 0, d;
    if ((d = o) || (d = e !== null && e.memoizedState === null ? !1 : (l & 2) !== 0), d ? (i = !0, t.flags &= -129) : (e === null || e.memoizedState !== null) && (l |= 1), he(Se, l & 1), e === null)
      return Ui(t), e = t.memoizedState, e !== null && (e = e.dehydrated, e !== null) ? ((t.mode & 1) === 0 ? t.lanes = 1 : e.data === "$!" ? t.lanes = 8 : t.lanes = 1073741824, null) : (o = r.children, e = r.fallback, i ? (r = t.mode, i = t.child, o = { mode: "hidden", children: o }, (r & 1) === 0 && i !== null ? (i.childLanes = 0, i.pendingProps = o) : i = Dl(o, r, 0, null), e = pn(e, r, n, null), i.return = t, e.return = t, i.sibling = e, t.child = i, t.child.memoizedState = ho(n), t.memoizedState = po, e) : mo(t, o));
    if (l = e.memoizedState, l !== null && (d = l.dehydrated, d !== null)) return Zd(e, t, o, r, d, l, n);
    if (i) {
      i = r.fallback, o = t.mode, l = e.child, d = l.sibling;
      var p = { mode: "hidden", children: r.children };
      return (o & 1) === 0 && t.child !== l ? (r = t.child, r.childLanes = 0, r.pendingProps = p, t.deletions = null) : (r = Jt(l, p), r.subtreeFlags = l.subtreeFlags & 14680064), d !== null ? i = Jt(d, i) : (i = pn(i, o, n, null), i.flags |= 2), i.return = t, r.return = t, r.sibling = i, t.child = r, r = i, i = t.child, o = e.child.memoizedState, o = o === null ? ho(n) : { baseLanes: o.baseLanes | n, cachePool: null, transitions: o.transitions }, i.memoizedState = o, i.childLanes = e.childLanes & ~n, t.memoizedState = po, r;
    }
    return i = e.child, e = i.sibling, r = Jt(i, { mode: "visible", children: r.children }), (t.mode & 1) === 0 && (r.lanes = n), r.return = t, r.sibling = null, e !== null && (n = t.deletions, n === null ? (t.deletions = [e], t.flags |= 16) : n.push(e)), t.child = r, t.memoizedState = null, r;
  }
  function mo(e, t) {
    return t = Dl({ mode: "visible", children: t }, e.mode, 0, null), t.return = e, e.child = t;
  }
  function Sl(e, t, n, r) {
    return r !== null && Hi(r), Mn(t, e.child, null, n), e = mo(t, t.pendingProps.children), e.flags |= 2, t.memoizedState = null, e;
  }
  function Zd(e, t, n, r, l, i, o) {
    if (n)
      return t.flags & 256 ? (t.flags &= -257, r = uo(Error(s(422))), Sl(e, t, o, r)) : t.memoizedState !== null ? (t.child = e.child, t.flags |= 128, null) : (i = r.fallback, l = t.mode, r = Dl({ mode: "visible", children: r.children }, l, 0, null), i = pn(i, l, o, null), i.flags |= 2, r.return = t, i.return = t, r.sibling = i, t.child = r, (t.mode & 1) !== 0 && Mn(t, e.child, null, o), t.child.memoizedState = ho(o), t.memoizedState = po, i);
    if ((t.mode & 1) === 0) return Sl(e, t, o, null);
    if (l.data === "$!") {
      if (r = l.nextSibling && l.nextSibling.dataset, r) var d = r.dgst;
      return r = d, i = Error(s(419)), r = uo(i, r, void 0), Sl(e, t, o, r);
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
        l = (l & (r.suspendedLanes | o)) !== 0 ? 0 : l, l !== 0 && l !== i.retryLane && (i.retryLane = l, Pt(e, l), xt(r, e, l, -1));
      }
      return Mo(), r = uo(Error(s(421))), Sl(e, t, o, r);
    }
    return l.data === "$?" ? (t.flags |= 128, t.child = e.child, t = cf.bind(null, e), l._reactRetry = t, null) : (e = i.treeContext, rt = Ut(l.nextSibling), nt = t, ke = !0, mt = null, e !== null && (ot[st++] = _t, ot[st++] = Tt, ot[st++] = rn, _t = e.id, Tt = e.overflow, rn = t), t = mo(t, r.children), t.flags |= 4096, t);
  }
  function pa(e, t, n) {
    e.lanes |= t;
    var r = e.alternate;
    r !== null && (r.lanes |= t), Qi(e.return, t, n);
  }
  function vo(e, t, n, r, l) {
    var i = e.memoizedState;
    i === null ? e.memoizedState = { isBackwards: t, rendering: null, renderingStartTime: 0, last: r, tail: n, tailMode: l } : (i.isBackwards = t, i.rendering = null, i.renderingStartTime = 0, i.last = r, i.tail = n, i.tailMode = l);
  }
  function ha(e, t, n) {
    var r = t.pendingProps, l = r.revealOrder, i = r.tail;
    if (Qe(e, t, r.children, n), r = Se.current, (r & 2) !== 0) r = r & 1 | 2, t.flags |= 128;
    else {
      if (e !== null && (e.flags & 128) !== 0) e: for (e = t.child; e !== null; ) {
        if (e.tag === 13) e.memoizedState !== null && pa(e, n, t);
        else if (e.tag === 19) pa(e, n, t);
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
        for (n = t.child, l = null; n !== null; ) e = n.alternate, e !== null && ml(e) === null && (l = n), n = n.sibling;
        n = l, n === null ? (l = t.child, t.child = null) : (l = n.sibling, n.sibling = null), vo(t, !1, l, n, i);
        break;
      case "backwards":
        for (n = null, l = t.child, t.child = null; l !== null; ) {
          if (e = l.alternate, e !== null && ml(e) === null) {
            t.child = l;
            break;
          }
          e = l.sibling, l.sibling = n, n = l, l = e;
        }
        vo(t, !0, n, null, i);
        break;
      case "together":
        vo(t, !1, null, null, void 0);
        break;
      default:
        t.memoizedState = null;
    }
    return t.child;
  }
  function El(e, t) {
    (t.mode & 1) === 0 && e !== null && (e.alternate = null, t.alternate = null, t.flags |= 2);
  }
  function Mt(e, t, n) {
    if (e !== null && (t.dependencies = e.dependencies), an |= t.lanes, (n & t.childLanes) === 0) return null;
    if (e !== null && t.child !== e.child) throw Error(s(153));
    if (t.child !== null) {
      for (e = t.child, n = Jt(e, e.pendingProps), t.child = n, n.return = t; e.sibling !== null; ) e = e.sibling, n = n.sibling = Jt(e, e.pendingProps), n.return = t;
      n.sibling = null;
    }
    return t.child;
  }
  function Jd(e, t, n) {
    switch (t.tag) {
      case 3:
        ca(t), zn();
        break;
      case 5:
        Tu(t);
        break;
      case 1:
        Ze(t.type) && il(t);
        break;
      case 4:
        Yi(t, t.stateNode.containerInfo);
        break;
      case 10:
        var r = t.type._context, l = t.memoizedProps.value;
        he(dl, r._currentValue), r._currentValue = l;
        break;
      case 13:
        if (r = t.memoizedState, r !== null)
          return r.dehydrated !== null ? (he(Se, Se.current & 1), t.flags |= 128, null) : (n & t.child.childLanes) !== 0 ? fa(e, t, n) : (he(Se, Se.current & 1), e = Mt(e, t, n), e !== null ? e.sibling : null);
        he(Se, Se.current & 1);
        break;
      case 19:
        if (r = (n & t.childLanes) !== 0, (e.flags & 128) !== 0) {
          if (r) return ha(e, t, n);
          t.flags |= 128;
        }
        if (l = t.memoizedState, l !== null && (l.rendering = null, l.tail = null, l.lastEffect = null), he(Se, Se.current), r) break;
        return null;
      case 22:
      case 23:
        return t.lanes = 0, sa(e, t, n);
    }
    return Mt(e, t, n);
  }
  var ma, go, va, ga;
  ma = function(e, t) {
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
  }, go = function() {
  }, va = function(e, t, n, r) {
    var l = e.memoizedProps;
    if (l !== r) {
      e = t.stateNode, sn(St.current);
      var i = null;
      switch (n) {
        case "input":
          l = Ql(e, l), r = Ql(e, r), i = [];
          break;
        case "select":
          l = j({}, l, { value: void 0 }), r = j({}, r, { value: void 0 }), i = [];
          break;
        case "textarea":
          l = Yl(e, l), r = Yl(e, r), i = [];
          break;
        default:
          typeof l.onClick != "function" && typeof r.onClick == "function" && (e.onclick = nl);
      }
      Zl(n, r);
      var o;
      n = null;
      for (x in l) if (!r.hasOwnProperty(x) && l.hasOwnProperty(x) && l[x] != null) if (x === "style") {
        var d = l[x];
        for (o in d) d.hasOwnProperty(o) && (n || (n = {}), n[o] = "");
      } else x !== "dangerouslySetInnerHTML" && x !== "children" && x !== "suppressContentEditableWarning" && x !== "suppressHydrationWarning" && x !== "autoFocus" && (v.hasOwnProperty(x) ? i || (i = []) : (i = i || []).push(x, null));
      for (x in r) {
        var p = r[x];
        if (d = l != null ? l[x] : void 0, r.hasOwnProperty(x) && p !== d && (p != null || d != null)) if (x === "style") if (d) {
          for (o in d) !d.hasOwnProperty(o) || p && p.hasOwnProperty(o) || (n || (n = {}), n[o] = "");
          for (o in p) p.hasOwnProperty(o) && d[o] !== p[o] && (n || (n = {}), n[o] = p[o]);
        } else n || (i || (i = []), i.push(
          x,
          n
        )), n = p;
        else x === "dangerouslySetInnerHTML" ? (p = p ? p.__html : void 0, d = d ? d.__html : void 0, p != null && d !== p && (i = i || []).push(x, p)) : x === "children" ? typeof p != "string" && typeof p != "number" || (i = i || []).push(x, "" + p) : x !== "suppressContentEditableWarning" && x !== "suppressHydrationWarning" && (v.hasOwnProperty(x) ? (p != null && x === "onScroll" && ge("scroll", e), i || d === p || (i = [])) : (i = i || []).push(x, p));
      }
      n && (i = i || []).push("style", n);
      var x = i;
      (t.updateQueue = x) && (t.flags |= 4);
    }
  }, ga = function(e, t, n, r) {
    n !== r && (t.flags |= 4);
  };
  function kr(e, t) {
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
  function qd(e, t, n) {
    var r = t.pendingProps;
    switch (Ai(t), t.tag) {
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
        return Ze(t.type) && ll(), Ve(t), null;
      case 3:
        return r = t.stateNode, In(), ye(Xe), ye(He), Ji(), r.pendingContext && (r.context = r.pendingContext, r.pendingContext = null), (e === null || e.child === null) && (al(t) ? t.flags |= 4 : e === null || e.memoizedState.isDehydrated && (t.flags & 256) === 0 || (t.flags |= 1024, mt !== null && (To(mt), mt = null))), go(e, t), Ve(t), null;
      case 5:
        Xi(t);
        var l = sn(vr.current);
        if (n = t.type, e !== null && t.stateNode != null) va(e, t, n, r, l), e.ref !== t.ref && (t.flags |= 512, t.flags |= 2097152);
        else {
          if (!r) {
            if (t.stateNode === null) throw Error(s(166));
            return Ve(t), null;
          }
          if (e = sn(St.current), al(t)) {
            r = t.stateNode, n = t.type;
            var i = t.memoizedProps;
            switch (r[kt] = t, r[dr] = i, e = (t.mode & 1) !== 0, n) {
              case "dialog":
                ge("cancel", r), ge("close", r);
                break;
              case "iframe":
              case "object":
              case "embed":
                ge("load", r);
                break;
              case "video":
              case "audio":
                for (l = 0; l < ur.length; l++) ge(ur[l], r);
                break;
              case "source":
                ge("error", r);
                break;
              case "img":
              case "image":
              case "link":
                ge(
                  "error",
                  r
                ), ge("load", r);
                break;
              case "details":
                ge("toggle", r);
                break;
              case "input":
                Jo(r, i), ge("invalid", r);
                break;
              case "select":
                r._wrapperState = { wasMultiple: !!i.multiple }, ge("invalid", r);
                break;
              case "textarea":
                es(r, i), ge("invalid", r);
            }
            Zl(n, i), l = null;
            for (var o in i) if (i.hasOwnProperty(o)) {
              var d = i[o];
              o === "children" ? typeof d == "string" ? r.textContent !== d && (i.suppressHydrationWarning !== !0 && tl(r.textContent, d, e), l = ["children", d]) : typeof d == "number" && r.textContent !== "" + d && (i.suppressHydrationWarning !== !0 && tl(
                r.textContent,
                d,
                e
              ), l = ["children", "" + d]) : v.hasOwnProperty(o) && d != null && o === "onScroll" && ge("scroll", r);
            }
            switch (n) {
              case "input":
                ft(r), bo(r, i, !0);
                break;
              case "textarea":
                ft(r), ns(r);
                break;
              case "select":
              case "option":
                break;
              default:
                typeof i.onClick == "function" && (r.onclick = nl);
            }
            r = l, t.updateQueue = r, r !== null && (t.flags |= 4);
          } else {
            o = l.nodeType === 9 ? l : l.ownerDocument, e === "http://www.w3.org/1999/xhtml" && (e = rs(n)), e === "http://www.w3.org/1999/xhtml" ? n === "script" ? (e = o.createElement("div"), e.innerHTML = "<script><\/script>", e = e.removeChild(e.firstChild)) : typeof r.is == "string" ? e = o.createElement(n, { is: r.is }) : (e = o.createElement(n), n === "select" && (o = e, r.multiple ? o.multiple = !0 : r.size && (o.size = r.size))) : e = o.createElementNS(e, n), e[kt] = t, e[dr] = r, ma(e, t, !1, !1), t.stateNode = e;
            e: {
              switch (o = Jl(n, r), n) {
                case "dialog":
                  ge("cancel", e), ge("close", e), l = r;
                  break;
                case "iframe":
                case "object":
                case "embed":
                  ge("load", e), l = r;
                  break;
                case "video":
                case "audio":
                  for (l = 0; l < ur.length; l++) ge(ur[l], e);
                  l = r;
                  break;
                case "source":
                  ge("error", e), l = r;
                  break;
                case "img":
                case "image":
                case "link":
                  ge(
                    "error",
                    e
                  ), ge("load", e), l = r;
                  break;
                case "details":
                  ge("toggle", e), l = r;
                  break;
                case "input":
                  Jo(e, r), l = Ql(e, r), ge("invalid", e);
                  break;
                case "option":
                  l = r;
                  break;
                case "select":
                  e._wrapperState = { wasMultiple: !!r.multiple }, l = j({}, r, { value: void 0 }), ge("invalid", e);
                  break;
                case "textarea":
                  es(e, r), l = Yl(e, r), ge("invalid", e);
                  break;
                default:
                  l = r;
              }
              Zl(n, l), d = l;
              for (i in d) if (d.hasOwnProperty(i)) {
                var p = d[i];
                i === "style" ? os(e, p) : i === "dangerouslySetInnerHTML" ? (p = p ? p.__html : void 0, p != null && ls(e, p)) : i === "children" ? typeof p == "string" ? (n !== "textarea" || p !== "") && Vn(e, p) : typeof p == "number" && Vn(e, "" + p) : i !== "suppressContentEditableWarning" && i !== "suppressHydrationWarning" && i !== "autoFocus" && (v.hasOwnProperty(i) ? p != null && i === "onScroll" && ge("scroll", e) : p != null && Le(e, i, p, o));
              }
              switch (n) {
                case "input":
                  ft(e), bo(e, r, !1);
                  break;
                case "textarea":
                  ft(e), ns(e);
                  break;
                case "option":
                  r.value != null && e.setAttribute("value", "" + Z(r.value));
                  break;
                case "select":
                  e.multiple = !!r.multiple, i = r.value, i != null ? mn(e, !!r.multiple, i, !1) : r.defaultValue != null && mn(
                    e,
                    !!r.multiple,
                    r.defaultValue,
                    !0
                  );
                  break;
                default:
                  typeof l.onClick == "function" && (e.onclick = nl);
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
        if (e && t.stateNode != null) ga(e, t, e.memoizedProps, r);
        else {
          if (typeof r != "string" && t.stateNode === null) throw Error(s(166));
          if (n = sn(vr.current), sn(St.current), al(t)) {
            if (r = t.stateNode, n = t.memoizedProps, r[kt] = t, (i = r.nodeValue !== n) && (e = nt, e !== null)) switch (e.tag) {
              case 3:
                tl(r.nodeValue, n, (e.mode & 1) !== 0);
                break;
              case 5:
                e.memoizedProps.suppressHydrationWarning !== !0 && tl(r.nodeValue, n, (e.mode & 1) !== 0);
            }
            i && (t.flags |= 4);
          } else r = (n.nodeType === 9 ? n : n.ownerDocument).createTextNode(r), r[kt] = t, t.stateNode = r;
        }
        return Ve(t), null;
      case 13:
        if (ye(Se), r = t.memoizedState, e === null || e.memoizedState !== null && e.memoizedState.dehydrated !== null) {
          if (ke && rt !== null && (t.mode & 1) !== 0 && (t.flags & 128) === 0) wu(), zn(), t.flags |= 98560, i = !1;
          else if (i = al(t), r !== null && r.dehydrated !== null) {
            if (e === null) {
              if (!i) throw Error(s(318));
              if (i = t.memoizedState, i = i !== null ? i.dehydrated : null, !i) throw Error(s(317));
              i[kt] = t;
            } else zn(), (t.flags & 128) === 0 && (t.memoizedState = null), t.flags |= 4;
            Ve(t), i = !1;
          } else mt !== null && (To(mt), mt = null), i = !0;
          if (!i) return t.flags & 65536 ? t : null;
        }
        return (t.flags & 128) !== 0 ? (t.lanes = n, t) : (r = r !== null, r !== (e !== null && e.memoizedState !== null) && r && (t.child.flags |= 8192, (t.mode & 1) !== 0 && (e === null || (Se.current & 1) !== 0 ? Re === 0 && (Re = 3) : Mo())), t.updateQueue !== null && (t.flags |= 4), Ve(t), null);
      case 4:
        return In(), go(e, t), e === null && ar(t.stateNode.containerInfo), Ve(t), null;
      case 10:
        return Wi(t.type._context), Ve(t), null;
      case 17:
        return Ze(t.type) && ll(), Ve(t), null;
      case 19:
        if (ye(Se), i = t.memoizedState, i === null) return Ve(t), null;
        if (r = (t.flags & 128) !== 0, o = i.rendering, o === null) if (r) kr(i, !1);
        else {
          if (Re !== 0 || e !== null && (e.flags & 128) !== 0) for (e = t.child; e !== null; ) {
            if (o = ml(e), o !== null) {
              for (t.flags |= 128, kr(i, !1), r = o.updateQueue, r !== null && (t.updateQueue = r, t.flags |= 4), t.subtreeFlags = 0, r = n, n = t.child; n !== null; ) i = n, e = r, i.flags &= 14680066, o = i.alternate, o === null ? (i.childLanes = 0, i.lanes = e, i.child = null, i.subtreeFlags = 0, i.memoizedProps = null, i.memoizedState = null, i.updateQueue = null, i.dependencies = null, i.stateNode = null) : (i.childLanes = o.childLanes, i.lanes = o.lanes, i.child = o.child, i.subtreeFlags = 0, i.deletions = null, i.memoizedProps = o.memoizedProps, i.memoizedState = o.memoizedState, i.updateQueue = o.updateQueue, i.type = o.type, e = o.dependencies, i.dependencies = e === null ? null : { lanes: e.lanes, firstContext: e.firstContext }), n = n.sibling;
              return he(Se, Se.current & 1 | 2), t.child;
            }
            e = e.sibling;
          }
          i.tail !== null && _e() > An && (t.flags |= 128, r = !0, kr(i, !1), t.lanes = 4194304);
        }
        else {
          if (!r) if (e = ml(o), e !== null) {
            if (t.flags |= 128, r = !0, n = e.updateQueue, n !== null && (t.updateQueue = n, t.flags |= 4), kr(i, !0), i.tail === null && i.tailMode === "hidden" && !o.alternate && !ke) return Ve(t), null;
          } else 2 * _e() - i.renderingStartTime > An && n !== 1073741824 && (t.flags |= 128, r = !0, kr(i, !1), t.lanes = 4194304);
          i.isBackwards ? (o.sibling = t.child, t.child = o) : (n = i.last, n !== null ? n.sibling = o : t.child = o, i.last = o);
        }
        return i.tail !== null ? (t = i.tail, i.rendering = t, i.tail = t.sibling, i.renderingStartTime = _e(), t.sibling = null, n = Se.current, he(Se, r ? n & 1 | 2 : n & 1), t) : (Ve(t), null);
      case 22:
      case 23:
        return zo(), r = t.memoizedState !== null, e !== null && e.memoizedState !== null !== r && (t.flags |= 8192), r && (t.mode & 1) !== 0 ? (lt & 1073741824) !== 0 && (Ve(t), t.subtreeFlags & 6 && (t.flags |= 8192)) : Ve(t), null;
      case 24:
        return null;
      case 25:
        return null;
    }
    throw Error(s(156, t.tag));
  }
  function bd(e, t) {
    switch (Ai(t), t.tag) {
      case 1:
        return Ze(t.type) && ll(), e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
      case 3:
        return In(), ye(Xe), ye(He), Ji(), e = t.flags, (e & 65536) !== 0 && (e & 128) === 0 ? (t.flags = e & -65537 | 128, t) : null;
      case 5:
        return Xi(t), null;
      case 13:
        if (ye(Se), e = t.memoizedState, e !== null && e.dehydrated !== null) {
          if (t.alternate === null) throw Error(s(340));
          zn();
        }
        return e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
      case 19:
        return ye(Se), null;
      case 4:
        return In(), null;
      case 10:
        return Wi(t.type._context), null;
      case 22:
      case 23:
        return zo(), null;
      case 24:
        return null;
      default:
        return null;
    }
  }
  var jl = !1, We = !1, ef = typeof WeakSet == "function" ? WeakSet : Set, U = null;
  function Fn(e, t) {
    var n = e.ref;
    if (n !== null) if (typeof n == "function") try {
      n(null);
    } catch (r) {
      Ne(e, t, r);
    }
    else n.current = null;
  }
  function yo(e, t, n) {
    try {
      n();
    } catch (r) {
      Ne(e, t, r);
    }
  }
  var ya = !1;
  function tf(e, t) {
    if (Pi = Wr, e = Zs(), ki(e)) {
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
          var o = 0, d = -1, p = -1, x = 0, z = 0, R = e, P = null;
          t: for (; ; ) {
            for (var O; R !== n || l !== 0 && R.nodeType !== 3 || (d = o + l), R !== i || r !== 0 && R.nodeType !== 3 || (p = o + r), R.nodeType === 3 && (o += R.nodeValue.length), (O = R.firstChild) !== null; )
              P = R, R = O;
            for (; ; ) {
              if (R === e) break t;
              if (P === n && ++x === l && (d = o), P === i && ++z === r && (p = o), (O = R.nextSibling) !== null) break;
              R = P, P = R.parentNode;
            }
            R = O;
          }
          n = d === -1 || p === -1 ? null : { start: d, end: p };
        } else n = null;
      }
      n = n || { start: 0, end: 0 };
    } else n = null;
    for (zi = { focusedElem: e, selectionRange: n }, Wr = !1, U = t; U !== null; ) if (t = U, e = t.child, (t.subtreeFlags & 1028) !== 0 && e !== null) e.return = t, U = e;
    else for (; U !== null; ) {
      t = U;
      try {
        var H = t.alternate;
        if ((t.flags & 1024) !== 0) switch (t.tag) {
          case 0:
          case 11:
          case 15:
            break;
          case 1:
            if (H !== null) {
              var B = H.memoizedProps, Te = H.memoizedState, m = t.stateNode, h = m.getSnapshotBeforeUpdate(t.elementType === t.type ? B : vt(t.type, B), Te);
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
      } catch (I) {
        Ne(t, t.return, I);
      }
      if (e = t.sibling, e !== null) {
        e.return = t.return, U = e;
        break;
      }
      U = t.return;
    }
    return H = ya, ya = !1, H;
  }
  function Sr(e, t, n) {
    var r = t.updateQueue;
    if (r = r !== null ? r.lastEffect : null, r !== null) {
      var l = r = r.next;
      do {
        if ((l.tag & e) === e) {
          var i = l.destroy;
          l.destroy = void 0, i !== void 0 && yo(t, n, i);
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
  function xo(e) {
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
  function xa(e) {
    var t = e.alternate;
    t !== null && (e.alternate = null, xa(t)), e.child = null, e.deletions = null, e.sibling = null, e.tag === 5 && (t = e.stateNode, t !== null && (delete t[kt], delete t[dr], delete t[Ii], delete t[Od], delete t[Ad])), e.stateNode = null, e.return = null, e.dependencies = null, e.memoizedProps = null, e.memoizedState = null, e.pendingProps = null, e.stateNode = null, e.updateQueue = null;
  }
  function wa(e) {
    return e.tag === 5 || e.tag === 3 || e.tag === 4;
  }
  function ka(e) {
    e: for (; ; ) {
      for (; e.sibling === null; ) {
        if (e.return === null || wa(e.return)) return null;
        e = e.return;
      }
      for (e.sibling.return = e.return, e = e.sibling; e.tag !== 5 && e.tag !== 6 && e.tag !== 18; ) {
        if (e.flags & 2 || e.child === null || e.tag === 4) continue e;
        e.child.return = e, e = e.child;
      }
      if (!(e.flags & 2)) return e.stateNode;
    }
  }
  function wo(e, t, n) {
    var r = e.tag;
    if (r === 5 || r === 6) e = e.stateNode, t ? n.nodeType === 8 ? n.parentNode.insertBefore(e, t) : n.insertBefore(e, t) : (n.nodeType === 8 ? (t = n.parentNode, t.insertBefore(e, n)) : (t = n, t.appendChild(e)), n = n._reactRootContainer, n != null || t.onclick !== null || (t.onclick = nl));
    else if (r !== 4 && (e = e.child, e !== null)) for (wo(e, t, n), e = e.sibling; e !== null; ) wo(e, t, n), e = e.sibling;
  }
  function ko(e, t, n) {
    var r = e.tag;
    if (r === 5 || r === 6) e = e.stateNode, t ? n.insertBefore(e, t) : n.appendChild(e);
    else if (r !== 4 && (e = e.child, e !== null)) for (ko(e, t, n), e = e.sibling; e !== null; ) ko(e, t, n), e = e.sibling;
  }
  var Ae = null, gt = !1;
  function Kt(e, t, n) {
    for (n = n.child; n !== null; ) Sa(e, t, n), n = n.sibling;
  }
  function Sa(e, t, n) {
    if (wt && typeof wt.onCommitFiberUnmount == "function") try {
      wt.onCommitFiberUnmount(Ar, n);
    } catch {
    }
    switch (n.tag) {
      case 5:
        We || Fn(n, t);
      case 6:
        var r = Ae, l = gt;
        Ae = null, Kt(e, t, n), Ae = r, gt = l, Ae !== null && (gt ? (e = Ae, n = n.stateNode, e.nodeType === 8 ? e.parentNode.removeChild(n) : e.removeChild(n)) : Ae.removeChild(n.stateNode));
        break;
      case 18:
        Ae !== null && (gt ? (e = Ae, n = n.stateNode, e.nodeType === 8 ? Li(e.parentNode, n) : e.nodeType === 1 && Li(e, n), er(e)) : Li(Ae, n.stateNode));
        break;
      case 4:
        r = Ae, l = gt, Ae = n.stateNode.containerInfo, gt = !0, Kt(e, t, n), Ae = r, gt = l;
        break;
      case 0:
      case 11:
      case 14:
      case 15:
        if (!We && (r = n.updateQueue, r !== null && (r = r.lastEffect, r !== null))) {
          l = r = r.next;
          do {
            var i = l, o = i.destroy;
            i = i.tag, o !== void 0 && ((i & 2) !== 0 || (i & 4) !== 0) && yo(n, t, o), l = l.next;
          } while (l !== r);
        }
        Kt(e, t, n);
        break;
      case 1:
        if (!We && (Fn(n, t), r = n.stateNode, typeof r.componentWillUnmount == "function")) try {
          r.props = n.memoizedProps, r.state = n.memoizedState, r.componentWillUnmount();
        } catch (d) {
          Ne(n, t, d);
        }
        Kt(e, t, n);
        break;
      case 21:
        Kt(e, t, n);
        break;
      case 22:
        n.mode & 1 ? (We = (r = We) || n.memoizedState !== null, Kt(e, t, n), We = r) : Kt(e, t, n);
        break;
      default:
        Kt(e, t, n);
    }
  }
  function Ea(e) {
    var t = e.updateQueue;
    if (t !== null) {
      e.updateQueue = null;
      var n = e.stateNode;
      n === null && (n = e.stateNode = new ef()), t.forEach(function(r) {
        var l = df.bind(null, e, r);
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
        Sa(i, o, l), Ae = null, gt = !1;
        var p = l.alternate;
        p !== null && (p.return = null), l.return = null;
      } catch (x) {
        Ne(l, t, x);
      }
    }
    if (t.subtreeFlags & 12854) for (t = t.child; t !== null; ) ja(t, e), t = t.sibling;
  }
  function ja(e, t) {
    var n = e.alternate, r = e.flags;
    switch (e.tag) {
      case 0:
      case 11:
      case 14:
      case 15:
        if (yt(t, e), jt(e), r & 4) {
          try {
            Sr(3, e, e.return), Nl(3, e);
          } catch (B) {
            Ne(e, e.return, B);
          }
          try {
            Sr(5, e, e.return);
          } catch (B) {
            Ne(e, e.return, B);
          }
        }
        break;
      case 1:
        yt(t, e), jt(e), r & 512 && n !== null && Fn(n, n.return);
        break;
      case 5:
        if (yt(t, e), jt(e), r & 512 && n !== null && Fn(n, n.return), e.flags & 32) {
          var l = e.stateNode;
          try {
            Vn(l, "");
          } catch (B) {
            Ne(e, e.return, B);
          }
        }
        if (r & 4 && (l = e.stateNode, l != null)) {
          var i = e.memoizedProps, o = n !== null ? n.memoizedProps : i, d = e.type, p = e.updateQueue;
          if (e.updateQueue = null, p !== null) try {
            d === "input" && i.type === "radio" && i.name != null && qo(l, i), Jl(d, o);
            var x = Jl(d, i);
            for (o = 0; o < p.length; o += 2) {
              var z = p[o], R = p[o + 1];
              z === "style" ? os(l, R) : z === "dangerouslySetInnerHTML" ? ls(l, R) : z === "children" ? Vn(l, R) : Le(l, z, R, x);
            }
            switch (d) {
              case "input":
                Kl(l, i);
                break;
              case "textarea":
                ts(l, i);
                break;
              case "select":
                var P = l._wrapperState.wasMultiple;
                l._wrapperState.wasMultiple = !!i.multiple;
                var O = i.value;
                O != null ? mn(l, !!i.multiple, O, !1) : P !== !!i.multiple && (i.defaultValue != null ? mn(
                  l,
                  !!i.multiple,
                  i.defaultValue,
                  !0
                ) : mn(l, !!i.multiple, i.multiple ? [] : "", !1));
            }
            l[dr] = i;
          } catch (B) {
            Ne(e, e.return, B);
          }
        }
        break;
      case 6:
        if (yt(t, e), jt(e), r & 4) {
          if (e.stateNode === null) throw Error(s(162));
          l = e.stateNode, i = e.memoizedProps;
          try {
            l.nodeValue = i;
          } catch (B) {
            Ne(e, e.return, B);
          }
        }
        break;
      case 3:
        if (yt(t, e), jt(e), r & 4 && n !== null && n.memoizedState.isDehydrated) try {
          er(t.containerInfo);
        } catch (B) {
          Ne(e, e.return, B);
        }
        break;
      case 4:
        yt(t, e), jt(e);
        break;
      case 13:
        yt(t, e), jt(e), l = e.child, l.flags & 8192 && (i = l.memoizedState !== null, l.stateNode.isHidden = i, !i || l.alternate !== null && l.alternate.memoizedState !== null || (jo = _e())), r & 4 && Ea(e);
        break;
      case 22:
        if (z = n !== null && n.memoizedState !== null, e.mode & 1 ? (We = (x = We) || z, yt(t, e), We = x) : yt(t, e), jt(e), r & 8192) {
          if (x = e.memoizedState !== null, (e.stateNode.isHidden = x) && !z && (e.mode & 1) !== 0) for (U = e, z = e.child; z !== null; ) {
            for (R = U = z; U !== null; ) {
              switch (P = U, O = P.child, P.tag) {
                case 0:
                case 11:
                case 14:
                case 15:
                  Sr(4, P, P.return);
                  break;
                case 1:
                  Fn(P, P.return);
                  var H = P.stateNode;
                  if (typeof H.componentWillUnmount == "function") {
                    r = P, n = P.return;
                    try {
                      t = r, H.props = t.memoizedProps, H.state = t.memoizedState, H.componentWillUnmount();
                    } catch (B) {
                      Ne(r, n, B);
                    }
                  }
                  break;
                case 5:
                  Fn(P, P.return);
                  break;
                case 22:
                  if (P.memoizedState !== null) {
                    _a(R);
                    continue;
                  }
              }
              O !== null ? (O.return = P, U = O) : _a(R);
            }
            z = z.sibling;
          }
          e: for (z = null, R = e; ; ) {
            if (R.tag === 5) {
              if (z === null) {
                z = R;
                try {
                  l = R.stateNode, x ? (i = l.style, typeof i.setProperty == "function" ? i.setProperty("display", "none", "important") : i.display = "none") : (d = R.stateNode, p = R.memoizedProps.style, o = p != null && p.hasOwnProperty("display") ? p.display : null, d.style.display = is("display", o));
                } catch (B) {
                  Ne(e, e.return, B);
                }
              }
            } else if (R.tag === 6) {
              if (z === null) try {
                R.stateNode.nodeValue = x ? "" : R.memoizedProps;
              } catch (B) {
                Ne(e, e.return, B);
              }
            } else if ((R.tag !== 22 && R.tag !== 23 || R.memoizedState === null || R === e) && R.child !== null) {
              R.child.return = R, R = R.child;
              continue;
            }
            if (R === e) break e;
            for (; R.sibling === null; ) {
              if (R.return === null || R.return === e) break e;
              z === R && (z = null), R = R.return;
            }
            z === R && (z = null), R.sibling.return = R.return, R = R.sibling;
          }
        }
        break;
      case 19:
        yt(t, e), jt(e), r & 4 && Ea(e);
        break;
      case 21:
        break;
      default:
        yt(
          t,
          e
        ), jt(e);
    }
  }
  function jt(e) {
    var t = e.flags;
    if (t & 2) {
      try {
        e: {
          for (var n = e.return; n !== null; ) {
            if (wa(n)) {
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
            r.flags & 32 && (Vn(l, ""), r.flags &= -33);
            var i = ka(e);
            ko(e, i, l);
            break;
          case 3:
          case 4:
            var o = r.stateNode.containerInfo, d = ka(e);
            wo(e, d, o);
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
  function nf(e, t, n) {
    U = e, Na(e);
  }
  function Na(e, t, n) {
    for (var r = (e.mode & 1) !== 0; U !== null; ) {
      var l = U, i = l.child;
      if (l.tag === 22 && r) {
        var o = l.memoizedState !== null || jl;
        if (!o) {
          var d = l.alternate, p = d !== null && d.memoizedState !== null || We;
          d = jl;
          var x = We;
          if (jl = o, (We = p) && !x) for (U = l; U !== null; ) o = U, p = o.child, o.tag === 22 && o.memoizedState !== null ? Ta(l) : p !== null ? (p.return = o, U = p) : Ta(l);
          for (; i !== null; ) U = i, Na(i), i = i.sibling;
          U = l, jl = d, We = x;
        }
        Ca(e);
      } else (l.subtreeFlags & 8772) !== 0 && i !== null ? (i.return = l, U = i) : Ca(e);
    }
  }
  function Ca(e) {
    for (; U !== null; ) {
      var t = U;
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
                var x = t.alternate;
                if (x !== null) {
                  var z = x.memoizedState;
                  if (z !== null) {
                    var R = z.dehydrated;
                    R !== null && er(R);
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
          We || t.flags & 512 && xo(t);
        } catch (P) {
          Ne(t, t.return, P);
        }
      }
      if (t === e) {
        U = null;
        break;
      }
      if (n = t.sibling, n !== null) {
        n.return = t.return, U = n;
        break;
      }
      U = t.return;
    }
  }
  function _a(e) {
    for (; U !== null; ) {
      var t = U;
      if (t === e) {
        U = null;
        break;
      }
      var n = t.sibling;
      if (n !== null) {
        n.return = t.return, U = n;
        break;
      }
      U = t.return;
    }
  }
  function Ta(e) {
    for (; U !== null; ) {
      var t = U;
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
              xo(t);
            } catch (p) {
              Ne(t, i, p);
            }
            break;
          case 5:
            var o = t.return;
            try {
              xo(t);
            } catch (p) {
              Ne(t, o, p);
            }
        }
      } catch (p) {
        Ne(t, t.return, p);
      }
      if (t === e) {
        U = null;
        break;
      }
      var d = t.sibling;
      if (d !== null) {
        d.return = t.return, U = d;
        break;
      }
      U = t.return;
    }
  }
  var rf = Math.ceil, Cl = ve.ReactCurrentDispatcher, So = ve.ReactCurrentOwner, ct = ve.ReactCurrentBatchConfig, ae = 0, Fe = null, Pe = null, $e = 0, lt = 0, On = Ht(0), Re = 0, Er = null, an = 0, _l = 0, Eo = 0, jr = null, qe = null, jo = 0, An = 1 / 0, Rt = null, Tl = !1, No = null, Gt = null, Pl = !1, Yt = null, zl = 0, Nr = 0, Co = null, Ml = -1, Rl = 0;
  function Ke() {
    return (ae & 6) !== 0 ? _e() : Ml !== -1 ? Ml : Ml = _e();
  }
  function Xt(e) {
    return (e.mode & 1) === 0 ? 1 : (ae & 2) !== 0 && $e !== 0 ? $e & -$e : Ud.transition !== null ? (Rl === 0 && (Rl = ks()), Rl) : (e = fe, e !== 0 || (e = window.event, e = e === void 0 ? 16 : zs(e.type)), e);
  }
  function xt(e, t, n, r) {
    if (50 < Nr) throw Nr = 0, Co = null, Error(s(185));
    Xn(e, n, r), ((ae & 2) === 0 || e !== Fe) && (e === Fe && ((ae & 2) === 0 && (_l |= n), Re === 4 && Zt(e, $e)), be(e, r), n === 1 && ae === 0 && (t.mode & 1) === 0 && (An = _e() + 500, ol && Vt()));
  }
  function be(e, t) {
    var n = e.callbackNode;
    Uc(e, t);
    var r = Hr(e, e === Fe ? $e : 0);
    if (r === 0) n !== null && ys(n), e.callbackNode = null, e.callbackPriority = 0;
    else if (t = r & -r, e.callbackPriority !== t) {
      if (n != null && ys(n), t === 1) e.tag === 0 ? $d(za.bind(null, e)) : mu(za.bind(null, e)), Dd(function() {
        (ae & 6) === 0 && Vt();
      }), n = null;
      else {
        switch (Ss(r)) {
          case 1:
            n = li;
            break;
          case 4:
            n = xs;
            break;
          case 16:
            n = Or;
            break;
          case 536870912:
            n = ws;
            break;
          default:
            n = Or;
        }
        n = Aa(n, Pa.bind(null, e));
      }
      e.callbackPriority = t, e.callbackNode = n;
    }
  }
  function Pa(e, t) {
    if (Ml = -1, Rl = 0, (ae & 6) !== 0) throw Error(s(327));
    var n = e.callbackNode;
    if ($n() && e.callbackNode !== n) return null;
    var r = Hr(e, e === Fe ? $e : 0);
    if (r === 0) return null;
    if ((r & 30) !== 0 || (r & e.expiredLanes) !== 0 || t) t = Ll(e, r);
    else {
      t = r;
      var l = ae;
      ae |= 2;
      var i = Ra();
      (Fe !== e || $e !== t) && (Rt = null, An = _e() + 500, dn(e, t));
      do
        try {
          sf();
          break;
        } catch (d) {
          Ma(e, d);
        }
      while (!0);
      Vi(), Cl.current = i, ae = l, Pe !== null ? t = 0 : (Fe = null, $e = 0, t = Re);
    }
    if (t !== 0) {
      if (t === 2 && (l = ii(e), l !== 0 && (r = l, t = _o(e, l))), t === 1) throw n = Er, dn(e, 0), Zt(e, r), be(e, _e()), n;
      if (t === 6) Zt(e, r);
      else {
        if (l = e.current.alternate, (r & 30) === 0 && !lf(l) && (t = Ll(e, r), t === 2 && (i = ii(e), i !== 0 && (r = i, t = _o(e, i))), t === 1)) throw n = Er, dn(e, 0), Zt(e, r), be(e, _e()), n;
        switch (e.finishedWork = l, e.finishedLanes = r, t) {
          case 0:
          case 1:
            throw Error(s(345));
          case 2:
            fn(e, qe, Rt);
            break;
          case 3:
            if (Zt(e, r), (r & 130023424) === r && (t = jo + 500 - _e(), 10 < t)) {
              if (Hr(e, 0) !== 0) break;
              if (l = e.suspendedLanes, (l & r) !== r) {
                Ke(), e.pingedLanes |= e.suspendedLanes & l;
                break;
              }
              e.timeoutHandle = Ri(fn.bind(null, e, qe, Rt), t);
              break;
            }
            fn(e, qe, Rt);
            break;
          case 4:
            if (Zt(e, r), (r & 4194240) === r) break;
            for (t = e.eventTimes, l = -1; 0 < r; ) {
              var o = 31 - pt(r);
              i = 1 << o, o = t[o], o > l && (l = o), r &= ~i;
            }
            if (r = l, r = _e() - r, r = (120 > r ? 120 : 480 > r ? 480 : 1080 > r ? 1080 : 1920 > r ? 1920 : 3e3 > r ? 3e3 : 4320 > r ? 4320 : 1960 * rf(r / 1960)) - r, 10 < r) {
              e.timeoutHandle = Ri(fn.bind(null, e, qe, Rt), r);
              break;
            }
            fn(e, qe, Rt);
            break;
          case 5:
            fn(e, qe, Rt);
            break;
          default:
            throw Error(s(329));
        }
      }
    }
    return be(e, _e()), e.callbackNode === n ? Pa.bind(null, e) : null;
  }
  function _o(e, t) {
    var n = jr;
    return e.current.memoizedState.isDehydrated && (dn(e, t).flags |= 256), e = Ll(e, t), e !== 2 && (t = qe, qe = n, t !== null && To(t)), e;
  }
  function To(e) {
    qe === null ? qe = e : qe.push.apply(qe, e);
  }
  function lf(e) {
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
  function Zt(e, t) {
    for (t &= ~Eo, t &= ~_l, e.suspendedLanes |= t, e.pingedLanes &= ~t, e = e.expirationTimes; 0 < t; ) {
      var n = 31 - pt(t), r = 1 << n;
      e[n] = -1, t &= ~r;
    }
  }
  function za(e) {
    if ((ae & 6) !== 0) throw Error(s(327));
    $n();
    var t = Hr(e, 0);
    if ((t & 1) === 0) return be(e, _e()), null;
    var n = Ll(e, t);
    if (e.tag !== 0 && n === 2) {
      var r = ii(e);
      r !== 0 && (t = r, n = _o(e, r));
    }
    if (n === 1) throw n = Er, dn(e, 0), Zt(e, t), be(e, _e()), n;
    if (n === 6) throw Error(s(345));
    return e.finishedWork = e.current.alternate, e.finishedLanes = t, fn(e, qe, Rt), be(e, _e()), null;
  }
  function Po(e, t) {
    var n = ae;
    ae |= 1;
    try {
      return e(t);
    } finally {
      ae = n, ae === 0 && (An = _e() + 500, ol && Vt());
    }
  }
  function cn(e) {
    Yt !== null && Yt.tag === 0 && (ae & 6) === 0 && $n();
    var t = ae;
    ae |= 1;
    var n = ct.transition, r = fe;
    try {
      if (ct.transition = null, fe = 1, e) return e();
    } finally {
      fe = r, ct.transition = n, ae = t, (ae & 6) === 0 && Vt();
    }
  }
  function zo() {
    lt = On.current, ye(On);
  }
  function dn(e, t) {
    e.finishedWork = null, e.finishedLanes = 0;
    var n = e.timeoutHandle;
    if (n !== -1 && (e.timeoutHandle = -1, Id(n)), Pe !== null) for (n = Pe.return; n !== null; ) {
      var r = n;
      switch (Ai(r), r.tag) {
        case 1:
          r = r.type.childContextTypes, r != null && ll();
          break;
        case 3:
          In(), ye(Xe), ye(He), Ji();
          break;
        case 5:
          Xi(r);
          break;
        case 4:
          In();
          break;
        case 13:
          ye(Se);
          break;
        case 19:
          ye(Se);
          break;
        case 10:
          Wi(r.type._context);
          break;
        case 22:
        case 23:
          zo();
      }
      n = n.return;
    }
    if (Fe = e, Pe = e = Jt(e.current, null), $e = lt = t, Re = 0, Er = null, Eo = _l = an = 0, qe = jr = null, on !== null) {
      for (t = 0; t < on.length; t++) if (n = on[t], r = n.interleaved, r !== null) {
        n.interleaved = null;
        var l = r.next, i = n.pending;
        if (i !== null) {
          var o = i.next;
          i.next = l, r.next = o;
        }
        n.pending = r;
      }
      on = null;
    }
    return e;
  }
  function Ma(e, t) {
    do {
      var n = Pe;
      try {
        if (Vi(), vl.current = wl, gl) {
          for (var r = Ee.memoizedState; r !== null; ) {
            var l = r.queue;
            l !== null && (l.pending = null), r = r.next;
          }
          gl = !1;
        }
        if (un = 0, De = Me = Ee = null, gr = !1, yr = 0, So.current = null, n === null || n.return === null) {
          Re = 1, Er = t, Pe = null;
          break;
        }
        e: {
          var i = e, o = n.return, d = n, p = t;
          if (t = $e, d.flags |= 32768, p !== null && typeof p == "object" && typeof p.then == "function") {
            var x = p, z = d, R = z.tag;
            if ((z.mode & 1) === 0 && (R === 0 || R === 11 || R === 15)) {
              var P = z.alternate;
              P ? (z.updateQueue = P.updateQueue, z.memoizedState = P.memoizedState, z.lanes = P.lanes) : (z.updateQueue = null, z.memoizedState = null);
            }
            var O = na(o);
            if (O !== null) {
              O.flags &= -257, ra(O, o, d, i, t), O.mode & 1 && ta(i, x, t), t = O, p = x;
              var H = t.updateQueue;
              if (H === null) {
                var B = /* @__PURE__ */ new Set();
                B.add(p), t.updateQueue = B;
              } else H.add(p);
              break e;
            } else {
              if ((t & 1) === 0) {
                ta(i, x, t), Mo();
                break e;
              }
              p = Error(s(426));
            }
          } else if (ke && d.mode & 1) {
            var Te = na(o);
            if (Te !== null) {
              (Te.flags & 65536) === 0 && (Te.flags |= 256), ra(Te, o, d, i, t), Hi(Dn(p, d));
              break e;
            }
          }
          i = p = Dn(p, d), Re !== 4 && (Re = 2), jr === null ? jr = [i] : jr.push(i), i = o;
          do {
            switch (i.tag) {
              case 3:
                i.flags |= 65536, t &= -t, i.lanes |= t;
                var m = bu(i, p, t);
                Cu(i, m);
                break e;
              case 1:
                d = p;
                var h = i.type, g = i.stateNode;
                if ((i.flags & 128) === 0 && (typeof h.getDerivedStateFromError == "function" || g !== null && typeof g.componentDidCatch == "function" && (Gt === null || !Gt.has(g)))) {
                  i.flags |= 65536, t &= -t, i.lanes |= t;
                  var I = ea(i, d, t);
                  Cu(i, I);
                  break e;
                }
            }
            i = i.return;
          } while (i !== null);
        }
        Ia(n);
      } catch (V) {
        t = V, Pe === n && n !== null && (Pe = n = n.return);
        continue;
      }
      break;
    } while (!0);
  }
  function Ra() {
    var e = Cl.current;
    return Cl.current = wl, e === null ? wl : e;
  }
  function Mo() {
    (Re === 0 || Re === 3 || Re === 2) && (Re = 4), Fe === null || (an & 268435455) === 0 && (_l & 268435455) === 0 || Zt(Fe, $e);
  }
  function Ll(e, t) {
    var n = ae;
    ae |= 2;
    var r = Ra();
    (Fe !== e || $e !== t) && (Rt = null, dn(e, t));
    do
      try {
        of();
        break;
      } catch (l) {
        Ma(e, l);
      }
    while (!0);
    if (Vi(), ae = n, Cl.current = r, Pe !== null) throw Error(s(261));
    return Fe = null, $e = 0, Re;
  }
  function of() {
    for (; Pe !== null; ) La(Pe);
  }
  function sf() {
    for (; Pe !== null && !Mc(); ) La(Pe);
  }
  function La(e) {
    var t = Oa(e.alternate, e, lt);
    e.memoizedProps = e.pendingProps, t === null ? Ia(e) : Pe = t, So.current = null;
  }
  function Ia(e) {
    var t = e;
    do {
      var n = t.alternate;
      if (e = t.return, (t.flags & 32768) === 0) {
        if (n = qd(n, t, lt), n !== null) {
          Pe = n;
          return;
        }
      } else {
        if (n = bd(n, t), n !== null) {
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
  function fn(e, t, n) {
    var r = fe, l = ct.transition;
    try {
      ct.transition = null, fe = 1, uf(e, t, n, r);
    } finally {
      ct.transition = l, fe = r;
    }
    return null;
  }
  function uf(e, t, n, r) {
    do
      $n();
    while (Yt !== null);
    if ((ae & 6) !== 0) throw Error(s(327));
    n = e.finishedWork;
    var l = e.finishedLanes;
    if (n === null) return null;
    if (e.finishedWork = null, e.finishedLanes = 0, n === e.current) throw Error(s(177));
    e.callbackNode = null, e.callbackPriority = 0;
    var i = n.lanes | n.childLanes;
    if (Hc(e, i), e === Fe && (Pe = Fe = null, $e = 0), (n.subtreeFlags & 2064) === 0 && (n.flags & 2064) === 0 || Pl || (Pl = !0, Aa(Or, function() {
      return $n(), null;
    })), i = (n.flags & 15990) !== 0, (n.subtreeFlags & 15990) !== 0 || i) {
      i = ct.transition, ct.transition = null;
      var o = fe;
      fe = 1;
      var d = ae;
      ae |= 4, So.current = null, tf(e, n), ja(n, e), _d(zi), Wr = !!Pi, zi = Pi = null, e.current = n, nf(n), Rc(), ae = d, fe = o, ct.transition = i;
    } else e.current = n;
    if (Pl && (Pl = !1, Yt = e, zl = l), i = e.pendingLanes, i === 0 && (Gt = null), Dc(n.stateNode), be(e, _e()), t !== null) for (r = e.onRecoverableError, n = 0; n < t.length; n++) l = t[n], r(l.value, { componentStack: l.stack, digest: l.digest });
    if (Tl) throw Tl = !1, e = No, No = null, e;
    return (zl & 1) !== 0 && e.tag !== 0 && $n(), i = e.pendingLanes, (i & 1) !== 0 ? e === Co ? Nr++ : (Nr = 0, Co = e) : Nr = 0, Vt(), null;
  }
  function $n() {
    if (Yt !== null) {
      var e = Ss(zl), t = ct.transition, n = fe;
      try {
        if (ct.transition = null, fe = 16 > e ? 16 : e, Yt === null) var r = !1;
        else {
          if (e = Yt, Yt = null, zl = 0, (ae & 6) !== 0) throw Error(s(331));
          var l = ae;
          for (ae |= 4, U = e.current; U !== null; ) {
            var i = U, o = i.child;
            if ((U.flags & 16) !== 0) {
              var d = i.deletions;
              if (d !== null) {
                for (var p = 0; p < d.length; p++) {
                  var x = d[p];
                  for (U = x; U !== null; ) {
                    var z = U;
                    switch (z.tag) {
                      case 0:
                      case 11:
                      case 15:
                        Sr(8, z, i);
                    }
                    var R = z.child;
                    if (R !== null) R.return = z, U = R;
                    else for (; U !== null; ) {
                      z = U;
                      var P = z.sibling, O = z.return;
                      if (xa(z), z === x) {
                        U = null;
                        break;
                      }
                      if (P !== null) {
                        P.return = O, U = P;
                        break;
                      }
                      U = O;
                    }
                  }
                }
                var H = i.alternate;
                if (H !== null) {
                  var B = H.child;
                  if (B !== null) {
                    H.child = null;
                    do {
                      var Te = B.sibling;
                      B.sibling = null, B = Te;
                    } while (B !== null);
                  }
                }
                U = i;
              }
            }
            if ((i.subtreeFlags & 2064) !== 0 && o !== null) o.return = i, U = o;
            else e: for (; U !== null; ) {
              if (i = U, (i.flags & 2048) !== 0) switch (i.tag) {
                case 0:
                case 11:
                case 15:
                  Sr(9, i, i.return);
              }
              var m = i.sibling;
              if (m !== null) {
                m.return = i.return, U = m;
                break e;
              }
              U = i.return;
            }
          }
          var h = e.current;
          for (U = h; U !== null; ) {
            o = U;
            var g = o.child;
            if ((o.subtreeFlags & 2064) !== 0 && g !== null) g.return = o, U = g;
            else e: for (o = h; U !== null; ) {
              if (d = U, (d.flags & 2048) !== 0) try {
                switch (d.tag) {
                  case 0:
                  case 11:
                  case 15:
                    Nl(9, d);
                }
              } catch (V) {
                Ne(d, d.return, V);
              }
              if (d === o) {
                U = null;
                break e;
              }
              var I = d.sibling;
              if (I !== null) {
                I.return = d.return, U = I;
                break e;
              }
              U = d.return;
            }
          }
          if (ae = l, Vt(), wt && typeof wt.onPostCommitFiberRoot == "function") try {
            wt.onPostCommitFiberRoot(Ar, e);
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
  function Da(e, t, n) {
    t = Dn(n, t), t = bu(e, t, 1), e = Qt(e, t, 1), t = Ke(), e !== null && (Xn(e, 1, t), be(e, t));
  }
  function Ne(e, t, n) {
    if (e.tag === 3) Da(e, e, n);
    else for (; t !== null; ) {
      if (t.tag === 3) {
        Da(t, e, n);
        break;
      } else if (t.tag === 1) {
        var r = t.stateNode;
        if (typeof t.type.getDerivedStateFromError == "function" || typeof r.componentDidCatch == "function" && (Gt === null || !Gt.has(r))) {
          e = Dn(n, e), e = ea(t, e, 1), t = Qt(t, e, 1), e = Ke(), t !== null && (Xn(t, 1, e), be(t, e));
          break;
        }
      }
      t = t.return;
    }
  }
  function af(e, t, n) {
    var r = e.pingCache;
    r !== null && r.delete(t), t = Ke(), e.pingedLanes |= e.suspendedLanes & n, Fe === e && ($e & n) === n && (Re === 4 || Re === 3 && ($e & 130023424) === $e && 500 > _e() - jo ? dn(e, 0) : Eo |= n), be(e, t);
  }
  function Fa(e, t) {
    t === 0 && ((e.mode & 1) === 0 ? t = 1 : (t = Ur, Ur <<= 1, (Ur & 130023424) === 0 && (Ur = 4194304)));
    var n = Ke();
    e = Pt(e, t), e !== null && (Xn(e, t, n), be(e, n));
  }
  function cf(e) {
    var t = e.memoizedState, n = 0;
    t !== null && (n = t.retryLane), Fa(e, n);
  }
  function df(e, t) {
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
    r !== null && r.delete(t), Fa(e, n);
  }
  var Oa;
  Oa = function(e, t, n) {
    if (e !== null) if (e.memoizedProps !== t.pendingProps || Xe.current) Je = !0;
    else {
      if ((e.lanes & n) === 0 && (t.flags & 128) === 0) return Je = !1, Jd(e, t, n);
      Je = (e.flags & 131072) !== 0;
    }
    else Je = !1, ke && (t.flags & 1048576) !== 0 && vu(t, ul, t.index);
    switch (t.lanes = 0, t.tag) {
      case 2:
        var r = t.type;
        El(e, t), e = t.pendingProps;
        var l = _n(t, He.current);
        Ln(t, n), l = eo(null, t, r, e, l, n);
        var i = to();
        return t.flags |= 1, typeof l == "object" && l !== null && typeof l.render == "function" && l.$$typeof === void 0 ? (t.tag = 1, t.memoizedState = null, t.updateQueue = null, Ze(r) ? (i = !0, il(t)) : i = !1, t.memoizedState = l.state !== null && l.state !== void 0 ? l.state : null, Gi(t), l.updater = kl, t.stateNode = l, l._reactInternals = t, so(t, r, e, n), t = fo(null, t, r, !0, i, n)) : (t.tag = 0, ke && i && Oi(t), Qe(null, t, l, n), t = t.child), t;
      case 16:
        r = t.elementType;
        e: {
          switch (El(e, t), e = t.pendingProps, l = r._init, r = l(r._payload), t.type = r, l = t.tag = pf(r), e = vt(r, e), l) {
            case 0:
              t = co(null, t, r, e, n);
              break e;
            case 1:
              t = aa(null, t, r, e, n);
              break e;
            case 11:
              t = la(null, t, r, e, n);
              break e;
            case 14:
              t = ia(null, t, r, vt(r.type, e), n);
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
        return r = t.type, l = t.pendingProps, l = t.elementType === r ? l : vt(r, l), co(e, t, r, l, n);
      case 1:
        return r = t.type, l = t.pendingProps, l = t.elementType === r ? l : vt(r, l), aa(e, t, r, l, n);
      case 3:
        e: {
          if (ca(t), e === null) throw Error(s(387));
          r = t.pendingProps, i = t.memoizedState, l = i.element, Nu(e, t), hl(t, r, null, n);
          var o = t.memoizedState;
          if (r = o.element, i.isDehydrated) if (i = { element: r, isDehydrated: !1, cache: o.cache, pendingSuspenseBoundaries: o.pendingSuspenseBoundaries, transitions: o.transitions }, t.updateQueue.baseState = i, t.memoizedState = i, t.flags & 256) {
            l = Dn(Error(s(423)), t), t = da(e, t, r, n, l);
            break e;
          } else if (r !== l) {
            l = Dn(Error(s(424)), t), t = da(e, t, r, n, l);
            break e;
          } else for (rt = Ut(t.stateNode.containerInfo.firstChild), nt = t, ke = !0, mt = null, n = Eu(t, null, r, n), t.child = n; n; ) n.flags = n.flags & -3 | 4096, n = n.sibling;
          else {
            if (zn(), r === l) {
              t = Mt(e, t, n);
              break e;
            }
            Qe(e, t, r, n);
          }
          t = t.child;
        }
        return t;
      case 5:
        return Tu(t), e === null && Ui(t), r = t.type, l = t.pendingProps, i = e !== null ? e.memoizedProps : null, o = l.children, Mi(r, l) ? o = null : i !== null && Mi(r, i) && (t.flags |= 32), ua(e, t), Qe(e, t, o, n), t.child;
      case 6:
        return e === null && Ui(t), null;
      case 13:
        return fa(e, t, n);
      case 4:
        return Yi(t, t.stateNode.containerInfo), r = t.pendingProps, e === null ? t.child = Mn(t, null, r, n) : Qe(e, t, r, n), t.child;
      case 11:
        return r = t.type, l = t.pendingProps, l = t.elementType === r ? l : vt(r, l), la(e, t, r, l, n);
      case 7:
        return Qe(e, t, t.pendingProps, n), t.child;
      case 8:
        return Qe(e, t, t.pendingProps.children, n), t.child;
      case 12:
        return Qe(e, t, t.pendingProps.children, n), t.child;
      case 10:
        e: {
          if (r = t.type._context, l = t.pendingProps, i = t.memoizedProps, o = l.value, he(dl, r._currentValue), r._currentValue = o, i !== null) if (ht(i.value, o)) {
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
                    var x = i.updateQueue;
                    if (x !== null) {
                      x = x.shared;
                      var z = x.pending;
                      z === null ? p.next = p : (p.next = z.next, z.next = p), x.pending = p;
                    }
                  }
                  i.lanes |= n, p = i.alternate, p !== null && (p.lanes |= n), Qi(
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
              o.lanes |= n, d = o.alternate, d !== null && (d.lanes |= n), Qi(o, n, t), o = i.sibling;
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
        return r = t.type, l = vt(r, t.pendingProps), l = vt(r.type, l), ia(e, t, r, l, n);
      case 15:
        return oa(e, t, t.type, t.pendingProps, n);
      case 17:
        return r = t.type, l = t.pendingProps, l = t.elementType === r ? l : vt(r, l), El(e, t), t.tag = 1, Ze(r) ? (e = !0, il(t)) : e = !1, Ln(t, n), Ju(t, r, l), so(t, r, l, n), fo(null, t, r, !0, e, n);
      case 19:
        return ha(e, t, n);
      case 22:
        return sa(e, t, n);
    }
    throw Error(s(156, t.tag));
  };
  function Aa(e, t) {
    return gs(e, t);
  }
  function ff(e, t, n, r) {
    this.tag = e, this.key = n, this.sibling = this.child = this.return = this.stateNode = this.type = this.elementType = null, this.index = 0, this.ref = null, this.pendingProps = t, this.dependencies = this.memoizedState = this.updateQueue = this.memoizedProps = null, this.mode = r, this.subtreeFlags = this.flags = 0, this.deletions = null, this.childLanes = this.lanes = 0, this.alternate = null;
  }
  function dt(e, t, n, r) {
    return new ff(e, t, n, r);
  }
  function Ro(e) {
    return e = e.prototype, !(!e || !e.isReactComponent);
  }
  function pf(e) {
    if (typeof e == "function") return Ro(e) ? 1 : 0;
    if (e != null) {
      if (e = e.$$typeof, e === ie) return 11;
      if (e === Ye) return 14;
    }
    return 2;
  }
  function Jt(e, t) {
    var n = e.alternate;
    return n === null ? (n = dt(e.tag, t, e.key, e.mode), n.elementType = e.elementType, n.type = e.type, n.stateNode = e.stateNode, n.alternate = e, e.alternate = n) : (n.pendingProps = t, n.type = e.type, n.flags = 0, n.subtreeFlags = 0, n.deletions = null), n.flags = e.flags & 14680064, n.childLanes = e.childLanes, n.lanes = e.lanes, n.child = e.child, n.memoizedProps = e.memoizedProps, n.memoizedState = e.memoizedState, n.updateQueue = e.updateQueue, t = e.dependencies, n.dependencies = t === null ? null : { lanes: t.lanes, firstContext: t.firstContext }, n.sibling = e.sibling, n.index = e.index, n.ref = e.ref, n;
  }
  function Il(e, t, n, r, l, i) {
    var o = 2;
    if (r = e, typeof e == "function") Ro(e) && (o = 1);
    else if (typeof e == "string") o = 5;
    else e: switch (e) {
      case ue:
        return pn(n.children, l, i, t);
      case te:
        o = 8, l |= 8;
        break;
      case le:
        return e = dt(12, n, t, l | 2), e.elementType = le, e.lanes = i, e;
      case pe:
        return e = dt(13, n, t, l), e.elementType = pe, e.lanes = i, e;
      case Ge:
        return e = dt(19, n, t, l), e.elementType = Ge, e.lanes = i, e;
      case we:
        return Dl(n, l, i, t);
      default:
        if (typeof e == "object" && e !== null) switch (e.$$typeof) {
          case D:
            o = 10;
            break e;
          case re:
            o = 9;
            break e;
          case ie:
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
  function pn(e, t, n, r) {
    return e = dt(7, e, r, t), e.lanes = n, e;
  }
  function Dl(e, t, n, r) {
    return e = dt(22, e, r, t), e.elementType = we, e.lanes = n, e.stateNode = { isHidden: !1 }, e;
  }
  function Lo(e, t, n) {
    return e = dt(6, e, null, t), e.lanes = n, e;
  }
  function Io(e, t, n) {
    return t = dt(4, e.children !== null ? e.children : [], e.key, t), t.lanes = n, t.stateNode = { containerInfo: e.containerInfo, pendingChildren: null, implementation: e.implementation }, t;
  }
  function hf(e, t, n, r, l) {
    this.tag = t, this.containerInfo = e, this.finishedWork = this.pingCache = this.current = this.pendingChildren = null, this.timeoutHandle = -1, this.callbackNode = this.pendingContext = this.context = null, this.callbackPriority = 0, this.eventTimes = oi(0), this.expirationTimes = oi(-1), this.entangledLanes = this.finishedLanes = this.mutableReadLanes = this.expiredLanes = this.pingedLanes = this.suspendedLanes = this.pendingLanes = 0, this.entanglements = oi(0), this.identifierPrefix = r, this.onRecoverableError = l, this.mutableSourceEagerHydrationData = null;
  }
  function Do(e, t, n, r, l, i, o, d, p) {
    return e = new hf(e, t, n, d, p), t === 1 ? (t = 1, i === !0 && (t |= 8)) : t = 0, i = dt(3, null, null, t), e.current = i, i.stateNode = e, i.memoizedState = { element: r, isDehydrated: n, cache: null, transitions: null, pendingSuspenseBoundaries: null }, Gi(i), e;
  }
  function mf(e, t, n) {
    var r = 3 < arguments.length && arguments[3] !== void 0 ? arguments[3] : null;
    return { $$typeof: de, key: r == null ? null : "" + r, children: e, containerInfo: t, implementation: n };
  }
  function $a(e) {
    if (!e) return Bt;
    e = e._reactInternals;
    e: {
      if (en(e) !== e || e.tag !== 1) throw Error(s(170));
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
      if (Ze(n)) return pu(e, n, t);
    }
    return t;
  }
  function Ua(e, t, n, r, l, i, o, d, p) {
    return e = Do(n, r, !0, e, l, i, o, d, p), e.context = $a(null), n = e.current, r = Ke(), l = Xt(n), i = zt(r, l), i.callback = t ?? null, Qt(n, i, l), e.current.lanes = l, Xn(e, l, r), be(e, r), e;
  }
  function Fl(e, t, n, r) {
    var l = t.current, i = Ke(), o = Xt(l);
    return n = $a(n), t.context === null ? t.context = n : t.pendingContext = n, t = zt(i, o), t.payload = { element: e }, r = r === void 0 ? null : r, r !== null && (t.callback = r), e = Qt(l, t, o), e !== null && (xt(e, l, o, i), pl(e, l, o)), o;
  }
  function Ol(e) {
    if (e = e.current, !e.child) return null;
    switch (e.child.tag) {
      case 5:
        return e.child.stateNode;
      default:
        return e.child.stateNode;
    }
  }
  function Ha(e, t) {
    if (e = e.memoizedState, e !== null && e.dehydrated !== null) {
      var n = e.retryLane;
      e.retryLane = n !== 0 && n < t ? n : t;
    }
  }
  function Fo(e, t) {
    Ha(e, t), (e = e.alternate) && Ha(e, t);
  }
  function vf() {
    return null;
  }
  var Ba = typeof reportError == "function" ? reportError : function(e) {
    console.error(e);
  };
  function Oo(e) {
    this._internalRoot = e;
  }
  Al.prototype.render = Oo.prototype.render = function(e) {
    var t = this._internalRoot;
    if (t === null) throw Error(s(409));
    Fl(e, t, null, null);
  }, Al.prototype.unmount = Oo.prototype.unmount = function() {
    var e = this._internalRoot;
    if (e !== null) {
      this._internalRoot = null;
      var t = e.containerInfo;
      cn(function() {
        Fl(null, e, null, null);
      }), t[Nt] = null;
    }
  };
  function Al(e) {
    this._internalRoot = e;
  }
  Al.prototype.unstable_scheduleHydration = function(e) {
    if (e) {
      var t = Ns();
      e = { blockedOn: null, target: e, priority: t };
      for (var n = 0; n < Ot.length && t !== 0 && t < Ot[n].priority; n++) ;
      Ot.splice(n, 0, e), n === 0 && Ts(e);
    }
  };
  function Ao(e) {
    return !(!e || e.nodeType !== 1 && e.nodeType !== 9 && e.nodeType !== 11);
  }
  function $l(e) {
    return !(!e || e.nodeType !== 1 && e.nodeType !== 9 && e.nodeType !== 11 && (e.nodeType !== 8 || e.nodeValue !== " react-mount-point-unstable "));
  }
  function Va() {
  }
  function gf(e, t, n, r, l) {
    if (l) {
      if (typeof r == "function") {
        var i = r;
        r = function() {
          var x = Ol(o);
          i.call(x);
        };
      }
      var o = Ua(t, r, e, 0, null, !1, !1, "", Va);
      return e._reactRootContainer = o, e[Nt] = o.current, ar(e.nodeType === 8 ? e.parentNode : e), cn(), o;
    }
    for (; l = e.lastChild; ) e.removeChild(l);
    if (typeof r == "function") {
      var d = r;
      r = function() {
        var x = Ol(p);
        d.call(x);
      };
    }
    var p = Do(e, 0, !1, null, null, !1, !1, "", Va);
    return e._reactRootContainer = p, e[Nt] = p.current, ar(e.nodeType === 8 ? e.parentNode : e), cn(function() {
      Fl(t, p, n, r);
    }), p;
  }
  function Ul(e, t, n, r, l) {
    var i = n._reactRootContainer;
    if (i) {
      var o = i;
      if (typeof l == "function") {
        var d = l;
        l = function() {
          var p = Ol(o);
          d.call(p);
        };
      }
      Fl(t, o, e, l);
    } else o = gf(n, t, e, l, r);
    return Ol(o);
  }
  Es = function(e) {
    switch (e.tag) {
      case 3:
        var t = e.stateNode;
        if (t.current.memoizedState.isDehydrated) {
          var n = Yn(t.pendingLanes);
          n !== 0 && (si(t, n | 1), be(t, _e()), (ae & 6) === 0 && (An = _e() + 500, Vt()));
        }
        break;
      case 13:
        cn(function() {
          var r = Pt(e, 1);
          if (r !== null) {
            var l = Ke();
            xt(r, e, 1, l);
          }
        }), Fo(e, 1);
    }
  }, ui = function(e) {
    if (e.tag === 13) {
      var t = Pt(e, 134217728);
      if (t !== null) {
        var n = Ke();
        xt(t, e, 134217728, n);
      }
      Fo(e, 134217728);
    }
  }, js = function(e) {
    if (e.tag === 13) {
      var t = Xt(e), n = Pt(e, t);
      if (n !== null) {
        var r = Ke();
        xt(n, e, t, r);
      }
      Fo(e, t);
    }
  }, Ns = function() {
    return fe;
  }, Cs = function(e, t) {
    var n = fe;
    try {
      return fe = e, t();
    } finally {
      fe = n;
    }
  }, ei = function(e, t, n) {
    switch (t) {
      case "input":
        if (Kl(e, n), t = n.name, n.type === "radio" && t != null) {
          for (n = e; n.parentNode; ) n = n.parentNode;
          for (n = n.querySelectorAll("input[name=" + JSON.stringify("" + t) + '][type="radio"]'), t = 0; t < n.length; t++) {
            var r = n[t];
            if (r !== e && r.form === e.form) {
              var l = rl(r);
              if (!l) throw Error(s(90));
              Hn(r), Kl(r, l);
            }
          }
        }
        break;
      case "textarea":
        ts(e, n);
        break;
      case "select":
        t = n.value, t != null && mn(e, !!n.multiple, t, !1);
    }
  }, cs = Po, ds = cn;
  var yf = { usingClientEntryPoint: !1, Events: [fr, Nn, rl, us, as, Po] }, Cr = { findFiberByHostInstance: tn, bundleType: 0, version: "18.3.1", rendererPackageName: "react-dom" }, xf = { bundleType: Cr.bundleType, version: Cr.version, rendererPackageName: Cr.rendererPackageName, rendererConfig: Cr.rendererConfig, overrideHookState: null, overrideHookStateDeletePath: null, overrideHookStateRenamePath: null, overrideProps: null, overridePropsDeletePath: null, overridePropsRenamePath: null, setErrorHandler: null, setSuspenseHandler: null, scheduleUpdate: null, currentDispatcherRef: ve.ReactCurrentDispatcher, findHostInstanceByFiber: function(e) {
    return e = ms(e), e === null ? null : e.stateNode;
  }, findFiberByHostInstance: Cr.findFiberByHostInstance || vf, findHostInstancesForRefresh: null, scheduleRefresh: null, scheduleRoot: null, setRefreshHandler: null, getCurrentFiber: null, reconcilerVersion: "18.3.1-next-f1338f8080-20240426" };
  if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u") {
    var Hl = __REACT_DEVTOOLS_GLOBAL_HOOK__;
    if (!Hl.isDisabled && Hl.supportsFiber) try {
      Ar = Hl.inject(xf), wt = Hl;
    } catch {
    }
  }
  return et.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = yf, et.createPortal = function(e, t) {
    var n = 2 < arguments.length && arguments[2] !== void 0 ? arguments[2] : null;
    if (!Ao(t)) throw Error(s(200));
    return mf(e, t, null, n);
  }, et.createRoot = function(e, t) {
    if (!Ao(e)) throw Error(s(299));
    var n = !1, r = "", l = Ba;
    return t != null && (t.unstable_strictMode === !0 && (n = !0), t.identifierPrefix !== void 0 && (r = t.identifierPrefix), t.onRecoverableError !== void 0 && (l = t.onRecoverableError)), t = Do(e, 1, !1, null, null, n, !1, r, l), e[Nt] = t.current, ar(e.nodeType === 8 ? e.parentNode : e), new Oo(t);
  }, et.findDOMNode = function(e) {
    if (e == null) return null;
    if (e.nodeType === 1) return e;
    var t = e._reactInternals;
    if (t === void 0)
      throw typeof e.render == "function" ? Error(s(188)) : (e = Object.keys(e).join(","), Error(s(268, e)));
    return e = ms(t), e = e === null ? null : e.stateNode, e;
  }, et.flushSync = function(e) {
    return cn(e);
  }, et.hydrate = function(e, t, n) {
    if (!$l(t)) throw Error(s(200));
    return Ul(null, e, t, !0, n);
  }, et.hydrateRoot = function(e, t, n) {
    if (!Ao(e)) throw Error(s(405));
    var r = n != null && n.hydratedSources || null, l = !1, i = "", o = Ba;
    if (n != null && (n.unstable_strictMode === !0 && (l = !0), n.identifierPrefix !== void 0 && (i = n.identifierPrefix), n.onRecoverableError !== void 0 && (o = n.onRecoverableError)), t = Ua(t, null, e, 1, n ?? null, l, !1, i, o), e[Nt] = t.current, ar(e), r) for (e = 0; e < r.length; e++) n = r[e], l = n._getVersion, l = l(n._source), t.mutableSourceEagerHydrationData == null ? t.mutableSourceEagerHydrationData = [n, l] : t.mutableSourceEagerHydrationData.push(
      n,
      l
    );
    return new Al(t);
  }, et.render = function(e, t, n) {
    if (!$l(t)) throw Error(s(200));
    return Ul(null, e, t, !1, n);
  }, et.unmountComponentAtNode = function(e) {
    if (!$l(e)) throw Error(s(40));
    return e._reactRootContainer ? (cn(function() {
      Ul(null, null, e, !1, function() {
        e._reactRootContainer = null, e[Nt] = null;
      });
    }), !0) : !1;
  }, et.unstable_batchedUpdates = Po, et.unstable_renderSubtreeIntoContainer = function(e, t, n, r) {
    if (!$l(n)) throw Error(s(200));
    if (e == null || e._reactInternals === void 0) throw Error(s(38));
    return Ul(e, t, n, !1, r);
  }, et.version = "18.3.1-next-f1338f8080-20240426", et;
}
var Ja;
function Pf() {
  if (Ja) return Ho.exports;
  Ja = 1;
  function a() {
    if (!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function"))
      try {
        __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(a);
      } catch (u) {
        console.error(u);
      }
  }
  return a(), Ho.exports = Tf(), Ho.exports;
}
var qa;
function zf() {
  if (qa) return Bl;
  qa = 1;
  var a = Pf();
  return Bl.createRoot = a.createRoot, Bl.hydrateRoot = a.hydrateRoot, Bl;
}
var Mf = zf();
const Rf = ':host{--fc-text: var(--primary-text-color, #2b1e15);--fc-muted: var(--secondary-text-color, #786350);--fc-accent: var(--faith-accent, #86601d);--fc-ink: var(--faith-accent-ink, color-mix(in srgb, var(--fc-accent) 65%, var(--fc-text)));--fc-line: var(--divider-color, rgba(0,0,0,.12));--fc-bg2: var(--secondary-background-color, rgba(0,0,0,.04));--fc-ok: var(--success-color, #43a047);--fc-err: var(--error-color, #db4437);--fc-soft: color-mix(in srgb, var(--fc-accent) 14%, transparent);display:block;--fc-hex: polygon(50% 0, 93.3% 25%, 93.3% 75%, 50% 100%, 6.7% 75%, 6.7% 25%);--fc-serif: var(--faith-serif, "Fraunces Variable", Georgia, "Iowan Old Style", serif)}*{box-sizing:border-box}ha-card{padding:16px;color:var(--fc-text)}.head{display:flex;align-items:center;gap:10px;margin-bottom:12px}.head h2{margin:0;font-size:1.25rem;font-weight:600;line-height:1.2}.head .sub{color:var(--fc-muted);font-size:.85rem}.head .right{margin-left:auto;display:flex;gap:6px;align-items:center}.eyebrow{font-size:.72rem;letter-spacing:.12em;text-transform:uppercase;color:var(--fc-muted)}.hello{font-family:var(--fc-serif);margin:2px 0 14px;font-size:1.6rem;font-weight:600;line-height:1.15}.hello em{color:var(--fc-ink);font-style:italic}.section{padding:12px 0;border-top:1px solid var(--fc-line)}.section:first-of-type{border-top:0;padding-top:0}.section h3{display:flex;align-items:center;gap:8px;margin:0 0 8px;font-size:1rem;font-weight:600}.section h3 ha-icon{--mdc-icon-size: 20px;color:var(--fc-ink)}.count{background:var(--fc-bg2);color:var(--fc-muted);border-radius:999px;padding:0 8px;font-size:.8rem;font-weight:500}ul{list-style:none;margin:0;padding:0}.row{display:flex;align-items:center;gap:10px;padding:7px 0;border-bottom:1px solid var(--fc-line)}.row:last-child{border-bottom:0}.time{min-width:70px;color:var(--fc-muted);font-variant-numeric:tabular-nums}.grow{flex:1;min-width:0}.meta{color:var(--fc-muted);font-size:.85rem}.label{font-size:.72rem;letter-spacing:.1em;text-transform:uppercase;color:var(--fc-muted)}.check{width:18px;height:18px;border-radius:50%;border:2px solid var(--fc-line);flex:none}.check.done{background:var(--fc-ok);border-color:var(--fc-ok)}button.tick{display:grid;place-items:center;min-width:44px;min-height:44px;padding:0;margin:-10px 0 -10px -12px;background:transparent;border:0}button.tick .check{border-color:var(--fc-muted)}.tiles{display:grid;grid-template-columns:repeat(auto-fill,minmax(120px,1fr));gap:8px}.tile{background:var(--fc-bg2);border-radius:12px;padding:10px 12px}.tile .v{font-size:1.15rem;font-weight:600;text-transform:capitalize}.empty{color:var(--fc-muted);padding:4px 0}.err{color:var(--fc-err)}button{font:inherit;color:inherit;cursor:pointer;white-space:nowrap;border:1px solid var(--fc-line);background:var(--fc-bg2);border-radius:10px;padding:8px 14px;min-height:44px}button:focus-visible,a:focus-visible,input:focus-visible{outline:2px solid var(--fc-accent);outline-offset:2px}button.primary{background:var(--fc-accent);border-color:var(--fc-accent);color:var(--faith-accent-text, #fffaf0)}button.ghost{background:transparent;border-color:transparent;color:var(--fc-muted)}button:disabled{opacity:.5;cursor:default}.btns{display:flex;gap:6px;flex-wrap:wrap}input{font:inherit;color:var(--fc-text);background:var(--fc-bg2);border:1px solid var(--fc-line);border-radius:10px;padding:8px 12px;min-height:44px;width:100%}input:focus{outline:2px solid var(--fc-accent);outline-offset:-1px}.avatar{display:inline-grid;place-items:center;color:#fff;font-weight:600;flex:none;clip-path:var(--fc-hex)}.hexring{display:inline-grid;place-items:center;padding:3px;background:var(--fc-accent);clip-path:var(--fc-hex);flex:none}.people{display:grid;grid-template-columns:repeat(auto-fill,minmax(96px,1fr));gap:10px}.person{display:flex;flex-direction:column;align-items:center;gap:8px;padding:14px 8px;border-radius:14px;border:1px solid var(--fc-line);background:transparent;font-weight:600}.person.suggested{border:2px solid var(--fc-accent)}.pin{display:flex;flex-direction:column;align-items:center;gap:12px}.dots{display:flex;gap:10px}.dots span{width:13px;height:13px;border-radius:50%;border:2px solid var(--fc-muted)}.dots span.on{background:var(--fc-accent);border-color:var(--fc-accent)}.keys{display:grid;grid-template-columns:repeat(3,68px);gap:8px}.keys button{height:58px;font-size:1.35rem;border-radius:14px}.chat{display:flex;flex-direction:column;gap:10px;max-height:var(--faith-chat-height, 420px);overflow-y:auto;padding:2px}.msg{max-width:88%;padding:9px 13px;border-radius:16px;white-space:pre-wrap;line-height:1.4}.msg.me{align-self:flex-end;background:var(--fc-accent);color:var(--faith-accent-text, #fffaf0);border-bottom-right-radius:4px}.msg.faith{align-self:flex-start;background:var(--fc-bg2);border-bottom-left-radius:4px}.photos{display:grid;grid-template-columns:repeat(auto-fill,minmax(88px,1fr));gap:6px;width:100%}.photos a{position:relative;display:block;aspect-ratio:1;border-radius:10px;overflow:hidden;background:var(--fc-line)}.photos img,.photos .ph{width:100%;height:100%;object-fit:cover;display:block}.photos .vid{position:absolute;left:4px;bottom:4px;font-size:.7rem;padding:0 6px;border-radius:999px;background:#0009;color:#fff}.photos a:focus-visible{outline:2px solid var(--fc-accent);outline-offset:2px}.chips{display:flex;gap:4px;flex-wrap:wrap}.chip{font-size:.75rem;color:var(--fc-muted);border:1px solid var(--fc-line);border-radius:999px;padding:1px 8px}.ask{display:flex;gap:6px;margin-top:10px;align-items:center}.ask button{min-width:44px;min-height:44px;padding:8px 10px}.attached{display:flex;gap:8px;align-items:center;margin-top:10px;color:var(--fc-muted);font-size:.9rem}.attached img{width:56px;height:56px;object-fit:cover;border-radius:10px}.attached button{margin-left:auto;min-width:44px;min-height:44px}.rec{background:var(--fc-err)!important;color:#fff!important;border-color:var(--fc-err)!important}.box{border:1px solid var(--fc-accent);border-radius:14px;padding:10px 12px;display:flex;flex-direction:column;gap:8px}.box.wait{border-style:dashed}.big{font-size:2.6rem;font-weight:700;line-height:1}.pill{background:var(--fc-soft);color:var(--fc-ink);border-radius:999px;padding:2px 10px;font-weight:600;font-size:.85rem;white-space:nowrap}.toast{color:var(--fc-muted);font-size:.85rem}.toast:empty,.err:empty{display:none}.apps{display:flex;gap:8px;flex-wrap:wrap}.apps a{text-decoration:none;color:inherit;display:flex;align-items:center;gap:8px;border:1px solid var(--fc-line);border-radius:12px;padding:6px 12px 6px 8px;min-height:44px}.emblem{flex:none;margin:-6px -2px -6px -6px}.mine{display:flex;align-items:center;gap:16px}.honey{display:grid;place-items:center;align-content:center;width:104px;height:112px;flex:none;clip-path:var(--fc-hex);background:linear-gradient(160deg,color-mix(in srgb,var(--fc-accent) 70%,#fff),var(--fc-accent));color:var(--faith-accent-text, #fffaf0)}.honey .label{color:inherit;opacity:.85}ha-card.hub{position:relative;overflow:hidden;padding:22px 22px 18px;background:radial-gradient(90% 60% at 50% 45%,color-mix(in srgb,var(--fc-accent) 14%,transparent),transparent 70%),var(--ha-card-background, var(--card-background-color, transparent))}.hub-top{display:flex;align-items:flex-start;gap:12px}.hub-top .right{margin-left:auto;display:flex;gap:8px;align-items:center;flex-wrap:wrap;justify-content:flex-end}.clock{font-family:var(--fc-serif);font-size:3.2rem;font-weight:600;line-height:1;letter-spacing:-.02em;font-variant-numeric:tabular-nums}.hub-mid{display:flex;flex-direction:column;align-items:center;text-align:center;gap:6px;margin:8px 0 10px}.hub-mid .hello{margin:0}button.orb{background:none;border:0;padding:0;min-height:0;border-radius:50%;margin:-8px 0}button.orb:focus-visible{outline:2px solid var(--fc-accent);outline-offset:-12px}button.orb:disabled{opacity:1}.hint{font-size:.72rem;letter-spacing:.16em;text-transform:uppercase;color:var(--fc-accent);font-weight:600}.heard{color:var(--fc-muted);font-style:italic}.reply{font-family:var(--fc-serif);font-size:1.3rem;line-height:1.4;max-width:34em;white-space:pre-wrap}.hub-mid .box{text-align:left;width:min(100%,30em)}.faces{display:flex;justify-content:center;gap:18px;flex-wrap:wrap;margin-top:14px;padding-top:14px;border-top:1px solid var(--fc-line)}button.face{display:flex;flex-direction:column;align-items:center;gap:6px;background:none;border:0;padding:4px;min-height:0;font-weight:600;font-size:.9rem}.overlay{position:absolute;top:0;right:0;bottom:0;left:0;z-index:2;display:grid;place-items:center;padding:16px;background:var(--ha-card-background, var(--card-background-color, #241a13))}.md-list{list-style:disc;margin:2px 0 4px;padding-left:1.3em;text-align:left}.md-list li{margin:1px 0}.msg .md-line:last-child,.reply .md-line:last-child{white-space:normal}code{font-family:ui-monospace,monospace;font-size:.9em;background:var(--fc-bg2);border-radius:5px;padding:0 4px}.cardbal{display:flex;align-items:center;gap:6px;margin-top:8px}.cardbal ha-icon{--mdc-icon-size: 18px;color:var(--fc-accent)}input[type=checkbox]{accent-color:var(--fc-accent);width:20px;min-height:20px;height:20px;padding:0}', Ko = (a) => `faith.hub.${a}`, sc = (a) => {
  if (a)
    try {
      return localStorage.getItem(Ko(a)) || void 0;
    } catch {
      return;
    }
};
function Xo(a, u) {
  try {
    u ? localStorage.setItem(Ko(a), u) : localStorage.removeItem(Ko(a));
  } catch {
  }
  window.dispatchEvent(new CustomEvent("faith-hub-changed", { detail: { screen: a } }));
}
const uc = (a) => `faith.device.${a}`, Lf = (a) => {
  if (a)
    try {
      return localStorage.getItem(uc(a)) || void 0;
    } catch {
      return;
    }
};
function If(a, u) {
  try {
    localStorage.setItem(uc(a), u);
  } catch {
  }
  window.dispatchEvent(new CustomEvent("faith-hub-changed", { detail: { screen: a } }));
}
function Df(a, u) {
  return {
    screen: u.screen,
    get user() {
      var s;
      return (s = a()) == null ? void 0 : s.user;
    },
    get dark() {
      var s, w;
      return !!((w = (s = a()) == null ? void 0 : s.themes) != null && w.darkMode);
    },
    call: async (s, w = {}) => {
      const v = a();
      if (!v) throw new Error("Home Assistant isn't ready yet.");
      const E = sc(u.screen), N = Lf(u.screen);
      try {
        return await v.callWS({ type: "faith/call", path: s, body: { ...w, ...u.screen ? { screen: u.screen } : {}, ...E ? { hub_session: E } : {}, ...N ? { device_token: N } : {} } });
      } catch (C) {
        throw new Error((C == null ? void 0 : C.message) || (C == null ? void 0 : C.code) || "FAITH didn't answer.");
      }
    }
  };
}
const zr = (1 + Math.sqrt(5)) / 2, it = Math.PI * 2, Go = (() => {
  const a = Math.hypot(1, zr), u = [];
  for (const s of [-1, 1]) for (const w of [-zr, zr]) u.push([0, s / a, w / a], [s / a, w / a, 0], [w / a, 0, s / a]);
  return u;
})(), Ff = (a, u) => (a[0] - u[0]) ** 2 + (a[1] - u[1]) ** 2 + (a[2] - u[2]) ** 2, Of = 4 / (1 + zr * zr), Zo = [];
for (let a = 0; a < 12; a++) for (let u = a + 1; u < 12; u++) Math.abs(Ff(Go[a], Go[u]) - Of) < 0.01 && Zo.push([a, u]);
const ac = [], Wo = (a, u) => Zo.some(([s, w]) => s === a && w === u || s === u && w === a);
for (let a = 0; a < 12; a++) for (let u = a + 1; u < 12; u++) for (let s = u + 1; s < 12; s++) Wo(a, u) && Wo(u, s) && Wo(a, s) && ac.push([a, u, s]);
const Mr = 7, bt = (a) => {
  const u = Math.sin(a * 127.1 + 311.7) * 43758.5453;
  return u - Math.floor(u);
}, ba = Array.from({ length: Mr }, (a, u) => ({
  a: [0, 1, 2].map((s) => 0.3 + 0.16 * bt(u * 9 + s)),
  w: [0, 1, 2].map((s) => 0.22 + 0.3 * bt(u * 9 + s + 3)),
  p: [0, 1, 2].map((s) => it * bt(u * 9 + s + 6)),
  flap: it * bt(u * 3 + 100)
})), cc = -1, Rr = [];
for (let a = 0; a < Mr; a++) Rr.push({ a: cc, b: a, kind: "core", seed: bt(a + 40) });
for (let a = 0; a < Mr; a++) Rr.push({ a, b: (a + 1) % Mr, kind: "bee", seed: bt(a + 60) });
for (const [a, u] of [[0, 3], [2, 5], [4, 6]]) Rr.push({ a, b: u, kind: "bee", seed: bt(a * 7 + u) });
for (const [a, u] of [[1, 0], [3, 7], [5, 10]]) Rr.push({ a, b: u, kind: "shell", seed: bt(a + u * 3) });
const Af = [
  { r: 1.34, tiltX: 1.12, tiltZ: 0.38, precess: 0.21, phase: 0, width: 0.024, ticks: 36 },
  { r: 1.5, tiltX: 1.38, tiltZ: -0.62, precess: -0.15, phase: Math.PI / 2, width: 0.016, ticks: 0 }
], ec = ([a, u, s], w) => {
  const v = Math.cos(w), E = Math.sin(w);
  return [a, u * v - s * E, u * E + s * v];
}, tc = ([a, u, s], w) => {
  const v = Math.cos(w), E = Math.sin(w);
  return [a * v + s * E, u, -a * E + s * v];
}, nc = ([a, u, s], w) => {
  const v = Math.cos(w), E = Math.sin(w);
  return [a * v - u * E, a * E + u * v, s];
}, $f = {
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
}, xe = (a, u) => `rgba(${a[0]},${a[1]},${a[2]},${Math.max(0, Math.min(1, u))})`, Vl = {
  idle: { spin: 0.16, bees: 1, rings: 1, sparks: 0.3, glow: 0.45, gather: 0 },
  listening: { spin: 0.1, bees: 0.7, rings: 0.6, sparks: 0.2, glow: 0.6, gather: 0.3 },
  thinking: { spin: 0.55, bees: 1.9, rings: 3.2, sparks: 1, glow: 0.8, gather: 0.1 },
  speaking: { spin: 0.22, bees: 1.2, rings: 1.4, sparks: 0.55, glow: 0.55, gather: 0 }
};
class Uf {
  constructor(u, s = {}) {
    Ue(this, "ctx");
    Ue(this, "opts");
    Ue(this, "raf", 0);
    Ue(this, "last", 0);
    Ue(this, "t", 0);
    Ue(this, "acc", { spin: 0.6, bees: 3, rings: 1.2, sparks: 0 });
    Ue(this, "cur", { ...Vl.idle });
    Ue(this, "ro");
    Ue(this, "heading", new Array(Mr).fill(0));
    Ue(this, "w", 0);
    Ue(this, "h", 0);
    Ue(this, "dpr", 1);
    this.canvas = u, this.ctx = u.getContext("2d"), this.opts = { state: "idle", tone: "dark", still: !1, ...s }, this.cur = { ...Vl[this.opts.state] }, this.resize(), typeof ResizeObserver < "u" && (this.ro = new ResizeObserver(() => {
      this.resize(), this.opts.still && this.frame(0);
    }), this.ro.observe(u)), this.opts.still ? this.frame(0) : this.loop();
  }
  set(u) {
    const s = this.opts.still;
    this.opts = { ...this.opts, ...u }, this.opts.still ? (cancelAnimationFrame(this.raf), this.raf = 0, this.cur = { ...Vl[this.opts.state] }, this.frame(0)) : (s || !this.raf) && this.loop();
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
      const w = Math.min(0.05, (s - this.last) / 1e3);
      this.last = s, this.frame(w), this.raf = requestAnimationFrame(u);
    };
    this.raf = requestAnimationFrame(u);
  }
  frame(u) {
    const s = Vl[this.opts.state], w = Math.min(1, u * 2.5);
    for (const v of Object.keys(s)) this.cur[v] += (s[v] - this.cur[v]) * w;
    this.t += u, this.acc.spin += this.cur.spin * u, this.acc.bees += this.cur.bees * u, this.acc.rings += this.cur.rings * u, this.acc.sparks += (0.25 + this.cur.sparks * 0.9) * u, this.draw();
  }
  level() {
    const u = this.opts.state;
    if (u !== "listening" && u !== "speaking") return 0;
    const s = typeof this.opts.level == "function" ? this.opts.level() : this.opts.level;
    if (typeof s == "number") return Math.max(0, Math.min(1, s));
    const w = this.t;
    return u === "speaking" ? 0.5 + 0.5 * Math.sin(w * 9) * Math.sin(w * 2.3) : 0.3 + 0.2 * Math.sin(w * 3);
  }
  draw() {
    const { ctx: u, w: s, h: w } = this, v = $f[this.opts.tone], E = s / 2, N = w / 2, C = Math.min(s, w) / 2 / 1.86, y = 5, T = this.level(), M = this.acc.spin, _ = 0.38 + 0.12 * Math.sin(this.t * 0.31), L = 0.08 * Math.sin(this.t * 0.23), A = (k) => ec(nc(tc(k, M), L), _), G = (k) => {
      const j = y / (y - k[2]);
      return { x: E + k[0] * C * j, y: N - k[1] * C * j, z: k[2], s: j };
    }, Y = (k) => (k + 1) / 2;
    u.clearRect(0, 0, s, w);
    const q = this.cur.glow + T * 0.5, me = u.createRadialGradient(E, N, 0, E, N, C * 1.6);
    me.addColorStop(0, xe(v.glow, 0.26 * q)), me.addColorStop(0.45, xe(v.glow, 0.1 * q)), me.addColorStop(1, xe(v.glow, 0)), u.fillStyle = me, u.fillRect(0, 0, s, w);
    const Ce = [], Le = [], ve = [];
    Af.forEach((k, j) => {
      const f = k.phase + this.acc.rings * k.precess, S = (Z, oe = k.r) => tc(nc(ec([Math.cos(Z) * oe, 0, Math.sin(Z) * oe], k.tiltX), k.tiltZ), f), $ = 96, X = [];
      let ee = G(S(0));
      for (let Z = 1; Z <= $; Z++) {
        const oe = S(Z / $ * it), je = G(oe);
        X.push({ a: ee, b: je, z: (ee.z + je.z) / 2, wd: k.width }), ee = je;
      }
      Ce.push(X);
      const b = [], se = this.acc.rings * 0.35 * (j ? -1 : 1);
      for (let Z = 0; Z < k.ticks; Z++) {
        const oe = Z / k.ticks * it + se, je = Z % 3 === 0 ? 0.07 : 0.035, ft = G(S(oe, k.r - je)), Hn = G(S(oe, k.r + je));
        b.push({ a: ft, b: Hn, z: (ft.z + Hn.z) / 2 });
      }
      if (Le.push(b), j === 0) for (const Z of [0, Math.PI]) ve.push(G(S(se * 1.6 + Z)));
      else ve.push(G(S(-se * 1.2 + 1)));
    });
    const ze = (k) => {
      u.lineCap = "round", Ce.forEach((j) => {
        for (const f of j) {
          if (f.z >= 0 !== k) continue;
          const S = Y(f.z);
          u.strokeStyle = `rgb(${v.ringLo.map(($, X) => Math.round($ + (v.ringHi[X] - $) * S)).join(",")})`, u.globalAlpha = k ? 1 : 0.55, u.lineWidth = Math.max(this.dpr * 1.2, C * f.wd * f.a.s), u.beginPath(), u.moveTo(f.a.x, f.a.y), u.lineTo(f.b.x, f.b.y), u.stroke();
        }
      }), u.lineWidth = C * 8e-3;
      for (const j of Le) for (const f of j)
        f.z >= 0 === k && (u.strokeStyle = xe(v.ringHi, (k ? 0.9 : 0.35) * (0.4 + 0.6 * Y(f.z))), u.beginPath(), u.moveTo(f.a.x, f.a.y), u.lineTo(f.b.x, f.b.y), u.stroke());
      for (const j of ve) {
        if (j.z >= 0 !== k) continue;
        u.globalAlpha = k ? 1 : 0.5;
        const f = C * 0.034 * j.s, S = u.createRadialGradient(j.x - f * 0.3, j.y - f * 0.3, f * 0.1, j.x, j.y, f);
        S.addColorStop(0, xe(v.spark, 1)), S.addColorStop(1, xe(v.ringLo, 1)), u.fillStyle = S, u.beginPath(), u.arc(j.x, j.y, f, 0, it), u.fill();
      }
      u.globalAlpha = 1;
    };
    ze(!1);
    const de = Go.map(A), ue = de.map(G), te = (k) => {
      for (const [j, f] of Zo) {
        const S = (de[j][2] + de[f][2]) / 2;
        S >= -0.05 === k && (u.strokeStyle = k ? xe(v.edge, 0.55 + 0.45 * Y(S)) : xe(v.edgeBack, this.opts.tone === "light" ? 0.45 : 0.32), u.lineWidth = Math.max(this.dpr * (k ? 1 : 0.6), C * (k ? 0.013 : 8e-3)), u.beginPath(), u.moveTo(ue[j].x, ue[j].y), u.lineTo(ue[f].x, ue[f].y), u.stroke());
      }
    };
    te(!1);
    const le = 1 - this.cur.gather, D = ba.map((k) => {
      const j = ($) => [k.a[0] * Math.sin(k.w[0] * $ + k.p[0]) * le, k.a[1] * Math.sin(k.w[1] * $ + k.p[1]) * le, k.a[2] * Math.cos(k.w[2] * $ + k.p[2]) * le], f = A(j(this.acc.bees)), S = G(A(j(this.acc.bees + 0.05)));
      return { v: f, p: G(f), next: S };
    }), re = G([0, 0, 0]), ie = (k, j, f) => f === "a" && k === cc ? re : j === "shell" && f === "b" ? ue[k] : D[k].p, pe = Rr.map((k) => ({ l: k, A: ie(k.a, k.kind, "a"), B: ie(k.b, k.kind, "b") })), Ge = (k, j) => {
      const f = Math.hypot(j.x - k.x, j.y - k.y);
      return { mx: (k.x + j.x) / 2, my: (k.y + j.y) / 2 + f * 0.12 };
    };
    u.lineCap = "round";
    for (const { l: k, A: j, B: f } of pe) {
      const { mx: S, my: $ } = Ge(j, f), X = (j.z + f.z) / 2;
      u.strokeStyle = xe(v.thread, (k.kind === "core" ? 0.6 : k.kind === "shell" ? 0.35 : 0.5) * (0.5 + 0.5 * Y(X))), u.lineWidth = Math.max(this.dpr * 0.6, C * (k.kind === "core" ? 9e-3 : 65e-4)), u.beginPath(), u.moveTo(j.x, j.y), u.quadraticCurveTo(S, $, f.x, f.y), u.stroke();
    }
    for (const { l: k, A: j, B: f } of pe) {
      if (k.kind === "shell") continue;
      const S = this.cur.sparks;
      if (k.seed > S + 0.15) continue;
      const $ = (this.acc.sparks * (0.6 + k.seed) + k.seed * 7) % 1, { mx: X, my: ee } = Ge(j, f), b = 1 - $, se = b * b * j.x + 2 * b * $ * X + $ * $ * f.x, Z = b * b * j.y + 2 * b * $ * ee + $ * $ * f.y, oe = C * 0.018 * (0.6 + S * 0.6), je = Math.sin($ * Math.PI), ft = u.createRadialGradient(se, Z, 0, se, Z, oe * 2.4);
      ft.addColorStop(0, xe(v.spark, 0.95 * je)), ft.addColorStop(1, xe(v.spark, 0)), u.fillStyle = ft, u.beginPath(), u.arc(se, Z, oe * 2.4, 0, it), u.fill();
    }
    const Ye = C * (0.085 + 0.035 * T + 0.01 * Math.sin(this.t * 2)), Ie = u.createRadialGradient(re.x, re.y, 0, re.x, re.y, Ye * 3.2);
    Ie.addColorStop(0, xe(v.core, 0.55 * q)), Ie.addColorStop(1, xe(v.core, 0)), u.fillStyle = Ie, u.beginPath(), u.arc(re.x, re.y, Ye * 3.2, 0, it), u.fill(), this.hex(re.x, re.y, Ye, this.acc.spin * 0.5, v);
    const we = D.map((k, j) => j).sort((k, j) => D[k].v[2] - D[j].v[2]);
    for (const k of we) {
      const j = D[k];
      let S = Math.atan2(j.next.y - j.p.y, j.next.x - j.p.x) - this.heading[k];
      S = ((S + Math.PI) % it + it) % it - Math.PI, this.heading[k] += this.opts.still ? S : S * 0.15;
      const $ = 0.35 + 0.65 * Math.abs(Math.sin(this.t * 26 + ba[k].flap));
      this.bee(j.p.x, j.p.y, C * 0.15 * j.p.s, this.heading[k], $, 0.55 + 0.45 * Y(j.v[2]), v);
    }
    const F = [-0.4, 0.6, 0.7];
    for (const [k, j, f] of ac) {
      const S = de[k], $ = de[j], X = de[f], ee = [(S[0] + $[0] + X[0]) / 3, (S[1] + $[1] + X[1]) / 3, (S[2] + $[2] + X[2]) / 3];
      if (ee[2] <= 0) continue;
      const b = Math.max(0, (ee[0] * F[0] + ee[1] * F[1] + ee[2] * F[2]) / Math.hypot(...ee));
      u.fillStyle = xe(v.face, 0.03 + 0.07 * b * b), u.beginPath(), u.moveTo(ue[k].x, ue[k].y), u.lineTo(ue[j].x, ue[j].y), u.lineTo(ue[f].x, ue[f].y), u.closePath(), u.fill();
    }
    te(!0);
    for (let k = 0; k < 12; k++)
      de[k][2] < -0.05 || (u.fillStyle = xe(v.edge, 0.6 + 0.4 * Y(de[k][2])), u.beginPath(), u.arc(ue[k].x, ue[k].y, C * 0.02 * ue[k].s, 0, it), u.fill());
    ze(!0);
  }
  hex(u, s, w, v, E) {
    const { ctx: N } = this, C = Array.from({ length: 6 }, (y, T) => [u + w * Math.cos(v + T * it / 6), s + w * Math.sin(v + T * it / 6)]);
    for (let y = 0; y < 6; y++) {
      const [T, M] = C[y], [_, L] = C[(y + 1) % 6];
      N.fillStyle = xe(E.bee[y % 3], 1), N.beginPath(), N.moveTo(u, s), N.lineTo(T, M), N.lineTo(_, L), N.closePath(), N.fill();
    }
    N.strokeStyle = xe(E.spark, 0.9), N.lineWidth = w * 0.12, N.beginPath(), C.forEach(([y, T], M) => M ? N.lineTo(y, T) : N.moveTo(y, T)), N.closePath(), N.stroke();
  }
  /** One low-poly bee seen from above, facing +x in its own space. */
  bee(u, s, w, v, E, N, C) {
    const { ctx: y } = this;
    y.save(), y.translate(u, s), y.rotate(v), y.scale(w, w), y.globalAlpha = N;
    const T = (L) => {
      y.beginPath(), L.forEach(([A, G], Y) => Y ? y.lineTo(A, G) : y.moveTo(A, G)), y.closePath();
    };
    y.fillStyle = xe(C.head, 1), T([[-1.02, -0.08], [-1.28, 0], [-1.02, 0.08]]), y.fill();
    const M = [[-1.05, 0], [-0.78, -0.4], [-0.2, -0.5], [0.28, -0.36], [0.46, 0], [0.28, 0.36], [-0.2, 0.5], [-0.78, 0.4]], _ = [-0.3, 0];
    for (let L = 0; L < M.length; L++)
      y.fillStyle = xe(C.bee[L % 3], 1), T([_, M[L], M[(L + 1) % M.length]]), y.fill();
    y.save(), T(M), y.clip(), y.fillStyle = xe(C.stripe, 0.92), T([[-0.26, -0.6], [-0.44, -0.6], [-0.5, 0.6], [-0.32, 0.6]]), y.fill(), T([[-0.64, -0.6], [-0.8, -0.6], [-0.86, 0.6], [-0.7, 0.6]]), y.fill(), y.restore(), y.fillStyle = xe(C.head, 1), T([[0.42, 0], [0.58, -0.27], [0.86, -0.2], [0.95, 0], [0.86, 0.2], [0.58, 0.27]]), y.fill(), y.fillStyle = xe(C.bee[1], 0.9), T([[0.7, -0.2], [0.84, -0.14], [0.74, -0.08]]), y.fill(), T([[0.7, 0.2], [0.84, 0.14], [0.74, 0.08]]), y.fill(), y.strokeStyle = xe(C.head, 1), y.lineWidth = 0.06, y.lineCap = "round", y.beginPath(), y.moveTo(0.9, -0.1), y.lineTo(1.08, -0.2), y.lineTo(1.2, -0.4), y.moveTo(0.9, 0.1), y.lineTo(1.08, 0.2), y.lineTo(1.2, 0.4), y.stroke();
    for (const L of [-1, 1]) {
      const A = L * E, G = [[0.22, 0.16 * L], [0.05, 1.08 * A], [-0.5, 0.92 * A], [-0.22, 0.24 * L]];
      y.fillStyle = xe(C.wing, 0.38), T(G), y.fill(), y.strokeStyle = xe(C.bee[1], 0.85), y.lineWidth = 0.04, y.stroke(), y.beginPath(), y.moveTo(0.05, 0.2 * L), y.lineTo(-0.22, 0.95 * A), y.stroke();
    }
    y.restore();
  }
}
const rc = () => typeof matchMedia == "function" && matchMedia("(prefers-reduced-motion: reduce)").matches;
function dc({ size: a = 160, state: u = "idle", level: s, tone: w = "dark", still: v, className: E }) {
  const N = W.useRef(null), C = W.useRef();
  return W.useEffect(() => (C.current = new Uf(N.current, { state: u, level: s, tone: w, still: v ?? rc() }), () => {
    var y;
    return (y = C.current) == null ? void 0 : y.destroy();
  }), []), W.useEffect(() => {
    var y;
    (y = C.current) == null || y.set({ state: u, level: s, tone: w, still: v ?? rc() });
  }, [u, s, w, v]), /* @__PURE__ */ c.jsx("canvas", { ref: N, className: E, style: { width: a, height: a, display: "block" }, role: "img", "aria-label": `FAITH (${u})` });
}
const Hf = { today: "mdi:calendar-today", meals: "mdi:silverware-fork-knife", shopping: "mdi:cart-outline", chores: "mdi:broom", home: "mdi:home-outline", approvals: "mdi:shield-check-outline" }, Bf = (a) => a.split(/\s+/).map((u) => u[0]).join("").slice(0, 2).toUpperCase(), Un = ({ p: a, size: u = 40, ring: s }) => {
  const w = /* @__PURE__ */ c.jsx("span", { className: "avatar", style: { width: u, height: u, fontSize: u * 0.36, background: a.color || "var(--fc-accent)", color: Vf(a.color) }, children: Bf(a.name) });
  return s ? /* @__PURE__ */ c.jsx("span", { className: "hexring", children: w }) : w;
};
function Vf(a) {
  const u = /^#?([0-9a-f]{6})$/i.exec(a || "");
  if (!u) return;
  const s = (v) => {
    const E = parseInt(u[1].slice(v, v + 2), 16) / 255;
    return E <= 0.03928 ? E / 12.92 : ((E + 0.055) / 1.055) ** 2.4;
  }, w = 0.2126 * s(0) + 0.7152 * s(2) + 0.0722 * s(4);
  return (w + 0.05) / 0.0625 > 1.05 / (w + 0.05) ? "#2b1e15" : "#fffaf0";
}
const Lt = (a) => /couldn.t reach|cannot connect|econnrefused|timed out|failed to fetch|networkerror/i.test(a) ? "FAITH isn't answering. Check that its container is running." : a;
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
function fc({ text: a }) {
  const u = (E) => E.split(/(\*\*[^*]+\*\*|__[^_]+__|\*[^*\s][^*]*\*|`[^`]+`)/g).map((N, C) => /^(\*\*|__).+\1$/.test(N) ? /* @__PURE__ */ c.jsx("b", { children: N.slice(2, -2) }, C) : /^\*.+\*$/.test(N) ? /* @__PURE__ */ c.jsx("i", { children: N.slice(1, -1) }, C) : /^`.+`$/.test(N) ? /* @__PURE__ */ c.jsx("code", { children: N.slice(1, -1) }, C) : N), s = [];
  let w = [];
  const v = () => {
    w.length && s.push(/* @__PURE__ */ c.jsx("ul", { className: "md-list", children: w }, `l${s.length}`)), w = [];
  };
  return a.split(`
`).forEach((E, N) => {
    const C = E.replace(/^#{1,6}\s+/, ""), y = C.match(/^\s*(?:[-*•]|\d+[.)])\s+(.*)$/);
    if (y) {
      w.push(/* @__PURE__ */ c.jsx("li", { children: u(y[1]) }, N));
      return;
    }
    v(), s.push(/* @__PURE__ */ c.jsxs("span", { className: "md-line", children: [
      u(C),
      `
`
    ] }, N));
  }), v(), /* @__PURE__ */ c.jsx(c.Fragment, { children: s });
}
const Wf = (a, u = /* @__PURE__ */ new Date()) => {
  if (!a || !/^\d{2}:\d{2}$/.test(a)) return !0;
  const [s, w] = a.split(":").map(Number);
  return s * 60 + w >= u.getHours() * 60 + u.getMinutes();
};
function Wl(a, u, s = {}, w = 6e4) {
  const [v, E] = W.useState(null), [N, C] = W.useState(""), y = W.useCallback(() => a.call(u, s).then((T) => {
    E(T), C("");
  }).catch((T) => C(T.message)), [a, u, JSON.stringify(s)]);
  return W.useEffect(() => {
    y();
    const T = setInterval(y, w), M = (_) => {
      var A;
      const L = (A = _.detail) == null ? void 0 : A.screen;
      (!L || L === a.screen) && y();
    };
    return window.addEventListener("faith-hub-changed", M), () => {
      clearInterval(T), window.removeEventListener("faith-hub-changed", M);
    };
  }, [y, w]), { data: v, err: N, load: y };
}
function Qf({ api: a, items: u, can: s, onDone: w, say: v }) {
  const E = (N, C) => a.call(`/api/ha/approvals/${N}`, { approve: C }).then((y) => {
    v(y.text), w();
  }).catch((y) => v(Lt(y.message)));
  return /* @__PURE__ */ c.jsxs(c.Fragment, { children: [
    /* @__PURE__ */ c.jsx("ul", { children: u.map((N) => /* @__PURE__ */ c.jsxs("li", { className: "row", children: [
      /* @__PURE__ */ c.jsxs("div", { className: "grow", children: [
        /* @__PURE__ */ c.jsx("div", { children: N.summary }),
        /* @__PURE__ */ c.jsxs("div", { className: "meta", children: [
          "Asked by ",
          N.requested_by.replace(/^household on /, "the ")
        ] })
      ] }),
      s && /* @__PURE__ */ c.jsxs("div", { className: "btns", children: [
        /* @__PURE__ */ c.jsx("button", { className: "primary", "aria-label": `Approve: ${N.summary}`, onClick: () => E(N.id, !0), children: "Approve" }),
        /* @__PURE__ */ c.jsx("button", { "aria-label": `Deny: ${N.summary}`, onClick: () => E(N.id, !1), children: "Deny" })
      ] })
    ] }, N.id)) }),
    !s && /* @__PURE__ */ c.jsx("div", { className: "meta", children: "A grown-up approves these (signed in here, or on their phone)." })
  ] });
}
function Kf({ c: a, api: u, can: s, reload: w, say: v }) {
  var T;
  const E = (M) => u.call("/api/ha/shopping/done", { args: { item: M } }).then((_) => {
    v(_.approval ? `Asked a grown-up to tick ${M} off.` : `Ticked ${M} off.`), w();
  }).catch((_) => v(Lt(_.message))), N = a.items ?? [];
  let C;
  a.error ? C = /* @__PURE__ */ c.jsx("div", { className: "err", children: Lt(a.error) }) : a.empty ? C = /* @__PURE__ */ c.jsx("div", { className: "empty", children: a.empty }) : a.kind === "schedule" ? C = /* @__PURE__ */ c.jsx("ul", { children: N.map((M, _) => /* @__PURE__ */ c.jsxs("li", { className: "row", children: [
    /* @__PURE__ */ c.jsx("span", { className: "time", children: Pr(M.time) }),
    /* @__PURE__ */ c.jsxs("div", { className: "grow", children: [
      /* @__PURE__ */ c.jsx("div", { children: M.title }),
      M.meta && /* @__PURE__ */ c.jsx("div", { className: "meta", children: M.meta })
    ] })
  ] }, _)) }) : a.kind === "meals" ? C = /* @__PURE__ */ c.jsx("ul", { children: N.map((M, _) => /* @__PURE__ */ c.jsxs("li", { className: "row", children: [
    /* @__PURE__ */ c.jsxs("span", { className: "label grow", children: [
      M.label,
      M.time && Pr(M.time) !== "Today" ? ` · ${Pr(M.time)}` : ""
    ] }),
    /* @__PURE__ */ c.jsx("span", { children: M.title })
  ] }, _)) }) : a.kind === "checklist" || a.kind === "list" ? C = /* @__PURE__ */ c.jsx("ul", { children: N.map((M, _) => /* @__PURE__ */ c.jsxs("li", { className: "row", children: [
    a.kind === "checklist" && /* @__PURE__ */ c.jsx("button", { className: "tick", "aria-label": `Tick ${M.title} off the list`, onClick: () => E(M.title), children: /* @__PURE__ */ c.jsx("span", { className: `check ${M.done ? "done" : ""}` }) }),
    /* @__PURE__ */ c.jsxs("span", { className: "grow", children: [
      M.label && /* @__PURE__ */ c.jsxs("span", { className: "label", children: [
        M.label,
        " "
      ] }),
      M.title
    ] }),
    (M.meta || M.time) && /* @__PURE__ */ c.jsx("span", { className: "meta", children: M.meta || Pr(M.time) })
  ] }, _)) }) : a.kind === "entities" ? C = /* @__PURE__ */ c.jsx("div", { className: "tiles", children: (a.entities ?? []).map((M) => /* @__PURE__ */ c.jsxs("div", { className: "tile", children: [
    /* @__PURE__ */ c.jsx("div", { className: "meta", children: M.name }),
    /* @__PURE__ */ c.jsx("div", { className: "v", children: M.state })
  ] }, M.entity_id)) }) : a.kind === "approvals" ? C = /* @__PURE__ */ c.jsx(Qf, { api: u, items: a.approvals ?? [], can: s, onDone: w, say: v }) : C = /* @__PURE__ */ c.jsx("div", { style: { whiteSpace: "pre-wrap" }, children: a.text });
  const y = a.kind === "checklist" ? N.length : a.kind === "approvals" ? (T = a.approvals) == null ? void 0 : T.length : void 0;
  return /* @__PURE__ */ c.jsxs("div", { className: "section", children: [
    /* @__PURE__ */ c.jsxs("h3", { children: [
      /* @__PURE__ */ c.jsx("ha-icon", { icon: Hf[a.id] || "mdi:note-text-outline" }),
      a.title,
      y ? /* @__PURE__ */ c.jsx("span", { className: "count", children: y }) : null
    ] }),
    C
  ] });
}
function Gf({ api: a, layout: u, onDone: s }) {
  const w = u.available, [v, E] = W.useState([...u.order, ...w.map((A) => A.id).filter((A) => !u.order.includes(A))]), [N, C] = W.useState(u.hidden), [y, T] = W.useState(""), M = (A) => {
    var G;
    return ((G = w.find((Y) => Y.id === A)) == null ? void 0 : G.title) ?? A;
  }, _ = (A, G) => E((Y) => {
    const q = [...Y], me = A + G;
    return me < 0 || me >= q.length ? Y : ([q[A], q[me]] = [q[me], q[A]], q);
  }), L = (A) => a.call("/api/ha/prefs/cards", A).then(s).catch((G) => T(G.message));
  return /* @__PURE__ */ c.jsxs("div", { className: "section", children: [
    /* @__PURE__ */ c.jsx("h3", { children: "Arrange your card" }),
    /* @__PURE__ */ c.jsx("ul", { "aria-label": "Sections, in order", children: v.map((A, G) => /* @__PURE__ */ c.jsxs("li", { className: "row", children: [
      /* @__PURE__ */ c.jsxs("label", { className: "grow", style: { display: "flex", gap: 8, alignItems: "center" }, children: [
        /* @__PURE__ */ c.jsx("input", { type: "checkbox", checked: !N.includes(A), onChange: (Y) => C((q) => Y.target.checked ? q.filter((me) => me !== A) : [...q, A]) }),
        "Show ",
        M(A)
      ] }),
      /* @__PURE__ */ c.jsx("button", { className: "ghost", "aria-label": `Move ${M(A)} up`, disabled: G === 0, onClick: () => _(G, -1), children: "↑" }),
      /* @__PURE__ */ c.jsx("button", { className: "ghost", "aria-label": `Move ${M(A)} down`, disabled: G === v.length - 1, onClick: () => _(G, 1), children: "↓" })
    ] }, A)) }),
    /* @__PURE__ */ c.jsxs("div", { className: "btns", style: { marginTop: 10 }, children: [
      /* @__PURE__ */ c.jsx("button", { className: "primary", onClick: () => L({ order: v, hidden: N }), children: "Save" }),
      /* @__PURE__ */ c.jsx("button", { onClick: s, children: "Cancel" }),
      u.saved && /* @__PURE__ */ c.jsx("button", { className: "ghost", onClick: () => L({ reset: !0 }), children: "Back to the default" })
    ] }),
    /* @__PURE__ */ c.jsx("div", { className: "err", role: "alert", children: y })
  ] });
}
function Yf({ api: a, config: u }) {
  var M;
  const { data: s, err: w, load: v } = Wl(a, "/api/ha/view", u.cards ? { cards: u.cards } : {}), [E, N] = W.useState(!1), [C, y] = W.useState("");
  if (w) return /* @__PURE__ */ c.jsx("ha-card", { children: /* @__PURE__ */ c.jsx("div", { className: "err", role: "alert", children: Lt(w) }) });
  if (!s) return /* @__PURE__ */ c.jsx("ha-card", { children: /* @__PURE__ */ c.jsx("div", { className: "empty", children: "Loading…" }) });
  const T = s.person ? `${s.person.name}'s` : "The family's";
  return E && s.layout ? /* @__PURE__ */ c.jsx("ha-card", { children: /* @__PURE__ */ c.jsx(Gf, { api: a, layout: s.layout, onDone: () => {
    N(!1), v();
  } }) }) : /* @__PURE__ */ c.jsxs("ha-card", { children: [
    u.title !== "" && /* @__PURE__ */ c.jsxs(c.Fragment, { children: [
      /* @__PURE__ */ c.jsxs("div", { className: "head", style: { marginBottom: 0 }, children: [
        /* @__PURE__ */ c.jsx("div", { className: "eyebrow", children: (/* @__PURE__ */ new Date()).toLocaleDateString([], { weekday: "long", month: "long", day: "numeric" }) }),
        ((M = s.layout) == null ? void 0 : M.can_arrange) && /* @__PURE__ */ c.jsx("div", { className: "right", children: /* @__PURE__ */ c.jsx("button", { className: "ghost", onClick: () => N(!0), children: "Arrange" }) })
      ] }),
      /* @__PURE__ */ c.jsx("div", { className: "hello", children: u.title ?? /* @__PURE__ */ c.jsxs(c.Fragment, { children: [
        T,
        " ",
        /* @__PURE__ */ c.jsx("em", { children: "day" }),
        ", at a glance."
      ] }) })
    ] }),
    u.show_apps !== !1 && s.apps.length > 0 && /* @__PURE__ */ c.jsx("div", { className: "section", children: /* @__PURE__ */ c.jsx("div", { className: "apps", children: s.apps.map((_) => /* @__PURE__ */ c.jsxs("a", { href: _.url, target: "_blank", rel: "noreferrer", children: [
      /* @__PURE__ */ c.jsx("span", { children: _.icon || "↗" }),
      _.name
    ] }, _.id)) }) }),
    s.cards.map((_) => /* @__PURE__ */ c.jsx(Kf, { c: _, api: a, can: s.can_approve, reload: v, say: y }, _.id)),
    !s.cards.length && /* @__PURE__ */ c.jsx("div", { className: "empty", children: "Nothing to show yet." }),
    /* @__PURE__ */ c.jsx("div", { className: "toast", role: "status", children: C })
  ] });
}
const pc = (a) => a.call("/api/ha/hub/people");
function hc({ api: a, people: u, pick: s, onBack: w, onDone: v }) {
  const [E, N] = W.useState(""), [C, y] = W.useState(""), T = async (_) => {
    y("");
    try {
      const L = await a.call("/api/ha/hub/signin", _);
      Xo(a.screen, L.hub_session), v();
    } catch (L) {
      y(L.message), N("");
    }
  }, M = (_) => N((L) => (L + _).slice(0, 8));
  return W.useEffect(() => {
    const _ = (L) => {
      const A = L.composedPath()[0];
      if (!(A && /^(INPUT|TEXTAREA|SELECT)$/.test(A.tagName))) {
        if (/^[0-9]$/.test(L.key)) M(L.key);
        else if (L.key === "Backspace") N((G) => G.slice(0, -1));
        else if (L.key === "Enter")
          E.length >= 4 && T({ person: s.id, pin: E });
        else if (L.key === "Escape") w();
        else return;
        L.preventDefault();
      }
    };
    return window.addEventListener("keydown", _), () => window.removeEventListener("keydown", _);
  }, [E, s.id]), /* @__PURE__ */ c.jsxs("div", { className: "pin", role: "group", "aria-label": `PIN for ${s.name}`, children: [
    /* @__PURE__ */ c.jsxs("div", { className: "head", style: { margin: 0 }, children: [
      /* @__PURE__ */ c.jsx(Un, { p: s, size: 44 }),
      /* @__PURE__ */ c.jsxs("h2", { children: [
        "Hi, ",
        s.name
      ] }),
      /* @__PURE__ */ c.jsx("button", { className: "ghost", style: { marginLeft: "auto" }, onClick: w, children: "Back" })
    ] }),
    (u == null ? void 0 : u.face_unlock) && u.suggested === s.id && /* @__PURE__ */ c.jsx("button", { className: "primary", onClick: () => T({ person: s.id, face: !0 }), children: "It's me (camera)" }),
    /* @__PURE__ */ c.jsx("div", { className: "dots", role: "status", "aria-label": `${E.length} digit${E.length === 1 ? "" : "s"} entered`, children: Array.from({ length: Math.max(4, E.length) }, (_, L) => /* @__PURE__ */ c.jsx("span", { className: L < E.length ? "on" : "" }, L)) }),
    /* @__PURE__ */ c.jsxs("div", { className: "keys", children: [
      ["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((_) => /* @__PURE__ */ c.jsx("button", { onClick: () => M(_), children: _ }, _)),
      /* @__PURE__ */ c.jsx("button", { onClick: () => N(E.slice(0, -1)), "aria-label": "Delete", children: "⌫" }),
      /* @__PURE__ */ c.jsx("button", { onClick: () => M("0"), children: "0" }),
      /* @__PURE__ */ c.jsx("button", { className: "primary", disabled: E.length < 4, onClick: () => T({ person: s.id, pin: E }), children: "OK" })
    ] }),
    /* @__PURE__ */ c.jsx("div", { className: "err", role: "alert", children: C })
  ] });
}
function mc({ api: a }) {
  const [u, s] = W.useState(""), [w, v] = W.useState("");
  return /* @__PURE__ */ c.jsxs("form", { className: "pin", onSubmit: (E) => {
    E.preventDefault(), a.call("/api/ha/hub/pair", { code: u }).then((N) => If(a.screen, N.device_token)).catch((N) => v(N.message));
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
    /* @__PURE__ */ c.jsx("input", { value: u, onChange: (E) => s(E.target.value), inputMode: "numeric", autoComplete: "one-time-code", "aria-label": "Pairing code", placeholder: "Pairing code", style: { maxWidth: 220, textAlign: "center" } }),
    /* @__PURE__ */ c.jsx("button", { className: "primary", type: "submit", disabled: !u.trim(), children: "Pair" }),
    /* @__PURE__ */ c.jsx("div", { className: "err", role: "alert", children: w })
  ] });
}
function vc(a, u) {
  var w;
  const s = W.useRef(0);
  W.useEffect(() => {
    if (!(u != null && u.hub)) return;
    const v = () => {
      Date.now() - s.current > 15e3 && (s.current = Date.now(), a.call("/api/ha/hub/activity").catch(() => {
      }));
    };
    return window.addEventListener("pointerdown", v, !0), () => window.removeEventListener("pointerdown", v, !0);
  }, [(w = u == null ? void 0 : u.hub) == null ? void 0 : w.person.id]), W.useEffect(() => {
    u && !u.hub && u.household && a.screen && sc(a.screen) && Xo(a.screen, null);
  }, [u]);
}
function gc(a, u, s) {
  var C, y;
  const [w, v] = W.useState(0), [, E] = W.useState(0);
  W.useEffect(() => {
    v(u != null && u.hub ? Date.now() + u.hub.remaining_seconds * 1e3 : 0);
  }, [(C = u == null ? void 0 : u.hub) == null ? void 0 : C.remaining_seconds, (y = u == null ? void 0 : u.hub) == null ? void 0 : y.person.id]), W.useEffect(() => {
    if (!w) return;
    const T = setInterval(() => E((M) => M + 1), 1e3);
    return () => clearInterval(T);
  }, [w]);
  const N = w ? Math.max(0, Math.round((w - Date.now()) / 1e3)) : 1 / 0;
  return { soon: N <= 20, left: N, stay: () => a.call("/api/ha/hub/activity").then(s).catch(() => {
  }) };
}
const yc = async (a) => {
  await a.call("/api/ha/hub/signout").catch(() => {
  }), Xo(a.screen, null);
};
function Xf({ api: a }) {
  const { data: u, err: s, load: w } = Wl(a, "/api/ha/view", { cards: [] }, 1e4), [v, E] = W.useState(null), [N, C] = W.useState(null), [y, T] = W.useState("");
  vc(a, u);
  const M = gc(a, u, w);
  return a.screen ? s ? /* @__PURE__ */ c.jsx("ha-card", { children: /* @__PURE__ */ c.jsx("div", { className: "err", role: "alert", children: Lt(s) }) }) : u ? u.hub ? /* @__PURE__ */ c.jsx("ha-card", { children: /* @__PURE__ */ c.jsxs("div", { className: "head", children: [
    /* @__PURE__ */ c.jsx(Un, { p: u.hub.person, size: 44 }),
    /* @__PURE__ */ c.jsxs("div", { children: [
      /* @__PURE__ */ c.jsx("h2", { children: u.hub.person.name }),
      /* @__PURE__ */ c.jsxs("div", { className: "sub", role: "status", children: [
        "Signed in on this screen",
        M.soon ? ` · signing out in ${M.left}s` : ""
      ] })
    ] }),
    /* @__PURE__ */ c.jsxs("div", { className: "right", children: [
      M.soon && /* @__PURE__ */ c.jsx("button", { className: "primary", onClick: M.stay, children: "Stay" }),
      /* @__PURE__ */ c.jsx("button", { onClick: () => yc(a), children: "Sign out" })
    ] })
  ] }) }) : u.person ? /* @__PURE__ */ c.jsx("ha-card", { children: /* @__PURE__ */ c.jsxs("div", { className: "head", children: [
    /* @__PURE__ */ c.jsx(Un, { p: u.person, size: 44 }),
    /* @__PURE__ */ c.jsxs("div", { children: [
      /* @__PURE__ */ c.jsx("h2", { children: u.person.name }),
      /* @__PURE__ */ c.jsx("div", { className: "sub", children: "Your own Home Assistant account" })
    ] })
  ] }) }) : u.pair_needed ? /* @__PURE__ */ c.jsx("ha-card", { children: /* @__PURE__ */ c.jsx(mc, { api: a }) }) : N ? /* @__PURE__ */ c.jsx("ha-card", { children: /* @__PURE__ */ c.jsx(hc, { api: a, people: v, pick: N, onBack: () => C(null), onDone: () => {
    C(null), E(null);
  } }) }) : v ? /* @__PURE__ */ c.jsxs("ha-card", { children: [
    /* @__PURE__ */ c.jsxs("div", { className: "head", children: [
      /* @__PURE__ */ c.jsx("h2", { children: "Who's here?" }),
      /* @__PURE__ */ c.jsx("div", { className: "right", children: /* @__PURE__ */ c.jsx("button", { className: "ghost", onClick: () => E(null), children: "Cancel" }) })
    ] }),
    /* @__PURE__ */ c.jsx("div", { className: "people", children: v.people.map((_) => /* @__PURE__ */ c.jsxs("button", { className: `person ${v.suggested === _.id ? "suggested" : ""}`, onClick: () => C(_), children: [
      /* @__PURE__ */ c.jsx(Un, { p: _, size: 52 }),
      _.name
    ] }, _.id)) })
  ] }) : /* @__PURE__ */ c.jsxs("ha-card", { children: [
    /* @__PURE__ */ c.jsxs("div", { className: "head", children: [
      /* @__PURE__ */ c.jsx("ha-icon", { icon: "mdi:account-group-outline" }),
      /* @__PURE__ */ c.jsxs("div", { children: [
        /* @__PURE__ */ c.jsx("h2", { children: "Shared view" }),
        /* @__PURE__ */ c.jsx("div", { className: "sub", children: "Everyone sees the family's things. Sign in for your own." })
      ] }),
      /* @__PURE__ */ c.jsx("div", { className: "right", children: /* @__PURE__ */ c.jsx("button", { className: "primary", onClick: () => pc(a).then((_) => {
        E(_);
        const L = _.people.find((A) => A.id === _.suggested);
        L && C(L);
      }).catch((_) => T(_.message)), children: "Sign in" }) })
    ] }),
    y && /* @__PURE__ */ c.jsx("div", { className: "err", children: y })
  ] }) : /* @__PURE__ */ c.jsx("ha-card", { children: /* @__PURE__ */ c.jsx("div", { className: "empty", children: "…" }) }) : /* @__PURE__ */ c.jsx("ha-card", { children: /* @__PURE__ */ c.jsxs("div", { className: "err", children: [
    "Give this card the screen it's on: ",
    /* @__PURE__ */ c.jsx("code", { children: "screen: kitchen" })
  ] }) });
}
const Zf = [
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
  [/coinpile/, "Money"],
  [/^photos_/, "Photos"]
], Jf = (a) => {
  var u;
  return ((u = Zf.find(([s]) => s.test(a))) == null ? void 0 : u[1]) ?? a.replace(/_/g, " ");
};
let qf;
const hn = () => qf ?? (qf = new AudioContext()), bf = (a) => {
  const u = new Uint8Array(a.fftSize);
  a.getByteTimeDomainData(u);
  let s = 0;
  for (const w of u) s += ((w - 128) / 128) ** 2;
  return Math.min(1, Math.sqrt(s / u.length) * 4);
}, xc = (a) => {
  let u = "";
  for (let s = 0; s < a.length; s += 32768) u += String.fromCharCode(...a.subarray(s, s + 32768));
  return btoa(u);
};
function wc(a, u) {
  const [s, w] = W.useState([]), [v, E] = W.useState(!1), [N, C] = W.useState(null), [y, T] = W.useState(!1), [M, _] = W.useState(0), L = W.useRef(null), A = W.useRef(null), G = W.useRef(null), Y = W.useCallback(() => {
    L.current = null, a.call("/api/ha/chat/history").then((te) => {
      L.current = te.conversation_id, w(te.messages.map((le) => ({ me: le.role === "user", text: le.content })));
    }).catch(() => w([]));
  }, [a]);
  W.useEffect(() => {
    Y();
    const te = (le) => {
      var D;
      ((D = le.detail) == null ? void 0 : D.screen) === a.screen && Y();
    };
    return window.addEventListener("faith-hub-changed", te), () => window.removeEventListener("faith-hub-changed", te);
  }, [Y]);
  const [, q] = W.useState(0);
  W.useEffect(() => {
    if (!M) return;
    const te = setTimeout(() => q((le) => le + 1), 3100);
    return () => clearTimeout(te);
  }, [M]), W.useEffect(() => () => {
    var te;
    (te = G.current) == null || te.pause();
  }, []);
  const me = async (te) => {
    var le;
    try {
      const D = await a.call("/api/ha/speak", { text: te });
      (le = G.current) == null || le.pause();
      const re = new Audio(`data:${D.mime};base64,${D.audio}`), ie = hn().createAnalyser();
      ie.fftSize = 512, hn().createMediaElementSource(re).connect(ie), ie.connect(hn().destination), G.current = re, A.current = ie, T(!0);
      const pe = () => {
        G.current === re && (A.current = null, T(!1));
      };
      re.onended = pe, re.onerror = pe, await hn().resume(), await re.play();
    } catch {
      A.current = null, T(!1);
    }
  }, Ce = async (te, le) => {
    E(!0), w((D) => [...D, ...le ? [{ me: !0, text: le }] : [], { text: "…" }]);
    try {
      const D = await a.call("/api/ha/chat", { ...te, conversation_id: L.current });
      L.current = D.conversation_id, w((re) => {
        var ie;
        return [
          ...re.slice(0, -1),
          ...D.heard ? [{ me: !0, text: D.heard + (D.speaker ? ` (${D.speaker.name}${D.own_view ? ", known by voice and face: their own view" : ""})` : "") }] : [],
          ...D.confirms.map((pe) => ({ text: "", confirm: pe })),
          ...D.approvals.map((pe) => ({ text: "", waiting: pe.summary })),
          { text: D.text, tools: D.tools, photos: (ie = D.photos) != null && ie.length ? D.photos : void 0 }
        ];
      }), _(Date.now()), u && D.text && me(D.text);
    } catch (D) {
      w((re) => [...re.slice(0, -1), { text: Lt(D.message) === D.message ? `Sorry, that didn't work: ${D.message}` : Lt(D.message) }]);
    } finally {
      E(!1);
    }
  }, Le = async () => {
    var te;
    if (N) {
      N.stop(), C(null);
      return;
    }
    (te = G.current) == null || te.pause(), A.current = null, T(!1);
    try {
      const le = await navigator.mediaDevices.getUserMedia({ audio: !0 }), D = new MediaRecorder(le), re = [];
      try {
        const ie = hn().createAnalyser();
        ie.fftSize = 512, hn().createMediaStreamSource(le).connect(ie), A.current = ie, hn().resume();
      } catch {
      }
      D.ondataavailable = (ie) => ie.data.size && re.push(ie.data), D.onstop = async () => {
        le.getTracks().forEach((pe) => pe.stop()), A.current = null;
        const ie = new Blob(re, { type: D.mimeType || "audio/webm" });
        Ce({ audio: xc(new Uint8Array(await ie.arrayBuffer())), mime: ie.type.split(";")[0] }, "");
      }, D.start(), C(D);
    } catch {
      w((le) => [...le, { text: "The microphone isn't available (Home Assistant needs https for it)." }]);
    }
  }, ve = (te, le) => a.call(`/api/ha/confirm/${te}`, { approve: le }).then((D) => w((re) => re.map((ie) => {
    var pe;
    return ((pe = ie.confirm) == null ? void 0 : pe.id) === te ? { ...ie, confirm: { ...ie.confirm, done: D.text } } : ie;
  }))).catch((D) => w((re) => [...re, { text: D.message }])), ze = W.useCallback(() => A.current ? bf(A.current) : void 0, []), de = N ? "listening" : v ? "thinking" : y || !u && Date.now() - M < 3e3 ? "speaking" : "idle";
  return { lines: s, busy: v, rec: N, state: de, level: ze, send: Ce, mic: Le, answer: ve, fresh: () => {
    L.current = null, w([]);
  } };
}
function kc({ api: a, photos: u }) {
  const [s, w] = W.useState({});
  W.useEffect(() => {
    let E = !0;
    for (const N of u) a.call("/api/ha/photo", { source: N.source, id: N.id }).then((C) => E && w((y) => ({ ...y, [N.id]: C.data_url }))).catch(() => {
    });
    return () => {
      E = !1;
    };
  }, [u.map((E) => E.id).join()]);
  const v = (E) => {
    var N;
    return [E.kind === "video" ? "Video" : "Photo", E.taken && `from ${E.taken.slice(0, 10)}`, E.place && `in ${E.place}`, ((N = E.people) == null ? void 0 : N.length) && `with ${E.people.join(", ")}`].filter(Boolean).join(" ");
  };
  return /* @__PURE__ */ c.jsx("div", { className: "photos", children: u.map((E) => /* @__PURE__ */ c.jsxs("a", { href: E.link, target: "_blank", rel: "noreferrer", "aria-label": `${v(E)}. Opens in Immich.`, title: v(E), children: [
    s[E.id] ? /* @__PURE__ */ c.jsx("img", { src: s[E.id], alt: "" }) : /* @__PURE__ */ c.jsx("span", { className: "ph" }),
    E.kind === "video" && /* @__PURE__ */ c.jsx("span", { className: "vid", children: "Video" })
  ] }, E.id)) });
}
function Sc({ l: a, answer: u }) {
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
const ep = 28e6;
async function tp(a) {
  var v;
  const u = await createImageBitmap(a), s = Math.min(1, 1600 / Math.max(u.width, u.height)), w = document.createElement("canvas");
  return w.width = Math.round(u.width * s), w.height = Math.round(u.height * s), w.getContext("2d").drawImage(u, 0, 0, w.width, w.height), (v = u.close) == null || v.call(u), w.toDataURL("image/jpeg", 0.85);
}
function Ec({ c: a, placeholder: u = "Ask FAITH" }) {
  const [s, w] = W.useState(""), [v, E] = W.useState(null), [N, C] = W.useState(""), y = W.useRef(null), T = async (_) => {
    if (C(""), !!_)
      try {
        if (_.type.startsWith("video/")) {
          if (_.size > ep) {
            C("That video is too long to send. Keep it under about 20 seconds, or send a photo.");
            return;
          }
          E({ kind: "video", data: xc(new Uint8Array(await _.arrayBuffer())), mime: _.type, name: _.name });
        } else E({ kind: "photo", data: await tp(_) });
      } catch {
        C("That picture didn't open on this phone. Try taking it again, or pick another.");
      }
  }, M = () => {
    const _ = s.trim();
    if (!_ && !v || a.busy) return;
    const L = { text: _ };
    (v == null ? void 0 : v.kind) === "photo" && (L.image = v.data), (v == null ? void 0 : v.kind) === "video" && (L.video = v.data, L.video_mime = v.mime), a.send(L, v ? `${v.kind === "photo" ? "📷 Photo" : "🎞️ Video"}${_ ? `: ${_}` : ""}` : _), w(""), E(null);
  };
  return /* @__PURE__ */ c.jsxs(c.Fragment, { children: [
    (v || N) && /* @__PURE__ */ c.jsxs("div", { className: "attached", role: "status", children: [
      (v == null ? void 0 : v.kind) === "photo" && /* @__PURE__ */ c.jsx("img", { src: v.data, alt: "The photo you're sending" }),
      (v == null ? void 0 : v.kind) === "video" && /* @__PURE__ */ c.jsxs("span", { children: [
        "🎞️ ",
        v.name
      ] }),
      N && /* @__PURE__ */ c.jsx("span", { children: N }),
      v && /* @__PURE__ */ c.jsx("button", { type: "button", className: "ghost", "aria-label": "Remove the attachment", onClick: () => E(null), children: /* @__PURE__ */ c.jsx("ha-icon", { icon: "mdi:close" }) })
    ] }),
    /* @__PURE__ */ c.jsxs("form", { className: "ask", onSubmit: (_) => {
      _.preventDefault(), M();
    }, children: [
      /* @__PURE__ */ c.jsx("button", { type: "button", className: a.rec ? "rec" : "", title: a.rec ? "Stop and send" : "Talk", "aria-label": a.rec ? "Stop recording and send" : "Talk to FAITH", "aria-pressed": !!a.rec, disabled: a.busy, onClick: a.mic, children: /* @__PURE__ */ c.jsx("ha-icon", { icon: a.rec ? "mdi:stop" : "mdi:microphone" }) }),
      /* @__PURE__ */ c.jsx("button", { type: "button", title: "Photo or video", "aria-label": "Show FAITH a photo or video", disabled: a.busy || !!a.rec, onClick: () => {
        var _;
        return (_ = y.current) == null ? void 0 : _.click();
      }, children: /* @__PURE__ */ c.jsx("ha-icon", { icon: "mdi:camera" }) }),
      /* @__PURE__ */ c.jsx("input", { ref: y, type: "file", accept: "image/*,video/*", hidden: !0, "aria-hidden": "true", tabIndex: -1, onChange: (_) => {
        var L;
        T((L = _.target.files) == null ? void 0 : L[0]), _.target.value = "";
      } }),
      /* @__PURE__ */ c.jsx("input", { value: s, onChange: (_) => w(_.target.value), "aria-label": "Message to FAITH", placeholder: a.rec ? "Listening… tap stop when done" : v ? "What should FAITH look for? (optional)" : u }),
      /* @__PURE__ */ c.jsx("button", { className: "primary", type: "submit", disabled: a.busy || !s.trim() && !v, title: "Send", "aria-label": "Send", children: /* @__PURE__ */ c.jsx("ha-icon", { icon: "mdi:send" }) })
    ] })
  ] });
}
function np({ api: a, config: u }) {
  const s = wc(a, u.speak === !0), w = W.useRef(null);
  return W.useEffect(() => {
    var v;
    (v = w.current) == null || v.scrollIntoView({ block: "nearest" });
  }, [s.lines]), /* @__PURE__ */ c.jsxs("ha-card", { children: [
    /* @__PURE__ */ c.jsxs("div", { className: "head", children: [
      /* @__PURE__ */ c.jsx(dc, { className: "emblem", size: 56, tone: a.dark ? "dark" : "light", state: s.state, level: s.level }),
      /* @__PURE__ */ c.jsx("h2", { children: u.title ?? "Ask FAITH" }),
      s.lines.length > 0 && /* @__PURE__ */ c.jsx("div", { className: "right", children: /* @__PURE__ */ c.jsx("button", { className: "ghost", onClick: s.fresh, children: "New" }) })
    ] }),
    /* @__PURE__ */ c.jsxs("div", { className: "chat", role: "log", "aria-live": "polite", "aria-label": "Conversation with FAITH", children: [
      !s.lines.length && /* @__PURE__ */ c.jsx("div", { className: "empty", children: "What's on today? What's for dinner? Add milk to the list. Turn off the lights." }),
      s.lines.map((v, E) => {
        var N, C;
        return v.confirm || v.waiting ? /* @__PURE__ */ c.jsx(Sc, { l: v, answer: s.answer }, E) : /* @__PURE__ */ c.jsxs("div", { style: { display: "flex", flexDirection: "column", gap: 4, alignItems: v.me ? "flex-end" : "flex-start" }, children: [
          /* @__PURE__ */ c.jsx("div", { className: `msg ${v.me ? "me" : "faith"}`, children: v.me ? v.text : /* @__PURE__ */ c.jsx(fc, { text: v.text }) }),
          !!((N = v.photos) != null && N.length) && /* @__PURE__ */ c.jsx(kc, { api: a, photos: v.photos }),
          !!((C = v.tools) != null && C.length) && /* @__PURE__ */ c.jsx("div", { className: "chips", children: [...new Set(v.tools.map(Jf))].map((y) => /* @__PURE__ */ c.jsx("span", { className: "chip", children: y }, y)) })
        ] }, E);
      }),
      /* @__PURE__ */ c.jsx("div", { ref: w })
    ] }),
    /* @__PURE__ */ c.jsx(Ec, { c: s })
  ] });
}
const rp = (a) => a.getHours() < 5 ? "Good night" : a.getHours() < 12 ? "Good morning" : a.getHours() < 18 ? "Good afternoon" : "Good evening";
function lp({ api: a, config: u }) {
  var ze, de, ue, te, le;
  const { data: s, err: w, load: v } = Wl(a, "/api/ha/view", { cards: u.cards ?? ["today"] }, 3e4), E = wc(a, u.speak !== !1), [N, C] = W.useState(/* @__PURE__ */ new Date()), [y, T] = W.useState(null), [M, _] = W.useState(null);
  W.useEffect(() => {
    const D = setInterval(() => C(/* @__PURE__ */ new Date()), 1e3);
    return () => clearInterval(D);
  }, []), vc(a, s);
  const L = gc(a, s, v), A = !!a.screen && !!s && !s.person;
  W.useEffect(() => {
    A && (s != null && s.can_sign_in) && pc(a).then(T).catch(() => {
    });
  }, [A, s == null ? void 0 : s.can_sign_in, (ze = s == null ? void 0 : s.hub) == null ? void 0 : ze.person.id]);
  const G = ((de = s == null ? void 0 : s.hub) == null ? void 0 : de.person) ?? (s == null ? void 0 : s.person) ?? null, Y = [...E.lines].reverse().find((D) => !D.me && !D.confirm && !D.waiting), q = [...E.lines].reverse().find((D) => D.me), me = E.lines.filter((D) => D.confirm && !D.confirm.done || D.waiting).slice(-2), Ce = s == null ? void 0 : s.cards.flatMap((D) => D.kind === "schedule" ? D.items ?? [] : []).find((D) => !D.done && Wf(D.time, N)), Le = Number(u.size) || 300, ve = E.rec ? "Listening… tap FAITH to send" : E.busy ? "Thinking…" : E.state === "speaking" ? "" : "Tap FAITH to talk";
  return /* @__PURE__ */ c.jsxs("ha-card", { class: "hub", children: [
    /* @__PURE__ */ c.jsxs("div", { className: "hub-top", children: [
      /* @__PURE__ */ c.jsxs("div", { children: [
        /* @__PURE__ */ c.jsx("div", { className: "clock", children: N.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }) }),
        /* @__PURE__ */ c.jsx("div", { className: "eyebrow", children: N.toLocaleDateString([], { weekday: "long", month: "long", day: "numeric" }) })
      ] }),
      /* @__PURE__ */ c.jsxs("div", { className: "right", children: [
        !!(s != null && s.pending_approvals) && /* @__PURE__ */ c.jsxs("span", { className: "pill", children: [
          s.pending_approvals,
          " waiting for approval"
        ] }),
        (s == null ? void 0 : s.hub) && L.soon && /* @__PURE__ */ c.jsxs("span", { className: "pill", role: "status", children: [
          "Signing out ",
          s.hub.person.name,
          " in ",
          L.left,
          "s"
        ] }),
        (s == null ? void 0 : s.hub) && L.soon && /* @__PURE__ */ c.jsx("button", { className: "primary", onClick: L.stay, children: "Stay" }),
        (s == null ? void 0 : s.hub) && /* @__PURE__ */ c.jsxs("button", { onClick: () => yc(a).then(v), children: [
          "Sign out ",
          s.hub.person.name
        ] })
      ] })
    ] }),
    w && /* @__PURE__ */ c.jsx("div", { className: "err", role: "alert", children: Lt(w) }),
    /* @__PURE__ */ c.jsxs("div", { className: "hub-mid", children: [
      /* @__PURE__ */ c.jsxs("div", { className: "hello", children: [
        rp(N),
        ", ",
        /* @__PURE__ */ c.jsx("em", { children: G ? G.name : "everyone" }),
        "."
      ] }),
      (Ce || !!((ue = s == null ? void 0 : s.home) != null && ue.length)) && /* @__PURE__ */ c.jsx("div", { className: "meta", children: [Ce ? `Next: ${Pr(Ce.time)} ${Ce.title}` : "", (te = s == null ? void 0 : s.home) != null && te.length ? `Home now: ${s.home.map((D) => D.name).join(", ")}` : ""].filter(Boolean).join(" · ") }),
      /* @__PURE__ */ c.jsx("button", { className: "orb", onClick: E.mic, disabled: E.busy, "aria-label": E.rec ? "Stop and send" : "Talk to FAITH", children: /* @__PURE__ */ c.jsx(dc, { size: Le, tone: a.dark ? "dark" : "light", state: E.state, level: E.level }) }),
      ve && /* @__PURE__ */ c.jsx("div", { className: "hint", children: ve }),
      q && !E.rec && /* @__PURE__ */ c.jsxs("div", { className: "heard", children: [
        "“",
        q.text,
        "”"
      ] }),
      /* @__PURE__ */ c.jsx("div", { "aria-live": "polite", children: Y && Y.text !== "…" && /* @__PURE__ */ c.jsxs("div", { className: "reply", children: [
        /* @__PURE__ */ c.jsx(fc, { text: Y.text }),
        !!((le = Y.photos) != null && le.length) && /* @__PURE__ */ c.jsx(kc, { api: a, photos: Y.photos.slice(0, 6) })
      ] }) }),
      me.map((D, re) => /* @__PURE__ */ c.jsx(Sc, { l: D, answer: E.answer }, re))
    ] }),
    u.show_input !== !1 && /* @__PURE__ */ c.jsx(Ec, { c: E, placeholder: "Or type to FAITH" }),
    A && (s == null ? void 0 : s.pair_needed) && /* @__PURE__ */ c.jsx("div", { className: "faces", children: /* @__PURE__ */ c.jsx(mc, { api: a }) }),
    A && y && !(s != null && s.hub) && /* @__PURE__ */ c.jsx("div", { className: "faces", children: y.people.map((D) => /* @__PURE__ */ c.jsxs("button", { className: `face ${y.suggested === D.id ? "on" : ""}`, onClick: () => _(D), children: [
      /* @__PURE__ */ c.jsx(Un, { p: D, size: 56, ring: y.suggested === D.id }),
      D.name
    ] }, D.id)) }),
    M && /* @__PURE__ */ c.jsx("div", { className: "overlay", children: /* @__PURE__ */ c.jsx(hc, { api: a, people: y, pick: M, onBack: () => _(null), onDone: () => {
      _(null), v();
    } }) })
  ] });
}
const lc = (a) => {
  try {
    return new Intl.NumberFormat([], { style: "currency", currency: a.currency || "USD" }).format(a.amount);
  } catch {
    return `${a.amount.toFixed(2)} ${a.currency}`;
  }
};
function ip({ api: a, config: u }) {
  const { data: s, err: w, load: v } = Wl(a, "/api/ha/rewards"), [E, N] = W.useState(""), C = (T, M, _) => a.call(T, { args: M }).then((L) => {
    N(L.approval ? `${_} A grown-up will approve it.` : _), v();
  }).catch((L) => N(L.message));
  if (w) return /* @__PURE__ */ c.jsx("ha-card", { children: /* @__PURE__ */ c.jsx("div", { className: "err", role: "alert", children: Lt(w) }) });
  if (!s) return /* @__PURE__ */ c.jsx("ha-card", { children: /* @__PURE__ */ c.jsx("div", { className: "empty", children: "Loading…" }) });
  const y = (T) => `${T} pt${T === 1 ? "" : "s"}`;
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
            /* @__PURE__ */ c.jsx("b", { children: lc(s.me.card) })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ c.jsxs("div", { className: "section", children: [
        /* @__PURE__ */ c.jsx("h3", { children: "Jobs" }),
        !s.activities.some((T) => T.kids_can_claim) && /* @__PURE__ */ c.jsx("div", { className: "empty", children: "No jobs to claim yet. A grown-up adds them in FAITH's admin page." }),
        /* @__PURE__ */ c.jsx("ul", { children: s.activities.filter((T) => T.kids_can_claim).map((T) => /* @__PURE__ */ c.jsxs("li", { className: "row", children: [
          /* @__PURE__ */ c.jsx("span", { className: "grow", children: T.name }),
          /* @__PURE__ */ c.jsxs("span", { className: "pill", children: [
            "+",
            y(T.points)
          ] }),
          /* @__PURE__ */ c.jsx("button", { onClick: () => C("/api/ha/rewards/claim", { activity: T.id }, `Asked for ${y(T.points)} for "${T.name}".`), children: "I did it" })
        ] }, T.id)) })
      ] }),
      /* @__PURE__ */ c.jsxs("div", { className: "section", children: [
        /* @__PURE__ */ c.jsx("h3", { children: "Rewards" }),
        !s.rewards.length && /* @__PURE__ */ c.jsx("div", { className: "empty", children: "No rewards yet. A grown-up adds them in FAITH's admin page." }),
        /* @__PURE__ */ c.jsx("ul", { children: s.rewards.map((T) => /* @__PURE__ */ c.jsxs("li", { className: "row", children: [
          /* @__PURE__ */ c.jsxs("span", { className: "grow", children: [
            T.name,
            T.kind === "money" && T.amount && s.me.card && !/card/i.test(T.name) ? /* @__PURE__ */ c.jsx("span", { className: "meta", children: " · onto your card" }) : null
          ] }),
          /* @__PURE__ */ c.jsx("span", { className: "pill", children: y(T.cost) }),
          /* @__PURE__ */ c.jsx("button", { className: "primary", disabled: s.me.points < T.cost, onClick: () => C("/api/ha/rewards/redeem", { reward: T.id }, `Asked for "${T.name}".`), children: "Get it" })
        ] }, T.id)) })
      ] })
    ] }) : /* @__PURE__ */ c.jsxs(c.Fragment, { children: [
      !s.kids.length && /* @__PURE__ */ c.jsx("div", { className: "empty", children: "No children in FAITH's family list yet." }),
      /* @__PURE__ */ c.jsx("ul", { children: s.kids.map((T) => /* @__PURE__ */ c.jsxs("li", { className: "row", children: [
        /* @__PURE__ */ c.jsx(Un, { p: T, size: 34 }),
        /* @__PURE__ */ c.jsxs("span", { className: "grow", children: [
          T.name,
          T.card && /* @__PURE__ */ c.jsxs("span", { className: "meta", children: [
            " · card ",
            lc(T.card)
          ] })
        ] }),
        /* @__PURE__ */ c.jsx("span", { className: "pill", children: y(T.points) }),
        s.can_give && /* @__PURE__ */ c.jsx("div", { className: "btns", children: s.allowed_points.map((M) => /* @__PURE__ */ c.jsxs("button", { "aria-label": `Give ${T.name} ${y(M)}`, onClick: () => C("/api/ha/rewards/award", { person: T.id, points: M, reason: "Well done (from the dashboard)" }, `Gave ${T.name} ${y(M)}.`), children: [
          "+",
          M
        ] }, M)) })
      ] }, T.id)) }),
      !s.can_give && s.kids.length > 0 && /* @__PURE__ */ c.jsx("div", { className: "meta", children: "Sign in to give points." })
    ] }),
    /* @__PURE__ */ c.jsx("div", { className: "toast", role: "status", children: E })
  ] });
}
function Tr(a, u, s, w, v) {
  if (customElements.get(a)) return;
  class E extends HTMLElement {
    constructor() {
      super(...arguments);
      Ue(this, "_hass");
      Ue(this, "_config");
      Ue(this, "_root");
      Ue(this, "_api");
    }
    setConfig(y) {
      this._config = { ...y }, this._api = void 0, this.render();
    }
    set hass(y) {
      const T = !this._hass;
      this._hass = y, T && this.render();
    }
    getCardSize() {
      return v;
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
          const y = this.shadowRoot ?? this.attachShadow({ mode: "open" }), T = document.createElement("style");
          T.textContent = Rf, y.appendChild(T);
          const M = document.createElement("div");
          y.appendChild(M), this._root = Mf.createRoot(M);
        }
        this._api ?? (this._api = Df(() => this._hass, this._config)), this._root.render(/* @__PURE__ */ c.jsx(w, { api: this._api, config: this._config }));
      }
    }
  }
  customElements.define(a, E), (window.customCards ?? (window.customCards = [])).push({ type: a, name: u, description: s, preview: !1 });
}
let ic = !1;
function Qo() {
  if (!ic) {
    ic = !0, Tr("faith-card", "FAITH", "The family's day from FAITH: today, meals, shopping, chores, the house and approvals, for whoever is looking.", Yf, 6), Tr("faith-who-card", "FAITH: who's here", "For a shared tablet: shows who is signed in, and lets a person sign in with their PIN.", Xf, 2), Tr("faith-chat-card", "FAITH: chat", "Talk or type to FAITH.", np, 6), Tr("faith-hub-card", "FAITH: hub", "The wall screen: FAITH in the middle (tap to talk, answers out loud), the time, and who's here.", lp, 9), Tr("faith-rewards-card", "FAITH: points & rewards", "Children's points, jobs to claim and rewards; parents give points.", ip, 4);
    for (const a of [0, 500, 2e3, 6e3]) setTimeout(op, a);
  }
}
const oc = () => !!customElements.get("home-assistant");
if (oc()) Qo();
else {
  const a = setInterval(() => {
    oc() && (clearInterval(a), Qo());
  }, 50);
  setTimeout(() => {
    clearInterval(a), Qo();
  }, 2e4);
}
function op() {
  const a = [], u = (s) => s.querySelectorAll("*").forEach((w) => {
    var v;
    if (w.tagName === "HUI-ERROR-CARD") {
      const E = w._config ?? w.config ?? {};
      /faith-[a-z-]*card/.test(`${((v = E.origConfig) == null ? void 0 : v.type) ?? ""} ${E.message ?? ""} ${E.error ?? ""}`) && a.push(w);
    }
    w.shadowRoot && u(w.shadowRoot);
  });
  u(document);
  for (const s of a) s.dispatchEvent(new CustomEvent("ll-rebuild", { bubbles: !0, composed: !0 }));
  return a.length;
}
