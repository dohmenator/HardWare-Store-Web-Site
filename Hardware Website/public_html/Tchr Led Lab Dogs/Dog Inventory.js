/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

function init() {
    setupAccordionStyle();
    /*
     * Once the data comes back from the async getData function call parseData
     * sending it the data and an array to populated with Dog objects
     */
    getData()
        .then(theData => {
            let arrDogs = [];
            parseData(theData, arrDogs);
            /*once data is parsed create the filter boxes by iterating through
            the array of Dog objects.
            NOTE: This getData promise? is acting as the driver b/c it waits until the 
            data is fetched and returned. Once it's returned we can do stuff with the 
            returned data (which is in the arrDogs array).
            */
            //console.log(arrDogs);
            createBreedsFilterBox(arrDogs);
            createNamesFilterBox(arrDogs);
            //TODO:  Call functions to create the other filter boxes


            displayAllDogs(arrDogs);
            addEventListenerChkBoxes(arrDogs);

        })
        .catch(error => {
            console.log('error');
            console.error(error);
        });
    //console.log(arrDogs) //this works ok but the following not so good 
    //this will throw a 'undefined' runtime error
    //createBreddsFilterBox(arrDogs) b/c I think the data is not done getting parsed
    //into it's individual dog objects and pushed onto the arrDogs array

}

async function getData() {
    const response = await fetch('Dog Inventory.csv', { mode: 'no-cors' });
    return response.text();
}
//OR??
//const getData = async() => {
//        const response = await fetch('Dog Inventory.csv');    
//        const data = await response.text();
//        return data;
//    };


/**
 * Helper function to getData promise above
 * @param {type} theData
 * @returns {undefined}
 */
function parseData(theData, arrDogs) {
    //Get all rows except for the column headings (hence the slice(1))
    var arrayFileData = theData.split("\r\n").slice(1);

    for (const row of arrayFileData) {
        tempArray = row.split(',');
        let curDog = {
            breed: tempArray[0],
            name: tempArray[1],
            numFleas: parseInt(tempArray[2]),
            imageFile: tempArray[3].replace('\r', '')
        };
        arrDogs.push(curDog);
    }

}


function readCSVFileRWWay() {
    fetch('Dog Inventory.csv', { mode: 'no-cors' })
        .then(function(response) {
            if (response.ok) {
                // if the response is fine, handle it like text
                return response.text();
            } else {
                // turn any HTTP errors into an Error so they can be handled the
                // same as network errors (see .catch below)
                throw new Error(`HTTP error ${response.status}`);
            }
        }).then(function(text) { // first, split up each line
            return text.split('\n');
        }).then(function(lines) { // then turn each line into an object
            return lines.map(parseLine);
        }).then(function(items) {
            // items is an array of objects
        }).catch(console.log); // if I don't want to do anything but log

}

/**
 * Helper function to Mr. Wrights fetch method above
 * @param {type} line
 * @returns {parseLine.Dog InventoryAnonym$0}
 */
function parseLine(line) {
    const curDog = line.split(',');
    return {
        "breed": curDog[0],
        "name": curDog[1],
        "numFleas": parseInt(curDog[2])
    };
}

function setupAccordionStyle() {
    /*The following JS code came from:
    https://www.w3schools.com/howto/tryit.asp?filename=tryhow_js_accordion_symbol*/

    var acc = document.getElementsByClassName("accordion");
    for (const element of acc) {
        element.addEventListener("click", toggleElement);
    }
}

function toggleElement() {
    this.classList.toggle("active");
    var panel = this.nextElementSibling;
    if (panel.style.maxHeight) {
        panel.style.maxHeight = null;
    } else {
        panel.style.maxHeight = panel.scrollHeight + "px";
    }
}


function createBreedsFilterBox(theDogObjects) {
    //console.log(theDogObjects[0].breed);
    let parentID = 'breed';
    let theID = 'chkBox';

    let indexBreed = 0;
    let countCurBreed = 0;
    //get first breed
    let curBreed = theDogObjects[indexBreed].breed;
    for (let i = 0; i < theDogObjects.length; i++) {
        if (curBreed === theDogObjects[i].breed) {
            countCurBreed++;
        } else {
            createChkBox(countCurBreed, curBreed, theID, parentID); //came upon a change in breed
            countCurBreed = 0;

            //Get  next breed
            indexBreed = i;
            curBreed = theDogObjects[indexBreed].breed;
            i--; //set i back one so we can count the first of this next breed
        }

    }

    createChkBox(countCurBreed, curBreed, theID, parentID); //create checkboxes for last breed

}

function getBreeds(aDogs) {
    return getCategories(aDogs, "Breed")
}

function getCategories(aDogs, aggregationKey) {
    let aggregate = {};
    for (const dog of aDogs) {
        const value = dog[aggregationKey];
        if (!aggregate[value]) {
            aggregate[value] = 0;
        }
        aggregate[value]++;
    }

    return aggregate;
}


