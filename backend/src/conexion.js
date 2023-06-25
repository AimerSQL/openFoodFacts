

const mongoose = require('mongoose');


mongoose.connect('mongodb://127.0.0.1:27017/openFood', {
    useNewUrlParser: true
}).catch(err => console.log('error', err));

const conn = mongoose.connection;
conn.once('open', () => {
    console.log("conectado a bd con exito");
});

