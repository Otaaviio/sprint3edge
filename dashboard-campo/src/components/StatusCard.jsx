import React from 'react';

function StatusCard({ label, value, unit, status }) {
  
  // Define a cor do status
  const getStatusColor = (status) => {
    if (status === 'Alta') return 'text-red-500';
    if (status === 'Baixa') return 'text-blue-500';
    return 'text-green-500'; // Normal
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
      <div className="text-gray-400 text-sm font-medium uppercase">{label}</div>
      <div className="text-4xl font-bold mt-2">
        {value} <span className="text-2xl text-gray-300">{unit}</span>
      </div>
      <div className={`text-lg font-semibold mt-2 ${getStatusColor(status)}`}>
        Status: {status}
      </div>
    </div>
  );
}

export default StatusCard;