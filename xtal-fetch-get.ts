import {XtallatX} from 'xtal-latx/xtal-latx.js';
export interface IXtalFetchBaseProperties {
    href: string,
    fetch: boolean,
    disabled: boolean,
    result: any,
}

export interface ICssKeyMapper {
    cssSelector: string;
    //propMapper: {[key: string]: string[]}
    propTarget: string;
}

const fetch = 'fetch';
const href = 'href';
// const disabled = 'disabled';
// const pass_down = 'pass-down';
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
    // _disabled;
    // get disabled() {
    //     return this.hasAttribute(disabled);
    // }
    // set disabled(val) {
    //     if (val) {
    //         this.setAttribute(disabled, '');
    //     } else {
    //         this.removeAttribute(disabled);
    //     }
    // }
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
        this._result = val;
        if(this._cssPropMap){
            this.passDownProp(val);
        }
        // if (this.cssKeyMappers) {
        //     this.passDownProp(val);
        //     return;
        // }
        this.de('result', {
            value: val
        });
    }
    // _passDown: string;
    // get passDown() {
    //     return this._passDown;
    // }
    // set passDown(val) {
    //     this.setAttribute(pass_down, val);
    // }
    static get observedAttributes() {
        return super.observedAttributes.concat( [
            /**
             * @type boolean
             * Indicates whether fetch request should be made.
             */
            fetch,
            href,
            // disabled,
            // pass_down
        ]);
    }
    // _upgradeProperties(props: string[]) {
    //     props.forEach(prop => {
    //         if (this.hasOwnProperty(prop)) {
    //             let value = this[prop];
    //             delete this[prop];
    //             this[prop] = value;
    //         }
    //     })

    // }
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
        super.conectedCallback();
    }
}
if (!customElements.get(XtalFetchGet.is)) {
    customElements.define(XtalFetchGet.is, XtalFetchGet);
}