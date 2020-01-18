import { XtallatX } from 'xtal-element/xtal-latx.js';
import { define } from 'trans-render/define.js';
import { hydrate } from 'trans-render/hydrate.js';
const fetch$ = 'fetch';
const href = 'href';
const as = 'as';
/**
 *  Barebones custom element that can make fetch calls.
 * @element xtal-fetch-get
 * @event result-changed
 */
export class XtalFetchGet extends XtallatX(hydrate(HTMLElement)) {
    constructor() {
        super(...arguments);
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
    /**
     * How to treat the response
     * @attr
     * @type {"json"|"text"}
     */
    set as(val) {
        this.attr(as, val);
    }
    get href() {
        return this._href;
    }
    /**
     * URL (path) to fetch.
     * @attr
     * @type {string}
     *
     *
     */
    set href(val) {
        this.attr(href, val);
    }
    get result() {
        return this._result;
    }
    /**
     * All events emitted pass through this method
     * @param evt
     */
    emit(type, detail) {
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
        this.emit("result-changed", { value: val });
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
        this.propUp([fetch$, href]);
        this._connected = true;
        this.onPropsChange();
    }
}
define(XtalFetchGet);
