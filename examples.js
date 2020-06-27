import Ajax from "./ajax.js"

/* Ajax.request examples */

// Using ES6 async keyword
(async function () {
    try {
        const response = await Ajax.request({
            method: "GET",
            url: "https://itunes.apple.com/search?term=hey+jude&country=US&media=music&limit=4",
            responseType: "json"
        });
        console.log("Success", response);
    } catch (response) {
        console.log("Failure", response);
    }
})();

// Using callbacks
Ajax.request({
    method: "GET",
    url: "https://itunes.apple.com/search?term=hey+jude&country=US&media=music&limit=4",
    responseType: "json",
    onSuccess: function (response) {
        console.log("Success", response);
    },
    onError: function (response) {
        console.log("Failure", response);
    }
});

// Using promises
Ajax.request({
    method: "GET",
    url: "https://itunes.apple.com/search?term=hey+jude&country=US&media=music&limit=4",
    responseType: "json"
}).then((response) => {
    console.log("Success", response);
}).catch((response) => {
    console.log("Failure", response);
});

/* Ajax.get examples */

// Using ES6 async keyword
(async function () {
    try {
        const response = await Ajax.get("https://itunes.apple.com/search?term=hey+jude&country=US&media=music&limit=4", "json");
        console.log("Success", response);
    } catch (response) {
        console.log("Failure", response);
    }
})();

// Using callbacks
Ajax.get("https://itunes.apple.com/search?term=hey+jude&country=US&media=music&limit=4", "json", function (response, status) {
    if (status === Ajax.Status.SUCCESS) {
        console.log("Success", response);
    } else {
        console.log("Failure", response);
    }
});

// Using promises
Ajax.get("https://itunes.apple.com/search?term=hey+jude&country=US&media=music&limit=4", "json")
    .then((response) => { console.log("Success", response) })
    .catch((response) => { console.log("Failure", response) });