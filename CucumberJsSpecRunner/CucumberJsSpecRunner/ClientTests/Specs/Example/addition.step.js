TestContext.test(['viewmodels/calculator'], function (Calculator) {
    return function () {
        var resetContext = function () {
                return context = {
                    calculator: new Calculator()
                };
            },
            context = resetContext();

        this.Given(/^I have entered (.*) into the calculator$/, function (number, callback) {
            context.calculator.enterNumber(parseInt(number, 10));
            callback();
        });

        this.When(/^I press add$/, function (callback) {
            context.calculator.add();
            callback();
        });

        this.Then(/^the result should be (.*) on the screen$/, function (result, callback) {
            if (context.calculator.Sum === parseInt(result, 10)) {
                callback();
            } else {
                callback.fail();
            }
        });
    };
});
