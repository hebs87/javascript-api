/*This object is inbuilt object that JS provides to allow us to consume APIs - gives us the method to open, send and close connections
var xhr = new XMLHttpRequest();
This function is a listener which waits for xhr's state to change
If the ready state is equal to 4 and the status is equal to 200, we want to use JS to retreive our data div
Then we change the innerHTML to be equal to the response text that comes back from our xhr object
xhr.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
        document.getElementById("data").innerHTML = this.responseText;
    }
};
Now we need to open a connection using the GET method followed by the URL we want to retrieve
xhr.open("GET", "https://swapi.co/api/");
Now we use xhr.send()
xhr.send();*/

/*TIMEOUTS - Problem is we need to specify this each time and different functions take different times to run
This is more readable - doesn't affect how the code runs
Using JSON.parse() to deseralise the data
var xhr = new XMLHttpRequest();
Create new variable to store the data in JSON format
var data;
xhr.open("GET", "https://swapi.co/api/");
xhr.send();
xhr.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
        data = JSON.parse(this.responseText);
    }
};
Timeout function delays the execution of the code, which allows the readystatechange function to reach a readystate of 4
The json data is then taken out of that function and put into the timeout function
The timeouot function take 2 parameters - the first is a function and the second is a delay time in milliseconds
setTimeout(function() {
    console.log(data)
}, 500);*/

/*CALLBACKS - Best way to ensure code runs fine
cb stands for callback function and it is called getData and it contains our code to get the API data and convert it to JSON format
function getData(cb) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "https://swapi.co/api/");
    xhr.send();
    xhr.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            cb(JSON.parse(this.responseText));
        }
    };
}
The console.log(data) is passed into our getData function, which then runs after the code in that function is executed
This approach gets around having to use a timeout function
function printDataToConsole(data) {
    console.log(data);
}
We pass in our printDataToConsole function into our getData function, which is then called after the readyState and status criteria are met
getData(printDataToConsole);*/

//Getting data to the page
//We move the baseURL out of the functions and store it in a const
const baseURL = "https://swapi.co/api/";

//Modify get data function and pass it the type parameter, from our writeToDocument function
function getData(type, cb) {
    var xhr = new XMLHttpRequest();
    
    //baseURL + type appends the base URL with the type (species, people, vehicles, etc.)
    xhr.open("GET", baseURL + type + "/");
    xhr.send();

    xhr.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            cb(JSON.parse(this.responseText));
        }
    };
}

//This function allows us to write the data to our HTML document
//type parameter means the type that comes from the API (species, people, vehicles, etc.)
function writeToDocument(type) {
    //this ensures that the previous data is cleared each time the function is called again
    var el = document.getElementById("data");
    el.innerHTML = "";
 
    //We now call our getData function and pass in our type, along with another function which gets the element by ID and passes it our data
    getData(type, function(data) {
        //console.dir(data); Allows us to see the directories in the console.log
        //the data is stored in the results directory, so we want our data parameter to display data.results
        data = data.results;
        
        //then we run a forEach loop to unpack the data
        //for each element in the data, it's going to take the item
        data.forEach(function(item) {
            //we now write the .name string from the json file to the innerHTML item - the += sign ensures the the loop doesn't overwrite the data each time
            //<p> puts it into paragraphs
            el.innerHTML += "<p>" + item.name + "</p>";
        });
    });
}