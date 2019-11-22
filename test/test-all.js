const xt = require('xtal-test/index');
async function customTestsGet(page) {
    await customTests(page, 1, 'test/fly-get.html', false);
}
async function customTestsReq(page) {
    await customTests(page, 1, 'test/fly-req.html', true);
}
async function customTests(page, noOfExpectedMarkings, path, end) {
    await page.waitFor(4000);
    const errorTags = await page.$$('[err=true]');
    if (errorTags.length > 0)
        throw 'Found tag with attribute err=true';
    const markings = await page.$$('[mark]');
    if (markings.length !== noOfExpectedMarkings) {
        throw "Found " + markings.length + " tags with attribute mark.  Expecting " + noOfExpectedMarkings;
    }
}
(async () => {
    await xt.runTests([
        {
            path: 'test/fly-get.html',
            customTest: customTestsGet
        },
        {
            path: 'test/fly-req.html',
            customTest: customTestsReq
        }
    ]);
    console.log("Tests Passed.  Have a nice day.");
})();
