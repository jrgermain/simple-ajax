// Simple Ajax examples

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