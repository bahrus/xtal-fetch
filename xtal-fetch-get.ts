import { XtalFetchBasePropertiesIfc, XtalFetchGetEventNameMap} from './types.js';
import {xc, ReactiveSurface, PropDef, PropDefMap, PropAction} from 'xtal-element/lib/XtalCore.js';

const bool1: PropDef = {
    type: Boolean,
    dry: true,
};
const str1: PropDef = {
    type: String,
    dry: true,
    reflect: true
};
const obj1: PropDef = {
    type: Object,
    dry: true,
    notify: true
};
const propDefMap: PropDefMap<XtalFetchGet> = {
    disabled: bool1, fetch: bool1,
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
    }
};

const slicedPropDefs = xc.getSlicedPropDefs(propDefMap);
const linkResult = ({href, disabled, fetch, reqInit, as, self}: XtalFetchGet) => {
    if (!fetch || href === undefined || disabled) return;
    window.fetch(href, reqInit).then(resp => {
        resp[as]().then(result => {
            self.result = result;
        });
    });
}
const propActions = [
    linkResult
] as PropAction[];
/**
 * Bare-bones custom element that can make fetch calls.
 * @element xtal-fetch-get
 * @event result-changed
 */
export class XtalFetchGet extends HTMLElement implements XtalFetchBasePropertiesIfc, ReactiveSurface {
    
    static is = 'xtal-fetch-get';
    propActions = propActions;
    reactor = new xc.Reactor(this);
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
        xc.hydrate<XtalFetchBasePropertiesIfc>(this, slicedPropDefs, {
            as: 'json',
        });
    }
}
xc.letThereBeProps(XtalFetchGet, slicedPropDefs.propDefs, 'onPropChange');
xc.define(XtalFetchGet);
declare global {
    interface HTMLElementTagNameMap {
        "xtal-fetch-get": XtalFetchGet,
    }
}