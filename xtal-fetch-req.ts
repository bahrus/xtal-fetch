import { XtalFetchGet} from './xtal-fetch-get.js';
import { define, mergeProps, de} from 'xtal-element/xtal-latx.js';
import { IBaseLinkContainer, getFullURL} from 'xtal-element/base-link-id.js';
import { XtalFetchReqPropertiesIfc, XtalFetchReqAddedProperties, XtalFetchReqEventNameMap} from './types.d.js';
import { setSymbol} from 'trans-render/manageSymbols.js';
import { AttributeProps} from 'xtal-element/types.d.js';

export const cacheSymbol = setSymbol(XtalFetchGet.is, 'cache');
type prop = keyof XtalFetchReqAddedProperties;

/**
 * Feature rich custom element that can make fetch calls, including post requests.
 * @element xtal-fetch-req
 * @event error-response-changed
 * @event error-text-changed
 * @event fetch-in-progress-changed
 * @event fetch-complete
 */
export class XtalFetchReq extends XtalFetchGet implements XtalFetchReqPropertiesIfc, IBaseLinkContainer {

    static is = 'xtal-fetch-req';
    static attributeProps = ({reqInit, cacheResults, reqInitRequired, debounceDuration, insertResults} : XtalFetchReq) => {
        const ap = {
            bool: [reqInitRequired, insertResults],
            str: [cacheResults],
            num: [debounceDuration],
            obj: [reqInit],
            jsonProp: [reqInit]
        }  as AttributeProps;
        return mergeProps(ap, (<any>XtalFetchGet).props);
    };


   /**
   * All events emitted pass through this method
   * @param evt 
   */
    emit<K extends keyof XtalFetchReqEventNameMap>(type: K,  detail: XtalFetchReqEventNameMap[K]){
        this[de](type, detail, true);
    }

    /**
     * Object to use for second parameter of fetch method.  Can parse the value from the attribute if the attribute is in JSON format.
     * Supports JSON formatted attribute
     * @type {object}
     * @attr req-init
     */
    reqInit: RequestInit;

    onPropsChange(){
        if(this.reqInitRequired && !this.reqInit) return;
        if(!this.__loadNewUrlDebouncer){
            this.debounceDurationHandler();
        }
        this.__loadNewUrlDebouncer();
    }

    

    /**
     * Indicates whether to pull the response from a previous identical fetch request from cache.
     * If set to true, cache is stored locally within the instance of the web component.
     * If set to 'global', cache is retained after web component goes out of scope.
     * @attr cache-results
     */
    cacheResults: '' | 'global' | undefined;


    private _cachedResults: { [key: string]: any } = {};
    get cachedResults() {
        return this._cachedResults;
    }


    /**
     * Indicates that no fetch request should proceed until reqInit property / attribute is set.
     */
    reqInitRequired: boolean;

    /**
     * How long to pause between requests
     * @attr debounce-duration
     * @type {Number}
     * 
     */
    debounceDuration: number = 16;

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

    /**
     * Indicate whether to set the innerHTML of the web component with the response from the server.  
     * Make sure the service is protected against XSS.
     * @attr insert-results
     */
    insertResults: boolean;

    /**
     * DOM ID  of link (preload) tag, typical in head element.  
     * Used to prov
     */
    baseLinkId: string | undefined;

    _controller! : AbortController | null;

    set abort(val: boolean){
        if(this._controller)this._controller.abort();
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
        }, this.debounceDuration);
    }

    //overrides
    do() {
        this.errorResponse = null;
        if (this.cacheResults !== undefined) {
            let val = undefined;
            if(this.cacheResults === 'global'){
                if(XtalFetchGet[cacheSymbol] === undefined) XtalFetchGet[cacheSymbol] = {};
                val = XtalFetchGet[cacheSymbol][this.href];
            }else{
                val = this.cachedResults[this.href];
            }
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
        href = getFullURL(this, href);
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
            resp[this.as]().then(result => {
                if (resp.status !== 200) {
                    this.errorResponse = resp;
                    const respText = resp['text'];
                    if(respText) respText().then(val => {
                        this.errorText = val;
                    })
                } else {
                    this.result = result;
                    if (this.cacheResults !== undefined) {
                        if(this.cacheResults === 'global'){
                            XtalFetchGet[cacheSymbol] = result;
                        }else{
                            this.cachedResults[this.href] = result;
                        }
                        
                    }
                    if (typeof result === 'string' && this.insertResults) {
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


}
define(XtalFetchReq);
declare global {
    interface HTMLElementTagNameMap {
        "xtal-fetch-req": XtalFetchReq,
    }
}