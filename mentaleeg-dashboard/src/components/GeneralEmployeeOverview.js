import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

const data = {
  labels: ['Level 1', 'Level 2', 'Level 3', 'Level 4', 'Level 5'],
  datasets: [
    {
      data: [19, 9, 36, 24, 13],
      backgroundColor: ['#FFA07A', '#FFD700', '#98FB98', '#87CEFA', '#DDA0DD'],
    },
  ],
};

const options = {
  plugins: {
    legend: {
      display: false,
    },
  },
  cutout: '70%',
};

const GeneralEmployeeOverview = () => {
  return (
    <div>
      <div className="mb-4" style={{ height: '200px' }}>
        <Doughnut data={data} options={options} />
      </div>
      <div className="flex justify-between">
        {data.labels.map((label, index) => (
          <div key={label} className="text-center">
            <div className="w-4 h-4 mx-auto mb-1" style={{ backgroundColor: data.datasets[0].backgroundColor[index] }}></div>
            <p className="text-sm font-medium">{label}</p>
            <p className="text-sm text-gray-500">{data.datasets[0].data[index]}%</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GeneralEmployeeOverview;