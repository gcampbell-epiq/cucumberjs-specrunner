window.TestHost = (function () {
    function TestHost() {
        this.Tests = [];
        this.Config = {
            commonDependencies: [],
            requirePath: '~/App/durandal/amd/require.js',
            rootPath: '../../',
            requireConfig: {
                baseUrl: '../../App'
            }
        };

        this.CurrentTest = null;
        this.TestingCompletedHandler = null;
        this.ErrorMessageReceivedHandler = null;
        this.TestDoneHandler = null;
    }

    TestHost.prototype.registerTest = function (specPath, dependencies) {
        this.Tests.push(new Test(specPath, dependencies));
    };

    TestHost.prototype.consoleLog = function (message) {
        if (window.console) {
            console.log(message);
        }
    };
    TestHost.prototype.logTestStart = function () {
        this.consoleLog('TestRunning');
    };
    TestHost.prototype.logTestCompletion = function () {
        this.consoleLog('TestCompleted');
    };

    TestHost.prototype.configure = function (config) {
        this.Config = $.extend(this.Config, config);
    };

    TestHost.prototype.run = function (idx, singleTest) {
        var self = this,
            idx = idx || 0;
        
        this.logTestStart();

        function runner() {
            var test = self.Tests[idx];
            self.CurrentTest = test;

            if (test) {
                test.ErrorMessageReceivedHandler = function (message) {
                    if (self.ErrorMessageReceivedHandler) {
                        self.ErrorMessageReceivedHandler(message)
                    }
                };
                test.run().done(function () {
                    if (self.TestDoneHandler) {
                        self.TestDoneHandler(test);
                    }
                    if (!singleTest) {
                        setTimeout(function () {
                            idx += 1
                            runner();
                        }, 1);
                    } else {
                        self.complete();
                    }
                });
            } else {
                self.complete();
            }
        }
        runner();
    };

    TestHost.prototype.complete = function () {
        this.logTestCompletion();
        if (this.TestingCompletedHandler) {
            this.TestingCompletedHandler();
        }
    };

    TestHost.prototype.attachContext = function (context) {
        var contextConfig = $.extend({}, this.Config, {
            test: this.CurrentTest,
            rootPath: '../../' + this.Config.rootPath
        });

        context.load(contextConfig);
    };

    TestHost.prototype.getStats = function () {
        var tests = this.Tests,
            stats = {
                featuresTested: tests.length,
                passed: 0,
                failed: 0,
                failedTests: []
            };

        for (var i = 0; i < tests.length; i++) {
            var testStats = tests[i].Stats;
            if (testStats) {
                stats.passed += testStats.ScenariosPassed;
                stats.failed += testStats.ScenariosFailed;
                for (var ii = 0; ii < testStats.Scenarios.length; ii++) {
                    var scen = testStats.Scenarios[ii];
                    if (testStats.Scenarios[ii].failed) {
                        stats.failedTests.push(testStats.Feature + ' > ' + scen.name);
                    }
                }
            }
        }

        return stats;
    };


    function Test(specPath, dependencies) {
        this.SpecPath = specPath;
        this.Dependencies = dependencies || [];
        
        this.Stats = null;
        this.iFrame = null;
        this.HostDeferred = null;
        this.ErrorMessageReceivedHandler = null;
    }

    Test.prototype.run = function () {
        this.HostDeferred = $.Deferred();

        this.iFrame = $('<iframe src="Resources/Pages/test-context.html" />');
        $('body').append(this.iFrame);

        return this.HostDeferred;
    };

    Test.prototype.logException = function (exInfo) {
        if (this.ErrorMessageReceivedHandler) {
            this.ErrorMessageReceivedHandler(exInfo);
        }
    };

    Test.prototype.finish = function (stats) {
        this.Stats = stats;
        this.end();
    };

    Test.prototype.end = function () {
        this.iFrame.remove();
        this.HostDeferred.resolve();
    };

    Test.prototype.requestFeature = function (path) {
        var feature = '';

        $.ajax({
            url: path,
            async: false,
            cache: false
        }).done(function (data) {
            feature = data;
        });

        return feature;
    };

    return new TestHost();
})();