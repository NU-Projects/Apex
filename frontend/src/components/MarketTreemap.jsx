import React, { useMemo } from 'react';

const MarketTreemap = ({ data, onRoleClick, selectedRole, label = "Role" }) => {
  // Sort roles by count descending
  const sortedData = useMemo(() => {
    return Object.entries(data)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
  }, [data]);

  const total = useMemo(() => sortedData.reduce((sum, item) => sum + item.count, 0), [sortedData]);

  const getIntensity = (count) => {
    if (count > 100) return 'bg-brand-600';
    if (count > 50) return 'bg-brand-500';
    if (count > 20) return 'bg-brand-400';
    if (count > 10) return 'bg-brand-300';
    if (count > 0) return 'bg-brand-200';
    return 'bg-surface';
  };

  return (
    <div className="w-full h-[500px] flex flex-wrap content-start gap-1 p-2 bg-white/50 backdrop-blur-sm rounded-[32px] overflow-hidden border border-border-light shadow-2xl">
      {sortedData.length === 0 ? (
        <div className="flex items-center justify-center w-full h-full text-text-muted font-bold tracking-widest uppercase">
          Waiting for live data...
        </div>
      ) : sortedData.map((item) => {
        const percentage = total > 0 ? (item.count / total) * 100 : 0;
        const flexBasis = Math.max(12, percentage * 2.5); 
        
        return (
          <button
            key={item.name}
            onClick={() => onRoleClick(item.name)}
            style={{ 
              flex: `${flexBasis} 1 0%`,
              minWidth: '140px',
              height: percentage > 15 ? '320px' : percentage > 8 ? '210px' : '160px'
            }}
            className={`relative group p-6 transition-all duration-700 overflow-hidden rounded-[24px] border-2 flex flex-col justify-between
              ${selectedRole === item.name ? 'border-brand-500 z-10 scale-[1.02] shadow-2xl' : 'border-transparent hover:scale-[0.99]'}
              ${getIntensity(item.count)}
            `}
          >
            {/* Glossy Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-60 pointer-events-none" />
            
            <div className="relative z-10">
              <p className={`text-[10px] font-black uppercase tracking-[0.2em] leading-none mb-2 ${item.count > 20 ? 'text-white' : 'text-brand-900 opacity-60'}`}>
                {item.name}
              </p>
              <p className={`text-4xl font-black tracking-tighter ${item.count > 20 ? 'text-white' : 'text-brand-900'}`}>
                {item.count}
              </p>
            </div>

            <div className="relative z-10 flex items-center justify-between">
              <span className={`text-[10px] font-black uppercase tracking-wider px-3 py-1.5 rounded-xl ${item.count > 20 ? 'bg-white/20 text-white' : 'bg-brand-900/10 text-brand-900'}`}>
                {((item.count / total) * 100).toFixed(0)}% Share
              </span>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-transform group-hover:rotate-45 ${item.count > 20 ? 'bg-white/20 text-white' : 'bg-brand-900/10 text-brand-900'}`}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
              </div>
            </div>

            {/* Subtle Grid Pattern */}
            <div className="absolute inset-0 opacity-[0.05] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)', backgroundSize: '16px 16px' }} />
          </button>
        );
      })}
    </div>
  );
};

export default MarketTreemap;
