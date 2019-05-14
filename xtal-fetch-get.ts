import {XtallatX} from 'xtal-element/xtal-latx.js';
import {define} from 'trans-render/define.js';
import {disabled, hydrate} from 'trans-render/hydrate.js';

export interface IXtalFetchBaseProperties {
    href: string,
    fetch: boolean,
    disabled: boolean,
    result: any,
}


const fetch$ = 'fetch';
const href = 'href';
const as = 'as';
/**
 * `xtal-fetch-get`
 *  Barebones custom element that can make fetch calls.
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */
export class XtalFetchGet extends XtallatX(hydrate(HTMLElement)) implements IXtalFetchBaseProperties {
    _reqInit: RequestInit | undefined = {
        credentials: 'same-origin'
    }
   
    static get is() { return 'xtal-fetch-get'; }
    _fetch!: boolean;
    get fetch() {
        return this._fetch
    }
    set fetch(val) {
        this.attr(fetch$, !!val, '');
    }

    _as : 'json' | 'text' = 'json';
    get as(){
        return this._as;
    }
    set as(val){
        this.attr(as, val);
    }

    _href!: string;
    get href() {
        return this._href;
    }
    set href(val) {
        this.attr(href, val);
    }
    value!: any;
    _result: any;
    /**
     * @type{Object}
     * Result of fetch request
     * ⚡ Fires event result-changed
     */
    get result() {
        return this._result;
    }
    set result(val) {
        //this.updateResultProp(val, 'result', '_result', null);
        this._result = val;
        this.value = val;
        this.de('result', {value:val});
    }

    static get observedAttributes() {
        return super.observedAttributes.concat( [
            /**
             * @type boolean
             * Indicates whether fetch request should be made.
             */
            fetch$,
            href,
            as
        ]);
    }

    attributeChangedCallback(name: string, oldVal: string, newVal: string) {
        switch (name) {
            case fetch$:
                const ov = (<any>this)['_' + name];
                this._fetch = newVal !== null;
                if(ov === this._fetch) return;
                break;

            default:
                (<any>this)['_' + name] = newVal;
        }
        super.attributeChangedCallback(name, oldVal, newVal);
        this.onPropsChange();
    }
    onPropsChange() {
        this.loadNewUrl();
    }

    loadNewUrl() {
        if (!this.fetch || !this.href || this.disabled || !this._connected) return;
        this.do();
    }
    do() {
        self.fetch(this.href, this._reqInit).then(resp => {
            resp[this._as]().then(result => {
                this.result = result;
            })
        });
    }
    _connected!: boolean;
    _initDisp!: string | null;
    connectedCallback() {
        this._initDisp = this.style.display;
        this.style.display = 'none';
        this.propUp([fetch$, href]);
        this._connected = true;
        this.onPropsChange();
    }
}
define(XtalFetchGet);