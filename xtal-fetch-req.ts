import { XtalFetchGet} from './xtal-fetch-get.js';
import {define} from 'trans-render/define.js';
import {baseLinkId, BaseLinkId} from 'xtal-element/base-link-id.js'
import {XtalFetchReqPropertiesIfc, XtalFetchReqAddedProperties, XtalFetchReqEventNameMap} from './types.d.js';

export function snakeToCamel(s: string) {
    return s.replace(/(\-\w)/g, function (m) { return m[1].toUpperCase(); });
}
const debounceDuration = 'debounce-duration';
const reqInitRequired = 'req-init-required';
const cacheResults = 'cache-results';
const insertResults = 'insert-results';
const req_init = 'req-init';

type prop = keyof XtalFetchReqAddedProperties;

/**
 * Feature rich custom element that can make fetch calls, including post requests.
 * @element xtal-fetch-req
 * @event error-response-changed
 * @event error-text-changed
 * @event fetch-in-progress-changed
 * @event fetch-complete
 */
export class XtalFetchReq extends BaseLinkId(XtalFetchGet) implements XtalFetchReqPropertiesIfc {
    constructor(){
        super();
        this._reqInit = undefined;
    }

   /**
   * All events emitted pass through this method
   * @param evt 
   */
    emit<K extends keyof XtalFetchReqEventNameMap>(type: K,  detail: XtalFetchReqEventNameMap[K]){
        this.de(type, detail, true);
    }
    get reqInit() {
        return this._reqInit;
    }
    /**
     * Object to use for second parameter of fetch method.  Can parse the value from the attribute if the attribute is in JSON format.
     * Supports JSON formatted attribute
     * @type {object}
     * @attr req-init
     */
    set reqInit(val) {
        this._reqInit = val;
        //this.__loadNewUrlDebouncer();
        this.onPropsChange();
    }
    onPropsChange(){
        if(this.reqInitRequired && !this.reqInit) return;
        if(!this.__loadNewUrlDebouncer){
            this.debounceDurationHandler();
        }
        this.__loadNewUrlDebouncer();
    }

    static get is() { return 'xtal-fetch-req'; }

    _cacheResults = false;
    get cacheResults() {
        return this._cacheResults;
    }
    /**
     * Indicates whether to pull the response from a previous identical fetch request from cache.
     * @attr cache-results
     */
    set cacheResults(val) {
        this.attr(cacheResults, val, '');
    }

    private _cachedResults: { [key: string]: any } = {};
    get cachedResults() {
        return this._cachedResults;
    }

    _reqInitRequired!: boolean;
    get reqInitRequired() {
        return this.hasAttribute(reqInitRequired);
    }
    /**
     * Indicates that no fetch request should proceed until reqInit property / attribute is set.
     */
    set reqInitRequired(val) {
        this.attr(reqInitRequired, val, '');
    }

    _debounceDuration! : number;

    get debounceDuration() {
        return this._debounceDuration;
    }
    /**
     * How long to pause between requests
     * @attr debounce-duration
     * @type {Number}
     * 
     */
    set debounceDuration(val) {
        this.setAttribute(debounceDuration, val.toString());
    }

    _errorResponse!: Response | null;

    get errorResponse() {
        return this._errorResponse;
    }
    /**
     * Error response as an object
     * ⚡ Fires event error-response-changed
     * @type {Object}
     * 
     */
    set errorResponse(val) {
        //if(this._errorResponse === val) return;
        if(!this._errorResponse && !val) return;
        this._errorResponse = val;
        if(val !== null){
            this.emit('error-response-changed', {
                value:val
            });
        }
    }

    _errorText! : string;

    get errorText() {
        return this._errorText;
    }
    /**
     * Indicates the error text of the last request.
     * ⚡ Fires event error-text-changed.
     * @type {String}
     */
    set errorText(val) {
        if(!val && !this._errorText) return;
        this._errorText = val;
        this.attr('errorText', val);
        this.emit('error-text-changed', {
            value: val
        });

    }

    _fetchInProgress = false;

