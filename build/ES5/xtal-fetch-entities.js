import{XtalFetchReq,snakeToCamel}from'./xtal-fetch-req.js';var forEach='for-each',setPath='set-path',XtalFetchEntities=function(a){function b(){return babelHelpers.classCallCheck(this,b),babelHelpers.possibleConstructorReturn(this,(b.__proto__||Object.getPrototypeOf(b)).apply(this,arguments))}return babelHelpers.inherits(b,a),babelHelpers.createClass(b,[{key:'attributeChangedCallback',value:function attributeChangedCallback(a,c,d){a===setPath||a===forEach?this['_'+snakeToCamel(a)]=d:void 0,babelHelpers.get(b.prototype.__proto__||Object.getPrototypeOf(b.prototype),'attributeChangedCallback',this).call(this,a,c,d)}},{key:'connectedCallback',value:function connectedCallback(){babelHelpers.get(b.prototype.__proto__||Object.getPrototypeOf(b.prototype),'connectedCallback',this).call(this),this._upgradeProperties(['forEach','setPath','inEntities'])}},{key:'onPropsChange',value:function onPropsChange(){var a=this._setPath||this._forEach||this.inEntities;a&&(this._hasAllThreeProps=this._setPath&&this._forEach&&this.inEntities,!this._hasAllThreeProps)||babelHelpers.get(b.prototype.__proto__||Object.getPrototypeOf(b.prototype),'onPropsChange',this).call(this)}},{key:'do',value:function _do(){var a=this;if(!this._hasAllThreeProps)return void babelHelpers.get(b.prototype.__proto__||Object.getPrototypeOf(b.prototype),'do',this).call(this);var c=this._forEach.split(','),d=this._inEntities.length;this.fetchInProgress=!0;for(var e,f=0,g=this._baseLinkId?self[this._baseLinkId].href:'',h=function(b){var e=a._inEntities[b];e.__xtal_idx=f,f++;var h=a._href;if(c.forEach(function(a){h=h.replace(':'+a,e[a])}),h=g+h,a._cacheResults){var i=a.cachedResults[h];if(i)return e[a._setPath]=i,d--,0===d&&(a.fetchInProgress=!1),{v:void 0}}fetch(h,a._reqInit).then(function(b){200===b.status?b[a._as]().then(function(b){d--,0===d&&(a.fetchInProgress=!1),a._cacheResults&&(a.cachedResults[h]=b),e[a._setPath]=b;var c={entity:e,href:h};a.dispatchEvent(new CustomEvent('fetch-complete',{detail:c,bubbles:!0,composed:!1}))}):(b.text().then(function(b){a.errorText=b}),a.errorResponse=b)})},j=0,i=this._inEntities.length;j<i;j++)if(e=h(j,i),'object'===('undefined'===typeof e?'undefined':babelHelpers.typeof(e)))return e.v}},{key:'forEach',get:function get(){return this._forEach},set:function set(a){this.setAttribute(forEach,a)}},{key:'setPath',get:function get(){return this._setPath},set:function set(a){this.setAttribute(setPath,a)}},{key:'inEntities',get:function get(){return this._inEntities},set:function set(a){this._inEntities=a,this.onPropsChange()}}],[{key:'is',get:function get(){return'xtal-fetch-entities'}},{key:'observedAttributes',get:function get(){return babelHelpers.get(b.__proto__||Object.getPrototypeOf(b),'observedAttributes',this).concat([forEach,setPath])}}]),b}(XtalFetchReq);customElements.get(XtalFetchEntities.is)||customElements.define(XtalFetchEntities.is,XtalFetchEntities);var XtalFetch=function(a){function b(){return babelHelpers.classCallCheck(this,b),babelHelpers.possibleConstructorReturn(this,(b.__proto__||Object.getPrototypeOf(b)).apply(this,arguments))}return babelHelpers.inherits(b,a),babelHelpers.createClass(b,null,[{key:'is',get:function get(){return'xtal-fetch'}}]),b}(XtalFetchEntities);customElements.get(XtalFetch.is)||customElements.define(XtalFetchEntities.is,XtalFetch);