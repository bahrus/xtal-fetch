const xt = require('xtal-test/index');
(async () => {
    const passed = await xt.runTests([
        {
            path: 'test/fly-get.html',
            expectedNoOfSuccessMarkers: 1,
        },
        {
            path: 'test/fly-req.html',
            expectedNoOfSuccessMarkers: 1,
        },
        // {
        //     path: 'test/for-instance1.html',
        //     expectedNoOfSuccessMarkers: 1,
        // }
    ]);
    if (passed)
        console.log("Tests Passed.  Have a nice day.");
})();

