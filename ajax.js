// Simple Ajax v0.1.3 by Joey Germain (jrgermain)
// Licensed under the MIT license
"use strict";

const Ajax = {
    /**
     * Make an asynchronous request
     * 
     * @param {Object} params                      An object containing the parameters to the request (at a minimum, a method and a url)
     * @param {string} params.method               The method of the request (e.g. "GET" or "POST")
     * @param {string} params.url                  The url of the request
     * @param {Object[]|Object} requestHeader      An array of objects or a single object with the properties "name" and "value"
     * @param {*} requestBody                      The body of the request
     * @callback onSuccess                         Called when the request state changes to completed and the status is a 200-level code
     * @callback onError                           Called when the request state changes to completed and the status is NOT a 200-level code
     * 
     * @returns {Promise<XMLHttpRequest>} A promise that resolves if the request is successful and rejects if it is not
     */
    request: function ({ method, url, requestHeader, requestBody, onSuccess, onError }) {
        if (method == null || url == null) {
            throw "Ajax: missing required parameter(s)";
        }

        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.open(method, url);

            // Set request header if present
            if (Array.isArray(requestHeader)) {
                for (const header of requestHeader) {
                    xhr.setRequestHeader(header.name, header.value);
                }
            } else if (typeof requestHeader === "object") {
                xhr.setRequestHeader(requestHeader.name, requestHeader.value);
            } else if (requestHeader) {
                throw "Ajax: Invalid request header. Must be a single object or array of objects";
            }

            xhr.send(requestBody);
            xhr.onreadystatechange = () => {
                if (xhr.readyState === 4) {
                    if (xhr.status >= 200 && xhr.status < 300) {
                        resolve(xhr);
                        if (typeof onSuccess === "function") {
                            onSuccess(xhr);
                        }
                    } else {
                        reject(xhr);
                        if (typeof onError === "function") {
                            onError(xhr);
                        }
                    }
                }
            };
        });
    },

    /**
     * Make an asynchronous http get request. A simplified version of Ajax.request().
     * 
     * @param {string} url The url of the request
     * @callback callback  A function that is run once the request resolves or rejects
     * 
     * @returns {Promise<XMLHttpRequest>} A promise that resolves if the request is successful and rejects if it is not
     */
    get: function (url, callback) {
        return Ajax.request({
            method: "GET",
            url: url,
            onSuccess: callback,
            onError: callback
        });
    },

    /**
     * Make an asynchronous http post request. A simplified version of Ajax.request().
     * 
     * @param {string} url The url of the request
     * @param {*} data     The data to send with the request
     * @callback callback  A function that is run once the request resolves or rejects
     * 
     * @returns {Promise<XMLHttpRequest>} A promise that resolves if the request is successful and rejects if it is not
     */
    post: function (url, data, callback) {
        return Ajax.request({
            method: "POST",
            url: url,
            requestBody: data,
            onSuccess: callback,
            onError: callback
        });
    },

    /**
     * Takes a response from the server and parses it into an object if it is or contains JSON
     * 
     * @param {*} response The response from the server
     * 
     * @returns {*} Either an object parsed from a response, or the raw respone if it could not be parsed
     */
    parseJSONResponse: function (response) {
        try {
            var json = JSON.parse(response);
        } catch (e) {
            // Response was not a JSON string
        }

        if (response != null && response.constructor.name === "XMLHttpRequest") {
            return Ajax.parseResponse(response.response || response.responseText);
        } else if (json !== undefined) {
            return json;
        } else {
            return response;
        }
    }
};