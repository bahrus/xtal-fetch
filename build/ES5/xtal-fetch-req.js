import{XtalFetchGet}from"./xtal-fetch-get.js";export function snakeToCamel(a){return a.replace(/(\-\w)/g,function(a){return a[1].toUpperCase()})}var debounceDuration="debounce-duration",reqInitRequired="req-init-required",cacheResults="cache-results",insertResults="insert-results",baseLinkId="base-link-id";export var XtalFetchReq=function(a){function b(){var a;return babelHelpers.classCallCheck(this,b),a=babelHelpers.possibleConstructorReturn(this,(b.__proto__||Object.getPrototypeOf(b)).call(this)),a._cacheResults=!1,a._cachedResults={},a._fetchInProgress=!1,a._reqInit=null,a}return babelHelpers.inherits(b,a),babelHelpers.createClass(b,[{key:"onPropsChange",value:function onPropsChange(){this.reqInitRequired&&!this.reqInit||(!this.__loadNewUrlDebouncer&&this.debounceDurationHandler(),this.__loadNewUrlDebouncer())}},{key:"attributeChangedCallback",value:function attributeChangedCallback(a,c,d){"debounce-duration"===a?(this._debounceDuration=parseFloat(d),this.debounceDurationHandler()):a===reqInitRequired||a===cacheResults||a===insertResults?this["_"+snakeToCamel(a)]=null!==d:a===baseLinkId?this._baseLinkId=d:void 0,babelHelpers.get(b.prototype.__proto__||Object.getPrototypeOf(b.prototype),"attributeChangedCallback",this).call(this,a,c,d)}},{key:"debounce",value:function debounce(a,b,c){var d;return function(){var e=this,f=arguments;clearTimeout(d),d=setTimeout(function(){d=null,c||a.apply(e,f)},b),c&&!d&&a.apply(e,f)}}},{key:"debounceDurationHandler",value:function debounceDurationHandler(){var a=this;this.__loadNewUrlDebouncer=this.debounce(function(){a.loadNewUrl()},this._debounceDuration)}},{key:"do",value:function _do(){var a=this;if(this.errorResponse=null,this._cacheResults){var c=this.cachedResults[this._href];if(c)return void(this.result=c)}this.fetchInProgress=!0;var b=this.href;if(this._baseLinkId){var d=self[this._baseLinkId];d&&(b=d.href+b)}self.fetch(this.href,this._reqInit).then(function(b){a.fetchInProgress=!1,b[a._as]().then(function(c){if(200!==b.status)a.errorResponse=b,b.text().then(function(b){a.errorText=b});else{a.result=c,a.cachedResults&&(a.cachedResults[a._href]=c),"string"===typeof c&&a._insertResults&&(a.innerHTML=c);var d={href:a.href,result:c};a.dispatchEvent(new CustomEvent("fetch-complete",{detail:d,bubbles:!0,composed:!1}))}})})}},{key:"connectedCallback",value:function connectedCallback(){babelHelpers.get(b.prototype.__proto__||Object.getPrototypeOf(b.prototype),"connectedCallback",this).call(this),this._upgradeProperties(["debounceDuration","reqInitRequired","cacheResults","reqInit"])}},{key:"reqInit",get:function get(){return this._reqInit},set:function set(a){this._reqInit=a,this.onPropsChange()}},{key:"cacheResults",get:function get(){return this._cacheResults},set:function set(a){a?this.setAttribute(cacheResults,""):this.removeAttribute(cacheResults)}},{key:"cachedResults",get:function get(){return this._cachedResults}},{key:"reqInitRequired",get:function get(){return this.hasAttribute(reqInitRequired)},set:function set(a){a?this.setAttribute(reqInitRequired,""):this.removeAttribute(reqInitRequired)}},{key:"debounceDuration",get:function get(){return this._debounceDuration},set:function set(a){this.setAttribute("debounce-duration",a.toString())}},{key:"errorResponse",get:function get(){return this._errorResponse},set:function set(a){this._errorResponse=a,this.de("error-response",{value:a})}},{key:"errorText",get:function get(){return this._errorText},set:function set(a){this._errorText=a,this.de("error-text",{value:a})}},{key:"fetchInProgress",get:function get(){return this._fetchInProgress},set:function set(a){this._fetchInProgress=a,this.de("fetch-in-progress",{value:a})}},{key:"insertResults",get:function get(){return this._insertResults},set:function set(a){a?this.setAttribute(insertResults,""):this.removeAttribute(insertResults)}},{key:"baseLinkId",get:function get(){return this._baseLinkId},set:function set(a){this.setAttribute(baseLinkId,a)}}],[{key:"is",get:function get(){return"xtal-fetch-req"}},{key:"observedAttributes",get:function get(){return babelHelpers.get(b.__proto__||Object.getPrototypeOf(b),"observedAttributes",this).concat(["debounce-duration",reqInitRequired,cacheResults,insertResults,baseLinkId])}}]),b}(XtalFetchGet);customElements.get(XtalFetchReq.is)||customElements.define(XtalFetchReq.is,XtalFetchReq);