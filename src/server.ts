import app from "./app";
import { PORT } from "./environment";


app.listen(PORT, () => {
    console.log('Express server listening on port ' + PORT);
});
