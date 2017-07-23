var xtal;
(function (xtal) {
    var elements;
    (function (elements) {
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
            * @demo demo/index_sync.html
            */
            class XtalFetch extends xtal.elements['InitMerge'](Polymer.Element) {
                constructor() {
                    super(...arguments);
                    this.as = 'text';
                    this._initialized = false;
                    this._cachedResults = {};
                    this.__loadNewUrlDebouncer = xtal.elements['debounce'](() => {
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
                        debounceDuration: {
                            type: Number,
                            observer: 'debounceDurationHandler'
                        },
                        /**
                         * Needs to be true for any request to be made.
                         */
                        fetch: {
                            type: Boolean,
                            observer: '__loadNewUrlDebouncer'
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
                debounceDurationHandler() {
                    this.__loadNewUrlDebouncer = xtal.elements['debounce'](() => {
                        this.loadNewUrl();
                    }, this.debounceDuration);
                }
                loadNewUrl() {
                    if (!this._initialized)
                        return;
                    if (!this.fetch)
                        return;
                    if (this.reqInitRequired && !this.reqInit)
                        return;
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
                                            composed: true
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
                            fetch(this.href, this.reqInit).then(resp => {
                                resp[_this.as]().then(val => {
                                    if (this.cachedResults) {
                                        this.cachedResults[this.href] = val;
                                    }
                                    _this['_setResult'](val);
                                    if (typeof val === 'string' && this.insertResults) {
                                        this.innerHTML = val;
                                    }
                                });
                            });
                        }
                    }
                }
                connectedCallback() {
                    super.connectedCallback();
                    this.init().then(() => {
                        this._initialized = true;
                        //this.loadNewUrl();
                    });
                }
            }
            customElements.define(XtalFetch.is, XtalFetch);
        }
        const syncFlag = 'xtal_elements_fetch_sync';
        if (window[syncFlag]) {
            customElements.whenDefined('poly-prep-sync').then(() => initXtalFetch());
            delete window[syncFlag];
        }
        else {
            if (customElements.get('poly-prep') || customElements.get('full-poly-prep')) {
                initXtalFetch();
            }
            else {
                customElements.whenDefined('poly-prep').then(() => initXtalFetch());
                customElements.whenDefined('full-poly-prep').then(() => initXtalFetch());
            }
        }
    })(elements = xtal.elements || (xtal.elements = {}));
})(xtal || (xtal = {}));
//# sourceMappingURL=xtal-fetch.js.map