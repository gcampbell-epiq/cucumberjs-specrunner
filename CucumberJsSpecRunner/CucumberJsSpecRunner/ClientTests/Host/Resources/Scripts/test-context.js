/// <reference path="test-stats.js" />
window.TestContext = (function () {
    var getHost = function () {
        return window.parent.TestHost;
    };

    function TestContext() {
        this.Test = null;
        this.RequirePath = null;
        this.RootPath = null;
        this.RequireConfig = null;

        this.TestModuleDef = null;
        getHost().attachContext(this);
    }

    TestContext.prototype.load = function (config) {
        this.Test = config.test;
        this.RequirePath = config.requirePath;
        this.RootPath = config.rootPath;
        this.RequireConfig = config.requireConfig;
        this.loadDependencies(config.commonDependencies);
        this.loadDependencies(this.Test.Dependencies);
        this.loadDependencies(['../../../Specs/' + this.Test.SpecPath + '.step.js']);
    };

    TestContext.prototype.loadDependencies = function (externalDependencies) {
        if (externalDependencies) {
            for (var i = 0; i < externalDependencies.length; i++) {
                var dep = externalDependencies[i];
                if (dep.match(/^~\//)) {
                    dep = this.RootPath + dep.substring(2);
                }
                document.write('<script src="' + dep + '" type="text/javascript"></script>');
            }
        }
    };

    TestContext.prototype.addAmdMocks = function(paths) {
        /// <summary>Pass amd path overrides</summary>
        /// <param name="paths" type="Object">Paths { 'requested/path': 'path/to/respond/with' }</param>

        this.RequireConfig = this.RequireConfig || {};
        this.RequireConfig.paths = $.extend(this.RequireConfig.paths, paths);
    };

    TestContext.prototype.test = function (amdDependencies, testModule) {
        if (arguments.length < 2) {
            // if only the first arg is passed, it is the test module, and amd is not enabled
            testModuleDef = amdDependencies;
            this.TestModuleDef = function(callback) {
                callback(testModuleDef);
            };
        } else {
            this.loadDependencies([this.RequirePath]);
            this.TestModuleDef = function(callback) {
                require.config(this.RequireConfig);
                require(amdDependencies, function() {
                    callback(testModule.apply(null, arguments));
                });
            };
        }

        document.write('<script type="text/javascript">document.onready = function() { TestContext.testReady(); }</script>');
    };

    TestContext.prototype.testReady = function () {
        var self = this,
            testDef = null,
            feature = null,
            req = new XMLHttpRequest(),
            onTestPreparationComplete = function () {
                if (!feature || !testDef) {
                    self.Test.finish(TestStats.InitializationFailedStats(self.Test.SpecPath))
                } else {
                    self.runCucumber(testDef, feature);
                }
            };

        feature = this.Test.requestFeature('../Specs/' + this.Test.SpecPath + '.feature.txt');

        this.TestModuleDef(function (result) {
            testDef = result;
            onTestPreparationComplete();
        });
    };

    TestContext.prototype.runCucumber = function (testDef, feature) {
        var self = this,
            cuc = Cucumber(feature, testDef),
            statsListener = new StatsListener();

        statsListener.ExceptionInfoListener = function (ex) {
            self.Test.logException(ex);
        };

        cuc.attachListener(statsListener);
        cuc.start(function () {
            // on finish
            self.Test.finish(statsListener.getStats());
        });
    };



    function StatsListener() {
        this.Stats = new TestStats();
        this.CurrScen = null;
        this.ExceptionInfoListener = null;
    }

    StatsListener.prototype.hear = function (evt, callback) {
        var evtName = evt.getName();
        switch (evtName) {
            case 'BeforeFeature':
                {
                    this.Stats.setFeatureName(evt.getPayloadItem('feature').getName());
                }
                break;
            case 'BeforeScenario':
                {
                    this.CurrScen = evt.getPayloadItem('scenario').getName();
                    this.Stats.addScenario(this.CurrScen);
                }
                break;
            case 'StepResult':
                {
                    var evtData = evt.getPayloadItem('stepResult'),
                        step = evtData.getStep(),
                        name = step.getKeyword() + ' ' + step.getName(),
                        status = 'skipped';

                    if (evtData.isUndefined() || evtData.isSkipped()) {
                        status = 'skipped';
                    } else if (evtData.isSuccessful()) {
                        status = 'passed';
                    } else if (evtData.isPending()) {
                        status = 'pending';
                    } else {
                        if (evtData.isFailed()) {
                            this.Stats.logScenarioFail(this.CurrScen, step.getKeyword() + step.getName() + ' (line: ' + step.getLine() + ')');
                            var exception = evtData.getFailureException();
                            if (exception && exception.message !== 'Step failure' && this.ExceptionInfoListener) {
                                var ex = this.Stats.Feature + ' > ' + this.CurrScen + ' > ' + step.getName();
                                ex += '\r\n' + (exception.stack || exception);
                                if (exception.sourceURL) {
                                    ex += '\r\n' + exception.sourceURL + (exception.line ? ' (line: ' + exception.line + ')' : '');
                                }
                                this.ExceptionInfoListener(ex);
                            };
                        }
                        status = 'failed';
                    }

                    this.Stats.addStep(this.CurrScen, name, status);
                }
                break;
            case 'AfterScenario':
                {
                    this.Stats.logScenarioDone(this.CurrScen);
                }
                break;
        }
        callback();
    };

    StatsListener.prototype.getStats = function () {
        return this.Stats;
    };

    return new TestContext();
})();
