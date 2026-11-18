var Of = Object.defineProperty;
var Uf = (v, E, c) => E in v ? Of(v, E, { enumerable: !0, configurable: !0, writable: !0, value: c }) : v[E] = c;
var yr = (v, E, c) => Uf(v, typeof E != "symbol" ? E + "" : E, c);
var zo = { exports: {} }, wr = {}, Po = { exports: {} }, X = {};
/**
 * @license React
 * react.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var La;
function Af() {
  if (La) return X;
  La = 1;
  var v = Symbol.for("react.element"), E = Symbol.for("react.portal"), c = Symbol.for("react.fragment"), H = Symbol.for("react.strict_mode"), Q = Symbol.for("react.profiler"), F = Symbol.for("react.provider"), O = Symbol.for("react.context"), A = Symbol.for("react.forward_ref"), S = Symbol.for("react.suspense"), _ = Symbol.for("react.memo"), V = Symbol.for("react.lazy"), Y = Symbol.iterator;
  function B(d) {
    return d === null || typeof d != "object" ? null : (d = Y && d[Y] || d["@@iterator"], typeof d == "function" ? d : null);
  }
  var ve = { isMounted: function() {
    return !1;
  }, enqueueForceUpdate: function() {
  }, enqueueReplaceState: function() {
  }, enqueueSetState: function() {
  } }, Ce = Object.assign, te = {};
  function j(d, y, K) {
    this.props = d, this.context = y, this.refs = te, this.updater = K || ve;
  }
  j.prototype.isReactComponent = {}, j.prototype.setState = function(d, y) {
    if (typeof d != "object" && typeof d != "function" && d != null) throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");
    this.updater.enqueueSetState(this, d, y, "setState");
  }, j.prototype.forceUpdate = function(d) {
    this.updater.enqueueForceUpdate(this, d, "forceUpdate");
  };
  function Z() {
  }
  Z.prototype = j.prototype;
  function R(d, y, K) {
    this.props = d, this.context = y, this.refs = te, this.updater = K || ve;
  }
  var W = R.prototype = new Z();
  W.constructor = R, Ce(W, j.prototype), W.isPureReactComponent = !0;
  var ne = Array.isArray, ze = Object.prototype.hasOwnProperty, De = { current: null }, Fe = { key: !0, ref: !0, __self: !0, __source: !0 };
  function Ze(d, y, K) {
    var G, q = {}, b = null, ie = null;
    if (y != null) for (G in y.ref !== void 0 && (ie = y.ref), y.key !== void 0 && (b = "" + y.key), y) ze.call(y, G) && !Fe.hasOwnProperty(G) && (q[G] = y[G]);
    var re = arguments.length - 2;
    if (re === 1) q.children = K;
    else if (1 < re) {
      for (var ae = Array(re), Qe = 0; Qe < re; Qe++) ae[Qe] = arguments[Qe + 2];
      q.children = ae;
    }
    if (d && d.defaultProps) for (G in re = d.defaultProps, re) q[G] === void 0 && (q[G] = re[G]);
    return { $$typeof: v, type: d, key: b, ref: ie, props: q, _owner: De.current };
  }
  function jt(d, y) {
    return { $$typeof: v, type: d.type, key: y, ref: d.ref, props: d.props, _owner: d._owner };
  }
  function yt(d) {
    return typeof d == "object" && d !== null && d.$$typeof === v;
  }
  function Yt(d) {
    var y = { "=": "=0", ":": "=2" };
    return "$" + d.replace(/[=:]/g, function(K) {
      return y[K];
    });
  }
  var ft = /\/+/g;
  function We(d, y) {
    return typeof d == "object" && d !== null && d.key != null ? Yt("" + d.key) : y.toString(36);
  }
  function rt(d, y, K, G, q) {
    var b = typeof d;
    (b === "undefined" || b === "boolean") && (d = null);
    var ie = !1;
    if (d === null) ie = !0;
    else switch (b) {
      case "string":
      case "number":
        ie = !0;
        break;
      case "object":
        switch (d.$$typeof) {
          case v:
          case E:
            ie = !0;
        }
    }
    if (ie) return ie = d, q = q(ie), d = G === "" ? "." + We(ie, 0) : G, ne(q) ? (K = "", d != null && (K = d.replace(ft, "$&/") + "/"), rt(q, y, K, "", function(Qe) {
      return Qe;
    })) : q != null && (yt(q) && (q = jt(q, K + (!q.key || ie && ie.key === q.key ? "" : ("" + q.key).replace(ft, "$&/") + "/") + d)), y.push(q)), 1;
    if (ie = 0, G = G === "" ? "." : G + ":", ne(d)) for (var re = 0; re < d.length; re++) {
      b = d[re];
      var ae = G + We(b, re);
      ie += rt(b, y, K, ae, q);
    }
    else if (ae = B(d), typeof ae == "function") for (d = ae.call(d), re = 0; !(b = d.next()).done; ) b = b.value, ae = G + We(b, re++), ie += rt(b, y, K, ae, q);
    else if (b === "object") throw y = String(d), Error("Objects are not valid as a React child (found: " + (y === "[object Object]" ? "object with keys {" + Object.keys(d).join(", ") + "}" : y) + "). If you meant to render a collection of children, use an array instead.");
    return ie;
  }
  function dt(d, y, K) {
    if (d == null) return d;
    var G = [], q = 0;
    return rt(d, G, "", "", function(b) {
      return y.call(K, b, q++);
    }), G;
  }
  function Oe(d) {
    if (d._status === -1) {
      var y = d._result;
      y = y(), y.then(function(K) {
        (d._status === 0 || d._status === -1) && (d._status = 1, d._result = K);
      }, function(K) {
        (d._status === 0 || d._status === -1) && (d._status = 2, d._result = K);
      }), d._status === -1 && (d._status = 0, d._result = y);
    }
    if (d._status === 1) return d._result.default;
    throw d._result;
  }
  var pe = { current: null }, C = { transition: null }, U = { ReactCurrentDispatcher: pe, ReactCurrentBatchConfig: C, ReactCurrentOwner: De };
  function P() {
    throw Error("act(...) is not supported in production builds of React.");
  }
  return X.Children = { map: dt, forEach: function(d, y, K) {
    dt(d, function() {
      y.apply(this, arguments);
    }, K);
  }, count: function(d) {
    var y = 0;
    return dt(d, function() {
      y++;
    }), y;
  }, toArray: function(d) {
    return dt(d, function(y) {
      return y;
    }) || [];
  }, only: function(d) {
    if (!yt(d)) throw Error("React.Children.only expected to receive a single React element child.");
    return d;
  } }, X.Component = j, X.Fragment = c, X.Profiler = Q, X.PureComponent = R, X.StrictMode = H, X.Suspense = S, X.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = U, X.act = P, X.cloneElement = function(d, y, K) {
    if (d == null) throw Error("React.cloneElement(...): The argument must be a React element, but you passed " + d + ".");
    var G = Ce({}, d.props), q = d.key, b = d.ref, ie = d._owner;
    if (y != null) {
      if (y.ref !== void 0 && (b = y.ref, ie = De.current), y.key !== void 0 && (q = "" + y.key), d.type && d.type.defaultProps) var re = d.type.defaultProps;
      for (ae in y) ze.call(y, ae) && !Fe.hasOwnProperty(ae) && (G[ae] = y[ae] === void 0 && re !== void 0 ? re[ae] : y[ae]);
    }
    var ae = arguments.length - 2;
    if (ae === 1) G.children = K;
    else if (1 < ae) {
      re = Array(ae);
      for (var Qe = 0; Qe < ae; Qe++) re[Qe] = arguments[Qe + 2];
      G.children = re;
    }
    return { $$typeof: v, type: d.type, key: q, ref: b, props: G, _owner: ie };
  }, X.createContext = function(d) {
    return d = { $$typeof: O, _currentValue: d, _currentValue2: d, _threadCount: 0, Provider: null, Consumer: null, _defaultValue: null, _globalName: null }, d.Provider = { $$typeof: F, _context: d }, d.Consumer = d;
  }, X.createElement = Ze, X.createFactory = function(d) {
    var y = Ze.bind(null, d);
    return y.type = d, y;
  }, X.createRef = function() {
    return { current: null };
  }, X.forwardRef = function(d) {
    return { $$typeof: A, render: d };
  }, X.isValidElement = yt, X.lazy = function(d) {
    return { $$typeof: V, _payload: { _status: -1, _result: d }, _init: Oe };
  }, X.memo = function(d, y) {
    return { $$typeof: _, type: d, compare: y === void 0 ? null : y };
  }, X.startTransition = function(d) {
    var y = C.transition;
    C.transition = {};
    try {
      d();
    } finally {
      C.transition = y;
    }
  }, X.unstable_act = P, X.useCallback = function(d, y) {
    return pe.current.useCallback(d, y);
  }, X.useContext = function(d) {
    return pe.current.useContext(d);
  }, X.useDebugValue = function() {
  }, X.useDeferredValue = function(d) {
    return pe.current.useDeferredValue(d);
  }, X.useEffect = function(d, y) {
    return pe.current.useEffect(d, y);
  }, X.useId = function() {
    return pe.current.useId();
  }, X.useImperativeHandle = function(d, y, K) {
    return pe.current.useImperativeHandle(d, y, K);
  }, X.useInsertionEffect = function(d, y) {
    return pe.current.useInsertionEffect(d, y);
  }, X.useLayoutEffect = function(d, y) {
    return pe.current.useLayoutEffect(d, y);
  }, X.useMemo = function(d, y) {
    return pe.current.useMemo(d, y);
  }, X.useReducer = function(d, y, K) {
    return pe.current.useReducer(d, y, K);
  }, X.useRef = function(d) {
    return pe.current.useRef(d);
  }, X.useState = function(d) {
    return pe.current.useState(d);
  }, X.useSyncExternalStore = function(d, y, K) {
    return pe.current.useSyncExternalStore(d, y, K);
  }, X.useTransition = function() {
    return pe.current.useTransition();
  }, X.version = "18.3.1", X;
}
var Ra;
function Mo() {
  return Ra || (Ra = 1, Po.exports = Af()), Po.exports;
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
var Da;
function $f() {
  if (Da) return wr;
  Da = 1;
  var v = Mo(), E = Symbol.for("react.element"), c = Symbol.for("react.fragment"), H = Object.prototype.hasOwnProperty, Q = v.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner, F = { key: !0, ref: !0, __self: !0, __source: !0 };
  function O(A, S, _) {
    var V, Y = {}, B = null, ve = null;
    _ !== void 0 && (B = "" + _), S.key !== void 0 && (B = "" + S.key), S.ref !== void 0 && (ve = S.ref);
    for (V in S) H.call(S, V) && !F.hasOwnProperty(V) && (Y[V] = S[V]);
    if (A && A.defaultProps) for (V in S = A.defaultProps, S) Y[V] === void 0 && (Y[V] = S[V]);
    return { $$typeof: E, type: A, key: B, ref: ve, props: Y, _owner: Q.current };
  }
  return wr.Fragment = c, wr.jsx = O, wr.jsxs = O, wr;
}
var Ia;
function Hf() {
  return Ia || (Ia = 1, zo.exports = $f()), zo.exports;
}
var f = Hf(), me = Mo(), Ll = {}, To = { exports: {} }, Be = {}, Lo = { exports: {} }, Ro = {};
/**
 * @license React
 * scheduler.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var Ma;
function Vf() {
  return Ma || (Ma = 1, (function(v) {
    function E(C, U) {
      var P = C.length;
      C.push(U);
      e: for (; 0 < P; ) {
        var d = P - 1 >>> 1, y = C[d];
        if (0 < Q(y, U)) C[d] = U, C[P] = y, P = d;
        else break e;
      }
    }
    function c(C) {
      return C.length === 0 ? null : C[0];
    }
    function H(C) {
      if (C.length === 0) return null;
      var U = C[0], P = C.pop();
      if (P !== U) {
        C[0] = P;
        e: for (var d = 0, y = C.length, K = y >>> 1; d < K; ) {
          var G = 2 * (d + 1) - 1, q = C[G], b = G + 1, ie = C[b];
          if (0 > Q(q, P)) b < y && 0 > Q(ie, q) ? (C[d] = ie, C[b] = P, d = b) : (C[d] = q, C[G] = P, d = G);
          else if (b < y && 0 > Q(ie, P)) C[d] = ie, C[b] = P, d = b;
          else break e;
        }
      }
      return U;
    }
    function Q(C, U) {
      var P = C.sortIndex - U.sortIndex;
      return P !== 0 ? P : C.id - U.id;
    }
    if (typeof performance == "object" && typeof performance.now == "function") {
      var F = performance;
      v.unstable_now = function() {
        return F.now();
      };
    } else {
      var O = Date, A = O.now();
      v.unstable_now = function() {
        return O.now() - A;
      };
    }
    var S = [], _ = [], V = 1, Y = null, B = 3, ve = !1, Ce = !1, te = !1, j = typeof setTimeout == "function" ? setTimeout : null, Z = typeof clearTimeout == "function" ? clearTimeout : null, R = typeof setImmediate < "u" ? setImmediate : null;
    typeof navigator < "u" && navigator.scheduling !== void 0 && navigator.scheduling.isInputPending !== void 0 && navigator.scheduling.isInputPending.bind(navigator.scheduling);
    function W(C) {
      for (var U = c(_); U !== null; ) {
        if (U.callback === null) H(_);
        else if (U.startTime <= C) H(_), U.sortIndex = U.expirationTime, E(S, U);
        else break;
        U = c(_);
      }
    }
    function ne(C) {
      if (te = !1, W(C), !Ce) if (c(S) !== null) Ce = !0, Oe(ze);
      else {
        var U = c(_);
        U !== null && pe(ne, U.startTime - C);
      }
    }
    function ze(C, U) {
      Ce = !1, te && (te = !1, Z(Ze), Ze = -1), ve = !0;
      var P = B;
      try {
        for (W(U), Y = c(S); Y !== null && (!(Y.expirationTime > U) || C && !Yt()); ) {
          var d = Y.callback;
          if (typeof d == "function") {
            Y.callback = null, B = Y.priorityLevel;
            var y = d(Y.expirationTime <= U);
            U = v.unstable_now(), typeof y == "function" ? Y.callback = y : Y === c(S) && H(S), W(U);
          } else H(S);
          Y = c(S);
        }
        if (Y !== null) var K = !0;
        else {
          var G = c(_);
          G !== null && pe(ne, G.startTime - U), K = !1;
        }
        return K;
      } finally {
        Y = null, B = P, ve = !1;
      }
    }
    var De = !1, Fe = null, Ze = -1, jt = 5, yt = -1;
    function Yt() {
      return !(v.unstable_now() - yt < jt);
    }
    function ft() {
      if (Fe !== null) {
        var C = v.unstable_now();
        yt = C;
        var U = !0;
        try {
          U = Fe(!0, C);
        } finally {
          U ? We() : (De = !1, Fe = null);
        }
      } else De = !1;
    }
    var We;
    if (typeof R == "function") We = function() {
      R(ft);
    };
    else if (typeof MessageChannel < "u") {
      var rt = new MessageChannel(), dt = rt.port2;
      rt.port1.onmessage = ft, We = function() {
        dt.postMessage(null);
      };
    } else We = function() {
      j(ft, 0);
    };
    function Oe(C) {
      Fe = C, De || (De = !0, We());
    }
    function pe(C, U) {
      Ze = j(function() {
        C(v.unstable_now());
      }, U);
    }
    v.unstable_IdlePriority = 5, v.unstable_ImmediatePriority = 1, v.unstable_LowPriority = 4, v.unstable_NormalPriority = 3, v.unstable_Profiling = null, v.unstable_UserBlockingPriority = 2, v.unstable_cancelCallback = function(C) {
      C.callback = null;
    }, v.unstable_continueExecution = function() {
      Ce || ve || (Ce = !0, Oe(ze));
    }, v.unstable_forceFrameRate = function(C) {
      0 > C || 125 < C ? console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported") : jt = 0 < C ? Math.floor(1e3 / C) : 5;
    }, v.unstable_getCurrentPriorityLevel = function() {
      return B;
    }, v.unstable_getFirstCallbackNode = function() {
      return c(S);
    }, v.unstable_next = function(C) {
      switch (B) {
        case 1:
        case 2:
        case 3:
          var U = 3;
          break;
        default:
          U = B;
      }
      var P = B;
      B = U;
      try {
        return C();
      } finally {
        B = P;
      }
    }, v.unstable_pauseExecution = function() {
    }, v.unstable_requestPaint = function() {
    }, v.unstable_runWithPriority = function(C, U) {
      switch (C) {
        case 1:
        case 2:
        case 3:
        case 4:
        case 5:
          break;
        default:
          C = 3;
      }
      var P = B;
      B = C;
      try {
        return U();
      } finally {
        B = P;
      }
    }, v.unstable_scheduleCallback = function(C, U, P) {
      var d = v.unstable_now();
      switch (typeof P == "object" && P !== null ? (P = P.delay, P = typeof P == "number" && 0 < P ? d + P : d) : P = d, C) {
        case 1:
          var y = -1;
          break;
        case 2:
          y = 250;
          break;
        case 5:
          y = 1073741823;
          break;
        case 4:
          y = 1e4;
          break;
        default:
          y = 5e3;
      }
      return y = P + y, C = { id: V++, callback: U, priorityLevel: C, startTime: P, expirationTime: y, sortIndex: -1 }, P > d ? (C.sortIndex = P, E(_, C), c(S) === null && C === c(_) && (te ? (Z(Ze), Ze = -1) : te = !0, pe(ne, P - d))) : (C.sortIndex = y, E(S, C), Ce || ve || (Ce = !0, Oe(ze))), C;
    }, v.unstable_shouldYield = Yt, v.unstable_wrapCallback = function(C) {
      var U = B;
      return function() {
        var P = B;
        B = U;
        try {
          return C.apply(this, arguments);
        } finally {
          B = P;
        }
      };
    };
  })(Ro)), Ro;
}
var Fa;
function Bf() {
  return Fa || (Fa = 1, Lo.exports = Vf()), Lo.exports;
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
var Oa;
function Wf() {
  if (Oa) return Be;
  Oa = 1;
  var v = Mo(), E = Bf();
  function c(e) {
    for (var t = "https://reactjs.org/docs/error-decoder.html?invariant=" + e, n = 1; n < arguments.length; n++) t += "&args[]=" + encodeURIComponent(arguments[n]);
    return "Minified React error #" + e + "; visit " + t + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
  }
  var H = /* @__PURE__ */ new Set(), Q = {};
  function F(e, t) {
    O(e, t), O(e + "Capture", t);
  }
  function O(e, t) {
    for (Q[e] = t, e = 0; e < t.length; e++) H.add(t[e]);
  }
  var A = !(typeof window > "u" || typeof window.document > "u" || typeof window.document.createElement > "u"), S = Object.prototype.hasOwnProperty, _ = /^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/, V = {}, Y = {};
  function B(e) {
    return S.call(Y, e) ? !0 : S.call(V, e) ? !1 : _.test(e) ? Y[e] = !0 : (V[e] = !0, !1);
  }
  function ve(e, t, n, r) {
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
  function Ce(e, t, n, r) {
    if (t === null || typeof t > "u" || ve(e, t, n, r)) return !0;
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
  function te(e, t, n, r, l, i, o) {
    this.acceptsBooleans = t === 2 || t === 3 || t === 4, this.attributeName = r, this.attributeNamespace = l, this.mustUseProperty = n, this.propertyName = e, this.type = t, this.sanitizeURL = i, this.removeEmptyString = o;
  }
  var j = {};
  "children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style".split(" ").forEach(function(e) {
    j[e] = new te(e, 0, !1, e, null, !1, !1);
  }), [["acceptCharset", "accept-charset"], ["className", "class"], ["htmlFor", "for"], ["httpEquiv", "http-equiv"]].forEach(function(e) {
    var t = e[0];
    j[t] = new te(t, 1, !1, e[1], null, !1, !1);
  }), ["contentEditable", "draggable", "spellCheck", "value"].forEach(function(e) {
    j[e] = new te(e, 2, !1, e.toLowerCase(), null, !1, !1);
  }), ["autoReverse", "externalResourcesRequired", "focusable", "preserveAlpha"].forEach(function(e) {
    j[e] = new te(e, 2, !1, e, null, !1, !1);
  }), "allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope".split(" ").forEach(function(e) {
    j[e] = new te(e, 3, !1, e.toLowerCase(), null, !1, !1);
  }), ["checked", "multiple", "muted", "selected"].forEach(function(e) {
    j[e] = new te(e, 3, !0, e, null, !1, !1);
  }), ["capture", "download"].forEach(function(e) {
    j[e] = new te(e, 4, !1, e, null, !1, !1);
  }), ["cols", "rows", "size", "span"].forEach(function(e) {
    j[e] = new te(e, 6, !1, e, null, !1, !1);
  }), ["rowSpan", "start"].forEach(function(e) {
    j[e] = new te(e, 5, !1, e.toLowerCase(), null, !1, !1);
  });
  var Z = /[\-:]([a-z])/g;
  function R(e) {
    return e[1].toUpperCase();
  }
  "accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height".split(" ").forEach(function(e) {
    var t = e.replace(
      Z,
      R
    );
    j[t] = new te(t, 1, !1, e, null, !1, !1);
  }), "xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type".split(" ").forEach(function(e) {
    var t = e.replace(Z, R);
    j[t] = new te(t, 1, !1, e, "http://www.w3.org/1999/xlink", !1, !1);
  }), ["xml:base", "xml:lang", "xml:space"].forEach(function(e) {
    var t = e.replace(Z, R);
    j[t] = new te(t, 1, !1, e, "http://www.w3.org/XML/1998/namespace", !1, !1);
  }), ["tabIndex", "crossOrigin"].forEach(function(e) {
    j[e] = new te(e, 1, !1, e.toLowerCase(), null, !1, !1);
  }), j.xlinkHref = new te("xlinkHref", 1, !1, "xlink:href", "http://www.w3.org/1999/xlink", !0, !1), ["src", "href", "action", "formAction"].forEach(function(e) {
    j[e] = new te(e, 1, !1, e.toLowerCase(), null, !0, !0);
  });
  function W(e, t, n, r) {
    var l = j.hasOwnProperty(t) ? j[t] : null;
    (l !== null ? l.type !== 0 : r || !(2 < t.length) || t[0] !== "o" && t[0] !== "O" || t[1] !== "n" && t[1] !== "N") && (Ce(t, n, l, r) && (n = null), r || l === null ? B(t) && (n === null ? e.removeAttribute(t) : e.setAttribute(t, "" + n)) : l.mustUseProperty ? e[l.propertyName] = n === null ? l.type === 3 ? !1 : "" : n : (t = l.attributeName, r = l.attributeNamespace, n === null ? e.removeAttribute(t) : (l = l.type, n = l === 3 || l === 4 && n === !0 ? "" : "" + n, r ? e.setAttributeNS(r, t, n) : e.setAttribute(t, n))));
  }
  var ne = v.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED, ze = Symbol.for("react.element"), De = Symbol.for("react.portal"), Fe = Symbol.for("react.fragment"), Ze = Symbol.for("react.strict_mode"), jt = Symbol.for("react.profiler"), yt = Symbol.for("react.provider"), Yt = Symbol.for("react.context"), ft = Symbol.for("react.forward_ref"), We = Symbol.for("react.suspense"), rt = Symbol.for("react.suspense_list"), dt = Symbol.for("react.memo"), Oe = Symbol.for("react.lazy"), pe = Symbol.for("react.offscreen"), C = Symbol.iterator;
  function U(e) {
    return e === null || typeof e != "object" ? null : (e = C && e[C] || e["@@iterator"], typeof e == "function" ? e : null);
  }
  var P = Object.assign, d;
  function y(e) {
    if (d === void 0) try {
      throw Error();
    } catch (n) {
      var t = n.stack.trim().match(/\n( *(at )?)/);
      d = t && t[1] || "";
    }
    return `
` + d + e;
  }
  var K = !1;
  function G(e, t) {
    if (!e || K) return "";
    K = !0;
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
        } catch (m) {
          var r = m;
        }
        Reflect.construct(e, [], t);
      } else {
        try {
          t.call();
        } catch (m) {
          r = m;
        }
        e.call(t.prototype);
      }
      else {
        try {
          throw Error();
        } catch (m) {
          r = m;
        }
        e();
      }
    } catch (m) {
      if (m && r && typeof m.stack == "string") {
        for (var l = m.stack.split(`
`), i = r.stack.split(`
`), o = l.length - 1, u = i.length - 1; 1 <= o && 0 <= u && l[o] !== i[u]; ) u--;
        for (; 1 <= o && 0 <= u; o--, u--) if (l[o] !== i[u]) {
          if (o !== 1 || u !== 1)
            do
              if (o--, u--, 0 > u || l[o] !== i[u]) {
                var s = `
` + l[o].replace(" at new ", " at ");
                return e.displayName && s.includes("<anonymous>") && (s = s.replace("<anonymous>", e.displayName)), s;
              }
            while (1 <= o && 0 <= u);
          break;
        }
      }
    } finally {
      K = !1, Error.prepareStackTrace = n;
    }
    return (e = e ? e.displayName || e.name : "") ? y(e) : "";
  }
  function q(e) {
    switch (e.tag) {
      case 5:
        return y(e.type);
      case 16:
        return y("Lazy");
      case 13:
        return y("Suspense");
      case 19:
        return y("SuspenseList");
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
      case Fe:
        return "Fragment";
      case De:
        return "Portal";
      case jt:
        return "Profiler";
      case Ze:
        return "StrictMode";
      case We:
        return "Suspense";
      case rt:
        return "SuspenseList";
    }
    if (typeof e == "object") switch (e.$$typeof) {
      case Yt:
        return (e.displayName || "Context") + ".Consumer";
      case yt:
        return (e._context.displayName || "Context") + ".Provider";
      case ft:
        var t = e.render;
        return e = e.displayName, e || (e = t.displayName || t.name || "", e = e !== "" ? "ForwardRef(" + e + ")" : "ForwardRef"), e;
      case dt:
        return t = e.displayName || null, t !== null ? t : b(e.type) || "Memo";
      case Oe:
        t = e._payload, e = e._init;
        try {
          return b(e(t));
        } catch {
        }
    }
    return null;
  }
  function ie(e) {
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
        return t === Ze ? "StrictMode" : "Mode";
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
  function re(e) {
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
  function ae(e) {
    var t = e.type;
    return (e = e.nodeName) && e.toLowerCase() === "input" && (t === "checkbox" || t === "radio");
  }
  function Qe(e) {
    var t = ae(e) ? "checked" : "value", n = Object.getOwnPropertyDescriptor(e.constructor.prototype, t), r = "" + e[t];
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
  function kr(e) {
    e._valueTracker || (e._valueTracker = Qe(e));
  }
  function Oo(e) {
    if (!e) return !1;
    var t = e._valueTracker;
    if (!t) return !0;
    var n = t.getValue(), r = "";
    return e && (r = ae(e) ? e.checked ? "true" : "false" : e.value), e = r, e !== n ? (t.setValue(e), !0) : !1;
  }
  function Sr(e) {
    if (e = e || (typeof document < "u" ? document : void 0), typeof e > "u") return null;
    try {
      return e.activeElement || e.body;
    } catch {
      return e.body;
    }
  }
  function Il(e, t) {
    var n = t.checked;
    return P({}, t, { defaultChecked: void 0, defaultValue: void 0, value: void 0, checked: n ?? e._wrapperState.initialChecked });
  }
  function Uo(e, t) {
    var n = t.defaultValue == null ? "" : t.defaultValue, r = t.checked != null ? t.checked : t.defaultChecked;
    n = re(t.value != null ? t.value : n), e._wrapperState = { initialChecked: r, initialValue: n, controlled: t.type === "checkbox" || t.type === "radio" ? t.checked != null : t.value != null };
  }
  function Ao(e, t) {
    t = t.checked, t != null && W(e, "checked", t, !1);
  }
  function Ml(e, t) {
    Ao(e, t);
    var n = re(t.value), r = t.type;
    if (n != null) r === "number" ? (n === 0 && e.value === "" || e.value != n) && (e.value = "" + n) : e.value !== "" + n && (e.value = "" + n);
    else if (r === "submit" || r === "reset") {
      e.removeAttribute("value");
      return;
    }
    t.hasOwnProperty("value") ? Fl(e, t.type, n) : t.hasOwnProperty("defaultValue") && Fl(e, t.type, re(t.defaultValue)), t.checked == null && t.defaultChecked != null && (e.defaultChecked = !!t.defaultChecked);
  }
  function $o(e, t, n) {
    if (t.hasOwnProperty("value") || t.hasOwnProperty("defaultValue")) {
      var r = t.type;
      if (!(r !== "submit" && r !== "reset" || t.value !== void 0 && t.value !== null)) return;
      t = "" + e._wrapperState.initialValue, n || t === e.value || (e.value = t), e.defaultValue = t;
    }
    n = e.name, n !== "" && (e.name = ""), e.defaultChecked = !!e._wrapperState.initialChecked, n !== "" && (e.name = n);
  }
  function Fl(e, t, n) {
    (t !== "number" || Sr(e.ownerDocument) !== e) && (n == null ? e.defaultValue = "" + e._wrapperState.initialValue : e.defaultValue !== "" + n && (e.defaultValue = "" + n));
  }
  var Dn = Array.isArray;
  function sn(e, t, n, r) {
    if (e = e.options, t) {
      t = {};
      for (var l = 0; l < n.length; l++) t["$" + n[l]] = !0;
      for (n = 0; n < e.length; n++) l = t.hasOwnProperty("$" + e[n].value), e[n].selected !== l && (e[n].selected = l), l && r && (e[n].defaultSelected = !0);
    } else {
      for (n = "" + re(n), t = null, l = 0; l < e.length; l++) {
        if (e[l].value === n) {
          e[l].selected = !0, r && (e[l].defaultSelected = !0);
          return;
        }
        t !== null || e[l].disabled || (t = e[l]);
      }
      t !== null && (t.selected = !0);
    }
  }
  function Ol(e, t) {
    if (t.dangerouslySetInnerHTML != null) throw Error(c(91));
    return P({}, t, { value: void 0, defaultValue: void 0, children: "" + e._wrapperState.initialValue });
  }
  function Ho(e, t) {
    var n = t.value;
    if (n == null) {
      if (n = t.children, t = t.defaultValue, n != null) {
        if (t != null) throw Error(c(92));
        if (Dn(n)) {
          if (1 < n.length) throw Error(c(93));
          n = n[0];
        }
        t = n;
      }
      t == null && (t = ""), n = t;
    }
    e._wrapperState = { initialValue: re(n) };
  }
  function Vo(e, t) {
    var n = re(t.value), r = re(t.defaultValue);
    n != null && (n = "" + n, n !== e.value && (e.value = n), t.defaultValue == null && e.defaultValue !== n && (e.defaultValue = n)), r != null && (e.defaultValue = "" + r);
  }
  function Bo(e) {
    var t = e.textContent;
    t === e._wrapperState.initialValue && t !== "" && t !== null && (e.value = t);
  }
  function Wo(e) {
    switch (e) {
      case "svg":
        return "http://www.w3.org/2000/svg";
      case "math":
        return "http://www.w3.org/1998/Math/MathML";
      default:
        return "http://www.w3.org/1999/xhtml";
    }
  }
  function Ul(e, t) {
    return e == null || e === "http://www.w3.org/1999/xhtml" ? Wo(t) : e === "http://www.w3.org/2000/svg" && t === "foreignObject" ? "http://www.w3.org/1999/xhtml" : e;
  }
  var Er, Qo = (function(e) {
    return typeof MSApp < "u" && MSApp.execUnsafeLocalFunction ? function(t, n, r, l) {
      MSApp.execUnsafeLocalFunction(function() {
        return e(t, n, r, l);
      });
    } : e;
  })(function(e, t) {
    if (e.namespaceURI !== "http://www.w3.org/2000/svg" || "innerHTML" in e) e.innerHTML = t;
    else {
      for (Er = Er || document.createElement("div"), Er.innerHTML = "<svg>" + t.valueOf().toString() + "</svg>", t = Er.firstChild; e.firstChild; ) e.removeChild(e.firstChild);
      for (; t.firstChild; ) e.appendChild(t.firstChild);
    }
  });
  function In(e, t) {
    if (t) {
      var n = e.firstChild;
      if (n && n === e.lastChild && n.nodeType === 3) {
        n.nodeValue = t;
        return;
      }
    }
    e.textContent = t;
  }
  var Mn = {
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
  }, $a = ["Webkit", "ms", "Moz", "O"];
  Object.keys(Mn).forEach(function(e) {
    $a.forEach(function(t) {
      t = t + e.charAt(0).toUpperCase() + e.substring(1), Mn[t] = Mn[e];
    });
  });
  function Ko(e, t, n) {
    return t == null || typeof t == "boolean" || t === "" ? "" : n || typeof t != "number" || t === 0 || Mn.hasOwnProperty(e) && Mn[e] ? ("" + t).trim() : t + "px";
  }
  function Yo(e, t) {
    e = e.style;
    for (var n in t) if (t.hasOwnProperty(n)) {
      var r = n.indexOf("--") === 0, l = Ko(n, t[n], r);
      n === "float" && (n = "cssFloat"), r ? e.setProperty(n, l) : e[n] = l;
    }
  }
  var Ha = P({ menuitem: !0 }, { area: !0, base: !0, br: !0, col: !0, embed: !0, hr: !0, img: !0, input: !0, keygen: !0, link: !0, meta: !0, param: !0, source: !0, track: !0, wbr: !0 });
  function Al(e, t) {
    if (t) {
      if (Ha[e] && (t.children != null || t.dangerouslySetInnerHTML != null)) throw Error(c(137, e));
      if (t.dangerouslySetInnerHTML != null) {
        if (t.children != null) throw Error(c(60));
        if (typeof t.dangerouslySetInnerHTML != "object" || !("__html" in t.dangerouslySetInnerHTML)) throw Error(c(61));
      }
      if (t.style != null && typeof t.style != "object") throw Error(c(62));
    }
  }
  function $l(e, t) {
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
  var Hl = null;
  function Vl(e) {
    return e = e.target || e.srcElement || window, e.correspondingUseElement && (e = e.correspondingUseElement), e.nodeType === 3 ? e.parentNode : e;
  }
  var Bl = null, an = null, cn = null;
  function Xo(e) {
    if (e = rr(e)) {
      if (typeof Bl != "function") throw Error(c(280));
      var t = e.stateNode;
      t && (t = Kr(t), Bl(e.stateNode, e.type, t));
    }
  }
  function Go(e) {
    an ? cn ? cn.push(e) : cn = [e] : an = e;
  }
  function Zo() {
    if (an) {
      var e = an, t = cn;
      if (cn = an = null, Xo(e), t) for (e = 0; e < t.length; e++) Xo(t[e]);
    }
  }
  function Jo(e, t) {
    return e(t);
  }
  function qo() {
  }
  var Wl = !1;
  function bo(e, t, n) {
    if (Wl) return e(t, n);
    Wl = !0;
    try {
      return Jo(e, t, n);
    } finally {
      Wl = !1, (an !== null || cn !== null) && (qo(), Zo());
    }
  }
  function Fn(e, t) {
    var n = e.stateNode;
    if (n === null) return null;
    var r = Kr(n);
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
    if (n && typeof n != "function") throw Error(c(231, t, typeof n));
    return n;
  }
  var Ql = !1;
  if (A) try {
    var On = {};
    Object.defineProperty(On, "passive", { get: function() {
      Ql = !0;
    } }), window.addEventListener("test", On, On), window.removeEventListener("test", On, On);
  } catch {
    Ql = !1;
  }
  function Va(e, t, n, r, l, i, o, u, s) {
    var m = Array.prototype.slice.call(arguments, 3);
    try {
      t.apply(n, m);
    } catch (w) {
      this.onError(w);
    }
  }
  var Un = !1, _r = null, Cr = !1, Kl = null, Ba = { onError: function(e) {
    Un = !0, _r = e;
  } };
  function Wa(e, t, n, r, l, i, o, u, s) {
    Un = !1, _r = null, Va.apply(Ba, arguments);
  }
  function Qa(e, t, n, r, l, i, o, u, s) {
    if (Wa.apply(this, arguments), Un) {
      if (Un) {
        var m = _r;
        Un = !1, _r = null;
      } else throw Error(c(198));
      Cr || (Cr = !0, Kl = m);
    }
  }
  function Xt(e) {
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
  function eu(e) {
    if (e.tag === 13) {
      var t = e.memoizedState;
      if (t === null && (e = e.alternate, e !== null && (t = e.memoizedState)), t !== null) return t.dehydrated;
    }
    return null;
  }
  function tu(e) {
    if (Xt(e) !== e) throw Error(c(188));
  }
  function Ka(e) {
    var t = e.alternate;
    if (!t) {
      if (t = Xt(e), t === null) throw Error(c(188));
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
          if (i === n) return tu(l), e;
          if (i === r) return tu(l), t;
          i = i.sibling;
        }
        throw Error(c(188));
      }
      if (n.return !== r.return) n = l, r = i;
      else {
        for (var o = !1, u = l.child; u; ) {
          if (u === n) {
            o = !0, n = l, r = i;
            break;
          }
          if (u === r) {
            o = !0, r = l, n = i;
            break;
          }
          u = u.sibling;
        }
        if (!o) {
          for (u = i.child; u; ) {
            if (u === n) {
              o = !0, n = i, r = l;
              break;
            }
            if (u === r) {
              o = !0, r = i, n = l;
              break;
            }
            u = u.sibling;
          }
          if (!o) throw Error(c(189));
        }
      }
      if (n.alternate !== r) throw Error(c(190));
    }
    if (n.tag !== 3) throw Error(c(188));
    return n.stateNode.current === n ? e : t;
  }
  function nu(e) {
    return e = Ka(e), e !== null ? ru(e) : null;
  }
  function ru(e) {
    if (e.tag === 5 || e.tag === 6) return e;
    for (e = e.child; e !== null; ) {
      var t = ru(e);
      if (t !== null) return t;
      e = e.sibling;
    }
    return null;
  }
  var lu = E.unstable_scheduleCallback, iu = E.unstable_cancelCallback, Ya = E.unstable_shouldYield, Xa = E.unstable_requestPaint, ge = E.unstable_now, Ga = E.unstable_getCurrentPriorityLevel, Yl = E.unstable_ImmediatePriority, ou = E.unstable_UserBlockingPriority, Nr = E.unstable_NormalPriority, Za = E.unstable_LowPriority, uu = E.unstable_IdlePriority, jr = null, pt = null;
  function Ja(e) {
    if (pt && typeof pt.onCommitFiberRoot == "function") try {
      pt.onCommitFiberRoot(jr, e, void 0, (e.current.flags & 128) === 128);
    } catch {
    }
  }
  var lt = Math.clz32 ? Math.clz32 : ec, qa = Math.log, ba = Math.LN2;
  function ec(e) {
    return e >>>= 0, e === 0 ? 32 : 31 - (qa(e) / ba | 0) | 0;
  }
  var zr = 64, Pr = 4194304;
  function An(e) {
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
  function Tr(e, t) {
    var n = e.pendingLanes;
    if (n === 0) return 0;
    var r = 0, l = e.suspendedLanes, i = e.pingedLanes, o = n & 268435455;
    if (o !== 0) {
      var u = o & ~l;
      u !== 0 ? r = An(u) : (i &= o, i !== 0 && (r = An(i)));
    } else o = n & ~l, o !== 0 ? r = An(o) : i !== 0 && (r = An(i));
    if (r === 0) return 0;
    if (t !== 0 && t !== r && (t & l) === 0 && (l = r & -r, i = t & -t, l >= i || l === 16 && (i & 4194240) !== 0)) return t;
    if ((r & 4) !== 0 && (r |= n & 16), t = e.entangledLanes, t !== 0) for (e = e.entanglements, t &= r; 0 < t; ) n = 31 - lt(t), l = 1 << n, r |= e[n], t &= ~l;
    return r;
  }
  function tc(e, t) {
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
  function nc(e, t) {
    for (var n = e.suspendedLanes, r = e.pingedLanes, l = e.expirationTimes, i = e.pendingLanes; 0 < i; ) {
      var o = 31 - lt(i), u = 1 << o, s = l[o];
      s === -1 ? ((u & n) === 0 || (u & r) !== 0) && (l[o] = tc(u, t)) : s <= t && (e.expiredLanes |= u), i &= ~u;
    }
  }
  function Xl(e) {
    return e = e.pendingLanes & -1073741825, e !== 0 ? e : e & 1073741824 ? 1073741824 : 0;
  }
  function su() {
    var e = zr;
    return zr <<= 1, (zr & 4194240) === 0 && (zr = 64), e;
  }
  function Gl(e) {
    for (var t = [], n = 0; 31 > n; n++) t.push(e);
    return t;
  }
  function $n(e, t, n) {
    e.pendingLanes |= t, t !== 536870912 && (e.suspendedLanes = 0, e.pingedLanes = 0), e = e.eventTimes, t = 31 - lt(t), e[t] = n;
  }
  function rc(e, t) {
    var n = e.pendingLanes & ~t;
    e.pendingLanes = t, e.suspendedLanes = 0, e.pingedLanes = 0, e.expiredLanes &= t, e.mutableReadLanes &= t, e.entangledLanes &= t, t = e.entanglements;
    var r = e.eventTimes;
    for (e = e.expirationTimes; 0 < n; ) {
      var l = 31 - lt(n), i = 1 << l;
      t[l] = 0, r[l] = -1, e[l] = -1, n &= ~i;
    }
  }
  function Zl(e, t) {
    var n = e.entangledLanes |= t;
    for (e = e.entanglements; n; ) {
      var r = 31 - lt(n), l = 1 << r;
      l & t | e[r] & t && (e[r] |= t), n &= ~l;
    }
  }
  var le = 0;
  function au(e) {
    return e &= -e, 1 < e ? 4 < e ? (e & 268435455) !== 0 ? 16 : 536870912 : 4 : 1;
  }
  var cu, Jl, fu, du, pu, ql = !1, Lr = [], zt = null, Pt = null, Tt = null, Hn = /* @__PURE__ */ new Map(), Vn = /* @__PURE__ */ new Map(), Lt = [], lc = "mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset submit".split(" ");
  function hu(e, t) {
    switch (e) {
      case "focusin":
      case "focusout":
        zt = null;
        break;
      case "dragenter":
      case "dragleave":
        Pt = null;
        break;
      case "mouseover":
      case "mouseout":
        Tt = null;
        break;
      case "pointerover":
      case "pointerout":
        Hn.delete(t.pointerId);
        break;
      case "gotpointercapture":
      case "lostpointercapture":
        Vn.delete(t.pointerId);
    }
  }
  function Bn(e, t, n, r, l, i) {
    return e === null || e.nativeEvent !== i ? (e = { blockedOn: t, domEventName: n, eventSystemFlags: r, nativeEvent: i, targetContainers: [l] }, t !== null && (t = rr(t), t !== null && Jl(t)), e) : (e.eventSystemFlags |= r, t = e.targetContainers, l !== null && t.indexOf(l) === -1 && t.push(l), e);
  }
  function ic(e, t, n, r, l) {
    switch (t) {
      case "focusin":
        return zt = Bn(zt, e, t, n, r, l), !0;
      case "dragenter":
        return Pt = Bn(Pt, e, t, n, r, l), !0;
      case "mouseover":
        return Tt = Bn(Tt, e, t, n, r, l), !0;
      case "pointerover":
        var i = l.pointerId;
        return Hn.set(i, Bn(Hn.get(i) || null, e, t, n, r, l)), !0;
      case "gotpointercapture":
        return i = l.pointerId, Vn.set(i, Bn(Vn.get(i) || null, e, t, n, r, l)), !0;
    }
    return !1;
  }
  function mu(e) {
    var t = Gt(e.target);
    if (t !== null) {
      var n = Xt(t);
      if (n !== null) {
        if (t = n.tag, t === 13) {
          if (t = eu(n), t !== null) {
            e.blockedOn = t, pu(e.priority, function() {
              fu(n);
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
  function Rr(e) {
    if (e.blockedOn !== null) return !1;
    for (var t = e.targetContainers; 0 < t.length; ) {
      var n = ei(e.domEventName, e.eventSystemFlags, t[0], e.nativeEvent);
      if (n === null) {
        n = e.nativeEvent;
        var r = new n.constructor(n.type, n);
        Hl = r, n.target.dispatchEvent(r), Hl = null;
      } else return t = rr(n), t !== null && Jl(t), e.blockedOn = n, !1;
      t.shift();
    }
    return !0;
  }
  function vu(e, t, n) {
    Rr(e) && n.delete(t);
  }
  function oc() {
    ql = !1, zt !== null && Rr(zt) && (zt = null), Pt !== null && Rr(Pt) && (Pt = null), Tt !== null && Rr(Tt) && (Tt = null), Hn.forEach(vu), Vn.forEach(vu);
  }
  function Wn(e, t) {
    e.blockedOn === t && (e.blockedOn = null, ql || (ql = !0, E.unstable_scheduleCallback(E.unstable_NormalPriority, oc)));
  }
  function Qn(e) {
    function t(l) {
      return Wn(l, e);
    }
    if (0 < Lr.length) {
      Wn(Lr[0], e);
      for (var n = 1; n < Lr.length; n++) {
        var r = Lr[n];
        r.blockedOn === e && (r.blockedOn = null);
      }
    }
    for (zt !== null && Wn(zt, e), Pt !== null && Wn(Pt, e), Tt !== null && Wn(Tt, e), Hn.forEach(t), Vn.forEach(t), n = 0; n < Lt.length; n++) r = Lt[n], r.blockedOn === e && (r.blockedOn = null);
    for (; 0 < Lt.length && (n = Lt[0], n.blockedOn === null); ) mu(n), n.blockedOn === null && Lt.shift();
  }
  var fn = ne.ReactCurrentBatchConfig, Dr = !0;
  function uc(e, t, n, r) {
    var l = le, i = fn.transition;
    fn.transition = null;
    try {
      le = 1, bl(e, t, n, r);
    } finally {
      le = l, fn.transition = i;
    }
  }
  function sc(e, t, n, r) {
    var l = le, i = fn.transition;
    fn.transition = null;
    try {
      le = 4, bl(e, t, n, r);
    } finally {
      le = l, fn.transition = i;
    }
  }
  function bl(e, t, n, r) {
    if (Dr) {
      var l = ei(e, t, n, r);
      if (l === null) gi(e, t, r, Ir, n), hu(e, r);
      else if (ic(l, e, t, n, r)) r.stopPropagation();
      else if (hu(e, r), t & 4 && -1 < lc.indexOf(e)) {
        for (; l !== null; ) {
          var i = rr(l);
          if (i !== null && cu(i), i = ei(e, t, n, r), i === null && gi(e, t, r, Ir, n), i === l) break;
          l = i;
        }
        l !== null && r.stopPropagation();
      } else gi(e, t, r, null, n);
    }
  }
  var Ir = null;
  function ei(e, t, n, r) {
    if (Ir = null, e = Vl(r), e = Gt(e), e !== null) if (t = Xt(e), t === null) e = null;
    else if (n = t.tag, n === 13) {
      if (e = eu(t), e !== null) return e;
      e = null;
    } else if (n === 3) {
      if (t.stateNode.current.memoizedState.isDehydrated) return t.tag === 3 ? t.stateNode.containerInfo : null;
      e = null;
    } else t !== e && (e = null);
    return Ir = e, null;
  }
  function gu(e) {
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
        switch (Ga()) {
          case Yl:
            return 1;
          case ou:
            return 4;
          case Nr:
          case Za:
            return 16;
          case uu:
            return 536870912;
          default:
            return 16;
        }
      default:
        return 16;
    }
  }
  var Rt = null, ti = null, Mr = null;
  function yu() {
    if (Mr) return Mr;
    var e, t = ti, n = t.length, r, l = "value" in Rt ? Rt.value : Rt.textContent, i = l.length;
    for (e = 0; e < n && t[e] === l[e]; e++) ;
    var o = n - e;
    for (r = 1; r <= o && t[n - r] === l[i - r]; r++) ;
    return Mr = l.slice(e, 1 < r ? 1 - r : void 0);
  }
  function Fr(e) {
    var t = e.keyCode;
    return "charCode" in e ? (e = e.charCode, e === 0 && t === 13 && (e = 13)) : e = t, e === 10 && (e = 13), 32 <= e || e === 13 ? e : 0;
  }
  function Or() {
    return !0;
  }
  function wu() {
    return !1;
  }
  function Ke(e) {
    function t(n, r, l, i, o) {
      this._reactName = n, this._targetInst = l, this.type = r, this.nativeEvent = i, this.target = o, this.currentTarget = null;
      for (var u in e) e.hasOwnProperty(u) && (n = e[u], this[u] = n ? n(i) : i[u]);
      return this.isDefaultPrevented = (i.defaultPrevented != null ? i.defaultPrevented : i.returnValue === !1) ? Or : wu, this.isPropagationStopped = wu, this;
    }
    return P(t.prototype, { preventDefault: function() {
      this.defaultPrevented = !0;
      var n = this.nativeEvent;
      n && (n.preventDefault ? n.preventDefault() : typeof n.returnValue != "unknown" && (n.returnValue = !1), this.isDefaultPrevented = Or);
    }, stopPropagation: function() {
      var n = this.nativeEvent;
      n && (n.stopPropagation ? n.stopPropagation() : typeof n.cancelBubble != "unknown" && (n.cancelBubble = !0), this.isPropagationStopped = Or);
    }, persist: function() {
    }, isPersistent: Or }), t;
  }
  var dn = { eventPhase: 0, bubbles: 0, cancelable: 0, timeStamp: function(e) {
    return e.timeStamp || Date.now();
  }, defaultPrevented: 0, isTrusted: 0 }, ni = Ke(dn), Kn = P({}, dn, { view: 0, detail: 0 }), ac = Ke(Kn), ri, li, Yn, Ur = P({}, Kn, { screenX: 0, screenY: 0, clientX: 0, clientY: 0, pageX: 0, pageY: 0, ctrlKey: 0, shiftKey: 0, altKey: 0, metaKey: 0, getModifierState: oi, button: 0, buttons: 0, relatedTarget: function(e) {
    return e.relatedTarget === void 0 ? e.fromElement === e.srcElement ? e.toElement : e.fromElement : e.relatedTarget;
  }, movementX: function(e) {
    return "movementX" in e ? e.movementX : (e !== Yn && (Yn && e.type === "mousemove" ? (ri = e.screenX - Yn.screenX, li = e.screenY - Yn.screenY) : li = ri = 0, Yn = e), ri);
  }, movementY: function(e) {
    return "movementY" in e ? e.movementY : li;
  } }), xu = Ke(Ur), cc = P({}, Ur, { dataTransfer: 0 }), fc = Ke(cc), dc = P({}, Kn, { relatedTarget: 0 }), ii = Ke(dc), pc = P({}, dn, { animationName: 0, elapsedTime: 0, pseudoElement: 0 }), hc = Ke(pc), mc = P({}, dn, { clipboardData: function(e) {
    return "clipboardData" in e ? e.clipboardData : window.clipboardData;
  } }), vc = Ke(mc), gc = P({}, dn, { data: 0 }), ku = Ke(gc), yc = {
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
  }, wc = {
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
  }, xc = { Alt: "altKey", Control: "ctrlKey", Meta: "metaKey", Shift: "shiftKey" };
  function kc(e) {
    var t = this.nativeEvent;
    return t.getModifierState ? t.getModifierState(e) : (e = xc[e]) ? !!t[e] : !1;
  }
  function oi() {
    return kc;
  }
  var Sc = P({}, Kn, { key: function(e) {
    if (e.key) {
      var t = yc[e.key] || e.key;
      if (t !== "Unidentified") return t;
    }
    return e.type === "keypress" ? (e = Fr(e), e === 13 ? "Enter" : String.fromCharCode(e)) : e.type === "keydown" || e.type === "keyup" ? wc[e.keyCode] || "Unidentified" : "";
  }, code: 0, location: 0, ctrlKey: 0, shiftKey: 0, altKey: 0, metaKey: 0, repeat: 0, locale: 0, getModifierState: oi, charCode: function(e) {
    return e.type === "keypress" ? Fr(e) : 0;
  }, keyCode: function(e) {
    return e.type === "keydown" || e.type === "keyup" ? e.keyCode : 0;
  }, which: function(e) {
    return e.type === "keypress" ? Fr(e) : e.type === "keydown" || e.type === "keyup" ? e.keyCode : 0;
  } }), Ec = Ke(Sc), _c = P({}, Ur, { pointerId: 0, width: 0, height: 0, pressure: 0, tangentialPressure: 0, tiltX: 0, tiltY: 0, twist: 0, pointerType: 0, isPrimary: 0 }), Su = Ke(_c), Cc = P({}, Kn, { touches: 0, targetTouches: 0, changedTouches: 0, altKey: 0, metaKey: 0, ctrlKey: 0, shiftKey: 0, getModifierState: oi }), Nc = Ke(Cc), jc = P({}, dn, { propertyName: 0, elapsedTime: 0, pseudoElement: 0 }), zc = Ke(jc), Pc = P({}, Ur, {
    deltaX: function(e) {
      return "deltaX" in e ? e.deltaX : "wheelDeltaX" in e ? -e.wheelDeltaX : 0;
    },
    deltaY: function(e) {
      return "deltaY" in e ? e.deltaY : "wheelDeltaY" in e ? -e.wheelDeltaY : "wheelDelta" in e ? -e.wheelDelta : 0;
    },
    deltaZ: 0,
    deltaMode: 0
  }), Tc = Ke(Pc), Lc = [9, 13, 27, 32], ui = A && "CompositionEvent" in window, Xn = null;
  A && "documentMode" in document && (Xn = document.documentMode);
  var Rc = A && "TextEvent" in window && !Xn, Eu = A && (!ui || Xn && 8 < Xn && 11 >= Xn), _u = " ", Cu = !1;
  function Nu(e, t) {
    switch (e) {
      case "keyup":
        return Lc.indexOf(t.keyCode) !== -1;
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
  function ju(e) {
    return e = e.detail, typeof e == "object" && "data" in e ? e.data : null;
  }
  var pn = !1;
  function Dc(e, t) {
    switch (e) {
      case "compositionend":
        return ju(t);
      case "keypress":
        return t.which !== 32 ? null : (Cu = !0, _u);
      case "textInput":
        return e = t.data, e === _u && Cu ? null : e;
      default:
        return null;
    }
  }
  function Ic(e, t) {
    if (pn) return e === "compositionend" || !ui && Nu(e, t) ? (e = yu(), Mr = ti = Rt = null, pn = !1, e) : null;
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
        return Eu && t.locale !== "ko" ? null : t.data;
      default:
        return null;
    }
  }
  var Mc = { color: !0, date: !0, datetime: !0, "datetime-local": !0, email: !0, month: !0, number: !0, password: !0, range: !0, search: !0, tel: !0, text: !0, time: !0, url: !0, week: !0 };
  function zu(e) {
    var t = e && e.nodeName && e.nodeName.toLowerCase();
    return t === "input" ? !!Mc[e.type] : t === "textarea";
  }
  function Pu(e, t, n, r) {
    Go(r), t = Br(t, "onChange"), 0 < t.length && (n = new ni("onChange", "change", null, n, r), e.push({ event: n, listeners: t }));
  }
  var Gn = null, Zn = null;
  function Fc(e) {
    Yu(e, 0);
  }
  function Ar(e) {
    var t = yn(e);
    if (Oo(t)) return e;
  }
  function Oc(e, t) {
    if (e === "change") return t;
  }
  var Tu = !1;
  if (A) {
    var si;
    if (A) {
      var ai = "oninput" in document;
      if (!ai) {
        var Lu = document.createElement("div");
        Lu.setAttribute("oninput", "return;"), ai = typeof Lu.oninput == "function";
      }
      si = ai;
    } else si = !1;
    Tu = si && (!document.documentMode || 9 < document.documentMode);
  }
  function Ru() {
    Gn && (Gn.detachEvent("onpropertychange", Du), Zn = Gn = null);
  }
  function Du(e) {
    if (e.propertyName === "value" && Ar(Zn)) {
      var t = [];
      Pu(t, Zn, e, Vl(e)), bo(Fc, t);
    }
  }
  function Uc(e, t, n) {
    e === "focusin" ? (Ru(), Gn = t, Zn = n, Gn.attachEvent("onpropertychange", Du)) : e === "focusout" && Ru();
  }
  function Ac(e) {
    if (e === "selectionchange" || e === "keyup" || e === "keydown") return Ar(Zn);
  }
  function $c(e, t) {
    if (e === "click") return Ar(t);
  }
  function Hc(e, t) {
    if (e === "input" || e === "change") return Ar(t);
  }
  function Vc(e, t) {
    return e === t && (e !== 0 || 1 / e === 1 / t) || e !== e && t !== t;
  }
  var it = typeof Object.is == "function" ? Object.is : Vc;
  function Jn(e, t) {
    if (it(e, t)) return !0;
    if (typeof e != "object" || e === null || typeof t != "object" || t === null) return !1;
    var n = Object.keys(e), r = Object.keys(t);
    if (n.length !== r.length) return !1;
    for (r = 0; r < n.length; r++) {
      var l = n[r];
      if (!S.call(t, l) || !it(e[l], t[l])) return !1;
    }
    return !0;
  }
  function Iu(e) {
    for (; e && e.firstChild; ) e = e.firstChild;
    return e;
  }
  function Mu(e, t) {
    var n = Iu(e);
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
      n = Iu(n);
    }
  }
  function Fu(e, t) {
    return e && t ? e === t ? !0 : e && e.nodeType === 3 ? !1 : t && t.nodeType === 3 ? Fu(e, t.parentNode) : "contains" in e ? e.contains(t) : e.compareDocumentPosition ? !!(e.compareDocumentPosition(t) & 16) : !1 : !1;
  }
  function Ou() {
    for (var e = window, t = Sr(); t instanceof e.HTMLIFrameElement; ) {
      try {
        var n = typeof t.contentWindow.location.href == "string";
      } catch {
        n = !1;
      }
      if (n) e = t.contentWindow;
      else break;
      t = Sr(e.document);
    }
    return t;
  }
  function ci(e) {
    var t = e && e.nodeName && e.nodeName.toLowerCase();
    return t && (t === "input" && (e.type === "text" || e.type === "search" || e.type === "tel" || e.type === "url" || e.type === "password") || t === "textarea" || e.contentEditable === "true");
  }
  function Bc(e) {
    var t = Ou(), n = e.focusedElem, r = e.selectionRange;
    if (t !== n && n && n.ownerDocument && Fu(n.ownerDocument.documentElement, n)) {
      if (r !== null && ci(n)) {
        if (t = r.start, e = r.end, e === void 0 && (e = t), "selectionStart" in n) n.selectionStart = t, n.selectionEnd = Math.min(e, n.value.length);
        else if (e = (t = n.ownerDocument || document) && t.defaultView || window, e.getSelection) {
          e = e.getSelection();
          var l = n.textContent.length, i = Math.min(r.start, l);
          r = r.end === void 0 ? i : Math.min(r.end, l), !e.extend && i > r && (l = r, r = i, i = l), l = Mu(n, i);
          var o = Mu(
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
  var Wc = A && "documentMode" in document && 11 >= document.documentMode, hn = null, fi = null, qn = null, di = !1;
  function Uu(e, t, n) {
    var r = n.window === n ? n.document : n.nodeType === 9 ? n : n.ownerDocument;
    di || hn == null || hn !== Sr(r) || (r = hn, "selectionStart" in r && ci(r) ? r = { start: r.selectionStart, end: r.selectionEnd } : (r = (r.ownerDocument && r.ownerDocument.defaultView || window).getSelection(), r = { anchorNode: r.anchorNode, anchorOffset: r.anchorOffset, focusNode: r.focusNode, focusOffset: r.focusOffset }), qn && Jn(qn, r) || (qn = r, r = Br(fi, "onSelect"), 0 < r.length && (t = new ni("onSelect", "select", null, t, n), e.push({ event: t, listeners: r }), t.target = hn)));
  }
  function $r(e, t) {
    var n = {};
    return n[e.toLowerCase()] = t.toLowerCase(), n["Webkit" + e] = "webkit" + t, n["Moz" + e] = "moz" + t, n;
  }
  var mn = { animationend: $r("Animation", "AnimationEnd"), animationiteration: $r("Animation", "AnimationIteration"), animationstart: $r("Animation", "AnimationStart"), transitionend: $r("Transition", "TransitionEnd") }, pi = {}, Au = {};
  A && (Au = document.createElement("div").style, "AnimationEvent" in window || (delete mn.animationend.animation, delete mn.animationiteration.animation, delete mn.animationstart.animation), "TransitionEvent" in window || delete mn.transitionend.transition);
  function Hr(e) {
    if (pi[e]) return pi[e];
    if (!mn[e]) return e;
    var t = mn[e], n;
    for (n in t) if (t.hasOwnProperty(n) && n in Au) return pi[e] = t[n];
    return e;
  }
  var $u = Hr("animationend"), Hu = Hr("animationiteration"), Vu = Hr("animationstart"), Bu = Hr("transitionend"), Wu = /* @__PURE__ */ new Map(), Qu = "abort auxClick cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");
  function Dt(e, t) {
    Wu.set(e, t), F(t, [e]);
  }
  for (var hi = 0; hi < Qu.length; hi++) {
    var mi = Qu[hi], Qc = mi.toLowerCase(), Kc = mi[0].toUpperCase() + mi.slice(1);
    Dt(Qc, "on" + Kc);
  }
  Dt($u, "onAnimationEnd"), Dt(Hu, "onAnimationIteration"), Dt(Vu, "onAnimationStart"), Dt("dblclick", "onDoubleClick"), Dt("focusin", "onFocus"), Dt("focusout", "onBlur"), Dt(Bu, "onTransitionEnd"), O("onMouseEnter", ["mouseout", "mouseover"]), O("onMouseLeave", ["mouseout", "mouseover"]), O("onPointerEnter", ["pointerout", "pointerover"]), O("onPointerLeave", ["pointerout", "pointerover"]), F("onChange", "change click focusin focusout input keydown keyup selectionchange".split(" ")), F("onSelect", "focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" ")), F("onBeforeInput", ["compositionend", "keypress", "textInput", "paste"]), F("onCompositionEnd", "compositionend focusout keydown keypress keyup mousedown".split(" ")), F("onCompositionStart", "compositionstart focusout keydown keypress keyup mousedown".split(" ")), F("onCompositionUpdate", "compositionupdate focusout keydown keypress keyup mousedown".split(" "));
  var bn = "abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "), Yc = new Set("cancel close invalid load scroll toggle".split(" ").concat(bn));
  function Ku(e, t, n) {
    var r = e.type || "unknown-event";
    e.currentTarget = n, Qa(r, t, void 0, e), e.currentTarget = null;
  }
  function Yu(e, t) {
    t = (t & 4) !== 0;
    for (var n = 0; n < e.length; n++) {
      var r = e[n], l = r.event;
      r = r.listeners;
      e: {
        var i = void 0;
        if (t) for (var o = r.length - 1; 0 <= o; o--) {
          var u = r[o], s = u.instance, m = u.currentTarget;
          if (u = u.listener, s !== i && l.isPropagationStopped()) break e;
          Ku(l, u, m), i = s;
        }
        else for (o = 0; o < r.length; o++) {
          if (u = r[o], s = u.instance, m = u.currentTarget, u = u.listener, s !== i && l.isPropagationStopped()) break e;
          Ku(l, u, m), i = s;
        }
      }
    }
    if (Cr) throw e = Kl, Cr = !1, Kl = null, e;
  }
  function ue(e, t) {
    var n = t[Ei];
    n === void 0 && (n = t[Ei] = /* @__PURE__ */ new Set());
    var r = e + "__bubble";
    n.has(r) || (Xu(t, e, 2, !1), n.add(r));
  }
  function vi(e, t, n) {
    var r = 0;
    t && (r |= 4), Xu(n, e, r, t);
  }
  var Vr = "_reactListening" + Math.random().toString(36).slice(2);
  function er(e) {
    if (!e[Vr]) {
      e[Vr] = !0, H.forEach(function(n) {
        n !== "selectionchange" && (Yc.has(n) || vi(n, !1, e), vi(n, !0, e));
      });
      var t = e.nodeType === 9 ? e : e.ownerDocument;
      t === null || t[Vr] || (t[Vr] = !0, vi("selectionchange", !1, t));
    }
  }
  function Xu(e, t, n, r) {
    switch (gu(t)) {
      case 1:
        var l = uc;
        break;
      case 4:
        l = sc;
        break;
      default:
        l = bl;
    }
    n = l.bind(null, t, n, e), l = void 0, !Ql || t !== "touchstart" && t !== "touchmove" && t !== "wheel" || (l = !0), r ? l !== void 0 ? e.addEventListener(t, n, { capture: !0, passive: l }) : e.addEventListener(t, n, !0) : l !== void 0 ? e.addEventListener(t, n, { passive: l }) : e.addEventListener(t, n, !1);
  }
  function gi(e, t, n, r, l) {
    var i = r;
    if ((t & 1) === 0 && (t & 2) === 0 && r !== null) e: for (; ; ) {
      if (r === null) return;
      var o = r.tag;
      if (o === 3 || o === 4) {
        var u = r.stateNode.containerInfo;
        if (u === l || u.nodeType === 8 && u.parentNode === l) break;
        if (o === 4) for (o = r.return; o !== null; ) {
          var s = o.tag;
          if ((s === 3 || s === 4) && (s = o.stateNode.containerInfo, s === l || s.nodeType === 8 && s.parentNode === l)) return;
          o = o.return;
        }
        for (; u !== null; ) {
          if (o = Gt(u), o === null) return;
          if (s = o.tag, s === 5 || s === 6) {
            r = i = o;
            continue e;
          }
          u = u.parentNode;
        }
      }
      r = r.return;
    }
    bo(function() {
      var m = i, w = Vl(n), x = [];
      e: {
        var g = Wu.get(e);
        if (g !== void 0) {
          var N = ni, T = e;
          switch (e) {
            case "keypress":
              if (Fr(n) === 0) break e;
            case "keydown":
            case "keyup":
              N = Ec;
              break;
            case "focusin":
              T = "focus", N = ii;
              break;
            case "focusout":
              T = "blur", N = ii;
              break;
            case "beforeblur":
            case "afterblur":
              N = ii;
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
              N = xu;
              break;
            case "drag":
            case "dragend":
            case "dragenter":
            case "dragexit":
            case "dragleave":
            case "dragover":
            case "dragstart":
            case "drop":
              N = fc;
              break;
            case "touchcancel":
            case "touchend":
            case "touchmove":
            case "touchstart":
              N = Nc;
              break;
            case $u:
            case Hu:
            case Vu:
              N = hc;
              break;
            case Bu:
              N = zc;
              break;
            case "scroll":
              N = ac;
              break;
            case "wheel":
              N = Tc;
              break;
            case "copy":
            case "cut":
            case "paste":
              N = vc;
              break;
            case "gotpointercapture":
            case "lostpointercapture":
            case "pointercancel":
            case "pointerdown":
            case "pointermove":
            case "pointerout":
            case "pointerover":
            case "pointerup":
              N = Su;
          }
          var L = (t & 4) !== 0, ye = !L && e === "scroll", p = L ? g !== null ? g + "Capture" : null : g;
          L = [];
          for (var a = m, h; a !== null; ) {
            h = a;
            var k = h.stateNode;
            if (h.tag === 5 && k !== null && (h = k, p !== null && (k = Fn(a, p), k != null && L.push(tr(a, k, h)))), ye) break;
            a = a.return;
          }
          0 < L.length && (g = new N(g, T, null, n, w), x.push({ event: g, listeners: L }));
        }
      }
      if ((t & 7) === 0) {
        e: {
          if (g = e === "mouseover" || e === "pointerover", N = e === "mouseout" || e === "pointerout", g && n !== Hl && (T = n.relatedTarget || n.fromElement) && (Gt(T) || T[wt])) break e;
          if ((N || g) && (g = w.window === w ? w : (g = w.ownerDocument) ? g.defaultView || g.parentWindow : window, N ? (T = n.relatedTarget || n.toElement, N = m, T = T ? Gt(T) : null, T !== null && (ye = Xt(T), T !== ye || T.tag !== 5 && T.tag !== 6) && (T = null)) : (N = null, T = m), N !== T)) {
            if (L = xu, k = "onMouseLeave", p = "onMouseEnter", a = "mouse", (e === "pointerout" || e === "pointerover") && (L = Su, k = "onPointerLeave", p = "onPointerEnter", a = "pointer"), ye = N == null ? g : yn(N), h = T == null ? g : yn(T), g = new L(k, a + "leave", N, n, w), g.target = ye, g.relatedTarget = h, k = null, Gt(w) === m && (L = new L(p, a + "enter", T, n, w), L.target = h, L.relatedTarget = ye, k = L), ye = k, N && T) t: {
              for (L = N, p = T, a = 0, h = L; h; h = vn(h)) a++;
              for (h = 0, k = p; k; k = vn(k)) h++;
              for (; 0 < a - h; ) L = vn(L), a--;
              for (; 0 < h - a; ) p = vn(p), h--;
              for (; a--; ) {
                if (L === p || p !== null && L === p.alternate) break t;
                L = vn(L), p = vn(p);
              }
              L = null;
            }
            else L = null;
            N !== null && Gu(x, g, N, L, !1), T !== null && ye !== null && Gu(x, ye, T, L, !0);
          }
        }
        e: {
          if (g = m ? yn(m) : window, N = g.nodeName && g.nodeName.toLowerCase(), N === "select" || N === "input" && g.type === "file") var D = Oc;
          else if (zu(g)) if (Tu) D = Hc;
          else {
            D = Ac;
            var I = Uc;
          }
          else (N = g.nodeName) && N.toLowerCase() === "input" && (g.type === "checkbox" || g.type === "radio") && (D = $c);
          if (D && (D = D(e, m))) {
            Pu(x, D, n, w);
            break e;
          }
          I && I(e, g, m), e === "focusout" && (I = g._wrapperState) && I.controlled && g.type === "number" && Fl(g, "number", g.value);
        }
        switch (I = m ? yn(m) : window, e) {
          case "focusin":
            (zu(I) || I.contentEditable === "true") && (hn = I, fi = m, qn = null);
            break;
          case "focusout":
            qn = fi = hn = null;
            break;
          case "mousedown":
            di = !0;
            break;
          case "contextmenu":
          case "mouseup":
          case "dragend":
            di = !1, Uu(x, n, w);
            break;
          case "selectionchange":
            if (Wc) break;
          case "keydown":
          case "keyup":
            Uu(x, n, w);
        }
        var M;
        if (ui) e: {
          switch (e) {
            case "compositionstart":
              var $ = "onCompositionStart";
              break e;
            case "compositionend":
              $ = "onCompositionEnd";
              break e;
            case "compositionupdate":
              $ = "onCompositionUpdate";
              break e;
          }
          $ = void 0;
        }
        else pn ? Nu(e, n) && ($ = "onCompositionEnd") : e === "keydown" && n.keyCode === 229 && ($ = "onCompositionStart");
        $ && (Eu && n.locale !== "ko" && (pn || $ !== "onCompositionStart" ? $ === "onCompositionEnd" && pn && (M = yu()) : (Rt = w, ti = "value" in Rt ? Rt.value : Rt.textContent, pn = !0)), I = Br(m, $), 0 < I.length && ($ = new ku($, e, null, n, w), x.push({ event: $, listeners: I }), M ? $.data = M : (M = ju(n), M !== null && ($.data = M)))), (M = Rc ? Dc(e, n) : Ic(e, n)) && (m = Br(m, "onBeforeInput"), 0 < m.length && (w = new ku("onBeforeInput", "beforeinput", null, n, w), x.push({ event: w, listeners: m }), w.data = M));
      }
      Yu(x, t);
    });
  }
  function tr(e, t, n) {
    return { instance: e, listener: t, currentTarget: n };
  }
  function Br(e, t) {
    for (var n = t + "Capture", r = []; e !== null; ) {
      var l = e, i = l.stateNode;
      l.tag === 5 && i !== null && (l = i, i = Fn(e, n), i != null && r.unshift(tr(e, i, l)), i = Fn(e, t), i != null && r.push(tr(e, i, l))), e = e.return;
    }
    return r;
  }
  function vn(e) {
    if (e === null) return null;
    do
      e = e.return;
    while (e && e.tag !== 5);
    return e || null;
  }
  function Gu(e, t, n, r, l) {
    for (var i = t._reactName, o = []; n !== null && n !== r; ) {
      var u = n, s = u.alternate, m = u.stateNode;
      if (s !== null && s === r) break;
      u.tag === 5 && m !== null && (u = m, l ? (s = Fn(n, i), s != null && o.unshift(tr(n, s, u))) : l || (s = Fn(n, i), s != null && o.push(tr(n, s, u)))), n = n.return;
    }
    o.length !== 0 && e.push({ event: t, listeners: o });
  }
  var Xc = /\r\n?/g, Gc = /\u0000|\uFFFD/g;
  function Zu(e) {
    return (typeof e == "string" ? e : "" + e).replace(Xc, `
`).replace(Gc, "");
  }
  function Wr(e, t, n) {
    if (t = Zu(t), Zu(e) !== t && n) throw Error(c(425));
  }
  function Qr() {
  }
  var yi = null, wi = null;
  function xi(e, t) {
    return e === "textarea" || e === "noscript" || typeof t.children == "string" || typeof t.children == "number" || typeof t.dangerouslySetInnerHTML == "object" && t.dangerouslySetInnerHTML !== null && t.dangerouslySetInnerHTML.__html != null;
  }
  var ki = typeof setTimeout == "function" ? setTimeout : void 0, Zc = typeof clearTimeout == "function" ? clearTimeout : void 0, Ju = typeof Promise == "function" ? Promise : void 0, Jc = typeof queueMicrotask == "function" ? queueMicrotask : typeof Ju < "u" ? function(e) {
    return Ju.resolve(null).then(e).catch(qc);
  } : ki;
  function qc(e) {
    setTimeout(function() {
      throw e;
    });
  }
  function Si(e, t) {
    var n = t, r = 0;
    do {
      var l = n.nextSibling;
      if (e.removeChild(n), l && l.nodeType === 8) if (n = l.data, n === "/$") {
        if (r === 0) {
          e.removeChild(l), Qn(t);
          return;
        }
        r--;
      } else n !== "$" && n !== "$?" && n !== "$!" || r++;
      n = l;
    } while (n);
    Qn(t);
  }
  function It(e) {
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
  function qu(e) {
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
  var gn = Math.random().toString(36).slice(2), ht = "__reactFiber$" + gn, nr = "__reactProps$" + gn, wt = "__reactContainer$" + gn, Ei = "__reactEvents$" + gn, bc = "__reactListeners$" + gn, ef = "__reactHandles$" + gn;
  function Gt(e) {
    var t = e[ht];
    if (t) return t;
    for (var n = e.parentNode; n; ) {
      if (t = n[wt] || n[ht]) {
        if (n = t.alternate, t.child !== null || n !== null && n.child !== null) for (e = qu(e); e !== null; ) {
          if (n = e[ht]) return n;
          e = qu(e);
        }
        return t;
      }
      e = n, n = e.parentNode;
    }
    return null;
  }
  function rr(e) {
    return e = e[ht] || e[wt], !e || e.tag !== 5 && e.tag !== 6 && e.tag !== 13 && e.tag !== 3 ? null : e;
  }
  function yn(e) {
    if (e.tag === 5 || e.tag === 6) return e.stateNode;
    throw Error(c(33));
  }
  function Kr(e) {
    return e[nr] || null;
  }
  var _i = [], wn = -1;
  function Mt(e) {
    return { current: e };
  }
  function se(e) {
    0 > wn || (e.current = _i[wn], _i[wn] = null, wn--);
  }
  function oe(e, t) {
    wn++, _i[wn] = e.current, e.current = t;
  }
  var Ft = {}, Pe = Mt(Ft), Ue = Mt(!1), Zt = Ft;
  function xn(e, t) {
    var n = e.type.contextTypes;
    if (!n) return Ft;
    var r = e.stateNode;
    if (r && r.__reactInternalMemoizedUnmaskedChildContext === t) return r.__reactInternalMemoizedMaskedChildContext;
    var l = {}, i;
    for (i in n) l[i] = t[i];
    return r && (e = e.stateNode, e.__reactInternalMemoizedUnmaskedChildContext = t, e.__reactInternalMemoizedMaskedChildContext = l), l;
  }
  function Ae(e) {
    return e = e.childContextTypes, e != null;
  }
  function Yr() {
    se(Ue), se(Pe);
  }
  function bu(e, t, n) {
    if (Pe.current !== Ft) throw Error(c(168));
    oe(Pe, t), oe(Ue, n);
  }
  function es(e, t, n) {
    var r = e.stateNode;
    if (t = t.childContextTypes, typeof r.getChildContext != "function") return n;
    r = r.getChildContext();
    for (var l in r) if (!(l in t)) throw Error(c(108, ie(e) || "Unknown", l));
    return P({}, n, r);
  }
  function Xr(e) {
    return e = (e = e.stateNode) && e.__reactInternalMemoizedMergedChildContext || Ft, Zt = Pe.current, oe(Pe, e), oe(Ue, Ue.current), !0;
  }
  function ts(e, t, n) {
    var r = e.stateNode;
    if (!r) throw Error(c(169));
    n ? (e = es(e, t, Zt), r.__reactInternalMemoizedMergedChildContext = e, se(Ue), se(Pe), oe(Pe, e)) : se(Ue), oe(Ue, n);
  }
  var xt = null, Gr = !1, Ci = !1;
  function ns(e) {
    xt === null ? xt = [e] : xt.push(e);
  }
  function tf(e) {
    Gr = !0, ns(e);
  }
  function Ot() {
    if (!Ci && xt !== null) {
      Ci = !0;
      var e = 0, t = le;
      try {
        var n = xt;
        for (le = 1; e < n.length; e++) {
          var r = n[e];
          do
            r = r(!0);
          while (r !== null);
        }
        xt = null, Gr = !1;
      } catch (l) {
        throw xt !== null && (xt = xt.slice(e + 1)), lu(Yl, Ot), l;
      } finally {
        le = t, Ci = !1;
      }
    }
    return null;
  }
  var kn = [], Sn = 0, Zr = null, Jr = 0, Je = [], qe = 0, Jt = null, kt = 1, St = "";
  function qt(e, t) {
    kn[Sn++] = Jr, kn[Sn++] = Zr, Zr = e, Jr = t;
  }
  function rs(e, t, n) {
    Je[qe++] = kt, Je[qe++] = St, Je[qe++] = Jt, Jt = e;
    var r = kt;
    e = St;
    var l = 32 - lt(r) - 1;
    r &= ~(1 << l), n += 1;
    var i = 32 - lt(t) + l;
    if (30 < i) {
      var o = l - l % 5;
      i = (r & (1 << o) - 1).toString(32), r >>= o, l -= o, kt = 1 << 32 - lt(t) + l | n << l | r, St = i + e;
    } else kt = 1 << i | n << l | r, St = e;
  }
  function Ni(e) {
    e.return !== null && (qt(e, 1), rs(e, 1, 0));
  }
  function ji(e) {
    for (; e === Zr; ) Zr = kn[--Sn], kn[Sn] = null, Jr = kn[--Sn], kn[Sn] = null;
    for (; e === Jt; ) Jt = Je[--qe], Je[qe] = null, St = Je[--qe], Je[qe] = null, kt = Je[--qe], Je[qe] = null;
  }
  var Ye = null, Xe = null, ce = !1, ot = null;
  function ls(e, t) {
    var n = nt(5, null, null, 0);
    n.elementType = "DELETED", n.stateNode = t, n.return = e, t = e.deletions, t === null ? (e.deletions = [n], e.flags |= 16) : t.push(n);
  }
  function is(e, t) {
    switch (e.tag) {
      case 5:
        var n = e.type;
        return t = t.nodeType !== 1 || n.toLowerCase() !== t.nodeName.toLowerCase() ? null : t, t !== null ? (e.stateNode = t, Ye = e, Xe = It(t.firstChild), !0) : !1;
      case 6:
        return t = e.pendingProps === "" || t.nodeType !== 3 ? null : t, t !== null ? (e.stateNode = t, Ye = e, Xe = null, !0) : !1;
      case 13:
        return t = t.nodeType !== 8 ? null : t, t !== null ? (n = Jt !== null ? { id: kt, overflow: St } : null, e.memoizedState = { dehydrated: t, treeContext: n, retryLane: 1073741824 }, n = nt(18, null, null, 0), n.stateNode = t, n.return = e, e.child = n, Ye = e, Xe = null, !0) : !1;
      default:
        return !1;
    }
  }
  function zi(e) {
    return (e.mode & 1) !== 0 && (e.flags & 128) === 0;
  }
  function Pi(e) {
    if (ce) {
      var t = Xe;
      if (t) {
        var n = t;
        if (!is(e, t)) {
          if (zi(e)) throw Error(c(418));
          t = It(n.nextSibling);
          var r = Ye;
          t && is(e, t) ? ls(r, n) : (e.flags = e.flags & -4097 | 2, ce = !1, Ye = e);
        }
      } else {
        if (zi(e)) throw Error(c(418));
        e.flags = e.flags & -4097 | 2, ce = !1, Ye = e;
      }
    }
  }
  function os(e) {
    for (e = e.return; e !== null && e.tag !== 5 && e.tag !== 3 && e.tag !== 13; ) e = e.return;
    Ye = e;
  }
  function qr(e) {
    if (e !== Ye) return !1;
    if (!ce) return os(e), ce = !0, !1;
    var t;
    if ((t = e.tag !== 3) && !(t = e.tag !== 5) && (t = e.type, t = t !== "head" && t !== "body" && !xi(e.type, e.memoizedProps)), t && (t = Xe)) {
      if (zi(e)) throw us(), Error(c(418));
      for (; t; ) ls(e, t), t = It(t.nextSibling);
    }
    if (os(e), e.tag === 13) {
      if (e = e.memoizedState, e = e !== null ? e.dehydrated : null, !e) throw Error(c(317));
      e: {
        for (e = e.nextSibling, t = 0; e; ) {
          if (e.nodeType === 8) {
            var n = e.data;
            if (n === "/$") {
              if (t === 0) {
                Xe = It(e.nextSibling);
                break e;
              }
              t--;
            } else n !== "$" && n !== "$!" && n !== "$?" || t++;
          }
          e = e.nextSibling;
        }
        Xe = null;
      }
    } else Xe = Ye ? It(e.stateNode.nextSibling) : null;
    return !0;
  }
  function us() {
    for (var e = Xe; e; ) e = It(e.nextSibling);
  }
  function En() {
    Xe = Ye = null, ce = !1;
  }
  function Ti(e) {
    ot === null ? ot = [e] : ot.push(e);
  }
  var nf = ne.ReactCurrentBatchConfig;
  function lr(e, t, n) {
    if (e = n.ref, e !== null && typeof e != "function" && typeof e != "object") {
      if (n._owner) {
        if (n = n._owner, n) {
          if (n.tag !== 1) throw Error(c(309));
          var r = n.stateNode;
        }
        if (!r) throw Error(c(147, e));
        var l = r, i = "" + e;
        return t !== null && t.ref !== null && typeof t.ref == "function" && t.ref._stringRef === i ? t.ref : (t = function(o) {
          var u = l.refs;
          o === null ? delete u[i] : u[i] = o;
        }, t._stringRef = i, t);
      }
      if (typeof e != "string") throw Error(c(284));
      if (!n._owner) throw Error(c(290, e));
    }
    return e;
  }
  function br(e, t) {
    throw e = Object.prototype.toString.call(t), Error(c(31, e === "[object Object]" ? "object with keys {" + Object.keys(t).join(", ") + "}" : e));
  }
  function ss(e) {
    var t = e._init;
    return t(e._payload);
  }
  function as(e) {
    function t(p, a) {
      if (e) {
        var h = p.deletions;
        h === null ? (p.deletions = [a], p.flags |= 16) : h.push(a);
      }
    }
    function n(p, a) {
      if (!e) return null;
      for (; a !== null; ) t(p, a), a = a.sibling;
      return null;
    }
    function r(p, a) {
      for (p = /* @__PURE__ */ new Map(); a !== null; ) a.key !== null ? p.set(a.key, a) : p.set(a.index, a), a = a.sibling;
      return p;
    }
    function l(p, a) {
      return p = Qt(p, a), p.index = 0, p.sibling = null, p;
    }
    function i(p, a, h) {
      return p.index = h, e ? (h = p.alternate, h !== null ? (h = h.index, h < a ? (p.flags |= 2, a) : h) : (p.flags |= 2, a)) : (p.flags |= 1048576, a);
    }
    function o(p) {
      return e && p.alternate === null && (p.flags |= 2), p;
    }
    function u(p, a, h, k) {
      return a === null || a.tag !== 6 ? (a = So(h, p.mode, k), a.return = p, a) : (a = l(a, h), a.return = p, a);
    }
    function s(p, a, h, k) {
      var D = h.type;
      return D === Fe ? w(p, a, h.props.children, k, h.key) : a !== null && (a.elementType === D || typeof D == "object" && D !== null && D.$$typeof === Oe && ss(D) === a.type) ? (k = l(a, h.props), k.ref = lr(p, a, h), k.return = p, k) : (k = El(h.type, h.key, h.props, null, p.mode, k), k.ref = lr(p, a, h), k.return = p, k);
    }
    function m(p, a, h, k) {
      return a === null || a.tag !== 4 || a.stateNode.containerInfo !== h.containerInfo || a.stateNode.implementation !== h.implementation ? (a = Eo(h, p.mode, k), a.return = p, a) : (a = l(a, h.children || []), a.return = p, a);
    }
    function w(p, a, h, k, D) {
      return a === null || a.tag !== 7 ? (a = un(h, p.mode, k, D), a.return = p, a) : (a = l(a, h), a.return = p, a);
    }
    function x(p, a, h) {
      if (typeof a == "string" && a !== "" || typeof a == "number") return a = So("" + a, p.mode, h), a.return = p, a;
      if (typeof a == "object" && a !== null) {
        switch (a.$$typeof) {
          case ze:
            return h = El(a.type, a.key, a.props, null, p.mode, h), h.ref = lr(p, null, a), h.return = p, h;
          case De:
            return a = Eo(a, p.mode, h), a.return = p, a;
          case Oe:
            var k = a._init;
            return x(p, k(a._payload), h);
        }
        if (Dn(a) || U(a)) return a = un(a, p.mode, h, null), a.return = p, a;
        br(p, a);
      }
      return null;
    }
    function g(p, a, h, k) {
      var D = a !== null ? a.key : null;
      if (typeof h == "string" && h !== "" || typeof h == "number") return D !== null ? null : u(p, a, "" + h, k);
      if (typeof h == "object" && h !== null) {
        switch (h.$$typeof) {
          case ze:
            return h.key === D ? s(p, a, h, k) : null;
          case De:
            return h.key === D ? m(p, a, h, k) : null;
          case Oe:
            return D = h._init, g(
              p,
              a,
              D(h._payload),
              k
            );
        }
        if (Dn(h) || U(h)) return D !== null ? null : w(p, a, h, k, null);
        br(p, h);
      }
      return null;
    }
    function N(p, a, h, k, D) {
      if (typeof k == "string" && k !== "" || typeof k == "number") return p = p.get(h) || null, u(a, p, "" + k, D);
      if (typeof k == "object" && k !== null) {
        switch (k.$$typeof) {
          case ze:
            return p = p.get(k.key === null ? h : k.key) || null, s(a, p, k, D);
          case De:
            return p = p.get(k.key === null ? h : k.key) || null, m(a, p, k, D);
          case Oe:
            var I = k._init;
            return N(p, a, h, I(k._payload), D);
        }
        if (Dn(k) || U(k)) return p = p.get(h) || null, w(a, p, k, D, null);
        br(a, k);
      }
      return null;
    }
    function T(p, a, h, k) {
      for (var D = null, I = null, M = a, $ = a = 0, _e = null; M !== null && $ < h.length; $++) {
        M.index > $ ? (_e = M, M = null) : _e = M.sibling;
        var ee = g(p, M, h[$], k);
        if (ee === null) {
          M === null && (M = _e);
          break;
        }
        e && M && ee.alternate === null && t(p, M), a = i(ee, a, $), I === null ? D = ee : I.sibling = ee, I = ee, M = _e;
      }
      if ($ === h.length) return n(p, M), ce && qt(p, $), D;
      if (M === null) {
        for (; $ < h.length; $++) M = x(p, h[$], k), M !== null && (a = i(M, a, $), I === null ? D = M : I.sibling = M, I = M);
        return ce && qt(p, $), D;
      }
      for (M = r(p, M); $ < h.length; $++) _e = N(M, p, $, h[$], k), _e !== null && (e && _e.alternate !== null && M.delete(_e.key === null ? $ : _e.key), a = i(_e, a, $), I === null ? D = _e : I.sibling = _e, I = _e);
      return e && M.forEach(function(Kt) {
        return t(p, Kt);
      }), ce && qt(p, $), D;
    }
    function L(p, a, h, k) {
      var D = U(h);
      if (typeof D != "function") throw Error(c(150));
      if (h = D.call(h), h == null) throw Error(c(151));
      for (var I = D = null, M = a, $ = a = 0, _e = null, ee = h.next(); M !== null && !ee.done; $++, ee = h.next()) {
        M.index > $ ? (_e = M, M = null) : _e = M.sibling;
        var Kt = g(p, M, ee.value, k);
        if (Kt === null) {
          M === null && (M = _e);
          break;
        }
        e && M && Kt.alternate === null && t(p, M), a = i(Kt, a, $), I === null ? D = Kt : I.sibling = Kt, I = Kt, M = _e;
      }
      if (ee.done) return n(
        p,
        M
      ), ce && qt(p, $), D;
      if (M === null) {
        for (; !ee.done; $++, ee = h.next()) ee = x(p, ee.value, k), ee !== null && (a = i(ee, a, $), I === null ? D = ee : I.sibling = ee, I = ee);
        return ce && qt(p, $), D;
      }
      for (M = r(p, M); !ee.done; $++, ee = h.next()) ee = N(M, p, $, ee.value, k), ee !== null && (e && ee.alternate !== null && M.delete(ee.key === null ? $ : ee.key), a = i(ee, a, $), I === null ? D = ee : I.sibling = ee, I = ee);
      return e && M.forEach(function(Ff) {
        return t(p, Ff);
      }), ce && qt(p, $), D;
    }
    function ye(p, a, h, k) {
      if (typeof h == "object" && h !== null && h.type === Fe && h.key === null && (h = h.props.children), typeof h == "object" && h !== null) {
        switch (h.$$typeof) {
          case ze:
            e: {
              for (var D = h.key, I = a; I !== null; ) {
                if (I.key === D) {
                  if (D = h.type, D === Fe) {
                    if (I.tag === 7) {
                      n(p, I.sibling), a = l(I, h.props.children), a.return = p, p = a;
                      break e;
                    }
                  } else if (I.elementType === D || typeof D == "object" && D !== null && D.$$typeof === Oe && ss(D) === I.type) {
                    n(p, I.sibling), a = l(I, h.props), a.ref = lr(p, I, h), a.return = p, p = a;
                    break e;
                  }
                  n(p, I);
                  break;
                } else t(p, I);
                I = I.sibling;
              }
              h.type === Fe ? (a = un(h.props.children, p.mode, k, h.key), a.return = p, p = a) : (k = El(h.type, h.key, h.props, null, p.mode, k), k.ref = lr(p, a, h), k.return = p, p = k);
            }
            return o(p);
          case De:
            e: {
              for (I = h.key; a !== null; ) {
                if (a.key === I) if (a.tag === 4 && a.stateNode.containerInfo === h.containerInfo && a.stateNode.implementation === h.implementation) {
                  n(p, a.sibling), a = l(a, h.children || []), a.return = p, p = a;
                  break e;
                } else {
                  n(p, a);
                  break;
                }
                else t(p, a);
                a = a.sibling;
              }
              a = Eo(h, p.mode, k), a.return = p, p = a;
            }
            return o(p);
          case Oe:
            return I = h._init, ye(p, a, I(h._payload), k);
        }
        if (Dn(h)) return T(p, a, h, k);
        if (U(h)) return L(p, a, h, k);
        br(p, h);
      }
      return typeof h == "string" && h !== "" || typeof h == "number" ? (h = "" + h, a !== null && a.tag === 6 ? (n(p, a.sibling), a = l(a, h), a.return = p, p = a) : (n(p, a), a = So(h, p.mode, k), a.return = p, p = a), o(p)) : n(p, a);
    }
    return ye;
  }
  var _n = as(!0), cs = as(!1), el = Mt(null), tl = null, Cn = null, Li = null;
  function Ri() {
    Li = Cn = tl = null;
  }
  function Di(e) {
    var t = el.current;
    se(el), e._currentValue = t;
  }
  function Ii(e, t, n) {
    for (; e !== null; ) {
      var r = e.alternate;
      if ((e.childLanes & t) !== t ? (e.childLanes |= t, r !== null && (r.childLanes |= t)) : r !== null && (r.childLanes & t) !== t && (r.childLanes |= t), e === n) break;
      e = e.return;
    }
  }
  function Nn(e, t) {
    tl = e, Li = Cn = null, e = e.dependencies, e !== null && e.firstContext !== null && ((e.lanes & t) !== 0 && ($e = !0), e.firstContext = null);
  }
  function be(e) {
    var t = e._currentValue;
    if (Li !== e) if (e = { context: e, memoizedValue: t, next: null }, Cn === null) {
      if (tl === null) throw Error(c(308));
      Cn = e, tl.dependencies = { lanes: 0, firstContext: e };
    } else Cn = Cn.next = e;
    return t;
  }
  var bt = null;
  function Mi(e) {
    bt === null ? bt = [e] : bt.push(e);
  }
  function fs(e, t, n, r) {
    var l = t.interleaved;
    return l === null ? (n.next = n, Mi(t)) : (n.next = l.next, l.next = n), t.interleaved = n, Et(e, r);
  }
  function Et(e, t) {
    e.lanes |= t;
    var n = e.alternate;
    for (n !== null && (n.lanes |= t), n = e, e = e.return; e !== null; ) e.childLanes |= t, n = e.alternate, n !== null && (n.childLanes |= t), n = e, e = e.return;
    return n.tag === 3 ? n.stateNode : null;
  }
  var Ut = !1;
  function Fi(e) {
    e.updateQueue = { baseState: e.memoizedState, firstBaseUpdate: null, lastBaseUpdate: null, shared: { pending: null, interleaved: null, lanes: 0 }, effects: null };
  }
  function ds(e, t) {
    e = e.updateQueue, t.updateQueue === e && (t.updateQueue = { baseState: e.baseState, firstBaseUpdate: e.firstBaseUpdate, lastBaseUpdate: e.lastBaseUpdate, shared: e.shared, effects: e.effects });
  }
  function _t(e, t) {
    return { eventTime: e, lane: t, tag: 0, payload: null, callback: null, next: null };
  }
  function At(e, t, n) {
    var r = e.updateQueue;
    if (r === null) return null;
    if (r = r.shared, (J & 2) !== 0) {
      var l = r.pending;
      return l === null ? t.next = t : (t.next = l.next, l.next = t), r.pending = t, Et(e, n);
    }
    return l = r.interleaved, l === null ? (t.next = t, Mi(r)) : (t.next = l.next, l.next = t), r.interleaved = t, Et(e, n);
  }
  function nl(e, t, n) {
    if (t = t.updateQueue, t !== null && (t = t.shared, (n & 4194240) !== 0)) {
      var r = t.lanes;
      r &= e.pendingLanes, n |= r, t.lanes = n, Zl(e, n);
    }
  }
  function ps(e, t) {
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
  function rl(e, t, n, r) {
    var l = e.updateQueue;
    Ut = !1;
    var i = l.firstBaseUpdate, o = l.lastBaseUpdate, u = l.shared.pending;
    if (u !== null) {
      l.shared.pending = null;
      var s = u, m = s.next;
      s.next = null, o === null ? i = m : o.next = m, o = s;
      var w = e.alternate;
      w !== null && (w = w.updateQueue, u = w.lastBaseUpdate, u !== o && (u === null ? w.firstBaseUpdate = m : u.next = m, w.lastBaseUpdate = s));
    }
    if (i !== null) {
      var x = l.baseState;
      o = 0, w = m = s = null, u = i;
      do {
        var g = u.lane, N = u.eventTime;
        if ((r & g) === g) {
          w !== null && (w = w.next = {
            eventTime: N,
            lane: 0,
            tag: u.tag,
            payload: u.payload,
            callback: u.callback,
            next: null
          });
          e: {
            var T = e, L = u;
            switch (g = t, N = n, L.tag) {
              case 1:
                if (T = L.payload, typeof T == "function") {
                  x = T.call(N, x, g);
                  break e;
                }
                x = T;
                break e;
              case 3:
                T.flags = T.flags & -65537 | 128;
              case 0:
                if (T = L.payload, g = typeof T == "function" ? T.call(N, x, g) : T, g == null) break e;
                x = P({}, x, g);
                break e;
              case 2:
                Ut = !0;
            }
          }
          u.callback !== null && u.lane !== 0 && (e.flags |= 64, g = l.effects, g === null ? l.effects = [u] : g.push(u));
        } else N = { eventTime: N, lane: g, tag: u.tag, payload: u.payload, callback: u.callback, next: null }, w === null ? (m = w = N, s = x) : w = w.next = N, o |= g;
        if (u = u.next, u === null) {
          if (u = l.shared.pending, u === null) break;
          g = u, u = g.next, g.next = null, l.lastBaseUpdate = g, l.shared.pending = null;
        }
      } while (!0);
      if (w === null && (s = x), l.baseState = s, l.firstBaseUpdate = m, l.lastBaseUpdate = w, t = l.shared.interleaved, t !== null) {
        l = t;
        do
          o |= l.lane, l = l.next;
        while (l !== t);
      } else i === null && (l.shared.lanes = 0);
      nn |= o, e.lanes = o, e.memoizedState = x;
    }
  }
  function hs(e, t, n) {
    if (e = t.effects, t.effects = null, e !== null) for (t = 0; t < e.length; t++) {
      var r = e[t], l = r.callback;
      if (l !== null) {
        if (r.callback = null, r = n, typeof l != "function") throw Error(c(191, l));
        l.call(r);
      }
    }
  }
  var ir = {}, mt = Mt(ir), or = Mt(ir), ur = Mt(ir);
  function en(e) {
    if (e === ir) throw Error(c(174));
    return e;
  }
  function Oi(e, t) {
    switch (oe(ur, t), oe(or, e), oe(mt, ir), e = t.nodeType, e) {
      case 9:
      case 11:
        t = (t = t.documentElement) ? t.namespaceURI : Ul(null, "");
        break;
      default:
        e = e === 8 ? t.parentNode : t, t = e.namespaceURI || null, e = e.tagName, t = Ul(t, e);
    }
    se(mt), oe(mt, t);
  }
  function jn() {
    se(mt), se(or), se(ur);
  }
  function ms(e) {
    en(ur.current);
    var t = en(mt.current), n = Ul(t, e.type);
    t !== n && (oe(or, e), oe(mt, n));
  }
  function Ui(e) {
    or.current === e && (se(mt), se(or));
  }
  var fe = Mt(0);
  function ll(e) {
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
  var Ai = [];
  function $i() {
    for (var e = 0; e < Ai.length; e++) Ai[e]._workInProgressVersionPrimary = null;
    Ai.length = 0;
  }
  var il = ne.ReactCurrentDispatcher, Hi = ne.ReactCurrentBatchConfig, tn = 0, de = null, xe = null, Se = null, ol = !1, sr = !1, ar = 0, rf = 0;
  function Te() {
    throw Error(c(321));
  }
  function Vi(e, t) {
    if (t === null) return !1;
    for (var n = 0; n < t.length && n < e.length; n++) if (!it(e[n], t[n])) return !1;
    return !0;
  }
  function Bi(e, t, n, r, l, i) {
    if (tn = i, de = t, t.memoizedState = null, t.updateQueue = null, t.lanes = 0, il.current = e === null || e.memoizedState === null ? sf : af, e = n(r, l), sr) {
      i = 0;
      do {
        if (sr = !1, ar = 0, 25 <= i) throw Error(c(301));
        i += 1, Se = xe = null, t.updateQueue = null, il.current = cf, e = n(r, l);
      } while (sr);
    }
    if (il.current = al, t = xe !== null && xe.next !== null, tn = 0, Se = xe = de = null, ol = !1, t) throw Error(c(300));
    return e;
  }
  function Wi() {
    var e = ar !== 0;
    return ar = 0, e;
  }
  function vt() {
    var e = { memoizedState: null, baseState: null, baseQueue: null, queue: null, next: null };
    return Se === null ? de.memoizedState = Se = e : Se = Se.next = e, Se;
  }
  function et() {
    if (xe === null) {
      var e = de.alternate;
      e = e !== null ? e.memoizedState : null;
    } else e = xe.next;
    var t = Se === null ? de.memoizedState : Se.next;
    if (t !== null) Se = t, xe = e;
    else {
      if (e === null) throw Error(c(310));
      xe = e, e = { memoizedState: xe.memoizedState, baseState: xe.baseState, baseQueue: xe.baseQueue, queue: xe.queue, next: null }, Se === null ? de.memoizedState = Se = e : Se = Se.next = e;
    }
    return Se;
  }
  function cr(e, t) {
    return typeof t == "function" ? t(e) : t;
  }
  function Qi(e) {
    var t = et(), n = t.queue;
    if (n === null) throw Error(c(311));
    n.lastRenderedReducer = e;
    var r = xe, l = r.baseQueue, i = n.pending;
    if (i !== null) {
      if (l !== null) {
        var o = l.next;
        l.next = i.next, i.next = o;
      }
      r.baseQueue = l = i, n.pending = null;
    }
    if (l !== null) {
      i = l.next, r = r.baseState;
      var u = o = null, s = null, m = i;
      do {
        var w = m.lane;
        if ((tn & w) === w) s !== null && (s = s.next = { lane: 0, action: m.action, hasEagerState: m.hasEagerState, eagerState: m.eagerState, next: null }), r = m.hasEagerState ? m.eagerState : e(r, m.action);
        else {
          var x = {
            lane: w,
            action: m.action,
            hasEagerState: m.hasEagerState,
            eagerState: m.eagerState,
            next: null
          };
          s === null ? (u = s = x, o = r) : s = s.next = x, de.lanes |= w, nn |= w;
        }
        m = m.next;
      } while (m !== null && m !== i);
      s === null ? o = r : s.next = u, it(r, t.memoizedState) || ($e = !0), t.memoizedState = r, t.baseState = o, t.baseQueue = s, n.lastRenderedState = r;
    }
    if (e = n.interleaved, e !== null) {
      l = e;
      do
        i = l.lane, de.lanes |= i, nn |= i, l = l.next;
      while (l !== e);
    } else l === null && (n.lanes = 0);
    return [t.memoizedState, n.dispatch];
  }
  function Ki(e) {
    var t = et(), n = t.queue;
    if (n === null) throw Error(c(311));
    n.lastRenderedReducer = e;
    var r = n.dispatch, l = n.pending, i = t.memoizedState;
    if (l !== null) {
      n.pending = null;
      var o = l = l.next;
      do
        i = e(i, o.action), o = o.next;
      while (o !== l);
      it(i, t.memoizedState) || ($e = !0), t.memoizedState = i, t.baseQueue === null && (t.baseState = i), n.lastRenderedState = i;
    }
    return [i, r];
  }
  function vs() {
  }
  function gs(e, t) {
    var n = de, r = et(), l = t(), i = !it(r.memoizedState, l);
    if (i && (r.memoizedState = l, $e = !0), r = r.queue, Yi(xs.bind(null, n, r, e), [e]), r.getSnapshot !== t || i || Se !== null && Se.memoizedState.tag & 1) {
      if (n.flags |= 2048, fr(9, ws.bind(null, n, r, l, t), void 0, null), Ee === null) throw Error(c(349));
      (tn & 30) !== 0 || ys(n, t, l);
    }
    return l;
  }
  function ys(e, t, n) {
    e.flags |= 16384, e = { getSnapshot: t, value: n }, t = de.updateQueue, t === null ? (t = { lastEffect: null, stores: null }, de.updateQueue = t, t.stores = [e]) : (n = t.stores, n === null ? t.stores = [e] : n.push(e));
  }
  function ws(e, t, n, r) {
    t.value = n, t.getSnapshot = r, ks(t) && Ss(e);
  }
  function xs(e, t, n) {
    return n(function() {
      ks(t) && Ss(e);
    });
  }
  function ks(e) {
    var t = e.getSnapshot;
    e = e.value;
    try {
      var n = t();
      return !it(e, n);
    } catch {
      return !0;
    }
  }
  function Ss(e) {
    var t = Et(e, 1);
    t !== null && ct(t, e, 1, -1);
  }
  function Es(e) {
    var t = vt();
    return typeof e == "function" && (e = e()), t.memoizedState = t.baseState = e, e = { pending: null, interleaved: null, lanes: 0, dispatch: null, lastRenderedReducer: cr, lastRenderedState: e }, t.queue = e, e = e.dispatch = uf.bind(null, de, e), [t.memoizedState, e];
  }
  function fr(e, t, n, r) {
    return e = { tag: e, create: t, destroy: n, deps: r, next: null }, t = de.updateQueue, t === null ? (t = { lastEffect: null, stores: null }, de.updateQueue = t, t.lastEffect = e.next = e) : (n = t.lastEffect, n === null ? t.lastEffect = e.next = e : (r = n.next, n.next = e, e.next = r, t.lastEffect = e)), e;
  }
  function _s() {
    return et().memoizedState;
  }
  function ul(e, t, n, r) {
    var l = vt();
    de.flags |= e, l.memoizedState = fr(1 | t, n, void 0, r === void 0 ? null : r);
  }
  function sl(e, t, n, r) {
    var l = et();
    r = r === void 0 ? null : r;
    var i = void 0;
    if (xe !== null) {
      var o = xe.memoizedState;
      if (i = o.destroy, r !== null && Vi(r, o.deps)) {
        l.memoizedState = fr(t, n, i, r);
        return;
      }
    }
    de.flags |= e, l.memoizedState = fr(1 | t, n, i, r);
  }
  function Cs(e, t) {
    return ul(8390656, 8, e, t);
  }
  function Yi(e, t) {
    return sl(2048, 8, e, t);
  }
  function Ns(e, t) {
    return sl(4, 2, e, t);
  }
  function js(e, t) {
    return sl(4, 4, e, t);
  }
  function zs(e, t) {
    if (typeof t == "function") return e = e(), t(e), function() {
      t(null);
    };
    if (t != null) return e = e(), t.current = e, function() {
      t.current = null;
    };
  }
  function Ps(e, t, n) {
    return n = n != null ? n.concat([e]) : null, sl(4, 4, zs.bind(null, t, e), n);
  }
  function Xi() {
  }
  function Ts(e, t) {
    var n = et();
    t = t === void 0 ? null : t;
    var r = n.memoizedState;
    return r !== null && t !== null && Vi(t, r[1]) ? r[0] : (n.memoizedState = [e, t], e);
  }
  function Ls(e, t) {
    var n = et();
    t = t === void 0 ? null : t;
    var r = n.memoizedState;
    return r !== null && t !== null && Vi(t, r[1]) ? r[0] : (e = e(), n.memoizedState = [e, t], e);
  }
  function Rs(e, t, n) {
    return (tn & 21) === 0 ? (e.baseState && (e.baseState = !1, $e = !0), e.memoizedState = n) : (it(n, t) || (n = su(), de.lanes |= n, nn |= n, e.baseState = !0), t);
  }
  function lf(e, t) {
    var n = le;
    le = n !== 0 && 4 > n ? n : 4, e(!0);
    var r = Hi.transition;
    Hi.transition = {};
    try {
      e(!1), t();
    } finally {
      le = n, Hi.transition = r;
    }
  }
  function Ds() {
    return et().memoizedState;
  }
  function of(e, t, n) {
    var r = Bt(e);
    if (n = { lane: r, action: n, hasEagerState: !1, eagerState: null, next: null }, Is(e)) Ms(t, n);
    else if (n = fs(e, t, n, r), n !== null) {
      var l = Me();
      ct(n, e, r, l), Fs(n, t, r);
    }
  }
  function uf(e, t, n) {
    var r = Bt(e), l = { lane: r, action: n, hasEagerState: !1, eagerState: null, next: null };
    if (Is(e)) Ms(t, l);
    else {
      var i = e.alternate;
      if (e.lanes === 0 && (i === null || i.lanes === 0) && (i = t.lastRenderedReducer, i !== null)) try {
        var o = t.lastRenderedState, u = i(o, n);
        if (l.hasEagerState = !0, l.eagerState = u, it(u, o)) {
          var s = t.interleaved;
          s === null ? (l.next = l, Mi(t)) : (l.next = s.next, s.next = l), t.interleaved = l;
          return;
        }
      } catch {
      } finally {
      }
      n = fs(e, t, l, r), n !== null && (l = Me(), ct(n, e, r, l), Fs(n, t, r));
    }
  }
  function Is(e) {
    var t = e.alternate;
    return e === de || t !== null && t === de;
  }
  function Ms(e, t) {
    sr = ol = !0;
    var n = e.pending;
    n === null ? t.next = t : (t.next = n.next, n.next = t), e.pending = t;
  }
  function Fs(e, t, n) {
    if ((n & 4194240) !== 0) {
      var r = t.lanes;
      r &= e.pendingLanes, n |= r, t.lanes = n, Zl(e, n);
    }
  }
  var al = { readContext: be, useCallback: Te, useContext: Te, useEffect: Te, useImperativeHandle: Te, useInsertionEffect: Te, useLayoutEffect: Te, useMemo: Te, useReducer: Te, useRef: Te, useState: Te, useDebugValue: Te, useDeferredValue: Te, useTransition: Te, useMutableSource: Te, useSyncExternalStore: Te, useId: Te, unstable_isNewReconciler: !1 }, sf = { readContext: be, useCallback: function(e, t) {
    return vt().memoizedState = [e, t === void 0 ? null : t], e;
  }, useContext: be, useEffect: Cs, useImperativeHandle: function(e, t, n) {
    return n = n != null ? n.concat([e]) : null, ul(
      4194308,
      4,
      zs.bind(null, t, e),
      n
    );
  }, useLayoutEffect: function(e, t) {
    return ul(4194308, 4, e, t);
  }, useInsertionEffect: function(e, t) {
    return ul(4, 2, e, t);
  }, useMemo: function(e, t) {
    var n = vt();
    return t = t === void 0 ? null : t, e = e(), n.memoizedState = [e, t], e;
  }, useReducer: function(e, t, n) {
    var r = vt();
    return t = n !== void 0 ? n(t) : t, r.memoizedState = r.baseState = t, e = { pending: null, interleaved: null, lanes: 0, dispatch: null, lastRenderedReducer: e, lastRenderedState: t }, r.queue = e, e = e.dispatch = of.bind(null, de, e), [r.memoizedState, e];
  }, useRef: function(e) {
    var t = vt();
    return e = { current: e }, t.memoizedState = e;
  }, useState: Es, useDebugValue: Xi, useDeferredValue: function(e) {
    return vt().memoizedState = e;
  }, useTransition: function() {
    var e = Es(!1), t = e[0];
    return e = lf.bind(null, e[1]), vt().memoizedState = e, [t, e];
  }, useMutableSource: function() {
  }, useSyncExternalStore: function(e, t, n) {
    var r = de, l = vt();
    if (ce) {
      if (n === void 0) throw Error(c(407));
      n = n();
    } else {
      if (n = t(), Ee === null) throw Error(c(349));
      (tn & 30) !== 0 || ys(r, t, n);
    }
    l.memoizedState = n;
    var i = { value: n, getSnapshot: t };
    return l.queue = i, Cs(xs.bind(
      null,
      r,
      i,
      e
    ), [e]), r.flags |= 2048, fr(9, ws.bind(null, r, i, n, t), void 0, null), n;
  }, useId: function() {
    var e = vt(), t = Ee.identifierPrefix;
    if (ce) {
      var n = St, r = kt;
      n = (r & ~(1 << 32 - lt(r) - 1)).toString(32) + n, t = ":" + t + "R" + n, n = ar++, 0 < n && (t += "H" + n.toString(32)), t += ":";
    } else n = rf++, t = ":" + t + "r" + n.toString(32) + ":";
    return e.memoizedState = t;
  }, unstable_isNewReconciler: !1 }, af = {
    readContext: be,
    useCallback: Ts,
    useContext: be,
    useEffect: Yi,
    useImperativeHandle: Ps,
    useInsertionEffect: Ns,
    useLayoutEffect: js,
    useMemo: Ls,
    useReducer: Qi,
    useRef: _s,
    useState: function() {
      return Qi(cr);
    },
    useDebugValue: Xi,
    useDeferredValue: function(e) {
      var t = et();
      return Rs(t, xe.memoizedState, e);
    },
    useTransition: function() {
      var e = Qi(cr)[0], t = et().memoizedState;
      return [e, t];
    },
    useMutableSource: vs,
    useSyncExternalStore: gs,
    useId: Ds,
    unstable_isNewReconciler: !1
  }, cf = { readContext: be, useCallback: Ts, useContext: be, useEffect: Yi, useImperativeHandle: Ps, useInsertionEffect: Ns, useLayoutEffect: js, useMemo: Ls, useReducer: Ki, useRef: _s, useState: function() {
    return Ki(cr);
  }, useDebugValue: Xi, useDeferredValue: function(e) {
    var t = et();
    return xe === null ? t.memoizedState = e : Rs(t, xe.memoizedState, e);
  }, useTransition: function() {
    var e = Ki(cr)[0], t = et().memoizedState;
    return [e, t];
  }, useMutableSource: vs, useSyncExternalStore: gs, useId: Ds, unstable_isNewReconciler: !1 };
  function ut(e, t) {
    if (e && e.defaultProps) {
      t = P({}, t), e = e.defaultProps;
      for (var n in e) t[n] === void 0 && (t[n] = e[n]);
      return t;
    }
    return t;
  }
  function Gi(e, t, n, r) {
    t = e.memoizedState, n = n(r, t), n = n == null ? t : P({}, t, n), e.memoizedState = n, e.lanes === 0 && (e.updateQueue.baseState = n);
  }
  var cl = { isMounted: function(e) {
    return (e = e._reactInternals) ? Xt(e) === e : !1;
  }, enqueueSetState: function(e, t, n) {
    e = e._reactInternals;
    var r = Me(), l = Bt(e), i = _t(r, l);
    i.payload = t, n != null && (i.callback = n), t = At(e, i, l), t !== null && (ct(t, e, l, r), nl(t, e, l));
  }, enqueueReplaceState: function(e, t, n) {
    e = e._reactInternals;
    var r = Me(), l = Bt(e), i = _t(r, l);
    i.tag = 1, i.payload = t, n != null && (i.callback = n), t = At(e, i, l), t !== null && (ct(t, e, l, r), nl(t, e, l));
  }, enqueueForceUpdate: function(e, t) {
    e = e._reactInternals;
    var n = Me(), r = Bt(e), l = _t(n, r);
    l.tag = 2, t != null && (l.callback = t), t = At(e, l, r), t !== null && (ct(t, e, r, n), nl(t, e, r));
  } };
  function Os(e, t, n, r, l, i, o) {
    return e = e.stateNode, typeof e.shouldComponentUpdate == "function" ? e.shouldComponentUpdate(r, i, o) : t.prototype && t.prototype.isPureReactComponent ? !Jn(n, r) || !Jn(l, i) : !0;
  }
  function Us(e, t, n) {
    var r = !1, l = Ft, i = t.contextType;
    return typeof i == "object" && i !== null ? i = be(i) : (l = Ae(t) ? Zt : Pe.current, r = t.contextTypes, i = (r = r != null) ? xn(e, l) : Ft), t = new t(n, i), e.memoizedState = t.state !== null && t.state !== void 0 ? t.state : null, t.updater = cl, e.stateNode = t, t._reactInternals = e, r && (e = e.stateNode, e.__reactInternalMemoizedUnmaskedChildContext = l, e.__reactInternalMemoizedMaskedChildContext = i), t;
  }
  function As(e, t, n, r) {
    e = t.state, typeof t.componentWillReceiveProps == "function" && t.componentWillReceiveProps(n, r), typeof t.UNSAFE_componentWillReceiveProps == "function" && t.UNSAFE_componentWillReceiveProps(n, r), t.state !== e && cl.enqueueReplaceState(t, t.state, null);
  }
  function Zi(e, t, n, r) {
    var l = e.stateNode;
    l.props = n, l.state = e.memoizedState, l.refs = {}, Fi(e);
    var i = t.contextType;
    typeof i == "object" && i !== null ? l.context = be(i) : (i = Ae(t) ? Zt : Pe.current, l.context = xn(e, i)), l.state = e.memoizedState, i = t.getDerivedStateFromProps, typeof i == "function" && (Gi(e, t, i, n), l.state = e.memoizedState), typeof t.getDerivedStateFromProps == "function" || typeof l.getSnapshotBeforeUpdate == "function" || typeof l.UNSAFE_componentWillMount != "function" && typeof l.componentWillMount != "function" || (t = l.state, typeof l.componentWillMount == "function" && l.componentWillMount(), typeof l.UNSAFE_componentWillMount == "function" && l.UNSAFE_componentWillMount(), t !== l.state && cl.enqueueReplaceState(l, l.state, null), rl(e, n, l, r), l.state = e.memoizedState), typeof l.componentDidMount == "function" && (e.flags |= 4194308);
  }
  function zn(e, t) {
    try {
      var n = "", r = t;
      do
        n += q(r), r = r.return;
      while (r);
      var l = n;
    } catch (i) {
      l = `
Error generating stack: ` + i.message + `
` + i.stack;
    }
    return { value: e, source: t, stack: l, digest: null };
  }
  function Ji(e, t, n) {
    return { value: e, source: null, stack: n ?? null, digest: t ?? null };
  }
  function qi(e, t) {
    try {
      console.error(t.value);
    } catch (n) {
      setTimeout(function() {
        throw n;
      });
    }
  }
  var ff = typeof WeakMap == "function" ? WeakMap : Map;
  function $s(e, t, n) {
    n = _t(-1, n), n.tag = 3, n.payload = { element: null };
    var r = t.value;
    return n.callback = function() {
      gl || (gl = !0, ho = r), qi(e, t);
    }, n;
  }
  function Hs(e, t, n) {
    n = _t(-1, n), n.tag = 3;
    var r = e.type.getDerivedStateFromError;
    if (typeof r == "function") {
      var l = t.value;
      n.payload = function() {
        return r(l);
      }, n.callback = function() {
        qi(e, t);
      };
    }
    var i = e.stateNode;
    return i !== null && typeof i.componentDidCatch == "function" && (n.callback = function() {
      qi(e, t), typeof r != "function" && (Ht === null ? Ht = /* @__PURE__ */ new Set([this]) : Ht.add(this));
      var o = t.stack;
      this.componentDidCatch(t.value, { componentStack: o !== null ? o : "" });
    }), n;
  }
  function Vs(e, t, n) {
    var r = e.pingCache;
    if (r === null) {
      r = e.pingCache = new ff();
      var l = /* @__PURE__ */ new Set();
      r.set(t, l);
    } else l = r.get(t), l === void 0 && (l = /* @__PURE__ */ new Set(), r.set(t, l));
    l.has(n) || (l.add(n), e = Cf.bind(null, e, t, n), t.then(e, e));
  }
  function Bs(e) {
    do {
      var t;
      if ((t = e.tag === 13) && (t = e.memoizedState, t = t !== null ? t.dehydrated !== null : !0), t) return e;
      e = e.return;
    } while (e !== null);
    return null;
  }
  function Ws(e, t, n, r, l) {
    return (e.mode & 1) === 0 ? (e === t ? e.flags |= 65536 : (e.flags |= 128, n.flags |= 131072, n.flags &= -52805, n.tag === 1 && (n.alternate === null ? n.tag = 17 : (t = _t(-1, 1), t.tag = 2, At(n, t, 1))), n.lanes |= 1), e) : (e.flags |= 65536, e.lanes = l, e);
  }
  var df = ne.ReactCurrentOwner, $e = !1;
  function Ie(e, t, n, r) {
    t.child = e === null ? cs(t, null, n, r) : _n(t, e.child, n, r);
  }
  function Qs(e, t, n, r, l) {
    n = n.render;
    var i = t.ref;
    return Nn(t, l), r = Bi(e, t, n, r, i, l), n = Wi(), e !== null && !$e ? (t.updateQueue = e.updateQueue, t.flags &= -2053, e.lanes &= ~l, Ct(e, t, l)) : (ce && n && Ni(t), t.flags |= 1, Ie(e, t, r, l), t.child);
  }
  function Ks(e, t, n, r, l) {
    if (e === null) {
      var i = n.type;
      return typeof i == "function" && !ko(i) && i.defaultProps === void 0 && n.compare === null && n.defaultProps === void 0 ? (t.tag = 15, t.type = i, Ys(e, t, i, r, l)) : (e = El(n.type, null, r, t, t.mode, l), e.ref = t.ref, e.return = t, t.child = e);
    }
    if (i = e.child, (e.lanes & l) === 0) {
      var o = i.memoizedProps;
      if (n = n.compare, n = n !== null ? n : Jn, n(o, r) && e.ref === t.ref) return Ct(e, t, l);
    }
    return t.flags |= 1, e = Qt(i, r), e.ref = t.ref, e.return = t, t.child = e;
  }
  function Ys(e, t, n, r, l) {
    if (e !== null) {
      var i = e.memoizedProps;
      if (Jn(i, r) && e.ref === t.ref) if ($e = !1, t.pendingProps = r = i, (e.lanes & l) !== 0) (e.flags & 131072) !== 0 && ($e = !0);
      else return t.lanes = e.lanes, Ct(e, t, l);
    }
    return bi(e, t, n, r, l);
  }
  function Xs(e, t, n) {
    var r = t.pendingProps, l = r.children, i = e !== null ? e.memoizedState : null;
    if (r.mode === "hidden") if ((t.mode & 1) === 0) t.memoizedState = { baseLanes: 0, cachePool: null, transitions: null }, oe(Tn, Ge), Ge |= n;
    else {
      if ((n & 1073741824) === 0) return e = i !== null ? i.baseLanes | n : n, t.lanes = t.childLanes = 1073741824, t.memoizedState = { baseLanes: e, cachePool: null, transitions: null }, t.updateQueue = null, oe(Tn, Ge), Ge |= e, null;
      t.memoizedState = { baseLanes: 0, cachePool: null, transitions: null }, r = i !== null ? i.baseLanes : n, oe(Tn, Ge), Ge |= r;
    }
    else i !== null ? (r = i.baseLanes | n, t.memoizedState = null) : r = n, oe(Tn, Ge), Ge |= r;
    return Ie(e, t, l, n), t.child;
  }
  function Gs(e, t) {
    var n = t.ref;
    (e === null && n !== null || e !== null && e.ref !== n) && (t.flags |= 512, t.flags |= 2097152);
  }
  function bi(e, t, n, r, l) {
    var i = Ae(n) ? Zt : Pe.current;
    return i = xn(t, i), Nn(t, l), n = Bi(e, t, n, r, i, l), r = Wi(), e !== null && !$e ? (t.updateQueue = e.updateQueue, t.flags &= -2053, e.lanes &= ~l, Ct(e, t, l)) : (ce && r && Ni(t), t.flags |= 1, Ie(e, t, n, l), t.child);
  }
  function Zs(e, t, n, r, l) {
    if (Ae(n)) {
      var i = !0;
      Xr(t);
    } else i = !1;
    if (Nn(t, l), t.stateNode === null) dl(e, t), Us(t, n, r), Zi(t, n, r, l), r = !0;
    else if (e === null) {
      var o = t.stateNode, u = t.memoizedProps;
      o.props = u;
      var s = o.context, m = n.contextType;
      typeof m == "object" && m !== null ? m = be(m) : (m = Ae(n) ? Zt : Pe.current, m = xn(t, m));
      var w = n.getDerivedStateFromProps, x = typeof w == "function" || typeof o.getSnapshotBeforeUpdate == "function";
      x || typeof o.UNSAFE_componentWillReceiveProps != "function" && typeof o.componentWillReceiveProps != "function" || (u !== r || s !== m) && As(t, o, r, m), Ut = !1;
      var g = t.memoizedState;
      o.state = g, rl(t, r, o, l), s = t.memoizedState, u !== r || g !== s || Ue.current || Ut ? (typeof w == "function" && (Gi(t, n, w, r), s = t.memoizedState), (u = Ut || Os(t, n, u, r, g, s, m)) ? (x || typeof o.UNSAFE_componentWillMount != "function" && typeof o.componentWillMount != "function" || (typeof o.componentWillMount == "function" && o.componentWillMount(), typeof o.UNSAFE_componentWillMount == "function" && o.UNSAFE_componentWillMount()), typeof o.componentDidMount == "function" && (t.flags |= 4194308)) : (typeof o.componentDidMount == "function" && (t.flags |= 4194308), t.memoizedProps = r, t.memoizedState = s), o.props = r, o.state = s, o.context = m, r = u) : (typeof o.componentDidMount == "function" && (t.flags |= 4194308), r = !1);
    } else {
      o = t.stateNode, ds(e, t), u = t.memoizedProps, m = t.type === t.elementType ? u : ut(t.type, u), o.props = m, x = t.pendingProps, g = o.context, s = n.contextType, typeof s == "object" && s !== null ? s = be(s) : (s = Ae(n) ? Zt : Pe.current, s = xn(t, s));
      var N = n.getDerivedStateFromProps;
      (w = typeof N == "function" || typeof o.getSnapshotBeforeUpdate == "function") || typeof o.UNSAFE_componentWillReceiveProps != "function" && typeof o.componentWillReceiveProps != "function" || (u !== x || g !== s) && As(t, o, r, s), Ut = !1, g = t.memoizedState, o.state = g, rl(t, r, o, l);
      var T = t.memoizedState;
      u !== x || g !== T || Ue.current || Ut ? (typeof N == "function" && (Gi(t, n, N, r), T = t.memoizedState), (m = Ut || Os(t, n, m, r, g, T, s) || !1) ? (w || typeof o.UNSAFE_componentWillUpdate != "function" && typeof o.componentWillUpdate != "function" || (typeof o.componentWillUpdate == "function" && o.componentWillUpdate(r, T, s), typeof o.UNSAFE_componentWillUpdate == "function" && o.UNSAFE_componentWillUpdate(r, T, s)), typeof o.componentDidUpdate == "function" && (t.flags |= 4), typeof o.getSnapshotBeforeUpdate == "function" && (t.flags |= 1024)) : (typeof o.componentDidUpdate != "function" || u === e.memoizedProps && g === e.memoizedState || (t.flags |= 4), typeof o.getSnapshotBeforeUpdate != "function" || u === e.memoizedProps && g === e.memoizedState || (t.flags |= 1024), t.memoizedProps = r, t.memoizedState = T), o.props = r, o.state = T, o.context = s, r = m) : (typeof o.componentDidUpdate != "function" || u === e.memoizedProps && g === e.memoizedState || (t.flags |= 4), typeof o.getSnapshotBeforeUpdate != "function" || u === e.memoizedProps && g === e.memoizedState || (t.flags |= 1024), r = !1);
    }
    return eo(e, t, n, r, i, l);
  }
  function eo(e, t, n, r, l, i) {
    Gs(e, t);
    var o = (t.flags & 128) !== 0;
    if (!r && !o) return l && ts(t, n, !1), Ct(e, t, i);
    r = t.stateNode, df.current = t;
    var u = o && typeof n.getDerivedStateFromError != "function" ? null : r.render();
    return t.flags |= 1, e !== null && o ? (t.child = _n(t, e.child, null, i), t.child = _n(t, null, u, i)) : Ie(e, t, u, i), t.memoizedState = r.state, l && ts(t, n, !0), t.child;
  }
  function Js(e) {
    var t = e.stateNode;
    t.pendingContext ? bu(e, t.pendingContext, t.pendingContext !== t.context) : t.context && bu(e, t.context, !1), Oi(e, t.containerInfo);
  }
  function qs(e, t, n, r, l) {
    return En(), Ti(l), t.flags |= 256, Ie(e, t, n, r), t.child;
  }
  var to = { dehydrated: null, treeContext: null, retryLane: 0 };
  function no(e) {
    return { baseLanes: e, cachePool: null, transitions: null };
  }
  function bs(e, t, n) {
    var r = t.pendingProps, l = fe.current, i = !1, o = (t.flags & 128) !== 0, u;
    if ((u = o) || (u = e !== null && e.memoizedState === null ? !1 : (l & 2) !== 0), u ? (i = !0, t.flags &= -129) : (e === null || e.memoizedState !== null) && (l |= 1), oe(fe, l & 1), e === null)
      return Pi(t), e = t.memoizedState, e !== null && (e = e.dehydrated, e !== null) ? ((t.mode & 1) === 0 ? t.lanes = 1 : e.data === "$!" ? t.lanes = 8 : t.lanes = 1073741824, null) : (o = r.children, e = r.fallback, i ? (r = t.mode, i = t.child, o = { mode: "hidden", children: o }, (r & 1) === 0 && i !== null ? (i.childLanes = 0, i.pendingProps = o) : i = _l(o, r, 0, null), e = un(e, r, n, null), i.return = t, e.return = t, i.sibling = e, t.child = i, t.child.memoizedState = no(n), t.memoizedState = to, e) : ro(t, o));
    if (l = e.memoizedState, l !== null && (u = l.dehydrated, u !== null)) return pf(e, t, o, r, u, l, n);
    if (i) {
      i = r.fallback, o = t.mode, l = e.child, u = l.sibling;
      var s = { mode: "hidden", children: r.children };
      return (o & 1) === 0 && t.child !== l ? (r = t.child, r.childLanes = 0, r.pendingProps = s, t.deletions = null) : (r = Qt(l, s), r.subtreeFlags = l.subtreeFlags & 14680064), u !== null ? i = Qt(u, i) : (i = un(i, o, n, null), i.flags |= 2), i.return = t, r.return = t, r.sibling = i, t.child = r, r = i, i = t.child, o = e.child.memoizedState, o = o === null ? no(n) : { baseLanes: o.baseLanes | n, cachePool: null, transitions: o.transitions }, i.memoizedState = o, i.childLanes = e.childLanes & ~n, t.memoizedState = to, r;
    }
    return i = e.child, e = i.sibling, r = Qt(i, { mode: "visible", children: r.children }), (t.mode & 1) === 0 && (r.lanes = n), r.return = t, r.sibling = null, e !== null && (n = t.deletions, n === null ? (t.deletions = [e], t.flags |= 16) : n.push(e)), t.child = r, t.memoizedState = null, r;
  }
  function ro(e, t) {
    return t = _l({ mode: "visible", children: t }, e.mode, 0, null), t.return = e, e.child = t;
  }
  function fl(e, t, n, r) {
    return r !== null && Ti(r), _n(t, e.child, null, n), e = ro(t, t.pendingProps.children), e.flags |= 2, t.memoizedState = null, e;
  }
  function pf(e, t, n, r, l, i, o) {
    if (n)
      return t.flags & 256 ? (t.flags &= -257, r = Ji(Error(c(422))), fl(e, t, o, r)) : t.memoizedState !== null ? (t.child = e.child, t.flags |= 128, null) : (i = r.fallback, l = t.mode, r = _l({ mode: "visible", children: r.children }, l, 0, null), i = un(i, l, o, null), i.flags |= 2, r.return = t, i.return = t, r.sibling = i, t.child = r, (t.mode & 1) !== 0 && _n(t, e.child, null, o), t.child.memoizedState = no(o), t.memoizedState = to, i);
    if ((t.mode & 1) === 0) return fl(e, t, o, null);
    if (l.data === "$!") {
      if (r = l.nextSibling && l.nextSibling.dataset, r) var u = r.dgst;
      return r = u, i = Error(c(419)), r = Ji(i, r, void 0), fl(e, t, o, r);
    }
    if (u = (o & e.childLanes) !== 0, $e || u) {
      if (r = Ee, r !== null) {
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
        l = (l & (r.suspendedLanes | o)) !== 0 ? 0 : l, l !== 0 && l !== i.retryLane && (i.retryLane = l, Et(e, l), ct(r, e, l, -1));
      }
      return xo(), r = Ji(Error(c(421))), fl(e, t, o, r);
    }
    return l.data === "$?" ? (t.flags |= 128, t.child = e.child, t = Nf.bind(null, e), l._reactRetry = t, null) : (e = i.treeContext, Xe = It(l.nextSibling), Ye = t, ce = !0, ot = null, e !== null && (Je[qe++] = kt, Je[qe++] = St, Je[qe++] = Jt, kt = e.id, St = e.overflow, Jt = t), t = ro(t, r.children), t.flags |= 4096, t);
  }
  function ea(e, t, n) {
    e.lanes |= t;
    var r = e.alternate;
    r !== null && (r.lanes |= t), Ii(e.return, t, n);
  }
  function lo(e, t, n, r, l) {
    var i = e.memoizedState;
    i === null ? e.memoizedState = { isBackwards: t, rendering: null, renderingStartTime: 0, last: r, tail: n, tailMode: l } : (i.isBackwards = t, i.rendering = null, i.renderingStartTime = 0, i.last = r, i.tail = n, i.tailMode = l);
  }
  function ta(e, t, n) {
    var r = t.pendingProps, l = r.revealOrder, i = r.tail;
    if (Ie(e, t, r.children, n), r = fe.current, (r & 2) !== 0) r = r & 1 | 2, t.flags |= 128;
    else {
      if (e !== null && (e.flags & 128) !== 0) e: for (e = t.child; e !== null; ) {
        if (e.tag === 13) e.memoizedState !== null && ea(e, n, t);
        else if (e.tag === 19) ea(e, n, t);
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
    if (oe(fe, r), (t.mode & 1) === 0) t.memoizedState = null;
    else switch (l) {
      case "forwards":
        for (n = t.child, l = null; n !== null; ) e = n.alternate, e !== null && ll(e) === null && (l = n), n = n.sibling;
        n = l, n === null ? (l = t.child, t.child = null) : (l = n.sibling, n.sibling = null), lo(t, !1, l, n, i);
        break;
      case "backwards":
        for (n = null, l = t.child, t.child = null; l !== null; ) {
          if (e = l.alternate, e !== null && ll(e) === null) {
            t.child = l;
            break;
          }
          e = l.sibling, l.sibling = n, n = l, l = e;
        }
        lo(t, !0, n, null, i);
        break;
      case "together":
        lo(t, !1, null, null, void 0);
        break;
      default:
        t.memoizedState = null;
    }
    return t.child;
  }
  function dl(e, t) {
    (t.mode & 1) === 0 && e !== null && (e.alternate = null, t.alternate = null, t.flags |= 2);
  }
  function Ct(e, t, n) {
    if (e !== null && (t.dependencies = e.dependencies), nn |= t.lanes, (n & t.childLanes) === 0) return null;
    if (e !== null && t.child !== e.child) throw Error(c(153));
    if (t.child !== null) {
      for (e = t.child, n = Qt(e, e.pendingProps), t.child = n, n.return = t; e.sibling !== null; ) e = e.sibling, n = n.sibling = Qt(e, e.pendingProps), n.return = t;
      n.sibling = null;
    }
    return t.child;
  }
  function hf(e, t, n) {
    switch (t.tag) {
      case 3:
        Js(t), En();
        break;
      case 5:
        ms(t);
        break;
      case 1:
        Ae(t.type) && Xr(t);
        break;
      case 4:
        Oi(t, t.stateNode.containerInfo);
        break;
      case 10:
        var r = t.type._context, l = t.memoizedProps.value;
        oe(el, r._currentValue), r._currentValue = l;
        break;
      case 13:
        if (r = t.memoizedState, r !== null)
          return r.dehydrated !== null ? (oe(fe, fe.current & 1), t.flags |= 128, null) : (n & t.child.childLanes) !== 0 ? bs(e, t, n) : (oe(fe, fe.current & 1), e = Ct(e, t, n), e !== null ? e.sibling : null);
        oe(fe, fe.current & 1);
        break;
      case 19:
        if (r = (n & t.childLanes) !== 0, (e.flags & 128) !== 0) {
          if (r) return ta(e, t, n);
          t.flags |= 128;
        }
        if (l = t.memoizedState, l !== null && (l.rendering = null, l.tail = null, l.lastEffect = null), oe(fe, fe.current), r) break;
        return null;
      case 22:
      case 23:
        return t.lanes = 0, Xs(e, t, n);
    }
    return Ct(e, t, n);
  }
  var na, io, ra, la;
  na = function(e, t) {
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
  }, io = function() {
  }, ra = function(e, t, n, r) {
    var l = e.memoizedProps;
    if (l !== r) {
      e = t.stateNode, en(mt.current);
      var i = null;
      switch (n) {
        case "input":
          l = Il(e, l), r = Il(e, r), i = [];
          break;
        case "select":
          l = P({}, l, { value: void 0 }), r = P({}, r, { value: void 0 }), i = [];
          break;
        case "textarea":
          l = Ol(e, l), r = Ol(e, r), i = [];
          break;
        default:
          typeof l.onClick != "function" && typeof r.onClick == "function" && (e.onclick = Qr);
      }
      Al(n, r);
      var o;
      n = null;
      for (m in l) if (!r.hasOwnProperty(m) && l.hasOwnProperty(m) && l[m] != null) if (m === "style") {
        var u = l[m];
        for (o in u) u.hasOwnProperty(o) && (n || (n = {}), n[o] = "");
      } else m !== "dangerouslySetInnerHTML" && m !== "children" && m !== "suppressContentEditableWarning" && m !== "suppressHydrationWarning" && m !== "autoFocus" && (Q.hasOwnProperty(m) ? i || (i = []) : (i = i || []).push(m, null));
      for (m in r) {
        var s = r[m];
        if (u = l != null ? l[m] : void 0, r.hasOwnProperty(m) && s !== u && (s != null || u != null)) if (m === "style") if (u) {
          for (o in u) !u.hasOwnProperty(o) || s && s.hasOwnProperty(o) || (n || (n = {}), n[o] = "");
          for (o in s) s.hasOwnProperty(o) && u[o] !== s[o] && (n || (n = {}), n[o] = s[o]);
        } else n || (i || (i = []), i.push(
          m,
          n
        )), n = s;
        else m === "dangerouslySetInnerHTML" ? (s = s ? s.__html : void 0, u = u ? u.__html : void 0, s != null && u !== s && (i = i || []).push(m, s)) : m === "children" ? typeof s != "string" && typeof s != "number" || (i = i || []).push(m, "" + s) : m !== "suppressContentEditableWarning" && m !== "suppressHydrationWarning" && (Q.hasOwnProperty(m) ? (s != null && m === "onScroll" && ue("scroll", e), i || u === s || (i = [])) : (i = i || []).push(m, s));
      }
      n && (i = i || []).push("style", n);
      var m = i;
      (t.updateQueue = m) && (t.flags |= 4);
    }
  }, la = function(e, t, n, r) {
    n !== r && (t.flags |= 4);
  };
  function dr(e, t) {
    if (!ce) switch (e.tailMode) {
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
  function Le(e) {
    var t = e.alternate !== null && e.alternate.child === e.child, n = 0, r = 0;
    if (t) for (var l = e.child; l !== null; ) n |= l.lanes | l.childLanes, r |= l.subtreeFlags & 14680064, r |= l.flags & 14680064, l.return = e, l = l.sibling;
    else for (l = e.child; l !== null; ) n |= l.lanes | l.childLanes, r |= l.subtreeFlags, r |= l.flags, l.return = e, l = l.sibling;
    return e.subtreeFlags |= r, e.childLanes = n, t;
  }
  function mf(e, t, n) {
    var r = t.pendingProps;
    switch (ji(t), t.tag) {
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
        return Le(t), null;
      case 1:
        return Ae(t.type) && Yr(), Le(t), null;
      case 3:
        return r = t.stateNode, jn(), se(Ue), se(Pe), $i(), r.pendingContext && (r.context = r.pendingContext, r.pendingContext = null), (e === null || e.child === null) && (qr(t) ? t.flags |= 4 : e === null || e.memoizedState.isDehydrated && (t.flags & 256) === 0 || (t.flags |= 1024, ot !== null && (go(ot), ot = null))), io(e, t), Le(t), null;
      case 5:
        Ui(t);
        var l = en(ur.current);
        if (n = t.type, e !== null && t.stateNode != null) ra(e, t, n, r, l), e.ref !== t.ref && (t.flags |= 512, t.flags |= 2097152);
        else {
          if (!r) {
            if (t.stateNode === null) throw Error(c(166));
            return Le(t), null;
          }
          if (e = en(mt.current), qr(t)) {
            r = t.stateNode, n = t.type;
            var i = t.memoizedProps;
            switch (r[ht] = t, r[nr] = i, e = (t.mode & 1) !== 0, n) {
              case "dialog":
                ue("cancel", r), ue("close", r);
                break;
              case "iframe":
              case "object":
              case "embed":
                ue("load", r);
                break;
              case "video":
              case "audio":
                for (l = 0; l < bn.length; l++) ue(bn[l], r);
                break;
              case "source":
                ue("error", r);
                break;
              case "img":
              case "image":
              case "link":
                ue(
                  "error",
                  r
                ), ue("load", r);
                break;
              case "details":
                ue("toggle", r);
                break;
              case "input":
                Uo(r, i), ue("invalid", r);
                break;
              case "select":
                r._wrapperState = { wasMultiple: !!i.multiple }, ue("invalid", r);
                break;
              case "textarea":
                Ho(r, i), ue("invalid", r);
            }
            Al(n, i), l = null;
            for (var o in i) if (i.hasOwnProperty(o)) {
              var u = i[o];
              o === "children" ? typeof u == "string" ? r.textContent !== u && (i.suppressHydrationWarning !== !0 && Wr(r.textContent, u, e), l = ["children", u]) : typeof u == "number" && r.textContent !== "" + u && (i.suppressHydrationWarning !== !0 && Wr(
                r.textContent,
                u,
                e
              ), l = ["children", "" + u]) : Q.hasOwnProperty(o) && u != null && o === "onScroll" && ue("scroll", r);
            }
            switch (n) {
              case "input":
                kr(r), $o(r, i, !0);
                break;
              case "textarea":
                kr(r), Bo(r);
                break;
              case "select":
              case "option":
                break;
              default:
                typeof i.onClick == "function" && (r.onclick = Qr);
            }
            r = l, t.updateQueue = r, r !== null && (t.flags |= 4);
          } else {
            o = l.nodeType === 9 ? l : l.ownerDocument, e === "http://www.w3.org/1999/xhtml" && (e = Wo(n)), e === "http://www.w3.org/1999/xhtml" ? n === "script" ? (e = o.createElement("div"), e.innerHTML = "<script><\/script>", e = e.removeChild(e.firstChild)) : typeof r.is == "string" ? e = o.createElement(n, { is: r.is }) : (e = o.createElement(n), n === "select" && (o = e, r.multiple ? o.multiple = !0 : r.size && (o.size = r.size))) : e = o.createElementNS(e, n), e[ht] = t, e[nr] = r, na(e, t, !1, !1), t.stateNode = e;
            e: {
              switch (o = $l(n, r), n) {
                case "dialog":
                  ue("cancel", e), ue("close", e), l = r;
                  break;
                case "iframe":
                case "object":
                case "embed":
                  ue("load", e), l = r;
                  break;
                case "video":
                case "audio":
                  for (l = 0; l < bn.length; l++) ue(bn[l], e);
                  l = r;
                  break;
                case "source":
                  ue("error", e), l = r;
                  break;
                case "img":
                case "image":
                case "link":
                  ue(
                    "error",
                    e
                  ), ue("load", e), l = r;
                  break;
                case "details":
                  ue("toggle", e), l = r;
                  break;
                case "input":
                  Uo(e, r), l = Il(e, r), ue("invalid", e);
                  break;
                case "option":
                  l = r;
                  break;
                case "select":
                  e._wrapperState = { wasMultiple: !!r.multiple }, l = P({}, r, { value: void 0 }), ue("invalid", e);
                  break;
                case "textarea":
                  Ho(e, r), l = Ol(e, r), ue("invalid", e);
                  break;
                default:
                  l = r;
              }
              Al(n, l), u = l;
              for (i in u) if (u.hasOwnProperty(i)) {
                var s = u[i];
                i === "style" ? Yo(e, s) : i === "dangerouslySetInnerHTML" ? (s = s ? s.__html : void 0, s != null && Qo(e, s)) : i === "children" ? typeof s == "string" ? (n !== "textarea" || s !== "") && In(e, s) : typeof s == "number" && In(e, "" + s) : i !== "suppressContentEditableWarning" && i !== "suppressHydrationWarning" && i !== "autoFocus" && (Q.hasOwnProperty(i) ? s != null && i === "onScroll" && ue("scroll", e) : s != null && W(e, i, s, o));
              }
              switch (n) {
                case "input":
                  kr(e), $o(e, r, !1);
                  break;
                case "textarea":
                  kr(e), Bo(e);
                  break;
                case "option":
                  r.value != null && e.setAttribute("value", "" + re(r.value));
                  break;
                case "select":
                  e.multiple = !!r.multiple, i = r.value, i != null ? sn(e, !!r.multiple, i, !1) : r.defaultValue != null && sn(
                    e,
                    !!r.multiple,
                    r.defaultValue,
                    !0
                  );
                  break;
                default:
                  typeof l.onClick == "function" && (e.onclick = Qr);
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
        return Le(t), null;
      case 6:
        if (e && t.stateNode != null) la(e, t, e.memoizedProps, r);
        else {
          if (typeof r != "string" && t.stateNode === null) throw Error(c(166));
          if (n = en(ur.current), en(mt.current), qr(t)) {
            if (r = t.stateNode, n = t.memoizedProps, r[ht] = t, (i = r.nodeValue !== n) && (e = Ye, e !== null)) switch (e.tag) {
              case 3:
                Wr(r.nodeValue, n, (e.mode & 1) !== 0);
                break;
              case 5:
                e.memoizedProps.suppressHydrationWarning !== !0 && Wr(r.nodeValue, n, (e.mode & 1) !== 0);
            }
            i && (t.flags |= 4);
          } else r = (n.nodeType === 9 ? n : n.ownerDocument).createTextNode(r), r[ht] = t, t.stateNode = r;
        }
        return Le(t), null;
      case 13:
        if (se(fe), r = t.memoizedState, e === null || e.memoizedState !== null && e.memoizedState.dehydrated !== null) {
          if (ce && Xe !== null && (t.mode & 1) !== 0 && (t.flags & 128) === 0) us(), En(), t.flags |= 98560, i = !1;
          else if (i = qr(t), r !== null && r.dehydrated !== null) {
            if (e === null) {
              if (!i) throw Error(c(318));
              if (i = t.memoizedState, i = i !== null ? i.dehydrated : null, !i) throw Error(c(317));
              i[ht] = t;
            } else En(), (t.flags & 128) === 0 && (t.memoizedState = null), t.flags |= 4;
            Le(t), i = !1;
          } else ot !== null && (go(ot), ot = null), i = !0;
          if (!i) return t.flags & 65536 ? t : null;
        }
        return (t.flags & 128) !== 0 ? (t.lanes = n, t) : (r = r !== null, r !== (e !== null && e.memoizedState !== null) && r && (t.child.flags |= 8192, (t.mode & 1) !== 0 && (e === null || (fe.current & 1) !== 0 ? ke === 0 && (ke = 3) : xo())), t.updateQueue !== null && (t.flags |= 4), Le(t), null);
      case 4:
        return jn(), io(e, t), e === null && er(t.stateNode.containerInfo), Le(t), null;
      case 10:
        return Di(t.type._context), Le(t), null;
      case 17:
        return Ae(t.type) && Yr(), Le(t), null;
      case 19:
        if (se(fe), i = t.memoizedState, i === null) return Le(t), null;
        if (r = (t.flags & 128) !== 0, o = i.rendering, o === null) if (r) dr(i, !1);
        else {
          if (ke !== 0 || e !== null && (e.flags & 128) !== 0) for (e = t.child; e !== null; ) {
            if (o = ll(e), o !== null) {
              for (t.flags |= 128, dr(i, !1), r = o.updateQueue, r !== null && (t.updateQueue = r, t.flags |= 4), t.subtreeFlags = 0, r = n, n = t.child; n !== null; ) i = n, e = r, i.flags &= 14680066, o = i.alternate, o === null ? (i.childLanes = 0, i.lanes = e, i.child = null, i.subtreeFlags = 0, i.memoizedProps = null, i.memoizedState = null, i.updateQueue = null, i.dependencies = null, i.stateNode = null) : (i.childLanes = o.childLanes, i.lanes = o.lanes, i.child = o.child, i.subtreeFlags = 0, i.deletions = null, i.memoizedProps = o.memoizedProps, i.memoizedState = o.memoizedState, i.updateQueue = o.updateQueue, i.type = o.type, e = o.dependencies, i.dependencies = e === null ? null : { lanes: e.lanes, firstContext: e.firstContext }), n = n.sibling;
              return oe(fe, fe.current & 1 | 2), t.child;
            }
            e = e.sibling;
          }
          i.tail !== null && ge() > Ln && (t.flags |= 128, r = !0, dr(i, !1), t.lanes = 4194304);
        }
        else {
          if (!r) if (e = ll(o), e !== null) {
            if (t.flags |= 128, r = !0, n = e.updateQueue, n !== null && (t.updateQueue = n, t.flags |= 4), dr(i, !0), i.tail === null && i.tailMode === "hidden" && !o.alternate && !ce) return Le(t), null;
          } else 2 * ge() - i.renderingStartTime > Ln && n !== 1073741824 && (t.flags |= 128, r = !0, dr(i, !1), t.lanes = 4194304);
          i.isBackwards ? (o.sibling = t.child, t.child = o) : (n = i.last, n !== null ? n.sibling = o : t.child = o, i.last = o);
        }
        return i.tail !== null ? (t = i.tail, i.rendering = t, i.tail = t.sibling, i.renderingStartTime = ge(), t.sibling = null, n = fe.current, oe(fe, r ? n & 1 | 2 : n & 1), t) : (Le(t), null);
      case 22:
      case 23:
        return wo(), r = t.memoizedState !== null, e !== null && e.memoizedState !== null !== r && (t.flags |= 8192), r && (t.mode & 1) !== 0 ? (Ge & 1073741824) !== 0 && (Le(t), t.subtreeFlags & 6 && (t.flags |= 8192)) : Le(t), null;
      case 24:
        return null;
      case 25:
        return null;
    }
    throw Error(c(156, t.tag));
  }
  function vf(e, t) {
    switch (ji(t), t.tag) {
      case 1:
        return Ae(t.type) && Yr(), e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
      case 3:
        return jn(), se(Ue), se(Pe), $i(), e = t.flags, (e & 65536) !== 0 && (e & 128) === 0 ? (t.flags = e & -65537 | 128, t) : null;
      case 5:
        return Ui(t), null;
      case 13:
        if (se(fe), e = t.memoizedState, e !== null && e.dehydrated !== null) {
          if (t.alternate === null) throw Error(c(340));
          En();
        }
        return e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
      case 19:
        return se(fe), null;
      case 4:
        return jn(), null;
      case 10:
        return Di(t.type._context), null;
      case 22:
      case 23:
        return wo(), null;
      case 24:
        return null;
      default:
        return null;
    }
  }
  var pl = !1, Re = !1, gf = typeof WeakSet == "function" ? WeakSet : Set, z = null;
  function Pn(e, t) {
    var n = e.ref;
    if (n !== null) if (typeof n == "function") try {
      n(null);
    } catch (r) {
      he(e, t, r);
    }
    else n.current = null;
  }
  function oo(e, t, n) {
    try {
      n();
    } catch (r) {
      he(e, t, r);
    }
  }
  var ia = !1;
  function yf(e, t) {
    if (yi = Dr, e = Ou(), ci(e)) {
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
          var o = 0, u = -1, s = -1, m = 0, w = 0, x = e, g = null;
          t: for (; ; ) {
            for (var N; x !== n || l !== 0 && x.nodeType !== 3 || (u = o + l), x !== i || r !== 0 && x.nodeType !== 3 || (s = o + r), x.nodeType === 3 && (o += x.nodeValue.length), (N = x.firstChild) !== null; )
              g = x, x = N;
            for (; ; ) {
              if (x === e) break t;
              if (g === n && ++m === l && (u = o), g === i && ++w === r && (s = o), (N = x.nextSibling) !== null) break;
              x = g, g = x.parentNode;
            }
            x = N;
          }
          n = u === -1 || s === -1 ? null : { start: u, end: s };
        } else n = null;
      }
      n = n || { start: 0, end: 0 };
    } else n = null;
    for (wi = { focusedElem: e, selectionRange: n }, Dr = !1, z = t; z !== null; ) if (t = z, e = t.child, (t.subtreeFlags & 1028) !== 0 && e !== null) e.return = t, z = e;
    else for (; z !== null; ) {
      t = z;
      try {
        var T = t.alternate;
        if ((t.flags & 1024) !== 0) switch (t.tag) {
          case 0:
          case 11:
          case 15:
            break;
          case 1:
            if (T !== null) {
              var L = T.memoizedProps, ye = T.memoizedState, p = t.stateNode, a = p.getSnapshotBeforeUpdate(t.elementType === t.type ? L : ut(t.type, L), ye);
              p.__reactInternalSnapshotBeforeUpdate = a;
            }
            break;
          case 3:
            var h = t.stateNode.containerInfo;
            h.nodeType === 1 ? h.textContent = "" : h.nodeType === 9 && h.documentElement && h.removeChild(h.documentElement);
            break;
          case 5:
          case 6:
          case 4:
          case 17:
            break;
          default:
            throw Error(c(163));
        }
      } catch (k) {
        he(t, t.return, k);
      }
      if (e = t.sibling, e !== null) {
        e.return = t.return, z = e;
        break;
      }
      z = t.return;
    }
    return T = ia, ia = !1, T;
  }
  function pr(e, t, n) {
    var r = t.updateQueue;
    if (r = r !== null ? r.lastEffect : null, r !== null) {
      var l = r = r.next;
      do {
        if ((l.tag & e) === e) {
          var i = l.destroy;
          l.destroy = void 0, i !== void 0 && oo(t, n, i);
        }
        l = l.next;
      } while (l !== r);
    }
  }
  function hl(e, t) {
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
  function uo(e) {
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
  function oa(e) {
    var t = e.alternate;
    t !== null && (e.alternate = null, oa(t)), e.child = null, e.deletions = null, e.sibling = null, e.tag === 5 && (t = e.stateNode, t !== null && (delete t[ht], delete t[nr], delete t[Ei], delete t[bc], delete t[ef])), e.stateNode = null, e.return = null, e.dependencies = null, e.memoizedProps = null, e.memoizedState = null, e.pendingProps = null, e.stateNode = null, e.updateQueue = null;
  }
  function ua(e) {
    return e.tag === 5 || e.tag === 3 || e.tag === 4;
  }
  function sa(e) {
    e: for (; ; ) {
      for (; e.sibling === null; ) {
        if (e.return === null || ua(e.return)) return null;
        e = e.return;
      }
      for (e.sibling.return = e.return, e = e.sibling; e.tag !== 5 && e.tag !== 6 && e.tag !== 18; ) {
        if (e.flags & 2 || e.child === null || e.tag === 4) continue e;
        e.child.return = e, e = e.child;
      }
      if (!(e.flags & 2)) return e.stateNode;
    }
  }
  function so(e, t, n) {
    var r = e.tag;
    if (r === 5 || r === 6) e = e.stateNode, t ? n.nodeType === 8 ? n.parentNode.insertBefore(e, t) : n.insertBefore(e, t) : (n.nodeType === 8 ? (t = n.parentNode, t.insertBefore(e, n)) : (t = n, t.appendChild(e)), n = n._reactRootContainer, n != null || t.onclick !== null || (t.onclick = Qr));
    else if (r !== 4 && (e = e.child, e !== null)) for (so(e, t, n), e = e.sibling; e !== null; ) so(e, t, n), e = e.sibling;
  }
  function ao(e, t, n) {
    var r = e.tag;
    if (r === 5 || r === 6) e = e.stateNode, t ? n.insertBefore(e, t) : n.appendChild(e);
    else if (r !== 4 && (e = e.child, e !== null)) for (ao(e, t, n), e = e.sibling; e !== null; ) ao(e, t, n), e = e.sibling;
  }
  var Ne = null, st = !1;
  function $t(e, t, n) {
    for (n = n.child; n !== null; ) aa(e, t, n), n = n.sibling;
  }
  function aa(e, t, n) {
    if (pt && typeof pt.onCommitFiberUnmount == "function") try {
      pt.onCommitFiberUnmount(jr, n);
    } catch {
    }
    switch (n.tag) {
      case 5:
        Re || Pn(n, t);
      case 6:
        var r = Ne, l = st;
        Ne = null, $t(e, t, n), Ne = r, st = l, Ne !== null && (st ? (e = Ne, n = n.stateNode, e.nodeType === 8 ? e.parentNode.removeChild(n) : e.removeChild(n)) : Ne.removeChild(n.stateNode));
        break;
      case 18:
        Ne !== null && (st ? (e = Ne, n = n.stateNode, e.nodeType === 8 ? Si(e.parentNode, n) : e.nodeType === 1 && Si(e, n), Qn(e)) : Si(Ne, n.stateNode));
        break;
      case 4:
        r = Ne, l = st, Ne = n.stateNode.containerInfo, st = !0, $t(e, t, n), Ne = r, st = l;
        break;
      case 0:
      case 11:
      case 14:
      case 15:
        if (!Re && (r = n.updateQueue, r !== null && (r = r.lastEffect, r !== null))) {
          l = r = r.next;
          do {
            var i = l, o = i.destroy;
            i = i.tag, o !== void 0 && ((i & 2) !== 0 || (i & 4) !== 0) && oo(n, t, o), l = l.next;
          } while (l !== r);
        }
        $t(e, t, n);
        break;
      case 1:
        if (!Re && (Pn(n, t), r = n.stateNode, typeof r.componentWillUnmount == "function")) try {
          r.props = n.memoizedProps, r.state = n.memoizedState, r.componentWillUnmount();
        } catch (u) {
          he(n, t, u);
        }
        $t(e, t, n);
        break;
      case 21:
        $t(e, t, n);
        break;
      case 22:
        n.mode & 1 ? (Re = (r = Re) || n.memoizedState !== null, $t(e, t, n), Re = r) : $t(e, t, n);
        break;
      default:
        $t(e, t, n);
    }
  }
  function ca(e) {
    var t = e.updateQueue;
    if (t !== null) {
      e.updateQueue = null;
      var n = e.stateNode;
      n === null && (n = e.stateNode = new gf()), t.forEach(function(r) {
        var l = jf.bind(null, e, r);
        n.has(r) || (n.add(r), r.then(l, l));
      });
    }
  }
  function at(e, t) {
    var n = t.deletions;
    if (n !== null) for (var r = 0; r < n.length; r++) {
      var l = n[r];
      try {
        var i = e, o = t, u = o;
        e: for (; u !== null; ) {
          switch (u.tag) {
            case 5:
              Ne = u.stateNode, st = !1;
              break e;
            case 3:
              Ne = u.stateNode.containerInfo, st = !0;
              break e;
            case 4:
              Ne = u.stateNode.containerInfo, st = !0;
              break e;
          }
          u = u.return;
        }
        if (Ne === null) throw Error(c(160));
        aa(i, o, l), Ne = null, st = !1;
        var s = l.alternate;
        s !== null && (s.return = null), l.return = null;
      } catch (m) {
        he(l, t, m);
      }
    }
    if (t.subtreeFlags & 12854) for (t = t.child; t !== null; ) fa(t, e), t = t.sibling;
  }
  function fa(e, t) {
    var n = e.alternate, r = e.flags;
    switch (e.tag) {
      case 0:
      case 11:
      case 14:
      case 15:
        if (at(t, e), gt(e), r & 4) {
          try {
            pr(3, e, e.return), hl(3, e);
          } catch (L) {
            he(e, e.return, L);
          }
          try {
            pr(5, e, e.return);
          } catch (L) {
            he(e, e.return, L);
          }
        }
        break;
      case 1:
        at(t, e), gt(e), r & 512 && n !== null && Pn(n, n.return);
        break;
      case 5:
        if (at(t, e), gt(e), r & 512 && n !== null && Pn(n, n.return), e.flags & 32) {
          var l = e.stateNode;
          try {
            In(l, "");
          } catch (L) {
            he(e, e.return, L);
          }
        }
        if (r & 4 && (l = e.stateNode, l != null)) {
          var i = e.memoizedProps, o = n !== null ? n.memoizedProps : i, u = e.type, s = e.updateQueue;
          if (e.updateQueue = null, s !== null) try {
            u === "input" && i.type === "radio" && i.name != null && Ao(l, i), $l(u, o);
            var m = $l(u, i);
            for (o = 0; o < s.length; o += 2) {
              var w = s[o], x = s[o + 1];
              w === "style" ? Yo(l, x) : w === "dangerouslySetInnerHTML" ? Qo(l, x) : w === "children" ? In(l, x) : W(l, w, x, m);
            }
            switch (u) {
              case "input":
                Ml(l, i);
                break;
              case "textarea":
                Vo(l, i);
                break;
              case "select":
                var g = l._wrapperState.wasMultiple;
                l._wrapperState.wasMultiple = !!i.multiple;
                var N = i.value;
                N != null ? sn(l, !!i.multiple, N, !1) : g !== !!i.multiple && (i.defaultValue != null ? sn(
                  l,
                  !!i.multiple,
                  i.defaultValue,
                  !0
                ) : sn(l, !!i.multiple, i.multiple ? [] : "", !1));
            }
            l[nr] = i;
          } catch (L) {
            he(e, e.return, L);
          }
        }
        break;
      case 6:
        if (at(t, e), gt(e), r & 4) {
          if (e.stateNode === null) throw Error(c(162));
          l = e.stateNode, i = e.memoizedProps;
          try {
            l.nodeValue = i;
          } catch (L) {
            he(e, e.return, L);
          }
        }
        break;
      case 3:
        if (at(t, e), gt(e), r & 4 && n !== null && n.memoizedState.isDehydrated) try {
          Qn(t.containerInfo);
        } catch (L) {
          he(e, e.return, L);
        }
        break;
      case 4:
        at(t, e), gt(e);
        break;
      case 13:
        at(t, e), gt(e), l = e.child, l.flags & 8192 && (i = l.memoizedState !== null, l.stateNode.isHidden = i, !i || l.alternate !== null && l.alternate.memoizedState !== null || (po = ge())), r & 4 && ca(e);
        break;
      case 22:
        if (w = n !== null && n.memoizedState !== null, e.mode & 1 ? (Re = (m = Re) || w, at(t, e), Re = m) : at(t, e), gt(e), r & 8192) {
          if (m = e.memoizedState !== null, (e.stateNode.isHidden = m) && !w && (e.mode & 1) !== 0) for (z = e, w = e.child; w !== null; ) {
            for (x = z = w; z !== null; ) {
              switch (g = z, N = g.child, g.tag) {
                case 0:
                case 11:
                case 14:
                case 15:
                  pr(4, g, g.return);
                  break;
                case 1:
                  Pn(g, g.return);
                  var T = g.stateNode;
                  if (typeof T.componentWillUnmount == "function") {
                    r = g, n = g.return;
                    try {
                      t = r, T.props = t.memoizedProps, T.state = t.memoizedState, T.componentWillUnmount();
                    } catch (L) {
                      he(r, n, L);
                    }
                  }
                  break;
                case 5:
                  Pn(g, g.return);
                  break;
                case 22:
                  if (g.memoizedState !== null) {
                    ha(x);
                    continue;
                  }
              }
              N !== null ? (N.return = g, z = N) : ha(x);
            }
            w = w.sibling;
          }
          e: for (w = null, x = e; ; ) {
            if (x.tag === 5) {
              if (w === null) {
                w = x;
                try {
                  l = x.stateNode, m ? (i = l.style, typeof i.setProperty == "function" ? i.setProperty("display", "none", "important") : i.display = "none") : (u = x.stateNode, s = x.memoizedProps.style, o = s != null && s.hasOwnProperty("display") ? s.display : null, u.style.display = Ko("display", o));
                } catch (L) {
                  he(e, e.return, L);
                }
              }
            } else if (x.tag === 6) {
              if (w === null) try {
                x.stateNode.nodeValue = m ? "" : x.memoizedProps;
              } catch (L) {
                he(e, e.return, L);
              }
            } else if ((x.tag !== 22 && x.tag !== 23 || x.memoizedState === null || x === e) && x.child !== null) {
              x.child.return = x, x = x.child;
              continue;
            }
            if (x === e) break e;
            for (; x.sibling === null; ) {
              if (x.return === null || x.return === e) break e;
              w === x && (w = null), x = x.return;
            }
            w === x && (w = null), x.sibling.return = x.return, x = x.sibling;
          }
        }
        break;
      case 19:
        at(t, e), gt(e), r & 4 && ca(e);
        break;
      case 21:
        break;
      default:
        at(
          t,
          e
        ), gt(e);
    }
  }
  function gt(e) {
    var t = e.flags;
    if (t & 2) {
      try {
        e: {
          for (var n = e.return; n !== null; ) {
            if (ua(n)) {
              var r = n;
              break e;
            }
            n = n.return;
          }
          throw Error(c(160));
        }
        switch (r.tag) {
          case 5:
            var l = r.stateNode;
            r.flags & 32 && (In(l, ""), r.flags &= -33);
            var i = sa(e);
            ao(e, i, l);
            break;
          case 3:
          case 4:
            var o = r.stateNode.containerInfo, u = sa(e);
            so(e, u, o);
            break;
          default:
            throw Error(c(161));
        }
      } catch (s) {
        he(e, e.return, s);
      }
      e.flags &= -3;
    }
    t & 4096 && (e.flags &= -4097);
  }
  function wf(e, t, n) {
    z = e, da(e);
  }
  function da(e, t, n) {
    for (var r = (e.mode & 1) !== 0; z !== null; ) {
      var l = z, i = l.child;
      if (l.tag === 22 && r) {
        var o = l.memoizedState !== null || pl;
        if (!o) {
          var u = l.alternate, s = u !== null && u.memoizedState !== null || Re;
          u = pl;
          var m = Re;
          if (pl = o, (Re = s) && !m) for (z = l; z !== null; ) o = z, s = o.child, o.tag === 22 && o.memoizedState !== null ? ma(l) : s !== null ? (s.return = o, z = s) : ma(l);
          for (; i !== null; ) z = i, da(i), i = i.sibling;
          z = l, pl = u, Re = m;
        }
        pa(e);
      } else (l.subtreeFlags & 8772) !== 0 && i !== null ? (i.return = l, z = i) : pa(e);
    }
  }
  function pa(e) {
    for (; z !== null; ) {
      var t = z;
      if ((t.flags & 8772) !== 0) {
        var n = t.alternate;
        try {
          if ((t.flags & 8772) !== 0) switch (t.tag) {
            case 0:
            case 11:
            case 15:
              Re || hl(5, t);
              break;
            case 1:
              var r = t.stateNode;
              if (t.flags & 4 && !Re) if (n === null) r.componentDidMount();
              else {
                var l = t.elementType === t.type ? n.memoizedProps : ut(t.type, n.memoizedProps);
                r.componentDidUpdate(l, n.memoizedState, r.__reactInternalSnapshotBeforeUpdate);
              }
              var i = t.updateQueue;
              i !== null && hs(t, i, r);
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
                hs(t, o, n);
              }
              break;
            case 5:
              var u = t.stateNode;
              if (n === null && t.flags & 4) {
                n = u;
                var s = t.memoizedProps;
                switch (t.type) {
                  case "button":
                  case "input":
                  case "select":
                  case "textarea":
                    s.autoFocus && n.focus();
                    break;
                  case "img":
                    s.src && (n.src = s.src);
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
                var m = t.alternate;
                if (m !== null) {
                  var w = m.memoizedState;
                  if (w !== null) {
                    var x = w.dehydrated;
                    x !== null && Qn(x);
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
              throw Error(c(163));
          }
          Re || t.flags & 512 && uo(t);
        } catch (g) {
          he(t, t.return, g);
        }
      }
      if (t === e) {
        z = null;
        break;
      }
      if (n = t.sibling, n !== null) {
        n.return = t.return, z = n;
        break;
      }
      z = t.return;
    }
  }
  function ha(e) {
    for (; z !== null; ) {
      var t = z;
      if (t === e) {
        z = null;
        break;
      }
      var n = t.sibling;
      if (n !== null) {
        n.return = t.return, z = n;
        break;
      }
      z = t.return;
    }
  }
  function ma(e) {
    for (; z !== null; ) {
      var t = z;
      try {
        switch (t.tag) {
          case 0:
          case 11:
          case 15:
            var n = t.return;
            try {
              hl(4, t);
            } catch (s) {
              he(t, n, s);
            }
            break;
          case 1:
            var r = t.stateNode;
            if (typeof r.componentDidMount == "function") {
              var l = t.return;
              try {
                r.componentDidMount();
              } catch (s) {
                he(t, l, s);
              }
            }
            var i = t.return;
            try {
              uo(t);
            } catch (s) {
              he(t, i, s);
            }
            break;
          case 5:
            var o = t.return;
            try {
              uo(t);
            } catch (s) {
              he(t, o, s);
            }
        }
      } catch (s) {
        he(t, t.return, s);
      }
      if (t === e) {
        z = null;
        break;
      }
      var u = t.sibling;
      if (u !== null) {
        u.return = t.return, z = u;
        break;
      }
      z = t.return;
    }
  }
  var xf = Math.ceil, ml = ne.ReactCurrentDispatcher, co = ne.ReactCurrentOwner, tt = ne.ReactCurrentBatchConfig, J = 0, Ee = null, we = null, je = 0, Ge = 0, Tn = Mt(0), ke = 0, hr = null, nn = 0, vl = 0, fo = 0, mr = null, He = null, po = 0, Ln = 1 / 0, Nt = null, gl = !1, ho = null, Ht = null, yl = !1, Vt = null, wl = 0, vr = 0, mo = null, xl = -1, kl = 0;
  function Me() {
    return (J & 6) !== 0 ? ge() : xl !== -1 ? xl : xl = ge();
  }
  function Bt(e) {
    return (e.mode & 1) === 0 ? 1 : (J & 2) !== 0 && je !== 0 ? je & -je : nf.transition !== null ? (kl === 0 && (kl = su()), kl) : (e = le, e !== 0 || (e = window.event, e = e === void 0 ? 16 : gu(e.type)), e);
  }
  function ct(e, t, n, r) {
    if (50 < vr) throw vr = 0, mo = null, Error(c(185));
    $n(e, n, r), ((J & 2) === 0 || e !== Ee) && (e === Ee && ((J & 2) === 0 && (vl |= n), ke === 4 && Wt(e, je)), Ve(e, r), n === 1 && J === 0 && (t.mode & 1) === 0 && (Ln = ge() + 500, Gr && Ot()));
  }
  function Ve(e, t) {
    var n = e.callbackNode;
    nc(e, t);
    var r = Tr(e, e === Ee ? je : 0);
    if (r === 0) n !== null && iu(n), e.callbackNode = null, e.callbackPriority = 0;
    else if (t = r & -r, e.callbackPriority !== t) {
      if (n != null && iu(n), t === 1) e.tag === 0 ? tf(ga.bind(null, e)) : ns(ga.bind(null, e)), Jc(function() {
        (J & 6) === 0 && Ot();
      }), n = null;
      else {
        switch (au(r)) {
          case 1:
            n = Yl;
            break;
          case 4:
            n = ou;
            break;
          case 16:
            n = Nr;
            break;
          case 536870912:
            n = uu;
            break;
          default:
            n = Nr;
        }
        n = Ca(n, va.bind(null, e));
      }
      e.callbackPriority = t, e.callbackNode = n;
    }
  }
  function va(e, t) {
    if (xl = -1, kl = 0, (J & 6) !== 0) throw Error(c(327));
    var n = e.callbackNode;
    if (Rn() && e.callbackNode !== n) return null;
    var r = Tr(e, e === Ee ? je : 0);
    if (r === 0) return null;
    if ((r & 30) !== 0 || (r & e.expiredLanes) !== 0 || t) t = Sl(e, r);
    else {
      t = r;
      var l = J;
      J |= 2;
      var i = wa();
      (Ee !== e || je !== t) && (Nt = null, Ln = ge() + 500, ln(e, t));
      do
        try {
          Ef();
          break;
        } catch (u) {
          ya(e, u);
        }
      while (!0);
      Ri(), ml.current = i, J = l, we !== null ? t = 0 : (Ee = null, je = 0, t = ke);
    }
    if (t !== 0) {
      if (t === 2 && (l = Xl(e), l !== 0 && (r = l, t = vo(e, l))), t === 1) throw n = hr, ln(e, 0), Wt(e, r), Ve(e, ge()), n;
      if (t === 6) Wt(e, r);
      else {
        if (l = e.current.alternate, (r & 30) === 0 && !kf(l) && (t = Sl(e, r), t === 2 && (i = Xl(e), i !== 0 && (r = i, t = vo(e, i))), t === 1)) throw n = hr, ln(e, 0), Wt(e, r), Ve(e, ge()), n;
        switch (e.finishedWork = l, e.finishedLanes = r, t) {
          case 0:
          case 1:
            throw Error(c(345));
          case 2:
            on(e, He, Nt);
            break;
          case 3:
            if (Wt(e, r), (r & 130023424) === r && (t = po + 500 - ge(), 10 < t)) {
              if (Tr(e, 0) !== 0) break;
              if (l = e.suspendedLanes, (l & r) !== r) {
                Me(), e.pingedLanes |= e.suspendedLanes & l;
                break;
              }
              e.timeoutHandle = ki(on.bind(null, e, He, Nt), t);
              break;
            }
            on(e, He, Nt);
            break;
          case 4:
            if (Wt(e, r), (r & 4194240) === r) break;
            for (t = e.eventTimes, l = -1; 0 < r; ) {
              var o = 31 - lt(r);
              i = 1 << o, o = t[o], o > l && (l = o), r &= ~i;
            }
            if (r = l, r = ge() - r, r = (120 > r ? 120 : 480 > r ? 480 : 1080 > r ? 1080 : 1920 > r ? 1920 : 3e3 > r ? 3e3 : 4320 > r ? 4320 : 1960 * xf(r / 1960)) - r, 10 < r) {
              e.timeoutHandle = ki(on.bind(null, e, He, Nt), r);
              break;
            }
            on(e, He, Nt);
            break;
          case 5:
            on(e, He, Nt);
            break;
          default:
            throw Error(c(329));
        }
      }
    }
    return Ve(e, ge()), e.callbackNode === n ? va.bind(null, e) : null;
  }
  function vo(e, t) {
    var n = mr;
    return e.current.memoizedState.isDehydrated && (ln(e, t).flags |= 256), e = Sl(e, t), e !== 2 && (t = He, He = n, t !== null && go(t)), e;
  }
  function go(e) {
    He === null ? He = e : He.push.apply(He, e);
  }
  function kf(e) {
    for (var t = e; ; ) {
      if (t.flags & 16384) {
        var n = t.updateQueue;
        if (n !== null && (n = n.stores, n !== null)) for (var r = 0; r < n.length; r++) {
          var l = n[r], i = l.getSnapshot;
          l = l.value;
          try {
            if (!it(i(), l)) return !1;
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
  function Wt(e, t) {
    for (t &= ~fo, t &= ~vl, e.suspendedLanes |= t, e.pingedLanes &= ~t, e = e.expirationTimes; 0 < t; ) {
      var n = 31 - lt(t), r = 1 << n;
      e[n] = -1, t &= ~r;
    }
  }
  function ga(e) {
    if ((J & 6) !== 0) throw Error(c(327));
    Rn();
    var t = Tr(e, 0);
    if ((t & 1) === 0) return Ve(e, ge()), null;
    var n = Sl(e, t);
    if (e.tag !== 0 && n === 2) {
      var r = Xl(e);
      r !== 0 && (t = r, n = vo(e, r));
    }
    if (n === 1) throw n = hr, ln(e, 0), Wt(e, t), Ve(e, ge()), n;
    if (n === 6) throw Error(c(345));
    return e.finishedWork = e.current.alternate, e.finishedLanes = t, on(e, He, Nt), Ve(e, ge()), null;
  }
  function yo(e, t) {
    var n = J;
    J |= 1;
    try {
      return e(t);
    } finally {
      J = n, J === 0 && (Ln = ge() + 500, Gr && Ot());
    }
  }
  function rn(e) {
    Vt !== null && Vt.tag === 0 && (J & 6) === 0 && Rn();
    var t = J;
    J |= 1;
    var n = tt.transition, r = le;
    try {
      if (tt.transition = null, le = 1, e) return e();
    } finally {
      le = r, tt.transition = n, J = t, (J & 6) === 0 && Ot();
    }
  }
  function wo() {
    Ge = Tn.current, se(Tn);
  }
  function ln(e, t) {
    e.finishedWork = null, e.finishedLanes = 0;
    var n = e.timeoutHandle;
    if (n !== -1 && (e.timeoutHandle = -1, Zc(n)), we !== null) for (n = we.return; n !== null; ) {
      var r = n;
      switch (ji(r), r.tag) {
        case 1:
          r = r.type.childContextTypes, r != null && Yr();
          break;
        case 3:
          jn(), se(Ue), se(Pe), $i();
          break;
        case 5:
          Ui(r);
          break;
        case 4:
          jn();
          break;
        case 13:
          se(fe);
          break;
        case 19:
          se(fe);
          break;
        case 10:
          Di(r.type._context);
          break;
        case 22:
        case 23:
          wo();
      }
      n = n.return;
    }
    if (Ee = e, we = e = Qt(e.current, null), je = Ge = t, ke = 0, hr = null, fo = vl = nn = 0, He = mr = null, bt !== null) {
      for (t = 0; t < bt.length; t++) if (n = bt[t], r = n.interleaved, r !== null) {
        n.interleaved = null;
        var l = r.next, i = n.pending;
        if (i !== null) {
          var o = i.next;
          i.next = l, r.next = o;
        }
        n.pending = r;
      }
      bt = null;
    }
    return e;
  }
  function ya(e, t) {
    do {
      var n = we;
      try {
        if (Ri(), il.current = al, ol) {
          for (var r = de.memoizedState; r !== null; ) {
            var l = r.queue;
            l !== null && (l.pending = null), r = r.next;
          }
          ol = !1;
        }
        if (tn = 0, Se = xe = de = null, sr = !1, ar = 0, co.current = null, n === null || n.return === null) {
          ke = 1, hr = t, we = null;
          break;
        }
        e: {
          var i = e, o = n.return, u = n, s = t;
          if (t = je, u.flags |= 32768, s !== null && typeof s == "object" && typeof s.then == "function") {
            var m = s, w = u, x = w.tag;
            if ((w.mode & 1) === 0 && (x === 0 || x === 11 || x === 15)) {
              var g = w.alternate;
              g ? (w.updateQueue = g.updateQueue, w.memoizedState = g.memoizedState, w.lanes = g.lanes) : (w.updateQueue = null, w.memoizedState = null);
            }
            var N = Bs(o);
            if (N !== null) {
              N.flags &= -257, Ws(N, o, u, i, t), N.mode & 1 && Vs(i, m, t), t = N, s = m;
              var T = t.updateQueue;
              if (T === null) {
                var L = /* @__PURE__ */ new Set();
                L.add(s), t.updateQueue = L;
              } else T.add(s);
              break e;
            } else {
              if ((t & 1) === 0) {
                Vs(i, m, t), xo();
                break e;
              }
              s = Error(c(426));
            }
          } else if (ce && u.mode & 1) {
            var ye = Bs(o);
            if (ye !== null) {
              (ye.flags & 65536) === 0 && (ye.flags |= 256), Ws(ye, o, u, i, t), Ti(zn(s, u));
              break e;
            }
          }
          i = s = zn(s, u), ke !== 4 && (ke = 2), mr === null ? mr = [i] : mr.push(i), i = o;
          do {
            switch (i.tag) {
              case 3:
                i.flags |= 65536, t &= -t, i.lanes |= t;
                var p = $s(i, s, t);
                ps(i, p);
                break e;
              case 1:
                u = s;
                var a = i.type, h = i.stateNode;
                if ((i.flags & 128) === 0 && (typeof a.getDerivedStateFromError == "function" || h !== null && typeof h.componentDidCatch == "function" && (Ht === null || !Ht.has(h)))) {
                  i.flags |= 65536, t &= -t, i.lanes |= t;
                  var k = Hs(i, u, t);
                  ps(i, k);
                  break e;
                }
            }
            i = i.return;
          } while (i !== null);
        }
        ka(n);
      } catch (D) {
        t = D, we === n && n !== null && (we = n = n.return);
        continue;
      }
      break;
    } while (!0);
  }
  function wa() {
    var e = ml.current;
    return ml.current = al, e === null ? al : e;
  }
  function xo() {
    (ke === 0 || ke === 3 || ke === 2) && (ke = 4), Ee === null || (nn & 268435455) === 0 && (vl & 268435455) === 0 || Wt(Ee, je);
  }
  function Sl(e, t) {
    var n = J;
    J |= 2;
    var r = wa();
    (Ee !== e || je !== t) && (Nt = null, ln(e, t));
    do
      try {
        Sf();
        break;
      } catch (l) {
        ya(e, l);
      }
    while (!0);
    if (Ri(), J = n, ml.current = r, we !== null) throw Error(c(261));
    return Ee = null, je = 0, ke;
  }
  function Sf() {
    for (; we !== null; ) xa(we);
  }
  function Ef() {
    for (; we !== null && !Ya(); ) xa(we);
  }
  function xa(e) {
    var t = _a(e.alternate, e, Ge);
    e.memoizedProps = e.pendingProps, t === null ? ka(e) : we = t, co.current = null;
  }
  function ka(e) {
    var t = e;
    do {
      var n = t.alternate;
      if (e = t.return, (t.flags & 32768) === 0) {
        if (n = mf(n, t, Ge), n !== null) {
          we = n;
          return;
        }
      } else {
        if (n = vf(n, t), n !== null) {
          n.flags &= 32767, we = n;
          return;
        }
        if (e !== null) e.flags |= 32768, e.subtreeFlags = 0, e.deletions = null;
        else {
          ke = 6, we = null;
          return;
        }
      }
      if (t = t.sibling, t !== null) {
        we = t;
        return;
      }
      we = t = e;
    } while (t !== null);
    ke === 0 && (ke = 5);
  }
  function on(e, t, n) {
    var r = le, l = tt.transition;
    try {
      tt.transition = null, le = 1, _f(e, t, n, r);
    } finally {
      tt.transition = l, le = r;
    }
    return null;
  }
  function _f(e, t, n, r) {
    do
      Rn();
    while (Vt !== null);
    if ((J & 6) !== 0) throw Error(c(327));
    n = e.finishedWork;
    var l = e.finishedLanes;
    if (n === null) return null;
    if (e.finishedWork = null, e.finishedLanes = 0, n === e.current) throw Error(c(177));
    e.callbackNode = null, e.callbackPriority = 0;
    var i = n.lanes | n.childLanes;
    if (rc(e, i), e === Ee && (we = Ee = null, je = 0), (n.subtreeFlags & 2064) === 0 && (n.flags & 2064) === 0 || yl || (yl = !0, Ca(Nr, function() {
      return Rn(), null;
    })), i = (n.flags & 15990) !== 0, (n.subtreeFlags & 15990) !== 0 || i) {
      i = tt.transition, tt.transition = null;
      var o = le;
      le = 1;
      var u = J;
      J |= 4, co.current = null, yf(e, n), fa(n, e), Bc(wi), Dr = !!yi, wi = yi = null, e.current = n, wf(n), Xa(), J = u, le = o, tt.transition = i;
    } else e.current = n;
    if (yl && (yl = !1, Vt = e, wl = l), i = e.pendingLanes, i === 0 && (Ht = null), Ja(n.stateNode), Ve(e, ge()), t !== null) for (r = e.onRecoverableError, n = 0; n < t.length; n++) l = t[n], r(l.value, { componentStack: l.stack, digest: l.digest });
    if (gl) throw gl = !1, e = ho, ho = null, e;
    return (wl & 1) !== 0 && e.tag !== 0 && Rn(), i = e.pendingLanes, (i & 1) !== 0 ? e === mo ? vr++ : (vr = 0, mo = e) : vr = 0, Ot(), null;
  }
  function Rn() {
    if (Vt !== null) {
      var e = au(wl), t = tt.transition, n = le;
      try {
        if (tt.transition = null, le = 16 > e ? 16 : e, Vt === null) var r = !1;
        else {
          if (e = Vt, Vt = null, wl = 0, (J & 6) !== 0) throw Error(c(331));
          var l = J;
          for (J |= 4, z = e.current; z !== null; ) {
            var i = z, o = i.child;
            if ((z.flags & 16) !== 0) {
              var u = i.deletions;
              if (u !== null) {
                for (var s = 0; s < u.length; s++) {
                  var m = u[s];
                  for (z = m; z !== null; ) {
                    var w = z;
                    switch (w.tag) {
                      case 0:
                      case 11:
                      case 15:
                        pr(8, w, i);
                    }
                    var x = w.child;
                    if (x !== null) x.return = w, z = x;
                    else for (; z !== null; ) {
                      w = z;
                      var g = w.sibling, N = w.return;
                      if (oa(w), w === m) {
                        z = null;
                        break;
                      }
                      if (g !== null) {
                        g.return = N, z = g;
                        break;
                      }
                      z = N;
                    }
                  }
                }
                var T = i.alternate;
                if (T !== null) {
                  var L = T.child;
                  if (L !== null) {
                    T.child = null;
                    do {
                      var ye = L.sibling;
                      L.sibling = null, L = ye;
                    } while (L !== null);
                  }
                }
                z = i;
              }
            }
            if ((i.subtreeFlags & 2064) !== 0 && o !== null) o.return = i, z = o;
            else e: for (; z !== null; ) {
              if (i = z, (i.flags & 2048) !== 0) switch (i.tag) {
                case 0:
                case 11:
                case 15:
                  pr(9, i, i.return);
              }
              var p = i.sibling;
              if (p !== null) {
                p.return = i.return, z = p;
                break e;
              }
              z = i.return;
            }
          }
          var a = e.current;
          for (z = a; z !== null; ) {
            o = z;
            var h = o.child;
            if ((o.subtreeFlags & 2064) !== 0 && h !== null) h.return = o, z = h;
            else e: for (o = a; z !== null; ) {
              if (u = z, (u.flags & 2048) !== 0) try {
                switch (u.tag) {
                  case 0:
                  case 11:
                  case 15:
                    hl(9, u);
                }
              } catch (D) {
                he(u, u.return, D);
              }
              if (u === o) {
                z = null;
                break e;
              }
              var k = u.sibling;
              if (k !== null) {
                k.return = u.return, z = k;
                break e;
              }
              z = u.return;
            }
          }
          if (J = l, Ot(), pt && typeof pt.onPostCommitFiberRoot == "function") try {
            pt.onPostCommitFiberRoot(jr, e);
          } catch {
          }
          r = !0;
        }
        return r;
      } finally {
        le = n, tt.transition = t;
      }
    }
    return !1;
  }
  function Sa(e, t, n) {
    t = zn(n, t), t = $s(e, t, 1), e = At(e, t, 1), t = Me(), e !== null && ($n(e, 1, t), Ve(e, t));
  }
  function he(e, t, n) {
    if (e.tag === 3) Sa(e, e, n);
    else for (; t !== null; ) {
      if (t.tag === 3) {
        Sa(t, e, n);
        break;
      } else if (t.tag === 1) {
        var r = t.stateNode;
        if (typeof t.type.getDerivedStateFromError == "function" || typeof r.componentDidCatch == "function" && (Ht === null || !Ht.has(r))) {
          e = zn(n, e), e = Hs(t, e, 1), t = At(t, e, 1), e = Me(), t !== null && ($n(t, 1, e), Ve(t, e));
          break;
        }
      }
      t = t.return;
    }
  }
  function Cf(e, t, n) {
    var r = e.pingCache;
    r !== null && r.delete(t), t = Me(), e.pingedLanes |= e.suspendedLanes & n, Ee === e && (je & n) === n && (ke === 4 || ke === 3 && (je & 130023424) === je && 500 > ge() - po ? ln(e, 0) : fo |= n), Ve(e, t);
  }
  function Ea(e, t) {
    t === 0 && ((e.mode & 1) === 0 ? t = 1 : (t = Pr, Pr <<= 1, (Pr & 130023424) === 0 && (Pr = 4194304)));
    var n = Me();
    e = Et(e, t), e !== null && ($n(e, t, n), Ve(e, n));
  }
  function Nf(e) {
    var t = e.memoizedState, n = 0;
    t !== null && (n = t.retryLane), Ea(e, n);
  }
  function jf(e, t) {
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
        throw Error(c(314));
    }
    r !== null && r.delete(t), Ea(e, n);
  }
  var _a;
  _a = function(e, t, n) {
    if (e !== null) if (e.memoizedProps !== t.pendingProps || Ue.current) $e = !0;
    else {
      if ((e.lanes & n) === 0 && (t.flags & 128) === 0) return $e = !1, hf(e, t, n);
      $e = (e.flags & 131072) !== 0;
    }
    else $e = !1, ce && (t.flags & 1048576) !== 0 && rs(t, Jr, t.index);
    switch (t.lanes = 0, t.tag) {
      case 2:
        var r = t.type;
        dl(e, t), e = t.pendingProps;
        var l = xn(t, Pe.current);
        Nn(t, n), l = Bi(null, t, r, e, l, n);
        var i = Wi();
        return t.flags |= 1, typeof l == "object" && l !== null && typeof l.render == "function" && l.$$typeof === void 0 ? (t.tag = 1, t.memoizedState = null, t.updateQueue = null, Ae(r) ? (i = !0, Xr(t)) : i = !1, t.memoizedState = l.state !== null && l.state !== void 0 ? l.state : null, Fi(t), l.updater = cl, t.stateNode = l, l._reactInternals = t, Zi(t, r, e, n), t = eo(null, t, r, !0, i, n)) : (t.tag = 0, ce && i && Ni(t), Ie(null, t, l, n), t = t.child), t;
      case 16:
        r = t.elementType;
        e: {
          switch (dl(e, t), e = t.pendingProps, l = r._init, r = l(r._payload), t.type = r, l = t.tag = Pf(r), e = ut(r, e), l) {
            case 0:
              t = bi(null, t, r, e, n);
              break e;
            case 1:
              t = Zs(null, t, r, e, n);
              break e;
            case 11:
              t = Qs(null, t, r, e, n);
              break e;
            case 14:
              t = Ks(null, t, r, ut(r.type, e), n);
              break e;
          }
          throw Error(c(
            306,
            r,
            ""
          ));
        }
        return t;
      case 0:
        return r = t.type, l = t.pendingProps, l = t.elementType === r ? l : ut(r, l), bi(e, t, r, l, n);
      case 1:
        return r = t.type, l = t.pendingProps, l = t.elementType === r ? l : ut(r, l), Zs(e, t, r, l, n);
      case 3:
        e: {
          if (Js(t), e === null) throw Error(c(387));
          r = t.pendingProps, i = t.memoizedState, l = i.element, ds(e, t), rl(t, r, null, n);
          var o = t.memoizedState;
          if (r = o.element, i.isDehydrated) if (i = { element: r, isDehydrated: !1, cache: o.cache, pendingSuspenseBoundaries: o.pendingSuspenseBoundaries, transitions: o.transitions }, t.updateQueue.baseState = i, t.memoizedState = i, t.flags & 256) {
            l = zn(Error(c(423)), t), t = qs(e, t, r, n, l);
            break e;
          } else if (r !== l) {
            l = zn(Error(c(424)), t), t = qs(e, t, r, n, l);
            break e;
          } else for (Xe = It(t.stateNode.containerInfo.firstChild), Ye = t, ce = !0, ot = null, n = cs(t, null, r, n), t.child = n; n; ) n.flags = n.flags & -3 | 4096, n = n.sibling;
          else {
            if (En(), r === l) {
              t = Ct(e, t, n);
              break e;
            }
            Ie(e, t, r, n);
          }
          t = t.child;
        }
        return t;
      case 5:
        return ms(t), e === null && Pi(t), r = t.type, l = t.pendingProps, i = e !== null ? e.memoizedProps : null, o = l.children, xi(r, l) ? o = null : i !== null && xi(r, i) && (t.flags |= 32), Gs(e, t), Ie(e, t, o, n), t.child;
      case 6:
        return e === null && Pi(t), null;
      case 13:
        return bs(e, t, n);
      case 4:
        return Oi(t, t.stateNode.containerInfo), r = t.pendingProps, e === null ? t.child = _n(t, null, r, n) : Ie(e, t, r, n), t.child;
      case 11:
        return r = t.type, l = t.pendingProps, l = t.elementType === r ? l : ut(r, l), Qs(e, t, r, l, n);
      case 7:
        return Ie(e, t, t.pendingProps, n), t.child;
      case 8:
        return Ie(e, t, t.pendingProps.children, n), t.child;
      case 12:
        return Ie(e, t, t.pendingProps.children, n), t.child;
      case 10:
        e: {
          if (r = t.type._context, l = t.pendingProps, i = t.memoizedProps, o = l.value, oe(el, r._currentValue), r._currentValue = o, i !== null) if (it(i.value, o)) {
            if (i.children === l.children && !Ue.current) {
              t = Ct(e, t, n);
              break e;
            }
          } else for (i = t.child, i !== null && (i.return = t); i !== null; ) {
            var u = i.dependencies;
            if (u !== null) {
              o = i.child;
              for (var s = u.firstContext; s !== null; ) {
                if (s.context === r) {
                  if (i.tag === 1) {
                    s = _t(-1, n & -n), s.tag = 2;
                    var m = i.updateQueue;
                    if (m !== null) {
                      m = m.shared;
                      var w = m.pending;
                      w === null ? s.next = s : (s.next = w.next, w.next = s), m.pending = s;
                    }
                  }
                  i.lanes |= n, s = i.alternate, s !== null && (s.lanes |= n), Ii(
                    i.return,
                    n,
                    t
                  ), u.lanes |= n;
                  break;
                }
                s = s.next;
              }
            } else if (i.tag === 10) o = i.type === t.type ? null : i.child;
            else if (i.tag === 18) {
              if (o = i.return, o === null) throw Error(c(341));
              o.lanes |= n, u = o.alternate, u !== null && (u.lanes |= n), Ii(o, n, t), o = i.sibling;
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
          Ie(e, t, l.children, n), t = t.child;
        }
        return t;
      case 9:
        return l = t.type, r = t.pendingProps.children, Nn(t, n), l = be(l), r = r(l), t.flags |= 1, Ie(e, t, r, n), t.child;
      case 14:
        return r = t.type, l = ut(r, t.pendingProps), l = ut(r.type, l), Ks(e, t, r, l, n);
      case 15:
        return Ys(e, t, t.type, t.pendingProps, n);
      case 17:
        return r = t.type, l = t.pendingProps, l = t.elementType === r ? l : ut(r, l), dl(e, t), t.tag = 1, Ae(r) ? (e = !0, Xr(t)) : e = !1, Nn(t, n), Us(t, r, l), Zi(t, r, l, n), eo(null, t, r, !0, e, n);
      case 19:
        return ta(e, t, n);
      case 22:
        return Xs(e, t, n);
    }
    throw Error(c(156, t.tag));
  };
  function Ca(e, t) {
    return lu(e, t);
  }
  function zf(e, t, n, r) {
    this.tag = e, this.key = n, this.sibling = this.child = this.return = this.stateNode = this.type = this.elementType = null, this.index = 0, this.ref = null, this.pendingProps = t, this.dependencies = this.memoizedState = this.updateQueue = this.memoizedProps = null, this.mode = r, this.subtreeFlags = this.flags = 0, this.deletions = null, this.childLanes = this.lanes = 0, this.alternate = null;
  }
  function nt(e, t, n, r) {
    return new zf(e, t, n, r);
  }
  function ko(e) {
    return e = e.prototype, !(!e || !e.isReactComponent);
  }
  function Pf(e) {
    if (typeof e == "function") return ko(e) ? 1 : 0;
    if (e != null) {
      if (e = e.$$typeof, e === ft) return 11;
      if (e === dt) return 14;
    }
    return 2;
  }
  function Qt(e, t) {
    var n = e.alternate;
    return n === null ? (n = nt(e.tag, t, e.key, e.mode), n.elementType = e.elementType, n.type = e.type, n.stateNode = e.stateNode, n.alternate = e, e.alternate = n) : (n.pendingProps = t, n.type = e.type, n.flags = 0, n.subtreeFlags = 0, n.deletions = null), n.flags = e.flags & 14680064, n.childLanes = e.childLanes, n.lanes = e.lanes, n.child = e.child, n.memoizedProps = e.memoizedProps, n.memoizedState = e.memoizedState, n.updateQueue = e.updateQueue, t = e.dependencies, n.dependencies = t === null ? null : { lanes: t.lanes, firstContext: t.firstContext }, n.sibling = e.sibling, n.index = e.index, n.ref = e.ref, n;
  }
  function El(e, t, n, r, l, i) {
    var o = 2;
    if (r = e, typeof e == "function") ko(e) && (o = 1);
    else if (typeof e == "string") o = 5;
    else e: switch (e) {
      case Fe:
        return un(n.children, l, i, t);
      case Ze:
        o = 8, l |= 8;
        break;
      case jt:
        return e = nt(12, n, t, l | 2), e.elementType = jt, e.lanes = i, e;
      case We:
        return e = nt(13, n, t, l), e.elementType = We, e.lanes = i, e;
      case rt:
        return e = nt(19, n, t, l), e.elementType = rt, e.lanes = i, e;
      case pe:
        return _l(n, l, i, t);
      default:
        if (typeof e == "object" && e !== null) switch (e.$$typeof) {
          case yt:
            o = 10;
            break e;
          case Yt:
            o = 9;
            break e;
          case ft:
            o = 11;
            break e;
          case dt:
            o = 14;
            break e;
          case Oe:
            o = 16, r = null;
            break e;
        }
        throw Error(c(130, e == null ? e : typeof e, ""));
    }
    return t = nt(o, n, t, l), t.elementType = e, t.type = r, t.lanes = i, t;
  }
  function un(e, t, n, r) {
    return e = nt(7, e, r, t), e.lanes = n, e;
  }
  function _l(e, t, n, r) {
    return e = nt(22, e, r, t), e.elementType = pe, e.lanes = n, e.stateNode = { isHidden: !1 }, e;
  }
  function So(e, t, n) {
    return e = nt(6, e, null, t), e.lanes = n, e;
  }
  function Eo(e, t, n) {
    return t = nt(4, e.children !== null ? e.children : [], e.key, t), t.lanes = n, t.stateNode = { containerInfo: e.containerInfo, pendingChildren: null, implementation: e.implementation }, t;
  }
  function Tf(e, t, n, r, l) {
    this.tag = t, this.containerInfo = e, this.finishedWork = this.pingCache = this.current = this.pendingChildren = null, this.timeoutHandle = -1, this.callbackNode = this.pendingContext = this.context = null, this.callbackPriority = 0, this.eventTimes = Gl(0), this.expirationTimes = Gl(-1), this.entangledLanes = this.finishedLanes = this.mutableReadLanes = this.expiredLanes = this.pingedLanes = this.suspendedLanes = this.pendingLanes = 0, this.entanglements = Gl(0), this.identifierPrefix = r, this.onRecoverableError = l, this.mutableSourceEagerHydrationData = null;
  }
  function _o(e, t, n, r, l, i, o, u, s) {
    return e = new Tf(e, t, n, u, s), t === 1 ? (t = 1, i === !0 && (t |= 8)) : t = 0, i = nt(3, null, null, t), e.current = i, i.stateNode = e, i.memoizedState = { element: r, isDehydrated: n, cache: null, transitions: null, pendingSuspenseBoundaries: null }, Fi(i), e;
  }
  function Lf(e, t, n) {
    var r = 3 < arguments.length && arguments[3] !== void 0 ? arguments[3] : null;
    return { $$typeof: De, key: r == null ? null : "" + r, children: e, containerInfo: t, implementation: n };
  }
  function Na(e) {
    if (!e) return Ft;
    e = e._reactInternals;
    e: {
      if (Xt(e) !== e || e.tag !== 1) throw Error(c(170));
      var t = e;
      do {
        switch (t.tag) {
          case 3:
            t = t.stateNode.context;
            break e;
          case 1:
            if (Ae(t.type)) {
              t = t.stateNode.__reactInternalMemoizedMergedChildContext;
              break e;
            }
        }
        t = t.return;
      } while (t !== null);
      throw Error(c(171));
    }
    if (e.tag === 1) {
      var n = e.type;
      if (Ae(n)) return es(e, n, t);
    }
    return t;
  }
  function ja(e, t, n, r, l, i, o, u, s) {
    return e = _o(n, r, !0, e, l, i, o, u, s), e.context = Na(null), n = e.current, r = Me(), l = Bt(n), i = _t(r, l), i.callback = t ?? null, At(n, i, l), e.current.lanes = l, $n(e, l, r), Ve(e, r), e;
  }
  function Cl(e, t, n, r) {
    var l = t.current, i = Me(), o = Bt(l);
    return n = Na(n), t.context === null ? t.context = n : t.pendingContext = n, t = _t(i, o), t.payload = { element: e }, r = r === void 0 ? null : r, r !== null && (t.callback = r), e = At(l, t, o), e !== null && (ct(e, l, o, i), nl(e, l, o)), o;
  }
  function Nl(e) {
    if (e = e.current, !e.child) return null;
    switch (e.child.tag) {
      case 5:
        return e.child.stateNode;
      default:
        return e.child.stateNode;
    }
  }
  function za(e, t) {
    if (e = e.memoizedState, e !== null && e.dehydrated !== null) {
      var n = e.retryLane;
      e.retryLane = n !== 0 && n < t ? n : t;
    }
  }
  function Co(e, t) {
    za(e, t), (e = e.alternate) && za(e, t);
  }
  function Rf() {
    return null;
  }
  var Pa = typeof reportError == "function" ? reportError : function(e) {
    console.error(e);
  };
  function No(e) {
    this._internalRoot = e;
  }
  jl.prototype.render = No.prototype.render = function(e) {
    var t = this._internalRoot;
    if (t === null) throw Error(c(409));
    Cl(e, t, null, null);
  }, jl.prototype.unmount = No.prototype.unmount = function() {
    var e = this._internalRoot;
    if (e !== null) {
      this._internalRoot = null;
      var t = e.containerInfo;
      rn(function() {
        Cl(null, e, null, null);
      }), t[wt] = null;
    }
  };
  function jl(e) {
    this._internalRoot = e;
  }
  jl.prototype.unstable_scheduleHydration = function(e) {
    if (e) {
      var t = du();
      e = { blockedOn: null, target: e, priority: t };
      for (var n = 0; n < Lt.length && t !== 0 && t < Lt[n].priority; n++) ;
      Lt.splice(n, 0, e), n === 0 && mu(e);
    }
  };
  function jo(e) {
    return !(!e || e.nodeType !== 1 && e.nodeType !== 9 && e.nodeType !== 11);
  }
  function zl(e) {
    return !(!e || e.nodeType !== 1 && e.nodeType !== 9 && e.nodeType !== 11 && (e.nodeType !== 8 || e.nodeValue !== " react-mount-point-unstable "));
  }
  function Ta() {
  }
  function Df(e, t, n, r, l) {
    if (l) {
      if (typeof r == "function") {
        var i = r;
        r = function() {
          var m = Nl(o);
          i.call(m);
        };
      }
      var o = ja(t, r, e, 0, null, !1, !1, "", Ta);
      return e._reactRootContainer = o, e[wt] = o.current, er(e.nodeType === 8 ? e.parentNode : e), rn(), o;
    }
    for (; l = e.lastChild; ) e.removeChild(l);
    if (typeof r == "function") {
      var u = r;
      r = function() {
        var m = Nl(s);
        u.call(m);
      };
    }
    var s = _o(e, 0, !1, null, null, !1, !1, "", Ta);
    return e._reactRootContainer = s, e[wt] = s.current, er(e.nodeType === 8 ? e.parentNode : e), rn(function() {
      Cl(t, s, n, r);
    }), s;
  }
  function Pl(e, t, n, r, l) {
    var i = n._reactRootContainer;
    if (i) {
      var o = i;
      if (typeof l == "function") {
        var u = l;
        l = function() {
          var s = Nl(o);
          u.call(s);
        };
      }
      Cl(t, o, e, l);
    } else o = Df(n, t, e, l, r);
    return Nl(o);
  }
  cu = function(e) {
    switch (e.tag) {
      case 3:
        var t = e.stateNode;
        if (t.current.memoizedState.isDehydrated) {
          var n = An(t.pendingLanes);
          n !== 0 && (Zl(t, n | 1), Ve(t, ge()), (J & 6) === 0 && (Ln = ge() + 500, Ot()));
        }
        break;
      case 13:
        rn(function() {
          var r = Et(e, 1);
          if (r !== null) {
            var l = Me();
            ct(r, e, 1, l);
          }
        }), Co(e, 1);
    }
  }, Jl = function(e) {
    if (e.tag === 13) {
      var t = Et(e, 134217728);
      if (t !== null) {
        var n = Me();
        ct(t, e, 134217728, n);
      }
      Co(e, 134217728);
    }
  }, fu = function(e) {
    if (e.tag === 13) {
      var t = Bt(e), n = Et(e, t);
      if (n !== null) {
        var r = Me();
        ct(n, e, t, r);
      }
      Co(e, t);
    }
  }, du = function() {
    return le;
  }, pu = function(e, t) {
    var n = le;
    try {
      return le = e, t();
    } finally {
      le = n;
    }
  }, Bl = function(e, t, n) {
    switch (t) {
      case "input":
        if (Ml(e, n), t = n.name, n.type === "radio" && t != null) {
          for (n = e; n.parentNode; ) n = n.parentNode;
          for (n = n.querySelectorAll("input[name=" + JSON.stringify("" + t) + '][type="radio"]'), t = 0; t < n.length; t++) {
            var r = n[t];
            if (r !== e && r.form === e.form) {
              var l = Kr(r);
              if (!l) throw Error(c(90));
              Oo(r), Ml(r, l);
            }
          }
        }
        break;
      case "textarea":
        Vo(e, n);
        break;
      case "select":
        t = n.value, t != null && sn(e, !!n.multiple, t, !1);
    }
  }, Jo = yo, qo = rn;
  var If = { usingClientEntryPoint: !1, Events: [rr, yn, Kr, Go, Zo, yo] }, gr = { findFiberByHostInstance: Gt, bundleType: 0, version: "18.3.1", rendererPackageName: "react-dom" }, Mf = { bundleType: gr.bundleType, version: gr.version, rendererPackageName: gr.rendererPackageName, rendererConfig: gr.rendererConfig, overrideHookState: null, overrideHookStateDeletePath: null, overrideHookStateRenamePath: null, overrideProps: null, overridePropsDeletePath: null, overridePropsRenamePath: null, setErrorHandler: null, setSuspenseHandler: null, scheduleUpdate: null, currentDispatcherRef: ne.ReactCurrentDispatcher, findHostInstanceByFiber: function(e) {
    return e = nu(e), e === null ? null : e.stateNode;
  }, findFiberByHostInstance: gr.findFiberByHostInstance || Rf, findHostInstancesForRefresh: null, scheduleRefresh: null, scheduleRoot: null, setRefreshHandler: null, getCurrentFiber: null, reconcilerVersion: "18.3.1-next-f1338f8080-20240426" };
  if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u") {
    var Tl = __REACT_DEVTOOLS_GLOBAL_HOOK__;
    if (!Tl.isDisabled && Tl.supportsFiber) try {
      jr = Tl.inject(Mf), pt = Tl;
    } catch {
    }
  }
  return Be.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = If, Be.createPortal = function(e, t) {
    var n = 2 < arguments.length && arguments[2] !== void 0 ? arguments[2] : null;
    if (!jo(t)) throw Error(c(200));
    return Lf(e, t, null, n);
  }, Be.createRoot = function(e, t) {
    if (!jo(e)) throw Error(c(299));
    var n = !1, r = "", l = Pa;
    return t != null && (t.unstable_strictMode === !0 && (n = !0), t.identifierPrefix !== void 0 && (r = t.identifierPrefix), t.onRecoverableError !== void 0 && (l = t.onRecoverableError)), t = _o(e, 1, !1, null, null, n, !1, r, l), e[wt] = t.current, er(e.nodeType === 8 ? e.parentNode : e), new No(t);
  }, Be.findDOMNode = function(e) {
    if (e == null) return null;
    if (e.nodeType === 1) return e;
    var t = e._reactInternals;
    if (t === void 0)
      throw typeof e.render == "function" ? Error(c(188)) : (e = Object.keys(e).join(","), Error(c(268, e)));
    return e = nu(t), e = e === null ? null : e.stateNode, e;
  }, Be.flushSync = function(e) {
    return rn(e);
  }, Be.hydrate = function(e, t, n) {
    if (!zl(t)) throw Error(c(200));
    return Pl(null, e, t, !0, n);
  }, Be.hydrateRoot = function(e, t, n) {
    if (!jo(e)) throw Error(c(405));
    var r = n != null && n.hydratedSources || null, l = !1, i = "", o = Pa;
    if (n != null && (n.unstable_strictMode === !0 && (l = !0), n.identifierPrefix !== void 0 && (i = n.identifierPrefix), n.onRecoverableError !== void 0 && (o = n.onRecoverableError)), t = ja(t, null, e, 1, n ?? null, l, !1, i, o), e[wt] = t.current, er(e), r) for (e = 0; e < r.length; e++) n = r[e], l = n._getVersion, l = l(n._source), t.mutableSourceEagerHydrationData == null ? t.mutableSourceEagerHydrationData = [n, l] : t.mutableSourceEagerHydrationData.push(
      n,
      l
    );
    return new jl(t);
  }, Be.render = function(e, t, n) {
    if (!zl(t)) throw Error(c(200));
    return Pl(null, e, t, !1, n);
  }, Be.unmountComponentAtNode = function(e) {
    if (!zl(e)) throw Error(c(40));
    return e._reactRootContainer ? (rn(function() {
      Pl(null, null, e, !1, function() {
        e._reactRootContainer = null, e[wt] = null;
      });
    }), !0) : !1;
  }, Be.unstable_batchedUpdates = yo, Be.unstable_renderSubtreeIntoContainer = function(e, t, n, r) {
    if (!zl(n)) throw Error(c(200));
    if (e == null || e._reactInternals === void 0) throw Error(c(38));
    return Pl(e, t, n, !1, r);
  }, Be.version = "18.3.1-next-f1338f8080-20240426", Be;
}
var Ua;
function Qf() {
  if (Ua) return To.exports;
  Ua = 1;
  function v() {
    if (!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function"))
      try {
        __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(v);
      } catch (E) {
        console.error(E);
      }
  }
  return v(), To.exports = Wf(), To.exports;
}
var Aa;
function Kf() {
  if (Aa) return Ll;
  Aa = 1;
  var v = Qf();
  return Ll.createRoot = v.createRoot, Ll.hydrateRoot = v.hydrateRoot, Ll;
}
var Yf = Kf();
const Xf = ":host{--fc-text: var(--primary-text-color, #1d1a27);--fc-muted: var(--secondary-text-color, #6c6880);--fc-accent: var(--primary-color, #6c4fd6);--fc-line: var(--divider-color, rgba(0,0,0,.12));--fc-bg2: var(--secondary-background-color, rgba(0,0,0,.04));--fc-ok: var(--success-color, #43a047);--fc-err: var(--error-color, #db4437);--fc-soft: color-mix(in srgb, var(--fc-accent) 14%, transparent);display:block}*{box-sizing:border-box}ha-card{padding:16px;color:var(--fc-text)}.head{display:flex;align-items:center;gap:10px;margin-bottom:12px}.head h2{margin:0;font-size:1.25rem;font-weight:600;line-height:1.2}.head .sub{color:var(--fc-muted);font-size:.85rem}.head .right{margin-left:auto;display:flex;gap:6px;align-items:center}.eyebrow{font-size:.72rem;letter-spacing:.12em;text-transform:uppercase;color:var(--fc-muted)}.hello{margin:2px 0 14px;font-size:1.6rem;font-weight:600;line-height:1.15}.hello em{color:var(--fc-accent);font-style:italic}.section{padding:12px 0;border-top:1px solid var(--fc-line)}.section:first-of-type{border-top:0;padding-top:0}.section h3{display:flex;align-items:center;gap:8px;margin:0 0 8px;font-size:1rem;font-weight:600}.section h3 ha-icon{--mdc-icon-size: 20px;color:var(--fc-accent)}.count{background:var(--fc-bg2);color:var(--fc-muted);border-radius:999px;padding:0 8px;font-size:.8rem;font-weight:500}ul{list-style:none;margin:0;padding:0}.row{display:flex;align-items:center;gap:10px;padding:7px 0;border-bottom:1px solid var(--fc-line)}.row:last-child{border-bottom:0}.time{min-width:70px;color:var(--fc-muted);font-variant-numeric:tabular-nums}.grow{flex:1;min-width:0}.meta{color:var(--fc-muted);font-size:.85rem}.label{font-size:.72rem;letter-spacing:.1em;text-transform:uppercase;color:var(--fc-muted)}.check{width:18px;height:18px;border-radius:50%;border:2px solid var(--fc-line);flex:none}.check.done{background:var(--fc-ok);border-color:var(--fc-ok)}.tiles{display:grid;grid-template-columns:repeat(auto-fill,minmax(120px,1fr));gap:8px}.tile{background:var(--fc-bg2);border-radius:12px;padding:10px 12px}.tile .v{font-size:1.15rem;font-weight:600;text-transform:capitalize}.empty{color:var(--fc-muted);padding:4px 0}.err{color:var(--fc-err)}button{font:inherit;color:inherit;cursor:pointer;border:1px solid var(--fc-line);background:var(--fc-bg2);border-radius:10px;padding:8px 14px;min-height:40px}button.primary{background:var(--fc-accent);border-color:var(--fc-accent);color:var(--text-primary-color, #fff)}button.ghost{background:transparent;border-color:transparent;color:var(--fc-muted)}button:disabled{opacity:.5;cursor:default}.btns{display:flex;gap:6px;flex-wrap:wrap}input{font:inherit;color:var(--fc-text);background:var(--fc-bg2);border:1px solid var(--fc-line);border-radius:10px;padding:8px 12px;min-height:40px;width:100%}input:focus{outline:2px solid var(--fc-accent);outline-offset:-1px}.avatar{display:inline-grid;place-items:center;border-radius:50%;color:#fff;font-weight:600;flex:none}.people{display:grid;grid-template-columns:repeat(auto-fill,minmax(96px,1fr));gap:10px}.person{display:flex;flex-direction:column;align-items:center;gap:8px;padding:14px 8px;border-radius:14px;border:1px solid var(--fc-line);background:transparent;font-weight:600}.person.suggested{border:2px solid var(--fc-accent)}.pin{display:flex;flex-direction:column;align-items:center;gap:12px}.dots{display:flex;gap:10px}.dots span{width:13px;height:13px;border-radius:50%;border:2px solid var(--fc-muted)}.dots span.on{background:var(--fc-accent);border-color:var(--fc-accent)}.keys{display:grid;grid-template-columns:repeat(3,68px);gap:8px}.keys button{height:58px;font-size:1.35rem;border-radius:14px}.chat{display:flex;flex-direction:column;gap:10px;max-height:var(--faith-chat-height, 420px);overflow-y:auto;padding:2px}.msg{max-width:88%;padding:9px 13px;border-radius:16px;white-space:pre-wrap;line-height:1.4}.msg.me{align-self:flex-end;background:var(--fc-accent);color:var(--text-primary-color, #fff);border-bottom-right-radius:4px}.msg.faith{align-self:flex-start;background:var(--fc-bg2);border-bottom-left-radius:4px}.chips{display:flex;gap:4px;flex-wrap:wrap}.chip{font-size:.75rem;color:var(--fc-muted);border:1px solid var(--fc-line);border-radius:999px;padding:1px 8px}.ask{display:flex;gap:6px;margin-top:10px;align-items:center}.ask button{min-width:44px;padding:8px 10px}.rec{background:var(--fc-err)!important;color:#fff!important;border-color:var(--fc-err)!important}.box{border:1px solid var(--fc-accent);border-radius:14px;padding:10px 12px;display:flex;flex-direction:column;gap:8px}.box.wait{border-style:dashed}.big{font-size:2.6rem;font-weight:700;line-height:1}.pill{background:var(--fc-soft);color:var(--fc-accent);border-radius:999px;padding:2px 10px;font-weight:600;font-size:.85rem;white-space:nowrap}.toast{color:var(--fc-muted);font-size:.85rem}.apps{display:flex;gap:8px;flex-wrap:wrap}.apps a{text-decoration:none;color:inherit;display:flex;align-items:center;gap:8px;border:1px solid var(--fc-line);border-radius:12px;padding:6px 12px 6px 8px}", Io = (v) => `faith.hub.${v}`, Gf = (v) => {
  if (v)
    try {
      return localStorage.getItem(Io(v)) || void 0;
    } catch {
      return;
    }
};
function Do(v, E) {
  try {
    E ? localStorage.setItem(Io(v), E) : localStorage.removeItem(Io(v));
  } catch {
  }
  window.dispatchEvent(new CustomEvent("faith-hub-changed", { detail: { screen: v } }));
}
function Zf(v, E) {
  return {
    screen: E.screen,
    get user() {
      var c;
      return (c = v()) == null ? void 0 : c.user;
    },
    call: async (c, H = {}) => {
      const Q = v();
      if (!Q) throw new Error("Home Assistant isn't ready yet.");
      const F = Gf(E.screen);
      try {
        return await Q.callWS({ type: "faith/call", path: c, body: { ...H, ...E.screen ? { screen: E.screen } : {}, ...F ? { hub_session: F } : {} } });
      } catch (O) {
        throw new Error((O == null ? void 0 : O.message) || (O == null ? void 0 : O.code) || "FAITH didn't answer.");
      }
    }
  };
}
const Jf = { today: "mdi:calendar-today", meals: "mdi:silverware-fork-knife", shopping: "mdi:cart-outline", chores: "mdi:broom", home: "mdi:home-outline", approvals: "mdi:shield-check-outline" }, qf = (v) => v.split(/\s+/).map((E) => E[0]).join("").slice(0, 2).toUpperCase(), xr = ({ p: v, size: E = 40 }) => /* @__PURE__ */ f.jsx("span", { className: "avatar", style: { width: E, height: E, fontSize: E * 0.38, background: v.color || "var(--fc-accent)" }, children: qf(v.name) });
function Rl(v) {
  if (!v) return "";
  if (/^\d{2}:\d{2}$/.test(v)) {
    const [E, c] = v.split(":").map(Number);
    return new Date(2e3, 0, 1, E, c).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
  }
  if (/^\d{4}-\d{2}-\d{2}$/.test(v)) {
    const E = /* @__PURE__ */ new Date(`${v}T12:00:00`), c = Math.round((new Date(E.toDateString()).getTime() - new Date((/* @__PURE__ */ new Date()).toDateString()).getTime()) / 864e5);
    return c === 0 ? "Today" : c === 1 ? "Tomorrow" : E.toLocaleDateString([], { weekday: "short", day: "numeric" });
  }
  return v;
}
function Fo(v, E, c = {}, H = 6e4) {
  const [Q, F] = me.useState(null), [O, A] = me.useState(""), S = me.useCallback(() => v.call(E, c).then((_) => {
    F(_), A("");
  }).catch((_) => A(_.message)), [v, E, JSON.stringify(c)]);
  return me.useEffect(() => {
    S();
    const _ = setInterval(S, H), V = (Y) => {
      var ve;
      const B = (ve = Y.detail) == null ? void 0 : ve.screen;
      (!B || B === v.screen) && S();
    };
    return window.addEventListener("faith-hub-changed", V), () => {
      clearInterval(_), window.removeEventListener("faith-hub-changed", V);
    };
  }, [S, H]), { data: Q, err: O, load: S };
}
function bf({ api: v, items: E, can: c, onDone: H }) {
  const [Q, F] = me.useState(""), O = (A, S) => v.call(`/api/ha/approvals/${A}`, { approve: S }).then((_) => {
    F(_.text), H();
  }).catch((_) => F(_.message));
  return /* @__PURE__ */ f.jsxs(f.Fragment, { children: [
    /* @__PURE__ */ f.jsx("ul", { children: E.map((A) => /* @__PURE__ */ f.jsxs("li", { className: "row", children: [
      /* @__PURE__ */ f.jsxs("div", { className: "grow", children: [
        /* @__PURE__ */ f.jsx("div", { children: A.summary }),
        /* @__PURE__ */ f.jsxs("div", { className: "meta", children: [
          "Asked by ",
          A.requested_by.replace(/^household on /, "the ")
        ] })
      ] }),
      c && /* @__PURE__ */ f.jsxs("div", { className: "btns", children: [
        /* @__PURE__ */ f.jsx("button", { className: "primary", onClick: () => O(A.id, !0), children: "Approve" }),
        /* @__PURE__ */ f.jsx("button", { onClick: () => O(A.id, !1), children: "Deny" })
      ] })
    ] }, A.id)) }),
    !c && /* @__PURE__ */ f.jsx("div", { className: "meta", children: "A grown-up approves these (signed in here, or on their phone)." }),
    Q && /* @__PURE__ */ f.jsx("div", { className: "toast", children: Q })
  ] });
}
function ed({ c: v, api: E, can: c, reload: H }) {
  var A;
  const Q = v.items ?? [];
  let F;
  v.error ? F = /* @__PURE__ */ f.jsx("div", { className: "err", children: v.error }) : v.empty ? F = /* @__PURE__ */ f.jsx("div", { className: "empty", children: v.empty }) : v.kind === "schedule" ? F = /* @__PURE__ */ f.jsx("ul", { children: Q.map((S, _) => /* @__PURE__ */ f.jsxs("li", { className: "row", children: [
    /* @__PURE__ */ f.jsx("span", { className: "time", children: Rl(S.time) }),
    /* @__PURE__ */ f.jsxs("div", { className: "grow", children: [
      /* @__PURE__ */ f.jsx("div", { children: S.title }),
      S.meta && /* @__PURE__ */ f.jsx("div", { className: "meta", children: S.meta })
    ] })
  ] }, _)) }) : v.kind === "meals" ? F = /* @__PURE__ */ f.jsx("ul", { children: Q.map((S, _) => /* @__PURE__ */ f.jsxs("li", { className: "row", children: [
    /* @__PURE__ */ f.jsxs("span", { className: "label grow", children: [
      S.label,
      S.time && Rl(S.time) !== "Today" ? ` · ${Rl(S.time)}` : ""
    ] }),
    /* @__PURE__ */ f.jsx("span", { children: S.title })
  ] }, _)) }) : v.kind === "checklist" || v.kind === "list" ? F = /* @__PURE__ */ f.jsx("ul", { children: Q.map((S, _) => /* @__PURE__ */ f.jsxs("li", { className: "row", children: [
    v.kind === "checklist" && /* @__PURE__ */ f.jsx("span", { className: `check ${S.done ? "done" : ""}` }),
    /* @__PURE__ */ f.jsxs("span", { className: "grow", children: [
      S.label && /* @__PURE__ */ f.jsxs("span", { className: "label", children: [
        S.label,
        " "
      ] }),
      S.title
    ] }),
    (S.meta || S.time) && /* @__PURE__ */ f.jsx("span", { className: "meta", children: S.meta || Rl(S.time) })
  ] }, _)) }) : v.kind === "entities" ? F = /* @__PURE__ */ f.jsx("div", { className: "tiles", children: (v.entities ?? []).map((S) => /* @__PURE__ */ f.jsxs("div", { className: "tile", children: [
    /* @__PURE__ */ f.jsx("div", { className: "meta", children: S.name }),
    /* @__PURE__ */ f.jsx("div", { className: "v", children: S.state })
  ] }, S.entity_id)) }) : v.kind === "approvals" ? F = /* @__PURE__ */ f.jsx(bf, { api: E, items: v.approvals ?? [], can: c, onDone: H }) : F = /* @__PURE__ */ f.jsx("div", { style: { whiteSpace: "pre-wrap" }, children: v.text });
  const O = v.kind === "checklist" ? Q.length : v.kind === "approvals" ? (A = v.approvals) == null ? void 0 : A.length : void 0;
  return /* @__PURE__ */ f.jsxs("div", { className: "section", children: [
    /* @__PURE__ */ f.jsxs("h3", { children: [
      /* @__PURE__ */ f.jsx("ha-icon", { icon: Jf[v.id] || "mdi:note-text-outline" }),
      v.title,
      O ? /* @__PURE__ */ f.jsx("span", { className: "count", children: O }) : null
    ] }),
    F
  ] });
}
function td({ api: v, config: E }) {
  const { data: c, err: H, load: Q } = Fo(v, "/api/ha/view", E.cards ? { cards: E.cards } : {});
  if (H) return /* @__PURE__ */ f.jsx("ha-card", { children: /* @__PURE__ */ f.jsx("div", { className: "err", children: H }) });
  if (!c) return /* @__PURE__ */ f.jsx("ha-card", { children: /* @__PURE__ */ f.jsx("div", { className: "empty", children: "Loading…" }) });
  const F = c.person ? `${c.person.name}'s` : "The family's";
  return /* @__PURE__ */ f.jsxs("ha-card", { children: [
    E.title !== "" && /* @__PURE__ */ f.jsxs(f.Fragment, { children: [
      /* @__PURE__ */ f.jsx("div", { className: "eyebrow", children: (/* @__PURE__ */ new Date()).toLocaleDateString([], { weekday: "long", month: "long", day: "numeric" }) }),
      /* @__PURE__ */ f.jsx("div", { className: "hello", children: E.title ?? /* @__PURE__ */ f.jsxs(f.Fragment, { children: [
        F,
        " ",
        /* @__PURE__ */ f.jsx("em", { children: "day" }),
        ", at a glance."
      ] }) })
    ] }),
    E.show_apps !== !1 && c.apps.length > 0 && /* @__PURE__ */ f.jsx("div", { className: "section", children: /* @__PURE__ */ f.jsx("div", { className: "apps", children: c.apps.map((O) => /* @__PURE__ */ f.jsxs("a", { href: O.url, target: "_blank", rel: "noreferrer", children: [
      /* @__PURE__ */ f.jsx("span", { children: O.icon || "↗" }),
      O.name
    ] }, O.id)) }) }),
    c.cards.map((O) => /* @__PURE__ */ f.jsx(ed, { c: O, api: v, can: c.can_approve, reload: Q }, O.id)),
    !c.cards.length && /* @__PURE__ */ f.jsx("div", { className: "empty", children: "Nothing to show yet." })
  ] });
}
function nd({ api: v, config: E }) {
  var Z;
  const { data: c, err: H, load: Q } = Fo(v, "/api/ha/view", { cards: [] }, 1e4), [F, O] = me.useState(null), [A, S] = me.useState(null), [_, V] = me.useState(""), [Y, B] = me.useState(""), ve = me.useRef(0);
  if (me.useEffect(() => {
    if (!(c != null && c.hub)) return;
    const R = () => {
      Date.now() - ve.current > 15e3 && (ve.current = Date.now(), v.call("/api/ha/hub/activity").catch(() => {
      }));
    };
    return window.addEventListener("pointerdown", R, !0), () => window.removeEventListener("pointerdown", R, !0);
  }, [(Z = c == null ? void 0 : c.hub) == null ? void 0 : Z.person.id]), me.useEffect(() => {
    c && !c.hub && c.household && v.screen && localStorage.getItem(`faith.hub.${v.screen}`) && Do(v.screen, null);
  }, [c]), !v.screen) return /* @__PURE__ */ f.jsx("ha-card", { children: /* @__PURE__ */ f.jsxs("div", { className: "err", children: [
    "Give this card the screen it's on: ",
    /* @__PURE__ */ f.jsx("code", { children: "screen: kitchen" })
  ] }) });
  if (H) return /* @__PURE__ */ f.jsx("ha-card", { children: /* @__PURE__ */ f.jsx("div", { className: "err", children: H }) });
  if (!c) return /* @__PURE__ */ f.jsx("ha-card", { children: /* @__PURE__ */ f.jsx("div", { className: "empty", children: "…" }) });
  const Ce = async (R) => {
    B("");
    try {
      const W = await v.call("/api/ha/hub/signin", R);
      Do(v.screen, W.hub_session), S(null), V(""), O(null);
    } catch (W) {
      B(W.message), V("");
    }
  }, te = async () => {
    await v.call("/api/ha/hub/signout").catch(() => {
    }), Do(v.screen, null), Q();
  };
  if (c.hub) return /* @__PURE__ */ f.jsx("ha-card", { children: /* @__PURE__ */ f.jsxs("div", { className: "head", children: [
    /* @__PURE__ */ f.jsx(xr, { p: c.hub.person, size: 44 }),
    /* @__PURE__ */ f.jsxs("div", { children: [
      /* @__PURE__ */ f.jsx("h2", { children: c.hub.person.name }),
      /* @__PURE__ */ f.jsxs("div", { className: "sub", children: [
        "Signed in on this screen",
        c.hub.remaining_seconds < 60 ? ` · signing out in ${c.hub.remaining_seconds}s` : ""
      ] })
    ] }),
    /* @__PURE__ */ f.jsx("div", { className: "right", children: /* @__PURE__ */ f.jsx("button", { onClick: te, children: "Sign out" }) })
  ] }) });
  if (c.person) return /* @__PURE__ */ f.jsx("ha-card", { children: /* @__PURE__ */ f.jsxs("div", { className: "head", children: [
    /* @__PURE__ */ f.jsx(xr, { p: c.person, size: 44 }),
    /* @__PURE__ */ f.jsxs("div", { children: [
      /* @__PURE__ */ f.jsx("h2", { children: c.person.name }),
      /* @__PURE__ */ f.jsx("div", { className: "sub", children: "Your own Home Assistant account" })
    ] })
  ] }) });
  if (!F && !A) return /* @__PURE__ */ f.jsxs("ha-card", { children: [
    /* @__PURE__ */ f.jsxs("div", { className: "head", children: [
      /* @__PURE__ */ f.jsx("ha-icon", { icon: "mdi:account-group-outline" }),
      /* @__PURE__ */ f.jsxs("div", { children: [
        /* @__PURE__ */ f.jsx("h2", { children: "Shared view" }),
        /* @__PURE__ */ f.jsx("div", { className: "sub", children: "Everyone sees the family's things. Sign in for your own." })
      ] }),
      /* @__PURE__ */ f.jsx("div", { className: "right", children: /* @__PURE__ */ f.jsx("button", { className: "primary", onClick: () => v.call("/api/ha/hub/people").then((R) => {
        O(R);
        const W = R.people.find((ne) => ne.id === R.suggested);
        W && S(W);
      }).catch((R) => B(R.message)), children: "Sign in" }) })
    ] }),
    Y && /* @__PURE__ */ f.jsx("div", { className: "err", children: Y })
  ] });
  if (!A) return /* @__PURE__ */ f.jsxs("ha-card", { children: [
    /* @__PURE__ */ f.jsxs("div", { className: "head", children: [
      /* @__PURE__ */ f.jsx("h2", { children: "Who's here?" }),
      /* @__PURE__ */ f.jsx("div", { className: "right", children: /* @__PURE__ */ f.jsx("button", { className: "ghost", onClick: () => O(null), children: "Cancel" }) })
    ] }),
    /* @__PURE__ */ f.jsx("div", { className: "people", children: F.people.map((R) => /* @__PURE__ */ f.jsxs("button", { className: `person ${F.suggested === R.id ? "suggested" : ""}`, onClick: () => S(R), children: [
      /* @__PURE__ */ f.jsx(xr, { p: R, size: 52 }),
      R.name
    ] }, R.id)) }),
    Y && /* @__PURE__ */ f.jsx("div", { className: "err", children: Y })
  ] });
  const j = (R) => V((W) => (W + R).slice(0, 8));
  return /* @__PURE__ */ f.jsxs("ha-card", { children: [
    /* @__PURE__ */ f.jsxs("div", { className: "head", children: [
      /* @__PURE__ */ f.jsx(xr, { p: A, size: 44 }),
      /* @__PURE__ */ f.jsxs("h2", { children: [
        "Hi, ",
        A.name
      ] }),
      /* @__PURE__ */ f.jsx("div", { className: "right", children: /* @__PURE__ */ f.jsx("button", { className: "ghost", onClick: () => {
        S(null), V(""), B("");
      }, children: "Back" }) })
    ] }),
    /* @__PURE__ */ f.jsxs("div", { className: "pin", children: [
      (F == null ? void 0 : F.face_unlock) && F.suggested === A.id && /* @__PURE__ */ f.jsx("button", { className: "primary", onClick: () => Ce({ person: A.id, face: !0 }), children: "It's me (camera)" }),
      /* @__PURE__ */ f.jsx("div", { className: "dots", children: Array.from({ length: Math.max(4, _.length) }, (R, W) => /* @__PURE__ */ f.jsx("span", { className: W < _.length ? "on" : "" }, W)) }),
      /* @__PURE__ */ f.jsxs("div", { className: "keys", children: [
        ["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((R) => /* @__PURE__ */ f.jsx("button", { onClick: () => j(R), children: R }, R)),
        /* @__PURE__ */ f.jsx("button", { onClick: () => V(_.slice(0, -1)), children: "⌫" }),
        /* @__PURE__ */ f.jsx("button", { onClick: () => j("0"), children: "0" }),
        /* @__PURE__ */ f.jsx("button", { className: "primary", disabled: _.length < 4, onClick: () => Ce({ person: A.id, pin: _ }), children: "OK" })
      ] }),
      Y && /* @__PURE__ */ f.jsx("div", { className: "err", children: Y })
    ] })
  ] });
}
const rd = [
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
], ld = (v) => {
  var E;
  return ((E = rd.find(([c]) => c.test(v))) == null ? void 0 : E[1]) ?? v.replace(/_/g, " ");
};
function id({ api: v, config: E }) {
  const [c, H] = me.useState([]), [Q, F] = me.useState(""), [O, A] = me.useState(!1), [S, _] = me.useState(null), V = me.useRef(null), Y = me.useRef(null), B = me.useCallback(() => {
    V.current = null, v.call("/api/ha/chat/history").then((j) => {
      V.current = j.conversation_id, H(j.messages.map((Z) => ({ me: Z.role === "user", text: Z.content })));
    }).catch(() => H([]));
  }, [v]);
  me.useEffect(() => {
    B();
    const j = (Z) => {
      var R;
      ((R = Z.detail) == null ? void 0 : R.screen) === v.screen && B();
    };
    return window.addEventListener("faith-hub-changed", j), () => window.removeEventListener("faith-hub-changed", j);
  }, [B]), me.useEffect(() => {
    var j;
    (j = Y.current) == null || j.scrollIntoView({ block: "nearest" });
  }, [c]);
  const ve = async (j, Z) => {
    A(!0), H((R) => [...R, ...Z ? [{ me: !0, text: Z }] : [], { text: "…" }]);
    try {
      const R = await v.call("/api/ha/chat", { ...j, conversation_id: V.current });
      V.current = R.conversation_id, H((W) => [
        ...W.slice(0, -1),
        ...R.heard ? [{ me: !0, text: R.heard + (R.speaker ? ` (${R.speaker.name})` : "") }] : [],
        ...R.confirms.map((ne) => ({ text: "", confirm: ne })),
        ...R.approvals.map((ne) => ({ text: "", waiting: ne.summary })),
        { text: R.text, tools: R.tools }
      ]);
    } catch (R) {
      H((W) => [...W.slice(0, -1), { text: `Sorry, that didn't work: ${R.message}` }]);
    } finally {
      A(!1);
    }
  }, Ce = async () => {
    if (S) {
      S.stop(), _(null);
      return;
    }
    try {
      const j = await navigator.mediaDevices.getUserMedia({ audio: !0 }), Z = new MediaRecorder(j), R = [];
      Z.ondataavailable = (W) => W.data.size && R.push(W.data), Z.onstop = async () => {
        j.getTracks().forEach((ze) => ze.stop());
        const W = new Blob(R, { type: Z.mimeType || "audio/webm" }), ne = btoa(String.fromCharCode(...new Uint8Array(await W.arrayBuffer())));
        ve({ audio: ne, mime: W.type.split(";")[0] }, "");
      }, Z.start(), _(Z);
    } catch {
      H((j) => [...j, { text: "The microphone isn't available (Home Assistant needs https for it)." }]);
    }
  }, te = (j, Z) => v.call(`/api/ha/confirm/${j}`, { approve: Z }).then((R) => H((W) => W.map((ne) => {
    var ze;
    return ((ze = ne.confirm) == null ? void 0 : ze.id) === j ? { ...ne, confirm: { ...ne.confirm, done: R.text } } : ne;
  }))).catch((R) => H((W) => [...W, { text: R.message }]));
  return /* @__PURE__ */ f.jsxs("ha-card", { children: [
    /* @__PURE__ */ f.jsxs("div", { className: "head", children: [
      /* @__PURE__ */ f.jsx("ha-icon", { icon: "mdi:creation-outline" }),
      /* @__PURE__ */ f.jsx("h2", { children: E.title ?? "Ask FAITH" }),
      c.length > 0 && /* @__PURE__ */ f.jsx("div", { className: "right", children: /* @__PURE__ */ f.jsx("button", { className: "ghost", onClick: () => {
        V.current = null, H([]);
      }, children: "New" }) })
    ] }),
    /* @__PURE__ */ f.jsxs("div", { className: "chat", children: [
      !c.length && /* @__PURE__ */ f.jsx("div", { className: "empty", children: "What's on today? What's for dinner? Add milk to the list. Turn off the lights." }),
      c.map((j, Z) => {
        var R;
        return j.confirm ? /* @__PURE__ */ f.jsxs("div", { className: "box", children: [
          /* @__PURE__ */ f.jsxs("div", { children: [
            "Do this? ",
            /* @__PURE__ */ f.jsx("b", { children: j.confirm.summary })
          ] }),
          j.confirm.done ? /* @__PURE__ */ f.jsx("div", { className: "meta", children: j.confirm.done }) : /* @__PURE__ */ f.jsxs("div", { className: "btns", children: [
            /* @__PURE__ */ f.jsx("button", { className: "primary", onClick: () => te(j.confirm.id, !0), children: "Yes" }),
            /* @__PURE__ */ f.jsx("button", { onClick: () => te(j.confirm.id, !1), children: "No" })
          ] })
        ] }, Z) : j.waiting ? /* @__PURE__ */ f.jsx("div", { className: "box wait", children: /* @__PURE__ */ f.jsxs("div", { children: [
          "Waiting for a grown-up: ",
          /* @__PURE__ */ f.jsx("b", { children: j.waiting })
        ] }) }, Z) : /* @__PURE__ */ f.jsxs("div", { style: { display: "flex", flexDirection: "column", gap: 4, alignItems: j.me ? "flex-end" : "flex-start" }, children: [
          /* @__PURE__ */ f.jsx("div", { className: `msg ${j.me ? "me" : "faith"}`, children: j.text }),
          !!((R = j.tools) != null && R.length) && /* @__PURE__ */ f.jsx("div", { className: "chips", children: [...new Set(j.tools.map(ld))].map((W) => /* @__PURE__ */ f.jsx("span", { className: "chip", children: W }, W)) })
        ] }, Z);
      }),
      /* @__PURE__ */ f.jsx("div", { ref: Y })
    ] }),
    /* @__PURE__ */ f.jsxs("form", { className: "ask", onSubmit: (j) => {
      j.preventDefault();
      const Z = Q.trim();
      Z && !O && (F(""), ve({ text: Z }, Z));
    }, children: [
      /* @__PURE__ */ f.jsx("button", { type: "button", className: S ? "rec" : "", title: S ? "Stop and send" : "Talk", disabled: O, onClick: Ce, children: /* @__PURE__ */ f.jsx("ha-icon", { icon: S ? "mdi:stop" : "mdi:microphone" }) }),
      /* @__PURE__ */ f.jsx("input", { value: Q, onChange: (j) => F(j.target.value), placeholder: S ? "Listening… tap stop when done" : "Ask FAITH" }),
      /* @__PURE__ */ f.jsx("button", { className: "primary", type: "submit", disabled: O || !Q.trim(), title: "Send", children: /* @__PURE__ */ f.jsx("ha-icon", { icon: "mdi:send" }) })
    ] })
  ] });
}
function od({ api: v, config: E }) {
  const { data: c, err: H, load: Q } = Fo(v, "/api/ha/rewards"), [F, O] = me.useState(""), A = (_, V, Y) => v.call(_, { args: V }).then((B) => {
    O(B.approval ? `${Y} A grown-up will approve it.` : Y), Q();
  }).catch((B) => O(B.message));
  if (H) return /* @__PURE__ */ f.jsx("ha-card", { children: /* @__PURE__ */ f.jsx("div", { className: "err", children: H }) });
  if (!c) return /* @__PURE__ */ f.jsx("ha-card", { children: /* @__PURE__ */ f.jsx("div", { className: "empty", children: "Loading…" }) });
  const S = (_) => `${_} pt${_ === 1 ? "" : "s"}`;
  return /* @__PURE__ */ f.jsxs("ha-card", { children: [
    /* @__PURE__ */ f.jsxs("div", { className: "head", children: [
      /* @__PURE__ */ f.jsx("ha-icon", { icon: "mdi:star-circle-outline" }),
      /* @__PURE__ */ f.jsx("h2", { children: E.title ?? "Points & rewards" })
    ] }),
    c.me ? /* @__PURE__ */ f.jsxs(f.Fragment, { children: [
      /* @__PURE__ */ f.jsxs("div", { className: "section", children: [
        /* @__PURE__ */ f.jsxs("div", { className: "eyebrow", children: [
          c.me.name,
          "'s points"
        ] }),
        /* @__PURE__ */ f.jsx("div", { className: "big", children: c.me.points })
      ] }),
      /* @__PURE__ */ f.jsxs("div", { className: "section", children: [
        /* @__PURE__ */ f.jsx("h3", { children: "Jobs" }),
        /* @__PURE__ */ f.jsx("ul", { children: c.activities.filter((_) => _.kids_can_claim).map((_) => /* @__PURE__ */ f.jsxs("li", { className: "row", children: [
          /* @__PURE__ */ f.jsx("span", { className: "grow", children: _.name }),
          /* @__PURE__ */ f.jsxs("span", { className: "pill", children: [
            "+",
            S(_.points)
          ] }),
          /* @__PURE__ */ f.jsx("button", { onClick: () => A("/api/ha/rewards/claim", { activity: _.id }, `Asked for ${S(_.points)} for "${_.name}".`), children: "I did it" })
        ] }, _.id)) })
      ] }),
      /* @__PURE__ */ f.jsxs("div", { className: "section", children: [
        /* @__PURE__ */ f.jsx("h3", { children: "Rewards" }),
        /* @__PURE__ */ f.jsx("ul", { children: c.rewards.map((_) => /* @__PURE__ */ f.jsxs("li", { className: "row", children: [
          /* @__PURE__ */ f.jsx("span", { className: "grow", children: _.name }),
          /* @__PURE__ */ f.jsx("span", { className: "pill", children: S(_.cost) }),
          /* @__PURE__ */ f.jsx("button", { className: "primary", disabled: c.me.points < _.cost, onClick: () => A("/api/ha/rewards/redeem", { reward: _.id }, `Asked for "${_.name}".`), children: "Get it" })
        ] }, _.id)) })
      ] })
    ] }) : /* @__PURE__ */ f.jsxs(f.Fragment, { children: [
      !c.kids.length && /* @__PURE__ */ f.jsx("div", { className: "empty", children: "No children in FAITH's family list yet." }),
      /* @__PURE__ */ f.jsx("ul", { children: c.kids.map((_) => /* @__PURE__ */ f.jsxs("li", { className: "row", children: [
        /* @__PURE__ */ f.jsx(xr, { p: _, size: 34 }),
        /* @__PURE__ */ f.jsx("span", { className: "grow", children: _.name }),
        /* @__PURE__ */ f.jsx("span", { className: "pill", children: S(_.points) }),
        c.can_give && /* @__PURE__ */ f.jsx("div", { className: "btns", children: c.allowed_points.map((V) => /* @__PURE__ */ f.jsxs("button", { onClick: () => A("/api/ha/rewards/award", { person: _.id, points: V, reason: "Well done (from the dashboard)" }, `Gave ${_.name} ${S(V)}.`), children: [
          "+",
          V
        ] }, V)) })
      ] }, _.id)) }),
      !c.can_give && c.kids.length > 0 && /* @__PURE__ */ f.jsx("div", { className: "meta", children: "Sign in to give points." })
    ] }),
    F && /* @__PURE__ */ f.jsx("div", { className: "toast", children: F })
  ] });
}
function Dl(v, E, c, H, Q) {
  if (customElements.get(v)) return;
  class F extends HTMLElement {
    constructor() {
      super(...arguments);
      yr(this, "_hass");
      yr(this, "_config");
      yr(this, "_root");
      yr(this, "_api");
    }
    setConfig(S) {
      this._config = { ...S }, this._api = void 0, this.render();
    }
    set hass(S) {
      const _ = !this._hass;
      this._hass = S, _ && this.render();
    }
    getCardSize() {
      return Q;
    }
    static getStubConfig() {
      return v === "faith-who-card" ? { screen: "kitchen" } : {};
    }
    connectedCallback() {
      this.render();
    }
    render() {
      if (!(!this._config || !this._hass)) {
        if (!this._root) {
          const S = this.shadowRoot ?? this.attachShadow({ mode: "open" }), _ = document.createElement("style");
          _.textContent = Xf, S.appendChild(_);
          const V = document.createElement("div");
          S.appendChild(V), this._root = Yf.createRoot(V);
        }
        this._api ?? (this._api = Zf(() => this._hass, this._config)), this._root.render(/* @__PURE__ */ f.jsx(H, { api: this._api, config: this._config }));
      }
    }
  }
  customElements.define(v, F), (window.customCards ?? (window.customCards = [])).push({ type: v, name: E, description: c, preview: !1 });
}
Dl("faith-card", "FAITH", "The family's day from FAITH: today, meals, shopping, chores, the house and approvals, for whoever is looking.", td, 6);
Dl("faith-who-card", "FAITH: who's here", "For a shared tablet: shows who is signed in, and lets a person sign in with their PIN.", nd, 2);
Dl("faith-chat-card", "FAITH: chat", "Talk or type to FAITH.", id, 6);
Dl("faith-rewards-card", "FAITH: points & rewards", "Children's points, jobs to claim and rewards; parents give points.", od, 4);
