!function(t,e){"object"==typeof exports&&"object"==typeof module?module.exports=e():"function"==typeof define&&define.amd?define([],e):"object"==typeof exports?exports.Mvm=e():t.Mvm=e()}(window,function(){return function(t){var e={};function n(r){if(e[r])return e[r].exports;var o=e[r]={i:r,l:!1,exports:{}};return t[r].call(o.exports,o,o.exports,n),o.l=!0,o.exports}return n.m=t,n.c=e,n.d=function(t,e,r){n.o(t,e)||Object.defineProperty(t,e,{configurable:!1,enumerable:!0,get:r})},n.r=function(t){Object.defineProperty(t,"__esModule",{value:!0})},n.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return n.d(e,"a",e),e},n.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},n.p="",n(n.s=4)}([function(t,e){t.exports=function(t){return null!=t&&"object"==typeof t&&!0===t["@@functional/placeholder"]}},function(t,e,n){var r=n(0);t.exports=function(t){return function e(n){return 0===arguments.length||r(n)?e:t.apply(this,arguments)}}},function(t,e,n){var r=n(5)(function(t,e){return null!=e&&e.constructor===t||e instanceof t});t.exports=r},function(t,e,n){var r=n(1)(function(t){return function(){return t}});t.exports=r},function(t,e,n){"use strict";n.r(e);let r=0;class o{constructor(){this.id=++r,this._events={}}$on(t,e){let n=this;return Array.isArray(t)?t.forEach(t=>this.$on(t,e)):(Array.isArray(e)||(e=[e]),(n._events[t]||(n._events[t]=[])).push(...e)),n}$once(t,e){let n=this;function r(){n.$off(t,r),e.apply(n,arguments)}return r.fn=e,n.$on(t,r),n}$off(t,e){let n=this;if(!arguments.length)return n._events={},n;if(Array.isArray(t))return t.forEach(t=>this.$off(t,e)),n;const r=n._events[t];if(!r)return n;if(!e)return n._events[t]=null,n;if(e){let n,o=r.length;if(Array.isArray(e))return void e.forEach(e=>this.$off(t,e));for(;o--;)if((n=r[o])===e||n.fn===e){r.splice(o,1);break}}return n}$emit(t,...e){let n=this,r=n._events[t];return r&&r.forEach(t=>t.apply(n,e)),n}}var i=n(3),s=n.n(i);function u(t){return null!=t&&"object"==typeof t&&!0===t["@@functional/placeholder"]}function c(t){return function e(n){return 0===arguments.length||u(n)?e:t.apply(this,arguments)}}function l(t){return function e(n,r){switch(arguments.length){case 0:return e;case 1:return u(n)?e:c(function(e){return t(n,e)});default:return u(n)&&u(r)?e:u(n)?c(function(e){return t(e,r)}):u(r)?c(function(e){return t(n,e)}):t(n,r)}}}var a=Array.isArray||function(t){return null!=t&&t.length>=0&&"[object Array]"===Object.prototype.toString.call(t)};c(function(t){return!!a(t)||!!t&&"object"==typeof t&&!function(t){return"[object String]"===Object.prototype.toString.call(t)}(t)&&(1===t.nodeType?!!t.length:0===t.length||t.length>0&&t.hasOwnProperty(0)&&t.hasOwnProperty(t.length-1))});function f(t,e){return Object.prototype.hasOwnProperty.call(e,t)}"undefined"!=typeof Symbol&&Symbol.iterator;Object.prototype.toString,{toString:null}.propertyIsEnumerable("toString"),function(){arguments.propertyIsEnumerable("length")}();Object.keys,Number.isInteger;var p=c(function(t){return null===t?"Null":void 0===t?"Undefined":Object.prototype.toString.call(t).slice(8,-1)});function h(t,e,n,r){var o=function(o){for(var i=e.length,s=0;s<i;){if(t===e[s])return n[s];s+=1}for(var u in e[s+1]=t,n[s+1]=o,t)o[u]=r?h(t[u],e,n,!0):t[u];return o};switch(p(t)){case"Object":return o({});case"Array":return o([]);case"Date":return new Date(t.valueOf());case"RegExp":return function(t){return new RegExp(t.source,(t.global?"g":"")+(t.ignoreCase?"i":"")+(t.multiline?"m":"")+(t.sticky?"y":"")+(t.unicode?"u":""))}(t);default:return t}}var d=c(function(t){return null!=t&&"function"==typeof t.clone?t.clone():h(t,[],[],!0)});Date.prototype.toISOString;var y="function"==typeof Object.assign?Object.assign:function(t){if(null==t)throw new TypeError("Cannot convert undefined or null to object");for(var e=Object(t),n=1,r=arguments.length;n<r;){var o=arguments[n];if(null!=o)for(var i in o)f(i,o)&&(e[i]=o[i]);n+=1}return e};l(function(t,e){var n={};return n[t]=e,n});Array,String,Object;var b=l(function(t,e){return null!=e&&e.constructor===t||e instanceof t}),_=l(function(t,e){return y({},t,e)}),g=c(function(t){return y.apply(null,[{}].concat(t))});function v(t,e,n=s()(!0)){let r={enumerable:!0,configurable:!0,get(){},set(){}};for(let o in e)!1!==n(o)&&(r.get=function(){return e[o]},r.set=function(t){e[o]=t},Object.defineProperty(t,o,r))}function j(){}function m(t,e,n){let r=t.$parent,o=n;for(;r;){if(r._provide&&e in r._provide){o=r._provide[e];break}r=r.$parent}return o}function $(t,e){console.log(t),console.log(e)}function w(t={},e={}){x(t),function(t){let e=t.props,n=t.props={};if(b(Array,e))e.forEach(t=>{n[t]={type:null}});else for(let t in e)n[t]=_({type:null},e[t])}(e),function(t){let e=t.inject;if(b(Array,e)){let n=t.inject={};e.forEach(t=>{n[t]={from:t}})}}(e),x(e);let n=g([{},t,e]);if(e.mixins)for(let t=0,r=e.mixins.length;t<r;t++)n=w(n,e.mixins[t]);return function(t,e){let n=t.components;for(let t in n)b(Function,n[t])||(n[t]=e.extend(n[t]))}(e,n._base),n.data=function(t=j,e=j){return function(){return _(t.call(this),e.call(this))}}(t.data,e.data),n.watch=function(t={},e={}){let n=d(t);for(let t in n)b(Array,n[t])||(n[t]=[O(n[t])]);for(let t in e){let r=n[t],o=O(e[t]);r||(r=n[t]=[]),r.push(o)}return n}(t.watch,e.watch),n.method=_(t.method,e.method),n.computed=_(t.computed,e.computed),n}function O(t){return b(Function,t)?{handler:t}:t}function x(t){let e=t.computed;for(let n in e)b(Function,e[n])&&(t.computed[n]={get:e[n],set:j})}String.prototype.trim;let A=0;class S{constructor(){this.id=++A,this.subs=[]}addSub(t){let e=!1;for(let n=0;n<this.subs.length;n++)if(this.subs[n].id===t.id){e=!0;break}e||this.subs.push(t)}removeSub(t){const e=this.subs.indexOf(t);e>-1&&this.subs.splice(e,1)}notify(){this.subs.forEach(t=>t.update())}}S.target=null;var P=n(2),E=n.n(P);const k=new Set;let z={},D=!1,C=!1;const F=[];let I=0;let M=0;class N{constructor(t,e,n,r){this.id=++M,this.active=!0,r?(this.lazy=!!r.lazy,this.deep=!!r.deep,this.ignoreChange=!!r.ignoreChange):this.lazy=this.deep=!1,this.getter=e.bind(t),this.cb=n.bind(t),this.deps=[],this.value=this.init(),this.dirty=this.lazy}init(){S.target=this;let t=this.getter();return this.deep&&function(t){!function t(e,n){let r,o;const i=Array.isArray(e);if((i||E()(Object,e))&&!Object.isFrozen(e)){if(e.__ob__){const t=e.__ob__.dep.id;if(n.has(t))return;n.add(t)}if(i)for(r=e.length;r--;)t(e[r],n);else for(r=(o=Object.keys(e)).length;r--;)t(e[o[r]],n)}}(t,k),k.clear()}(t),S.target=null,t}update(){this.lazy?this.dirty=!0:function(t){const e=t.id;if(!z[e]){if(z[e]=!0,D){let e=F.length-1;for(;e>I&&F[e].id>t.id;)e--;F.splice(e+1,0,t)}else F.push(t);C||(C=!0,function(){let t,e;for(D=!0,F.sort((t,e)=>t.id-e.id),I=0;I<F.length;I++)e=(t=F[I]).id,z[e]=null,t.run();I=F.length=0,z={},C=D=!1}())}}(this)}run(){if(this.active){const t=this.getter();if(this.ignoreChange||t!==this.value||this.deep){const e=this.value;this.value=t,this.cb(t,e)}}}evaluate(){this.value=this.getter(),this.dirty=!1}addDep(t){this.deps.push(t)}teardown(){if(this.active){let t=this.deps.length;for(;t--;)this.deps[t].removeSub(this);this.deps=[],this.active=!1}}}let R=0;class T{constructor(t,e,n){this.id=R++,this.ctx=t,this.key=e,this.option=n,this.init()}init(){let t=new N(this.ctx,this.option.get||j,j,{lazy:!0});Object.defineProperty(this.ctx,this.key,{enumerable:!0,configurable:!0,set:this.option.set||j,get:()=>(t.dirty&&t.evaluate(),t.value)})}}const U=Array.prototype,q=Object.create(U);["push","pop","shift","unshift","splice","sort","reverse"].forEach(function(t){const e=U[t];Object.defineProperty(q,t,{value:function(...n){const r=e.apply(this,n),o=this.__ob__;let i;switch(t){case"push":case"unshift":i=n;break;case"splice":i=n.slice(2)}return i&&o.observeArray(i),o.dep.notify(),r},enumerable:!1,writable:!0,configurable:!0})}),q.$apply=function(){this.__ob__.observeArray(this),this.__ob__.dep.notify()};const B=Object.getOwnPropertyNames(q);function G(t,e,n){let r=new S,o=K(n);Object.defineProperty(t,e,{configurable:!0,enumerable:!0,get:()=>(S.target&&(r.addSub(S.target),S.target.addDep(r),Array.isArray(n)&&(o.dep.addSub(S.target),S.target.addDep(o.dep))),n),set(t){n=t,r.notify()}})}let H=0;class J{constructor(t){this.id=H++,this.dep=new S,Array.isArray(t)?(("__proto__"in{}?function(t,e){t.__proto__=e}:function(t,e,n){for(let r=0,o=n.length;r<o;r++){const o=n[r];Object.defineProperty(t,o,{value:e[o],enumerable:!1,writable:!0,configurable:!0})}})(t,q,B),this.observeArray(t)):this.walk(t),Object.defineProperty(t,"__ob__",{value:this,enumerable:!1,writable:!0,configurable:!0})}walk(t){const e=Object.keys(t);for(let n=0;n<e.length;n++)G(t,e[n],t[e[n]])}observeArray(t){for(let e=0,n=t.length;e<n;e++)K(t[e])}}function K(t){if("object"!=typeof t)return;let e;return t.hasOwnProperty("__ob__")&&t.__ob__ instanceof J?e=t.__ob__:Object.isExtensible(t)&&(e=new J(t)),e}let L=0;class Q extends o{constructor(t){super(),this.id=L++,this._init(t)}_init(t){this.$options=w(this.constructor.options,t),function(t){let e=t.$options.parent;e&&e.$children.push(t),t.$parent=e,t.$root=e?e.$root:t,t.$children=[]}(this),function(t){let e=t.$options;t._inject={},t._prop={},t._data={},t._provide={},e.inject&&function(t){let e=t._inject;for(let n in t.$options.inject)e[n]=m(t,n,t.$options.inject[n].default);v(t,e)}(t),e.prop&&function(t){let e=t._prop,n=t.$options.propData;for(let r in t.$options.prop){let o=n[r];o||(o=t.$options.props[r].default),e[r]=o}K(e),v(t,e,e=>{let n;e in t._inject&&(n="inject"),$(`${n} 下已有 ${e} 属性`,t)})}(t),e.method&&function(t){for(let e in t.$options.method){let n;if(console.log(t._inject,t._prop),e in t._inject&&(n="inject"),e in t._prop&&(n="prop"),n){$(`${n} 下已有 ${e} 属性`,t);break}t[e]=t.$options.method[e].bind(t)}}(t),e.data&&function(t){let e=t._data=t.$options.data?t.$options.data.call(t):{};K(e),v(t,e,e=>{let n;e in t._inject&&(n="inject"),e in t._prop&&(n="prop"),e in t.$options.method&&(n="method"),n&&$(`${n} 下已有 ${e} 属性`,t)})}(t),e.computed&&function(t){for(let e in t.$options.computed){let n;if(e in t._inject&&(n="inject"),e in t._prop&&(n="prop"),e in t.$options.method&&(n="method"),e in t._data&&(n="data"),n){$(`${n} 下已有 ${e} 属性`,t);break}new T(t,e,t.$options.computed[e])}}(t),e.watch&&function(t){for(let e in t.$options.watch)t.$options.watch[e].forEach(n=>{new N(t,()=>e.split(".").reduce((t,e)=>t[e],t),n.handler,n)})}(t),e.provide&&function(t){t._provide=b(Function,t.$options.provide)?t.$options.provide.call(t):t.$options.provide}(t)}(this)}$watch(t,e,n){return new N(this,t,e,n)}}var V;(V=Q).options={},V.options._base=V,V.options.components={},V.extend=function(t){const e=this;class n extends e{constructor(t){super(t)}}return n.options=w(e.options,t),n.super=e,n.extend=e.extend,n},V.mixin=function(t){return this.options=w(this.options,t),this},V.use=function(t,...e){const n=this._installedPlugins||(this._installedPlugins=[]);return n.indexOf(t)>-1?this:("function"==typeof t.install?t.install.apply(t,e):"function"==typeof t&&t.apply(null,e),n.push(t),this)},Q.version="0.0.0",e.default=Q},function(t,e,n){var r=n(1),o=n(0);t.exports=function(t){return function e(n,i){switch(arguments.length){case 0:return e;case 1:return o(n)?e:r(function(e){return t(n,e)});default:return o(n)&&o(i)?e:o(n)?r(function(e){return t(e,i)}):o(i)?r(function(e){return t(n,e)}):t(n,i)}}}}]).default});