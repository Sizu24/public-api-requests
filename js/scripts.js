const url = "https://randomuser.me/api/";
const searchBar = document.querySelector(".search-container");
const gallery = document.getElementById("gallery");

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
            <img class="card-img" src="${data.picture.large}" alt="Profile picture of ${data.title} ${data.last}">
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

// Create profiles on HTML page
for(let i = 0; i < 12; i++){
    createCard();

    fetchData(url)
        .then(data => {
            generateImage(data, i)
            generateInfo(data, i)
        })
}





