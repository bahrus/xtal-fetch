(function(){const disabled="disabled";function XtallatX(superClass){return class extends superClass{constructor(){super(...arguments);this._evCount={}}static get observedAttributes(){return[disabled]}get disabled(){return this._disabled}set disabled(val){this.attr(disabled,val,"")}attr(name,val,trueVal){if(val){this.setAttribute(name,trueVal||val)}else{this.removeAttribute(name)}}to$(number){const mod=number%2;return(number-mod)/2+"-"+mod}incAttr(name){const ec=this._evCount;if(name in ec){ec[name]++}else{ec[name]=0}this.attr("data-"+name,this.to$(ec[name]))}attributeChangedCallback(name,oldVal,newVal){switch(name){case disabled:this._disabled=null!==newVal;break;}}de(name,detail){const eventName=name+"-changed",newEvent=new CustomEvent(eventName,{detail:detail,bubbles:!0,composed:!1});this.dispatchEvent(newEvent);this.incAttr(eventName);return newEvent}_upgradeProperties(props){props.forEach(prop=>{if(this.hasOwnProperty(prop)){let value=this[prop];delete this[prop];this[prop]=value}})}}}const fetch$="fetch",href="href",as="as";class XtalFetchGet extends XtallatX(HTMLElement){constructor(){super(...arguments);this._reqInit={credentials:"same-origin"};this._as="json"}static get is(){return"xtal-fetch-get"}get fetch(){return this._fetch}set fetch(val){this.attr(fetch$,val,"")}get as(){return this._as}set as(val){this.attr(as,val)}get href(){return this._href}set href(val){this.attr(href,val)}get result(){return this._result}set result(val){this._result=val;this.value=val;this.de("result",{value:val})}static get observedAttributes(){return super.observedAttributes.concat([fetch$,href,as])}attributeChangedCallback(name,oldVal,newVal){switch(name){case fetch$:this["_"+name]=null!==newVal;break;default:this["_"+name]=newVal;}super.attributeChangedCallback(name,oldVal,newVal);this.onPropsChange()}onPropsChange(){this.loadNewUrl()}loadNewUrl(){if(!this.fetch||!this.href||this.disabled||!this._connected)return;this.do()}do(){self.fetch(this.href,this._reqInit).then(resp=>{resp[this._as]().then(result=>{this.result=result})})}connectedCallback(){this._upgradeProperties([fetch$,href]);this._connected=!0;this.onPropsChange()}}if(!customElements.get(XtalFetchGet.is)){customElements.define(XtalFetchGet.is,XtalFetchGet)}function snakeToCamel(s){return s.replace(/(\-\w)/g,function(m){return m[1].toUpperCase()})}const debounceDuration="debounce-duration",reqInitRequired="req-init-required",cacheResults="cache-results",insertResults="insert-results",baseLinkId="base-link-id",req_init="req-init";class XtalFetchReq extends XtalFetchGet{constructor(){super();this._cacheResults=!1;this._cachedResults={};this._fetchInProgress=!1;this._reqInit=null}get reqInit(){return this._reqInit}set reqInit(val){this._reqInit=val;this.onPropsChange()}onPropsChange(){if(this.reqInitRequired&&!this.reqInit)return;if(!this.__loadNewUrlDebouncer){this.debounceDurationHandler()}this.__loadNewUrlDebouncer()}static get is(){return"xtal-fetch-req"}get cacheResults(){return this._cacheResults}set cacheResults(val){this.attr(cacheResults,val,"")}get cachedResults(){return this._cachedResults}get reqInitRequired(){return this.hasAttribute(reqInitRequired)}set reqInitRequired(val){this.attr(reqInitRequired,val,"")}get debounceDuration(){return this._debounceDuration}set debounceDuration(val){this.setAttribute(debounceDuration,val.toString())}get errorResponse(){return this._errorResponse}set errorResponse(val){this._errorResponse=val;this.de("error-response",{value:val})}get errorText(){return this._errorText}set errorText(val){this._errorText=val;this.de("error-text",{value:val})}get fetchInProgress(){return this._fetchInProgress}set fetchInProgress(val){this._fetchInProgress=val;this.de("fetch-in-progress",{value:val})}get insertResults(){return this._insertResults}set insertResults(val){this.attr(insertResults,val,"")}get baseLinkId(){return this._baseLinkId}set baseLinkId(val){this.setAttribute(baseLinkId,val)}static get observedAttributes(){return super.observedAttributes.concat([debounceDuration,reqInitRequired,cacheResults,insertResults,baseLinkId,req_init])}attributeChangedCallback(name,oldValue,newValue){switch(name){case debounceDuration:this._debounceDuration=parseFloat(newValue);this.debounceDurationHandler();break;case reqInitRequired:case cacheResults:case insertResults:this["_"+snakeToCamel(name)]=null!==newValue;break;case baseLinkId:this._baseLinkId=newValue;break;case req_init:this._reqInit=JSON.parse(newValue);break;}super.attributeChangedCallback(name,oldValue,newValue)}debounce(func,wait,immediate){let timeout;return function(){const context=this,args=arguments;clearTimeout(timeout);timeout=setTimeout(function(){timeout=null;if(!immediate)func.apply(context,args)},wait);if(immediate&&!timeout)func.apply(context,args)}}debounceDurationHandler(){this.__loadNewUrlDebouncer=this.debounce(()=>{this.loadNewUrl()},this._debounceDuration)}do(){this.errorResponse=null;if(this._cacheResults){const val=this.cachedResults[this._href];if(val){this.result=val;return}}this.fetchInProgress=!0;let href=this.href;if(this._baseLinkId){const link=self[this._baseLinkId];if(link)href=link.href+href}self.fetch(this.href,this._reqInit).then(resp=>{this.fetchInProgress=!1;resp[this._as]().then(result=>{if(200!==resp.status){this.errorResponse=resp;const respText=resp.text;if(respText)respText().then(val=>{this.errorText=val})}else{this.result=result;if(this.cachedResults){this.cachedResults[this._href]=result}if("string"===typeof result&&this._insertResults){this.innerHTML=result}const detail={href:this.href,result:result};this.dispatchEvent(new CustomEvent("fetch-complete",{detail:detail,bubbles:!0,composed:!1}))}})})}connectedCallback(){super.connectedCallback();this._upgradeProperties(["debounceDuration","reqInitRequired","cacheResults","reqInit"])}}if(!customElements.get(XtalFetchReq.is)){customElements.define(XtalFetchReq.is,XtalFetchReq)}const forEach="for-each",setPath="set-path";class XtalFetchEntities extends XtalFetchReq{static get is(){return"xtal-fetch-entities"}get forEach(){return this._forEach||this.getAttribute(forEach)}set forEach(val){this.attr(forEach,val)}get setPath(){return this._setPath||this.getAttribute(setPath)}set setPath(val){this.attr(setPath,val)}get inEntities(){return this._inEntities}set inEntities(val){this._inEntities=val;this.onPropsChange()}static get observedAttributes(){return super.observedAttributes.concat([forEach,setPath])}attributeChangedCallback(name,oldValue,newValue){switch(name){case setPath:case forEach:this["_"+snakeToCamel(name)]=newValue;}super.attributeChangedCallback(name,oldValue,newValue)}connectedCallback(){super.connectedCallback();this._upgradeProperties(["forEach","setPath","inEntities"])}onPropsChange(){const hasAtLeastOneProp=this.setPath||this.forEach||this.inEntities;if(hasAtLeastOneProp){this._hasAllThreeProps=this._setPath&&this._forEach&&this.inEntities;if(!this._hasAllThreeProps){return}}super.onPropsChange()}do(){if(!this._hasAllThreeProps){super.do();return}const keys=this._forEach.split(",");let remainingCalls=this._inEntities.length;this.fetchInProgress=!0;let counter=0;const base=this._baseLinkId?self[this._baseLinkId].href:"";for(let i=0,ii=this._inEntities.length;i<ii;i++){const entity=this._inEntities[i];entity.__xtal_idx=counter;counter++;let href=this._href;keys.forEach(key=>{href=href.replace(":"+key,entity[key])});href=base+href;if(this._cacheResults){const val=this.cachedResults[href];if(val){entity[this._setPath]=val;remainingCalls--;if(0===remainingCalls)this.fetchInProgress=!1;return}}self.fetch(href,this._reqInit).then(resp=>{if(200!==resp.status){resp.text().then(val=>{this.errorText=val});this.errorResponse=resp}else{resp[this._as]().then(val=>{remainingCalls--;if(0===remainingCalls){this.fetchInProgress=!1;this.result=this.inEntities.slice(0)}if(this._cacheResults)this.cachedResults[href]=val;entity[this._setPath]=val;const detail={entity:entity,href:href};this.dispatchEvent(new CustomEvent("fetch-complete",{detail:detail,bubbles:!0,composed:!1}))})}})}}}if(!customElements.get(XtalFetchEntities.is)){customElements.define(XtalFetchEntities.is,XtalFetchEntities)}class XtalFetch extends XtalFetchEntities{static get is(){return"xtal-fetch"}}if(!customElements.get(XtalFetch.is)){customElements.define(XtalFetch.is,XtalFetch)}})();