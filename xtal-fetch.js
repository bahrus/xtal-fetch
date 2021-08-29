import { define } from 'trans-render/lib/define.js';
import { commonPropsInfo, NotifyMixin } from 'trans-render/lib/mixins/notify.js';
import { getFullURL } from 'xtal-element/lib/base-link-id.js';
export class XtalFetchCore extends HTMLElement {
    static cache = {};
    #cachedResults = {};
    #controller;
    async getResult({ href, lastFrameHref, reqInit, as, cacheResults, insertResults, fetchInProgress }) {
        if (href !== lastFrameHref)
            return;
        if (!insertResults)
            this.style.display = 'none';
        this.errorResponse = undefined;
        if (cacheResults !== undefined) {
            let val = undefined;
            if (cacheResults === 'global') {
                val = XtalFetchCore.cache[href];
            }
            else {
                val = this.#cachedResults[href];
            }
            if (val) {
                return { result: val };
                return;
            }
            else if (fetchInProgress) {
                setTimeout(async () => {
                    return await this.getResult(this);
                }, 100);
                return;
            }
        }
        if (this.#controller) {
            if (fetchInProgress) {
                this.#controller.abort();
            }
        }
        else {
            this.#controller = new AbortController();
        }
        const fullHref = getFullURL(this, href);
        const sig = this.#controller.signal;
        let activeReqInit = reqInit;
        if (reqInit) {
            reqInit.signal = sig;
        }
        else {
            this.reqInit = {
                signal: sig,
            };
            return; //avoid duplicate requests.
        }
        this.fetchInProgress = true;
        const resp = await window.fetch(href, activeReqInit);
        this.fetchInProgress = false;
        if (resp.status !== 200) {
            this.errorResponse = resp;
            const respText = resp['text'];
            if (respText) {
                const val = await respText();
                this.errorText = val;
            }
        }
        else {
            const result = await resp[as]();
            if (typeof result === 'string' && insertResults) {
                this.innerHTML = result;
            }
            this.result = this.filterResult(result);
        }
    }
    filterResult(result) {
        return result;
    }
}
const notify = {
    notify: {
        dispatch: true
    }
};
;
export const XtalFetch = define({
    config: {
        tagName: 'xtal-fetch',
        propDefaults: {
            as: 'json',
            fetch: false,
            disabled: false,
            enabled: true,
            href: '',
            debounceDuration: 0,
            lastFrameHref: '',
            insertResults: false,
        },
        propChangeMethod: 'onPropChange',
        propInfo: {
            href: {
                notify: {
                    echoTo: 'lastFrameHref',
                    echoDelay: 'debounceDuration',
                }
            },
            cacheResults: { type: 'String' },
            errorResponse: notify,
            errorText: notify,
            fetchInProgress: notify,
            ...commonPropsInfo,
        },
        actions: {
            getResult: {
                ifKeyIn: ['reqInit', 'cacheResults', 'insertResults'],
                ifAllOf: ['enabled', 'fetch', 'href', 'as', 'lastFrameHref'],
                debug: true,
            }
        },
    },
    superclass: XtalFetchCore,
    mixins: [NotifyMixin],
});
