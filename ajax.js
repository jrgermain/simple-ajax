// Simple Ajax v0.1.1 by Joey Germain (jrgermain)
"use strict";

const Ajax = {
    request: function (params) {
        // Ensure we are given an object with the required parameters
        if (params.constructor.name !== "Object") throw "Ajax: request parameter must be a plain object";
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

            xhr.send(params.requestBody);
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

        if (response.constructor.name === "XMLHttpRequest") {
            return Ajax.parseResponse(response.response || response.responseText);
        } else if (isJsonString) {
            return parsedJson;
        } else {
            return response;
        }
    }
};