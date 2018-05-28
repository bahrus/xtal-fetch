
export interface IXtalFetchBaseProperties{
    href: string,
    fetch: boolean,
    disabled: boolean,
    result: any,
}

const fetch = 'fetch';
const href = 'href';
const disabled = 'disabled';
const pass_down = 'pass-down';
export class XtalFetchGet extends HTMLElement implements IXtalFetchBaseProperties{
    _reqInit : RequestInit = {
        credentials: 'same-origin'
    }
    _as = 'json';
    static get is() { return 'xtal-fetch-get'; }
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
        return this.hasAttribute(disabled);
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
        console.log({
            result: val,
            passDown: this._passDown,
        })
        if(this._passDown){
            this.nextElementSibling[this._passDown] = val;
            return;
        }
        this.de('result', {
            value: val
        });
    }
    _passDown:string;
    get passDown(){
        return this._passDown;
    }
    set passDown(val){
        this.setAttribute(pass_down, val);
    }
    static get observedAttributes(){
        return [
            /**
             * @type boolean
             * Indicates whether fetch request should be made.
             */
            fetch, 
            href, 
            disabled,
            pass_down
        ];
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
            case pass_down:
                this._passDown = newVal;
                console.log('pass_down attr');
                break;
            default:
                this['_' + name] = newVal;
        }
        this.onPropsChange();
    }
    onPropsChange(){
        this.loadNewUrl();
    }
    loadNewUrl(){
        if(!this.fetch || !this.href || this.disabled) return;
        this.do();
    }
    do(){
        self.fetch(this.href, this._reqInit).then(resp =>{
            resp[this._as]().then(result =>{
                this.result = result;
            })
        });
    }

    connectedCallback(){
        this._upgradeProperties([fetch, href, disabled]);
    }
}
if(!customElements.get(XtalFetchGet.is)){
    customElements.define(XtalFetchGet.is, XtalFetchGet);
}