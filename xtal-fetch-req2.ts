import {XtalFetchGet} from './xtal-fetch-get2.js';
import {define} from 'trans-render/lib/define.js';
import {INotifyPropInfo} from 'trans-render/lib/mixins/notify.js';
import { XtalFetchReqProps } from './types.js';

export class XtalFetchReqCore extends XtalFetchGet{
    async getResult(self: this){

        const superResult = await super.getResult(self);
        return superResult;
    }
}

export interface XtalFetchReqCore extends XtalFetchReqProps{}

const notify: INotifyPropInfo = {
    notify: {
        viaCustEvt: true
    }
};

export const XtalFetchReq = define<XtalFetchReqCore, INotifyPropInfo>({
    config:{
        tagName: 'xtal-fetch-req',
        propDefaults:{
            debounceDuration: 0,
        },  
        propInfo:{
            cacheResults: {type: 'String'},
            errorResponse:notify,
            errorText: notify,
            fetchInProgress: notify
        }
    },
});