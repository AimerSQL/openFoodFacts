const nodosController = {};
const axios = require('axios');


const nodosModel = require('../models/nodosModel')

nodosController.getNodos = async (req, res) => {
    try {

        const nodos = await nodosModel.find()

      const filteredNodos = nodos.map((nodo) => ({
        entity_id: nodo.entity_id,
        time_index: nodo.time_index,
        tvoc: nodo.tvoc,
        eco2: nodo.eco2,
        humedad: nodo.humedad,
      }));

      res.json(filteredNodos);

    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "error get" });
    }
  };

module.exports = nodosController;