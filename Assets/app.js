// app.js

// Get the list of instruction steps and convert into an array
var steps = Array.from(document.querySelector(".instructions-wrapper").getElementsByTagName("li"));

findIngredients();

var alanBtnInstance = alanBtn({
    key: "6a42915f81bec84a1c380cfb0be7b3f02e956eca572e1d8b807a3e2338fdd0dc/stage", 
    onCommand: function (commandData) {
        if (commandData.command === "sendInstruction") {
            sendInstruction(commandData.firstStep);
        } else if (commandData.command == "highlightInstruction") {
            highlight();
        } 
        else if (commandData.command == "getIngredients") {
            sendIngredients();
        }
        else if (commandData.command == "getQuantity") {
            sendQuantity(commandData.ingredient);
        }
    },
    rootEl: document.getElementById("alan-btn"),
});

let currStepNum = 0;

function getNextStep(steps, firstStep) {
    if (firstStep === true) {
        currStepNum == 0;
    }
    else 
        currStepNum += 1;
    if (currStepNum >= steps.length) {    // if run out of steps
        return "Your recipe is complete! Enjoy your meal";
    }
    return steps[currStepNum].innerText;
}

function sendInstruction(firstStep) {
    let currInstruction = getNextStep(steps, firstStep);
    alanBtnInstance.callProjectApi("getInstruction", {"data": currInstruction}, function(error, result) {
        if (error) {
            console.error(error);
            return;
        }
        console.log(result);
    });
};

function highlight(){
    for (let i = 0; i < steps.length; i++) {
        steps[i].style.backgroundColor = "#FFF";
    }
    steps[currStepNum].style.backgroundColor = "#FFFF99";
}
function findIngredients() {
    var ingredientNodeList = document.querySelectorAll(".ingredient-name");
    let ingredientNames = "";
    for (let i = 0; i < ingredientNodeList.length; i++) {
        ingredientNames += "|" +ingredientNodeList[i].innerText;
    }
    // console.log(ingredientNames);
    return ingredientNames;
}

function sendIngredients() {
   let ingredientDescription = findIngredients();
    alanBtnInstance.callProjectApi("getIngredients", {"data": ingredientDescription}, function(error, result) {
    if (error) {
        console.error(error);
        return;
    }
    console.log(result);
});
}

function sendQuantity(ingredient) {

}