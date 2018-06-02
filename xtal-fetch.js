
//@ts-check
(function () {
const pass_down = 'pass-down';
const disabled = 'disabled';
function XtallatX(superClass) {
    return class extends superClass {
        static get observedAttributes() {
            return [disabled, pass_down];
        }
        get passDown() {
            return this._passDown;
        }
        set passDown(val) {
            this.setAttribute(pass_down, val);
        }
        get disabled() {
            return this._disabled;
        }
        set disabled(val) {
            if (val) {
                this.setAttribute(disabled, '');
            }
            else {
                this.removeAttribute(disabled);
            }
        }
        attributeChangedCallback(name, oldVal, newVal) {
            switch (name) {
                case pass_down:
                    this._passDown = newVal;
                    this.parsePassDown();
                    break;
                case disabled:
                    this._disabled = newVal !== null;
                    break;
            }
        }
        de(name, detail) {
            const newEvent = new CustomEvent(name + '-changed', {
                detail: detail,
                bubbles: true,
                composed: false,
            });
            this.dispatchEvent(newEvent);
            return newEvent;
        }
        parsePassDown() {
            this._cssPropMap = [];
            const splitPassDown = this._passDown.split('};');
            splitPassDown.forEach(passDownSelectorAndProp => {
                if (!passDownSelectorAndProp)
                    return;
                const splitPassTo2 = passDownSelectorAndProp.split('{');
                this._cssPropMap.push({
                    cssSelector: splitPassTo2[0],
                    propTarget: splitPassTo2[1]
                });
            });
        }
        passDownProp(val) {
            let nextSibling = this.nextElementSibling;
            while (nextSibling) {
                this._cssPropMap.forEach(map => {
                    if (nextSibling.matches(map.cssSelector)) {
                        nextSibling[map.propTarget] = val;
                    }
                });
                nextSibling = nextSibling.nextElementSibling;
            }
        }
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
//# sourceMappingURL=xtal-latx.js.map
const fetch = 'fetch';
const href = 'href';
// const disabled = 'disabled';
// const pass_down = 'pass-down';
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
        if (val) {
            this.setAttribute(fetch, '');
        }
        else {
            this.removeAttribute(fetch);
        }
    }
    get href() {
        return this._href;
    }
    set href(val) {
        this.setAttribute(href, val);
    }
    get result() {
        return this._result;
    }
    set result(val) {
        this._result = val;
        if (this._cssPropMap) {
            this.passDownProp(val);
        }
        // if (this.cssKeyMappers) {
        //     this.passDownProp(val);
        //     return;
        // }
        this.de('result', {
            value: val
        });
    }
    // _passDown: string;
    // get passDown() {
    //     return this._passDown;
    // }
    // set passDown(val) {
    //     this.setAttribute(pass_down, val);
    // }
    static get observedAttributes() {
        return super.observedAttributes.concat([
            /**
             * @type boolean
             * Indicates whether fetch request should be made.
             */
            fetch,
            href,
        ]);
    }
    // _upgradeProperties(props: string[]) {
    //     props.forEach(prop => {
    //         if (this.hasOwnProperty(prop)) {
    //             let value = this[prop];
    //             delete this[prop];
    //             this[prop] = value;
    //         }
    //     })
    // }
    attributeChangedCallback(name, oldVal, newVal) {
        switch (name) {
            //booleans
            case fetch:
                this['_' + name] = newVal !== null;
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
        if (!this.fetch || !this.href || this.disabled)
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
        this._upgradeProperties([fetch, href]);
        super.conectedCallback();
    }
}
if (!customElements.get(XtalFetchGet.is)) {
    customElements.define(XtalFetchGet.is, XtalFetchGet);
}
//# sourceMappingURL=xtal-fetch-get.js.map
function snakeToCamel(s) {
    return s.replace(/(\-\w)/g, function (m) { return m[1].toUpperCase(); });
}
const debounceDuration = 'debounce-duration';
const reqInitRequired = 'req-init-required';
const cacheResults = 'cache-results';
const insertResults = 'insert-results';
const baseLinkId = 'base-link-id';
/**
 * `xtal-fetch-req`
 *  Feature rich custom element that can make fetch calls, include Post requests.
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */
class XtalFetchReq extends XtalFetchGet {
    constructor() {
        super();
        this._cacheResults = false;
        this._cachedResults = {};
        this._fetchInProgress = false;
        this._reqInit = null;
    }
    /**
    * Fired  when a fetch has finished.
    *
    * @event fetch-complete
    */
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
        if (val) {
            this.setAttribute(cacheResults, '');
        }
        else {
            this.removeAttribute(cacheResults);
        }
    }
    get cachedResults() {
        return this._cachedResults;
    }
    get reqInitRequired() {
        return this.hasAttribute(reqInitRequired);
    }
    set reqInitRequired(val) {
        if (val) {
            this.setAttribute(reqInitRequired, '');
        }
        else {
            this.removeAttribute(reqInitRequired);
        }
    }
    get debounceDuration() {
        return this._debounceDuration;
    }
    set debounceDuration(val) {
        this.setAttribute(debounceDuration, val.toString());
    }
    get errorResponse() {
        return this._errorResponse;
    }
    set errorResponse(val) {
        this._errorResponse = val;
        this.de('error-response', {
            value: val
        });
    }
    get errorText() {
        return this._errorText;
    }
    set errorText(val) {
        this._errorText = val;
        this.de('error-text', {
            value: val
        });
    }
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
        if (val) {
            this.setAttribute(insertResults, '');
        }
        else {
            this.removeAttribute(insertResults);
        }
    }
    get baseLinkId() {
        return this._baseLinkId;
    }
    set baseLinkId(val) {
        this.setAttribute(baseLinkId, val);
    }
    static get observedAttributes() {
        return super.observedAttributes.concat([debounceDuration, reqInitRequired, cacheResults, insertResults, baseLinkId]);
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
        }
        this.fetchInProgress = true;
        let href = this.href;
        if (this._baseLinkId) {
            const link = self[this._baseLinkId];
            if (link)
                href = link.href + href;
        }
        self.fetch(this.href, this._reqInit).then(resp => {
            this.fetchInProgress = false;
            resp[this._as]().then(result => {
                if (resp.status !== 200) {
                    this.errorResponse = resp;
                    resp['text']().then(val => {
                        this.errorText = val;
                    });
                }
                else {
                    this.result = result;
                    if (this.cachedResults) {
                        this.cachedResults[this._href] = result;
                    }
                    if (typeof result === 'string' && this._insertResults) {
                        this.innerHTML = result;
                    }
                    const detail = {
                        href: this.href,
                        result: result
                    };
                    this.dispatchEvent(new CustomEvent('fetch-complete', {
                        detail: detail,
                        bubbles: true,
                        composed: false,
                    }));
                }
            });
        });
    }
    connectedCallback() {
        super.connectedCallback();
        this._upgradeProperties(['debounceDuration', 'reqInitRequired', 'cacheResults', 'reqInit']);
    }
}
if (!customElements.get(XtalFetchReq.is)) {
    customElements.define(XtalFetchReq.is, XtalFetchReq);
}
//# sourceMappingURL=xtal-fetch-req.js.map
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
    get forEach() {
        return this._forEach || this.getAttribute(forEach);
    }
    set forEach(val) {
        this.setAttribute(forEach, val);
    }
    get setPath() {
        return this._setPath || this.getAttribute(setPath);
    }
    set setPath(val) {
        this.setAttribute(setPath, val);
    }
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
if (!customElements.get(XtalFetchEntities.is)) {
    customElements.define(XtalFetchEntities.is, XtalFetchEntities);
}
class XtalFetch extends XtalFetchEntities {
    static get is() { return 'xtal-fetch'; }
}
if (!customElements.get(XtalFetch.is)) {
    customElements.define(XtalFetch.is, XtalFetch);
}
//# sourceMappingURL=xtal-fetch-entities.js.map
})();  
    