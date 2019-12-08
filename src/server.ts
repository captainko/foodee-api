// lib
import fs = require('fs');
import https = require('https');
// app
import app from "./app";
import admin from './admin';
import { SERVER_PORT, IS_PROD, WEB_PORT } from "./environment";

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

if (IS_PROD) {
    https.createServer({
        ca: fs.readFileSync('./ca_bundle.crt'),
        key: fs.readFileSync('./private.key'),
        cert: fs.readFileSync('./certificate.crt'),
    }, app).listen(SERVER_PORT);
    console.log(WEB_PORT);
    https.createServer({
        ca: fs.readFileSync('./ca_bundle.crt'),
        key: fs.readFileSync('./private.key'),
        cert: fs.readFileSync('./certificate.crt'),
    }, admin).listen(WEB_PORT);
} else {
    app.listen(SERVER_PORT, () => {
        console.log('Express server listening on port ' + SERVER_PORT);
    });

    admin.listen(WEB_PORT, () => {
        console.log('Express admin listening on port ' + WEB_PORT);
    });
}

// https.createServer({
//     ca: fs.readFileSync('./origin_ca_rsa_root.pem'),
//     key: fs.readFileSync('./key.pem'),
//     cert: fs.readFileSync('./cert.pem'),
// }, app).listen(SERVER_PORT);

// app.listen(SERVER_PORT, () => {
//     console.log('Express server listening on port ' + SERVER_PORT);
// });
// https.createServer({
//     ca: fs.readFileSync('./ca_bundle.crt'),
//     key: fs.readFileSync('./private.key'),
//     cert: fs.readFileSync('./certificate.crt'),

