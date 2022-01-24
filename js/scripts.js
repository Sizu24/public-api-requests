const url = "https://randomuser.me/api/";


// Fetch Data
function fetchData(url){
    return fetch(url)
        .then(checkStatus)
        .then(res => res.json())
        .then(data => console.log(data))
        .catch(err => console.log("Something didn't work -->", err));
}


// Helper functions
function checkStatus(response){
    if(response.ok){
        return Promise.resolve(response);
    }else{
        return Promise.reject(new Error(response.statusText));
    }
}

fetchData(url);
