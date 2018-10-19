[![Published on webcomponents.org](https://img.shields.io/badge/webcomponents.org-published-blue.svg)](https://www.webcomponents.org/element/bahrus/xtal-fetch)

<a href="https://nodei.co/npm/xtal-fetch/"><img src="https://nodei.co/npm/xtal-fetch.png"></a>


# \<xtal-fetch\>

## Single Requests

\<xtal-fetch\> is a vanilla web component wrapper around the fetch api.  It is inspired by Polymer's \<iron-ajax\> component.  But this component has no legacy Polymer dependencies, is a thin transparent wrapper around the native fetch api, and supports some alternative functionality not supported by *iron-ajax*.


### Referencing

In order to keep the size of the download(s) as small as possible, the functionality of this component is broken down into three subcomponents.  xtal-fetch-get just supports basic get requests, has no support for error handling.  It requires a browser that supports ES6 Modules.  xtal-fetch-req supports everything xtal-fetch supports,except parallel multiple entity fetch requests.  

If you want to just keep things simple and include everything, or need to support browsers that don't support ES6 Modules you can use xtal-fetch.js.  It can use a classic script reference or a module reference.  It weighs 2.5 KB minified and gzipped.  

All the evergreen browsers support fetch.  For IE11, a polyfill should be used.

An example of such a polyfill can be found [here](https://github.com/bahrus/xtal-fetch/blob/master/IE11-polyfill.js).  This was extracted from the [Financial Times Polyfill service](https://github.com/Financial-Times/polyfill-service).  It contains additional polyfills recommended for supporting most ES6 features.

### To use  \<xtal-fetch\>


>yarn add xtal-fetch

or

>npm install xtal-fetch

or

```html
<script src="https://cdn.jsdelivr.net/npm/xtal-fetch@0.0.46/build/ES6/xtal-fetch.js"></script>
```

or

```html
<script src="https://unpkg.com/xtal-fetch@0.0.46/build/ES6/xtal-fetch.js"></script>
```

As mentioned, if you don't need all the functionality of xtal-fetch.js, replace the above links with xtal-fetch-get or xtal-fetch-req (and modify the tag name accordingly.)

## Core functionality

To make a fetch request, you need to add the fetch attribute, and specify an href value:

```html
<xtal-fetch fetch href="https://myDomain/myPath/mySubpath"></xtal-fetch>
```

It may seem somewhat redundant to need to add the fetch attribute (being that the component is called "xtal-fetch").  However, this attribute / property serves a useful purpose:  It can block requests until a sanity check is satisfied, such as the requirement of a binding parameter:

```html
<!-- Polymer Notation -->
<xtal-fetch fetch="[[myBinding]]" href="https://myDomain/myPath/[[myBinding]]"></xtal-fetch>
```

This will prevent a (typically cancelled) request from going through, until the binding needed for the href is available. Debouncing is also supported to help avoid duplicate calls due to complex bindings.

For more complex sanity checks / validation logic, the fetch property could, of course, refer to a computed property coming from the hosting [Polymer?] component (if applicable).

xtal-fetch also has a property, disable, that *prevents* requests from going through.  Kind of the opposite of the fetch property.

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

The results of the fetch can be inserted inside the xtal-fetch tag, becoming a glorified client-side "include":

```html
<xtal-fetch fetch href="https://myDomain/myPath/mySubpath" as="text" insert-results></xtal-fetch>
```

Note, though, that if using a relative path for href, it will be relative to the url of the hosting page, not the url of the component definition.

But more typically, you will want to "post the results of the fetch to a place available to its peers (other nodes inside the containing web component)".  The last phrase is in quotes, because that isn't precisely what happens when one examines the nitty gritty details, but this is the effect we essentially want to have.  If the containing component is also a Polymer component, then this  can be done by specifying a two-way binding path, and no boilerplate code is required in order to achieve the desired effect: 

```html
<!-- Sample Syntax -->
<xtal-fetch fetch href="generated.json" as="json" result="{{people}}"></xtl-fetch>
<p-d on="fetch-complete" to="{input}">
<ul id="peopleList" data-lit>
    <script nomodule>
        html`${input.map(i => html`<li>Name: ${i.name} <br>Email: ${i.email}</li>`)}`
    </script>
</ul>
```



## Caching

xtal-fetch supports caching, by setting attribute/property cache-results/cacheResults to true.

## Abort support

set the "abort" property of your xtal-fetch instance to true in order to abort any running request.

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

Note that *xtal-fetch* issues a "fetch-complete" event after all the fetches are completed.

One can enable caching  of the same href value using the cache-results attribute.  

Like the Polymer iron-ajax inspiration, the *debounce-duration* attribute specifies how much to wait for the request to "settle down" before proceeding.

<!--
```
<custom-element-demo>
  <template>
      <div>
        <link rel="preconnect" id="baseSampleJsonFolder" href="https://cdn.jsdelivr.net/npm/xtal-fetch/demo/">
        <litter-g></litter-g>
        <xtal-fetch disabled base-link-id="baseSampleJsonFolder" fetch href="generated.json" as="json"></xtal-fetch>
        <p-d on="fetch-complete" to="#peopleList{input:target.result};#peopleEntities{inEntities:target.result}" ></p-d>
        <ul id="peopleList" data-lit>
            <script nomodule>
                html`${input.map(i => html`<li>Name: ${i.name} <br>Email: ${i.email}</li>`)}`
            </script>
        </ul>
        
        <xtal-fetch disabled id="peopleEntities" as="json" base-link-id="baseSampleJsonFolder" fetch href="detail_:_id.json" for-each="_id" set-path="detail_contents"></xtal-fetch>
        <p-d on="fetch-complete" to="{input:target.result}"></p-d>
        <ul id="detail" data-lit>
            <script nomodule>
                html`${input.map(i => html`<li>DetailContents: ${i.detail_contents.message}</li>`)}`
            </script>
        </ul>
        <script type="module" src="https://cdn.jsdelivr.net/npm/p-d.p-u@0.0.69/p-d.p-u.js"></script>
        <script type="module" src="https://cdn.jsdelivr.net/npm/xtal-fetch@0.0.43/xtal-fetch.js"></script>
        <script type="module" src="https://cdn.jsdelivr.net/npm/litter-g@0.0.15/litter-g.iife.js"></script> 

      </div>
</template>
</custom-element-demo>
```
-->
## Install the Polymer-CLI

First, make sure you have the [Polymer CLI](https://www.npmjs.com/package/polymer-cli) and npm (packaged with [Node.js](https://nodejs.org)) installed. Run `npm install` to install your element's dependencies, then run `polymer serve` to serve your element locally.

## Viewing Your Element

```
$ polymer serve
```

## Running Tests

WIP.
