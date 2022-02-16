//alert("lawnmowers script linked");
//Global array of LawnMower objects
var lawnMowerInventory = [];

function init() {
    requestDataFile("LawnMowers.csv");

    populateFilterBoxes();

    displayMowers(lawnMowerInventory);
}

/**
 * populateFilterBoxes will call several helper methods to create several
 * filter boxes to allow user to filter inventory by brand, price, etc
 */
function populateFilterBoxes() {
    createBrandFilterBox();
    createPriceFilterBox();
    createCuttingWidthFilterBox();
}

/**
 * Filter boxes will contain the following content (in a listbox):
 *  title in bolded text
 *  check box
 *  brand of mower
 *  total amount of that brand in inventory
 * @returns {undefined}
 */
function createBrandFilterBox() {
    var sectionBrand = document.getElementById("brand");
    var curBrand = lawnMowerInventory[0].brand;
    var countOfBrand = 0;
    var index = 0;

    while (index < lawnMowerInventory.length) {
        //Get current brand from inventory array
        curBrand = lawnMowerInventory[index].brand;

        //For each different brand create a check box with a label(to make text shown
        //next to checkbox clickable, and add a span element to host the text
        //(the brand name) next to the checkbox
        var chkBox = document.createElement("INPUT");
        var newLabel = document.createElement("LABEL");
        var spanChkBoxText = document.createElement("SPAN");

        //Set appropriate attributes
        chkBox.type = "checkbox";
        chkBox.className = "chkBox_Brand";
        chkBox.value = curBrand.toLowerCase();
        chkBox.addEventListener("click", filterContent);
        spanChkBoxText.innerHTML = curBrand;

        newLabel.appendChild(chkBox);
        newLabel.appendChild(spanChkBoxText);

        while (index < lawnMowerInventory.length && curBrand === lawnMowerInventory[index].brand) {
            index++;
            countOfBrand++;
        }
        //create div to hold amount of current brand in inventory
        var spanBrandAmount = document.createElement("SPAN");
        spanBrandAmount.innerHTML = "&nbsp;(" + countOfBrand + ")<br>";


        sectionBrand.appendChild(newLabel);
        sectionBrand.appendChild(spanBrandAmount);

        //reset count of current brand back to zero
        countOfBrand = 0;
    } //end while

} //End create createBrandFilterBox() method

function createPriceFilterBox() {
    //get count of lawnmowers prices at the within the ranges above
    var ranges = [
        { min: 50, label: "$50.00 To $100.00", count: 0 },
        { min: 100, label: "$100.00 To $250.00", count: 0 },
        { min: 250, label: "$250.00 To $500.00", count: 0 },
        { min: 500, label: "$500.00 To $1000.00", count: 0 },
        { min: 1000, label: "Over $1000.00", count: 0 },
    ];

    for (const i of lawnMowerInventory) {
        let curPrice = parseInt(i.price);
        let myRange = { count: 0 }; // dummy object
        for (const range of ranges) {
            if (curPrice > range.min) {
                myRange = range;
            } else {
                break;
            }
        }

        myRange.count++;
    }

    //Create label, checkbox, and span elements for the ranges above
    var sectionPrice = document.getElementById("price");
    for (const range of ranges) {
        var priceChkBox = document.createElement("INPUT");
        var newPriceLabel = document.createElement("LABEL");
        var spanChkBoxRange = document.createElement("SPAN");

        //Set appropriate attributes
        priceChkBox.type = "checkbox";
        priceChkBox.className = "chkBox_price";
        priceChkBox.value = range.label;
        priceChkBox.addEventListener("click", filterContent);
        spanChkBoxRange.innerHTML = range.label;

        newPriceLabel.appendChild(priceChkBox);
        newPriceLabel.appendChild(spanChkBoxRange);

        //create div to hold amount of current price range in inventory
        var spanRangeAmount = document.createElement("SPAN");
        spanRangeAmount.innerHTML = "&nbsp;(" + range.count + ")<br>";

        sectionPrice.appendChild(newPriceLabel);
        sectionPrice.appendChild(spanRangeAmount);
    }
} //End createPriceFilterBox method

