import{XtallatX}from"./node_modules/xtal-latx/xtal-latx.js";var fetch$="fetch",href="href",as="as";export var XtalFetchGet=function(_XtallatX){babelHelpers.inherits(XtalFetchGet,_XtallatX);function XtalFetchGet(){var _this;babelHelpers.classCallCheck(this,XtalFetchGet);_this=babelHelpers.possibleConstructorReturn(this,(XtalFetchGet.__proto__||Object.getPrototypeOf(XtalFetchGet)).apply(this,arguments));_this._reqInit={credentials:"same-origin"};_this._as="json";return _this}babelHelpers.createClass(XtalFetchGet,[{key:"attributeChangedCallback",value:function attributeChangedCallback(name,oldVal,newVal){switch(name){case fetch$:this["_"+name]=null!==newVal;break;default:this["_"+name]=newVal;}babelHelpers.get(XtalFetchGet.prototype.__proto__||Object.getPrototypeOf(XtalFetchGet.prototype),"attributeChangedCallback",this).call(this,name,oldVal,newVal);this.onPropsChange()}},{key:"onPropsChange",value:function onPropsChange(){this.loadNewUrl()}},{key:"loadNewUrl",value:function loadNewUrl(){if(!this.fetch||!this.href||this.disabled||!this._connected)return;this.do()}},{key:"do",value:function _do(){var _this2=this;self.fetch(this.href,this._reqInit).then(function(resp){resp[_this2._as]().then(function(result){_this2.result=result})})}},{key:"connectedCallback",value:function connectedCallback(){this._upgradeProperties([fetch$,href]);this._connected=!0;this.onPropsChange()}},{key:"fetch",get:function get(){return this._fetch},set:function set(val){this.attr(fetch$,val,"")}},{key:"as",get:function get(){return this._as},set:function set(val){this.attr(as,val)}},{key:"href",get:function get(){return this._href},set:function set(val){this.attr(href,val)}},{key:"result",get:function get(){return this._result},set:function set(val){this._result=val;this.value=val;this.de("result",{value:val})}}],[{key:"is",get:function get(){return"xtal-fetch-get"}},{key:"observedAttributes",get:function get(){return babelHelpers.get(XtalFetchGet.__proto__||Object.getPrototypeOf(XtalFetchGet),"observedAttributes",this).concat([fetch$,href,as])}}]);return XtalFetchGet}(XtallatX(HTMLElement));if(!customElements.get(XtalFetchGet.is)){customElements.define(XtalFetchGet.is,XtalFetchGet)}