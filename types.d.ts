import { XtalFetchGet } from "./xtal-fetch-get";

export interface XtalFetchBasePropertiesIfc extends Partial<HTMLElement> {
    href?: string,
    fetch?: boolean,
    disabled?: boolean,
    result?: any,
    as?: 'text' | 'json';
}

export interface XtalFetchReqAddedProperties{
    reqInit: RequestInit | undefined,
    cacheResults: '' | 'global' | undefined,
    reqInitRequired: boolean,
    debounceDuration: number,
    errorResponse: Response | null;
    fetchInProgress: boolean;
    insertResults: boolean;
    baseLinkId: string;
}

export interface XtalFetchReqPropertiesIfc extends XtalFetchBasePropertiesIfc, XtalFetchReqAddedProperties {}

export interface XtalFetchEntitiesAddedProperties{
    forEach: string,
    setPath: string,
    inEntities: any[],
}

export interface XtalFetchEntitiesPropertiesIfc extends XtalFetchBasePropertiesIfc, XtalFetchReqAddedProperties, XtalFetchEntitiesAddedProperties{}

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