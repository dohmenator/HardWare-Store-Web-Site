function init() {
    fetch("LawnMowers.csv")
        .then(handleHttpResponse)
        .then(parseTextIntoObject)
        .then(displayAllMowers)
        .then(createFilterControls);
}

function handleHttpResponse(response) {
    if (!response.ok) {
        console.error('Bad HTTP response');
        throw response.status;
    }

    return response.text();
}

function parseTextIntoObject(text) {
    const lines = text.split("\r\n");
    const headers = lines.shift().split(",");

    const items = [];
    for (const line of lines) {
        const item = {};
        const values = line.split(',');
        for (let j = 0; j < headers.length; ++j) {
            const key = headers[j];
            let value = values[j];
            item[key] = value;
        }
        items.push(item);
    }

    return items;
}

function createFilterControls(items) {
    const brands = computeAggregate(items, "Brand");
    const prices = computeAggregate(items, "Price Range");
    const widths = computeAggregate(items, "Cutting Width");

    const clickHandler = applyFilter.bind(null, items);

    renderFilters(brands, "brand", clickHandler);
    renderFilters(prices, "price", clickHandler);
    renderFilters(widths, "cuttingwidth", clickHandler, " in");

    return items;
}

function computeAggregate(collection, key) {
    const keys = {};
    for (const i of collection) {
        keys[i[key]] = (keys[i[key]] || 0) + 1;
    }
    return keys;
}

function renderFilters(categories, containerId, clickHandler, suffix) {
    let keys = Object.keys(categories);
    if (keys[0].indexOf("$") > -1) {
        // prices are weird, so sort by the first number in the text
        keys.sort((i, j) => parseInt(i.match(/\d+/).shift()) - parseInt(j.match(/\d+/).shift()));
    } else {
        keys.sort();
    }

    const container = document.getElementById(containerId);
    for (const key of keys) {
        const label = document.createElement("label");
        const check = document.createElement("input");
        check.type = "checkbox";
        check.value = key;
        label.appendChild(check);
        label.appendChild(document.createTextNode(`${key}${ suffix || ''} (${categories[key]})`));
        label.addEventListener('click', clickHandler)
        container.appendChild(label);
    }
}

function applyFilter(collection) {
    console.log('Show every mower');
    for (const i of collection) {
        i.element.style.display = 'block';
    }

    filterByCriteria(collection, "brand", "Brand");
    filterByCriteria(collection, "price", "Price Range");
    filterByCriteria(collection, "cuttingwidth", "Cutting Width");
}

function filterByCriteria(collection, category, keyName) {
    const values = getSelectedFilters(document.querySelectorAll(`#${category} input`));
    // only filter if anything is selected
    if (values.length > 0) {
        console.log(`Showing ${values.join(', ')}`)
        for (const i of collection) {
            if (values.indexOf(i[keyName]) == -1) {
                i.element.style.display = 'none';
            }
        }
    }
}

function getSelectedFilters(filterCollection) {
    const selected = [];
    for (let i = 0; i < filterCollection.length; ++i) {
        if (filterCollection[i].checked) {
            selected.push(filterCollection[i].value);
        }
    }
    return selected;
}

function displayAllMowers(lawnMowerInventory) {
    const sectionLawnMowers = document.getElementById("lawnmowers");

    for (const mower of lawnMowerInventory) {
        const divNewLawnMower = document.createElement("DIV");
        const imageLawnMower = document.createElement("IMG");
        const divNewDescription = document.createElement("DIV");
        const fileName = "images/" + mower.ImageFile;
        imageLawnMower.src = fileName;
        let description = `${mower.Description}<br>$${mower.Price}`;
        if (mower["Sale Description"] !== "No Sale Description") {
            description += `<br>${mower["Sale Description"]}`;
        }

        divNewDescription.innerHTML = description;
        divNewLawnMower.appendChild(imageLawnMower);
        divNewLawnMower.appendChild(divNewDescription);

        sectionLawnMowers.appendChild(divNewLawnMower);
        mower.element = divNewLawnMower;
    }

    return lawnMowerInventory;
}