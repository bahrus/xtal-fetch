import { XtalFetchReq, IXtalFetchReqProperties, snakeToCamel } from './xtal-fetch-req.js';

export interface IXtalFetchEntitiesProperties extends IXtalFetchReqProperties{
    forEach: string,
    setPath: string,
    inEntities: any[],
}
const forEach = 'for-each';
const setPath = 'set-path';
/**
 * `xtal-fetch-entities`
 *  Entire feature set for fetch, including multiple entity requests.
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */
class XtalFetchEntities extends XtalFetchReq{
    static get is(){return 'xtal-fetch-entities';}
    _forEach: string;
    get forEach(){
        return this._forEach || this.getAttribute(forEach);
    }
    set forEach(val){
        this.setAttribute(forEach, val);
    }
    _setPath: string;
    get setPath(){
        return this._setPath || this.getAttribute(setPath);
    }
    set setPath(val){
        this.setAttribute(setPath, val);
    }
    _inEntities : any[];
    get inEntities(){
        return this._inEntities;
    }
    set inEntities(val){
        this._inEntities = val;
        this.onPropsChange();
    }
    static get observedAttributes() {
        return super.observedAttributes.concat([forEach, setPath]);
    }

    attributeChangedCallback(name: string, oldValue: string, newValue: string) {
        switch (name) {
            case setPath:
            case forEach:
                this['_' + snakeToCamel(name)] = newValue;
        }
        super.attributeChangedCallback(name, oldValue, newValue);
    }
    connectedCallback(){
        super.connectedCallback();
        this._upgradeProperties(['forEach', 'setPath', 'inEntities']);
    }
    _hasAllThreeProps;
    onPropsChange(){
        const hasAtLeastOneProp = this.setPath || this.forEach || this.inEntities;
        if(hasAtLeastOneProp){
            this._hasAllThreeProps = this._setPath && this._forEach && this.inEntities
            if(!this._hasAllThreeProps){ //need all three
                return;
            }
        }
        super.onPropsChange();
    }

    do() {
        if(!this._hasAllThreeProps){
            super.do();
            return;
        }
        const keys = this._forEach.split(',');
        let remainingCalls = this._inEntities.length;
        this.fetchInProgress = true;
        let counter = 0;
        const base = this._baseLinkId ? self[this._baseLinkId].href : '';
        //this._inEntities.forEach(entity => {
        for(let i = 0, ii = this._inEntities.length; i < ii; i++){
            const entity = this._inEntities[i];
            entity['__xtal_idx'] = counter; counter++;
            let href = this._href;
            keys.forEach(key => {
                href = href.replace(':' + key, entity[key]);
            })
            href = base + href;
            if (this._cacheResults) {
                const val = this.cachedResults[href];
                if (val) {
                    entity[this._setPath] = val;
                    remainingCalls--;
                    if (remainingCalls === 0) this.fetchInProgress = false;
                    return;
                }
            }
            self.fetch(href, this._reqInit).then(resp => {
                if (resp.status !== 200) {
                    resp['text']().then(val => {
                        this.errorText = val;
                    })
                    this.errorResponse = resp;
                } else {
                    resp[this._as]().then(val => {
                        remainingCalls--;
                        if (remainingCalls === 0) {
                            this.fetchInProgress = false;
                            //this.result = Object.assign({}, this.inEntities);
                            this.result = this.inEntities.slice(0);
                            //this.result = [];
                            //this.de('result')
                        }
                        if (this._cacheResults) this.cachedResults[href] = val;
                        entity[this._setPath] = val;
                        const detail = {
                            entity: entity,
                            href: href
                        }
                        this.dispatchEvent(new CustomEvent('fetch-complete', {
                            detail: detail,
                            bubbles: true,
                            composed: false,
                        } as CustomEventInit));
                        

                    });
                }


            })
        }


    }
}
if(!customElements.get(XtalFetchEntities.is)){
    customElements.define(XtalFetchEntities.is, XtalFetchEntities);
}

/**
 * `xtal-fetch`
 *  Feature rich custom element that can make fetch calls, include Post requests.
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */
class XtalFetch extends XtalFetchEntities{
    static get is(){return 'xtal-fetch';}
}

if(!customElements.get(XtalFetch.is)){
    customElements.define(XtalFetch.is, XtalFetch);
}