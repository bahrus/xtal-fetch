const fetch='fetch',href='href',disabled='disabled';export class XtalFetchGet extends HTMLElement{constructor(){super(...arguments),this._reqInit={credentials:'include'},this._as='json'}static get is(){return'xtal-fetch-get'}de(a,b){const c=new CustomEvent(a+'-changed',{detail:b,bubbles:!0,composed:!1});return this.dispatchEvent(c),c}get fetch(){return this._fetch}set fetch(a){a?this.setAttribute(fetch,''):this.removeAttribute(fetch)}get disabled(){return this._disabled}set disabled(a){a?this.setAttribute(disabled,''):this.removeAttribute(disabled)}get href(){return this._href}set href(a){this.setAttribute(href,a)}get result(){return this._result}set result(a){this._result=a,this.de('result',a)}static get observedAttributes(){return[fetch,href,disabled]}_upgradeProperties(a){a.forEach((a)=>{if(this.hasOwnProperty(a)){let b=this[a];delete this[a],this[a]=b}})}attributeChangedCallback(a,b,c){this['_'+a]=a===fetch||a===disabled?null!==c:c;this.onPropsChange()}onPropsChange(){this.loadNewUrl()}loadNewUrl(){this.fetch&&this.href&&!this.disabled&&this.do()}do(){self.fetch(this.href,this._reqInit).then((a)=>{a[this._as]().then((a)=>{this.result=a})})}connectedCallback(){this._upgradeProperties([fetch,href,disabled])}}customElements.get(XtalFetchGet.is)||customElements.define(XtalFetchGet.is,XtalFetchGet);