/**
 * Initialize the page by fetching the lawnmower information, rendering it, and
 * composing the filter UX
 */
function init() {
    fetch("LawnMowers.csv")
        .then(handleHttpResponse)
        .then(parseTextIntoObject)
        .then(displayAllMowers)
        .then(createFilterControls);
}

/**
 * Retrieve just the body string from an HTTP response
 *
 * @param {Response} response An HTTP response object
 * @returns {string} The response's body as a string
 */
function handleHttpResponse(response) {
    if (!response.ok) {
        console.error('Bad HTTP response');
        throw response.status;
    }

    return response.text();
}

/**
 * Parse the text into an array of objects
 *
 * @param {string} text The textual representation of a series of records
 * @returns {Object[]} The collection of objects stored in an array
 */
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

/**
 * Create filters for certain categories of data
 *
 * @param {Object[]} items The collection of objects
 * @returns {Object[]} The input argument; this is used for method chaining
 */
function createFilterControls(items) {
    const filterConfiguration = [
        { key: "Brand", containerId: "brand" },
        { key: "Price Range", containerId: "price" },
        { key: "Cutting Width", containerId: "cuttingwidth", displaySuffix: "in" },
    ];

    const clickHandler = applyFilter.bind(null, items);

    for (const filter of filterConfiguration) {
        const aggregate = computeAggregate(items, filter.key);
        renderFilters(aggregate, filter.containerId, clickHandler, filter.displaySuffix)
    }

    return items;
}

/**
 * Compute the number of times all the values occur for a given key in the
 * collection.
 *
 * @param {Object[]} collection The collection of objects
 * @param {string} key The key on which to aggregate
 * @returns {Object} A dictionary of the values and number of occurrences
 */
function computeAggregate(collection, key) {
    const keys = {};
    for (const i of collection) {
        keys[i[key]] = (keys[i[key]] || 0) + 1;
    }
    return keys;
}

/**
 * Render the filter options into the DOM.
 *
 * @param {Object} categories The dictionary of values and frequency
 * @param {string} containerId The identity of the element to contain the newly
 *                             newly created filter elements
 * @param {Function} clickHandler The function which should be called when a
 *                                filter is clicked
 * @param {string|undefined} suffix Optional suffix for the values
 * @returns {Object} A dictionary of the values and number of occurrences
 */
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

/**
 * Apply the filters to the rendered items
 *
 * @param {Object[]} collection The collection of objects
 */
function applyFilter(collection) {
    // Reset the view (show all the items)
    for (const i of collection) {
        i.element.style.display = 'block';
    }

    filterByCriteria(collection, "brand", "Brand");
    filterByCriteria(collection, "price", "Price Range");
    filterByCriteria(collection, "cuttingwidth", "Cutting Width");
}

/**
 * Filter the visible items by the specified criterion
 *
 * @param {Object[]} collection The collection of objects
 * @param {string} category The id of the category to filter
 * @param {string} key The key associated to that category
 */
function filterByCriteria(collection, category, key) {
    const values = getSelectedFilters(document.querySelectorAll(`#${category} input`));
    // only filter if anything is selected
    if (values.length > 0) {
        console.log(`Showing ${values.join(', ')}`)
        for (const i of collection) {
            if (values.indexOf(i[key]) == -1) {
                i.element.style.display = 'none';
            }
        }
    }
}

/**
 * Get the values of all the checked filters in a collection
 *
 * @param {Object[]} filterCollection The collection of <input> elements
 * @returns {string[]} The values of the checked filters
 */
function getSelectedFilters(filterCollection) {
    const selected = [];
    for (let i = 0; i < filterCollection.length; ++i) {
        if (filterCollection[i].checked) {
            selected.push(filterCollection[i].value);
        }
    }
    return selected;
}

/**
 * Display all the lawn mowers
 *
 * @param {Object[]} lawnMowerInventory The collection of lawn mowers
 * @returns {Object[]} The input argument; this is used for method chaining
 */
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
        // add a link to the DOM element to facilitate filtering
        mower.element = divNewLawnMower;
    }

    return lawnMowerInventory;
}