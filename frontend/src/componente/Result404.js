import React from 'react';
import { Result } from 'antd';


const Result404 = ({ subTitle }) => {
    return (
        <Result
          status="404"
          title="404"
          subTitle={subTitle}
        />
      );
}

export default Result404;