import{XtalFetchGet}from"./xtal-fetch-get.js";import{define}from"./node_modules/xtal-latx/define.js";import{baseLinkId,BaseLinkId}from"./node_modules/xtal-latx/base-link-id.js";export function snakeToCamel(s){return s.replace(/(\-\w)/g,function(m){return m[1].toUpperCase()})}const debounceDuration="debounce-duration",reqInitRequired="req-init-required",cacheResults="cache-results",insertResults="insert-results",req_init="req-init";export class XtalFetchReq extends BaseLinkId(XtalFetchGet){constructor(){super();this._cacheResults=!1;this._cachedResults={};this._fetchInProgress=!1;this._reqInit=null}get reqInit(){return this._reqInit}set reqInit(val){this._reqInit=val;this.onPropsChange()}onPropsChange(){if(this.reqInitRequired&&!this.reqInit)return;if(!this.__loadNewUrlDebouncer){this.debounceDurationHandler()}this.__loadNewUrlDebouncer()}static get is(){return"xtal-fetch-req"}get cacheResults(){return this._cacheResults}set cacheResults(val){this.attr(cacheResults,val,"")}get cachedResults(){return this._cachedResults}get reqInitRequired(){return this.hasAttribute(reqInitRequired)}set reqInitRequired(val){this.attr(reqInitRequired,val,"")}get debounceDuration(){return this._debounceDuration}set debounceDuration(val){this.setAttribute(debounceDuration,val.toString())}get errorResponse(){return this._errorResponse}set errorResponse(val){this._errorResponse=val;this.de("error-response",{value:val})}get errorText(){return this._errorText}set errorText(val){this._errorText=val;this.de("error-text",{value:val})}get fetchInProgress(){return this._fetchInProgress}set fetchInProgress(val){this._fetchInProgress=val;this.de("fetch-in-progress",{value:val})}get insertResults(){return this._insertResults}set insertResults(val){this.attr(insertResults,val,"")}set abort(val){if(this._controller)this._controller.abort()}static get observedAttributes(){return super.observedAttributes.concat([debounceDuration,reqInitRequired,cacheResults,insertResults,baseLinkId,req_init])}attributeChangedCallback(name,oldValue,newValue){switch(name){case debounceDuration:this._debounceDuration=parseFloat(newValue);this.debounceDurationHandler();break;case reqInitRequired:case cacheResults:case insertResults:this["_"+snakeToCamel(name)]=null!==newValue;break;case baseLinkId:this._baseLinkId=newValue;break;case req_init:this._reqInit=JSON.parse(newValue);break;}super.attributeChangedCallback(name,oldValue,newValue)}debounce(func,wait,immediate){let timeout;return function(){const context=this,args=arguments;clearTimeout(timeout);timeout=setTimeout(function(){timeout=null;if(!immediate)func.apply(context,args)},wait);if(immediate&&!timeout)func.apply(context,args)}}debounceDurationHandler(){this.__loadNewUrlDebouncer=this.debounce(()=>{this.loadNewUrl()},this._debounceDuration)}do(){this.errorResponse=null;if(this._cacheResults){const val=this.cachedResults[this._href];if(val){this.result=val;return}else if(this._fetchInProgress){return}}this.fetchInProgress=!0;let href=this.href;href=this.getFullURL(href);if("undefined"!==typeof AbortController){this._controller=new AbortController;const sig=this._controller.signal;if(this._reqInit){this._reqInit.signal=sig}else{this._reqInit={signal:sig}}}self.fetch(href,this._reqInit).then(resp=>{this.fetchInProgress=!1;resp[this._as]().then(result=>{if(200!==resp.status){this.errorResponse=resp;const respText=resp.text;if(respText)respText().then(val=>{this.errorText=val})}else{this.result=result;if(this.cachedResults){this.cachedResults[this._href]=result}if("string"===typeof result&&this._insertResults){this.style.display=this._initDisp;this.innerHTML=result}const detail={href:this.href,result:result};this.de("fetch-complete",detail,!0)}})}).catch(err=>{if("AbortError"===err.name){console.log("Fetch aborted");this.fetchInProgress=!1}})}connectedCallback(){this._upgradeProperties(["debounceDuration","reqInitRequired","cacheResults","reqInit"]);super.connectedCallback()}}define(XtalFetchReq);