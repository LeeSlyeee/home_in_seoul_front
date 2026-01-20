import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, CartesianGrid } from 'recharts';
import { X } from 'lucide-react';
import './DetailModal.css';

const DetailModal = ({ item, onClose }) => {
  if (!item) return null;

  // Use chart data from item if available, otherwise fallback (or empty)
  const chartData = item.chartData || [
     { name: '버스 정류장', value: 0, color: '#FF8A80' },
     { name: '병원', value: 0, color: '#69F0AE' },
     { name: '공원', value: 0, color: '#FF80AB' },
     { name: '지하철 역', value: 0, color: '#82B1FF' },
     { name: '학교', value: 0, color: '#FF8A80' },
  ];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
         <div className="modal-header">
             <div>
                <h2>{item.district} {item.neighborhood}</h2>
                {item.formattedPrice && <span style={{fontSize: '1rem', color: '#555', fontWeight: '500'}}>평균 시세: {item.formattedPrice}</span>}
             </div>
             <button className="close-btn" onClick={onClose}>
                <X size={24} color="#333" />
             </button>
         </div>
         <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height={350}>
                <BarChart data={chartData} margin={{top: 20, right: 20, left: 0, bottom: 20}}>
                    <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#eee" />
                    <XAxis 
                        dataKey="name" 
                        tick={{fontSize: 12, fill: '#666'}} 
                        axisLine={false}
                        tickLine={false}
                        dy={10}
                    />
                    <YAxis 
                        axisLine={false}
                        tickLine={false}
                        tick={{fontSize: 12, fill: '#999'}}
                    />
                    <Tooltip 
                        cursor={{fill: 'transparent'}}
                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                    />
                    <Bar dataKey="value" barSize={30} radius={[4, 4, 0, 0]}>
                       {chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                       ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
         </div>
      </div>
    </div>
  );
};

export default DetailModal;
