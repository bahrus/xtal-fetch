import { xc } from 'xtal-element/lib/XtalCore.js';
/**
 * Bare-bones custom element that can make fetch calls.
 * @element xtal-fetch-get
 * @event result-changed
 */
export class XtalFetchGet extends HTMLElement {
    static is = 'xtal-fetch-get';
    static observedAttributes = ['disabled'];
    attributeChangedCallback(n, ov, nv) {
        this.disabled = nv !== null;
    }
    propActions = propActions;
    reactor = new xc.Rx(this);
    self = this;
    onPropChange(name, prop, nv) {
        this.reactor.addToQueue(prop, nv);
    }
    disabled;
    /**
     * Must be true for fetch to proceed
     * @attr
     */
    fetch;
    /**
     *  How to treat the response
     * @attr
     * @type {"json"|"text"}
     */
    as;
    /**
     * URL (path) to fetch.
     * @attr
     * @type {string}
     *
     *
     */
    href;
    reqInit;
    value;
    /**
     * ⚡ Fires event result-changed
     * Result of fetch request
     * @type {Object}
     *
     *
     */
    result;
    _initDisp;
    connectedCallback() {
        this._initDisp = this.style.display;
        this.style.display = 'none';
        xc.mergeProps(this, slicedPropDefs, {
            as: 'json',
        });
    }
}
export const bool1 = {
    type: Boolean,
    dry: true,
};
const str1 = {
    type: String,
    dry: true,
    reflect: true,
    stopReactionsIfFalsy: true,
};
export const obj1 = {
    type: Object,
    dry: true,
    notify: true
};
const propDefMap = {
    disabled: {
        ...bool1,
        stopReactionsIfTruthy: true,
    },
    fetch: {
        type: Boolean,
        dry: true,
    },
    as: str1, href: str1,
    value: obj1,
    result: {
        type: Object,
        dry: true,
        notify: true,
        echoTo: 'value',
    },
    reqInit: {
        type: Object,
        dry: true,
        parse: true,
    }
};
const slicedPropDefs = xc.getSlicedPropDefs(propDefMap);
const linkResult = ({ href, fetch, reqInit, as, disabled, self }) => {
    window.fetch(href, reqInit).then(resp => {
        resp[as]().then(result => {
            self.result = result;
        });
    });
};
const propActions = [
    linkResult
];
xc.letThereBeProps(XtalFetchGet, slicedPropDefs, 'onPropChange');
xc.define(XtalFetchGet);
