import { XtallatX, define, de } from 'xtal-element/xtal-latx.js';
import { hydrate } from 'trans-render/hydrate.js';
/**
 *  Barebones custom element that can make fetch calls.
 * @element xtal-fetch-get
 * @event result-changed
 */
let XtalFetchGet = /** @class */ (() => {
    class XtalFetchGet extends XtallatX(hydrate(HTMLElement)) {
        constructor() {
            super(...arguments);
            /**
             *  How to treat the response
             * @attr
             * @type {"json"|"text"}
             */
            this.as = 'json';
        }
        get result() {
            return this._result;
        }
        /**
         * All events emitted pass through this method
         * @param evt
         */
        emit(type, detail) {
            this[de](type, detail, true);
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
        onPropsChange(name) {
            super.onPropsChange(name);
            this.loadNewUrl();
        }
        loadNewUrl() {
            if (!this.fetch || !this.href || this.disabled || !this._xlConnected)
                return;
            this.do();
        }
        do() {
            self.fetch(this.href, this._reqInit).then(resp => {
                resp[this.as]().then(result => {
                    this.result = result;
                });
            });
        }
        connectedCallback() {
            this._initDisp = this.style.display;
            this.style.display = 'none';
            super.connectedCallback();
        }
    }
    XtalFetchGet.is = 'xtal-fetch-get';
    XtalFetchGet.attributeProps = ({ disabled, fetch, as, href }) => ({
        bool: [disabled, fetch],
        str: [as, href],
    });
    return XtalFetchGet;
})();
export { XtalFetchGet };
define(XtalFetchGet);
