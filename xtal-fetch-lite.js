import { CE } from 'trans-render/lib/CE.js';
import { NotifyMixin, commonPropsInfo } from 'trans-render/lib/mixins/notify.js';
export class XtalFetchLiteCore extends HTMLElement {
    async getResult(self) {
        const { href, reqInit, as } = self;
        const resp = await fetch(href, reqInit);
        const result = await resp[as]();
        return { result };
    }
}
/**
* Bare-bones custom element that can make fetch calls.
* @element xtal-fetch-get
* @event result-changed
* @event value-changed
*/
export const XtalFetchLite = (new CE()).def({
    config: {
        tagName: 'xtal-fetch-lite',
        propDefaults: {
            as: 'json',
            fetch: false,
            disabled: false,
            enabled: true,
            href: '',
        },
        propChangeMethod: 'onPropChange',
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
                ifAllOf: ['enabled', 'fetch', 'href', 'as'],
                andAlsoActIfKeyIn: ['reqInit'],
                async: true,
            }
        },
        style: {
            display: 'none'
        }
    },
    superclass: XtalFetchLiteCore,
    mixins: [NotifyMixin]
});
