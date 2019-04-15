/*-----For the pagination to work, we need to pass in our actual URL into the button, instead of a baseURL
To do this, we need get rid of our baseURL const and to change the 'values' in the button HTML code to be the actual URL
Then we need to change the type and baseURL arguments in the functions to url*/
//const baseURL = "https://swapi.co/api/";

function getData(url, cb) {
    var xhr = new XMLHttpRequest();
    
    xhr.open("GET", url);
    xhr.send();

    xhr.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            cb(JSON.parse(this.responseText));
        }
    };
}

//We will iterate over the keys and put them into a table - we will do this without actually specifying a property
function getTableHeaders(obj) {
    //create a new array called tableHeaders, which we will initialise as an empty array
    var tableHeaders = [];
    
    //take our object and iterate over the keys with a forEach function
    Object.keys(obj).forEach(function(key) {
        //format it so each key is displayed in a table cell and push it into our tableHeaders array
        tableHeaders.push(`<td>${key}</td>`);
    });
    
    //then we want to return the tableHeaders
    return `<tr>${tableHeaders}</tr>`;
}

//FOLLOWING ON FROM PAGINATION IN writeToDocument FUNCTION
//create generatePaginationButtons function and pass it next and prev parameters
function generatePaginationButtons(next, prev) {
    //we are going to say if there is a value (a URL) for both next and previous, then we will return a template literal that will create buttons
    if (next && prev) {
        //we want to assign the onclick function the writeToDocument function and we want it to create the URL, so we use previous and next
        return `<button onclick="writeToDocument('${prev}')">Previous</button>
                <button onclick="writeToDocument('${next}')">Next</button>`;
    } else if (next && !prev) {
        //else if we have a next URL and no prev URL (at the start of the data pages), all we want is a next button
        return `<button onclick="writeToDocument('${next}')">Next</button>`;
    } else if (!next && prev) {
        //else if we have no next URL and only a prev URL (at the end of the data pages), all we want is a previous button
        return `<button onclick="writeToDocument('${prev}')">Previous</button>`;
    }
}

function writeToDocument(url) {
    //create a new empty array which will house each row of data for us
    var tableRows = [];
    var el = document.getElementById("data");
    el.innerHTML = "";

    getData(url, function(data) {
        //FINAL STEP - PAGINATION
        //create a pagination varialbe
        var pagination;
        //we are going to put an if statement in here to say that if data.next or data.previous exists, we will generate some pagination
        if (data.next || data.previous) {
            //create a function called generatePaginationButtons and pass in values of data.next and data.previous - assign it to the pagination variable
            pagination = generatePaginationButtons(data.next, data.previous)
        }
        
        data = data.results;
        //we now call our getTableHeaders function and store the data in our tableHeaders var and pass through the first object in our array
        var tableHeaders = getTableHeaders(data[0]);
        
        data.forEach(function(item) {
            //create an empty array for each individual row
            var dataRow = [];
            
            //iterate over our keys again - the function inside will push each element into our data row
            Object.keys(item).forEach(function(key) {
                //Final steps for presentation - we want to truncate the data so it takes up less space on the screen
                //we create a new var and convert the item key to a string, then we truncate it - it will be a substring of our rowData - 1 - 15 character
                var rowData = item[key].toString();
                var truncatedData = rowData.substring(0, 15);
                //create a new table cell for each of these items and we pass the key as the index so it gets the actual data that is in each key
                dataRow.push(`<td>${truncatedData}</td>`);
            });
            
            //we then need to push that row into our tableRows array and have everything appearing in separate rows
            tableRows.push(`<tr>${dataRow}</tr>`);
        });
        
        //once the pagination is done, we need to add the new pagination var to the end of the table
        /*TIDYING UP LOOSE ENDS - because we're displaying arrays as strings, commas that separate the values are also displayed at the top of the page
        to get rid of these, we use the .replace method which takes 2 arguments - 1) what to replace; 2) what to replace it with
        /,/g means we want to find all commas, not just stop at the first one; "" means we want to replace them with an empty string*/
        el.innerHTML = `<table>${tableHeaders}${tableRows}</table>${pagination}`.replace(/,/g, "");
    });
}