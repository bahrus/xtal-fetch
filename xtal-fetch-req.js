import { XtalFetchGet, bool1 } from './xtal-fetch-get.js';
import { xc } from 'xtal-element/lib/XtalCore.js';
import { getFullURL } from 'xtal-element/base-link-id.js';
export const propDefMap = {
    reqInitRequired: bool1, insertResults: bool1,
    cacheResults: {
        type: String,
        dry: true,
    },
    debounceDuration: {
        type: Number,
        dry: true,
    },
    errorResponse: {
        type: Object,
        dry: true,
        notify: true,
        stopNotificationIfFalsy: true,
    },
    errorText: {
        type: String,
        dry: true,
        notify: true,
        stopNotificationIfFalsy: true,
        reflect: true,
    },
    fetchInProgress: {
        type: Boolean,
        dry: true,
        notify: true,
        stopNotificationIfFalsy: true,
        reflect: true,
    }
};
const slicedPropDefs = xc.getSlicedPropDefs(propDefMap);
export const cacheSymbol = Symbol.for(XtalFetchGet.is + '_cache');
//type prop = keyof XtalFetchReqAddedProperties;
const triggerDebounce = ({ href, fetch, reqInit, reqInitRequired, as, self }) => {
    if (reqInitRequired && reqInit === undefined)
        return;
    if (!self.__loadNewUrlDebouncer) {
        self.debounceDurationHandler();
    }
    self.__loadNewUrlDebouncer();
};
const propActions = [
    triggerDebounce
];
const linkResult = ({ href, fetch, reqInit, reqInitRequired, as, self }) => {
    self.errorResponse = undefined;
    if (self.cacheResults !== undefined) {
        let val = undefined;
        if (self.cacheResults === 'global') {
            if (XtalFetchGet[cacheSymbol] === undefined)
                XtalFetchGet[cacheSymbol] = {};
            val = XtalFetchGet[cacheSymbol][href];
        }
        else {
            val = self.cachedResults[self.href];
        }
        if (val) {
            self.result = val;
            return;
        }
        else if (self.fetchInProgress) {
            setTimeout(() => {
                linkResult(self);
            }, 100);
            return;
        }
    }
    if (self.controller) {
        if (self.fetchInProgress) {
            self.controller.abort();
        }
    }
    else {
        self.controller = new AbortController();
    }
    const fullHref = getFullURL(self, href);
    const sig = self.controller.signal;
    if (self.reqInit) {
        self.reqInit.signal = sig;
    }
    else {
        self.reqInit = {
            signal: sig,
        };
        return;
    }
    self.fetchInProgress = true;
    window.fetch(href, reqInit).then(resp => {
        self.fetchInProgress = false;
        resp[as]().then(result => {
            if (resp.status !== 200) {
                self.errorResponse = resp;
                const respText = resp['text'];
                if (respText)
                    respText().then(val => {
                        self.errorText = val;
                    });
            }
            else {
                self.result = result;
                if (self.cacheResults !== undefined) {
                    if (self.cacheResults === 'global') {
                        XtalFetchGet[cacheSymbol] = result;
                    }
                    else {
                        self.cachedResults[href] = result;
                    }
                }
                if (typeof result === 'string' && self.insertResults) {
                    self.style.display = self._initDisp;
                    self.innerHTML = result;
                }
                const detail = {
                    href: href,
                    result: result
                };
                self.dispatchEvent(new CustomEvent('fetch-complete', {
                    detail: detail
                }));
            }
        });
    }).catch(err => {
        if (err.name === 'AbortError') {
            console.log('Fetch aborted');
            self.fetchInProgress = false;
        }
    });
};
/**
 * Feature rich custom element that can make fetch calls, including post requests.
 * @element xtal-fetch-req
 * @event error-response-changed
 * @event error-text-changed
 * @event fetch-in-progress-changed
 * @event fetch-complete
 */
export class XtalFetchReq extends XtalFetchGet {
    constructor() {
        super(...arguments);
        this.propActions = propActions;
        this._cachedResults = {};
        /**
         * How long to pause between requests
         * @attr debounce-duration
         * @type {Number}
         *
         */
        this.debounceDuration = 1000;
    }
    get cachedResults() {
        return this._cachedResults;
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
            linkResult(this);
        }, this.debounceDuration);
    }
    connectedCallback() {
        super.connectedCallback();
        xc.hydrate(this, slicedPropDefs);
    }
}
XtalFetchReq.is = 'xtal-fetch-req';
xc.letThereBeProps(XtalFetchReq, slicedPropDefs.propDefs, 'onPropChange');
xc.define(XtalFetchReq);
