import {XtalFetchLite} from './xtal-fetch-lite.js';
import {define} from 'trans-render/lib/define.js';
import {INotifyPropInfo, commonPropsInfo, NotifyMixin, INotifyMixin} from 'trans-render/lib/mixins/notify.js';
import { XtalFetchProps , XtalFetchActions} from './types.js';
import { IBaseLinkContainer, getFullURL} from 'xtal-element/lib/base-link-id.js';

export class XtalFetchCore extends HTMLElement{
    static cache:  {[key: string]: any} = {};
    #cachedResults: { [key: string]: any } = {};
    #controller: AbortController | undefined;
    async getResult(self: this, propChangeInfo: any, b:  any){
        const {href, lastFrameHref, reqInit, as, cacheResults, insertResults} = self;
        if(href !== lastFrameHref) return;
        if(!insertResults) self.style.display = 'none';
        self.errorResponse = undefined;
        if (cacheResults !== undefined) {
            let val = undefined;
            if(cacheResults === 'global'){
                val = XtalFetchCore.cache[href!];
            }else{
                val = self.#cachedResults[href!];
            }
            if (val) {
                return {result: val};
                return;
            }else if(self.fetchInProgress){
                setTimeout(async () =>{
                    return await self.getResult(self, propChangeInfo, b);
                }, 100);
                return;
            }
        }
        if(self.#controller) {
            if(self.fetchInProgress){
                self.#controller.abort();
            }
            
        }else{
            self.#controller = new AbortController();
        }
        const fullHref = getFullURL(self, href!);

        const sig = self.#controller.signal;
        let activeReqInit = reqInit;
        if(reqInit){
            reqInit.signal = sig;
        }else{
            self.reqInit = {
                signal: sig,
            }
            return; //avoid duplicate requests.
        }
        self.fetchInProgress = true;
        const resp = await window.fetch(href!, activeReqInit);
        self.fetchInProgress = false;
        if(resp.status !== 200){
            self.errorResponse = resp;
            const respText = resp['text'];
            if(respText){
                const val = await respText();
                self.errorText = val;
            }
        }else{
            const result = await resp[as!]();
            if(typeof result === 'string' && insertResults){
                this.innerHTML = result;
            }
            this.result = result;
        }
    }
}

export interface XtalFetchCore extends XtalFetchProps, IBaseLinkContainer{}

const notify: INotifyPropInfo = {
    notify: {
        dispatch: true
    }
};

export interface XtalFetchCoreActions extends INotifyMixin, XtalFetchActions{};

export const XtalFetch = define<XtalFetchProps, XtalFetchCoreActions, INotifyPropInfo<XtalFetchProps> >({
    config:{
        tagName: 'xtal-fetch',
        propDefaults:{
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
        propInfo:{
            href: {
                notify:{
                    echoTo: 'lastFrameHref',
                    echoDelay: 'debounceDuration',
                }
            },
            cacheResults: {type: 'String'},
            errorResponse:notify,
            errorText: notify,
            fetchInProgress: notify,
            ...commonPropsInfo,
        },
        actions:{
            getResult: {
                ifAllOf: ['enabled', 'fetch', 'href', 'as', 'lastFrameHref'],
                andAlsoActIfKeyIn: ['reqInit', 'cacheResults', 'insertResults']
            }
        },

    },
    superclass: XtalFetchCore,
    mixins: [NotifyMixin],
});