// lib
import fs = require('fs');
import https = require('https');
// app
import app from "./app";
import admin from './admin';
import { SERVER_PORT, SSL_PASSPHRASE, IS_PROD, WEB_PORT } from "./environment";

// if (!IS_PROD) {
//     process.on("uncaughtException", e => {
//         console.log(e);
//         process.exit(1);
//     });
    
//     process.on("unhandledRejection", e => {
//         console.log(e);
//         process.exit(1);
//     });
// }

https.createServer({
    ca: fs.readFileSync('./ca_bundle.crt'),
    key: fs.readFileSync('./private.key'),
    cert: fs.readFileSync('./certificate.crt'),
    passphrase: SSL_PASSPHRASE,
}, app).listen(SERVER_PORT);

// app.listen(SERVER_PORT, () => {
//     console.log('Express server listening on port ' + SERVER_PORT);
// });
https.createServer({
    ca: fs.readFileSync('./ca_bundle.crt'),
    key: fs.readFileSync('./private.key'),
    cert: fs.readFileSync('./certificate.crt'),
    passphrase: SSL_PASSPHRASE,
}, admin).listen(WEB_PORT);
