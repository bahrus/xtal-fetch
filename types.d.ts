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
    reqInit: RequestInit | undefined,
    cacheResults: '' | 'global' | undefined,
    reqInitRequired: boolean,
    debounceDuration: number,
    errorResponse: Response | undefined;
    errorText: string | undefined;
    fetchInProgress: boolean;
    insertResults: boolean;
    baseLinkId: string;
}

export interface XtalFetchReqPropertiesIfc extends XtalFetchGetProps, XtalFetchReqAddedProperties {}

export interface XtalFetchEntitiesAddedProperties{
    forEach: string,
    setPath: string,
    inEntities: any[],
}

export interface XtalFetchEntitiesPropertiesIfc extends XtalFetchGetProps, XtalFetchReqAddedProperties, XtalFetchEntitiesAddedProperties{}

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