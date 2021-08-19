import {XtalFetchGet} from './xtal-fetch-get2.js';

export class XtalFetchReq extends XtalFetchGet{
    async linkResult(self: this){

        const superResult = await super.linkResult(self);
        return superResult;
    }
}