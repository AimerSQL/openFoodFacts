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

    /*const filteredNodos = nodos.map((nodo) => ({
      entity_id: nodo.entity_id,
      time_index: nodo.time_index,
      tvoc: nodo.tvoc,
      eco2: nodo.eco2,
      humedad: nodo.humedad,
      temperatura: nodo.temperatura
    }));*/


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

    const averagedNodos = Object.values(groupedNodos).map((nodosArray) => {
      const sumNodos = nodosArray.reduce(
        (sum, nodo) => {
          sum.tvoc += nodo.tvoc;
          sum.eco2 += nodo.eco2;
          sum.humedad += nodo.humedad;
          sum.temperatura += nodo.temperatura;
          return sum;
        },
        {
          tvoc: 0,
          eco2: 0,
          humedad: 0,
          temperatura: 0,
        }
      );

      const averageNodo = {
        entity_id: nodosArray[0].entity_id,
        time_index: nodosArray[0].time_index,
        tvoc: sumNodos.tvoc / nodosArray.length,
        eco2: sumNodos.eco2 / nodosArray.length,
        humedad: sumNodos.humedad / nodosArray.length,
        temperatura: sumNodos.temperatura / nodosArray.length,
      };

      return averageNodo;
    });

res.json({
  avg: averagedNodos,
  nodos: groupedNodos
});


  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "error get" });
  }
};

module.exports = nodosController;

/*const nodosController = {};
const axios = require('axios');
const nodosModel = require('../models/nodosModel');

nodosController.getNodos = async (req, res) => {
  try {
    const { start, end } = req.body;
    // Perform aggregation to get statistical data
    const nodos = await nodosModel.aggregate([
      {
        $match: {
          time_index: {
            $gte: parseInt(start),  // greater than or equal to the start date
            $lte: parseInt(end),  // less than or equal to the end date 
          }
        }
      },
      {
        $group: {
          _id: '$entity_type',
          eco: {
            $sum: '$eco2'
          },
          humedad: {
            $sum: '$humedad'
          },
          count: {
            $sum: 1
          }
        }
      }
    ]);
    

    res.json(nodos);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = nodosController;*/
