metadata = {
    "systemName": "CertificateTest",
    "displayName": "Certificate Test Service",
    "description": "Tests expired certificates using badssl.com"
};

ondescribe = function () {
    postSchema({
        objects: {
            "CertTest": {
                displayName: "Certificate Test",
                description: "Tests various certificate issues",
                properties: {
                    "Result": {
                        displayName: "Result",
                        description: "Result of the request",
                        type: "string"
                    }
                },
                methods: {
                    "TestExpiredCert": {
                        displayName: "Test Expired Certificate",
                        description: "Tests an expired SSL certificate",
                        type: "read",
                        parameters: {}
                    },
                    "TestUntrustedRoot": {
                        displayName: "Test Untrusted Root",
                        description: "Tests a certificate with an untrusted root",
                        type: "read",
                        parameters: {}
                    }
                }
            }
        }
    });
};

onexecute = function ({ objectName, methodName, parameters, properties }) {
    switch (objectName) {
        case "CertTest":
            switch (methodName) {
                case "TestExpiredCert":
                    testCertificate("https://expired.badssl.com/");
                    break;

                case "TestUntrustedRoot":
                    testCertificate("https://untrusted-root.badssl.com/");
                    break;

                default:
                    throw new Error("Method not found: " + methodName);
            }
            break;

        default:
            throw new Error("Object not found: " + objectName);
    }
};

function testCertificate(url) {
    var xhr = new XMLHttpRequest();
    try {
        xhr.open("GET", url, false);
        xhr.send();

        postResult({
            "Result": "SUCCESS: Successfully connected to " + url
        });
    } catch (error) {
        postResult({
            "Result": "ERROR: Failed to connect to " + url + " - " + error.message
        });
    }
}
