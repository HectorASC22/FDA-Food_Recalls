// Declaring necessary variables
let skip = 0;
let requestURL;
let recalls = [];
let pageNumber = 0;

let topNextButton = document.getElementById("TopNextButton");
let topPreviousButton = document.getElementById("TopPreviousButton");
let bottomNextButton = document.getElementById("BottomNextButton");
let bottomPreviousButton = document.getElementById("BottomPreviousButton");
let form = document.getElementById("states-dropdown");
let navBar = document.getElementById("navBar");
let footer = document.getElementById("footer");
let masterDiv = document.getElementById("allRecallsPosts");

let statesFilter = document.getElementById("states");

let loading = document.getElementById("loading");

let transperancy = 1;

// Make everything disappear when user sets filter to all-states or when page is loading up for the first time
if (masterDiv.style.display == "") {
    masterDiv.style.display = "none";
}
loading.style.display = ""
form.style.display = "none"
topNextButton.style.display = "none"
topPreviousButton.style.display = "none"
bottomNextButton.style.display = "none"
bottomPreviousButton.style.display = "none"
navBar.style.display = "none"
footer.style.display = "none"

function callApi() {
    // When filter is set to its default or is loading up for the first time, this url is used to fetch data from the api.
    if (statesFilter.value == "all-states") {
        requestURL = `https://api.fda.gov/food/enforcement.json?limit=1000&sort=report_date:desc&skip=${skip}`
    } else { // When user sets filter to a state other than 'all states', change the url we use to fetch data from FDA API, to display the state specified
        requestURL = `https://api.fda.gov/food/enforcement.json?limit=1000&sort=report_date:desc&skip=${skip}&search=state.exact:"${statesFilter.value}"`;
    }
    // Fetch data from API
    fetch(requestURL)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            // Print data into console
            console.log(data);
            console.log(data.results);
            // Adding the data collected from the API and storing in the array declared at the top
            recalls.push(...data.results);
            console.log(recalls);

            // Conditional to capture all data from FDA API using the API's skip value and function recursion
            if (skip + 1000 < (data.meta.results.total)) {
                skip += 1000;
                callApi();
            } else { // Display the information gained from the API and taking out the loading screen 
                loading.style.display = "none";
                form.style.display = ""
                topNextButton.style.display = ""
                topPreviousButton.style.display = ""
                bottomNextButton.style.display = ""
                bottomPreviousButton.style.display = ""
                navBar.style.display = ""
                footer.style.display = ""
                masterDiv.style.display = ""

                displayData();
                skip = 0;

            }
        })
        .catch(function (error) { // A tracker for mistakes
            console.log("Error during fetch:", error);
        });
}
let data = callApi();




// Getting access to submit button to allow for filtering when user uses the filter
let statesSubmitButton = document.getElementById("states-submit");
statesSubmitButton.addEventListener("click", function (event) {
    // Removing default refreshing from the buttoj
    event.preventDefault();
    // Clearing the array in which data is placed
    recalls = [];
    // Resetting the page number to the starting page
    pageNumber = 0;
    // Calling the fetching the function to fetch data from the API that only contains information with what the user wants
    callApi();

});

// Extracting the data that was stored within the recalls array for the sole purpose of displaying
function displayData() {

    let masterDiv = document.getElementById("allRecallsPosts");
    masterDiv.innerHTML = "";




    for (let i = 0 + (pageNumber * 100); i < 100 + (pageNumber * 100); i++) {
        console.log("worked");
        console.log(statesFilter.value);
        //if (recalls[i].state == statesFilter.value) {
        // console.log("worked");

        // "STATE-VARIABLE".include("STATE NAME/ABBREV")

        let title;
        let status;
        let classification;
        let location;
        let productType;
        let distributionPattern;
        let productDescription;
        let productQuantity;
        let recallReason;
        let reportedState;

        title = recalls[i].report_date;
        reportedState = recalls[i].state;
        status = recalls[i].status;
        classification = recalls[i].classification;
        location = recalls[i].city, recalls[i].state, recalls[i].country;
        productType = recalls[i].product_type;
        distributionPattern = recalls[i].distribution_pattern;
        productDescription = recalls[i].product_description;
        productQuantity = recalls[i].product_quantity;
        recallReason = recalls[i].reason_for_recall;

        // Recalling the function that makes seperate sections for each recall
        makeRecallPost(title, reportedState, status, classification, location, productType, distributionPattern, productDescription, productQuantity, recallReason);

        //}


        // if (statesInput == "all-states") {
        //     let title;
        //     let status;
        //     let classification;
        //     let location;
        //     let productType;
        //     let distributionPattern;
        //     let productDescription;
        //     let productQuantity;
        //     let recallReason;
        //     let reportedState;

        //     title = recalls[i].report_date;
        //     reportedState = recalls[i].state;
        //     status = recalls[i].status;
        //     classification = recalls[i].classification;
        //     location = recalls[i].city, recalls[i].state, recalls[i].country;
        //     productType = recalls[i].product_type;
        //     distributionPattern = recalls[i].distribution_pattern;
        //     productDescription = recalls[i].product_description;
        //     productQuantity = recalls[i].product_quantity;
        //     recallReason = recalls[i].reason_for_recall;

        //     makeRecallPost(title, reportedState, status, classification, location, productType, distributionPattern, productDescription, productQuantity, recallReason);
        // }
    }
}




