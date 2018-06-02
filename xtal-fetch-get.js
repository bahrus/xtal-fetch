const fetch = 'fetch';
const href = 'href';
const disabled = 'disabled';
const pass_down = 'pass-down';
export class XtalFetchGet extends HTMLElement {
    constructor() {
        super(...arguments);
        this._reqInit = {
            credentials: 'same-origin'
        };
        this._as = 'json';
    }
    static get is() { return 'xtal-fetch-get'; }
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
    get disabled() {
        return this.hasAttribute(disabled);
    }
    set disabled(val) {
        if (val) {
            this.setAttribute(disabled, '');
        }
        else {
            this.removeAttribute(disabled);
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
        if (this.cssKeyMappers) {
            this.passDownProp(val);
            return;
        }
        this.de('result', {
            value: val
        });
    }
    get passDown() {
        return this._passDown;
    }
    set passDown(val) {
        this.setAttribute(pass_down, val);
    }
    static get observedAttributes() {
        return [
            /**
             * @type boolean
             * Indicates whether fetch request should be made.
             */
            fetch,
            href,
            disabled,
            pass_down
        ];
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
            case disabled:
                this['_' + name] = newVal !== null;
                break;
            case pass_down:
                this._passDown = newVal;
                this.parsePassDown();
                break;
            default:
                this['_' + name] = newVal;
        }
        this.onPropsChange();
    }
    onPropsChange() {
        this.loadNewUrl();
    }
    parsePassDown() {
        this.cssKeyMappers = [];
        const splitPassDown = this._passDown.split('};');
        splitPassDown.forEach(passDownSelectorAndProp => {
            if (!passDownSelectorAndProp)
                return;
            const splitPassTo2 = passDownSelectorAndProp.split('{');
            this.cssKeyMappers.push({
                cssSelector: splitPassTo2[0],
                propTarget: splitPassTo2[1]
            });
        });
    }
    passDownProp(val) {
        let nextSibling = this.nextElementSibling;
        while (nextSibling) {
            this.cssKeyMappers.forEach(map => {
                if (nextSibling.matches(map.cssSelector)) {
                    nextSibling[map.propTarget] = val;
                }
            });
            nextSibling = nextSibling.nextElementSibling;
        }
    }
    loadNewUrl() {
        if (!this.fetch || !this.href || this.disabled)
            return;
        this.do();
    }
    do() {
        self.fetch(this.href, this._reqInit).then(resp => {
            resp[this._as]().then(result => {
                this.result = result;
            });
        });
    }
    connectedCallback() {
        this._upgradeProperties([fetch, href, disabled]);
    }
}
if (!customElements.get(XtalFetchGet.is)) {
    customElements.define(XtalFetchGet.is, XtalFetchGet);
}
//# sourceMappingURL=xtal-fetch-get.js.map