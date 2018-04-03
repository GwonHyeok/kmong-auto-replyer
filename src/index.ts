import Application from "./app";

const app = new Application();
app.start()
    .then(_ => console.log('exit with 0;'))
    .catch(error => {
        console.error(`exit with error : ${error.message}`);
        console.error(error)
    });
