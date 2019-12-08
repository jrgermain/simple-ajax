// Simple Ajax v0.1.2 by Joey Germain (jrgermain)
"use strict";

const Ajax = {
    request: function (params) {
        // Check for invalid or missing parameters
        const paramType = (params == null) ? params : params.constructor.name;

        if (paramType !== "Object") throw "Ajax: request parameter must be a plain object, not " + paramType;
        if (params.method == null || params.url == null) throw "Ajax: missing required parameter(s)";

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
                    if (xhr.status >= 200 && xhr.status < 300) {
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