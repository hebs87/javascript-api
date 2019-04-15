const baseURL = "https://swapi.co/api/";

function getData(type, cb) {
    var xhr = new XMLHttpRequest();
    
    xhr.open("GET", baseURL + type + "/");
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


function writeToDocument(type) {
    //create a new empty array which will house each row of data for us
    var tableRows = [];
    var el = document.getElementById("data");
    el.innerHTML = "";

    getData(type, function(data) {
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
        
        el.innerHTML = `<table>${tableHeaders}${tableRows}</table>`;
    });
}