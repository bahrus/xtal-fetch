export interface XtalFetchBasePropertiesIfc {
    href: string,
    fetch: boolean,
    disabled: boolean,
    result: any,
}

export interface IXtalFetchReqProperties extends XtalFetchBasePropertiesIfc {
    reqInit: RequestInit | undefined,
    reqInitRequired: boolean,
    debounceDuration: number,
    errorResponse: Response | null;
    fetchInProgress: boolean;
    insertResults: boolean;
    baseLinkId: string;
}