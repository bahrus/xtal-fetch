const xt = require('xtal-test/index');
const test = require('tape');
async function customTestsGet(page) {
    await customTests(page, 1, 'test/fly-get.html');
}
async function customTestsReq(page) {
    await customTests(page, 1, 'test/fly-req.html');
}
async function customTests(page, noOfExpectedMarkings, path) {
    await page.waitFor(4000);
    const errorTags = await page.$$('[err=true]');
    const markings = await page.$$('[mark]');
    const TapeTestRunner = {
        test: test
    };
    TapeTestRunner.test(`testing ${path}`, (t) => {
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
