const fs = require('fs-extra')
try{
    fs.copySync('build/ES5/src/v0/xtal-fetch.js', 'build/ES5/xtal-fetch.js')
    fs.copySync('build/ES6/src/v0/xtal-fetch.js', 'build/ES6/xtal-fetch.js')
    fs.copySync('build/ES5/src/v0/xtal-fetch.html', 'build/ES5/xtal-fetch.html')
    fs.copySync('build/ES6/src/v0/xtal-fetch.html', 'build/ES6/xtal-fetch.html')
}catch(err){
    console.error(err);
}
