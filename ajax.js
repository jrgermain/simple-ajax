// Simple Ajax v0.3.0 by Joey Germain (jrgermain)
// Licensed under the MIT license

const Ajax = {
    /**
     * Make an asynchronous request
     * 
     * @param {Object} params                         An object containing the parameters to the request (at a minimum, a method and a url)
     * @param {string} params.method                  The method of the request (e.g. "GET" or "POST")
     * @param {string} params.url                     The url of the request
     * @param {boolean} params.cache                  Whether to allow caching (defaults to true) 
     * @param {Object[]|Object} params.requestHeader  An array of objects or a single object with the properties "name" and "value"
     * @param {*} params.requestBody                  The body of the request
     * @param {string} params.responseType            The expected format of the response
     * @callback params.onSuccess                     Called when the request state changes to completed and the status is a 200-level code
     * @callback params.onError                       Called when the request state changes to completed and the status is NOT a 200-level code
     * 
     * @returns {Promise<XMLHttpRequest>} A promise that resolves if the request is successful and rejects if it is not
     */
    request: function ({ method, url, cache, requestHeader, requestBody, responseType, onSuccess, onError }) {
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

            // Disable caching if the user asked us to
            if (cache === false) {
                xhr.setRequestHeader("Cache-Control", "no-store");
            }

            // Set the response type. If the given type is invalid, fall back to "", the default for XMLHttpRequests.
            const _responseType = typeof responseType === "string" && validResponseTypes.includes(responseType.toLowerCase()) ? responseType.toLowerCase() : "";
            if (responseType && _responseType === "") {
                console.warn("Ajax: Invalid expected response type:", responseType, "\nResponse will be treated as plain text");
            }
            xhr.responseType = _responseType;

            xhr.send(requestBody);
            xhr.onreadystatechange = () => {
                if (xhr.readyState === 4) {
                    const response = xhr.response || xhr.responseText;
                    const status = Ajax.parseStatus(xhr);
                    if (status === Ajax.Status.SUCCESS) {
                        resolve(response);
                        if (typeof onSuccess === "function") {
                            onSuccess(response, status);
                        }
                    } else {
                        reject(xhr.response);
                        if (typeof onError === "function") {
                            onError(response, status);
                        }
                    }
                }
            };
        });
    },

    /**
     * Make an asynchronous http get request. A simplified version of Ajax.request().
     * 
     * @param {string} url          The url of the request
     * @param {string} responseType The expected format of the response
     * @callback callback           A function that is run once the request resolves or rejects
     * 
     * @returns {Promise<XMLHttpRequest>} A promise that resolves if the request is successful and rejects if it is not
     */
    get: function (url, responseType, callback) {
        return Ajax.request({
            method: "GET",
            url: url,
            responseType: responseType,
            onSuccess: callback,
            onError: callback
        });
    },

    /**
     * Make an asynchronous http post request. A simplified version of Ajax.request().
     * 
     * @param {string} url          The url of the request
     * @param {string} responseType The expected format of the response
     * @param {*} data              The data to send with the request
     * @callback callback           A function that is run once the request resolves or rejects
     * 
     * @returns {Promise<XMLHttpRequest>} A promise that resolves if the request is successful and rejects if it is not
     */
    post: function (url, responseType, data, callback) {
        return Ajax.request({
            method: "POST",
            url: url,
            responseType: responseType,
            requestBody: data,
            onSuccess: callback,
            onError: callback
        });
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
            case 1: return Ajax.Status.INFORMATIONAL;
            case 2: return Ajax.Status.SUCCESS;
            case 3: return Ajax.Status.REDIRECTION;
            case 4: return Ajax.Status.CLIENT_ERROR
            case 5: return Ajax.Status.SERVER_ERROR;
        }
    },

    Status: {
        INFORMATIONAL: "Informational",
        SUCCESS: "Success",
        REDIRECTION: "Redirection",
        CLIENT_ERROR: "Client Error",
        SERVER_ERROR: "Server Error"
    }
};

const validResponseTypes = [
    "arraybuffer",
    "blob",
    "document",
    "json",
    "text"
]

export default Ajax