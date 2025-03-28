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
                        outputs: ["Result"] // Added outputs
                    },
                    "TestUntrustedRoot": {
                        displayName: "Test Untrusted Root",
                        description: "Tests a certificate with an untrusted root",
                        type: "read",
                        outputs: ["Result"] // Added outputs
                    }
                }
            }
        }
    });
};

onexecute = function ({ objectName, methodName }) {
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
    
    xhr.onreadystatechange = function() {
        if (xhr.readyState !== 4) return;
        
        if (xhr.status === 200) {
            postResult({
                "Result": "SUCCESS: Received response from " + url
            });
        } else {
            postResult({
                "Result": "ERROR: Failed to connect to " + url + 
                         " - Status: " + xhr.status + 
                         " - Response: " + xhr.responseText
            });
        }
    };
    
    try {
        xhr.open("GET", url, true); // Changed to asynchronous
        xhr.send();
    } catch (error) {
        postResult({
            "Result": "ERROR: Exception occurred - " + error.message
        });
    }
}
