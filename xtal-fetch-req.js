import { XtalFetchGet } from './xtal-fetch-get.js';
import { define } from 'trans-render/define.js';
import { baseLinkId, BaseLinkId } from 'xtal-element/base-link-id.js';
import { setSymbol } from 'trans-render/manageSymbols.js';
export function snakeToCamel(s) {
    return s.replace(/(\-\w)/g, function (m) { return m[1].toUpperCase(); });
}
const debounceDuration = 'debounce-duration';
const reqInitRequired = 'req-init-required';
const cacheResults = 'cache-results';
const insertResults = 'insert-results';
const req_init = 'req-init';
export const cacheSymbol = setSymbol(XtalFetchGet.is, 'cache');
/**
 * Feature rich custom element that can make fetch calls, including post requests.
 * @element xtal-fetch-req
 * @event error-response-changed
 * @event error-text-changed
 * @event fetch-in-progress-changed
 * @event fetch-complete
 */
export class XtalFetchReq extends BaseLinkId(XtalFetchGet) {
    constructor() {
        super();
        this._cacheResults = false;
        this._cachedResults = {};
        this._fetchInProgress = false;
        this._insertResults = false;
        this._reqInit = undefined;
    }
    /**
    * All events emitted pass through this method
    * @param evt
    */
    emit(type, detail) {
        this.de(type, detail, true);
    }
    get reqInit() {
        return this._reqInit;
    }
    /**
     * Object to use for second parameter of fetch method.  Can parse the value from the attribute if the attribute is in JSON format.
     * Supports JSON formatted attribute
     * @type {object}
     * @attr req-init
     */
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
    /**
     * Indicates whether to pull the response from a previous identical fetch request from cache.
     * If set to true, cache is stored locally within the instance of the web component.
     * If set to 'global', cache is retained after web component goes out of scope.
     * @attr cache-results
     */
    set cacheResults(val) {
        if (typeof (val) === 'boolean') {
            this.attr(cacheResults, val, '');
        }
        else {
            this.attr(cacheResults, val);
        }
    }
    get cachedResults() {
        return this._cachedResults;
    }
    get reqInitRequired() {
        return this.hasAttribute(reqInitRequired);
    }
    /**
     * Indicates that no fetch request should proceed until reqInit property / attribute is set.
     */
    set reqInitRequired(val) {
        this.attr(reqInitRequired, val, '');
    }
    get debounceDuration() {
        return this._debounceDuration;
    }
    /**
     * How long to pause between requests
     * @attr debounce-duration
     * @type {Number}
     *
     */
    set debounceDuration(val) {
        this.setAttribute(debounceDuration, val.toString());
    }
    get errorResponse() {
        return this._errorResponse;
    }
    /**
     * Error response as an object
     * ⚡ Fires event error-response-changed
     * @type {Object}
     *
     */
    set errorResponse(val) {
        //if(this._errorResponse === val) return;
        if (!this._errorResponse && !val)
            return;
        this._errorResponse = val;
        if (val !== null) {
            this.emit('error-response-changed', {
                value: val
            });
        }
    }
    get errorText() {
        return this._errorText;
    }
    /**
     * Indicates the error text of the last request.
     * ⚡ Fires event error-text-changed.
     * @type {String}
     */
    set errorText(val) {
        if (!val && !this._errorText)
            return;
        this._errorText = val;
        this.attr('errorText', val);
        this.emit('error-text-changed', {
            value: val
        });
    }
    get fetchInProgress() {
        return this._fetchInProgress;
    }
    /**
     * Indicates Fetch is in progress
     * ⚡ Fires event fetch-in-progress-changed
     * @type {Boolean}
     */
    set fetchInProgress(val) {
        this._fetchInProgress = val;
        this.emit('fetch-in-progress-changed', {
            value: val
        });
    }
    get insertResults() {
        return this._insertResults;
    }
    /**
     * Indicate whether to set the innerHTML of the web component with the response from the server.
     * Make sure the service is protected against XSS.
     * @attr insert-results
     */
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
            case reqInitRequired:
            //case cacheResults:
            case insertResults:
                this['_' + snakeToCamel(name)] = newValue !== null;
                break;
            case cacheResults:
                if (newValue === 'global') {
                    this._cacheResults = newValue;
                    if (XtalFetchGet[cacheSymbol] === undefined) {
                        XtalFetchGet[cacheSymbol] = {};
                    }
                }
                else {
                    this._cacheResults = newValue !== null;
                }
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
        if (this._cacheResults !== false) {
            let val = undefined;
            if (this._cacheResults === 'global') {
                val = XtalFetchGet[cacheSymbol][this._href];
            }
            else {
                val = this.cachedResults[this._href];
            }
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
                    if (this._cacheResults !== false) {
                        if (this._cacheResults === 'global') {
                            XtalFetchGet[cacheSymbol] = result;
                        }
                        else {
                            this.cachedResults[this._href] = result;
                        }
                    }
                    if (typeof result === 'string' && this._insertResults) {
                        this.style.display = this._initDisp;
                        this.innerHTML = result;
                    }
                    const detail = {
                        href: this.href,
                        result: result
                    };
                    this.emit('fetch-complete', detail);
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
        this.propUp(['baseLinkId', 'cacheResults', 'debounceDuration', 'insertResults', 'reqInitRequired', 'reqInit']);
        super.connectedCallback();
    }
}
define(XtalFetchReq);
