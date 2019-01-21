
    //@ts-check
    (function () {
    function define(custEl) {
    let tagName = custEl.is;
    if (customElements.get(tagName)) {
        console.warn('Already registered ' + tagName);
        return;
    }
    customElements.define(tagName, custEl);
}
const disabled = 'disabled';
/**
 * Base class for many xtal- components
 * @param superClass
 */
function XtallatX(superClass) {
    return class extends superClass {
        constructor() {
            super(...arguments);
            this._evCount = {};
        }
        static get observedAttributes() {
            return [disabled];
        }
        /**
         * Any component that emits events should not do so if it is disabled.
         * Note that this is not enforced, but the disabled property is made available.
         * Users of this mix-in should ensure not to call "de" if this property is set to true.
         */
        get disabled() {
            return this._disabled;
        }
        set disabled(val) {
            this.attr(disabled, val, '');
        }
        /**
         * Set attribute value.
         * @param name
         * @param val
         * @param trueVal String to set attribute if true.
         */
        attr(name, val, trueVal) {
            const v = val ? 'set' : 'remove'; //verb
            this[v + 'Attribute'](name, trueVal || val);
        }
        /**
         * Turn number into string with even and odd values easy to query via css.
         * @param n
         */
        to$(n) {
            const mod = n % 2;
            return (n - mod) / 2 + '-' + mod;
        }
        /**
         * Increment event count
         * @param name
         */
        incAttr(name) {
            const ec = this._evCount;
            if (name in ec) {
                ec[name]++;
            }
            else {
                ec[name] = 0;
            }
            this.attr('data-' + name, this.to$(ec[name]));
        }
        attributeChangedCallback(name, oldVal, newVal) {
            switch (name) {
                case disabled:
                    this._disabled = newVal !== null;
                    break;
            }
        }
        /**
         * Dispatch Custom Event
         * @param name Name of event to dispatch ("-changed" will be appended if asIs is false)
         * @param detail Information to be passed with the event
         * @param asIs If true, don't append event name with '-changed'
         */
        de(name, detail, asIs = false) {
            const eventName = name + (asIs ? '' : '-changed');
            const newEvent = new CustomEvent(eventName, {
                detail: detail,
                bubbles: true,
                composed: false,
            });
            this.dispatchEvent(newEvent);
            this.incAttr(eventName);
            return newEvent;
        }
        /**
         * Needed for asynchronous loading
         * @param props Array of property names to "upgrade", without losing value set while element was Unknown
         */
        _upgradeProperties(props) {
            props.forEach(prop => {
                if (this.hasOwnProperty(prop)) {
                    let value = this[prop];
                    delete this[prop];
                    this[prop] = value;
                }
            });
        }
    };
}
const baseLinkId = 'base-link-id';
function BaseLinkId(superClass) {
    return class extends superClass {
        get baseLinkId() {
            return this._baseLinkId;
        }
        set baseLinkId(val) {
            this.setAttribute(baseLinkId, val);
        }
        getFullURL(tail) {
            let r = tail;
            if (this._baseLinkId) {
                const link = self[this._baseLinkId];
                if (link)
                    r = link.href + r;
            }
            return r;
        }
    };
}
const fetch$ = 'fetch';
const href = 'href';
const as = 'as';
/**
 * `xtal-fetch-get`
 *  Barebones custom element that can make fetch calls.
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */
class XtalFetchGet extends XtallatX(HTMLElement) {
    constructor() {
        super(...arguments);
        this._reqInit = {
            credentials: 'same-origin'
        };
        this._as = 'json';
    }
    static get is() { return 'xtal-fetch-get'; }
    get fetch() {
        return this._fetch;
    }
    set fetch(val) {
        this.attr(fetch$, !!val, '');
    }
    get as() {
        return this._as;
    }
    set as(val) {
        this.attr(as, val);
    }
    get href() {
        return this._href;
    }
    set href(val) {
        this.attr(href, val);
    }
    /**
     * @type{Object}
     * Result of fetch request
     * ⚡ Fires event result-changed
     */
    get result() {
        return this._result;
    }
    set result(val) {
        //this.updateResultProp(val, 'result', '_result', null);
        this._result = val;
        this.value = val;
        this.de('result', { value: val });
    }
    static get observedAttributes() {
        return super.observedAttributes.concat([
            /**
             * @type boolean
             * Indicates whether fetch request should be made.
             */
            fetch$,
            href,
            as
        ]);
    }
    attributeChangedCallback(name, oldVal, newVal) {
        switch (name) {
            case fetch$:
                const ov = this['_' + name];
                this._fetch = newVal !== null;
                if (ov === this._fetch)
                    return;
                break;
            default:
                this['_' + name] = newVal;
        }
        super.attributeChangedCallback(name, oldVal, newVal);
        this.onPropsChange();
    }
    onPropsChange() {
        this.loadNewUrl();
    }
    loadNewUrl() {
        if (!this.fetch || !this.href || this.disabled || !this._connected)
            return;
        this.do();
    }
    do() {
        self.fetch(this.href, this._reqInit).then(resp => {
            resp[this._as]().then(result => {
                this.result = result;
            });
        });
    }
    connectedCallback() {
        this._initDisp = this.style.display;
        this.style.display = 'none';
        this._upgradeProperties([fetch$, href]);
        this._connected = true;
        this.onPropsChange();
    }
}
define(XtalFetchGet);
function snakeToCamel(s) {
    return s.replace(/(\-\w)/g, function (m) { return m[1].toUpperCase(); });
}
const debounceDuration = 'debounce-duration';
const reqInitRequired = 'req-init-required';
const cacheResults = 'cache-results';
const insertResults = 'insert-results';
const req_init = 'req-init';
/**
 * `xtal-fetch-req`
 *  Feature rich custom element that can make fetch calls, include Post requests.
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */
class XtalFetchReq extends BaseLinkId(XtalFetchGet) {
    constructor() {
        super();
        this._cacheResults = false;
        this._cachedResults = {};
        this._fetchInProgress = false;
        this._reqInit = null;
    }
    get reqInit() {
        return this._reqInit;
    }
    set reqInit(val) {
        this._reqInit = val;
        //this.__loadNewUrlDebouncer();
        this.onPropsChange();
    }
    onPropsChange() {
        if (this.reqInitRequired && !this.reqInit)
            return;
        if (!this.__loadNewUrlDebouncer) {
            this.debounceDurationHandler();
        }
        this.__loadNewUrlDebouncer();
    }
    static get is() { return 'xtal-fetch-req'; }
    get cacheResults() {
        return this._cacheResults;
    }
    set cacheResults(val) {
        this.attr(cacheResults, val, '');
    }
    get cachedResults() {
        return this._cachedResults;
    }
    get reqInitRequired() {
        return this.hasAttribute(reqInitRequired);
    }
    set reqInitRequired(val) {
        this.attr(reqInitRequired, val, '');
    }
    /**
     * @type {Number}
     * How long to pause between requests
     */
    get debounceDuration() {
        return this._debounceDuration;
    }
    set debounceDuration(val) {
        this.setAttribute(debounceDuration, val.toString());
    }
    /**
     * @type {Object}
     * Error response as an object
     * ⚡ Fires event error-response-changed.
     */
    get errorResponse() {
        return this._errorResponse;
    }
    set errorResponse(val) {
        //if(this._errorResponse === val) return;
        if (!this._errorResponse && !val)
            return;
        this._errorResponse = val;
        if (val !== null) {
            this.de('error-response', {
                value: val
            });
        }
    }
    /**
     * @type {String}
     * Indicates the error text of the last request.
     * ⚡ Fires event error-text-changed.
     */
    get errorText() {
        return this._errorText;
    }
    set errorText(val) {
        if (!val && !this._errorText)
            return;
        this._errorText = val;
        this.attr('errorText', val);
        this.de('error-text', {
            value: val
        });
    }
    /**
     * @type {Boolean}
     * Indicates Fetch is in progress
     * ⚡ Fires event fetch-in-progress-changed
     */
    get fetchInProgress() {
        return this._fetchInProgress;
    }
    set fetchInProgress(val) {
        this._fetchInProgress = val;
        this.de('fetch-in-progress', {
            value: val
        });
    }
    get insertResults() {
        return this._insertResults;
    }
    set insertResults(val) {
        this.attr(insertResults, val, '');
    }
    set abort(val) {
        if (this._controller)
            this._controller.abort();
    }
    static get observedAttributes() {
        return super.observedAttributes.concat([debounceDuration, reqInitRequired, cacheResults, insertResults, baseLinkId, req_init]);
    }
    attributeChangedCallback(name, oldValue, newValue) {
        switch (name) {
            case debounceDuration:
                this._debounceDuration = parseFloat(newValue);
                this.debounceDurationHandler();
                break;
            //boolean
            case reqInitRequired:
            case cacheResults:
            case insertResults:
                this['_' + snakeToCamel(name)] = newValue !== null;
                break;
            case baseLinkId:
                this._baseLinkId = newValue;
                break;
            case req_init:
                this._reqInit = JSON.parse(newValue);
                break;
        }
        super.attributeChangedCallback(name, oldValue, newValue);
    }
    debounce(func, wait, immediate) {
        let timeout;
        return function () {
            const context = this, args = arguments;
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
        }, this._debounceDuration);
    }
    //overrides
    do() {
        this.errorResponse = null;
        if (this._cacheResults) {
            const val = this.cachedResults[this._href];
            if (val) {
                this.result = val;
                return;
            }
            else if (this._fetchInProgress) {
                setTimeout(() => {
                    this.do();
                }, 100);
                return;
            }
        }
        if (this.fetchInProgress) {
            this.abort = true;
        }
        this.fetchInProgress = true;
        let href = this.href;
        href = this.getFullURL(href);
        if (typeof (AbortController) !== 'undefined') {
            this._controller = new AbortController();
            const sig = this._controller.signal;
            if (this._reqInit) {
                this._reqInit.signal = sig;
            }
            else {
                this._reqInit = {
                    signal: sig,
                };
            }
        }
        //this.abort = true;     
        self.fetch(href, this._reqInit).then(resp => {
            this.fetchInProgress = false;
            resp[this._as]().then(result => {
                if (resp.status !== 200) {
                    this.errorResponse = resp;
                    const respText = resp['text'];
                    if (respText)
                        respText().then(val => {
                            this.errorText = val;
                        });
                }
                else {
                    this.result = result;
                    if (this.cachedResults) {
                        this.cachedResults[this._href] = result;
                    }
                    if (typeof result === 'string' && this._insertResults) {
                        this.style.display = this._initDisp;
                        this.innerHTML = result;
                    }
                    const detail = {
                        href: this.href,
                        result: result
                    };
                    this.de('fetch-complete', detail, true);
                }
            });
        }).catch(err => {
            if (err.name === 'AbortError') {
                console.log('Fetch aborted');
                this.fetchInProgress = false;
            }
        });
    }
    connectedCallback() {
        this._upgradeProperties(['debounceDuration', 'reqInitRequired', 'cacheResults', 'reqInit']);
        super.connectedCallback();
    }
}
define(XtalFetchReq);
const forEach = 'for-each';
const setPath = 'set-path';
/**
 * `xtal-fetch-entities`
 *  Entire feature set for fetch, including multiple entity requests.
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */
class XtalFetchEntities extends XtalFetchReq {
    static get is() { return 'xtal-fetch-entities'; }
    /**
     * @type {String}
     * Comma delimited list of properties to use as input for the fetch urls
     */
    get forEach() {
        return this._forEach || this.getAttribute(forEach);
    }
    set forEach(val) {
        this.attr(forEach, val);
    }
    /**
     * @type {String}
     * Path to set value inside each entity
     */
    get setPath() {
        return this._setPath || this.getAttribute(setPath);
    }
    set setPath(val) {
        this.attr(setPath, val);
    }
    /**
     * @type {Array}
     * Array of entities to use as input for building the url (along with forEach value).  Also place where result should go (using setPath attribute)
     */
    get inEntities() {
        return this._inEntities;
    }
    set inEntities(val) {
        this._inEntities = val;
        this.onPropsChange();
    }
    static get observedAttributes() {
        return super.observedAttributes.concat([forEach, setPath]);
    }
    attributeChangedCallback(name, oldValue, newValue) {
        switch (name) {
            case setPath:
            case forEach:
                this['_' + snakeToCamel(name)] = newValue;
        }
        super.attributeChangedCallback(name, oldValue, newValue);
    }
    connectedCallback() {
        super.connectedCallback();
        this._upgradeProperties(['forEach', 'setPath', 'inEntities']);
    }
    onPropsChange() {
        const hasAtLeastOneProp = this.setPath || this.forEach || this.inEntities;
        if (hasAtLeastOneProp) {
            this._hasAllThreeProps = this._setPath && this._forEach && this.inEntities;
            if (!this._hasAllThreeProps) { //need all three
                return;
            }
        }
        super.onPropsChange();
    }
    do() {
        if (!this._hasAllThreeProps) {
            super.do();
            return;
        }
        const keys = this._forEach.split(',');
        let remainingCalls = this._inEntities.length;
        this.fetchInProgress = true;
        let counter = 0;
        const base = this._baseLinkId ? self[this._baseLinkId].href : '';
        //this._inEntities.forEach(entity => {
        for (let i = 0, ii = this._inEntities.length; i < ii; i++) {
            const entity = this._inEntities[i];
            entity['__xtal_idx'] = counter;
            counter++;
            let href = this._href;
            keys.forEach(key => {
                href = href.replace(':' + key, entity[key]);
            });
            href = base + href;
            if (this._cacheResults) {
                const val = this.cachedResults[href];
                if (val) {
                    entity[this._setPath] = val;
                    remainingCalls--;
                    if (remainingCalls === 0)
                        this.fetchInProgress = false;
                    return;
                }
            }
            self.fetch(href, this._reqInit).then(resp => {
                if (resp.status !== 200) {
                    resp['text']().then(val => {
                        this.errorText = val;
                    });
                    this.errorResponse = resp;
                }
                else {
                    resp[this._as]().then(val => {
                        remainingCalls--;
                        if (remainingCalls === 0) {
                            this.fetchInProgress = false;
                            //this.result = Object.assign({}, this.inEntities);
                            this.result = this.inEntities.slice(0);
                            //this.result = [];
                            //this.de('result')
                        }
                        if (this._cacheResults)
                            this.cachedResults[href] = val;
                        entity[this._setPath] = val;
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
                }
            });
        }
    }
}
define(XtalFetchEntities);
/**
 * `xtal-fetch`
 *  Feature rich custom element that can make fetch calls, include Post requests.
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */
class XtalFetch extends XtalFetchEntities {
    static get is() { return 'xtal-fetch'; }
}
define(XtalFetch);
    })();  
        