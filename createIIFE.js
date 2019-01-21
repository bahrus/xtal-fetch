//@ts-check
const jiife = require('jiife');
const xl = 'node_modules/xtal-latx/';
jiife.processFiles([xl + 'define.js', xl + 'xtal-latx.js', xl + 'base-link-id.js', 'xtal-fetch-get.js', 'xtal-fetch-req.js', 'xtal-fetch-entities.js'], 'dist/xtal-fetch.iife.js');




