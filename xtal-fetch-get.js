import { define } from 'xtal-element/lib/define.js';
import { letThereBeProps } from 'xtal-element/lib/letThereBeProps.js';
import { getPropDefs } from 'xtal-element/lib/getPropDefs.js';
import { getSlicedPropDefs } from 'xtal-element/lib/getSlicedPropDefs.js';
import { hydrate } from 'xtal-element/lib/hydrate.js';
import { Reactor } from 'xtal-element/lib/Reactor.js';
const propDefGetter = [
    ({ disabled, fetch }) => ({
        type: Boolean,
        dry: true,
        stopReactionsIfFalsy: true,
        reflect: true,
    }),
    ({ as, href }) => ({
        type: String,
        dry: true,
        stopReactionsIfFalsy: true,
        reflect: true
    }),
    ({ value, reqInit }) => ({
        type: Object,
        dry: true,
        notify: true
    }),
    ({ result }) => ({
        type: Object,
        dry: true,
        notify: true,
        echoTo: 'value',
    }),
    ({ reqInit }) => ({
        type: Object,
        dry: true,
    })
];
const propDefs = getPropDefs(propDefGetter);
const slicedPropDefs = getSlicedPropDefs(propDefs);
const linkResult = ({ href, disabled, fetch, reqInit, as, self }) => {
    if (!fetch || href === undefined || disabled)
        return;
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
        this.reactor = new Reactor(this);
        this.self = this;
    }
    onPropChange(name, prop, nv) {
        this.reactor.addToQueue(prop, nv);
    }
    connectedCallback() {
        this._initDisp = this.style.display;
        this.style.display = 'none';
        hydrate(this, propDefs, {
            as: 'json',
        });
    }
}
XtalFetchGet.is = 'xtal-fetch-get';
letThereBeProps(XtalFetchGet, slicedPropDefs.propDefs, 'onPropChange');
define(XtalFetchGet);
