export  interface IXtalFetchProperties{
    as: string | polymer.PropObjectType,
    baseLinkId: string | polymer.PropObjectType,
    cacheResults: boolean | polymer.PropObjectType,
    debounceDuration: number | polymer.PropObjectType,
    errorText: string | polymer.PropObjectType,
    errorResponse: object | polymer.PropObjectType,
    fetch: boolean | polymer.PropObjectType,
    fetchInProgress: boolean | polymer.PropObjectType,
    forEach: string | polymer.PropObjectType,
    href: string | polymer.PropObjectType,
    inEntities: any[] | polymer.PropObjectType,
    insertResults: boolean | polymer.PropObjectType,
    reqInit: RequestInit| polymer.PropObjectType,
    reqInitRequired: boolean | polymer.PropObjectType,
    result: any | polymer.PropObjectType,
    setPath: string | polymer.PropObjectType,
}

(function () {    

    function initXtalFetch(){
        if(customElements.get('xtal-fetch')) return;
        /**
        * `xtal-fetch`
        * Polymer based wrapper around the fetch api call.  Note:  IE11 requires a polyfill for fetch / promises
        * 
        *
        * @customElement
        * @polymer
        * @demo demo/index.html
        */
        class XtalFetch  extends Polymer.Element  implements IXtalFetchProperties{
            /**
            * Fired  when a fetch has finished.
            *
            * @event fetch-complete
            */
            reqInit: RequestInit; reqInitRequired: boolean;
            href: string; inEntities: any[]; result: object; forEach: string; fetch; setPath;cacheResults;
            errorText;errorResponse;fetchInProgress = false; baseLinkId;
            as = 'text';
            private _cachedResults: {[key:string] : any} = {};
            get cachedResults(){
                return this._cachedResults;
            }
            debounceDuration: number;
            insertResults: boolean;
            static get is(){return 'xtal-fetch';}
            static get properties() : IXtalFetchProperties{
                return {
                    /**
                     * Possible values are 'text' and 'json'
                     */
                    as:{
                        type: String
                    },
                    /**
                     * Id of Link tag that has the base url connection
                     * Suggested use:  https://w3c.github.io/resource-hints/#preconnect
                     * The href attribute will be used to prepend the url property. 
                     */
                    baseLinkId:{
                        type: String,
                    },
                    /**
                     * 
                     */
                    cacheResults:{
                        type: Boolean
                    },
                    /**
                     * Time in milliseconds to wait for things to settle down before making fetch request
                     */
                    debounceDuration:{
                        type: Number,
                        observer: 'debounceDurationHandler'
                    },
                    errorResponse:{
                        type: Object,
                        notify: true,
                        readOnly: true
                    },
                    /**
                     * Expression for where to place an error response text.
                     */
                    errorText:{
                        type: Object,
                        notify: true,
                        readOnly: true
                    },
                    /**
                     * Needs to be true for any request to be made.
                     */
                    fetch:{
                        type:Boolean,
                        observer: '__loadNewUrlDebouncer'
                    },
                    /**
                     * Path / event name to notify that a fetch is in progress
                     */
                    fetchInProgress:{
                        type:Boolean,
                        notify: true,
                        readOnly: true,
                        reflectToAttribute: true,
                    },
                    /**
                     * A comma delimited list of keys to pluck from in-entities
                     */
                    forEach:{
                        type: String
                    },
                    /**
                     * Base url
                     */
                    href:{
                        type: String,
                        observer: '__loadNewUrlDebouncer',
                        reflectToAttribute: true
                    },
                    /**
                     * An array of entities that forEach keys will be plucked from.
                     * Fetch requests will be made iteratively (but in parallel) for each such entity
                     */
                    inEntities:{
                        type: Array,
                        observer: '__loadNewUrlDebouncer'
                    },
                    /**
                     * Place the contents of the fetch inside the tag itself.
                     */
                    insertResults:{
                        type: Boolean
                    },
                    /**
                     * The second parameter of the fetch call.  
                     * See, e.g. https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/fetch
                     */
                    reqInit:{
                        type: Object
                    },
                    /**
                     * This prevents the fetch request from occurring until the reqInit has some 
                     * defined value.
                     */
                    reqInitRequired:{
                        type: Boolean
                    },
                    
                    /**
                     * The expression for where to place the result.
                     */
                    result:{
                        type: Object,
                        notify: true,
                        readOnly: true
                    },

                    /**
                     * When looping through entities, calling fetch, place the results of the fetch in the path specified by this 
                     * property.
                     */
                    setPath:{
                        type: String,
                        value: 'result',
                        reflectToAttribute: true
                    }
                }
            }
            debounce(func, wait, immediate?) {
                let timeout;
                return function() {
                    const context = this, args = arguments;
                    clearTimeout(timeout);
                    timeout = setTimeout(function() {
                        timeout = null;
                        if (!immediate) func.apply(context, args);
                    }, wait);
                    if (immediate && !timeout) func.apply(context, args);
                };
            }
            __loadNewUrlDebouncer = this.debounce(() => {
                this.loadNewUrl();
            }, 0);

            debounceDurationHandler(){
                this.__loadNewUrlDebouncer = this.debounce(() => {
                    this.loadNewUrl();
                }, this.debounceDuration);
            }
            
           
            loadNewUrl(){
                if(!this.fetch) return;
                if(this.reqInitRequired && !this.reqInit) return;
                this['_setErrorText'](null);
                this['_setErrorResponse'](null);
                const base = this.baseLinkId ? self[this.baseLinkId].href : '';
                if(this.href){
                    const _this = this;
                    let counter = 0;
                    if(this.forEach){
                        if(!this.inEntities) return;
                        const keys = this.forEach.split(',');
                        let remainingCalls = this.inEntities.length;
                        this['_setFetchInProgress'](true);
                        this.inEntities.forEach(entity => {
                            entity['__xtal_idx'] = counter; counter++;
                            
                            let href = base + this.href;
                            keys.forEach(key =>{
                                href = href.replace(':' + key, entity[key]);
                            })
                            if(this.cacheResults){
                                const val = this.cachedResults[href];
                                if(val){
                                    entity[this.setPath] = val;
                                    remainingCalls--;
                                    if(remainingCalls === 0) this['_setFetchInProgress'](false);
                                    return;
                                }
                            }
                            fetch(href, this.reqInit).then(resp =>{
                                if(resp.status !== 200){
                                    resp['text']().then(val =>{
                                        this['_setErrorText'](val);
                                    })
                                }else{
                                    resp[_this.as]().then(val =>{
                                        remainingCalls--;
                                        if(remainingCalls === 0) this['_setFetchInProgress'](false);
                                        if(this.cacheResults) this.cachedResults[href] = val;
                                        entity[this.setPath] = val;
                                        //const newEntity = Object.assign("{}", entity);
                                        const detail = {
                                            entity: entity,
                                            href: href
                                        }
                                        this.dispatchEvent(new CustomEvent('fetch-complete', {
                                            detail: detail,
                                            bubbles: true,
                                            composed: false,
                                        } as CustomEventInit));
    
                                    });
                                }

                            
                            })
                        })
                    }else{
                        if(this.cacheResults){
                            const val = this.cachedResults[this.href];
                            if(val){
                                _this['_setResult'](val);
                                return;
                            }
                        }
                        this['_setFetchInProgress'](true);
                        const href = base + this.href;
                        fetch(href, this.reqInit).then(resp =>{
                            this['_setFetchInProgress'](false);
                            this['_setErrorResponse'](resp);
                            if(resp.status !== 200){
                                resp['text']().then(val =>{
                                    this['_setErrorText'](val);
                                })
                            }else{
                                resp[_this.as]().then(val =>{
                                    
                                    if(this.cachedResults){
                                        this.cachedResults[this.href] = val;
                                    }
                                    _this['_setResult'](val);
                                    if(typeof val === 'string' && this.insertResults){
                                        this.innerHTML = val;
                                        this.dispatchEvent(new CustomEvent('dom-change', {
                                            bubbles: true,
                                            composed: true,
                                        } as CustomEventInit));
                                    }
                                    const detail = {
                                        href: href
                                    }
                                    this.dispatchEvent(new CustomEvent('fetch-complete', {
                                        detail: detail,
                                        bubbles: true,
                                        composed: false,
                                    } as CustomEventInit));
                                });
                            }

                            
                        }).catch(err =>{
                            this['_setErrorResponse'](err);
                            this['_setFetchInProgress'](false);
                        })
                    }
                    
                }
            }

            
            
        }
        customElements.define(XtalFetch.is, XtalFetch);
    }
    function WaitForPolymer()
    {
        if ((typeof Polymer !== 'function') || (typeof Polymer.Element !== 'function')) {
           setTimeout( WaitForPolymer, 100);
           return;
        }
        initXtalFetch();
    }
    WaitForPolymer();
    
    
})();