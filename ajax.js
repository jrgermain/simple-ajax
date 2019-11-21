// Simple Ajax v0.1 by Joey Germain (jrgermain)
"use strict";

const Ajax = {
    request: function (params) {
        // Ensure we are given an object with the required parameters
        if (typeof params !== "object") throw "Ajax: request parameter must be an object";
        if (!params.method || !params.url) throw "Ajax: missing or empty required parameter(s)";

        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.open(params.method, params.url);

            // Set request header if present
            if (Array.isArray(params.requestHeader)) {
                for (const header of params.requestHeader)
                    xhr.setRequestHeader(header.name, header.value);
            } else if (typeof params.requestHeader === "object") {
                xhr.setRequestHeader(params.requestHeader.name, params.requestHeader.value);
            } else if (params.requestHeader) {
                throw "Ajax: Invalid request header. Must be a single object or array of objects";
            }
        
            xhr.send();
            xhr.onreadystatechange = () => {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        resolve(xhr);
                        if (typeof params.onSuccess === "function")
                            params.onSuccess(xhr);
                    } else {
                        reject(xhr);
                        if (typeof params.onError === "function")
                            params.onError(xhr);
                    }
                }
            };
        });
    },
    parseResponse: function (response) {
        let parsedJson;
        const isJsonString = (function () {
            if (typeof response !== "string") return false;
            try {
                parsedJson = JSON.parse(response);
                return true;
            } catch (e) {
                return false;
            }
        })();

        if (typeof response === "object") {
            // If we are parsing an XMLHttpRequest, get its response
            return (response instanceof XMLHttpRequest) 
                   ? Ajax.parseResponse(response.response || response.responseText) 
                   : response;
        } else if (isJsonString) {
            return parsedJson;
        } else {
            return response;
        }
    }
};

// EXAMPLES

// Example using promises
// (async function () {
//     try {
//         const xhr = await Ajax.request({
//             method: "GET",
//             url: "https://itunes.apple.com/search?term=hey+jude&country=US&media=music&limit=4",
//         });
//         console.log("Success", Ajax.parseResponse(xhr));
//     } catch (e) {
//         console.log("Failure", Ajax.parseResponse(e)); // e is the same XMLHttpRequest as xhr
//     }
// })();

// // Example using callbacks
// Ajax.request({
//     method: "GET",
//     url: "https://itunes.apple.com/search?term=hey+jude&country=US&media=music&limit=4",
//     onSuccess: function (xhr) {
//         console.log("Success", Ajax.parseResponse(xhr));
//     },
//     onError: function (xhr) {
//         console.log("Failure", Ajax.parseResponse(xhr));
//     }
// });