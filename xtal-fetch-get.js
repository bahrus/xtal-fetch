import { xc } from 'xtal-element/lib/XtalCore.js';
/**
 * Bare-bones custom element that can make fetch calls.
 * @element xtal-fetch-get
 * @event result-changed
 */
export class XtalFetchGet extends HTMLElement {
    constructor() {
        super(...arguments);
        this.propActions = propActions;
        this.reactor = new xc.Rx(this);
        this.self = this;
    }
    attributeChangedCallback(n, ov, nv) {
        this.disabled = nv !== null;
    }
    onPropChange(name, prop, nv) {
        this.reactor.addToQueue(prop, nv);
    }
    connectedCallback() {
        this._initDisp = this.style.display;
        this.style.display = 'none';
        xc.mergeProps(this, slicedPropDefs, {
            as: 'json',
        });
    }
}
XtalFetchGet.is = 'xtal-fetch-get';
XtalFetchGet.observedAttributes = ['disabled'];
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
