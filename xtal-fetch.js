import { define } from 'trans-render/lib/define.js';
import { commonPropsInfo } from 'trans-render/lib/mixins/notify.js';
import { getFullURL } from 'xtal-element/lib/base-link-id.js';
export class XtalFetchReqCore extends HTMLElement {
    static cache = {};
    #cachedResults = {};
    #controller;
    async getResult(self) {
        const { href, reqInit, as, cacheResults, insertResults } = self;
        self.errorResponse = undefined;
        if (cacheResults !== undefined) {
            let val = undefined;
            if (cacheResults === 'global') {
                val = XtalFetchReqCore.cache[href];
            }
            else {
                val = self.#cachedResults[href];
            }
            if (val) {
                return { result: val };
                return;
            }
            else if (self.fetchInProgress) {
                setTimeout(async () => {
                    return await self.getResult(self);
                }, 100);
                return;
            }
        }
        if (self.#controller) {
            if (self.fetchInProgress) {
                self.#controller.abort();
            }
        }
        else {
            self.#controller = new AbortController();
        }
        const fullHref = getFullURL(self, href);
        const sig = self.#controller.signal;
        let activeReqInit = reqInit;
        if (reqInit) {
            reqInit.signal = sig;
        }
        else {
            self.reqInit = {
                signal: sig,
            };
            activeReqInit = self.reqInit;
        }
        self.fetchInProgress = true;
        const resp = await window.fetch(href, activeReqInit);
        self.fetchInProgress = false;
        if (resp.status !== 200) {
            self.errorResponse = resp;
            const respText = resp['text'];
            if (respText) {
                const val = await respText();
                self.errorText = val;
            }
        }
        else {
            const result = await resp[as]();
            if (typeof result === 'string' && insertResults)
                return {
                    result: result
                };
        }
    }
}
const notify = {
    notify: {
        dispatch: true
    }
};
export const XtalFetchReq = define({
    config: {
        tagName: 'xtal-fetch-req',
        propDefaults: {
            as: 'json',
            fetch: false,
            disabled: false,
            enabled: true,
            href: '',
            lastFrameHref: '',
            insertResults: false,
            debounceDuration: 0,
        },
        propInfo: {
            href: {
                notify: {
                    echoTo: 'lastFrameHref',
                    echoDelay: 500,
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
                ifAllOf: ['href', 'as'],
                ifAnyOf: ['reqInit', 'cacheResults', 'insertResults']
            }
        }
    },
});
