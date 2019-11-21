const xt = require('xtal-test/index');
const test = require('tape');
async function customTests(page) {
    await page.waitFor(4000);
    const errorTags = await page.$$('[err=true]');
    const endings = await page.$$('[endOfSequence]');
    const TapeTestRunner = {
        test: test
    };
    TapeTestRunner.test('testing dev.html', (t) => {
        t.equal(errorTags.length, 0);
        t.equals(endings.length, 0);
        t.end();
    });
}
(async () => {
    await xt.runTests({
        path: 'test/fly-get.html'
    }, customTests);
})();
