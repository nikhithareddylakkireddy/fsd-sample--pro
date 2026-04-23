// Function Declaration
function add(a, b) {
    return a + b;
}
// Function Expression
const subtract = function(a, b) {
    return a - b;
};
// Arrow Function
const multiply = (a, b) => a * b;
function showFunctions() {
    document.getElementById("output").innerHTML =
        "Addition: " + add(5, 3) + "<br>" +
        "Subtraction: " + subtract(5, 3) + "<br>" +
        "Multiplication: " + multiply(5, 3);
}

