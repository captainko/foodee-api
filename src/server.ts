// lib
import fs = require('fs');
import https = require('https');
// app
import app from "./app";
import { SERVER_PORT, SSL_PASSPHRASE, IS_PROD } from "./environment";

if (!IS_PROD) {
    process.on("uncaughtException", e => {
        console.log(e);
        process.exit(1);
    });
    
    process.on("unhandledRejection", e => {
        console.log(e);
        process.exit(1);
    });
}

https.createServer({
    key: fs.readFileSync('./key.pem'),
    cert: fs.readFileSync('./cert.pem'),
    passphrase: SSL_PASSPHRASE,
}, app).listen(SERVER_PORT);

// app.listen(PORT, () => {
//     console.log('Express server listening on port ' + PORT);
// });
