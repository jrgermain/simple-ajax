// Simple Ajax examples

// Using ES6 async keyword
(async function () {
    try {
        const xhr = await Ajax.request({
            method: "GET",
            url: "https://itunes.apple.com/search?term=hey+jude&country=US&media=music&limit=4",
        });
        console.log("Success", Ajax.parseJSONResponse(xhr));
    } catch (e) {
        console.log("Failure", Ajax.parseJSONResponse(e)); // e is the same XMLHttpRequest as xhr
    }
})();

// Using callbacks
Ajax.request({
    method: "GET",
    url: "https://itunes.apple.com/search?term=hey+jude&country=US&media=music&limit=4",
    onSuccess: function (xhr) {
        console.log("Success", Ajax.parseJSONResponse(xhr));
    },
    onError: function (xhr) {
        console.log("Failure", Ajax.parseJSONResponse(xhr));
    }
});

// Using promises
Ajax.request({
    method: "GET",
    url: "https://itunes.apple.com/search?term=hey+jude&country=US&media=music&limit=4",
}).then((xhr) => {
    console.log("Success", Ajax.parseJSONResponse(xhr));
}).catch((xhr) => {
    console.log("Failure", Ajax.parseJSONResponse(xhr));
});