import { IXtalTestRunner, IXtalTestRunnerOptions } from 'xtal-test/index.js';
const xt = require('xtal-test/index') as IXtalTestRunner;
const test = require('tape');
import { Page } from "puppeteer"; //typescript
import { Test } from "tape";

async function customTestsGet(page: Page) {
    await customTests(page, 1, 'test/fly-get.html');
}

async function customTestsReq(page: Page) {
    await customTests(page, 1, 'test/fly-req.html');
}

async function customTests(page: Page, noOfExpectedMarkings: number, path: string){
    await page.waitFor(4000);
    const errorTags = await page.$$('[err=true]');
    const markings = await page.$$('[mark]');
    const TapeTestRunner = {
        test: test
    } as Test;
    TapeTestRunner.test(`testing ${path}`, (t: any) => {
        t.equal(errorTags.length, 0);
        t.equals(markings.length, 1);
        t.end();
    });
}

(async () => {
    await xt.runTests({
        path: 'test/fly-get.html'
    }, customTestsGet);
    await xt.runTests({
        path: 'test/fly-req.html'
    }, customTestsReq);
})();

