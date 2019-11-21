import { IXtalTestRunner, IXtalTestRunnerOptions } from 'xtal-test/index.js';
const xt = require('xtal-test/index') as IXtalTestRunner;
const test = require('tape');
import { Page } from "puppeteer"; //typescript
import { Test } from "tape";
async function customTests(page: Page) {
    await page.waitFor(4000);
    const errorTags = await page.$$('[err=true]');
    const markings = await page.$$('[mark]');
    const TapeTestRunner = {
        test: test
    } as Test;
    TapeTestRunner.test('testing fly-req.html', (t: any) => {
        t.equal(errorTags.length, 0);
        t.equals(markings.length, 1);
        t.end();
    });

}

(async () => {
    await xt.runTests({
        path: 'test/fly-req.html'
    }, customTests);
})();

