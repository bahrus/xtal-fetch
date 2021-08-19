import { xc } from 'xtal-element/lib/XtalCore.js';
//#region  Props
export const bool1 = {
    type: Boolean,
    dry: true,
};
export const str1 = {
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
//#endregion
/**
 * Bare-bones custom element that can make fetch calls.
 * @element xtal-fetch-get
 * @event result-changed
 */
export class XtalFetchGet extends HTMLElement {
    static is = 'xtal-fetch-get';
    static observedAttributes = [...slicedPropDefs.boolNames, ...slicedPropDefs.strNames];
    static cache = {};
    attributeChangedCallback(n, ov, nv) {
        xc.passAttrToProp(this, slicedPropDefs, n, ov, nv);
    }
    propActions = propActions;
    reactor = new xc.Rx(this);
    self = this;
    onPropChange(name, prop, nv) {
        this.reactor.addToQueue(prop, nv);
    }
    _initDisp;
    connectedCallback() {
        this._initDisp = this.style.display;
        this.style.display = 'none';
        xc.mergeProps(this, slicedPropDefs, {
            as: 'json',
        });
    }
}
export const linkResult = ({ href, fetch, reqInit, as, disabled, self }) => {
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
//declare global {
//     interface HTMLElementTagNameMap {
//         "xtal-fetch-get": XtalFetchGet,
//     }
// }
