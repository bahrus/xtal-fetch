import { XtalFetchGetProps } from './types.js';
import {define} from 'trans-render/lib/define.js';
import {INotifyPropInfo, NotifyMixin, commonPropsInfo, INotifyMixin} from 'trans-render/lib/mixins/notify.js';


export class XtalFetchGetCore extends HTMLElement{
    async getResult(self: this){
        const {href, reqInit, as, enabled} = self;
        const resp = await fetch(href!, reqInit);
        const result = await resp[as!]();
        return {result};
    }
}
export interface XtalFetchGetCore extends XtalFetchGetProps, INotifyMixin{}

type x = XtalFetchGetCore;

/**
* Bare-bones custom element that can make fetch calls.
* @element xtal-fetch-get
* @event result-changed
* @event value-changed
*/
export const XtalFetchGet = define<XtalFetchGetCore, INotifyPropInfo>({
    config:{
        tagName: 'xtal-fetch-get',
        propDefaults: {
            as: 'json',
            fetch: false,
            disabled: false,
            enabled: true,
        },
        propChangeMethod: 'onPropChange',
        propInfo:{
            result:{
                notify:{
                    echoTo: 'value',
                    viaCustEvt: true,
                },
            },
            ...commonPropsInfo,
            href:{
                type: 'String'
            }
        },
        actions:[
            {
                do: 'linkResult',
                upon: ['enabled', 'fetch', 'href', 'as', 'reqInit'],
                riff: ['enabled', 'fetch', 'href', 'as'],
                merge: true, async: true,
            }
        ],
        style:{
            display: 'none'
        }
    },
    superclass: XtalFetchGetCore,
    mixins: [NotifyMixin]
}) as {new(): XtalFetchGetCore};

declare global {
    interface HTMLElementTagNameMap {
        "xtal-fetch-get": XtalFetchGetCore,
    }
}