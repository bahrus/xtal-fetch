import {XtallatX, define} from 'xtal-element/xtal-latx.js';
import {AttributeProps} from 'xtal-element/types.d.js';
import { hydrate} from 'trans-render/hydrate.js';
import {XtalFetchBasePropertiesIfc, XtalFetchGetEventNameMap} from './types.js';

type prop = keyof XtalFetchBasePropertiesIfc;
/**
 *  Barebones custom element that can make fetch calls.
 * @element xtal-fetch-get
 * @event result-changed
 */
export class XtalFetchGet extends XtallatX(hydrate(HTMLElement)) implements XtalFetchBasePropertiesIfc {
    _reqInit: RequestInit | undefined;
   
    static is = 'xtal-fetch-get';
    static attributeProps = ({disabled, fetch, as, href} : XtalFetchGet) => ({
        bool: [disabled, fetch],
        str: [as, href],
    }  as AttributeProps);
    /**
     * Must be true for fetch to proceed
     * @attr
     * @type {"json" | "text"}
     */
    fetch!: boolean;


    /**
     *  How to treat the response
     * @attr
     * @type {"json"|"text"}
     */
    as : 'json' | 'text' = 'json';


    /**
     * URL (path) to fetch.
     * @attr
     * @type {string}
     * 
     * 
     */
    href!: string;

    
    value!: any;
    _result: any;

    get result() {
        return this._result;
    }

  /**
   * All events emitted pass through this method
   * @param evt 
   */
  emit<K extends keyof XtalFetchGetEventNameMap>(type: K,  detail: XtalFetchGetEventNameMap[K]){
    this.de(type, detail, true);
  }

    /**
     * ⚡ Fires event result-changed
     * Result of fetch request
     * @type {Object}
     * 
     * 
     */
    set result(val) {
        //this.updateResultProp(val, 'result', '_result', null);
        this._result = val;
        this.value = val;
        this.emit("result-changed", {value:val})
    }


    onPropsChange(name: string) {
        super.onPropsChange(name)
        this.loadNewUrl();
    }

    loadNewUrl() {
        if (!this.fetch || !this.href || this.disabled || !this._xlConnected) return;
        this.do();
    }
    do() {
        self.fetch(this.href, this._reqInit).then(resp => {
            resp[this.as]().then(result => {
                this.result = result;
            })
        });
    }
    _initDisp!: string | null;
    connectedCallback() {
        this._initDisp = this.style.display;
        this.style.display = 'none';
        super.connectedCallback();
    }
}
define(XtalFetchGet);
declare global {
    interface HTMLElementTagNameMap {
        "xtal-fetch-get": XtalFetchGet,
    }
}