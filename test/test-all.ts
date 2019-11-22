import { IXtalTestRunner, IXtalTestRunnerOptions } from 'xtal-test/index.js';
const xt = require('xtal-test/index') as IXtalTestRunner;
import { Page } from "puppeteer"; //typescript


// async function customTestsGet(page: Page) {
//     await customTests(page, 1, 'test/fly-get.html', false);
// }

// async function customTestsReq(page: Page) {
//     await customTests(page, 1, 'test/fly-req.html', true);
// }

// async function customTests(page: Page, noOfExpectedMarkings: number, path: string, end: boolean){
//     await page.waitFor(4000);
//     const errorTags = await page.$$('[err=true]');
//     if(errorTags.length > 0) throw 'Found tag with attribute err=true';
//     const markings = await page.$$('[mark]');
//     if(markings.length !== noOfExpectedMarkings){
//         throw "Found " + markings.length + " tags with attribute mark.  Expecting " + noOfExpectedMarkings
//     }
// }

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

