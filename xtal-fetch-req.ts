import { XtalFetchBase, IXtalFetchBaseProperties } from './xtal-fetch-base.js';

export interface IXtalFetchReq extends IXtalFetchBaseProperties {
    reqInit: RequestInit,
    reqInitRequired: boolean,
    debounceDuration: number,
    errorResponse: Response;
    fetchInProgress: boolean;
    insertResults: boolean;
}
export function snakeToCamel(s) {
    return s.replace(/(\-\w)/g, function (m) { return m[1].toUpperCase(); });
}
const debounceDuration = 'debounce-duration';
const reqInitRequired = 'req-init-required';
const cacheResults = 'cache-results';
const insertResults = 'insert-results';

export class XtalFetchReq extends XtalFetchBase implements IXtalFetchReq {
    constructor(){
        super();
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
    onPropsChange(){
        if(this.reqInitRequired && !this.reqInit) return;
        if(!this.__loadNewUrlDebouncer){
            this.debounceDurationHandler();
        }
        this.__loadNewUrlDebouncer();
    }

    static get is() { return 'xtal-fetch-req'; }

    _cacheResults = false;
    get cacheResults() {
        return this._cacheResults;
    }
    set cacheResults(val) {
        if (val) {
            this.setAttribute(cacheResults, '');
        } else {
            this.removeAttribute(cacheResults);
        }
    }

    private _cachedResults: { [key: string]: any } = {};
    get cachedResults() {
        return this._cachedResults;
    }

    _reqInitRequired: boolean;
    get reqInitRequired() {
        return this._reqInitRequired;
    }
    set reqInitRequired(val) {
        if (val) {
            this.setAttribute(reqInitRequired, '')
        } else {
            this.removeAttribute(reqInitRequired);
        }
    }

    _debounceDuration;
    get debounceDuration() {
        return this._debounceDuration;
    }
    set debounceDuration(val) {
        this.setAttribute(debounceDuration, val.toString());
    }

    _errorResponse: Response;
    get errorResponse() {
        return this._errorResponse;
    }
    set errorResponse(val) {
        this._errorResponse = val;
        this.de('error-response', {
            value: val
        });
    }

    _errorText
    get errorText() {
        return this._errorText;
    }
    set errorText(val) {
        this._errorText = val;
        this.de('error-text', {
            value: val
        });
    }

    _fetchInProgress = false;
    get fetchInProgress() {
        return this._fetchInProgress;
    }
    set fetchInProgress(val) {
        this._fetchInProgress = val;
        this.de('fetch-in-progress', {
            value: val
        })
    }

    _insertResults: boolean;
    get insertResults() {
        return this._insertResults;
    }
    set insertResults(val) {
        if (val) {
            this.setAttribute(insertResults, '');
        } else {
            this.removeAttribute(insertResults);
        }
    }

    static get observedAttributes() {
        return super.observedAttributes.concat([debounceDuration, reqInitRequired, cacheResults, insertResults]);
    }

    attributeChangedCallback(name: string, oldValue: string, newValue: string) {
        super.attributeChangedCallback(name, oldValue, newValue);
        switch (name) {
            case debounceDuration:
                this._debounceDuration = parseFloat(newValue);
                this.debounceDurationHandler();
                break;
            case reqInitRequired:
            case cacheResults:
            case insertResults:
                this['_' + snakeToCamel(name)] =  newValue !== null;
                break;
            //     this._reqInitRequired = newValue !== null;
            //     break;
            // case cacheResults:
            //     this._cacheResults = newValue !== null;
            //     break;
        }
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
    // __loadNewUrlDebouncer = this.debounce(() => {
    //     this.loadNewUrl();
    // }, 0);
    __loadNewUrlDebouncer;
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
                    })
                } else {
                    this.result = result;
                    if (this.cachedResults) {
                        this.cachedResults[this._href] = result;
                    }
                    if (typeof result === 'string' && this._insertResults) {
                        this.innerHTML = result;
                        this.dispatchEvent(new CustomEvent('dom-change', {
                            bubbles: true,
                            composed: true,
                        } as CustomEventInit));
                    }
                    const detail = {
                        href: this.href
                    }
                    this.dispatchEvent(new CustomEvent('fetch-complete', {
                        detail: detail,
                        bubbles: true,
                        composed: false,
                    } as CustomEventInit));
                }
            })
        });
    }

    connectedCallback(){
        super.connectedCallback();
        this._upgradeProperties(['debounceDuration', 'reqInitRequired', 'cacheResults', 'reqInit']);
    }
}
if(!customElements.get(XtalFetchReq.is)){
    customElements.define(XtalFetchReq.is, XtalFetchReq);
}