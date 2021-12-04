// app.js
// Handling commands from voice script

// Get the list of instruction steps and convert into an array
let steps = Array.from(document.querySelector(".instructions-wrapper").getElementsByTagName("li"));

// Get ingredients on current page on startup
findIngredients();

var alanBtnInstance = alanBtn({
    key: "6a42915f81bec84a1c380cfb0be7b3f02e956eca572e1d8b807a3e2338fdd0dc/stage", 
    // Command handlers
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
        else if (commandData.command == "getLastStep") {
            sendLastStep();
        }
    },
    rootEl: document.getElementById("alan-btn"),
});

let currStepNum = 0;

// Helper function to increment step and return text instruction
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

// Send current instruction to voice script
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

// Apply yellow highlight to active step
function highlight(){
    for (let i = 0; i < steps.length; i++) {
        steps[i].style.backgroundColor = "#FFF";
    }
    steps[currStepNum].style.backgroundColor = "#FFFF99";
}

// Helper function to get string of ingredients
function findIngredients() {
    var ingredientNodeList = document.querySelectorAll(".ingredient-name");
    let ingredientNames = "";
    for (let i = 0; i < ingredientNodeList.length; i++) {
        ingredientNames += "|" +ingredientNodeList[i].innerText;
    }
    return ingredientNames;
}

// Send string of ingredients to voice script
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

// Send last step back to voice script
function sendLastStep() {
    let lastStep = "";
    currStepNum = currStepNum - 1;
    if (currStepNum < 0) {        // if user is already at the first step
        lastStep = "We are at the first step"; 
        alanBtnInstance.callProjectApi("getLastStep", {"data": lastStep}, function(error, result) {
            if (error) {
                console.error(error);
                return;
            }
            console.log(result);
        })
    }
    lastStep = steps[currStepNum].innerText;
    highlight();
    alanBtnInstance.callProjectApi("getLastStep", {"data": lastStep}, function(error, result) {
        if (error) {
            console.error(error);
            return;
        }
        console.log(result);
    })
}