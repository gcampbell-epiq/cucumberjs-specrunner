CucumberJS Spec Runner
=====================

Purpose
---------------------
The purpose of this project is it provide a convenient way to get started with CucumberJS. 
Out of the box, [CucumberJS](https://github.com/cucumber/cucumber-js "github.com/cucumber/cucumber-js")
provides a flexible API for running gerkin "features" against JS step definitions. However,
establishing an environment in which to make use of the CucumberJS API is left up to the
developer. This project provides that environment in a structured, robust way.

Features
---------------------
* Runs tests and presents results in browser
* Provides runtime and script for executing tests headlessly using [PhantomJS](https://github.com/ariya/phantomjs/ "github.com/ariya/phantomjs")
* Built-in support for RequireJS
* Simple, extensible configuration
* Tests are run in isolatation

Setup
---------------------
1. Pull the [cucumberjs-specrunner](https://www.nuget.org/packages/cucumberjs-specrunner/) package into 
your web project from nuget.
`PM> Install-Package cucumberjs-specrunner`
2. Under the new ClientTests folder, open Host/test-host.config.js. This is where you will configure your 
test environment. Configuration involves:
	* Optionally setting up a few paths (your app root, your require.js file)
	* Optionally adding common script dependencies to be loaded for each test, (e.g. jquery, KO, etc)
	* Registering features to be tested
3. Create feature & step files organized as you please under ClientTests/Specs. Feature & step files are 
expected to be siblings within a directory, and their file names should end with .feature.txt & .step.js
respectively.
4. Open ClientTests/Host/test-host.html in a browser to run your tests and view the result. You can 
serve test-host.html from the filesystem (e.g. file:///c:/[path to project]/clienttests/host/test-host.html)
or over http.
5. _Optional_ To run tests from the command line, run phantomjs.exe with parameters as 0) path to 
test-host.phantom.js, and 1) filesystem url to test-host.html. For example,
`c:\MyProject\ClientTests\Host\Resources\Scripts\phantomjs-1.9.2-windows\phantomjs.exe "c:\MyProject\ClientTests\Host\test-host.phantom.js" "file:///c:/MyProject/ClientTests/Host/test-host.html"`