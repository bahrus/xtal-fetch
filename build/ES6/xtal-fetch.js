(function(){const a='xtal-fetch';if(customElements.get(a))return;const b={as:'as',baseLinkId:{cc:'baseLinkId',sc:'base-link-id'},cacheResults:{cc:'cacheResults',sc:'cache-results'},debounceDuration:{cc:'debounceDuration',sc:'debounce-duration'},fetch:'fetch',forEach:{cc:'forEach',sc:'for-each'},href:'href',inEntities:{cc:'inEntities',sc:'in-entities'},insertResults:{cc:'insertResults',sc:'insert-results'},reqInit:{cc:'reqInit',sc:'req-init'},reqInitRequired:{cc:'reqInitRequired',sc:'req-init-required'},setPath:{cc:'setPath',sc:'set-path'}},c={};for(var d in b){const a=b[d];a.sc?c[a.sc]='_'+a.cc:c[a]='_'+d}const e={errorResponse:{cc:'errorRespone',sc:'error-response'},errorText:{cc:'errorText',sc:'error-text'},fetchInProgress:{cc:'fetchInProgress',sc:'fetch-in-progress'},result:'result'};class f extends HTMLElement{constructor(){super(...arguments),this._as='text',this._cacheResults=!1,this._fetchInProgress=!1,this._cachedResults={},this.__loadNewUrlDebouncer=this.debounce(()=>{this.loadNewUrl()},0)}get[b.reqInit.cc](){return this._reqInit}set[b.reqInit.cc](a){this._reqInit=a,this.__loadNewUrlDebouncer()}get[b.reqInitRequired.cc](){return this._reqInitRequired}set[b.reqInitRequired.cc](a){a?this.setAttribute(b.reqInitRequired.sc,''):this.removeAttribute(b.reqInitRequired.sc)}get[b.href](){return this._href}set[b.href](a){this.setAttribute(b.href,a)}get[b.inEntities.cc](){return this._inEntities}set[b.inEntities.cc](a){this._inEntities=a,this.__loadNewUrlDebouncer()}get[e.result](){return this._result}set[e.result](a){this._result=a,this.de(e.result,{value:a})}get[b.forEach.cc](){return this._forEach}set[b.forEach.cc](a){this.setAttribute(b.forEach.sc,a)}get[b.fetch](){return this._fetch}set[b.fetch](a){a?this.setAttribute(b.fetch,''):this.removeAttribute(b.fetch)}get[b.setPath.cc](){return this._setPath}set[b.setPath.cc](a){this.setAttribute(b.setPath.sc,a)}get[b.as](){return this._as}set[b.as](a){this.setAttribute(b.as,a)}get[b.cacheResults.cc](){return this._cachedResults}set[b.cacheResults.cc](a){a?this.setAttribute(b.cacheResults.sc,''):this.removeAttribute(b.cacheResults.sc)}get[e.errorText.cc](){return this._errorText}set[e.errorText.cc](a){this._errorText=a,this.de(e.errorText.sc,{value:a})}get[e.errorResponse.cc](){return this._errorResponse}set[e.errorResponse.cc](a){this._errorResponse=a,this.de(e.errorResponse.sc,{value:a})}get[e.fetchInProgress.cc](){return this._fetchInProgress}set[e.fetchInProgress.cc](a){this._fetchInProgress=a,this.de(e.fetchInProgress.sc,{value:a})}get[b.baseLinkId.cc](){return this._baseLinkId}set[b.baseLinkId.cc](a){this.setAttribute(b.baseLinkId.sc,a)}get[b.debounceDuration.cc](){return this._debounceDuration}set[b.debounceDuration.cc](a){this.setAttribute(b.debounceDuration.sc,a.toString())}get[b.insertResults.cc](){return this._insertResults}set[b.insertResults.cc](a){a?this.setAttribute(b.insertResults.sc,''):this.removeAttribute(b.insertResults.sc)}get cachedResults(){return this._cachedResults}static get is(){return a}de(a,b){const c=new CustomEvent(a+'-changed',{detail:b,bubbles:!0,composed:!1});return this.dispatchEvent(c),c}_upgradeProperty(a){if(this.hasOwnProperty(a)){let b=this[a];delete this[a],this[a]=b}}connectedCallback(){for(var a in b)this._upgradeProperty(a)}static get observedAttributes(){const a=[];for(var b in c)a.push(b);return a}attributeChangedCallback(a,d,e){const f=c[a];a===b.as||a===b.baseLinkId.sc||a===b.forEach.sc||a===b.href||a===b.setPath.sc?this[f]=e:a===b.cacheResults.sc||a===b.fetch||a===b.insertResults.sc||a===b.reqInitRequired.sc?this[f]=null!==e:a===b.debounceDuration.sc?(this[f]=parseInt(e),this.debounceDurationHandler()):a===b.reqInit.sc?this[f]=JSON.parse(e):void 0;this.__loadNewUrlDebouncer()}debounce(a,b,c){let d;return function(){const e=this,f=arguments;clearTimeout(d),d=setTimeout(function(){d=null,c||a.apply(e,f)},b),c&&!d&&a.apply(e,f)}}debounceDurationHandler(){this.__loadNewUrlDebouncer=this.debounce(()=>{this.loadNewUrl()},this._debounceDuration)}loadNewUrl(){if(!this._fetch)return;if(this._reqInitRequired&&!this._reqInit)return;if(!this._href)return;this[e.errorText.cc]=null,this[e.errorResponse.cc]=null;const a=this._baseLinkId?self[this._baseLinkId].href:'',b=this;let c=0;if(this._forEach){if(!this._inEntities)return;const d=this._forEach.split(',');let f=this._inEntities.length;this[e.fetchInProgress.cc]=!0,this._inEntities.forEach((g)=>{g.__xtal_idx=c,c++;let h=a+this._href;if(d.forEach((a)=>{h=h.replace(':'+a,g[a])}),this._cacheResults){const a=this.cachedResults[h];if(a)return g[this._setPath]=a,f--,void(0===f&&(this[e.fetchInProgress.cc]=!1))}fetch(h,this._reqInit).then((a)=>{200===a.status?a[b._as]().then((a)=>{f--,0===f&&(this[e.fetchInProgress.cc]=!1),this._cacheResults&&(this.cachedResults[h]=a),g[this._setPath]=a;const b={entity:g,href:h};this.dispatchEvent(new CustomEvent('fetch-complete',{detail:b,bubbles:!0,composed:!1}))}):a.text().then((a)=>{this[e.errorText.cc]=a})})})}else{if(this._cacheResults){const a=this.cachedResults[this._href];if(a)return void(b[e.result]=a)}this[e.fetchInProgress.cc]=!0;const c=a+this._href;fetch(c,this._reqInit).then((a)=>{this[e.fetchInProgress.cc]=!1,200===a.status?a[b._as]().then((a)=>{this.cachedResults&&(this.cachedResults[this._href]=a),b[e.result]=a,'string'===typeof a&&this._insertResults&&(this.innerHTML=a,this.dispatchEvent(new CustomEvent('dom-change',{bubbles:!0,composed:!0})));this.dispatchEvent(new CustomEvent('fetch-complete',{detail:{href:c},bubbles:!0,composed:!1}))}):(this[e.errorResponse.cc]=a,a.text().then((a)=>{this[e.errorText.cc]=a}))}).catch((a)=>{this[e.errorResponse.cc]=a,this[e.fetchInProgress.cc]=!1})}}}customElements.define(f.is,f)})();