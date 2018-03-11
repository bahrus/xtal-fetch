(function () {

    const xtalFetch = 'xtal-fetch';
    if (customElements.get(xtalFetch)) return;
    const a$ = {  //becomes an export when we are ready
        as: 'as',
        baseLinkId: {
            cc: 'baseLinkId',
            sc: 'base-link-id',
        },
        cacheResults: {
            cc: 'cacheResults',
            sc: 'cache-results'
        },
        debounceDuration: {
            cc: 'debounceDuration',
            sc: 'debounce-duration'
        },
        fetch: 'fetch',

        forEach: {
            cc: 'forEach',
            sc: 'for-each'
        },
        href: 'href',
        inEntities:{
            cc: 'inEntities',
            sc: 'in-entities'
        },
        insertResults: {
            cc: 'insertResults',
            sc: 'insert-results'
        },
        reqInit: {
            cc: 'reqInit',
            sc: 'req-init'
        },
        reqInitRequired: {
            cc: 'reqInitRequired',
            sc: 'req-init-required'
        },

        setPath: {
            cc: 'setPath',
            sc: 'set-path'
        }
    }

    const cc : {[key:string] : string} = {};
    for(var key in a$){
        const val = a$[key];
        if(val.sc){
            cc[val.sc] = '_' + val.cc;
        }else{
            cc[val] = '_' + key;
        }
    }         
    const e$ = {
        errorResponse: {
            cc: 'errorRespone',
            sc: 'error-response'
        },
        errorText: {
            cc: 'errorText',
            sc: 'error-text'
        },
        fetchInProgress: {
            cc: 'fetchInProgress',
            sc: 'fetch-in-progress'
        },
        result: 'result',
    }

    // interface IXtalFetchProperties { //becomes an export when we are ready
    //     as: string,
    //     [a$.baseLinkId.cc]: string,
    //     [a$.cacheResults.cc]: boolean,
    //     [a$.debounceDuration.cc]: number,
    //     [e$.errorText.cc]: string,
    //     [e$.errorResponse.cc]: object,
    //     [a$.fetch]: boolean,
    //     [e$.fetchInProgress.cc]: boolean,
    //     [a$.forEach.cc]: string,
    //     [a$.href]: string,
    //     inEntities: any[],
    //     [a$.insertResults.cc]: boolean,
    //     [a$.reqInit.cc]: RequestInit,
    //     [a$.req_init_required.cc]: boolean,
    //     [e$.result]: any,
    //     [a$.setPath.cc]: string,
    // }




    /**
    * `xtal-fetch`
    * Dependency free web component wrapper around the fetch api call.  Note:  IE11 requires a polyfill for fetch / promises
    * 
    *
    * @customElement
    * @polymer
    * @demo demo/index.html
    */
    class XtalFetch extends HTMLElement  {

        /**
        * Fired  when a fetch has finished.
        *
        * @event fetch-complete
        */
        _reqInit: RequestInit;
        get [a$.reqInit.cc]() {
            return this._reqInit;
        }
        set [a$.reqInit.cc](val) {
            this._reqInit = val;
            this.__loadNewUrlDebouncer();
        }

        _reqInitRequired: boolean;
        get [a$.reqInitRequired.cc]() {
            return this._reqInitRequired;
        }
        set [a$.reqInitRequired.cc](val) {
            if (val) {
                this.setAttribute(a$.reqInitRequired.sc, '')
            } else {
                this.removeAttribute(a$.reqInitRequired.sc);
            }
        }

        _href: string;
        get [a$.href]() {
            return this._href;
        }
        set [a$.href](val) {
            this.setAttribute(a$.href, val);
        }


        _inEntities: any[];
        get [a$.inEntities.cc]() {
            return this._inEntities;
        }
        set [a$.inEntities.cc](val) {
            this._inEntities = val;
            this.__loadNewUrlDebouncer();
        }

        _result: string | object;
        get [e$.result]() {
            return this._result;
        }
        set [e$.result](val) {
            this._result = val;
            this.de(e$.result, {
                value: val,
            })
        }

        _forEach: string;
        get [a$.forEach.cc]() {
            return this._forEach;
        }
        set [a$.forEach.cc](val) {
            this.setAttribute(a$.forEach.sc, val);
        }

        _fetch: boolean
        get [a$.fetch]() {
            return this._fetch;
        }
        set [a$.fetch](val) {
            if (val) {
                this.setAttribute(a$.fetch, '');
            } else {
                this.removeAttribute(a$.fetch);
            }
        }

        _setPath: string;
        get [a$.setPath.cc]() {
            return this._setPath;
        }
        set [a$.setPath.cc](val) {
            this.setAttribute(a$.setPath.sc, val)
        }

        _as = 'text';
        get [a$.as]() {
            return this._as;
        }
        set [a$.as](val) {
            this.setAttribute(a$.as, val);
        }
        _cacheResults = false;
        get [a$.cacheResults.cc]() {
            return this._cachedResults;
        }
        set [a$.cacheResults.cc](val) {
            if (val) {
                this.setAttribute(a$.cacheResults.sc, '');
            } else {
                this.removeAttribute(a$.cacheResults.sc);
            }
        }

        _errorText;
        get [e$.errorText.cc]() {
            return this._errorText;
        }
        set [e$.errorText.cc](val) {
            this._errorText = val;
            this.de(e$.errorText.sc, {
                value: val
            });
        };

        _errorResponse;
        get [e$.errorResponse.cc]() {
            return this._errorResponse;
        }
        set [e$.errorResponse.cc](val) {
            this._errorResponse = val;
            this.de(e$.errorResponse.sc, {
                value: val
            });
        }

        _fetchInProgress = false;
        get [e$.fetchInProgress.cc]() {
            return this._fetchInProgress;
        }
        set [e$.fetchInProgress.cc](val) {
            this._fetchInProgress = val;
            this.de(e$.fetchInProgress.sc, {
                value: val
            })
        }

        _baseLinkId;
        get [a$.baseLinkId.cc]() {
            return this._baseLinkId;
        }
        set [a$.baseLinkId.cc](val) {
            this.setAttribute(a$.baseLinkId.sc, val);
        }

        _debounceDuration;
        get [a$.debounceDuration.cc]() {
            return this._debounceDuration;
        }
        set [a$.debounceDuration.cc](val) {
            this.setAttribute(a$.debounceDuration.sc, val.toString());
        }

        _insertResults: boolean;
        get [a$.insertResults.cc]() {
            return this._insertResults;
        }
        set [a$.insertResults.cc](val) {
            if (val) {
                this.setAttribute(a$.insertResults.sc, '');
            } else {
                this.removeAttribute(a$.insertResults.sc);
            }
        }

        private _cachedResults: { [key: string]: any } = {};
        get cachedResults() {
            return this._cachedResults;
        }

        static get is() { return xtalFetch; }
        de(name: string, detail: any) {
            const newEvent = new CustomEvent(name + '-changed', {
                detail: detail,
                bubbles: true,
                composed: false,
            } as CustomEventInit);
            this.dispatchEvent(newEvent);
            return newEvent;
        }
        _upgradeProperty(prop) {
            if (this.hasOwnProperty(prop)) {
                let value = this[prop];
                delete this[prop];
                this[prop] = value;
            }
        }
        connectedCallback() {
            for(var key in a$){
                this._upgradeProperty(key);
            }
        }
        static get observedAttributes() {
            const returnObj = [];
            for(var key in cc){
                returnObj.push(key);
            }
            return returnObj;
        }
        attributeChangedCallback(name, oldValue, newValue) {
            const privateFieldName = cc[name];
            
            switch (name) {
                //string properties
                case a$.as:
                case a$.baseLinkId.sc:
                case a$.forEach.sc:
                case a$.href:
                case a$.setPath.sc:
                    this[privateFieldName] = newValue;
                    break;
                //boolean properties
                case a$.cacheResults.sc:
                case a$.fetch:
                case a$.insertResults.sc:
                case a$.reqInitRequired.sc:
                    this[privateFieldName] = newValue !== null;
                    break;
                //numeric properties
                case a$.debounceDuration.sc:
                    this[privateFieldName] = parseInt(newValue);
                    this.debounceDurationHandler();
                    break;
                //potentially small object properties
                case a$.reqInit.sc:
                    this[privateFieldName] = JSON.parse(newValue);
                    break;
            }
            this.__loadNewUrlDebouncer();

        }

        debounce(func, wait, immediate?) {
            let timeout;
            return function () {
                const context = this, args = arguments;
                clearTimeout(timeout);
                timeout = setTimeout(function () {
                    timeout = null;
                    if (!immediate) func.apply(context, args);
                }, wait);
                if (immediate && !timeout) func.apply(context, args);
            };
        }
        __loadNewUrlDebouncer = this.debounce(() => {
            this.loadNewUrl();
        }, 0);

        debounceDurationHandler() {
            this.__loadNewUrlDebouncer = this.debounce(() => {
                this.loadNewUrl();
            }, this._debounceDuration);
        }


        loadNewUrl() {
            
            if (!this._fetch) return;
            if (this._reqInitRequired && !this._reqInit) return;
            if (!this._href) return;
            this[e$.errorText.cc] = null;
            this[e$.errorResponse.cc] = null;
            const base = this._baseLinkId ? self[this._baseLinkId].href : '';
            const _this = this;
            let counter = 0;
            if (this._forEach) {
                if (!this._inEntities) return;
                const keys = this._forEach.split(',');
                let remainingCalls = this._inEntities.length;
                this[e$.fetchInProgress.cc] = true;
                this._inEntities.forEach(entity => {
                    entity['__xtal_idx'] = counter; counter++;
                    let href = base + this._href;
                    keys.forEach(key => {
                        href = href.replace(':' + key, entity[key]);
                    })
                    if (this._cacheResults) {
                        const val = this.cachedResults[href];
                        if (val) {
                            entity[this._setPath] = val;
                            remainingCalls--;
                            if (remainingCalls === 0) this[e$.fetchInProgress.cc] = false;
                            return;
                        }
                    }
                    fetch(href, this._reqInit).then(resp => {
                        if (resp.status !== 200) {
                            resp['text']().then(val => {
                                this[e$.errorText.cc] = val;
                            })
                        } else {
                            resp[_this._as]().then(val => {
                                remainingCalls--;
                                if (remainingCalls === 0) this[e$.fetchInProgress.cc] = false;
                                if (this._cacheResults) this.cachedResults[href] = val;
                                entity[this._setPath] = val;
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
            } else {
                if (this._cacheResults) {
                    const val = this.cachedResults[this._href];
                    if (val) {
                        _this[e$.result] = val;
                        return;
                    }
                }
                this[e$.fetchInProgress.cc] = true;
                const href = base + this._href;
                fetch(href, this._reqInit).then(resp => {
                    this[e$.fetchInProgress.cc] = false;
                    if (resp.status !== 200) {
                        this[e$.errorResponse.cc] = resp;
                        resp['text']().then(val => {
                            this[e$.errorText.cc] = val;
                        })
                    } else {
                        resp[_this._as]().then(val => {
                            if (this.cachedResults) {
                                this.cachedResults[this._href] = val;
                            }
                            _this[e$.result] = val;
                            if (typeof val === 'string' && this._insertResults) {
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


                }).catch(err => {
                    this[e$.errorResponse.cc] = err;
                    this[e$.fetchInProgress.cc] = false;
                    
                })
            }

        }



    }
    customElements.define(XtalFetch.is, XtalFetch);
   
    
    
}) ();