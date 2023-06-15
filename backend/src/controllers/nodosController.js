const nodosController = {};
const axios = require('axios');


const nodosModel = require('../models/nodosModel')

nodosController.getNodos = async (req, res) => {
  try {
    const { start, end } = req.body;
    const nodos = await nodosModel.find(
      {
        time_index: {
          $gte: new Date(parseInt(start)),  // 大于或等于开始日期
          $lte: new Date(parseInt(end)),  // 小于或等于结束日期 
        }
      }
    )

/*     const filteredNodos = nodos.map((nodo) => ({
      entity_id: nodo.entity_id,
      time_index: nodo.time_index,
      tvoc: nodo.tvoc,
      eco2: nodo.eco2,
      humedad: nodo.humedad,
      temperatura: nodo.temperatura
    }));

    res.json(filteredNodos); */

    const groupedNodos = nodos.reduce((result, nodo) => {
      if (!result[nodo.entity_id]) {
        result[nodo.entity_id] = [];
      }
      result[nodo.entity_id].push({
        entity_id: nodo.entity_id,
        time_index: nodo.time_index,
        tvoc: nodo.tvoc,
        eco2: nodo.eco2,
        humedad: nodo.humedad,
        temperatura: nodo.temperatura
      });
      return result;
    }, {});

    res.json({
        nodo1: groupedNodos.nodo1,
        nodo2: groupedNodos.nodo2,
        nodo3: groupedNodos.nodo3,
      });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "error get" });
  }
};

module.exports = nodosController;