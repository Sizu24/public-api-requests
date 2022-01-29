/* --------------- Global Variables --------------- */

const url = "https://randomuser.me/api/?results=12&nat=us";
const searchBar = document.querySelector(".search-container");
const gallery = document.getElementById("gallery");
let userProfiles = [];
let modalIndex = 0;

/* --------------- Reusable fetch function --------------- */

/**
 * Return fetch with url as parameter
 * run checkStatus function
 * take the response and parse the JSON data
 * take the parsed data, and return the results
 * if error, catch the error and show error in console
 */
function fetchData(url){
    return fetch(url)
        .then(checkStatus)
        .then(res => res.json())
        .then(data => data.results)
        .catch(err => console.log("Something didn't work -->", err));
}

/* --------------- Create Profiles --------------- */

/**
 * Create profiles on HTML page
 * Push data to userProfiles variable for use outside of function
 */

fetchData(url)
    .then(data => {
        userProfiles = data;
        displayUsers(data);
    })

/* --------------- Search Bar --------------- */

// Searchbar HTML code
const searchBarHTML = `
<form action="#" method="get">
    <input type="search" id="search-input" class="search-input" placeholder="Search...">
    <input type="submit" value="&#x1F50D;" id="search-submit" class="search-submit">
</form>
`;

// Add searchbar HTML code to searchbar container
searchBar.insertAdjacentHTML('beforeend', searchBarHTML);

// Select search input bar
const searchInput = document.querySelector("#search-input");

/**
 * Event Listener listens for keypress
 * Cards variable for card list in HTML, Users variable for names inside cards
 * Loop through profile names
 * Takes user input and finds index of profile names that match user input user input
 * If index is found, display flex on card
 * Otherwise display none on cards that come up -1 for indexOf
 */
searchInput.addEventListener("keyup", ()=>{
    const cards = document.querySelectorAll(".card");
    const users = document.querySelectorAll(".card-name");

    for(let i = 0; i < users.length; i++){
        let userInput = searchInput.value.toLowerCase();
        let profileNames = users[i].textContent.toLowerCase();
        
        if(profileNames.indexOf(userInput) !== -1){
            cards[i].style.display = "flex";
        }else{
            cards[i].style.display = "none";
        }
    }
});

/* --------------- Helper Functions --------------- */

/**
 * Check if response === ok
 * If yes, return resolve instance with the repsonse 
 * If no, return reject instance with error message from status Text
 */
function checkStatus(response){
    if(response.ok){
        return Promise.resolve(response);
    }else{
        return Promise.reject(new Error(response.statusText));
    }
}

/**
 * Add card div inside HTML gallery element
 */
function createCard(){
    gallery.insertAdjacentHTML('beforeend', '<div class="card"></div>');
}

/**
 * Select card class
 * Add image container and image from the fetched data
 * Add HTML with new image inside card section
 */
function generateImage(data, num){
    const card = document.querySelectorAll(".card");
    const profileImage = `
        <div class="card-img-container">
            <img class="card-img" src="${data[num].picture.medium}" alt="Profile picture of ${data[num].title} ${data[num].last}">
        </div>
    `;
    card[num].innerHTML += profileImage;
}

/**
 * Select card class
 * Add card info container and profile info from the fetched data
 * Add HTML with new profile info inside card section
 */
function generateInfo(data, num){
    const card = document.querySelectorAll(".card");
    const info = `
        <div class="card-info-container">
            <h3 id="name" class="card-name cap">${data[num].name.first} ${data[num].name.last}</h3>
            <p class="card-text">${data[num].email}</p>
            <p class="card-text cap">${data[num].location.city}, ${data[num].location.state}</p>
        </div>
    `;
    card[num].innerHTML += info;
}

/**
 * User fetched data to display user profiles
 * Loop 12 times to run functions to create cards, and input user info
 */
function displayUsers(userData){
    for(let i = 0; i < userProfiles.length; i++){
        createCard();
        generateImage(userData, i);
        generateInfo(userData, i);
    }
}


/* --------------- Modal --------------- */

/**
 * HTML Code for modal
 * Uses data from userProfiles array to create object for profile info
 * Index number from targeted profile or from next/previous function
 */
function createModal(num){

    let {name, email, location, dob, phone, picture} = userProfiles[num];
    let date = new Date(dob.date);
    // regex replaces first dash in phone number with space
    let phoneNumber = phone.replace(/-/, " ");

    modal = `
        <div class="modal-container">
            <div class="modal">
                <button type="button" id="modal-close-btn" class="modal-close-btn"><strong>X</strong></button>
                <div class="modal-info-container">
                    <img class="modal-img" src="${picture.large}" alt="Profile picture of ${name.first} ${name.last}">
                    <h3 id="name" class="modal-name cap">${name.first} ${name.last}</h3>
                    <p class="modal-text">${email}</p>
                    <p class="modal-text cap">${location.city}</p>
                    <hr>
                    <p class="modal-text">${phoneNumber}</p>\
                    <p class="modal-text">${location.street.number} ${location.street.name},\
                    ${location.city}, ${location.state} ${location.postcode}\
                    </p>
                    <p class="modal-text">Birthday: ${date.getMonth()}/${date.getDate()}/${date.getFullYear()}</p>
                </div>
            </div>

            <div class="modal-btn-container">
                <button type="button" id="modal-prev" class="modal-prev btn">Prev</button>
                <button type="button" id="modal-next" class="modal-next btn">Next</button>
            </div>
        </div>
        `;

        gallery.insertAdjacentHTML('afterend', modal);
}

/**
 * Functions to show next or previous profiles in modal
 * Increases or decreases index number
 * Removes existing modal code from HTML to prevent duplicate
 * Run createModal function with new index as parameter
 */
function showNext(){
    modalIndex += 1;
    gallery.nextElementSibling.remove();
    createModal(modalIndex);
}

function showPrevious(){
    modalIndex -= 1;
    gallery.nextElementSibling.remove();
    createModal(modalIndex);
}
/**
 * Show modal on profile click
 * If card is clicked, loop through cards
 * Find card index that matches clicked card
 * Use index of card to create modal for clicked card
 */

window.addEventListener("click", (e)=>{
    if(e.target.closest(".card")){
        const cardNumber = document.querySelectorAll(".card");
        for(let i = 0; i < cardNumber.length; i++){
            if(cardNumber[i] === e.target.closest(".card")){
                // save index number for selected profile
                modalIndex = i;
                // insert Modal HTML after gallery code
                createModal(i);
            }
        }
    }

    /**
     * If clicked target is Modal's "previous" or "next" button
     * Check to see if Modal is showing first or last profile in list
     * Run functions to move to previous or next profile
     */
    if(e.target.closest("#modal-prev")){
        if(modalIndex > 0){
            showPrevious();
        }
    }   
    if(e.target.closest("#modal-next")){
        if(modalIndex < 11){
            showNext();
        }
    }
});

/**
 * Event listener for pressing "X" on modal
 * If clicked on X, or clicked on modal container, set display to none
 */
document.addEventListener("click", (e)=>{
    if(e.target.closest(".modal-close-btn")){
        document.querySelector(".modal-container").style.display = "none";
    }
});