// Creates multiple divs (sections) to fill in with the information gained in the displayData function
function makeRecallPost(titleParam, stateParam, statusParam, classificationParam, locationParam, productTypeParam, distributionPatternParam, productDescriptionParam, productQuantityParam, recallReasonParam) {
    //makes parent div
    let parentDiv = document.createElement("div");
    parentDiv.classList.add("single-recall-post");

    masterDiv = document.getElementById("allRecallsPosts")

    //makes a div for title and appends title to it
    let titleDiv = document.createElement("div");
    titleDiv.classList.add("titleDiv");

    //makes title and inner content
    let titleDisplay = document.createElement("p");
    titleDisplay.classList.add("single-recall-title");
    titleParam = titleParam.substring(0, 4) + " " + titleParam.substring(4, 6) + " " + titleParam.substring(6, titleParam.length);
    titleDisplay.innerHTML = "Date recalled: " + titleParam;

    let contentDiv = document.createElement("div");
    contentDiv.classList.add("recallContent");

    // All go into content div, each individual lines
    let stateDisplay = document.createElement("p");
    stateDisplay.classList.add("stateDisplay");
    stateDisplay.innerHTML = "State Reported: " + stateParam;

    let statusDisplay = document.createElement("p");
    statusDisplay.classList.add("statusDisplay");
    statusDisplay.innerHTML = "Status: " + statusParam;

    let classificationDisplay = document.createElement("p");
    classificationDisplay.classList.add("classificationDisplay");
    classificationDisplay.innerHTML = "Classification level: " + classificationParam;

    let locationDisplay = document.createElement("p");
    locationDisplay.classList.add("locationDisplay");
    locationDisplay.innerHTML = "Location: " + locationParam;

    let productTypeDisplay = document.createElement("p");
    productTypeDisplay.classList.add("productTypeDisplay");
    productTypeDisplay.innerHTML = "Type of Product: " + productTypeParam;

    let distributionPatternDisplay = document.createElement("p");
    distributionPatternDisplay.classList.add("distributionPatternDisplay");
    distributionPatternDisplay.innerHTML = "Distribution Pattern: " + distributionPatternParam;

    let productDescriptionDisplay = document.createElement("p");
    productDescriptionDisplay.classList.add("productDescriptionDisplay");
    productDescriptionDisplay.innerHTML = "Product Description: " + productDescriptionParam;

    let productQuantityDisplay = document.createElement("p");
    productQuantityDisplay.classList.add("productQuantityDisplay");
    productQuantityDisplay.innerHTML = "Product Quantity: " + productQuantityParam;

    let recallReasonDisplay = document.createElement("p");
    recallReasonDisplay.classList.add("recallReasonDisplay");
    recallReasonDisplay.innerHTML = "Why it was recalled: " + recallReasonParam;
    //----------------------------------------------------------------

    masterDiv.appendChild(parentDiv);

    parentDiv.appendChild(titleDiv);
    parentDiv.appendChild(contentDiv);

    titleDiv.appendChild(titleDisplay);

    contentDiv.appendChild(stateDisplay);
    contentDiv.appendChild(statusDisplay);
    contentDiv.appendChild(classificationDisplay);
    contentDiv.appendChild(locationDisplay);
    contentDiv.appendChild(productTypeDisplay);
    contentDiv.appendChild(distributionPatternDisplay);
    contentDiv.appendChild(productDescriptionDisplay);
    contentDiv.appendChild(productQuantityDisplay);
    contentDiv.appendChild(recallReasonDisplay);
}

// BUTTONS
topNextButton = document.getElementById("TopNextButton");
topPreviousButton = document.getElementById("TopPreviousButton");
bottomNextButton = document.getElementById("BottomNextButton");
bottomPreviousButton = document.getElementById("BottomPreviousButton");
topPreviousButton.onclick = previousPage;
topNextButton.onclick = nextPage;
bottomNextButton.onclick = nextPage;
bottomPreviousButton.onclick = previousPage;
function nextPage(event) {
    if ((pageNumber + 1) * 100 <= recalls.length) { // if page number not too high
        pageNumber += 1;
        console.log("click registefdsgag");
        displayData();
    }
}
function previousPage(event) {
    if ((pageNumber - 1) * 100 >= 0) {  // if page number is not too low
        pageNumber -= 1;
        console.log("click previous wokring");
        displayData();
    }
}










// limit = 1000
// skip = 0
// skip += 1000

// total = 22756
// second page: 1000 + 21000 > 22756
// last page: 1000 + 21000 + ? = // total = 2250
// limit + skip < total
// during first page: 1000 + 0 < 2250
// before second page: 1000 + 10022756 0 < 2250
// before third page: 1000 + 2000 < 2250
// Last page: 100 + ? = 2250

// MATH!

