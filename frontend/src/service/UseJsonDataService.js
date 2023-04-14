import { useState, useEffect } from 'react';

const useJsonData = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('../../../1.json');
        const jsonData = await response.json();
        

        const labels = jsonData.map((item) => new Date(parseInt(item.time_index)).toLocaleString());
        const valuesHumedad = jsonData.map((item) => parseFloat(item.humedad));
        const valuesTemperatura = jsonData.map((item) => parseFloat(item.temperatura));

        setTimeout(() => {
            setData({ labels, valuesHumedad, valuesTemperatura });
          }, 666);
      } catch (error) {
        console.error('Error fetching JSON data:', error);
      }
    };

    fetchData();
  }, []);

  return data;
};

export default useJsonData;