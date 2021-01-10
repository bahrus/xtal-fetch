/**
 * @element my-example
 */
export class MyExample extends HTMLElement {
    constructor() {
        super(...arguments);
        this.myProp = 'myVal';
    }
}
