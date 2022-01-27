/************ Global Variables ************/

const url = "https://randomuser.me/api/?nat=us";
const searchBar = document.querySelector(".search-container");
const gallery = document.getElementById("gallery");
const userProfiles = [];
let modalIndex = 0;

/************ Reusable fetch function ************/

/**
 * Return fetch with url as parameter
 * run checkStatus function
 * take the response and parse the JSON data
 * take the parsed data, and return the data from the 0 index in the results key
 * if error, catch the error and show error in console
 */
function fetchData(url){
    return fetch(url)
        .then(checkStatus)
        .then(res => res.json())
        .then(data => data.results[0])
        .catch(err => console.log("Something didn't work -->", err));
}

/************ Create Profiles ************/

// Create profiles on HTML page
for(let i = 0; i < 12; i++){
    createCard();

    fetchData(url)
        .then(data => {
            generateImage(data, i);
            generateInfo(data, i);
            userProfiles.push(data);
        })
}

/************ Search Bar ************/

// create searchbar
const searchBarHTML = `
<form action="#" method="get">
    <input type="search" id="search-input" class="search-input" placeholder="Search...">
    <input type="submit" value="&#x1F50D;" id="search-submit" class="search-submit">
</form>
`
// Add searchbar HTML code to searchbar container
searchBar.insertAdjacentHTML('beforeend', searchBarHTML);

// search User
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

/************ Helper Functions ************/

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
            <img class="card-img" src="${data.picture.medium}" alt="Profile picture of ${data.title} ${data.last}">
        </div>
    `
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
            <h3 id="name" class="card-name cap">${data.name.first} ${data.name.last}</h3>
            <p class="card-text">${data.email}</p>
            <p class="card-text cap">${data.location.city}, ${data.location.state}</p>
        </div>
    `
    card[num].innerHTML += info;
}

/************ Modal ************/

// HTML Code for modal, uses data from userProfiles array, and index number from fetch loop
function createModal(num){

    let {name, email, location, dob, phone, picture} = userProfiles[num];
    
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
                    <p class="modal-text">${phone}</p>\
                    <p class="modal-text">${location.street.number} ${location.street.name},\
                    ${location.city}, ${location.state} ${location.postcode}\
                    </p>
                    <p class="modal-text">Birthday: ${dob.date}</p>
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

function showNext(){
    modalIndex += 1;
    createModal(modalIndex);
}

function showPrevious(){
    modalIndex -= 1;
    createModal(modalIndex);
}
/**
 * Show modal on profile click
 * If card is clicked, loop through cards
 * Find card index that matches clicked card
 * User index to create modal for clicked card
 */
window.addEventListener("click", (e)=>{
    if(e.target.closest(".card")){
        const cardNumber = document.querySelectorAll(".card");
        for(let i = 0; i < cardNumber.length; i++){
            if(cardNumber[i] === e.target.closest(".card")){
                modalIndex = i;
                // insert Modal HTML after gallery code
                createModal(i);
                console.log(userProfiles[i]);
            }
        }
    }
    const previousButton = document.querySelector("#modal-prev");
    const nextButton = document.querySelector("#modal-next");

    previousButton.addEventListener("click", ()=>{
        if(modalIndex > 0){
            gallery.nextElementSibling.remove();
            showPrevious();
        }
        console.log(modalIndex);
    });
    
    nextButton.addEventListener("click", ()=>{
        if(modalIndex < 13){
            gallery.nextElementSibling.remove();
            showNext();
        }
        console.log(modalIndex);
    });
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


