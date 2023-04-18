const app = require('./app');
require('./conexion');

async function main() {
    await app.listen(4000);
    console.log("Server is running on port " + 4000);
}

main();