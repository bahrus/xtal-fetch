import { XtalFetchGet, bool1} from './xtal-fetch-get.js';
import { xc, PropDef, PropDefMap, PropAction } from 'xtal-element/lib/XtalCore.js';
import { IBaseLinkContainer, getFullURL} from 'xtal-element/lib/base-link-id.js';
import { XtalFetchReqProps, XtalFetchReqAddedProperties, XtalFetchReqEventNameMap} from './types.d.js';

/**
 * Feature rich custom element that can make fetch calls, including post requests.
 * @element xtal-fetch-req
 * @event error-response-changed
 * @event error-text-changed
 * @event fetch-in-progress-changed
 * @event fetch-complete
 */
 export class XtalFetchReq extends XtalFetchGet implements XtalFetchReqProps, IBaseLinkContainer {

    static is = 'xtal-fetch-req';

    controller: AbortController | undefined;

    propActions = propActions;

    private _cachedResults: { [key: string]: any } = {};
    get cachedResults() {
        return this._cachedResults;
    }

    debounce(func: any, wait: number, immediate?: boolean) {
        let timeout: any;
        return function ()  {
            const context = this, args = arguments;
            clearTimeout(timeout);
            timeout = setTimeout(function () {
                timeout = null;
                if (!immediate) func.apply(context, args);
            }, wait);
            if (immediate && !timeout) func.apply(context, args);
        };
    }

    __loadNewUrlDebouncer!: any;
    debounceDurationHandler() {
        this.__loadNewUrlDebouncer = this.debounce(() => {
            linkResult(this);
        }, this.debounceDuration!);
    }

    connectedCallback(){
        super.connectedCallback();
        xc.mergeProps<Partial<XtalFetchReqProps>>(this, slicedPropDefs, {
            debounceDuration: 16
        });
    }


}

export interface XtalFetchReq extends XtalFetchReqProps{}

export const str2: PropDef = {
    type: String,
    dry: true,
};

export const propDefMap: PropDefMap<XtalFetchReqProps> = {
    reqInitRequired: bool1, insertResults: bool1,
    cacheResults: str2,
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

export const triggerDebounce = ({href, fetch, reqInit, reqInitRequired, as, self}: XtalFetchReq) => {
    if(reqInitRequired && reqInit === undefined) return;
    if(!self.__loadNewUrlDebouncer){
        self.debounceDurationHandler();
    }
    self.__loadNewUrlDebouncer();
}

export const updateDebounce = ({debounceDuration, self}: XtalFetchReq) => {
    self.debounceDurationHandler();
}

const propActions = [
    triggerDebounce, updateDebounce
] as PropAction[];
const linkResult = ({href, fetch, reqInit, reqInitRequired, as, self}: XtalFetchReq) => {
    
    self.errorResponse = undefined;
    if (self.cacheResults !== undefined) {
        let val = undefined;
        if(self.cacheResults === 'global'){
            val = XtalFetchGet.cache[href!];
        }else{
            val = self.cachedResults[href!];
        }
        if (val) {
            self.result = val;
            return;
        }else if(self.fetchInProgress){
            setTimeout(() =>{
                linkResult(self);
            }, 100);
            return;
        }
    }
    if(self.controller) {
        if(self.fetchInProgress){
            self.controller.abort();
        }
        
    }else{
        self.controller = new AbortController();
    }
    
    
    const fullHref = getFullURL(self, href!);

    const sig = self.controller.signal;
    if(self.reqInit){
        self.reqInit.signal = sig;
    }else{
        self.reqInit = {
            signal: sig,
        }
        return;
    }
    self.fetchInProgress = true;
    window.fetch(href!, reqInit).then(resp => {
        self.fetchInProgress = false;
        resp[as!]().then(result => {
            if (resp.status !== 200) {
                self.errorResponse = resp;
                const respText = resp['text'];
                if(respText) respText().then(val => {
                    self.errorText = val;
                })
            } else {
                self.result = result;
                if (self.cacheResults !== undefined) {
                    if(self.cacheResults === 'global'){
                        XtalFetchGet.cache[href!] = result;
                    }else{
                        self.cachedResults[href!] = result;
                    }
                    
                }
                if (typeof result === 'string' && self.insertResults) {
                    self.style.display = self._initDisp!;
                    self.innerHTML = result;
                }
                const detail = {
                    href: href,
                    result: result
                }
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
}


xc.letThereBeProps(XtalFetchReq, slicedPropDefs, 'onPropChange');
xc.define(XtalFetchReq);
declare global {
    interface HTMLElementTagNameMap {
        "xtal-fetch-req": XtalFetchReq,
    }
}