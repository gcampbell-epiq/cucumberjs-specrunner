define(function () {
    function Calculator() {
        this.NumbersEntered = [];
        this.Sum = null;
    }

    Calculator.prototype.enterNumber = function (number) {
        this.NumbersEntered.push(number);
    };

    Calculator.prototype.add = function () {
        this.Sum = 0;
        for (var i = 0; i < this.NumbersEntered.length; i++) {
            this.Sum += this.NumbersEntered[i];
        }
    };

    return Calculator;
});