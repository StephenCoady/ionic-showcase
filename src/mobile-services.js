let config = {
  "version": 1,
  "namespace": "voyager",
  "clientId": "voyager-ionic-example",
  "services": [
    {
      "id": "push",
      "name": "push",
      "type": "push",
      "url": "https://ups-collab-project.comm2.skunkhenry.com",
      "config": {
        "android": {
          "senderID": "881192658444",
          "variantId": "5639ab9c-bfa6-4e92-a2eb-0a4d5d17ff2e",
          "variantSecret": "ab5c9ec5-7a80-4865-b5bd-5804653cfb3a"
        }
      }
    }, {
      "id": "3a3e7a81-262a-11e9-bd5f-0af08791569c",
      "name": "keycloak-78b594",
      "type": "keycloak",
      "url": "https://keycloak-route-test.comm2.skunkhenry.com/auth",
      "config": {
        "realm": "test",
        "auth-server-url": "https://keycloak-route-test.comm2.skunkhenry.com/auth",
        "ssl-required": "external",
        "resource": "test-client",
        "public-client": true,
        "confidential-port": 0
      }
    }
  ]
};

module.exports = config;