import { XtalFetchReq, snakeToCamel } from './xtal-fetch-req.js';
const forEach = 'for-each';
const setPath = 'set-path';
class XtalFetchEntities extends XtalFetchReq {
    static get is() { return 'xtal-fetch-entities'; }
    get forEach() {
        return this._forEach || this.getAttribute(forEach);
    }
    set forEach(val) {
        this.setAttribute(forEach, val);
    }
    get setPath() {
        return this._setPath || this.getAttribute(setPath);
    }
    set setPath(val) {
        this.setAttribute(setPath, val);
    }
    get inEntities() {
        return this._inEntities;
    }
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
        this._upgradeProperties(['forEach', 'setPath', 'inEntities']);
    }
    onPropsChange() {
        const hasAtLeastOneProp = this.setPath || this.forEach || this.inEntities;
        if (hasAtLeastOneProp) {
            this._hasAllThreeProps = this._setPath && this._forEach && this.inEntities;
            if (!this._hasAllThreeProps) {
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
        const keys = this._forEach.split(',');
        let remainingCalls = this._inEntities.length;
        this.fetchInProgress = true;
        let counter = 0;
        const base = this._baseLinkId ? self[this._baseLinkId].href : '';
        //this._inEntities.forEach(entity => {
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
                        if (remainingCalls === 0)
                            this.fetchInProgress = false;
                        if (this._cacheResults)
                            this.cachedResults[href] = val;
                        entity[this._setPath] = val;
                        const detail = {
                            entity: entity,
                            href: href
                        };
                        this.dispatchEvent(new CustomEvent('fetch-complete', {
                            detail: detail,
                            bubbles: true,
                            composed: false,
                        }));
                    });
                }
            });
        }
    }
}
if (!customElements.get(XtalFetchEntities.is)) {
    customElements.define(XtalFetchEntities.is, XtalFetchEntities);
}
class XtalFetch extends XtalFetchEntities {
    static get is() { return 'xtal-fetch'; }
}
if (!customElements.get(XtalFetch.is)) {
    customElements.define(XtalFetch.is, XtalFetch);
}
//# sourceMappingURL=xtal-fetch-entities.js.map