function createNamesFilterBox(theDogObjects) {
    //extract names of dogs into an array
    arrNames = [];
    for (let i = 0; i < theDogObjects.length; i++) {
        if (arrNames.includes(theDogObjects[i].name) === false)
            arrNames.push(theDogObjects[i].name);
    }
    let parentID = 'name';
    let theID = 'chkBox';

    //for each name iterate through all dog objects and get the count 
    for (let i = 0; i < arrNames.length; i++) {
        let count = getCount(theDogObjects, arrNames[i]);
        createChkBox(count, arrNames[i], theID, parentID); //came upon a change in breed
    }
}

function getCount(theDogObjects, curName) {
    //console.log(theDogObjects[0].breed);    

    let countCurName = 0;
    //get first breed
    //let curName = theDogObjects[indexName].name;
    for (let i = 0; i < theDogObjects.length; i++) {
        if (curName === theDogObjects[i].name) {
            countCurName++;
        }
    }
    return countCurName;


}


/**
 * For each diffent breed,  name, numFleas create a check box with a label(to make text shown
   next to checkbox clickable, and add a span element to host the text
    (the breed name) next to the checkbox
    Source = https://stackoverflow.com/questions/10143211/javascript-innerhtml-of-checkbox
 * @param {string} count the value that goes between the ( )'s in the spans innerhtml
 * @param {string} theBreed vale to use for the spans innerhtml prop
 * @param {string} theClassName the classname value to set to the property to
 * @returns {undefined}
 */
function createChkBox(count, theItem, theID, parentID) {
    //NOTE: I should receive the className and set only the className not the ID
    let parentDiv = document.getElementById(parentID);


    let chkBox = document.createElement("INPUT");
    let newLabel = document.createElement("LABEL");
    //newLabel.for = theID; //this did not work for me
    //newLabel.innerHTML=theItem.toLowerCase(); //this did not work for me
    let spanChkBoxText = document.createElement("SPAN");

    //Set appropriate attributes        
    chkBox.type = "checkbox";
    chkBox.id = theID;

    chkBox.className = 'chkBox'; //to be used to later when adding eventListeners
    chkBox.value = theItem.toLowerCase();
    spanChkBoxText.innerHTML = theItem;

    newLabel.appendChild(chkBox);
    newLabel.appendChild(spanChkBoxText);

    //create a span element to hold the amount of current item in inventory
    let spanAmount = document.createElement("SPAN");
    spanAmount.innerHTML = "&nbsp;(" + count + ")<br>";
    //parentDiv.appendChild(chkBox); //this did not work for me
    parentDiv.appendChild(newLabel);
    parentDiv.appendChild(spanAmount);

}


function displayAllDogs(arrDogs) {
    arrDogs.map(createImageTag);
}

function createImageTag(curDog) {
    //Get Parent container
    parentContainer = document.getElementById('dogInventory');
    tempImageTag = document.createElement("IMG");
    tempImageTag.className = 'dogImage';
    tempImageTag.alt = 'Image of Dog';
    tempImageTag.src = curDog.imageFile;
    parentContainer.appendChild(tempImageTag);
}


/**
 * Get all inputs from index page. If input is of type checkbox add a click
 * event listener to it.  Upon it being clicked (or its text clicked) send
 * current checkbox to the filterContent method
 */
function addEventListenerChkBoxes(arrDogs) {
    arrayChkBoxes = document.getElementsByClassName("chkBox");

    for (var i = 0; i < arrayChkBoxes.length; i++) {
        arrayChkBoxes[i].addEventListener("click", function() {
            filterContent(arrDogs);
        });
    }

}

function filterContent(arrDogs) {
    //alert('filtering content');
    arrTheSelected = getAllCheckedBoxes();
    arrSelectedDogs = getSelectedDogs(arrTheSelected, arrDogs);
    console.log("Selected Dogs: ", arrSelectedDogs);
}

function getAllCheckedBoxes() {
    theSelected = [];
    arrayChkBoxes = document.getElementsByClassName("chkBox");

    for (let i = 0; i < arrayChkBoxes.length; i++) {
        if (arrayChkBoxes[i].checked)
            theSelected.push(arrayChkBoxes[i]);
    }

    return theSelected;

}

function getSelectedDogs(arrSelectedDogs, arrDogs) {
    tempArrDogs = [];
    for (let i = 0; i < arrSelectedDogs.length; i++) {
        for (let k = 0; k < arrDogs.length; k++) {
            //checking value of chkbox to each dogs breed, name
            if (arrSelectedDogs[i].value === arrDogs[k].breed.toLowerCase()) {
                tempArrDogs.push(arrDogs[i].breed);
                break;
            }

            if (arrSelectedDogs[i].value === arrDogs[k].name.toLowerCase()) {
                tempArrDogs.push(arrDogs[k].name);
                break;
            }


        }

    }

    return tempArrDogs;
}