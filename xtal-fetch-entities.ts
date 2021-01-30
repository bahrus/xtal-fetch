import { XtalFetchReq, str2, triggerDebounce, updateDebounce} from './xtal-fetch-req.js';
import {obj1} from './xtal-fetch-get.js';
import { xc, PropDefMap, PropAction } from 'xtal-element/lib/XtalCore.js';
import { getFullURL} from 'xtal-element/base-link-id.js';

const doFetch = ({href, fetch, reqInit, reqInitRequired, as, self, forEach, setPath, inEntities}: XtalFetchEntities) => {
    const hasAllThreeProps = forEach !== undefined && setPath !== undefined && inEntities !== undefined;
    const hasAnyThreeProps = forEach !== undefined || setPath !== undefined || inEntities !== undefined;
    if(!hasAllThreeProps){
        if(hasAnyThreeProps) return;
        triggerDebounce(self);
        return;
    }
    const keys = forEach.split(',');
    let remainingCalls = inEntities.length;
    self.fetchInProgress = true;
    let counter = 0;
    const base =  getFullURL(this, '');
    if(typeof(AbortController) !== 'undefined'){
        self.controller = new AbortController();
        const sig = self.controller.signal;
        if(reqInit){
            reqInit.signal = sig;
        }else{
            self.reqInit = {
                signal: sig,
            }
            return;
        }
    }
    for(let i = 0, ii = inEntities.length; i < ii; i++){
        const entity = inEntities[i];
        entity['__xtal_idx'] = counter; counter++;
        keys.forEach(key => {
            href = href.replace(':' + key, entity[key]);
        })
        href = base + href;
        if (self.cacheResults) {
            const val = self.cachedResults[href];
            if (val) {
                entity[setPath] = val;
                remainingCalls--;
                if (remainingCalls === 0) self.fetchInProgress = false;
                return;
            }
        }
        
        window.fetch(href, reqInit).then(resp => {
            if (resp.status !== 200) {
                resp['text']().then(val => {
                    self.errorText = val;
                })
                self.errorResponse = resp;
            } else {
                resp[as]().then(val => {
                    remainingCalls--;
                    if (remainingCalls === 0) {
                        self.fetchInProgress = false;
                        self.result = inEntities.slice(0);
                    }
                    if (self.cacheResults) self.cachedResults[href] = val;
                    entity[setPath] = val;
                    const detail = {
                        entity: entity,
                        href: href
                    }
                    self.dispatchEvent(new CustomEvent('fetch-complete', {detail: detail}));
                    

                });
            }


        }).catch(err => {
            if (err.name === 'AbortError') {
                console.log('Fetch aborted');
                self.fetchInProgress = false;
            }
        });
    }

}

const propDefMap: PropDefMap<XtalFetchEntities> = {
    forEach: str2, setPath: str2,
    inEntities: obj1
};
const slicedPropDefs = xc.getSlicedPropDefs(propDefMap);

const propActions = [
    doFetch, updateDebounce
] as PropAction[];

/**
 *  Entire feature set for xtal-fetch, including multiple entity requests.
 *  @element xtal-fetch-entities
 */
export class XtalFetchEntities extends XtalFetchReq{
    static is =  'xtal-fetch-entities';
    
    /**
     * Comma delimited list of properties to use as input for the fetch urls
     * @type {String}
     * @attr for-each
     */
    forEach: string | undefined;

    /**
     * Path to set value inside each entity
     * @type {String}
     * attr set-path
     */
    setPath: string | undefined;
        
    /**
     * Array of entities to use as input for building the url (along with forEach value).  Also place where result should go (using setPath attribute)
     * @type {Array}
     * 
     */
    inEntities: any[];
    get hasAllThreeProps(){
        return this.forEach !== undefined && this.setPath !== undefined && this.inEntities !== undefined;
    }
    get hasAnyThreeProps(){
        return this.forEach !== undefined || this.setPath !== undefined || this.inEntities !== undefined;
    }

}
xc.define(XtalFetchEntities);
declare global {
    interface HTMLElementTagNameMap {
        "xtal-fetch-entities": XtalFetchEntities,
    }
}

/**
 * Feature rich custom element that can make fetch calls, include Post requests.
 *  @element xtal-fetch
 */
class XtalFetch extends XtalFetchEntities{
    static is = 'xtal-fetch';
}
xc.define(XtalFetch);
declare global {
    interface HTMLElementTagNameMap {
        "xtal-fetch": XtalFetch,
    }
}