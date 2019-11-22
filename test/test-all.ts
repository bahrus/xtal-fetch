import { IXtalTestRunner, IXtalTestRunnerOptions } from 'xtal-test/index.js';
const xt = require('xtal-test/index') as IXtalTestRunner;


(async () => {
    await xt.runTests([
        {
            path: 'test/fly-get.html',
            expectedNoOfSuccessMarkers: 1,

        },
        {
            path: 'test/fly-req.html',
            expectedNoOfSuccessMarkers: 1,
        }
    ]);
    console.log("Tests Passed.  Have a nice day.");
})();

