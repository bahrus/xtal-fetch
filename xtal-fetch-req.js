import { XtalFetchBase } from './xtal-fetch-base.js';
export function snakeToCamel(s) {
    return s.replace(/(\-\w)/g, function (m) { return m[1].toUpperCase(); });
}
const debounceDuration = 'debounce-duration';
const reqInitRequired = 'req-init-required';
const cacheResults = 'cache-results';
const insertResults = 'insert-results';
export class XtalFetchReq extends XtalFetchBase {
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
        return this._reqInitRequired;
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
    static get observedAttributes() {
        return super.observedAttributes.concat([debounceDuration, reqInitRequired, cacheResults, insertResults]);
    }
    attributeChangedCallback(name, oldValue, newValue) {
        super.attributeChangedCallback(name, oldValue, newValue);
        switch (name) {
            case debounceDuration:
                this._debounceDuration = parseFloat(newValue);
                this.debounceDurationHandler();
                break;
            case reqInitRequired:
            case cacheResults:
            case insertResults:
                this['_' + snakeToCamel(name)] = newValue !== null;
                break;
        }
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
        this.fetchInProgress = true;
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
                        this.dispatchEvent(new CustomEvent('dom-change', {
                            bubbles: true,
                            composed: true,
                        }));
                    }
                    const detail = {
                        href: this.href
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