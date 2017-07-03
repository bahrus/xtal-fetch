var xtal;
(function (xtal) {
    var elements;
    (function (elements) {
        function initXtalFetch() {
            class XtalFetch extends xtal.elements['InitMerge'](Polymer.Element) {
                constructor() {
                    super(...arguments);
                    this.as = 'text';
                    this._initialized = false;
                    this._cachedResults = {};
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
                        debounceTimeInMs: {
                            type: Number
                        },
                        /**
                         * Needs to be true for any request to be made.
                         */
                        fetch: {
                            type: Boolean,
                            observer: 'loadNewUrl'
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
                            observer: 'loadNewUrl'
                        },
                        /**
                         * An array of entities that forEach keys will be plucked from.
                         * Fetch requests will be made iteratively (but in parallel) for each such entity
                         */
                        inEntities: {
                            type: Array,
                            observer: 'loadNewUrl'
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
                loadNewUrl() {
                    if (!this._initialized)
                        return;
                    if (!this.fetch)
                        return;
                    if (this.href) {
                        const _this = this;
                        if (this.forEach) {
                            if (!this.inEntities)
                                return;
                            this.inEntities.forEach(entity => {
                                const keys = this.forEach.split(',');
                                let href = this.href;
                                for (const key of keys) {
                                    href = href.replace(':' + key, entity[key]);
                                }
                                if (this.cacheResults) {
                                    if (this.cachedResults[href]) {
                                        return;
                                    }
                                }
                                fetch(href, this.reqInit).then(resp => {
                                    resp[_this.as]().then(val => {
                                        if (this.cacheResults)
                                            this.cachedResults[href] = val;
                                        entity[this.setPath] = val;
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
                                if (this.cachedResults[this.href]) {
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
                        this.loadNewUrl();
                    });
                }
            }
            customElements.define(XtalFetch.is, XtalFetch);
        }
        customElements.whenDefined('dom-module').then(() => {
            console.log('dom-module loaded.  Polymer.Element = ');
            console.log(Polymer.Element);
        });
        customElements.whenDefined('xtal-ball').then(() => initXtalFetch());
    })(elements = xtal.elements || (xtal.elements = {}));
})(xtal || (xtal = {}));
//# sourceMappingURL=xtal-fetch.js.map