import { CE } from 'trans-render/lib/CE.js';
import { commonPropsInfo, NotifyMixin } from 'trans-render/lib/mixins/notify.js';
import { getFullURL } from 'xtal-element/lib/base-link-id.js';
export class XtalFetchCore extends HTMLElement {
    static cache = {};
    #cachedResults = {};
    #controller;
    async getResult({ href, lastFrameHref, reqInit, as, cacheResults, insertResultsAs, fetchInProgress }) {
        if (href !== lastFrameHref)
            return;
        if (!insertResultsAs)
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
        let resp;
        try {
            resp = await window.fetch(href, activeReqInit);
        }
        catch (e) {
            this.fetchInProgress = false;
            this.errorText = e.message;
            console.error(e);
            return;
        }
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
            let result = await resp[as]();
            result = this.filterResult(result);
            if (typeof result === 'string') {
                switch (insertResultsAs) {
                    case 'innerHTML':
                        this.innerHTML = result;
                        break;
                    case 'openShadow':
                        if (this.shadowRoot === null) {
                            this.attachShadow({ mode: 'open' });
                        }
                        this.shadowRoot.innerHTML = result;
                        break;
                }
            }
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
const reflect = {
    notify: {
        dispatch: true,
        reflect: {
            asAttr: true,
        }
    }
};
;
const ce = new CE({
    config: {
        tagName: 'xtal-fetch',
        propDefaults: {
            as: 'json',
            baseLinkId: '',
            fetch: false,
            fetchInProgress: false,
            disabled: false,
            enabled: true,
            href: '',
            debounceDuration: 0,
            lastFrameHref: '',
        },
        propChangeMethod: 'onPropChange',
        propInfo: {
            href: {
                notify: {
                    echoTo: 'lastFrameHref',
                    echoDelay: 'debounceDuration',
                    reflect: { asAttr: true }
                }
            },
            insertResultsAs: { type: 'String' },
            cacheResults: { type: 'String' },
            errorResponse: notify,
            errorText: notify,
            fetchInProgress: reflect,
            baseLinkId: reflect,
            ...commonPropsInfo,
        },
        actions: {
            getResult: {
                ifKeyIn: ['reqInit', 'cacheResults', 'insertResultsAs'],
                ifAllOf: ['enabled', 'fetch', 'href', 'as', 'lastFrameHref'],
            }
        },
    },
    superclass: XtalFetchCore,
    mixins: [NotifyMixin],
});
export const XtalFetch = ce.classDef;
