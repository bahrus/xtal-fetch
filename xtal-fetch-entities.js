import { XtalFetchReq, snakeToCamel } from './xtal-fetch-req.js';
import { define } from 'trans-render/define.js';
const forEach = 'for-each';
const setPath = 'set-path';
/**
 *  Entire feature set for xtal-fetch, including multiple entity requests.
 *  @element xtal-fetch-entities
 */
export class XtalFetchEntities extends XtalFetchReq {
    static get is() { return 'xtal-fetch-entities'; }
    get forEach() {
        return this._forEach || this.getAttribute(forEach);
    }
    /**
     * Comma delimited list of properties to use as input for the fetch urls
     * @type {String}
     * @attr for-each
     */
    set forEach(val) {
        this.attr(forEach, val);
    }
    get setPath() {
        return this._setPath || this.getAttribute(setPath);
    }
    /**
     * Path to set value inside each entity
     * @type {String}
     * attr set-path
     */
    set setPath(val) {
        this.attr(setPath, val);
    }
    get inEntities() {
        return this._inEntities;
    }
    /**
     * Array of entities to use as input for building the url (along with forEach value).  Also place where result should go (using setPath attribute)
     * @type {Array}
     *
     */
    set inEntities(val) {
        this._inEntities = val;
        this.onPropsChange();
    }
    static get observedAttributes() {
        return super.observedAttributes.concat([forEach, setPath]);
    }
    attributeChangedCallback(name, oldValue, newValue) {
        switch (name) {
            case setPath:
            case forEach:
                this['_' + snakeToCamel(name)] = newValue;
        }
        super.attributeChangedCallback(name, oldValue, newValue);
    }
    connectedCallback() {
        super.connectedCallback();
        this.propUp(['forEach', 'setPath', 'inEntities']);
    }
    onPropsChange() {
        const hasAtLeastOneProp = this.setPath || this.forEach || this.inEntities;
        if (hasAtLeastOneProp) {
            this._hasAllThreeProps = !!(this._setPath && this._forEach && this.inEntities);
            if (!this._hasAllThreeProps) { //need all three
                return;
            }
        }
        super.onPropsChange();
    }
    do() {
        if (!this._hasAllThreeProps) {
            super.do();
            return;
        }
        if (this.fetchInProgress) {
            this.abort = true;
        }
        const keys = this._forEach.split(',');
        let remainingCalls = this._inEntities.length;
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
        for (let i = 0, ii = this._inEntities.length; i < ii; i++) {
            const entity = this._inEntities[i];
            entity['__xtal_idx'] = counter;
            counter++;
            let href = this._href;
            keys.forEach(key => {
                href = href.replace(':' + key, entity[key]);
            });
            href = base + href;
            if (this._cacheResults) {
                const val = this.cachedResults[href];
                if (val) {
                    entity[this._setPath] = val;
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
                    resp[this._as]().then(val => {
                        remainingCalls--;
                        if (remainingCalls === 0) {
                            this.fetchInProgress = false;
                            this.result = this.inEntities.slice(0);
                        }
                        if (this._cacheResults)
                            this.cachedResults[href] = val;
                        entity[this._setPath] = val;
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
define(XtalFetchEntities);
/**
 * Feature rich custom element that can make fetch calls, include Post requests.
 *  @element xtal-fetch
 */
class XtalFetch extends XtalFetchEntities {
    static get is() { return 'xtal-fetch'; }
}
define(XtalFetch);
