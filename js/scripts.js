const url = "https://randomuser.me/api/?nat=us";
const searchBar = document.querySelector(".search-container");
const gallery = document.getElementById("gallery");
let userProfiles = [];


// Reusable fetch function

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


// Helper functions

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

function createModal(data, num){
    const modal = `
        <div class="modal-container">
            <div class="modal">
                <button type="button" id="modal-close-btn" class="modal-close-btn"><strong>X</strong></button>
                <div class="modal-info-container">
                    <img class="modal-img" src="${data[num].picture.large}" alt="Profile picture of ${data[num].name.first} ${data[num].name.last}">
                    <h3 id="name" class="modal-name cap">${data[num].name.first} ${data[num].name.last}</h3>
                    <p class="modal-text">${data[num].email}</p>
                    <p class="modal-text cap">${data[num].location.city}</p>
                    <hr>
                    <p class="modal-text">${data[num].phone}</p>\
                    <p class="modal-text">${data[num].location.street.number} ${data[num].location.street.name},\
                    ${data[num].location.city}, ${data[num].location.state} ${data[num].location.postcode}\
                    </p>
                    <p class="modal-text">Birthday: ${data[num].dob.date}</p>
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

// Searchbar
const showSearchBar = ()=>{
    const searchBarHTML = `
    <form action="#" method="get">
        <input type="search" id="search-input" class="search-input" placeholder="Search...">
        <input type="submit" value="&#x1F50D;" id="search-submit" class="search-submit">
    </form>
`
searchBar.insertAdjacentHTML('beforeend', searchBarHTML);
}

// create searchbar
showSearchBar();

// search User
const searchInput = document.querySelector("#search-input");
searchInput.addEventListener("keyup", ()=>{
    const card = document.querySelectorAll(".card");
    const users = document.querySelectorAll(".card-name");
    let userInput = searchInput.value.toLowerCase();

    for(let i = 0; i < users.length; i++){
        let profileNames = users[i].textContent.toLowerCase();
        if(profileNames.indexOf(userInput) !== -1){
            card[i].style.display = "flex";
        }else{
            card[i].style.display = "none";
        }
    }
});

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

// Show modal on profile click
gallery.addEventListener("click", (e)=>{
    if(e.target.closest(".card")){
        const cardNumber = document.querySelectorAll(".card");
        for(let i = 0; i < cardNumber.length; i++){
            if(cardNumber[i] === e.target.closest(".card")){
                createModal(userProfiles, i);
            }
        }
    }
});

// Event listener for pressing "X" on modal
document.addEventListener("click", (e)=>{
    if(e.target.closest(".modal-close-btn") || e.target.closest(".modal-container")){
        document.querySelector(".modal-container").style.display = "none";
    }
});

// Switch profiles in modal view


