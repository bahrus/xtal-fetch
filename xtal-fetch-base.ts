
export interface IXtalFetchLiteProperties{
    href: string,
    fetch: boolean,
    disabled: boolean,
    result: any,
}
const fetch = 'fetch';
const href = 'href';
const disabled = 'disabled';
export class XtalFetchBase extends HTMLElement implements IXtalFetchLiteProperties{
    _reqInit : RequestInit = {
        credentials: 'include'
    }
    _as = 'json';
    static get is() { return 'xtal-fetch-base'; }
    de(name: string, detail: any) {
        const newEvent = new CustomEvent(name + '-changed', {
            detail: detail,
            bubbles: true,
            composed: false,
        } as CustomEventInit);
        this.dispatchEvent(newEvent);
        return newEvent;
    }
    _fetch
    get fetch(){
        return this._fetch
    }
    set fetch(val){
        if(val){
            this.setAttribute(fetch, '');
        }else{
            this.removeAttribute(fetch);
        }
    }
    _disabled;
    get disabled(){
        return this._disabled;
    }
    set disabled(val){
        if(val){
            this.setAttribute(disabled, '');
        }else{
            this.removeAttribute(disabled);
        }
    }
    _href: string;
    get href(){
        return this._href;
    }
    set href(val){
        this.setAttribute(href, val);
    }
    _result: any;
    get result(){
        return this._result;
    }
    set result(val){
        this._result = val;
        this.de('result', val);
    }
    static get observedAttributes(){
        return [fetch, href, disabled];
    }
    _upgradeProperties(props: string[]) {
        props.forEach(prop =>{
            if (this.hasOwnProperty(prop)) {
                let value = this[prop];
                delete this[prop];
                this[prop] = value;
            }
        })
   
    }
    attributeChangedCallback(name: string, oldVal: string, newVal: string){
        switch(name){
            //booleans
            case fetch:
            case disabled:
                this['_' + name] = newVal !== null;
                break;
            default:
                this['_' + name] = newVal;
        }
        this.onBasePropsChange();
    }
    onBasePropsChange(){
        if(!this.fetch || !this.href || this.disabled) return;
        this.do();
    }
    do(){
        const _this = this;
        self.fetch(this.href, this._reqInit).then(resp =>{
            resp[_this._as]().then(result =>{
                _this.result = result;
            })
        })
    }
    connectedCallback(){
        this._upgradeProperties([fetch, href, disabled]);
    }
}
if(!customElements.get(XtalFetchBase.is)){
    customElements.define(XtalFetchBase.is, XtalFetchBase);
}