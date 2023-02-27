const admin = require("firebase-admin");

const serviceAccount = require("../serviceKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: serviceAccount.storagebucket
});


module.exports = admin;