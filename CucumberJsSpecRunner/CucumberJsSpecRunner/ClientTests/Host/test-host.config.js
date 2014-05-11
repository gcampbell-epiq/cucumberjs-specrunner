/// <reference path="test-host.js" />

// 1. configure test environment
TestHost.configure({
    // commonDependencies: paths to js files that are commonly used by code under test
    // full URLs or relative paths (~/ is OK to use) are accepted
    commonDependencies: [
        'https://cdnjs.cloudflare.com/ajax/libs/jquery/1.10.1/jquery.js',
        'https://cdnjs.cloudflare.com/ajax/libs/knockout/2.2.1/knockout-min.js',
    ],
    // requirePath: relative path to require.js for testing amd modules
    requirePath: '~/App/libraries/requirejs/require.js', 
    // rootPath: path (from the test-host.html file) to root of project content, this establishes the meaning of '~/' for dependency paths
    rootPath: '../../',
    // requireConfig: standard configuration for require, this can be overridden by .step files
    requireConfig: {
        baseUrl: '../../../../App' // relative to test-context.html
    }
});

// 2. add features to be tested
// TestHost.registerTest(specPath, dependencies)
// specPath: path from Specs folder to a feature/step file (i.e. for 'Specs/Grid/grid.step.js', use 'Grid/grid')
// dependencies: array of URLs or relative paths of js libs that are dependencies of the test
TestHost.registerTest('Example/addition');
