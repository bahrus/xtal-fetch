(function(){function define(custEl){var tagName=custEl.is;if(customElements.get(tagName)){console.warn("Already registered "+tagName);return}customElements.define(tagName,custEl)}var disabled="disabled";var fetch$="fetch",href="href",as="as",XtalFetchGet=function(_XtallatX){babelHelpers.inherits(XtalFetchGet,_XtallatX);function XtalFetchGet(){var _this3;babelHelpers.classCallCheck(this,XtalFetchGet);_this3=babelHelpers.possibleConstructorReturn(this,(XtalFetchGet.__proto__||Object.getPrototypeOf(XtalFetchGet)).apply(this,arguments));_this3._reqInit={credentials:"same-origin"};_this3._as="json";return _this3}babelHelpers.createClass(XtalFetchGet,[{key:"attributeChangedCallback",value:function attributeChangedCallback(name,oldVal,newVal){switch(name){case fetch$:this["_"+name]=null!==newVal;break;default:this["_"+name]=newVal;}babelHelpers.get(XtalFetchGet.prototype.__proto__||Object.getPrototypeOf(XtalFetchGet.prototype),"attributeChangedCallback",this).call(this,name,oldVal,newVal);this.onPropsChange()}},{key:"onPropsChange",value:function onPropsChange(){this.loadNewUrl()}},{key:"loadNewUrl",value:function loadNewUrl(){if(!this.fetch||!this.href||this.disabled||!this._connected)return;this.do()}},{key:"do",value:function _do(){var _this4=this;self.fetch(this.href,this._reqInit).then(function(resp){resp[_this4._as]().then(function(result){_this4.result=result})})}},{key:"connectedCallback",value:function connectedCallback(){this._upgradeProperties([fetch$,href]);this._connected=!0;this.onPropsChange()}},{key:"fetch",get:function get(){return this._fetch},set:function set(val){this.attr(fetch$,val,"")}},{key:"as",get:function get(){return this._as},set:function set(val){this.attr(as,val)}},{key:"href",get:function get(){return this._href},set:function set(val){this.attr(href,val)}},{key:"result",get:function get(){return this._result},set:function set(val){this._result=val;this.value=val;this.de("result",{value:val})}}],[{key:"is",get:function get(){return"xtal-fetch-get"}},{key:"observedAttributes",get:function get(){return babelHelpers.get(XtalFetchGet.__proto__||Object.getPrototypeOf(XtalFetchGet),"observedAttributes",this).concat([fetch$,href,as])}}]);return XtalFetchGet}(function(superClass){return function(_superClass){babelHelpers.inherits(_class,_superClass);function _class(){var _this;babelHelpers.classCallCheck(this,_class);_this=babelHelpers.possibleConstructorReturn(this,(_class.__proto__||Object.getPrototypeOf(_class)).apply(this,arguments));_this._evCount={};return _this}babelHelpers.createClass(_class,[{key:"attr",value:function attr(name,val,trueVal){var v=val?"set":"remove";this[v+"Attribute"](name,trueVal||val)}},{key:"to$",value:function to$(n){var mod=n%2;return(n-mod)/2+"-"+mod}},{key:"incAttr",value:function incAttr(name){var ec=this._evCount;if(name in ec){ec[name]++}else{ec[name]=0}this.attr("data-"+name,this.to$(ec[name]))}},{key:"attributeChangedCallback",value:function attributeChangedCallback(name,oldVal,newVal){switch(name){case disabled:this._disabled=null!==newVal;break;}}},{key:"de",value:function de(name,detail,asIs){var eventName=name+(asIs?"":"-changed"),newEvent=new CustomEvent(eventName,{detail:detail,bubbles:!0,composed:!1});this.dispatchEvent(newEvent);this.incAttr(eventName);return newEvent}},{key:"_upgradeProperties",value:function _upgradeProperties(props){var _this2=this;props.forEach(function(prop){if(_this2.hasOwnProperty(prop)){var value=_this2[prop];delete _this2[prop];_this2[prop]=value}})}},{key:"disabled",get:function get(){return this._disabled},set:function set(val){this.attr(disabled,val,"")}}],[{key:"observedAttributes",get:function get(){return[disabled]}}]);return _class}(superClass)}(HTMLElement));define(XtalFetchGet);function snakeToCamel(s){return s.replace(/(\-\w)/g,function(m){return m[1].toUpperCase()})}var debounceDuration="debounce-duration",reqInitRequired="req-init-required",cacheResults="cache-results",insertResults="insert-results",baseLinkId="base-link-id",req_init="req-init",XtalFetchReq=function(_XtalFetchGet){babelHelpers.inherits(XtalFetchReq,_XtalFetchGet);function XtalFetchReq(){var _this5;babelHelpers.classCallCheck(this,XtalFetchReq);_this5=babelHelpers.possibleConstructorReturn(this,(XtalFetchReq.__proto__||Object.getPrototypeOf(XtalFetchReq)).call(this));_this5._cacheResults=!1;_this5._cachedResults={};_this5._fetchInProgress=!1;_this5._reqInit=null;return _this5}babelHelpers.createClass(XtalFetchReq,[{key:"onPropsChange",value:function onPropsChange(){if(this.reqInitRequired&&!this.reqInit)return;if(!this.__loadNewUrlDebouncer){this.debounceDurationHandler()}this.__loadNewUrlDebouncer()}},{key:"attributeChangedCallback",value:function attributeChangedCallback(name,oldValue,newValue){switch(name){case debounceDuration:this._debounceDuration=parseFloat(newValue);this.debounceDurationHandler();break;case reqInitRequired:case cacheResults:case insertResults:this["_"+snakeToCamel(name)]=null!==newValue;break;case baseLinkId:this._baseLinkId=newValue;break;case req_init:this._reqInit=JSON.parse(newValue);break;}babelHelpers.get(XtalFetchReq.prototype.__proto__||Object.getPrototypeOf(XtalFetchReq.prototype),"attributeChangedCallback",this).call(this,name,oldValue,newValue)}},{key:"debounce",value:function debounce(func,wait,immediate){var timeout;return function(){var context=this,args=arguments;clearTimeout(timeout);timeout=setTimeout(function(){timeout=null;if(!immediate)func.apply(context,args)},wait);if(immediate&&!timeout)func.apply(context,args)}}},{key:"debounceDurationHandler",value:function debounceDurationHandler(){var _this6=this;this.__loadNewUrlDebouncer=this.debounce(function(){_this6.loadNewUrl()},this._debounceDuration)}},{key:"do",value:function _do(){var _this7=this;this.errorResponse=null;if(this._cacheResults){var val=this.cachedResults[this._href];if(val){this.result=val;return}}this.fetchInProgress=!0;var href=this.href;if(this._baseLinkId){var link=self[this._baseLinkId];if(link)href=link.href+href}self.fetch(href,this._reqInit).then(function(resp){_this7.fetchInProgress=!1;resp[_this7._as]().then(function(result){if(200!==resp.status){_this7.errorResponse=resp;var respText=resp.text;if(respText)respText().then(function(val){_this7.errorText=val})}else{_this7.result=result;if(_this7.cachedResults){_this7.cachedResults[_this7._href]=result}if("string"===typeof result&&_this7._insertResults){_this7.innerHTML=result}var detail={href:_this7.href,result:result};_this7.de("fetch-complete",detail,!0)}})})}},{key:"connectedCallback",value:function connectedCallback(){this._upgradeProperties(["debounceDuration","reqInitRequired","cacheResults","reqInit"]);babelHelpers.get(XtalFetchReq.prototype.__proto__||Object.getPrototypeOf(XtalFetchReq.prototype),"connectedCallback",this).call(this)}},{key:"reqInit",get:function get(){return this._reqInit},set:function set(val){this._reqInit=val;this.onPropsChange()}},{key:"cacheResults",get:function get(){return this._cacheResults},set:function set(val){this.attr(cacheResults,val,"")}},{key:"cachedResults",get:function get(){return this._cachedResults}},{key:"reqInitRequired",get:function get(){return this.hasAttribute(reqInitRequired)},set:function set(val){this.attr(reqInitRequired,val,"")}},{key:"debounceDuration",get:function get(){return this._debounceDuration},set:function set(val){this.setAttribute(debounceDuration,val.toString())}},{key:"errorResponse",get:function get(){return this._errorResponse},set:function set(val){this._errorResponse=val;this.de("error-response",{value:val})}},{key:"errorText",get:function get(){return this._errorText},set:function set(val){this._errorText=val;this.de("error-text",{value:val})}},{key:"fetchInProgress",get:function get(){return this._fetchInProgress},set:function set(val){this._fetchInProgress=val;this.de("fetch-in-progress",{value:val})}},{key:"insertResults",get:function get(){return this._insertResults},set:function set(val){this.attr(insertResults,val,"")}},{key:"baseLinkId",get:function get(){return this._baseLinkId},set:function set(val){this.setAttribute(baseLinkId,val)}}],[{key:"is",get:function get(){return"xtal-fetch-req"}},{key:"observedAttributes",get:function get(){return babelHelpers.get(XtalFetchReq.__proto__||Object.getPrototypeOf(XtalFetchReq),"observedAttributes",this).concat([debounceDuration,reqInitRequired,cacheResults,insertResults,baseLinkId,req_init])}}]);return XtalFetchReq}(XtalFetchGet);if(!customElements.get(XtalFetchReq.is)){customElements.define(XtalFetchReq.is,XtalFetchReq)}var forEach="for-each",setPath="set-path",XtalFetchEntities=function(_XtalFetchReq){babelHelpers.inherits(XtalFetchEntities,_XtalFetchReq);function XtalFetchEntities(){babelHelpers.classCallCheck(this,XtalFetchEntities);return babelHelpers.possibleConstructorReturn(this,(XtalFetchEntities.__proto__||Object.getPrototypeOf(XtalFetchEntities)).apply(this,arguments))}babelHelpers.createClass(XtalFetchEntities,[{key:"attributeChangedCallback",value:function attributeChangedCallback(name,oldValue,newValue){switch(name){case setPath:case forEach:this["_"+snakeToCamel(name)]=newValue;}babelHelpers.get(XtalFetchEntities.prototype.__proto__||Object.getPrototypeOf(XtalFetchEntities.prototype),"attributeChangedCallback",this).call(this,name,oldValue,newValue)}},{key:"connectedCallback",value:function connectedCallback(){babelHelpers.get(XtalFetchEntities.prototype.__proto__||Object.getPrototypeOf(XtalFetchEntities.prototype),"connectedCallback",this).call(this);this._upgradeProperties(["forEach","setPath","inEntities"])}},{key:"onPropsChange",value:function onPropsChange(){var hasAtLeastOneProp=this.setPath||this.forEach||this.inEntities;if(hasAtLeastOneProp){this._hasAllThreeProps=this._setPath&&this._forEach&&this.inEntities;if(!this._hasAllThreeProps){return}}babelHelpers.get(XtalFetchEntities.prototype.__proto__||Object.getPrototypeOf(XtalFetchEntities.prototype),"onPropsChange",this).call(this)}},{key:"do",value:function _do(){var _this8=this;if(!this._hasAllThreeProps){babelHelpers.get(XtalFetchEntities.prototype.__proto__||Object.getPrototypeOf(XtalFetchEntities.prototype),"do",this).call(this);return}var keys=this._forEach.split(","),remainingCalls=this._inEntities.length;this.fetchInProgress=!0;for(var counter=0,base=this._baseLinkId?self[this._baseLinkId].href:"",_loop=function(i){var entity=_this8._inEntities[i];entity.__xtal_idx=counter;counter++;var href=_this8._href;keys.forEach(function(key){href=href.replace(":"+key,entity[key])});href=base+href;if(_this8._cacheResults){var val=_this8.cachedResults[href];if(val){entity[_this8._setPath]=val;remainingCalls--;if(0===remainingCalls)_this8.fetchInProgress=!1;return{v:void 0}}}self.fetch(href,_this8._reqInit).then(function(resp){if(200!==resp.status){resp.text().then(function(val){_this8.errorText=val});_this8.errorResponse=resp}else{resp[_this8._as]().then(function(val){remainingCalls--;if(0===remainingCalls){_this8.fetchInProgress=!1;_this8.result=_this8.inEntities.slice(0)}if(_this8._cacheResults)_this8.cachedResults[href]=val;entity[_this8._setPath]=val;var detail={entity:entity,href:href};_this8.dispatchEvent(new CustomEvent("fetch-complete",{detail:detail,bubbles:!0,composed:!1}))})}})},i=0,ii=this._inEntities.length,_ret;i<ii;i++){_ret=_loop(i,ii);if("object"===babelHelpers.typeof(_ret))return _ret.v}}},{key:"forEach",get:function get(){return this._forEach||this.getAttribute(forEach)},set:function set(val){this.attr(forEach,val)}},{key:"setPath",get:function get(){return this._setPath||this.getAttribute(setPath)},set:function set(val){this.attr(setPath,val)}},{key:"inEntities",get:function get(){return this._inEntities},set:function set(val){this._inEntities=val;this.onPropsChange()}}],[{key:"is",get:function get(){return"xtal-fetch-entities"}},{key:"observedAttributes",get:function get(){return babelHelpers.get(XtalFetchEntities.__proto__||Object.getPrototypeOf(XtalFetchEntities),"observedAttributes",this).concat([forEach,setPath])}}]);return XtalFetchEntities}(XtalFetchReq);define(XtalFetchEntities);var XtalFetch=function(_XtalFetchEntities){babelHelpers.inherits(XtalFetch,_XtalFetchEntities);function XtalFetch(){babelHelpers.classCallCheck(this,XtalFetch);return babelHelpers.possibleConstructorReturn(this,(XtalFetch.__proto__||Object.getPrototypeOf(XtalFetch)).apply(this,arguments))}babelHelpers.createClass(XtalFetch,null,[{key:"is",get:function get(){return"xtal-fetch"}}]);return XtalFetch}(XtalFetchEntities);define(XtalFetch)})();