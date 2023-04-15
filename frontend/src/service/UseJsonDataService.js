import { useState, useEffect } from 'react';

const useJsonData = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('../../../unir.json');
        const jsonData = await response.json();

        const allData = jsonData.reduce((acc, item) => {
          const newItem = {
            ...item,
            time_index: new Date(parseInt(item.time_index))//.toLocaleString(),
          };
          acc.push(newItem);
          return acc;
        }, []);

        allData.sort((a, b) => new Date(a.time_index) - new Date(b.time_index));

        setData(allData);
      } catch (error) {
        console.error('Error fetching JSON data:', error);
      }
    };

    fetchData();
  }, []);

  return data;
};

export default useJsonData;