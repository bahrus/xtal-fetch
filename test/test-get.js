const xt = require('xtal-test/index');
const test = require('tape');
async function customTests(page) {
    await page.waitFor(4000);
    const errorTags = await page.$$('[err=true]');
    const markings = await page.$$('[mark]');
    const TapeTestRunner = {
        test: test
    };
    TapeTestRunner.test('testing fly-get.html', (t) => {
        t.equal(errorTags.length, 0);
        t.equals(markings.length, 1);
        t.end();
    });
}
(async () => {
    await xt.runTests({
        path: 'test/fly-get.html'
    }, customTests);
})();
