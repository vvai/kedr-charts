import React, { useRef, useEffect } from 'react';
import { Chart } from '@antv/g2';

export const BasicChart = ({ data }) => {
    const elementRef = useRef() ;

    useEffect(() => {
        const chart = new Chart({
          container: elementRef.current,
          width: 600,
          height: 300,
        });
        chart.data(data)
        chart.interval().position('genre*sold');
        chart.render();
    }, []);

    return <div ref={elementRef}></div>
}
