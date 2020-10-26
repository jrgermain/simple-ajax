import Ajax from "../ajax.js";

const testHtml = `<span class="test"><label class="name">%LABEL%</label><div class="detail"></div></span>`
const tests = [
    {
        label: "Simple get request - promise",
        run: async function () {
            const expected = '{"data":{"id":2,"email":"janet.weaver@reqres.in","first_name":"Janet","last_name":"Weaver","avatar":"https://s3.amazonaws.com/uifaces/faces/twitter/josephstein/128.jpg"},"ad":{"company":"StatusCode Weekly","url":"http://statuscode.org/","text":"A weekly newsletter focusing on software development, infrastructure, the server, performance, and the stack end of things."}}';
            const response = await Ajax.request({
                url: "https://reqres.in/api/users/2",
                method: "GET",
                responseType: "json"
            });
            assert(response != null, "response should not be null");
            assert(typeof response === "object", "response should be an object");
            assert(JSON.stringify(response) === expected, "response should match expected value");
        }
    },
    {
        label: "Simple get request - callback",
        run: function () {
            return new Promise((resolve, reject) => { 
                const expected = '{"data":{"id":2,"email":"janet.weaver@reqres.in","first_name":"Janet","last_name":"Weaver","avatar":"https://s3.amazonaws.com/uifaces/faces/twitter/josephstein/128.jpg"},"ad":{"company":"StatusCode Weekly","url":"http://statuscode.org/","text":"A weekly newsletter focusing on software development, infrastructure, the server, performance, and the stack end of things."}}';
                Ajax.request({
                    url: "https://reqres.in/api/users/2",
                    method: "GET",
                    responseType: "json",
                    onSuccess: response => {
                        assert(response != null, "response should not be null", reject);
                        assert(typeof response === "object", "response should be an object", reject);
                        assert(JSON.stringify(response) === expected, "response should match expected value", reject);
                        resolve();
                    },
                    onError: reject
                });
            });
        }
    },
    {
        label: "Simple get request - promise - 404",
        run: async function () {
            const expected = '{}';
            try {
                await await Ajax.request({
                    url: "https://reqres.in/api/users/23",
                    method: "GET",
                    responseType: "json"
                });
                assert(false, "request should have failed");
            } catch (response) {
                assert(response != null, "response should not be null");
                assert(typeof response === "object", "response should be an object");
                assert(JSON.stringify(response) === expected, "response should match expected value");    
            }
        }
    },
    {
        label: "Simple get request - callback - 404",
        run: function () {
            return new Promise((resolve, reject) => { 
                const expected = '{}';
                Ajax.request({
                    url: "https://reqres.in/api/users/23",
                    method: "GET",
                    responseType: "json",
                    onError: response => {
                        assert(response != null, "response should not be null", reject);
                        assert(typeof response === "object", "response should be an object", reject);
                        assert(JSON.stringify(response) === expected, "response should match expected value", reject);
                        resolve();
                    },
                    onSuccess: reject
                });
            });
        }
    },
    {
        label: "Simple post request - promise",
        run: async function () {
            const expected = '{"token":"QpwL5tke4Pnpja7X4"}';
            const response = await Ajax.request({
                url: "https://reqres.in/api/login",
                method: "POST",
                responseType: "json",
                requestBody: JSON.stringify({
                    email: "eve.holt@reqres.in",
                    password: "cityslicka"
                }),
                requestHeaders: {
                    "content-type": "application/json"
                }
            });
            assert(response != null, "response should not be null");
            assert(typeof response === "object", "response should be an object");
            assert(JSON.stringify(response) === expected, "response should match expected value");
        }
    },
    {
        label: "Simple post request - callback",
        run: function () {
            return new Promise((resolve, reject) => {
                const expected = '{"token":"QpwL5tke4Pnpja7X4"}';
                Ajax.request({
                    url: "https://reqres.in/api/login",
                    method: "POST",
                    responseType: "json",
                    requestBody: JSON.stringify({
                        email: "eve.holt@reqres.in",
                        password: "cityslicka"
                    }),
                    requestHeaders: {
                        "content-type": "application/json"
                    },
                    onSuccess: (response) => {
                        assert(response != null, "response should not be null", reject);
                        assert(typeof response === "object", "response should be an object", reject);
                        assert(JSON.stringify(response) === expected, "response should match expected value", reject);
                        resolve();
                    },
                    onError: reject
                });
    
            })
        }
    },
    {
        label: "Generated Ajax.get",
        run: async function () {
            const expected = '{"data":{"id":2,"email":"janet.weaver@reqres.in","first_name":"Janet","last_name":"Weaver","avatar":"https://s3.amazonaws.com/uifaces/faces/twitter/josephstein/128.jpg"},"ad":{"company":"StatusCode Weekly","url":"http://statuscode.org/","text":"A weekly newsletter focusing on software development, infrastructure, the server, performance, and the stack end of things."}}';
            assert(typeof Ajax.get === "function", "function should exist");
            assert(Ajax.get.length === 2, "function should have 2 parameters");
            const response = await Ajax.get("https://reqres.in/api/users/2", {
                responseType: "json"
            });
            assert(response != null, "response should not be null");
            assert(typeof response === "object", "response should be an object");
            assert(JSON.stringify(response) === expected, "response should match expected value");
        }
    },
    {
        label: "Generated Ajax.getJson",
        run: async function () {
            const expected = '{"data":{"id":2,"email":"janet.weaver@reqres.in","first_name":"Janet","last_name":"Weaver","avatar":"https://s3.amazonaws.com/uifaces/faces/twitter/josephstein/128.jpg"},"ad":{"company":"StatusCode Weekly","url":"http://statuscode.org/","text":"A weekly newsletter focusing on software development, infrastructure, the server, performance, and the stack end of things."}}';
            assert(typeof Ajax.getJson === "function", "function should exist");
            assert(Ajax.getJson.length === 2, "function should have 2 parameters");
            const response = await Ajax.getJson("https://reqres.in/api/users/2");
            assert(response != null, "response should not be null");
            assert(typeof response === "object", "response should be an object");
            assert(JSON.stringify(response) === expected, "response should match expected value");
        }
    },
    {
        label: "Generated Ajax.post",
        run: async function () {
            const expected = '{"token":"QpwL5tke4Pnpja7X4"}';
            assert(typeof Ajax.post === "function", "function should exist");
            assert(Ajax.post.length === 3, "function should have 3 parameters");
            const data = JSON.stringify({
                email: "eve.holt@reqres.in",
                password: "cityslicka"
            });
            const response = await Ajax.post("https://reqres.in/api/login", data, {
                requestType: "json",
                responseType: "json"
            });
            assert(response != null, "response should not be null");
            assert(typeof response === "object", "response should be an object");
            assert(JSON.stringify(response) === expected, "response should match expected value");
        }
    },
    {
        label: "Generated Ajax.postJson",
        run: async function () {
            const expected = '{"token":"QpwL5tke4Pnpja7X4"}';
            assert(typeof Ajax.postJson === "function", "function should exist");
            assert(Ajax.postJson.length === 3, "function should have 3 parameters");
            const data = JSON.stringify({
                email: "eve.holt@reqres.in",
                password: "cityslicka"
            });
            const response = await Ajax.postJson("https://reqres.in/api/login", data, { responseType: "json" });
            assert(response != null, "response should not be null");
            assert(typeof response === "object", "response should be an object");
            assert(JSON.stringify(response) === expected, "response should match expected value");
        }
    },
    {
        label: "Generated functions - bad function name",
        run: async function () {
            assert(Ajax.potato == null, "function should not exist");
            assert(Ajax.postJSON0 == null, "function should not exist");
            assert(Ajax.postJS == null, "function should not exist");
        }
    },

    // Dummy tests
    {
        label: "Should Fail",
        run: function () {
            return new Promise((_, reject) => {
                setTimeout(reject, 3000);
            })        
        }
    },
    {
        label: "Should Pass",
        run: function () {
            return new Promise((resolve) => {
                setTimeout(resolve, 3000)
            })
        }
    },
    {
        label: "Should Stall",
        run: function () {
            return new Promise(() => {})
        }
    }
]

function init() {
    // Set up page
    document.querySelector("main").innerHTML = tests.reduce((acc, curr) => acc + testHtml.replace("%LABEL%", curr.label), "");

    // Run tests
    tests.forEach(runTest);        
}

document.addEventListener("DOMContentLoaded", init);

async function runTest(test, index) {
    const element = document.getElementsByClassName("test")[index];
    const details = element.querySelector(".detail");
    try { 
        element.className = "test running";
        await test.run();
        element.className = "test passed";
        details.textContent = "Test passed";
    } catch (e) {
        element.className = "test failed";
        details.textContent =  e && e.toString();
    }
}

function assert(condition, message, reject) {
    if (!condition) {
        if (typeof reject === "function") {
            reject("Assertion failed: " + message);
        } else {
            throw "Assertion failed: " + message;
        }
    }
}