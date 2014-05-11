var system = require('system'),
    page = require('webpage').create();


// if testing does not start after 10 seconds, then fail
var pageLoadTimeoutLength = 1000 * 10,
    pageLoadTimeout = setTimeout(function () {
        console.log('Timeout while loading page, tests did not start after page load max wait period of ' + pageLoadTimeoutLength + ' milliseconds');
        phantom.exit(4);
    }, pageLoadTimeoutLength),

// if testing does not complete after n minutes, then fail
    testCompletionTimeout = null,
    testCompletionTimeoutMinutes = 10, // ! set number of minutes to wait before failing tests due to timeout
    testCompletionTimeoutLength = 1000 * 60 * testCompletionTimeoutMinutes,
    testCompletionTimeoutHandler = function () {
        console.log('Timeout while running tests, tests did not finish after max wait period of ' + testCompletionTimeoutLength + ' milliseconds');
        phantom.exit(2);
    },

// on completion, check the test stats
    testingCompleted = function () {
        var testStats = page.evaluate(function () {
                return TestHost.getStats();
            }),
            exitCode = testStats.failed === 0 ? 0 : 1;

        console.log('Testing Completed|Features Tested: ' + testStats.featuresTested + '|Scenarios Passed: ' + testStats.passed + '|Scenarios Failed: ' + testStats.failed);

        if (!testStats.failed > 0) {
            for (var i = 0, len = testStats.failedTests.length; i < len; i++) {
                console.log('Failed Scenario: ' + testStats.failedTests[i]);
            }
        }

        phantom.exit(exitCode);
    };

// communication is done through log messages from the page
page.onConsoleMessage = function (msg) {
    if (msg === 'TestCompleted') {
        clearTimeout(testCompletionTimeout);
        testingCompleted();
    } else if (msg === 'TestRunning') {
        clearTimeout(pageLoadTimeout);
        testCompletionTimeout = setTimeout(testCompletionTimeoutHandler, testCompletionTimeoutLength);
    }
};

// load the page!
page.open(system.args[1], function (status) {
    if (status !== 'success') {
        console.log('Unable to open page. URL: ' + system.args[1]);
        phantom.exit(3);
    }
});

