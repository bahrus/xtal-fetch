import { define } from 'trans-render/lib/define.js';
import { NotifyMixin, commonPropsInfo } from 'trans-render/lib/mixins/notify.js';
/**
* Bare-bones custom element that can make fetch calls.
* @element xtal-fetch-get
* @event result-changed
* @event value-changed
*/
export class XtalFetchGetCore extends HTMLElement {
    async linkResult(self) {
        const { href, reqInit, as, enabled } = self;
        const resp = await fetch(href, reqInit);
        const result = await resp[as]();
        return { result };
    }
}
const XtalFetchGet = define({
    config: {
        tagName: 'xtal-fetch-get',
        propDefaults: {
            as: 'json',
            fetch: false,
            disabled: false,
            enabled: true,
        },
        propChangeMethod: 'onPropChange',
        propInfo: {
            result: {
                notify: {
                    echoTo: 'value',
                    viaCustEvt: true,
                },
            },
            ...commonPropsInfo,
            href: {
                type: 'String'
            }
        },
        actions: [
            {
                do: 'linkResult',
                upon: ['enabled', 'fetch', 'href', 'as', 'reqInit'],
                riff: ['enabled', 'fetch', 'href', 'as'],
                merge: true, async: true,
            }
        ],
        style: {
            display: 'none'
        }
    },
    superclass: XtalFetchGetCore,
    mixins: [NotifyMixin]
});