function createCuttingWidthFilterBox() {
    /*Cutting widths
     *  14 16 17 18 19 20 21 22 30
     */
    var cuttingWidths = ["14 in.", "16 in.", "17 in.", "18 in.", "19 in.",
        "20 in.", "21 in.", "22 in.", "30 in."
    ];
    var countCutWidths = [0, 0, 0, 0, 0, 0, 0, 0, 0];

    for (let i of lawnMowerInventory) {
        const curCutWidth = i.cuttingWidth;
        for (let j = 0; j < cuttingWidths.length; j++) {
            if (cuttingWidths[j].startsWith(curCutWidth)) {
                countCutWidths[j]++;
                break;
            }
        }
    }

    var sectionCuttingWidth = document.getElementById("cuttingwidth");
    for (let i = 0; i < cuttingWidths.length; i++) {
        var ChkBox = document.createElement("INPUT");
        var newLabel = document.createElement("LABEL");
        var spanChkBox = document.createElement("SPAN");

        //Set appropriate attributes
        ChkBox.type = "checkbox";
        ChkBox.className = "chkBox_cutwidth";
        ChkBox.value = cuttingWidths[i].substring(0, 2);
        ChkBox.addEventListener("click", filterContent);
        spanChkBox.innerHTML = cuttingWidths[i];

        newLabel.appendChild(ChkBox);
        newLabel.appendChild(spanChkBox);

        //create div to hold amount of current cutting width in inventory
        var spanAmount = document.createElement("SPAN");
        spanAmount.innerHTML = "&nbsp;(" + countCutWidths[i] + ")<br>";

        sectionCuttingWidth.appendChild(newLabel);
        sectionCuttingWidth.appendChild(spanAmount);

    }

}

/*
 * Get all checked categories, then display content for only categories checked
 */
function filterContent() {
    //Get checked categories
    var arrayCheckedCategories = [];
    getCheckedCategories(arrayCheckedCategories);
    //get lawnmowers associated with checked categories
    var tempInventory = [];
    getFilteredLawnMowers(tempInventory, arrayCheckedCategories);

    //display checked categories
    //displayCheckedCategories(arrayCheckedCategories);
    displayCheckedCategories(tempInventory);

} //End filterContent method

/* Helper function to filterContent method
 * Gets all categories that are checked
 * @param {array} arrayCheckedCategories (initially empty array)
 */
function getCheckedCategories(arrayCheckedCategories) {
    const arrayInputs = document.getElementsByTagName("INPUT");

    for (var i = 0; i < arrayInputs.length; i++) {
        if (arrayInputs[i].type === "checkbox" && arrayInputs[i].checked) {
            var curCategory = arrayInputs[i].value;
            if (arrayCheckedCategories.includes(curCategory) === false)
                arrayCheckedCategories.push(curCategory);
        }
    }

}

function getFilteredLawnMowers(tempInventory, arrayCheckedCategories) {
    var countLawnmowers = 0;
    for (var j = 0; j < arrayCheckedCategories.length; j++) {
        var curCategory = arrayCheckedCategories[j];
        for (var i = 0; i < lawnMowerInventory.length; i++) {
            if (lawnMowerInventory[i].brand.toLowerCase() === curCategory.toLowerCase()) {
                tempInventory[countLawnmowers] = lawnMowerInventory[i];
                countLawnmowers++;
            }

            if (lawnMowerInventory[i].priceRange === curCategory) {
                tempInventory[countLawnmowers] = lawnMowerInventory[i];
                countLawnmowers++;
            }

            if (lawnMowerInventory[i].cuttingWidth === curCategory) {
                tempInventory[countLawnmowers] = lawnMowerInventory[i];
                countLawnmowers++;
            }
        }
    }

}

/** Helper method to filterContent method
 * Will either display all lawn mowers or only those stored in arrayCheckedCats
 *
 * @param {object[]} FilteredInventory The list of lawn mowers
 */
