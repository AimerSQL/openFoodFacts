const nodosController = {};


const nodosModel = require('../models/nodosModel')

nodosController.getNodos = async (req, res) => {
  try {
    const { start, end } = req.body;
    const nodos = await nodosModel.find(
      {
        time_index: {
          $gte: new Date(parseInt(start)),  
          $lte: new Date(parseInt(end)),  
        }
      }
    )


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
        tvoc: Math.round(sumNodos.tvoc / nodosArray.length),
        eco2: Math.round(sumNodos.eco2 / nodosArray.length),
        humedad: Math.round(sumNodos.humedad / nodosArray.length),
        temperatura: Math.round(sumNodos.temperatura / nodosArray.length),
      };

      return averageNodo;
    });

    const maxMinNodos = Object.values(groupedNodos).map((nodosArray) => {
      const maxNodo = {
        entity_id: nodosArray[0].entity_id,
        time_index: nodosArray[0].time_index,
        tvoc: Math.max(...nodosArray.map(nodo => nodo.tvoc)),
        eco2: Math.max(...nodosArray.map(nodo => nodo.eco2)),
        humedad: Math.max(...nodosArray.map(nodo => nodo.humedad)),
        temperatura: Math.max(...nodosArray.map(nodo => nodo.temperatura)),
      };
    
      const minNodo = {
        entity_id: nodosArray[0].entity_id,
        time_index: nodosArray[0].time_index,
        tvoc: Math.min(...nodosArray.map(nodo => nodo.tvoc)),
        eco2: Math.min(...nodosArray.map(nodo => nodo.eco2)),
        humedad: Math.min(...nodosArray.map(nodo => nodo.humedad)),
        temperatura: Math.min(...nodosArray.map(nodo => nodo.temperatura)),
      };
    
      return { maxNodo, minNodo };
    });

res.json({
  avg: averagedNodos,
  nodos: groupedNodos,
  maxMin: maxMinNodos
});


  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "error get" });
  }
};

module.exports = nodosController;

