const fetch = 'fetch';
const href = 'href';
const block = 'block';
export class XtalFetchBase extends HTMLElement {
    constructor() {
        super(...arguments);
        this._reqInit = {
            credentials: 'include'
        };
        this._as = 'json';
    }
    static get is() { return 'xtal-fetch-base'; }
    de(name, detail) {
        const newEvent = new CustomEvent(name + '-changed', {
            detail: detail,
            bubbles: true,
            composed: false,
        });
        this.dispatchEvent(newEvent);
        return newEvent;
    }
    get fetch() {
        return this._fetch;
    }
    set fetch(val) {
        if (val) {
            this.setAttribute(fetch, '');
        }
        else {
            this.removeAttribute(fetch);
        }
    }
    get block() {
        return this._block;
    }
    set block(val) {
        if (val) {
            this.setAttribute(block, '');
        }
        else {
            this.removeAttribute(block);
        }
    }
    get href() {
        return this._href;
    }
    set href(val) {
        this.setAttribute(href, val);
    }
    get result() {
        return this._result;
    }
    set result(val) {
        this._result = val;
        this.de('result', val);
    }
    static get observedAttributes() {
        return [fetch, href, block];
    }
    _upgradeProperties(props) {
        props.forEach(prop => {
            if (this.hasOwnProperty(prop)) {
                let value = this[prop];
                delete this[prop];
                this[prop] = value;
            }
        });
    }
    attributeChangedCallback(name, oldVal, newVal) {
        switch (name) {
            //booleans
            case fetch:
            case block:
                this['_' + name] = newVal !== null;
                break;
            default:
                this['_' + name] = newVal;
        }
        this.onBasePropsChange();
    }
    onBasePropsChange() {
        if (!this.fetch || !this.href || this.block)
            return;
        this.do();
    }
    do() {
        const _this = this;
        self.fetch(this.href, this._reqInit).then(resp => {
            resp[_this._as]().then(result => {
                _this.result = result;
            });
        });
    }
    connectedCallback() {
        this._upgradeProperties([fetch, href, block]);
    }
}
if (!customElements.get(XtalFetchBase.is)) {
    customElements.define(XtalFetchBase.is, XtalFetchBase);
}
//# sourceMappingURL=xtal-fetch-base.js.map