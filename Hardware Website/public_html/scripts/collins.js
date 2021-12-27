var arrayFileData = [];
var filterCategories = [];
var lawnMowerInventory = [];
var simpBrand = [0,0,0,0,0,0,0,0,0,0,0];
function init()
{
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
    if (this.readyState === 4 && this.status === 200) 
    {
        arrayFileData = this.responseText.split(/[\n]/);
        storeFileData(arrayFileData);
    }
    };
    xhttp.open("GET", "LawnMowers.csv", true);
    xhttp.send();
}
function storeFileData(arrayFileData)
{
    var arrTemp = arrayFileData[0].split(/[,]/);
    for(var i = 0; i<arrTemp.length; i++)
        filterCategories.push(arrTemp[i]);
    for(var i=1; i<arrayFileData.length; i++)
    {
        arrTemp.length = 0;
        arrTemp = arrayFileData[i].split(/[,]/);
        if(arrTemp[0]!="")
        {
            var lawnMower = {
                brand : arrTemp[0],
                description : arrTemp[1], 
                cuttingWidth : arrTemp[2],
                price : arrTemp[3],
                imageFileName : arrTemp[4],
                saleDescription : arrTemp[5],
                onSale : arrTemp[6]
            };
            lawnMowerInventory.push(lawnMower);
        }
    }
    
    //get count of each brand
    for(var j=0;j<lawnMowerInventory.length;j++)
    {
        if(lawnMowerInventory[j].brand === "EGO")
        {
            simpBrand[0]++;
        }
        if(lawnMowerInventory[j].brand === "Craftsman")
        {
            simpBrand[1]++;
        }
        if(lawnMowerInventory[j].brand === "TORO")
        {
            simpBrand[2]++;
        }
        if(lawnMowerInventory[j].brand === "DEWALT")
        {
            simpBrand[3]++;
        }
        if(lawnMowerInventory[j].brand === "DR Power")
        {
            simpBrand[4]++;
        }
        if(lawnMowerInventory[j].brand === "Black And Decker")
        {
            simpBrand[5]++;
        }
        if(lawnMowerInventory[j].brand === "Troy-Built")
        {
            simpBrand[6]++;
        }
        if(lawnMowerInventory[j].brand === "YardMachines")
        {
            simpBrand[7]++;
        }
        if(lawnMowerInventory[j].brand === "STIHL")
        {
            simpBrand[8]++;
        }
        if(lawnMowerInventory[j].brand === "Scotts")
        {
            simpBrand[9]++;
        }
        if(lawnMowerInventory[j].brand === "American Lawn Mower")
        {
            simpBrand[10]++;
        }
    }
    
    var indexNewBrand = -1
    for (var i = 0; i<simpBrand.length; i++)
    {
	indexNewBrand+=simpBrand[i]
	var brandDiv = document.getElementById("brand")
        var newLabel = document.createElement("LABEL");
        var chkBox = document.createElement("INPUT");
        chkBox.type = "checkbox";
        var curSpanBrand =  document.createElement("SPAN");
        curSpanBrand .innerHTML = lawnMowerInventory[indexNewBrand].brand;
        document.getElementById("brand").appendChild(curSpanBrand );
        newLabel.appendChild(chkBox);
        newLabel.appendChild(curSpanBrand);
        brandDiv.appendChild(newLabel);
        var spanAmount = document.createElement("SPAN")
        spanAmount.innerHTML = "(" + simpBrand[i] + ")<br>";
        brandDiv.append(spanAmount)
    }


}




