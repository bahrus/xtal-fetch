import { CE } from 'trans-render/lib/CE.js';
import { NotifyMixin, commonPropsInfo } from 'trans-render/lib/mixins/notify.js';
/**
* Bare-bones custom element that can make fetch calls.
* @element xtal-fetch-get
* @event result-changed
* @event value-changed
*/
export class XtalFetchLiteCore extends HTMLElement {
    async getResult({ href, reqInit, as }) {
        const resp = await fetch(href, reqInit);
        const result = await resp[as]();
        return { result };
    }
}
const ce = new CE({
    config: {
        tagName: 'xtal-fetch-lite',
        propDefaults: {
            as: 'json',
            fetch: false,
            disabled: false,
            enabled: true,
            href: '',
        },
        propInfo: {
            result: {
                notify: {
                    echoTo: 'value',
                    dispatch: true,
                },
            },
            ...commonPropsInfo,
        },
        actions: {
            getResult: {
                ifKeyIn: ['reqInit'],
                ifAllOf: ['enabled', 'fetch', 'href', 'as'],
                async: true,
            }
        },
        propChangeMethod: 'onPropChange',
        style: {
            display: 'none'
        }
    },
    superclass: XtalFetchLiteCore,
    mixins: [NotifyMixin]
});
