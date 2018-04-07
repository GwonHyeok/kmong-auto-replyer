import Application from "./app";
import Log from "./util/Log";

const app = new Application();
app.start()
    .then(_ => Log.d('exit with 0;'))
    .catch(error => {
        Log.e(error.message);
        console.error(error)
    });
