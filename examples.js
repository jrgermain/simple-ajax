import Ajax, { ResponseType } from "./ajax.js"

/* Ajax.request examples */

// Using ES6 async keyword
(async function () {
    try {
        const json = await Ajax.request({
            method: "GET",
            url: "https://itunes.apple.com/search?term=hey+jude&country=US&media=music&limit=4",
            responseType: ResponseType.JSON
        });
        console.log("Success", json);
    } catch (e) {
        console.log("Failure", e);
    }
})();

// Using callbacks
Ajax.request({
    method: "GET",
    url: "https://itunes.apple.com/search?term=hey+jude&country=US&media=music&limit=4",
    responseType: ResponseType.JSON,
    onSuccess: function (json) {
        console.log("Success", json);
    },
    onError: function (json) {
        console.log("Failure", json);
    }
});

// Using promises
Ajax.request({
    method: "GET",
    url: "https://itunes.apple.com/search?term=hey+jude&country=US&media=music&limit=4",
    responseType: ResponseType.JSON
}).then((json) => {
    console.log("Success", json);
}).catch((json) => {
    console.log("Failure", json);
});

/* Ajax.get examples */

// Using ES6 async keyword
(async function () {
    const response = await Ajax.get("https://itunes.apple.com/search?term=hey+jude&country=US&media=music&limit=4");
    const status = Ajax.parseStatus(response);
    const json = Ajax.parseResponse(response, ResponseType.JSON);
    console.log(status, json);
})();

// Using callbacks
Ajax.get("https://itunes.apple.com/search?term=hey+jude&country=US&media=music&limit=4", (response) => {
    const status = Ajax.parseStatus(response);
    const json = Ajax.parseResponse(response, ResponseType.JSON);
    console.log(status, json);
});

// Using promises
Ajax.get("https://itunes.apple.com/search?term=hey+jude&country=US&media=music&limit=4").then((response) => {
    const status = Ajax.parseStatus(response);
    const json = Ajax.parseResponse(response, ResponseType.JSON);
    console.log(status, json);
});