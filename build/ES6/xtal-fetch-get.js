import{XtallatX}from"./node_modules/xtal-latx/xtal-latx.js";const fetch="fetch",href="href",as="as";export class XtalFetchGet extends XtallatX(HTMLElement){constructor(){super(...arguments);this._reqInit={credentials:"same-origin"};this._as="json"}static get is(){return"xtal-fetch-get"}get fetch(){return this._fetch}set fetch(val){this.attr(fetch,val,"")}get as(){return this._as}set as(val){this.attr(as,val)}get href(){return this._href}set href(val){this.attr(href,val)}get result(){return this._result}set result(val){this._result=val;this.value=val;this.de("result",{value:val})}static get observedAttributes(){return super.observedAttributes.concat([fetch,href,as])}attributeChangedCallback(name,oldVal,newVal){switch(name){case fetch:this["_"+name]=null!==newVal;break;default:this["_"+name]=newVal;}super.attributeChangedCallback(name,oldVal,newVal);this.onPropsChange()}onPropsChange(){this.loadNewUrl()}loadNewUrl(){if(!this.fetch||!this.href||this.disabled||!this._connected)return;this.do()}do(){self.fetch(this.href,this._reqInit).then(resp=>{resp[this._as]().then(result=>{this.result=result})})}connectedCallback(){this._upgradeProperties([fetch,href]);this._connected=!0;this.onPropsChange()}}if(!customElements.get(XtalFetchGet.is)){customElements.define(XtalFetchGet.is,XtalFetchGet)}