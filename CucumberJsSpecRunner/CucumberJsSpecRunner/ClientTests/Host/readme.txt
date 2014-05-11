Configuration 
	Modify test-host.config.js to add tests and configure app-specific setup

Running in browser
	Navigate to the filesystem URL for test-host.html. Tests run automatically.
	file:///c:/[my+project+path]/ClientTests/Host/test-host.html
	
	It is recommended that you debug tests using SAFARI. Browser limitations in IE and Chrome make debugging more difficult. 
	In IE, exceptions do not provide file name and line number. 
	In Chrome, security settings block certain activities and content, however using a command options, you can get around this. e.g. chrome.exe --allow-file-access-from-files

Running in console
	Run phantomjs.exe with arguments for 0) the filesystem path to the test-host.PHANTOM.JS file and 1) the filesystem URL for the test-host.HTML file
	Example:
	c:\[my project path]\ClientTests\Host\Resources\Scripts\phantomjs-1.9.2-windows\phantomjs.exe "c:\[my project path]\ClientTests\Host\test-host.phantom.js" "file:///c:/[my project path]/ClientTests/Host/test-host.html"

	Debugging tests in phantomjs can be done. For more info, http://phantomjs.org/release-1.5.html
