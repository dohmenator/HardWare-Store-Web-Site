/**
 * Initialize the page by fetching the lawnmower information, rendering it, and
 * composing the filter UX
 */
function init() {
    const filterConfiguration = [
        { key: "Brand", containerId: "brand" },
        { key: "Price Range", containerId: "price" },
        { key: "Cutting Width", containerId: "cuttingwidth", displaySuffix: " in" },
    ];

    fetch("LawnMowers.csv")
        .then(handleHttpResponse)
        .then(parseTextIntoObject)
        .then(displayAllMowers.bind(null, filterConfiguration))
        .then(createFilterControls.bind(null, filterConfiguration));
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
 * @param {Object[]} filterConfiguration The settings which control filtering
 * @param {Object[]} items The collection of objects
 * @returns {Object[]} The input argument; this is used for method chaining
 */
function createFilterControls(filterConfiguration, items) {
    const clickHandler = applyFilter.bind(null, filterConfiguration);

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
        check.value = `${containerId}_${clean(key)}`;
        label.appendChild(check);
        label.appendChild(document.createTextNode(`${key}${ suffix || ''} (${categories[key]})`));
        label.addEventListener('click', clickHandler)
        container.appendChild(label);
    }
}

/**
 * Apply the filters to the rendered items
 *
 * @param {Object[]} filterConfiguration The settings which control filtering
 */
function applyFilter(filterConfiguration) {
    const mowers = document.getElementById("lawnmowers");
    // Reset the view (hide all the items)
    for (let i = 0; i < mowers.children.length; ++i) {
        mowers.children[i].style.display = 'none';
    }

    // this collection holds elements which are visible given the filter state
    let visibleElements = [];
    for (const filter of filterConfiguration) {
        let values = getElementsWhichMatchSelectedFilters(document.getElementById(filter.containerId).querySelectorAll("input"));
        if (values.length > 0) {
            visibleElements.push(values);
        }
    }

    // if there are no visible elements, it means nothing is filtered, so show everything
    if (visibleElements.length == 0) {
        for (let i = 0; i < mowers.children.length; ++i) {
            mowers.children[i].style.display = 'block';
        }
    } else {
        // the final list of visible mowers will be the intersection of all the lists
        let finalList = visibleElements[0];
        for (let i = 1; i < visibleElements.length; ++i) {
            finalList = finalList.filter(item => visibleElements[i].indexOf(item) > -1);
        }

        for (let item of finalList) {
            item.style.display = 'block';
        }
    }
}

/**
 * Get the elements which match any of the checked filters in a collection
 *
 * @param {Element[]} filterCollection The collection of <input> elements
 * @returns {Element[]} The elements which match the selected filter
 */
function getElementsWhichMatchSelectedFilters(filterCollection) {
    const mowers = document.getElementById("lawnmowers");
    let selected = [];
    for (let i = 0; i < filterCollection.length; ++i) {
        if (filterCollection[i].checked) {
            selected = selected.concat(Array.from(mowers.querySelectorAll(`.${filterCollection[i].value}`)));
        }
    }
    return selected;
}

/**
 * Clean a string to make it suitable for use as a CSS class name
 *
 * @param {string} s The input string
 * @returns {string} The string with all the nasty characters removed
 */
function clean(s) {
    return s.replace(/[ $.]/g, '_')
}

/**
 * Display all the lawn mowers
 *
 * @param {Object[]} filterConfiguration The settings which control filtering
 * @param {Object[]} lawnMowerInventory The collection of lawn mowers
 * @returns {Object[]} The input argument; this is used for method chaining
 */
function displayAllMowers(filterConfiguration, lawnMowerInventory) {
    const sectionLawnMowers = document.getElementById("lawnmowers");

    for (const mower of lawnMowerInventory) {
        const divNewLawnMower = document.createElement("DIV");
        divNewLawnMower.className = filterConfiguration.map(i => `${i.containerId}_${clean(mower[i.key])}`).join(" ");
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
    }

    return lawnMowerInventory;
}