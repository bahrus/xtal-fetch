//import { XtalFetchGet } from "./xtal-fetch-get";

export interface XtalFetchLiteProps extends HTMLElement {
    /**
     * URL (path) to fetch.
     * @attr
     * @type {string}
     * 
     * 
     */
    href?: string;
    /**
     * Must be true for fetch to proceed
     * @attr
     */
    fetch?: boolean;
    disabled?: boolean;
    enabled?: boolean;

    /**
     *  How to treat the response
     * @attr
     * @type {"json"|"text"}
     */
    as? : 'json' | 'text'; 


    /**
     * Object to use for second parameter of fetch method.  Can parse the value from the attribute if the attribute is in JSON format.
     * Supports JSON formatted attribute
     * @type {object}
     * @attr req-init
     */
    reqInit?: RequestInit;

    /**
     * @readonly
     */
    value?: any;

    /**
     * ⚡ Fires event result-changed
     * Result of fetch request
     * @type {Object}
     * 
     * 
     */
    result?: any;
}

export type pxfgp = Partial<XtalFetchLiteProps>;

export interface XtalFetchLiteActions {
    getResult(self: this): Promise<pxfgp>;
}

export interface XtalFetchReqAddedProperties{
    /**
     * Indicates whether to pull the response from a previous identical fetch request from cache.
     * If set to true, cache is stored locally within the instance of the web component.
     * If set to 'global', cache is retained after web component goes out of scope.
     * @attr cache-results
     */
    cacheResults?: '' | 'global';
    
    /**
     * Indicates that no fetch request should proceed until reqInit property / attribute is set.
     */
    reqInitRequired?: boolean;
    /**
     * How long to pause between requests
     * @attr debounce-duration
     * @type {Number}
     * 
     */
    debounceDuration?: number;
    /**
     * Error response as an object
     * ⚡ Fires event error-response-changed
     * @type {Object}
     * 
     */
    errorResponse?: Response;
    /**
     * Indicates the error text of the last request.
     * ⚡ Fires event error-text-changed.
     * @type {String}
     */
    errorText?: string;
    /**
     * Indicates Fetch is in progress
     * ⚡ Fires event fetch-in-progress-changed
     * @type {Boolean}
     */
    fetchInProgress?: boolean;
    /**
     * Indicate whether to set the innerHTML of the web component with the response from the server.  
     * Make sure the service is protected against XSS.
     * @attr insert-results
     */
    insertResults?: boolean;

    // /**
    //  * DOM ID  of link (preload) tag, typical in head element.  
    //  * Used to prov
    //  */
    // baseLinkId?: string;

    lastFrameHref?: string;
}

export interface XtalFetchReqProps extends XtalFetchLiteProps, XtalFetchReqAddedProperties {}

export interface XtalFetchEntitiesAddedProperties{
    /**
     * Comma delimited list of properties to use as input for the fetch urls
     * @type {String}
     * @attr for-each
     */
    forEach: string | undefined;
    /**
     * Path to set value inside each entity
     * @type {String}
     * attr set-path
     */
     setPath: string | undefined;
    /**
     * Array of entities to use as input for building the url (along with forEach value).  Also place where result should go (using setPath attribute)
     * @type {Array}
     * 
     */
    inEntities: any[] | undefined;
}

export interface XtalFetchEntitiesProps extends XtalFetchLiteProps, XtalFetchReqAddedProperties, XtalFetchEntitiesAddedProperties{}

export interface StandardDetail{
    value: any;
}

export interface FetchDetail{
    href: string,
    result?: any,
    entity?: any
}
export interface XtalFetchGetEventNameMap{
    'result-changed': StandardDetail;
}

export interface XtalFetchReqEventNameMap extends XtalFetchGetEventNameMap{
    'error-response-changed': StandardDetail;
    'error-text-changed': StandardDetail;
    'fetch-in-progress-changed': StandardDetail;
    'fetch-complete': FetchDetail;
}