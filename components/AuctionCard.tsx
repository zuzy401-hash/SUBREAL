
import React, { useState, useEffect } from 'react';
import { AuctionItem } from '../types';
import { PRICING_TABLE } from '../constants';

interface AuctionCardProps {
  item: AuctionItem;
  onViewDetails: (item: AuctionItem) => void;
}

const AuctionCard: React.FC<AuctionCardProps> = ({ item, onViewDetails }) => {
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    const timer = setInterval(() => {
      const diff = new Date(item.endsAt).getTime() - Date.now();
      if (diff <= 0) {
        setTimeLeft('Finalizada');
        clearInterval(timer);
      } else {
        const h = Math.floor(diff / (1000 * 60 * 60));
        const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const s = Math.floor((diff % (1000 * 60)) / 1000);
        setTimeLeft(`${h}h ${m}m ${s}s`);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [item.endsAt]);

  return (
    <div className="group relative bg-[#111] border border-white/5 overflow-hidden transition-all hover:border-yellow-600/50 hover:shadow-[0_0_20px_rgba(191,149,63,0.1)]">
      <div className="aspect-[4/3] overflow-hidden relative">
        <img 
          src={item.imageUrl} 
          alt={item.title} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 grayscale group-hover:grayscale-0"
        />
        <div className="absolute top-4 left-4 flex flex-col gap-2">
           {item.isMidnightDrop && (
             <div className="bg-black/70 border border-yellow-500/50 px-3 py-1 text-[10px] uppercase tracking-tighter text-yellow-500 backdrop-blur-sm">
               Midnight Drop
             </div>
           )}
           <div className="bg-yellow-600 text-black px-3 py-1 text-[8px] font-bold uppercase tracking-widest shadow-xl">
             {item.category.replace('_', ' ')}
           </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
          <p className="text-yellow-500 text-[10px] font-cinzel font-bold tracking-widest">{timeLeft}</p>
        </div>
      </div>
      
      <div className="p-5">
        <h3 className="text-xl font-cinzel font-bold mb-2 group-hover:text-yellow-500 transition-colors uppercase tracking-widest">{item.title}</h3>
        <p className="text-gray-400 text-xs line-clamp-2 mb-6 leading-relaxed italic">"{item.description}"</p>
        
        <div className="flex justify-between items-end pt-4 border-t border-white/5">
          <div>
            <p className="text-[9px] text-gray-600 uppercase tracking-widest mb-1">Última Puja</p>
            <p className="text-xl font-bold text-white font-cinzel">${item.currentBid}</p>
          </div>
          <button 
            onClick={() => onViewDetails(item)}
            className="px-6 py-2 border border-yellow-600/30 text-[9px] uppercase tracking-widest text-yellow-500 hover:bg-yellow-600 hover:text-black transition-all font-bold"
          >
            Explorar
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuctionCard;
