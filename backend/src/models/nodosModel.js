const { Schema, model,} = require('mongoose');

const nodosSchema = new Schema({
   
    entity_id: { type: String },
    time_index: { type: Number },
    tvoc: { type: Number },
    eco2: { type: Number },
    humedad: { type: Number },
    temperatura: { type: Number },

}, {
    collection: 'nodo1'
}, {
    timestamps: true
});

module.exports = model('nodosModel', nodosSchema);