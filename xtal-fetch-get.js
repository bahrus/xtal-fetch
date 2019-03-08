import { XtallatX } from 'xtal-element/xtal-latx.js';
import { define } from 'xtal-element/define.js';
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
export class XtalFetchGet extends XtallatX(HTMLElement) {
    constructor() {
        super(...arguments);
        this._reqInit = {
            credentials: 'same-origin'
        };
        this._as = 'json';
    }
    static get is() { return 'xtal-fetch-get'; }
    get fetch() {
        return this._fetch;
    }
    set fetch(val) {
        this.attr(fetch$, !!val, '');
    }
    get as() {
        return this._as;
    }
    set as(val) {
        this.attr(as, val);
    }
    get href() {
        return this._href;
    }
    set href(val) {
        this.attr(href, val);
    }
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
        this.de('result', { value: val });
    }
    static get observedAttributes() {
        return super.observedAttributes.concat([
            /**
             * @type boolean
             * Indicates whether fetch request should be made.
             */
            fetch$,
            href,
            as
        ]);
    }
    attributeChangedCallback(name, oldVal, newVal) {
        switch (name) {
            case fetch$:
                const ov = this['_' + name];
                this._fetch = newVal !== null;
                if (ov === this._fetch)
                    return;
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
        if (!this.fetch || !this.href || this.disabled || !this._connected)
            return;
        this.do();
    }
    do() {
        self.fetch(this.href, this._reqInit).then(resp => {
            resp[this._as]().then(result => {
                this.result = result;
            });
        });
    }
    connectedCallback() {
        this._initDisp = this.style.display;
        this.style.display = 'none';
        this._upgradeProperties([fetch$, href]);
        this._connected = true;
        this.onPropsChange();
    }
}
define(XtalFetchGet);
