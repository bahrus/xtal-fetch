const xt = require('xtal-test/index');
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