function displayCheckedCategories(FilteredInventory) {
    var sectionLawnMowers = document.getElementById("lawnmowers");

    //first clear all currently displayed lawn mowers
    var nodesLawnMowerSection = sectionLawnMowers.childNodes;

    for (var i = nodesLawnMowerSection.length - 1; i >= 0; i--) {
        sectionLawnMowers.removeChild(nodesLawnMowerSection[i]);
    }

    //Now show either all inventory or selected inventory
    if (FilteredInventory.length === 0)
    //show entire lawn mower inventory inventory array (lawnMowerInventory)
        displayMowers(lawnMowerInventory);

    else {
        displayMowers(FilteredInventory);
    } //end else block

} //End displayCheckedCategories method

/** Display all the mowers requested
 * 
 * @param {object[]} inventory The mowers to be displayed
 */
function displayMowers(inventory) {
    var sectionLawnMowers = document.getElementById("lawnmowers");

    for (var i = 0; i < inventory.length; i++) {
        var divNewLawnMower = document.createElement("DIV");
        var imageLawnMower = document.createElement("IMG");
        var divNewDescription = document.createElement("DIV");
        var fileName = "images/" + inventory[i].imageFileName;
        imageLawnMower.src = fileName;
        imageLawnMower.alt = "Image of Lawn Mower" + i;
        var description = inventory[i].description + "<br>";
        description += "$" + inventory[i].price;
        if (inventory[i].saleDescription !== "No Sale Description")
            description += inventory[i].saleDescription + "<br>";

        divNewDescription.innerHTML = description;
        divNewLawnMower.appendChild(imageLawnMower);
        divNewLawnMower.appendChild(divNewDescription);

        sectionLawnMowers.appendChild(divNewLawnMower);
    }

}

/**
 * Data in the file has been split on the new line character.  Meaning,
 * each element in arrayFileData stores a line (a record) of data from the file
 * each element is a of type string, each field in that string in separated by
 * a comma
 * @param {string[]} arrayFileData
 * @returns {undefined}
 */
function storeFileData(arrayFileData) {
    //Get column headings from file by splitting first element on the comma
    var arrTemp = arrayFileData.shift().split(/[,]/);

    //Populate global array lawnMowerInventory
    for (const i of arrayFileData) {
        //split current line of lawn mower inventory on the comma
        arrTemp = i.split(/[,]/);

        if (arrTemp[0] != "") {
            var LawnMower = {
                brand: arrTemp[0],
                description: arrTemp[1],
                cuttingWidth: arrTemp[2],
                price: arrTemp[3],
                priceRange: arrTemp[4],
                imageFileName: arrTemp[5],
                saleDescription: arrTemp[6],
                onSale: arrTemp[7]
            };
            lawnMowerInventory.push(LawnMower);
        }
    } //end for

}
/***********************  CODE TO READING FILE *******************************/


/**
 * Function to handle the data received from the requestDataFile method;
 * this function gets passed to the HttpRequest constructor.
 * @param {string} text
 * @returns {undefined}
 */
function handleData(text) {
    var arrayFileData = text.split(/[\n]/);
    storeFileData(arrayFileData);
}

/**
 * Request data file (starts the process of reading a file.
 * @param {String} fileName name of file to request
 */
function requestDataFile(fileName) {

    request = new HttpRequest(fileName, handleData);
    request.send(null);
}

/************** Start of Request Data Module *********************************/
/********************* DO NOT MODIFY *********************************/
/**
 * HttpRequest function
 * @param {string} url is the file to request
 * @param {function} callback stores the address of the function to be invoked
 *  upon a successful request
 * @returns {HttpRequest}
 */
function HttpRequest(url, callback) {
    this.request = new XMLHttpRequest();
    //Get data from file (url) in synchronous mode. (3rd arg being set to false
    // Meaning halt execution of other JS Code until contents of file have
    // been read. In other words, the 'callback' function (in this case
    // 'handleData' has finished its task.
    this.request.open("GET", url, false);

    var tempRequest = this.request;

    function reqReadyStateChange() {
        if (tempRequest.readyState === 4) {
            //the requested data has been fully received
            if (tempRequest.status === 200) {
                //file was found
                callback(tempRequest.responseText);
            } else {
                alert("An error occurred tying to contact the server");
            }
        }
    }
    this.request.onreadystatechange = reqReadyStateChange;

    HttpRequest.prototype.send = function() {
        this.request.send(null);
    };
}
/********************* End Request Data Module *****************************/