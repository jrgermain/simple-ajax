// Simple Ajax v0.1.5 by Joey Germain (jrgermain)
// Licensed under the MIT license

const Ajax = {
    /**
     * Make an asynchronous request
     * 
     * @param {Object} params                         An object containing the parameters to the request (at a minimum, a method and a url)
     * @param {string} params.method                  The method of the request (e.g. "GET" or "POST")
     * @param {string} params.url                     The url of the request
     * @param {Object[]|Object} params.requestHeader  An array of objects or a single object with the properties "name" and "value"
     * @param {*} params.requestBody                  The body of the request
     * @param {string} params.responseType            The expected format of the response
     * @callback params.onSuccess                     Called when the request state changes to completed and the status is a 200-level code
     * @callback params.onError                       Called when the request state changes to completed and the status is NOT a 200-level code
     * 
     * @returns {Promise<XMLHttpRequest>} A promise that resolves if the request is successful and rejects if it is not
     */
    request: function ({ method, url, requestHeader, requestBody, responseType, onSuccess, onError }) {
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
                    if (Ajax.parseStatus(xhr) === "SUCCESS") {
                        const response = Ajax.parseResponse(xhr, responseType);
                        resolve(response);
                        if (typeof onSuccess === "function") {
                            onSuccess(response);
                        }
                    } else {
                        const response = Ajax.parseResponse(xhr, responseType);
                        reject(response);
                        if (typeof onError === "function") {
                            onError(response);
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
     * Parse a response from a given expected format
     * 
     * @param {*} response           The response to be parsed
     * @param {string} expectedType  One of ['json', 'html', 'xml']
     * 
     * @returns {*} Either an Object/Document/HTNLDocument parsed from a response, or the raw response data if it could not be parsed
     */
    parseResponse: function (response, expectedType) {
        // If we were not given an expected type, return the original item
        if (expectedType == null) {
            return response;
        }

        // If response is an XMLHttpRequest, call this function on its data
        if (response != null && response.constructor.name === "XMLHttpRequest") {
            return Ajax.parseResponse(response.response || response.responseText, expectedType);
        }
        // If response is an object (but not an XMLHttpRequest), assume it is already parsed
        else if (typeof response === "object") {
            return response;
        }

        switch (expectedType) {
            case ResponseType.JSON:
                try {
                    return JSON.parse(response);
                } catch (e) {
                    console.warn("Ajax: tried to parse response as JSON but couldn't");
                    return response;
                }
            case ResponseType.HTML:
            case ResponseType.XML:
                const parser = new DOMParser();
                const doc = parser.parseFromString(response, `text/${expectedType}`);
                const hasParserError = !!doc.getElementsByTagName("parsererror").length;
                if (hasParserError) {
                    console.warn(`Ajax: tried to parse response as ${expectedType.toUpperCase()} but couldn't`);
                    return response;
                } else {
                    return doc;
                }
            default:
                console.warn("Ajax: tried to parse response of unsupported type: ", expectedType);
                return response;
        }
    },

    /**
     * Map an XMLHttpRequest to the name of the class of its status code.
     * 
     * @param {XMLHttpResuest} xhr  An XMLHttpRequest
     * 
     * @returns {string} A string containing the name of the class of status code. Undefined if the status is somehow invalid.
     */
    parseStatus: function (xhr) {
        const status = xhr.status
        const firstDigit = Math.floor(status / 100);

        switch (firstDigit) {
            case 1: return "INFORMATIONAL";
            case 2: return "SUCCESS";
            case 3: return "REDIRECTION";
            case 4: return "CLIENT_ERROR";
            case 5: return "SERVER_ERROR";
        }
    }
};

const ResponseType = {
    JSON: "json",
    HTML: "html",
    XML: "xml"
}

export {
    Ajax as default,
    ResponseType
}