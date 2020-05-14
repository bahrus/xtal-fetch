import { XtalFetchReq } from './xtal-fetch-req.js';
import { define } from 'xtal-element/xtal-latx.js';
/**
 *  Entire feature set for xtal-fetch, including multiple entity requests.
 *  @element xtal-fetch-entities
 */
export class XtalFetchEntities extends XtalFetchReq {
    get hasAllThreeProps() {
        return this.forEach !== undefined && this.setPath !== undefined && this.inEntities !== undefined;
    }
    do() {
        if (!this.hasAllThreeProps) {
            super.do();
            return;
        }
        if (this.fetchInProgress) {
            this.abort = true;
        }
        const keys = this.forEach.split(',');
        let remainingCalls = this.inEntities.length;
        this.fetchInProgress = true;
        let counter = 0;
        const base = this._baseLinkId ? self[this._baseLinkId].href : '';
        //this._inEntities.forEach(entity => {
        if (typeof (AbortController) !== 'undefined') {
            this._controller = new AbortController();
            const sig = this._controller.signal;
            if (this._reqInit) {
                this._reqInit.signal = sig;
            }
            else {
                this._reqInit = {
                    signal: sig,
                };
            }
        }
        for (let i = 0, ii = this.inEntities.length; i < ii; i++) {
            const entity = this.inEntities[i];
            entity['__xtal_idx'] = counter;
            counter++;
            let href = this.href;
            keys.forEach(key => {
                href = href.replace(':' + key, entity[key]);
            });
            href = base + href;
            if (this.cacheResults) {
                const val = this.cachedResults[href];
                if (val) {
                    entity[this.setPath] = val;
                    remainingCalls--;
                    if (remainingCalls === 0)
                        this.fetchInProgress = false;
                    return;
                }
            }
            self.fetch(href, this._reqInit).then(resp => {
                if (resp.status !== 200) {
                    resp['text']().then(val => {
                        this.errorText = val;
                    });
                    this.errorResponse = resp;
                }
                else {
                    resp[this.as]().then(val => {
                        remainingCalls--;
                        if (remainingCalls === 0) {
                            this.fetchInProgress = false;
                            this.result = this.inEntities.slice(0);
                        }
                        if (this.cacheResults)
                            this.cachedResults[href] = val;
                        entity[this.setPath] = val;
                        const detail = {
                            entity: entity,
                            href: href
                        };
                        this.emit('fetch-complete', detail);
                    });
                }
            }).catch(err => {
                if (err.name === 'AbortError') {
                    console.log('Fetch aborted');
                    this.fetchInProgress = false;
                }
            });
        }
    }
}
XtalFetchEntities.is = 'xtal-fetch-entities';
XtalFetchEntities.attributeProps = ({ disabled, fetch, as, href, reqInit, cacheResults, reqInitRequired, debounceDuration, insertResults, forEach, setPath, inEntities }) => ({
    boolean: [disabled, fetch, reqInitRequired, insertResults],
    string: [as, href, cacheResults, forEach, setPath],
    number: [debounceDuration],
    object: [reqInit, inEntities],
    parsedObject: [reqInit]
});
define(XtalFetchEntities);
/**
 * Feature rich custom element that can make fetch calls, include Post requests.
 *  @element xtal-fetch
 */
class XtalFetch extends XtalFetchEntities {
    static get is() { return 'xtal-fetch'; }
}
define(XtalFetch);
