/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var arrHeadings= [];
var arrDogs = [];

function init()
{
    readCSVFile();
    //readCSVFileRWWay();
    setupAccordionStyle();

}

function readCSVFile()
{
    fetch('Dog Inventory.csv')
            .then(response => response.text())
            .then(data => parseData(data))
            .catch(err => console.log(err))
}

function parseData(theData)
{
    var arrayFileData = theData.split(/[\n]/);
    //Get column headings from file by splitting first element on the comma
    arrHeadings = arrayFileData[0].split(/[,]/);
    
    for (var i=1; i<arrayFileData.length; i++)
    {
        tempArray = arrayFileData[i].split(/[,]/);
        for(let k=0; k<tempArray.length; k+=4)
        {
//            let strFileName = tempArray[k+3]
//            strFileName = strFileName.substring(0,strFileName.length-2);
            let curDog = {
                breed:tempArray[k],
                name:tempArray[k+1],
                numFleas:tempArray[k+2],
                imageFile:tempArray[k+3].replace('\r','')
                
                //imageFile:tempArray[i+3].substring(0,('\r','')//throws an error
            }
            arrDogs.push(curDog);
        }
    }
        
}
function readCSVFileRWWay()
{
    fetch('Dog Inventory.csv')
    .then(function (response) {
    if (response.ok)
    {
      // if the response is fine, handle it like text
      response.text();
    }
    else
    {
      // turn any HTTP errors into an Error so they can be handled the
      // same as network errors (see .catch below)
      throw new Error(`HTTP error ${response.status}`);
    }
  }).then(function (text) { // first, split up each line
    return text.split('\n');
  }).then(function (lines) { // then turn each line into an object
     return lines.map(parseLine);
  }).then(function (items) {
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
    "breed" : curDog[0],
    "name" : curDog[1],
    "numFleas" : parseInt(curDog[2]),
  };
}

function setupAccordionStyle()
{
    /*The following JS code came from:
    https://www.w3schools.com/howto/tryit.asp?filename=tryhow_js_accordion_symbol*/
            
    var acc = document.getElementsByClassName("accordion");
    var i;

    for (i = 0; i < acc.length; i++) {
      acc[i].addEventListener("click", function() {
        this.classList.toggle("active");
        var panel = this.nextElementSibling;
        if (panel.style.maxHeight) {
          panel.style.maxHeight = null;
        } else {
          panel.style.maxHeight = panel.scrollHeight + "px";
        } 
      });
    }
}


