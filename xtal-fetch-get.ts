import { XtalFetchBasePropertiesIfc, XtalFetchGetEventNameMap} from './types.js';
import {define} from 'xtal-element/lib/define.js';
import {ReactiveSurface, destructPropInfo, PropDef, PropAction} from 'xtal-element/types.d.js';
import {letThereBeProps} from 'xtal-element/lib/letThereBeProps.js';
import {getPropDefs} from 'xtal-element/lib/getPropDefs.js';
import {getSlicedPropDefs} from 'xtal-element/lib/getSlicedPropDefs.js';
import {hydrate} from 'xtal-element/lib/hydrate.js';
import {Reactor} from 'xtal-element/lib/Reactor.js';

const propDefGetter = [
    ({disabled, fetch}: XtalFetchGet) => ({
        type: Boolean,
        dry: true,
        stopReactionsIfFalsy: true,
        reflect: true,
    }),
    ({as, href}: XtalFetchGet) => ({
        type: String,
        dry: true,
        stopReactionsIfFalsy: true,
        reflect: true
    }),
    ({value, result, reqInit}: XtalFetchGet) => ({
        type: Object,
        dry: true,
        notify: true
    }),
    ({reqInit}: XtalFetchGet) => ({
        type: Object,
        dry: true,
    })
] as destructPropInfo[];
const propDefs = getPropDefs(propDefGetter);
const slicedPropDefs = getSlicedPropDefs(propDefs);
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
    reactor = new Reactor(this);
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
        hydrate<XtalFetchBasePropertiesIfc>(this, propDefs, {
            as: 'json',
        });
    }
}
letThereBeProps(XtalFetchGet, slicedPropDefs.propDefs, 'onPropChange');
define(XtalFetchGet);
declare global {
    interface HTMLElementTagNameMap {
        "xtal-fetch-get": XtalFetchGet,
    }
}