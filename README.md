[![Published on webcomponents.org](https://img.shields.io/badge/webcomponents.org-published-blue.svg)](https://www.webcomponents.org/element/bahrus/xtal-fetch)

# \<xtal-fetch\>

[Demo](demo/index.html)

## Single Requests

\<xtal-fetch\> is a dependency free, 1.9kb (gzipped and minified) web component wrapper around the fetch api.  It is inspired by Polymer's \<iron-ajax\> component.  But this component has no legacy Polymer dependencies, is a thin transparent wrapper around the native fetch api, and supports some alternative functionality not supported by *iron-ajax*.

All the evergreen browsers support fetch.  For IE11, a polyfill should be used.

An example of such a polyfill can be found [here](https://github.com/bahrus/xtal-fetch/blob/master/IE11-polyfill.js).  This was extracted from the [Financial Times Polyfill service](https://github.com/Financial-Times/polyfill-service).  It contains additional polyfills recommended for supporting most ES6 features.

To make a fetch request, you need to add the fetch attribute, and specify an href value:

```html
<xtal-fetch fetch href="https://myDomain/myPath/mySubpath"></xtal-fetch>
```

It may seem somewhat redundant to need to add the fetch attribute (being that the component is called "xtal-fetch").  However, this attribute / property serves a useful purpose:  It can block requests until a sanity check is satisfied, such as the requirement of a binding parameter:

```html
<xtal-fetch fetch="[[myBinding]]" href="https://myDomain/myPath/[[myBinding]]"></xtal-fetch>
```

This will prevent a (typically cancelled) request from going through, until the binding needed for the href is available. Debouncing is also supported to help avoid duplicate calls due to complex bindings.

For more complex sanity checks / validation logic, the fetch property could, of course, refer to a computed property coming from the hosting [Polymer?] component (if applicable).

In the event that multiple xtal-fetch tags share the same base URL, xtal-fetch supports the use of the [link rel="preconnect"](https://w3c.github.io/resource-hints/#preconnect) tag to specify the base url.  A unique ID should be given to that link, inside the document.head tag:

```html
<link rel="preconnect" id="myAPIBaseUrl" href="https://myDomain/api/">
``` 

Then you can refer to this base URL thusly:

```html
<xtal-fetch base-link-id="myAPIBaseUrl"  href="myPath/[[myBinding]]"></xtal-fetch>
```

The base url will be prepended to the href property.

One can specify whether the result should be parsed as JSON, or left as text, using the "as" attribute:

```html
<xtal-fetch fetch href="https://myDomain/myPath/mySubpath" as="json"></xtal-fetch>
```

Possible values for as are "json" and "text."

The results of the fetch can be inserted inside the <xtal-fetch> tag, becoming a glorified client-side "include":

```html
<xtal-fetch fetch href="https://myDomain/myPath/mySubpath" as="json" insert-results></xtal-fetch>
```

Note, though, that if using a relative path for href, it will be relative to the url of the hosting page, not the url of the component definition.

But more typically, you will want to "post the results of the fetch to a place available to its peers (other nodes inside the containing web component)".  The last phrase is in quotes, because that isn't precisely what happens when one examines the nitty gritty details, but this is the effect we essentially want to have.  If the containing component is also a Polymer component, then this  can be done by specifying a two-way binding path, and no boilerplate code is required in order to achieve the desired effect: 

```html
<xtal-fetch fetch href="generated.json" as="json" result="{{people}}"></xtl-fetch>
<template is="dom-repeat" items="[[people]]">
    Name: [[item.name]] <br>
    Email: [[item.email]] <br>
<hr>
</template>
```

This is referred to as the mediator pattern.

Other non Polymer component containers will need to add event handlers to listen for change events, in order to achieve similar results.

For example, preact:

```JSX
<xtal-fetch fetch href="generated.json" as="json" result-changed={this.setPeople}></xtl-fetch>>
```  

If creating a non Polymer web component, you can apply the Polymer mixin to the class.  Since mixin's are quite flexible (unlike single inheritance) this should not impose too many constraints on what can be done with non Polymer components.

The markup below is a simple example of how to use the Polymer mixin in order to achieve the mediator pattern effects.

```html
    <script>
        function initMyComponents() {
            class MyComponent extends HTMLElement {
                set myProp(val){
                    this.innerHTML = val;
                }
            }
            customElements.define('my-component', MyComponent);
            class MyContainer extends Polymer.ElementMixin(HTMLElement) {
                static get is(){return 'my-container';}
                static get template() {
                    return `
                        <xtal-fetch fetch href="sampleHTMLFragment.html" result="{{myResult}}"></xtal-fetch>
                        <my-component my-prop="[[myResult]]"></my-component>
                    `;
                }
            }
            customElements.define('my-container', MyContainer);
        }
        customElements.whenDefined('xtal-fetch').then(() => initMyComponents());
    </script>
    <my-container></my-container>
```

## Caching

xtal-fetch supports caching, by setting attribute/property cache-results/cacheResults to true.

## Fine tuning

It is often mistakenly assumed that the "fetch" api only supports get, not post.  This is in fact **not** the case.  The second parameter of the fetch function is often referred to as the reqInit parameter, and it can specify a method of "post", request headers, and the body of a post request, and much more.  This component simply passes the reqInit property into the api, unaltered:

 ```html
 <xtal-fetch fetch href="api/persistService/id/[[id]]" as="json" 
 result="{{people}}" req-init="[[myRequestConfig]]"></xatl-fetch>
 ```
 
 myRequestConfig could be initialized inside the containing component, or come from another component that posts to "myRequestConfig".

 In order to avoid doing a premature fetch, before the reqInit binding takes place, one can specify the attribute:  reqInitRequired:

```html
 <xtal-fetch fetch href="api/persistService/id/[[id]]" as="json" 
 result="{{people}}" req-init="[[myRequestConfig]]" req-init-required></xatl-fetch>
 ``` 

 Although this could be done with boilerplate code using the fetch property, it is such a common need that this additional attribute is added for this specific purpose. 

The reqInit property is also an attribute, allowing you to specify common properties inline:

```html
<xtal-fetch fetch href="https://myDomain/myPath/mySubpath" req-init='{"credentials": "same-origin"}' as="json"></xtal-fetch>
```

## Multiple requests

\<xtal-fetch\> allows for spawning multiple fetch requests tied to an array of entities.  This is often useful when drilling down from some parent entity ('customer', e.g.) to multiple 1-n relations ('purchases', e.g.)

The syntax for this is meant to be readable:

```html
<xtal-fetch  fetch href="api/customer/[[id]]/purchase/:id" for-each="id" in-entities="[[purchases]]" 
              as="json"  set-path="purchase_detail" on-fetch-complete="refreshDetail"></xtal-fetch>
```

*set-path* specifies the property name in each entity, used to store the fetched entity detail (json or text specified by "as" just like before).

Note that *xtal-fetch* issues a "fetch-complete" event after every fetch is completed.

One can enable caching  of the same href value using the cache-results attribute.  In the future, this will also consider the req-init property as well in determining whether a fresh request should be made.

Like the Polymer iron-ajax inspiration, the *debounce-duration* attribute specifies how much to wait for the request to "settle down" before proceeding.

## To use  \<xtal-fetch\>

>bower install --save bahrus/xtal-fetch

or

>yarn add xtal-fetch

or

>npm install xtal-fetch

or

```html
<script src="https://cdn.jsdelivr.net/npm/xtal-fetch@0.0.21/build/ES6/xtal-fetch.js"></script>
```

or

```html
<script src="https://unpkg.com/xtal-fetch@0.0.21/build/ES6/xtal-fetch.js"></script>
```


## Install the Polymer-CLI

First, make sure you have the [Polymer CLI](https://www.npmjs.com/package/polymer-cli) installed. Then run `polymer serve` to serve your element locally.


## Viewing Your Element

```
$ polymer serve
```

## Running Tests

```
$ polymer test
```

Your application is already set up to be tested via [web-component-tester](https://github.com/Polymer/web-component-tester). Run `polymer test` to run your application's test suite locally.
