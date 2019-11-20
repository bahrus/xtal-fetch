import { IXtalTestRunner, IXtalTestRunnerOptions } from 'xtal-test/index.js';
const xt = require('xtal-test/index') as IXtalTestRunner;
const test = require('tape');
import { Page } from "puppeteer"; //typescript
import { Test } from "tape";
async function customTests(page: Page) {
    await page.waitFor(4000);
    const errorTags = await page.$$('[err=true]');
    const endings = await page.$$('[endOfSequence]');
    const TapeTestRunner = {
        test: test
    } as Test;
    TapeTestRunner.test('testing dev.html', (t: any) => {
        t.equal(errorTags.length, 0);
        t.equals(endings.length, 0);
        t.end();
    });

}

(async () => {
    await xt.runTests({
        path: 'test/fly.html'
    }, customTests);
})();

