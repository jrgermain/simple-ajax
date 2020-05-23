// Simple Ajax v0.1.2 by Joey Germain (jrgermain)
"use strict";

const Ajax = {
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