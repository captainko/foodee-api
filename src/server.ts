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

// https.createServer({
//     key: fs.readFileSync('./key.pem'),
//     cert: fs.readFileSync('./cert.pem'),
//     passphrase: SSL_PASSPHRASE,
// }, app).listen(SERVER_PORT);

app.listen(SERVER_PORT, () => {
    console.log('Express server listening on port ' + SERVER_PORT);
});

// https.createServer({
//     key: fs.readFileSync('./key.pem'),
//     cert: fs.readFileSync('./cert.pem'),
//     passphrase: SSL_PASSPHRASE,
// }, admin).listen(WEB_PORT);
