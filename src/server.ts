import app from "./app";
import { PORT } from "./environment";

process.on("uncaughtException", e => {
    console.log(e);
    process.exit(1);
});

process.on("unhandledRejection", e => {
    console.log(e);
    process.exit(1);
});


app.listen(PORT, () => {
    console.log('Express server listening on port ' + PORT);
});
