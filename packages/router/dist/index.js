/**
 * Copyright (c) 2020 The Nuinalp and APO Softworks Authors. All rights reserved.
 * Use of this source code is governed by a BSD-style license that can be
 * found in the LICENSE file.
 **/"use strict";Object.defineProperty(exports,"__esModule",{value:!0});var context={options:{}},routes=[],cbs=[],macros={},getContext=()=>context,setContext=({options:t,...e},r)=>{const u={...r};t&&Object.keys(t).forEach(e=>{if(e.match(/^!/))u[e.replace(/^!/,"")]=t[e];else if(Array.isArray(t[e])&&Array.isArray(r[e])){const o=t[e];u[e]=[...r[e].filter(t=>!o.find(e=>e===t)),...o]}else"object"==typeof t[e]&&"object"==typeof r[e]?u[e]={...r[e],...t[e]}:u[e]=t[e]}),context={...e,options:{...u}}},clearContext=()=>{context={options:{}}},getRoutes=()=>routes,addRoute=(e,t,o,r)=>{const{prefix:u,...a}=getContext();t=`/${(void 0===u?"/":u)+t}`.replace(/\/$/,"").replace(/^(\\+|\/+)/gm,"/"),e="string"==typeof e?e.replace(/(\\+|\/+)/gm,"/").replace(/(\\|\/)$/gm,"").replace(/^(\\|\/)/gm,""):e;routes.push({file:e,path:t,method:o,options:{...a.options,...r}});const s=routes.length-1;return{options:e=>{routes[s].options={...routes[s].options,...e}}}},clearRoutes=()=>{routes=[]},getCallbacks=()=>cbs,addCallback=e=>{cbs.push(e)},clearCallbacks=()=>{cbs=[]},getMacro=e=>{if(!macros[e])throw new Error(`Macro '${e}' not found`);return macros[e]},setMacro=(e,t)=>{macros[e]=t},routeAnyMethod=(e,t,o={})=>addRoute(t,e,"ANY",o),routeGetMethod=(e,t,o={})=>addRoute(t,e,"GET",o),routePostMethod=(e,t,o={})=>addRoute(t,e,"POST",o),routePatchMethod=(e,t,o={})=>addRoute(t,e,"PATCH",o),routePutMethod=(e,t,o={})=>addRoute(t,e,"PUT",o),routeDeleteMethod=(e,t,o={})=>addRoute(t,e,"DELETE",o),routeMacro=(e,t)=>{setMacro(e,t)},routeUseMacro=async(e,...t)=>{const o=getMacro(e);await o(...t)},routeOptions=(e,t)=>{const o={...getContext(),options:{...e}},r={...getContext().options};addCallback(()=>{setContext(o,r),t()})},routeMany=(e,t,o,r={})=>{e.includes("GET")&&routeGetMethod(t,o,r),e.includes("PUT")&&routePutMethod(t,o,r),e.includes("POST")&&routePostMethod(t,o,r),e.includes("PATCH")&&routePatchMethod(t,o,r),e.includes("DELETE")&&routeDeleteMethod(t,o,r)},routeGroup=(e,t,o)=>{e=(void 0===getContext().prefix?"":getContext().prefix)+(e||"");const r={...getContext(),...o,prefix:e},u={...getContext().options};addCallback(()=>{setContext(r,u),t()})},routeBuild=(e=!0)=>{let t=getCallbacks();for(;0<t.length;){clearCallbacks();for(let e=0;e<t.length;e+=1)t[e]();t=getCallbacks()}const o=getRoutes();e&&clearRoutes();const r=[];return o.reverse().forEach(t=>{r.find(e=>e.path===t.path&&e.method===t.method)||r.push(t)}),r.reverse()},clearMethod=()=>{clearRoutes(),clearContext()};routeMacro("resource",(e,t)=>{routeGetMethod(`${e}`,`${t}@index`),routePostMethod(`${e}`,`${t}@store`),routeGroup("/{id}",()=>{routeGetMethod("/",`${t}@show`),routePatchMethod("/",`${t}@update`),routePutMethod("/",`${t}@update`),routeDeleteMethod("/",`${t}@destroy`)})});var route=routeAnyMethod;route.any=routeAnyMethod,route.get=routeGetMethod,route.post=routePostMethod,route.put=routePutMethod,route.patch=routePatchMethod,route.delete=routeDeleteMethod,route.options=routeOptions,route.group=routeGroup,route.many=routeMany,route.build=routeBuild,route.clear=clearMethod,route.macro=routeMacro,route.use=routeUseMacro;var route_default=route;function stringToType(e){return"true"===e||"false"!==e&&(`${parseFloat(e)}`===e?parseFloat(e):e)}function buildQueryParams(e=""){const[t,...o]=e.split("?"),r={};return new URLSearchParams(o.join("?")).forEach((e,t)=>r[t]=stringToType(e)||!0),[t,r]}var routerModule=(e,o,t,s={})=>{const[r,u]=buildQueryParams(e.replace(/(\\|\/)^/,"")),n=new RegExp(`${s.variableEnclose||"{"}\\s*\\S+\\??\\s*${s.variableEnclose||"}"}`),l=new RegExp(`\\?{1}\\s*${s.variableEnclose||"}"}`);let c={};t=t.find(e=>{c={};const t=e.path.split("/").filter(e=>""!==e),a=r.split("/").filter(e=>""!==e);if(o!==e.method&&("OPTIONS"!==o||!1===s.allowOptionsMatch)&&"ANY"!==e.method)return!1;if(a.length>t.length&&"*"!==t[t.length-1])return!1;e=t.filter((e,t)=>{var o=n.test(e),r=l.test(e),u=e.replace(new RegExp(`${s.variableEnclose||"{"}\\s*`),"").replace(new RegExp(`\\??\\s*${s.variableEnclose||"}"}`),"");return o?(a[t]&&(c[u]=a[t]),!r&&!a[t]):e!==a[t]}).length;return!e&&"*"===t[t.length-1]&&a.length>t.length&&(c["*"]=a.splice(0,t.length)),!e});if(t)return{...t,options:t.options,variables:c,query:u}},router_default=routerModule;exports.route=route_default,exports.router=router_default;
//# sourceMappingURL=index.js.map