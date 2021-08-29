import { XtalFetchLiteProps, XtalFetchLiteActions as XtalFetchLiteActions, pxfgp } from './types.js';
import {CE} from 'trans-render/lib/CE.js';
import {INotifyPropInfo, NotifyMixin, commonPropsInfo, INotifyMixin} from 'trans-render/lib/mixins/notify.js';

export class XtalFetchLiteCore extends HTMLElement implements XtalFetchLiteActions{
    async getResult(self: this){
        const {href, reqInit, as} = self;
        const resp = await fetch(href!, reqInit);
        const result = await resp[as!]();
        return {result} as pxfgp;
    }
}
export interface XtalFetchLiteCore extends XtalFetchLiteProps, INotifyMixin{}

export interface XtalFetchLiteCoreActions extends INotifyMixin, XtalFetchLiteActions{}

type x = XtalFetchLiteCore;

/**
* Bare-bones custom element that can make fetch calls.
* @element xtal-fetch-get
* @event result-changed
* @event value-changed
*/
export const XtalFetchLite = (new CE<XtalFetchLiteProps, XtalFetchLiteCoreActions, INotifyPropInfo>()).def({
    config:{
        tagName: 'xtal-fetch-lite',
        propDefaults: {
            as: 'json',
            fetch: false,
            disabled: false,
            enabled: true,
            href: '',
        },
        propChangeMethod: 'onPropChange',
        propInfo:{
            result:{
                notify:{
                    echoTo: 'value',
                    dispatch: true,
                },
            },
            ...commonPropsInfo,
        },
        actions:{
            getResult: {
                ifAllOf: ['enabled', 'fetch', 'href', 'as'],
                andAlsoActIfKeyIn: ['reqInit'],
                async: true,
            }
        },
        style:{
            display: 'none'
        }
    },
    superclass: XtalFetchLiteCore,
    mixins: [NotifyMixin]
}) as {new(): XtalFetchLiteCore};

declare global {
    interface HTMLElementTagNameMap {
        "xtal-fetch-lite": XtalFetchLiteCore,
    }
}