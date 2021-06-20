import { XtalFetchBasePropertiesIfc, XtalFetchGetEventNameMap} from './types.js';
import {xc, ReactiveSurface, PropDef, PropDefMap, PropAction, IReactor} from 'xtal-element/lib/XtalCore.js';

/**
 * Bare-bones custom element that can make fetch calls.
 * @element xtal-fetch-get
 * @event result-changed
 */
 export class XtalFetchGet extends HTMLElement implements XtalFetchBasePropertiesIfc, ReactiveSurface {
    
    static is = 'xtal-fetch-get';
    static observedAttributes = ['disabled'];
    attributeChangedCallback(n: string, ov: string, nv: string){
        this.disabled = nv !== null;
    }
    propActions = propActions;
    reactor: IReactor = new xc.Rx(this);
    self = this;
    onPropChange(name: string, prop: PropDef, nv: any){
        this.reactor.addToQueue(prop, nv);
    }
    disabled: boolean | undefined;

    /**
     * Must be true for fetch to proceed
     * @attr
     */
    fetch!: boolean;


    /**
     *  How to treat the response
     * @attr
     * @type {"json"|"text"}
     */
    as : 'json' | 'text' | undefined; 

    /**
     * URL (path) to fetch.
     * @attr
     * @type {string}
     * 
     * 
     */
    href: string | undefined;

    reqInit: RequestInit | undefined;
    
    value: any | undefined;

    /**
     * ⚡ Fires event result-changed
     * Result of fetch request
     * @type {Object}
     * 
     * 
     */
    result: any | undefined;

    _initDisp!: string | null;
    connectedCallback() {
        this._initDisp = this.style.display;
        this.style.display = 'none';
        xc.mergeProps<XtalFetchBasePropertiesIfc>(this, slicedPropDefs, {
            as: 'json',
        });
    }
}

export const bool1: PropDef = {
    type: Boolean,
    dry: true,
};
const str1: PropDef = {
    type: String,
    dry: true,
    reflect: true,
    stopReactionsIfFalsy: true,
};
export const obj1: PropDef = {
    type: Object,
    dry: true,
    notify: true
};
const propDefMap: PropDefMap<XtalFetchGet> = {
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
const linkResult = ({href, fetch, reqInit, as, disabled, self}: XtalFetchGet) => {
    window.fetch(href, reqInit).then(resp => {
        resp[as]().then(result => {
            self.result = result;
        });
    });
}
const propActions = [
    linkResult
] as PropAction[];

xc.letThereBeProps(XtalFetchGet, slicedPropDefs, 'onPropChange');
xc.define(XtalFetchGet);
declare global {
    interface HTMLElementTagNameMap {
        "xtal-fetch-get": XtalFetchGet,
    }
}