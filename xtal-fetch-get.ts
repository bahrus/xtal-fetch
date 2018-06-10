import {XtallatX} from 'xtal-latx/xtal-latx.js';
export interface IXtalFetchBaseProperties {
    href: string,
    fetch: boolean,
    disabled: boolean,
    result: any,
}


const fetch = 'fetch';
const href = 'href';
/**
 * `xtal-fetch-get`
 *  Barebones custom element that can make fetch calls.
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */
export class XtalFetchGet extends XtallatX(HTMLElement) implements IXtalFetchBaseProperties {
    _reqInit: RequestInit = {
        credentials: 'same-origin'
    }
    _as = 'json';
    static get is() { return 'xtal-fetch-get'; }
    _fetch: boolean;
    get fetch() {
        return this._fetch
    }
    set fetch(val) {
        if (val) {
            this.setAttribute(fetch, '');
        } else {
            this.removeAttribute(fetch);
        }
    }

    _href: string;
    get href() {
        return this._href;
    }
    set href(val) {
        this.setAttribute(href, val);
    }
    _result: any;
    get result() {
        return this._result;
    }
    set result(val) {
        //this.updateResultProp(val, 'result', '_result', null);
        this._result = val;
        this.de('result', {value:val});
    }

    static get observedAttributes() {
        return super.observedAttributes.concat( [
            /**
             * @type boolean
             * Indicates whether fetch request should be made.
             */
            fetch,
            href,
        ]);
    }

    attributeChangedCallback(name: string, oldVal: string, newVal: string) {
        switch (name) {
            //booleans
            case fetch:
                this['_' + name] = newVal !== null;
                break;

            default:
                this['_' + name] = newVal;
        }
        super.attributeChangedCallback(name, oldVal, newVal);
        this.onPropsChange();
    }
    onPropsChange() {
        this.loadNewUrl();
    }

    loadNewUrl() {
        if (!this.fetch || !this.href || this.disabled) return;
        this.do();
    }
    do() {
        self.fetch(this.href, this._reqInit).then(resp => {
            resp[this._as]().then(result => {
                this.result = result;
            })
        });
    }

    connectedCallback() {
        this._upgradeProperties([fetch, href]);
    }
}
if (!customElements.get(XtalFetchGet.is)) {
    customElements.define(XtalFetchGet.is, XtalFetchGet);
}