/**
 * Created by Rox & Rene on 4/17/17.
 */

'use strict';

(function () {
    var leftInput = document.getElementById('left-input');
    var rightInput = document.getElementById('right-input');
    var middleInput = document.getElementById('middle-input');
    var numbers = document.getElementsByClassName('btn-numbers'); //all get elements by class should have a for loop
    var clear = document.getElementById('btn-clear');
    var equal = document.getElementById('btn-equal');
    var operations = document.getElementsByClassName('btn-operations');

    var numberInputs = function (){
        if(middleInput.value === '') {
            leftInput.value += this.innerHTML;
        } else {
            rightInput.value += this.innerHTML;
        }
    }

    // Numbers
    for(var i=0; i<numbers.length; i++) {
        numbers[i].addEventListener('click', numberInputs );
    }
    var operators = function () {
        middleInput.value = this.innerHTML;
        console.log('operations');
        console.log(this.innerHTML);
    };
    // Operations
    for(var i=0; i<operations.length; i++) {
        operations[i].addEventListener('click', operators);
    }

    function calculate(number1, number2, operation) {
        var result;
        switch (operation) {
            case '+':
                result = number1 + number2;
                break;
            case '-':
                result = number1 - number2;
                break;
            case '*':
                result = number1 * number2;
                break;
            case '/':
                result = number1 / number2;
                break;
            default:
                result = "ERROR";
        }
        return result;
    }

    // Equal button
    equal.addEventListener('click', function () {
        rightInput.value = calculate(parseInt(leftInput.value), parseInt(rightInput.value), middleInput.value);
        leftInput.value = '';
        middleInput.value = '';
    });



    // Clear button
    clear.addEventListener('click', function () {
        leftInput.value = '';
        middleInput.value = '';
        rightInput.value = '';
    });

})();