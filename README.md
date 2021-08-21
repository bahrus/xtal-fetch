[![Published on webcomponents.org](https://img.shields.io/badge/webcomponents.org-published-blue.svg)](https://www.webcomponents.org/element/xtal-fetch)

<a href="https://nodei.co/npm/xtal-fetch/"><img src="https://nodei.co/npm/xtal-fetch.png"></a>

<img src="https://badgen.net/bundlephobia/minzip/trans-render">

[![Actions Status](https://github.com/bahrus/xtal-fetch/workflows/CI/badge.svg)](https://github.com/bahrus/xtal-fetch/actions?query=workflow%3ACI)

# \<xtal-fetch\>

## [API](https://bahrus.github.io/api-viewer/index.html?npmPackage=xtal-fetch&jsPath=xtal-fetch-entities.js&jsonPath=custom-elements.json)

## Single Requests

\<xtal-fetch\> is a vanilla web component wrapper around the fetch api.  It is inspired by Polymer's \<iron-ajax\> component.  But this component has no legacy Polymer dependencies, is a thin transparent wrapper around the native fetch api, and supports some alternative functionality not supported by *iron-ajax*.  However, xtal-fetch is compatible with Polymer's powerful binding mechanism.


### Referencing

In order to keep the size of the download(s) as small as possible, the functionality of this component is broken down into three subcomponents.  xtal-fetch-lite provides the thinnest wrapper, and emits an event when the fetch has completed (result-changed as well as value-changed), but has no support for error handling.  

If you want to just keep things simple and include everything, or need to support browsers that don't support ES6 Modules you can use xtal-fetch.js.  



### To use  \<xtal-fetch\>

>npm install xtal-fetch

or

```html
<script src="https://unpkg.com/xtal-fetch@0.0.97/xtal-fetch.js?module"></script>
```


As mentioned, if you don't need all the functionality of xtal-fetch.js, replace the above links with xtal-fetch-lite.

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

In the event that multiple xtal-fetch tags share the same base URL, xtal-fetch supports the use of the [link rel="preconnect"](https://w3c.github.io/resource-hints/#preconnect) tag to specify the base url.  A unique ID should be given to that link, inside the document.head tag, typically:

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

Possible values for "as" are "json" and "text."

The results of the fetch can be inserted inside the xtal-fetch tag, becoming a glorified client-side "include":

```html
<xtal-fetch fetch href="https://myDomain/myPath/mySubpath" as="text" insert-results></xtal-fetch>
```

Note, though, that if using a relative path for href, it will be relative to the url of the hosting page, not the url of the component definition.


## Caching

xtal-fetch supports caching, by setting attribute/property cache-results attribute.  The presence of the attribute (or property value of the empty string) results in caching locally to that instance.  Value of "global" allows multiple instances to share from the same cache.

## Abort support

Set the "abort" property of your xtal-fetch instance to true in order to "manually" abort any running request.  The component also automatically aborts request if a new request is made before the previous request finished.



## Multiple requests [Work In Progress]

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

[Demo](https://jsfiddle.net/bahrus/6Ls9yuxj/3/)

<!--
```
<custom-element-demo>
  <template>
      <div>
        <link rel=preconnect id=baseSampleJsonFolder href="https://cdn.jsdelivr.net/">
        <template id=personTemplate>
          <li><div>Name: |.name|</div><div>Email: |.email|</div></li>
        </template>
        <xtal-fetch disabled=2 base-link-id=baseSampleJsonFolder fetch href="npm/xtal-fetch/demo/generated.json" as=json></xtal-fetch>
        <p-d on=fetch-complete to=[-view-model] m=1></p-d>
        <p-d on=fetch-complete to=[-in-entities] m=1></p-d>
        <trans-render -view-model><script nomodule>({
          ul: ({ctx, target}) => ctx.repeat(personTemplate, ctx, ctx.viewModel.length, target, {
              li: ({idx}) => ({
                div: ({ctx, target}) => ctx.interpolate(target, 'textContent', ctx.viewModel[idx])
              })
          })         
        })</script></trans-render>         
        <div>
          <ul></ul>
        </div>
        
        <template id="fileTemplate">
          <li>Message |.message|</li>
        </template>
        <xtal-fetch disabled base-link-id="baseSampleJsonFolder" fetch href="npm/xtal-fetch/demo/detail_:_id.json" for-each="_id" -in-entities  as="json"   set-path="detail_contents"></xtal-fetch>
        <p-d on=fetch-complete to=[-view-model] m=1></p-d>
        <trans-render -view-model><script nomodule>({
          ul: ({ctx, target}) => ctx.repeat(fileTemplate, ctx, ctx.viewModel.length, target, {
              li: ({ctx, idx, target}) => ctx.interpolate(target, 'textContent', ctx.viewModel[idx].detail_contents)
          })          
        })</script></trans-render>
        <div>
          <ul></ul>
        </div>
        <script type="module" src="https://unpkg.com/p-et-alia@0.0.74/p-d.js?module"></script>
        <script type="module" src="https://unpkg.com/xtal-fetch@0.0.76/xtal-fetch-entities.js?module"></script>
        <script type="module" src="https://unpkg.com/trans-render@0.0.143/trans-render.js?module"></script>
      </div>
</template>
</custom-element-demo>
```
-->


## Viewing Your Element

```
$ npm run serve
```

## Running Tests

```
$ npm run test
```