    get fetchInProgress() {
        return this._fetchInProgress;
    }
    /**
     * Indicates Fetch is in progress
     * ⚡ Fires event fetch-in-progress-changed
     * @type {Boolean}
     */
    set fetchInProgress(val) {
        this._fetchInProgress = val;
        this.emit('fetch-in-progress-changed', {
            value: val
        });
    }

    _insertResults: boolean = false;
    get insertResults() {
        return this._insertResults;
    }
    /**
     * Indicate whether to set the innerHTML of the web component with the response from the server.  
     * Make sure the service is protected against XSS.
     * @attr insert-results
     */
    set insertResults(val) {
        this.attr(insertResults, val, '');
    }

    _controller! : AbortController | null;

    set abort(val: boolean){
        if(this._controller)this._controller.abort();
    }

    static get observedAttributes() {
        return super.observedAttributes.concat([debounceDuration, reqInitRequired, cacheResults, insertResults, baseLinkId, req_init]);
    }

    attributeChangedCallback(name: string, oldValue: string, newValue: string) {
        switch (name) {
            case debounceDuration:
                this._debounceDuration = parseFloat(newValue);
                this.debounceDurationHandler();
                break;
            //boolean
            case reqInitRequired:
            case cacheResults:
            case insertResults:
                (<any>this)['_' + snakeToCamel(name)] =  newValue !== null;
                break;
            case baseLinkId:
                this._baseLinkId = newValue;
                break;
            case req_init:
                this._reqInit = JSON.parse(newValue);
                break;
        }
        super.attributeChangedCallback(name, oldValue, newValue);
    }


    debounce(func: any, wait: number, immediate?: boolean) {
        let timeout: any;
        return function ()  {
            const context = this, args = arguments;
            clearTimeout(timeout);
            timeout = setTimeout(function () {
                timeout = null;
                if (!immediate) func.apply(context, args);
            }, wait);
            if (immediate && !timeout) func.apply(context, args);
        };
    }

    __loadNewUrlDebouncer!: any;
    debounceDurationHandler() {
        this.__loadNewUrlDebouncer = this.debounce(() => {
            this.loadNewUrl();
        }, this._debounceDuration);
    }

    //overrides
    do() {
        this.errorResponse = null;
        if (this._cacheResults) {
            const val = this.cachedResults[this._href];
            if (val) {
                this.result = val;
                return;
            }else if(this._fetchInProgress){
                setTimeout(() =>{
                    this.do();
                }, 100);
                return;
            }
        }
        if(this.fetchInProgress){
            this.abort = true;
        }
        this.fetchInProgress = true;
        let href = this.href;
        href = this.getFullURL(href);
        if(typeof(AbortController) !== 'undefined'){
            this._controller = new AbortController();
            const sig = this._controller.signal;
            if(this._reqInit){
                this._reqInit.signal = sig;
            }else{
                this._reqInit = {
                    signal: sig,
                }
            }
        }
        //this.abort = true;     
        self.fetch(href, this._reqInit).then(resp => {
            this.fetchInProgress = false;
            resp[this._as]().then(result => {
                if (resp.status !== 200) {
                    this.errorResponse = resp;
                    const respText = resp['text'];
                    if(respText) respText().then(val => {
                        this.errorText = val;
                    })
                } else {
                    this.result = result;
                    if (this.cachedResults) {
                        this.cachedResults[this._href] = result;
                    }
                    if (typeof result === 'string' && this._insertResults) {
                        this.style.display = this._initDisp;
                        this.innerHTML = result;
                    }
                    const detail = {
                        href: this.href,
                        result: result
                    }
                    this.emit('fetch-complete', detail)
                }
            });
        }).catch(err => {
            if (err.name === 'AbortError') {
                console.log('Fetch aborted');
                this.fetchInProgress = false;
            }
        });
    }

    connectedCallback(){
        this.propUp<prop[]>(['baseLinkId', 'cacheResults', 'debounceDuration', 'insertResults', 'reqInitRequired', 'reqInit']);
        super.connectedCallback();
        
    }
}
define(XtalFetchReq);