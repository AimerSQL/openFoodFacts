/* const nodosController = {};
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

     const filteredNodos = nodos.map((nodo) => ({
      entity_id: nodo.entity_id,
      time_index: nodo.time_index,
      tvoc: nodo.tvoc,
      eco2: nodo.eco2,
      humedad: nodo.humedad,
      temperatura: nodo.temperatura
    }));

    res.json(filteredNodos); 

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

    res.json(groupedNodos);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "error get" });
  }
};

module.exports = nodosController; */
const nodosController = {};
const axios = require('axios');
const nodosModel = require('../models/nodosModel')

nodosController.getNodos = async (req, res) => {
  try {
    const { start, end } = req.body;

    // Perform aggregation to get statistical data
    const nodos = await nodosModel.aggregate([
      {
        $match: {
          time_index: {
            $gte: new Date(parseInt(start)),  // greater than or equal to the start date
            $lte: new Date(parseInt(end)),  // less than or equal to the end date 
          }
        }
      },
      {
        $group: {
          _id: '$entity_id',
          count: { $sum: 1 },
          avgHumedad: { $avg: '$humedad' },
          maxHumedad: { $max: '$humedad' },
          minHumedad: { $min: '$humedad' },
        }
      }
    ]);

    // Perform a separate query to get the data
    const nodosData = await nodosModel.find({
      time_index: {
        $gte: new Date(parseInt(start)),  // greater than or equal to the start date
        $lte: new Date(parseInt(end)),  // less than or equal to the end date 
      }
    }).select('entity_id time_index tvoc eco2 humedad temperatura');

    // Add the data to the corresponding nodo
    const result = nodos.map(nodo => {
      nodo.data = nodosData.filter(data => data.entity_id.toString() === nodo._id.toString());
      return nodo;
    });

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = nodosController;