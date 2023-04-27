import React from 'react';
import { useLocation } from 'react-router-dom';
import Products from './Products';

const FilteredProducts = () => {
    const location = useLocation();
    const data = location.state;
    
    return (
        <>
            <Products productos={data.products} />
        </>
    );
};

export default FilteredProducts;
