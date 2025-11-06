import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

function SensorChart({ data }) {
  if (!data || data.length === 0) {
    return <div className="text-center text-gray-400 h-80 flex items-center justify-center">Aguardando dados...</div>;
  }

  return (
    // ResponsiveContainer é a chave para o gráfico se adaptar ao tamanho do pai
    <ResponsiveContainer width="100%" height={400}>
      <LineChart
        data={data}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#4a5568" />
        <XAxis dataKey="timestamp" stroke="#e2e8f0" />
        
        {/* Eixo Y da esquerda (Temp & Umidade) */}
        <YAxis yAxisId="left" stroke="#e2e8f0" />
        
        {/* Eixo Y da direita (Luminosidade, pois a escala é diferente) */}
        <YAxis yAxisId="right" orientation="right" stroke="#e2e8f0" />

        <Tooltip 
          contentStyle={{ backgroundColor: '#2d3748', border: 'none', borderRadius: '8px' }} 
          labelStyle={{ color: '#e2e8f0' }} 
        />
        <Legend wrapperStyle={{ color: '#e2e8f0' }} />
        
        <Line yAxisId="left" type="monotone" dataKey="temperatura" stroke="#f56565" activeDot={{ r: 6 }} />
        <Line yAxisId="left" type="monotone" dataKey="umidade" stroke="#4299e1" activeDot={{ r: 6 }} />
        <Line yAxisId="right" type="monotone" dataKey="luminosidade" stroke="#faf089" activeDot={{ r: 6 }} />
      </LineChart>
    </ResponsiveContainer>
  );
}

export default SensorChart;