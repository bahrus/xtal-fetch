import { XtalFetchGet } from './xtal-fetch-get.js';
import { define, mergeProps } from 'xtal-element/xtal-latx.js';
import { BaseLinkId } from 'xtal-element/base-link-id.js';
import { setSymbol } from 'trans-render/manageSymbols.js';
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
        super(...arguments);
        this._cachedResults = {};
        /**
         * How long to pause between requests
         * @attr debounce-duration
         * @type {Number}
         *
         */
        this.debounceDuration = 16;
        this._fetchInProgress = false;
    }
    /**
    * All events emitted pass through this method
    * @param evt
    */
    emit(type, detail) {
        this.de(type, detail, true);
    }
    onPropsChange() {
        if (this.reqInitRequired && !this.reqInit)
            return;
        if (!this.__loadNewUrlDebouncer) {
            this.debounceDurationHandler();
        }
        this.__loadNewUrlDebouncer();
    }
    get cachedResults() {
        return this._cachedResults;
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
    set abort(val) {
        if (this._controller)
            this._controller.abort();
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
        }, this.debounceDuration);
    }
    //overrides
    do() {
        this.errorResponse = null;
        if (this.cacheResults !== undefined) {
            let val = undefined;
            if (this.cacheResults === 'global') {
                if (XtalFetchGet[cacheSymbol] === undefined)
                    XtalFetchGet[cacheSymbol] = {};
                val = XtalFetchGet[cacheSymbol][this.href];
            }
            else {
                val = this.cachedResults[this.href];
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
            resp[this.as]().then(result => {
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
                    if (this.cacheResults !== undefined) {
                        if (this.cacheResults === 'global') {
                            XtalFetchGet[cacheSymbol] = result;
                        }
                        else {
                            this.cachedResults[this.href] = result;
                        }
                    }
                    if (typeof result === 'string' && this.insertResults) {
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
}
XtalFetchReq.is = 'xtal-fetch-req';
XtalFetchReq.attributeProps = ({ reqInit, cacheResults, reqInitRequired, debounceDuration, insertResults }) => {
    const ap = {
        boolean: [reqInitRequired, insertResults],
        string: [cacheResults],
        number: [debounceDuration],
        object: [reqInit],
        parsedObject: [reqInit]
    };
    return mergeProps(ap, XtalFetchGet.props);
};
define(XtalFetchReq);
