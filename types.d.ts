import { XtalFetchGet } from "./xtal-fetch-get";

export interface XtalFetchGetProps extends HTMLElement {
    /**
     * URL (path) to fetch.
     * @attr
     * @type {string}
     * 
     * 
     */
    href?: string | undefined;
    /**
     * Must be true for fetch to proceed
     * @attr
     */
    fetch?: boolean | undefined;
    disabled?: boolean | undefined;

    /**
     *  How to treat the response
     * @attr
     * @type {"json"|"text"}
     */
    as? : 'json' | 'text' | undefined; 


    /**
     * Object to use for second parameter of fetch method.  Can parse the value from the attribute if the attribute is in JSON format.
     * Supports JSON formatted attribute
     * @type {object}
     * @attr req-init
     */
    reqInit?: RequestInit | undefined;

    /**
     * @readonly
     */
    value?: any | undefined;

    /**
     * ⚡ Fires event result-changed
     * Result of fetch request
     * @type {Object}
     * 
     * 
     */
    result?: any | undefined;
}

export interface XtalFetchReqAddedProperties{
    /**
     * Indicates whether to pull the response from a previous identical fetch request from cache.
     * If set to true, cache is stored locally within the instance of the web component.
     * If set to 'global', cache is retained after web component goes out of scope.
     * @attr cache-results
     */
    cacheResults?: '' | 'global' | undefined;
    
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
    debounceDuration?: number | undefined;
    /**
     * Error response as an object
     * ⚡ Fires event error-response-changed
     * @type {Object}
     * 
     */
    errorResponse?: Response | undefined;
    /**
     * Indicates the error text of the last request.
     * ⚡ Fires event error-text-changed.
     * @type {String}
     */
    errorText: string | undefined;
    /**
     * Indicates Fetch is in progress
     * ⚡ Fires event fetch-in-progress-changed
     * @type {Boolean}
     */
    fetchInProgress?: boolean | undefined;
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
}

export interface XtalFetchReqProps extends XtalFetchGetProps, XtalFetchReqAddedProperties {}

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

export interface XtalFetchEntitiesProps extends XtalFetchGetProps, XtalFetchReqAddedProperties, XtalFetchEntitiesAddedProperties{}

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