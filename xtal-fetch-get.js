import { xc } from 'xtal-element/lib/XtalCore.js';
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
const obj1 = {
    type: Object,
    dry: true,
    notify: true
};
const propDefMap = {
    disabled: bool1, fetch: {
        type: Boolean,
        dry: true,
        stopReactionsIfFalsy: true,
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
const linkResult = ({ href, fetch, reqInit, as, self }) => {
    window.fetch(href, reqInit).then(resp => {
        resp[as]().then(result => {
            self.result = result;
        });
    });
};
const propActions = [
    linkResult
];
/**
 * Bare-bones custom element that can make fetch calls.
 * @element xtal-fetch-get
 * @event result-changed
 */
export class XtalFetchGet extends HTMLElement {
    constructor() {
        super(...arguments);
        this.propActions = propActions;
        this.reactor = new xc.Reactor(this);
        this.self = this;
    }
    onPropChange(name, prop, nv) {
        this.reactor.addToQueue(prop, nv);
    }
    connectedCallback() {
        this._initDisp = this.style.display;
        this.style.display = 'none';
        xc.hydrate(this, slicedPropDefs, {
            as: 'json',
        });
    }
}
XtalFetchGet.is = 'xtal-fetch-get';
xc.letThereBeProps(XtalFetchGet, slicedPropDefs.propDefs, 'onPropChange');
xc.define(XtalFetchGet);
