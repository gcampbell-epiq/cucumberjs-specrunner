window.TestStats = (function () {
    function TestStats() {
        this.Feature = null;
        this.ScenariosFailed = 0;
        this.ScenariosPassed = 0;
        this.ScenarioLookups = {};
        this.Scenarios = [];
        this.FailureLog = [];
        this.Failed = false;
        this.Message = null;
    }

    TestStats.prototype.addScenario = function (name) {
        this.Scenarios.push(this.ScenarioLookups[name] = {
            name: name,
            steps: [],
            failed: false
        });
    };

    TestStats.prototype.addStep = function (scenario, step, status) {
        this.ScenarioLookups[scenario].steps.push({
            name: step,
            status: status
        });
    };

    TestStats.prototype.logScenarioFail = function (scenario, step) {
        this.ScenariosFailed++;
        this.Failed = true;
        this.ScenarioLookups[scenario].failed = true;
        this.FailureLog.push({
            scenario: scenario,
            step: step
        });
    };

    TestStats.prototype.logScenarioDone = function (scenario) {
        if (!this.ScenarioLookups[scenario].failed) {
            this.ScenariosPassed++;
        }
    };

    TestStats.prototype.setFeatureName = function (name) {
        this.Feature = name;
    };

    TestStats.InitializationFailedStats = function (spec) {
        var stats = new TestStats();
        stats.Message = 'Failed to initialize test ' + spec;
        stats.Failed = true;
        return stats;
    };

    return TestStats;
})();