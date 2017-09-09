(function () {
    function initXtalFetch() {
        if (customElements.get('xtal-fetch'))
            return;
        /**
        * `xtal-fetch`
        * Polymer based wrapper around the fetch api call.  Note:  IE11 requires a polyfill for fetch / promises
        *
        *
        * @customElement
        * @polymer
        * @demo demo/index.html
        */
        class XtalFetch extends Polymer.Element {
            constructor() {
                super(...arguments);
                this.fetchInProgress = false;
                this.as = 'text';
                this._cachedResults = {};
                this.__loadNewUrlDebouncer = this.debounce(() => {
                    this.loadNewUrl();
                }, 0);
            }
            get cachedResults() {
                return this._cachedResults;
            }
            static get is() { return 'xtal-fetch'; }
            static get properties() {
                return {
                    /**
                     * Possible values are 'text' and 'json'
                     */
                    as: {
                        type: String
                    },
                    /**
                     *
                     */
                    cacheResults: {
                        type: Boolean
                    },
                    /**
                     * Time in milliseconds to wait for things to settle down before making fetch request
                     */
                    debounceDuration: {
                        type: Number,
                        observer: 'debounceDurationHandler'
                    },
                    errorResponse: {
                        type: Object,
                        notify: true,
                        readOnly: true
                    },
                    /**
                     * Expression for where to place an error response text.
                     */
                    errorText: {
                        type: Object,
                        notify: true,
                        readOnly: true
                    },
                    /**
                     * Needs to be true for any request to be made.
                     */
                    fetch: {
                        type: Boolean,
                        observer: '__loadNewUrlDebouncer'
                    },
                    /**
                     * Path where to indicate that a fetch is in progress
                     */
                    fetchInProgress: {
                        type: Boolean,
                        notify: true,
                        readOnly: true,
                        reflectToAttribute: true,
                    },
                    /**
                     * A comma delimited list of keys to pluck from in-entities
                     */
                    forEach: {
                        type: String
                    },
                    /**
                     * Base url
                     */
                    href: {
                        type: String,
                        observer: '__loadNewUrlDebouncer'
                    },
                    /**
                     * An array of entities that forEach keys will be plucked from.
                     * Fetch requests will be made iteratively (but in parallel) for each such entity
                     */
                    inEntities: {
                        type: Array,
                        observer: '__loadNewUrlDebouncer'
                    },
                    /**
                     * Place the contents of the fetch inside the tag itself.
                     */
                    insertResults: {
                        type: Boolean
                    },
                    /**
                     * The second parameter of the fetch call.
                     * See, e.g. https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/fetch
                     */
                    reqInit: {
                        type: Object
                    },
                    /**
                     * This prevents the fetch request from occurring until the reqInit has some
                     * defined value.
                     */
                    reqInitRequired: {
                        type: Boolean
                    },
                    /**
                     * The expression for where to place the result.
                     */
                    result: {
                        type: Object,
                        notify: true,
                        readOnly: true
                    },
                    /**
                     * When looping through entities, calling fetch, place the results of the fetch in the path specified by this
                     * property.
                     */
                    setPath: {
                        type: String,
                        value: 'result'
                    }
                };
            }
            debounce(func, wait, immediate) {
                var timeout;
                return function () {
                    var context = this, args = arguments;
                    clearTimeout(timeout);
                    timeout = setTimeout(function () {
                        timeout = null;
                        if (!immediate)
                            func.apply(context, args);
                    }, wait);
                    if (immediate && !timeout)
                        func.apply(context, args);
                };
            }
            debounceDurationHandler() {
                this.__loadNewUrlDebouncer = this.debounce(() => {
                    this.loadNewUrl();
                }, this.debounceDuration);
            }
            loadNewUrl() {
                if (!this.fetch)
                    return;
                if (this.reqInitRequired && !this.reqInit)
                    return;
                this['_setErrorText'](null);
                this['_setErrorResponse'](null);
                if (this.href) {
                    const _this = this;
                    let counter = 0;
                    if (this.forEach) {
                        if (!this.inEntities)
                            return;
                        const keys = this.forEach.split(',');
                        this.inEntities.forEach(entity => {
                            entity['__xtal_idx'] = counter;
                            counter++;
                            let href = this.href;
                            keys.forEach(key => {
                                href = href.replace(':' + key, entity[key]);
                            });
                            if (this.cacheResults) {
                                const val = this.cachedResults[href];
                                if (val) {
                                    entity[this.setPath] = val;
                                    return;
                                }
                            }
                            fetch(href, this.reqInit).then(resp => {
                                resp[_this.as]().then(val => {
                                    if (this.cacheResults)
                                        this.cachedResults[href] = val;
                                    entity[this.setPath] = val;
                                    //const newEntity = Object.assign("{}", entity);
                                    const detail = {
                                        entity: entity,
                                        href: href
                                    };
                                    this.dispatchEvent(new CustomEvent('fetch-complete', {
                                        detail: detail,
                                        bubbles: true,
                                        composed: false,
                                    }));
                                });
                            });
                        });
                    }
                    else {
                        if (this.cacheResults) {
                            const val = this.cachedResults[this.href];
                            if (val) {
                                _this['_setResult'](val);
                                return;
                            }
                        }
                        this['_setFetchInProgress'](true);
                        const href = this.href;
                        fetch(href, this.reqInit).then(resp => {
                            this['_setFetchInProgress'](false);
                            this['_setErrorResponse'](resp);
                            if (resp.status !== 200) {
                                resp['text']().then(val => {
                                    this['_setErrorText'](val);
                                });
                            }
                            else {
                                resp[_this.as]().then(val => {
                                    if (this.cachedResults) {
                                        this.cachedResults[this.href] = val;
                                    }
                                    _this['_setResult'](val);
                                    if (typeof val === 'string' && this.insertResults) {
                                        this.innerHTML = val;
                                    }
                                    const detail = {
                                        href: href
                                    };
                                    this.dispatchEvent(new CustomEvent('fetch-complete', {
                                        detail: detail,
                                        bubbles: true,
                                        composed: false,
                                    }));
                                });
                            }
                        }).catch(err => {
                            this['_setErrorResponse'](err);
                            this['_setFetchInProgress'](false);
                        });
                    }
                }
            }
        }
        customElements.define(XtalFetch.is, XtalFetch);
    }
    function WaitForPolymer() {
        if ((typeof Polymer !== 'function') || (typeof Polymer.Element !== 'function')) {
            setTimeout(WaitForPolymer, 100);
            return;
        }
        initXtalFetch();
    }
    WaitForPolymer();
})();
//# sourceMappingURL=xtal-fetch.js.map