
import React from 'react';
import { Language } from '../types';
import { I18N } from '../constants';

interface NavbarProps {
  onNavigate: (page: string) => void;
  currentPage: string;
  lang: Language;
  setLang: (lang: Language) => void;
  isLoggedIn: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ onNavigate, currentPage, lang, setLang, isLoggedIn }) => {
  const t = (key: string) => I18N[key]?.[lang] || key;

  return (
    <nav className="fixed top-0 left-0 right-0 z-[100] bg-black/80 backdrop-blur-xl border-b border-yellow-500/10 px-6 py-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div 
          className="cursor-pointer group flex items-center gap-2"
          onClick={() => onNavigate('home')}
        >
          <div className="w-8 h-8 rounded-full border border-yellow-600 bg-yellow-600/5 flex items-center justify-center text-yellow-500 font-bold font-cinzel text-sm group-hover:bg-yellow-600 group-hover:text-black transition-all">
            S
          </div>
          <h1 className="text-xl font-cinzel font-bold gold-gradient tracking-[0.3em]">SUBREAL</h1>
        </div>
        
        {isLoggedIn && (
          <div className="hidden lg:flex gap-8 text-[9px] font-bold tracking-[0.2em] uppercase text-gray-500">
            <button 
              onClick={() => onNavigate('categories')} 
              className={`hover:text-yellow-500 transition-colors flex items-center gap-1 ${currentPage === 'categories' ? 'text-yellow-500' : ''}`}
            >
              {t('nav_categories')} <span className="text-[8px] opacity-30">▼</span>
            </button>
            <button onClick={() => onNavigate('subastas')} className={`hover:text-yellow-500 transition-colors ${currentPage === 'subastas' ? 'text-yellow-500' : ''}`}>{t('nav_auctions')}</button>
            <button onClick={() => onNavigate('arquitectos')} className={`hover:text-yellow-500 transition-colors ${currentPage === 'arquitectos' ? 'text-yellow-500' : ''}`}>{t('nav_creators')}</button>
            <button onClick={() => onNavigate('creator_services')} className={`hover:text-yellow-500 transition-colors ${currentPage === 'creator_services' ? 'text-yellow-500' : ''}`}>Servicios</button>
            <button onClick={() => onNavigate('mensajes')} className={`hover:text-yellow-500 transition-colors ${currentPage === 'mensajes' ? 'text-yellow-500' : ''}`}>{t('nav_messages')}</button>
          </div>
        )}

        <div className="flex items-center gap-4">
          <button 
            onClick={() => setLang(lang === 'es' ? 'en' : 'es')}
            className="text-[8px] font-bold text-yellow-600 border border-yellow-600/20 px-2 py-1 rounded hover:bg-yellow-600/10 transition-all uppercase"
          >
            {lang}
          </button>
          
          <button 
            onClick={() => onNavigate('perfil')}
            className={`text-[9px] uppercase tracking-[0.2em] font-bold px-6 py-2 border transition-all ${isLoggedIn ? 'text-yellow-500 border-yellow-500/30 bg-yellow-600/5' : 'bg-yellow-600 text-black border-yellow-600'}`}
          >
            {isLoggedIn ? t('nav_profile') : (lang === 'es' ? 'Entrar' : 'Login')}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
