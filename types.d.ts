export interface XtalFetchBasePropertiesIfc {
    href: string,
    fetch: boolean,
    disabled: boolean,
    result: any,
}

export interface XtalFetchReqAddedProperties{
    reqInit: RequestInit | undefined,
    cacheResults: boolean | undefined,
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